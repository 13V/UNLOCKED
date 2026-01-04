"use client";

import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function HypeWall() {
    const [messages, setMessages] = useState([
        { id: 1, text: "PROTOCOL_STATE: OPTIMAL", author: "SYSTEM" },
        { id: 2, text: "Autonomous flywheel confirmed.", author: "ANON" },
        { id: 3, text: "No more fake roadmaps.", author: "HOLDER_0x42" }
    ]);
    const [input, setInput] = useState("");

    const send = () => {
        if (!input.trim()) return;
        setMessages([{ id: Date.now(), text: input.toUpperCase(), author: "USER" }, ...messages]);
        setInput("");
    };

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Community Feed</h2>
                <span className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em] hidden sm:block">Verified Holders Only</span>
            </div>

            <div className="border-t-2 border-black">
                {messages.map((m) => (
                    <div key={m.id} className="py-6 border-b border-black/10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-10">
                        <span className="text-lg md:text-xl font-bold tracking-tight">{m.text}</span>
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest sm:pt-2 shrink-0">{m.author}</span>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="SEND_INTEL..."
                    className="flex-1 border-2 border-black px-6 py-4 font-bold uppercase text-xs focus:ring-0 outline-none placeholder:opacity-20 bg-white text-black"
                />
                <button
                    onClick={send}
                    className="bg-black text-white px-10 font-bold uppercase text-xs hover:opacity-80 transition-opacity"
                >
                    Publish
                </button>
            </div>
        </div>
    );
}
