'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Servicio } from '@/lib/supabase';
import StarRating from './StarRating';

interface ServiceCardProps {
    service: Servicio;
    index?: number;
}

export default function ServiceCard({ service, index = 0 }: ServiceCardProps) {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -8,
                boxShadow: '0 20px 40px -10px rgba(33, 148, 207, 0.15)'
            }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => router.push(`/servicios/${service.id}`)}
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer bg-white border border-gray-100 shadow-sm"
        >
            {/* Header */}
            <div className="relative p-6 pb-0">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                        className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-cover bg-center shadow-md bg-gray-100"
                        style={{
                            backgroundImage: service.image_url
                                ? `url(${service.image_url})`
                                : undefined,
                        }}
                    >
                        {!service.image_url && (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 bg-gray-100">
                                {service.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[var(--text-main)] truncate group-hover:text-[var(--primary-blue)] transition-colors font-headings">
                            {service.name}
                        </h3>

                        {/* Category Badge */}
                        <span
                            className="inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide"
                            style={{
                                background: 'rgba(33, 148, 207, 0.1)',
                                color: 'var(--primary-blue)',
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
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-50 text-[var(--text-secondary)] border border-gray-100"
                        >
                            {skill}
                        </span>
                    ))}
                    {service.skill_tags && service.skill_tags.length > 4 && (
                        <span className="px-2 py-1 text-xs text-gray-400 font-medium">
                            +{service.skill_tags.length - 4} más
                        </span>
                    )}
                </div>
            </div>

            {/* Description */}
            {service.description && (
                <div className="px-6 pb-4">
                    <p className="text-[var(--text-secondary)] text-sm line-clamp-2">
                        {service.description}
                    </p>
                </div>
            )}

            {/* Contact Actions */}
            <div
                className="px-6 py-4 border-t border-gray-100 bg-gray-50/50"
            >
                <div className="flex items-center gap-3">
                    {service.phone && (
                        <a
                            href={`tel:${service.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 bg-white border border-gray-200 text-[var(--text-main)] hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)]"
                        >
                            <Phone className="w-4 h-4" />
                            <span>Llamar</span>
                        </a>
                    )}

                    {service.email && (
                        <a
                            href={`mailto:${service.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 bg-white border border-gray-200 text-[var(--text-main)] hover:border-[var(--primary-blue)] hover:text-[var(--primary-blue)]"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                        </a>
                    )}

                    <a
                        href={`https://wa.me/${service.contact?.replace(/\D/g, '') || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                        style={{
                            background: '#25D366',
                            color: 'white',
                        }}
                    >
                        <MessageCircle className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
}
