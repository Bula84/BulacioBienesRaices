'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegistroPage() {
    const router = useRouter();
    const { register, isConfigured } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Sanitize inputs
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        // Validations
        if (!trimmedEmail || !trimmedPassword || !confirmPassword) {
            setError('Por favor completa todos los campos');
            setIsLoading(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError('Por favor ingresá un correo electrónico válido');
            setIsLoading(false);
            return;
        }

        // Password strength: min 8 chars, uppercase, lowercase, number
        if (trimmedPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setIsLoading(false);
            return;
        }
        if (!/[A-Z]/.test(trimmedPassword)) {
            setError('La contraseña debe contener al menos una letra mayúscula');
            setIsLoading(false);
            return;
        }
        if (!/[a-z]/.test(trimmedPassword)) {
            setError('La contraseña debe contener al menos una letra minúscula');
            setIsLoading(false);
            return;
        }
        if (!/[0-9]/.test(trimmedPassword)) {
            setError('La contraseña debe contener al menos un número');
            setIsLoading(false);
            return;
        }

        if (trimmedPassword !== confirmPassword.trim()) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        const result = await register(trimmedEmail, trimmedPassword);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setSuccess(true);
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[var(--bg-page)]">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div
                        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-green-400"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div
                        className="rounded-[2rem] p-8 md:p-10 text-center bg-white border border-gray-100 shadow-xl"
                    >
                        <div
                            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-50 border border-green-100"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-3 font-headings">¡Registro Exitoso!</h1>
                        <p className="text-[var(--text-secondary)] mb-6 font-medium">
                            Revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, podrás iniciar sesión.
                        </p>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
                            style={{
                                background: '#10b981',
                            }}
                        >
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

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
                            <span className="text-sm text-[var(--primary-blue)] font-bold">Únete a nosotros</span>
                        </div>

                        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2 font-headings">Crear Cuenta</h1>
                        <p className="text-[var(--text-secondary)]">
                            Regístrate para comenzar a gestionar tus propiedades
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
                                    Supabase no está configurado. Configura las variables de entorno para habilitar registro.
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
                                    placeholder="Mínimo 8 caracteres"
                                    autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                    disabled={isLoading || !isConfigured}
                                />
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
                                    <UserPlus className="w-5 h-5" />
                                    Crear Cuenta
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-secondary)] font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href="/login"
                                className="text-[var(--primary-blue)] hover:underline font-bold transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
