'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2, Home, Users, LogIn, LogOut, User, DollarSign, Store } from 'lucide-react';
import { useUIStore } from '@/store/propertyStore';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/propiedades', label: 'Propiedades', icon: Building2 },
    { href: '/tasaciones', label: 'Tasaciones', icon: DollarSign },
    { href: '/fondos-de-comercio', label: 'Fondos de Comercio', icon: Store },
    { href: '/gestion-legal', label: 'Gestión Legal', icon: Users },
    { href: '/nosotros', label: 'Nosotros', icon: Users },
    { href: '/contacto', label: 'Contacto', icon: Users },
];

// Links shown in the top desktop bar (condensed set to avoid overflow)
const desktopLinks = [
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/tasaciones', label: 'Tasaciones' },
    { href: '/fondos-de-comercio', label: 'Fondos de Comercio' },
    { href: '/gestion-legal', label: 'Gestión Legal' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
    const { user, loading, logout, isAdmin } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push('/');
        closeMobileMenu();
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'py-2 shadow-md'
                    : 'py-4'
                    }`}
                style={{
                    background: isScrolled
                        ? 'rgba(255, 255, 255, 0.97)'
                        : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid var(--border-subtle)' : 'none',
                }}
            >
                <div className="container mx-auto px-4 lg:px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="relative">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary-blue) 0%, #16345c 100%)',
                                    boxShadow: '0 4px 20px rgba(11, 31, 58, 0.35), 0 0 0 1px rgba(184, 134, 59, 0.35)',
                                }}
                            >
                                <Building2 className="w-5 h-5" style={{ color: 'var(--accent-light)' }} />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-gradient block leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                Bulacio Bienes Raíces
                            </span>
                            <span className="text-[0.8125rem] text-[var(--text-secondary)] block -mt-0.5 font-medium">Tu hogar, tu refugio</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-1">
                        {desktopLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-2.5 py-2 text-[var(--text-main)] hover:text-[var(--accent-dark)] font-semibold transition-colors duration-200 group rounded-lg hover:bg-[#f3ead9]/60"
                                style={{
                                    fontSize: '0.875rem',
                                    letterSpacing: '0.2px',
                                }}
                            >
                                <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User/Auth Section */}
                    <div className="hidden xl:flex items-center gap-2 flex-shrink-0">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-neutral-300 border-t-[var(--primary-blue)] rounded-full animate-spin" />
                        ) : user ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{
                                            background: 'rgba(184, 134, 59, 0.12)',
                                            border: '1px solid rgba(184, 134, 59, 0.3)',
                                        }}
                                    >
                                        <User className="w-4 h-4" style={{ color: 'var(--accent-dark)' }} />
                                    </div>
                                    <span className="hidden 2xl:block text-[0.8125rem] text-[var(--text-secondary)] max-w-[130px] truncate">
                                        {user.email}
                                    </span>
                                </div>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="px-3 py-2 text-[0.8125rem] font-bold text-white bg-[var(--primary-blue)] rounded-lg hover:bg-[var(--primary-hover)] transition-colors uppercase tracking-wide"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium text-[var(--text-secondary)] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span className="hidden 2xl:inline">Salir</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-semibold text-[var(--text-main)] hover:text-[var(--accent-dark)] transition-colors uppercase tracking-wide rounded-lg hover:bg-[#f3ead9]/60"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Ingresar
                                </Link>
                                <Link
                                    href="/propiedades"
                                    className="btn-primary"
                                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
                                >
                                    Explorar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="xl:hidden p-2 rounded-xl transition-all duration-200"
                        style={{
                            background: 'rgba(0, 0, 0, 0.05)',
                        }}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-[var(--text-main)]" />
                        ) : (
                            <Menu className="w-6 h-6 text-[var(--text-main)]" />
                        )}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 xl:hidden"
                            onClick={closeMobileMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] z-50 xl:hidden"
                            style={{
                                background: 'white',
                                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
                            }}
                        >
                            <div className="p-6 pt-20 h-full flex flex-col">
                                {/* User Section (Mobile) */}
                                {user && (
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-2xl mb-6"
                                        style={{
                                            background: 'rgba(184, 134, 59, 0.08)',
                                            border: '1px solid rgba(184, 134, 59, 0.2)',
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: 'white',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <User className="w-5 h-5" style={{ color: 'var(--accent-dark)' }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[var(--text-main)] text-sm font-medium truncate">
                                                {user.email}
                                            </p>
                                            <p className="text-[0.8125rem] font-medium" style={{ color: 'var(--accent-dark)' }}>Cuenta activa</p>
                                        </div>
                                    </div>
                                )}

                                <nav className="space-y-2 flex-grow">
                                    {navLinks.map((link, index) => {
                                        const Icon = link.icon;
                                        return (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-4 p-4 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:bg-neutral-50 transition-all duration-200"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{link.label}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>

                                <div className="mt-8 pt-8 border-t border-neutral-100 space-y-3">
                                    {user ? (
                                        <>
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-3 w-full py-3 px-4 text-[var(--text-main)] hover:bg-neutral-50 rounded-xl transition-colors"
                                                >
                                                    <User className="w-5 h-5" />
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full py-3 px-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                Cerrar Sesión
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                onClick={closeMobileMenu}
                                                className="flex items-center gap-3 w-full py-3 px-4 text-[var(--text-main)] hover:bg-neutral-50 rounded-xl transition-colors font-medium"
                                            >
                                                <LogIn className="w-5 h-5" />
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href="/propiedades"
                                                onClick={closeMobileMenu}
                                                className="block w-full py-4 text-center font-semibold rounded-2xl transition-all duration-300 btn-primary"
                                            >
                                                Explorar Propiedades
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
