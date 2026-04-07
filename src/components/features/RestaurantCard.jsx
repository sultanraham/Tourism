import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Utensils, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { name, location, cuisine, rating, img, timing, slug, must_try } = restaurant;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-surface-2 rounded-3xl overflow-hidden border border-white/5 flex flex-col shadow-2xl group relative"
    >
      <div className="relative h-[200px] sm:h-[240px] overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
             <span className="bg-primary/80 backdrop-blur-md text-[8px] sm:text-[10px] text-text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">{cuisine}</span>
        </div>
        <button 
            onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
                isFavorite ? 'bg-danger text-white shadow-lg shadow-danger/20 opacity-100' : 'bg-black/20 hover:bg-black/40 text-text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
            }`}
        >
             <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>
      
      <div className="p-5 sm:p-8 flex flex-col justify-between flex-grow">
        <div>
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-accent">
                 <Star size={10} className="fill-accent" />
                 <span className="ml-1 text-text-primary font-bold">{rating}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-accent">
                Elite Selection • Top Rated
              </span>
           </div>
           
           <h3 className="font-heading text-lg sm:text-xl text-text-primary mb-2 group-hover:text-accent transition-colors">{name}</h3>
           
           <div className="flex items-center gap-2 text-text-muted text-[10px] sm:text-xs mb-4">
              <MapPin size={10} className="text-accent" /> {location}
           </div>

           <div className="flex flex-col gap-3 py-3 sm:py-4 border-y border-white/5 mb-6">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-text-muted">
                    <Utensils size={10} className="text-accent" /> <span className="opacity-70">Must Try:</span> <span className="font-bold text-text-primary">{must_try}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-text-muted">
                    <Clock size={10} className="text-accent" /> <span className="opacity-70">{timing}</span>
                </div>
           </div>
        </div>

        <Link to={`/restaurants/${slug}`} className="w-full py-2.5 sm:py-3 bg-surface-3 border border-white/5 hover:border-accent hover:bg-accent hover:text-surface rounded-xl text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2">
            Show Menu <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
