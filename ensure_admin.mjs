
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rqebsndbohtohnqlkebg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZWJzbmRib2h0b2hucWxrZWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTA5Mjg3NiwiZXhwIjoyMDg0NjY4ODc2fQ.J7iFtz4qSm7z2wji73HIEZRbbJ2dgnRB_AS_eqvW8Lo'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureAdminUser() {
    const email = 'admin@spsmb.ms';
    const password = 'yppms1991';

    console.log(`Checking user: ${email}`);

    // Try SignIn first to check existence
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (!loginError && loginData.user) {
        console.log("SUCCESS: Admin user already exists and password is correct.");
        return;
    }

    if (loginError && loginError.message.includes("Invalid login credentials")) {
        console.log("User might exist but password wrong, or user doesn't exist. Attempting strict check with Admin API...");
    }

    // Use Admin API to list users (needs service role)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Failed to list users:", listError);
        return;
    }

    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        console.log("User exists but login failed. Updating password...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: password }
        );
        if (updateError) console.error("Failed to update password:", updateError);
        else console.log("SUCCESS: Password updated.");
    } else {
        console.log("User does not exist. Creating...");
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role: 'admin', full_name: 'Admin SPSMB' }
        });

        if (createError) {
            console.error("Failed to create user:", createError);
        } else {
            console.log("SUCCESS: Admin user created:", data.user.id);
        }
    }
}

ensureAdminUser();
