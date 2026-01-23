
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'api' }
});

// We cannot verify columns easily with client-side JS without getting data.
// But we can try to select 'student_data' and see if it errors.

async function checkStructure() {
    console.log("Checking api.registrations structure...");

    // Try to select student_data explicitly (on api schema)
    const { data, error } = await supabase.from('registrations').select('student_data').limit(1);

    if (error) {
        console.log("Error selecting student_data:", error.message);
    } else {
        console.log("Success selecting student_data. Column EXISTS.");
    }

    // Try to select everything (limit 1) and lists keys
    const { data: allData, error: allError } = await supabase.from('registrations').select('*').limit(1);

    if (allData && allData.length > 0) {
        console.log("COLUMNS:" + JSON.stringify(Object.keys(allData[0])));
    } else {
        console.log("Table is empty or error:", allError?.message);
    }
}

checkStructure();
