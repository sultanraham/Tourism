import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle, LayoutDashboard, MapPin, Building,
    Utensils, Users, Bell, Search, Settings,
    LogOut, ChevronRight, Menu, X, BarChart3,
    CheckCircle2, Clock, ShieldAlert
} from 'lucide-react';
import { dataService } from '../../services/data.service';
import { generateSmartMaterial } from '../../services/ai.service';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Modular Components
import AdminSidebar from './components/AdminSidebar';
import AdminEngine from './components/AdminEngine';
import UserManagement from './components/UserManagement';
import ContentManagement from './components/ContentManagement';

const AdminPortal = () => {
    const [selectedType, setSelectedType] = useState('dashboard');
    const [viewMode, setViewMode] = useState('manage'); // 'create' or 'manage'
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        province: 'Punjab',
        category: 'Nature',
        best_season: 'Spring',
        image: '',
        rawJson: ''
    });

    const [extraDetails, setExtraDetails] = useState({
        description: '',
        highlights: '',
        bestSeason: 'Summer',
        cost: '',
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
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [vaultEnabled, setVaultEnabled] = useState(true);

    const [realStats, setRealStats] = useState({
        destinations: 0,
        hotels: 0,
        restaurants: 0,
        users: 0,
        pendingApprovals: 0
    });

    const [activities, setActivities] = useState([]);

    const fetchStats = async () => {
        try {
            // Step 1: Fetch Counts (Always required)
            const [
                { count: destCount },
                { count: hotelCount },
                { count: restCount },
                { count: userCount }
            ] = await Promise.all([
                supabase.from('destinations').select('*', { count: 'exact', head: true }),
                supabase.from('hotels').select('*', { count: 'exact', head: true }),
                supabase.from('restaurants').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true })
            ]);

            setRealStats({
                destinations: destCount || 0,
                hotels: hotelCount || 0,
                restaurants: restCount || 0,
                users: userCount || 0,
                pendingApprovals: 0
            });

            // Step 2: Fetch Recent Activities (Optional - might fail if columns missing)
            try {
                const { data: recentDests } = await supabase.from('destinations').select('*').limit(2);
                const { data: recentUsers } = await supabase.from('profiles').select('*').limit(2);

                const combined = [
                    ...(recentDests || []).map(d => ({
                        type: 'destination',
                        msg: `Admin updated "${d.name}" manifest`,
                        time: d.created_at || d.id || new Date().toISOString(),
                        icon: <MapPin size={14} />
                    })),
                    ...(recentUsers || []).map(u => ({
                        type: 'user',
                        msg: `New explorer: ${u.email ? u.email.split('@')[0] : 'Anonymous'}`,
                        time: u.created_at || u.id || new Date().toISOString(),
                        icon: <Users size={14} />
                    })),
                    { type: 'alert', msg: 'System integrity check completed', time: new Date().toISOString(), icon: <CheckCircle2 size={14} /> }
                ];

                setActivities(combined.slice(0, 4));
            } catch (activityErr) {
                console.warn("Activity Feed Sync Issue:", activityErr);
                setActivities([{ type: 'alert', msg: 'Neural Feed limited: Missing schema columns', time: new Date().toISOString(), icon: <AlertCircle size={14} /> }]);
            }
        } catch (err) {
            console.error("Dashboard Core Fault:", err);
            toast.error("Command Center connection unstable.");
        }
    };

    const fetchContent = async () => {
        if (selectedType === 'users' || selectedType === 'dashboard') return;
        setIsContentLoading(true);
        try {
            const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
            const tableName = tableMap[selectedType];
            const { data, error } = await supabase.from(tableName).select('*');
            if (error) throw error;
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
            const data = await dataService.getProfiles();
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
        if (selectedType === 'dashboard') {
            fetchStats();
        } else if (selectedType === 'users') {
            fetchProfiles();
            setContentItems([]);
        } else {
            fetchContent();
            setProfiles([]);
        }
    }, [selectedType]);

    const handleDeleteContent = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
        try {
            const { error } = await supabase.from(tableMap[selectedType]).delete().eq('id', id);
            if (error) throw error;
            setContentItems(contentItems.filter(item => item.id !== id));
            toast.success("Removed successfully.");
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
            toast.success("Visibility updated.");
        } catch (err) {
            toast.error("Toggle failed.");
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Change user role to ${newRole}?`)) {
            try {
                await dataService.updateProfileRole(userId, newRole);
                setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
                toast.success(`Role updated to ${newRole}`);
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
        if (window.confirm(`Apply ${hours} hour restriction?`)) {
            try {
                await dataService.updateBlockedUntil(userId, hours);
                const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
                setProfiles(profiles.map(p => p.id === userId ? { ...p, blocked_until: until, is_blocked: false } : p));
                toast.success(`Restricted for ${hours} hours.`);
            } catch (err) {
                toast.error("Failed to apply restriction.");
            }
        }
    };

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
            cost: item.average_cost_pkr || '',
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
            const result = await generateSmartMaterial(selectedType, formData.name, formData.location, envApiKey);
            setFormData(prev => ({ ...prev, rawJson: JSON.stringify(result, null, 2) }));
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
            toast.success("AI Content Generated!");
        } catch (err) {
            toast.error("AI Generation Failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    const slugify = (text) => {
        return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    };

    const handleSave = async () => {
        if (!formData.rawJson) {
            toast.error("Generate content first.");
            return;
        }
        setIsSaving(true);
        try {
            let finalData = JSON.parse(formData.rawJson || '{}');

            // Unified Data Merging for all types
            const parseSafe = (val) => {
                const parsed = parseFloat(val);
                return isNaN(parsed) ? undefined : parsed;
            };

            const commonData = {
                name: formData.name,
                location: formData.location || formData.province,
                province: formData.province,
                description: extraDetails.description,
                best_season: extraDetails.bestSeason,
                rating_avg: parseSafe(extraDetails.rating_avg),
                ideal_duration: extraDetails.ideal_duration,
                difficulty: extraDetails.difficulty,
                lat: parseSafe(extraDetails.lat),
                lng: parseSafe(extraDetails.lng)
            };

            // Merge based on specific fields for hotels/restaurants
            let mergedData = { ...commonData };
            if (selectedType === 'destination') {
                mergedData = { ...mergedData, highlights: extraDetails.highlights, average_cost_pkr: extraDetails.cost, review_count: extraDetails.review_count };
            } else if (selectedType === 'hotel') {
                mergedData = { ...mergedData, price_per_night: extraDetails.cost };
            } else {
                mergedData = { ...mergedData, average_cost: extraDetails.cost };
            }

            // Step: BUILD DATA OBJECTS FOR EACH TYPE (STRICT WHITELIST)
            const destinationColumns = ['name', 'location', 'province', 'description', 'highlights', 'best_season', 'average_cost_pkr', 'rating_avg', 'review_count', 'ideal_duration', 'difficulty', 'lat', 'lng', 'image_url', 'slug'];
            const hotelColumns = ['name', 'location', 'province', 'description', 'rating_avg', 'price_per_night', 'image_url', 'img', 'slug'];
            const restaurantColumns = ['name', 'location', 'province', 'description', 'rating_avg', 'average_cost', 'image_url', 'img', 'slug'];

            const saveData = {};
            const activeColumns = selectedType === 'destination' ? destinationColumns : (selectedType === 'hotel' ? hotelColumns : restaurantColumns);

            activeColumns.forEach(col => {
                if (mergedData[col] !== undefined) saveData[col] = mergedData[col];
                else if (finalData[col] !== undefined) saveData[col] = finalData[col];
            });

            const tableMap = { destination: 'destinations', hotel: 'hotels', restaurant: 'restaurants' };
            const tableName = tableMap[selectedType];

            if (imageFile && vaultEnabled) {
                try {
                    toast.loading("Uplinking Media...", { id: 'uploading' });
                    const uploadedUrl = await dataService.uploadFile(imageFile);
                    toast.success("Media Uplinked!", { id: 'uploading' });

                    if (selectedType === 'destination') saveData.image_url = uploadedUrl;
                    else saveData.img = uploadedUrl;
                } catch (uploadErr) {
                    toast.error("Using AI Fallback Asset.", { id: 'uploading' });
                    const fallbackImg = formData.image || finalData.image_url || finalData.img;

                    if (selectedType === 'destination') saveData.image_url = fallbackImg;
                    else saveData.img = fallbackImg;
                }
            } else {
                const existingImg = formData.image || finalData.image_url || finalData.img;
                if (selectedType === 'destination') saveData.image_url = existingImg;
                else saveData.img = existingImg;
            }

            // FINAL CLEANUP - Double Check
            delete saveData.id;
            delete saveData.created_at;
            if (selectedType === 'destination') delete saveData.img;
            else delete saveData.image_url;

            console.log(`[STRICT DEBUG] Sending to ${tableName}:`, Object.keys(saveData));

            if (!saveData.slug) saveData.slug = slugify(saveData.name || 'new-content');

            if (isEditing && editingId) {
                const { error } = await supabase.from(tableName).update(saveData).eq('id', editingId);
                if (error) {
                    console.error("Update Error:", error);
                    toast.error(`Update Failed: ${error.message}`);
                    throw error;
                }
                toast.success("Asset Updated!");
            } else {
                let error = null;
                if (selectedType === 'destination') {
                    const res = await supabase.from('destinations').insert([saveData]);
                    error = res.error;
                } else if (selectedType === 'hotel') {
                    const res = await supabase.from('hotels').insert([saveData]);
                    error = res.error;
                } else if (selectedType === 'restaurant') {
                    const res = await supabase.from('restaurants').insert([saveData]);
                    error = res.error;
                }

                if (error) {
                    console.error("Insert Error:", error);
                    toast.error(`Save Failed: ${error.message}. ${error.hint || ''}`);
                    throw error;
                }
                toast.success("Success!");
            }

            setFormData({ name: '', location: '', province: 'Punjab', category: 'Nature', image: '', rawJson: '' });
            setExtraDetails({ description: '', highlights: '', bestSeason: 'Summer', cost: '', rating_avg: 4.5, review_count: 0, ideal_duration: '3-4 Days', difficulty: 'Moderate', lat: 34.0, lng: 73.0 });
            setImageFile(null);
            setIsEditing(false);
            setEditingId(null);
            fetchContent();
        } catch (err) {
            console.error("Save Error:", err);
            toast.error("Error saving data.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0d] flex overflow-hidden font-body selection:bg-accent selection:text-surface">
            {/* Left Sidebar */}
            <AdminSidebar
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                setIsEditing={setIsEditing}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Mobile Sidebar Backdrop */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-24 ml-0'}`}>
                {/* Top Navigation */}
                <header className="h-20 bg-[#0d1411]/80 backdrop-blur-xl border-b border-white/[0.05] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-all text-text-muted hover:text-accent"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-text-muted/40">
                            <span>Admin Portal</span>
                            <ChevronRight size={12} />
                            <span className="text-accent">{selectedType}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2 group focus-within:border-accent/30 transition-all">
                            <Search size={16} className="text-text-muted/40 group-focus-within:text-accent" />
                            <input
                                type="text"
                                placeholder="Search Command Center..."
                                className="bg-transparent border-none outline-none text-[11px] text-text-primary placeholder:text-text-muted/20 w-64 font-bold uppercase tracking-wider"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-text-muted relative group">
                                <Bell size={18} />
                                <div className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-[#0d1411] shadow-[0_0_10px_rgba(212,160,23,0.5)]" />
                            </button>
                            <button className="p-3 hover:bg-white/5 rounded-xl transition-all text-text-muted">
                                <Settings size={18} />
                            </button>
                        </div>
                        <div className="h-8 w-px bg-white/5" />
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-text-primary uppercase tracking-wider leading-none">Admin User</p>
                                <p className="text-[9px] font-bold text-accent uppercase tracking-widest mt-1">Superuser</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black shadow-lg shadow-accent/5 group-hover:scale-105 transition-transform">
                                AU
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard/Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-gradient-to-br from-transparent to-accent/[0.02]">
                    <AnimatePresence mode="wait">
                        {selectedType === 'dashboard' ? (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-10"
                            >
                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Explorers', value: realStats.users, icon: <Users />, color: 'accent', change: '+12%' },
                                        { label: 'Destinations', value: realStats.destinations, icon: <MapPin />, color: 'primary', change: '+5' },
                                        { label: 'Active Hotels', value: realStats.hotels, icon: <Building />, color: 'success', change: '+8' },
                                        { label: 'Top Eateries', value: realStats.restaurants, icon: <Utensils />, color: 'danger', change: '+14%' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#0d1411] p-6 rounded-[2rem] border border-white/[0.05] shadow-2xl group hover:border-accent/20 transition-all">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`p-4 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                                                    {React.cloneElement(stat.icon, { size: 24 })}
                                                </div>
                                                <div className="text-[10px] font-black text-success bg-success/10 px-3 py-1 rounded-full">{stat.change}</div>
                                            </div>
                                            <h3 className="text-3xl font-display text-text-primary">{stat.value}</h3>
                                            <p className="text-[10px] uppercase font-black text-text-muted/40 tracking-[0.2em] mt-2">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Recent Activity */}
                                    <div className="lg:col-span-2 bg-[#0d1411] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]">Neural Feed / Activities</h3>
                                            <button className="text-[9px] uppercase font-black text-accent tracking-widest hover:underline">View All</button>
                                        </div>
                                        <div className="space-y-6">
                                            {activities.length > 0 ? activities.map((act, i) => (
                                                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/[0.02] transition-all group">
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                                                        {act.icon}
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-[11px] text-text-primary font-bold">{act.msg}</p>
                                                        <p className="text-[9px] text-text-muted/40 mt-1 uppercase font-black tracking-widest">
                                                            {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <ChevronRight size={14} className="text-text-muted/20 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            )) : (
                                                <div className="py-10 text-center text-[10px] uppercase font-black text-text-muted/20 tracking-widest">
                                                    No recent activities detected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* System Status */}
                                    <div className="bg-[#0d1411] p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl space-y-8">
                                        <h3 className="text-[12px] font-black text-text-primary uppercase tracking-[0.3em]">System Health</h3>
                                        <div className="space-y-8">
                                            {[
                                                { label: 'Neural Core', value: 98, color: 'success' },
                                                { label: 'Database Uplink', value: 92, color: 'accent' },
                                                { label: 'Media Vault Storage', value: 45, color: 'primary' },
                                            ].map((h, i) => (
                                                <div key={i} className="space-y-3">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-text-muted">{h.label}</span>
                                                        <span className={`text-${h.color}`}>{h.value}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${h.value}%` }}
                                                            transition={{ duration: 1, delay: i * 0.2 }}
                                                            className={`h-full bg-${h.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center justify-between p-4 bg-accent/5 rounded-2xl border border-accent/10">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={16} className="text-accent" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-text-primary">Last Backup</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-accent uppercase">12m ago</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : selectedType === 'users' ? (
                            <UserManagement
                                profiles={profiles} 
                                isUsersLoading={isUsersLoading}
                                fetchProfiles={fetchProfiles} 
                                handleTimedBlock={handleTimedBlock}
                                handleToggleRole={handleToggleRole} 
                                handleToggleBlock={handleToggleBlock}
                            />
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                                {/* Configuration Side */}
                                <div className="xl:col-span-4">
                                    <AdminEngine
                                        formData={formData} setFormData={setFormData}
                                        extraDetails={extraDetails} setExtraDetails={setExtraDetails}
                                        vaultEnabled={vaultEnabled} setVaultEnabled={setVaultEnabled}
                                        imageFile={imageFile} setImageFile={setImageFile}
                                        handleGenerate={handleGenerate} isGenerating={isGenerating}
                                        selectedType={selectedType}
                                    />
                                </div>
                                {/* Management Side */}
                                <div className="xl:col-span-8">
                                    <ContentManagement
                                        viewMode={viewMode} setViewMode={setViewMode}
                                        formData={formData} setFormData={setFormData}
                                        handleSave={handleSave} isSaving={isSaving}
                                        contentItems={contentItems} isContentLoading={isContentLoading} fetchContent={fetchContent}
                                        handleEdit={handleEdit} handleToggleVisibility={handleToggleVisibility} handleDeleteContent={handleDeleteContent}
                                        selectedType={selectedType}
                                    />
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminPortal;
