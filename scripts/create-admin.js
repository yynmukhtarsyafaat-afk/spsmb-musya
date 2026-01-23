
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
        envVars[key] = value;
    }
});

const SUPABASE_URL = envVars.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin() {
    const email = 'admin@spsmb.com';
    const password = 'jangan tanya aku gatau'; // Default password

    console.log(`Attempting to create admin user: ${email}`);

    // Check if user already exists (optional, but good for idempotent)
    // Actually createUser creates or returns existing? No, it returns error if exists usually.
    // We can try to sign up or just create. admin.createUser is best.

    const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { role: 'admin' } // Just in case we need it later
    });

    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('Success! Admin user created.');
        console.log('Email:', data.user.email);
        console.log('Password:', password);
        console.log('ID:', data.user.id);
    }
}

createAdmin();
