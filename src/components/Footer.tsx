import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
    company: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Tasaciones', href: '/tasaciones' },
        { label: 'Servicios', href: '/servicios' },
        { label: 'Oportunidades', href: '/oportunidades' },
        { label: 'Contacto', href: '/contacto' },
    ],
    properties: [
        { label: 'Venta', href: '/propiedades?operation=venta' },
        { label: 'Alquiler', href: '/propiedades?operation=alquiler' },
        { label: 'Casas', href: '/propiedades?type=casa' },
        { label: 'Departamentos', href: '/propiedades?type=departamento' },
        { label: 'Emprendimientos', href: '/emprendimientos' },
        { label: 'Fondos de Comercio', href: '/fondos-de-comercio' },
    ],
    legal: [
        { label: 'Términos y Condiciones', href: '/legal/terminos' },
        { label: 'Política de Privacidad', href: '/legal/privacidad' },
        { label: 'Cookies', href: '/legal/cookies' },
    ],
};

const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 bg-[var(--bg-page)] border-t border-gray-100">
            {/* Top Border Line */}
            <div
                className="h-1 w-full"
                style={{
                    background: 'linear-gradient(90deg, var(--primary-blue), #0f766e)',
                }}
            />

            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100"
                                >
                                    <Building2 className="w-6 h-6 text-[var(--primary-blue)]" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-[var(--text-main)] block font-headings">
                                        BC BienesRaices
                                    </span>
                                    <span className="text-sm text-[var(--text-secondary)] block -mt-1 font-medium">Tu hogar es tu refugio</span>
                                </div>
                            </Link>

                            <p className="text-[var(--text-secondary)] mb-6 max-w-sm leading-relaxed font-medium">
                                Profesionalismo y experiencia al servicio de tu próxima inversión inmobiliaria.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <a
                                    href="mailto:info@bcbienesraices.com"
                                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors font-medium"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>info@bcbienesraices.com</span>
                                </a>
                                <a
                                    href="tel:+541112345678"
                                    className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors font-medium"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>+54 11 1234-5678</span>
                                </a>
                                <div className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
                                    <MapPin className="w-5 h-5" />
                                    <span>Buenos Aires, Argentina</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold mb-6 font-headings">Empresa</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Properties Links */}
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold mb-6 font-headings">Propiedades</h4>
                            <ul className="space-y-3">
                                {footerLinks.properties.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="text-[var(--text-main)] font-bold mb-6 font-headings">Legal</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[var(--text-secondary)] text-sm font-medium">
                            © {currentYear} BC BienesRaices. Todos los derechos reservados.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-100 text-[var(--text-secondary)] hover:bg-[var(--primary-blue)] hover:text-white hover:border-[var(--primary-blue)] transition-all duration-300 shadow-sm"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
