"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TXS = [
    "BOUGHT 1.2 SOL", "BOUGHT 0.5 SOL", "BOUGHT 5.0 SOL",
    "SOLD 0.2 SOL", "BOUGHT 10.0 SOL", "SWAP SUCCESS",
    "LIQUIDITY ADDED", "ORACLE SYNC", "NODE VERIFIED"
];

export default function GhostStream() {
    const [items, setItems] = useState<{ id: number; text: string; x: number }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setItems(prev => [
                ...prev.slice(-15),
                {
                    id: Date.now(),
                    text: TXS[Math.floor(Math.random() * TXS.length)],
                    x: Math.random() * 80 + 10 // Random horizontal position
                }
            ]);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <AnimatePresence>
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: '110vh' }}
                        animate={{ opacity: [0, 0.2, 0], y: '-10vh' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 15, ease: "linear" }}
                        style={{ left: `${item.x}%` }}
                        className="absolute text-[10px] font-black italic tracking-widest text-[#FF6B00]/30 uppercase whitespace-nowrap"
                    >
                        {item.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
