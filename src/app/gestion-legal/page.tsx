'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    FileText,
    Gavel,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Phone,
    Mail,
    Clock,
} from 'lucide-react';
import LegalAssistant from '@/components/LegalAssistant';
import { submitLegalCase } from '@/lib/supabase';

const INK = '#0b1f3a';
const ACCENT = '#b8863b';
/** Dorado oscuro: para usar sobre fondos claros (blanco / slate-50).
 *  El dorado base (#b8863b) sobre blanco no llega al contraste AA para texto chico. */
const ACCENT_DARK = '#7c5a22';

const servicios = [
    {
        icon: FileText,
        titulo: 'Cobranza Extrajudicial',
        texto:
            'Notificaciones fehacientes, negociación directa y acuerdos de pago antes de iniciar cualquier juicio. La vía más rápida y económica para recuperar lo adeudado.',
        puntos: ['Cartas documento y notificaciones', 'Planes de pago', 'Seguimiento mensual del caso'],
    },
    {
        icon: Gavel,
        titulo: 'Cobranza Judicial',
        texto:
            'Cuando la vía previa no resuelve, iniciamos las acciones judiciales correspondientes: ejecución de instrumentos, cobro de deudas y desalojo por falta de pago.',
        puntos: ['Ejecución de pagaré o contrato', 'Desalojo por mora', 'Embargo y ejecución de sentencia'],
    },
    {
        icon: ShieldCheck,
        titulo: 'Asesoramiento Jurídico',
        texto:
            'Redacción y revisión de contratos de alquiler, convenios de expensas y garantías. Prevención de morosidad antes de que el problema aparezca.',
        puntos: ['Contratos y anexos', 'Garantías y cauciones', 'Auditoría documental'],
    },
];

const proceso = [
    { n: '01', t: 'Evaluación', d: 'Revisamos la deuda, la documentación y la antigüedad de la mora.' },
    { n: '02', t: 'Diagnóstico', d: 'Definimos si corresponde vía extrajudicial, judicial o preventiva.' },
    { n: '03', t: 'Acción', d: 'Notificamos, negociamos o iniciamos las acciones legales.' },
    { n: '04', t: 'Cobro', d: 'Seguimiento hasta la recuperación efectivo del crédito.' },
];

const CONTRATOS = ['alquiler', 'expensas', 'servicios', 'fondo_comercio', 'otro'];
const ETAPAS = [
    { v: 'sin_determinar', l: 'No estoy seguro/a' },
    { v: 'extrajudicial', l: 'Sin juicio (extrajudicial)' },
    { v: 'judicial', l: 'Ya hay juicio iniciado' },
];

export default function GestionLegalPage() {
    const [resumen, setResumen] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [ok, setOk] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        contact_role: 'propietario',
        debtor_name: '',
        contract_type: 'alquiler',
        amount: '',
        days_overdue: '',
        stage: 'sin_determinar',
        details: '',
    });

    const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const limpiar = (s: string) => s.trim().replace(/<[^>]*>/g, '');

        const contact_name = limpiar(form.contact_name);
        const contact_email = limpiar(form.contact_email);

        if (!contact_name || !contact_email || !form.details.trim()) {
            setError('Completá tu nombre, email y una descripción del caso.');
            return;
        }

        setSending(true);

        const enviado = await submitLegalCase(
            {
                contact_name,
                contact_email,
                contact_phone: limpiar(form.contact_phone) || undefined,
                contact_role: form.contact_role,
                debtor_name: limpiar(form.debtor_name) || undefined,
                contract_type: form.contract_type,
                amount: form.amount ? Number(form.amount) : undefined,
                days_overdue: form.days_overdue ? Number(form.days_overdue) : undefined,
                stage: form.stage as 'extrajudicial' | 'judicial' | 'sin_determinar',
                details: limpiar(form.details),
            },
            resumen
        );

        setSending(false);

        if (!enviado) {
            setError('No pudimos enviar el caso. Probá de nuevo o escribinos por email.');
            return;
        }

        setOk(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    return (
        <div className="bg-slate-50">
            {/* ============ HERO (sub-marca) ============ */}
            <section
                className="relative overflow-hidden pt-28 pb-24"
                style={{ background: `linear-gradient(140deg, ${INK} 0%, #16345c 60%, #0b1f3a 100%)` }}
            >
                <div
                    className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full blur-[140px] opacity-30"
                    style={{ background: ACCENT }}
                />
                <div className="absolute inset-0 opacity-[0.06] pattern-grid-lg" />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        {/* Wordmark sub-marca */}
                        <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                            <Scale className="w-4 h-4" style={{ color: ACCENT }} />
                            <span className="eyebrow text-slate-200">
                                Bulacio Bienes Raíces — <span style={{ color: ACCENT }}>Gestión Legal</span>
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            Cobranza de mora
                            <br />
                            <span style={{ color: ACCENT }}>extrajudicial y judicial</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
                            Seguimiento profesional de deudas en mora y asesoramiento jurídico integral.
                            Convertimos una cuenta por cobrar en un crédito recuperado, con estrategia,
                            documentación y seguimiento en cada etapa.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#caso"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0b1f3a] transition-all hover:scale-105 shadow-xl"
                                style={{ background: ACCENT }}
                            >
                                Contanos tu caso
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="#servicios"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white border border-white/25 hover:bg-white/10 transition-all"
                            >
                                Ver servicios
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ SERVICIOS ============ */}
            <section id="servicios" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-2xl mb-16">
                        <span
                            className="eyebrow mb-4 block"
                            style={{ color: ACCENT_DARK }}
                        >
                            Nuestros servicios
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
                            Tres frentes para recuperar tu crédito
                        </h2>
                        <p className="text-lg text-slate-600">
                            Trabajamos para propietarios, inmobiliarias y administraciones de consorcio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {servicios.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.div
                                    key={s.titulo}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all group"
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                                        style={{ background: `${INK}`, color: ACCENT }}
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{s.titulo}</h3>
                                    <p className="text-slate-600 leading-relaxed mb-5 text-sm">{s.texto}</p>
                                    <ul className="space-y-2">
                                        {s.puntos.map((p) => (
                                            <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                                                <CheckCircle2
                                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                                    style={{ color: ACCENT_DARK }}
                                                />
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ PROCESO ============ */}
            <section className="py-24" style={{ background: `${INK}` }}>
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span
                            className="eyebrow mb-4 block"
                            style={{ color: ACCENT }}
                        >
                            Cómo trabajamos
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                            Del diagnóstico al cobro
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {proceso.map((p, i) => (
                            <motion.div
                                key={p.n}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <span
                                    className="text-4xl font-extrabold block mb-4"
                                    style={{ color: ACCENT }}
                                >
                                    {p.n}
                                </span>
                                <h3 className="text-white font-bold mb-2">{p.t}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{p.d}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CASEN + ASISTENTE ============ */}
            <section id="caso" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <span
                            className="eyebrow mb-4 block"
                            style={{ color: ACCENT_DARK }}
                        >
                            Iniciemos
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
                            Contanos tu caso
                        </h2>
                        <p className="text-lg text-slate-600">
                            Hablá con el asistente o completá el formulario. Un asesor evalúa tu caso y te contacta.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Asistente */}
                        <div className="order-2 lg:order-1">
                            <LegalAssistant onResumen={setResumen} />
                            <p className="text-[0.8125rem] text-slate-500 mt-3 text-center">
                                El asistente recopila los datos del caso. La derivación final la hace el asesor humano.
                            </p>
                        </div>

                        {/* Formulario */}
                        <div className="order-1 lg:order-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-7 md:p-9">
                            {ok ? (
                                <div className="text-center py-10">
                                    <div
                                        className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                                        style={{ background: `${INK}`, color: ACCENT }}
                                    >
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 mb-3">
                                        Caso derivado correctamente
                                    </h3>
                                    <p className="text-slate-600 max-w-md mx-auto">
                                        Recibimos tu consulta y un asesor de Gestión Legal te va a contactar a la
                                        brevedad al email que nos dejaste.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="gl-name" className="block text-sm font-bold text-slate-800 mb-2">
                                                Tu nombre *
                                            </label>
                                            <input
                                                id="gl-name"
                                                type="text"
                                                value={form.contact_name}
                                                onChange={(e) => set('contact_name', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="Nombre y apellido"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gl-email" className="block text-sm font-bold text-slate-800 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                id="gl-email"
                                                type="email"
                                                value={form.contact_email}
                                                onChange={(e) => set('contact_email', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gl-phone" className="block text-sm font-bold text-slate-800 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                id="gl-phone"
                                                type="tel"
                                                value={form.contact_phone}
                                                onChange={(e) => set('contact_phone', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="+54 11 5555-5555"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gl-role" className="block text-sm font-bold text-slate-800 mb-2">
                                                ¿Quién consulta?
                                            </label>
                                            <select
                                                id="gl-role"
                                                value={form.contact_role}
                                                onChange={(e) => set('contact_role', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                            >
                                                <option value="propietario">Propietario/a</option>
                                                <option value="inmobiliaria">Inmobiliaria</option>
                                                <option value="administracion">Administración de consorcio</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-slate-500 mb-4 mt-4">
                                            Datos del caso
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="gl-debtor" className="block text-sm font-bold text-slate-800 mb-2">
                                                Deudor
                                            </label>
                                            <input
                                                id="gl-debtor"
                                                type="text"
                                                value={form.debtor_name}
                                                onChange={(e) => set('debtor_name', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="Nombre o razón social"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gl-contract" className="block text-sm font-bold text-slate-800 mb-2">
                                                Tipo de contrato
                                            </label>
                                            <select
                                                id="gl-contract"
                                                value={form.contract_type}
                                                onChange={(e) => set('contract_type', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                            >
                                                {CONTRATOS.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c === 'fondo_comercio'
                                                            ? 'Fondo de comercio'
                                                            : c.charAt(0).toUpperCase() + c.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="gl-amount" className="block text-sm font-bold text-slate-800 mb-2">
                                                Monto adeudado (USD)
                                            </label>
                                            <input
                                                id="gl-amount"
                                                type="number"
                                                min={0}
                                                value={form.amount}
                                                onChange={(e) => set('amount', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="gl-days" className="block text-sm font-bold text-slate-800 mb-2">
                                                Días de mora
                                            </label>
                                            <input
                                                id="gl-days"
                                                type="number"
                                                min={0}
                                                value={form.days_overdue}
                                                onChange={(e) => set('days_overdue', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="gl-stage" className="block text-sm font-bold text-slate-800 mb-2">
                                            Etapa actual
                                        </label>
                                        <select
                                            id="gl-stage"
                                            value={form.stage}
                                            onChange={(e) => set('stage', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all"
                                        >
                                            {ETAPAS.map((e) => (
                                                <option key={e.v} value={e.v}>
                                                    {e.l}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="gl-details" className="block text-sm font-bold text-slate-800 mb-2">
                                            Descripción del caso *
                                        </label>
                                        <textarea
                                            id="gl-details"
                                            rows={4}
                                            value={form.details}
                                            onChange={(e) => set('details', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-[#0b1f3a] focus:ring-2 focus:ring-[#0b1f3a]/10 transition-all resize-none"
                                            placeholder="Contanos brevemente la situación: desde cuándo adeuda, si hubo intentos de cobro, si hay contrato firmado, etc."
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-sm font-medium text-red-600">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                                        style={{ background: INK }}
                                    >
                                        {sending ? 'Enviando…' : 'Derivar caso al asesor'}
                                        {!sending && <ArrowRight className="w-5 h-5" style={{ color: ACCENT }} />}
                                    </button>

                                    <p className="text-[0.8125rem] text-slate-500 text-center leading-relaxed">
                                        Al enviar aceptás que un asesor se comunique con vos. No compartimos tus datos
                                        con terceros.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CONTACTO ============ */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Phone className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                            <div>
                                <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-slate-500">Teléfono</p>
                                <p className="text-slate-800 font-semibold">+54 11 1234-5678</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Mail className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                            <div>
                                <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-slate-500">Email</p>
                                <p className="text-slate-800 font-semibold">gestionlegal@bcbienesraices.com</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <Clock className="w-5 h-5" style={{ color: ACCENT_DARK }} />
                            <div>
                                <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-slate-500">Horario</p>
                                <p className="text-slate-800 font-semibold">Lunes a Viernes 9:00 – 18:00</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-[0.8125rem] text-slate-500 mt-10 text-center max-w-3xl mx-auto leading-relaxed">
                        La información provista por el asistente virtual tiene carácter orientativo y no constituye
                        asesoramiento jurídico. Toda estrategia de cobranza es definida por el profesional a cargo
                        luego de evaluar la documentación del caso.
                    </p>
                </div>
            </section>
        </div>
    );
}
