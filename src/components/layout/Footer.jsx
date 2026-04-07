import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Globe, MessageSquare } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { name: 'All Destinations', path: '/destinations' },
        { name: 'Hotels & Stays', path: '/hotels' },
        { name: 'Local Food', path: '/restaurants' },
        { name: 'Community Stories', path: '/community' },
      ]
    },
    {
      title: 'Our Services',
      links: [
        { name: 'Digital Strategy', url: 'https://devnexes-digital-solutions.onrender.com/services' },
        { name: 'Web Development', url: 'https://devnexes-digital-solutions.onrender.com/services' },
        { name: 'UI/UX Design', url: 'https://devnexes-digital-solutions.onrender.com/services' },
        { name: 'SEO Optimization', url: 'https://devnexes-digital-solutions.onrender.com/services' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'About Us', url: 'https://devnexes-digital-solutions.onrender.com/about' },
        { name: 'Contact Us', url: 'https://devnexes-digital-solutions.onrender.com/contact' },
        { name: 'Privacy Policy', url: 'https://devnexes-digital-solutions.onrender.com/services' },
        { name: 'Terms of Service', url: 'https://devnexes-digital-solutions.onrender.com/services' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'Instagram', link: '#' },
    { name: 'Twitter', link: '#' },
    { name: 'YouTube', link: '#' },
  ];

  const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan', 'AJK'];

  return (
    <footer className="w-full bg-[#0A1410] border-t border-accent/20 pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* TOP: Province Text Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-20 opacity-40">
           {provinces.map((p) => (
             <Link key={p} to={`/destinations?province=${p.toLowerCase()}`} className="font-heading text-[10px] md:text-xs uppercase tracking-[0.3em] text-text-muted hover:text-accent hover:opacity-100 transition-all cursor-pointer">
                {p}
             </Link>
           ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 mt-10">
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex flex-col mb-8 group">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-accent/20 p-1 group-hover:border-accent/40 shadow-xl shadow-accent/5 overflow-hidden">
                        <img src="/favicon.png" alt="Tourism PK" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col gap-0">
                        <span className="font-display text-2xl tracking-[0.2em] text-accent leading-none">TOURISM</span>
                        <span className="font-display text-xs tracking-[0.4em] text-primary-light font-bold text-right -mt-0.5">PK</span>
                    </div>
                </div>
                <span className="text-[9px] uppercase tracking-[0.1em] text-text-muted/40 font-heading mt-2">Powered by <span className="text-text-primary/30 font-bold uppercase tracking-widest">Devnexxes Digital Solutions</span></span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-sm font-body opacity-70">
              Tourism PK is your premium gateway to discovering the breathtaking beauty of Pakistan. 
              Our mission is to make Pakistan's hidden gems accessible to travelers around the globe.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-text-primary mb-8 font-bold text-accent">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-accent hover:translate-x-1 flex items-center gap-2 transition-all duration-300">
                       <ArrowRight size={10} className="text-accent/40" /> {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
          
          {/* Socials */}
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a 
                key={s.name} 
                href={s.link} 
                className="w-auto h-10 px-4 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-accent hover:bg-white/5 border border-white/5 transition-all text-xs font-heading tracking-widest uppercase"
                aria-label={s.name}
              >
                {s.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
             <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted">
               <span>© {currentYear} Tourism PK.</span>
               <div className="w-1 h-1 bg-accent rounded-full"></div>
               <span className="flex items-center gap-1.5">Made with <Heart size={10} className="fill-danger text-danger inline animate-pulse" /> for Pakistan.</span>
             </div>
             <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] font-heading text-text-muted opacity-50">
               <span className="hover:text-accent cursor-pointer transition-all">English (UK)</span>
               <span className="hover:text-accent cursor-pointer transition-all">اردو (Coming Soon)</span>
             </div>
          </div>

        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-primary/10 to-transparent pointer-events-none -z-10"></div>
    </footer>
  );
};

export default Footer;
