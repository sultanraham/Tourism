import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-surface-2 rounded-2xl border border-white/5 overflow-hidden animate-pulse shadow-2xl">
            <div className="h-[280px] bg-white/5"></div>
            <div className="p-6 space-y-4">
                <div className="flex gap-2">
                    <div className="w-16 h-4 bg-white/5 rounded-full"></div>
                    <div className="w-16 h-4 bg-white/5 rounded-full"></div>
                </div>
                <div className="w-3/4 h-6 bg-white/10 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="w-full h-3 bg-white/5 rounded"></div>
                    <div className="w-5/6 h-3 bg-white/5 rounded"></div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <div className="space-y-2">
                         <div className="w-12 h-2 bg-white/5"></div>
                         <div className="w-20 h-4 bg-white/10"></div>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
