'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize, MapPin, ImageIcon, ArrowRight } from 'lucide-react';
import { Propiedad } from '@/lib/supabase';
import { usePropertyStore } from '@/store/propertyStore';

interface PropertyCardProps {
    property: Propiedad;
    index?: number;
    /** true = ficha de demostración (no existe en la base de datos). */
    esEjemplo?: boolean;
}

export default function PropertyCard({ property, index = 0, esEjemplo = false }: PropertyCardProps) {
    const { setHoveredProperty } = usePropertyStore();

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString('es-AR')}`;
    };

    const card = (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    layout: { type: 'spring', stiffness: 300, damping: 30 }
                }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
                className={`group relative rounded-[var(--radius-card)] overflow-hidden cursor-pointer bg-white border transition-all duration-300 hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-2`}
                style={{ borderColor: '#e2e8f0' }}
            >
                {/* Filete dorado al hover */}
                <div
                    className="absolute top-0 inset-x-0 h-1 z-20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                    style={{ background: 'var(--accent-color)' }}
                />
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                            backgroundImage: property.image_url
                                ? `url(${property.image_url})`
                                : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        }}
                    />

                    {/* Gradient Overlay for Text Visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    {/* Operation Badge */}
                    <div className="absolute top-4 left-4">
                        <span
                            className={`px-3 py-1 text-[0.8125rem] font-bold uppercase tracking-wider rounded-full shadow-sm ${property.operation === 'venta'
                                ? 'text-white'
                                : 'text-white'
                                }`}
                            style={{ background: property.operation === 'venta' ? '#0b1f3a' : '#10B981' }}
                        >
                            {property.operation}
                        </span>
                    </div>

                    {/* Price — serif editorial */}
                    <div className="absolute bottom-4 left-4 text-white drop-shadow-md">
                        <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            {formatPrice(property.price)}
                            {property.operation === 'alquiler' && (
                                <span className="text-base font-normal text-white/90 ml-1">/mes</span>
                            )}
                        </p>
                    </div>

                    {/* Photos count badge */}
                    {property.images && property.images.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                            <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-black/40 backdrop-blur-sm rounded-lg">
                                <ImageIcon className="w-3 h-3" />
                                {property.images.length}
                            </span>
                        </div>
                    )}

                    {/* Marcador de ejemplo — para que nadie lo confunda con inventario real */}
                    {esEjemplo && (
                        <span className="absolute top-4 right-4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-400 text-amber-950 shadow-sm">
                            Ejemplo
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-2 line-clamp-1 group-hover:text-[var(--primary-blue)] transition-colors font-headings">
                        {property.title}
                    </h3>

                    {/* Location */}
                    {property.address && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-5">
                            <MapPin className="w-4 h-4 text-[var(--primary-blue)]" />
                            <span className="line-clamp-1 font-medium">{property.address}</span>
                        </div>
                    )}

                    {/* Features */}
                    <div className="flex items-center justify-between text-[var(--text-secondary)] py-4 border-t border-gray-100">
                        {property.bedrooms && (
                            <div className="flex items-center gap-2" title="Dormitorios">
                                <Bed className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold">{property.bedrooms}</span>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="flex items-center gap-2" title="Baños">
                                <Bath className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold">{property.bathrooms}</span>
                            </div>
                        )}
                        {property.m2 && (
                            <div className="flex items-center gap-2" title="Superficie">
                                <Maximize className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold">{property.m2} m²</span>
                            </div>
                        )}
                    </div>

                    {/* Type Badge & CTA */}
                    <div className="mt-4 flex items-center justify-between">
                        <span
                            className="inline-block px-3 py-1 text-[0.8125rem] font-semibold rounded-md uppercase tracking-wider text-slate-600 bg-slate-100"
                        >
                            {property.type}
                        </span>
                        <span
                            className="text-[0.8125rem] font-bold flex items-center gap-1 transition-all group-hover:gap-2"
                            style={{ color: 'var(--accent-dark)' }}
                        >
                            VER DETALLE
                            <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </div>
            </motion.div>
    );

    // Las fichas de ejemplo no navegan: esos IDs no existen en la base de datos.
    return esEjemplo ? (
        <div className="relative">{card}</div>
    ) : (
        <Link href={`/propiedades/${property.id}`}>{card}</Link>
    );
}
