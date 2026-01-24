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
    Home
} from 'lucide-react';
import {
    Propiedad,
    getPropiedades,
    createPropiedad,
    updatePropiedad,
    deletePropiedad
} from '@/lib/supabase';

// Mock data
const mockProperties: Propiedad[] = [
    {
        id: '1',
        title: 'Departamento de Lujo en Puerto Madero',
        price: 450000,
        operation: 'venta',
        type: 'Departamento',
        m2: 120,
        bedrooms: 3,
        bathrooms: 2,
        coords_lat: -34.6118,
        coords_lng: -58.3625,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
        address: 'Puerto Madero',
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Casa Moderna en Nordelta',
        price: 8500,
        operation: 'alquiler',
        type: 'Casa',
        m2: 250,
        bedrooms: 4,
        bathrooms: 3,
        coords_lat: -34.4097,
        coords_lng: -58.6517,
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        address: 'Nordelta',
        created_at: new Date().toISOString(),
    },
];

const emptyProperty: {
    title: string;
    price: number;
    operation: 'venta' | 'alquiler';
    type: string;
    m2: number;
    bedrooms: number;
    bathrooms: number;
    coords_lat: number;
    coords_lng: number;
    image_url: string;
    address: string;
    description: string;
} = {
    title: '',
    price: 0,
    operation: 'venta',
    type: '',
    m2: 0,
    bedrooms: 0,
    bathrooms: 0,
    coords_lat: -34.6037,
    coords_lng: -58.3816,
    image_url: '',
    address: '',
    description: '',
};

export default function AdminPropiedadesPage() {
    const [properties, setProperties] = useState<Propiedad[]>(mockProperties);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Propiedad | null>(null);
    const [formData, setFormData] = useState(emptyProperty);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            const data = await getPropiedades();
            if (data.length > 0) {
                setProperties(data);
            }
        } catch (error) {
            console.log('Using mock data');
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
            setEditingProperty(property);
            setFormData({
                title: property.title,
                price: property.price,
                operation: property.operation,
                type: property.type,
                m2: property.m2 || 0,
                bedrooms: property.bedrooms || 0,
                bathrooms: property.bathrooms || 0,
                coords_lat: property.coords_lat || -34.6037,
                coords_lng: property.coords_lng || -58.3816,
                image_url: property.image_url || '',
                address: property.address || '',
                description: property.description || '',
            });
        } else {
            setEditingProperty(null);
            setFormData(emptyProperty);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProperty(null);
        setFormData(emptyProperty);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProperty) {
                const updated = await updatePropiedad(editingProperty.id, formData);
                if (updated) {
                    setProperties(properties.map(p => p.id === editingProperty.id ? updated : p));
                }
            } else {
                const created = await createPropiedad(formData as any);
                if (created) {
                    setProperties([created, ...properties]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving property:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

        try {
            const success = await deletePropiedad(id);
            if (success) {
                setProperties(properties.filter(p => p.id !== id));
            }
        } catch (error) {
            // Demo mode - just remove from local state
            setProperties(properties.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Propiedades</h1>
                    <p className="text-neutral-400 text-sm">Gestiona el catálogo de propiedades</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                        color: '#0a0a1a',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Agregar Propiedad
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Buscar propiedades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass w-full pl-12"
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
                                                className="w-12 h-12 rounded-xl bg-cover bg-center"
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
                                                ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                                                : 'bg-[#a855f7]/10 text-[#a855f7]'
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
                                            <button
                                                onClick={() => openModal(property)}
                                                className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
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

                {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <Home className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                        <p className="text-neutral-400">No se encontraron propiedades</p>
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
                                    {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-glass w-full"
                                        placeholder="Ej: Departamento de lujo en Puerto Madero"
                                        required
                                    />
                                </div>

                                {/* Type & Operation */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Tipo de propiedad
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="input-glass w-full"
                                            required
                                        >
                                            <option value="">Seleccionar tipo</option>
                                            <option value="Casa">Casa</option>
                                            <option value="Departamento">Departamento</option>
                                            <option value="Penthouse">Penthouse</option>
                                            <option value="Loft">Loft</option>
                                            <option value="Local">Local Comercial</option>
                                            <option value="Oficina">Oficina</option>
                                            <option value="Terreno">Terreno</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Operación
                                        </label>
                                        <select
                                            value={formData.operation}
                                            onChange={(e) => setFormData({ ...formData, operation: e.target.value as 'venta' | 'alquiler' })}
                                            className="input-glass w-full"
                                            required
                                        >
                                            <option value="venta">Venta</option>
                                            <option value="alquiler">Alquiler</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Price & Size */}
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Precio (USD)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                className="input-glass w-full pl-10"
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Superficie (m²)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.m2}
                                            onChange={(e) => setFormData({ ...formData, m2: parseInt(e.target.value) })}
                                            className="input-glass w-full"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Habitaciones
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                                            className="input-glass w-full"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Dirección / Zona
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="input-glass w-full pl-10"
                                            placeholder="Ej: Puerto Madero, Buenos Aires"
                                        />
                                    </div>
                                </div>

                                {/* Coordinates */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Latitud
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.coords_lat}
                                            onChange={(e) => setFormData({ ...formData, coords_lat: parseFloat(e.target.value) })}
                                            className="input-glass w-full"
                                            placeholder="-34.6037"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Longitud
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.coords_lng}
                                            onChange={(e) => setFormData({ ...formData, coords_lng: parseFloat(e.target.value) })}
                                            className="input-glass w-full"
                                            placeholder="-58.3816"
                                        />
                                    </div>
                                </div>

                                {/* Image URL */}
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
                                            background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                                            color: '#0a0a1a',
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
