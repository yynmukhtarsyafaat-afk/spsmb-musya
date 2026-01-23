-- Menambahkan kolom file_paths yang hilang ke tabel api.registrations
ALTER TABLE api.registrations
ADD COLUMN IF NOT EXISTS file_paths JSONB;

-- Verifikasi kolom sudah ditambahkan
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'api' AND table_name = 'registrations' AND column_name = 'file_paths';
