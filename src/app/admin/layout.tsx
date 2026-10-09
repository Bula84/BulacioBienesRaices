'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Building2,
    LayoutDashboard,
    Home as HomeIcon,
    Wrench,
    Users,
    LogOut,
    Menu,
    X,
    ShieldAlert,
    Clock,
    Share2,
    ShoppingBag,
    Settings,
    Calculator
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Navigation items with role restrictions
const getNavItems = (isSuperAdmin: boolean) => {
    const items = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'superadmin'] },
        { href: '/admin/propiedades', label: 'Propiedades', icon: HomeIcon, roles: ['admin', 'superadmin'] },
        { href: '/admin/emprendimientos', label: 'Emprendimientos', icon: Building2, roles: ['admin', 'superadmin'] },
        { href: '/admin/oportunidades', label: 'Oportunidades', icon: ShoppingBag, roles: ['admin', 'superadmin'] },
        { href: '/admin/servicios', label: 'Servicios', icon: Wrench, roles: ['admin', 'superadmin'] },
        { href: '/admin/publicaciones', label: 'Redes Sociales', icon: Share2, roles: ['admin', 'superadmin'] },
        { href: '/admin/calculadora', label: 'Calculadora', icon: Calculator, roles: ['admin', 'superadmin'] },
        { href: '/admin/configuracion', label: 'Configuración', icon: Settings, roles: ['admin', 'superadmin'] },
    ];

    // Only SuperAdmin can see these
    if (isSuperAdmin) {
        items.push(
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--primary-blue)] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-medium">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Show pending approval message
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div
                    className="max-w-md w-full rounded-[2rem] p-8 text-center bg-white border border-gray-100 shadow-xl"
                >
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-amber-50 border border-amber-100"
                    >
                        <Clock className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] mb-3 font-headings">Aprobación Pendiente</h1>
                    <p className="text-[var(--text-secondary)] mb-6 font-medium">
                        Tu cuenta está pendiente de aprobación por un administrador.
                        Recibirás acceso una vez que sea aprobada.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors bg-gray-50 hover:bg-gray-100"
                        >
                            Volver al Inicio
                        </Link>
                        <button
                            onClick={logout}
                            className="px-6 py-3 rounded-xl font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100"
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
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div
                    className="max-w-md w-full rounded-[2rem] p-8 text-center bg-white border border-gray-100 shadow-xl"
                >
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 border border-red-100"
                    >
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] mb-3 font-headings">Acceso Denegado</h1>
                    <p className="text-[var(--text-secondary)] mb-6 font-medium">
                        No tienes permisos para acceder al panel de administración.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
                        style={{
                            background: 'var(--primary-blue)',
                            boxShadow: '0 4px 20px rgba(33, 148, 207, 0.3)',
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
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } bg-white border-r border-gray-100`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: isSuperAdmin
                                        ? 'linear-gradient(135deg, #0d9488 0%, #059669 100%)'
                                        : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                }}
                            >
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-[var(--text-main)] font-headings">
                                    {isSuperAdmin ? 'SuperAdmin' : 'Admin'}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)] block font-medium">Panel de Control</span>
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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${isActive
                                        ? 'text-[#0d9488] bg-teal-50'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-50 transition-all duration-200"
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
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Top Bar */}
                <header
                    className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between lg:justify-end bg-white/80 backdrop-blur-xl border-b border-gray-100"
                >
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors text-[var(--text-main)]"
                    >
                        {isSidebarOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-sm text-[var(--text-main)] font-bold block">{user?.email}</span>
                            <span
                                className="text-xs font-bold"
                                style={{ color: '#0d9488' }}
                            >
                                {isSuperAdmin ? 'Super Administrador' : 'Administrador'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-5 h-5 text-[var(--text-secondary)]" />
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
