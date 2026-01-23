
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'public' } });

async function checkOldData() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .limit(1);

        if (error) {
            console.log(JSON.stringify({ error: error.message }));
        } else {
            if (data && data.length > 0) {
                console.log("Sample Data from public.registrations:");
                console.log(JSON.stringify(data[0], null, 2));
            } else {
                console.log("public.registrations is empty");
            }
        }
    } catch (err) {
        console.log(JSON.stringify({ exception: err.message }));
    }
}

checkOldData();
