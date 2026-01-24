import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step2Education() {
    const { register, formState: { errors }, watch, setValue } = useFormContext<RegistrationFormData>();

    // Watch status santri to adjust validation/labels if needed
    const statusSantri = watch('status_santri');
    const unitSekolah = watch('unit_sekolah');
    const statusPendidikan = watch('status_pendidikan');
    const kelasPindahan = watch('kelas_pindahan');

    // Determine available classes based on Unit
    const getKelasOptions = () => {
        if (!unitSekolah) return [];
        if (unitSekolah.includes("SMP") || unitSekolah.includes("MTs")) {
            return ["7", "8", "9"];
        }
        if (unitSekolah.includes("MA") || unitSekolah.includes("SMK")) {
            return ["10", "11", "12"];
        }
        return [];
    };

    const kelasOptions = getKelasOptions();

    return (
        <div className="space-y-6">
            <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Data Sekolah Asal</h3>

                <div className="space-y-2">
                    <Label>Status Pendidikan</Label>
                    <RadioGroup
                        onValueChange={(val) => {
                            setValue('status_pendidikan', val as "Siswa Baru" | "Pindahan", { shouldValidate: true });
                            if (val === "Siswa Baru") setValue('kelas_pindahan', undefined);
                        }}
                        value={statusPendidikan}
                        className="flex space-x-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Siswa Baru" id="sp-baru" />
                            <Label htmlFor="sp-baru">Siswa Baru</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Pindahan" id="sp-pindah" />
                            <Label htmlFor="sp-pindah">Pindahan</Label>
                        </div>
                    </RadioGroup>
                    {errors.status_pendidikan && <p className="text-sm text-red-500">{errors.status_pendidikan.message}</p>}
                </div>

                {statusPendidikan === "Pindahan" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <Label htmlFor="kelas_pindahan">Masuk Kelas</Label>
                        <Select onValueChange={(val) => setValue('kelas_pindahan', val)} value={kelasPindahan}>
                            <SelectTrigger id="kelas_pindahan">
                                <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                {kelasOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.kelas_pindahan && <p className="text-sm text-red-500">{errors.kelas_pindahan.message}</p>}
                    </div>
                )}

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
