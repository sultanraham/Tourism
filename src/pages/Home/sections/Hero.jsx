import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, ArrowDown, Sparkles } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import img1 from '../../../assets/hero/hunza_valley_hero_1775421507878.png';
import img2 from '../../../assets/hero/skardu_mountains_hero_1775421532625.png';
import img3 from '../../../assets/hero/badshahi_mosque_hero_1775421551697.png';
import img4 from '../../../assets/hero/attabad_lake_hero_1775421576513.png';
import img5 from '../../../assets/hero/deosai_plains_hero_1775421593918.png';

import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '../../../stores/filter.store';
import useChatStore from '../../../stores/chat.store';

const images = [
    { url: img1, title: 'Hunza Valley' },
    { url: img2, title: 'Skardu Mountains' },
    { url: img3, title: 'Badshahi Mosque' },
    { url: img4, title: 'Attabad Lake' },
    { url: img5, title: 'Deosai Plains' },
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [destCount, setDestCount] = useState(220);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const setSearchQuery = useFilterStore(state => state.setSearchQuery);
    const { toggleChat, sendMessage } = useChatStore();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 8000); // 8 seconds per slide for a cinematic feel
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const { count, error } = await supabase
                    .from('destinations')
                    .select('*', { count: 'exact', head: true });
                if (!error && count) setDestCount(count);
            } catch (err) {
                console.error("Counter fetch failed", err);
            }
        };
        fetchCount();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setSearchQuery(searchTerm);
            navigate('/destinations');
        }
    };

    const handleAskAI = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            toggleChat(true);
            sendMessage(searchTerm);
            setSearchTerm('');
        }
    };

    const popularLinks = ['Hunza', 'Skardu', 'Lahore', 'Swat', 'Fairy Meadows'];

    return (
        <section className="relative min-h-[90vh] lg:h-screen w-full flex items-center justify-center py-20 overflow-hidden bg-black">
            
            {/* Background Cinematic Slideshow */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                        className="absolute inset-0 overflow-hidden"
                    >
                        <motion.img 
                            key={images[currentIndex].url}
                            src={images[currentIndex].url} 
                            alt={images[currentIndex].title} 
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.15 }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="w-full h-full object-cover brightness-[0.55] grayscale-[0.1]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/20 to-surface pointer-events-none"></div>
                        <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <span className="px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-8 inline-block backdrop-blur-md">
                        ✦ Discover Pakistan's Hidden Gems
                    </span>
                    
                    <h1 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] md:leading-[1.1] mb-8 max-w-4xl uppercase tracking-tight">
                        <span className="block">Where Every Journey</span>
                        <span className="block italic text-accent">Tells a Story</span>
                    </h1>
                    
                    <p className="text-text-muted text-sm md:text-lg font-body max-w-2xl mb-12 opacity-80">
                        Explore {destCount}+ breathtaking destinations across Pakistan — <br className="hidden md:block" />
                        from the rooftop of the world to ancient civilizations.
                    </p>

                    {/* Elite Search Bar */}
                    <form 
                        className="w-full max-w-3xl mb-12 relative group"
                    >
                        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center bg-surface-2/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-2 group-focus-within:border-accent/40 group-focus-within:bg-surface-2/60 transition-all duration-500 shadow-2xl">
                            <div className="flex-grow flex items-center px-6">
                                <Search className="text-accent shrink-0 opacity-50 group-focus-within:opacity-100 transition-opacity" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Where to explore? (or Ask AI for a plan)" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none px-4 py-5 text-text-primary placeholder:text-text-muted/40 font-body text-base"
                                />
                                <Sparkles size={18} className="text-accent/30 group-focus-within:text-accent animate-pulse shrink-0" />
                            </div>
                            
                            <div className="flex items-center gap-2 pr-1">
                                <button 
                                    type="button"
                                    onClick={handleSearch}
                                    className="hidden sm:flex bg-white/5 hover:bg-white/10 text-text-primary px-6 py-4 rounded-2xl font-heading text-[10px] uppercase font-bold tracking-widest transition-all border border-white/5"
                                >
                                    Search
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleAskAI}
                                    className="bg-accent text-surface px-8 py-4 rounded-2xl font-heading text-[10px] uppercase font-black tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center gap-2 group/ai"
                                >
                                    <Sparkles size={14} className="group-hover/ai:rotate-12 transition-transform" />
                                    Ask AI
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs font-heading mb-16">
                        <span className="text-text-muted font-bold tracking-widest uppercase opacity-40">Popular:</span>
                        {popularLinks.map((link) => (
                            <button 
                                key={link} 
                                onClick={() => { setSearchQuery(link); navigate('/destinations'); }}
                                className="text-text-primary/60 hover:text-accent transition-all border-b border-transparent hover:border-accent pb-0.5"
                            >
                                {link}
                            </button>
                        ))}
                    </div>

                    {/* Scroll Indicator (In-flow) */}
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                        onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                    >
                        <span className="text-[10px] uppercase tracking-[0.3em] font-heading text-text-muted">Explore Down</span>
                        <ArrowDown size={20} className="text-accent" />
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
