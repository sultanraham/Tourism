import React from 'react';
import DestinationCard from '../../../components/features/DestinationCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../../services/data.service';

const FeaturedDestinations = () => {
    const { data: featured = [], isLoading } = useQuery({
        queryKey: ['destinations_featured'],
        queryFn: () => dataService.getDestinations().then(res => res.slice(0, 6)),
    });
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block"
            >
              Handpicked Gems
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight"
            >
              Explore <span className="italic text-accent">Top Destinations</span>
            </motion.h2>
          </div>
          <Link to="/destinations" className="group flex items-center gap-3 text-text-muted hover:text-accent font-heading text-[10px] uppercase tracking-[0.2em] transition-all">
            View All Destinations <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((dest, idx) => (
            <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
            >
                <DestinationCard destination={dest} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedDestinations;
