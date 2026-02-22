'use client';

import { motion } from 'framer-motion';
import { Tag, MapPin, Store, Phone, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Oportunidad } from '@/lib/supabase';

interface OportunidadCardProps {
    oportunidad: Oportunidad;
    index?: number;
}

export default function OportunidadCard({ oportunidad, index = 0 }: OportunidadCardProps) {
    const router = useRouter();

    const formatPrice = (price?: number) => {
        if (!price) return 'Consultar precio';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.1,
                layout: { type: 'spring', stiffness: 300, damping: 30 }
            }}
            onClick={() => router.push(`/oportunidades/${oportunidad.id}`)}
            className="group relative rounded-[var(--radius-card)] overflow-hidden cursor-pointer bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
        >
            {/* Header Image */}
            <div className="relative h-56 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: `url(${oportunidad.image_url})`,
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Seller Badge */}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[var(--text-main)] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {oportunidad.seller_name}
                    </span>
                </div>

                {/* Discount Badge */}
                {oportunidad.discount && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white font-black px-3 py-1 rounded-full text-xs shadow-lg flex items-center gap-1 uppercase tracking-wider">
                        <Tag className="w-3 h-3" />
                        -{oportunidad.discount}%
                    </div>
                )}

                {/* Price */}
                <div className="absolute bottom-4 left-4 text-white drop-shadow-md">
                    <p className="text-2xl font-bold font-headings">
                        {formatPrice(oportunidad.price)}
                    </p>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wide mb-2">
                    <Store className="w-4 h-4 text-[var(--primary-blue)]" />
                    {oportunidad.category}
                </div>

                <h3 className="text-lg font-bold text-[var(--text-main)] mb-2 font-headings line-clamp-2 leading-tight group-hover:text-[var(--primary-blue)] transition-colors">
                    {oportunidad.title}
                </h3>

                <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-[var(--primary-blue)]" />
                    <span className="line-clamp-1">{oportunidad.location || 'Consultar retiro'}</span>
                </div>

                <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                    {oportunidad.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--primary-blue)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        VER OFERTA →
                    </span>
                    <div className="flex items-center gap-2">
                        {oportunidad.contact_phone && (
                            <a
                                onClick={(e) => e.stopPropagation()}
                                href={`https://wa.me/${oportunidad.contact_phone.replace(/\D/g, '')}?text=Hola,%20quisiera%20más%20información%20sobre%20la%20oportunidad:%20${oportunidad.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex justify-center items-center gap-2 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-xl transition-all shadow-sm group/btn"
                                title="WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                            </a>
                        )}

                        {oportunidad.contact_phone && (
                            <a
                                onClick={(e) => e.stopPropagation()}
                                href={`tel:${oportunidad.contact_phone}`}
                                className="w-10 h-10 flex justify-center items-center rounded-xl bg-blue-50 text-[var(--primary-blue)] hover:bg-[var(--primary-blue)] hover:text-white transition-all shadow-sm group/btn"
                                title="Llamar"
                            >
                                <Phone className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
