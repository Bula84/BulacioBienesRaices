'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Building2,
    TrendingUp,
    MessageSquare,
    Scale,
    Star,
    ArrowUpRight,
    Mail,
} from 'lucide-react';
import {
    getPropiedades,
    getContactMessages,
    getLegalCases,
    ContactMessage,
    LegalCase,
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const quickActions = [
    {
        label: 'Agregar Propiedad',
        href: '/admin/propiedades',
        icon: Building2,
        description: 'Publicar una nueva propiedad',
    },
    {
        label: 'Casos Gestión Legal',
        href: '/admin/gestion-legal',
        icon: Scale,
        description: 'Ver consultas de cobranza',
    },
    {
        label: 'Publicaciones',
        href: '/admin/publicaciones',
        icon: TrendingUp,
        description: 'Programar contenido en redes',
    },
];

function formatearFecha(iso: string) {
    try {
        const d = new Date(iso);
        const diff = Date.now() - d.getTime();
        const min = Math.floor(diff / 60000);
        if (min < 1) return 'Hace instantes';
        if (min < 60) return `Hace ${min} min`;
        const h = Math.floor(min / 60);
        if (h < 24) return `Hace ${h} h`;
        const dias = Math.floor(h / 24);
        if (dias === 1) return 'Ayer';
        if (dias < 30) return `Hace ${dias} días`;
        return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return '';
    }
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [propiedades, setPropiedades] = useState(0);
    const [destacadas, setDestacadas] = useState(0);
    const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
    const [casos, setCasos] = useState<LegalCase[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            const [props, msgs, cases] = await Promise.all([
                getPropiedades(),
                getContactMessages(),
                getLegalCases(),
            ]);

            if (!activo) return;

            setPropiedades(props.length);
            setDestacadas(props.filter((p) => p.is_featured).length);
            setMensajes(msgs.slice(0, 5));
            setCasos(cases.filter((c) => c.status === 'nuevo').slice(0, 5));
            setCargando(false);
        };

        cargar();
        return () => {
            activo = false;
        };
    }, []);

    const stats = [
        {
            label: 'Propiedades publicadas',
            value: cargando ? '…' : String(propiedades),
            icon: Building2,
            color: '#0d9488',
        },
        {
            label: 'Destacadas en portada',
            value: cargando ? '…' : String(destacadas),
            icon: Star,
            color: '#b8863b',
        },
        {
            label: 'Mensajes recibidos',
            value: cargando ? '…' : String(mensajes.length),
            icon: Mail,
            color: '#8b5cf6',
        },
        {
            label: 'Casos legales nuevos',
            value: cargando ? '…' : String(casos.length),
            icon: Scale,
            color: '#ef4444',
        },
    ];

    const actividad = [
        ...mensajes.map((m) => ({
            id: `m-${m.id}`,
            titulo: m.subject,
            detalle: `${m.name} · ${m.email}`,
            fecha: m.created_at,
            icono: MessageSquare,
            href: '/admin/configuracion',
        })),
        ...casos.map((c) => ({
            id: `c-${c.id}`,
            titulo: `Caso de cobranza — ${c.debtor_name || c.contact_name}`,
            detalle: `${c.contact_name} · ${c.days_overdue ?? '—'} días de mora`,
            fecha: c.created_at,
            icono: Scale,
            href: '/admin/gestion-legal',
        })),
    ]
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        .slice(0, 6);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2 font-headings">Dashboard</h1>
                <p className="text-[var(--text-secondary)] font-medium">
                    Bienvenido{user?.email ? `, ${user.email.split('@')[0]}` : ''} al panel de administración de
                    Bulacio Bienes Raíces
                </p>
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
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: `${stat.color}15` }}
                            >
                                <Icon className="w-6 h-6" style={{ color: stat.color }} />
                            </div>
                            <p className="text-2xl font-bold text-[var(--text-main)] mb-1">{stat.value}</p>
                            <p className="text-sm text-[var(--text-secondary)] font-medium">{stat.label}</p>
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
                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 font-headings">
                        Acciones Rápidas
                    </h2>
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
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50">
                                            <Icon className="w-5 h-5 text-[var(--primary-blue)]" />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--primary-blue)] transition-colors" />
                                    </div>
                                    <p className="font-bold text-[var(--text-main)] mb-1">{action.label}</p>
                                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                                        {action.description}
                                    </p>
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
                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-6 font-headings">
                        Actividad Reciente
                    </h2>

                    {cargando ? (
                        <p className="text-sm text-[var(--text-secondary)]">Cargando…</p>
                    ) : actividad.length === 0 ? (
                        <div className="text-center py-6">
                            <MessageSquare className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                            <p className="text-sm text-[var(--text-secondary)]">
                                Todavía no hay mensajes ni casos nuevos.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {actividad.map((a) => {
                                const Icon = a.icono;
                                return (
                                    <Link
                                        key={a.id}
                                        href={a.href}
                                        className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0 hover:opacity-75 transition-opacity"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-4 h-4 text-[var(--primary-blue)]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[var(--text-main)] font-medium truncate">
                                                {a.titulo}
                                            </p>
                                            <p className="text-xs text-[var(--text-secondary)] truncate">
                                                {a.detalle}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 font-medium">
                                                {formatearFecha(a.fecha)}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
