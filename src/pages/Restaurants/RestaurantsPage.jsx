import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, SlidersHorizontal, ChevronDown } from 'lucide-react';
import RestaurantCard from '../../components/features/RestaurantCard';
import FilterSidebar from '../../components/features/FilterSidebar';
import SkeletonCard from '../../components/common/SkeletonCard';

import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/data.service';
import { useFilterStore } from '../../stores/filter.store';

const RestaurantsPage = () => {
    const { activeFilters } = useFilterStore();

    const { data: PLACES = [] } = useQuery({
        queryKey: ['destinations'],
        queryFn: () => dataService.getDestinations(),
    });

    const { data: RESTAURANTS_DATA = [], isLoading } = useQuery({
        queryKey: ['restaurants'],
        queryFn: () => dataService.getRestaurants(),
    });

    const filteredRestaurants = React.useMemo(() => {
        return RESTAURANTS_DATA.filter(res => {
            const dest = PLACES.find(p => p.slug === res.destination_slug) || {};
            const resProvince = dest.province || '';
            const resCategory = dest.category || '';

            const matchesSearch = res.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()) || 
                                res.location.toLowerCase().includes(activeFilters.searchQuery.toLowerCase());
            const matchesRating = (res.rating || 0) >= activeFilters.minRating;
            
            const matchesProvince = activeFilters.province.length === 0 || activeFilters.province.includes(resProvince);
            const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(resCategory);

            return matchesSearch && matchesRating && matchesProvince && matchesCategory;
        });
    }, [RESTAURANTS_DATA, PLACES, activeFilters]);

    return (
        <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1440px] mx-auto">
                
                <div className="mb-12">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Culinary Delights</span>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
                                Taste the <span className="italic text-accent">Heritage</span>
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm md:text-base max-w-sm font-body opacity-80">
                            Explore the vibrant food scenes of Pakistan, from seaside dining to historic street stalls.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="hidden lg:block w-[320px]">
                         <FilterSidebar />
                    </div>

                    <div className="flex-grow">
                        <div className="flex items-center justify-between mb-8">
                             <div className="text-[10px] uppercase tracking-widest text-text-muted font-heading">
                                Showing <span className="text-text-primary font-bold">{filteredRestaurants.length}</span> legendary eateries
                             </div>
                             <div className="relative group min-w-[160px]">
                                <select className="appearance-none w-full bg-surface-2 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer">
                                    <option>Highest Rated</option>
                                    <option>Region: North to South</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-accent transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {isLoading ? (
                                [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
                            ) : filteredRestaurants.length > 0 ? (
                                filteredRestaurants.map((res, idx) => (
                                    <motion.div
                                        key={res.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <RestaurantCard restaurant={res} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-50">
                                        <Utensils size={24} className="text-accent" />
                                    </div>
                                    <h3 className="font-heading text-lg text-text-primary uppercase tracking-widest">No Results</h3>
                                    <p className="text-text-muted max-w-xs mx-auto text-xs">Try different filters or search keywords.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RestaurantsPage;
