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

const steps = [
    { id: 1, title: 'Data Santri', description: 'Identitas Calon Peserta Didik' },
    { id: 2, title: 'Pendidikan', description: 'Riwayat Pendidikan Sebelumnya' },
    { id: 3, title: 'Orang Tua', description: 'Data Ayah dan Ibu' },
    { id: 4, title: 'Alamat', description: 'Alamat Lengkap dan Kesehatan' },
];

export default function RegistrationForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange',
    });

    const onSubmit = (data: RegistrationFormData) => {
        console.log('Form Submitted:', data);
        // Implementasi submit ke backend/Supabase di sini
        alert("Pendaftaran berhasil disubmit! (Simulasi)");
    };

    const nextStep = async () => {
        let isValid = false;
        // Validasi per langkah bisa ditambahkan di sini dengan trigger()
        // Contoh sederhana trigger validasi parsial
        if (currentStep === 1) {
            isValid = await methods.trigger(['nama_lengkap', 'nik', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'unit_sekolah', 'boarding']);
        } else if (currentStep === 2) {
            isValid = await methods.trigger(['sekolah_asal', 'alamat_sekolah']);
        } else if (currentStep === 3) {
            isValid = await methods.trigger(['nama_ayah', 'pekerjaan_ayah', 'nama_ibu', 'no_wa']);
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
