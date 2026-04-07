import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Coffee, Wifi, ShieldCheck, ArrowRight } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../../services/data.service';

const HotelsSlider = () => {
  const scrollRef = React.useRef(null);
  const { data: HOTELS = [], isLoading } = useQuery({
      queryKey: ['hotels_featured'],
      queryFn: () => dataService.getHotels().then(res => res.slice(0, 5)),
  });

  const getAmenityIcon = (label) => {
    if (label.includes('Wifi')) return <Wifi size={14}/>;
    if (label.includes('Breakfast')) return <Coffee size={14}/>;
    if (label.includes('Security')) return <ShieldCheck size={14}/>;
    return <Star size={14}/>;
  };


  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 500 : scrollLeft + 500;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-surface-2 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Luxury Stays</span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary">
              Stay in <span className="italic text-accent">Style</span>
            </h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-4">
             <motion.button 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => scroll('left')}
               className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-accent hover:border-accent hover:bg-accent/5 transition-all"
               aria-label="Previous"
             >
               <ArrowRight size={20} className="rotate-180" />
             </motion.button>
             <motion.button 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={() => scroll('right')}
               className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-accent hover:border-accent hover:bg-accent/5 transition-all"
               aria-label="Next"
             >
               <ArrowRight size={20} />
             </motion.button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {HOTELS.map((hotel, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="flex-shrink-0 w-full sm:w-[500px] md:w-[600px] bg-surface rounded-[2rem] overflow-hidden border border-white/5 flex flex-col sm:flex-row snap-center shadow-2xl"
            >
              {/* Image */}
              <div className="w-full sm:w-[35%] md:w-[40%] h-[200px] sm:h-auto overflow-hidden">
                <img 
                  src={hotel.img || hotel.image_url || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                />
              </div>
              
              {/* Info */}
              <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between">
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-[9px] text-accent">
                         <Star size={10} className="fill-accent" />
                         <Star size={10} className="fill-accent" />
                         <Star size={10} className="fill-accent" />
                         <Star size={10} className="fill-accent" />
                         <Star size={10} className="fill-accent" />
                      </div>
                      <span className="text-text-muted text-[9px] uppercase font-heading tracking-widest">{hotel.rating} Rating</span>
                   </div>
                   <h3 className="font-heading text-lg sm:text-xl text-text-primary mb-1 sm:mb-2">{hotel.name}</h3>
                   <div className="flex items-center gap-2 text-text-muted text-[10px] sm:text-xs mb-4 sm:mb-6">
                      <MapPin size={10} className="text-accent" /> {hotel.location}
                   </div>
                   
                   <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
                      {(hotel.amenities || ['Wifi', 'Breakfast', 'Security']).slice(0, 3).map((a, i) => (
                        <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-surface-2 border border-white/5 flex items-center justify-center text-text-primary/60">
                           {getAmenityIcon(a)}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5">
                   <div>
                      <p className="text-[9px] uppercase tracking-widest text-text-muted">Status</p>
                      <p className="text-base sm:text-lg font-bold text-accent uppercase tracking-tighter">Elite Stay</p>
                   </div>
                   <button 
                      onClick={() => window.location.href = '/hotels'}
                      className="px-4 sm:px-6 py-2 border border-white/10 hover:border-accent rounded-xl text-[9px] uppercase font-bold tracking-widest text-text-primary hover:bg-accent hover:text-surface transition-all"
                   >
                      Book Now
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelsSlider;
