'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar, CheckCircle, ChevronRight, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Emprendimiento, getEmprendimientos } from '@/lib/supabase';

const mockDevelopments: Emprendimiento[] = [
    {
        id: '1',
        title: 'Torre Vista Mar',
        location: 'Puerto Madero, CABA',
        status: 'En Construcción',
        description: 'Exclusiva torre premium con vistas panorámicas al río. Amenities de categoría internacional, diseño vanguardista y terminaciones de lujo.',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop',
        price_start: 350000,
        features: ['Piscina Infinity', 'Gimnasio High-tech', 'Sky Bar', 'Seguridad 24/7'],
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Eco Residences',
        location: 'Nordelta, Tigre',
        status: 'Lanzamiento',
        description: 'Condominio sustentable inmerso en la naturaleza. Casas y departamentos pensados para el bajo consumo energético y máximo confort.',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
        price_start: 180000,
        features: ['Paneles Solares', 'Laguna Cristalina', 'Club House', 'Canchas de Tenis'],
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Distrito Soho',
        location: 'Palermo Soho, CABA',
        status: 'Entrega Inmediata',
        description: 'Innovador complejo de usos mixtos en el corazón del diseño y gastronomía de Buenos Aires. Ideal para jóvenes profesionales e inversores.',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
        price_start: 120000,
        features: ['Coworking', 'Rooftop con Parrillas', 'Bicicletero', 'Laundry'],
        created_at: new Date().toISOString(),
    },
];

export default function ProjectCarousel() {
    const [developments, setDevelopments] = useState<Emprendimiento[]>(mockDevelopments);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDevelopments();
    }, []);

    const loadDevelopments = async () => {
        try {
            const data = await getEmprendimientos();
            if (data && data.length > 0) {
                setDevelopments(data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error loading developments for carousel', error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextSlide = () => {
        if (developments.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % developments.length);
    };

    const prevSlide = () => {
        if (developments.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + developments.length) % developments.length);
    };

    useEffect(() => {
        if (developments.length > 1) {
            const timer = setInterval(() => {
                nextSlide();
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [developments, currentIndex]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    if (isLoading) {
        return (
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white flex justify-center">
                <Loader2 className="w-10 h-10 text-[#0d9488] animate-spin" />
            </section>
        );
    }

    if (developments.length === 0) {
        return null; // Don't show if no developments
    }

    const currentProject = developments[currentIndex];

    // Fallback image if none provided
    const bgImage = currentProject.image_url || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop';

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[#0d9488] font-bold tracking-wider uppercase text-sm mb-2 block"
                        >
                            Inversiones Inteligentes
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-bold text-gray-900 font-headings"
                        >
                            Emprendimientos Destacados
                        </motion.h2>
                    </div>
                    <Link
                        href="/emprendimientos"
                        className="hidden md:flex items-center gap-2 group text-[#0d9488] font-bold hover:text-teal-700 transition-colors"
                    >
                        Ver todos los proyectos
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentProject.id}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${bgImage})` }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                                <div className="max-w-3xl">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-wrap items-center gap-4 mb-4"
                                    >
                                        <span className="px-4 py-1.5 rounded-full bg-[#0d9488] text-white text-sm font-bold uppercase tracking-wide shadow-lg">
                                            {currentProject.status}
                                        </span>
                                        <div className="flex items-center gap-2 text-gray-300 bg-black/30 backdrop-blur px-3 py-1 rounded-full">
                                            <MapPin className="w-4 h-4 text-[#0d9488]" />
                                            <span className="font-medium text-sm">{currentProject.location}</span>
                                        </div>
                                    </motion.div>

                                    <motion.h3
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl md:text-6xl font-bold !text-white mb-6 font-headings leading-tight"
                                    >
                                        {currentProject.title}
                                    </motion.h3>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-lg md:text-xl !text-white opacity-90 mb-8 max-w-2xl font-light leading-relaxed line-clamp-2 md:line-clamp-3"
                                    >
                                        {currentProject.description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap gap-6 mb-8"
                                    >
                                        {currentProject.features?.slice(0, 3).map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-white/90 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                                                <CheckCircle className="w-4 h-4 text-[#0d9488]" />
                                                <span className="font-medium text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                                    >
                                        <div className="group">
                                            <Link
                                                href={`/emprendimientos`}
                                                className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                                            >
                                                Ver Detalles
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#0d9488]" />
                                            </Link>
                                        </div>
                                        {currentProject.price_start && currentProject.price_start > 0 && (
                                            <div className="text-white bg-black/40 backdrop-blur px-6 py-3 rounded-xl border border-white/10">
                                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Inversión desde</span>
                                                <span className="text-2xl font-bold tracking-tight">${currentProject.price_start.toLocaleString()} USD</span>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    {developments.length > 1 && (
                        <div className="absolute bottom-12 right-12 flex gap-4 z-20 hidden md:flex">
                            <button
                                onClick={prevSlide}
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all group"
                            >
                                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all group"
                            >
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {/* Mobile Navigation Indicators */}
                    {developments.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
                            {developments.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > currentIndex ? 1 : -1);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-white w-8" : "bg-white/40 w-4"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/emprendimientos"
                        className="inline-flex items-center gap-2 text-[#0d9488] font-bold"
                    >
                        Ver todos los proyectos
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
