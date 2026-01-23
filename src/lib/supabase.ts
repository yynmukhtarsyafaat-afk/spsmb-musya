import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase client instance (lazy initialization)
 * This prevents crashes during SSR/build if env vars are not yet available
 */
export function getSupabase(): SupabaseClient {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Supabase environment variables. Please set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.'
        );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

/**
 * Get Supabase Admin client instance (bypasses RLS)
 * ONLY usage in server-side API routes. NEVER expose to client.
 */
export function getSupabaseAdmin(): SupabaseClient {
    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error(
            'Missing Supabase Service Key. Please set SUPABASE_SERVICE_ROLE_KEY.'
        );
    }

    return createClient(supabaseUrl, supabaseServiceKey);
}

// For backward compatibility - but prefer using getSupabase() instead
export const supabase = typeof window !== 'undefined' || import.meta.env.PUBLIC_SUPABASE_URL
    ? (() => {
        try {
            return getSupabase();
        } catch {
            // Return a dummy object during build if env vars are missing
            return null as unknown as SupabaseClient;
        }
    })()
    : null as unknown as SupabaseClient;
