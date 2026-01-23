
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'api' } });

async function checkApiTable() {
    console.log('Checking api.registrations...');

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .limit(1);

        if (error) {
            console.log(`Error: ${error.message}`);
            console.log(`Full error: ${JSON.stringify(error)}`);
        } else {
            console.log(`Success! Found api.registrations.`);
            if (data && data.length > 0) {
                console.log(`Columns found: ${Object.keys(data[0]).join(', ')}`);
            } else {
                console.log(`Table exists but is empty.`);
            }
        }
    } catch (err) {
        console.log(`Exception: ${err.message}`);
    }
}

checkApiTable();
