'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2, Home, Users, Wrench, LogIn, LogOut, User, DollarSign, Store, ShoppingBag } from 'lucide-react';
import { useUIStore } from '@/store/propertyStore';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/propiedades', label: 'Propiedades', icon: Building2 },
    { href: '/emprendimientos', label: 'Emprendimientos', icon: Building2 }, // Using Building2 for now, or maybe default to something else if imported
    { href: '/tasaciones', label: 'Tasaciones', icon: DollarSign },
    { href: '/fondos-de-comercio', label: 'Fondos de Comercio', icon: Store },
    { href: '/nosotros', label: 'Nosotros', icon: Users },
    { href: '/servicios', label: 'Servicios', icon: Wrench },
    { href: '/oportunidades', label: 'Oportunidades', icon: ShoppingBag },
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
                    ? 'py-3 shadow-md'
                    : 'py-5'
                    }`}
                style={{
                    background: isScrolled
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid var(--border-subtle)' : 'none',
                }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary-blue) 0%, #0f766e 100%)',
                                    boxShadow: '0 4px 20px rgba(13, 148, 136, 0.3)',
                                }}
                            >
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gradient block" style={{ fontFamily: 'var(--font-heading)' }}>
                                BC BienesRaices
                            </span>
                            <span className="text-sm text-[var(--text-secondary)] block -mt-1 font-medium">Tu hogar, tu refugio</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-0.5 xl:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-1.5 xl:px-3 py-2 text-[var(--text-main)] hover:text-[var(--primary-blue)] font-medium transition-colors duration-200 group"
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    textTransform: 'uppercase',
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                                <div
                                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"
                                    style={{
                                        background: 'rgba(13, 148, 136, 0.05)',
                                    }}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* User/Auth Section */}
                    <div className="hidden lg:flex items-center gap-4">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-neutral-300 border-t-[var(--primary-blue)] rounded-full animate-spin" />
                        ) : user ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'rgba(13, 148, 136, 0.1)',
                                            border: '1px solid rgba(13, 148, 136, 0.2)',
                                        }}
                                    >
                                        <User className="w-4 h-4 text-[var(--primary-blue)]" />
                                    </div>
                                    <span className="hidden xl:block text-sm text-[var(--text-secondary)] max-w-[150px] truncate">
                                        {user.email}
                                    </span>
                                </div>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="px-3 xl:px-5 py-2.5 text-sm font-medium text-[var(--text-main)] hover:text-[var(--primary-blue)] transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-3 xl:px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden xl:inline">Salir</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-3 xl:px-5 py-2.5 text-sm font-medium text-[var(--text-main)] hover:text-[var(--primary-blue)] transition-colors uppercase tracking-wide text-xs whitespace-nowrap"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden xl:inline">Iniciar Sesión</span>
                                </Link>
                                <Link
                                    href="/propiedades"
                                    className="btn-primary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                >
                                    Explorar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-xl transition-all duration-200"
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                            onClick={closeMobileMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] z-50 lg:hidden"
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
                                            background: 'rgba(13, 148, 136, 0.05)',
                                            border: '1px solid rgba(13, 148, 136, 0.1)',
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: 'white',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <User className="w-5 h-5 text-[var(--primary-blue)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[var(--text-main)] text-sm font-medium truncate">
                                                {user.email}
                                            </p>
                                            <p className="text-[var(--primary-blue)] text-xs">Cuenta activa</p>
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
