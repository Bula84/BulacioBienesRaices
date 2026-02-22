'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2, Calendar, CheckCircle, Info, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Emprendimiento, getEmprendimientos } from '@/lib/supabase';

export default function DevelopmentsPage() {
    const [developments, setDevelopments] = useState<Emprendimiento[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDevelopments();
    }, []);

    const loadDevelopments = async () => {
        try {
            const data = await getEmprendimientos();
            setDevelopments(data);
        } catch (error) {
            console.error('Error loading available developments', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden flex items-center justify-center min-h-[40vh]">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                <div className="container mx-auto relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 !text-white font-headings tracking-tight"
                    >
                        Emprendimientos y Desarrollos
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl !text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Invertí en tu futuro. Descubrí nuestros proyectos exclusivos en pozo y preventa.
                    </motion.p>
                </div>
            </section>

            {/* Intro info */}
            <section className="py-12 bg-white border-b border-gray-100 relative z-20 -mt-8 rounded-t-[2.5rem] shadow-xl mx-4 lg:mx-0">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="flex items-start gap-5 p-8 bg-teal-50 rounded-2xl border border-teal-100 hover:shadow-lg transition-shadow">
                            <div className="p-4 bg-teal-100/50 rounded-xl text-[#0d9488]">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold !text-slate-900 mb-2">Inversión Segura</h3>
                                <p className="text-base font-medium !text-slate-700 leading-relaxed">
                                    Respaldo de desarrolladoras de trayectoria y seguridad jurídica en cada operación.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5 p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
                            <div className="p-4 bg-blue-100/50 rounded-xl text-blue-600">
                                <Info className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold !text-slate-900 mb-2">Financiación a Medida</h3>
                                <p className="text-base font-medium !text-slate-700 leading-relaxed">
                                    Planes flexibles en pesos y dólares adaptados a tu flujo de fondos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="container mx-auto px-6 py-20">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#0d9488] animate-spin" />
                    </div>
                ) : developments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {developments.map((dev, index) => (
                            <motion.div
                                key={dev.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur text-gray-900 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                            {dev.status}
                                        </span>
                                    </div>
                                    <img
                                        src={dev.image_url || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop'}
                                        alt={dev.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Price Tag Overlay */}
                                    {dev.price_start && dev.price_start > 0 && (
                                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-gray-100">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold text-right tracking-wider">Desde</p>
                                            <p className="text-xl font-bold text-gray-900">${dev.price_start.toLocaleString()} USD</p>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-extrabold !text-slate-900 mb-2 group-hover:text-[#0d9488] transition-colors leading-tight">{dev.title}</h2>
                                        <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                                            <MapPin className="w-4 h-4 text-[#0d9488]" />
                                            {dev.location}
                                        </div>
                                    </div>

                                    <p className="font-medium !text-slate-700 mb-6 line-clamp-3 leading-relaxed text-sm">
                                        {dev.description}
                                    </p>

                                    {/* Features */}
                                    {dev.features && dev.features.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {dev.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                                                    {feature}
                                                </span>
                                            ))}
                                            {dev.features.length > 3 && (
                                                <span className="px-3 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-lg border border-gray-100">
                                                    +{dev.features.length - 3} más
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto border-t border-gray-100 pt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{dev.delivery || 'Consultar entrega'}</span>
                                        </div>
                                        <button className="flex items-center gap-2 text-[#0d9488] font-bold text-sm uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                                            Ver Proyecto
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 bg-gray-100 rounded-3xl border border-gray-200 border-dashed">
                        <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-extrabold !text-slate-900 mb-2">Próximamente más proyectos</h3>
                        <p className="font-medium !text-slate-700 max-w-md mx-auto text-lg">
                            Estamos trabajando para traerte las mejores oportunidades de inversión.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
