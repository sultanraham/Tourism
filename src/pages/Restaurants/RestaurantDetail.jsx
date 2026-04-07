import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams, Link } from 'react-router-dom';
import { dataService } from '../../services/data.service';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Utensils, ChevronRight, Heart, Share2, Info, Camera, Flame, ArrowRight } from 'lucide-react';

const RestaurantDetail = () => {
    const { slug } = useParams();

    const { data: restaurant, isLoading, isError } = useQuery({
        queryKey: ['restaurant', slug],
        queryFn: () => dataService.getRestaurantBySlug(slug),
    });

    if (isLoading) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isError || !restaurant) return <Navigate to="/restaurants" replace />;

    // Schema Resilience: Support multiple image formats from Supabase
    const mainImg = restaurant.img || restaurant.image_url;
    const resImages = (restaurant.images && restaurant.images.length > 0) ? restaurant.images : [mainImg, mainImg, mainImg];
    const resSpecialties = restaurant.specialties || (restaurant.must_try ? [restaurant.must_try] : []);

    return (
        <div className="min-h-screen bg-surface">
            {/* Gallery */}
            <div className="pt-24 pb-12 px-6 lg:px-24">
                 <div className="max-w-[1440px] mx-auto">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted mb-8">
                        <Link to="/restaurants" className="hover:text-accent">Restaurants</Link>
                        <ChevronRight size={10} />
                        <span className="text-accent">{restaurant.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[450px]">
                        <div className="md:col-span-2 rounded-3xl overflow-hidden group">
                            <img src={resImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col gap-6 h-full">
                            <div className="h-1/2 rounded-3xl overflow-hidden group">
                                <img src={resImages[1] || resImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                            </div>
                            <div className="h-1/2 rounded-3xl overflow-hidden group relative">
                                <img src={resImages[2] || resImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <span className="flex items-center gap-2 text-white font-heading text-[10px] uppercase tracking-widest"><Camera size={16} /> Gallery</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                             <div>
                                <div className="flex items-center gap-2 mb-4">
                                     <span className="bg-accent/10 text-accent text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-accent/20 flex items-center gap-1"><Flame size={12} className="fill-accent"/> Elite Choice</span>
                                     <span className="bg-white/5 text-text-muted text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-white/5">{restaurant.cuisine}</span>
                                </div>
                                <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-text-primary mb-4">{restaurant.name}</h1>
                                <div className="flex items-center gap-6 text-text-muted">
                                    <div className="flex items-center gap-1 text-accent">
                                        <Star size={16} className="fill-accent" />
                                        <span className="text-lg font-bold text-text-primary ml-1">{restaurant.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={16} className="text-accent" /> {restaurant.location}
                                    </div>
                                </div>
                             </div>

                             <section>
                                <h3 className="font-heading text-xl text-text-primary mb-6 uppercase tracking-widest border-b border-white/5 pb-4">The Atmosphere</h3>
                                <p className="text-text-muted leading-relaxed font-body text-lg italic opacity-80">{restaurant.description}</p>
                             </section>

                             <section>
                                <h3 className="font-heading text-xl text-text-primary mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Signature Specialties</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resSpecialties.map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-surface-2 rounded-2xl border border-white/5 hover:border-accent/40 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                    <Utensils size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">{s}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-text-muted group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                </div>
                             </section>
                        </div>

                        <aside className="space-y-8">
                             <div className="p-8 rounded-3xl bg-surface-2 border border-white/5 sticky top-32 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                         <p className="text-[10px] uppercase tracking-widest text-text-muted font-heading">Timings</p>
                                         <p className="text-sm font-bold text-text-primary flex items-center gap-2"><Clock size={14} className="text-accent"/> {restaurant.timing}</p>
                                    </div>
                                    <div className="text-right">
                                         <p className="text-[10px] uppercase tracking-widest text-text-muted font-heading">Range</p>
                                         <p className="text-sm font-bold text-accent">{restaurant.priceRange}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <button className="btn-accent w-full py-4 text-[10px] uppercase font-bold tracking-widest">Book a Table</button>
                                    <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-text-primary transition-all">View Full Menu</button>
                                </div>
                             </div>
                        </aside>
                    </div>
                 </div>
            </div>
        </div>
    );
}

export default RestaurantDetail;
