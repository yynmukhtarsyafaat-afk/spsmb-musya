-- FIX RLS POLICY (FINAL)
-- Jalankan script ini di Supabase SQL Editor

-- 1. Grant Schema Usage (PENTING: Default hanya public yang open)
GRANT USAGE ON SCHEMA api TO anon;
GRANT USAGE ON SCHEMA api TO authenticated;

-- 2. Grant Table Permissions
-- Berikan izin INSERT ke tabel spesifik di schema api
GRANT INSERT ON TABLE api.registrations TO anon;
GRANT ALL ON TABLE api.registrations TO authenticated;

-- 3. Reset RLS Policies
ALTER TABLE api.registrations ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama agar tidak konflik
DROP POLICY IF EXISTS "Enable insert for anon" ON api.registrations;
DROP POLICY IF EXISTS "Enable select for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable update for authenticated" ON api.registrations;

-- Policy untuk Public (Pendaftaran)
CREATE POLICY "Enable insert for anon"
ON api.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy untuk Admin (Login)
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

-- 4. Verifikasi (Opsional output info)
-- Jika dijalankan di SQL Editor, tidak akan return apa2 jika sukses.
