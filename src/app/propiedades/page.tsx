'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { usePropertyStore, useUIStore } from '@/store/propertyStore';
import { Propiedad } from '@/lib/supabase';

// Dynamic import for map to avoid SSR issues
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div
            className="w-full h-full rounded-[2rem] flex items-center justify-center"
            style={{
                background: 'rgba(10, 10, 26, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-t-[#00d4ff] border-r-[#00d4ff] border-b-transparent border-l-transparent animate-spin mx-auto mb-4" />
                <p className="text-neutral-400">Cargando mapa...</p>
            </div>
        </div>
    ),
});

// Mock data for demo
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
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        address: 'Puerto Madero, Buenos Aires',
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
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        address: 'Nordelta, Tigre',
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Penthouse con Vista al Río',
        price: 850000,
        operation: 'venta',
        type: 'Penthouse',
        m2: 200,
        bedrooms: 4,
        bathrooms: 3,
        coords_lat: -34.6037,
        coords_lng: -58.3816,
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        address: 'Recoleta, Buenos Aires',
        created_at: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Loft Industrial en Palermo',
        price: 280000,
        operation: 'venta',
        type: 'Loft',
        m2: 85,
        bedrooms: 1,
        bathrooms: 1,
        coords_lat: -34.5831,
        coords_lng: -58.4319,
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        address: 'Palermo Soho, Buenos Aires',
        created_at: new Date().toISOString(),
    },
    {
        id: '5',
        title: 'Departamento Familiar en Belgrano',
        price: 4200,
        operation: 'alquiler',
        type: 'Departamento',
        m2: 150,
        bedrooms: 3,
        bathrooms: 2,
        coords_lat: -34.5619,
        coords_lng: -58.4567,
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        address: 'Belgrano R, Buenos Aires',
        created_at: new Date().toISOString(),
    },
    {
        id: '6',
        title: 'Casa con Jardín en San Isidro',
        price: 620000,
        operation: 'venta',
        type: 'Casa',
        m2: 320,
        bedrooms: 5,
        bathrooms: 4,
        coords_lat: -34.4706,
        coords_lng: -58.5278,
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        address: 'San Isidro, Buenos Aires',
        created_at: new Date().toISOString(),
    },
];

export default function PropiedadesPage() {
    const {
        filteredProperties,
        isLoading,
        fetchProperties,
    } = usePropertyStore();

    const { isMapExpanded, toggleMapExpanded } = useUIStore();
    const [useMockData, setUseMockData] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            await fetchProperties();
            // If no data from Supabase, use mock
            if (usePropertyStore.getState().filteredProperties.length === 0) {
                setUseMockData(true);
                usePropertyStore.setState({
                    properties: mockProperties,
                    filteredProperties: mockProperties,
                    propertyTypes: [...new Set(mockProperties.map(p => p.type))],
                });
            }
        };
        loadData();
    }, [fetchProperties]);

    const displayProperties = useMockData ? mockProperties : filteredProperties;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Explorador de Propiedades
                    </h1>
                    <p className="text-neutral-400">
                        Encuentra tu próximo hogar con nuestro explorador inmersivo
                    </p>
                </motion.div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex h-[calc(100vh-200px)] gap-0">
                {/* Filters - 20% */}
                <div className="hidden lg:block w-[20%] min-w-[280px]">
                    <PropertyFilters />
                </div>

                {/* Properties List - 40% */}
                <div
                    className={`${isMapExpanded ? 'hidden lg:block' : ''} w-full lg:w-[40%] overflow-y-auto px-4`}
                    style={{
                        background: 'rgba(10, 10, 26, 0.5)',
                    }}
                >
                    <div className="py-4 space-y-4">
                        {isLoading ? (
                            // Loading State
                            Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-72 rounded-[2rem] animate-pulse"
                                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                                />
                            ))
                        ) : displayProperties.length > 0 ? (
                            displayProperties.map((property, index) => (
                                <PropertyCard key={property.id} property={property} index={index} />
                            ))
                        ) : (
                            // Empty State
                            <div className="text-center py-20">
                                <div
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }}
                                >
                                    <Map className="w-10 h-10 text-neutral-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No se encontraron propiedades
                                </h3>
                                <p className="text-neutral-400">
                                    Intenta ajustar los filtros para ver más resultados
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map - 40% */}
                <div
                    className={`${isMapExpanded ? 'w-full' : 'hidden lg:block lg:w-[40%]'} p-4`}
                >
                    <PropertyMap properties={displayProperties} />
                </div>
            </div>

            {/* Mobile Map Toggle Button */}
            <button
                onClick={toggleMapExpanded}
                className="fixed bottom-6 right-6 lg:hidden z-40 flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                    color: '#0a0a1a',
                    boxShadow: '0 4px 30px rgba(0, 212, 255, 0.4)',
                }}
            >
                <Map className="w-5 h-5" />
                {isMapExpanded ? 'Ver Lista' : 'Ver Mapa'}
            </button>
        </div>
    );
}
