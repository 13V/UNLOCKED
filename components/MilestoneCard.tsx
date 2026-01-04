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
            className={`p-6 md:p-10 transition-all duration-500 relative overflow-hidden flex flex-col justify-center min-h-[160px] md:min-h-[200px] ${unlocked ? 'bg-white text-black border-black' : 'bg-black text-white border-black'}`}
        >
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${unlocked ? 'bg-black text-white' : 'bg-white text-black'}`}>
                {unlocked ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {unlocked ? 'UNLOCKED' : `$${milestone.target >= 1000 ? (milestone.target / 1000) + 'k' : milestone.target} TARGET`}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    {unlocked && (
                        <div className="w-10 h-10 flex items-center justify-center border-2 border-black rounded-lg">
                            {milestone.icon}
                        </div>
                    )}
                    <h3 className={`text-2xl md:text-3xl font-bold uppercase tracking-tighter ${!unlocked && 'opacity-100'}`}>
                        {unlocked ? milestone.title : "REDACTED"}
                    </h3>
                </div>

                {unlocked ? (
                    <p className="text-sm md:text-base font-medium opacity-60 max-w-md italic">
                        {milestone.description}
                    </p>
                ) : (
                    <div className="h-4 w-32 bg-white/20 animate-pulse" />
                )}
            </div>
        </motion.div>
    );
}
