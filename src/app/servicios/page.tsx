'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Search } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import BannerAd from '@/components/BannerAd';
import { Servicio, getServicios } from '@/lib/supabase';

// Mock categories
const categories = [
    'Todos',
    'Electricidad',
    'Plomería',
    'Carpintería',
    'Pintura',
    'Climatización',
    'Jardinería',
    'Limpieza',
];

// Mock data for demo
const mockServices: Servicio[] = [
    {
        id: '1',
        name: 'Juan Pérez',
        skill_tags: ['Instalaciones eléctricas', 'Reparaciones', 'Iluminación LED'],
        contact: '+54 11 1234-5678',
        phone: '+541112345678',
        email: 'juan.perez@email.com',
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
        category: 'Electricidad',
        description: 'Electricista matriculado con más de 15 años de experiencia en instalaciones residenciales y comerciales.',
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
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        category: 'Plomería',
        description: 'Gasista matriculado. Trabajos de plomería y gas con garantía escrita.',
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'María Fernández',
        skill_tags: ['Pintura interior', 'Pintura exterior', 'Empapelado'],
        contact: '+54 11 3456-7890',
        phone: '+541134567890',
        email: 'maria.pinturas@email.com',
        rating: 4.7,
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        category: 'Pintura',
        description: 'Especialista en pintura decorativa y acabados de alta calidad.',
        created_at: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Carlos Mendoza',
        skill_tags: ['Muebles a medida', 'Reparaciones', 'Restauración'],
        contact: '+54 11 4567-8901',
        phone: '+541145678901',
        email: 'carlos.carpintero@email.com',
        rating: 5.0,
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        category: 'Carpintería',
        description: 'Carpintero artesanal especializado en muebles a medida y restauración de antigüedades.',
        created_at: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'Lucía Torres',
        skill_tags: ['Aire acondicionado', 'Calefacción', 'Ventilación'],
        contact: '+54 11 5678-9012',
        phone: '+541156789012',
        email: 'lucia.clima@email.com',
        rating: 4.6,
        image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        category: 'Climatización',
        description: 'Técnica certificada en sistemas de climatización para hogares y oficinas.',
        created_at: new Date().toISOString(),
    },
    {
        id: '6',
        name: 'Diego Ramírez',
        skill_tags: ['Diseño de jardines', 'Mantenimiento', 'Riego'],
        contact: '+54 11 6789-0123',
        phone: '+541167890123',
        email: 'diego.jardin@email.com',
        rating: 4.8,
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        category: 'Jardinería',
        description: 'Paisajista con experiencia en diseño y mantenimiento de espacios verdes.',
        created_at: new Date().toISOString(),
    },
];

export default function ServiciosPage() {
    const [services, setServices] = useState<Servicio[]>(mockServices);
    const [filteredServices, setFilteredServices] = useState<Servicio[]>(mockServices);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await getServicios();
                if (data.length > 0) {
                    setServices(data);
                    setFilteredServices(data);
                }
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setIsLoading(false);
            }
        };

        loadServices();
    }, []);

    useEffect(() => {
        let result = services;

        // Filter by category
        if (activeCategory !== 'Todos') {
            result = result.filter(s => s.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                s =>
                    s.name.toLowerCase().includes(query) ||
                    s.skill_tags?.some(tag => tag.toLowerCase().includes(query)) ||
                    s.description?.toLowerCase().includes(query)
            );
        }

        setFilteredServices(result);
    }, [activeCategory, searchQuery, services]);

    return (
        <div className="py-12 bg-[var(--bg-page)]">
            <div className="container mx-auto px-6 pt-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider"
                        style={{
                            background: 'rgba(33, 148, 207, 0.1)',
                            color: 'var(--primary-blue)',
                        }}
                    >
                        <Wrench className="w-4 h-4" />
                        Directorio de Profesionales
                    </span>

                    <h1 className="text-4xl md:text-6xl font-extrabold !text-slate-900 mb-4 font-headings tracking-tight">
                        Servicios de{' '}
                        <span className="text-[var(--primary-blue)]">
                            Mantenimiento
                        </span>
                    </h1>
                    <p className="font-medium !text-slate-700 max-w-2xl mx-auto text-lg md:text-xl">
                        Encuentra profesionales confiables para el mantenimiento y reparación de tu propiedad.
                        Todos verificados y con calificaciones de nuestros clientes.
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    {/* Search Bar */}
                    <div
                        className="relative max-w-xl mx-auto mb-8"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, habilidad o servicio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 py-4 rounded-xl border border-gray-200 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === category
                                    ? 'text-white shadow-md'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-white bg-gray-50'
                                    }`}
                                style={{
                                    background: activeCategory === category
                                        ? 'var(--primary-blue)'
                                        : undefined,
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="font-medium !text-slate-700">
                        {filteredServices.length} {filteredServices.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
                    </p>
                </div>

                {/* Services Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-80 rounded-[2rem] animate-pulse bg-gray-200"
                            />
                        ))}
                    </div>
                ) : filteredServices.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service, index) => (
                            <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div
                            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100"
                        >
                            <Wrench className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-extrabold !text-slate-900 mb-2">
                            No se encontraron profesionales
                        </h3>
                        <p className="font-medium !text-slate-700 text-lg">
                            Intenta ajustar los filtros o la búsqueda
                        </p>
                    </motion.div>
                )}

                {/* Banner Advertising */}
                <BannerAd
                    title="Descuento en herramientas para matriculados"
                    description="Si formas parte de nuestra red de servicios adheridos, conseguí un 20% de descuento en las herramientas seleccionadas de nuestro corralón asociado."
                    imageUrl="https://images.unsplash.com/photo-1581147036324-c10842f9b86f?w=1200"
                    linkUrl="/oportunidades"
                    ctaText="Ver Promoción"
                />

                {/* Become a Pro CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 text-center bg-white border border-gray-100 shadow-lg"
                >
                    <h2 className="text-2xl md:text-4xl font-extrabold !text-slate-900 mb-4 font-headings tracking-tight">
                        ¿Eres un profesional?
                    </h2>
                    <p className="font-medium !text-slate-700 mb-8 max-w-xl mx-auto text-lg md:text-xl">
                        Únete a nuestro directorio y conecta con miles de clientes potenciales
                        que buscan servicios de calidad.
                    </p>
                    <button
                        className="px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-white shadow-lg shadow-blue-500/30"
                        style={{
                            background: 'var(--primary-blue)',
                        }}
                    >
                        Registrarme como Profesional
                    </button>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 -z-10" />
                </motion.div>
            </div>
        </div>
    );
}
