-- Fix RLS Policies and Migrate Data

-- 1. Ensure 'api' schema exists
CREATE SCHEMA IF NOT EXISTS api;

-- 2. Move data from 'public' if it exists (Data Recovery)
DO $$
BEGIN
   IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'registrations') THEN
      INSERT INTO api.registrations (reg_number, student_data, education_data, parent_data, file_paths, status, created_at)
      SELECT reg_number, student_data, education_data, parent_data, file_paths, status, created_at
      FROM public.registrations
      ON CONFLICT (reg_number) DO NOTHING;
      
      -- Rename old table to prevent confusion, but don't delete yet for safety
      ALTER TABLE public.registrations RENAME TO registrations_backup;
   END IF;
END $$;

-- 3. Enable RLS on api.registrations
ALTER TABLE api.registrations ENABLE ROW LEVEL SECURITY;

-- 4. Reset Policies
DROP POLICY IF EXISTS "Enable select for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable update for authenticated" ON api.registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON api.registrations;

-- Policy: Admin can VIEW ALL
CREATE POLICY "Enable select for authenticated"
ON api.registrations
FOR SELECT
TO authenticated
USING (true);

-- Policy: Admin can UPDATE
CREATE POLICY "Enable update for authenticated"
ON api.registrations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Public can INSERT (Register)
CREATE POLICY "Enable insert for anon"
ON api.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- 5. Grant Permissions
GRANT USAGE ON SCHEMA api TO anon, authenticated;
GRANT ALL ON TABLE api.registrations TO authenticated;
GRANT INSERT ON TABLE api.registrations TO anon;
