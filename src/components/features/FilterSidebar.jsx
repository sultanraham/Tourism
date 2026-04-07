import React from 'react';
import { useFilterStore } from '../../stores/filter.store';
import { Search, MapPin, Wind, Sparkles, Star, ChevronDown, RefreshCcw } from 'lucide-react';

const PROVINCES = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK', 'Islamabad'];
const CATEGORIES = ['Mountains', 'Valleys', 'Historical', 'Lakes', 'Beaches', 'Religious', 'Hill Stations', 'National Park'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'Year Round'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Hard'];

const FilterSidebar = () => {
    const { activeFilters, setFilter, toggleFilter, resetFilters } = useFilterStore();

    return (
        <aside className="w-full lg:w-[320px] bg-surface-2 p-8 rounded-3xl border border-white/5 h-fit lg:sticky lg:top-24 shadow-2xl">
            
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-heading text-lg text-text-primary uppercase tracking-widest">Filters</h3>
                <button 
                    onClick={resetFilters}
                    className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-accent transition-all"
                >
                    <RefreshCcw size={12} /> Clear All
                </button>
            </div>

            {/* Search Input */}
            <div className="mb-10 relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent" />
                <input 
                    type="text" 
                    placeholder="Search destinations..."
                    className="w-full bg-surface-3 border border-white/5 rounded-xl px-12 py-3 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    value={activeFilters.searchQuery}
                    onChange={(e) => setFilter('searchQuery', e.target.value)}
                />
            </div>

            <div className="space-y-10">
                
                {/* Provinces */}
                <div>
                    <h4 className="font-heading text-[10px] uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                        <MapPin size={12} className="text-accent" /> Province
                    </h4>
                    <div className="space-y-3">
                        {PROVINCES.map((p) => (
                            <label key={p} className="flex items-center gap-3 group cursor-pointer">
                                <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                                    activeFilters.province.includes(p) ? 'bg-accent border-accent' : 'bg-surface-3 border-white/10 group-hover:border-accent/40'
                                }`}>
                                    {activeFilters.province.includes(p) && <div className="w-2 h-2 bg-surface rounded-full"></div>}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    onChange={() => toggleFilter('province', p)}
                                />
                                <span className={`text-sm tracking-wide ${activeFilters.province.includes(p) ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>
                                    {p}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div>
                   <h4 className="font-heading text-[10px] uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                        <Sparkles size={12} className="text-accent" /> Categories
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c}
                                onClick={() => toggleFilter('category', c)}
                                className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${
                                    activeFilters.category.includes(c) 
                                        ? 'bg-accent text-surface border-accent' 
                                        : 'bg-surface-3 text-text-muted border border-white/5 hover:border-accent hover:text-text-primary'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Season */}
                <div>
                   <h4 className="font-heading text-[10px] uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                        <Wind size={12} className="text-accent" /> Best Season
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {SEASONS.map((s) => (
                            <button
                                key={s}
                                onClick={() => toggleFilter('season', s)}
                                className={`px-4 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest border transition-all ${
                                    activeFilters.season.includes(s) 
                                        ? 'bg-primary/20 border-accent/40 text-accent' 
                                        : 'bg-surface-3 border-white/5 text-text-muted hover:border-white/20'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div>
                   <h4 className="font-heading text-[10px] uppercase tracking-widest text-text-muted mb-6 flex items-center gap-2">
                        <Star size={12} className="text-accent" /> Rating
                    </h4>
                    <div className="space-y-3">
                        {[4.5, 4.0, 3.5, 0].map((r) => (
                            <label key={r} className="flex items-center gap-3 group cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                    activeFilters.minRating === r ? 'bg-accent border-accent' : 'bg-surface-3 border-white/10 group-hover:border-accent/40'
                                }`}>
                                    {activeFilters.minRating === r && <div className="w-2 h-2 bg-surface rounded-full"></div>}
                                </div>
                                <input 
                                    type="radio" 
                                    className="hidden" 
                                    name="rating"
                                    onChange={() => setFilter('minRating', r)}
                                />
                                <span className={`text-sm tracking-wide ${activeFilters.minRating === r ? 'text-text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>
                                    {r === 0 ? 'All Ratings' : `${r}★ & Above`}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>

        </aside>
    );
};

export default FilterSidebar;
