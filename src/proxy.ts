import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Guardia de sesión para el panel admin.
 *
 * La sesión de Supabase vive en localStorage, así que el middleware no puede
 * leerla directamente. AuthContext (src/context/AuthContext.tsx) espeja el
 * estado de sesión en la cookie no-httpOnly `bb_session`, y acá la chequeamos.
 *
 * IMPORTANTE: esto es una barrera de UX / primer filtro (evita deep-links y
 * scraping casual). La seguridad REAL la provee Row Level Security en
 * Supabase, que valida el JWT en cada consulta.
 */
const AUTH_COOKIE = 'bb_session';

function isProtected(pathname: string): boolean {
    return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // === GUARDIA DE /admin ===
    if (isProtected(pathname)) {
        const sesion = request.cookies.get(AUTH_COOKIE)?.value;

        if (sesion !== '1') {
            const login = new URL('/login', request.url);
            login.searchParams.set('next', pathname);
            return NextResponse.redirect(login);
        }
    }

    // Si el usuario ya tiene sesión y pide /login, va directo al panel.
    if (pathname === '/login' && request.cookies.get(AUTH_COOKIE)?.value === '1') {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // === SECURITY HEADERS — aplicados a cada respuesta ===
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self), payment=()'
    );

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
