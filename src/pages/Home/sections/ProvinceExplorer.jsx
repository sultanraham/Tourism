import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Local Assets for Reliability
import punjabImg from '../../../assets/hero/badshahi_mosque_hero_1775421551697.png';
import kpkImg from '../../../assets/hero/skardu_mountains_hero_1775421532625.png';
import gbImg from '../../../assets/hero/hunza_valley_hero_1775421507878.png';
import ajkImg from '../../../assets/hero/deosai_plains_hero_1775421593918.png';
import sindhImg from '../../../assets/hero/sindh_ruins.png';
import balochistanImg from '../../../assets/hero/balochistan_coastal.png';

const PROVINCES = [
  { 
    name: 'Punjab', 
    count: 85, 
    img: punjabImg, 
    top: 'Badshahi Mosque, Lahore Fort, Minar-e-Pakistan, Shalimar Gardens' 
  },
  { 
    name: 'Sindh', 
    count: 42, 
    img: sindhImg, 
    top: 'Mohenjo-daro, Gorakh Hill, Clifton Beach, Shah Jahan Mosque' 
  },
  { 
    name: 'KPK', 
    count: 64, 
    img: kpkImg, 
    top: 'Swat Valley, Kumrat, Kalam, Chitral' 
  },
  { 
    name: 'Balochistan', 
    count: 28, 
    img: balochistanImg, 
    top: 'Kund Malir, Princess of Hope, Quetta, Ziarat' 
  },
  { 
    name: 'Gilgit-Baltistan', 
    count: 52, 
    img: gbImg, 
    top: 'Hunza, Attabad Lake, Skardu, Fairy Meadows' 
  },
  { 
    name: 'AJK', 
    count: 19, 
    img: ajkImg, 
    top: 'Neelum Valley, Banjosa Lake, Rawalakot, Pir Chinasi' 
  },
];

const ProvinceExplorer = () => {
    return (
        <section className="py-24 bg-surface">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
                    <div className="max-w-xl">
                        <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Regional Gems</span>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight">
                            Discover Every <span className="italic text-accent">Region</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROVINCES.map((p, idx) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-accent/40 shadow-2xl transition-all duration-500"
                        >
                            <img 
                                src={p.img} 
                                alt={p.name} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/600x800/162219/gold?text=${p.name}`;
                                }}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.7] group-hover:brightness-[0.9]" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent"></div>
                            
                            <div className="absolute bottom-8 left-8 right-8">
                                <span className="text-[9px] uppercase tracking-[0.4em] text-accent/80 font-heading mb-3 inline-block">Regional Highlights</span>
                                <h4 className="font-display text-4xl text-text-primary mb-2 transition-all group-hover:text-accent drop-shadow-md">{p.name}</h4>
                                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
                                    <div className="flex-grow pr-4 overflow-hidden">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-heading">{p.count} Destinations</p>
                                        <p className="text-[9px] uppercase tracking-[0.15em] text-text-primary/60 mt-1 font-heading truncate" title={p.top}>
                                            Must Visit: {p.top}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-accent flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-accent/20">
                                        <ArrowRight size={18} className="text-surface" />
                                    </div>
                                </div>
                            </div>

                            <Link to={`/destinations?province=${p.name.toLowerCase().replace(' ', '-')}`} className="absolute inset-0 z-20" />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default ProvinceExplorer;
