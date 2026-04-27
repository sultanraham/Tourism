import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Camera, Info, Map, Layers, HelpCircle } from 'lucide-react';

const AdminEngine = ({ 
  formData, setFormData, 
  extraDetails, setExtraDetails, 
  vaultEnabled, setVaultEnabled, 
  imageFile, setImageFile, 
  handleGenerate, isGenerating, 
  selectedType 
}) => {
  if (selectedType === 'users' || selectedType === 'dashboard') return null;

  return (
    <motion.section 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0d1411] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
            <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em]">Neural Architect</h3>
            <p className="text-[9px] text-text-muted/40 uppercase tracking-widest font-bold">New Manifest Configuration</p>
        </div>
        <div className="p-3 bg-accent/5 rounded-xl border border-accent/10">
            <Layers size={16} className="text-accent" />
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic ID Info */}
        <div className="space-y-4">
            <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Asset Identity</label>
                <input 
                    type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-[11px] text-text-primary focus:outline-none focus:border-accent/30 transition-all font-bold tracking-wider"
                    placeholder="e.g. Hunza Valley"
                />
            </div>
            
            <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Geographic Lock</label>
                <input 
                    type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-[11px] text-text-primary focus:outline-none focus:border-accent/30 transition-all font-bold tracking-wider"
                    placeholder="e.g. Gilgit Baltistan"
                />
            </div>
        </div>

        {/* Media Vault */}
        <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black">Media Uplink</label>
                <button 
                    onClick={() => setVaultEnabled(!vaultEnabled)}
                    className={`px-3 py-1 rounded-full border transition-all text-[8px] uppercase font-black tracking-widest ${
                        vaultEnabled ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'
                    }`}
                >
                    {vaultEnabled ? 'Live' : 'Locked'}
                </button>
            </div>
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all group overflow-hidden relative min-h-[120px] ${
                vaultEnabled ? 'border-white/5 cursor-pointer hover:bg-white/[0.02] hover:border-accent/20' : 'border-white/5 opacity-40 cursor-not-allowed'
            }`}>
                {imageFile || formData.image ? (
                    <div className="flex items-center gap-4 w-full px-2">
                        <div className="w-20 h-14 rounded-lg overflow-hidden border border-white/10 shadow-lg bg-black/40">
                            <img 
                                src={imageFile ? URL.createObjectURL(imageFile) : formData.image} 
                                className="w-full h-full object-cover" 
                                alt="Preview"
                            />
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="text-[9px] uppercase font-black text-accent truncate max-w-[150px]">
                                {imageFile ? imageFile.name : 'Existing Asset'}
                            </span>
                            <span className="text-[7px] text-success uppercase font-bold tracking-widest">
                                {imageFile ? 'Ready for Uplink' : 'Active Manifest'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <Camera size={20} className="text-text-muted/20 mb-2 group-hover:text-accent transition-colors" />
                        <span className="text-[8px] uppercase font-black tracking-widest text-text-muted/40">Drop Visual Data</span>
                    </>
                )}
                <input type="file" className="hidden" accept="image/*" disabled={!vaultEnabled} onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
        </div>

        {/* AI Generator Button */}
        <button 
            onClick={handleGenerate} 
            disabled={isGenerating} 
            className="w-full py-4 bg-accent/10 border border-accent/20 rounded-xl text-[10px] uppercase font-black tracking-[0.3em] text-accent flex items-center justify-center gap-4 hover:bg-accent hover:text-surface transition-all duration-500 group relative overflow-hidden"
        >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            AI Generation
        </button>

        {/* Discovery Details */}
        <div className="pt-6 border-t border-white/[0.05] space-y-6 flex-1">
            <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Editorial Narrative</label>
                <textarea 
                    value={extraDetails.description} onChange={(e) => setExtraDetails({...extraDetails, description: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/30 h-24 resize-none font-medium leading-relaxed shadow-inner scroll-hide"
                    placeholder="Craft the narrative..."
                />
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Season</label>
                    <select 
                        value={extraDetails.bestSeason} onChange={(e) => setExtraDetails({...extraDetails, bestSeason: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-text-primary focus:outline-none focus:border-accent appearance-none font-bold"
                    >
                        {['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon', 'Year_Round'].map(s => (
                            <option key={s} value={s} className="bg-[#0d1411]">{s}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Duration</label>
                    <input 
                        type="text" value={extraDetails.ideal_duration} onChange={(e) => setExtraDetails({...extraDetails, ideal_duration: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-text-primary focus:outline-none focus:border-accent font-bold"
                        placeholder="3-4 Days"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Rating</label>
                    <input 
                        type="number" step="0.1" value={extraDetails.rating_avg} onChange={(e) => setExtraDetails({...extraDetails, rating_avg: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-text-primary focus:outline-none focus:border-accent font-bold"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Difficulty</label>
                    <select 
                        value={extraDetails.difficulty} onChange={(e) => setExtraDetails({...extraDetails, difficulty: e.target.value})}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-[10px] text-text-primary focus:outline-none focus:border-accent appearance-none font-bold"
                    >
                        {['Easy', 'Moderate', 'Hard'].map(d => (
                            <option key={d} value={d} className="bg-[#0d1411]">{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Region Filter</label>
                <select 
                    value={formData.province} 
                    onChange={(e) => setFormData({...formData, province: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3 text-[11px] text-text-primary focus:outline-none focus:border-accent appearance-none font-black tracking-widest cursor-pointer transition-all"
                >
                    {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit Baltistan', 'Azad Kashmir'].map(p => (
                        <option key={p} value={p} className="bg-[#0d1411] text-text-primary">{p}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center gap-3 text-[9px] text-text-muted/40 font-bold italic">
        <HelpCircle size={14} className="text-accent/40" />
        Neural models are tuned for travel journalism.
      </div>
    </motion.section>
  );
};

export default AdminEngine;
