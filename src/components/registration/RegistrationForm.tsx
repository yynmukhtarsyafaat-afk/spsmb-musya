import React, { useState } from 'react';
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
    const [regNumber, setRegNumber] = useState("");

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange',
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
        console.log('Form Submitted:', data);
        setIsSubmitted(true); // Show loading state or similar if needed, currently reusing success state logic later? 
        // Actually we should probably show a loading indicator. For now let's just do the logic.

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

            const uploadFile = async (file: File, path: string) => {
                const { data: uploadData, error } = await supabase.storage
                    .from('documents')
                    .upload(path, file);

                if (error) throw error;

                // Get public URL (assuming bucket is public or we store the path)
                // For private buckets we usually store the path. 
                // The DB schema comments say "Link dokumen di storage", usually path or public URL.
                // init.sql says public=false for bucket, so it's private.
                // Admin can view using authenticated view policy.
                // We will store the path.
                return uploadData.path;
            };

            if (data.file_kk && data.file_kk.length > 0) {
                const file = data.file_kk[0];
                const ext = file.name.split('.').pop();
                const path = `${newRegNumber}/kk.${ext}`;
                kkUrl = await uploadFile(file, path);
            }

            if (data.file_akte && data.file_akte.length > 0) {
                const file = data.file_akte[0];
                const ext = file.name.split('.').pop();
                const path = `${newRegNumber}/akte.${ext}`;
                akteUrl = await uploadFile(file, path);
            }

            // Map Data to DB Schema
            const studentData = {
                status_santri: data.status_santri,
                nama_lengkap: data.nama_lengkap,
                nik: data.nik,
                tempat_lahir: data.tempat_lahir,
                tanggal_lahir: data.tanggal_lahir,
                jenis_kelamin: data.jenis_kelamin,
                unit_sekolah: data.unit_sekolah,
                unit_pesantren: data.unit_pesantren,
                jurusan: data.jurusan,
                boarding: data.boarding,
                // Others
                riwayat_penyakit: data.riwayat_penyakit,
                penyakit_sejak: data.penyakit_sejak,
                penyakit_kondisi: data.penyakit_kondisi,
                ukuran_seragam: data.ukuran_seragam,
                sumber_informasi: data.sumber_informasi,
                jenis_prestasi: data.jenis_prestasi,
                tingkat_prestasi: data.tingkat_prestasi,
            };

            const educationData = {
                sekolah_asal: data.sekolah_asal,
                alamat_sekolah: data.alamat_sekolah,
                npsn: data.npsn,
                nisn: data.nisn,
            };

            const parentData = {
                nama_ayah: data.nama_ayah,
                nik_ayah: data.nik_ayah,
                pekerjaan_ayah: data.pekerjaan_ayah,
                penghasilan_ayah: data.penghasilan_ayah,
                nama_ibu: data.nama_ibu,
                nik_ibu: data.nik_ibu,
                pekerjaan_ibu: data.pekerjaan_ibu,
                penghasilan_ibu: data.penghasilan_ibu,
                no_wa: data.no_wa,
            };

            const filePaths = {
                kk_path: kkUrl,
                akte_path: akteUrl
            };

            // Insert into Supabase
            const { error: insertError } = await supabase
                .from('registrations')
                .insert({
                    reg_number: newRegNumber,
                    student_data: studentData,
                    education_data: educationData,
                    parent_data: parentData,
                    file_paths: filePaths,
                    status: 'pending'
                });

            if (insertError) throw insertError;

            setRegNumber(newRegNumber);
            setIsSubmitted(true);

            // Clear local storage
            localStorage.removeItem('spsmb_registration_form');
            localStorage.removeItem('spsmb_registration_step');

        } catch (error: any) {
            console.error("Registration failed:", error);
            alert(`Pendaftaran gagal: ${error.message || "Terjadi kesalahan sistem"}`);
            setIsSubmitted(false); // Reset submitted state on error
        }
    };

    const nextStep = async () => {
        let isValid = false;
        // Validasi per langkah bisa ditambahkan di sini dengan trigger()
        // Contoh sederhana trigger validasi parsial
        if (currentStep === 1) {
            isValid = await methods.trigger(['status_santri', 'nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'unit_sekolah', 'boarding']);
        } else if (currentStep === 2) {
            isValid = await methods.trigger(['sekolah_asal', 'alamat_sekolah', 'nisn']);
        } else if (currentStep === 3) {
            isValid = await methods.trigger(['nama_ayah', 'nik_ayah', 'pekerjaan_ayah', 'penghasilan_ayah', 'nama_ibu', 'nik_ibu', 'pekerjaan_ibu', 'penghasilan_ibu', 'no_wa']);
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
                        <Button onClick={methods.handleSubmit(onSubmit)}>Kirim Pendaftaran</Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
