-- DEBUG SECURITY (Jalankan di Supabase SQL Editor)

-- A. FIX STORAGE PERMISSIONS (Kemungkinan error dari sini)
-- 1. Pastikan bucket 'documents' ada dan public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Reset Storage Policies (Allow INSERT for anon)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Give anon insert access" ON storage.objects;

CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'documents' );

GRANT ALL ON SCHEMA storage TO anon;
GRANT ALL ON TABLE storage.objects TO anon;

-- B. TEMPORARY DISABLE TABLE RLS (Untuk memastikan)
-- Kita matikan dulu RLS table untuk melihat apakah error "RLS" hilang.
-- Jika setelah ini BERHASIL, berarti policy table yang tadi masih salah.
-- Jika MASIH GAGAL, berarti errornya fix dari Storage.
ALTER TABLE api.registrations DISABLE ROW LEVEL SECURITY;

-- C. GRANT LEBIH LUAS (Just in case)
GRANT USAGE ON SCHEMA api TO anon;
GRANT ALL ON TABLE api.registrations TO anon;
