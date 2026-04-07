import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatbot from '../chat/AIChatbot';
import PlatformFeed from '../features/PlatformFeed';
import { motion } from 'framer-motion';

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex-grow pt-[72px]"
      >
        <PlatformFeed />
        {children}
      </motion.main>
      <AIChatbot />
      <Footer />
    </div>
  );
};

export default PageLayout;
