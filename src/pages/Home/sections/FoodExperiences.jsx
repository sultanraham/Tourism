import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../../services/data.service';

const GRIDS = [
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
];

const FoodExperiences = () => {
    const navigate = useNavigate();
    const { data: restaurants = [], isLoading } = useQuery({
        queryKey: ['restaurants_featured'],
        queryFn: () => dataService.getRestaurants().then(res => res.slice(0, 5)),
    });


  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-3 lg:gap-12">
          <div className="max-w-2xl">
            <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Culinary Journey</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-text-primary leading-tight">
              Taste <span className="italic text-accent">Pakistan</span>
            </h2>
          </div>
          <p className="text-text-muted text-sm md:text-base max-w-sm font-body opacity-80 leading-relaxed mb-4">
            From the fiery spices of Karachi to the aromatic heritage of Lahore, 
            Pakistan's food is a story of global civilizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {restaurants.map((food, idx) => (
            <motion.div
              key={food.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/restaurants/${food.slug}`)}
              className={`relative rounded-[2.5rem] overflow-hidden group border border-white/5 shadow-2xl transition-all duration-700 cursor-pointer ${GRIDS[idx % GRIDS.length]}`}
            >
              <img 
                src={food.img || food.image_url} 
                alt={food.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.7] group-hover:brightness-[0.9]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full backdrop-blur-md border border-accent/20">
                     <Flame size={10} className="fill-accent" /> Elite
                  </span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl lg:text-3xl text-text-primary mb-1 drop-shadow-md group-hover:text-accent transition-colors">{food.name}</h3>
                <div className="flex items-center gap-1.5 text-text-primary/60 text-[10px] md:text-xs font-body mb-6">
                   <MapPin size={12} className="text-accent" /> {food.location}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="flex items-center gap-2 text-accent font-heading text-[9px] uppercase tracking-widest hover:gap-4 transition-all">
                    Show Place <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodExperiences;
