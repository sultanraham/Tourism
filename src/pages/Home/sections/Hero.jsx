import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, ArrowDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import img1 from '../../../assets/hero/hunza_valley_hero_1775421507878.png';
import img2 from '../../../assets/hero/skardu_mountains_hero_1775421532625.png';
import img3 from '../../../assets/hero/badshahi_mosque_hero_1775421551697.png';
import img4 from '../../../assets/hero/attabad_lake_hero_1775421576513.png';
import img5 from '../../../assets/hero/deosai_plains_hero_1775421593918.png';

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

    const popularLinks = ['Hunza', 'Skardu', 'Lahore', 'Swat', 'Fairy Meadows'];

    return (
        <section className="relative min-h-[85vh] lg:h-screen w-full flex items-center justify-center py-12 overflow-hidden bg-black">
            
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
                            className="w-full h-full object-cover brightness-[0.45] grayscale-[0.2]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/10 to-surface pointer-events-none"></div>
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

                    {/* Quick Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs font-heading mb-16">
                        <span className="text-text-muted font-bold tracking-widest uppercase opacity-40">Popular:</span>
                        {popularLinks.map((link) => (
                            <button key={link} className="text-text-primary/60 hover:text-accent transition-all border-b border-transparent hover:border-accent pb-0.5">
                                {link}
                            </button>
                        ))}
                    </div>

                    {/* Scroll Indicator (In-flow) */}
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
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
