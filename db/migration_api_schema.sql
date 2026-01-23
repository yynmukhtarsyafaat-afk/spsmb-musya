-- 1. Buat skema 'api'
CREATE SCHEMA IF NOT EXISTS api;

-- 2. Pindahkan tabel 'registrations' dari 'public' ke 'api'
ALTER TABLE public.registrations SET SCHEMA api;

-- 3. Berikan izin penggunaan skema 'api'
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;

-- 4. Berikan izin tabel
-- Untuk anon (pengguna tanpa login): hanya bisa SELECT (baca) dan INSERT (tambah data pendaftaran)
-- Catatan: Kebijakan RLS (Row Level Security) tetap berlaku.
GRANT SELECT, INSERT ON TABLE api.registrations TO anon;

-- Untuk authenticated (admin yang login): akses penuh
GRANT ALL ON TABLE api.registrations TO authenticated;
GRANT ALL ON TABLE api.registrations TO service_role;

-- 5. Perbarui policy RLS jika referensi nama tabel masih menggunakan 'public'
-- RLS policies biasanya melekat pada tabel, tapi jika kita mendefinisikan ulang atau ada referensi eksplisit, kita perlu cek.
-- Untungnya, ALTER TABLE ... SET SCHEMA biasanya ikut memindahkan policy.
-- Namun, kita perlu memastikan policy masih valid.

-- Opsional: Hapus views atau fungsi lain di public jika ada yang bergantung pada registrations (sepertinya tidak ada based on init.sql)
