'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Building2,
    LayoutDashboard,
    Home as HomeIcon,
    Newspaper,
    Wrench,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const adminNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/propiedades', label: 'Propiedades', icon: HomeIcon },
    { href: '/admin/noticias', label: 'Noticias', icon: Newspaper },
    { href: '/admin/servicios', label: 'Servicios', icon: Wrench },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, loading, isAdmin, logout } = useAuth();

    // Redirect non-admin users
    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.push('/');
        }
    }, [user, isAdmin, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-600 border-t-[#10b981] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Show access denied for non-admins
    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div
                    className="max-w-md w-full rounded-[2rem] p-8 text-center"
                    style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                    >
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Acceso Denegado</h1>
                    <p className="text-neutral-400 mb-6">
                        No tienes permisos para acceder al panel de administración.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                        }}
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                style={{
                    background: 'rgba(26, 31, 38, 0.98)',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                }}
                            >
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">Admin</span>
                                <span className="text-xs text-neutral-500 block">Panel de Control</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-[#10b981]'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    style={{
                                        background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        border: isActive ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                                    }}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                        >
                            <Settings className="w-5 h-5" />
                            Configuración
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            Volver al Sitio
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Top Bar */}
                <header
                    className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between lg:justify-end"
                    style={{
                        background: 'rgba(15, 20, 25, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        {isSidebarOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
                        )}
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-sm text-white font-medium block">{user.email}</span>
                            <span className="text-xs text-[#10b981]">Administrador</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-5 h-5 text-neutral-400" />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
