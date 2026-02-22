'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BannerAdProps {
    imageUrl: string;
    linkUrl: string;
    title: string;
    description: string;
    ctaText?: string;
}

export default function BannerAd({ imageUrl, linkUrl, title, description, ctaText = 'Mas información' }: BannerAdProps) {
    const isInternal = linkUrl.startsWith('/');
    const Wrapper = isInternal ? Link : 'a';
    const wrapperProps = isInternal
        ? { href: linkUrl }
        : { href: linkUrl, target: '_blank' as const, rel: 'noopener noreferrer' };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="w-full relative rounded-3xl overflow-hidden shadow-xl my-12"
        >
            <Wrapper {...wrapperProps} className="block relative h-[250px] md:h-[300px] group">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent transition-opacity duration-300 group-hover:from-black"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center p-8 md:p-12 max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full !text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 w-fit drop-shadow-md">
                        Publicidad
                    </span>
                    <h3 className="text-3xl md:text-5xl font-extrabold !text-white mb-4 font-headings text-balance leading-tight drop-shadow-lg">
                        {title}
                    </h3>
                    <p className="!text-white text-lg mb-8 font-medium max-w-lg text-balance drop-shadow-md opacity-90">
                        {description}
                    </p>
                    <div className="flex items-center gap-2 !text-white font-bold bg-[var(--primary-blue)] hover:bg-[#0f766e] transition-colors w-fit px-6 py-3 rounded-xl shadow-lg border border-white/10">
                        {ctaText}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </Wrapper>
        </motion.div>
    );
}
