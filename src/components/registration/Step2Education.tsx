import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step2Education() {
    const { register, formState: { errors }, watch } = useFormContext<RegistrationFormData>();

    // Watch status santri to adjust validation/labels if needed
    const statusSantri = watch('status_santri');

    return (
        <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Data Sekolah Asal</h3>
                <div className="space-y-2">
                    <Label htmlFor="sekolah_asal">
                        {statusSantri === "Naik Jenjang" ? "Asal Sekolah / Unit Sebelumnya" : "Nama Sekolah Asal"}
                    </Label>
                    <Input
                        id="sekolah_asal"
                        placeholder={statusSantri === "Naik Jenjang" ? "Contoh: SMP Unggulan (Internal)" : "Contoh: SDN 1 Blokagung"}
                        {...register('sekolah_asal')}
                    />
                    {errors.sekolah_asal && <p className="text-sm text-red-500">{errors.sekolah_asal.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="alamat_sekolah">Alamat Sekolah</Label>
                    <Input id="alamat_sekolah" placeholder="Alamat lengkap sekolah asal" {...register('alamat_sekolah')} />
                    {errors.alamat_sekolah && <p className="text-sm text-red-500">{errors.alamat_sekolah.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="npsn">NPSN (Opsional)</Label>
                        <Input id="npsn" placeholder="Nomor Pokok Sekolah Nasional" {...register('npsn')} />
                        {errors.npsn && <p className="text-sm text-red-500">{errors.npsn.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nisn">NISN</Label>
                        <Input id="nisn" placeholder="Nomor Induk Siswa Nasional (Wajib untuk Cek Status)" {...register('nisn')} maxLength={10} />
                        {errors.nisn && <p className="text-sm text-red-500">{errors.nisn.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
