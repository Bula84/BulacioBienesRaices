'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Wrench,
    Star
} from 'lucide-react';
import {
    Servicio,
    getServicios,
    createServicio,
    updateServicio,
    deleteServicio
} from '@/lib/supabase';
import StarRating from '@/components/StarRating';

// Mock data
const mockServices: Servicio[] = [
    {
        id: '1',
        name: 'Juan Pérez',
        skill_tags: ['Instalaciones eléctricas', 'Reparaciones', 'Iluminación LED'],
        contact: '+54 11 1234-5678',
        phone: '+541112345678',
        email: 'juan.perez@email.com',
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
        category: 'Electricidad',
        description: 'Electricista matriculado con más de 15 años de experiencia.',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Roberto Gómez',
        skill_tags: ['Plomería general', 'Gas', 'Destapes'],
        contact: '+54 11 2345-6789',
        phone: '+541123456789',
        email: 'roberto@plomeria.com',
        rating: 4.9,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        category: 'Plomería',
        description: 'Gasista matriculado. Trabajos de plomería y gas con garantía.',
        created_at: new Date().toISOString(),
    },
];

const categories = [
    'Electricidad',
    'Plomería',
    'Carpintería',
    'Pintura',
    'Climatización',
    'Jardinería',
    'Limpieza',
    'Albañilería',
];

const emptyServicio = {
    name: '',
    skill_tags: [] as string[],
    contact: '',
    phone: '',
    email: '',
    rating: 5,
    image_url: '',
    category: '',
    description: '',
};

export default function AdminServiciosPage() {
    const [services, setServices] = useState<Servicio[]>(mockServices);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [formData, setFormData] = useState(emptyServicio);
    const [skillInput, setSkillInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await getServicios();
            if (data.length > 0) {
                setServices(data);
            }
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
                category: servicio.category,
                description: servicio.description || '',
            });
        } else {
            setEditingServicio(null);
            setFormData(emptyServicio);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingServicio(null);
        setFormData(emptyServicio);
        setSkillInput('');
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skill_tags.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skill_tags: [...formData.skill_tags, skillInput.trim()],
            });
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setFormData({
            ...formData,
            skill_tags: formData.skill_tags.filter(s => s !== skill),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingServicio) {
                const updated = await updateServicio(editingServicio.id, formData);
                if (updated) {
                    setServices(services.map(s => s.id === editingServicio.id ? updated : s));
                }
            } else {
                const created = await createServicio(formData as any);
                if (created) {
                    setServices([created, ...services]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving servicio:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este profesional?')) return;

        try {
            const success = await deleteServicio(id);
            if (success) {
                setServices(services.filter(s => s.id !== id));
            }
        } catch (error) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Servicios</h1>
                    <p className="text-neutral-400 text-sm">Gestiona el directorio de profesionales</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        color: 'white',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Profesional
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar profesionales..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#a855f7]/50 focus:ring-2 focus:ring-[#a855f7]/20 transition-all"
                />
            </div>

            {/* Table */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                <th className="text-left p-4 text-sm font-medium text-neutral-400">Profesional</th>
                                <th className="text-left p-4 text-sm font-medium text-neutral-400">Categoría</th>
                                <th className="text-left p-4 text-sm font-medium text-neutral-400">Habilidades</th>
                                <th className="text-left p-4 text-sm font-medium text-neutral-400">Rating</th>
                                <th className="text-left p-4 text-sm font-medium text-neutral-400">Contacto</th>
                                <th className="text-right p-4 text-sm font-medium text-neutral-400">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service) => (
                                <tr
                                    key={service.id}
                                    className="border-t border-white/5 hover:bg-white/[0.02]"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl bg-cover bg-center"
                                                style={{
                                                    backgroundImage: service.image_url
                                                        ? `url(${service.image_url})`
                                                        : 'linear-gradient(135deg, #a855f7, #ec4899)',
                                                }}
                                            />
                                            <span className="font-medium text-white text-sm">{service.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[#a855f7]/10 text-[#a855f7]"
                                        >
                                            {service.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1 max-w-xs">
                                            {service.skill_tags?.slice(0, 2).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-block px-2 py-0.5 text-xs rounded bg-white/5 text-neutral-400"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {service.skill_tags && service.skill_tags.length > 2 && (
                                                <span className="text-xs text-neutral-500">
                                                    +{service.skill_tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StarRating rating={service.rating} size="sm" showValue />
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-neutral-400">{service.email || service.contact || '-'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(service)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <Wrench className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400">No se encontraron profesionales</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl"
                            style={{
                                background: 'rgba(18, 18, 42, 0.98)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingServicio ? 'Editar Profesional' : 'Nuevo Profesional'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name & Category */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="Nombre del profesional"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Categoría
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="input-glass w-full"
                                            required
                                        >
                                            <option value="">Seleccionar categoría</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Habilidades
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                            className="input-glass flex-1"
                                            placeholder="Agregar habilidad"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skill_tags.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-1 hover:text-white"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="+54 11 1234-5678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="email@ejemplo.com"
                                        />
                                    </div>
                                </div>

                                {/* Rating & Image */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Rating (1-5)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                step="0.1"
                                                value={formData.rating}
                                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                                className="flex-1"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                                <span className="text-white font-medium">{formData.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            URL de imagen
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="input-glass w-full min-h-[100px] resize-y"
                                        placeholder="Descripción del profesional..."
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:bg-white/10 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                                            color: 'white',
                                        }}
                                    >
                                        {editingServicio ? 'Guardar Cambios' : 'Registrar Profesional'}
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
