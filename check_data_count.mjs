
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'api' }
});

const publicSupabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'public' }
});

async function checkData() {
    console.log("Checking data counts...");

    // Check API schema
    const { count: apiCount, error: apiError } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    if (apiError) console.error("Error checking api.registrations:", apiError.message);
    else console.log(`Rows in 'api.registrations': ${apiCount}`);

    // Check Public schema
    const { count: publicCount, error: publicError } = await publicSupabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    if (publicError) console.error("Error checking public.registrations:", publicError.message);
    else console.log(`Rows in 'public.registrations': ${publicCount}`);

    // Check recent data if any
    if (apiCount > 0) {
        const { data } = await supabase.from('registrations').select('id, reg_number, status').limit(3);
        console.log("Sample data (api):", data);
    }
}

checkData();
