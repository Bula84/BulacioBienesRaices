'use client';

import { motion } from 'framer-motion';
import {
    Target,
    Eye,
    Heart,
    Users,
    Award,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

const values = [
    {
        icon: Heart,
        title: 'Compromiso',
        description: 'Nos dedicamos a encontrar la mejor solución para cada cliente, con atención personalizada y honesta.',
    },
    {
        icon: Award,
        title: 'Excelencia',
        description: 'Mantenemos los más altos estándares de calidad en cada transacción y servicio que ofrecemos.',
    },
    {
        icon: Users,
        title: 'Confianza',
        description: 'Construimos relaciones duraderas basadas en la transparencia y la integridad profesional.',
    },
    {
        icon: TrendingUp,
        title: 'Innovación',
        description: 'Adoptamos tecnología de vanguardia para mejorar continuamente la experiencia del cliente.',
    },
];

const achievements = [
    { value: '15+', label: 'Años de experiencia' },
    { value: '500+', label: 'Propiedades vendidas' },
    { value: '1200+', label: 'Clientes satisfechos' },
    { value: '98%', label: 'Tasa de satisfacción' },
];

const teamMembers = [
    {
        name: 'Carlos Rodríguez',
        role: 'CEO & Fundador',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    {
        name: 'María González',
        role: 'Directora Comercial',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
        name: 'Andrés López',
        role: 'Jefe de Ventas',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
];

export default function NosotrosPage() {
    return (
        <div className="py-12">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span
                            className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
                            style={{
                                background: 'rgba(0, 212, 255, 0.1)',
                                color: '#00d4ff',
                                border: '1px solid rgba(0, 212, 255, 0.3)',
                            }}
                        >
                            Sobre Nosotros
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Transformando el{' '}
                            <span className="bg-gradient-to-r from-[#00d4ff] to-[#a855f7] bg-clip-text text-transparent">
                                mercado inmobiliario
                            </span>
                        </h1>

                        <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                            En Antigravity Enterprise, combinamos más de 15 años de experiencia en el sector
                            inmobiliario con tecnología de vanguardia para ofrecer una experiencia única.
                            Nuestro compromiso es hacer que encontrar tu hogar ideal sea tan emocionante como
                            debería ser.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {achievements.map((item) => (
                                <div
                                    key={item.label}
                                    className="px-5 py-3 rounded-2xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <p className="text-2xl font-bold text-[#00d4ff]">{item.value}</p>
                                    <p className="text-sm text-neutral-400">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div
                            className="rounded-[2.5rem] overflow-hidden aspect-[4/3]"
                            style={{
                                boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)',
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                                alt="Oficina Antigravity"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Card */}
                        <div
                            className="absolute -bottom-6 -left-6 p-6 rounded-2xl max-w-[240px]"
                            style={{
                                background: 'rgba(10, 10, 26, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)' }}
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#0a0a1a]" />
                                </div>
                                <span className="text-white font-semibold">Certificados</span>
                            </div>
                            <p className="text-sm text-neutral-400">
                                Empresa certificada por las principales cámaras inmobiliarias del país.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-[2rem]"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(59, 130, 246, 0.2))',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                }}
                            >
                                <Target className="w-7 h-7 text-[#00d4ff]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Nuestra Misión</h2>
                            <p className="text-neutral-400 leading-relaxed">
                                Facilitar el acceso a propiedades de calidad mediante una plataforma
                                innovadora que combina tecnología avanzada, asesoramiento experto y un
                                compromiso inquebrantable con la satisfacción del cliente. Buscamos
                                transformar cada transacción inmobiliaria en una experiencia memorable
                                y exitosa.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-[2rem]"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
                                    border: '1px solid rgba(168, 85, 247, 0.3)',
                                }}
                            >
                                <Eye className="w-7 h-7 text-[#a855f7]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Nuestra Visión</h2>
                            <p className="text-neutral-400 leading-relaxed">
                                Ser la plataforma inmobiliaria líder en América Latina, reconocida por
                                nuestra innovación tecnológica, excelencia en el servicio y compromiso
                                con la creación de comunidades más conectadas y prósperas. Aspiramos a
                                redefinir los estándares de la industria inmobiliaria.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Los principios que guían cada decisión y acción de nuestro equipo.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-6 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-3"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}
                                >
                                    <div
                                        className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.15))',
                                            border: '1px solid rgba(0, 212, 255, 0.2)',
                                        }}
                                    >
                                        <Icon className="w-7 h-7 text-[#00d4ff]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-3">{value.title}</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Nuestro Equipo
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Profesionales apasionados dedicados a brindarte la mejor experiencia.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group text-center"
                            >
                                <div
                                    className="relative mb-6 rounded-[2rem] overflow-hidden aspect-square mx-auto max-w-[250px] transition-all duration-300 group-hover:-translate-y-3"
                                    style={{
                                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                                    }}
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: 'linear-gradient(180deg, transparent 50%, rgba(0, 212, 255, 0.3) 100%)',
                                        }}
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                                <p className="text-[#00d4ff] text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
