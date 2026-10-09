'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Phone,
    Mail,
    MessageCircle,
    Award,
    FileText,
    Camera,
    Wrench,
    Play,
    CheckCircle2,
    Shield,
    Star,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { getServicio, Servicio } from '@/lib/supabase';
import { mockServicios } from '@/lib/mockServicios';
import Navbar from '@/components/Navbar';
import StarRating from '@/components/StarRating';

export default function ServicioDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [service, setService] = useState<Servicio | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    useEffect(() => {
        const loadService = async () => {
            if (!params.id) return;

            const id = params.id as string;
            const data = await getServicio(id);
            if (data) {
                setService(data);
            } else {
                // Fallback de demo: sólo si el id existe realmente en la lista mock.
                // Si no existe, service queda en null y se muestra "no encontrado".
                setService(mockServicios.find(s => s.id === id) ?? null);
            }
            setLoading(false);
        };

        loadService();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-[var(--bg-page)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-bold !text-slate-600">Cargando perfil del profesional...</p>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
                <div className="text-center">
                    <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold !text-slate-900 mb-2">Profesional no encontrado</h1>
                    <p className="font-medium !text-slate-700 mb-6 text-lg">El profesional que buscas no existe o fue eliminado.</p>
                    <Link
                        href="/servicios"
                        className="btn-primary flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Servicios
                    </Link>
                </div>
            </div>
        );
    }

    const galleryImages = service.images?.length ? service.images : (service.image_url ? [service.image_url] : []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const openWhatsApp = () => {
        const phone = service.contact?.replace(/\D/g, '') || service.phone?.replace(/\D/g, '');
        if (phone) {
            window.open(`https://wa.me/${phone}?text=Hola,%20vi%20tu%20perfil%20en%20BC%20Bienes%20Raices%20y%20me%20gustaria%20hacer%20una%20consulta.`, '_blank');
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12 bg-[var(--bg-page)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb & Back button */}
                    <div className="flex flex-col sm:flex-row justify-between mb-6">
                        <nav className="flex items-center gap-2 text-sm font-semibold !text-slate-600 mb-4 sm:mb-0">
                            <Link href="/" className="hover:!text-[var(--primary-blue)] transition-colors">Inicio</Link>
                            <span>/</span>
                            <Link href="/servicios" className="hover:!text-[var(--primary-blue)] transition-colors">Servicios</Link>
                            <span>/</span>
                            <span className="text-[var(--primary-blue)] font-bold">{service.category}</span>
                        </nav>

                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 font-semibold !text-slate-600 hover:!text-[var(--primary-blue)] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Profile Header Card */}
                            <div className="card p-8 bg-white border border-gray-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                                {/* Decorative background */}
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-50 to-teal-50 -z-0"></div>

                                <div className="z-10 mt-6 md:mt-12 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-gray-100">
                                    {service.image_url ? (
                                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                                            {service.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div className="z-10 mt-2 md:mt-16 flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <h1 className="text-3xl md:text-5xl font-extrabold !text-slate-900 mb-2 font-headings tracking-tight">
                                                {service.name}
                                            </h1>
                                            <div className="flex items-center gap-3 font-bold">
                                                <span className="px-3 py-1 text-sm bg-blue-50 text-[var(--primary-blue)] rounded-full uppercase tracking-wide">
                                                    {service.category}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <StarRating rating={service.rating} size="sm" showValue={true} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="font-extrabold !text-slate-900 text-lg mb-3">Especialidades</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {service.skill_tags?.map((skill, index) => (
                                                <span key={index} className="px-4 py-1.5 text-sm font-bold bg-gray-50 !text-slate-700 rounded-full border border-gray-100">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* About / Long Description */}
                            <div className="card p-8 bg-white border border-gray-100">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings flex items-center gap-2">
                                    <FileText className="text-[var(--primary-blue)]" />
                                    Acerca del Profesional
                                </h2>
                                <div className="font-medium !text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                                    {service.full_description || service.description || 'Sin descripción detallada disponible.'}
                                </div>
                            </div>

                            {/* Certifications and Techniques */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="card p-8 bg-white border border-gray-100">
                                    <h2 className="text-xl font-extrabold !text-slate-900 mb-6 font-headings flex items-center gap-2">
                                        <Award className="text-[var(--primary-blue)]" />
                                        Certificaciones
                                    </h2>
                                    {service.certifications && service.certifications.length > 0 ? (
                                        <ul className="space-y-3">
                                            {service.certifications.map((cert, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="font-bold !text-slate-700">{cert}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="font-medium !text-slate-500 italic">No hay certificaciones añadidas por ahora.</p>
                                    )}
                                </div>

                                <div className="card p-8 bg-white border border-gray-100">
                                    <h2 className="text-xl font-extrabold !text-slate-900 mb-6 font-headings flex items-center gap-2">
                                        <Wrench className="text-[var(--primary-blue)]" />
                                        Técnicas que maneja
                                    </h2>
                                    {service.techniques && service.techniques.length > 0 ? (
                                        <ul className="space-y-3">
                                            {service.techniques.map((tech, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-[var(--primary-blue)] flex-shrink-0 mt-0.5" />
                                                    <span className="font-bold !text-slate-700">{tech}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="font-medium !text-slate-500 italic">No hay técnicas especificadas por ahora.</p>
                                    )}
                                </div>
                            </div>

                            {/* Presupuestos */}
                            <div className="card p-8 bg-teal-50 border border-teal-100">
                                <h2 className="text-2xl font-extrabold text-teal-900 mb-4 font-headings">Presupuestos y Garantías</h2>
                                <p className="font-bold text-teal-800 text-lg leading-relaxed">
                                    {service.budget_info || 'El profesional presupuestará su consulta sin cargo dependiendo su ubicación. Consulte sin compromiso.'}
                                </p>
                            </div>

                            {/* Work Gallery */}
                            {galleryImages.length > 0 && (
                                <div className="card p-8 bg-white border border-gray-100">
                                    <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings flex items-center gap-2">
                                        <Camera className="text-[var(--primary-blue)]" />
                                        Fotos de Obras Anteriores
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {galleryImages.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="aspect-square rounded-2xl overflow-hidden cursor-pointer relative group"
                                                onClick={() => {
                                                    setCurrentImageIndex(idx);
                                                    setIsGalleryOpen(true);
                                                }}
                                            >
                                                <img src={img} alt={`Trabajo ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Video Presentation */}
                            {service.video_url && (
                                <div className="card p-8 bg-white border border-gray-100">
                                    <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings flex items-center gap-2">
                                        <Play className="text-red-500 fill-current" />
                                        Video de Presentación
                                    </h2>
                                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                        <iframe
                                            src={service.video_url}
                                            title="Video del Profesional"
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Contact Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-2 font-headings">Solicitar Servicio</h2>
                                <p className="font-medium !text-slate-700 mb-8 text-base">Comunícate directamente con {service.name} para un presupuesto.</p>

                                <div className="flex flex-col gap-4 mb-8">
                                    <button
                                        onClick={openWhatsApp}
                                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-md shadow-green-500/20 text-lg"
                                        style={{ background: '#25D366' }}
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        Contactar por WhatsApp
                                    </button>

                                    {service.phone && (
                                        <a
                                            href={`tel:${service.phone}`}
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-md shadow-blue-500/20 text-lg text-white"
                                            style={{ background: 'var(--primary-blue)' }}
                                        >
                                            <Phone className="w-6 h-6" />
                                            Llamar: {service.contact || service.phone}
                                        </a>
                                    )}

                                    {service.email && (
                                        <a
                                            href={`mailto:${service.email}`}
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold bg-white border-2 border-gray-200 !text-slate-700 hover:border-blue-500 hover:!text-blue-600 transition-all text-lg"
                                        >
                                            <Mail className="w-6 h-6" />
                                            Enviar Email
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fullscreen Gallery Modal */}
            <AnimatePresence>
                {isGalleryOpen && galleryImages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
                    >
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {galleryImages.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-6 text-white/50 hover:text-white p-4"
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>
                        )}

                        <div className="w-full max-w-5xl px-12 md:px-24">
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={galleryImages[currentImageIndex]}
                                alt={`Vista grande ${currentImageIndex + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain mx-auto rounded-lg shadow-2xl"
                            />

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                {currentImageIndex + 1} / {galleryImages.length}
                            </div>
                        </div>

                        {galleryImages.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-6 text-white/50 hover:text-white p-4"
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
