import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
            toast.success('Welcome back to Pakistan!');
            navigate('/');
        } else {
            toast.error(result.error || 'Failed to sign in. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-surface py-20 px-6">
            
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                 <img src="/src/assets/hero/hunza_valley_hero_1775421507878.png" className="w-full h-full object-cover brightness-[0.25] blur-[2px]" />
                 <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-surface" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[500px]"
            >
                <div className="text-center mb-10">
                     <span className="text-accent font-heading text-[10px] uppercase tracking-[0.4em] mb-4 inline-block">Welcome Back</span>
                     <h1 className="font-display text-5xl text-text-primary">Journal Your <span className="italic text-accent">Journeys</span></h1>
                </div>

                <div className="bg-surface-2/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                     <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted ml-1">Email Address</label>
                             <div className="relative group">
                                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                 <input 
                                    type="email" 
                                    required
                                    className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="traveler@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                             </div>
                         </div>

                         <div className="space-y-2">
                             <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Password</label>
                                <Link to="#" className="text-[9px] uppercase font-bold tracking-widest text-accent hover:underline">Forgot?</Link>
                             </div>
                             <div className="relative group">
                                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
                                 <input 
                                    type="password" 
                                    required
                                    className="w-full bg-surface-3 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                 />
                             </div>
                         </div>

                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className="btn-accent w-full py-4 text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-3 transition-all"
                         >
                            {isLoading ? <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin" /> : <>Sign In <ArrowRight size={14} /></>}
                         </button>
                     </form>

                     <div className="mt-8">
                         <div className="relative flex items-center justify-center mb-8">
                             <div className="absolute inset-0 h-px bg-white/5 w-full" />
                             <span className="relative z-10 bg-surface-2 px-4 text-[9px] uppercase tracking-widest text-text-muted font-bold">Or continue with</span>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                             <button className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-xl hover:bg-white/5 transition-all text-text-primary text-[10px] uppercase font-bold tracking-widest">
                                 Google
                             </button>
                             <button className="flex items-center justify-center gap-2 py-3 border border-white/5 rounded-xl hover:bg-white/5 transition-all text-text-primary text-[10px] uppercase font-bold tracking-widest">
                                 Github
                             </button>
                         </div>
                     </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                        New to ROAM PK? <Link to="/register" className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all">Create an Account</Link>
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default LoginPage;
