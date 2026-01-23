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

    const onSubmit = (data: RegistrationFormData) => {
        console.log('Form Submitted:', data);

        // Generate Registration Number: REG-YYYYMMDD-UnknownRandomID
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const newRegNumber = `REG-${yyyy}${mm}${dd}-${random}`;

        setRegNumber(newRegNumber);
        setIsSubmitted(true);

        // Clear local storage on successful submit
        localStorage.removeItem('spsmb_registration_form');
        localStorage.removeItem('spsmb_registration_step');
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
