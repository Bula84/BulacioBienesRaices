import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso del sitio web de Bulacio Bienes Raíces.',
  robots: { index: true, follow: true },
};

const ultimaActualizacion = '11 de octubre de 2026';

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-blue)] mb-4">
          Legal
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-slate-500 mb-10">Última actualización: {ultimaActualizacion}</p>

        <article className="space-y-8 text-slate-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1.5">
          <section>
            <h2>1. Objeto</h2>
            <p>
              Los presentes Términos y Condiciones regulan el acceso y el uso del sitio web de
              Bulacio Bienes Raíces (en adelante, &quot;el Sitio&quot;), dedicado a la publicación
              y comercialización de inmuebles, tasaciones, fondos de comercio y servicios de
              gestión legal.
            </p>
            <p>
              El uso del Sitio implica la aceptación plena y sin reservas de todos y cada uno de
              los términos aquí previstos.
            </p>
          </section>

          <section>
            <h2>2. Información publicada</h2>
            <p>
              Las fichas de propiedades, precios, metros cuadrados y demás datos se ofrecen con
              carácter meramente informativo y pueden ser modificados sin previo aviso. La
              información definitiva de cada operación se formaliza en la documentación
              contractual correspondiente.
            </p>
            <p>
              Las imágenes ilustrativas no constituyen representación exacta del inmueble ni de
              su estado de conservación.
            </p>
          </section>

          <section>
            <h2>3. Tasaciones</h2>
            <p>
              Las tasaciones solicitadas a través del Sitio tienen carácter orientativo y
              gratuito. El valor final de mercado se determina una vez realizada la evaluación
              presencial del inmueble y la revisión de su documentación.
            </p>
          </section>

          <section>
            <h2>4. Servicios de Gestión Legal</h2>
            <p>
              La información brindada por el asistente virtual de la sección Gestión Legal tiene
              carácter orientativo y no constituye asesoramiento jurídico profesional. Toda
              estrategia de cobranza o representación es definida por el profesional a cargo
              luego de evaluar la documentación del caso.
            </p>
          </section>

          <section>
            <h2>5. Cuentas de usuario</h2>
            <p>
              El acceso al panel de administración está restringido a personal autorizado. El
              usuario es responsable de mantener la confidencialidad de sus credenciales y de
              toda actividad realizada desde su cuenta.
            </p>
          </section>

          <section>
            <h2>6. Propiedad intelectual</h2>
            <p>
              Los textos, fotografías, logotipos, diseño y código del Sitio son titularidad de
              Bulacio Bienes Raíces o de sus respectivos autores. Queda prohibida su
              reproducción total o parcial sin autorización previa y por escrito.
            </p>
          </section>

          <section>
            <h2>7. Enlaces de terceros</h2>
            <p>
              El Sitio puede incluir enlaces a páginas de terceros (portales inmobiliarios, redes
              sociales, mapas). Bulacio Bienes Raíces no se hace responsable del contenido ni de
              las prácticas de privacidad de dichos sitios.
            </p>
          </section>

          <section>
            <h2>8. Limitación de responsabilidad</h2>
            <p>
              Bulacio Bienes Raíces no será responsable por daños derivados de: interrupciones
              del servicio, errores en la información publicada por terceros, decisiones tomadas
              en base a contenidos orientativos ni usos indebidos del Sitio.
            </p>
          </section>

          <section>
            <h2>9. Ley aplicable y jurisdicción</h2>
            <p>
              Estos términos se rigen por la legislación de la República Argentina. Para toda
              controversia serán competentes los tribunales ordinarios de la ciudad en que tenga
              su domicilio el prestador del servicio.
            </p>
          </section>

          <section>
            <h2>10. Modificaciones</h2>
            <p>
              Bulacio Bienes Raíces se reserva el derecho de modificar los presentes términos en
              cualquier momento. La versión vigente será siempre la publicada en esta página.
            </p>
          </section>
        </article>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-wrap gap-6 text-sm font-semibold">
          <a href="/legal/privacidad" className="text-[var(--primary-blue)] hover:underline">
            Política de Privacidad
          </a>
          <a href="/legal/cookies" className="text-[var(--primary-blue)] hover:underline">
            Política de Cookies
          </a>
          <a href="/contacto" className="text-[var(--primary-blue)] hover:underline">
            Contacto
          </a>
        </div>
      </div>
    </div>
  );
}
