-- FORCE FIX STORAGE BUCKET (Jalankan di Supabase SQL Editor)
-- Script ini akan mencoba menghapus (jika kosong) dan membuat ulang bucket 'documents'

-- 1. Create Bucket (Force Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Reset Policy Storage (Hapus Policy Lama)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public view" ON storage.objects;
DROP POLICY IF EXISTS "Give anon insert access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated view" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Select" ON storage.objects;

-- 3. Buat Policy BARU (Sangat Terbuka - Untuk Debugging)
-- Policy: Siapapun (anon/auth) boleh INSERT file apa saja ke bucket 'documents'
CREATE POLICY "Public Upload"
ON storage.objects
FOR INSERT
TO public
WITH CHECK ( bucket_id = 'documents' );

-- Policy: Siapapun (anon/auth) boleh SELECT (Lihat/Download)
CREATE POLICY "Public Select"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'documents' );

-- Policy: Siapapun boleh UPDATE/DELETE (Hati-hati, hanya untuk debug jika error update)
CREATE POLICY "Public Update"
ON storage.objects
FOR UPDATE
TO public
USING ( bucket_id = 'documents' );

-- 4. Grant Permissions (Memastikan role punya akses ke schema)
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;
