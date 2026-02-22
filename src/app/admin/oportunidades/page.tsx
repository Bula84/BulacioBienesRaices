'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit, Trash2, X, ShoppingBag, Tag, Image, MapPin, Phone, Mail, Star, ChevronDown, ChevronUp, DollarSign, Percent, Store
} from 'lucide-react';
import {
    Oportunidad, getOportunidades, createOportunidad, updateOportunidad, deleteOportunidad
} from '@/lib/supabase';

const categorias = [
    'Materiales', 'Herramientas', 'Maquinaria', 'Remanentes de Obra',
    'Revestimientos', 'Pintura', 'Sanitarios', 'Aberturas',
    'Electricidad', 'Pisos', 'Techos', 'Otro',
];

const formularioVacio = {
    title: '',
    description: '',
    full_description: '',
    price: 0,
    discount: 0,
    image_url: '',
    images: [] as string[],
    category: '',
    seller_name: '',
    contact_phone: '',
    contact_email: '',
    location: '',
    is_featured: false,
};

export default function AdminOportunidadesPage() {
    const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState<Oportunidad | null>(null);
    const [formData, setFormData] = useState(formularioVacio);
    const [imagenInput, setImagenInput] = useState('');
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [filaExpandida, setFilaExpandida] = useState<string | null>(null);

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const data = await getOportunidades();
            if (data.length > 0) setOportunidades(data);
        } catch (error) {
            console.log('Sin datos');
        } finally {
            setCargando(false);
        }
    };

    const filtradas = oportunidades.filter(o =>
        o.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.category.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.seller_name.toLowerCase().includes(busqueda.toLowerCase()) ||
        o.location?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModal = (oportunidad?: Oportunidad) => {
        if (oportunidad) {
            setEditando(oportunidad);
            setFormData({
                title: oportunidad.title,
                description: oportunidad.description || '',
                full_description: oportunidad.full_description || '',
                price: oportunidad.price || 0,
                discount: oportunidad.discount || 0,
                image_url: oportunidad.image_url || '',
                images: oportunidad.images || [],
                category: oportunidad.category,
                seller_name: oportunidad.seller_name,
                contact_phone: oportunidad.contact_phone || '',
                contact_email: oportunidad.contact_email || '',
                location: oportunidad.location || '',
                is_featured: oportunidad.is_featured || false,
            });
        } else {
            setEditando(null);
            setFormData(formularioVacio);
        }
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setEditando(null);
        setFormData(formularioVacio);
        setImagenInput('');
    };

    const agregarImagen = () => {
        if (imagenInput.trim() && !formData.images.includes(imagenInput.trim())) {
            setFormData({ ...formData, images: [...formData.images, imagenInput.trim()] });
            setImagenInput('');
        }
    };

    const quitarImagen = (url: string) => {
        setFormData({ ...formData, images: formData.images.filter(i => i !== url) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        try {
            if (editando) {
                const actualizada = await updateOportunidad(editando.id, formData);
                if (actualizada) setOportunidades(oportunidades.map(o => o.id === editando.id ? actualizada : o));
            } else {
                const creada = await createOportunidad(formData as any);
                if (creada) setOportunidades([creada, ...oportunidades]);
            }
            cerrarModal();
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta oportunidad?')) return;
        try {
            const ok = await deleteOportunidad(id);
            if (ok) setOportunidades(oportunidades.filter(o => o.id !== id));
        } catch (error) {
            setOportunidades(oportunidades.filter(o => o.id !== id));
        }
    };

    const formatPrecio = (precio?: number) => {
        if (!precio) return 'Consultar';
        return `$${precio.toLocaleString('es-AR')}`;
    };

    const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm";
    const labelClass = "block text-sm font-bold text-[var(--text-main)] mb-2";

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Oportunidades y Ofertas</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Gestiona las ofertas de materiales, herramientas y más</p>
                </div>
                <button
                    onClick={() => abrirModal()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105 bg-[#0d9488] hover:bg-[#0f766e] shadow-lg shadow-teal-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Oportunidad
                </button>
            </div>

            {/* Buscador */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar oportunidades..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-[var(--text-main)] placeholder:text-gray-400 focus:outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/20 transition-all text-sm"
                />
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Total</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{oportunidades.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Destacadas</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{oportunidades.filter(o => o.is_featured).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Con descuento</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{oportunidades.filter(o => o.discount && o.discount > 0).length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] font-medium">Categorías</p>
                    <p className="text-2xl font-bold text-[var(--text-main)]">{new Set(oportunidades.map(o => o.category)).size}</p>
                </div>
            </div>

            {/* Listado */}
            {cargando ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
                </div>
            ) : filtradas.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)] font-medium">No se encontraron oportunidades</p>
                    <p className="text-sm text-gray-400 mt-1">Creá una nueva oportunidad para comenzar</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtradas.map((oportunidad) => (
                        <motion.div
                            key={oportunidad.id}
                            layout
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 p-4">
                                {/* Miniatura */}
                                <div
                                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 bg-gray-100 border border-gray-200"
                                    style={{ backgroundImage: oportunidad.image_url ? `url(${oportunidad.image_url})` : undefined }}
                                >
                                    {!oportunidad.image_url && (
                                        <div className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
                                            <Tag className="w-6 h-6 text-teal-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Información */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-[var(--text-main)] truncate">{oportunidad.title}</h3>
                                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-50 text-[#0d9488]">
                                            {oportunidad.category}
                                        </span>
                                        {oportunidad.is_featured && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-600">
                                                <Star className="w-3 h-3 fill-amber-400" /> Destacada
                                            </span>
                                        )}
                                        {oportunidad.discount && oportunidad.discount > 0 ? (
                                            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700">
                                                <Percent className="w-3 h-3" /> -{oportunidad.discount}%
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-[var(--text-secondary)]">
                                        <span className="font-bold text-[var(--text-main)]">{formatPrecio(oportunidad.price)}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="flex items-center gap-1 truncate"><Store className="w-3 h-3" />{oportunidad.seller_name}</span>
                                        {oportunidad.location && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3" />{oportunidad.location}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => setFilaExpandida(filaExpandida === oportunidad.id ? null : oportunidad.id)}
                                        className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[var(--text-main)] transition-colors"
                                    >
                                        {filaExpandida === oportunidad.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => abrirModal(oportunidad)}
                                        className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-[#0d9488] transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(oportunidad.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Detalles expandidos */}
                            <AnimatePresence>
                                {filaExpandida === oportunidad.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-gray-100 overflow-hidden"
                                    >
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Vendedor</p>
                                                <p className="text-sm font-medium text-[var(--text-main)]">{oportunidad.seller_name}</p>
                                                {oportunidad.contact_phone && <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1"><Phone className="w-3 h-3" />{oportunidad.contact_phone}</p>}
                                                {oportunidad.contact_email && <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1"><Mail className="w-3 h-3" />{oportunidad.contact_email}</p>}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Precio</p>
                                                <p className="text-lg font-bold text-[var(--text-main)]">{formatPrecio(oportunidad.price)}</p>
                                                {oportunidad.discount && oportunidad.discount > 0 && (
                                                    <p className="text-sm text-emerald-600 font-medium">Descuento: {oportunidad.discount}%</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Ubicación</p>
                                                <p className="text-sm text-[var(--text-main)]">{oportunidad.location || 'No especificada'}</p>
                                            </div>
                                            {oportunidad.description && (
                                                <div className="md:col-span-3">
                                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Descripción</p>
                                                    <p className="text-sm text-[var(--text-secondary)]">{oportunidad.description}</p>
                                                </div>
                                            )}
                                            {oportunidad.images && oportunidad.images.length > 0 && (
                                                <div className="md:col-span-3">
                                                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Galería</p>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {oportunidad.images.map((img, i) => (
                                                            <div key={i} className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 border border-gray-200" style={{ backgroundImage: `url(${img})` }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {modalAbierto && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={cerrarModal} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl bg-white border border-gray-200 shadow-2xl"
                        >
                            {/* Encabezado del Modal */}
                            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl font-bold text-[var(--text-main)]">
                                    {editando ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
                                </h2>
                                <button onClick={cerrarModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[var(--text-main)] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Título y Categoría */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Título *</label>
                                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="Ej: Ladrillos Retak - Lote 500u" required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Categoría *</label>
                                        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={inputClass} required>
                                            <option value="">Seleccionar categoría</option>
                                            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Vendedor y Ubicación */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Nombre del Vendedor *</label>
                                        <input type="text" value={formData.seller_name} onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })} className={inputClass} placeholder="Ej: Corralón El Sol" required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Ubicación</label>
                                        <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} placeholder="Ej: San Isidro, Buenos Aires" />
                                    </div>
                                </div>

                                {/* Contacto */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Teléfono de contacto *</label>
                                        <input type="tel" value={formData.contact_phone} onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })} className={inputClass} placeholder="+54 11 1234-5678" required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email de contacto</label>
                                        <input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className={inputClass} placeholder="ventas@corralon.com" />
                                    </div>
                                </div>

                                {/* Precio y Descuento */}
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Precio (ARS) *</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className={`${inputClass} pl-10`} placeholder="0" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Descuento (%)</label>
                                        <div className="relative">
                                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="number" min="0" max="100" value={formData.discount || ''} onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })} className={`${inputClass} pl-10`} placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200 w-full hover:bg-teal-50 hover:border-teal-200 transition-colors">
                                            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-5 h-5 rounded accent-[#0d9488]" />
                                            <div>
                                                <span className="font-bold text-sm text-[var(--text-main)]">Destacada</span>
                                                <p className="text-xs text-[var(--text-secondary)]">Aparece primero</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Descripción Breve */}
                                <div>
                                    <label className={labelClass}>Descripción Breve *</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${inputClass} min-h-[80px] resize-y`} placeholder="Resumen que se muestra en la tarjeta de la oferta" required />
                                </div>

                                {/* Descripción Completa */}
                                <div>
                                    <label className={labelClass}>Descripción Completa</label>
                                    <textarea value={formData.full_description} onChange={(e) => setFormData({ ...formData, full_description: e.target.value })} className={`${inputClass} min-h-[120px] resize-y`} placeholder="Descripción detallada que se muestra en la página de la oportunidad (especificaciones, medidas, estado, condiciones de venta, etc.)" />
                                </div>

                                {/* Imagen Principal */}
                                <div>
                                    <label className={labelClass}>Imagen Principal (URL) *</label>
                                    <input type="url" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className={inputClass} placeholder="https://..." required />
                                    {formData.image_url && (
                                        <div className="mt-3 w-28 h-28 rounded-xl bg-cover bg-center border-2 border-gray-200" style={{ backgroundImage: `url(${formData.image_url})` }} />
                                    )}
                                </div>

                                {/* Galería de Imágenes */}
                                <div>
                                    <label className={labelClass}>Galería Adicional de Imágenes</label>
                                    <p className="text-xs text-[var(--text-secondary)] mb-2">Agregá fotos adicionales del producto para mostrar detalles</p>
                                    <div className="flex gap-2 mb-3">
                                        <input type="url" value={imagenInput} onChange={(e) => setImagenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarImagen())} className={`${inputClass} flex-1`} placeholder="https://...imagen-adicional.jpg" />
                                        <button type="button" onClick={agregarImagen} className="px-4 py-2 rounded-xl bg-[#0d9488] text-white font-bold hover:bg-[#0f766e] transition-colors text-sm flex-shrink-0">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {formData.images.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {formData.images.map((img, i) => (
                                                <div key={i} className="relative group">
                                                    <div className="w-24 h-24 rounded-xl bg-cover bg-center border-2 border-gray-200" style={{ backgroundImage: `url(${img})` }} />
                                                    <button type="button" onClick={() => quitarImagen(img)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={cerrarModal} className="px-5 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-gray-100 transition-colors">
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={guardando}
                                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0d9488] hover:bg-[#0f766e] transition-all duration-200 hover:scale-105 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                                    >
                                        {guardando ? 'Guardando...' : editando ? 'Guardar Cambios' : 'Publicar Oportunidad'}
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
