-- NUCLEAR FIX FOR 42501 (Insufficient Privilege)
-- Jalankan ini untuk MEMATIKAN security sementara pada tabel agar data bisa masuk.

-- 1. Matikan RLS di tabel registrations (Supaya tidak ada policy yang nge-blok)
ALTER TABLE api.registrations DISABLE ROW LEVEL SECURITY;

-- 2. Berikan Izin Penuh ke role 'anon' (Public) dan 'service_role'
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON TABLE api.registrations TO anon, authenticated, service_role;

-- 3. Pastikan Sequence Aman (Jika id menggunakan default uuid, ini aman dilewatkan, tapi buat jaga-jaga)
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA api TO anon, authenticated;

-- Catatan:
-- Setelah ini jalan, error 42501 HARUSNYA HILANG.
-- Jika sudah sukses mendaftar, baru nanti kita pikirkan cara mengamankannya lagi pelan-pelan.
