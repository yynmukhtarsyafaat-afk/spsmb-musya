import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

// Data units
const formalUnits = [
    "SMP Unggulan",
    "MTs Unggulan",
    "MA Unggulan",
    "SMK Unggulan",
    "Hanya Mondok",
];

const pesantrenUnitsPutra = [
    "PP Mukhtar Syafa'at 1 (Putra)",
    "PP Mukhtar Syafa'at 2 (Putra)",
];

const pesantrenUnitsPutri = [
    "PP Mukhtar Syafa'at 1 (Putri)",
    "PP Mukhtar Syafa'at 2 (Putri)",
];

export default function Step1StudentData() {
    const { register, formState: { errors }, watch, setValue } = useFormContext<RegistrationFormData>();

    // Watch values for controlled components
    const jenisKelamin = watch('jenis_kelamin');
    const unitSekolah = watch('unit_sekolah');
    const unitPesantren = watch('unit_pesantren');
    const boarding = watch('boarding');
    const statusSantri = watch('status_santri');

    // Reset pesantren unit selection if gender changes or boarding is disabled
    useEffect(() => {
        if (boarding === "Tidak") {
            setValue('unit_pesantren', undefined);
        }
    }, [boarding, setValue]);

    useEffect(() => {
        // Optional: Reset selection if specific logic requires it, but for now we just change options
        // If current selected pesantren unit is not valid associated with gender, we might want to clear it
        const isPutra = jenisKelamin === "Laki-laki";
        const isPutri = jenisKelamin === "Perempuan";

        if (isPutra && unitPesantren && pesantrenUnitsPutri.includes(unitPesantren)) {
            setValue('unit_pesantren', undefined);
        }
        if (isPutri && unitPesantren && pesantrenUnitsPutra.includes(unitPesantren)) {
            setValue('unit_pesantren', undefined);
        }

    }, [jenisKelamin, unitPesantren, setValue]);


    return (
        <div className="space-y-6">
            {/* Identitas Diri Section */}
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Identitas Diri</h3>

                <div className="space-y-2">
                    <Label>Status Santri</Label>
                    <RadioGroup
                        onValueChange={(val) => setValue('status_santri', val as "Santri Baru" | "Naik Jenjang")}
                        defaultValue={statusSantri}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Santri Baru" id="stat-baru" />
                            <Label htmlFor="stat-baru">Santri Baru</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Naik Jenjang" id="stat-naik" />
                            <Label htmlFor="stat-naik">Naik Jenjang</Label>
                        </div>
                    </RadioGroup>
                    {errors.status_santri && <p className="text-sm text-red-500">{errors.status_santri.message}</p>}
                </div>

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
            </div>

            {/* Pilihan Lembaga Section */}
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Pilihan Lembaga</h3>
                <div className="space-y-2">
                    <Label htmlFor="unit_sekolah">Pilihan Unit Sekolah (Formal)</Label>
                    <Select onValueChange={(val) => setValue('unit_sekolah', val)} defaultValue={unitSekolah}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih Unit Sekolah" />
                        </SelectTrigger>
                        <SelectContent>
                            {formalUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
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

                {/* Conditionally Render Unit Pesantren based on Boarding choice */}
                {boarding === "Ya" && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-dashed border-slate-300">
                        <Label htmlFor="unit_pesantren">Pilihan Unit Pesantren</Label>
                        {!jenisKelamin ? (
                            <p className="text-sm text-muted-foreground italic">Mohon pilih jenis kelamin terlebih dahulu.</p>
                        ) : (
                            <Select onValueChange={(val) => setValue('unit_pesantren', val)} defaultValue={unitPesantren}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Pesantren" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Show options based on gender */}
                                    {jenisKelamin === "Laki-laki" && pesantrenUnitsPutra.map((unit) => (
                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                    {jenisKelamin === "Perempuan" && pesantrenUnitsPutri.map((unit) => (
                                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
