import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await register(formData.email, formData.password, formData.name);
        
        if (result.success) {
            toast.success(result.message || 'Your journey starts now!');
            if (!result.message) {
                 navigate('/');
            }
        } else {
            toast.error(result.error || 'Failed to create account. Please try again.');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-surface py-20 px-6">
            
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                 <img src="/src/assets/hero/skardu_mountains_hero_1775421532625.png" className="w-full h-full object-cover brightness-[0.25] blur-[2px]" />
                 <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-surface" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-[550px]"
            >
                <div className="text-center mb-10">
                     <span className="text-accent font-heading text-[10px] uppercase tracking-[0.4em] mb-4 inline-block">Join our Community</span>
                     <h1 className="font-display text-5xl md:text-6xl text-text-primary">Become a <span className="italic text-accent">Voyager</span></h1>
                </div>

                <div className="bg-surface-2/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                     <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Full Name</label>
                             <div className="relative group">
                                 <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                 <input 
                                    type="text" 
                                    required
                                    className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Email Address</label>
                             <div className="relative group">
                                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                 <input 
                                    type="email" 
                                    required
                                    className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Password</label>
                             <div className="relative group">
                                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                 <input 
                                    type="password" 
                                    required
                                    className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                 />
                             </div>
                         </div>

                         <div className="flex items-center gap-3 px-2 py-4 bg-primary/10 rounded-2xl border border-accent/20">
                             <ShieldCheck className="text-accent shrink-0" size={20} />
                             <p className="text-[9px] uppercase tracking-widest text-text-muted font-bold leading-relaxed">
                                I agree to the <span className="text-accent underline">Terms of Service</span> and privacy guidelines for tourism in Pakistan.
                             </p>
                         </div>

                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn-accent w-full py-5 text-[10px] uppercase font-bold tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(212,160,23,0.3)] transition-all"
                         >
                            {isLoading ? <div className="w-5 h-5 border-2 border-surface border-t-transparent rounded-full animate-spin" /> : <>Create Account <Sparkles size={16} /></>}
                         </button>
                     </form>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                        Already have an account? <Link to="/login" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">Log In Instead</Link>
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default RegisterPage;
