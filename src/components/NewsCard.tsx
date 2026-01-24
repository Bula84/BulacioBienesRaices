'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Noticia } from '@/lib/supabase';

interface NewsCardProps {
    news: Noticia;
    index?: number;
}

export default function NewsCard({ news, index = 0 }: NewsCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
        >
            <Link href={`/noticias/${news.id}`}>
                <article
                    className="group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{
                                backgroundImage: news.image_url
                                    ? `url(${news.image_url})`
                                    : 'linear-gradient(135deg, #1a1a3e 0%, #12122a 100%)',
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, transparent 30%, rgba(10, 10, 26, 0.95) 100%)',
                            }}
                        />

                        {/* Date Badge */}
                        <div className="absolute top-4 left-4">
                            <span
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full"
                                style={{
                                    background: 'rgba(10, 10, 26, 0.8)',
                                    backdropFilter: 'blur(10px)',
                                    color: '#00d4ff',
                                    border: '1px solid rgba(0, 212, 255, 0.3)',
                                }}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(news.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-[#00d4ff] transition-colors">
                            {news.title}
                        </h3>

                        {/* Excerpt */}
                        {news.excerpt && (
                            <p className="text-neutral-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                                {news.excerpt}
                            </p>
                        )}

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-[#00d4ff] text-sm font-medium group-hover:gap-3 transition-all duration-300">
                            <span>Leer más</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Hover Glow */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 50% 100%, rgba(0, 212, 255, 0.1), transparent 60%)',
                        }}
                    />

                    {/* Levitation Effect */}
                    <style jsx>{`
            article:hover {
              transform: translateY(-12px);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 50px rgba(0, 212, 255, 0.15);
            }
          `}</style>
                </article>
            </Link>
        </motion.div>
    );
}
