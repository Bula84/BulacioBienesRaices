'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle, Building2 } from 'lucide-react';
import { getContactInfo, submitContactMessage, ContactInfo } from '@/lib/supabase';

const asuntos = [
    'Quiero publicar en la plataforma',
    'Consulta sobre propiedades',
    'Consulta sobre fondos de comercio',
    'Consulta sobre gestión legal y cobranza de mora',
    'Tasación de inmueble',
    'Soporte técnico',
    'Otro',
];

export default function ContactoPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: asuntos[0],
        message: '',
        source: 'contacto',
    });

    useEffect(() => {
        getContactInfo().then(setContactInfo);
    }, []);

    const [cooldown, setCooldown] = useState(false);

    const sanitize = (str: string) => str.trim().replace(/<[^>]*>/g, ''); // strip HTML tags

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown) return;

        // Sanitize all fields
        const sanitized = {
            name: sanitize(formData.name),
            email: sanitize(formData.email).toLowerCase(),
            phone: sanitize(formData.phone),
            company: sanitize(formData.company),
            subject: sanitize(formData.subject),
            message: sanitize(formData.message),
            source: 'contacto',
        };

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized.email)) {
            return; // HTML required will catch it, but this is a safety net
        }

        // Validate message length
        if (sanitized.message.length < 10) {
            return;
        }
        if (sanitized.message.length > 2000) {
            alert('El mensaje no puede superar los 2000 caracteres.');
            return;
        }

        setEnviando(true);
        try {
            const ok = await submitContactMessage(sanitized);
            if (ok) {
                setEnviado(true);
                setFormData({ name: '', email: '', phone: '', company: '', subject: asuntos[0], message: '', source: 'contacto' });
                // 60-second cooldown to prevent spam
                setCooldown(true);
                setTimeout(() => setCooldown(false), 60_000);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setEnviando(false);
        }
    };


    const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[#f3ead9] transition-all text-[0.9375rem] font-medium";

    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-20">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #16345c 70%, #0b1f3a 100%)' }}>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-[100px]" style={{ background: 'var(--accent-color)' }} />
                    <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'var(--primary-hover)' }} />
                </div>
                <div className="absolute inset-0 opacity-[0.06] pattern-grid-lg" />
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'var(--accent-color)' }}>
                            <MessageCircle className="w-8 h-8" style={{ color: '#0b1f3a' }} />
                        </div>
                        <h1 className="display-xl !text-white mb-4">
                            Contactanos
                        </h1>
                        <p className="lead !text-slate-300 max-w-2xl mx-auto">
                            ¿Querés publicar en nuestra plataforma o tenés alguna consulta? Completá el formulario y te respondemos a la brevedad.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

                        {/* Formulario */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            {enviado ? (
                                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-lg">
                                    <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">¡Mensaje Enviado!</h2>
                                    <p className="text-[var(--text-secondary)] font-medium mb-8 max-w-md mx-auto">
                                        Gracias por contactarnos. Un asesor se comunicará con vos en las próximas horas hábiles.
                                    </p>
                                    <button
                                        onClick={() => setEnviado(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-white transition-all"
                                        style={{ background: 'var(--primary-blue)' }}
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-lg">
                                    <h2 className="text-xl font-bold text-[var(--text-main)] mb-6">Enviar consulta</h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Nombre completo *</label>
                                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Tu nombre" required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Email *</label>
                                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="tu@email.com" required />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Teléfono</label>
                                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+54 11 1234-5678" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Empresa / Corralón</label>
                                                <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} placeholder="Nombre de tu empresa (opcional)" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Asunto *</label>
                                            <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClass} required>
                                                {asuntos.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-bold text-[var(--text-main)]">Mensaje *</label>
                                                <span className={`text-xs font-medium ${formData.message.length > 1800 ? 'text-amber-500' : 'text-gray-400'}`}>
                                                    {formData.message.length}/2000
                                                </span>
                                            </div>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className={`${inputClass} min-h-[150px] resize-y`}
                                                placeholder="Contános cómo podemos ayudarte..."
                                                maxLength={2000}
                                                minLength={10}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={enviando || cooldown}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base"
                                            style={{ background: cooldown ? '#64748b' : 'var(--primary-blue)' }}
                                        >
                                            <Send className="w-5 h-5" />
                                            {enviando ? 'Enviando...' : cooldown ? 'Espera 60s para reenviar' : 'Enviar Mensaje'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>

                        {/* Sidebar Contacto */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Datos de Contacto */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                                <h3 className="text-lg font-bold text-[var(--text-main)] mb-6">Información de Contacto</h3>
                                <div className="space-y-5">
                                    {contactInfo?.phone && (
                                        <a href={`tel:${contactInfo.phone}`} className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: 'rgba(184, 134, 59, 0.12)' }}>
                                                <Phone className="w-5 h-5" style={{ color: 'var(--accent-dark)' }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)]">Teléfono</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contactInfo.phone}</p>
                                            </div>
                                        </a>
                                    )}
                                    {contactInfo?.whatsapp && (
                                        <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                                <MessageCircle className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)]">WhatsApp</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contactInfo.whatsapp}</p>
                                            </div>
                                        </a>
                                    )}
                                    {contactInfo?.email && (
                                        <a href={`mailto:${contactInfo.email}`} className="flex items-start gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)]">Email</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contactInfo.email}</p>
                                            </div>
                                        </a>
                                    )}
                                    {contactInfo?.address && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                                <MapPin className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)]">Dirección</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contactInfo.address}</p>
                                            </div>
                                        </div>
                                    )}
                                    {contactInfo?.business_hours && (
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--text-main)]">Horario de Atención</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contactInfo.business_hours}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="rounded-3xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #0b1f3a, #16345c)' }}>
                                <Building2 className="w-10 h-10 mb-4 opacity-80" />
                                <h3 className="text-lg font-bold mb-2">¿Querés publicar tu propiedad?</h3>
                                <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                    Publicá tu propiedad o fondo de comercio en nuestra plataforma y llegá a miles de compradores e inversores.
                                </p>
                                <div className="text-[0.8125rem] font-medium" style={{ color: 'var(--accent-light)' }}>
                                    Seleccioná &quot;Quiero publicar en la plataforma&quot; en el formulario y contanos qué ofrecés.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
