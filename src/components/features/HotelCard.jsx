import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Coffee, Wifi, ShieldCheck, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const { name, location, rating, stars, img, amenities = [], slug } = hotel;
  const hotelRating = rating || stars || 0;

  const renderAmenityIcon = (amenity) => {
    if (typeof amenity !== 'string') return amenity;
    switch(amenity.toLowerCase()) {
        case 'wifi': return <Wifi size={14} />;
        case 'coffee': case 'restaurant': return <Coffee size={14} />;
        case 'shield': case 'generator': return <ShieldCheck size={14} />;
        default: return <span className="text-[8px]">{amenity}</span>;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-surface-2 rounded-3xl overflow-hidden border border-white/5 flex flex-col sm:flex-row shadow-2xl group relative"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
        }}
        className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2 sm:p-2.5 rounded-full backdrop-blur-xl border border-white/10 transition-all ${
            isFavorite ? 'bg-danger text-white border-danger shadow-lg shadow-danger/20' : 'bg-white/5 text-text-primary hover:bg-white/10'
        }`}
      >
        <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
      </button>

      <div className="w-full sm:w-[220px] md:w-[280px] h-[180px] sm:h-auto overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      
      <div className="flex-grow p-6 sm:p-8 flex flex-col justify-between">
        <div>
           <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-accent">
                 {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < Math.floor(hotelRating) ? "fill-accent" : "text-white/20"} />)}
              </div>
              <span className="text-text-muted text-[9px] sm:text-[10px] uppercase font-heading tracking-widest">{hotelRating} Rating</span>
           </div>
           <h3 className="font-heading text-lg sm:text-xl text-text-primary mb-1 sm:mb-2 group-hover:text-accent transition-colors">{name}</h3>
           <div className="flex items-center gap-2 text-text-muted text-[10px] sm:text-xs mb-4 sm:mb-6">
              <MapPin size={10} className="text-accent" /> {location}
           </div>
           
           <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
              {amenities.map((a, i) => (
                <div key={i} className="px-2 sm:px-3 py-1 h-7 sm:h-8 rounded-lg bg-surface-3 border border-white/5 flex items-center justify-center text-text-primary/60 gap-1 sm:gap-1.5">
                   {renderAmenityIcon(a)}
                   {typeof a === 'string' && <span className="text-[7px] sm:text-[8px] uppercase tracking-tighter">{a}</span>}
                </div>
              ))}
           </div>
        </div>

        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5">
           <div>
              <p className="text-[9px] uppercase tracking-widest text-text-muted">Explore Stay</p>
              <p className="text-[12px] sm:text-sm font-bold text-text-primary">Featured Luxury</p>
           </div>
           <Link to={`/hotels/${slug}`} className="px-4 sm:px-6 py-2 border border-white/10 hover:border-accent rounded-xl text-[9px] uppercase font-bold tracking-widest text-text-primary hover:bg-accent hover:text-surface transition-all">
              View Details
           </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
