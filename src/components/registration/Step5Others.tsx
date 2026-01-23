import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type RegistrationFormData } from '@/lib/validation/registrationSchema';

export default function Step5Others() {
    const { register, formState: { errors }, setValue, watch } = useFormContext<RegistrationFormData>();

    const ukuranSeragam = watch('ukuran_seragam');
    const sumberInformasi = watch('sumber_informasi');

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                    <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Data Kesehatan</h3>
                    <div className="space-y-2">
                        <Label htmlFor="riwayat_penyakit">Riwayat Penyakit (Jika ada)</Label>
                        <Input id="riwayat_penyakit" placeholder="Nama Penyakit (Tulis '-' jika tidak ada)" {...register('riwayat_penyakit')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="penyakit_sejak">Sejak Kapan?</Label>
                            <Input id="penyakit_sejak" placeholder="Tahun / Usia" {...register('penyakit_sejak')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="penyakit_kondisi">Kondisi Saat Ini</Label>
                            <Input id="penyakit_kondisi" placeholder="Sembuh / Dalam Pengobatan" {...register('penyakit_kondisi')} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                    <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Informasi Tambahan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="ukuran_seragam">Ukuran Seragam</Label>
                            <Select onValueChange={(val) => setValue('ukuran_seragam', val)} defaultValue={ukuranSeragam}>
                                <SelectTrigger id="ukuran_seragam">
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

                        <div className="space-y-2">
                            <Label htmlFor="sumber_informasi">Dari mana mengetahui PSMB ini?</Label>
                            <Select onValueChange={(val) => setValue('sumber_informasi', val)} defaultValue={sumberInformasi}>
                                <SelectTrigger id="sumber_informasi">
                                    <SelectValue placeholder="Pilih Sumber Informasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Keluarga / Saudara">Keluarga / Saudara</SelectItem>
                                    <SelectItem value="Alumni">Alumni</SelectItem>
                                    <SelectItem value="Media Sosial (IG/FB/TikTok)">Media Sosial (IG/FB/TikTok)</SelectItem>
                                    <SelectItem value="Website">Website</SelectItem>
                                    <SelectItem value="Browsur / Spanduk">Brosur / Spanduk</SelectItem>
                                    <SelectItem value="Teman">Teman</SelectItem>
                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.sumber_informasi && <p className="text-sm text-red-500">{errors.sumber_informasi.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jenis_prestasi">Jenis Prestasi (Opsional)</Label>
                            <Input id="jenis_prestasi" placeholder="Misal: Lomba Da'i, Juara Kelas" {...register('jenis_prestasi')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tingkat_prestasi">Tingkat Prestasi (Opsional)</Label>
                            <Select onValueChange={(val) => setValue('tingkat_prestasi', val)} defaultValue={watch('tingkat_prestasi')}>
                                <SelectTrigger id="tingkat_prestasi">
                                    <SelectValue placeholder="Pilih Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sekolah">Sekolah</SelectItem>
                                    <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                                    <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                                    <SelectItem value="Provinsi">Provinsi</SelectItem>
                                    <SelectItem value="Nasional">Nasional</SelectItem>
                                    <SelectItem value="Internasional">Internasional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border p-4 rounded-md bg-slate-50/50">
                    <h3 className="font-semibold text-lg text-teal-950 border-b pb-2 mb-4">Upload Dokumen</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="file_foto">Pas Foto 3x4</Label>
                            <Input id="file_foto" type="file" accept="image/*" {...register('file_foto')} />
                            <p className="text-xs text-muted-foreground">Latar belakang merah/biru. Format: JPG/PNG.</p>
                            {errors.file_foto && <p className="text-sm text-red-500">{errors.file_foto.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file_kk">Kartu Keluarga (KK)</Label>
                            <Input id="file_kk" type="file" accept="image/*,.pdf" {...register('file_kk')} />
                            <p className="text-xs text-muted-foreground">Format: JPG, PNG, atau PDF.</p>
                            {errors.file_kk && <p className="text-sm text-red-500">{errors.file_kk.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file_akte">Akte Kelahiran</Label>
                            <Input id="file_akte" type="file" accept="image/*,.pdf" {...register('file_akte')} />
                            <p className="text-xs text-muted-foreground">Format: JPG, PNG, atau PDF.</p>
                            {errors.file_akte && <p className="text-sm text-red-500">{errors.file_akte.message as string}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
