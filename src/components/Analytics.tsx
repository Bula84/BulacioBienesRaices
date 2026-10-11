'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSiteConfig } from '@/lib/supabase';

export interface AnalyticsConfig {
    ga4_id?: string;          // p. ej. G-XXXXXXXXXX
    meta_pixel_id?: string;   // p. ej. 1234567890123456
    enabled?: boolean;
}

/**
 * Carga Google Analytics 4 y/o Meta Pixel con los IDs configurados desde
 * `/admin/configuracion` (tabla `site_config`, clave `analytics`).
 *
 * No carga nada si los IDs están vacíos o `enabled` es false, así que es
 * seguro dejarlo montado siempre en el layout.
 */
export default function Analytics() {
    const pathname = usePathname();

    // Los IDs se leen en runtime desde Supabase → el cliente hace el fetch.
    useEffect(() => {
        let activo = true;

        getSiteConfig<AnalyticsConfig>('analytics').then((cfg) => {
            if (!activo || !cfg?.enabled) return;

            // Meta Pixel
            if (cfg.meta_pixel_id && !document.getElementById('meta-pixel')) {
                const fbq = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;
n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');`;
                const s = document.createElement('script');
                s.id = 'meta-pixel';
                s.textContent = fbq;
                document.head.appendChild(s);

                const pixel = document.createElement('script');
                pixel.textContent = `fbq('init', '${cfg.meta_pixel_id}');fbq('track','PageView');`;
                document.head.appendChild(pixel);
            }

            // Google Analytics 4
            if (cfg.ga4_id && !document.getElementById('ga4-loader')) {
                const s = document.createElement('script');
                s.id = 'ga4-loader';
                s.async = true;
                s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.ga4_id)}`;
                document.head.appendChild(s);

                const cfg2 = document.createElement('script');
                cfg2.textContent =
                    `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
                    `gtag('js',new Date());gtag('config','${cfg.ga4_id}',{anonymize_ip:true});`;
                document.head.appendChild(cfg2);
            }
        });

        return () => {
            activo = false;
        };
    }, []);

    // Page views sucesivos (SPA)
    useEffect(() => {
        const w = window as unknown as {
            gtag?: (...args: unknown[]) => void;
            fbq?: (...args: unknown[]) => void;
        };
        if (typeof w.gtag === 'function') w.gtag('event', 'page_view', { page_path: pathname });
        if (typeof w.fbq === 'function') w.fbq('track', 'PageView');
    }, [pathname]);

    return null;
}
