'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BannerAdProps {
    imageUrl: string;
    linkUrl: string;
    title: string;
    description: string;
    ctaText?: string;
    /** Etiqueta pequeña sobre el título (ej: "Cobranza de mora"). */
    eyebrow?: string;
    /** Color de acento: eyebrow, CTA y resaltes. Por defecto, el dorado de marca. */
    accent?: string;
}

export default function BannerAd({
    imageUrl,
    linkUrl,
    title,
    description,
    ctaText = 'Más información',
    eyebrow,
    accent = '#b8863b',
}: BannerAdProps) {
    const isInternal = linkUrl.startsWith('/');
    const Wrapper = isInternal ? Link : 'a';
    const wrapperProps = isInternal
        ? { href: linkUrl }
        : { href: linkUrl, target: '_blank' as const, rel: 'noopener noreferrer' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 group"
        >
            <Wrapper
                {...wrapperProps}
                className="block relative min-h-[320px] md:min-h-[380px] lg:min-h-[420px] flex items-center"
            >
                {/* Imagen de fondo — zoom lento tipo Ken Burns al hacer hover */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />

                {/* Capas de lectura: marino profundo detrás del texto, la imagen respira hacia la derecha */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a]/95 via-[#0b1f3a]/82 to-[#0b1f3a]/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/50 via-transparent to-transparent" />

                {/* Brillo que barre el banner al hacer hover */}
                <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent -skew-x-12 transition-all duration-[1100ms] ease-out group-hover:left-[110%] pointer-events-none" />

                {/* Contenido — el contenedor crece con el texto: nunca se corta */}
                <div className="relative w-full p-8 md:p-12 lg:p-14 max-w-3xl">
                    {eyebrow && (
                        <span
                            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 w-fit rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] drop-shadow"
                            style={{ color: accent }}
                        >
                            {eyebrow}
                        </span>
                    )}

                    <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-5 font-headings text-balance leading-[1.1] drop-shadow-lg">
                        {title}
                    </h3>

                    <p className="text-slate-200 text-base md:text-lg mb-9 font-medium max-w-xl leading-relaxed drop-shadow-md">
                        {description}
                    </p>

                    <span
                        className="inline-flex items-center gap-3 w-fit px-7 py-3.5 rounded-xl font-bold text-[#0b1f3a] shadow-lg shadow-black/25 transition-all duration-300 group-hover:gap-4"
                        style={{ background: accent }}
                    >
                        {ctaText}
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                </div>
            </Wrapper>
        </motion.div>
    );
}
