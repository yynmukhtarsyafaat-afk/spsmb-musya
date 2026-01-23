
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'api' } });

async function checkLatestOne() {
    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) {
            console.log(JSON.stringify({ error: error.message }));
        } else {
            if (data && data.length > 0) {
                console.log("Latest Registration Record:");
                console.log(JSON.stringify(data[0], null, 2));
            } else {
                console.log("No registrations found.");
            }
        }
    } catch (err) {
        console.log(JSON.stringify({ exception: err.message }));
    }
}

checkLatestOne();
