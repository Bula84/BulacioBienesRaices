'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Propiedad } from '@/lib/supabase';
import { usePropertyStore } from '@/store/propertyStore';

interface PropertyCardProps {
    property: Propiedad;
    index?: number;
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
    const { setHoveredProperty, hoveredPropertyId } = usePropertyStore();

    const isHovered = hoveredPropertyId === property.id;

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString('es-AR')}`;
    };

    return (
        <Link href={`/propiedades/${property.id}`}>
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
                className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 ${isHovered ? 'ring-2 ring-[#10b981] ring-offset-2 ring-offset-[#0f1419]' : ''
                    }`}
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: isHovered
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(16, 185, 129, 0.2)'
                        : '0 4px 30px rgba(0, 0, 0, 0.2)',
                    transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
                }}
            >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                            backgroundImage: property.image_url
                                ? `url(${property.image_url})`
                                : 'linear-gradient(135deg, #252b33 0%, #1a1f26 100%)',
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(180deg, transparent 0%, rgba(15, 20, 25, 0.8) 100%)',
                        }}
                    />

                    {/* Operation Badge */}
                    <div className="absolute top-4 left-4">
                        <span
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${property.operation === 'venta'
                                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white'
                                : 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white'
                                }`}
                        >
                            {property.operation}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-bold text-white">
                            {formatPrice(property.price)}
                            {property.operation === 'alquiler' && (
                                <span className="text-sm font-normal text-neutral-300">/mes</span>
                            )}
                        </p>
                    </div>

                    {/* Photos count badge */}
                    {property.images && property.images.length > 1 && (
                        <div className="absolute bottom-4 right-4">
                            <span className="px-2 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-sm rounded-lg">
                                {property.images.length} fotos
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#10b981] transition-colors">
                        {property.title}
                    </h3>

                    {/* Location */}
                    {property.address && (
                        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="line-clamp-1">{property.address}</span>
                        </div>
                    )}

                    {/* Features */}
                    <div className="flex items-center gap-4 text-neutral-400">
                        {property.bedrooms && (
                            <div className="flex items-center gap-1.5">
                                <Bed className="w-4 h-4" />
                                <span className="text-sm">{property.bedrooms}</span>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="flex items-center gap-1.5">
                                <Bath className="w-4 h-4" />
                                <span className="text-sm">{property.bathrooms}</span>
                            </div>
                        )}
                        {property.m2 && (
                            <div className="flex items-center gap-1.5">
                                <Maximize className="w-4 h-4" />
                                <span className="text-sm">{property.m2} m²</span>
                            </div>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span
                            className="inline-block px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                            }}
                        >
                            {property.type}
                        </span>
                        <span className="text-xs text-neutral-500">Ver detalles →</span>
                    </div>
                </div>

                {/* Hover Glow Effect */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1), transparent 60%)',
                    }}
                />
            </motion.div>
        </Link>
    );
}
