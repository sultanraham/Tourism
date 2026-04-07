import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, SlidersHorizontal, ChevronDown, MapPin, Search } from 'lucide-react';
import FilterSidebar from '../../components/features/FilterSidebar';
import DestinationCard from '../../components/features/DestinationCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useFilterStore } from '../../stores/filter.store';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/data.service';

const DestinationsPage = () => {
    const [searchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const { activeFilters } = useFilterStore();

    const { data: PLACES = [], isLoading } = useQuery({
        queryKey: ['destinations'],
        queryFn: () => dataService.getDestinations(),
    });

    // MEMOIZED FILTERING — Prevents infinite loops and improves performance
    const filteredDestinations = React.useMemo(() => {
        return PLACES.filter(dest => {
            const matchesSearch = dest.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()) || 
                                (dest.description && dest.description.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()));
            const matchesProvince = activeFilters.province.length === 0 || activeFilters.province.includes(dest.province);
            const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(dest.category);
            
            const destSeason = (dest.best_season || '').replace('_',' ');
            const matchesSeason = activeFilters.season.length === 0 || activeFilters.season.includes(destSeason);
            
            const matchesRating = (dest.rating_avg || 0) >= activeFilters.minRating;
            
            return matchesSearch && matchesProvince && matchesCategory && matchesSeason && matchesRating;
        });
    }, [PLACES, activeFilters]);

    useEffect(() => {
        const filterType = searchParams.get('filter');
        if (filterType === 'provinces' || filterType === 'categories') {
            setIsFiltersVisible(true);
            setTimeout(() => {
                const element = document.getElementById('filter-sidebar');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [searchParams]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-12"
        >
            <div className="max-w-[1440px] mx-auto">
                
                {/* Header Section */}
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Explore Pakistan</span>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
                                Find Your <span className="italic text-accent">Next Adventure</span>
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm md:text-base max-w-sm font-body opacity-80">
                            Discover {filteredDestinations.length}+ destinations across the majestic landscapes of Pakistan.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar */}
                    <div id="filter-sidebar" className="lg:block hidden">
                        <FilterSidebar />
                    </div>

                    {/* Mobile Filters Toggle */}
                    <div className="lg:hidden flex items-center justify-between p-4 bg-surface-2 border border-white/5 rounded-2xl mb-4">
                        <button 
                            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                            className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-primary"
                        >
                            <SlidersHorizontal size={14} className="text-accent" /> {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isFiltersVisible && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="lg:hidden overflow-hidden mb-8"
                            >
                                <FilterSidebar />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        
                        {/* Control Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                             <div className="text-[10px] uppercase tracking-widest text-text-muted font-heading">
                                Showing <span className="text-text-primary font-bold">{filteredDestinations.length}</span> destinations
                             </div>
                             
                             <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center bg-surface-2 p-1 rounded-xl border border-white/5">
                                    <button 
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'}`}
                                    >
                                        <LayoutGrid size={16} />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'}`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                                <div className="relative group min-w-[160px]">
                                    <select className="appearance-none w-full bg-surface-2 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer">
                                        <option>Most Popular</option>
                                        <option>Rating: High to Low</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-accent transition-all" />
                                </div>
                             </div>
                        </div>

                        {/* Results Grid */}
                        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                            {isLoading ? (
                                [...Array(6)].map((_, idx) => <SkeletonCard key={idx} />)
                            ) : filteredDestinations.length > 0 ? (
                                filteredDestinations.map((dest, idx) => (
                                    <motion.div
                                        key={dest.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <DestinationCard destination={dest} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-50">
                                        <Search size={24} className="text-accent" />
                                    </div>
                                    <h3 className="font-heading text-lg text-text-primary uppercase tracking-widest">No Results</h3>
                                    <p className="text-text-muted max-w-xs mx-auto text-xs">Try adjusting your filters to find more adventures.</p>
                                </div>
                            )}
                        </div>

                        {/* Load More Trigger */}
                        {!isLoading && (
                            <div className="mt-16 text-center">
                                <button className="btn-accent px-10 py-4 text-[10px] uppercase font-bold tracking-widest group">
                                    Load More <span className="inline-block transition-transform group-hover:rotate-180 duration-500 ml-2">↻</span>
                                </button>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </motion.div>
    );
};

export default DestinationsPage;
