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
            className={`glass-card p-10 group transition-all duration-500 relative overflow-hidden ${unlocked ? 'border-[#FF6B00]/40 bg-[#FF6B00]/5' : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}
        >
            {/* Status Badge */}
            <div className={`absolute top-8 right-8 flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black italic tracking-widest uppercase ${unlocked ? 'bg-[#FF6B00] text-black shadow-[0_0_20px_rgba(255,107,0,0.3)]' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                {unlocked ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {unlocked ? 'UNLOCKED' : `$${milestone.target / 1000}k TARGET`}
            </div>

            <div className="flex items-start gap-8">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 ${unlocked ? 'bg-[#FF6B00] text-black rotate-3 shadow-[0_15px_30px_rgba(255,107,0,0.2)]' : 'bg-white/5 text-white/20'}`}>
                    {unlocked ? <Unlock className="w-8 h-8" /> : milestone.icon}
                </div>

                <div className="space-y-2">
                    <h3 className={`text-3xl font-black italic tracking-tight uppercase transition-colors ${unlocked ? 'text-white' : 'text-white/40'}`}>
                        {milestone.title}
                    </h3>
                    <p className={`text-base font-medium transition-colors ${unlocked ? 'text-white/60' : 'text-white/20'}`}>
                        {milestone.description}
                    </p>
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
