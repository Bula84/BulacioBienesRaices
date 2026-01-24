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

        // Validations
        if (!email || !password || !confirmPassword) {
            setError('Por favor completa todos los campos');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        const result = await register(email, password);

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
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div
                        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div
                        className="rounded-[2rem] p-8 md:p-10 text-center"
                        style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div
                            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                            style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-3">¡Registro Exitoso!</h1>
                        <p className="text-neutral-400 mb-6">
                            Revisa tu correo electrónico para confirmar tu cuenta. Una vez confirmada, podrás iniciar sesión.
                        </p>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
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
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                />
                <div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
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
                    className="rounded-[2rem] p-8 md:p-10"
                    style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-[#10b981]" />
                            <span className="text-sm text-[#10b981] font-medium">Únete a nosotros</span>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
                        <p className="text-neutral-400">
                            Regístrate para comenzar a gestionar tus propiedades
                        </p>
                    </div>

                    {/* Demo Warning */}
                    {!isConfigured && (
                        <div
                            className="flex items-start gap-3 p-4 rounded-xl mb-6"
                            style={{
                                background: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid rgba(251, 191, 36, 0.3)',
                            }}
                        >
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-amber-400 text-sm font-medium">Modo Demo</p>
                                <p className="text-amber-400/70 text-sm">
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
                            className="flex items-center gap-3 p-4 rounded-xl mb-6"
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
                                    disabled={isLoading || !isConfigured}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
                                    disabled={isLoading || !isConfigured}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
                                    disabled={isLoading || !isConfigured}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !isConfigured}
                            className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
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
                        <p className="text-neutral-400">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                href="/login"
                                className="text-[#10b981] hover:text-[#34d399] font-medium transition-colors"
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
