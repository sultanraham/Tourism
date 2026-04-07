import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, SlidersHorizontal, ChevronDown, Coffee, Wifi, ShieldCheck, Star } from 'lucide-react';
import HotelCard from '../../components/features/HotelCard';
import FilterSidebar from '../../components/features/FilterSidebar';
import SkeletonCard from '../../components/common/SkeletonCard';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/data.service';
import { useFilterStore } from '../../stores/filter.store';

const HotelsPage = () => {
    const { activeFilters } = useFilterStore();

    const { data: PLACES = [] } = useQuery({
        queryKey: ['destinations'],
        queryFn: () => dataService.getDestinations(),
    });

    const { data: HOTELS_DATA = [], isLoading } = useQuery({
        queryKey: ['hotels'],
        queryFn: () => dataService.getHotels(),
    });

    const filteredHotels = React.useMemo(() => {
        return HOTELS_DATA.filter(hotel => {
            const dest = PLACES.find(p => p.slug === hotel.destination_slug) || {};
            const hotelProvince = dest.province || '';
            const hotelCategory = dest.category || '';

            const matchesSearch = hotel.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()) || 
                                hotel.location.toLowerCase().includes(activeFilters.searchQuery.toLowerCase());
            const hRating = hotel.rating || hotel.stars || 0;
            const matchesRating = hRating >= activeFilters.minRating;
            
            const matchesProvince = activeFilters.province.length === 0 || activeFilters.province.includes(hotelProvince);
            const matchesCategory = activeFilters.category.length === 0 || activeFilters.category.includes(hotelCategory);

            return matchesSearch && matchesRating && matchesProvince && matchesCategory;
        });
    }, [HOTELS_DATA, PLACES, activeFilters]);

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
                            <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Luxury Stays</span>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
                                Elite <span className="italic text-accent">Accommodations</span>
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm md:text-base max-w-sm font-body opacity-80">
                            From heritage forts to modern resorts, stay in Pakistan's finest locations.
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
                                Found <span className="text-text-primary font-bold">{filteredHotels.length}</span> luxury stays
                             </div>
                             <div className="relative group min-w-[160px]">
                                <select className="appearance-none w-full bg-surface-2 border border-white/5 rounded-xl px-4 py-2.5 text-[10px] uppercase font-bold tracking-widest text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all cursor-pointer">
                                    <option>Most Recommended</option>
                                    <option>Rating: High to Low</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-hover:text-accent transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {isLoading ? (
                                [...Array(3)].map((_, idx) => <SkeletonCard key={idx} />)
                            ) : filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel, idx) => (
                                    <motion.div
                                        key={hotel.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <HotelCard hotel={hotel} />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-50">
                                        <Building size={24} className="text-accent" />
                                    </div>
                                    <h3 className="font-heading text-lg text-text-primary uppercase tracking-widest">No Hotels Found</h3>
                                    <p className="text-text-muted max-w-xs mx-auto text-xs">Try different filters or a broader search query.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HotelsPage;
