import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, type RegistrationFormData } from '@/lib/validation/registrationSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Step1StudentData from './Step1StudentData';
import Step2Education from './Step2Education';
import Step3ParentData from './Step3ParentData';
import Step4AddressHealth from './Step4AddressHealth';
import Step5Others from './Step5Others';
import { getSupabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const steps = [
    { id: 1, title: 'Data Santri', description: 'Identitas Calon Peserta Didik' },
    { id: 2, title: 'Pendidikan', description: 'Riwayat Pendidikan Sebelumnya' },
    { id: 3, title: 'Orang Tua', description: 'Data Ayah dan Ibu' },
    { id: 4, title: 'Alamat', description: 'Alamat Lengkap' },
    { id: 5, title: 'Lain-lain', description: 'Kesehatan & Info Tambahan' },
];

export default function RegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [regNumber, setRegNumber] = useState("");

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema) as any,
        mode: 'onChange',
        shouldUnregister: false, // Critical for multi-step to retain values of unmounted steps
    });

    // Load saved data and step from local storage on mount
    React.useEffect(() => {
        const savedData = localStorage.getItem('spsmb_registration_form');
        const savedStep = localStorage.getItem('spsmb_registration_step');

        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                methods.reset(parsedData);
            } catch (error) {
                console.error("Failed to parse saved form data", error);
            }
        }

        if (savedStep) {
            setCurrentStep(parseInt(savedStep, 10));
        }
    }, [methods]);

    // Save form data to local storage on change
    React.useEffect(() => {
        if (!isSubmitted) {
            const subscription = methods.watch((value) => {
                localStorage.setItem('spsmb_registration_form', JSON.stringify(value));
            });
            return () => subscription.unsubscribe();
        }
    }, [methods, isSubmitted]);

    // Save step to local storage when it changes
    React.useEffect(() => {
        if (!isSubmitted) {
            localStorage.setItem('spsmb_registration_step', currentStep.toString());
        }
    }, [currentStep, isSubmitted]);



    const onSubmit = async (data: RegistrationFormData) => {
        console.log('=============== FORM SUBMISSION DEBUG ===============');
        console.log('Raw Form Data:', data);
        console.log('Address Fields:', {
            alamat: data.alamat_lengkap,
            desa: data.desa,
            kec: data.kecamatan,
            kab: data.kabupaten,
            prov: data.provinsi
        });

        // setIsSubmitted(true); // Moved to end of success block
        // actually we should probably show a loading indicator. For now let's just do the logic.
        setIsLoading(true);

        try {
            const supabase = getSupabase();

            // Generate Registration Number
            const date = new Date();
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const random = Math.floor(1000 + Math.random() * 9000);
            const newRegNumber = `REG-${yyyy}${mm}${dd}-${random}`;

            // Upload Files
            let kkUrl = '';
            let akteUrl = '';
            let fotoUrl = '';

            const uploadFile = async (file: File, path: string) => {
                const { data: uploadData, error } = await supabase.storage
                    .from('ppdb_uploads')
                    .upload(path, file);

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from('ppdb_uploads')
                    .getPublicUrl(uploadData.path);

                return publicUrlData.publicUrl;
            };

            const compressImage = async (file: File) => {
                // Skip compression for small files (e.g. < 1MB) or non-images if any
                if (file.size < 1024 * 1024 || !file.type.startsWith('image/')) return file;

                const options = {
                    maxSizeMB: 1, // Max 1MB
                    maxWidthOrHeight: 1920, // Max width/height
                    useWebWorker: true
                };

                try {
                    console.log(`Compressing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
                    const compressedFile = await imageCompression(file, options);
                    console.log(`Compressed to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
                    return compressedFile;
                } catch (error) {
                    console.warn("Image compression failed, using original file", error);
                    return file;
                }
            };

            // Parallel Image Compression & Uploads
            const uploadPromises: Promise<void>[] = [];
            const results: { kk?: string, akte?: string, foto?: string } = {};

            const processFile = async (fileList: FileList | undefined, type: 'kk' | 'akte' | 'foto') => {
                if (!fileList || fileList.length === 0) return;

                let file = fileList[0];
                file = await compressImage(file);
                const ext = file.name.split('.').pop();
                const path = `${newRegNumber}/${type}.${ext}`;
                const url = await uploadFile(file, path);
                results[type] = url;
            };

            if (data.file_kk?.length) uploadPromises.push(processFile(data.file_kk, 'kk'));
            if (data.file_akte?.length) uploadPromises.push(processFile(data.file_akte, 'akte'));
            if (data.file_foto?.length) uploadPromises.push(processFile(data.file_foto, 'foto'));

            await Promise.all(uploadPromises);

            kkUrl = results.kk || '';
            akteUrl = results.akte || '';
            fotoUrl = results.foto || '';

            const filePaths = { kk: kkUrl, akte: akteUrl, foto: fotoUrl };

            // Map Data to DB Schema (Normalized)
            const registrationPayload = {
                reg_number: newRegNumber,
                status: 'pending',

                // Student Data
                full_name: data.nama_lengkap,
                nik: data.nik,
                birth_place: data.tempat_lahir,
                birth_date: data.tanggal_lahir,
                gender: data.jenis_kelamin,
                school_unit: data.unit_sekolah,
                pesantren_unit: data.unit_pesantren,
                major: data.jurusan,
                boarding: data.boarding,
                uniform_size: data.ukuran_seragam,
                medical_history: data.riwayat_penyakit,
                info_source: data.sumber_informasi,

                // Address Data (FIXED: Now included)
                address: data.alamat_lengkap,
                village: data.desa,
                district: data.kecamatan,
                city: data.kabupaten,
                province: data.provinsi,

                // Education Data (Origin)
                origin_school: data.sekolah_asal,
                school_address: data.alamat_sekolah,
                npsn: data.npsn,
                nisn: data.nisn,

                // Parent Data
                father_name: data.nama_ayah,
                father_nik: data.nik_ayah,
                father_job: data.pekerjaan_ayah,
                father_income: data.penghasilan_ayah,
                mother_name: data.nama_ibu,
                mother_nik: data.nik_ibu,
                mother_job: data.pekerjaan_ibu,
                mother_income: data.penghasilan_ibu,
                phone: data.no_wa,

                // New Fields (Frontend Log Only / Partial Save)
                family_status: data.status_keluarga,
                child_order: data.anak_ke,
                total_siblings: data.dari_bersaudara,
                sibling_pp_mukhtar: data.saudara_pp_mukhtar,

                education_status: data.status_pendidikan,
                transfer_class: data.kelas_pindahan,

                father_status: data.status_ayah,
                father_education: data.pendidikan_ayah,
                mother_status: data.status_ibu,
                mother_education: data.pendidikan_ibu,


                // Data Tambahan (Mapped from previously lost fields)
                disease_since: data.penyakit_sejak,
                disease_status: data.penyakit_kondisi,
                achievement_type: data.jenis_prestasi,
                achievement_level: data.tingkat_prestasi,

                // File Paths
                file_paths: filePaths
            };

            // Insert into Supabase
            const { error: insertError } = await supabase
                .from('registrations')
                .insert(registrationPayload);

            if (insertError) {
                console.error("Insert Error Detailed:", JSON.stringify(insertError, null, 2));
                throw insertError;
            }

            setRegNumber(newRegNumber);
            setIsSubmitted(true);

            // Clear local storage
            localStorage.removeItem('spsmb_registration_form');
            localStorage.removeItem('spsmb_registration_step');

        } catch (error: any) {
            console.error("Registration failed:", error);

            let errorMessage = error.message || "Terjadi kesalahan sistem";

            // Helpful error for "Failed to fetch"
            if (errorMessage.includes("Failed to fetch")) {
                errorMessage = "Gagal terhubung ke server. Kemungkinan koneksi internet tidak stabil atau file yang diupload terlalu besar. Silakan coba kompres foto manual atau gunakan koneksi WiFi.";
            }

            alert(`Pendaftaran gagal: ${errorMessage}`);
            alert(`Pendaftaran gagal: ${errorMessage}`);
            setIsSubmitted(false); // Reset submitted state on error
        } finally {
            setIsLoading(false);
        }
    };

    const onError = (errors: any) => {
        console.error("Validation Errors:", errors);
        const errorFields = Object.keys(errors).join(", ");
        alert(`Mohon lengkapi data yang kurang: ${errorFields}`);
    };

    const nextStep = async () => {
        let isValid = false;
        // Validasi per langkah bisa ditambahkan di sini dengan trigger()
        // Contoh sederhana trigger validasi parsial
        if (currentStep === 1) {
            isValid = await methods.trigger(['status_santri', 'nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'unit_sekolah', 'boarding']);
        } else if (currentStep === 2) {
            isValid = await methods.trigger(['sekolah_asal', 'alamat_sekolah', 'nisn', 'status_pendidikan', 'kelas_pindahan']);
        } else if (currentStep === 3) {
            isValid = await methods.trigger(['nama_ayah', 'nik_ayah', 'pekerjaan_ayah', 'penghasilan_ayah', 'nama_ibu', 'nik_ibu', 'pekerjaan_ibu', 'penghasilan_ibu', 'no_wa', 'status_ayah', 'pendidikan_ayah', 'status_ibu', 'pendidikan_ibu']);
        } else if (currentStep === 4) {
            isValid = await methods.trigger(['alamat_lengkap', 'desa', 'kecamatan', 'kabupaten', 'provinsi']);
        } else {
            isValid = true;
        }

        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    if (isSubmitted) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4">
                <Card className="text-center py-10">
                    <CardHeader>
                        <CardTitle className="text-3xl text-green-600 mb-2">Pendaftaran Berhasil!</CardTitle>
                        <CardDescription>Data Anda telah kami terima.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-slate-100 p-6 rounded-lg inline-block">
                            <p className="text-sm text-gray-500 mb-1">Nomor Registrasi Anda</p>
                            <p className="text-2xl font-bold tracking-wider text-slate-800" aria-label="Registration Number">{regNumber}</p>
                        </div>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Simpan nomor registrasi ini untuk melakukan pengecekan status penerimaan secara berkala.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => window.print()}>Cetak Bukti</Button>
                        <Button onClick={() => window.location.href = '/'}>Kembali ke Beranda</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Stepper Indicator */}
            <div className="flex justify-between mb-8 overflow-x-auto">
                {steps.map((step) => (
                    <div key={step.id} className={`flex flex-col items-center w-full ${step.id === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.id === currentStep ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                            {step.id}
                        </div>
                        <span className="text-xs mt-2 font-medium hidden sm:block">{step.title}</span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                            {currentStep === 1 && <Step1StudentData />}
                            {currentStep === 2 && <Step2Education />}
                            {currentStep === 3 && <Step3ParentData />}
                            {currentStep === 4 && <Step4AddressHealth />}
                            {currentStep === 5 && <Step5Others />}
                        </form>
                    </FormProvider>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                        Kembali
                    </Button>
                    {currentStep < steps.length ? (
                        <Button onClick={nextStep}>Lanjut</Button>
                    ) : (
                        <Button onClick={methods.handleSubmit(onSubmit, onError)} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sedang Mengirim...
                                </>
                            ) : (
                                "Kirim Pendaftaran"
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div >
    );
}
