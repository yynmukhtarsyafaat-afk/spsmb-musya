import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Filter, Eye, Download, Loader2 } from 'lucide-react';
import VerificationModal from './VerificationModal';
import { createClient } from '@supabase/supabase-js';

export default function RegistrationTable() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedReg, setSelectedReg] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const supabase = createClient(
                import.meta.env.PUBLIC_SUPABASE_URL,
                import.meta.env.PUBLIC_SUPABASE_ANON_KEY
            );

            const { data: registrations, error } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setData(registrations || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleExportCSV = () => {
        if (!data.length) return;

        const headers = ['No. Registrasi', 'Nama Lengkap', 'NIK', 'Unit', 'Jurusan', 'Nama Ayah', 'Nama Ibu', 'No HP', 'Status', 'Tanggal Daftar'];

        // Helper to escape CSV fields
        const escape = (val: any) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvContent = [
            headers.join(','),
            ...data.map(reg => {
                const row = [
                    escape(reg.reg_number),
                    escape(reg.student_data?.full_name),
                    escape("'" + (reg.student_data?.nik || '')), // Force text format for NIK by prepending '
                    escape(reg.education_data?.unit),
                    escape(reg.education_data?.program),
                    escape(reg.parent_data?.father_name),
                    escape(reg.parent_data?.mother_name),
                    escape("'" + (reg.parent_data?.phone || '')),
                    escape(reg.status),
                    escape(new Date(reg.created_at).toLocaleDateString('id-ID'))
                ];
                return row.join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `data_pendaftar_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = data.filter((item) => {
        const searchLower = search.toLowerCase();
        const name = item.student_data?.full_name?.toLowerCase() || '';
        const regNum = item.reg_number?.toLowerCase() || '';
        return name.includes(searchLower) || regNum.includes(searchLower);
    });

    const handleOpenModal = (reg: any) => {
        setSelectedReg(reg);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = () => {
        fetchData(); // Reload data after update
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        placeholder="Cari nama atau no. reg..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={handleExportCSV} disabled={loading || data.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>No. Registrasi</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((reg) => (
                                <TableRow key={reg.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-mono">{reg.reg_number}</TableCell>
                                    <TableCell className="font-medium">{reg.student_data?.full_name}</TableCell>
                                    <TableCell>{reg.education_data?.unit}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            reg.status === 'verified' ? 'default' :
                                                reg.status === 'rejected' ? 'destructive' :
                                                    'secondary'
                                        } className="capitalize">
                                            {reg.status === 'verified' ? 'Terverifikasi' :
                                                reg.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => handleOpenModal(reg)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" /> Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                    Tidak ada data ditemukan
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <VerificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedReg}
                onStatusUpdate={handleStatusUpdate}
            />
        </div>
    );
}
