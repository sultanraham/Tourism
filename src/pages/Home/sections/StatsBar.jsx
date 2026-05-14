import React from 'react';
import CountUp from '../../../components/common/CountUp';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../../services/data.service';

const StatsBar = () => {
    const { data: destCount = 0, isLoading: loadingD } = useQuery({ queryKey: ['count_d'], queryFn: () => dataService.getDestinationsCount() });
    const { data: hotelCount = 0, isLoading: loadingH } = useQuery({ queryKey: ['count_h'], queryFn: () => dataService.getHotelsCount() });
    const { data: restCount = 0, isLoading: loadingR } = useQuery({ queryKey: ['count_r'], queryFn: () => dataService.getRestaurantsCount() });

    const isLoading = loadingD || loadingH || loadingR;

    const stats = [
        { label: 'Destinations', value: destCount, suffix: '+' },
        { label: 'Luxury Stays', value: hotelCount, suffix: '+' },
        { label: 'Restaurants', value: restCount, suffix: '+' },
        { label: 'Avg Rating', value: 4.9, suffix: '★', isFloat: true },
    ];

  return (
    <div className="w-full bg-surface-2 border-y border-white/5 py-16">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="font-accent text-4xl md:text-5xl lg:text-6xl text-accent mb-2 transition-transform group-hover:scale-110 duration-500 min-h-[1em] flex items-center justify-center">
                {isLoading ? (
                  <div className="w-20 h-10 bg-white/5 animate-pulse rounded-lg"></div>
                ) : (
                  <CountUp 
                      end={stat.value} 
                      suffix={stat.suffix} 
                      duration={2500} 
                  />
                )}
              </div>
              <div className="font-heading text-[10px] md:text-xs uppercase tracking-[0.2em] text-text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
