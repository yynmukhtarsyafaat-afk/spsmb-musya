import React, { useEffect, useState } from 'react';
import DashboardStats from './DashboardStats';
import { getSupabase } from '../../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';

export default function DashboardClient() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        verified: 0,
        rejected: 0,
    });
    const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = getSupabase();

                // Auth check is now handled by AdminLayout (localStorage)
                // We skip supabase.auth.getUser() here to prevent auto-logout


                // Fetch counts - we wrap in try/catch individual parts to better diagnose?
                // For now, let's keep it simple: one fail = all fail display

                // Execute all queries in parallel for faster loading
                const [
                    totalRes,
                    pendingRes,
                    verifiedRes,
                    rejectedRes,
                    recentRes
                ] = await Promise.all([
                    supabase.from('registrations').select('*', { count: 'exact', head: true }),
                    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'verified'),
                    supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
                    supabase.from('registrations').select('id, reg_number, full_name, status, created_at').order('created_at', { ascending: false }).limit(5)
                ]);

                // Check for errors
                if (totalRes.error) throw totalRes.error;
                if (pendingRes.error) throw pendingRes.error;
                if (verifiedRes.error) throw verifiedRes.error;
                if (rejectedRes.error) throw rejectedRes.error;
                if (recentRes.error) throw recentRes.error;

                setStats({
                    total: totalRes.count || 0,
                    pending: pendingRes.count || 0,
                    verified: verifiedRes.count || 0,
                    rejected: rejectedRes.count || 0,
                });

                if (recentRes.data) setRecentRegistrations(recentRes.data);

            } catch (err: any) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message || 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-800 rounded-xl border border-red-200 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-10 h-10 text-red-600 mb-3" />
                <h3 className="font-bold text-lg">Gagal Memuat Data</h3>
                <p className="text-sm mt-1 mb-4 max-w-md">{error}</p>
                <div className="text-xs bg-white p-3 rounded border border-red-100 font-mono text-left w-full max-w-lg overflow-auto">
                    <p className="font-semibold mb-1">Diagnostic Info:</p>
                    <ul className="list-disc ml-5 space-y-1">
                        <li>Supabase URL: {import.meta.env.PUBLIC_SUPABASE_URL ? 'Configured' : 'MISSING'}</li>
                        <li>RLS Config: Ensure 'anon' or 'authenticated' role has SELECT permission on 'registrations' (schema: api).</li>
                        <li>Table: Ensure 'registrations' table exists in 'api' schema.</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardStats stats={stats} />

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800">Pendaftar Terbaru</h2>
                    <a href="/admin/verifikasi" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Lihat Semua</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">No. Registrasi</th>
                                <th className="px-6 py-3">Nama Lengkap</th>
                                <th className="px-6 py-3">Tanggal Daftar</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-600">{reg.reg_number}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{reg.full_name || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(reg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${reg.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                                                reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {reg.status === 'verified' ? 'Terverifikasi' :
                                                reg.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">Belum ada pendaftar masuk</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
