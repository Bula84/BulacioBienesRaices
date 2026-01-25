'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Calendar,
    Phone,
    Mail,
    MessageCircle,
    Share2,
    Heart,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Home,
    Building,
    Trees,
    Waves,
    Dumbbell,
    Shield,
    Wind,
    Flame,
    PawPrint,
    Maximize2,
    Play
} from 'lucide-react';
import { getPropiedad, Propiedad } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

// Mock data for demo when property not found
const mockProperty: Propiedad = {
    id: 'demo',
    title: 'Departamento de Lujo en Puerto Madero',
    description: 'Espectacular departamento con vista al río en la mejor zona de Puerto Madero.',
    full_description: `Espectacular departamento de categoría ubicado en el corazón de Puerto Madero, con impresionantes vistas al río y a la ciudad.

Este exclusivo departamento cuenta con acabados de primera calidad, pisos de porcelanato importado, carpintería de diseño y una disposición que maximiza la luz natural durante todo el día.

La cocina está completamente equipada con electrodomésticos de alta gama, mesadas de granito y muebles bajo y sobre mesada. El living-comedor es amplio y luminoso, perfecto para recibir invitados o disfrutar de momentos en familia.

El edificio cuenta con amenities de primer nivel incluyendo piscina climatizada, gimnasio completamente equipado, SUM, seguridad 24 horas y cochera.

Ubicación privilegiada a pasos de los mejores restaurantes, bares y paseos de Puerto Madero. Excelente conectividad con el resto de la ciudad.`,
    price: 450000,
    operation: 'venta',
    type: 'Departamento',
    m2: 120,
    m2_covered: 110,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    floors: 1,
    year_built: 2020,
    coords_lat: -34.6118,
    coords_lng: -58.3625,
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200',
        'https://images.unsplash.com/photo-1560185127-6a8c28b6f1ef?w=1200',
        'https://images.unsplash.com/photo-1560185008-b033106af5c3?w=1200',
    ],
    address: 'Juana Manso 1500',
    city: 'Buenos Aires',
    neighborhood: 'Puerto Madero',
    has_pool: true,
    has_gym: true,
    has_security: true,
    has_elevator: true,
    has_ac: true,
    has_heating: true,
    has_balcony: true,
    has_laundry: true,
    pets_allowed: false,
    contact_phone: '+54 11 1234-5678',
    contact_whatsapp: '5491112345678',
    contact_email: 'info@bcbienesraices.com',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Demo video
    created_at: new Date().toISOString(),
};

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Propiedad | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        const loadProperty = async () => {
            if (!params.id) return;

            const data = await getPropiedad(params.id as string);
            if (data) {
                setProperty(data);
            } else {
                // Use mock data for demo
                setProperty(mockProperty);
            }
            setLoading(false);
        };

        loadProperty();
    }, [params.id]);

    const images = property?.images?.length ? property.images : [property?.image_url || ''];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send the form data
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        setTimeout(() => setFormSubmitted(false), 3000);
    };

    const openWhatsApp = () => {
        const phone = property?.contact_whatsapp || '5491112345678';
        const message = encodeURIComponent(
            `Hola, me interesa la propiedad: ${property?.title}\nID: ${property?.id}\nPrecio: USD ${property?.price?.toLocaleString('es-AR')}`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    const shareProperty = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property?.title,
                    text: `Mirá esta propiedad: ${property?.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado al portapapeles');
        }
    };

    const amenities = [
        { key: 'has_pool', label: 'Piscina', icon: Waves },
        { key: 'has_garden', label: 'Jardín', icon: Trees },
        { key: 'has_gym', label: 'Gimnasio', icon: Dumbbell },
        { key: 'has_security', label: 'Seguridad 24hs', icon: Shield },
        { key: 'has_elevator', label: 'Ascensor', icon: Building },
        { key: 'has_ac', label: 'Aire Acondicionado', icon: Wind },
        { key: 'has_heating', label: 'Calefacción', icon: Flame },
        { key: 'has_balcony', label: 'Balcón', icon: Home },
        { key: 'has_terrace', label: 'Terraza', icon: Square },
        { key: 'has_laundry', label: 'Lavadero', icon: Home },
        { key: 'has_storage', label: 'Baulera', icon: Home },
        { key: 'pets_allowed', label: 'Acepta Mascotas', icon: PawPrint },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-neutral-600 border-t-[#10b981] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Cargando propiedad...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Home className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Propiedad no encontrada</h1>
                    <p className="text-neutral-400 mb-6">La propiedad que buscas no existe o fue eliminada.</p>
                    <Link
                        href="/propiedades"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ver todas las propiedades
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <span>/</span>
                        <Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link>
                        <span>/</span>
                        <span className="text-white">{property.type}</span>
                    </nav>

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Images and Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Main Image Gallery */}
                            <div
                                className="relative rounded-2xl overflow-hidden group"
                                style={{ aspectRatio: '16/10' }}
                            >
                                <motion.img
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[currentImageIndex]}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Image Navigation */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter & Fullscreen */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <span className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm">
                                        {currentImageIndex + 1} / {images.length} Fotos
                                    </span>
                                    <button
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Operation Badge */}
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${property.operation === 'venta'
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-purple-500/90 text-white'
                                            }`}
                                    >
                                        {property.operation === 'venta' ? 'En Venta' : 'En Alquiler'}
                                    </span>
                                </div>

                                {/* Favorite & Share */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={shareProperty}
                                        className="p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${currentImageIndex === index
                                                ? 'ring-2 ring-[#10b981] ring-offset-2 ring-offset-[#0a0a1a]'
                                                : 'opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Vista ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Video Tour */}
                            {property.video_url && (
                                <div
                                    className="p-6 rounded-2xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/20">
                                            <Play className="w-5 h-5 text-red-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Video Tour</h2>
                                    </div>
                                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                                        {property.video_url.includes('youtube.com') || property.video_url.includes('youtu.be') ? (
                                            <iframe
                                                src={property.video_url.includes('embed')
                                                    ? property.video_url
                                                    : `https://www.youtube.com/embed/${property.video_url.split('v=')[1]?.split('&')[0] || property.video_url.split('/').pop()}`
                                                }
                                                title="Video Tour"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        ) : property.video_url.includes('vimeo.com') ? (
                                            <iframe
                                                src={property.video_url.includes('player.vimeo.com')
                                                    ? property.video_url
                                                    : `https://player.vimeo.com/video/${property.video_url.split('/').pop()}`
                                                }
                                                title="Video Tour"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        ) : (
                                            <video
                                                src={property.video_url}
                                                controls
                                                className="absolute inset-0 w-full h-full object-cover"
                                                poster={property.image_url}
                                            >
                                                Tu navegador no soporta el tag de video.
                                            </video>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Title and Price */}
                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                            {property.title}
                                        </h1>
                                        <div className="flex items-center gap-2 text-neutral-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>
                                                {property.address && `${property.address}, `}
                                                {property.neighborhood && `${property.neighborhood}, `}
                                                {property.city}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-neutral-400">Precio</p>
                                        <p className="text-3xl font-bold text-[#10b981]">
                                            USD {property.price.toLocaleString('es-AR')}
                                        </p>
                                        {property.operation === 'alquiler' && (
                                            <p className="text-sm text-neutral-400">/mes</p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/10">
                                            <Square className="w-5 h-5 text-[#10b981]" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{property.m2} m²</p>
                                            <p className="text-xs text-neutral-400">Superficie</p>
                                        </div>
                                    </div>
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/10">
                                                <Bed className="w-5 h-5 text-[#10b981]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{property.bedrooms}</p>
                                                <p className="text-xs text-neutral-400">Dormitorios</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/10">
                                                <Bath className="w-5 h-5 text-[#10b981]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{property.bathrooms}</p>
                                                <p className="text-xs text-neutral-400">Baños</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.parking && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#10b981]/10">
                                                <Car className="w-5 h-5 text-[#10b981]" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{property.parking}</p>
                                                <p className="text-xs text-neutral-400">Cocheras</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <h2 className="text-xl font-bold text-white mb-4">Descripción</h2>
                                <div className="text-neutral-300 leading-relaxed whitespace-pre-line">
                                    {property.full_description || property.description || 'Sin descripción disponible.'}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <h2 className="text-xl font-bold text-white mb-4">Características y Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {amenities.map(({ key, label, icon: Icon }) => {
                                        const hasAmenity = property[key as keyof Propiedad];
                                        if (hasAmenity === undefined) return null;

                                        return (
                                            <div
                                                key={key}
                                                className={`flex items-center gap-3 p-3 rounded-xl ${hasAmenity
                                                    ? 'bg-[#10b981]/10 text-[#10b981]'
                                                    : 'bg-white/5 text-neutral-500'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{label}</span>
                                                {hasAmenity ? (
                                                    <Check className="w-4 h-4 ml-auto" />
                                                ) : (
                                                    <X className="w-4 h-4 ml-auto" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div
                                className="p-6 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <h2 className="text-xl font-bold text-white mb-4">Detalles</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-neutral-400 text-sm">Tipo</p>
                                        <p className="text-white font-medium">{property.type}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-neutral-400 text-sm">Superficie Total</p>
                                        <p className="text-white font-medium">{property.m2} m²</p>
                                    </div>
                                    {property.m2_covered && (
                                        <div className="p-4 rounded-xl bg-white/5">
                                            <p className="text-neutral-400 text-sm">Superficie Cubierta</p>
                                            <p className="text-white font-medium">{property.m2_covered} m²</p>
                                        </div>
                                    )}
                                    {property.year_built && (
                                        <div className="p-4 rounded-xl bg-white/5">
                                            <p className="text-neutral-400 text-sm">Año de Construcción</p>
                                            <p className="text-white font-medium">{property.year_built}</p>
                                        </div>
                                    )}
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-neutral-400 text-sm">ID Propiedad</p>
                                        <p className="text-white font-medium">{property.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <p className="text-neutral-400 text-sm">Publicado</p>
                                        <p className="text-white font-medium">
                                            {new Date(property.created_at).toLocaleDateString('es-AR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="lg:col-span-1">
                            <div
                                className="sticky top-28 p-6 rounded-2xl"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                <h2 className="text-xl font-bold text-white mb-2">¿Te interesa esta propiedad?</h2>
                                <p className="text-neutral-400 text-sm mb-6">Completa el formulario y nos contactaremos contigo.</p>

                                {/* Quick Contact Buttons */}
                                <div className="flex gap-3 mb-6">
                                    <button
                                        onClick={openWhatsApp}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                                        style={{ background: '#25D366' }}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </button>
                                    <a
                                        href={`tel:${property.contact_phone || '+541112345678'}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                    >
                                        <Phone className="w-5 h-5" />
                                        Llamar
                                    </a>
                                </div>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-[#12122a] px-4 text-neutral-500">o envía un mensaje</span>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Tu teléfono"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Tu email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder={`Hola, me interesa la propiedad "${property.title}". Me gustaría recibir más información.`}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-[#10b981] transition-all resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formSubmitted}
                                        className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: formSubmitted
                                                ? '#10b981'
                                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        }}
                                    >
                                        {formSubmitted ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Check className="w-5 h-5" />
                                                ¡Mensaje Enviado!
                                            </span>
                                        ) : (
                                            'Enviar Consulta'
                                        )}
                                    </button>
                                </form>

                                {/* Contact Info */}
                                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                    {property.contact_phone && (
                                        <div className="flex items-center gap-3 text-neutral-400">
                                            <Phone className="w-4 h-4" />
                                            <span>{property.contact_phone}</span>
                                        </div>
                                    )}
                                    {property.contact_email && (
                                        <div className="flex items-center gap-3 text-neutral-400">
                                            <Mail className="w-4 h-4" />
                                            <span>{property.contact_email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fullscreen Gallery Modal */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={() => setIsGalleryOpen(false)}
                    >
                        <button
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <motion.img
                            key={currentImageIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            src={images[currentImageIndex]}
                            alt={property.title}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
                        />

                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }}
                                    className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-6' : 'bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
