import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, User, Menu, X, 
    ChevronDown, ChevronRight, Hotel, Utensils,
    ShieldCheck, RefreshCcw
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
    { name: 'Plan a Trip', path: '/planner' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-in-out ${isScrolled ? 'h-[75px] bg-surface/40 backdrop-blur-3xl border-b border-white/10' : 'h-[100px] bg-gradient-to-b from-surface/60 to-transparent'}`}>
        {/* Mirror Reflection Effect Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.05] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className={`max-w-[1440px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between gap-8 transition-all duration-700 relative z-10 ${!isScrolled ? 'translate-y-0' : 'translate-y-0'}`}>
          
          {/* LEFT: LOGO */}
          <Link to="/" className="shrink-0 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-110 border border-white/10 shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src="/logo.png" alt="Tourism PK Logo" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://img.icons8.com/ios-filled/50/d4a017/mountain.png'} />
            </div>
            <div className="flex items-baseline gap-1.5">
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
                  aria-label="Open Search Overlay"
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
                          <button className="w-10 h-10 rounded-full border-2 border-accent/20 p-0.5 group-hover:border-accent transition-all cursor-pointer overflow-hidden shadow-lg shadow-black/20">
                            <img 
                              src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'user'}`} 
                              alt="Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          </button>
                          
                          {/* Premium Detailed Dropdown */}
                          <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 w-72 z-50">
                            <div className="bg-surface-2/90 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                              
                              {/* Header Area */}
                              <div className="p-6 bg-white/[0.03] border-b border-white/[0.05]">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 overflow-hidden">
                                    <img 
                                      src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'user'}`} 
                                      alt="Profile" 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="overflow-hidden">
                                    <h4 className="text-text-primary text-xs font-black uppercase tracking-widest truncate">{profile?.full_name || 'Active Voyager'}</h4>
                                    <p className="text-[10px] text-text-muted truncate opacity-60">{user?.email}</p>
                                  </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 inline-block">
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-accent">Member Since {new Date(profile?.created_at || Date.now()).getFullYear()}</span>
                                </div>
                              </div>

                              {/* Links Area */}
                              <div className="p-2">
                                <Link to="/settings" className="flex items-center justify-between px-4 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all group/link">
                                  <span className="flex items-center gap-3"><User size={14} className="opacity-50 group-hover/link:opacity-100" /> Account Settings</span>
                                  <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                                </Link>
                                
                                <Link to="/wishlist" className="flex items-center justify-between px-4 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all group/link">
                                  <span className="flex items-center gap-3"><Hotel size={14} className="opacity-50 group-hover/link:opacity-100" /> My Bookings</span>
                                  <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                                </Link>
                                
                                <div className="h-[1px] bg-white/[0.05] my-2 mx-4" />
                                
                                <button 
                                  onClick={logout} 
                                  className="w-full flex items-center justify-between px-4 py-3.5 text-[10px] uppercase font-black tracking-[0.2em] text-danger hover:bg-danger/10 rounded-xl transition-all group/link"
                                >
                                  <span className="flex items-center gap-3"><X size={14} className="opacity-50 group-hover/link:opacity-100" /> End Session</span>
                                  <RefreshCcw size={12} className="opacity-0 group-hover/link:opacity-100 rotate-180 group-hover/link:rotate-0 transition-all" />
                                </button>
                              </div>

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

             <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                aria-label="Open Mobile Menu"
                className="lg:hidden text-text-primary/70 p-2 hover:bg-white/5 rounded-lg"
              >
                <Menu size={24} />
              </button>
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
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        exit={{ x: '100%' }} 
        transition={{ type: 'spring', damping: 30, stiffness: 300 }} 
        className="fixed inset-y-0 right-0 z-[110] w-[85%] sm:w-[400px] bg-surface/90 backdrop-blur-[50px] flex flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.5)] overflow-hidden border-l border-white/5"
      >
        {/* Elite Mobile Header */}
        <div className="h-[75px] px-8 flex items-center justify-between border-b border-white/5 relative z-10">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-baseline gap-1.5">
            <span className="font-display text-xl tracking-[0.1em] text-accent leading-none font-medium">TOUR<span className="text-text-primary">ISM</span></span>
            <span className="font-heading text-[8px] tracking-[0.1em] text-primary-light font-black uppercase opacity-40">PK</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-text-primary hover:text-accent transition-all"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto px-8 py-10 custom-scrollbar relative z-10">
          <div className="flex flex-col gap-10">
            {isAuthenticated && (
              <div className="pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border border-accent/20 p-0.5 bg-surface-3 shadow-2xl overflow-hidden">
                    <img 
                      src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email || 'user'}`} 
                      alt="Avatar" 
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-primary truncate max-w-[180px]">{profile?.full_name || 'Active Voyager'}</h3>
                    <p className="text-[10px] text-text-muted font-heading uppercase tracking-widest opacity-40">Elite Member</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation */}
            <nav className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted/30 mb-4">Main Exploration</span>
              {navLinks.map((link, idx) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Link 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex items-center justify-between py-4 border-b border-white/[0.03] transition-all ${pathname === link.path ? 'text-accent' : 'text-text-primary/80 hover:text-accent'}`}
                  >
                    <span className="font-heading text-xs uppercase font-bold tracking-[0.2em]">{link.name}</span>
                    <ChevronRight size={14} className={`transition-transform duration-300 ${pathname === link.path ? 'translate-x-0' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Detailed Info Section */}
            <div className="pt-4 flex flex-col gap-6">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-text-muted/30">Connect With Us</span>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Headquarters</p>
                    <p className="text-[10px] text-text-primary">Islamabad, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <ShieldCheck size={14} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-text-muted">Verified Support</p>
                    <p className="text-[10px] text-text-primary">24/7 Concierge Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-8 border-t border-white/5 bg-white/[0.02]">
           {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-white/5 py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] rounded-xl border border-white/10 text-text-primary hover:bg-white/10 transition-all"
                >
                  Account Settings
                </Link>
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-danger/5 py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-danger rounded-xl border border-danger/10 hover:bg-danger/10 transition-all"
                >
                  End Session
                </button>
              </div>
           ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-accent py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-surface rounded-xl shadow-lg shadow-accent/10"
                >
                  Join Expedition
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-white/5 py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] rounded-xl border border-white/10 text-text-primary hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
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
