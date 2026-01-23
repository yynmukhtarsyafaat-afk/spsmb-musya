
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
    console.log('Listing tables in public and api schemas...');

    const tablesToCheck = [
        'public.registrations',
        'public.registrations_backup',
        'api.registrations',
        'registrations' // implicit schema (usually public)
    ];

    for (const table of tablesToCheck) {
        try {
            console.log(`\nChecking table: ${table}`);
            let schema = 'public';
            let tableName = table;
            if (table.includes('.')) {
                [schema, tableName] = table.split('.');
            }

            let clientToUse;
            if (schema === 'api') {
                clientToUse = createClient(supabaseUrl, supabaseKey, { db: { schema: 'api' } });
                tableName = 'registrations';
            } else {
                clientToUse = createClient(supabaseUrl, supabaseKey, { db: { schema: 'public' } });
                tableName = tableName;
            }

            const { data, error } = await clientToUse
                .from(tableName)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`  Error: ${error.message} (Code: ${error.code})`);
            } else {
                console.log(`  Success! Found table.`);
                if (data && data.length > 0) {
                    console.log(`  Columns found: ${Object.keys(data[0]).join(', ')}`);
                    // Check specifically for json columns
                    const jsonCols = ['student_data', 'education_data', 'parent_data'];
                    const foundJson = jsonCols.filter(col => Object.keys(data[0]).includes(col));
                    if (foundJson.length > 0) {
                        console.log(`  JSON Columns found: ${foundJson.join(', ')}`);
                    } else {
                        console.log(`  NO JSON columns found.`);
                    }
                } else {
                    console.log(`  Table exists but is empty.`);
                }
            }

        } catch (err) {
            console.log(`  Exception checking ${table}: ${err.message}`);
        }
    }
}

listTables();
