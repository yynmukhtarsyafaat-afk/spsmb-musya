
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase Env Vars");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
    console.log("Testing Storage Connection...");

    // 1. List Buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error("FAILED to list buckets:", bucketError);
    } else {
        console.log("Existing Buckets:", buckets.map(b => b.name));
    }

    // 2. Try simple upload
    const testFileName = `test-${Date.now()}.txt`;
    const { data, error } = await supabase.storage
        .from('documents')
        .upload(testFileName, 'Test file content', {
            contentType: 'text/plain',
            upsert: true
        });

    if (error) {
        console.error("UPLOAD FAILED:", error);
    } else {
        console.log("UPLOAD SUCCESS:", data);
    }
}

testStorage();
