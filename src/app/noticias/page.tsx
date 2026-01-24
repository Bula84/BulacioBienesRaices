'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { Noticia, getNoticias } from '@/lib/supabase';

// Mock data for demo
const mockNews: Noticia[] = [
    {
        id: '1',
        title: 'El mercado inmobiliario argentino muestra signos de recuperación',
        content: 'Análisis completo del mercado...',
        excerpt: 'Los expertos señalan un incremento del 15% en las transacciones durante el último trimestre, marcando una tendencia positiva para el sector.',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        author: 'Carlos Rodríguez',
        created_at: '2026-01-20T10:00:00Z',
    },
    {
        id: '2',
        title: 'Nuevas tendencias en diseño de interiores para 2026',
        content: 'Las tendencias de diseño...',
        excerpt: 'Descubre las últimas tendencias en decoración y diseño que están transformando los espacios residenciales este año.',
        image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        author: 'María González',
        created_at: '2026-01-18T14:30:00Z',
    },
    {
        id: '3',
        title: 'Guía completa para invertir en propiedades',
        content: 'Todo lo que necesitas saber...',
        excerpt: 'Una guía paso a paso para aquellos que buscan invertir en el mercado inmobiliario por primera vez.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        author: 'Andrés López',
        created_at: '2026-01-15T09:00:00Z',
    },
    {
        id: '4',
        title: 'Cómo preparar tu propiedad para la venta',
        content: 'Consejos para vender tu propiedad...',
        excerpt: 'Tips profesionales para maximizar el valor de tu propiedad y acelerar el proceso de venta.',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        author: 'Carlos Rodríguez',
        created_at: '2026-01-12T16:00:00Z',
    },
    {
        id: '5',
        title: 'Zonas con mayor potencial de crecimiento en Buenos Aires',
        content: 'Análisis de zonas...',
        excerpt: 'Identificamos las áreas de la ciudad que presentan las mejores oportunidades de inversión inmobiliaria.',
        image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        author: 'María González',
        created_at: '2026-01-10T11:00:00Z',
    },
    {
        id: '6',
        title: 'Aspectos legales a considerar al comprar una propiedad',
        content: 'Guía legal...',
        excerpt: 'Todo lo que debes saber sobre documentación, impuestos y trámites legales en transacciones inmobiliarias.',
        image_url: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800',
        author: 'Andrés López',
        created_at: '2026-01-08T13:30:00Z',
    },
];

export default function NoticiasPage() {
    const [news, setNews] = useState<Noticia[]>(mockNews);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await getNoticias();
                if (data.length > 0) {
                    setNews(data);
                }
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();
    }, []);

    return (
        <div className="py-12">
            <div className="container mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                        style={{
                            background: 'rgba(0, 212, 255, 0.1)',
                            color: '#00d4ff',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                        }}
                    >
                        <Newspaper className="w-4 h-4" />
                        Blog
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Noticias y{' '}
                        <span className="bg-gradient-to-r from-[#00d4ff] to-[#a855f7] bg-clip-text text-transparent">
                            Novedades
                        </span>
                    </h1>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
                        Mantente informado sobre las últimas tendencias del mercado inmobiliario,
                        consejos y novedades del sector.
                    </p>
                </motion.div>

                {/* Featured Article */}
                {news.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <div
                            className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Image */}
                                <div className="relative h-64 md:h-auto overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{
                                            backgroundImage: `url(${news[0].image_url})`,
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 md:hidden"
                                        style={{
                                            background: 'linear-gradient(180deg, transparent 0%, rgba(10, 10, 26, 0.95) 100%)',
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-12 flex flex-col justify-center">
                                    <span
                                        className="inline-block w-fit px-3 py-1 rounded-full text-xs font-medium mb-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                                            color: '#0a0a1a',
                                        }}
                                    >
                                        Destacado
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#00d4ff] transition-colors">
                                        {news[0].title}
                                    </h2>
                                    <p className="text-neutral-400 mb-6 line-clamp-3">
                                        {news[0].excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                                        {news[0].author && <span>{news[0].author}</span>}
                                        <span>•</span>
                                        <span>
                                            {new Date(news[0].created_at).toLocaleDateString('es-AR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* News Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-96 rounded-[2rem] animate-pulse"
                                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.slice(1).map((article, index) => (
                            <NewsCard key={article.id} news={article} index={index} />
                        ))}
                    </div>
                )}

                {/* Load More (placeholder) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <button
                        className="px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                        }}
                    >
                        Cargar más artículos
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
