'use client';

import { useState } from 'react';
import { Share2, Link2, Check, MessageCircle } from 'lucide-react';

interface Props {
    /** URL canónica de la página a compartir (sin UTM). */
    url: string;
    /** Título del contenido. */
    title: string;
    /** Texto adicional (opcional). */
    text?: string;
    /** Origen que se reporta en el UTM. */
    source?: string;
    /** 'icon' = sólo botón, abre el panel · 'full' = botones visibles */
    variant?: 'icon' | 'full';
    /** Clase extra para el botón de 'icon' (p. ej. sobre una imagen). */
    triggerClassName?: string;
}

/**
 * Botones de compartir con **UTM** (`utm_source` / `utm_medium` / `utm_campaign`)
 * para que Google Analytics y el Meta Pixel atribuyan correctamente la visita
 * a la red social de origen.
 */
export default function ShareButtons({
    url,
    title,
    text,
    source = 'sitio',
    variant = 'icon',
    triggerClassName,
}: Props) {
    const [abierto, setAbierto] = useState(false);
    const [copiado, setCopiado] = useState(false);

    const conUTM = (source: string) => {
        try {
            const u = new URL(url, window.location.origin);
            u.searchParams.set('utm_source', source);
            u.searchParams.set('utm_medium', 'social');
            u.searchParams.set('utm_campaign', source === 'sitio' ? 'compartir' : source);
            return u.toString();
        } catch {
            return url;
        }
    };

    const canales = [
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            color: '#25D366',
            href: (u: string) => `https://wa.me/?text=${encodeURIComponent(`${title}\n${text ?? ''}\n${u}`)}`,
        },
        {
            id: 'facebook',
            label: 'Facebook',
            color: '#1877F2',
            href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
        },
        {
            id: 'x',
            label: 'X / Twitter',
            color: '#0f1419',
            href: (u: string) =>
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(u)}`,
        },
    ];

    const copiar = async (u: string) => {
        try {
            await navigator.clipboard.writeText(u);
        } catch {
            // Fallback para navegadores sin permiso de clipboard
            const ta = document.createElement('textarea');
            ta.value = u;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const compartirNativo = async () => {
        const u = conUTM('nativo');
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url: u });
            } catch {
                /* el usuario canceló */
            }
        } else {
            setAbierto((v) => !v);
        }
    };

    const u = conUTM(source);

    if (variant === 'full') {
        return (
            <div className="flex flex-wrap items-center gap-2">
                {canales.map((c) => (
                    <a
                        key={c.id}
                        href={c.href(u)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => copiar(u)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                        style={{ background: c.color }}
                    >
                        {c.id === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                        {c.label}
                    </a>
                ))}
                <button
                    onClick={() => copiar(u)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                >
                    {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
                    {copiado ? 'Copiado' : 'Copiar link'}
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={compartirNativo}
                aria-label="Compartir propiedad"
                className={
                    triggerClassName ??
                    'p-3 rounded-xl bg-white border border-gray-200 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] hover:border-[var(--primary-blue)] transition-all'
                }
            >
                <Share2 className="w-5 h-5" />
            </button>

            {abierto && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-gray-100 shadow-xl p-2 z-30">
                    <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Compartir en
                    </p>
                    {canales.map((c) => (
                        <a
                            key={c.id}
                            href={c.href(u)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                            {c.label}
                        </a>
                    ))}
                    <button
                        onClick={() => copiar(u)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        {copiado ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4 text-gray-400" />}
                        {copiado ? 'Link copiado' : 'Copiar link con UTM'}
                    </button>
                </div>
            )}
        </div>
    );
}
