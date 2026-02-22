'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isConfigured } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            setIsLoading(false);
            return;
        }

        const result = await login(email, password);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[var(--bg-page)]">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-blue-400"
                />
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15 bg-[var(--primary-blue)]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Card */}
                <div
                    className="rounded-[2rem] p-8 md:p-10 bg-white border border-gray-100 shadow-xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-blue-50 border border-blue-100"
                        >
                            <Sparkles className="w-4 h-4 text-[var(--primary-blue)]" />
                            <span className="text-sm text-[var(--primary-blue)] font-bold">Bienvenido de vuelta</span>
                        </div>

                        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2 font-headings">Iniciar Sesión</h1>
                        <p className="text-[var(--text-secondary)]">
                            Ingresa tus credenciales para acceder a tu cuenta
                        </p>
                    </div>

                    {/* Demo Warning */}
                    {!isConfigured && (
                        <div
                            className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-amber-50 border border-amber-200"
                        >
                            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-700 text-sm font-bold">Modo Demo</p>
                                <p className="text-amber-600/80 text-sm">
                                    Supabase no está configurado. Configura las variables de entorno para habilitar login.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 rounded-xl mb-6 bg-red-50 border border-red-200"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-500 text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                    disabled={isLoading || !isConfigured}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                    disabled={isLoading || !isConfigured}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary-blue)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isConfigured}
                            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                            style={{
                                background: 'var(--primary-blue)',
                            }}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-secondary)] font-medium">
                            ¿No tienes cuenta?{' '}
                            <Link
                                href="/registro"
                                className="text-[var(--primary-blue)] hover:underline font-bold transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
