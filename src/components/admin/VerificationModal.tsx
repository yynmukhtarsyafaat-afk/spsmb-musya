import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from '../ui/badge';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onStatusUpdate: () => void;
}

export default function VerificationModal({ isOpen, onClose, data, onStatusUpdate }: VerificationModalProps) {
    const [loading, setLoading] = useState(false);

    if (!data) return null;

    const handleUpdateStatus = async (newStatus: 'verified' | 'rejected') => {
        setLoading(true);
        try {
            const supabase = createClient(
                import.meta.env.PUBLIC_SUPABASE_URL,
                import.meta.env.PUBLIC_SUPABASE_ANON_KEY
            );

            const { error } = await supabase
                .from('registrations')
                .update({ status: newStatus })
                .eq('id', data.id);

            if (error) throw error;

            toast.success(`Status berhasil diubah menjadi ${newStatus === 'verified' ? 'Terverifikasi' : 'Ditolak'}`);
            onStatusUpdate();
            onClose();
        } catch (error: any) {
            console.error('Error updating status:', error);
            toast.error('Gagal mengubah status: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3 border-b border-gray-100 pb-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const DetailItem = ({ label, value }: { label: string; value: any }) => (
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm text-slate-800 font-medium break-words">{value || '-'}</p>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-slate-800">Verifikasi Pendaftar</DialogTitle>
                        <Badge variant={
                            data.status === 'verified' ? 'default' :
                                data.status === 'rejected' ? 'destructive' :
                                    'secondary'
                        } className="capitalize text-sm px-3 py-1">
                            {data.status === 'verified' ? 'Terverifikasi' :
                                data.status === 'rejected' ? 'Ditolak' : 'Menunggu Verifikasi'}
                        </Badge>
                    </div>
                    <DialogDescription>
                        No. Registrasi: <span className="font-mono font-bold text-slate-600">{data.reg_number}</span>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    {/* Data Diri */}
                    <DetailSection title="Data Calon Peserta Didik">
                        <DetailItem label="Nama Lengkap" value={data.student_data?.full_name} />
                        <DetailItem label="NIK" value={data.student_data?.nik} />
                        <DetailItem label="Tempat, Tanggal Lahir" value={`${data.student_data?.birth_place}, ${data.student_data?.birth_date}`} />
                        <DetailItem label="Jenis Kelamin" value={data.student_data?.gender === 'L' ? 'Laki-laki' : 'Perempuan'} />
                        <DetailItem label="Unit Pilihan" value={data.education_data?.unit} />
                        <DetailItem label="Program/Jurusan" value={data.education_data?.program} />
                    </DetailSection>

                    {/* Riwayat Pendidikan */}
                    <DetailSection title="Riwayat Pendidikan">
                        <DetailItem label="Sekolah Asal" value={data.education_data?.prev_school_name} />
                        <DetailItem label="NPSN" value={data.education_data?.npsn} />
                        <DetailItem label="NISN" value={data.education_data?.nisn} />
                    </DetailSection>

                    {/* Data Orang Tua */}
                    <DetailSection title="Data Orang Tua">
                        <DetailItem label="Nama Ayah" value={data.parent_data?.father_name} />
                        <DetailItem label="NIK Ayah" value={data.parent_data?.father_nik} />
                        <DetailItem label="Nama Ibu" value={data.parent_data?.mother_name} />
                        <DetailItem label="NIK Ibu" value={data.parent_data?.mother_nik} />
                        <DetailItem label="No. Telepon" value={data.parent_data?.phone} />
                    </DetailSection>

                    {/* Berkas - Simplified for MVP */}
                    <DetailSection title="Berkas Upload">
                        {data.file_paths ? (
                            Object.entries(data.file_paths).map(([key, path]) => (
                                <div key={key} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate text-slate-700 capitalize">{key.replace(/_/g, ' ')}</p>
                                    </div>
                                    {/* Assuming path is a full URL or we construct it. For MVP rely on path from DB. 
                        In real app, we need to signUrl if private bucket. Assuming public or handled. */}
                                    <a
                                        href={path as string}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        Lihat
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 italic">Tidak ada berkas diupload</p>
                        )}
                    </DetailSection>
                </ScrollArea>

                <DialogFooter className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Tutup
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatus('rejected')}
                        disabled={loading || data.status === 'rejected'}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                        Tolak
                    </Button>
                    <Button
                        onClick={() => handleUpdateStatus('verified')}
                        disabled={loading || data.status === 'verified'}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                        Verifikasi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
