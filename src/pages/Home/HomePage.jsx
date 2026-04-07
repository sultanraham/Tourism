import React from 'react';
import Hero from './sections/Hero';
import StatsBar from './sections/StatsBar';
import FeaturedDestinations from './sections/FeaturedDestinations';
import PakistanMap from '../../components/map/PakistanMap';
import ProvinceExplorer from './sections/ProvinceExplorer';
import HotelsSlider from './sections/HotelsSlider';
import FoodExperiences from './sections/FoodExperiences';
import AIPlannerCTA from './sections/AIPlannerCTA';
import Testimonials from './sections/Testimonials';
import { motion } from 'framer-motion';

const HomePage = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col bg-surface"
        >
            <Hero />
            <StatsBar />
            <FeaturedDestinations />
            
            <div id="province-section">
                <PakistanMap />
            </div>

            <ProvinceExplorer />
            <HotelsSlider />
            <FoodExperiences />
            <AIPlannerCTA />
            <Testimonials />
            
            {/* Newsletter is handled in Footer but can be reinforced here */}
        </motion.div>
    );
};

export default HomePage;
