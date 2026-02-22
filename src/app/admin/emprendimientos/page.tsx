'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    MapPin,
    DollarSign,
    Building2,
    Calendar,
    Image as ImageIcon,
    CheckCircle,
    Info,
    Layout
} from 'lucide-react';
import {
    Emprendimiento,
    getEmprendimientos,
    getEmprendimientosByUser,
    createEmprendimiento,
    updateEmprendimiento,
    deleteEmprendimiento
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const emptyEmprendimiento: Omit<Emprendimiento, 'id' | 'created_at' | 'updated_at'> = {
    title: '',
    location: '',
    status: '',
    delivery: '',
    price_start: 0,
    description: '',
    image_url: '',
    features: [],
};

export default function AdminEmprendimientosPage() {
    const { user, isSuperAdmin } = useAuth();
    const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmprendimiento, setEditingEmprendimiento] = useState<Emprendimiento | null>(null);
    const [formData, setFormData] = useState(emptyEmprendimiento);
    const [isLoading, setIsLoading] = useState(true);
    const [newFeature, setNewFeature] = useState('');

    useEffect(() => {
        if (user) {
            loadEmprendimientos();
        }
    }, [user, isSuperAdmin]);

    const loadEmprendimientos = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            let data: Emprendimiento[];

            if (isSuperAdmin) {
                // SuperAdmin sees all? Or we can just use getEmprendimientos for everyone for now if RLS allows
                // But typically Admin sees all
                data = await getEmprendimientos();
            } else {
                // Regular admin sees their own
                data = await getEmprendimientosByUser(user.id);
            }

            setEmprendimientos(data && data.length > 0 ? data : []);
        } catch (error) {
            console.log('Error loading emprendimientos');
            setEmprendimientos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEmprendimientos = emprendimientos.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (emprendimiento?: Emprendimiento) => {
        if (emprendimiento) {
            if (!isSuperAdmin && emprendimiento.user_id !== user?.id) {
                alert('No tienes permisos para editar este emprendimiento');
                return;
            }

            setEditingEmprendimiento(emprendimiento);
            setFormData({
                title: emprendimiento.title || '',
                location: emprendimiento.location || '',
                status: emprendimiento.status || '',
                delivery: emprendimiento.delivery || '',
                price_start: emprendimiento.price_start || 0,
                description: emprendimiento.description || '',
                image_url: emprendimiento.image_url || '',
                features: emprendimiento.features || [],
            });
        } else {
            setEditingEmprendimiento(null);
            setFormData(emptyEmprendimiento);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEmprendimiento(null);
        setFormData(emptyEmprendimiento);
        setNewFeature('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            if (editingEmprendimiento) {
                const updated = await updateEmprendimiento(editingEmprendimiento.id, formData);
                if (updated) {
                    setEmprendimientos(emprendimientos.map(item => item.id === editingEmprendimiento.id ? updated : item));
                }
            } else {
                const newData = {
                    ...formData,
                    user_id: user.id
                };
                const created = await createEmprendimiento(newData);
                if (created) {
                    setEmprendimientos([created, ...emprendimientos]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving emprendimiento:', error);
        }
    };

    const handleDelete = async (emprendimiento: Emprendimiento) => {
        if (!isSuperAdmin && emprendimiento.user_id !== user?.id) {
            alert('No tienes permisos para eliminar este emprendimiento');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este emprendimiento?')) return;

        try {
            const success = await deleteEmprendimiento(emprendimiento.id);
            if (success) {
                setEmprendimientos(emprendimientos.filter(item => item.id !== emprendimiento.id));
            }
        } catch (error) {
            console.error('Error deleting emprendimiento:', error);
        }
    };

    const addFeature = () => {
        if (newFeature && !formData.features?.includes(newFeature)) {
            setFormData({
                ...formData,
                features: [...(formData.features || []), newFeature]
            });
            setNewFeature('');
        }
    };

    const removeFeature = (feature: string) => {
        setFormData({
            ...formData,
            features: formData.features?.filter(f => f !== feature)
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] font-headings">Emprendimientos</h1>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">
                        Gestiona los proyectos y desarrollos inmobiliarios
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 text-white shadow-md shadow-teal-500/20"
                    style={{
                        background: '#0d9488', // Teal 600
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredEmprendimientos.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48 bg-gray-100">
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 rounded-lg bg-white/90 backdrop-blur hover:bg-white text-gray-600 hover:text-[#0d9488] shadow-sm transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-2 rounded-lg bg-white/90 backdrop-blur hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/50 backdrop-blur rounded-lg">
                                    <span className="text-white text-xs font-bold uppercase tracking-wide">
                                        {item.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-lg text-[var(--text-main)] mb-1 line-clamp-1">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">{item.location}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm font-medium mb-4 pb-4 border-b border-gray-50">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{item.delivery || 'Sin fecha'}</span>
                                    </div>
                                    <span className="text-[#0d9488] font-bold">
                                        Desde USD {item.price_start?.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {item.features?.slice(0, 3).map((feature, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-50 text-[var(--text-secondary)] text-xs rounded-md border border-gray-100">
                                            {feature}
                                        </span>
                                    ))}
                                    {(item.features?.length || 0) > 3 && (
                                        <span className="px-2 py-1 bg-gray-50 text-[var(--text-secondary)] text-xs rounded-md border border-gray-100">
                                            +{(item.features?.length || 0) - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {!isLoading && filteredEmprendimientos.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Layout className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-[var(--text-main)]">No hay proyectos</h3>
                    <p className="text-[var(--text-secondary)] mb-6">Comienza creando tu primer desarrollo inmobiliario.</p>
                    <button
                        onClick={() => openModal()}
                        className="btn-primary"
                    >
                        Crear Proyecto
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-main)] font-headings">
                                    {editingEmprendimiento ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Nombre del Proyecto *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                        placeholder="Ej: Altos del Lago"
                                        required
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                            Estado *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                            placeholder="Ej: En Pozo, Preventa, etc."
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                            Fecha de Entrega
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.delivery}
                                            onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                            placeholder="Ej: Diciembre 2026"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Ubicación *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                            placeholder="Ej: Villa Allende, Córdoba"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Precio Desde (USD)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="number"
                                            value={formData.price_start}
                                            onChange={(e) => setFormData({ ...formData, price_start: parseFloat(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all resize-none"
                                        placeholder="Descripción detallada del proyecto..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Imagen Principal (URL)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                        Características
                                    </label>
                                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mb-3">
                                        <input
                                            type="text"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                            className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                                            placeholder="Agregar característica (ej: Seguridad, Gas Natural)"
                                        />
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.features?.map((feature, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-[#0d9488] rounded-full text-sm font-medium"
                                            >
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(feature)}
                                                    className="hover:text-red-500 ml-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
                                    >
                                        {editingEmprendimiento ? 'Guardar Cambios' : 'Crear Proyecto'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
