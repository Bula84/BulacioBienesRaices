'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import { usePropertyStore } from '@/store/propertyStore';
import type { PropertyFilters as FiltrosPropiedad } from '@/store/propertyStore';
import { Propiedad } from '@/lib/supabase';



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
    const [esDemo, setEsDemo] = useState(false);

    useEffect(() => {
        // Los links del footer y del hero llegan con querystring
        // (p. ej. /propiedades?operation=venta) — hay que aplicarlos a los filtros.
        const params = new URLSearchParams(window.location.search);
        const patch: Partial<FiltrosPropiedad> = {};

        const op = params.get('operation');
        if (op === 'venta' || op === 'alquiler') patch.operation = op;

        const tipo = params.get('type');
        if (tipo) patch.type = tipo;

        const min = params.get('minPrice');
        if (min && !Number.isNaN(Number(min))) patch.minPrice = Number(min);

        const max = params.get('maxPrice');
        if (max && !Number.isNaN(Number(max))) patch.maxPrice = Number(max);

        const conFiltros = Object.keys(patch).length > 0;

        const loadData = async () => {
            await fetchProperties();

            // Si no hay datos en Supabase, mostramos el listado de ejemplo
            if (usePropertyStore.getState().filteredProperties.length === 0) {
                usePropertyStore.setState({
                    properties: mockProperties,
                    filteredProperties: mockProperties,
                    propertyTypes: [...new Set(mockProperties.map(p => p.type))],
                });
                setEsDemo(true);
            }

            // Se aplican después de cargar, así hay datos sobre los que filtrar
            if (conFiltros) usePropertyStore.getState().setFilters(patch);
        };
        loadData();
    }, [fetchProperties]);

    const displayProperties = filteredProperties;

    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-4">
            {/* Header */}
            <div className="container mx-auto px-6 py-6 border-b border-gray-200">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl md:text-5xl font-extrabold !text-slate-900 mb-2 font-headings tracking-tight">
                        Explorador de Propiedades
                    </h1>
                    <p className="text-lg font-medium !text-slate-700">
                        Encuentra tu próximo hogar con nuestro explorador inmersivo
                    </p>
                </motion.div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex flex-col lg:flex-row min-h-screen gap-0 relative">
                {/* Filters - Sticky Sidebar */}
                <div className="hidden lg:block w-[280px] border-r border-gray-200 bg-[var(--bg-surface)]">
                    <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                        <PropertyFilters />
                    </div>
                </div>

                {/* Properties List - Natural Scroll */}
                <div className="w-full lg:flex-1 px-6 pb-20 bg-[var(--bg-page)]">
                    <div className="py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            // Loading State
                            Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[400px] rounded-[2rem] animate-pulse bg-gray-200"
                                />
                            ))
                        ) : displayProperties.length > 0 ? (
                            displayProperties.map((property, index) => (
                                <PropertyCard key={property.id} property={property} index={index} esEjemplo={esDemo} />
                            ))
                        ) : (
                            // Empty State
                            <div className="col-span-full text-center py-20">
                                <div
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-[var(--bg-surface)] shadow-sm border border-gray-100"
                                >
                                    <Map className="w-10 h-10 text-[var(--text-muted)]" />
                                </div>
                                <h3 className="text-2xl font-bold !text-slate-900 mb-2">
                                    No se encontraron propiedades
                                </h3>
                                <p className="text-lg font-medium !text-slate-700">
                                    Intenta ajustar los filtros para ver más resultados
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}
