'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle, Building2 } from 'lucide-react';
import { getContactInfo, submitContactMessage, ContactInfo } from '@/lib/supabase';

const asuntos = [
    'Quiero publicar en la plataforma',
    'Consulta sobre propiedades',
    'Consulta sobre servicios profesionales',
    'Oportunidad comercial / convenio',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            const ok = await submitContactMessage(formData);
            if (ok) {
                setEnviado(true);
                setFormData({ name: '', email: '', phone: '', company: '', subject: asuntos[0], message: '', source: 'contacto' });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setEnviando(false);
        }
    };

    const inputClass = "w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm font-medium";

    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-20">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-teal-900 py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-20 w-96 h-96 bg-[var(--primary-blue)] rounded-full blur-[120px]" />
                </div>
                <div className="container relative z-10 mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#0d9488] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-500/30">
                            <MessageCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold !text-white mb-4 font-headings leading-tight">
                            Contactanos
                        </h1>
                        <p className="text-lg md:text-xl !text-teal-100 max-w-2xl mx-auto font-medium">
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
                                        className="px-6 py-3 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-all"
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
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">Mensaje *</label>
                                            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputClass} min-h-[150px] resize-y`} placeholder="Contanos cómo podemos ayudarte..." required />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={enviando}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/20 disabled:opacity-50 text-base"
                                        >
                                            <Send className="w-5 h-5" />
                                            {enviando ? 'Enviando...' : 'Enviar Mensaje'}
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
                                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                                                <Phone className="w-5 h-5 text-[#0d9488]" />
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
                            <div className="bg-gradient-to-br from-[#0d9488] to-[#0f766e] rounded-3xl p-8 text-white">
                                <Building2 className="w-10 h-10 mb-4 opacity-80" />
                                <h3 className="text-lg font-bold mb-2">¿Querés publicar?</h3>
                                <p className="text-sm text-teal-100 mb-4 leading-relaxed">
                                    Publicá tus materiales, ofertas o servicios profesionales en nuestra plataforma y llegá a miles de constructores y arquitectos.
                                </p>
                                <div className="text-xs text-teal-200 font-medium">
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
