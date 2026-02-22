'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, TrendingUp, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function TasacionesPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyType: 'casa',
        address: '',
        details: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send this to an API or email service
        console.log('Form submitted:', formData);
        alert('Solicitud enviada con éxito. Nos pondremos en contacto a la brevedad.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            propertyType: 'casa',
            address: '',
            details: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const features = [
        {
            icon: Search,
            title: "Evaluación Exacta",
            description: "Analizamos métricas actuales del mercado para brindarle el valor real y competitivo de su inmueble."
        },
        {
            icon: TrendingUp,
            title: "Maximice su Rentabilidad",
            description: "No deje dinero sobre la mesa. Ubicamos el punto exacto de precio para vender rápido y al mejor valor."
        },
        {
            icon: Building,
            title: "Amplia Experiencia",
            description: "Tanto en desarrollos, lotes, departamentos o casas. Conocemos cada zona al detalle."
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-page)] pt-20">
            {/* Hero Section */}
            <section className="relative bg-[#0d9488] py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0d9488] via-[#0d9488]/90 to-transparent"></div>
                </div>

                <div className="container relative z-10 mx-auto px-6">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold !text-white mb-6 font-headings leading-tight"
                        >
                            Tasaciones
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-2xl !text-teal-50 mb-8 font-medium"
                        >
                            Conozca el valor real de su propiedad en el mercado actual. Nuestro equipo de tasadores certificados lo ayudará en el proceso.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content & Form */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Info Side */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl font-extrabold !text-slate-900 mb-6 font-headings">
                                    Venda en el tiempo justo y al valor correcto
                                </h2>
                                <p className="font-medium !text-slate-700 mb-10 leading-relaxed text-lg">
                                    El primer paso para una venta o alquiler exitoso es fijar un precio de mercado adecuado. Brindamos asesoramiento profesional para evitar demoras innecesarias y maximizar la rentabilidad de su hogar.
                                </p>

                                <div className="space-y-8">
                                    {features.map((feature, index) => {
                                        const Icon = feature.icon;
                                        return (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-extrabold !text-slate-900 mb-2">{feature.title}</h3>
                                                    <p className="font-medium !text-slate-700 leading-relaxed text-base">{feature.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Side */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>

                            <h3 className="text-2xl font-extrabold !text-slate-900 mb-2 font-headings relative z-10">Solicitar Tasación</h3>
                            <p className="font-medium !text-slate-700 mb-8 relative z-10 text-base">Un corredor inmobiliario matriculado se pondrá en contacto para visitarlo.</p>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre completo *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                            placeholder="+54 11 1234-5678"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                            placeholder="juan@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Propiedad *</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="casa">Casa</option>
                                            <option value="departamento">Departamento</option>
                                            <option value="terreno">Inversión / Lote</option>
                                            <option value="oficina">Oficina / Local Comercial</option>
                                            <option value="edificio">Edificio</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dirección del Inmueble</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Av. Ejemplo 1234, Ciudad..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Detalles Adicionales</label>
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Características de la propiedad, cantidad de ambientes, superficie, dependencias, etc."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2"
                                >
                                    Enviar Solicitud
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-4">
                                    Sus datos están protegidos y no serán compartidos con terceros.
                                </p>
                            </form>
                        </motion.div>

                    </div>
                </div >
            </section >
        </div >
    );
}
