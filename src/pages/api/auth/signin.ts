import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, redirect }) => {
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
