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
    Box,
    AlertCircle,
    Home
} from 'lucide-react';
import {
    Oportunidad,
    getOportunidades,
    createOportunidad,
    updateOportunidad,
    deleteOportunidad
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import FileUploader from '@/components/FileUploader';
import CustomSelect from '@/components/CustomSelect';

const emptyOportunidad: Omit<Oportunidad, 'id' | 'created_at'> = {
    title: '',
    description: '',
    full_description: '',
    price: 0,
    discount: 0,
    image_url: '',
    images: [],
    category: '',
    seller_name: '',
    contact_phone: '',
    contact_email: '',
    location: '',
    is_featured: false
};

const CATEGORIES = [
    'Materiales',
    'Herramientas',
    'Maquinaria',
    'Sobrantes de Obra',
    'Mobiliario',
    'Otros'
];

export default function AdminOportunidadesPage() {
    const { user, isSuperAdmin } = useAuth();
    const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Oportunidad | null>(null);
    const [formData, setFormData] = useState(emptyOportunidad);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'contact'>('basic');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; item: Oportunidad | null }>({ open: false, item: null });

    useEffect(() => {
        if (user) {
            loadOportunidades();
        }
    }, [user, isSuperAdmin]);

    const loadOportunidades = async () => {
        setIsLoading(true);
        try {
            const data = await getOportunidades();
            setOportunidades(data || []);
        } catch (error) {
            console.error('Error loading oportunidades:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = oportunidades.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (item?: Oportunidad) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description,
                full_description: item.full_description || '',
                price: item.price || 0,
                discount: item.discount || 0,
                image_url: item.image_url || '',
                images: item.images || [],
                category: item.category,
                seller_name: item.seller_name,
                contact_phone: item.contact_phone || '',
                contact_email: item.contact_email || '',
                location: item.location || '',
                is_featured: item.is_featured || false
            });
        } else {
            setEditingItem(null);
            setFormData(emptyOportunidad);
        }
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(emptyOportunidad);
        setActiveTab('basic');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            if (editingItem) {
                const updated = await updateOportunidad(editingItem.id, formData);
                if (updated) {
                    setOportunidades(oportunidades.map(o => o.id === editingItem.id ? updated : o));
                }
            } else {
                const created = await createOportunidad(formData);
                if (created) {
                    setOportunidades([created, ...oportunidades]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving oportunidad:', error);
        }
    };

    const handleDelete = (item: Oportunidad) => {
        setDeleteConfirm({ open: true, item });
    };

    const confirmDelete = async () => {
        const item = deleteConfirm.item;
        if (!item) return;
        setDeleteConfirm({ open: false, item: null });

        try {
            const success = await deleteOportunidad(item.id);
            if (success) {
                setOportunidades(prev => prev.filter(o => o.id !== item.id));
            }
        } catch (error) {
            console.error('Error deleting oportunidad:', error);
        }
    };

    const canEdit = () => {
        // En este modelo asumimos que sólo un Admin / SuperAdmin general puede acceder a Oportunidades
        // Por lo cual todos en esta vista pueden editar. Se podría refinar más adelante.
        return true;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] font-headings">Oportunidades</h1>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">Gestión del Marketplace (Bazar / Remates)</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 hover:scale-105 text-white shadow-md shadow-teal-500/20"
                    style={{ background: '#0d9488' }}
                >
                    <Plus className="w-5 h-5" />
                    Nueva Oportunidad
                </button>
            </div>

            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar oportunidades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                />
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0d9488] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)]">Cargando oportunidades...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Oportunidad</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Categoría</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Precio</th>
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
                                                    <p className="text-xs text-[var(--text-secondary)] font-medium">{item.seller_name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-teal-50 text-[#0d9488]">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-[var(--text-main)] font-bold">
                                                {item.price ? `$${item.price.toLocaleString('es-AR')}` : 'Consultar'}
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
                        <Box className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)] font-medium">No se encontraron oportunidades</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={closeModal} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-main)] font-headings">
                                    {editingItem ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
                                </h2>
                                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100">
                                {[
                                    { id: 'basic', label: 'Básico' },
                                    { id: 'images', label: 'Imágenes' },
                                    { id: 'contact', label: 'Contacto' },
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
                                            <label className="block text-sm font-bold mb-2">Título *</label>
                                            <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Lote de porcelanatos" />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Categoría *</label>
                                                <CustomSelect options={CATEGORIES.map(c => ({ value: c, label: c }))} value={formData.category} onChange={val => setFormData({ ...formData, category: val })} required placeholder="Seleccionar" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Ubicación</label>
                                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Ej: Av.ellaneda, Quilmes" />
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Precio (ARS)</label>
                                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Descuento (%)</label>
                                                <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Vendedor / Proveedor *</label>
                                            <input required type="text" value={formData.seller_name} onChange={e => setFormData({ ...formData, seller_name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="Nombre completo o Empresa" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Descripción Corta *</label>
                                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" rows={2} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Descripción Completa</label>
                                            <textarea value={formData.full_description} onChange={e => setFormData({ ...formData, full_description: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" rows={4} />
                                        </div>
                                        <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border bg-teal-50 border-teal-200">
                                            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                                            <div>
                                                <span className="font-bold text-[#0d9488]">Destacar</span>
                                                <span className="block text-sm text-teal-700/80">Mostrar como oportunidad principal</span>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {activeTab === 'images' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Imagen Principal *</label>
                                            <FileUploader folder="oportunidades" accept="images" multiple={false} onUpload={(url) => setFormData({ ...formData, image_url: url })} />
                                            {formData.image_url && <img src={formData.image_url} alt="Portada" className="mt-4 h-32 rounded-xl border border-gray-200 object-cover" />}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Galería Extra</label>
                                            <FileUploader folder="oportunidades" accept="images" multiple={true} onUpload={(url) => setFormData({ ...formData, images: [...formData.images || [], url] })} />
                                            {formData.images && formData.images.length > 0 && (
                                                <div className="flex gap-2 mt-4 flex-wrap">
                                                    {formData.images.map((img, i) => (
                                                        <div key={i} className="relative group">
                                                            <img src={img} className="h-20 w-20 object-cover rounded shadow" alt="Extra" />
                                                            <button type="button" onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, idx) => idx !== i) })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Teléfono de Contacto</label>
                                            <input type="tel" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="+54 9 11 1234-5678" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Email de Contacto</label>
                                            <input type="email" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200" placeholder="ventas@proveedor.com" />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 flex justify-end gap-3 mt-8 border-t border-gray-100">
                                    <button type="button" onClick={closeModal} className="px-6 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-colors">Cancelar</button>
                                    <button type="submit" className="px-6 py-2.5 rounded-xl text-white font-bold bg-[#0d9488] hover:bg-[#0f766e] transition-all">Guardar Localmente</button>
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
                            <h3 className="text-xl font-bold mb-2 text-gray-900 text-center">¿Eliminar oportunidad?</h3>
                            <p className="text-gray-500 text-center mb-6">Esta acción no se puede deshacer.</p>
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
