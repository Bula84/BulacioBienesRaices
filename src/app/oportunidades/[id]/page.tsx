'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    MapPin,
    Store,
    Phone,
    MessageCircle,
    Tag,
    Share2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize
} from 'lucide-react';
import { Oportunidad, getOportunidad } from '@/lib/supabase';

// Mock data (fallback)
const mockOportunidadesDetails: Record<string, Oportunidad> = {
    '1': {
        id: '1',
        title: 'Ladrillos Retak - Lote de 500u',
        description: 'Venta de lote completo sobrante de obra. Excelente estado.',
        full_description: 'Ladrillos HCCA Retak de 15x25x50cm. Sobrantes de la obra en curso, paletizados y listos para retirar. Ideales para ampliaciones rápidas o pequeñas reformas. Se encuentran bajo techo, no tomaron humedad. Se vende el lote completo a precio rebajado por finalización de obra.',
        price: 850000,
        discount: 15,
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200',
        images: [
            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200',
            'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200'
        ],
        category: 'Materiales',
        seller_name: 'Corralón El Sol',
        contact_phone: '+541112345678',
        location: 'San Isidro, Buenos Aires',
        is_featured: true,
        created_at: new Date().toISOString(),
    },
    '2': {
        id: '2',
        title: 'Hormigonera Reforzada 130Lts',
        description: 'Hormigonera con motor blindado 3/4 HP. 1 mes de uso.',
        full_description: 'Hormigonera Trompo de 130 litros. Motor reforzado 3/4 HP. Corona de fundición. Sólo se usó para una losa pequeña durante un mes. Está limpia e impecable. La vendo por falta de espacio para guardarla.',
        price: 180000,
        discount: 25,
        image_url: 'https://images.unsplash.com/photo-1541888086925-920a0bfae407?w=1200',
        category: 'Maquinaria',
        seller_name: 'Ferretería Norte',
        contact_phone: '+541123456789',
        location: 'Nordelta, Tigre',
        is_featured: true,
        created_at: new Date().toISOString(),
    }
};

export default function OportunidadDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [oportunidad, setOportunidad] = useState<Oportunidad | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const loadPage = async () => {
            if (!params.id) return;
            const data = await getOportunidad(params.id as string);

            if (data) {
                setOportunidad(data);
            } else {
                // Fallback to mock
                const mock = mockOportunidadesDetails[params.id as string] || mockOportunidadesDetails['1'];
                setOportunidad(mock);
            }
            setIsLoading(false);
        };
        loadPage();
    }, [params.id]);

    const formatPrice = (price?: number) => {
        if (!price) return 'Consultar precio';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: oportunidad?.title,
                    text: `Mira esta oportunidad: ${oportunidad?.title}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 bg-[var(--bg-page)] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[var(--primary-blue)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!oportunidad) {
        return (
            <div className="min-h-screen pt-24 bg-[var(--bg-page)] flex flex-col justify-center items-center text-center p-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Tag className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-4 font-headings">Oferta no encontrada</h1>
                <p className="text-[var(--text-secondary)] mb-8 font-medium">La oportunidad que estás buscando ya no está disponible o no existe.</p>
                <button
                    onClick={() => router.push('/oportunidades')}
                    className="btn-primary"
                >
                    Volver a Oportunidades
                </button>
            </div>
        );
    }

    const allImages = oportunidad.images?.length ? oportunidad.images : [oportunidad.image_url];

    return (
        <main className="min-h-screen pt-24 pb-12 bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Breadcrumb & Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:bg-blue-50/50 transition-colors border border-gray-100 shadow-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Volver</span>
                    </button>

                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
                        <Link href="/oportunidades" className="hover:text-[var(--primary-blue)] transition-colors">Oportunidades</Link>
                        <span>/</span>
                        <span className="text-[var(--primary-blue)] px-2 py-0.5 bg-blue-50 rounded-md">{oportunidad.category}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Title & Tags Header */}
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-[var(--primary-blue)] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                                    <Store className="w-3.5 h-3.5" />
                                    {oportunidad.category}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(oportunidad.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-start gap-4">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-main)] font-headings tracking-tight leading-tight">
                                    {oportunidad.title}
                                </h1>
                                <button
                                    onClick={handleShare}
                                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shrink-0 group"
                                    title="Compartir"
                                >
                                    <Share2 className="w-5 h-5 text-gray-500 group-hover:text-[var(--primary-blue)]" />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-[var(--text-secondary)] font-medium text-lg">
                                <MapPin className="w-5 h-5 text-[var(--primary-blue)]" />
                                {oportunidad.location || 'Consultar lugar de retiro'}
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="bg-white rounded-3xl p-2 md:p-4 shadow-sm border border-gray-100 relative group">
                            <div className="relative h-[300px] md:h-[450px] rounded-2xl overflow-hidden bg-gray-100 w-full cursor-pointer" onClick={() => setIsFullscreen(true)}>
                                <img
                                    src={allImages[currentImageIndex]}
                                    alt={oportunidad.title}
                                    className="w-full h-full object-cover"
                                />

                                {allImages.length > 1 && (
                                    <>
                                        {/* Controls */}
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? allImages.length - 1 : i - 1) }}
                                                className="w-10 h-10 rounded-full bg-white/90 shadow-lg text-[var(--text-main)] hover:bg-[var(--primary-blue)] hover:text-white flex items-center justify-center pointer-events-auto transition-colors"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === allImages.length - 1 ? 0 : i + 1) }}
                                                className="w-10 h-10 rounded-full bg-white/90 shadow-lg text-[var(--text-main)] hover:bg-[var(--primary-blue)] hover:text-white flex items-center justify-center pointer-events-auto transition-colors"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </div>
                                        {/* Dots */}
                                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                                            {allImages.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-sm rounded-lg text-white hover:bg-black/60 transition-colors">
                                    <Maximize className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 mt-2 px-2 pb-2 overflow-x-auto hide-scrollbar">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[var(--primary-blue)] ring-2 ring-blue-500/20 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description block */}
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-[var(--text-main)] font-headings mb-6 flex items-center gap-3">
                                Detalles de la Oferta
                            </h2>
                            <div className="prose prose-lg prose-blue max-w-none prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed">
                                <p className="whitespace-pre-wrap">{oportunidad.full_description || oportunidad.description}</p>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Contact Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-lg border border-gray-100 sticky top-32 space-y-8">

                            {/* Price Block */}
                            <div className="text-center relative">
                                {oportunidad.discount && (
                                    <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-emerald-500 text-white font-black px-4 py-1.5 md:py-2 rounded-full text-sm shadow-xl flex items-center gap-1 uppercase tracking-wider md:scale-110 origin-top-right rotate-[10deg]">
                                        <Tag className="w-4 h-4" />
                                        -{oportunidad.discount}%
                                    </div>
                                )}

                                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">
                                    Precio de Oportunidad
                                </p>
                                <div className="text-4xl lg:text-5xl font-black text-[var(--primary-blue)] tracking-tight">
                                    {formatPrice(oportunidad.price)}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Precio contado. Consulta condiciones de pago.</p>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Seller Box */}
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                                    <Store className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Vendedor</p>
                                    <p className="font-bold text-[var(--text-main)] text-lg">{oportunidad.seller_name}</p>
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Vendedor Verificado
                                    </div>
                                </div>
                            </div>

                            {/* Contact Buttons */}
                            <div className="space-y-3 pt-2">
                                {oportunidad.contact_phone ? (
                                    <>
                                        <a
                                            href={`https://wa.me/${oportunidad.contact_phone.replace(/\D/g, '')}?text=Hola,%20me%20interesa%20la%20oportunidad:%20${oportunidad.title}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/30 hover:-translate-y-1"
                                        >
                                            <MessageCircle className="w-6 h-6" />
                                            Contactar por WhatsApp
                                        </a>
                                        <a
                                            href={`tel:${oportunidad.contact_phone}`}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-50 text-[var(--primary-blue)] hover:bg-[var(--primary-blue)] hover:text-white font-bold py-4 rounded-2xl transition-all border border-blue-100"
                                        >
                                            <Phone className="w-5 h-5" />
                                            Llamar al Vendedor
                                        </a>
                                    </>
                                ) : (
                                    <div className="p-4 bg-orange-50 text-orange-700 rounded-2xl text-center font-medium text-sm border border-orange-100">
                                        Este vendedor no ha proporcionado un teléfono de contacto público.
                                    </div>
                                )}
                            </div>

                            {/* Trust badges */}
                            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <Store className="w-4 h-4 text-[var(--primary-blue)]" />
                                    </div>
                                    <span>Trato directo con el comercio.</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <Tag className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span>Precios rebajados por saldos o excedentes.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Photo Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-xl">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? allImages.length - 1 : i - 1) }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === allImages.length - 1 ? 0 : i + 1) }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 hidden md:block"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <img
                        src={allImages[currentImageIndex]}
                        alt={oportunidad.title}
                        className="max-w-[95vw] max-h-[90vh] object-contain"
                    />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                        {currentImageIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </main>
    );
}
