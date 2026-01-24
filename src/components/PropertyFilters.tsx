'use client';

import { usePropertyStore } from '@/store/propertyStore';
import { Search, X } from 'lucide-react';

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
        <div
            className="h-full p-6 overflow-y-auto"
            style={{
                background: 'rgba(15, 20, 25, 0.95)',
                backdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                    >
                        <Search className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Filtros</h3>
                        <p className="text-sm text-neutral-400">{filteredProperties.length} resultados</p>
                    </div>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-400 hover:text-[#10b981] transition-colors rounded-lg hover:bg-white/5"
                    >
                        <X className="w-4 h-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="space-y-6">
                {/* Operation */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Tipo de operación
                    </label>
                    <div className="space-y-2">
                        {operationOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setFilters({ operation: option.value })}
                                className={`w-full px-4 py-3 text-left text-sm rounded-xl transition-all duration-200 ${filters.operation === option.value
                                    ? 'bg-gradient-to-r from-[#10b981]/20 to-[#059669]/20 text-[#10b981] border border-[#10b981]/30'
                                    : 'bg-white/5 text-neutral-300 border border-transparent hover:bg-white/10'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Property Type */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Tipo de propiedad
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ type: e.target.value })}
                        className="input-glass w-full"
                    >
                        <option value="">Todos los tipos</option>
                        {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                        Rango de precio
                    </label>
                    <select
                        value={getCurrentPriceRangeIndex()}
                        onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                        className="input-glass w-full"
                    >
                        {priceRanges.map((range, index) => (
                            <option key={index} value={index}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Custom Price Range */}
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-3">
                        O ingresa un rango personalizado
                    </label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Mín"
                                value={filters.minPrice || ''}
                                onChange={(e) => setFilters({ minPrice: parseInt(e.target.value) || 0 })}
                                className="input-glass w-full text-sm"
                            />
                        </div>
                        <div className="flex items-center text-neutral-500">—</div>
                        <div className="flex-1">
                            <input
                                type="number"
                                placeholder="Máx"
                                value={filters.maxPrice || ''}
                                onChange={(e) => setFilters({ maxPrice: parseInt(e.target.value) || 0 })}
                                className="input-glass w-full text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-neutral-400 mb-3">Filtros activos:</p>
                    <div className="flex flex-wrap gap-2">
                        {filters.operation && (
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                                style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10b981',
                                    border: '1px solid rgba(16, 185, 129, 0.2)',
                                }}
                            >
                                {filters.operation}
                                <button
                                    onClick={() => setFilters({ operation: '' })}
                                    className="ml-1 hover:text-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {filters.type && (
                            <span
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    color: '#6366f1',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                }}
                            >
                                {filters.type}
                                <button
                                    onClick={() => setFilters({ type: '' })}
                                    className="ml-1 hover:text-white"
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
