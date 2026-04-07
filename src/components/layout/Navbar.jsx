import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, User, Menu, X, 
    ChevronDown, ChevronRight, Hotel, Utensils,
    ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useFilterStore } from '../../stores/filter.store';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAuthenticated, logout } = useAuthStore();
  const { setSearchQuery } = useFilterStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = isAuthenticated && (profile?.role === 'admin' || user?.email?.toLowerCase() === 'admin@devnexes.com');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Explore', path: '/destinations' },
    { name: 'Hotels', path: '/hotels' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Plan a Trip', path: '/plan' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out ${isScrolled ? 'h-[70px] bg-surface/90 backdrop-blur-xl border-b border-white/5' : 'h-[110px] bg-gradient-to-b from-surface/80 to-transparent'}`}>
        <div className={`max-w-[1440px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between gap-8 transition-all duration-700 ${!isScrolled ? '-translate-y-4' : 'translate-y-0'}`}>
          
          {/* LEFT: LOGO */}
          <Link to="/" className="shrink-0 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:rotate-12 border border-white/10 shrink-0">
                <img src="/favicon.png" alt="Tourism PK Logo" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://img.icons8.com/ios-filled/50/d4a017/mountain.png'} />
            </div>
            <div className="flex items-baseline gap-1.5 translate-y-0.5">
              <span className="font-display text-2xl tracking-[0.1em] text-text-primary group-hover:text-accent transition-colors leading-none font-medium">TOUR<span className="italic">ISM</span></span>
              <span className="font-heading text-[10px] tracking-[0.15em] text-primary-light font-black uppercase">PK</span>
            </div>
          </Link>

          {/* CENTER: NAV ITEMS */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`font-heading text-[10px] uppercase font-bold tracking-[0.2em] transition-all relative group/item py-1 ${
                  pathname.startsWith(link.path) ? 'text-accent' : 'text-text-primary/70 hover:text-text-primary'
                }`}
              >
                {link.name}
                <div className={`absolute -bottom-0.5 left-0 h-[2px] bg-accent transition-all duration-300 ${pathname.startsWith(link.path) ? 'w-full' : 'w-0 group-hover/item:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* RIGHT: ACTION AREA */}
          <div className="flex items-center gap-2">
             <div className="hidden lg:flex items-center gap-6">
                {/* Search Icon (floating glass circle) */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 flex items-center justify-center text-text-primary/70 hover:text-accent hover:bg-white/5 rounded-full transition-all border border-white/0 hover:border-white/10"
                >
                  <Search size={18} />
                </button>

                <div className="flex items-center gap-6">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-6">
                        <AnimatePresence mode="wait">
                          {isAdmin && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                              <Link to="/admin" className="text-accent font-heading text-[9px] uppercase tracking-[0.2em] font-black border border-accent/20 px-4 py-2 rounded-full bg-accent/5 hover:bg-accent/10 transition-all flex items-center gap-2">
                                <ShieldCheck size={12} /> Admin
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="group relative">
                          <div className="w-10 h-10 rounded-full border-2 border-accent/20 p-0.5 group-hover:border-accent transition-all cursor-pointer overflow-hidden shadow-lg shadow-black/20">
                            <img 
                              src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'user'}`} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-48">
                            <div className="bg-surface-2 border border-white/10 p-2 rounded-xl shadow-2xl backdrop-blur-xl">
                              <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-text-muted hover:text-accent transition-all"><User size={14} /> Settings</Link>
                              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase font-bold tracking-widest text-danger hover:bg-danger/10 transition-all rounded-lg"><X size={14} /> Logout</button>
                            </div>
                          </div>
                        </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-8">
                      <Link to="/login" className="text-text-primary/70 hover:text-text-primary text-[10px] uppercase font-bold tracking-[0.2em] transition-all">Sign In</Link>
                      <Link to="/register" className="bg-accent text-surface px-8 py-3 rounded-full text-[10px] uppercase font-black tracking-[0.2em] hover:scale-105 shadow-xl shadow-accent/20 transition-all">Join Now</Link>
                    </div>
                  )}
                </div>
             </div>

             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-text-primary/70 p-2 hover:bg-white/5 rounded-lg"><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-surface/95 backdrop-blur-2xl flex items-center justify-center px-6">
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-3 bg-white/5 hover:bg-white/10 rounded-full text-text-primary transition-all self-center"><X size={32} /></button>
            <div className="w-full max-w-2xl">
              <form onSubmit={(e) => { e.preventDefault(); if (searchTerm.trim()) { setSearchQuery(searchTerm); setIsSearchOpen(false); navigate('/destinations'); }}} className="relative group">
                <Search size={32} className="absolute left-0 top-1/2 -translate-y-1/2 text-accent group-focus-within:scale-110 transition-transform" />
                <input autoFocus type="text" placeholder="Where do you want to go?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent border-b-2 border-white/10 focus:border-accent px-12 py-6 text-2xl md:text-3xl font-display text-text-primary focus:outline-none transition-all uppercase" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-[110] bg-surface flex flex-col">
            <div className="h-[80px] px-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-baseline gap-1.5 translate-y-0.5">
                <span className="font-display text-2xl tracking-[0.1em] text-accent leading-none font-medium">TOUR<span className="italic">ISM</span></span>
                <span className="font-heading text-[10px] tracking-[0.1em] text-primary-light font-black uppercase">PK</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg text-text-primary transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto px-6 py-10 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="font-display text-4xl uppercase tracking-tighter text-text-primary">{link.name}</Link>
              ))}
              {isAdmin && <Link to="/admin" className="font-display text-4xl uppercase tracking-tighter text-accent italic">Admin Portal</Link>}
            </div>

            <div className="p-6 border-t border-white/5 bg-surface-2">
               {isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/settings" className="bg-white/5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-white/5">Settings</Link>
                    <button onClick={logout} className="bg-danger/10 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-danger rounded-xl border border-danger/10">Logout</button>
                  </div>
               ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link to="/login" className="bg-white/5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-white/5 text-text-primary">Log In</Link>
                    <Link to="/register" className="bg-accent py-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-surface rounded-xl">Join Now</Link>
                  </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
