'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Building2,
    Newspaper,
    Wrench,
    TrendingUp,
    ArrowUpRight,
    Eye,
    DollarSign,
    Users
} from 'lucide-react';

const stats = [
    {
        label: 'Propiedades Activas',
        value: '24',
        change: '+3 este mes',
        trend: 'up',
        icon: Building2,
        color: '#00d4ff',
    },
    {
        label: 'Visitas Totales',
        value: '12,847',
        change: '+18% vs mes anterior',
        trend: 'up',
        icon: Eye,
        color: '#a855f7',
    },
    {
        label: 'Consultas Recibidas',
        value: '156',
        change: '+24 esta semana',
        trend: 'up',
        icon: Users,
        color: '#10b981',
    },
    {
        label: 'Valor en Cartera',
        value: '$4.2M',
        change: '+$320K este mes',
        trend: 'up',
        icon: DollarSign,
        color: '#f59e0b',
    },
];

const quickActions = [
    {
        label: 'Agregar Propiedad',
        href: '/admin/propiedades',
        icon: Building2,
        description: 'Publicar una nueva propiedad',
    },
    {
        label: 'Nueva Noticia',
        href: '/admin/noticias',
        icon: Newspaper,
        description: 'Crear un artículo para el blog',
    },
    {
        label: 'Registrar Servicio',
        href: '/admin/servicios',
        icon: Wrench,
        description: 'Agregar un nuevo profesional',
    },
];

const recentActivity = [
    { action: 'Nueva propiedad agregada', item: 'Departamento en Puerto Madero', time: 'Hace 2 horas' },
    { action: 'Artículo publicado', item: 'El mercado inmobiliario 2026', time: 'Hace 5 horas' },
    { action: 'Nuevo servicio', item: 'Juan Pérez - Electricista', time: 'Ayer' },
    { action: 'Propiedad actualizada', item: 'Casa en Nordelta', time: 'Hace 2 días' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-neutral-400">Bienvenido al panel de administración de Antigravity Enterprise</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: `${stat.color}15`,
                                    }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-emerald-400">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12%</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-sm text-neutral-500">{stat.label}</p>
                            <p className="text-xs text-neutral-600 mt-2">{stat.change}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-6 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <h2 className="text-lg font-semibold text-white mb-6">Acciones Rápidas</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="group p-5 rounded-xl transition-all duration-200 hover:-translate-y-1"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.2))',
                                            }}
                                        >
                                            <Icon className="w-5 h-5 text-[#00d4ff]" />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-neutral-600 group-hover:text-[#00d4ff] transition-colors" />
                                    </div>
                                    <p className="font-medium text-white mb-1">{action.label}</p>
                                    <p className="text-xs text-neutral-500">{action.description}</p>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <h2 className="text-lg font-semibold text-white mb-6">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0"
                            >
                                <div
                                    className="w-2 h-2 mt-2 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-neutral-300 truncate">{activity.action}</p>
                                    <p className="text-xs text-neutral-500 truncate">{activity.item}</p>
                                    <p className="text-xs text-neutral-600 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-6 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                }}
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            💡 Consejo del día
                        </h3>
                        <p className="text-neutral-300 text-sm">
                            Las propiedades con fotos de alta calidad reciben un 40% más de consultas.
                            Asegúrate de subir imágenes profesionales para maximizar el interés.
                        </p>
                    </div>
                    <Link
                        href="/admin/propiedades"
                        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                            color: '#0a0a1a',
                        }}
                    >
                        Gestionar Propiedades
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
