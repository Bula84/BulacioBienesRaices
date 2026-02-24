'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    X,
    Share2,
    Facebook,
    Instagram,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Send,
    Image as ImageIcon,
    Video,
    Home
} from 'lucide-react';
import {
    Publicacion,
    getPublicaciones,
    getPublicacionesByUser,
    createPublicacion,
    deletePublicacion,
    publishToSocialMedia,
    getPropiedades,
    Propiedad
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import FileUploader from '@/components/FileUploader';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const emptyPost = {
    title: '',
    content: '',
    image_url: '',
    video_url: '',
    propiedad_id: undefined as string | undefined,
    facebook_status: 'pending' as const,
    instagram_status: 'pending' as const,
    tiktok_status: 'pending' as const,
    scheduled_for: undefined as string | undefined,
    publish_to_facebook: true,
    publish_to_instagram: true,
    publish_to_tiktok: false,
};

export default function AdminPublicacionesPage() {
    const { user, isSuperAdmin } = useAuth();
    const [publications, setPublications] = useState<Publicacion[]>([]);
    const [properties, setProperties] = useState<Propiedad[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(emptyPost);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, isSuperAdmin]);

    const loadData = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // Load publications
            let pubData: Publicacion[];
            if (isSuperAdmin) {
                pubData = await getPublicaciones();
            } else {
                pubData = await getPublicacionesByUser(user.id);
            }
            setPublications(pubData);

            // Load properties for linking
            const propData = await getPropiedades();
            setProperties(propData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPublications = publications.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = () => {
        setFormData(emptyPost);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(emptyPost);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const publicationData = {
                title: formData.title,
                content: formData.content,
                image_url: formData.image_url || undefined,
                video_url: formData.video_url || undefined,
                propiedad_id: formData.propiedad_id || undefined,
                facebook_status: formData.publish_to_facebook ? 'pending' as const : 'skipped' as const,
                instagram_status: formData.publish_to_instagram ? 'pending' as const : 'skipped' as const,
                tiktok_status: formData.publish_to_tiktok ? 'pending' as const : 'skipped' as const,
                scheduled_for: formData.scheduled_for || undefined,
                user_id: user.id,
            };

            const created = await createPublicacion(publicationData);
            if (created) {
                setPublications([created, ...publications]);
                closeModal();

                // Auto-publish if no schedule
                if (!formData.scheduled_for) {
                    handlePublish(created.id);
                }
            }
        } catch (error) {
            console.error('Error creating publication:', error);
        }
    };

    const handlePublish = async (id: string) => {
        setIsPublishing(id);
        try {
            const result = await publishToSocialMedia(id);
            if (result.success) {
                // Reload to get updated statuses
                loadData();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error publishing:', error);
        } finally {
            setIsPublishing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta publicación?')) return;

        try {
            await deletePublicacion(id);
            setPublications(publications.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'published':
                return <CheckCircle className="w-4 h-4 text-emerald-400" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-400" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'skipped':
                return <AlertCircle className="w-4 h-4 text-neutral-500" />;
            default:
                return null;
        }
    };

    const fillFromProperty = (propId: string) => {
        const prop = properties.find(p => p.id === propId);
        if (prop) {
            setFormData({
                ...formData,
                propiedad_id: propId,
                title: `🏠 ${prop.operation === 'venta' ? 'EN VENTA' : 'EN ALQUILER'}: ${prop.title}`,
                content: `📍 ${prop.address || ''}\n💰 USD ${prop.price.toLocaleString('es-AR')}${prop.operation === 'alquiler' ? '/mes' : ''}\n\n${prop.bedrooms ? `🛏️ ${prop.bedrooms} dormitorios\n` : ''}${prop.bathrooms ? `🚿 ${prop.bathrooms} baños\n` : ''}${prop.m2 ? `📐 ${prop.m2} m²\n` : ''}\n${prop.description || ''}\n\n📩 Más info por privado\n\n#inmobiliaria #propiedades #${prop.operation} #${prop.type?.toLowerCase().replace(' ', '')} #buenosaires`,
                image_url: prop.image_url || '',
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Share2 className="w-7 h-7" />
                        Publicaciones Redes Sociales
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Publica contenido automáticamente en Facebook, Instagram y TikTok
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #1877F2 0%, #E4405F 50%, #000000 100%)',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    Nueva Publicación
                </button>
            </div>

            {/* Info Banner */}
            <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(24, 119, 242, 0.1) 0%, rgba(228, 64, 95, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-white text-sm font-medium">Configura tus cuentas</p>
                    <p className="text-neutral-400 text-sm">
                        Para publicar automáticamente, necesitas configurar las APIs de cada red social en la sección de configuración.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <input
                    type="text"
                    placeholder="Buscar publicaciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
                />
            </div>

            {/* Publications Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="w-8 h-8 border-2 border-neutral-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400">Cargando publicaciones...</p>
                </div>
            ) : filteredPublications.length === 0 ? (
                <div className="text-center py-12">
                    <Share2 className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">No hay publicaciones aún</p>
                    <button
                        onClick={openModal}
                        className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                        Crear tu primera publicación
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublications.map((pub) => (
                        <motion.div
                            key={pub.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                        >
                            {/* Image Preview */}
                            {pub.image_url && (
                                <div
                                    className="h-40 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${pub.image_url})` }}
                                />
                            )}

                            <div className="p-4 space-y-3">
                                {/* Title */}
                                <h3 className="font-semibold text-white line-clamp-1">{pub.title}</h3>

                                {/* Content Preview */}
                                <p className="text-neutral-400 text-sm line-clamp-2">{pub.content}</p>

                                {/* Platform Status */}
                                <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-1" title={`Facebook: ${pub.facebook_status}`}>
                                        <Facebook className="w-4 h-4 text-[#1877F2]" />
                                        {getStatusIcon(pub.facebook_status)}
                                    </div>
                                    <div className="flex items-center gap-1" title={`Instagram: ${pub.instagram_status}`}>
                                        <Instagram className="w-4 h-4 text-[#E4405F]" />
                                        {getStatusIcon(pub.instagram_status)}
                                    </div>
                                    <div className="flex items-center gap-1" title={`TikTok: ${pub.tiktok_status}`}>
                                        <TikTokIcon className="w-4 h-4 text-white" />
                                        {getStatusIcon(pub.tiktok_status)}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-3">
                                    <span className="text-xs text-neutral-500">
                                        {new Date(pub.created_at).toLocaleDateString('es-AR')}
                                    </span>
                                    <div className="flex gap-2">
                                        {(pub.facebook_status === 'pending' || pub.instagram_status === 'pending' || pub.tiktok_status === 'pending') && (
                                            <button
                                                onClick={() => handlePublish(pub.id)}
                                                disabled={isPublishing === pub.id}
                                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:opacity-90 transition-all disabled:opacity-50"
                                            >
                                                {isPublishing === pub.id ? (
                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Send className="w-3 h-3" />
                                                )}
                                                Publicar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(pub.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
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
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">Nueva Publicación</h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Quick Fill from Property */}
                                {properties.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                                            <Home className="w-4 h-4 inline mr-2" />
                                            Generar desde propiedad
                                        </label>
                                        <select
                                            value={formData.propiedad_id || ''}
                                            onChange={(e) => fillFromProperty(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Seleccionar propiedad...</option>
                                            {properties.map(prop => (
                                                <option key={prop.id} value={prop.id}>
                                                    {prop.title} - ${prop.price.toLocaleString('es-AR')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="Título atractivo para tu publicación"
                                        required
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        Contenido *
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                                        placeholder="Escribe el contenido... usa emojis y hashtags 🏠 #inmobiliaria"
                                        required
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {formData.content.length}/2200 caracteres (límite de Instagram)
                                    </p>
                                </div>

                                {/* Media */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-neutral-300">
                                        <ImageIcon className="w-4 h-4 inline mr-2" />
                                        Imagen
                                    </label>
                                    {formData.image_url && (
                                        <div className="relative h-40 rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image_url: '' })}
                                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <FileUploader
                                        folder="publicaciones"
                                        accept="images"
                                        multiple={false}
                                        compact={!!formData.image_url}
                                        dark={true}
                                        onUpload={(url) => setFormData({ ...formData, image_url: url })}
                                        helperText="JPG, PNG, WebP • Máx. 50MB"
                                    />
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">O pegá una URL:</p>
                                        <input
                                            type="url"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-neutral-300">
                                        <Video className="w-4 h-4 inline mr-2" />
                                        Video (TikTok / Reels)
                                    </label>
                                    <FileUploader
                                        folder="publicaciones"
                                        accept="videos"
                                        multiple={false}
                                        compact={true}
                                        dark={true}
                                        onUpload={(url) => setFormData({ ...formData, video_url: url })}
                                        helperText="MP4, WebM • Máx. 50MB"
                                    />
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">O pegá un link:</p>
                                        <input
                                            type="url"
                                            value={formData.video_url}
                                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    {formData.video_url && (
                                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                            <Video className="w-4 h-4 text-blue-400" />
                                            <span className="text-xs text-blue-300 font-medium truncate flex-1">✓ {formData.video_url}</span>
                                            <button type="button" onClick={() => setFormData({ ...formData, video_url: '' })} className="p-1 rounded hover:bg-blue-500/20 text-blue-400">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Platforms */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                                        Publicar en
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        <label
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all ${formData.publish_to_facebook
                                                ? 'bg-[#1877F2]/20 border-[#1877F2]/50 text-[#1877F2]'
                                                : 'bg-white/5 border-white/10 text-neutral-400'
                                                } border`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.publish_to_facebook}
                                                onChange={(e) => setFormData({ ...formData, publish_to_facebook: e.target.checked })}
                                                className="hidden"
                                            />
                                            <Facebook className="w-5 h-5" />
                                            Facebook
                                        </label>
                                        <label
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all ${formData.publish_to_instagram
                                                ? 'bg-[#E4405F]/20 border-[#E4405F]/50 text-[#E4405F]'
                                                : 'bg-white/5 border-white/10 text-neutral-400'
                                                } border`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.publish_to_instagram}
                                                onChange={(e) => setFormData({ ...formData, publish_to_instagram: e.target.checked })}
                                                className="hidden"
                                            />
                                            <Instagram className="w-5 h-5" />
                                            Instagram
                                        </label>
                                        <label
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all ${formData.publish_to_tiktok
                                                ? 'bg-white/20 border-white/50 text-white'
                                                : 'bg-white/5 border-white/10 text-neutral-400'
                                                } border`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.publish_to_tiktok}
                                                onChange={(e) => setFormData({ ...formData, publish_to_tiktok: e.target.checked })}
                                                className="hidden"
                                            />
                                            <TikTokIcon className="w-5 h-5" />
                                            TikTok
                                        </label>
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Programar publicación (opcional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.scheduled_for || ''}
                                        onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value || undefined })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Deja vacío para publicar inmediatamente
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:bg-white/10 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 hover:scale-105"
                                        style={{
                                            background: 'linear-gradient(135deg, #1877F2 0%, #E4405F 100%)',
                                        }}
                                    >
                                        <Send className="w-4 h-4" />
                                        Crear y Publicar
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
