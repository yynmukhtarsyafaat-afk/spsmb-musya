
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

// We need to access PUBLIC schema tables.
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBackup() {
    console.log("Checking public.registrations_backup...");

    const { data, error } = await supabase.from('registrations_backup').select('*').limit(1);

    if (error) {
        console.log("Error selecting backup:", error.message);
    } else if (data && data.length > 0) {
        console.log("Backup EXISTS and has data.");
        console.log("Columns:", Object.keys(data[0]));
    } else {
        console.log("Backup table exists but might be empty.");
    }
}

checkBackup();
