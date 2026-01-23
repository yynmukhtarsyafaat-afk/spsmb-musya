
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl);
// console.log("Key:", supabaseKey); // Don't log secret keys

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars. Ensure .env has PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANON KEY if allow signup)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'admin@spsmb.ms';
    const password = 'yppms1991';

    console.log(`Checking/Creating user: ${email}`);

    // Check if user exists (requires service role key usually to list users, 
    // but we can just try to sign up and catch error)

    // Try SignIn first
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (!loginError && loginData.user) {
        console.log("User already exists and credentials work!");
        return;
    }

    console.log("Login failed or user not found, attempting to create...");

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'Admin SPSMB',
                role: 'admin'
            }
        }
    });

    if (error) {
        console.error("Error creating user:", error.message);
    } else {
        console.log("User created successfully!", data.user?.id);
        console.log("IMPORTANT: If email confirmation is enabled, you need to confirm it manually or disable confirmation in Supabase dashboard.");
    }
}

createAdmin();
