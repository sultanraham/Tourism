import React from 'react';
import { motion } from 'framer-motion';
import { 
    Sparkles, Save, Trash2, LayoutDashboard, Loader2, 
    CheckCircle2, AlertCircle, Eye, EyeOff, Edit3, 
    Plus, Search, Filter, MoreVertical, ExternalLink
} from 'lucide-react';

const ContentManagement = ({ 
  viewMode, setViewMode, 
  formData, setFormData, 
  handleSave, isSaving, 
  contentItems, isContentLoading, fetchContent, 
  handleEdit, handleToggleVisibility, handleDeleteContent,
  selectedType 
}) => {
  return (
    <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col space-y-6">
      {/* Header & Search */}
      <div className="bg-[#0d1411] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
                <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]">Neural Asset Vault</h3>
                <p className="text-[9px] text-text-muted/40 uppercase tracking-widest font-bold">Manage & Archive Platform Content</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setViewMode('create')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${
                            viewMode === 'create' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        Architect
                    </button>
                    <button 
                        onClick={() => setViewMode('manage')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${
                            viewMode === 'manage' ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-primary'
                        }`}
                    >
                        Governance
                    </button>
                </div>
                <button onClick={handleSave} disabled={isSaving || !formData.rawJson || viewMode === 'manage'} className="px-6 py-3.5 bg-accent/10 border border-accent/20 text-accent rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center gap-3 hover:bg-accent hover:text-surface transition-all disabled:opacity-30 group">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Commit
                </button>
            </div>
        </div>
      </div>

      {viewMode === 'create' ? (
        <div className="flex-1 bg-[#0d1411] rounded-[2.5rem] border border-white/[0.05] shadow-2xl flex flex-col overflow-hidden relative group">
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Sparkles size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">Manifest Review Station</span>
                </div>
                <button onClick={() => setFormData({...formData, rawJson: ''})} className="p-2 hover:bg-danger/10 text-text-muted/40 hover:text-danger rounded-lg transition-all">
                    <Trash2 size={14} />
                </button>
            </div>
            <textarea 
                className="flex-1 bg-transparent p-10 font-mono text-[11px] leading-relaxed text-accent/80 focus:outline-none resize-none scroll-hide selection:bg-accent/20"
                value={formData.rawJson}
                onChange={(e) => setFormData({...formData, rawJson: e.target.value})}
                placeholder="AI-generated manifest will appear here for review..."
            />
            {formData.image && (
                <div className="p-4 bg-white/[0.02] border-t border-white/[0.05] flex items-center gap-4">
                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0"><img src={formData.image} className="w-full h-full object-cover" /></div>
                    <span className="text-[9px] text-text-muted truncate font-mono opacity-30">{formData.image}</span>
                </div>
            )}
        </div>
      ) : (
        <div className="flex-1 bg-[#0d1411] rounded-[2.5rem] border border-white/[0.05] shadow-2xl overflow-hidden flex flex-col">
            {/* Table Header - HIDDEN ON MOBILE */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-5 border-b border-white/[0.05] bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.2em] text-text-muted/40 items-center">
                <div className="col-span-5">Asset Manifest</div>
                <div className="col-span-3">Category / Tag</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body - RESPONSIVE STACKING */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isContentLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-20">
                        <Loader2 size={32} className="animate-spin text-accent" />
                        <span className="text-[9px] uppercase font-black tracking-widest">Querying Vault...</span>
                    </div>
                ) : contentItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 opacity-10">
                        <LayoutDashboard size={48} strokeWidth={1} />
                        <span className="text-[9px] uppercase font-black tracking-widest">Vault Empty</span>
                    </div>
                ) : contentItems.map((item, idx) => (
                    <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-start md:items-center border-b border-white/[0.03] hover:bg-white/[0.01] transition-all group">
                        <div className="md:col-span-5 flex items-center gap-4 md:gap-6 w-full">
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/5 bg-surface-2 relative shadow-lg group-hover:scale-105 transition-transform shrink-0">
                                <img src={item.image_url || item.img || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
                                {item.is_visible === false && <div className="absolute inset-0 bg-[#0f1c14]/80 backdrop-blur-[1px] flex items-center justify-center"><EyeOff size={14} className="text-danger" /></div>}
                            </div>
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <span className="text-[12px] font-black text-text-primary uppercase tracking-wider group-hover:text-accent transition-colors leading-none truncate">{item.name}</span>
                                <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest opacity-40 truncate">{item.location || item.province}</span>
                            </div>
                        </div>
                        <div className="md:col-span-3 flex items-center w-full">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">{item.category || 'General'}</span>
                            </div>
                        </div>
                        <div className="md:col-span-2 flex justify-start md:justify-center w-full">
                            <button 
                                onClick={() => handleToggleVisibility(item.id, item.is_visible !== false)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[8px] font-black uppercase tracking-widest ${
                                    item.is_visible !== false ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'
                                }`}
                            >
                                {item.is_visible !== false ? <Eye size={10} /> : <EyeOff size={10} />}
                                {item.is_visible !== false ? 'Active' : 'Ghosted'}
                            </button>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 w-full mt-2 md:mt-0">
                            <button onClick={() => handleEdit(item)} className="p-2.5 bg-white/5 hover:bg-accent/10 rounded-xl text-text-muted hover:text-accent transition-all flex-1 md:flex-none flex justify-center"><Edit3 size={16} /></button>
                            <button onClick={() => handleDeleteContent(item.id)} className="p-2.5 bg-white/5 hover:bg-danger/10 rounded-xl text-text-muted hover:text-danger transition-all flex-1 md:flex-none flex justify-center"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContentManagement;
