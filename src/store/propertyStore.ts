import { create } from 'zustand';
import { Propiedad, getPropiedades } from '@/lib/supabase';

interface PropertyFilters {
    operation: string;
    type: string;
    minPrice: number;
    maxPrice: number;
}

interface PropertyStore {
    // State
    properties: Propiedad[];
    filteredProperties: Propiedad[];
    isLoading: boolean;
    error: string | null;
    hoveredPropertyId: string | null;
    selectedPropertyId: string | null;
    filters: PropertyFilters;
    propertyTypes: string[];

    // Actions
    fetchProperties: () => Promise<void>;
    setFilters: (filters: Partial<PropertyFilters>) => void;
    resetFilters: () => void;
    setHoveredProperty: (id: string | null) => void;
    setSelectedProperty: (id: string | null) => void;
    applyFilters: () => void;
}

const defaultFilters: PropertyFilters = {
    operation: '',
    type: '',
    minPrice: 0,
    maxPrice: 0,
};

export const usePropertyStore = create<PropertyStore>((set, get) => ({
    properties: [],
    filteredProperties: [],
    isLoading: false,
    error: null,
    hoveredPropertyId: null,
    selectedPropertyId: null,
    filters: defaultFilters,
    propertyTypes: [],

    fetchProperties: async () => {
        set({ isLoading: true, error: null });

        try {
            const properties = await getPropiedades();

            // Extract unique property types
            const types = [...new Set(properties.map(p => p.type))].filter(Boolean);

            set({
                properties,
                filteredProperties: properties,
                propertyTypes: types,
                isLoading: false
            });
        } catch (error) {
            set({
                error: 'Error al cargar propiedades',
                isLoading: false
            });
        }
    },

    setFilters: (newFilters) => {
        const currentFilters = get().filters;
        const updatedFilters = { ...currentFilters, ...newFilters };
        set({ filters: updatedFilters });
        get().applyFilters();
    },

    resetFilters: () => {
        set({ filters: defaultFilters });
        const { properties } = get();
        set({ filteredProperties: properties });
    },

    setHoveredProperty: (id) => {
        set({ hoveredPropertyId: id });
    },

    setSelectedProperty: (id) => {
        set({ selectedPropertyId: id });
    },

    applyFilters: () => {
        const { properties, filters } = get();

        let filtered = [...properties];

        if (filters.operation) {
            filtered = filtered.filter(p => p.operation === filters.operation);
        }

        if (filters.type) {
            filtered = filtered.filter(p => p.type === filters.type);
        }

        if (filters.minPrice > 0) {
            filtered = filtered.filter(p => p.price >= filters.minPrice);
        }

        if (filters.maxPrice > 0) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice);
        }

        set({ filteredProperties: filtered });
    },
}));

// Additional store for UI state
interface UIStore {
    isMobileMenuOpen: boolean;
    isMapExpanded: boolean;
    activeModal: string | null;

    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
    toggleMapExpanded: () => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isMobileMenuOpen: false,
    isMapExpanded: false,
    activeModal: null,

    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
    toggleMapExpanded: () => set((state) => ({ isMapExpanded: !state.isMapExpanded })),
    openModal: (modalId) => set({ activeModal: modalId }),
    closeModal: () => set({ activeModal: null }),
}));
