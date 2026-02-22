'use client';

import { usePropertyStore } from '@/store/propertyStore';
import { Search, X } from 'lucide-react';
import CustomSelect from './CustomSelect';

const operationOptions = [
    { value: '', label: 'Todas las operaciones' },
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' },
];

const priceRanges = [
    { min: 0, max: 0, label: 'Cualquier precio' },
    { min: 0, max: 100000, label: 'Hasta $100,000' },
    { min: 100000, max: 250000, label: '$100,000 - $250,000' },
    { min: 250000, max: 500000, label: '$250,000 - $500,000' },
    { min: 500000, max: 1000000, label: '$500,000 - $1,000,000' },
    { min: 1000000, max: 0, label: 'Más de $1,000,000' },
];

export default function PropertyFilters() {
    const { filters, setFilters, resetFilters, propertyTypes, filteredProperties } = usePropertyStore();

    const hasActiveFilters = filters.operation || filters.type || filters.minPrice > 0 || filters.maxPrice > 0;

    const handlePriceChange = (rangeIndex: number) => {
        const range = priceRanges[rangeIndex];
        setFilters({ minPrice: range.min, maxPrice: range.max });
    };

    const getCurrentPriceRangeIndex = () => {
        return priceRanges.findIndex(
            range => range.min === filters.minPrice && range.max === filters.maxPrice
        );
    };

    return (
        <div className="p-6 bg-white rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]"
                    >
                        <Search className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-[var(--text-main)] font-bold text-lg">Filtros</h3>
                        <p className="text-sm text-[var(--text-secondary)] font-medium">{filteredProperties.length} resultados</p>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-blue)] transition-colors rounded-lg hover:bg-gray-50"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="space-y-8">
                {/* Operation */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">
                        Tipo de operación
                    </label>
                    <div className="space-y-2">
                        {operationOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilters({ operation: option.value })}
                                className={`w-full px-4 py-3 text-left text-sm rounded-xl transition-all duration-200 border font-medium ${filters.operation === option.value
                                    ? 'bg-[var(--primary-blue)]/5 border-[var(--primary-blue)] text-[var(--primary-blue)]'
                                    : 'bg-white border-gray-100 text-[var(--text-secondary)] hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Type */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">
                        Tipo de propiedad
                    </label>
                    <CustomSelect
                        value={filters.type}
                        onChange={(value) => setFilters({ type: value })}
                        options={[
                            { value: '', label: 'Todos los tipos' },
                            ...propertyTypes.map(type => ({
                                value: type,
                                label: type.charAt(0).toUpperCase() + type.slice(1)
                            }))
                        ]}
                        placeholder="Todos los tipos"
                    />
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">
                        Rango de precio
                    </label>
                    <CustomSelect
                        value={getCurrentPriceRangeIndex().toString()}
                        onChange={(value) => handlePriceChange(parseInt(value))}
                        options={priceRanges.map((range, index) => ({
                            value: index.toString(),
                            label: range.label
                        }))}
                        placeholder="Cualquier precio"
                    />
                </div>

                {/* Custom Price Range */}
                <div>
                    <label className="block text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">
                        Rango personalizado
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Mín"
                                value={filters.minPrice || ''}
                                onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 outline-none transition-all placeholder-gray-400 text-sm"
                            />
                        </div>
                        <div className="flex items-center text-gray-400 font-medium">—</div>
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Máx"
                                value={filters.maxPrice || ''}
                                onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-[var(--text-main)] focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/10 outline-none transition-all placeholder-gray-400 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm text-[var(--text-secondary)] mb-3 font-medium">Filtros activos:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.operation && (
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide"
                                style={{
                                    background: 'var(--primary-blue)',
                                    color: 'white',
                                }}
                            >
                                {filters.operation}
                                <button
                                    onClick={() => setFilters({ operation: '' })}
                                    className="ml-1 hover:text-white/80"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.type && (
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide"
                                style={{
                                    background: 'var(--status-rent)',
                                    color: 'white',
                                }}
                            >
                                {filters.type}
                                <button
                                    onClick={() => setFilters({ type: '' })}
                                    className="ml-1 hover:text-white/80"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
