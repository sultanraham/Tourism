import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIPlannerCTA = () => {
    return (
        <section className="py-24 bg-surface max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="relative w-full rounded-[3rem] overflow-hidden bg-gradient-to-r from-primary via-primary-light to-accent/20 p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-16 border border-white/5 shadow-[0_32px_64px_-16px_rgba(27,67,50,0.6)]">
                
                {/* BG Glow */}
                <div className="absolute -top-1/2 -left-1/4 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] bg-primary-light/20 blur-[120px] rounded-full"></div>

                {/* Left: Text Content */}
                <div className="relative z-10 max-w-2xl text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-8"
                    >
                         <Sparkles size={14} className="animate-pulse" /> ROAM PK INTELLIGENCE
                    </motion.div>
                    
                    <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-text-primary leading-[1.1] mb-8">
                        Let AI Plan Your <br className="hidden lg:block" />
                        <span className="italic text-accent">Perfect Pakistan Trip</span>
                    </h2>
                    <p className="text-text-primary/70 text-sm md:text-lg font-body mb-12 opacity-80 leading-relaxed">
                        Tell us your vibe. We'll build your itinerary in seconds — <br className="hidden lg:block" />
                        from logistics and transport to the best local food spots.
                    </p>

                    <Link to="/plan" className="btn-primary group py-5 px-10 text-xs font-bold uppercase tracking-[0.2em] bg-accent border-2 border-accent text-surface hover:bg-transparent hover:text-accent flex items-center gap-3 justify-center lg:justify-start w-fit mx-auto lg:mx-0 transition-all">
                        Start Planning Free <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {/* Right: Illustration */}
                <div className="relative z-10 w-full max-w-[400px]">
                    <motion.div
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 5, 0] 
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative"
                    >
                        {/* Fake Itinerary UI card */}
                        <div className="bg-surface-2/40 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 shadow-2xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-surface">
                                    <Target size={24} />
                                </div>
                                <div>
                                    <h4 className="text-text-primary font-heading text-xs uppercase tracking-widest font-bold">7-Day Hunza Adventure</h4>
                                    <p className="text-[10px] text-text-muted mt-1 underline decoration-accent underline-offset-4">Family Style · World-Class Guidance</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {[1, 2, 3].map((day) => (
                                    <div key={day} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary-light flex items-center justify-center text-[10px] text-accent font-bold font-heading">
                                            {day}
                                        </div>
                                        <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden mt-2.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 1.5, delay: day * 0.2 }}
                                                className="h-full bg-accent/40"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex items-center gap-4">
                                <div className="w-full h-8 bg-white/5 rounded-xl animate-pulse"></div>
                                <div className="w-12 h-8 bg-white/5 rounded-xl animate-pulse"></div>
                            </div>
                        </div>

                        {/* Floating Icons */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="absolute -top-10 -right-10 w-24 h-24 border border-accent/20 rounded-full flex items-center justify-center"
                        >
                            <Zap size={24} className="text-accent opacity-40" />
                        </motion.div>
                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -bottom-10 -left-10 w-20 h-20 bg-primary/20 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-center"
                        >
                            <Send size={24} className="text-accent" />
                        </motion.div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default AIPlannerCTA;
