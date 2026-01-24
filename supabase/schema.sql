-- =============================================================================
-- SKEMA DATABASE SPSMB YAYASAN MUKHTAR SYAFA'AT (VERSI ASTRO)
-- =============================================================================
-- Deskripsi: Script ini mengatur skema 'api', tabel 'registrations', keamanan (RLS),
-- dan penyimpanan untuk sistem pendaftaran santri baru.
--
-- PENTING: Jalankan script ini di SQL Editor dashboard Supabase Anda.
-- Pastikan Anda sudah mengatur 'Exposed schemas' di Settings > API menjadi 'api'.
-- =============================================================================

-- 1. PERSIAPAN SKEMA (Reset & Setup)
-- -----------------------------------------------------------------------------
-- Hapus skema lama jika ada (HATI-HATI: INI MENGHAPUS SEMUA DATA LAMA DI SKEMA API)
DROP SCHEMA IF EXISTS api CASCADE;

-- Buat skema baru
CREATE SCHEMA api;

-- Berikan akses ke skema ini untuk role web (anon & authenticated)
GRANT USAGE ON SCHEMA api TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA api TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA api TO service_role;

-- 2. TABEL PENDAFTARAN (REGISTRATIONS)
-- -----------------------------------------------------------------------------
CREATE TABLE api.registrations (
    -- ID & Metadata
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    
    -- Nomor Registrasi & Status
    reg_number text NOT NULL, -- Format: REG-YYYY-XXXX (digenerate di frontend/backend)
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    
    -- Data Siswa (Student Identity)
    full_name text NOT NULL,
    nik text, -- NIK Siswa
    birth_place text,
    birth_date date,
    gender text CHECK (gender IN ('Laki-laki', 'Perempuan')),
    family_status text, -- Kandung / Tiri / Angkat
    child_order integer, -- Anak ke-X
    total_siblings integer, -- Dari Y bersaudara
    sibling_pp_mukhtar text, -- Nama saudara di pondok (opsional)

    -- Pilihan Pendidikan (Education Choice)
    school_unit text NOT NULL, -- TK, SMP, MTs, SMK, MA, dll
    pesantren_unit text, -- PP 1 Putra, PP 2 Putri, dll
    major text, -- Jurusan (untuk SMK/MA)
    boarding text CHECK (boarding IN ('Ya', 'Tidak')), -- Menetap di Pesantren

    -- Riwayat Pendidikan (Education History)
    education_status text CHECK (education_status IN ('Siswa Baru', 'Pindahan')),
    transfer_class text, -- Kelas 7-12 (jika pindahan)
    origin_school text, -- Nama Sekolah Asal
    school_address text, -- Alamat Sekolah Asal
    npsn text,
    nisn text,

    -- Data Orang Tua (Parents) - Ayah
    father_name text,
    father_nik text,
    father_status text CHECK (father_status IN ('Hidup', 'Meninggal')),
    father_education text,
    father_job text,
    father_income text,

    -- Data Orang Tua (Parents) - Ibu
    mother_name text,
    mother_nik text,
    mother_status text CHECK (mother_status IN ('Hidup', 'Meninggal')),
    mother_education text,
    mother_job text,
    mother_income text,

    -- Kontak Wali
    phone text, -- No WA aktif

    -- Alamat (Address)
    address text, -- Alamat Lengkap (Jalan/Dusun/RT/RW)
    village text, -- Desa/Kelurahan
    district text, -- Kecamatan
    city text, -- Kabupaten/Kota
    province text, -- Provinsi

    -- File Uploads (Disimpan sebagai JSON Object yang berisi URL)
    -- Contoh: {"foto": "url...", "kk": "url...", "akte": "url..."}
    file_paths jsonb DEFAULT '{}'::jsonb,

    -- Constraint Unik
    CONSTRAINT registrations_reg_number_key UNIQUE (reg_number)
);

-- Index untuk pencarian cepat
CREATE INDEX idx_registrations_reg_number ON api.registrations(reg_number);
CREATE INDEX idx_registrations_status ON api.registrations(status);
CREATE INDEX idx_registrations_birth_date ON api.registrations(birth_date);

-- Berikan akses ke tabel
GRANT ALL ON TABLE api.registrations TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE api.registrations TO anon; -- Anon bisa insert & update (draft) tapi select dibatasi
GRANT ALL ON TABLE api.registrations TO authenticated;

-- 3. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE api.registrations ENABLE ROW LEVEL SECURITY;

-- Kebijakan untuk PUBLIK (Pendaftar)
-- 1. Boleh INSERT data baru
CREATE POLICY "Enable insert for anon users" 
ON api.registrations FOR INSERT 
TO anon 
WITH CHECK (true);

-- 2. Boleh UPDATE data mereka sendiri (opsional, jika ingin fitur 'edit pendaftaran' sebelum diverifikasi)
-- Saat ini kita batasi: hanya bisa Insert. Untuk melihat status pakai RPC.

-- Kebijakan untuk ADMIN (Authenticated)
-- Admin boleh melakukan segalanya (CRUD)
CREATE POLICY "Enable full access for authenticated users (admin)" 
ON api.registrations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Catatan: Secara default, 'anon' TIDAK BISA SELECT (baca) tabel ini.
-- Ini mencegah scraping data pendaftar lain.


-- 4. FUNGSI AMAN UNTUK CEK STATUS (RPC)
-- -----------------------------------------------------------------------------
-- Fungsi ini bypass RLS (SECURITY DEFINER) untuk mengecek status
-- hanya jika No Pendaftaran & Tanggal Lahir cocok.
CREATE OR REPLACE FUNCTION api.check_registration_status(
    p_reg_number text,
    p_birth_date date
)
RETURNS TABLE (
    reg_number text,
    full_name text,
    school_unit text,
    status text,
    message text
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Berjalan dengan hak akses pembuat fungsi (admin/service_role)
SET search_path = public -- Keamanan
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        r.reg_number,
        r.full_name,
        r.school_unit,
        r.status,
        CASE 
            WHEN r.status = 'pending' THEN 'Pendaftaran sedang diverifikasi.'
            WHEN r.status = 'verified' THEN 'Selamat! Pendaftaran Anda telah diverifikasi.'
            WHEN r.status = 'rejected' THEN 'Mohon maaf, pendaftaran belum dapat diterima.'
            ELSE 'Status tidak diketahui.'
        END as message
    FROM api.registrations r
    WHERE r.reg_number = p_reg_number 
      AND r.birth_date = p_birth_date;
END;
$$;

GRANT EXECUTE ON FUNCTION api.check_registration_status TO anon, authenticated;


-- 5. PENYIMPANAN FILE (STORAGE)
-- -----------------------------------------------------------------------------
-- Membuat bucket 'ppdb_uploads' jika belum ada
INSERT INTO storage.buckets (id, name, public)
VALUES ('ppdb_uploads', 'ppdb_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage untuk PUBLIK (Upload)
-- Izinkan upload file gambar/pdf ke folder apapun
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'ppdb_uploads' );

-- Kebijakan Storage untuk PUBLIK (Lihat File)
-- Izinkan melihat file
CREATE POLICY "Allow public view"
ON storage.objects FOR SELECT
TO anon
USING ( bucket_id = 'ppdb_uploads' );

-- Kebijakan Storage untuk ADMIN (Full Access)
CREATE POLICY "Allow admin full access"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'ppdb_uploads' )
WITH CHECK ( bucket_id = 'ppdb_uploads' );

-- =============================================================================
-- SELESAI
-- =============================================================================
