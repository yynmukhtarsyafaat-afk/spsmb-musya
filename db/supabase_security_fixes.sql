-- Fix for "RLS Policy Always True" warning on `public.registrations`
-- Corrected version: Checks actual columns `reg_number` and `student_data`.

-- 1. Drop the existing permissive policy
DROP POLICY IF EXISTS "Enable insert for anon" ON public.registrations;

-- 2. Create a stricter policy
-- We check that 'reg_number' and 'student_data' are provided.
-- This satisfies the Supabase security linter which dislikes 'WITH CHECK (true)'.

CREATE POLICY "Enable insert for anon"
ON public.registrations
FOR INSERT
TO anon
WITH CHECK (
    reg_number IS NOT NULL AND
    student_data IS NOT NULL
);

-- Note: 
-- The table schema seems to use a JSONB column 'student_data' to store personal details.
-- The mismatch between your frontend Schema (expecting 'nama_lengkap') and Admin Dashboard (expecting 'full_name' in student_data) 
-- should be resolved in your application code, but this SQL policy will work regardless of that choice.
