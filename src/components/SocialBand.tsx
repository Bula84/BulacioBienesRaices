'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Music2, ExternalLink } from 'lucide-react';

/**
 * Redes sociales de la marca.
 *
 * ⚠️ PLACEHOLDERS: `href` y `handle` deben reemplazarse por los usuarios reales
 * de cada red antes de publicar. Están marcados con `data-placeholder="true"`
 * para poder buscarlos/auditarlos fácilmente (grep: data-placeholder).
 */
const socialLinks = [
    {
        icon: Instagram,
        label: 'Instagram',
        handle: '@tusuario_instagram',
        description: 'Propiedades, tour y detrás de cámaras',
        followers: '—',
        href: '#',
        gradient: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
        hover: '#c13584',
    },
    {
        icon: Facebook,
        label: 'Facebook',
        handle: '/tusuario_facebook',
        description: 'Novedades y oportunidades',
        followers: '—',
        href: '#',
        gradient: 'linear-gradient(135deg, #1877f2 0%, #0b1f3a 130%)',
        hover: '#1877f2',
    },
    {
        icon: Music2,
        label: 'TikTok',
        handle: '@tusuario_tiktok',
        description: 'Casas y locales en video',
        followers: '—',
        href: '#',
        gradient: 'linear-gradient(135deg, #0b1f3a 0%, #00f2ea 130%)',
        hover: '#0b1f3a',
    },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        handle: '/tusuario-linkedin',
        description: 'Perfil profesional y Gestión Legal',
        followers: '—',
        href: '#',
        gradient: 'linear-gradient(135deg, #0a66c2 0%, #0b1f3a 130%)',
        hover: '#0a66c2',
    },
];

/** Banda social dedicada — presencia visual antes del footer. */
export function SocialBand() {
    return (
        <section className="py-20 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <span className="eyebrow block mb-4" style={{ color: 'var(--accent-dark)' }}>
                            Comunidad
                        </span>
                        <h2 className="display-lg !text-slate-900">Seguinos en redes</h2>
                        <p className="lead !text-slate-700 mt-4">
                            Propiedades nuevas, recorridos y consejos, publicados a diario.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {socialLinks.map((social, i) => {
                        const Icon = social.icon;
                        return (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-placeholder="true"
                                aria-label={`Abrir ${social.label} (link de ejemplo)`}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="group relative overflow-hidden rounded-3xl p-7 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                                style={{ background: social.gradient }}
                            >
                                {/* Brillo que barre al hover */}
                                <div className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 transition-all duration-700 group-hover:left-[110%]" />

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-80 transition-opacity" />
                                    </div>

                                    <p className="text-[0.8125rem] font-bold uppercase tracking-widest opacity-80 mb-1">
                                        {social.label}
                                    </p>
                                    <p className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {social.handle}
                                    </p>
                                    <p className="text-[0.8125rem] opacity-85 leading-snug mb-4">
                                        {social.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <span className="text-[0.8125rem] font-semibold opacity-90">
                                            {social.followers} seguidores
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-bold">
                                            Seguir
                                            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

                <p className="text-[0.8125rem] text-slate-500 mt-8 text-center font-medium">
                    Los enlaces y seguidores mostrados son de ejemplo hasta configurar las cuentas reales de la marca.
                </p>
            </div>
        </section>
    );
}

/** Rail social sticky en desktop — aparece al scrollear, con tooltips. */
export function SocialRail() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.div
            initial={false}
            animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
            transition={{ duration: 0.3 }}
            className={`hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 pl-1 ${visible ? '' : 'pointer-events-none'}`}
            aria-hidden={!visible}
        >
            {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-placeholder="true"
                        aria-label={social.label}
                        tabIndex={visible ? 0 : -1}
                        className="group relative w-11 h-11 rounded-r-xl flex items-center justify-center text-white shadow-md transition-all duration-300 hover:w-14"
                        style={{ background: social.hover }}
                    >
                        <Icon className="w-[18px] h-[18px]" />
                        {/* Tooltip */}
                        <span className="pointer-events-none absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[0.8125rem] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {social.label}
                        </span>
                    </a>
                );
            })}
        </motion.div>
    );
}
