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
    Users,
    LogOut,
    Menu,
    X,
    ShieldAlert,
    Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Navigation items with role restrictions
const getNavItems = (isSuperAdmin: boolean) => {
    const items = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
        { href: '/admin/propiedades', label: 'Propiedades', icon: HomeIcon, roles: ['admin', 'superadmin'] },
    ];

    // Only SuperAdmin can see these
    if (isSuperAdmin) {
        items.push(
            { href: '/admin/noticias', label: 'Noticias', icon: Newspaper, roles: ['superadmin'] },
            { href: '/admin/servicios', label: 'Servicios', icon: Wrench, roles: ['superadmin'] },
            { href: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['superadmin'] },
        );
    }

    return items;
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, loading, isAdmin, isSuperAdmin, isPending, logout, role } = useAuth();

    const adminNavItems = getNavItems(isSuperAdmin);

    // Redirect non-admin users
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

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

    // Show pending approval message
    if (isPending) {
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
                            background: 'rgba(251, 191, 36, 0.15)',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                        }}
                    >
                        <Clock className="w-10 h-10 text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Aprobación Pendiente</h1>
                    <p className="text-neutral-400 mb-6">
                        Tu cuenta está pendiente de aprobación por un administrador.
                        Recibirás acceso una vez que sea aprobada.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 rounded-xl font-medium text-neutral-300 hover:text-white transition-colors"
                            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                        >
                            Volver al Inicio
                        </Link>
                        <button
                            onClick={logout}
                            className="px-6 py-3 rounded-xl font-medium text-red-400 hover:text-red-300 transition-colors"
                            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show access denied for non-admins (no role or invalid role)
    if (!isAdmin) {
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
                                    background: isSuperAdmin
                                        ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                }}
                            >
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">
                                    {isSuperAdmin ? 'SuperAdmin' : 'Admin'}
                                </span>
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
                                        ? isSuperAdmin ? 'text-[#8b5cf6]' : 'text-[#10b981]'
                                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    style={{
                                        background: isActive
                                            ? isSuperAdmin ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                                            : 'transparent',
                                        border: isActive
                                            ? isSuperAdmin ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
                                            : '1px solid transparent',
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
                            <span className="text-sm text-white font-medium block">{user?.email}</span>
                            <span
                                className="text-xs"
                                style={{ color: isSuperAdmin ? '#8b5cf6' : '#10b981' }}
                            >
                                {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
                            </span>
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
