import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Coffee, Wifi, ShieldCheck, ChevronRight, Heart, Share2, Info, Camera, Compass } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/data.service';

const HotelDetail = () => {
    const { slug } = useParams();

    const { data: hotel, isLoading, isError } = useQuery({
        queryKey: ['hotel', slug],
        queryFn: () => dataService.getHotelBySlug(slug),
    });

    if (isLoading) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-b-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (isError || !hotel) return <Navigate to="/hotels" replace />;

    const displayAmenities = (hotel.amenities || []).map(label => {
        if (label.includes('Wifi')) return { icon: <Wifi />, label };
        if (label.includes('Breakfast')) return { icon: <Coffee />, label };
        if (label.includes('Security')) return { icon: <ShieldCheck />, label };
        return { icon: <Compass />, label };
    });
    
    // Schema Resilience: Support multiple image formats from Supabase
    const mainImg = hotel.img || hotel.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop';
    const hotelImages = (hotel.images && hotel.images.length > 0) ? hotel.images : [mainImg, mainImg, mainImg];

    return (
        <div className="min-h-screen bg-surface">
            {/* Gallery */}
            <div className="pt-24 pb-12 px-6 lg:px-24">
                 <div className="max-w-[1440px] mx-auto">
                    <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted mb-8">
                        <Link to="/hotels" className="hover:text-accent">Hotels</Link>
                        <ChevronRight size={10} />
                        <span className="text-accent">{hotel.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
                        <div className="md:col-span-2 rounded-3xl overflow-hidden group relative">
                            <img src={hotelImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                            <div className="absolute top-6 right-6 flex gap-3">
                                <button className="p-3 bg-surface/40 backdrop-blur-md rounded-full text-white hover:bg-surface/80 transition-all"><Heart size={18} /></button>
                                <button className="p-3 bg-surface/40 backdrop-blur-md rounded-full text-white hover:bg-surface/80 transition-all"><Share2 size={18} /></button>
                            </div>
                        </div>
                        <div className="md:col-span-1 rounded-3xl overflow-hidden group">
                           <img src={hotelImages[1] || hotelImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                        </div>
                        <div className="md:col-span-1 rounded-3xl overflow-hidden group relative">
                           <img src={hotelImages[2] || hotelImages[0]} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                <span className="flex items-center gap-2 text-white font-heading text-[10px] uppercase tracking-widest"><Camera size={16} /> View All Photos</span>
                           </div>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                             <div>
                                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary mb-4">{hotel.name}</h1>
                                <div className="flex items-center gap-4 text-text-muted">
                                    <div className="flex items-center gap-1 text-accent">
                                        <Star size={16} className="fill-accent" />
                                        <span className="text-lg font-bold text-text-primary ml-1">{hotel.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={16} className="text-accent" /> {hotel.location}
                                    </div>
                                </div>
                             </div>

                             <section>
                                <h3 className="font-heading text-xl text-text-primary mb-6 uppercase tracking-widest border-b border-white/5 pb-4">The Experience</h3>
                                <p className="text-text-muted leading-relaxed font-body text-lg italic opacity-80">{hotel.description}</p>
                             </section>

                             <section>
                                <h3 className="font-heading text-xl text-text-primary mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Top Amenities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {displayAmenities.map((a, i) => (
                                        <div key={i} className="flex flex-col gap-4 p-8 bg-surface-2 rounded-2xl border border-white/5 text-center items-center group hover:border-accent/40 transition-all">
                                            <div className="text-accent group-hover:scale-110 transition-transform">
                                                {React.cloneElement(a.icon, { size: 32 })}
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted group-hover:text-text-primary transition-colors">{a.label}</span>
                                        </div>
                                    ))}
                                </div>
                             </section>
                        </div>

                        <aside>
                             <div className="p-8 rounded-3xl bg-surface-2 border border-white/5 sticky top-32 space-y-8">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2 font-heading">Reservation Status</p>
                                    <p className="text-4xl font-bold text-accent uppercase tracking-tighter">Elite Stay</p>
                                    <p className="text-[10px] text-text-muted italic mt-2">Verified Luxury Collection</p>
                                </div>
                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <button className="btn-primary w-full py-4 text-[10px] uppercase font-bold tracking-widest">Reserve Your Stay</button>
                                    <p className="text-center text-[9px] uppercase tracking-widest text-text-muted opacity-60">Verified Luxury Property</p>
                                </div>
                             </div>
                        </aside>
                    </div>
                 </div>
            </div>
        </div>
    );
}

export default HotelDetail;
