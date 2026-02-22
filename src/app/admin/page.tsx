'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Building2,
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
        color: '#2194CF',
    },
    {
        label: 'Visitas Totales',
        value: '12,847',
        change: '+18% vs mes anterior',
        trend: 'up',
        icon: Eye,
        color: '#8b5cf6',
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
        label: 'Registrar Servicio',
        href: '/admin/servicios',
        icon: Wrench,
        description: 'Agregar un nuevo profesional',
    },
];

const recentActivity = [
    { action: 'Nueva propiedad agregada', item: 'Departamento en Puerto Madero', time: 'Hace 2 horas' },
    { action: 'Propiedad reservada', item: 'Casa en Pilar', time: 'Hace 5 horas' },
    { action: 'Nuevo servicio', item: 'Juan Pérez - Electricista', time: 'Ayer' },
    { action: 'Propiedad actualizada', item: 'Casa en Nordelta', time: 'Hace 2 días' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2 font-headings">Dashboard</h1>
                <p className="text-[var(--text-secondary)] font-medium">Bienvenido al panel de administración de Antigravity Enterprise</p>
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
                            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
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
                                <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12%</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[var(--text-main)] mb-1">{stat.value}</p>
                            <p className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-2 font-medium">{stat.change}</p>
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
                    className="lg:col-span-2 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 font-headings">Acciones Rápidas</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="group p-5 rounded-xl transition-all duration-200 hover:-translate-y-1 bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50"
                                        >
                                            <Icon className="w-5 h-5 text-[var(--primary-blue)]" />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--primary-blue)] transition-colors" />
                                    </div>
                                    <p className="font-bold text-[var(--text-main)] mb-1">{action.label}</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">{action.description}</p>
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
                    className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 font-headings">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                            >
                                <div
                                    className="w-2 h-2 mt-2 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, #2194CF 0%, #1A7AB0 100%)',
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--text-main)] font-medium truncate">{activity.action}</p>
                                    <p className="text-xs text-[var(--text-secondary)] truncate">{activity.item}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">{activity.time}</p>
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
                className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--text-main)] mb-2 font-headings">
                            💡 Consejo del día
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm font-medium">
                            Las propiedades con fotos de alta calidad reciben un 40% más de consultas.
                            Asegúrate de subir imágenes profesionales para maximizar el interés.
                        </p>
                    </div>
                    <Link
                        href="/admin/propiedades"
                        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 text-white shadow-md shadow-blue-500/20"
                        style={{
                            background: 'var(--primary-blue)',
                        }}
                    >
                        Gestionar Propiedades
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
