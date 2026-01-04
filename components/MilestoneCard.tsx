"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

type MilestoneCardProps = {
    milestone: {
        id: string;
        target: number;
        title: string;
        description: string;
        icon: React.ReactNode;
    };
    unlocked: boolean;
    idx: number;
};

export default function MilestoneCard({ milestone, unlocked, idx }: MilestoneCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 md:p-10 group transition-all duration-500 relative overflow-hidden bg-white ${unlocked ? 'border-[#FF6B00]/40' : 'grayscale hover:grayscale-0 contrast-75 opacity-80'}`}
        >
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black italic tracking-widest uppercase ${unlocked ? 'bg-[#FF6B00] text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]' : 'bg-gray-100 text-black/40 border border-black/5'}`}>
                {unlocked ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {unlocked ? 'UNLOCKED' : `$${milestone.target >= 1000 ? (milestone.target / 1000) + 'k' : milestone.target} TARGET`}
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center transition-all duration-500 flex-shrink-0 ${unlocked ? 'bg-[#FF6B00] text-black rotate-3 shadow-[0_15px_30px_rgba(255,107,0,0.2)]' : 'bg-gray-50 text-black/10'}`}>
                    {unlocked ? <Unlock className="w-6 h-6 md:w-8 md:h-8" /> : <div className="w-4 h-4 md:w-6 md:h-6 bg-current blur-[2px] opacity-20" />}
                </div>

                <div className="space-y-3 flex-1 w-full">
                    <h3 className={`text-2xl md:text-3xl font-black italic tracking-tight uppercase transition-colors ${unlocked ? 'text-black' : 'text-black/20'}`}>
                        {unlocked ? milestone.title : "REDACTED"}
                    </h3>
                    <div className="relative">
                        <p className={`text-sm md:text-base font-medium transition-colors ${unlocked ? 'text-black/60' : 'text-black/10'}`}>
                            {unlocked ? milestone.description : "Protocol directive masked until target acquisition confirmed."}
                        </p>
                        {!unlocked && (
                            <div className="absolute inset-0 bg-black/5 backdrop-blur-[4px] -m-1" />
                        )}
                    </div>
                </div>
            </div>

            {/* FEATURE PREVIEW AREA */}
            {unlocked && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-8 pt-8 border-t border-white/10"
                >
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between group/action cursor-pointer hover:bg-[#FF6B00]/10 transition-all">
                        <div className="flex items-center gap-4">
                            <Zap className="w-5 h-5 text-[#FF6B00]" />
                            <span className="text-[10px] font-black italic tracking-widest uppercase">Access {milestone.title} Control</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#FF6B00] group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
