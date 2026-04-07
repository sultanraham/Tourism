import { create } from 'zustand';

const initialFilters = {
  province: [],
  category: [],
  season: [],
  difficulty: [],
  budgetRange: [0, 50000],
  minRating: 0,
  searchQuery: '',
  sortBy: 'popular',
};

export const useFilterStore = create((set) => ({
  activeFilters: { ...initialFilters },

  setFilter: (key, value) => 
    set((state) => ({ 
      activeFilters: { ...state.activeFilters, [key]: value } 
    })),

  toggleFilter: (key, value) => 
    set((state) => {
      const current = state.activeFilters[key];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { activeFilters: { ...state.activeFilters, [key]: updated } };
    }),

  resetFilters: () => set({ activeFilters: { ...initialFilters } }),

  setSearchQuery: (query) => set((state) => ({ activeFilters: { ...state.activeFilters, searchQuery: query } })),
  setSortBy: (sort) => set((state) => ({ activeFilters: { ...state.activeFilters, sortBy: sort } })),
}));
