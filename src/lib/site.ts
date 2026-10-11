/**
 * URL canónica del sitio.
 *
 * Se usa para los links que salen hacia redes sociales (con UTM) y para el
 * `metadataBase` del SEO. Cuando haya dominio propio, se sobreescribe con la
 * variable `NEXT_PUBLIC_SITE_URL`.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://bulaciobienesraices.com'
).replace(/\/+$/, '');

/** Arma un link del sitio con los parámetros UTM de campaña. */
export function linkConUTM(path: string, source: string, medium = 'social', campaign = 'propiedades') {
    const base = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
}
