import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

// In-memory rate limiting store (Note: This resets on server restart)
// For production, consider using Redis or database storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

function getClientIp(request: Request): string {
    // Try to get real IP from Cloudflare headers first
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    if (cfConnectingIp) return cfConnectingIp;
    
    // Fallback to other headers
    const xForwardedFor = request.headers.get("x-forwarded-for");
    if (xForwardedFor) return xForwardedFor.split(",")[0].trim();
    
    // Final fallback
    return "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
    const now = Date.now();
    const record = rateLimitStore.get(ip);
    
    if (!record || now > record.resetTime) {
        // Reset or create new record
        rateLimitStore.set(ip, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        });
        return { allowed: true };
    }
    
    if (record.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((record.resetTime - now) / 1000);
        return {
            allowed: false,
            message: `Terlalu banyak percobaan login. Tunggu ${remainingTime} detik.`
        };
    }
    
    // Increment counter
    record.count++;
    return { allowed: true };
}

export const POST: APIRoute = async ({ request, redirect }) => {
    // Check rate limit first
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
        return new Response(rateLimitResult.message, { status: 429 });
    }

    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
    }

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return new Response("Supabase environment variables missing.", { status: 500 });
    }



    // We need to capture the cookies set by Supabase and attach them to the response.
    // The `setAll` callback above is tricky with Astro's `redirect` because `redirect` returns a Response object immediately.
    // Standard pattern for Astro + Supabase SSR involves using `context.cookies` or constructing the response manually.
    // Let's retry the `createServerClient` setup to properly use Astro's `cookies` object if possible, 
    // OR collect headers and return a response with them.

    const headers = new Headers();

    const supabaseClient = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return parseCookieHeader(request.headers.get('Cookie') ?? '').map((cookie) => ({
                    name: cookie.name,
                    value: cookie.value ?? '',
                }));
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    headers.append(
                        'Set-Cookie',
                        `${name}=${value}; Path=${options.path}${options.maxAge ? `; Max-Age=${options.maxAge}` : ''}${options.httpOnly ? '; HttpOnly' : ''}${options.secure ? '; Secure' : ''}${options.sameSite ? `; SameSite=${options.sameSite}` : ''}`
                    );
                });
            },
        },
    });

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(error.message, { status: 401 });
    }

    // Handle successful login
    // We cannot use `redirect('/admin')` directly because we need to attach headers.
    // Astro's `redirect` returns a Response object, we can clone it or create a new one.

    headers.set("Location", "/admin");
    return new Response(null, {
        status: 302, // or 303
        headers,
    });
};
