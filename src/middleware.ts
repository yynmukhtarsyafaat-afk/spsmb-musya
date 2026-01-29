import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async ({ request, locals, redirect, cookies }, next) => {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables (PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY) are missing.');
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(request.headers.get('Cookie') ?? '').map((cookie) => ({
                        name: cookie.name,
                        value: cookie.value ?? '',
                    }));
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Important: Refresh the session if needed (this updates the cookie)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    locals.user = user;

    // Protected Routes Logic
    const url = new URL(request.url);

    // Protect /admin routes, excluding login and api routes
    if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
        if (!user) {
            return redirect('/admin/login');
        }

        const allowedEmails = ["admin@spsmb.yppms.id"];
        if (user.email && !allowedEmails.includes(user.email)) {
            return redirect('/admin/login?error=unauthorized');
        }
    }

    return next();
};
