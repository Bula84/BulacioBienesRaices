import type { Metadata } from 'next';

/**
 * Módulo de directorio de profesionales — DORMIDO.
 *
 * Se conserva completo para una futura implementación, pero está fuera de la
 * navegación pública y noindex para que no se publique como feature activa.
 *
 * Para reactivarlo:
 *   1. Volver a agregar los links en src/components/Navbar.tsx y src/components/Footer.tsx
 *   2. Eliminar (o cambiar a `true`) el `robots.index` de este archivo
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServiciosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
