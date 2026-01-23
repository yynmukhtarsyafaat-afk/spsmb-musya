import React from 'react';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

export default function AdminSidebar() {
    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/verifikasi', label: 'Verifikasi Data', icon: Users },
    ];

    const handleLogout = async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            import.meta.env.PUBLIC_SUPABASE_URL,
            import.meta.env.PUBLIC_SUPABASE_ANON_KEY
        );
        await supabase.auth.signOut();
        localStorage.removeItem('admin_bypass');
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-emerald-800">SPSMB Admin</h1>
                <p className="text-xs text-slate-500 mt-1">Yayasan Mukhtar Syafa'at</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                    >
                        <item.icon className="w-5 h-5 group-hover:text-emerald-600" />
                        <span className="font-medium">{item.label}</span>
                    </a>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                </button>
            </div>
        </aside>
    );
}
