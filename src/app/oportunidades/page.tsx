'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Tag, Building2, Store } from 'lucide-react';
import OportunidadCard from '@/components/OportunidadCard';
import BannerAd from '@/components/BannerAd';
import { Oportunidad, getOportunidades } from '@/lib/supabase';

// Mock categories
const categories = [
    'Todos',
    'Materiales',
    'Herramientas',
    'Maquinaria',
    'Remanentes de Obra',
    'Revestimientos',
    'Pintura'
];

// Mock data for demo
const mockOportunidades: Oportunidad[] = [
    {
        id: '1',
        title: 'Ladrillos Retak - Lote de 500u',
        description: 'Venta de lote completo sobrante de obra. Excelente estado.',
        full_description: 'Ladrillos HCCA Retak de 15x25x50cm. Sobrantes de la obra en curso, paletizados y listos para retirar.',
        price: 850000,
        discount: 15,
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800', // Bricks
        category: 'Materiales',
        seller_name: 'Corralón El Sol',
        contact_phone: '+541112345678',
        location: 'San Isidro, Buenos Aires',
        is_featured: true,
        created_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Hormigonera Reforzada 130Lts',
        description: 'Hormigonera con motor blindado 3/4 HP. 1 mes de uso.',
        price: 180000,
        discount: 25,
        image_url: 'https://images.unsplash.com/photo-1541888086925-920a0bfae407?w=800', // Cement mixer
        category: 'Maquinaria',
        seller_name: 'Ferretería Norte',
        contact_phone: '+541123456789',
        location: 'Nordelta, Tigre',
        is_featured: true,
        created_at: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Porcelanato Símil Madera Ilva',
        description: 'Cajas cerradas de porcelanato Ilva Legni 20x120cm. 50m2 disponibles.',
        price: 950000,
        discount: 10,
        image_url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800', // Tiles
        category: 'Revestimientos',
        seller_name: 'Cerámicas del Sur',
        contact_phone: '+541134567890',
        location: 'CABA',
        is_featured: false,
        created_at: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Andamios Tubulares - Alquiler o Venta',
        description: 'Cuerpos de andamio 1.30 x 1.30mts con tablones metálicos.',
        price: 45000,
        image_url: 'https://images.unsplash.com/photo-1534237710431-137233634125?w=800', // Scaffolding
        category: 'Herramientas',
        seller_name: 'Constructora ACME',
        contact_phone: '+541145678901',
        location: 'Pilar, Buenos Aires',
        is_featured: false,
        created_at: new Date().toISOString(),
    }
];

export default function OportunidadesPage() {
    const [oportunidades, setOportunidades] = useState<Oportunidad[]>(mockOportunidades);
    const [filteredItems, setFilteredItems] = useState<Oportunidad[]>(mockOportunidades);
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getOportunidades();
                if (data.length > 0) {
                    setOportunidades(data);
                    setFilteredItems(data);
                }
            } catch (error) {
                console.log('Using mock data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        let result = oportunidades;

        // Filter by category
        if (activeCategory !== 'Todos') {
            result = result.filter(o => o.category === activeCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                o =>
                    o.title.toLowerCase().includes(query) ||
                    o.description?.toLowerCase().includes(query) ||
                    o.seller_name.toLowerCase().includes(query) ||
                    o.location?.toLowerCase().includes(query)
            );
        }

        setFilteredItems(result);
    }, [activeCategory, searchQuery, oportunidades]);

    return (
        <main className="min-h-screen pt-24 pb-12 bg-[var(--bg-page)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16 mt-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 bg-gradient-to-br from-[var(--primary-blue)] to-blue-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20 rotate-12"
                    >
                        <ShoppingBag className="w-10 h-10 text-white -rotate-12" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold text-[var(--text-main)] mb-6 tracking-tight font-headings"
                    >
                        Oportunidades y Ofertas
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[var(--text-secondary)] text-xl font-medium leading-relaxed"
                    >
                        Descubrí materiales de construcción, herramientas y sobrantes de obra
                        a precios increíbles directos de corralones y constructoras.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Buscar materiales, herramientas, corralones..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-0 focus:border-[var(--primary-blue)] font-medium text-[var(--text-main)] placeholder:text-gray-400 transition-all shadow-sm"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--primary-blue)] w-6 h-6" />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === category
                                    ? 'bg-[var(--primary-blue)] text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : 'bg-white text-[var(--text-secondary)] hover:bg-blue-50 border border-gray-100 hover:border-blue-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse bg-white rounded-3xl h-[400px] border border-gray-100 shadow-sm" />
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((oportunidad, index) => (
                            <OportunidadCard key={oportunidad.id} oportunidad={oportunidad} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-2 font-headings">
                            Sin resultados
                        </h3>
                        <p className="text-[var(--text-secondary)] font-medium">
                            No encontramos oportunidades que coincidan con tu búsqueda.
                        </p>
                    </div>
                )}

                {/* Banner Advertising */}
                <div className="mt-16">
                    <BannerAd
                        title="Impulsá las ventas de tu corralón"
                        description="Publicá tus ofertas, excedentes de stock y outlet de materiales en nuestra plataforma. Llegá directo a arquitectos, constructoras y clientes finales."
                        imageUrl="https://images.unsplash.com/photo-1574786198875-49f5ed2319ec?w=1200"
                        linkUrl="/contacto"
                        ctaText="Quiero Publicar"
                    />
                </div>
            </div>
        </main>
    );
}
