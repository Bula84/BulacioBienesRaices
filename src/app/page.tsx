'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Users,
  ArrowRight,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Propiedad, getPropiedades } from '@/lib/supabase';

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
];

const stats = [
  { value: '500+', label: 'Propiedades', icon: Building2 },
  { value: '12K+', label: 'Clientes Satisfechos', icon: Users },
  { value: '98%', label: 'Tasa de Éxito', icon: TrendingUp },
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const properties = await getPropiedades();
        if (properties.length > 0) {
          setFeaturedProperties(properties.slice(0, 3));
        }
      } catch (error) {
        console.log('Using mock data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Gradient Orbs */}
          <div
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          />
          <div
            className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-15"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <span className="text-sm text-[#10b981] font-medium">Tu hogar es tu refugio</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Encuentra tu{' '}
              <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] bg-clip-text text-transparent">
                hogar ideal
              </span>
              {' '}con nosotros
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Profesionalismo y experiencia para encontrar
              la propiedad perfecta. Explora nuestro catálogo con mapas 3D interactivos.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/propiedades"
                className="group px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '0 4px 30px rgba(16, 185, 129, 0.4)',
                }}
              >
                Explorar Propiedades
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/nosotros"
                className="px-8 py-4 text-lg font-medium rounded-2xl transition-all duration-300 hover:bg-white/10 flex items-center gap-2"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              >
                Conocer Más
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 p-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#10b981]"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-3"
              >
                Propiedades Destacadas
              </motion.h2>
              <p className="text-neutral-400 max-w-lg">
                Descubre las mejores opciones seleccionadas por nuestro equipo de expertos.
              </p>
            </div>

            <Link
              href="/propiedades"
              className="group flex items-center gap-2 text-[#10b981] font-medium hover:gap-3 transition-all duration-200"
            >
              Ver todas las propiedades
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              ¿Por qué elegirnos?
            </motion.h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Combinamos tecnología de vanguardia con un servicio personalizado
              para ofrecerte la mejor experiencia inmobiliaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-8 rounded-[2rem] text-center transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Icon className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] p-12 md:p-16 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Background Glow */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-20"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)' }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para encontrar tu próximo hogar?
              </h2>
              <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
                Nuestro equipo de expertos está listo para ayudarte a encontrar
                la propiedad perfecta que se adapte a tus necesidades.
              </p>
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '0 4px 30px rgba(16, 185, 129, 0.4)',
                }}
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
