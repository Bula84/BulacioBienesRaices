'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getPropertyTypes } from '@/lib/supabase';

const OPERACIONES = [
    { v: 'venta', l: 'Comprar' },
    { v: 'alquiler', l: 'Alquilar' },
];

const PRESUPUESTOS: Record<string, { v: string; l: string }[]> = {
    venta: [
        { v: '', l: 'Cualquier precio' },
        { v: '50000', l: 'Hasta USD 50.000' },
        { v: '100000', l: 'Hasta USD 100.000' },
        { v: '150000', l: 'Hasta USD 150.000' },
        { v: '250000', l: 'Hasta USD 250.000' },
        { v: '400000', l: 'Hasta USD 400.000' },
        { v: '750000', l: 'Hasta USD 750.000' },
        { v: '1500000', l: 'Hasta USD 1.500.000' },
    ],
    alquiler: [
        { v: '', l: 'Cualquier precio' },
        { v: '300', l: 'Hasta USD 300' },
        { v: '500', l: 'Hasta USD 500' },
        { v: '800', l: 'Hasta USD 800' },
        { v: '1200', l: 'Hasta USD 1.200' },
        { v: '2000', l: 'Hasta USD 2.000' },
        { v: '3500', l: 'Hasta USD 3.500' },
    ],
};

/**
 * Buscador de propiedades para la portada.
 *
 * Sigue el patrón de los portales de mayor tráfico (ZonaProp, Properati,
 * ArgenProp): el buscador es el elemento principal del hero, no un carrusel.
 * Navega a `/propiedades` con querystring, que es lo que la página de
 * resultados interpreta para pre-cargar los filtros.
 */
export default function PropertySearchBar() {
    const router = useRouter();
    const [operation, setOperation] = useState('venta');
    const [type, setType] = useState('');
    // Un presupuesto por operación: una venta no se mide igual que un alquiler.
    const [presupuesto, setPresupuesto] = useState<Record<string, string>>({
        venta: '',
        alquiler: '',
    });
    const [tipos, setTipos] = useState<string[]>([]);

    useEffect(() => {
        let activo = true;
        getPropertyTypes().then((t) => {
            if (activo && t.length > 0) setTipos(t);
        });
        return () => {
            activo = false;
        };
    }, []);

    const maxPrice = presupuesto[operation] ?? '';

    const buscar = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (operation) params.set('operation', operation);
        if (type) params.set('type', type);
        if (maxPrice) params.set('maxPrice', maxPrice);
        const qs = params.toString();
        router.push(`/propiedades${qs ? `?${qs}` : ''}`);
    };

    const selectClass =
        'w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-[0.9375rem] font-semibold focus:outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[#f3ead9] transition-all appearance-none cursor-pointer';

    return (
        <form
            onSubmit={buscar}
            className="w-full max-w-4xl mx-auto bg-white rounded-2xl md:rounded-full shadow-xl shadow-slate-900/10 border border-slate-100 p-3 md:p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2.5"
        >
            {/* Operación — segmentado */}
            <div className="flex rounded-xl bg-slate-100 p-1 md:flex-shrink-0">
                {OPERACIONES.map((o) => (
                    <button
                        key={o.v}
                        type="button"
                        onClick={() => setOperation(o.v)}
                        className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            operation === o.v
                                ? 'bg-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                        style={operation === o.v ? { color: 'var(--accent-dark)' } : undefined}
                    >
                        {o.l}
                    </button>
                ))}
            </div>

            <div className="hidden md:block w-px h-8 bg-slate-200 flex-shrink-0" />

            {/* Tipo */}
            <div className="flex-1 min-w-0">
                <label htmlFor="hero-type" className="sr-only">
                    Tipo de propiedad
                </label>
                <select
                    id="hero-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Tipo de propiedad</option>
                    {tipos.map((t) => (
                        <option key={t} value={t}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Presupuesto */}
            <div className="flex-1 min-w-0">
                <label htmlFor="hero-price" className="sr-only">
                    Presupuesto
                </label>
                <select
                    id="hero-price"
                    value={maxPrice}
                    onChange={(e) =>
                        setPresupuesto((prev) => ({ ...prev, [operation]: e.target.value }))
                    }
                    className={selectClass}
                >
                    {PRESUPUESTOS[operation].map((p) => (
                        <option key={p.v} value={p.v}>
                            {p.l}
                        </option>
                    ))}
                </select>
            </div>

            {/* Buscar */}
            <button
                type="submit"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl md:rounded-full font-bold text-white text-[0.9375rem] transition-all hover:scale-105 shadow-lg flex-shrink-0"
                style={{ background: 'var(--primary-blue)', boxShadow: '0 8px 20px rgba(11, 31, 58, 0.3)' }}
            >
                <Search className="w-5 h-5" />
                Buscar
                <SlidersHorizontal className="w-4 h-4 opacity-60" />
            </button>
        </form>
    );
}
