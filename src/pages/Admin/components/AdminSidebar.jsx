import React from 'react';
import { 
    BarChart3, MapPin, Building, Utensils, 
    Users, LogOut, ChevronLeft, Menu, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TYPES = [
  { id: 'dashboard', label: 'Overview', icon: <BarChart3 size={20} /> },
  { id: 'destination', label: 'Destinations', icon: <MapPin size={20} /> },
  { id: 'hotel', label: 'Hotels', icon: <Building size={20} /> },
  { id: 'restaurant', label: 'Restaurants', icon: <Utensils size={20} /> },
  { id: 'users', label: 'Citizens', icon: <Users size={20} /> },
];

const AdminSidebar = ({ selectedType, setSelectedType, setIsEditing, isOpen, setIsOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1411] border-r border-white/[0.05] transition-all duration-500 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-24'}`}>
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-surface shadow-lg shadow-accent/20 shrink-0">
            <Sparkles size={20} />
          </div>
          {isOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <span className="text-[11px] font-black tracking-[0.2em] text-text-primary uppercase leading-none">Tourism</span>
              <span className="text-[9px] font-bold tracking-[0.4em] text-accent uppercase mt-1">Control</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {TYPES.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelectedType(t.id); setIsEditing(false); }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative ${
              selectedType === t.id 
                ? 'bg-accent text-surface shadow-xl shadow-accent/10' 
                : 'text-text-muted/60 hover:bg-white/[0.03] hover:text-text-primary'
            }`}
          >
            <div className={`flex items-center justify-center transition-transform duration-500 ${selectedType === t.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {t.icon}
            </div>
            {isOpen && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] font-black uppercase tracking-widest truncate">
                {t.label}
              </motion.span>
            )}
            {!isOpen && selectedType === t.id && (
                <div className="absolute left-0 w-1 h-6 bg-surface rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 space-y-2">
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-text-muted/40 hover:bg-danger/5 hover:text-danger transition-all group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>}
        </button>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full hidden lg:flex items-center gap-4 p-4 rounded-2xl text-text-muted/20 hover:text-accent transition-all"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} className="mx-auto" />}
          {isOpen && <span className="text-[11px] font-black uppercase tracking-widest">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
