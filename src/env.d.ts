/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare namespace App {
    interface Locals {
        email: string;
        user: import('@supabase/supabase-js').User | null;
        session: import('@supabase/supabase-js').Session | null;
    }
}
