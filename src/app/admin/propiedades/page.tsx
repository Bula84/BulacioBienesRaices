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

    useEffect(() => {
        if (user) {
            loadProperties();
        }
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
        } catch (error) {
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
                const created = await createPropiedad(propertyData as any);
                if (created) {
                    setProperties([created, ...properties]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    const handleDelete = async (property: Propiedad) => {
        if (!isSuperAdmin && property.user_id !== user?.id) {
            alert('No tienes permisos para eliminar esta propiedad');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

        try {
            const success = await deletePropiedad(property.id);
            if (success) {
                setProperties(properties.filter(p => p.id !== property.id));
            }
        } catch (error) {
            setProperties(properties.filter(p => p.id !== property.id));
        }
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

    const tabs = [
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
                    <h1 className="text-2xl font-bold text-white">Propiedades</h1>
                    <p className="text-neutral-400 text-sm">
                        {isSuperAdmin
                            ? 'Gestiona todas las propiedades del sistema'
                            : 'Gestiona tus propiedades publicadas'}
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    style={{
                        background: isSuperAdmin
                            ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Agregar Propiedad
                </button>
            </div>

            {/* Info for regular admins */}
            {!isSuperAdmin && (
                <div
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                >
                    <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-emerald-400 text-sm font-medium">Solo tus propiedades</p>
                        <p className="text-emerald-400/70 text-sm">
                            Como administrador, solo puedes ver y gestionar las propiedades que tú has creado.
                        </p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Buscar propiedades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
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
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-neutral-600 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-neutral-400">Cargando propiedades...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Propiedad</th>
                                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Tipo</th>
                                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Operación</th>
                                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Precio</th>
                                    <th className="text-left p-4 text-sm font-medium text-neutral-400">Ubicación</th>
                                    <th className="text-right p-4 text-sm font-medium text-neutral-400">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProperties.map((property) => (
                                    <tr
                                        key={property.id}
                                        className="border-t border-white/5 hover:bg-white/[0.02]"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0"
                                                    style={{
                                                        backgroundImage: property.image_url
                                                            ? `url(${property.image_url})`
                                                            : 'linear-gradient(135deg, #1a1a3e, #12122a)',
                                                    }}
                                                />
                                                <div>
                                                    <p className="font-medium text-white text-sm">{property.title}</p>
                                                    <p className="text-xs text-neutral-500">{property.m2} m²</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-neutral-300">{property.type}</span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${property.operation === 'venta'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-purple-500/10 text-purple-400'
                                                    }`}
                                            >
                                                {property.operation}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-white font-medium">
                                                ${property.price.toLocaleString('es-AR')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-neutral-400">{property.address || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEditProperty(property) ? (
                                                    <>
                                                        <button
                                                            onClick={() => openModal(property)}
                                                            className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(property)}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-neutral-500">Sin permisos</span>
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
                        <Home className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400">
                            {properties.length === 0
                                ? 'Aún no has creado ninguna propiedad'
                                : 'No se encontraron propiedades'}
                        </p>
                        {properties.length === 0 && (
                            <button
                                onClick={() => openModal()}
                                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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
                            className="fixed inset-0 bg-black/70 z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl"
                            style={{
                                background: 'rgba(18, 18, 42, 0.98)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
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
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Título *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                placeholder="Ej: Departamento de lujo en Puerto Madero"
                                                required
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Tipo de propiedad *
                                                </label>
                                                <select
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                    required
                                                >
                                                    <option value="">Seleccionar tipo</option>
                                                    <option value="Casa">Casa</option>
                                                    <option value="Departamento">Departamento</option>
                                                    <option value="Penthouse">Penthouse</option>
                                                    <option value="Loft">Loft</option>
                                                    <option value="Duplex">Duplex</option>
                                                    <option value="Local">Local Comercial</option>
                                                    <option value="Oficina">Oficina</option>
                                                    <option value="Terreno">Terreno</option>
                                                    <option value="Cochera">Cochera</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Operación *
                                                </label>
                                                <select
                                                    value={formData.operation}
                                                    onChange={(e) => setFormData({ ...formData, operation: e.target.value as 'venta' | 'alquiler' })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                    required
                                                >
                                                    <option value="venta">Venta</option>
                                                    <option value="alquiler">Alquiler</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Precio (USD) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Descripción corta
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                                placeholder="Breve descripción para las tarjetas"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Descripción completa
                                            </label>
                                            <textarea
                                                value={formData.full_description}
                                                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                                rows={5}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                                placeholder="Descripción detallada para la página de la propiedad..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Detalles */}
                                {activeTab === 'details' && (
                                    <div className="space-y-4">
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Superficie Total (m²)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.m2}
                                                    onChange={(e) => setFormData({ ...formData, m2: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Superficie Cubierta (m²)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.m2_covered}
                                                    onChange={(e) => setFormData({ ...formData, m2_covered: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Año de Construcción
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.year_built}
                                                    onChange={(e) => setFormData({ ...formData, year_built: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Dormitorios
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.bedrooms}
                                                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Baños
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.bathrooms}
                                                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Cocheras
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.parking}
                                                    onChange={(e) => setFormData({ ...formData, parking: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                    Pisos
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.floors}
                                                    onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) || 1 })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <h3 className="text-sm font-medium text-neutral-300 mb-4">Ubicación</h3>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                                        Dirección
                                                    </label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                        <input
                                                            type="text"
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                            placeholder="Ej: Av. Libertador 1234"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                                        Barrio
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.neighborhood}
                                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                        placeholder="Ej: Puerto Madero"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                                                        Ciudad
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                        placeholder="Ej: Buenos Aires"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                                    Latitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={formData.coords_lat}
                                                    onChange={(e) => setFormData({ ...formData, coords_lat: parseFloat(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-400 mb-2">
                                                    Longitud
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={formData.coords_lng}
                                                    onChange={(e) => setFormData({ ...formData, coords_lng: parseFloat(e.target.value) })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Amenities */}
                                {activeTab === 'amenities' && (
                                    <div className="space-y-4">
                                        <p className="text-neutral-400 text-sm">Selecciona las características y amenities de la propiedad</p>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {amenityOptions.map(({ key, label }) => (
                                                <label
                                                    key={key}
                                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${formData[key as keyof typeof formData]
                                                            ? 'bg-emerald-500/20 border-emerald-500/50'
                                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
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
                                                                ? 'bg-emerald-500 text-white'
                                                                : 'bg-white/10'
                                                            }`}
                                                    >
                                                        {formData[key as keyof typeof formData] && (
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={formData[key as keyof typeof formData] ? 'text-emerald-400' : 'text-neutral-300'}>
                                                        {label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Imágenes */}
                                {activeTab === 'images' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Imagen Principal (URL)
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.image_url}
                                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                placeholder="https://..."
                                            />
                                            {formData.image_url && (
                                                <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden bg-white/10">
                                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Galería de Imágenes
                                            </label>
                                            <div className="flex gap-2 mb-4">
                                                <input
                                                    type="url"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="URL de la imagen..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addImage}
                                                    className="px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {formData.images.length > 0 ? (
                                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                    {formData.images.map((img, index) => (
                                                        <div key={index} className="relative group">
                                                            <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
                                                                <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl">
                                                    <ImageIcon className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                                                    <p className="text-neutral-500 text-sm">No hay imágenes en la galería</p>
                                                    <p className="text-neutral-600 text-xs">Agrega URLs de imágenes arriba</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Contacto */}
                                {activeTab === 'contact' && (
                                    <div className="space-y-4">
                                        <p className="text-neutral-400 text-sm">Información de contacto para esta propiedad</p>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Teléfono
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="tel"
                                                    value={formData.contact_phone}
                                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="+54 11 1234-5678"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                WhatsApp (solo números, con código de país)
                                            </label>
                                            <div className="relative">
                                                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="text"
                                                    value={formData.contact_whatsapp}
                                                    onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="5491112345678"
                                                />
                                            </div>
                                            <p className="text-xs text-neutral-500 mt-1">Ejemplo: 5491112345678 (sin +, espacios ni guiones)</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                                Email de Contacto
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                                <input
                                                    type="email"
                                                    value={formData.contact_email}
                                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-all"
                                                    placeholder="info@inmobiliaria.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:bg-white/10 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: isSuperAdmin
                                                ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
        </div>
    );
}
