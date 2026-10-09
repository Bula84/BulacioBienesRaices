import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors mb-8 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al inicio
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-[var(--primary-blue)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold font-headings text-[var(--text-main)] mb-2">
                                Política de Privacidad
                            </h1>
                            <p className="text-[var(--text-secondary)]">Última actualización: Febrero 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none text-[var(--text-secondary)]">
                        {/* Policy Content */}
                        <p>
                            En <strong>Bulacio Bienes Raíces</strong>, nos comprometemos a proteger la privacidad y
                            seguridad de los datos personales de nuestros clientes y visitantes de nuestro sitio web.
                            Esta Política de Privacidad describe cómo recopilamos, utilizamos, protegemos y compartimos
                            su información personal, en cumplimiento con la Ley de Protección de Datos Personales N° 25.326
                            de la República Argentina.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">1. Información que recopilamos</h2>
                        <p>Podemos recopilar y procesar los siguientes datos personales:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li><strong>Información de contacto:</strong> Nombre completo, dirección de correo electrónico, números de teléfono celular y WhatsApp, y dirección postal.</li>
                            <li><strong>Datos de preferencias:</strong> Búsquedas de propiedades, información sobre el tipo de propiedad en la que está interesado (para venta o alquiler) y presupuesto estimado.</li>
                            <li><strong>Datos técnicos:</strong> Sujeto a su consentimiento sobre cookies, su dirección IP, tipo de navegador, tiempo de navegación en el sitio web y otras tecnologías automáticas de recopilación de datos.</li>
                        </ul>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">2. Uso de la Información</h2>
                        <p>Los datos que recopilamos son utilizados exclusivamente para:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Proveer los servicios inmobiliarios solicitados (intermediación en compraventa, alquiler, tasación de inmuebles).</li>
                            <li>Responder a consultas, solicitudes de tasación y agendar visitas a través de formularios o nuestro agente IA.</li>
                            <li>Enviar alertas de nuevas propiedades, newsletters o información relevante del sector, siempre que haya dado su consentimiento expreso.</li>
                            <li>Mejorar el contenido, la seguridad y la experiencia de usuario de nuestra plataforma.</li>
                        </ul>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">3. Protección y Seguridad de los Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas rigurosas para proteger sus datos personales contra el acceso no autorizado, alteración, pérdida o destrucción. Todos los datos que ingresa en nuestro sitio web se transmiten mediante un cifrado SSL y son resguardados en bases de datos con altos estándares de seguridad y acceso restringido.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">4. Agente IA y Chatbot</h2>
                        <p>
                            Nuestro sitio incluye un Agente virtual (IA) para mejorar su atención. Las conversaciones generadas a través del chat son grabadas y analizadas únicamente con el fin de proporcionar un mejor servicio, verificar requerimientos para propiedades de alquiler, y agilizar el proceso de agendamiento de visitas. Al interactuar con el chatbot, usted autoriza el tratamiento de la información proveída en esa conversación.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">5. Compartición de Información a Terceros</h2>
                        <p>
                            No vendemos, alquilamos ni comercializamos sus datos personales a terceros. Su información solo podrá ser compartida en los siguientes casos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li>Cuando sea necesario para cumplir con un requerimiento legal o judicial.</li>
                            <li>Con proveedores de servicios de confianza (ej. servicios de alojamiento en la nube, plataformas de envío de correos) que también cumplen con normativas de protección de datos y que únicamente actúan siguiendo nuestras instrucciones.</li>
                            <li>A propietarios de inmuebles, en caso de estar tramitando una reserva, compra, alquiler o requerimientos de garantía.</li>
                        </ul>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">6. Cookies y Tecnologías de Seguimiento</h2>
                        <p>
                            Utilizamos cookies para poder prestar nuestro servicio y mejorar su experiencia en nuestra plataforma.
                            Puede configurar su navegador para que rechace todas o algunas de las cookies, o para que le avise cuando los sitios web configuren o accedan a ellas. Si desactiva las cookies funcionales, algunas partes de nuestro sitio pueden no funcionar correctamente.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">7. Sus Derechos (Ley 25.326)</h2>
                        <p>
                            Como titular de los datos personales, usted tiene la potestad de ejercer los derechos de <strong>acceso, rectificación, actualización y supresión</strong> sobre sus datos de forma gratuita.
                            Para ejercer estos derechos, puede enviarnos un correo electrónico a <strong>info@bcbienesraices.com</strong> indicando el derecho que desea ejercer y comprobando su identidad.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">8. Cambios a esta Política</h2>
                        <p>
                            Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios se harán efectivos al ser publicados en el sitio web, por lo cual alentamos a los usuarios a revisar periódicamente los términos.
                        </p>

                        <h2 className="text-[var(--text-main)] font-bold mt-8 mb-4">9. Contacto</h2>
                        <p>
                            Si tiene alguna duda o en caso de requerir información adicional respecto a nuestras prácticas y política de privacidad, no dude en comunicarse con nosotros:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6 text-[var(--text-secondary)] font-medium">
                            <li><strong>Email:</strong> info@bcbienesraices.com</li>
                            <li><strong>Teléfono:</strong> +54 11 1234-5678</li>
                            <li><strong>Dirección:</strong> Buenos Aires, Argentina</li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
}

