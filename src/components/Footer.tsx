import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
    company: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Noticias', href: '/noticias' },
        { label: 'Servicios', href: '/servicios' },
        { label: 'Contacto', href: '/contacto' },
    ],
    properties: [
        { label: 'Venta', href: '/propiedades?operation=venta' },
        { label: 'Alquiler', href: '/propiedades?operation=alquiler' },
        { label: 'Casas', href: '/propiedades?type=casa' },
        { label: 'Departamentos', href: '/propiedades?type=departamento' },
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
        <footer className="relative mt-20">
            {/* Gradient line */}
            <div
                className="h-px w-full"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), rgba(99, 102, 241, 0.3), transparent)',
                }}
            />

            <div
                className="py-16"
                style={{
                    background: 'rgba(15, 20, 25, 0.95)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    }}
                                >
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
                                        BC BienesRaices
                                    </span>
                                    <span className="text-sm text-neutral-400 block -mt-1">Tu hogar es tu refugio</span>
                                </div>
                            </Link>

                            <p className="text-neutral-400 mb-6 max-w-sm leading-relaxed">
                                Profesionalismo y experiencia al servicio de tu próxima inversión inmobiliaria.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <a
                                    href="mailto:info@bcbienesraices.com"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-[#10b981] transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span>info@bcbienesraices.com</span>
                                </a>
                                <a
                                    href="tel:+541112345678"
                                    className="flex items-center gap-3 text-neutral-400 hover:text-[#10b981] transition-colors"
                                >
                                    <Phone className="w-5 h-5" />
                                    <span>+54 11 1234-5678</span>
                                </a>
                                <div className="flex items-center gap-3 text-neutral-400">
                                    <MapPin className="w-5 h-5" />
                                    <span>Buenos Aires, Argentina</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-neutral-400 hover:text-[#10b981] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Properties Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Propiedades</h4>
                            <ul className="space-y-3">
                                {footerLinks.properties.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-neutral-400 hover:text-[#10b981] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-neutral-400 hover:text-[#10b981] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-neutral-500 text-sm">
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
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:text-[#10b981] transition-all duration-200 hover:scale-110"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }}
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
