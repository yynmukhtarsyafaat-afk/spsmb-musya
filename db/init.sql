-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the registrations table based on the PRD schema
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reg_number TEXT UNIQUE NOT NULL,
    student_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores: Nama, NIK, TTL, etc.
    education_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores: Unit, Jurusan, Sekolah Asal
    parent_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores: Data Ayah, Ibu, Ekonomi
    file_paths JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores: Links to documents in storage
    status TEXT NOT NULL DEFAULT 'pending', -- Status: pending, verified, rejected, approved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert registration data
-- We enforce that reg_number and student_data are present as a basic check
DROP POLICY IF EXISTS "Enable insert for anon" ON public.registrations;
CREATE POLICY "Enable insert for anon"
ON public.registrations
FOR INSERT
TO anon
WITH CHECK (
    reg_number IS NOT NULL AND
    student_data IS NOT NULL
);

-- Policy: Allow authenticated users (Admins) to view all data
DROP POLICY IF EXISTS "Enable select for authenticated" ON public.registrations;
CREATE POLICY "Enable select for authenticated"
ON public.registrations
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users (Admins) to update status/data
DROP POLICY IF EXISTS "Enable update for authenticated" ON public.registrations;
CREATE POLICY "Enable update for authenticated"
ON public.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Storage Bucket Setup
-- Note: Creating buckets via SQL depends on Supabase extensions/setup. 
-- In pure SQL, this interacts with the `storage` schema.

-- 1. Insert 'documents' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false) -- strict security, use RLS
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Policy: Allow public to upload files to 'documents' bucket
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK ( bucket_id = 'documents' );

-- Policy: Allow authenticated (Admin) to view/download files
DROP POLICY IF EXISTS "Allow authenticated view" ON storage.objects;
CREATE POLICY "Allow authenticated view"
ON storage.objects
FOR SELECT
TO authenticated
USING ( bucket_id = 'documents' );
