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
import { getSupabase } from '../../lib/supabase';

export default function RegistrationTable() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedReg, setSelectedReg] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const url = import.meta.env.PUBLIC_SUPABASE_URL;
            setDebugInfo(url ? `URL Supabase terkonfigurasi: ${url.substring(0, 10)}...` : 'URL Supabase HILANG');

            if (!url) {
                throw new Error("PUBLIC_SUPABASE_URL hilang di variabel environment");
            }

            // Client is now imported from lib/supabase



            const supabase = getSupabase();
            const { data: registrations, error: fetchError } = await supabase
                .from('registrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setData(registrations || []);
        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Terjadi kesalahan yang tidak diketahui');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const supabase = getSupabase();
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Current Supabase Session:", session);
            if (session) {
                setDebugInfo(prev => prev + ` | User: ${session.user.email} (${session.user.role})`);
            } else {
                setDebugInfo(prev => prev + " | No Active Session (User is null)");
            }
        };

        checkSession();
        fetchData();
    }, []);

    const handleExportCSV = () => {
        if (!data.length) return;

        // Define headers for all available data
        const headers = [
            'No. Registrasi',
            'Status',
            'Tanggal Daftar',
            // Data Santri
            'Nama Lengkap',
            'NIK',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Unit Sekolah',
            'Unit Pesantren',
            'Jurusan',
            'Boarding',
            'Ukuran Seragam',
            'Riwayat Penyakit',
            'Sumber Info',
            // Alamat
            'Alamat Lengkap',
            'Desa',
            'Kecamatan',
            'Kabupaten',
            'Provinsi',
            // Pendidikan
            'Sekolah Asal',
            'Alamat Sekolah Asal',
            'NPSN',
            'NISN',
            // Orang Tua
            'Nama Ayah',
            'NIK Ayah',
            'Pekerjaan Ayah',
            'Penghasilan Ayah',
            'Nama Ibu',
            'NIK Ibu',
            'Pekerjaan Ibu',
            'Penghasilan Ibu',
            'No HP/WA',
            // Kolom Tambahan untuk Input Manual (Sesuai Request)
            'Catatan Admin',
            'Validasi Dokumen',
            'Paraf'
        ];

        // Helper to escape CSV fields
        const escape = (val: any) => {
            if (val === null || val === undefined) return '';
            const str = String(val);
            // Escape quotes, newlines, and the delimiter (semicolon)
            if (str.includes(';') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvContent = [
            headers.join(';'), // Use semicolon for Excel in ID/EU regions
            ...data.map(reg => {
                // Helper to safely get data from either flat column or JSON fallback (legacy data)
                // Priority: Flat Column -> JSON Field -> Empty String
                const get = (key: string, jsonField?: string, subKey?: string) => {
                    if (reg[key] !== undefined && reg[key] !== null) return reg[key];
                    if (jsonField && subKey && reg[jsonField]) return reg[jsonField][subKey];
                    return '';
                };

                const row = [
                    escape(reg.reg_number),
                    escape(reg.status),
                    escape(new Date(reg.created_at).toLocaleDateString('id-ID')),

                    // Data Santri
                    escape(get('full_name', 'student_data', 'full_name')),
                    escape("'" + get('nik', 'student_data', 'nik')), // Force string for Excel
                    escape(get('gender', 'student_data', 'gender')),
                    escape(get('birth_place', 'student_data', 'birth_place')),
                    escape(get('birth_date', 'student_data', 'birth_date')),
                    escape(get('school_unit', 'education_data', 'unit')), // Note: mapped to education_data.unit in legacy
                    escape(get('pesantren_unit', 'education_data', 'pesantren_unit')),
                    escape(get('major', 'education_data', 'program')),
                    escape(get('boarding', 'education_data', 'boarding')),
                    escape(get('uniform_size', 'student_data', 'uniform_size')),
                    escape(get('medical_history', 'student_data', 'medical_history')),
                    escape(get('info_source', 'student_data', 'info_source')),

                    // Alamat
                    escape(get('address', 'address_data', 'address')),
                    escape(get('village', 'address_data', 'village')),
                    escape(get('district', 'address_data', 'district')),
                    escape(get('city', 'address_data', 'city')),
                    escape(get('province', 'address_data', 'province')),

                    // Pendidikan
                    escape(get('origin_school', 'education_data', 'origin_school')),
                    escape(get('school_address', 'education_data', 'school_address')),
                    escape(get('npsn', 'education_data', 'npsn')),
                    escape(get('nisn', 'education_data', 'nisn')),

                    // Orang Tua
                    escape(get('father_name', 'parent_data', 'father_name')),
                    escape("'" + get('father_nik', 'parent_data', 'father_nik')),
                    escape(get('father_job', 'parent_data', 'father_job')),
                    escape(get('father_income', 'parent_data', 'father_income')),
                    escape(get('mother_name', 'parent_data', 'mother_name')),
                    escape("'" + get('mother_nik', 'parent_data', 'mother_nik')),
                    escape(get('mother_job', 'parent_data', 'mother_job')),
                    escape(get('mother_income', 'parent_data', 'mother_income')),
                    escape("'" + get('phone', 'parent_data', 'phone')),
                    // Empty columns for manual input
                    '', '', ''
                ];
                return row.join(';');
            })
        ].join('\n');

        // Add BOM for Excel UTF-8 recognition
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `data_pendaftar_lengkap_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredData = data.filter((item) => {
        const searchLower = search.toLowerCase();
        const name = (item.full_name || item.student_data?.full_name || '').toLowerCase();
        const regNum = (item.reg_number || '').toLowerCase();
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

            {/* Debug Info */}
            <div className="text-xs text-slate-400 font-mono px-1">
                {debugInfo}
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
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                                    <div className="flex flex-col items-center gap-2 max-w-lg mx-auto">
                                        <div className="flex items-center text-red-600 font-semibold">
                                            <span className="mr-2">⚠️</span> Gagal memuat data
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{error}</p>

                                        <div className="text-xs bg-slate-50 p-3 rounded border border-slate-200 font-mono text-left w-full overflow-auto">
                                            <p className="font-semibold mb-1 text-slate-700">Diagnostic Info:</p>
                                            <ul className="list-disc ml-5 space-y-1 text-slate-500">
                                                <li>Supabase URL: {import.meta.env.PUBLIC_SUPABASE_URL ? 'Configured' : 'MISSING'}</li>
                                                <li>Error Details: {debugInfo || 'None'}</li>
                                                <li>Check RLS policies for 'registrations' table in 'api' schema.</li>
                                            </ul>
                                        </div>

                                        <Button variant="outline" size="sm" onClick={fetchData} className="mt-2">
                                            Coba Lagi
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((reg) => (
                                <TableRow key={reg.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-mono">{reg.reg_number}</TableCell>
                                    <TableCell className="font-medium">{reg.full_name || reg.student_data?.full_name}</TableCell>
                                    <TableCell>{reg.school_unit || reg.education_data?.unit}</TableCell>
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
