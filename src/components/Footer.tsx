import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
    company: [
        { label: 'Nosotros', href: '/nosotros' },
        { label: 'Tasaciones', href: '/tasaciones' },
        { label: 'Gestión Legal', href: '/gestion-legal' },
        { label: 'Contacto', href: '/contacto' },
    ],
    properties: [
        { label: 'Venta', href: '/propiedades?operation=venta' },
        { label: 'Alquiler', href: '/propiedades?operation=alquiler' },
        { label: 'Casas', href: '/propiedades?type=casa' },
        { label: 'Departamentos', href: '/propiedades?type=departamento' },
        { label: 'Fondos de Comercio', href: '/fondos-de-comercio' },
    ],
    legal: [
        { label: 'Términos y Condiciones', href: '/legal/terminos' },
        { label: 'Política de Privacidad', href: '/legal/privacidad' },
        { label: 'Política de Cookies', href: '/legal/cookies' },
    ],
};

/**
 * ⚠️ PLACEHOLDERS: reemplazar href por los perfiles reales antes de publicar.
 */
const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', gradient: '#1877f2' },
    { icon: Instagram, href: '#', label: 'Instagram', gradient: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' },
    { icon: Twitter, href: '#', label: 'Twitter / X', gradient: '#0b1f3a' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: '#0a66c2' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20" style={{ background: '#0b1f3a' }}>
            {/* Top Border Line */}
            <div
                className="h-1 w-full"
                style={{
                    background: 'linear-gradient(90deg, #0b1f3a, var(--accent-color), #0b1f3a)',
                }}
            />

            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}
                                >
                                    <Building2 className="w-6 h-6" style={{ color: 'var(--accent-light)' }} />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-white block font-headings">
                                        Bulacio Bienes Raíces
                                    </span>
                                    <span className="text-[0.8125rem] text-slate-400 block -mt-0.5 font-medium">Tu hogar, tu refugio</span>
                                </div>
                            </Link>

                            <p className="text-slate-300 mb-6 max-w-sm leading-relaxed">
                                Profesionalismo y experiencia al servicio de tu próxima inversión inmobiliaria.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <a
                                    href="mailto:info@bcbienesraices.com"
                                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors font-medium group"
                                >
                                    <Mail className="w-5 h-5 transition-colors group-hover:text-[var(--accent-light)]" />
                                    <span>info@bcbienesraices.com</span>
                                </a>
                                <a
                                    href="tel:+541112345678"
                                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors font-medium group"
                                >
                                    <Phone className="w-5 h-5 transition-colors group-hover:text-[var(--accent-light)]" />
                                    <span>+54 11 1234-5678</span>
                                </a>
                                <div className="flex items-center gap-3 text-slate-300 font-medium">
                                    <MapPin className="w-5 h-5" />
                                    <span>Buenos Aires, Argentina</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-white font-bold mb-6 font-headings">Empresa</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Properties Links */}
                        <div>
                            <h4 className="text-white font-bold mb-6 font-headings">Propiedades</h4>
                            <ul className="space-y-3">
                                {footerLinks.properties.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links + Social */}
                        <div>
                            <h4 className="text-white font-bold mb-6 font-headings">Legal</h4>
                            <ul className="space-y-3 mb-8">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors hover:translate-x-1 block duration-200 font-medium"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Social — presencia visible, no escondida */}
                            <h4 className="text-white font-bold mb-4 font-headings">Seguinos</h4>
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-placeholder="true"
                                            aria-label={social.label}
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white border border-white/10 hover:scale-110 hover:border-transparent transition-all duration-300 shadow-lg"
                                            style={{ background: social.gradient }}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-slate-400 text-[0.8125rem] font-medium">
                            © {currentYear} Bulacio Bienes Raíces. Todos los derechos reservados.
                        </p>

                        <a
                            href="tel:+541112345678"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[0.9375rem] transition-all hover:scale-105 shadow-lg"
                            style={{ background: 'var(--accent-color)', color: '#0b1f3a' }}
                        >
                            <Phone className="w-4 h-4" />
                            Llamanos ahora
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
