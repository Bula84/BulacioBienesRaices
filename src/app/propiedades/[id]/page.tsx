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
import PropertyChat from '@/components/PropertyChat';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-64 lg:h-96 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
            Cargando mapa...
        </div>
    ),
});

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

const mockFondos: Propiedad[] = [
    {
        id: 'f1',
        title: 'Cafetería de Especialidad en Palermo',
        price: 45000,
        operation: 'venta',
        type: 'fondo_comercio',
        m2: 80,
        coords_lat: -34.582,
        coords_lng: -58.431,
        image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
        images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200',
            'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200',
        ],
        description: 'Excelente oportunidad de cafetería funcionando a pleno.',
        full_description: 'Ubicación privilegiada con cartera de clientes habituales. Equipamiento completo lista para trabajar. Se traspasa con mobiliario importado, máquinas y permisos correspondientes.',
        address: 'Palermo, Buenos Aires',
        created_at: new Date().toISOString(),
    },
    {
        id: 'f2',
        title: 'Minimercado y Kiosco',
        price: 25000,
        operation: 'venta',
        type: 'fondo_comercio',
        m2: 60,
        coords_lat: -34.612,
        coords_lng: -58.401,
        image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200',
        description: 'Kiosco y minimercado sobre avenida...',
        full_description: 'Local sobre importante avenida de alto tránsito. Mostradores, heladeras exhibidoras y gondolas en perfecto estado.',
        address: 'Balvanera, Buenos Aires',
        created_at: new Date().toISOString(),
    },
    {
        id: 'f3',
        title: 'Restaurante Equipado',
        price: 120000,
        operation: 'venta',
        type: 'fondo_comercio',
        m2: 150,
        coords_lat: -34.603,
        coords_lng: -58.381,
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
        description: 'Restaurante de primer nivel listo para continuar operando.',
        full_description: 'Instalaciones que contemplan cocina industrial doble, cámaras frigoríficas, salón finamente decorado. Con habilitaciones comerciales al día y excelente facturación mensual comprobable.',
        address: 'Centro, Buenos Aires',
        created_at: new Date().toISOString(),
    },
];

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
                const isFondoMock = mockFondos.find((f) => f.id === params.id);
                if (isFondoMock) {
                    setProperty(isFondoMock);
                } else {
                    setProperty(mockProperty);
                }
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
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-[var(--primary-blue)] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Cargando propiedad...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
                <div className="text-center">
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-extrabold !text-slate-900 mb-2">Propiedad no encontrada</h1>
                    <p className="font-medium !text-slate-700 mb-6 text-lg">La propiedad que buscas no existe o fue eliminada.</p>
                    <Link
                        href="/propiedades"
                        className="btn-primary flex items-center gap-2"
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

            <main className="min-h-screen pt-24 pb-12 bg-[var(--bg-page)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm font-semibold !text-slate-600 mb-6">
                        <Link href="/" className="hover:!text-[var(--primary-blue)] transition-colors">Inicio</Link>
                        <span>/</span>
                        <Link href="/propiedades" className="hover:!text-[var(--primary-blue)] transition-colors">Propiedades</Link>
                        <span>/</span>
                        <span className="text-[var(--primary-blue)] font-bold">{property.type}</span>
                    </nav>

                    {/* Back button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 font-semibold !text-slate-600 hover:!text-[var(--primary-blue)] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Images and Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Main Image Gallery */}
                            <div
                                className="relative rounded-[2rem] overflow-hidden group shadow-lg"
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
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/20"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 border border-white/20"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                {/* Image Counter & Fullscreen */}
                                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                    <span className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-sm font-medium border border-white/10">
                                        {currentImageIndex + 1} / {images.length} Fotos
                                    </span>
                                    <button
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="p-2 rounded-lg bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/10"
                                    >
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Operation Badge */}
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm ${property.operation === 'venta'
                                            ? 'bg-[var(--primary-blue)] text-white'
                                            : 'bg-[var(--status-rent)] text-white'
                                            }`}
                                    >
                                        {property.operation === 'venta' ? 'En Venta' : 'En Alquiler'}
                                    </span>
                                </div>

                                {/* Favorite & Share */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className={`p-2 rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-sm ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={shareProperty}
                                        className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors border border-white/10 shadow-sm"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${currentImageIndex === index
                                                ? 'ring-2 ring-[var(--primary-blue)] ring-offset-2'
                                                : 'opacity-70 hover:opacity-100'
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
                            {property.video_url?.trim() && (
                                <div className="card p-8 bg-white border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
                                            <Play className="w-6 h-6 text-red-500 fill-current" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[var(--text-main)] font-headings">Video Tour</h2>
                                    </div>
                                    <div className="relative rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: '16/9' }}>
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
                            <div className="card p-8 bg-white border border-gray-100">
                                <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                                    <div>
                                        <h1 className="text-3xl md:text-5xl font-extrabold !text-slate-900 mb-3 font-headings tracking-tight">
                                            {property.title}
                                        </h1>
                                        <div className="flex items-center gap-2 font-medium !text-slate-700">
                                            <MapPin className="w-5 h-5 text-[var(--primary-blue)]" />
                                            <span className="text-lg font-medium">
                                                {property.address && `${property.address}, `}
                                                {property.neighborhood && `${property.neighborhood}, `}
                                                {property.city}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right bg-blue-50/50 p-4 rounded-2xl">
                                        <p className="text-sm font-bold !text-slate-700 uppercase tracking-wide">Precio</p>
                                        <p className="text-3xl font-extrabold text-[var(--primary-blue)] font-headings">
                                            USD {property.price.toLocaleString('es-AR')}
                                        </p>
                                        {property.operation === 'alquiler' && (
                                            <p className="text-sm font-medium !text-slate-700">/mes</p>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-[var(--primary-blue)]">
                                            <Square className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="!text-slate-900 font-extrabold text-lg">{property.m2} m²</p>
                                            <p className="text-xs font-bold !text-slate-600 uppercase tracking-wide">Superficie</p>
                                        </div>
                                    </div>
                                    {property.bedrooms && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-[var(--primary-blue)]">
                                                <Bed className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="!text-slate-900 font-extrabold text-lg">{property.bedrooms}</p>
                                                <p className="text-xs font-bold !text-slate-600 uppercase tracking-wide">Dormitorios</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-[var(--primary-blue)]">
                                                <Bath className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="!text-slate-900 font-extrabold text-lg">{property.bathrooms}</p>
                                                <p className="text-xs font-bold !text-slate-600 uppercase tracking-wide">Baños</p>
                                            </div>
                                        </div>
                                    )}
                                    {property.parking && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-[var(--primary-blue)]">
                                                <Car className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="!text-slate-900 font-extrabold text-lg">{property.parking}</p>
                                                <p className="text-xs font-bold !text-slate-600 uppercase tracking-wide">Cocheras</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="card p-8 bg-white border border-gray-100">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings">Descripción</h2>
                                <div className="font-medium !text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                                    {property.full_description || property.description || 'Sin descripción disponible.'}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="card p-8 bg-white border border-gray-100">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings">Características y Amenities</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {amenities.map(({ key, label, icon: Icon }) => {
                                        const hasAmenity = property[key as keyof Propiedad];
                                        if (hasAmenity === undefined) return null;

                                        return (
                                            <div
                                                key={key}
                                                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${hasAmenity
                                                    ? 'bg-blue-50/30 border-blue-100 text-[var(--primary-blue)]'
                                                    : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-sm font-semibold">{label}</span>
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

                            {/* Location */}
                            <div className="card p-8 bg-white border border-gray-100">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings">Ubicación</h2>
                                <div className="h-80 lg:h-96 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative">
                                    <PropertyMap properties={[property]} />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="card p-8 bg-white border border-gray-100">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-6 font-headings">Detalles Adicionales</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">Tipo</p>
                                        <p className="!text-slate-900 font-bold">{property.type}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">Superficie Total</p>
                                        <p className="!text-slate-900 font-bold">{property.m2} m²</p>
                                    </div>
                                    {property.m2_covered && (
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">Superficie Cubierta</p>
                                            <p className="!text-slate-900 font-bold">{property.m2_covered} m²</p>
                                        </div>
                                    )}
                                    {property.year_built && (
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">Año Construcción</p>
                                            <p className="!text-slate-900 font-bold">{property.year_built}</p>
                                        </div>
                                    )}
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">ID Propiedad</p>
                                        <p className="!text-slate-900 font-bold">{property.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <p className="font-bold !text-slate-600 text-xs uppercase tracking-wide mb-1">Publicado</p>
                                        <p className="!text-slate-900 font-bold">
                                            {new Date(property.created_at).toLocaleDateString('es-AR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl">
                                <h2 className="text-2xl font-extrabold !text-slate-900 mb-2 font-headings">¿Te interesa esta propiedad?</h2>
                                <p className="font-medium !text-slate-700 mb-8 text-base">Completa el formulario y nos contactaremos contigo a la brevedad.</p>

                                {/* Quick Contact Buttons */}
                                <div className="flex gap-3 mb-8">
                                    <button
                                        onClick={openWhatsApp}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-md shadow-green-500/20"
                                        style={{ background: '#25D366' }}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        WhatsApp
                                    </button>
                                    <a
                                        href={`tel:${property.contact_phone || '+541112345678'}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-blue-500/20 shadow-md"
                                        style={{ background: 'var(--primary-blue)' }}
                                    >
                                        <Phone className="w-5 h-5" />
                                        Llamar
                                    </a>
                                </div>

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-4 font-bold !text-slate-500 tracking-wide">o envía un email</span>
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
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Tu teléfono"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Tu email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder={`Hola, me interesa la propiedad "${property.title}". Me gustaría recibir más información.`}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 transition-all resize-none font-medium"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={formSubmitted}
                                        className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 uppercase tracking-wide text-sm"
                                        style={{
                                            background: formSubmitted
                                                ? '#10b981'
                                                : 'var(--primary-blue)',
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
                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                                    {property.contact_phone && (
                                        <div className="flex items-center gap-3 font-bold !text-slate-600">
                                            <Phone className="w-4 h-4 text-[var(--primary-blue)]" />
                                            <span>{property.contact_phone}</span>
                                        </div>
                                    )}
                                    {property.contact_email && (
                                        <div className="flex items-center gap-3 font-bold !text-slate-600">
                                            <Mail className="w-4 h-4 text-[var(--primary-blue)]" />
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

            {/* AI Chat Agent */}
            {property && (
                <PropertyChat property={property} />
            )}
        </>
    );
}
