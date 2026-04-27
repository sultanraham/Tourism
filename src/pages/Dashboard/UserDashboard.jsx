import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Map, Heart, Settings, 
    LogOut, Calendar, Star, 
    ChevronRight, Shield, Bell 
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('plans');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const stats = [
        { label: 'Saved Trips', value: '12', icon: <Heart size={16} /> },
        { label: 'Plans Drafted', value: '04', icon: <Map size={16} /> },
        { label: 'Reviews', value: '08', icon: <Star size={16} /> },
    ];

    return (
        <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-[1440px] mx-auto">
                
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2rem] bg-surface-2 border-2 border-accent/20 flex items-center justify-center overflow-hidden shadow-2xl">
                                 <img 
                                    src={user?.user_metadata?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                 />
                                 <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                     <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Voyager</span>
                                 </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-xl border-4 border-surface flex items-center justify-center text-surface">
                                <Shield size={14} />
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                             <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] font-bold">Voyager Member</span>
                             <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-none">{user?.user_metadata?.full_name || user?.name || 'Traveler'}</h1>
                             <p className="text-text-muted text-sm font-body opacity-60">{user?.email || 'traveler@roampk.com'}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-8 py-4 bg-danger/10 text-danger border border-danger/20 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-danger hover:text-surface transition-all w-full md:w-auto justify-center">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                     {stats.map((stat, idx) => (
                         <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-surface-2 p-8 rounded-3xl border border-white/5 flex items-center justify-between group hover:border-accent/40 transition-all shadow-xl"
                         >
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest text-text-muted font-heading font-bold">{stat.label}</p>
                                <p className="text-3xl font-bold text-text-primary group-hover:text-accent transition-colors">{stat.value}</p>
                            </div>
                            <div className="w-12 h-12 bg-surface-3 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-surface transition-all">
                                {stat.icon}
                            </div>
                         </motion.div>
                     ))}
                </div>

                {/* Main Dashboard Layout */}
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Tabs Sidebar */}
                    <aside className="lg:w-80 space-y-2">
                        {[
                            { id: 'plans', label: 'My Itineraries', icon: <Map size={18} /> },
                            { id: 'saved', label: 'Saved Spots', icon: <Heart size={18} /> },
                            { id: 'settings', label: 'Account Settings', icon: <Settings size={18} /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all border ${activeTab === tab.id ? 'bg-accent text-surface border-accent' : 'bg-surface-2 text-text-muted border-white/5 hover:bg-surface-3'}`}
                            >
                                <div className="flex items-center gap-4">
                                    {tab.icon}
                                    <span className="text-[10px] uppercase font-bold tracking-widest">{tab.label}</span>
                                </div>
                                <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-20'} />
                            </button>
                        ))}
                    </aside>

                    {/* Content Area */}
                    <div className="flex-grow">
                         <div className="bg-surface-2/50 min-h-[500px] rounded-[2.5rem] border border-white/5 p-12 relative overflow-hidden">
                             
                             <AnimatePresence mode="wait">
                                {activeTab === 'plans' && (
                                    <motion.div
                                        key="plans"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                             <h3 className="font-heading text-xl text-text-primary uppercase tracking-widest">Upcoming Journeys</h3>
                                             <button onClick={() => navigate('/plan')} className="text-accent text-[10px] uppercase font-bold tracking-widest hover:underline flex items-center gap-2">Build New Plan <ChevronRight size={12} /></button>
                                        </div>
                                        
                                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
                                            <Calendar size={64} className="text-accent" />
                                            <div className="space-y-1">
                                                 <p className="text-lg font-bold text-text-primary">No upcoming trips yet</p>
                                                 <p className="text-sm text-text-muted">Start planning your dream Pakistan tour today.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'settings' && (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-8">
                                             <h3 className="font-heading text-xl text-text-primary uppercase tracking-widest border-b border-white/5 pb-4">Profile Privacy</h3>
                                             <div className="flex items-center justify-between p-6 bg-surface-3 rounded-2xl border border-white/5">
                                                 <div>
                                                     <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest">Public Profile</p>
                                                     <p className="text-[10px] text-text-muted mt-1 uppercase font-heading tracking-widest">Allow others to see your shared itineraries</p>
                                                 </div>
                                                 <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer p-1">
                                                     <div className="w-4 h-4 bg-surface rounded-full absolute right-1" />
                                                 </div>
                                             </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'saved' && (
                                    <div className="py-20 text-center opacity-40">
                                         <Heart size={64} className="text-accent mx-auto mb-6" />
                                         <p className="text-lg font-bold text-text-primary">Your collection is empty</p>
                                         <p className="text-sm text-text-muted">Spots you love will appear here.</p>
                                    </div>
                                )}
                             </AnimatePresence>

                         </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
