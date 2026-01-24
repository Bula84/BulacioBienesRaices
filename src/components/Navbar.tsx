'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2, Home, Users, Newspaper, Wrench, LogIn, LogOut, User } from 'lucide-react';
import { useUIStore } from '@/store/propertyStore';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/propiedades', label: 'Propiedades', icon: Building2 },
    { href: '/nosotros', label: 'Nosotros', icon: Users },
    { href: '/noticias', label: 'Noticias', icon: Newspaper },
    { href: '/servicios', label: 'Servicios', icon: Wrench },
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
                    ? 'py-3'
                    : 'py-5'
                    }`}
                style={{
                    background: isScrolled
                        ? 'rgba(15, 20, 25, 0.95)'
                        : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                }}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                                }}
                            >
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div
                                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                                style={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    filter: 'blur(12px)',
                                }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                                BC BienesRaices
                            </span>
                            <span className="text-sm text-neutral-400 block -mt-1">Tu hogar es tu refugio</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-5 py-2.5 text-neutral-300 hover:text-white font-medium transition-colors duration-200 group"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <div
                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                    }}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* User/Auth Section */}
                    <div className="hidden lg:flex items-center gap-4">
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-neutral-600 border-t-[#10b981] rounded-full animate-spin" />
                        ) : user ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'rgba(16, 185, 129, 0.15)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                        }}
                                    >
                                        <User className="w-4 h-4 text-[#10b981]" />
                                    </div>
                                    <span className="text-sm text-neutral-300 max-w-[150px] truncate">
                                        {user.email}
                                    </span>
                                </div>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-red-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/propiedades"
                                    className="px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                                    }}
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
                            background: 'rgba(255, 255, 255, 0.1)',
                        }}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-white" />
                        ) : (
                            <Menu className="w-6 h-6 text-white" />
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
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
                                background: 'rgba(26, 31, 38, 0.98)',
                                backdropFilter: 'blur(24px)',
                                borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <div className="p-6 pt-20">
                                {/* User Section (Mobile) */}
                                {user && (
                                    <div
                                        className="flex items-center gap-3 p-4 rounded-2xl mb-4"
                                        style={{
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.2)',
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: 'rgba(16, 185, 129, 0.2)',
                                            }}
                                        >
                                            <User className="w-5 h-5 text-[#10b981]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">
                                                {user.email}
                                            </p>
                                            <p className="text-[#10b981] text-xs">Cuenta activa</p>
                                        </div>
                                    </div>
                                )}

                                <nav className="space-y-2">
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
                                                    className="flex items-center gap-4 p-4 rounded-2xl text-neutral-300 hover:text-white transition-all duration-200"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                    }}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="font-medium">{link.label}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </nav>

                                <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                                    {user ? (
                                        <>
                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={closeMobileMenu}
                                                    className="flex items-center gap-3 w-full py-3 px-4 text-neutral-300 hover:text-white rounded-xl transition-colors"
                                                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                                >
                                                    <User className="w-5 h-5" />
                                                    Panel Admin
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full py-3 px-4 text-red-400 hover:text-red-300 rounded-xl transition-colors"
                                                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
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
                                                className="flex items-center gap-3 w-full py-3 px-4 text-neutral-300 hover:text-white rounded-xl transition-colors"
                                                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                            >
                                                <LogIn className="w-5 h-5" />
                                                Iniciar Sesión
                                            </Link>
                                            <Link
                                                href="/propiedades"
                                                onClick={closeMobileMenu}
                                                className="block w-full py-4 text-center font-semibold rounded-2xl transition-all duration-300"
                                                style={{
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    color: 'white',
                                                }}
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
