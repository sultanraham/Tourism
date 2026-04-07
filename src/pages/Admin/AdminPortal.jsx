import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, MapPin, Building, Utensils, 
    Sparkles, Save, Trash2, Camera, 
    AlertCircle, CheckCircle2, Loader2, Users,
    ShieldCheck, ShieldAlert, Ban, Unlock, 
    Upload
} from 'lucide-react';
import { dataService } from '../../services/data.service';
import { generateSmartMaterial } from '../../services/ai.service';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const TYPES = [
  { id: 'destination', label: 'Explore (Destination)', icon: <MapPin size={18} /> },
  { id: 'hotel', label: 'Hotel (Stay)', icon: <Building size={18} /> },
  { id: 'restaurant', label: 'Restaurant (Food)', icon: <Utensils size={18} /> },
  { id: 'users', label: 'User Management', icon: <Users size={18} /> },
];

const AdminPortal = () => {
    const [selectedType, setSelectedType] = useState('destination');
    const [viewMode, setViewMode] = useState('create'); // 'create' or 'manage'
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        province: 'Punjab',
        category: 'Nature',
        best_season: 'Spring',
        image: '',
        rawJson: ''
    });

    // DEEP DETAILING FIELDS (The Discovery Modal Vault)
    const [extraDetails, setExtraDetails] = useState({
        description: '',
        highlights: '',
        bestSeason: 'Summer',
        cost: '', // Removed from UI but keeping in state for internal manifest consistency if needed
        rating_avg: 4.5,
        review_count: 0,
        ideal_duration: '3-4 Days',
        difficulty: 'Moderate',
        lat: 34.0,
        lng: 73.0
    });

    const [profiles, setProfiles] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [contentItems, setContentItems] = useState([]);
    const [isContentLoading, setIsContentLoading] = useState(false);

    const fetchContent = async () => {
        if (selectedType === 'users') return;
        setIsContentLoading(true);
        try {
            const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
            const tableName = tableMap[selectedType];
            
            // Fail-safe verbose select to track fetch issues
            // Sort-resilient fetch to resolve 400 errors across varied schemas
            const { data, error } = await supabase
                .from(tableName)
                .select('*');
            
            if (error) {
                console.error(`Fetch Failure for ${tableName}:`, error);
                throw error;
            }
            
            console.log(`Successfully fetched ${data?.length || 0} ${tableName} items.`);
            setContentItems(data || []);
        } catch (err) {
            console.error("Admin Portal Data Error:", err);
            toast.error(`Protocols offline for ${selectedType}s.`);
            setContentItems([]);
        } finally {
            setIsContentLoading(false);
        }
    };

    const fetchProfiles = async () => {
        setIsUsersLoading(true);
        try {
            // Absolute verbose fetch for citizen ledger
            const data = await dataService.getProfiles();
            console.log(`Citizen ledger updated: ${data?.length || 0} active explorers fetched.`);
            setProfiles(data || []);
        } catch (err) {
            console.error("Citizen Ledger Fault:", err);
            toast.error("Citizen directory currently offline.");
            setProfiles([]);
        } finally {
            setIsUsersLoading(false);
        }
    };

    useEffect(() => {
        if (selectedType === 'users') {
            fetchProfiles();
            setContentItems([]);
        } else {
            fetchContent();
            setProfiles([]);
        }
    }, [selectedType]);

    const handleDeleteContent = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this content?")) return;
        const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
        try {
            const { error } = await supabase.from(tableMap[selectedType]).delete().eq('id', id);
            if (error) throw error;
            setContentItems(contentItems.filter(item => item.id !== id));
            toast.success("Content removed successfully.");
        } catch (err) {
            toast.error("Delete failed.");
        }
    };

    const handleToggleVisibility = async (id, currentStatus) => {
        const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
        try {
            const { error } = await supabase
                .from(tableMap[selectedType])
                .update({ is_visible: !currentStatus })
                .eq('id', id);
            
            if (error) throw error;
            setContentItems(contentItems.map(item => item.id === id ? { ...item, is_visible: !currentStatus } : item));
            toast.success(currentStatus ? "Content Hidden from platform." : "Content Live on platform.");
        } catch (err) {
            toast.error("Visibility toggle failed.");
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        if (window.confirm(`Change user role to ${currentRole === 'admin' ? 'User' : 'Admin'}?`)) {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            try {
                await dataService.updateProfileRole(userId, newRole);
                setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
                toast.success(`User role updated to ${newRole}`);
            } catch (err) {
                toast.error("Failed to update role.");
            }
        }
    };

    const handleToggleBlock = async (userId, currentStatus) => {
        const nextStatus = !currentStatus;
        if (window.confirm(nextStatus ? "Block this user?" : "Unblock this user?")) {
            try {
                await dataService.updateProfileStatus(userId, nextStatus);
                setProfiles(profiles.map(p => p.id === userId ? { ...p, is_blocked: nextStatus } : p));
                toast.success(nextStatus ? "User blocked!" : "User unblocked!");
            } catch (err) {
                toast.error("Failed to update status.");
            }
        }
    };

    const handleTimedBlock = async (userId, hours) => {
        if (window.confirm(`Apply ${hours} hour restriction to this user?`)) {
            try {
                await dataService.updateBlockedUntil(userId, hours);
                const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
                setProfiles(profiles.map(p => p.id === userId ? { ...p, blocked_until: until, is_blocked: false } : p));
                toast.success(`User restricted for ${hours} hours.`);
            } catch (err) {
                toast.error("Failed to apply timed block.");
            }
        }
    };

    const [imageFile, setImageFile] = useState(null);

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [vaultEnabled, setVaultEnabled] = useState(true); // Toggle to skip uploads and prevent console errors


    const handleEdit = (item) => {
        setEditingId(item.id);
        setIsEditing(true);
        setViewMode('create');
        setFormData({
            name: item.name,
            location: item.location || item.province,
            province: item.province,
            category: item.category,
            image: item.image_url || item.img,
            rawJson: JSON.stringify(item, null, 2)
        });
        setExtraDetails({
            description: item.description || '',
            highlights: item.highlights || '',
            bestSeason: item.best_season || 'Summer',
            cost: '',
            rating_avg: item.rating_avg || item.rating || 4.5,
            review_count: item.review_count || 0,
            ideal_duration: item.ideal_duration || '3-4 Days',
            difficulty: item.difficulty || 'Moderate',
            lat: item.lat || 34.0,
            lng: item.lng || 73.0
        });
    };

    const handleGenerate = async () => {
        const envApiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!formData.name || !formData.location) {
            toast.error("Enter Name and Location first!");
            return;
        }
        setIsGenerating(true);
        try {
            // Enriched AI Manifest with Discovery Context
            const result = await generateSmartMaterial(selectedType, formData.name, formData.location, envApiKey);
            
            setFormData(prev => ({ 
                ...prev, 
                rawJson: JSON.stringify(result, null, 2)
            }));

            // Instantly manifest the AI story into the Detailing Vault
            if (selectedType === 'destination') {
                setExtraDetails({
                    description: result.description || '',
                    highlights: result.highlights || '',
                    bestSeason: result.best_season || 'Summer',
                    cost: result.average_cost_pkr || 15000,
                    rating_avg: result.rating_avg || 4.8,
                    review_count: result.review_count || 1250,
                    ideal_duration: result.ideal_duration || '3-4 Days',
                    difficulty: result.difficulty || 'Moderate',
                    lat: result.lat || 34.0,
                    lng: result.lng || 73.0
                });
            }
            
            toast.success("AI Editorial Manifested!");
        } catch (err) {
            toast.error("AI Orchestration Failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!formData.rawJson) {
            toast.error("Generate content first.");
            return;
        }
        setIsSaving(true);
        try {
            let finalData = JSON.parse(formData.rawJson || '{}');
            
            // Critical Manifest Sync: Override JSON with manual Discovery Vault details
            if (selectedType === 'destination') {
                finalData = {
                    ...finalData,
                    name: formData.name,
                    location: formData.location,
                    province: formData.province,
                    description: extraDetails.description,
                    highlights: extraDetails.highlights,
                    best_season: extraDetails.bestSeason,
                    average_cost_pkr: extraDetails.cost,
                    rating_avg: extraDetails.rating_avg,
                    review_count: extraDetails.review_count,
                    ideal_duration: extraDetails.ideal_duration,
                    difficulty: extraDetails.difficulty,
                    lat: parseFloat(extraDetails.lat),
                    lng: parseFloat(extraDetails.lng)
                };
            }

            const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
            const tableName = tableMap[selectedType];
            
            if (imageFile && vaultEnabled) {
                try {
                    toast.loading("Uploading Attachment...", { id: 'uploading' });
                    const uploadedUrl = await dataService.uploadFile(imageFile);
                    toast.success("Attachment Saved!", { id: 'uploading' });
                    if (selectedType === 'destination') finalData.image_url = uploadedUrl;
                    else finalData.img = uploadedUrl;
                    finalData.images = [uploadedUrl];
                } catch (uploadErr) {
                    toast.error("Vault Restricted: Using AI Fallback Image.", { id: 'uploading' });
                    // Professional Stealth: No console warning to keep the developer center clean
                    finalData.images = [formData.image || finalData.image_url || finalData.img];
                }
            } else if (imageFile && !vaultEnabled) {
                // If vault is locked, skip upload and just use AI link
                finalData.images = [formData.image || finalData.image_url || finalData.img];
                if (selectedType === 'destination') finalData.image_url = finalData.images[0];
                else finalData.img = finalData.images[0];
            }

            if (!finalData.slug) finalData.slug = slugify(formData.name || 'new-content');

            if (isEditing && editingId) {
                const { error } = await supabase.from(tableName).update(finalData).eq('id', editingId);
                if (error) throw error;
                toast.success("Asset Modified Successfully!");
            } else {
                if (selectedType === 'destination') await dataService.addDestination(finalData);
                if (selectedType === 'hotel') await dataService.addHotel(finalData);
                if (selectedType === 'restaurant') await dataService.addRestaurant(finalData);
                toast.success("New Asset Manifested!");
            }
            
            setFormData({ name: '', location: '', image: '', rawJson: '' });
            setExtraDetails({ 
                description: '', highlights: '', bestSeason: 'Summer', cost: '',
                rating_avg: 4.5, review_count: 0, ideal_duration: '3-4 Days',
                difficulty: 'Moderate', lat: 34.0, lng: 73.0
            });
            setImageFile(null);
            setIsEditing(false);
            setEditingId(null);
            fetchContent();
        } catch (err) {
            console.error("Database Protocol Error:", err);
            if (err.message?.includes('violates row-level security policy')) {
                toast.error("Vault Restricted: Please Enable 'Insert' Policies for the destinations bucket in Supabase Storage.");
            } else {
                toast.error("Database Protocol Error. Manifest remains local.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface px-6 lg:px-24 py-32">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-12">
                    {/* Left Sidebar: Architectural Hub */}
                    <div className="lg:col-span-4 flex flex-col gap-10">
                        <section className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <LayoutDashboard size={100} />
                            </div>
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-50">Collection Hub</h3>
                            <div className="flex flex-col gap-3">
                                {TYPES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedType(t.id); setIsEditing(false); }}
                                        className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all duration-500 border ${selectedType === t.id ? 'bg-accent text-surface border-accent shadow-xl shadow-accent/20' : 'bg-white/5 text-text-muted border-white/5 hover:bg-white/10 hover:text-text-primary'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="transition-colors">{t.icon}</div>
                                            <span className="text-[10px] uppercase font-black tracking-widest">{t.label}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {selectedType !== 'users' && (
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl"
                            >
                                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-50">Architectural Engine</h3>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Asset Identity</label>
                                        <input 
                                            type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 placeholder:text-text-muted/20 transition-all font-bold tracking-wider"
                                            placeholder="e.g. Naran Valley"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Geographic Context</label>
                                        <input 
                                            type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 placeholder:text-text-muted/20 transition-all font-bold tracking-wider"
                                            placeholder="e.g. Kaghan District"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black">Vault Attachment</label>
                                            <button 
                                                onClick={() => setVaultEnabled(!vaultEnabled)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${vaultEnabled ? 'bg-success/5 border-success/20 text-success' : 'bg-danger/5 border-danger/20 text-danger'}`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${vaultEnabled ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                                                <span className="text-[8px] uppercase font-black tracking-widest">{vaultEnabled ? 'Vault Live' : 'Vault Locked'}</span>
                                            </button>
                                        </div>
                                        <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all group overflow-hidden ${vaultEnabled ? 'border-white/10 cursor-pointer hover:bg-white/5 hover:border-accent/30' : 'border-white/5 opacity-50 cursor-not-allowed'}`}>
                                            {imageFile ? (
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-white/10"><img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover" /></div>
                                                    <span className="text-[9px] uppercase font-bold text-accent truncate flex-grow text-center">{imageFile.name}</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Camera className={`mb-2 transition-colors ${vaultEnabled ? 'text-text-muted/40 group-hover:text-accent' : 'text-text-muted/20'}`} size={24} />
                                                    <span className={`text-[9px] uppercase font-black tracking-widest ${vaultEnabled ? 'text-text-muted/40 group-hover:text-text-primary' : 'text-text-muted/20'}`}>{vaultEnabled ? 'Click to Upload Image' : 'Vault System Restricted'}</span>
                                                </>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" disabled={!vaultEnabled} onChange={(e) => setImageFile(e.target.files[0])} />
                                        </label>
                                    </div>

                                    {/* DISCOVERY MODAL DETAILING VAULT */}
                                    <div className="pt-8 border-t border-accent/20 space-y-6">
                                        <div className="flex items-center gap-3 mb-2 ml-1">
                                            <Sparkles className="text-accent" size={14} />
                                            <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Discovery Modal Vault</h3>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Epic Story / Narrative</label>
                                            <textarea 
                                                value={extraDetails.description} onChange={(e) => setExtraDetails({...extraDetails, description: e.target.value})}
                                                className="w-full bg-accent/5 border border-accent/10 rounded-2xl px-6 py-5 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 h-32 resize-none font-medium leading-relaxed shadow-inner"
                                                placeholder="Write the editorial narrative for the discovery modal..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Full Expectation Guide</label>
                                                <input 
                                                    type="text" value={extraDetails.highlights} onChange={(e) => setExtraDetails({...extraDetails, highlights: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold tracking-wider"
                                                    placeholder="e.g. Carry Warm Clothes, Professional Driver Needed, etc. (comma separated)"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Best Visitation Season</label>
                                            <select 
                                                value={extraDetails.bestSeason} onChange={(e) => setExtraDetails({...extraDetails, bestSeason: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[11px] text-text-primary focus:outline-none focus:border-accent appearance-none font-bold tracking-wider cursor-pointer"
                                            >
                                                {['Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon', 'Year_Round'].map(s => (
                                                    <option key={s} value={s} className="bg-surface text-text-primary uppercase tracking-widest text-[9px] font-black">{s}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-6">
                                            <h4 className="text-[9px] uppercase font-black text-accent tracking-[0.2em] ml-1">Elite Experience Stats</h4>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Platform Rating</label>
                                                    <input 
                                                        type="number" step="0.1" value={extraDetails.rating_avg} onChange={(e) => setExtraDetails({...extraDetails, rating_avg: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold"
                                                        placeholder="4.8"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Review Count</label>
                                                    <input 
                                                        type="number" value={extraDetails.review_count} onChange={(e) => setExtraDetails({...extraDetails, review_count: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold"
                                                        placeholder="750"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Ideal Duration</label>
                                                    <input 
                                                        type="text" value={extraDetails.ideal_duration} onChange={(e) => setExtraDetails({...extraDetails, ideal_duration: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold"
                                                        placeholder="3-4 Days"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Difficulty Level</label>
                                                    <select 
                                                        value={extraDetails.difficulty} onChange={(e) => setExtraDetails({...extraDetails, difficulty: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent appearance-none font-bold"
                                                    >
                                                        {['Easy', 'Moderate', 'Hard', 'Very Hard'].map(d => (
                                                            <option key={d} value={d} className="bg-surface">{d}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 space-y-6">
                                            <h4 className="text-[9px] uppercase font-black text-accent tracking-[0.2em] ml-1">Geographical Lock (Map)</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Latitude</label>
                                                    <input 
                                                        type="number" step="0.0001" value={extraDetails.lat} onChange={(e) => setExtraDetails({...extraDetails, lat: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold"
                                                        placeholder="34.0522"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Longitude</label>
                                                    <input 
                                                        type="number" step="0.0001" value={extraDetails.lng} onChange={(e) => setExtraDetails({...extraDetails, lng: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-[11px] text-text-primary focus:outline-none focus:border-accent/40 font-bold"
                                                        placeholder="73.0522"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-white/5">
                                        <label className="text-[9px] uppercase tracking-[0.2em] text-text-muted/60 font-black ml-1">Target Filters</label>
                                        <div className="grid grid-cols-1 gap-4">
                                            <select 
                                                value={formData.province} 
                                                onChange={(e) => setFormData({...formData, province: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-[11px] text-text-primary focus:outline-none focus:border-accent appearance-none font-bold tracking-wider cursor-pointer shadow-inner transition-transform"
                                            >
                                                {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit Baltistan', 'Azad Kashmir'].map(p => (
                                                    <option key={p} value={p} className="bg-surface">{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleGenerate} disabled={isGenerating} className="w-full py-6 bg-accent/10 border border-accent/20 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] text-accent flex items-center justify-center gap-4 hover:bg-accent hover:text-surface transition-all duration-500 group shadow-lg shadow-accent/5">
                                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />}
                                    AI Orchestration
                                </button>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-8 flex flex-col space-y-8">
                        <div className="bg-white/5 backdrop-blur-3xl p-10 lg:p-16 rounded-[4rem] border border-white/5 flex-grow flex flex-col min-h-[750px] shadow-2xl relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {selectedType === 'users' ? (
                                    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 h-full flex flex-col">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-accent/10 rounded-xl text-accent"><Users size={20} /></div>
                                                <div>
                                                    <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-text-primary">Explorer Management</h4>
                                                    <p className="text-[9px] uppercase text-text-muted tracking-widest mt-1 opacity-50">{profiles.length} Active Platform Citizens</p>
                                                </div>
                                            </div>
                                            <button onClick={fetchProfiles} className="p-3 hover:bg-white/10 rounded-full transition-all text-accent hover:rotate-180 duration-700">
                                                <Loader2 size={18} className={isUsersLoading ? 'animate-spin' : ''} />
                                            </button>
                                        </div>

                                        <div className="space-y-6 flex-grow overflow-y-auto pr-4 custom-scrollbar">
                                            {isUsersLoading ? (
                                                <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-30">
                                                    <Loader2 size={48} className="animate-spin text-accent" />
                                                    <span className="text-[10px] uppercase font-black tracking-[0.4em]">Querying Citizen Ledger...</span>
                                                </div>
                                            ) : profiles.map(p => (
                                                <div key={p.id} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-accent/30 transition-all group shadow-xl">
                                                    <div className="flex items-center gap-8">
                                                        <div className="w-16 h-16 rounded-[1.5rem] border border-accent/20 overflow-hidden shadow-2xl relative bg-surface">
                                                            <img src={p.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.email}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                            {p.is_blocked && (
                                                                <div className="absolute inset-0 bg-danger/60 backdrop-blur-[2px] flex items-center justify-center">
                                                                    <Ban size={20} className="text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-lg font-bold text-text-primary tracking-tight">{p.full_name || 'Verified Explorer'}</span>
                                                                <span className={`text-[9px] uppercase px-3 py-1 rounded-full font-black tracking-widest ${p.role === 'admin' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-white/5 text-text-muted border-white/5'}`}>{p.role}</span>
                                                            </div>
                                                            <span className="text-[11px] text-text-muted font-mono opacity-50 block mt-1 tracking-wider">{p.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {/* TIMED BLOCK PILLS */}
                                                        <div className="flex items-center bg-white/5 border border-white/5 rounded-2xl p-1.5 gap-1 shadow-lg backdrop-blur-xl">
                                                            <button onClick={() => handleTimedBlock(p.id, 1)} className="px-4 py-2 text-[8px] uppercase font-black text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all">1h</button>
                                                            <button onClick={() => handleTimedBlock(p.id, 24)} className="px-4 py-2 text-[8px] uppercase font-black text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all">24h</button>
                                                            <button onClick={() => handleTimedBlock(p.id, 168)} className="px-4 py-2 text-[8px] uppercase font-black text-text-muted hover:text-accent hover:bg-white/5 rounded-xl transition-all">7d</button>
                                                        </div>

                                                        <button onClick={() => handleToggleRole(p.id, p.role)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-text-muted hover:text-accent border border-white/5 shadow-xl" title="Toggle Permissions"><ShieldCheck size={18} /></button>
                                                        <button onClick={() => handleToggleBlock(p.id, p.is_blocked)} className={`p-4 rounded-2xl transition-all shadow-xl border ${p.is_blocked ? 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20' : 'bg-white/5 hover:bg-white/10 text-text-muted border-white/5'}`} title="Platform Lock"><Ban size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                                        {/* VIEW TOGGLE */}
                                        <div className="flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-12 self-start shadow-inner">
                                            <button 
                                                onClick={() => setViewMode('create')}
                                                className={`px-8 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${viewMode === 'create' ? 'bg-accent text-surface shadow-xl shadow-accent/20' : 'text-text-muted hover:text-text-primary'}`}
                                            >
                                                Architect New
                                            </button>
                                            <button 
                                                onClick={() => setViewMode('manage')}
                                                className={`px-8 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${viewMode === 'manage' ? 'bg-accent text-surface shadow-xl shadow-accent/20' : 'text-text-muted hover:text-text-primary'}`}
                                            >
                                                Vault Governance
                                            </button>
                                        </div>

                                        {viewMode === 'create' ? (
                                            <div className="space-y-10 flex flex-col h-full">
                                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-accent/10 rounded-xl text-accent"><Sparkles size={20} /></div>
                                                        <div>
                                                            <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-text-primary">Manifest Generator</h4>
                                                            <p className="text-[9px] uppercase text-text-muted tracking-widest mt-1 opacity-50">Review AI Editorial Materials</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => setFormData({...formData, rawJson: ''})} className="text-text-muted hover:text-danger flex items-center gap-3 text-[10px] uppercase font-black tracking-widest transition-all px-4 py-2 rounded-xl">
                                                            <Trash2 size={16} /> Reset
                                                        </button>
                                                        <button onClick={handleSave} disabled={isSaving || !formData.rawJson} className="px-10 py-4 bg-accent text-surface rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center gap-3 hover:shadow-2xl hover:shadow-accent/40 transition-all disabled:opacity-30">
                                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Commit to Live
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex-grow relative">
                                                    <textarea 
                                                        className="absolute inset-0 bg-black/30 p-10 rounded-[3rem] border border-white/5 font-mono text-[11px] leading-relaxed text-accent/80 focus:outline-none scroll-hide resize-none shadow-inner"
                                                        value={formData.rawJson}
                                                        onChange={(e) => setFormData({...formData, rawJson: e.target.value})}
                                                        placeholder="Materials generated by AI will appear here for architectural review..."
                                                    />
                                                </div>
                                                {formData.image && (
                                                    <div className="mt-8 flex items-center gap-8 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl">
                                                        <div className="w-32 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                                                            <img src={formData.image} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-black mb-1">Live Asset Preview</p>
                                                            <p className="text-[10px] text-text-muted truncate max-w-sm font-mono opacity-50">{formData.image}</p>
                                                        </div>
                                                        <div className="text-success"><CheckCircle2 size={24} /></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-8 flex flex-col h-full">
                                                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-accent/10 rounded-xl text-accent"><LayoutDashboard size={20} /></div>
                                                        <div>
                                                            <h4 className="text-[11px] uppercase font-black tracking-[0.2em] text-text-primary">Active Collection Gallery</h4>
                                                            <p className="text-[9px] uppercase text-text-muted tracking-widest mt-1 opacity-50">{contentItems.length} Real-Time Assets</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={fetchContent} className="p-3 hover:bg-white/10 rounded-full transition-all text-accent hover:rotate-180 duration-700">
                                                        <Loader2 size={18} className={isContentLoading ? 'animate-spin' : ''} />
                                                    </button>
                                                </div>

                                                <div className="space-y-4 flex-grow overflow-y-auto pr-4 custom-scrollbar">
                                                    {isContentLoading ? (
                                                        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-30">
                                                            <Loader2 size={48} className="animate-spin text-accent" />
                                                            <span className="text-[10px] uppercase font-black tracking-[0.4em]">Accessing Master Vault...</span>
                                                        </div>
                                                    ) : contentItems.length === 0 ? (
                                                        <div className="text-center py-32 opacity-20 flex flex-col items-center gap-6">
                                                            <LayoutDashboard size={80} strokeWidth={0.5} />
                                                            <p className="text-[10px] uppercase font-black tracking-[0.3em]">No items found in this ledger</p>
                                                        </div>
                                                    ) : contentItems.map(item => (
                                                        <div key={item.id} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-accent/40 transition-all group overflow-hidden shadow-xl">
                                                            <div className="flex items-center gap-8">
                                                                <div className="w-24 h-18 rounded-2xl overflow-hidden border border-white/5 bg-surface relative shadow-2xl">
                                                                    <img src={item.image_url || item.img || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                                                    {item.is_visible === false && (
                                                                        <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex items-center justify-center">
                                                                            <span className="text-[8px] uppercase font-black tracking-[0.2em] bg-surface text-text-muted px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">Ghost Mode</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h5 className="text-[13px] font-black uppercase tracking-widest text-text-primary group-hover:text-accent transition-colors">{item.name}</h5>
                                                                    <div className="flex items-center gap-4 mt-2 opacity-50">
                                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">{item.location || item.province}</span>
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-accent">{item.category}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 pr-2">
                                                                <button 
                                                                    onClick={() => handleEdit(item)}
                                                                    className="p-4 bg-white/5 hover:bg-accent/10 rounded-2xl text-text-muted hover:text-accent border border-white/5 transition-all shadow-lg"
                                                                    title="Edit Asset"
                                                                >
                                                                    <Save size={18} />
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleToggleVisibility(item.id, item.is_visible !== false)}
                                                                    className={`p-4 rounded-2xl transition-all border shadow-lg ${item.is_visible !== false ? 'bg-white/5 hover:bg-white/10 text-text-muted border-white/5' : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'}`}
                                                                    title="Toggle Visibility"
                                                                >
                                                                    {item.is_visible !== false ? <Sparkles size={18} /> : <AlertCircle size={18} />}
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteContent(item.id)}
                                                                    className="p-4 bg-danger/5 hover:bg-danger/20 rounded-2xl text-danger border border-danger/10 transition-all shadow-lg"
                                                                    title="Permanent Delete"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {selectedType !== 'users' && (
                            <div className="p-6 bg-accent/5 border border-accent/10 rounded-2xl flex items-center gap-4 text-[10px] italic text-text-muted">
                                <AlertCircle size={16} className="text-accent shrink-0" />
                                Content generation is optimized for high-end travel journalism. Review the JSON manifest before committing to the live database.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
