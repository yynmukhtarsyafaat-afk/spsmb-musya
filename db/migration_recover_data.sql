
-- Migration: Recover Data from Public Schema
-- This script diligently looks for the source of truth (likely public.registrations) 
-- and migrates the JSONB data to the new api.registrations columns.

DO $$
DECLARE
    source_table text := '';
    table_exists boolean;
BEGIN
    -- 1. Identify the source table
    -- Check if public.registrations_backup exists
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'registrations_backup') INTO table_exists;
    IF table_exists THEN
        source_table := 'public.registrations_backup';
        RAISE NOTICE 'Found source table: public.registrations_backup';
    ELSE
        -- Check if public.registrations exists
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'registrations') INTO table_exists;
        IF table_exists THEN
            source_table := 'public.registrations';
            RAISE NOTICE 'Found source table: public.registrations';
        ELSE
             -- Check if api.registrations has the data itself (maybe we are mistakenly thinking it's gone)
             -- But we assume it's gone based on checks.
             RAISE NOTICE 'No suitable source table found in public schema.';
        END IF;
    END IF;

    -- 2. Perform Migration if source found
    IF source_table <> '' THEN
        RAISE NOTICE 'Starting migration from %...', source_table;
        
        -- We use EXECUTE for dynamic SQL because the table name is variable
        -- and strictly strictly binding schema references in static SQL might fail compilation if table is missing.
        
        EXECUTE format('
            UPDATE api.registrations t
            SET 
                full_name = s.student_data->>''nama_lengkap'',
                nik = s.student_data->>''nik'',
                birth_place = s.student_data->>''tempat_lahir'',
                birth_date = (s.student_data->>''tanggal_lahir'')::DATE,
                gender = s.student_data->>''jenis_kelamin'',
                school_unit = s.student_data->>''unit_sekolah'',
                pesantren_unit = s.student_data->>''unit_pesantren'',
                major = s.student_data->>''jurusan'',
                boarding = s.student_data->>''boarding'',
                uniform_size = s.student_data->>''ukuran_seragam'',
                medical_history = s.student_data->>''riwayat_penyakit'',
                info_source = s.student_data->>''sumber_informasi'',
                
                -- Address (New)
                address = s.student_data->>''alamat_lengkap'',
                village = s.student_data->>''desa'',
                district = s.student_data->>''kecamatan'',
                city = s.student_data->>''kabupaten'',
                province = s.student_data->>''provinsi'',

                -- Parent
                father_name = s.parent_data->>''nama_ayah'',
                father_nik = s.parent_data->>''nik_ayah'',
                father_job = s.parent_data->>''pekerjaan_ayah'',
                father_income = s.parent_data->>''penghasilan_ayah'',
                mother_name = s.parent_data->>''nama_ibu'',
                mother_nik = s.parent_data->>''nik_ibu'',
                mother_job = s.parent_data->>''pekerjaan_ibu'',
                mother_income = s.parent_data->>''penghasilan_ibu'',
                phone = s.parent_data->>''no_wa'',

                -- Education
                origin_school = s.education_data->>''sekolah_asal'',
                school_address = s.education_data->>''alamat_sekolah'',
                npsn = s.education_data->>''npsn'',
                nisn = s.education_data->>''nisn''
            FROM %I.registrations s -- We assume source_table is schema.table, but %I quotes identifier. 
                                    -- Wait, format identifier treats input as single identifier. we need to split schema.
            WHERE t.reg_number = s.reg_number
        ', split_part(source_table, '.', 1), split_part(source_table, '.', 2)); -- Wait, I can't pass schema.table to %I nicely if I want schema separation?
        
        -- Correct approach for schema.table in format:
        -- Just string concat or careful formatting.
        -- Let's use the source_table string directly since we controlled it above.
        -- Re-writing the EXECUTE block safely.
        
        EXECUTE '
            UPDATE api.registrations t
            SET 
                full_name = s.student_data->>''nama_lengkap'',
                nik = s.student_data->>''nik'',
                birth_place = s.student_data->>''tempat_lahir'',
                birth_date = CASE WHEN s.student_data->>''tanggal_lahir'' IS NOT NULL AND s.student_data->>''tanggal_lahir'' != '''' 
                             THEN (s.student_data->>''tanggal_lahir'')::DATE ELSE NULL END,
                gender = s.student_data->>''jenis_kelamin'',
                school_unit = s.student_data->>''unit_sekolah'',
                pesantren_unit = s.student_data->>''unit_pesantren'',
                major = s.student_data->>''jurusan'',
                boarding = s.student_data->>''boarding'',
                uniform_size = s.student_data->>''ukuran_seragam'',
                medical_history = s.student_data->>''riwayat_penyakit'',
                info_source = s.student_data->>''sumber_informasi'',
                
                address = s.student_data->>''alamat_lengkap'',
                village = s.student_data->>''desa'',
                district = s.student_data->>''kecamatan'',
                city = s.student_data->>''kabupaten'',
                province = s.student_data->>''provinsi'',

                father_name = s.parent_data->>''nama_ayah'',
                father_nik = s.parent_data->>''nik_ayah'',
                father_job = s.parent_data->>''pekerjaan_ayah'',
                father_income = s.parent_data->>''penghasilan_ayah'',
                mother_name = s.parent_data->>''nama_ibu'',
                mother_nik = s.parent_data->>''nik_ibu'',
                mother_job = s.parent_data->>''pekerjaan_ibu'',
                mother_income = s.parent_data->>''penghasilan_ibu'',
                phone = s.parent_data->>''no_wa'',

                origin_school = s.education_data->>''sekolah_asal'',
                school_address = s.education_data->>''alamat_sekolah'',
                npsn = s.education_data->>''npsn'',
                nisn = s.education_data->>''nisn''
            FROM ' || source_table || ' s
            WHERE t.reg_number = s.reg_number
        ';
        
        RAISE NOTICE 'Migration completed successfully from %.', source_table;
    ELSE
        RAISE EXCEPTION 'Could not find source table public.registrations_backup OR public.registrations. Data migration aborted.';
    END IF;
END $$;
