import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, Map, Zap, Users, Wallet, 
    Sparkles, ArrowRight, ArrowLeft, 
    Star, Clock, Wind, Target, Terminal as TerminalIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

import toast from 'react-hot-toast';
import { HOTELS_DATA } from '../../data/places';

const VIBES = [
  { id: 'adventure', label: 'High Adventure', icon: <Map size={24} />, desc: 'Peaks, treks, and hidden trails.' },
  { id: 'relax', label: 'Zen & Leisure', icon: <Wind size={24} />, desc: 'Lakeside resorts and slow walks.' },
  { id: 'food', label: 'Culinary Trail', icon: <Target size={24} />, desc: 'Street food and traditional feasts.' },
  { id: 'history', label: 'Cultural Deep-dive', icon: <TerminalIcon size={24} />, desc: 'Forts, ruins, and local stories.' },
];

const BUDGETS = [
  { id: 'backpacker', label: 'Classic', desc: 'Standard & Local Experience' },
  { id: 'mid', label: 'Elegance', desc: 'Comfort & Private Access' },
  { id: 'luxury', label: 'Elite', desc: 'Premium Resorts & Curator' },
];

const ItineraryPlannerPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    duration: 7,
    vibe: 'adventure',
    budget: 'mid',
    groupSize: 'solo'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const prompt = `Generate a highly professional and cinematic ${formData.duration}-day travel itinerary for ${formData.destination}, Pakistan. 
    Travel Style: ${formData.vibe}
    Budget Level: ${formData.budget}
    Focus on: ${VIBES.find(v => v.id === formData.vibe)?.desc}
    
    Response MUST be a JSON object with this exact structure:
    {
        "title": "A short poetic title for the trip",
        "intro": "A 1-sentence poetic intro",
        "days": [
            {
                "title": "Day theme title (e.g. The Arrival)",
                "activities": ["Activity 1 with a short detail", "Activity 2", "Activity 3"],
                "weather": "Sunny/Breezy/Chilly"
            }
        ]
    }
    Only return the JSON. No conversational text.`;

    try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') throw new Error("Missing API Key");

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'system', content: 'You are an elite travel concierge for Tourism PK.' }, { role: 'user', content: prompt }],
                temperature: 0.7,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        const aiResponse = JSON.parse(data.choices[0].message.content);
        
        setItinerary(aiResponse);
        toast.success("AI Itinerary Crafted!");
    } catch (error) {
        console.warn("AI Generation Fallback Triggered:", error.message);
        
        // Intelligent Fallback 
        const dest = formData.destination;
        const vibe = formData.vibe;
        
        const localData = {
            'Hunza': {
                title: 'High Altitude Serenity',
                intro: 'A spiritual and visual ascent into the peaks of Rakaposhi and Ultar.',
                activities: [
                    ['Morning arrival in Gilgit and drive to Hunza', 'Stop at Rakaposhi view point', 'Explore Karimabad Market'],
                    ['Visit Altit and Baltit Forts', 'Sunset at Eagle\'s Nest', 'Local apricot cake workshop'],
                    ['Drive to Attabad Lake', 'Jet ski and boat tour', 'Passu Cones photography'],
                    ['Visit Hussaini Suspension Bridge', 'Treck to Passu Glacier', 'Stargazing at Passu']
                ]
            },
            'Skardu': {
                title: 'Land of Giants',
                intro: 'Confront the raw majesty of K2 and the cold deserts of Baltistan.',
                activities: [
                    ['Arrival in Skardu and visit Upper Kachura Lake', 'Hike to Marsur Rock', 'Dinner at Shangrila Resort'],
                    ['Drive to Shigar Valley', 'Explore Shigar Fort', 'Stroll through local organic farms'],
                    ['Visit Deosai Plains', 'Wildlife spotting and camping', 'Sheosar Lake visit'],
                    ['Visit Cold Desert (Sarfaranga)', 'ATV racing on sand dunes', 'Local Balti music night']
                ]
            }
        };

        const template = localData[dest] || { 
            title: `The Ultimate ${dest} Escape`, 
            intro: `An elite ${vibe} journey through the heart of ${dest}.`,
            activities: [
                ['Arrival and check-in', 'Explore local traditional markets', 'Sunset tea at a panoramic spot'],
                ['Visit historical landmarks', 'Traditional lunch with local experts', 'Evening cultural performance']
            ] 
        };

        const generatedDays = Array.from({ length: parseInt(formData.duration) }).map((_, i) => ({
            title: template.activities[i % template.activities.length][0],
            activities: template.activities[i % template.activities.length],
            weather: ['Sunny', 'Breezy', 'Chilly', 'Cloudy'][Math.floor(Math.random() * 4)]
        }));

        setItinerary({
            title: template.title,
            intro: template.intro,
            days: generatedDays
        });
        
        toast.success("Itinerary Generated by Local Intelligence");
    } finally {
        setIsGenerating(false);
    }
  };

  const ProgressBanner = () => (
    <div className="flex items-center gap-4 mb-16 max-w-lg mx-auto">
        {[1, 2, 3].map(i => (
            <div key={i} className="flex-grow flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-heading transition-all ${step >= i ? 'bg-accent text-surface' : 'bg-surface-2 border border-white/5 text-text-muted'}`}>
                    {i}
                </div>
                {i < 3 && <div className={`flex-grow h-0.5 rounded-full ${step > i ? 'bg-accent' : 'bg-surface-2'}`} />}
            </div>
        ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface py-20 px-6 lg:px-24">
        <div className="max-w-[1440px] mx-auto">
            
            <AnimatePresence mode="wait">
                {!itinerary && !isGenerating ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                             <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Plan Your Pakistan Trip</span>
                             <h1 className="font-display text-4xl md:text-5xl lg:text-7xl text-text-primary leading-tight">
                                Let's Build Your <br /> <span className="italic text-accent">Dream Itinerary</span>
                             </h1>
                        </div>

                        <ProgressBanner />

                        <form onSubmit={handleSubmit} className="bg-surface-2 rounded-[3rem] border border-white/5 p-10 md:p-16 shadow-2xl">
                             
                             {step === 1 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                     <div className="space-y-6">
                                        <h3 className="font-heading text-xl text-text-primary flex items-center gap-3">
                                            <Map size={24} className="text-accent" /> Where are we heading?
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {['Hunza', 'Skardu', 'Swat', 'Lahore', 'Karachi', 'Chitral'].map(dest => (
                                                <button
                                                    key={dest}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, destination: dest})}
                                                    className={`p-6 rounded-2xl border transition-all text-center ${formData.destination === dest ? 'bg-primary/20 border-accent text-accent shadow-lg shadow-accent/10' : 'bg-surface-3 border-white/5 text-text-muted hover:border-white/20'}`}
                                                >
                                                    <span className="text-[12px] font-bold uppercase tracking-widest">{dest}</span>
                                                </button>
                                            ))}
                                        </div>
                                     </div>

                                     <div className="space-y-6">
                                        <h3 className="font-heading text-xl text-text-primary flex items-center gap-3">
                                            <Calendar size={24} className="text-accent" /> Duration: <span className="text-accent italic">{formData.duration} Days</span>
                                        </h3>
                                        <input 
                                            type="range" min="1" max="14" step="1"
                                            className="w-full h-1 bg-surface rounded-full appearance-none accent-accent cursor-pointer"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        />
                                        <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-widest font-heading font-bold">
                                            <span>Quick Escape</span>
                                            <span>Grand Tour</span>
                                        </div>
                                     </div>

                                     <div className="flex justify-end pt-8">
                                        <button type="button" onClick={nextStep} className="btn-accent px-12 py-4 flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest group">
                                            Next <ArrowRight size={14} className="group-hover:translate-x-1" />
                                        </button>
                                     </div>
                                </motion.div>
                             )}

                             {step === 2 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                     <div className="space-y-6">
                                        <h3 className="font-heading text-xl text-text-primary flex items-center gap-3">
                                            <Zap size={24} className="text-accent" /> What's your vibe?
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {VIBES.map(v => (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, vibe: v.id})}
                                                    className={`flex items-center gap-6 p-6 rounded-[2rem] border text-left transition-all ${formData.vibe === v.id ? 'bg-primary/20 border-accent/40 shadow-xl' : 'bg-surface-3 border-white/5 grayscale hover:grayscale-0'}`}
                                                >
                                                    <div className={`p-4 rounded-xl ${formData.vibe === v.id ? 'bg-accent text-surface' : 'bg-surface text-text-muted'}`}>{v.icon}</div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-text-primary">{v.label}</h4>
                                                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-heading">{v.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                     </div>

                                     <div className="flex justify-between pt-8">
                                        <button type="button" onClick={prevStep} className="text-text-muted hover:text-text-primary flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all">
                                            <ArrowLeft size={14} /> Back
                                        </button>
                                        <button type="button" onClick={nextStep} className="btn-accent px-12 py-4 flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest group">
                                            Next <ArrowRight size={14} className="group-hover:translate-x-1" />
                                        </button>
                                     </div>
                                </motion.div>
                             )}

                             {step === 3 && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                                     <div className="space-y-6">
                                        <h3 className="font-heading text-xl text-text-primary flex items-center gap-3">
                                            <Wallet size={24} className="text-accent" /> Budget Expectation?
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {BUDGETS.map(b => (
                                                <button
                                                    key={b.id}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, budget: b.id})}
                                                    className={`flex items-center justify-between p-8 rounded-2xl border transition-all ${formData.budget === b.id ? 'bg-accent/10 border-accent shadow-lg shadow-accent/5' : 'bg-surface-3 border-white/5 opacity-50 hover:opacity-100'}`}
                                                >
                                                    <div className="text-left">
                                                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">{b.label}</h4>
                                                        <p className="text-[10px] text-text-muted mt-1 uppercase font-heading tracking-widest">{b.desc}</p>
                                                    </div>
                                                    {formData.budget === b.id && <Sparkles size={20} className="text-accent animate-pulse" />}
                                                </button>
                                            ))}
                                        </div>
                                     </div>

                                     <div className="flex justify-between pt-8">
                                        <button type="button" onClick={prevStep} className="text-text-muted hover:text-text-primary flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all">
                                            <ArrowLeft size={14} /> Back
                                        </button>
                                        <button type="submit" className="btn-accent px-12 py-5 flex items-center gap-4 text-[12px] uppercase font-bold tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(212,160,23,0.3)]">
                                            Craft My Itinerary <Sparkles size={16} />
                                        </button>
                                     </div>
                                </motion.div>
                             )}

                        </form>
                    </motion.div>
                ) : isGenerating ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-40 space-y-10"
                    >
                         <div className="relative w-40 h-40">
                             <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-b-2 border-accent rounded-full"
                             />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <Sparkles size={48} className="text-accent animate-pulse" />
                             </div>
                         </div>
                         <div className="text-center space-y-4">
                             <h2 className="font-display text-4xl text-text-primary">Crafting Perfection...</h2>
                             <p className="text-text-muted text-[10px] uppercase tracking-[0.4em] font-heading font-bold animate-pulse">Consulting Our Northern Experts</p>
                         </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-12"
                    >
                        {/* Result Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
                            <div className="max-w-xl">
                                <span className="text-accent font-heading text-[10px] uppercase tracking-[0.3em] mb-4 inline-block">Your Curated Escape</span>
                                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary leading-tight">{itinerary.title}</h1>
                                {itinerary.intro && <p className="text-accent/80 text-xs sm:text-sm mt-4 italic font-body">{itinerary.intro}</p>}
                                <p className="text-text-muted text-[10px] mt-6 uppercase tracking-widest font-heading font-bold flex items-center gap-2">
                                     <Sparkles size={12} className="text-accent" /> {BUDGETS.find(b => b.id === formData.budget)?.label} Experience · {formData.duration} Days
                                 </p>
                            </div>
                            <div className="flex gap-3 sm:gap-4 w-full md:w-auto">
                                <button className="flex-grow md:flex-grow-0 px-6 sm:px-8 py-3 bg-surface-2 border border-white/5 rounded-xl text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-text-primary hover:border-accent transition-all">
                                     Save Plan
                                </button>
                                <button onClick={() => setItinerary(null)} className="flex-grow md:flex-grow-0 btn-accent px-6 sm:px-8 py-3 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest">
                                     Re-Plan
                                </button>
                            </div>
                        </div>

                        {/* Itinerary Timeline */}
                        <div className="space-y-4 sm:space-y-6">
                            {itinerary.days.map((day, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-8 sm:pl-12 pb-8 sm:pb-12 border-l border-white/5 last:border-0"
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-surface border-2 border-accent flex items-center justify-center z-10 scale-75 sm:scale-100">
                                        <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#D4A017]" />
                                    </div>
                                    
                                    <div className="bg-surface-2/40 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 p-6 sm:p-10 md:p-12 hover:border-accent/20 transition-all flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                                        <div className="flex-grow space-y-5 sm:space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <h3 className="font-heading text-base sm:text-lg md:text-xl text-text-primary uppercase tracking-widest">Day {idx + 1}: <span className="text-accent italic ml-1 sm:ml-2">{day.title}</span></h3>
                                                <div className="w-fit flex items-center gap-2 text-[8px] sm:text-[10px] text-accent uppercase font-bold tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                                                    <Wind size={10} /> {day.weather}
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 sm:space-y-4">
                                                {day.activities.map((act, i) => (
                                                    <div key={i} className="flex gap-3 sm:gap-4 group">
                                                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-surface flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-surface transition-all">
                                                            <Star size={10} className={i % 2 === 0 ? "fill-current" : ""} />
                                                        </div>
                                                        <p className="text-xs sm:text-sm md:text-base text-text-primary/70 font-body group-hover:text-text-primary transition-colors">{act}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="w-full lg:w-[250px] space-y-4">
                                            <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
                                                 <div className="flex items-center gap-2 text-[8px] sm:text-[10px] uppercase tracking-widest text-text-muted font-heading">
                                                    <Clock size={10} /> Booking Insight
                                                 </div>
                                                 {(() => {
                                                     const relevantHotel = HOTELS_DATA?.find(h => h.destination_slug === formData.destination.toLowerCase()) || { slug: 'shangrila-resort', name: 'Premium Local Stay' };
                                                     return (
                                                         <Link to={`/hotels/${relevantHotel.slug}`} className="block p-3 bg-surface-2 rounded-xl border border-white/5 hover:border-accent transition-all">
                                                             <p className="text-[10px] sm:text-xs font-bold text-text-primary">{relevantHotel.name}</p>
                                                             <p className="text-[8px] sm:text-[9px] text-text-muted mt-1 uppercase underline underline-offset-2 decoration-accent">Recommended Stay</p>
                                                         </Link>
                                                     );
                                                 })()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Bottom */}
                        <div className="bg-accent/10 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-accent/20 p-8 sm:p-12 text-center md:text-left md:flex items-center justify-between gap-10 sm:gap-12">
                            <div>
                                <h3 className="font-display text-3xl sm:text-4xl text-text-primary mb-4">Loved this plan?</h3>
                                <p className="text-text-muted text-xs sm:text-sm font-body max-w-sm">Save it to your profile or share it with your travel buddies to start booking.</p>
                            </div>
                            <div className="flex gap-4 mt-8 md:mt-0 justify-center">
                                <button className="btn-accent px-8 sm:px-10 py-4 sm:py-5 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest shadow-2xl">Confirm & Book All</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    </div>
  );
};

export default ItineraryPlannerPage;
