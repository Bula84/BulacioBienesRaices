'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit, Trash2, X, Wrench, Star, Image, Video, Award, Settings, Eye, Phone, Mail, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    Servicio, getServicios, createServicio, updateServicio, deleteServicio
} from '@/lib/supabase';
import StarRating from '@/components/StarRating';
import FileUploader from '@/components/FileUploader';

const categories = [
    'Electricidad', 'Plomería', 'Carpintería', 'Pintura',
    'Climatización', 'Jardinería', 'Limpieza', 'Albañilería',
    'Herrería', 'Durlock/Yeso', 'Pisos y Revestimientos', 'Arquitectura',
    'Ingeniería', 'Diseño de Interiores', 'Mudanzas', 'Otro',
];

const emptyForm = {
    name: '',
    skill_tags: [] as string[],
    contact: '',
    phone: '',
    email: '',
    rating: 5,
    image_url: '',
    images: [] as string[],
    video_url: '',
    category: '',
    description: '',
    full_description: '',
    budget_info: '',
    techniques: [] as string[],
    certifications: [] as string[],
};

export default function AdminServiciosPage() {
    const [services, setServices] = useState<Servicio[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [skillInput, setSkillInput] = useState('');
    const [certInput, setCertInput] = useState('');
    const [techInput, setTechInput] = useState('');
    const [imageInput, setImageInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'media' | 'skills'>('info');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null; name: string }>({ open: false, id: null, name: '' });

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        try {
            const data = await getServicios();
            if (data.length > 0) setServices(data);
        } catch (error) {
            console.log('Using mock data');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skill_tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const openModal = (servicio?: Servicio) => {
        if (servicio) {
            setEditingServicio(servicio);
            setFormData({
                name: servicio.name,
                skill_tags: servicio.skill_tags || [],
                contact: servicio.contact || '',
                phone: servicio.phone || '',
                email: servicio.email || '',
                rating: servicio.rating,
                image_url: servicio.image_url || '',
                images: servicio.images || [],
                video_url: servicio.video_url || '',
                category: servicio.category,
                description: servicio.description || '',
                full_description: servicio.full_description || '',
                budget_info: servicio.budget_info || '',
                techniques: servicio.techniques || [],
                certifications: servicio.certifications || [],
            });
        } else {
            setEditingServicio(null);
            setFormData(emptyForm);
        }
        setActiveTab('info');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingServicio(null);
        setFormData(emptyForm);
        setSkillInput(''); setCertInput(''); setTechInput(''); setImageInput('');
    };

    const addToList = (field: 'skill_tags' | 'certifications' | 'techniques' | 'images', value: string, setter: (v: string) => void) => {
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
            setter('');
        }
    };

    const removeFromList = (field: 'skill_tags' | 'certifications' | 'techniques' | 'images', value: string) => {
        setFormData({ ...formData, [field]: formData[field].filter(s => s !== value) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingServicio) {
                const updated = await updateServicio(editingServicio.id, formData);
                if (updated) setServices(services.map(s => s.id === editingServicio.id ? updated : s));
            } else {
                const created = await createServicio(formData as any);
                if (created) setServices([created, ...services]);
            }
            closeModal();
        } catch (error) {
            console.error('Error saving servicio:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteConfirm({ open: true, id, name });
    };

    const confirmDelete = async () => {
        const id = deleteConfirm.id;
        if (!id) return;
        setDeleteConfirm({ open: false, id: null, name: '' });
        try {
            const success = await deleteServicio(id);
            if (success) {
                setServices(services.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting servicio:', error);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ open: false, id: null, name: '' });
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm";
    const labelClass = "block text-sm font-bold text-[var(--text-main)] mb-2";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Servicios Profesionales</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Gestiona el directorio de profesionales con perfiles completos</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-teal-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Profesional
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar profesionales..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Total</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{services.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Con fotos</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{services.filter(s => s.image_url).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Con video</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{services.filter(s => s.video_url).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Categorías</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{new Set(services.map(s => s.category)).size}</p>
                </div>
            </div>

            {/* Cards Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-medium">No se encontraron profesionales</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredServices.map((service) => (
                        <motion.div
                            key={service.id}
                            layout
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 p-4">
                                {/* Avatar */}
                                <div
                                    className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 bg-gray-100"
                                    style={{
                                        backgroundImage: service.image_url ? `url(${service.image_url})` : undefined,
                                    }}
                                >
                                    {!service.image_url && (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
                                            {service.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-[var(--text-main)] truncate">{service.name}</h3>
                                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-50 text-[#0d9488]">
                                            {service.category}
                                        </span>
                                        {service.video_url && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                                                <Video className="w-3 h-3" /> Video
                                            </span>
                                        )}
                                        {(service.images?.length ?? 0) > 0 && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-600">
                                                <Image className="w-3 h-3" /> {service.images?.length} fotos
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-secondary)]">
                                        <StarRating rating={service.rating} size="sm" showValue />
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate">{service.email || service.phone || 'Sin contacto'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => setExpandedRow(expandedRow === service.id ? null : service.id)}
                                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[var(--text-main)] transition-colors"
                                    >
                                        {expandedRow === service.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => openModal(service)}
                                        className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0d9488] transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id, service.name)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded details */}
                            <AnimatePresence>
                                {expandedRow === service.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100 overflow-hidden"
                                    >
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Habilidades</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {service.skill_tags?.map((tag, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-white border border-gray-200 text-[var(--text-secondary)]">{tag}</span>
                                                    ))}
                                                    {(!service.skill_tags || service.skill_tags.length === 0) && <span className="text-xs text-gray-400 italic">Sin habilidades</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Certificaciones</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {service.certifications?.map((cert, i) => (
                                                        <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700">
                                                            <Award className="w-3 h-3" />{cert}
                                                        </span>
                                                    ))}
                                                    {(!service.certifications || service.certifications.length === 0) && <span className="text-xs text-gray-400 italic">Sin certificaciones</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Contacto</p>
                                                <div className="space-y-1 text-sm">
                                                    {service.phone && <p className="flex items-center gap-2 text-[var(--text-secondary)]"><Phone className="w-3 h-3" />{service.phone}</p>}
                                                    {service.email && <p className="flex items-center gap-2 text-[var(--text-secondary)]"><Mail className="w-3 h-3" />{service.email}</p>}
                                                </div>
                                            </div>
                                            {service.description && (
                                                <div className="md:col-span-3">
                                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Descripción</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">{service.description}</p>
                                                </div>
                                            )}
                                            {service.images && service.images.length > 0 && (
                                                <div className="md:col-span-3">
                                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Galería de Trabajos</p>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {service.images.map((img, i) => (
                                                            <div key={i} className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 border border-gray-200" style={{ backgroundImage: `url(${img})` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={closeModal} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl bg-white border border-gray-200 shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-[var(--text-main)]">
                                    {editingServicio ? 'Editar Profesional' : 'Nuevo Profesional'}
                                </h2>
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="px-6 pt-4 flex gap-1 border-b border-gray-100">
                                {[
                                    { key: 'info' as const, label: 'Información', icon: Settings },
                                    { key: 'media' as const, label: 'Fotos y Video', icon: Image },
                                    { key: 'skills' as const, label: 'Habilidades y Certificaciones', icon: Award },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-colors border-b-2 -mb-px ${activeTab === tab.key
                                            ? 'text-[#0d9488] border-[#0d9488] bg-teal-50/50'
                                            : 'text-[var(--text-secondary)] border-transparent hover:text-[var(--text-main)] hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Tab: Info */}
                                {activeTab === 'info' && (
                                    <>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Nombre *</label>
                                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Nombre del profesional" required />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Categoría *</label>
                                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass} required>
                                                    <option value="">Seleccionar categoría</option>
                                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClass}>Teléfono *</label>
                                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="+54 11 1234-5678" required />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Email</label>
                                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="email@ejemplo.com" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Descripción Breve *</label>
                                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Resumen breve del profesional (se muestra en la tarjeta)" required />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Descripción Completa</label>
                                            <textarea value={formData.full_description} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} className={`${inputClass} min-h-[120px] resize-y`} placeholder="Descripción detallada para la página del perfil..." />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Información de Presupuestos</label>
                                            <textarea value={formData.budget_info} onChange={(e) => setFormData({ ...formData, budget_info: e.target.value })} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Ej: Presupuestos sin cargo, se realizan visitas a domicilio..." />
                                        </div>

                                        <div>
                                            <label className={labelClass}>Rating</label>
                                            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                <input type="range" min="1" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="flex-1 accent-amber-400" />
                                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                    <span className="font-bold text-[var(--text-main)]">{formData.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Tab: Media */}
                                {activeTab === 'media' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Foto de Perfil</label>
                                            {formData.image_url && (
                                                <div className="mb-3 w-24 h-24 rounded-xl bg-cover bg-center border-2 border-gray-200 relative group" style={{ backgroundImage: `url(${formData.image_url})` }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image_url: '' })}
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                            <FileUploader
                                                folder="servicios"
                                                accept="images"
                                                multiple={false}
                                                compact={!!formData.image_url}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                                                helperText="JPG, PNG, WebP • Máx. 50MB"
                                            />
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400 mb-1">O pegá una URL:</p>
                                                <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={`${inputClass} text-sm`} placeholder="https://..." />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Galería de Trabajos</label>
                                            <p className="text-xs text-[var(--text-secondary)] mb-2">Subí fotos de trabajos realizados</p>
                                            <FileUploader
                                                folder="servicios"
                                                accept="images"
                                                multiple={true}
                                                compact={true}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                                helperText="Subí múltiples fotos a la vez"
                                            />
                                            <div className="flex gap-2 mt-3">
                                                <input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('images', imageInput, setImageInput))} className={`${inputClass} flex-1 text-sm`} placeholder="O pegá una URL de imagen" />
                                                <button type="button" onClick={() => addToList('images', imageInput, setImageInput)} className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors text-sm flex-shrink-0">
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {formData.images.length > 0 && (
                                                <div className="flex flex-wrap gap-3 mt-3">
                                                    {formData.images.map((img, i) => (
                                                        <div key={i} className="relative group">
                                                            <div className="w-24 h-24 rounded-xl bg-cover bg-center border-2 border-gray-200" style={{ backgroundImage: `url(${img})` }} />
                                                            <button type="button" onClick={() => removeFromList('images', img)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className={labelClass}>Video de Presentación</label>
                                            <p className="text-xs text-[var(--text-secondary)] mb-2">Subí un video o pegá un link de YouTube</p>
                                            <FileUploader
                                                folder="servicios"
                                                accept="videos"
                                                multiple={false}
                                                compact={true}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
                                                helperText="MP4, WebM • Máx. 50MB"
                                            />
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400 mb-1">O pegá un link:</p>
                                                <input type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} className={`${inputClass} text-sm`} placeholder="https://youtube.com/watch?v=..." />
                                            </div>
                                            {formData.video_url && (
                                                <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                    <Video className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm text-blue-700 font-medium truncate flex-1">{formData.video_url}</span>
                                                    <button type="button" onClick={() => setFormData({ ...formData, video_url: '' })} className="p-1 rounded hover:bg-blue-100 text-blue-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Tab: Skills */}
                                {activeTab === 'skills' && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Habilidades / Servicios que ofrece</label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('skill_tags', skillInput, setSkillInput))} className={`${inputClass} flex-1`} placeholder="Ej: Instalaciones eléctricas" />
                                                <button type="button" onClick={() => addToList('skill_tags', skillInput, setSkillInput)} className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors text-sm flex-shrink-0">Agregar</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skill_tags.map((skill, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-teal-50 text-[#0d9488] border border-teal-200">
                                                        {skill}
                                                        <button type="button" onClick={() => removeFromList('skill_tags', skill)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Certificaciones y Cursos</label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={certInput} onChange={(e) => setCertInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('certifications', certInput, setCertInput))} className={`${inputClass} flex-1`} placeholder="Ej: Matriculado COPIME" />
                                                <button type="button" onClick={() => addToList('certifications', certInput, setCertInput)} className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors text-sm flex-shrink-0">Agregar</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.certifications.map((cert, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <Award className="w-3 h-3" />{cert}
                                                        <button type="button" onClick={() => removeFromList('certifications', cert)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>Técnicas / Especialidades</label>
                                            <div className="flex gap-2 mb-3">
                                                <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList('techniques', techInput, setTechInput))} className={`${inputClass} flex-1`} placeholder="Ej: Instalación split inverter" />
                                                <button type="button" onClick={() => addToList('techniques', techInput, setTechInput)} className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors text-sm flex-shrink-0">Agregar</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.techniques.map((tech, i) => (
                                                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                                        <Settings className="w-3 h-3" />{tech}
                                                        <button type="button" onClick={() => removeFromList('techniques', tech)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                                    >
                                        {isSaving ? 'Guardando...' : editingServicio ? 'Guardar Cambios' : 'Registrar Profesional'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Eliminar profesional</h3>
                                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de eliminar a <strong>{deleteConfirm.name}</strong>?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button onClick={cancelDelete} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                                <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Sí, eliminar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
