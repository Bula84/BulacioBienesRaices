'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, Clock } from 'lucide-react';
import { Noticia, getNoticia, getNoticias } from '@/lib/supabase';
import NewsCard from '@/components/NewsCard';

// Mock data
const mockNoticia: Noticia = {
    id: '1',
    title: 'El mercado inmobiliario argentino muestra signos de recuperación',
    content: `
El mercado inmobiliario argentino está experimentando una notable recuperación después de varios años de incertidumbre económica. Los últimos datos del sector muestran un incremento del 15% en las transacciones durante el último trimestre, marcando una tendencia positiva que no se veía desde hace tiempo.

## Factores que impulsan la recuperación

Varios factores están contribuyendo a esta mejora del sector:

1. **Estabilización económica**: La reducción de la inflación y la estabilidad del tipo de cambio han generado mayor confianza en los inversores.

2. **Nuevas líneas de crédito**: Los bancos han comenzado a ofrecer opciones de financiamiento más accesibles para la compra de viviendas.

3. **Demanda reprimida**: Muchos compradores que habían postergado sus decisiones están ahora entrando al mercado.

## Zonas con mayor movimiento

Las zonas que están mostrando mayor actividad incluyen:

- **Puerto Madero**: Continúa siendo una de las áreas más demandadas para inversiones de alto nivel.
- **Palermo y sus barrios**: La demanda de departamentos y oficinas sigue en aumento.
- **Zona Norte del GBA**: Nordelta, San Isidro y Vicente López muestran un crecimiento sostenido.

## Perspectivas para el futuro

Los expertos del sector anticipan que esta tendencia positiva continuará durante los próximos meses. Se espera que los precios se mantengan estables, con posibles incrementos moderados en las zonas más demandadas.

La recomendación para los interesados en invertir es aprovechar el momento actual, antes de que los precios reflejen completamente la recuperación del mercado.
  `,
    excerpt: 'Los expertos señalan un incremento del 15% en las transacciones durante el último trimestre, marcando una tendencia positiva para el sector.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    author: 'Carlos Rodríguez',
    created_at: '2026-01-20T10:00:00Z',
};

export default function NoticiaDetailPage() {
    const params = useParams();
    const [noticia, setNoticia] = useState<Noticia | null>(mockNoticia);
    const [relatedNews, setRelatedNews] = useState<Noticia[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNoticia = async () => {
            try {
                if (params.id && params.id !== '1') {
                    const data = await getNoticia(params.id as string);
                    if (data) {
                        setNoticia(data);
                    }
                }

                // Load related news
                const allNews = await getNoticias();
                setRelatedNews(allNews.filter(n => n.id !== params.id).slice(0, 3));
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setIsLoading(false);
            }
        };

        loadNoticia();
    }, [params.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min de lectura`;
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="h-96 rounded-[2rem] animate-pulse" style={{ background: 'rgba(255, 255, 255, 0.05)' }} />
                </div>
            </div>
        );
    }

    if (!noticia) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Artículo no encontrado</h1>
                <Link href="/noticias" className="text-[#00d4ff] hover:underline">
                    Volver a noticias
                </Link>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver a noticias
                    </Link>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(noticia.created_at)}
                            </div>
                            {noticia.author && (
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {noticia.author}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {calculateReadTime(noticia.content)}
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            {noticia.title}
                        </h1>

                        {/* Excerpt */}
                        {noticia.excerpt && (
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                {noticia.excerpt}
                            </p>
                        )}
                    </motion.header>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <div
                            className="aspect-video rounded-[2rem] overflow-hidden bg-cover bg-center"
                            style={{
                                backgroundImage: noticia.image_url
                                    ? `url(${noticia.image_url})`
                                    : 'linear-gradient(135deg, #1a1a3e, #12122a)',
                                boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.4)',
                            }}
                        />
                    </motion.div>

                    {/* Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none mb-12"
                        style={{
                            '--tw-prose-body': 'rgb(163, 163, 170)',
                            '--tw-prose-headings': 'rgb(255, 255, 255)',
                            '--tw-prose-links': '#00d4ff',
                            '--tw-prose-bold': 'rgb(255, 255, 255)',
                            '--tw-prose-bullets': '#00d4ff',
                            '--tw-prose-quotes': 'rgb(212, 212, 216)',
                            '--tw-prose-quote-borders': '#00d4ff',
                        } as React.CSSProperties}
                    >
                        {noticia.content.split('\n').map((paragraph, index) => {
                            if (paragraph.startsWith('## ')) {
                                return (
                                    <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
                                        {paragraph.replace('## ', '')}
                                    </h2>
                                );
                            }
                            if (paragraph.startsWith('- **')) {
                                const match = paragraph.match(/- \*\*(.+?)\*\*: (.+)/);
                                if (match) {
                                    return (
                                        <li key={index} className="text-neutral-300">
                                            <strong className="text-white">{match[1]}</strong>: {match[2]}
                                        </li>
                                    );
                                }
                            }
                            if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
                                const content = paragraph.replace(/^\d+\. /, '');
                                const match = content.match(/\*\*(.+?)\*\*: (.+)/);
                                if (match) {
                                    return (
                                        <p key={index} className="text-neutral-300 ml-6">
                                            <strong className="text-white">{match[1]}</strong>: {match[2]}
                                        </p>
                                    );
                                }
                            }
                            if (paragraph.trim()) {
                                return (
                                    <p key={index} className="text-neutral-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </motion.article>

                    {/* Share */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-between py-8 border-t border-b border-white/10 mb-12"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-neutral-400">Compartir:</span>
                            <div className="flex items-center gap-2">
                                <button
                                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 text-neutral-400 hover:text-[#00d4ff] transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {noticia.author && (
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                                    }}
                                >
                                    <span className="text-sm font-bold text-[#0a0a1a]">
                                        {noticia.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{noticia.author}</p>
                                    <p className="text-xs text-neutral-500">Autor</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Artículos Relacionados</h2>
                            <Link
                                href="/noticias"
                                className="text-[#00d4ff] text-sm hover:underline"
                            >
                                Ver todos
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedNews.map((news, index) => (
                                <NewsCard key={news.id} news={news} index={index} />
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
