import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const GET: APIRoute = async ({ request, redirect }) => {
    return handleSignOut({ request, redirect });
};

export const POST: APIRoute = async ({ request, redirect }) => {
    return handleSignOut({ request, redirect });
}

async function handleSignOut({ request }: { request: Request; redirect: any }) {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return new Response("Supabase environment variables missing.", { status: 500 });
    }

    const headers = new Headers();

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

    await supabase.auth.signOut();

    headers.set("Location", "/admin/login");
    return new Response(null, {
        status: 302,
        headers
    });
}
