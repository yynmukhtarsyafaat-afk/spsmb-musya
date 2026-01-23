-- FINAL SECURITY FIX (Jalankan di Supabase SQL Editor)
-- Script ini mengaktifkan kembali keamanan (RLS) dengan konfigurasi yang BENAR.

-- 1. Pastikan RLS Aktif (Fix Warning Linter)
ALTER TABLE api.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Reset & Definisikan Ulang Policy Database
DROP POLICY IF EXISTS "Enable insert for anon" ON api.registrations;
DROP POLICY IF EXISTS "Enable select for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable update for authenticated" ON api.registrations;

-- Policy: Publik (Anon) Boleh Daftar (INSERT Only)
CREATE POLICY "Enable insert for anon"
ON api.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Admin (Authenticated) Boleh Baca & Edit
CREATE POLICY "Enable select for authenticated"
ON api.registrations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for authenticated"
ON api.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Pastikan Izin Schema API & Tabel tetap ada
GRANT USAGE ON SCHEMA api TO anon;
GRANT INSERT ON TABLE api.registrations TO anon;
GRANT ALL ON TABLE api.registrations TO authenticated;

-- 4. Storage Security (Tetap dibuka untuk upload)
-- Pastikan bucket 'documents' public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Pastikan policy upload ada
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'documents' );

-- Pastikan policy view/download ada (untuk Admin & User lihat file)
DROP POLICY IF EXISTS "Allow public view" ON storage.objects;
CREATE POLICY "Allow public view"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'documents' );
