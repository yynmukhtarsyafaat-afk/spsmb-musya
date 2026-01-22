import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Karena Shadcn Form biasanya involve FormField dkk yang agak kompleks kalau manual, 
// saya akan pakai pendekatan direct controlled input dengan useFormContext agar lebih simpel 
// atau membangun wrapper sederhana jika FormField belum ada (biasanya di component/ui/form.tsx).
// Cek file list sebelumnya tidak ada form.tsx di components/ui, jadi saya pakai manual handling error.

import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step1StudentData() {
    const { register, formState: { errors }, watch, setValue } = useFormContext<RegistrationFormData>();

    // Watch values for controlled components if needed
    const jenisKelamin = watch('jenis_kelamin');
    const unitSekolah = watch('unit_sekolah');
    const boarding = watch('boarding');

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                    <Input id="nama_lengkap" placeholder="Sesuai Ijazah/Akte" {...register('nama_lengkap')} />
                    {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nik">NIK</Label>
                    <Input id="nik" placeholder="16 digit NIK" {...register('nik')} maxLength={16} />
                    {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                    <Input id="tempat_lahir" placeholder="Kota Kelahiran" {...register('tempat_lahir')} />
                    {errors.tempat_lahir && <p className="text-sm text-red-500">{errors.tempat_lahir.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Input id="tanggal_lahir" type="date" {...register('tanggal_lahir')} />
                    {errors.tanggal_lahir && <p className="text-sm text-red-500">{errors.tanggal_lahir.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <RadioGroup
                    onValueChange={(val) => setValue('jenis_kelamin', val as "Laki-laki" | "Perempuan")}
                    defaultValue={jenisKelamin}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Laki-laki" id="jk-l" />
                        <Label htmlFor="jk-l">Laki-laki</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Perempuan" id="jk-p" />
                        <Label htmlFor="jk-p">Perempuan</Label>
                    </div>
                </RadioGroup>
                {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="unit_sekolah">Pilihan Unit Sekolah</Label>
                <Select onValueChange={(val) => setValue('unit_sekolah', val)} defaultValue={unitSekolah}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Unit Sekolah" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SMP Unggulan">SMP Unggulan</SelectItem>
                        <SelectItem value="MTs Unggulan">MTs Unggulan</SelectItem>
                        <SelectItem value="MA Unggulan">MA Unggulan</SelectItem>
                        <SelectItem value="SMK Unggulan">SMK Unggulan</SelectItem>
                        <SelectItem value="PP Mukhtar Syafa'at 1 (Putra)">PP Mukhtar Syafa'at 1 (Putra)</SelectItem>
                        <SelectItem value="PP Mukhtar Syafa'at 2 (Putra)">PP Mukhtar Syafa'at 2 (Putra)</SelectItem>
                        <SelectItem value="PP Mukhtar Syafa'at 1 (Putri)">PP Mukhtar Syafa'at 1 (Putri)</SelectItem>
                        <SelectItem value="PP Mukhtar Syafa'at 2 (Putri)">PP Mukhtar Syafa'at 2 (Putri)</SelectItem>
                    </SelectContent>
                </Select>
                {errors.unit_sekolah && <p className="text-sm text-red-500">{errors.unit_sekolah.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Minat Tinggal di Pesantren (Boarding)</Label>
                <RadioGroup
                    onValueChange={(val) => setValue('boarding', val as "Ya" | "Tidak")}
                    defaultValue={boarding}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Ya" id="board-y" />
                        <Label htmlFor="board-y">Ya</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tidak" id="board-t" />
                        <Label htmlFor="board-t">Tidak</Label>
                    </div>
                </RadioGroup>
                {errors.boarding && <p className="text-sm text-red-500">{errors.boarding.message}</p>}
            </div>
        </div>
    );
}
