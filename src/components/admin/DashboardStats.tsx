import React from 'react';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardStatsProps {
    stats: {
        total: number;
        pending: number;
        verified: number;
        rejected: number;
    };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const cards = [
        {
            label: 'Total Pendaftar',
            value: stats.total,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Menunggu Verifikasi',
            value: stats.pending,
            icon: Clock,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
        {
            label: 'Terverifikasi',
            value: stats.verified,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Ditolak',
            value: stats.rejected,
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                            <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bg}`}>
                            <card.icon className={`w-6 h-6 ${card.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
