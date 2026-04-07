import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MapPin, ArrowRight, Wind, Cloud, Sun, X, Sparkles, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const {
    name,
    province,
    category,
    slug,
    lat,
    lng
  } = destination;

  // Schema Resilience: Support both local and database formats
  const image = destination.image_url || destination.image;
  const rating = destination.rating_avg || destination.rating || 4.5;
  const season = destination.best_season || destination.season || 'Summer';
  const description = destination.description || '';

  useEffect(() => {
    if (!lat || !lng) return;
    
    // Elite Intelligence Cache: Prevent 429 by checking local manifest first
    const cacheKey = `weather_${name.replace(/\s+/g, '_')}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Cache valid for 30 minutes
      if (Date.now() - timestamp < 1800000) {
        setWeatherData(data);
        return;
      }
    }
    
    // Aggressive stagger for large grids (0-5s) to avoid 429 burst
    const randomDelay = Math.floor(Math.random() * 5000); 
    
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode&timezone=Asia%2FKarachi`);
        if (!res.ok) throw new Error('Throttled');
        const data = await res.json();
        setWeatherData(data.current);
        
        // Manifest to Cache
        localStorage.setItem(cacheKey, JSON.stringify({
          data: data.current,
          timestamp: Date.now()
        }));
      } catch (err) {
        // Silent manifest failure
      }
    };

    const timer = setTimeout(fetchWeather, randomDelay);
    return () => clearTimeout(timer);
  }, [lat, lng, name]);

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun size={10} className="text-accent" />;
    return <Cloud size={10} className="text-accent" />;
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative bg-surface-2 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/40 shadow-2xl transition-all duration-300 w-full max-w-full"
      >
        {/* Image Container */}
        <div className="relative h-[180px] sm:h-[240px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-2">
            <span className="bg-primary/90 text-text-primary px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] uppercase font-heading tracking-widest backdrop-blur-md">
              {province}
            </span>
            <span className="bg-accent/90 text-surface px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] uppercase font-heading tracking-widest backdrop-blur-md font-bold">
              {season}
            </span>
          </div>

          {/* Live Weather Badge */}
          {weatherData && (
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 bg-surface/80 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              {getWeatherIcon(weatherData.weathercode)}
              <span className="text-[10px] font-bold text-text-primary">{Math.round(weatherData.temperature_2m)}°C</span>
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full backdrop-blur-md transition-all z-20 ${isFavorite ? 'bg-danger text-white shadow-lg shadow-danger/20' : 'bg-black/20 hover:bg-black/40 text-text-primary'
              }`}
          >
            <Heart size={14} className={isFavorite ? 'fill-current' : 'hover:fill-danger hover:text-danger'} />
          </button>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-surface-2 via-surface-2/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-8 sm:-mt-10 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-white/5 text-[8px] sm:text-[9px] uppercase tracking-widest text-text-muted border border-white/5">
              {category}
            </span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-accent">
              <Star size={10} className="fill-accent" />
              {rating}
            </div>
          </div>

          <h3 className="font-heading text-lg sm:text-xl text-text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
            {name}
          </h3>

          <p className="text-text-muted text-[10px] sm:text-xs leading-relaxed line-clamp-2 mb-5 sm:mb-6 opacity-70">
            {description}
          </p>

          <Link
            to={`/destinations/${slug}`}
            className="w-full relative py-4 sm:py-5 px-6 sm:px-8 bg-accent/90 hover:bg-accent text-surface rounded-2xl text-[9px] sm:text-[10px] uppercase font-black tracking-[0.3em] text-center transition-all flex items-center justify-center group/btn overflow-hidden shadow-2xl shadow-accent/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-4">
              Discover Escape
              <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>
        </div>
      </motion.div>


    </>
  );
};

export default DestinationCard;
