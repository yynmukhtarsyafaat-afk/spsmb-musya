**_Product Requirements Document (PRD) - SPSMB Yayasan Mukhtar Syafa'at (Astro Version)_**

**_1\. Ringkasan Produk_**

- **_Nama Produk:_** _SPSMB (Sistem Penerimaan Santri dan Murid Baru) Yayasan Mukhtar Syafa'at Blokagung._
- **_Tujuan:_** _Platform pendaftaran digital satu pintu yang mengutamakan performa tinggi dan kemudahan akses mobile._
- **_Target Pengguna:_** _Orang tua/wali calon peserta didik._
- **_Platform:_** _Web-based (Astro Framework)._

**_2\. Goals & Success Metrics_**

- **_Goals:_**
  - _Performa loading super cepat (Lighthouse score > 90)._
  - _Digitalisasi pendaftaran tanpa kerumitan bagi wali santri._
  - _Pengumpulan data yang terstruktur sesuai kebutuhan yayasan._
- **_Metrics:_**
  - _Waktu muat halaman (LCP) < 2 detik._
  - _Data tersimpan 100% akurat di Supabase._
  - _Form pendaftaran dapat diisi dengan lancar di perangkat mobile low-end._

**_3\. Scope of Work_**

**_In-Scope (MVP)_**

- **_Landing Page:_** _Informasi yayasan, unit, dan tombol CTA pendaftaran._
- **_Informasi Pendaftaran:_** _Detail syarat, jadwal, biaya, dan alur pendaftaran lengkap._
- **_Multi-step Form:_** _Komponen interaktif dengan validasi Zod (Astro + React Islands)._
- **_File Upload:_** _Foto 3x4, KK, Akte (Maks 2MB, Supabase Storage)._
- **_Cek Status:_** _Pencarian status pendaftaran (No. Registrasi + Tgl Lahir)._
- **_Web Admin:_** _Dashboard untuk verifikasi dan ekspor data CSV._

**_4\. User Flow_**

- **_Landing Page:_** _User membaca informasi unit & melihat overview pendaftaran._
- **_Informasi Pendaftaran:_** _User mempelajari syarat, jadwal, biaya, dan alur pendaftaran secara detail._
- **_Form Pendaftaran:_** _Mengisi 5 bagian (Diri, Sekolah, Ortu, Alamat, Upload)._
- **_Submit:_** _Sistem validasi -> Simpan ke DB -> Tampil No. Registrasi._
- **_Cek Status:_** _User memantau hasil verifikasi secara berkala._

**_5\. Functional Requirements (Detail Opsi Asli)_**

**_5.1 Form Bagian 1: Data Calon Peserta Didik_**

- **_Identitas:_** _Email Aktif, Nama Lengkap, Jenis Kelamin, Tempat/Tgl Lahir, NIK._
- **_Keluarga:_** _Status dalam keluarga (Kandung/Tiri/Angkat), Anak ke-X, Dari Y bersaudara, Saudara sekandung di PP Mukhtar Syafa'at._
- **_Pilihan Pendidikan:_** _\* Status (Baru/Melanjutkan)._
  - _Menetap di Pesantren (Ya/Tidak)._
  - **_Unit Sekolah:_** _TK/PAUD/KB Mukhtar Syafa'at, SMP Unggulan, MTs Unggulan, SMK Unggulan, MA Unggulan, PP Mukhtar Syafa'at 1 (Putra), PP Mukhtar Syafa'at 2 (Putra), PP Mukhtar Syafa'at 1 (Putri), PP Mukhtar Syafa'at 2 (Putri)._
  - _Jurusan & Kelas/Semester._

**_5.2 Form Bagian 2: Riwayat Pendidikan_**

- **_Status:_** _Siswa Baru / Pindahan._
- **_Detail Pindahan (Jika ada):_** _Masuk Kelas (7, 8, 9 untuk SMP/MTs atau 10, 11, 12 untuk MA/SMK)._
- **_Ijazah Terakhir:_** _TK-PAUD, SD-MI, SMP-MTs, Pesantren._
- **_Detail:_** _Nama Sekolah Asal, Alamat Sekolah Asal, NPSN, NISN._

**_5.3 Form Bagian 3: Identitas Orang Tua (Ayah & Ibu)_**

- **_Data:_** _No KK, Nama, NIK, Status (Hidup/Meninggal), Status Alumni (Ya/Tidak)._
- **_Pendidikan Terakhir:_** _SD/Sederajat, SMP/Sederajat, SMA/Sederajat, Diploma, S1, S2, S3, Tidak Sekolah, Pesantren._
- **_Pekerjaan:_** _Tidak Bekerja, PNS, Guru, Pengusaha, Petani, Pekerja Pabrik, Tukang Bangunan, Pensiunan, TNI/Polri, Wiraswasta, Pedagang, Nelayan, Supir, Mubaligh, Karyawan, Penjahit, Ibu Rumah Tangga, Lainnya._
- **_Ekonomi:_** _Penghasilan ( &lt; 1 Juta, 1 - 3 Juta, 3 - 5 Juta, &gt; 5 Juta)._
- **_Kontak:_** _No. Telepon (WhatsApp aktif)._

**_5.4 Form Bagian 4: Alamat & Kesehatan_**

- **_Alamat:_** _Lengkap (Alamat, RT/RW, Dusun, Kode Pos, Provinsi, Kab/Kota, Kec, Kel)._
- **_Riwayat Penyakit:_** _Jenis Penyakit, Sejak kapan, Tindakan pengobatan, Kondisi sekarang._
- **_Lain-lain:_** _Punya BPJS (Ya/Tidak), Sumber Info (Medsos, Alumni, Wali Santri, Lainnya), Ukuran Seragam (S-XXXL)._

**_6\. Technical Requirements_**

- **_Frontend:_** _Astro 5.0 (Hybrid), Tailwind CSS, Shadcn UI (React)._
- **_Backend:_** _Supabase (PostgreSQL, Storage, Auth untuk Admin)._
- **_Validasi:_** _Zod Schema untuk pesan error yang ramah orang tua._
- **_Deployment:_** _Vercel (Free tier di awal)._

**_7\. Database Schema (Normalized / Siap Backend)_**

Schema ini dirancang agar data mudah dikelola per kolom (bukan JSONB) untuk memudahkan query dan reporting.

| **_Field_** | **_Type_** | **_Description_** |
| --- | --- | --- |
| _id_ | _uuid_ | _Primary Key_ |
| _reg_number_ | _text_ | _Unique (REG-YYYY-XXXX)_ |
| _status_ | _text_ | _pending, verified, rejected_ |
| **_Student Identity_** | | |
| _full_name_ | _text_ | _Nama Lengkap_ |
| _nik_ | _text_ | _NIK (16 digit)_ |
| _birth_place_ | _text_ | _Tempat Lahir_ |
| _birth_date_ | _date_ | _Tanggal Lahir_ |
| _gender_ | _text_ | _Laki-laki / Perempuan_ |
| _family_status_ | _text_ | _Kandung / Tiri / Angkat_ |
| _child_order_ | _int_ | _Anak ke-_ |
| _total_siblings_ | _int_ | _Dari ... bersaudara_ |
| _sibling_pp_mukhtar_ | _text_ | _Nama saudara di pondok (opsional)_ |
| **_Education Choice_** | | |
| _school_unit_ | _text_ | _Unit Sekolah Pilihan_ |
| _pesantren_unit_ | _text_ | _Unit Pesantren Pilihan_ |
| _major_ | _text_ | _Jurusan (jika ada)_ |
| _boarding_ | _text_ | _Ya / Tidak_ |
| **_Education History_** | | |
| _education_status_ | _text_ | _Siswa Baru / Pindahan_ |
| _transfer_class_ | _text_ | _Kelas Pindahan (7-12)_ |
| _origin_school_ | _text_ | _Nama Sekolah Asal_ |
| _school_address_ | _text_ | _Alamat Sekolah Asal_ |
| _npsn_ | _text_ | _NPSN_ |
| _nisn_ | _text_ | _NISN_ |
| **_Parents_** | | |
| _father_name_ | _text_ | _Nama Ayah_ |
| _father_nik_ | _text_ | _NIK Ayah_ |
| _father_status_ | _text_ | _Hidup / Meninggal_ |
| _father_education_ | _text_ | _Pendidikan Terakhir Ayah_ |
| _father_job_ | _text_ | _Pekerjaan Ayah_ |
| _father_income_ | _text_ | _Penghasilan Ayah_ |
| _mother_name_ | _text_ | _Nama Ibu_ |
| _mother_nik_ | _text_ | _NIK Ibu_ |
| _mother_status_ | _text_ | _Hidup / Meninggal_ |
| _mother_education_ | _text_ | _Pendidikan Terakhir Ibu_ |
| _mother_job_ | _text_ | _Pekerjaan Ibu_ |
| _mother_income_ | _text_ | _Penghasilan Ibu_ |
| _phone_ | _text_ | _No WA_ |
| **_Address_** | | |
| _address_ | _text_ | _Alamat Lengkap_ |
| _village_ | _text_ | _Desa_ |
| _district_ | _text_ | _Kecamatan_ |
| _city_ | _text_ | _Kabupaten_ |
| _province_ | _text_ | _Provinsi_ |
| **_Files_** | | |
| _file_paths_ | _jsonb_ | _URL dokumen (KK, Akte, Foto)_ |

**_8\. Roadmap (7 Hari)_**

- **_Day 1:_** _Project Setup (Astro + Shadcn)._
- **_Day 2:_** _Landing Page & Static Info._
- **_Day 3-4:_** _Multi-step Form dengan semua opsi asli (React Island)._
- **_Day 5:_** _Supabase Integration (Storage & Database)._
- **_Day 6:_** _Admin Dashboard (Filter & Export)._
- **_Day 7:_** _Testing mobile & Launch._