import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
    MessageSquare, X, Send, Sparkles, User, 
    Minimize2, Bot, Zap, Globe, Shield, 
    Compass, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../stores/chat.store';

const AIChatbot = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, isStreaming, sendMessage } = useChatStore();
    const scrollRef = useRef(null);

    const quickPrompts = [
        { icon: <Compass size={14} />, text: "Plan a 3-day trip to Lahore" },
        { icon: <Zap size={14} />, text: "Plan a Skardu adventure" },
        { icon: <Shield size={14} />, text: "Best hotels in Islamabad" },
        { icon: <Globe size={14} />, text: "I want to plan a custom trip" }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isStreaming]);

    const [isHandingOff, setIsHandingOff] = useState(false);

    const handleSend = async (val) => {
        const text = typeof val === 'string' ? val : input;
        if (!text.trim() || isStreaming) return;
        
        setInput('');
        const response = await sendMessage(text);
        
        // Handle direct navigation or automated planning hand-off
        if (response) {
            // Check for PLAN_TRIP command
            if (response.includes('[PLAN_TRIP:')) {
                const match = response.match(/\[PLAN_TRIP:(.*?)\|(.*?)\]/);
                if (match) {
                    const [_, city, days] = match;
                    setIsHandingOff(true);
                    // Save to localStorage for the planner to pick up
                    localStorage.setItem('pending_trip', JSON.stringify({ city, days }));
                    setTimeout(() => {
                        navigate('/planner');
                        setIsOpen(false);
                        setIsHandingOff(false);
                    }, 3000);
                }
            } else if (response.includes('[NAVIGATE:')) {
                const path = response.match(/\[NAVIGATE:(.*?)\]/)?.[1];
                if (path) {
                    setTimeout(() => {
                        navigate(path);
                        setIsOpen(false);
                    }, 1500);
                }
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] font-body">
            
            <LayoutGroup>
                {/* Toggle Button */}
                <motion.button
                    layout
                    whileHover={{ scale: 1.05, rotate: isOpen ? 90 : 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(212,160,23,0.3)] transition-all duration-500 overflow-hidden ${
                        isOpen ? 'bg-surface-2 text-accent border border-white/10' : 'bg-gradient-to-tr from-accent to-accent-light text-surface'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {isOpen ? <X size={28} /> : <Bot size={28} />}
                    {!isOpen && (
                        <span className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
                    )}
                </motion.button>

                {/* Chat Window */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
                            className="absolute bottom-24 right-0 w-[90vw] sm:w-[420px] h-[75vh] sm:h-[650px] flex flex-col"
                        >
                            <div className="relative h-full bg-[#0d1411]/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                                {/* Neural Glow Background */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_#D4A017]" />
                                
                                {/* Header */}
                                <div className="p-8 border-b border-white/[0.05] bg-white/[0.02] relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                                                    <img 
                                                        src="/logo.png" 
                                                        alt="Logo" 
                                                        className="w-8 h-8 object-contain"
                                                        onError={(e) => e.target.src = 'https://img.icons8.com/ios-filled/50/d4a017/mountain.png'}
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-[#0d1411]" />
                                            </div>
                                            <div>
                                                <h3 className="text-text-primary text-[11px] font-black uppercase tracking-[0.3em]">Tourism Guider</h3>
                                                <p className="text-[9px] text-accent font-bold uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse" /> AI Assistant Online
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-text-muted hover:text-text-primary transition-all">
                                                <Minimize2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Board */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative" ref={scrollRef}>
                    <AnimatePresence>
                        {isHandingOff && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-surface/90 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="relative w-24 h-24 mb-8">
                                    <motion.div 
                                        animate={{ rotate: 360 }} 
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-2 border-dashed border-accent/30 rounded-full"
                                    />
                                    <div className="absolute inset-2 bg-accent/10 rounded-full flex items-center justify-center">
                                        <Cpu className="text-accent animate-pulse" size={32} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-[Lustria] text-text-primary mb-2 tracking-tight">Neural Synthesis Active</h3>
                                <p className="text-[11px] font-[Lustria] text-text-muted uppercase tracking-[0.3em]">Preparing High-Fidelity Itinerary</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                                    {messages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center rotate-12 overflow-hidden shadow-2xl">
                                                    <img 
                                                        src="/logo.png" 
                                                        alt="Logo" 
                                                        className="w-12 h-12 object-contain -rotate-12"
                                                        onError={(e) => e.target.src = 'https://img.icons8.com/ios-filled/50/d4a017/mountain.png'}
                                                    />
                                                </div>
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                                                    className="absolute -inset-4 border border-dashed border-accent/20 rounded-full"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-text-primary text-sm font-black uppercase tracking-widest">Protocol Initialized</h4>
                                                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto opacity-60">I am your Tourism Guider. How shall we explore Pakistan today?</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-3 w-full">
                                                {quickPrompts.map((p, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ x: 5, backgroundColor: 'rgba(212,160,23,0.1)' }}
                                                        onClick={() => handleSend(p.text)}
                                                        className="flex items-center gap-4 px-5 py-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-[10px] text-text-primary/70 font-bold uppercase tracking-widest text-left transition-all"
                                                    >
                                                        <span className="text-accent">{p.icon}</span>
                                                        {p.text}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                                                msg.role === 'user' ? 'bg-surface-3 text-text-muted border border-white/10' : 'bg-accent/20 text-accent border border-accent/30'
                                            }`}>
                                                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16}/>}
                                            </div>
                                            <div className={`relative max-w-[90%] space-y-4 ${
                                                msg.role === 'user' 
                                                ? 'ml-auto' 
                                                : 'mr-auto'
                                            }`}>
                                                <div className={`p-5 rounded-[2.2rem] text-[13px] leading-[1.8] tracking-tight shadow-xl relative overflow-hidden transition-all duration-500 font-[Lustria] ${
                                                    msg.role === 'user' 
                                                    ? 'bg-accent text-surface font-black rounded-tr-none' 
                                                    : 'bg-white/[0.02] backdrop-blur-3xl text-text-primary border border-white/5 rounded-tl-none'
                                                }`}>
                                                    
                                                    {msg.content.split('\n').map((line, lIdx) => {
                                                        const cleanLine = line.replace(/\[NAVIGATE:.*?\]/g, '').replace(/\[PLAN_TRIP:.*?\]/g, '').replace(/\*\*/g, '').trim();
                                                        if (!cleanLine) return null;

                                                        // Robust Day Header Detection
                                                        const isDayHeader = /^(📅\s*)?DAY\s*\d+/i.test(cleanLine);
                                                        if (isDayHeader) {
                                                            return (
                                                                <div key={lIdx} className="my-6 border-l-4 border-accent pl-5 py-2 bg-white/5 rounded-r-2xl shadow-inner">
                                                                    <span className="text-accent font-[Lustria] font-black tracking-[0.2em] uppercase text-[11px] block">{cleanLine.toUpperCase()}</span>
                                                                </div>
                                                            );
                                                        }

                                                        // Data Entry - Stay/Dine
                                                        const isDataEntry = /^(🏨|🍴|STAY:|DINE:)/i.test(cleanLine);
                                                        if (isDataEntry) {
                                                            const isAvailable = !cleanLine.toLowerCase().includes('not available') && 
                                                                               !cleanLine.toLowerCase().includes('your own') && 
                                                                               !cleanLine.toLowerCase().includes('not listed');
                                                            return (
                                                                <div key={lIdx} className={`mt-3 p-4 rounded-2xl flex items-center gap-4 border transition-all ${isAvailable ? 'bg-accent/10 border-accent/40 shadow-lg' : 'bg-white/5 border-white/5 opacity-50 italic'}`}>
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isAvailable ? 'bg-accent text-surface shadow-lg shadow-accent/20' : 'bg-white/10 text-text-muted'}`}>
                                                                        {cleanLine.includes('🍴') || cleanLine.toLowerCase().includes('dine') ? <Zap size={16} /> : <Globe size={16} />}
                                                                    </div>
                                                                    <span className="text-[12px] font-[Lustria] font-medium tracking-wide">{cleanLine}</span>
                                                                </div>
                                                            );
                                                        }

                                                        return <p key={lIdx} className="mb-3 last:mb-0 opacity-90 font-[Lustria] leading-relaxed">{cleanLine}</p>;
                                                    })}

                                                    {msg.role !== 'user' && (
                                                        <div className="absolute top-4 right-4 opacity-10"><Bot size={16} /></div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {isStreaming && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                                             <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent"><Bot size={16} /></div>
                                             <div className="bg-white/[0.03] border border-white/5 p-5 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center">
                                                 <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                 <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                 <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                                             </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-8 border-t border-white/[0.05] bg-white/[0.01]">
                                     <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="Consult Tourism Guider..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-sm text-text-primary placeholder:text-text-muted/30 focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all pr-16 shadow-inner"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            disabled={isStreaming}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!input.trim() || isStreaming}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 bg-accent text-surface rounded-xl flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/20"
                                        >
                                            <Send size={20} />
                                        </button>
                                     </div>
                                     <div className="flex items-center justify-center gap-4 mt-6 opacity-20 group-hover:opacity-40 transition-opacity">
                                         <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-text-muted" />
                                         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-text-muted">Vantage Intelligence Protocol</p>
                                         <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-text-muted" />
                                     </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </LayoutGroup>

        </div>
    );
};

export default AIChatbot;
