-- RESET & FIX SECURITY (CLEAN START)
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki permission dari awal.

-- 1. PASTIKAN SCHEMA 'API' BISA DIAKSES
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;

-- 2. RESET TABLE REGISTRATIONS DI SCHEMA API
-- Pastikan RLS aktif
ALTER TABLE api.registrations ENABLE ROW LEVEL SECURITY;

-- Berikan akses INSERT ke public (anon) dan FULL akses ke admin (authenticated)
GRANT INSERT ON TABLE api.registrations TO anon;
GRANT ALL ON TABLE api.registrations TO authenticated;
GRANT ALL ON TABLE api.registrations TO service_role;

-- Hapus policy lama (bersihkan sampah policy sebelumnya)
DROP POLICY IF EXISTS "Enable insert for anon" ON api.registrations;
DROP POLICY IF EXISTS "Enable select for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable update for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable delete for authenticated" ON api.registrations;

-- Policy 1: Siapapun (anon) boleh INSERT data (Daftar)
CREATE POLICY "Enable insert for anon"
ON api.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 2: Admin (authenticated) boleh LIHAT semua data
CREATE POLICY "Enable select for authenticated"
ON api.registrations
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Admin (authenticated) boleh UPDATE data (Verifikasi)
CREATE POLICY "Enable update for authenticated"
ON api.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. PERBAIKI STORAGE (UNTUK UPLOAD FOTO)
-- Pastikan bucket 'documents' ada dan public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Berikan akses ke schema storage
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;

-- Reset Policy Storage
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public view" ON storage.objects;
DROP POLICY IF EXISTS "Give anon insert access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated view" ON storage.objects;

-- Policy Storage 1: Siapapun (anon) boleh UPLOAD ke bucket 'documents'
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'documents' );

-- Policy Storage 2: Siapapun (public) boleh LIHAT file di bucket 'documents'
CREATE POLICY "Allow public view"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'documents' );
