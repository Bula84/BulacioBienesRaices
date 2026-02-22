'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Save, Phone, Mail, MapPin, Clock, MessageCircle,
    Inbox, Trash2, Eye, EyeOff, CheckCircle, X, Building2, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    ContactInfo, getContactInfo, updateContactInfo,
    ContactMessage, getContactMessages, markMessageRead, deleteContactMessage
} from '@/lib/supabase';

export default function AdminConfigPage() {
    const [pestana, setPestana] = useState<'contacto' | 'mensajes'>('contacto');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '', email: '', whatsapp: '', address: '', business_hours: '',
    });
    const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [guardadoOk, setGuardadoOk] = useState(false);
    const [mensajeExpandido, setMensajeExpandido] = useState<string | null>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [info, msgs] = await Promise.all([getContactInfo(), getContactMessages()]);
            setContactInfo(info);
            setMensajes(msgs);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setCargando(false);
        }
    };

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            const ok = await updateContactInfo(contactInfo);
            if (ok) {
                setGuardadoOk(true);
                setTimeout(() => setGuardadoOk(false), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setGuardando(false);
        }
    };

    const handleMarcarLeido = async (id: string, leido: boolean) => {
        const ok = await markMessageRead(id, leido);
        if (ok) setMensajes(mensajes.map(m => m.id === id ? { ...m, is_read: leido } : m));
    };

    const handleEliminarMensaje = async (id: string) => {
        if (!confirm('¿Eliminar este mensaje?')) return;
        const ok = await deleteContactMessage(id);
        if (ok) setMensajes(mensajes.filter(m => m.id !== id));
    };

    const noLeidos = mensajes.filter(m => !m.is_read).length;
    const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm";

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-main)]">Configuración</h1>
                <p className="text-[var(--text-secondary)] text-sm">Datos de contacto del sitio y bandeja de mensajes</p>
            </div>

            {/* Pestañas */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setPestana('contacto')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${pestana === 'contacto' ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                >
                    <Settings className="w-4 h-4" />
                    Datos de Contacto
                </button>
                <button
                    onClick={() => setPestana('mensajes')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${pestana === 'mensajes' ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                >
                    <Inbox className="w-4 h-4" />
                    Mensajes
                    {noLeidos > 0 && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#0d9488] text-white">{noLeidos}</span>
                    )}
                </button>
            </div>

            {/* Pestaña: Datos de Contacto */}
            {pestana === 'contacto' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-[#0d9488]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[var(--text-main)]">Información de Contacto</h2>
                            <p className="text-xs text-[var(--text-secondary)]">Estos datos se muestran en la página de contacto y el footer</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-2">
                                    <Phone className="w-4 h-4 text-[#0d9488]" /> Teléfono
                                </label>
                                <input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} className={inputClass} placeholder="+54 11 1234-5678" />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-2">
                                    <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp
                                </label>
                                <input type="tel" value={contactInfo.whatsapp} onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })} className={inputClass} placeholder="+5411123456789 (solo números)" />
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-2">
                                <Mail className="w-4 h-4 text-blue-600" /> Email
                            </label>
                            <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} className={inputClass} placeholder="contacto@empresa.com" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-2">
                                <MapPin className="w-4 h-4 text-amber-600" /> Dirección
                            </label>
                            <input type="text" value={contactInfo.address} onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })} className={inputClass} placeholder="Av. Corrientes 1234, CABA" />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-main)] mb-2">
                                <Clock className="w-4 h-4 text-slate-600" /> Horario de Atención
                            </label>
                            <input type="text" value={contactInfo.business_hours} onChange={(e) => setContactInfo({ ...contactInfo, business_hours: e.target.value })} className={inputClass} placeholder="Lunes a Viernes 9:00 - 18:00" />
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={handleGuardar}
                                disabled={guardando}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {guardando ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            {guardadoOk && (
                                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                    <CheckCircle className="w-4 h-4" /> Guardado correctamente
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Pestaña: Mensajes */}
            {pestana === 'mensajes' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Total</p>
                            <p className="text-2xl font-bold text-[var(--text-main)]">{mensajes.length}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Sin leer</p>
                            <p className="text-2xl font-bold text-[#0d9488]">{noLeidos}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-xs text-[var(--text-secondary)] font-medium">Leídos</p>
                            <p className="text-2xl font-bold text-[var(--text-main)]">{mensajes.length - noLeidos}</p>
                        </div>
                    </div>

                    {cargando ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
                        </div>
                    ) : mensajes.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-[var(--text-secondary)] font-medium">No hay mensajes todavía</p>
                        </div>
                    ) : (
                        mensajes.map((msg) => (
                            <div key={msg.id} className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${msg.is_read ? 'border-gray-100' : 'border-[#0d9488]/30 shadow-sm'}`}>
                                <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => { setMensajeExpandido(mensajeExpandido === msg.id ? null : msg.id); if (!msg.is_read) handleMarcarLeido(msg.id, true); }}>
                                    {/* Indicador */}
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${msg.is_read ? 'bg-gray-200' : 'bg-[#0d9488]'}`} />

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className={`font-bold truncate ${msg.is_read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>{msg.name}</h3>
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-[var(--text-secondary)]">{msg.subject}</span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] truncate mt-0.5">{msg.message}</p>
                                    </div>

                                    {/* Fecha y acciones */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="text-xs text-gray-400 hidden sm:block">{new Date(msg.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        <button onClick={(e) => { e.stopPropagation(); handleMarcarLeido(msg.id, !msg.is_read); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)] transition-colors" title={msg.is_read ? 'Marcar como no leído' : 'Marcar como leído'}>
                                            {msg.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleEliminarMensaje(msg.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {mensajeExpandido === msg.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                    </div>
                                </div>

                                {/* Detalle expandido */}
                                <AnimatePresence>
                                    {mensajeExpandido === msg.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-gray-100 overflow-hidden"
                                        >
                                            <div className="p-5 bg-gray-50/50 space-y-3">
                                                <div className="grid sm:grid-cols-3 gap-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Email</p>
                                                        <a href={`mailto:${msg.email}`} className="text-sm text-[#0d9488] font-medium hover:underline">{msg.email}</a>
                                                    </div>
                                                    {msg.phone && (
                                                        <div>
                                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Teléfono</p>
                                                            <a href={`tel:${msg.phone}`} className="text-sm text-[#0d9488] font-medium hover:underline">{msg.phone}</a>
                                                        </div>
                                                    )}
                                                    {msg.company && (
                                                        <div>
                                                            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Empresa</p>
                                                            <p className="text-sm text-[var(--text-main)] font-medium">{msg.company}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Mensaje</p>
                                                    <p className="text-sm text-[var(--text-main)] leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gray-100">{msg.message}</p>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    Recibido: {new Date(msg.created_at).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    {msg.source !== 'contacto' && ` • Origen: ${msg.source}`}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </motion.div>
            )}
        </div>
    );
}
