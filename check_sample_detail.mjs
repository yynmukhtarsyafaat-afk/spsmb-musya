
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'api' }
});

async function checkDetail() {
    console.log("Fetching 1 sample row...");

    const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .limit(1);

    if (data && data.length > 0) {
        const r = data[0];
        const check = {
            id: r.id,
            val_full_name: r.full_name,
            val_birth_place: r.birth_place,
            val_address: r.address,
            val_phone: r.phone,
            has_student_data: !!r.student_data
        };
        console.log("CHECK_RESULT:" + JSON.stringify(check));
    }
}

checkDetail();
