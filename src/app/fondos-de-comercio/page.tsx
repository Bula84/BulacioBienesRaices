'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getPropiedades, Propiedad } from '@/lib/supabase';
import PropertyCard from '@/components/PropertyCard';

export default function FondosDeComercioPage() {
    const [fondos, setFondos] = useState<Propiedad[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFondos();
    }, []);

    const loadFondos = async () => {
        try {
            const data = await getPropiedades({ type: 'fondo_comercio' });
            setFondos(data || []);
        } catch (error) {
            console.error('Error loading fondos de comercio', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-20">
            {/* Hero Section */}
            <section className="relative bg-slate-800 py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-900/50"></div>
                </div>

                <div className="container relative z-10 mx-auto px-6">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold !text-white mb-6 font-headings leading-tight"
                        >
                            Venta de<br />
                            <span className="!text-teal-400">Fondos de Comercio</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-2xl !text-teal-50 mb-8 font-medium"
                        >
                            Encuentre su próxima oportunidad de negocio. Rentabilidad y potencial a su alcance.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Listado */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                        </div>
                    ) : fondos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {fondos.map((propiedad, index) => (
                                <PropertyCard
                                    key={propiedad.id}
                                    property={propiedad}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-extrabold !text-slate-900 mb-4">No hay fondos de comercio listados por el momento</h3>
                            <p className="font-medium !text-slate-700 text-lg">Vuelva a consultar más adelante o contáctenos para búsquedas específicas.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
