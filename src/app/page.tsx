'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin,
  Shield,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import PropertySearchBar from '@/components/PropertySearchBar';
import { Propiedad, getPropiedades } from '@/lib/supabase';
import BannerAd from '@/components/BannerAd';
import { SocialBand } from '@/components/SocialBand';

// Carousel Component
const CarouselBackground = () => {
  const images = [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop", // Modern Interior
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop", // Luxury Exterior
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop", // Bedroom / Living
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${images[index]})` }}
    />
  );
};

// Mock data for demo when Supabase is not connected
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
    title: 'Loft Industrial en San Telmo',
    price: 285000,
    operation: 'venta',
    type: 'Departamento',
    m2: 95,
    bedrooms: 2,
    bathrooms: 2,
    coords_lat: -34.6212,
    coords_lng: -58.3725,
    image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    address: 'San Telmo, Buenos Aires',
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Casa con Jardín en Belgrano',
    price: 3200,
    operation: 'alquiler',
    type: 'Casa',
    m2: 180,
    bedrooms: 3,
    bathrooms: 2,
    coords_lat: -34.5625,
    coords_lng: -58.4338,
    image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    address: 'Belgrano, Buenos Aires',
    created_at: new Date().toISOString(),
  },
];

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
    image_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
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
    image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800',
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
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    address: 'Centro, Buenos Aires',
    created_at: new Date().toISOString(),
  },
];

const features = [
  {
    icon: MapPin,
    title: 'Explorador 3D',
    description: 'Visualiza propiedades en un mapa interactivo con vista tridimensional.',
  },
  {
    icon: Shield,
    title: 'Transacciones Seguras',
    description: 'Garantizamos la seguridad en cada paso del proceso inmobiliario.',
  },
  {
    icon: Sparkles,
    title: 'Experiencia Premium',
    description: 'Atención personalizada y asesoramiento experto en cada consulta.',
  },
];

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Propiedad[]>(mockProperties);
  const [featuredFondos, setFeaturedFondos] = useState<Propiedad[]>(mockFondos);
  // true mientras se muestren fichas de demostración (la base está vacía)
  const [demoProps, setDemoProps] = useState(true);
  const [demoFondos, setDemoFondos] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  /** pausa el autoplay cuando el mouse está sobre las fichas */
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollFondos = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await getPropiedades({ isFeatured: true });
        if (properties.length > 0) {
          const p = properties.filter((props) => props.type && props.type.toLowerCase() !== 'fondo_comercio' && props.type.toLowerCase() !== 'fondo de comercio');
          const f = properties.filter((props) => props.type && (props.type.toLowerCase() === 'fondo_comercio' || props.type.toLowerCase() === 'fondo de comercio'));

          setFeaturedProperties(p.length > 0 ? p.slice(0, 9) : mockProperties);
          setFeaturedFondos(f.length > 0 ? f.slice(0, 9) : mockFondos);
          setDemoProps(p.length === 0);
          setDemoFondos(f.length === 0);
        } else {
          setFeaturedProperties(mockProperties);
          setFeaturedFondos(mockFondos);
          setDemoProps(true);
          setDemoFondos(true);
        }
      } catch {
        console.log('Using mock data');
        setFeaturedProperties(mockProperties);
        setFeaturedFondos(mockFondos);
        setDemoProps(true);
        setDemoFondos(true);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    if (paused || featuredProperties.length <= 3) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, featuredProperties.length]);

  const getVisibleProperties = () => {
    if (featuredProperties.length === 0) return [];
    if (featuredProperties.length <= 3) return featuredProperties;

    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(featuredProperties[(currentIndex + i) % featuredProperties.length]);
    }
    return visible;
  };

  return (
    <div className="relative ov-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Background Image with Motion */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* High-quality modern architecture image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop')",
              }}
            />
          </motion.div>

          {/* Overlay Gradient - Ensures text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90"></div>

          {/* Subtle Accent blobs - now blending with the image */}
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--primary-blue)] opacity-[0.05] blur-[100px]"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--primary-blue)] opacity-[0.05] blur-[80px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 pt-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 bg-white shadow-sm border"
              style={{ borderColor: 'rgba(184, 134, 59, 0.35)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-dark)' }} />
              <span className="eyebrow !text-slate-800" style={{ fontSize: '0.8125rem' }}>Tu hogar es tu refugio</span>
            </motion.div>

            {/* Title — display serif editorial */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="display-xl mb-8 !text-slate-900"
            >
              Encuentra tu{' '}
              <span className="italic" style={{ color: 'var(--accent-dark)' }}>
                hogar ideal
              </span>
              {' '}con nosotros
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lead !text-slate-700 mb-12 max-w-2xl mx-auto font-medium"
            >
              Profesionalismo y experiencia para encontrar la propiedad perfecta.
              Explora nuestro catálogo exclusivo.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                href="/propiedades"
                className="btn-primary flex items-center gap-2 group"
              >
                Explorar Propiedades
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/gestion-legal"
                className="btn-secondary"
              >
                Gestión Legal y Cobranza
              </Link>
            </motion.div>

            {/* Buscador — elemento principal del hero, tratamiento glass */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-12 max-w-4xl mx-auto p-3 md:p-4 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-900/10"
            >
              <PropertySearchBar />
              <p className="text-[0.8125rem] text-slate-600 mt-4 font-medium text-center">
                Vendé, alquilá o tasá con acompañamiento profesional.
              </p>
            </motion.div>
          </div>

          {/* Barra de confianza — servicios verificables, sin números inventados */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-8 py-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/70">
              {['Venta', 'Alquiler', 'Tasaciones', 'Fondos de comercio', 'Gestión Legal'].map((servicio, i) => (
                <div key={servicio} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent-color)' }} />
                  <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{servicio}</span>
                  {i < 4 && <span className="hidden md:block w-px h-4 bg-slate-200 ml-6" />}
                </div>
              ))}
            </div>
            <p className="text-[0.8125rem] text-slate-600 mt-4 text-center font-medium">
              Buenos Aires, Argentina — acompañamiento integral en cada operación.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="section bg-[var(--bg-page)]">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="eyebrow block mb-4"
                style={{ color: 'var(--accent-dark)' }}
              >
                Selección exclusiva
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="display-lg mb-4 block !text-slate-900"
              >
                Propiedades Destacadas
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="h-1 w-24 rounded-full mb-5 origin-left"
                style={{ background: 'linear-gradient(90deg, var(--accent-color), transparent)' }}
              />
              <p className="lead !text-slate-700 font-medium">
                Descubre las mejores opciones seleccionadas por nuestro equipo de expertos inmobiliarios.
              </p>
            </div>

            <Link
              href="/propiedades"
              className="hidden md:flex items-center gap-2 text-[var(--primary-blue)] font-bold hover:gap-3 transition-all duration-200 uppercase text-sm tracking-widest"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Properties Grid */}
          {(demoProps || demoFondos) && (
            <div className="mb-8 p-4 rounded-2xl border text-sm font-medium flex flex-col sm:flex-row sm:items-center gap-3" style={{ background: 'rgba(184, 134, 59, 0.08)', borderColor: 'rgba(184, 134, 59, 0.3)' }}>
              <span className="text-lg">🚧</span>
              <p className="flex-1" style={{ color: 'var(--accent-dark)' }}>
                El catálogo todavía no tiene cargados inmuebles reales. Las fichas marcadas como
                <strong> «Ejemplo»</strong> son de muestra y se reemplazan en cuanto se publiquen
                propiedades desde el panel.
              </p>
              <a
                href="/contacto"
                className="shrink-0 px-4 py-2 rounded-lg font-bold transition-colors text-center text-white"
                style={{ background: 'var(--primary-blue)' }}
              >
                Publicar mi propiedad
              </a>
            </div>
          )}

          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden py-4 px-2">
              <AnimatePresence mode="popLayout">
                {getVisibleProperties().map((property, index) => (
                  <motion.div
                    key={property.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -24 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      layout: { type: 'spring', stiffness: 260, damping: 28 },
                    }}
                  >
                    <PropertyCard property={property} index={index} esEjemplo={demoProps} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Indicadores del carrusel — sólo si hay más de 3 destacadas */}
            {featuredProperties.length > 3 && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  {featuredProperties.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`Ver destacada ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? 'w-8 bg-[var(--primary-blue)]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
                {/* Barra de progreso del autoplay (se congela con el mouse encima) */}
                <div className="h-0.5 w-40 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    key={`${currentIndex}-${paused}`}
                    className={`h-full bg-gradient-to-r from-[var(--primary-blue)] to-[var(--accent-color)] ${paused ? '' : 'autoplay-bar'}`}
                    style={paused ? { transform: 'scaleX(0)' } : undefined}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/propiedades"
              className="btn-secondary"
            >
              Ver todas las propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Background Carousel */}
      <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden py-24">
        {/* Carousel Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode='wait'>
            <CarouselBackground />
          </AnimatePresence>
          {/* Light Overlay for readability - High opacity white for a clean look */}
          <div className="absolute inset-0 bg-white/75 z-10" />
        </div >

        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="display-lg mb-6 !text-slate-900"
            >
              ¿Por qué elegirnos?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lead mx-auto max-w-2xl !text-slate-700 font-medium"
            >
              Combinamos tecnología de vanguardia con un servicio personalizado
              para ofrecerte la mejor experiencia inmobiliaria.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-10 rounded-3xl text-center transition-all duration-300 backdrop-blur-xl bg-slate-100/80 border border-slate-200/50 hover:bg-white hover:scale-105 hover:shadow-xl"
                >
                  <div
                    className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md"
                    style={{
                      background: 'var(--primary-blue)',
                      color: 'var(--accent-light)',
                    }}
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="display-md !text-slate-900 mb-4" style={{ fontSize: '1.5rem' }}>{feature.title}</h3>
                  <p className="!text-slate-700 leading-relaxed text-[0.9375rem] font-medium">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section >

      {/* Tasaciones Section */}
      <section className="py-24 md:my-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #16345c 70%, #0b1f3a 100%)' }}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25 blur-[120px]" style={{ background: 'var(--accent-color)' }} />
          <div className="absolute inset-0 opacity-[0.06] pattern-grid-lg" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border border-white/15 bg-white/5 backdrop-blur-sm"
              >
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--accent-light)' }} />
                <span className="eyebrow text-slate-200" style={{ fontSize: '0.8125rem' }}>Servicios Especializados</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="display-lg text-white mb-6"
              >
                Tasaciones
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="lead text-slate-300 mb-8 max-w-xl"
              >
                Tome decisiones informadas. Brindamos asesoramiento integral para conocer el valor real de su inmueble, garantizando total confidencialidad y los mejores resultados del mercado.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/tasaciones"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl flex justify-center items-center gap-2"
                style={{ background: 'var(--accent-color)', color: '#0b1f3a' }}
              >
                Solicitar Tasación
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contacto"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/25 hover:border-white/60 text-slate-100 rounded-xl font-bold transition-all flex justify-center items-center"
              >
                Hablar con un Asesor
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fondos de Comercio Section */}
      <section className="section bg-[var(--bg-page)] py-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="eyebrow block mb-4"
                style={{ color: 'var(--accent-dark)' }}
              >
                Oportunidades de negocio
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="display-lg mb-4 block !text-slate-900"
              >
                Fondos de Comercio Destacados
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="h-1 w-24 rounded-full mb-5 origin-left"
                style={{ background: 'linear-gradient(90deg, var(--accent-color), transparent)' }}
              />
              <p className="lead !text-slate-700 font-medium">
                Oportunidades de negocio llave en mano, listas para continuar operando y generando rentabilidad.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => scrollFondos('left')}
                className="p-2 md:p-3 rounded-full bg-white border border-gray-100 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:scale-105 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollFondos('right')}
                className="p-2 md:p-3 rounded-full bg-white border border-gray-100 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] hover:scale-105 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <AnimatePresence mode="popLayout">
              {featuredFondos.length > 0 ? featuredFondos.map((fondo, index) => (
                <motion.div
                  key={fondo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="min-w-[320px] md:min-w-[400px] flex-shrink-0 snap-start"
                >
                  <PropertyCard property={fondo} index={index} esEjemplo={demoFondos} />
                </motion.div>
              )) : (
                <div className="w-full flex flex-col items-center justify-center py-10 text-slate-500">
                  <p>Descubriendo nuevas oportunidades de negocio...</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/fondos-de-comercio"
              className="btn-secondary"
            >
              Ver todos los fondos
            </Link>
          </div>
        </div>
      </section>

      {/* Gestión Legal Section — banda oscura de sub-marca para que el banner destaque */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0b1f3a 0%, #16345c 55%, #0b1f3a 100%)' }}
      >
        {/* Resaltes de luz */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#b8863b] opacity-20 blur-[130px]" />
        <div className="absolute -bottom-40 -right-24 w-[380px] h-[380px] rounded-full bg-[#0d9488] opacity-15 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.06] pattern-grid-lg" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="eyebrow block mb-4" style={{ color: 'var(--accent-light)' }}>
              Sub-marca especializada
            </span>
            <h2 className="display-lg text-white mb-5">
              Gestión Legal y Cobranza de Mora
            </h2>
            <p className="lead text-slate-300">
              Deudas en mora, vía extrajudicial y judicial, con asesoramiento jurídico integral
              para inmobiliarias, administraciones y propietarios.
            </p>
          </motion.div>

          <BannerAd
            eyebrow="Cobranza de mora"
            accent="#b8863b"
            title="Recuperá lo que te deben, sin vueltas"
            description="Seguimiento profesional de deudas en mora en instancia extrajudicial y judicial, con asesoramiento jurídico integral para inmobiliarias y propietarios."
            imageUrl="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=80&auto=format&fit=crop"
            linkUrl="/gestion-legal"
            ctaText="Conocer el Servicio"
          />
        </div>
      </section>

      {/* Redes sociales — presencia visual antes del cierre */}
      <SocialBand />

      {/* CTA Section */}
      < section className="section" >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] px-8 py-20 md:py-28 text-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #0b1f3a 0%, #16345c 50%, #0b1f3a 100%)' }}
          >
            {/* Retícula sutil */}
            <div className="absolute inset-0 opacity-[0.06] pattern-grid-lg"></div>

            {/* Resalte dorado centrado — simetría, no tira a un lado */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full opacity-20 blur-[130px] pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--accent-color) 0%, transparent 70%)' }}
            />
            {/* Filete dorado superior centrado */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-40 rounded-full"
              style={{ background: 'var(--accent-color)' }}
            />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <span className="eyebrow mb-6" style={{ color: 'var(--accent-light)' }}>
                Empezá hoy
              </span>
              <h2 className="display-lg text-white mb-6 text-balance">
                ¿Listo para encontrar<br className="hidden sm:block" /> tu próximo hogar?
              </h2>
              <p className="lead text-slate-300 mb-10 max-w-xl">
                Nuestro equipo de expertos está listo para ayudarte a encontrar
                la propiedad perfecta que se adapte a tus necesidades.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/propiedades"
                  className="inline-flex items-center gap-3 px-10 py-4 text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
                  style={{ background: 'var(--accent-color)', color: '#0b1f3a' }}
                >
                  Explorar Propiedades
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/tasaciones"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full border border-white/25 text-white hover:bg-white/10 transition-all"
                >
                  Solicitar una tasación
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section >
    </div >
  );
}
