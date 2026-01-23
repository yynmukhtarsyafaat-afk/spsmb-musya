
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo';

const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: 'api' } });

async function checkSpecificReg() {
    const regNum = 'REG-20260124-6991';
    console.log(`Checking registration: ${regNum}`);

    try {
        const { data, error } = await supabase
            .from('registrations')
            .select('*')
            .eq('reg_number', regNum)
            .single();

        if (error) {
            console.log(JSON.stringify({ error: error.message }));
        } else {
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.log(JSON.stringify({ exception: err.message }));
    }
}

checkSpecificReg();
