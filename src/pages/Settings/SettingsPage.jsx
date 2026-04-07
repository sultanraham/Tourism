import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Sparkles, Save, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const { user, initSession } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    
    // Check if user object has raw metadata explicitly available
    const initialName = user?.user_metadata?.full_name || '';
    const initialAvatar = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

    const [formData, setFormData] = useState({
        name: initialName,
        avatarUrl: initialAvatar
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
             // Update Auth Metadata locally and on Auth server
            const { data: updateData, error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.name,
                    avatar_url: formData.avatarUrl
                }
            });

            if (authError) throw authError;

            // Also update the public profiles table using UPSERT for robustness
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ 
                    id: user.id,
                    email: user.email,
                    full_name: formData.name, 
                    avatar_url: formData.avatarUrl 
                }, { onConflict: 'id' });

            if (profileError) throw profileError;

            if (updateData?.user) {
                useAuthStore.getState().updateUser(updateData.user);
            }
            
            toast.success("Profile updated successfully!");

        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface pt-32 pb-20 px-6 lg:px-24">
            <div className="max-w-[800px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center md:text-left">
                        <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Account Settings</span>
                        <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
                            Personalize Your <br className="hidden md:block"/> <span className="italic text-accent">Voyager Profile</span>
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-surface-2/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-10">
                        {/* Avatar Review */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full border-4 border-surface shadow-2xl shadow-accent/10 overflow-hidden bg-surface-3">
                                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                     <ImageIcon size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h3 className="font-heading text-xl text-text-primary uppercase tracking-widest">{formData.name || 'New Voyager'}</h3>
                                 <p className="text-xs text-text-muted font-body mb-2">{user?.email}</p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Display Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Upload Avatar</label>
                                <div className="relative group overflow-hidden">
                                    <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors z-10" size={18} />
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="w-full bg-surface-3 border border-white/5 rounded-2xl py-[12px] pl-14 pr-6 text-sm text-text-muted cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all focus:outline-none focus:ring-1 focus:ring-accent relative z-0"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const img = new Image();
                                                    img.onload = () => {
                                                        const canvas = document.createElement('canvas');
                                                        const MAX_WIDTH = 400;
                                                        const MAX_HEIGHT = 400;
                                                        let width = img.width;
                                                        let height = img.height;

                                                        if (width > height) {
                                                            if (width > MAX_WIDTH) {
                                                                height *= MAX_WIDTH / width;
                                                                width = MAX_WIDTH;
                                                            }
                                                        } else {
                                                            if (height > MAX_HEIGHT) {
                                                                width *= MAX_HEIGHT / height;
                                                                height = MAX_HEIGHT;
                                                            }
                                                        }

                                                        canvas.width = width;
                                                        canvas.height = height;
                                                        const ctx = canvas.getContext('2d');
                                                        ctx.drawImage(img, 0, 0, width, height);
                                                        
                                                        // Compress to 0.7 quality to stay well under 1MB limit
                                                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                                                        setFormData({ ...formData, avatarUrl: compressedBase64 });
                                                    };
                                                    img.src = event.target.result;
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
                            <div className="flex items-center gap-3 px-2">
                                <ShieldCheck className="text-accent shrink-0" size={20} />
                                <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold leading-relaxed max-w-[250px]">
                                    Profile updates are secured by row-level database policies.
                                </p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="btn-accent w-full md:w-auto px-10 py-4 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(212,160,23,0.3)] transition-all"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin" /> : <>Save Changes <Save size={16} /></>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
