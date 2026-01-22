import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea'; // Textarea component not found
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step4AddressHealth() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<RegistrationFormData>();

    const ukuranSeragam = watch('ukuran_seragam');

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                <Input id="alamat_lengkap" placeholder="Jalan, RT/RW, Dusun" {...register('alamat_lengkap')} />
                <p className="text-xs text-muted-foreground">Cantumkan nama jalan, RT/RW, dan Dusun.</p>
                {errors.alamat_lengkap && <p className="text-sm text-red-500">{errors.alamat_lengkap.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="desa">Desa / Kelurahan</Label>
                    <Input id="desa" {...register('desa')} />
                    {errors.desa && <p className="text-sm text-red-500">{errors.desa.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input id="kecamatan" {...register('kecamatan')} />
                    {errors.kecamatan && <p className="text-sm text-red-500">{errors.kecamatan.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="kabupaten">Kabupaten / Kota</Label>
                    <Input id="kabupaten" {...register('kabupaten')} />
                    {errors.kabupaten && <p className="text-sm text-red-500">{errors.kabupaten.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="provinsi">Provinsi</Label>
                    <Input id="provinsi" {...register('provinsi')} />
                    {errors.provinsi && <p className="text-sm text-red-500">{errors.provinsi.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="riwayat_penyakit">Riwayat Penyakit (Jika ada)</Label>
                <Input id="riwayat_penyakit" placeholder="Tulis '-' jika tidak ada" {...register('riwayat_penyakit')} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="ukuran_seragam">Ukuran Seragam</Label>
                <Select onValueChange={(val) => setValue('ukuran_seragam', val)} defaultValue={ukuranSeragam}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Ukuran" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                        <SelectItem value="XXXL">XXXL</SelectItem>
                    </SelectContent>
                </Select>
                {errors.ukuran_seragam && <p className="text-sm text-red-500">{errors.ukuran_seragam.message}</p>}
            </div>
        </div>
    );
}
