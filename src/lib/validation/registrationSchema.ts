import { z } from "zod";

export const studentDataSchema = z.object({
    status_santri: z.enum(["Santri Baru", "Naik Jenjang"]),
    nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    tempat_lahir: z.string().min(2, "Tempat lahir harus diisi"),
    tanggal_lahir: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', { message: "Tanggal lahir tidak valid" }),
    jenis_kelamin: z.enum(["Laki-laki", "Perempuan"]),
    status_keluarga: z.enum(["Anak Kandung", "Anak Tiri", "Anak Angkat"]),
    anak_ke: z.coerce.number().min(1, "Wajib diisi"),
    dari_bersaudara: z.coerce.number().min(1, "Wajib diisi"),
    saudara_pp_mukhtar: z.string().optional(),
    unit_sekolah: z.string().min(1, "Pilih unit sekolah"),
    unit_pesantren: z.string().optional(),
    jurusan: z.string().optional(),
    boarding: z.enum(["Ya", "Tidak"]),
});

export const educationHistorySchema = z.object({
    sekolah_asal: z.string().min(3, "Nama sekolah asal harus diisi"),
    alamat_sekolah: z.string().min(5, "Alamat sekolah harus diisi"),
    npsn: z.string().min(1, "NPSN harus diisi").optional().or(z.literal("")),
    nisn: z.string().length(10, "NISN harus 10 digit").regex(/^\d+$/, "NISN harus berupa angka"),
    status_pendidikan: z.enum(["Siswa Baru", "Pindahan"]),
    kelas_pindahan: z.string().optional(), // Validasi manual nanti berdasarkan status_pendidikan
});

export const parentDataSchema = z.object({
    nama_ayah: z.string().min(3, "Nama ayah harus diisi"),
    status_ayah: z.enum(["Hidup", "Meninggal"]),
    nik_ayah: z.string().length(16, "NIK ayah harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    pendidikan_ayah: z.string().min(1, "Pendidikan ayah wajib dipilih"),
    pekerjaan_ayah: z.string().min(1, "Pilih pekerjaan ayah"),
    penghasilan_ayah: z.string().min(1, "Pilih kisaran penghasilan"),
    nama_ibu: z.string().min(3, "Nama ibu harus diisi"),
    status_ibu: z.enum(["Hidup", "Meninggal"]),
    nik_ibu: z.string().length(16, "NIK ibu harus 16 digit").regex(/^\d+$/, "NIK harus berupa angka"),
    pendidikan_ibu: z.string().min(1, "Pendidikan ibu wajib dipilih"),
    pekerjaan_ibu: z.string().min(1, "Pilih pekerjaan ibu"),
    penghasilan_ibu: z.string().min(1, "Pilih kisaran penghasilan ibu"),
    no_wa: z.string().min(10, "Nomor WA minimal 10 digit").regex(/^\d+$/, "Nomor harus berupa angka"),
});

export const addressHealthSchema = z.object({
    alamat_lengkap: z.string().min(10, "Alamat harus lengkap (Jalan, RT/RW, Dusun)"),
    provinsi: z.string().min(1, "Provinsi harus diisi"),
    kabupaten: z.string().min(1, "Kabupaten harus diisi"),
    kecamatan: z.string().min(1, "Kecamatan harus diisi"),
    desa: z.string().min(1, "Desa/Kelurahan harus diisi"),
});

export const otherSchema = z.object({
    riwayat_penyakit: z.string().optional(),
    penyakit_sejak: z.string().optional(),
    penyakit_kondisi: z.string().optional(),
    ukuran_seragam: z.string().min(1, "Pilih ukuran seragam"),
    sumber_informasi: z.string().min(1, "Pilih sumber informasi"),
    jenis_prestasi: z.string().optional(),
    tingkat_prestasi: z.string().optional(),
    file_kk: z.any().refine((files) => files?.length > 0, "Scan KK wajib diunggah"),
    file_akte: z.any().refine((files) => files?.length > 0, "Scan Akte Kelahiran wajib diunggah"),
    file_foto: z.any().refine((files) => files?.length > 0, "Pas Foto 3x4 wajib diunggah"),
});

// Schema gabungan untuk form lengkap
export const registrationSchema = z.object({
    ...studentDataSchema.shape,
    ...educationHistorySchema.shape,
    ...parentDataSchema.shape,
    ...addressHealthSchema.shape,
    ...otherSchema.shape,
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
