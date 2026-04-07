import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, User } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Muhammad Raham',
    city: 'Lahore, Pakistan',
    quote: 'Roam PK made my first trip to the northern areas seamless. The AI planner suggested spots I wouldn\'t have found otherwise!',
    rating: 5,
    destination: 'Hunza Valley'
  },
  {
    name: 'Muhammad Raham',
    city: 'Faisalabad, Pakistan',
    quote: 'The hotel recommendations were top-notch. Staying at Shangrila was a dream come true for my family.',
    rating: 5,
    destination: 'Skardu'
  },
  {
    name: 'Muhammad Huzaifa',
    city: 'Karachi, Pakistan',
    quote: 'Pakistan is so underrated. This app is the perfect companion for anyone looking to explore the real beauty of the world.',
    rating: 5,
    destination: 'Lahore Fort'
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-surface max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Traveler Stories</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
            Voices of <span className="italic text-accent">Real Travelers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-surface-2 rounded-[2.5rem] border border-white/5 relative group"
                >
                    <Quote size={40} className="text-accent/10 absolute top-8 right-8" />
                    
                    <div className="flex items-center gap-1 text-accent mb-6">
                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-accent" />)}
                    </div>

                    <p className="text-text-primary/80 font-body text-lg italic leading-relaxed mb-10">
                        "{t.quote}"
                    </p>

                    <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <User size={20} />
                        </div>
                        <div>
                            <h4 className="font-heading text-sm text-text-primary uppercase tracking-widest">{t.name}</h4>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest">{t.city} • <span className="text-accent">{t.destination}</span></p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
  );
};

export default Testimonials;
