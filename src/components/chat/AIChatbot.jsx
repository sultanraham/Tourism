import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Minimize2, Maximize2 } from 'lucide-react';
import useChatStore from '../../stores/chat.store';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const { messages, isStreaming, sendMessage } = useChatStore();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isStreaming]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;
        
        const userMsg = input;
        setInput('');
        await sendMessage(userMsg);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100]">
            
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-surface-2 text-accent rotate-90' : 'bg-accent text-surface'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger rounded-full border-2 border-surface animate-pulse" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="absolute bottom-20 right-0 w-[85vw] sm:w-[400px] h-[70vh] sm:h-[600px] bg-surface-2/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-accent/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-surface">
                                    <Sparkles size={20} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-text-primary text-sm font-heading font-bold uppercase tracking-widest">TOURISM PK AI</h3>
                                    <div className="flex items-center gap-1.5 text-[9px] text-accent font-bold uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" /> Online & Ready
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary"><Minimize2 size={16} /></button>
                        </div>

                        {/* Messages Board */}
                        <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-6 no-scrollbar custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center py-10 opacity-60">
                                     <Sparkles size={40} className="text-accent mx-auto mb-4 opacity-20" />
                                     <p className="text-xs text-text-muted uppercase tracking-widest">Ask me anything about <br />hotels, food, or routes in Pakistan.</p>
                                </div>
                            )}
                            
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] ${msg.role === 'user' ? 'bg-surface-3 text-text-muted' : 'bg-primary text-text-primary'}`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14}/>}
                                    </div>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed font-body ${msg.role === 'user' ? 'bg-accent text-surface' : 'bg-surface-3 text-text-primary/90'}`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isStreaming && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                                     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-text-primary"><Sparkles size={14} /></div>
                                     <div className="bg-surface-3 p-4 rounded-2xl flex gap-1 items-center">
                                         <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                         <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                         <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                                     </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-surface-3/50">
                             <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder="Type your question..."
                                    className="w-full bg-surface-2 border border-white/10 rounded-2xl px-6 py-4 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent transition-all pr-14"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isStreaming}
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim() || isStreaming}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent text-surface rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all hover:bg-accent-light"
                                >
                                    <Send size={18} />
                                </button>
                             </div>
                             <p className="text-[8px] text-text-muted text-center mt-4 uppercase tracking-widest opacity-40">AI-powered recommendations based on local insights</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AIChatbot;
