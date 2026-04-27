import React from 'react';
import { motion } from 'framer-motion';
import { 
    Users, Loader2, Ban, ShieldCheck, Mail, 
    Shield, Timer, MoreVertical, Search, Filter 
} from 'lucide-react';

const UserManagement = ({ profiles, isUsersLoading, fetchProfiles, handleTimedBlock, handleToggleRole, handleToggleBlock }) => {
  return (
    <motion.div key="users" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="h-full flex flex-col space-y-6">
      {/* Header & Search */}
      <div className="bg-[#0d1411] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]">Citizen Ledger Control</h3>
                <p className="text-[9px] text-text-muted/40 uppercase tracking-widest font-bold">Manage Explorer Access & Permissions</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] text-text-muted/40">
                    <Filter size={14} />
                    <span className="uppercase font-black tracking-widest">Filter: All</span>
                </div>
                <button onClick={fetchProfiles} className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl hover:bg-accent hover:text-surface transition-all active:scale-95">
                    <Loader2 size={18} className={`${isUsersLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-[#0d1411] rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col">
            {/* Table Header - HIDDEN ON MOBILE */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/[0.05] bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/40">
                <div className="col-span-5">Citizen Information</div>
                <div className="col-span-2 text-center">Access Role</div>
                <div className="col-span-3 text-center">Restrict Access</div>
                <div className="col-span-2 text-right">Security</div>
            </div>

            {/* Table Body - RESPONSIVE STACKING */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isUsersLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6 opacity-20">
                        <Loader2 size={48} className="animate-spin text-accent" />
                        <span className="text-[10px] uppercase font-black tracking-[0.4em]">Syncing Ledger...</span>
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-10">
                        <Users size={48} strokeWidth={1} />
                        <span className="text-[9px] uppercase font-black tracking-widest">No Citizens Found</span>
                    </div>
                ) : profiles.map((p, idx) => (
                    <motion.div 
                        key={p.id}
                        initial={{ opacity:0, y:10 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-start md:items-center border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group"
                    >
                        <div className="md:col-span-5 flex items-center gap-4 md:gap-6 w-full min-w-0">
                            <div className="w-12 h-12 rounded-xl border border-white/10 p-0.5 bg-surface-2 group-hover:border-accent/40 transition-all shadow-lg relative shrink-0">
                                <img 
                                    src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.email || p.id}`} 
                                    alt="" 
                                    className="w-full h-full rounded-[10px] object-cover" 
                                />
                                {p.is_blocked && <div className="absolute inset-0 bg-danger/60 backdrop-blur-[1px] rounded-[10px] flex items-center justify-center"><Ban size={16} className="text-white" /></div>}
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0d1411] ${p.is_blocked ? 'bg-danger' : 'bg-success shadow-[0_0_10px_rgba(76,175,138,0.5)]'}`} />
                            </div>
                            <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                                <span className="text-[14px] font-bold text-text-primary tracking-tight truncate group-hover:text-accent transition-colors leading-tight">
                                    {p.full_name || 'Anonymous Explorer'}
                                </span>
                                <div className="flex items-center gap-2 opacity-40">
                                    <Mail size={10} className="shrink-0" />
                                    <span className="text-[10px] text-text-muted font-medium truncate tracking-wider">{p.email || 'no-email-recorded'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-start md:justify-center w-full md:w-auto">
                            <button 
                                onClick={() => handleToggleRole(p.id, p.role)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[9px] font-black uppercase tracking-[0.2em] w-full md:w-auto justify-center ${
                                    p.role === 'admin' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-text-muted/40 hover:text-text-primary hover:border-white/20'
                                }`}
                            >
                                <Shield size={10} />
                                {p.role || 'user'}
                            </button>
                        </div>

                        <div className="md:col-span-3 flex justify-start md:justify-center items-center gap-2 w-full">
                            {[1, 24, 168].map(h => (
                                <button 
                                    key={h}
                                    onClick={() => handleTimedBlock(p.id, h)} 
                                    className="px-3 py-2 text-[9px] uppercase font-black text-text-muted/40 hover:text-accent hover:bg-accent/5 rounded-xl border border-white/5 hover:border-accent/20 transition-all flex-1 md:flex-none"
                                >
                                    {h === 168 ? '7D' : `${h}H`}
                                </button>
                            ))}
                        </div>

                        <div className="md:col-span-2 flex justify-end w-full mt-2 md:mt-0">
                             <button 
                                onClick={() => handleToggleBlock(p.id, p.is_blocked)} 
                                className={`w-full md:w-12 h-12 flex items-center justify-center rounded-xl transition-all border group/ban ${
                                    p.is_blocked ? 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20' : 'bg-white/5 hover:bg-danger/10 text-text-muted hover:text-danger border-white/5'
                                }`} 
                            >
                                <Ban size={18} className="group-hover/ban:scale-110 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
      </div>
    </motion.div>
  );
};

export default UserManagement;
