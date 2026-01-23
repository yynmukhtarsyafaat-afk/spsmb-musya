
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@spsmb.ms',
        password: 'yppms1991',
    });

    if (error) {
        console.error("Login failed:", error.message);
    } else {
        console.log("Login successful! User ID:", data.user.id);
    }
}

testLogin();
