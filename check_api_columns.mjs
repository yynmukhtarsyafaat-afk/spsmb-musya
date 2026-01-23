
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'api' } });

async function checkApiTable() {
    console.log('Checking api.registrations columns...');

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .limit(1);

        if (error) {
            console.log(`Error: ${error.message}`);
        } else {
            if (data && data.length > 0) {
                const columns = Object.keys(data[0]);
                console.log(`Total columns: ${columns.length}`);
                console.log('Columns:');
                columns.forEach(col => console.log(`- ${col}`));

                const hasStudentData = columns.includes('student_data');
                console.log(`\nHas student_data: ${hasStudentData}`);
                console.log(`Has education_data: ${columns.includes('education_data')}`);
                console.log(`Has parent_data: ${columns.includes('parent_data')}`);
            } else {
                console.log(`Table exists but is empty.`);
            }
        }
    } catch (err) {
        console.log(`Exception: ${err.message}`);
    }
}

checkApiTable();
