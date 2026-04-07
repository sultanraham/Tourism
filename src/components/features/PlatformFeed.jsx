import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User, MapPin } from 'lucide-react';

const FEED_ITEMS = [
    { id: 1, action: 'New booking in', location: 'Skardu' },
    { id: 2, action: 'Trip explored from', location: 'GB' },
    { id: 3, action: 'Wishlist updated for', location: 'Islamabad' },
    { id: 4, action: 'Itinerary planned in', location: 'KPK' },
];

const PlatformFeed = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % FEED_ITEMS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const item = FEED_ITEMS[index];

    return (
        <div className="bg-surface-3/50 backdrop-blur-md border-b border-white/5 py-3 relative overflow-hidden h-12">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-24 flex items-center justify-center md:items-start md:justify-start">
                
                <div className="flex items-center gap-3">
                    <div className="bg-accent/10 px-2 py-1 rounded-md border border-accent/20 flex items-center gap-2">
                         <TrendingUp size={12} className="text-accent animate-pulse" />
                         <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Live</span>
                    </div>

                    <div className="relative flex-grow h-6 flex items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest text-text-muted font-heading"
                            >
                                <span className="text-text-primary/60">{item.action}</span>
                                <span className="text-accent font-bold">{item.location}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PlatformFeed;
