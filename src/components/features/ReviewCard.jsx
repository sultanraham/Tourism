import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, MapPin, Calendar, Camera } from 'lucide-react';

const ReviewCard = ({ review }) => {
    const { user, rating, text, location, date, img, user_avatar } = review;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-surface-2 p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-xl group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-text-muted border border-white/5 overflow-hidden">
                        {user_avatar ? (
                            <img src={user_avatar} alt={user} className="w-full h-full object-cover" />
                        ) : (
                            <User size={18} className="opacity-20" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-text-primary uppercase tracking-widest">{user}</h4>
                        <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-heading font-bold mt-1">{date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-accent">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < rating ? "fill-accent" : "text-white/10"} />
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-accent uppercase font-bold tracking-widest">
                    <MapPin size={12} /> {location}
                </div>
                <p className="text-text-muted text-sm leading-relaxed font-body italic">"{text}"</p>
                
                {img && (
                    <div className="relative h-40 rounded-2xl overflow-hidden mt-4 group-hover:shadow-[0_10px_30px_-5px_rgba(212,160,23,0.2)] transition-all">
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white">
                             <Camera size={14} />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                 <button className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-text-muted hover:text-accent transition-colors">
                     <ThumbsUp size={14} /> Helpful
                 </button>
                 <button className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-text-muted hover:text-accent transition-colors">
                     <MessageSquare size={14} /> Reply
                 </button>
            </div>
        </motion.div>
    );
};

const User = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);

export default ReviewCard;
