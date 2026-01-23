import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step3ParentData() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<RegistrationFormData>();

    const pekerjaanAyah = watch('pekerjaan_ayah');
    const penghasilanAyah = watch('penghasilan_ayah');
    const pekerjaanIbu = watch('pekerjaan_ibu');
    const penghasilanIbu = watch('penghasilan_ibu');

    return (
        <div className="space-y-6">
            {/* Data Ayah */}
            {/* Data Ayah */}
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Data Ayah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_ayah">Nama Ayah</Label>
                        <Input id="nama_ayah" {...register('nama_ayah')} />
                        {errors.nama_ayah && <p className="text-sm text-red-500">{errors.nama_ayah.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nik_ayah">NIK Ayah</Label>
                        <Input id="nik_ayah" {...register('nik_ayah')} maxLength={16} />
                        {errors.nik_ayah && <p className="text-sm text-red-500">{errors.nik_ayah.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pekerjaan_ayah">Pekerjaan Ayah</Label>
                        <Select onValueChange={(val) => setValue('pekerjaan_ayah', val)} defaultValue={pekerjaanAyah}>
                            <SelectTrigger id="pekerjaan_ayah">
                                <SelectValue placeholder="Pilih Pekerjaan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PNS">PNS</SelectItem>
                                <SelectItem value="TNI/Polri">TNI/Polri</SelectItem>
                                <SelectItem value="Wiraswasta">Wiraswasta</SelectItem>
                                <SelectItem value="Petani">Petani</SelectItem>
                                <SelectItem value="Buruh">Buruh</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.pekerjaan_ayah && <p className="text-sm text-red-500">{errors.pekerjaan_ayah.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="penghasilan_ayah">Penghasilan Ayah (per bulan)</Label>
                        <Select onValueChange={(val) => setValue('penghasilan_ayah', val)} defaultValue={penghasilanAyah}>
                            <SelectTrigger id="penghasilan_ayah">
                                <SelectValue placeholder="Pilih Kisaran Penghasilan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="< 1 Juta">&lt; 1 Juta</SelectItem>
                                <SelectItem value="1 - 3 Juta">1 - 3 Juta</SelectItem>
                                <SelectItem value="3 - 5 Juta">3 - 5 Juta</SelectItem>
                                <SelectItem value="> 5 Juta">&gt; 5 Juta</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.penghasilan_ayah && <p className="text-sm text-red-500">{errors.penghasilan_ayah.message}</p>}
                    </div>
                </div>
            </div>

            {/* Data Ibu */}
            {/* Data Ibu */}
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Data Ibu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama_ibu">Nama Ibu</Label>
                        <Input id="nama_ibu" {...register('nama_ibu')} />
                        {errors.nama_ibu && <p className="text-sm text-red-500">{errors.nama_ibu.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nik_ibu">NIK Ibu</Label>
                        <Input id="nik_ibu" {...register('nik_ibu')} maxLength={16} />
                        {errors.nik_ibu && <p className="text-sm text-red-500">{errors.nik_ibu.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="pekerjaan_ibu">Pekerjaan Ibu</Label>
                        <Select onValueChange={(val) => setValue('pekerjaan_ibu', val)} defaultValue={pekerjaanIbu}>
                            <SelectTrigger id="pekerjaan_ibu">
                                <SelectValue placeholder="Pilih Pekerjaan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PNS">PNS</SelectItem>
                                <SelectItem value="TNI/Polri">TNI/Polri</SelectItem>
                                <SelectItem value="Wiraswasta">Wiraswasta</SelectItem>
                                <SelectItem value="Petani">Petani</SelectItem>
                                <SelectItem value="Buruh">Buruh</SelectItem>
                                <SelectItem value="Ibu Rumah Tangga">Ibu Rumah Tangga</SelectItem>
                                <SelectItem value="Lainnya">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.pekerjaan_ibu && <p className="text-sm text-red-500">{errors.pekerjaan_ibu.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="penghasilan_ibu">Penghasilan Ibu (per bulan)</Label>
                        <Select onValueChange={(val) => setValue('penghasilan_ibu', val)} defaultValue={penghasilanIbu}>
                            <SelectTrigger id="penghasilan_ibu">
                                <SelectValue placeholder="Pilih Kisaran Penghasilan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="< 1 Juta">&lt; 1 Juta</SelectItem>
                                <SelectItem value="1 - 3 Juta">1 - 3 Juta</SelectItem>
                                <SelectItem value="3 - 5 Juta">3 - 5 Juta</SelectItem>
                                <SelectItem value="> 5 Juta">&gt; 5 Juta</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.penghasilan_ibu && <p className="text-sm text-red-500">{errors.penghasilan_ibu.message}</p>}
                    </div>
                </div>
            </div>

            {/* Kontak */}
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Kontak</h3>
                <div className="space-y-2">
                    <Label htmlFor="no_wa">Nomor WhatsApp (Aktif)</Label>
                    <Input id="no_wa" placeholder="Contoh: 08123456789" {...register('no_wa')} />
                    <p className="text-xs text-muted-foreground">Nomor ini akan digunakan untuk informasi kelulusan.</p>
                    {errors.no_wa && <p className="text-sm text-red-500">{errors.no_wa.message}</p>}
                </div>
            </div>
        </div>
    );
}
