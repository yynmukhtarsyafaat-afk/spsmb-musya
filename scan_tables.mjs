
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo'; // Service Role Key

// We can't easily query pg_catalog via JS client without a stored procedure, 
// BUT we can try to simply select from likely tables to see which exist.

const supabase = createClient(supabaseUrl, supabaseKey);

async function scanTables() {
    console.log("=== SCANNING TABLES ===");

    const tablesToCheck = [
        { schema: 'public', table: 'registrations' },
        { schema: 'public', table: 'registrations_backup' },
        { schema: 'api', table: 'registrations' },
    ];

    for (const t of tablesToCheck) {
        // We use a different client for schema selection
        const client = createClient(supabaseUrl, supabaseKey, { db: { schema: t.schema } });

        const { count, error } = await client
            .from(t.table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`[${t.schema}.${t.table}] ❌ Missing or RLS Error: ${error.message}`);
            // Special check: typically code '42P01' means undefined_table
            if (error.code === '42P01') {
                console.log(`   -> CONFIRMED: Table '${t.table}' does NOT exist in schema '${t.schema}'`);
            }
        } else {
            console.log(`[${t.schema}.${t.table}] ✅ EXISTS. Count: ${count}`);
        }
    }
    console.log("=======================");
}

scanTables();
