'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Servicio } from '@/lib/supabase';
import StarRating from './StarRating';

interface ServiceCardProps {
    service: Servicio;
    index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -12,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(0, 212, 255, 0.15)'
            }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer"
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            }}
        >
            {/* Header */}
            <div className="relative p-6 pb-0">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                        className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-cover bg-center"
                        style={{
                            backgroundImage: service.image_url
                                ? `url(${service.image_url})`
                                : 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                        }}
                    >
                        {!service.image_url && (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#0a0a1a]">
                                {service.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-[#00d4ff] transition-colors">
                            {service.name}
                        </h3>

                        {/* Category Badge */}
                        <span
                            className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                                background: 'rgba(168, 85, 247, 0.15)',
                                color: '#a855f7',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                            }}
                        >
                            {service.category}
                        </span>

                        {/* Rating */}
                        <div className="mt-2">
                            <StarRating rating={service.rating} showValue size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                    {service.skill_tags?.slice(0, 4).map((skill, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{
                                background: 'rgba(0, 212, 255, 0.1)',
                                color: '#00d4ff',
                                border: '1px solid rgba(0, 212, 255, 0.2)',
                            }}
                        >
                            {skill}
                        </span>
                    ))}
                    {service.skill_tags && service.skill_tags.length > 4 && (
                        <span className="px-2 py-1 text-xs text-neutral-400">
                            +{service.skill_tags.length - 4} más
                        </span>
                    )}
                </div>
            </div>

            {/* Description */}
            {service.description && (
                <div className="px-6 pb-4">
                    <p className="text-neutral-400 text-sm line-clamp-2">
                        {service.description}
                    </p>
                </div>
            )}

            {/* Contact Actions */}
            <div
                className="px-6 py-4 border-t border-white/10"
                style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                }}
            >
                <div className="flex items-center gap-3">
                    {service.phone && (
                        <a
                            href={`tel:${service.phone}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'rgba(0, 212, 255, 0.1)',
                                color: '#00d4ff',
                                border: '1px solid rgba(0, 212, 255, 0.3)',
                            }}
                        >
                            <Phone className="w-4 h-4" />
                            <span>Llamar</span>
                        </a>
                    )}

                    {service.email && (
                        <a
                            href={`mailto:${service.email}`}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'rgba(168, 85, 247, 0.1)',
                                color: '#a855f7',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                            }}
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                        </a>
                    )}

                    <a
                        href={`https://wa.me/${service.contact?.replace(/\D/g, '') || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110"
                        style={{
                            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                            color: 'white',
                        }}
                    >
                        <MessageCircle className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Hover Glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.1), transparent 60%)',
                }}
            />
        </motion.div>
    );
}
