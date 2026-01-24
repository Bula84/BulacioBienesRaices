'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Newspaper,
    Calendar
} from 'lucide-react';
import {
    Noticia,
    getNoticias,
    createNoticia,
    updateNoticia,
    deleteNoticia
} from '@/lib/supabase';

// Mock data
const mockNews: Noticia[] = [
    {
        id: '1',
        title: 'El mercado inmobiliario argentino muestra signos de recuperación',
        content: 'Contenido del artículo...',
        excerpt: 'Los expertos señalan un incremento del 15% en las transacciones durante el último trimestre.',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
        author: 'Carlos Rodríguez',
        created_at: '2026-01-20T10:00:00Z',
    },
    {
        id: '2',
        title: 'Nuevas tendencias en diseño de interiores para 2026',
        content: 'Contenido del artículo...',
        excerpt: 'Descubre las últimas tendencias en decoración y diseño.',
        image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400',
        author: 'María González',
        created_at: '2026-01-18T14:30:00Z',
    },
];

const emptyNoticia = {
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: '',
};

export default function AdminNoticiasPage() {
    const [news, setNews] = useState<Noticia[]>(mockNews);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
    const [formData, setFormData] = useState(emptyNoticia);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

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

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (noticia?: Noticia) => {
        if (noticia) {
            setEditingNoticia(noticia);
            setFormData({
                title: noticia.title,
                content: noticia.content,
                excerpt: noticia.excerpt || '',
                image_url: noticia.image_url || '',
                author: noticia.author || '',
            });
        } else {
            setEditingNoticia(null);
            setFormData(emptyNoticia);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingNoticia(null);
        setFormData(emptyNoticia);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingNoticia) {
                const updated = await updateNoticia(editingNoticia.id, formData);
                if (updated) {
                    setNews(news.map(n => n.id === editingNoticia.id ? updated : n));
                }
            } else {
                const created = await createNoticia(formData as any);
                if (created) {
                    setNews([created, ...news]);
                }
            }
            closeModal();
        } catch (error) {
            console.error('Error saving noticia:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta noticia?')) return;

        try {
            const success = await deleteNoticia(id);
            if (success) {
                setNews(news.filter(n => n.id !== id));
            }
        } catch (error) {
            setNews(news.filter(n => n.id !== id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Noticias</h1>
                    <p className="text-neutral-400 text-sm">Gestiona los artículos del blog</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                        color: '#0a0a1a',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Nueva Noticia
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                    type="text"
                    placeholder="Buscar noticias..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glass w-full pl-12"
                />
            </div>

            {/* News Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((noticia) => (
                    <motion.div
                        key={noticia.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                    >
                        {/* Image */}
                        <div
                            className="h-40 bg-cover bg-center"
                            style={{
                                backgroundImage: noticia.image_url
                                    ? `url(${noticia.image_url})`
                                    : 'linear-gradient(135deg, #1a1a3e, #12122a)',
                            }}
                        />

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(noticia.created_at)}
                                {noticia.author && (
                                    <>
                                        <span>•</span>
                                        <span>{noticia.author}</span>
                                    </>
                                )}
                            </div>

                            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">
                                {noticia.title}
                            </h3>

                            {noticia.excerpt && (
                                <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
                                    {noticia.excerpt}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => openModal(noticia)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(noticia.id)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredNews.length === 0 && (
                <div className="text-center py-12">
                    <Newspaper className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">No se encontraron noticias</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-6 rounded-2xl"
                            style={{
                                background: 'rgba(18, 18, 42, 0.98)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingNoticia ? 'Editar Noticia' : 'Nueva Noticia'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-glass w-full"
                                        placeholder="Título del artículo"
                                        required
                                    />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Extracto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="input-glass w-full"
                                        placeholder="Breve descripción para la preview"
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Contenido
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="input-glass w-full min-h-[200px] resize-y"
                                        placeholder="Escribe el contenido del artículo..."
                                        required
                                    />
                                </div>

                                {/* Author & Image */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            Autor
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="Nombre del autor"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            URL de imagen
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="input-glass w-full"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:bg-white/10 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, #00d4ff 0%, #3b82f6 100%)',
                                            color: '#0a0a1a',
                                        }}
                                    >
                                        {editingNoticia ? 'Guardar Cambios' : 'Publicar Noticia'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
