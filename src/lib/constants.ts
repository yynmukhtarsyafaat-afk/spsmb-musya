// Unit Pendidikan
export const EDUCATION_UNITS = [
    { value: 'tk-paud-kb', label: 'TK/PAUD/KB Mukhtar Syafa\'at' },
    { value: 'smp-unggulan', label: 'SMP Unggulan' },
    { value: 'mts-unggulan', label: 'MTs Unggulan' },
    { value: 'smk-unggulan', label: 'SMK Unggulan' },
    { value: 'ma-unggulan', label: 'MA Unggulan' },
    { value: 'pp-putra-1', label: 'PP Mukhtar Syafa\'at 1 (Putra)' },
    { value: 'pp-putra-2', label: 'PP Mukhtar Syafa\'at 2 (Putra)' },
    { value: 'pp-putri-1', label: 'PP Mukhtar Syafa\'at 1 (Putri)' },
    { value: 'pp-putri-2', label: 'PP Mukhtar Syafa\'at 2 (Putri)' },
] as const;

// Status Pendaftaran
export const REGISTRATION_STATUS = [
    { value: 'baru', label: 'Baru' },
    { value: 'melanjutkan', label: 'Melanjutkan' },
] as const;

// Ijazah Terakhir
export const LAST_EDUCATION = [
    { value: 'tk-paud', label: 'TK-PAUD' },
    { value: 'sd-mi', label: 'SD-MI' },
    { value: 'sltp', label: 'SLTP' },
    { value: 'slta', label: 'SLTA' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'sarjana', label: 'Sarjana' },
    { value: 'pasca-sarjana', label: 'Pasca Sarjana' },
    { value: 'pesantren', label: 'Pesantren' },
    { value: 'tidak-sekolah', label: 'Tidak Sekolah' },
] as const;

// Pendidikan Orang Tua
export const PARENT_EDUCATION = [
    { value: 'tidak-sekolah', label: 'Tidak Sekolah' },
    { value: 'paud-tk', label: 'PAUD/TK' },
    { value: 'sd-mi', label: 'SD/MI' },
    { value: 'sltp', label: 'SLTP' },
    { value: 'slta', label: 'SLTA' },
    { value: 'd1-d4', label: 'D1-D4' },
    { value: 's1-s3', label: 'S1-S3' },
    { value: 'pesantren', label: 'Pesantren' },
    { value: 'pga', label: 'PGA' },
] as const;

// Pekerjaan Orang Tua
export const PARENT_OCCUPATION = [
    { value: 'tidak-bekerja', label: 'Tidak Bekerja' },
    { value: 'pns', label: 'PNS' },
    { value: 'guru', label: 'Guru' },
    { value: 'pengusaha', label: 'Pengusaha' },
    { value: 'petani', label: 'Petani' },
    { value: 'pekerja-pabrik', label: 'Pekerja Pabrik' },
    { value: 'tukang-bangunan', label: 'Tukang Bangunan' },
    { value: 'pensiunan', label: 'Pensiunan' },
    { value: 'tni-polri', label: 'TNI/Polri' },
    { value: 'wiraswasta', label: 'Wiraswasta' },
    { value: 'pedagang', label: 'Pedagang' },
    { value: 'nelayan', label: 'Nelayan' },
    { value: 'supir', label: 'Supir' },
    { value: 'mubaligh', label: 'Mubaligh' },
    { value: 'karyawan', label: 'Karyawan' },
    { value: 'penjahit', label: 'Penjahit' },
    { value: 'ibu-rumah-tangga', label: 'Ibu Rumah Tangga' },
    { value: 'lainnya', label: 'Lainnya' },
] as const;

// Penghasilan Orang Tua
export const PARENT_INCOME = [
    { value: 'kurang-500rb', label: '< Rp 500.000' },
    { value: '500rb-1jt', label: 'Rp 500.000 - 1 Juta' },
    { value: '1jt-2jt', label: 'Rp 1 Juta - 2 Juta' },
    { value: '2jt-3jt', label: 'Rp 2 Juta - 3 Juta' },
    { value: '3jt-5jt', label: 'Rp 3 Juta - 5 Juta' },
    { value: 'lebih-5jt', label: '> Rp 5 Juta' },
] as const;

// Sumber Informasi
export const INFO_SOURCE = [
    { value: 'medsos', label: 'Media Sosial' },
    { value: 'alumni', label: 'Alumni' },
    { value: 'wali-santri', label: 'Wali Santri' },
    { value: 'lainnya', label: 'Lainnya' },
] as const;

// Ukuran Seragam
export const UNIFORM_SIZE = [
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
    { value: 'xl', label: 'XL' },
    { value: 'xxl', label: 'XXL' },
    { value: 'xxxl', label: 'XXXL' },
] as const;

// Jenis Kelamin
export const GENDER = [
    { value: 'laki-laki', label: 'Laki-laki' },
    { value: 'perempuan', label: 'Perempuan' },
] as const;

// Status dalam Keluarga
export const FAMILY_STATUS = [
    { value: 'kandung', label: 'Anak Kandung' },
    { value: 'tiri', label: 'Anak Tiri' },
    { value: 'angkat', label: 'Anak Angkat' },
] as const;

// Kondisi Orang Tua
export const PARENT_CONDITION = [
    { value: 'hidup', label: 'Hidup' },
    { value: 'meninggal', label: 'Meninggal' },
] as const;
