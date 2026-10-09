'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings, Save, Phone, Mail, MapPin, Clock, MessageCircle,
    Inbox, Trash2, Eye, EyeOff, CheckCircle, X, Building2, ChevronDown, ChevronUp,
    Share2, Facebook, Instagram, Video
} from 'lucide-react';
import {
    ContactInfo, getContactInfo, updateContactInfo,
    ContactMessage, getContactMessages, markMessageRead, deleteContactMessage,
    SocialMediaConfig, getSocialMediaConfigs, upsertSocialMediaConfig
} from '@/lib/supabase';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export default function AdminConfigPage() {
    const [pestana, setPestana] = useState<'contacto' | 'mensajes' | 'redes'>('contacto');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '', email: '', whatsapp: '', address: '', business_hours: '',
    });
    const [mensajes, setMensajes] = useState<ContactMessage[]>([]);
    const [socialConfigs, setSocialConfigs] = useState<SocialMediaConfig[]>([]);
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
            const [info, msgs, socials] = await Promise.all([
                getContactInfo(),
                getContactMessages(),
                getSocialMediaConfigs()
            ]);
            setContactInfo(info);
            setMensajes(msgs);
            // Default setup if not present
            const defSocials = [
                { platform: 'facebook', is_active: false },
                { platform: 'instagram', is_active: false },
                { platform: 'tiktok', is_active: false },
            ] as SocialMediaConfig[];

            const mergedSocials = defSocials.map(def => {
                const found = socials.find(s => s.platform === def.platform);
                return found ? found : def;
            });
            setSocialConfigs(mergedSocials);
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

    const handleGuardarRedes = async (config: SocialMediaConfig) => {
        setGuardando(true);
        try {
            const ok = await upsertSocialMediaConfig(config);
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

    const updateSocialConfig = (platform: string, field: string, value: any) => {
        setSocialConfigs(prev => prev.map(c =>
            c.platform === platform ? { ...c, [field]: value } : c
        ));
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
                <button
                    onClick={() => setPestana('redes')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${pestana === 'redes' ? 'bg-white text-[var(--text-main)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)]'}`}
                >
                    <Share2 className="w-4 h-4" />
                    Redes Sociales
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

            {/* Pestaña: Redes Sociales */}
            {pestana === 'redes' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-w-3xl"
                >
                    {socialConfigs.map(config => (
                        <div key={config.platform} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${config.platform === 'facebook' ? 'bg-[#1877F2]' :
                                        config.platform === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]' :
                                            'bg-black'
                                        }`}>
                                        {config.platform === 'facebook' && <Facebook className="w-6 h-6" />}
                                        {config.platform === 'instagram' && <Instagram className="w-6 h-6" />}
                                        {config.platform === 'tiktok' && <TikTokIcon className="w-6 h-6" />}
                                    </div>
                                    <div className="capitalize">
                                        <h2 className="font-bold text-[var(--text-main)] text-lg">{config.platform}</h2>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            {config.platform === 'facebook' && 'Configura el Page ID y Access Token'}
                                            {config.platform === 'instagram' && 'Configura el Account ID (debe estar enlazado a Facebook)'}
                                            {config.platform === 'tiktok' && 'Configura las credenciales de TikTok Developer'}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Switch */}
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={config.is_active}
                                            onChange={(e) => updateSocialConfig(config.platform, 'is_active', e.target.checked)}
                                        />
                                        <div className={`block w-14 h-8 rounded-full transition-colors ${config.is_active ? 'bg-[#0d9488]' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config.is_active ? 'transform translate-x-6' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-1">Access Token</label>
                                    <input
                                        type="password"
                                        value={config.access_token || ''}
                                        onChange={(e) => updateSocialConfig(config.platform, 'access_token', e.target.value)}
                                        className={inputClass}
                                        placeholder="EAAI..."
                                    />
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Token de acceso de larga duración (Long-Lived Access Token)</p>
                                </div>

                                {config.platform === 'facebook' && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-1">Page ID (ID de la página)</label>
                                        <input
                                            type="text"
                                            value={config.page_id || ''}
                                            onChange={(e) => updateSocialConfig(config.platform, 'page_id', e.target.value)}
                                            className={inputClass}
                                            placeholder="1234567890"
                                        />
                                    </div>
                                )}

                                {config.platform === 'instagram' && (
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-1">Instagram Business Account ID</label>
                                        <input
                                            type="text"
                                            value={config.account_id || ''}
                                            onChange={(e) => updateSocialConfig(config.platform, 'account_id', e.target.value)}
                                            className={inputClass}
                                            placeholder="1234567890"
                                        />
                                    </div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={() => handleGuardarRedes(config)}
                                        disabled={guardando}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[#0d9488] bg-teal-50 hover:bg-teal-100 transition-all duration-200"
                                    >
                                        <Save className="w-4 h-4" />
                                        Guardar Credenciales
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
