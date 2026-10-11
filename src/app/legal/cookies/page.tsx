import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Política de cookies del sitio web de Bulacio Bienes Raíces: qué cookies usamos y cómo gestionarlas.',
  robots: { index: true, follow: true },
};

const ultimaActualizacion = '11 de octubre de 2026';

const cookies = [
  {
    nombre: 'bb_session',
    tipo: 'Técnica / necesaria',
    finalidad:
      'Mantiene tu sesión iniciada y permite el acceso al panel de administración. Sin esta cookie el sitio no puede recordar que estás autenticado.',
    duración: '7 días',
  },
  {
    nombre: 'sb-* (Supabase)',
    tipo: 'Técnica / necesaria',
    finalidad:
      'Autenticación de usuarios: identifica la sesión del navegador con el servicio de cuentas de usuario.',
    duración: 'Sesión',
  },
  {
    nombre: '_ga, _ga_* (Google Analytics)',
    tipo: 'Analítica',
    finalidad:
      'Mide de forma agregada cuántas personas visitan el sitio y qué secciones consultan, para poder mejorar la experiencia.',
    duración: 'Hasta 2 años',
  },
  {
    nombre: '_fbp (Meta Pixel)',
    tipo: 'Publicidad',
    finalidad:
      'Permite medir la efectividad de nuestras publicaciones en Facebook e Instagram y mostrar anuncios más relevantes.',
    duración: '3 meses',
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-blue)] mb-4">
          Legal
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Política de Cookies
        </h1>
        <p className="text-sm text-slate-500 mb-10">Última actualización: {ultimaActualizacion}</p>

        <article className="space-y-8 text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4">
          <section>
            <h2>1. Qué son las cookies</h2>
            <p>
              Las cookies son pequeños archivos de texto que un sitio guarda en tu navegador
              cuando lo visitás. Sirven para recordar información técnica sobre tu sesión, para
              estadísticas de uso o para publicidad.
            </p>
          </section>

          <section>
            <h2>2. Cookies que utiliza este sitio</h2>
          </section>
        </article>

        <div className="space-y-4 -mt-4 mb-8">
          {cookies.map((c) => (
            <div
              key={c.nombre}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <code className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold">
                  {c.nombre}
                </code>
                <span
                  className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    c.tipo.includes('necesaria')
                      ? 'bg-teal-50 text-teal-700'
                      : c.tipo === 'Analítica'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {c.tipo}
                </span>
                <span className="text-xs text-slate-400 ml-auto">{c.duración}</span>
              </div>
              <p className="text-sm text-slate-600">{c.finalidad}</p>
            </div>
          ))}
        </div>

        <article className="space-y-8 text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4">
          <section>
            <h2>3. Cookies necesarias</h2>
            <p>
              Las cookies técnicas son impresciones indispensables para que el sitio funcione
              (mantener tu sesión, seguridad). No se pueden desactivar desde el navegador sin
              perder estas funciones.
            </p>
          </section>

          <section>
            <h2>4. Cookies de terceros</h2>
            <p>
              Google Analytics y Meta Pixel son servicios prestados por terceros. Ellos definen
              sus propias políticas, disponibles en las páginas de Google y Meta. Podés desactivar
              estas cookies desde la configuración de tu navegador sin que se vea afectado el
              funcionamiento básico del sitio.
            </p>
          </section>

          <section>
            <h2>5. Cómo gestionar las cookies</h2>
            <p>Desde tu navegador podés consultar, bloquear o eliminar las cookies:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1.5">
              <li>
                <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros
                datos de sitios.
              </li>
              <li>
                <strong>Firefox:</strong> Ajustes → Privacidad &amp; Seguridad → Cookies y datos
                del sitio.
              </li>
              <li>
                <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios
                web.
              </li>
              <li>
                <strong>Edge:</strong> Configuración → Cookies y permisos del sitio.
              </li>
            </ul>
          </section>

          <section>
            <h2>6. Consentimiento</h2>
            <p>
              Al continuar navegando por este sitio aceptás el uso de cookies técnicas. Las
              cookies analíticas y de publicidad sólo se activan cuando han sido habilitadas
              expresamente desde la configuración del sitio.
            </p>
          </section>
        </article>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-sm font-semibold">
          <a href="/legal/terminos" className="text-[var(--primary-blue)] hover:underline">
            Términos y Condiciones
          </a>
          <a href="/legal/privacidad" className="text-[var(--primary-blue)] hover:underline">
            Política de Privacidad
          </a>
          <a href="/contacto" className="text-[var(--primary-blue)] hover:underline">
            Contacto
          </a>
        </div>
      </div>
    </div>
  );
}
