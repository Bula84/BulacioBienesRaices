'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Building2,
    Briefcase
} from 'lucide-react';
import {
    Emprendimiento,
    getEmprendimientos,
    createEmprendimiento,
    updateEmprendimiento,
    deleteEmprendimiento
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import FileUploader from '@/components/FileUploader';
import CustomSelect from '@/components/CustomSelect';

const emptyEmprendimiento: Omit<Emprendimiento, 'id' | 'created_at'> = {
    title: '',
    location: '',
    status: 'en pozo',
    delivery: '',
    price_start: 0,
    description: '',
    image_url: '',
    features: []
};

const ESTADOS = [
    'En pozo',
    'En construcción',
    'Terminado',
    'Entregado'
];

export default function AdminEmprendimientosPage() {
    const { user, isSuperAdmin } = useAuth();
    const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Emprendimiento | null>(null);
    const [formData, setFormData] = useState(emptyEmprendimiento);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'features'>('basic');
    const [newFeature, setNewFeature] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; item: Emprendimiento | null }>({ open: false, item: null });

    useEffect(() => {
        if (user) {
            loadEmprendimientos();
        }
    }, [user, isSuperAdmin]);

    const loadEmprendimientos = async () => {
        setIsLoading(true);
        try {
            const data = await getEmprendimientos();
            setEmprendimientos(data || []);
        } catch (error) {
            console.error('Error loading emprendimientos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = emprendimientos.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (item?: Emprendimiento) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                location: item.location,
                status: item.status,
                delivery: item.delivery || '',
                price_start: item.price_start || 0,
                description: item.description || '',
                image_url: item.image_url || '',
                features: item.features || []
            });
        } else {
            setEditingItem(null);
            setFormData(emptyEmprendimiento);
        }
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(emptyEmprendimiento);
        setActiveTab('basic');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            if (editingItem) {
                const updated = await updateEmprendimiento(editingItem.id, formData);
                if (updated) {
                    setEmprendimientos(emprendimientos.map(e => e.id === editingItem.id ? updated : e));
                }
            } else {
                const created = await createEmprendimiento({ ...formData, user_id: user.id });
                if (created) {
                    setEmprendimientos([created, ...emprendimientos]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving emprendimiento:', error);
        }
    };

    const handleDelete = (item: Emprendimiento) => {
        setDeleteConfirm({ open: true, item });
    };

    const confirmDelete = async () => {
        const item = deleteConfirm.item;
        if (!item) return;
        setDeleteConfirm({ open: false, item: null });

        try {
            const success = await deleteEmprendimiento(item.id);
            if (success) {
                setEmprendimientos(prev => prev.filter(e => e.id !== item.id));
            }
        } catch (error) {
            console.error('Error deleting emprendimiento:', error);
        }
    };

    const addFeature = () => {
        if (newFeature && !formData.features?.includes(newFeature)) {
            setFormData({ ...formData, features: [...(formData.features || []), newFeature] });
            setNewFeature('');
        }
    };

    const canEdit = () => true;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] font-headings">Emprendimientos</h1>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Desarrollos en pozo, construcción o a estrenar</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 text-white shadow-md shadow-teal-500/20"
                    style={{ background: '#0d9488' }}
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Desarrollo
                </button>
            </div>

            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar emprendimientos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                />
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0d9488] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)]">Cargando desarrollos...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Emprendimiento</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Estado</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Entrega Aprox</th>
                                    <th className="text-right p-4 text-sm font-bold text-[var(--text-main)]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm border border-gray-100"
                                                    style={{ backgroundImage: item.image_url ? `url(${item.image_url})` : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' }}
                                                />
                                                <div>
                                                    <p className="font-bold text-[var(--text-main)] text-sm">{item.title}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] font-medium">{item.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-[#0d9488] uppercase">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-[var(--text-secondary)] font-medium">
                                                {item.delivery || 'Sin fecha'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit() ? (
                                                    <>
                                                        <button onClick={() => openModal(item)} className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0d9488]">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDelete(item)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)] font-medium">No se encontraron emprendimientos</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={closeModal} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-main)] font-headings">
                                    {editingItem ? 'Editar Emprendimiento' : 'Nuevo Emprendimiento'}
                                </h2>
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100">
                                {[
                                    { id: 'basic', label: 'Básico' },
                                    { id: 'images', label: 'Imágenes' },
                                    { id: 'features', label: 'Características' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-teal-50 text-[#0d9488]' : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-50'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {activeTab === 'basic' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Nombre del Proyecto *</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Torres del Parque" />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Estado *</label>
                                                <CustomSelect options={ESTADOS.map(s => ({ value: s, label: s }))} value={formData.status} onChange={val => setFormData({ ...formData, status: val })} required placeholder="Seleccionar" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Ubicación *</label>
                                                <input required type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Palermo Hollywood" />
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Precio desde (USD)</label>
                                                <input type="number" value={formData.price_start} onChange={e => setFormData({ ...formData, price_start: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Fecha Estimada de Entrega</label>
                                                <input type="text" value={formData.delivery} onChange={e => setFormData({ ...formData, delivery: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Diciembre 2026" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Descripción del Desarrollo</label>
                                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" rows={4} placeholder="Detalles arquitectónicos, zonas comunes, financiación..." />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'images' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Render o Foto Principal *</label>
                                            <FileUploader folder="emprendimientos" accept="images" multiple={false} onUpload={(url) => setFormData({ ...formData, image_url: url })} />
                                            {formData.image_url && <img src={formData.image_url} alt="Portada" className="mt-4 h-32 rounded-xl border border-gray-200 object-cover" />}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'features' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Lista de Características / Amenities</label>
                                            <div className="flex gap-2 mb-4">
                                                <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Piscina infinita, SUM equipado..." />
                                                <button type="button" onClick={addFeature} className="px-4 py-2 bg-gray-800 text-white rounded-xl">Add</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.features?.map((ft, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 text-teal-800 rounded-full font-medium text-sm">
                                                        {ft}
                                                        <button type="button" onClick={() => setFormData({ ...formData, features: formData.features?.filter((_, i) => i !== idx) })} className="hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 flex justify-end gap-3 mt-8 border-t border-gray-100">
                                    <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-colors">Cancelar</button>
                                    <button type="submit" className="px-6 py-2.5 rounded-xl text-white font-bold bg-[#0d9488] hover:bg-[#0f766e] transition-all">Guardar Emprendimiento</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deleteConfirm.open && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                            <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">¿Eliminar desarrollo?</h3>
                            <p className="text-gray-500 text-center mb-6">Se borrará de forma irreversible.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteConfirm({ open: false, item: null })} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600">Eliminar</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
