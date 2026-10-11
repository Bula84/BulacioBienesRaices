'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    Plus,
    Edit,
    Trash2,
    X,
    MapPin,
    DollarSign,
    Home,
    AlertCircle,
    Image as ImageIcon,
    Phone,
    Mail,
    MessageCircle
} from 'lucide-react';
import {
    Propiedad,
    getPropiedades,
    getPropiedadesByUser,
    createPropiedad,
    updatePropiedad,
    deletePropiedad
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import CustomSelect from '@/components/CustomSelect';
import FileUploader from '@/components/FileUploader';

const emptyProperty = {
    title: '',
    description: '',
    full_description: '',
    price: 0,
    operation: 'venta' as 'venta' | 'alquiler',
    type: '',
    m2: 0,
    m2_covered: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    floors: 1,
    year_built: new Date().getFullYear(),
    coords_lat: -34.6037,
    coords_lng: -58.3816,
    image_url: '',
    images: [] as string[],
    video_url: '',
    address: '',
    city: '',
    neighborhood: '',
    // Amenities
    has_pool: false,
    has_garden: false,
    has_terrace: false,
    has_balcony: false,
    has_gym: false,
    has_security: false,
    has_elevator: false,
    has_laundry: false,
    has_storage: false,
    has_ac: false,
    has_heating: false,
    pets_allowed: false,
    // Contact
    contact_phone: '',
    contact_whatsapp: '',
    contact_email: '',
    is_featured: false,
    // Agent / AI
    expensas: 0,
    requisitos: '',
    calendar_id: '',
    agent_enabled: false,
};

export default function AdminPropiedadesPage() {
    const { user, isSuperAdmin } = useAuth();
    const [properties, setProperties] = useState<Propiedad[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Propiedad | null>(null);
    const [formData, setFormData] = useState(emptyProperty);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'amenities' | 'images' | 'contact'>('basic');
    const [newImageUrl, setNewImageUrl] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; property: Propiedad | null }>({ open: false, property: null });

    useEffect(() => {
        if (user) {
            loadProperties();
        }
        // Recargamos cuando cambia el usuario o su rol; `loadProperties` lee
        // esos valores del closure a propósito (no queremos re-ejecutarlo en
        // cada render por cambios de estado internos del listado).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isSuperAdmin]);

    const loadProperties = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            let data: Propiedad[];

            if (isSuperAdmin) {
                data = await getPropiedades();
            } else {
                data = await getPropiedadesByUser(user.id);
            }

            setProperties(data.length > 0 ? data : []);
        } catch {
            console.log('Error loading properties');
            setProperties([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (property?: Propiedad) => {
        if (property) {
            if (!isSuperAdmin && property.user_id !== user?.id) {
                alert('No tienes permisos para editar esta propiedad');
                return;
            }

            setEditingProperty(property);
            setFormData({
                title: property.title || '',
                description: property.description || '',
                full_description: property.full_description || '',
                price: property.price || 0,
                operation: property.operation || 'venta',
                type: property.type || '',
                m2: property.m2 || 0,
                m2_covered: property.m2_covered || 0,
                bedrooms: property.bedrooms || 0,
                bathrooms: property.bathrooms || 0,
                parking: property.parking || 0,
                floors: property.floors || 1,
                year_built: property.year_built || new Date().getFullYear(),
                coords_lat: property.coords_lat || -34.6037,
                coords_lng: property.coords_lng || -58.3816,
                image_url: property.image_url || '',
                images: property.images || [],
                video_url: property.video_url || '',
                address: property.address || '',
                city: property.city || '',
                neighborhood: property.neighborhood || '',
                has_pool: property.has_pool || false,
                has_garden: property.has_garden || false,
                has_terrace: property.has_terrace || false,
                has_balcony: property.has_balcony || false,
                has_gym: property.has_gym || false,
                has_security: property.has_security || false,
                has_elevator: property.has_elevator || false,
                has_laundry: property.has_laundry || false,
                has_storage: property.has_storage || false,
                has_ac: property.has_ac || false,
                has_heating: property.has_heating || false,
                pets_allowed: property.pets_allowed || false,
                contact_phone: property.contact_phone || '',
                contact_whatsapp: property.contact_whatsapp || '',
                contact_email: property.contact_email || '',
                is_featured: property.is_featured || false,
                expensas: property.expensas || 0,
                requisitos: property.requisitos || '',
                calendar_id: property.calendar_id || '',
                agent_enabled: property.agent_enabled || false,
            });
        } else {
            setEditingProperty(null);
            setFormData(emptyProperty);
        }
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProperty(null);
        setFormData(emptyProperty);
        setActiveTab('basic');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        try {
            if (editingProperty) {
                const updated = await updatePropiedad(editingProperty.id, formData);
                if (updated) {
                    setProperties(properties.map(p => p.id === editingProperty.id ? updated : p));
                }
            } else {
                const propertyData = {
                    ...formData,
                    user_id: user.id,
                };
                const created = await createPropiedad(propertyData as Parameters<typeof createPropiedad>[0]);
                if (created) {
                    setProperties([created, ...properties]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    const handleDelete = (property: Propiedad) => {
        if (!isSuperAdmin && property.user_id !== user?.id) return;
        setDeleteConfirm({ open: true, property });
    };

    const confirmDelete = async () => {
        const property = deleteConfirm.property;
        if (!property) return;
        setDeleteConfirm({ open: false, property: null });

        try {
            const success = await deletePropiedad(property.id);
            if (success) {
                setProperties(prev => prev.filter(p => p.id !== property.id));
            }
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm({ open: false, property: null });
    };

    const addImage = () => {
        if (newImageUrl && !formData.images.includes(newImageUrl)) {
            setFormData({ ...formData, images: [...formData.images, newImageUrl] });
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        });
    };

    const canEditProperty = (property: Propiedad) => {
        return isSuperAdmin || property.user_id === user?.id;
    };

    const tabs: { id: 'basic' | 'details' | 'amenities' | 'images' | 'contact'; label: string }[] = [
        { id: 'basic', label: 'Básico' },
        { id: 'details', label: 'Detalles' },
        { id: 'amenities', label: 'Amenities' },
        { id: 'images', label: 'Imágenes' },
        { id: 'contact', label: 'Contacto' },
    ];

    const amenityOptions = [
        { key: 'has_pool', label: 'Piscina' },
        { key: 'has_garden', label: 'Jardín' },
        { key: 'has_terrace', label: 'Terraza' },
        { key: 'has_balcony', label: 'Balcón' },
        { key: 'has_gym', label: 'Gimnasio' },
        { key: 'has_security', label: 'Seguridad 24hs' },
        { key: 'has_elevator', label: 'Ascensor' },
        { key: 'has_laundry', label: 'Lavadero' },
        { key: 'has_storage', label: 'Baulera' },
        { key: 'has_ac', label: 'Aire Acondicionado' },
        { key: 'has_heating', label: 'Calefacción' },
        { key: 'pets_allowed', label: 'Acepta Mascotas' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] font-headings">Propiedades</h1>
                    <p className="text-[var(--text-secondary)] text-sm font-medium">
                        {isSuperAdmin
                            ? 'Gestiona todas las propiedades del sistema'
                            : 'Gestiona tus propiedades publicadas'}
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
                    Agregar Propiedad
                </button>
            </div>

            {/* Info for regular admins */}
            {!isSuperAdmin && (
                <div
                    className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-100"
                >
                    <AlertCircle className="w-5 h-5 text-[#0d9488] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[#0d9488] text-sm font-bold">Solo tus propiedades</p>
                        <p className="text-teal-600/80 text-sm font-medium">
                            Como administrador, solo puedes ver y gestionar las propiedades que tú has creado.
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar propiedades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                />
            </div>

            {/* Table */}
            <div
                className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
            >
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0d9488] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)]">Cargando propiedades...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Propiedad</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Tipo</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Operación</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Precio</th>
                                    <th className="text-left p-4 text-sm font-bold text-[var(--text-main)]">Ubicación</th>
                                    <th className="text-right p-4 text-sm font-bold text-[var(--text-main)]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.map((property) => (
                                    <tr
                                        key={property.id}
                                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0 shadow-sm border border-gray-100"
                                                    style={{
                                                        backgroundImage: property.image_url
                                                            ? `url(${property.image_url})`
                                                            : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-bold text-[var(--text-main)] text-sm">{property.title}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] font-medium">{property.m2} m²</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-[var(--text-secondary)] font-medium">{property.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${property.operation === 'venta'
                                                    ? 'bg-teal-50 text-[#0d9488]'
                                                    : 'bg-emerald-50 text-emerald-600'
                                                    }`}
                                            >
                                                {property.operation}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-[var(--text-main)] font-bold">
                                                ${property.price.toLocaleString('es-AR')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-[var(--text-secondary)] font-medium">{property.address || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEditProperty(property) ? (
                                                    <>
                                                        <button
                                                            onClick={() => openModal(property)}
                                                            className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0d9488] transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(property)}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Sin permisos</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)] font-medium">
                            {properties.length === 0
                                ? 'Aún no has creado ninguna propiedad'
                                : 'No se encontraron propiedades'}
                        </p>
                        {properties.length === 0 && (
                            <button
                                onClick={() => openModal()}
                                className="mt-4 px-4 py-2 rounded-lg text-sm font-bold text-[#0d9488] hover:bg-teal-50 transition-colors"
                            >
                                Crear tu primera propiedad
                            </button>
                        )}
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
                            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl bg-white shadow-2xl border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-main)] font-headings">
                                    {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                            ? 'bg-teal-50 text-[#0d9488]'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* TAB: Básico */}
                                {activeTab === 'basic' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Título *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                placeholder="Ej: Departamento de lujo en Puerto Madero"
                                                required
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Tipo de propiedad *
                                                </label>
                                                <CustomSelect
                                                    value={formData.type}
                                                    onChange={(value) => setFormData({ ...formData, type: value })}
                                                    options={[
                                                        { value: '', label: 'Seleccionar tipo' },
                                                        { value: 'Casa', label: 'Casa' },
                                                        { value: 'Departamento', label: 'Departamento' },
                                                        { value: 'Penthouse', label: 'Penthouse' },
                                                        { value: 'Loft', label: 'Loft' },
                                                        { value: 'Duplex', label: 'Duplex' },
                                                        { value: 'Local', label: 'Local Comercial' },
                                                        { value: 'Oficina', label: 'Oficina' },
                                                        { value: 'Terreno', label: 'Terreno' },
                                                        { value: 'Cochera', label: 'Cochera' },
                                                        { value: 'fondo_comercio', label: 'Fondo de Comercio' },
                                                    ]}
                                                    placeholder="Seleccionar tipo"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Operación *
                                                </label>
                                                <CustomSelect
                                                    value={formData.operation}
                                                    onChange={(value) => setFormData({ ...formData, operation: value as 'venta' | 'alquiler' })}
                                                    options={[
                                                        { value: 'venta', label: 'Venta' },
                                                        { value: 'alquiler', label: 'Alquiler' },
                                                    ]}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Precio (USD) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Descripción corta
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all resize-none font-medium"
                                                placeholder="Breve descripción para las tarjetas"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Descripción completa
                                            </label>
                                            <textarea
                                                value={formData.full_description}
                                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all resize-none font-medium"
                                                placeholder="Descripción detallada para la página de la propiedad..."
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border bg-teal-50 border-teal-200">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.is_featured as boolean}
                                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                                    className="w-5 h-5 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-[#0d9488]">Propiedad Destacada</span>
                                                    <span className="text-sm text-teal-700/80 font-medium">Mostrar esta propiedad en la sección de destacados de la página principal</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Detalles */}
                                {activeTab === 'details' && (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Superficie Total (m²)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.m2}
                                                    onChange={(e) => setFormData({ ...formData, m2: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Superficie Cubierta (m²)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.m2_covered}
                                                    onChange={(e) => setFormData({ ...formData, m2_covered: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Año de Construcción
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.year_built}
                                                    onChange={(e) => setFormData({ ...formData, year_built: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Dormitorios
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.bedrooms}
                                                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Baños
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.bathrooms}
                                                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Cocheras
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.parking}
                                                    onChange={(e) => setFormData({ ...formData, parking: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                    Pisos
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.floors}
                                                    onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 1 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <h3 className="text-sm font-bold text-[var(--text-main)] mb-4">Ubicación</h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        Dirección
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                            placeholder="Ej: Av. Libertador 1234"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        Barrio
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                        placeholder="Ej: Puerto Madero"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        Ciudad
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                        placeholder="Ej: Buenos Aires"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                    Latitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={formData.coords_lat}
                                                    onChange={(e) => setFormData({ ...formData, coords_lat: parseFloat(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                    Longitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={formData.coords_lng}
                                                    onChange={(e) => setFormData({ ...formData, coords_lng: parseFloat(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Amenities */}
                                {activeTab === 'amenities' && (
                                    <div className="space-y-4">
                                        <p className="text-[var(--text-secondary)] text-sm font-medium">Selecciona las características y amenities de la propiedad</p>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {amenityOptions.map(({ key, label }) => (
                                                <label
                                                    key={key}
                                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${formData[key as keyof typeof formData]
                                                        ? 'bg-teal-50 border-teal-200'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                        } border`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[key as keyof typeof formData] as boolean}
                                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                                        className="hidden"
                                                    />
                                                    <div
                                                        className={`w-5 h-5 rounded flex items-center justify-center ${formData[key as keyof typeof formData]
                                                            ? 'bg-[#0d9488] text-white'
                                                            : 'bg-gray-200 text-gray-400'
                                                            }`}
                                                    >
                                                        {formData[key as keyof typeof formData] && (
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={`font-medium ${formData[key as keyof typeof formData] ? 'text-[#0d9488]' : 'text-[var(--text-secondary)]'}`}>
                                                        {label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Imágenes */}
                                {activeTab === 'images' && (
                                    <div className="space-y-6">
                                        {/* --- Imagen Principal --- */}
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Imagen Principal
                                            </label>
                                            {formData.image_url && (
                                                <div className="mb-3 relative h-48 rounded-xl overflow-hidden border border-gray-200 group">
                                                    <Image src={formData.image_url} alt="Preview" width={800} height={600} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image_url: '' })}
                                                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                            <FileUploader
                                                folder="propiedades"
                                                accept="images"
                                                multiple={false}
                                                compact={!!formData.image_url}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                                                helperText="JPG, PNG, WebP • Máx. 50MB"
                                            />
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400 mb-1">O pegá una URL:</p>
                                                <input
                                                    type="text"
                                                    value={formData.image_url}
                                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium text-sm"
                                                    placeholder="https://ejemplo.com/imagen.jpg"
                                                />
                                            </div>
                                        </div>

                                        {/* --- Galería de Imágenes --- */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Galería de Imágenes
                                            </label>

                                            <FileUploader
                                                folder="propiedades"
                                                accept="images"
                                                multiple={true}
                                                compact={true}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                                                helperText="Subí múltiples fotos a la vez"
                                            />

                                            <div className="mt-3 flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium text-sm"
                                                    placeholder="O pegá una URL de imagen"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addImage}
                                                    disabled={!newImageUrl}
                                                    className="px-4 py-2.5 rounded-xl bg-[#0d9488] text-white font-bold disabled:opacity-50 hover:bg-teal-600 transition-colors text-sm"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                                {formData.images.map((url, index) => (
                                                    <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                                        <Image src={url} alt={`Gallery ${index}`} width={800} height={600} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {formData.images.length === 0 && (
                                                    <div className="col-span-full py-6 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm font-medium">No hay imágenes en la galería</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* --- Video --- */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Video Tour
                                            </label>

                                            <FileUploader
                                                folder="propiedades"
                                                accept="videos"
                                                multiple={false}
                                                compact={true}
                                                onUpload={(url) => setFormData(prev => ({ ...prev, video_url: url }))}
                                                helperText="MP4, WebM • Máx. 50MB"
                                            />

                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400 mb-1">O pegá un link de YouTube:</p>
                                                <input
                                                    type="text"
                                                    value={formData.video_url}
                                                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium text-sm"
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            </div>
                                            {formData.video_url && (
                                                <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                                                    <span className="text-xs text-emerald-700 font-medium truncate flex-1">✓ {formData.video_url}</span>
                                                    <button type="button" onClick={() => setFormData({ ...formData, video_url: '' })} className="p-1 rounded hover:bg-emerald-100 text-emerald-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Contacto */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Teléfono de Contacto
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.contact_phone}
                                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                    placeholder="+54 11 ..."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                WhatsApp
                                            </label>
                                            <div className="relative">
                                                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={formData.contact_whatsapp}
                                                    onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                    placeholder="+54 9 11 ..."
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                Email de Contacto
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={formData.contact_email}
                                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                    placeholder="contacto@inmobiliaria.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Separator */}
                                        <div className="border-t border-gray-100 pt-5 mt-5">
                                            <h4 className="text-sm font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
                                                🤖 Agente IA
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 rounded-xl bg-teal-50 border border-teal-100">
                                                    <div>
                                                        <p className="text-sm font-bold text-[var(--text-main)]">Habilitar Chat IA</p>
                                                        <p className="text-xs text-[var(--text-secondary)]">Botón flotante de chat en la página de la propiedad</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, agent_enabled: !formData.agent_enabled })}
                                                        className={`relative w-12 h-7 rounded-full transition-colors ${formData.agent_enabled ? 'bg-[#0d9488]' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.agent_enabled ? 'translate-x-5' : ''}`} />
                                                    </button>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                        Expensas ($/mes)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.expensas || ''}
                                                        onChange={(e) => setFormData({ ...formData, expensas: Number(e.target.value) })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium"
                                                        placeholder="Ej: 45000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                                                        Requisitos (garantías aceptadas)
                                                    </label>
                                                    <textarea
                                                        value={formData.requisitos}
                                                        onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-teal-100 transition-all font-medium resize-none"
                                                        rows={2}
                                                        placeholder="Ej: Garantía propietaria CABA/GBA o Seguro de caución (Finaer, Porto)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-secondary)] bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all"
                                        style={{
                                            background: '#0d9488',
                                        }}
                                    >
                                        {editingProperty ? 'Guardar Cambios' : 'Crear Propiedad'}
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
                                    <h3 className="text-lg font-bold text-gray-900">Eliminar propiedad</h3>
                                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de eliminar <strong>{deleteConfirm.property?.title}</strong>?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    Sí, eliminar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
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
                                    <h3 className="text-lg font-bold text-gray-900">Eliminar propiedad</h3>
                                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                ¿Estás seguro de eliminar <strong>{deleteConfirm.property?.title}</strong>?
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
