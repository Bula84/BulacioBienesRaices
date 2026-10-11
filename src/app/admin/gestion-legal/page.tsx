'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    RefreshCw,
    Mail,
    Phone,
    CalendarDays,
    ChevronDown,
    Inbox,
    CheckCircle2,
} from 'lucide-react';
import { getLegalCases, updateLegalCase, LegalCase } from '@/lib/supabase';

const INK = '#0b1f3a';
const ACCENT = '#b8863b';

const ESTADOS: { v: LegalCase['status']; l: string; color: string }[] = [
    { v: 'nuevo', l: 'Nuevo', color: '#ef4444' },
    { v: 'en_revision', l: 'En revisión', color: '#f59e0b' },
    { v: 'contactado', l: 'Contactado', color: '#0d9488' },
    { v: 'cerrado', l: 'Cerrado', color: '#64748b' },
];

const ETAPAS: Record<string, string> = {
    extrajudicial: 'Extrajudicial',
    judicial: 'Judicial',
    sin_determinar: 'Sin determinar',
};

const CONTRATOS: Record<string, string> = {
    alquiler: 'Alquiler',
    expensas: 'Expensas',
    servicios: 'Servicios',
    fondo_comercio: 'Fondo de comercio',
    otro: 'Otro',
};

export default function AdminGestionLegalPage() {
    const [casos, setCasos] = useState<LegalCase[]>([]);
    const [cargando, setCargando] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [filtro, setFiltro] = useState<'todos' | LegalCase['status']>('todos');
    const [abierto, setAbierto] = useState<string | null>(null);

    const recargar = async () => {
        setBuscando(true);
        const data = await getLegalCases();
        setCasos(data);
        setBuscando(false);
    };

    useEffect(() => {
        // Carga inicial: sin setState síncrono dentro del effect
        let activo = true;
        getLegalCases().then((data) => {
            if (!activo) return;
            setCasos(data);
            setCargando(false);
        });
        return () => {
            activo = false;
        };
    }, []);

    const cambiarEstado = async (id: string, status: LegalCase['status']) => {
        setCasos((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        await updateLegalCase(id, { status, is_read: true });
    };

    const marcarLeido = async (c: LegalCase) => {
        if (c.is_read) return;
        setCasos((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_read: true } : x)));
        await updateLegalCase(c.id, { is_read: true });
    };

    const visibles = casos.filter((c) => filtro === 'todos' || c.status === filtro);
    const nuevos = casos.filter((c) => c.status === 'nuevo').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: INK, color: ACCENT }}
                        >
                            <Scale className="w-5 h-5" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-main)] font-headings">
                            Gestión Legal
                        </h1>
                    </div>
                    <p className="text-[var(--text-secondary)] font-medium">
                        Consultas de cobranza de mora recibidas desde el sitio.
                        {nuevos > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-red-500">
                                {nuevos} sin revisar
                            </span>
                        )}
                    </p>
                </div>

                <button
                    onClick={recargar}
                    disabled={cargando || buscando}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-[var(--text-main)] hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)] transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${buscando ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                {(['todos', ...ESTADOS.map((e) => e.v)] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f as typeof filtro)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            filtro === f
                                ? 'text-white'
                                : 'bg-white border border-gray-200 text-[var(--text-secondary)] hover:border-gray-300'
                        }`}
                        style={filtro === f ? { background: INK } : undefined}
                    >
                        {f === 'todos'
                            ? `Todos (${casos.length})`
                            : `${ESTADOS.find((e) => e.v === f)?.l} (${casos.filter((c) => c.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {cargando ? (
                <div className="p-12 rounded-2xl bg-white border border-gray-100 text-center text-[var(--text-secondary)]">
                    Cargando casos…
                </div>
            ) : visibles.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white border border-gray-100 text-center">
                    <Inbox className="w-10 h-10 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No hay casos aquí</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Cuando alguien complete el formulario de <code>/gestion-legal</code> va a aparecer en esta
                        bandeja.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {visibles.map((c, i) => {
                        const estado = ESTADOS.find((e) => e.v === c.status)!;
                        const expandido = abierto === c.id;
                        return (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.04, 0.3) }}
                                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
                                style={{
                                    borderLeft: `4px solid ${c.is_read ? '#e5e7eb' : ACCENT}`,
                                }}
                            >
                                {/* Fila principal */}
                                <button
                                    onClick={() => {
                                        setAbierto(expandido ? null : c.id);
                                        marcarLeido(c);
                                    }}
                                    className="w-full text-left px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span
                                                className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                                                style={{ background: estado.color }}
                                            >
                                                {estado.l}
                                            </span>
                                            {!c.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                            <span className="text-xs text-gray-400 font-medium">
                                                {new Date(c.created_at).toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                        <p className="font-bold text-[var(--text-main)] truncate">
                                            {c.debtor_name
                                                ? `Cobranza a ${c.debtor_name}`
                                                : `Consulta de ${c.contact_name}`}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] truncate">
                                            {c.contact_name} · {c.contact_email}
                                            {c.days_overdue != null && ` · ${c.days_overdue} días de mora`}
                                            {c.amount != null && ` · USD ${c.amount.toLocaleString('es-AR')}`}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span
                                            className="px-3 py-1 rounded-lg text-xs font-bold"
                                            style={{ background: `${ACCENT}22`, color: '#7c5a22' }}
                                        >
                                            {ETAPAS[c.stage] ?? c.stage}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-400 transition-transform ${expandido ? 'rotate-180' : ''}`}
                                        />
                                    </div>
                                </button>

                                {/* Detalle expandido */}
                                {expandido && (
                                    <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="space-y-2 text-sm">
                                                <p className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                    <Mail className="w-4 h-4" />
                                                    <a
                                                        href={`mailto:${c.contact_email}`}
                                                        className="hover:text-[var(--primary-blue)]"
                                                    >
                                                        {c.contact_email}
                                                    </a>
                                                </p>
                                                {c.contact_phone && (
                                                    <p className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                        <Phone className="w-4 h-4" />
                                                        <a
                                                            href={`https://wa.me/${c.contact_phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-[var(--primary-blue)]"
                                                        >
                                                            {c.contact_phone}
                                                        </a>
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-2 text-[var(--text-secondary)]">
                                                    <CalendarDays className="w-4 h-4" />
                                                    {new Date(c.created_at).toLocaleDateString('es-AR')}
                                                </p>
                                                <p className="text-[var(--text-secondary)]">
                                                    <span className="font-bold text-[var(--text-main)]">Rol:</span>{' '}
                                                    {c.contact_role || '—'}
                                                </p>
                                                <p className="text-[var(--text-secondary)]">
                                                    <span className="font-bold text-[var(--text-main)]">
                                                        Contrato:
                                                    </span>{' '}
                                                    {CONTRATOS[c.contract_type ?? ''] ?? '—'}
                                                </p>
                                                <p className="text-[var(--text-secondary)]">
                                                    <span className="font-bold text-[var(--text-main)]">
                                                        Notificado:
                                                    </span>{' '}
                                                    {c.notified_at ? 'Sí (email al asesor)' : 'No'}
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                                        Relato
                                                    </p>
                                                    <p className="text-sm text-[var(--text-main)] whitespace-pre-line">
                                                        {c.details || '—'}
                                                    </p>
                                                </div>
                                                {c.ai_summary && (
                                                    <div
                                                        className="p-4 rounded-xl border"
                                                        style={{ background: `${ACCENT}12`, borderColor: `${ACCENT}40` }}
                                                    >
                                                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#7c5a22' }}>
                                                            Resumen del asistente IA
                                                        </p>
                                                        <p className="text-sm text-slate-800 whitespace-pre-line">
                                                            {c.ai_summary}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cambio de estado */}
                                        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">
                                                Estado:
                                            </span>
                                            {ESTADOS.map((e) => (
                                                <button
                                                    key={e.v}
                                                    onClick={() => cambiarEstado(c.id, e.v)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        c.status === e.v
                                                            ? 'text-white shadow-sm'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                    style={c.status === e.v ? { background: e.color } : undefined}
                                                >
                                                    {e.l}
                                                </button>
                                            ))}
                                            <a
                                                href={`mailto:${c.contact_email}?subject=${encodeURIComponent('Caso de cobranza — ' + (c.debtor_name || c.contact_name))}`}
                                                className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                                                style={{ background: INK }}
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                                                Responder por email
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
