'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
        <div className="py-12 bg-white">
            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-20 pt-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span
                            className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-wider"
                            style={{
                                background: 'rgba(33, 148, 207, 0.1)',
                                color: 'var(--primary-blue)',
                            }}
                        >
                            Sobre Nosotros
                        </span>

                        <h1 className="text-4xl md:text-6xl font-extrabold !text-slate-900 mb-6 leading-tight font-headings">
                            Transformando el{' '}
                            <span className="text-[var(--primary-blue)]">
                                mercado inmobiliario
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl !text-slate-700 font-medium leading-relaxed mb-8">
                            En Bulacio Bienes Raíces, combinamos más de 15 años de experiencia en el sector
                            inmobiliario con tecnología de vanguardia para ofrecer una experiencia única.
                            Nuestro compromiso es hacer que encontrar tu hogar ideal sea tan emocionante como
                            debería ser.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {achievements.map((item) => (
                                <div
                                    key={item.label}
                                    className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100"
                                >
                                    <p className="text-3xl font-bold text-[var(--primary-blue)] mb-1">{item.value}</p>
                                    <p className="text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wide">{item.label}</p>
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
                            className="rounded-[2.5rem] overflow-hidden aspect-[4/3] shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                                alt="Oficina de Bulacio Bienes Raíces"
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Floating Card */}
                        <div
                            className="absolute -bottom-6 -left-6 p-6 rounded-2xl max-w-[240px] bg-white shadow-xl border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-[var(--primary-blue)]" />
                                </div>
                                <span className="!text-slate-900 font-extrabold text-lg tracking-wide">Certificados</span>
                            </div>
                            <p className="text-sm font-medium !text-slate-700 leading-relaxed">
                                Empresa certificada por las principales cámaras inmobiliarias del país.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-10 rounded-[2rem] bg-white shadow-sm border border-gray-100"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 text-[var(--primary-blue)]"
                            >
                                <Target className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-extrabold !text-slate-900 mb-4 font-headings">Nuestra Misión</h2>
                            <p className="text-lg font-medium !text-slate-700 leading-relaxed">
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
                            className="p-10 rounded-[2rem] bg-white shadow-sm border border-gray-100"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                style={{ background: 'rgba(184, 134, 59, 0.12)', color: 'var(--accent-dark)' }}
                            >
                                <Eye className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl font-extrabold !text-slate-900 mb-4 font-headings">Nuestra Visión</h2>
                            <p className="text-lg font-medium !text-slate-700 leading-relaxed">
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
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold !text-slate-900 mb-4 font-headings tracking-tight">
                            Nuestros Valores
                        </h2>
                        <p className="font-medium !text-slate-700 max-w-2xl mx-auto text-lg md:text-xl">
                            Los principios que guían cada decisión y acción de nuestro equipo.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 rounded-[2rem] text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white border border-gray-100"
                                >
                                    <div
                                        className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-blue-50 text-[var(--primary-blue)]"
                                    >
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-extrabold !text-slate-900 mb-3 font-headings">{value.title}</h3>
                                    <p className="font-medium !text-slate-700 text-sm leading-relaxed">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-extrabold !text-slate-900 mb-4 font-headings tracking-tight">
                            Nuestro Equipo
                        </h2>
                        <p className="font-medium !text-slate-700 max-w-2xl mx-auto text-lg md:text-xl">
                            Profesionales apasionados dedicados a brindarte la mejor experiencia.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
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
                                    className="relative mb-6 rounded-[2rem] overflow-hidden aspect-square mx-auto max-w-[280px] transition-all duration-300 shadow-lg group-hover:shadow-2xl"
                                >
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={600}
                                        height={600}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent"
                                    />
                                </div>
                                <h3 className="text-2xl font-extrabold !text-slate-900 mb-1 font-headings">{member.name}</h3>
                                <p className="text-[var(--primary-blue)] font-bold uppercase tracking-wider text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
