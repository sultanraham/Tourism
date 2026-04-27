import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Map, Zap, Users, Wallet, 
    Sparkles, ArrowRight, ArrowLeft, 
    Star, Clock, Wind, Target, Terminal as TerminalIcon,
    Compass, Shield, Globe, Cpu, Activity, Layout, Hotel, Utensils
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const VIBES = [
  { id: 'adventure', label: 'Neural Adventure', icon: <Compass size={24} />, desc: 'Peaks, treks, and hidden trails.' },
  { id: 'relax', label: 'Zen Equilibrium', icon: <Wind size={24} />, desc: 'Lakeside resorts and slow walks.' },
  { id: 'food', label: 'Culinary Genesis', icon: <Target size={24} />, desc: 'Street food and traditional feasts.' },
  { id: 'history', label: 'Temporal Journey', icon: <TerminalIcon size={24} />, desc: 'Forts, ruins, and local stories.' },
];

const BUDGETS = [
  { id: 'backpacker', label: 'Efficient', desc: 'Optimized for local exploration' },
  { id: 'mid', label: 'Balanced', desc: 'Premium comfort & private access' },
  { id: 'luxury', label: 'Elite Vantage', desc: 'Ultimate luxury & exclusive curations' },
];

const ItineraryPlannerPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    duration: 5,
    vibe: 'adventure',
    budget: 'mid',
    groupSize: 'solo'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  // Automated Hand-off from Chat
  useEffect(() => {
    const pending = localStorage.getItem('pending_trip');
    if (pending) {
      try {
        const { city, days } = JSON.parse(pending);
        setFormData(prev => ({ ...prev, destination: city, duration: parseInt(days) }));
        localStorage.removeItem('pending_trip');
        runSynthesis(city, days);
      } catch (e) {
        console.error("Handoff Error:", e);
      }
    }
  }, []);

  const nextStep = () => {
    if (step === 1 && !formData.destination) {
        toast.error("Please select a sector");
        return;
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const runSynthesis = async (pCity, pDays) => {
    setIsGenerating(true);
    setItinerary(null);
    const finalCity = pCity || formData.destination;
    const finalDays = pDays || formData.duration;
    
    const prompt = `Generate a cinematic ${finalDays}-day travel itinerary for ${finalCity}, Pakistan. Style: ${formData.vibe}. Budget: ${formData.budget}. 
    Response MUST be a JSON object: { "title": "...", "intro": "...", "days": [{ "title": "...", "activities": [], "weather": "..." }] }`;

    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey) throw new Error("API Key missing");

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: 'You are an elite travel concierge.' }, { role: 'user', content: prompt }],
                temperature: 0.6,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        const aiResponse = JSON.parse(data.choices[0].message.content);
        setItinerary(aiResponse);
        toast.success("Synthesis Complete!");
    } catch (error) {
        console.error(error);
        toast.error("Neural Error. Please check connection.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSynthesis();
  };

  return (
    <div className="min-h-screen bg-[#080c0a] text-text-primary py-24 px-6 lg:px-24 relative overflow-hidden font-[Lustria]">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative z-10">
            <AnimatePresence mode="wait">
                
                {/* STAGE 1: FORM */}
                {!itinerary && !isGenerating && (
                    <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto">
                        <header className="text-center mb-16">
                             <div className="flex justify-center mb-6">
                                <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <Cpu size={14} className="text-accent animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">Neural Planner Active</span>
                                </div>
                             </div>
                             <h1 className="font-display text-5xl md:text-8xl text-text-primary leading-[0.9] mb-8 uppercase tracking-tighter">Architect Your <br /> <span className="italic text-accent">Vantage Trip</span></h1>
                        </header>

                        <div className="flex justify-center gap-4 mb-16">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= i ? 'bg-accent w-12' : 'bg-white/10'}`} />
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 md:p-20 shadow-2xl overflow-hidden">
                            {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                    <div className="text-center space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 block">Protocol 01: Destination & Duration</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                            {['Hunza', 'Skardu', 'Lahore', 'Karachi', 'Swat', 'Chitral', 'Murree', 'Gwadar'].map(d => (
                                                <button key={d} type="button" onClick={() => setFormData({...formData, destination: d})}
                                                    className={`p-6 rounded-[2rem] border transition-all duration-500 ${formData.destination === d ? 'bg-accent text-surface border-accent' : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10'}`}>
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{d}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="px-10 space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 block text-center">Temporal Length: {formData.duration} Cycles</label>
                                        <input type="range" min="1" max="14" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full accent-accent h-1.5 bg-white/10 rounded-full appearance-none" />
                                    </div>
                                    <div className="flex justify-center pt-8">
                                        <button type="button" onClick={nextStep} className="bg-accent text-surface px-16 py-5 rounded-2xl flex items-center gap-4 text-[12px] uppercase font-black tracking-[0.3em] shadow-2xl">Proceed <ArrowRight size={18} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 block text-center">Protocol 02: Experience Vibe</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {VIBES.map(v => (
                                            <button key={v.id} type="button" onClick={() => { setFormData({...formData, vibe: v.id}); nextStep(); }}
                                                className={`flex items-center gap-8 p-8 rounded-[2.5rem] border text-left transition-all ${formData.vibe === v.id ? 'bg-accent/10 border-accent' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100'}`}>
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${formData.vibe === v.id ? 'bg-accent text-surface' : 'bg-white/5 text-text-muted'}`}>{v.icon}</div>
                                                <div>
                                                    <h4 className="text-[13px] font-black uppercase tracking-widest">{v.label}</h4>
                                                    <p className="text-[10px] opacity-60 mt-1 uppercase">{v.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-center pt-8">
                                        <button type="button" onClick={prevStep} className="text-text-muted hover:text-accent text-[10px] uppercase font-bold tracking-widest mr-8">Back</button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 block text-center">Protocol 03: Budget Synthesis</label>
                                    <div className="flex flex-col gap-4">
                                        {BUDGETS.map(b => (
                                            <button key={b.id} type="button" onClick={() => setFormData({...formData, budget: b.id})}
                                                className={`flex items-center justify-between p-10 rounded-[2.5rem] border transition-all ${formData.budget === b.id ? 'bg-accent/10 border-accent shadow-2xl' : 'bg-white/[0.02] border-white/5 opacity-40 hover:opacity-100'}`}>
                                                <div className="text-left flex items-center gap-8">
                                                    <div className={`w-4 h-4 rounded-full border-4 ${formData.budget === b.id ? 'border-accent' : 'border-white/10'}`} />
                                                    <div>
                                                        <h4 className="text-sm font-black uppercase tracking-widest">{b.label}</h4>
                                                        <p className="text-[10px] opacity-40 mt-1 uppercase">{b.desc}</p>
                                                    </div>
                                                </div>
                                                {formData.budget === b.id && <Zap size={20} className="text-accent animate-pulse" />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center pt-8">
                                        <button type="button" onClick={prevStep} className="text-text-muted hover:text-accent text-[10px] uppercase font-bold tracking-widest">Back</button>
                                        <button type="submit" className="bg-accent text-surface px-16 py-6 rounded-2xl flex items-center gap-4 text-[14px] font-black uppercase tracking-[0.4em] shadow-2xl">Start Synthesis <Sparkles size={20} /></button>
                                    </div>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                )}

                {/* STAGE 2: LOADING */}
                {isGenerating && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[60vh] flex flex-col items-center justify-center text-center p-12">
                        <div className="relative w-32 h-32 mb-12">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-b-2 border-accent rounded-full" />
                            <div className="absolute inset-4 bg-accent/5 rounded-full flex items-center justify-center text-accent animate-pulse"><Cpu size={48} /></div>
                        </div>
                        <h2 className="font-display text-5xl text-text-primary mb-4 uppercase tracking-tighter">Crafting Neural Core...</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 animate-pulse">Syncing with Groq Intelligence Llama 3.3</p>
                    </motion.div>
                )}

                {/* STAGE 3: RESULT */}
                {itinerary && !isGenerating && (
                    <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 pb-32">
                        <div className="relative bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-12 md:p-20 flex flex-col md:flex-row md:items-end justify-between gap-12 overflow-hidden shadow-2xl">
                            <div className="max-w-2xl relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Activity size={16} /></div>
                                    <span className="text-accent font-heading text-[10px] uppercase tracking-[0.5em] font-black">Expedition Dossier</span>
                                </div>
                                <h1 className="font-display text-6xl md:text-8xl text-text-primary leading-[0.9] mb-8">{itinerary.title}</h1>
                                <p className="text-text-muted text-lg sm:text-xl italic font-display border-l-2 border-accent/40 pl-8 opacity-80">{itinerary.intro}</p>
                            </div>
                            <button onClick={() => setItinerary(null)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-white/10 transition-all relative z-10">New Protocol</button>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                            {itinerary.days.map((day, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative pl-12">
                                    <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-white/10" />
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-surface border border-accent flex items-center justify-center z-10 shadow-[0_0_20px_rgba(212,160,23,0.3)]">
                                        <span className="text-[10px] font-black text-accent">{idx + 1}</span>
                                    </div>
                                    <div className="bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-3xl rounded-[3rem] border border-white/5 p-10 md:p-16 transition-all duration-700">
                                        <div className="flex flex-col gap-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
                                                <h3 className="font-heading text-2xl text-text-primary uppercase tracking-[0.1em]">{day.title}</h3>
                                                <div className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-3"><Wind size={14} /> {day.weather} Phase</div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {day.activities.map((act, i) => (
                                                    <div key={i} className="flex gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 transition-all">
                                                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-accent shrink-0"><Layout size={16} /></div>
                                                        <p className="text-sm md:text-base text-text-primary/70 leading-relaxed font-[Lustria]">{act}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
};

export default ItineraryPlannerPage;
