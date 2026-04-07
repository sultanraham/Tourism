import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Search, Camera, Filter, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../../components/features/ReviewCard';

const MOCK_REVIEWS = [
    {
        id: 1, user: 'Hammad Khalid', rating: 5, location: 'Passu Cones, Hunza', date: '2 Days ago',
        text: 'Viewing the Passu cones at sunset was a spiritual experience. The colors are unlike anything else.',
        img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop',
        user_avatar: 'https://i.pravatar.cc/150?u=hammad',
        hasPhoto: true
    },
    {
        id: 2, user: 'Ayesha Aziz', rating: 4, location: 'Faisal Mosque, Islamabad', date: '1 Week ago',
        text: 'Such peace and architectural beauty. Its a must-visit for anyone coming to the capital.',
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        user_avatar: 'https://i.pravatar.cc/150?u=ayesha',
        hasPhoto: true
    },
    {
        id: 3, user: 'Shahid Afridi', rating: 5, location: 'Gwadar Cricket Stadium', date: '3 Days ago',
        text: 'The most beautiful stadium in the world. Playing here or even visiting is an honor.',
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
        user_avatar: 'https://i.pravatar.cc/150?u=shahid',
        hasPhoto: true
    },
    {
        id: 4, user: 'Zoya Khan', rating: 5, location: 'Deosai Plains', date: 'Just now',
        text: 'Camping in Deosai was cold but the Milky Way was so clear! Pure magic.',
        img: 'https://images.unsplash.com/photo-1520117003251-789319808386?auto=format&fit=crop&q=80&w=1200',
        user_avatar: 'https://i.pravatar.cc/150?u=zoya',
        hasPhoto: true
    },
    {
        id: 5, user: 'Bilal Ahmad', rating: 3, location: 'Food Street, Lahore', date: '1 Month ago',
        text: 'Make sure to haggle with the local transport! Also, trying Siri Paye is a must but maybe not for breakfast if you are new.',
        img: null,
        user_avatar: 'https://i.pravatar.cc/150?u=bilal',
        hasPhoto: false
    },
    {
        id: 6, user: 'Sana Tariq', rating: 5, location: 'Naran Kaghan', date: '2 Weeks ago',
        text: 'Lake Saif ul Malook is pure poetry. Be prepared for a bumpy jeep ride, but it is 100% worth it!',
        img: 'https://images.unsplash.com/photo-1527266324838-89c09647f15d?auto=format&fit=crop&q=80&w=1200',
        user_avatar: 'https://i.pravatar.cc/150?u=sana',
        hasPhoto: true
    }
];

const CommunityPage = () => {
    const [filter, setFilter] = useState('all stories');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReviews = MOCK_REVIEWS.filter(review => {
        // Search Filter
        const matchesSearch = review.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              review.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              review.user.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Category Filter
        let matchesFilter = true;
        if (filter === 'photos') matchesFilter = review.hasPhoto;
        if (filter === 'tips') matchesFilter = !review.hasPhoto;
        if (filter === 'top rated') matchesFilter = review.rating === 5;

        return matchesSearch && matchesFilter;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-surface py-20 px-6 lg:px-24"
        >
            <div className="max-w-[1440px] mx-auto">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
                    <div className="text-center md:text-left">
                        <span className="text-accent font-heading text-[10px] uppercase tracking-[0.4em] mb-4 inline-block">The Voyager Circle</span>
                        <h1 className="font-display text-5xl md:text-7xl text-text-primary leading-tight">Traveler <span className="italic text-accent">Stories</span></h1>
                        <p className="text-text-muted text-sm md:text-base max-w-lg mt-6 font-body opacity-80 mx-auto md:mx-0">
                            Discover authentic experiences and local secrets shared by the global community exploring Pakistan.
                        </p>
                    </div>

                    <button className="btn-accent px-10 py-5 text-[10px] uppercase font-bold tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                        Post Your Story <MessageSquarePlus size={18} />
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-8 border-y border-white/5">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
                        {['All Stories', 'Photos', 'Tips', 'Top Rated'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f.toLowerCase())}
                                className={`whitespace-nowrap px-8 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${filter === f.toLowerCase() ? 'bg-accent text-surface shadow-xl' : 'bg-surface-2 text-text-muted border border-white/5 hover:border-accent'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Find a story..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-2 border border-white/5 rounded-xl py-3.5 pl-12 pr-6 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                        />
                    </div>
                </div>

                {/* Content Masonry Layout */}
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                    {/* Community Stats Sidebar-card (embedded in masonry) */}
                    <div className="bg-gradient-to-br from-primary to-surface-2 p-10 rounded-[2.5rem] border border-accent/20 flex flex-col justify-between min-h-[380px] shadow-2xl break-inside-avoid">
                        <div className="space-y-6">
                            <Sparkles size={32} className="text-accent" />
                            <h3 className="font-heading text-2xl text-text-primary leading-tight">Help Others <br /><span className="italic text-accent">Go Further</span></h3>
                            <p className="text-text-muted text-sm font-body">Share your tips about hidden gems and local etiquette in the northern areas.</p>
                        </div>
                        <Link to="/community" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-primary hover:text-accent transition-colors mt-8">
                            Read Guide <ChevronRight size={14} />
                        </Link>
                    </div>

                    {filteredReviews.length > 0 ? filteredReviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="break-inside-avoid"
                        >
                            <ReviewCard review={review} />
                        </motion.div>
                    )) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-[380px] border border-white/5 rounded-[2.5rem] bg-surface-2/50 break-inside-avoid">
                            <Search className="text-text-muted mb-4" size={32} />
                            <h3 className="text-text-primary font-heading uppercase text-lg tracking-widest mb-2">No Stories Found</h3>
                            <p className="text-text-muted text-sm">Be the first to share an experience matching these criteria!</p>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default CommunityPage;
