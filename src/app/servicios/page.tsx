'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, Search } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import { Servicio, getServicios } from '@/lib/supabase';
import { mockServicios } from '@/lib/mockServicios';

export default function ServiciosPage() {
    const [services, setServices] = useState<Servicio[]>(mockServicios);
    const [filteredServices, setFilteredServices] = useState<Servicio[]>(mockServicios);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Categorías derivadas de los datos reales: toda categoría que exista en la
    // base (o en el fallback de demo) aparece como filtro seleccionable.
    const categories = useMemo(() => {
        const present = new Set(services.map(s => s.category).filter(Boolean));
        const preferred = ['Electricidad', 'Plomería', 'Carpintería', 'Pintura', 'Climatización', 'Jardinería', 'Limpieza'];
        const ordered = preferred.filter(c => present.has(c));
        const rest = [...present].filter(c => !preferred.includes(c)).sort();
        return ['Todos', ...ordered, ...rest];
    }, [services]);

    // Si la categoría seleccionada dejara de existir (p. ej. cambian los datos
    // de la base), caemos a "Todos" derivando el valor, sin escribir en el
    // estado desde dentro de un useEffect.
    const effectiveCategory = categories.includes(activeCategory) ? activeCategory : 'Todos';

    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await getServicios();
                if (data.length > 0) {
                    setServices(data);
                    setFilteredServices(data);
                }
            } catch {
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
        if (effectiveCategory !== 'Todos') {
            result = result.filter(s => s.category === effectiveCategory);
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
    }, [effectiveCategory, searchQuery, services]);

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
                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${effectiveCategory === category
                                    ? 'text-white shadow-md'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-white bg-gray-50'
                                    }`}
                                style={{
                                    background: effectiveCategory === category
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

                {/* Become a Pro CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-20 relative overflow-hidden rounded-[2.5rem] p-10 md:p-14 text-center bg-white border border-gray-100 shadow-lg"
                >
                    <h2 className="text-2xl md:text-4xl font-extrabold !text-slate-900 mb-4 font-headings tracking-tight">
                        ¿Eres un profesional?
                    </h2>
                    <p className="font-medium !text-slate-700 mb-8 max-w-xl mx-auto text-lg md:text-xl">
                        Únete a nuestro directorio y conecta con miles de clientes potenciales
                        que buscan servicios de calidad.
                    </p>
                    <Link
                        href="/contacto"
                        className="inline-block px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 text-white shadow-lg shadow-blue-500/30"
                        style={{
                            background: 'var(--primary-blue)',
                        }}
                    >
                        Registrarme como Profesional
                    </Link>

                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 -z-10" />
                </motion.div>
            </div>
        </div>
    );
}
