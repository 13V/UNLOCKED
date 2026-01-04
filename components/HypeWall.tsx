"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal, User } from 'lucide-react';

interface ChatMessage {
    id: number;
    text: string;
    author: string;
    timestamp: string;
}

export default function HypeWall() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [handle, setHandle] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedHandle = localStorage.getItem('unlocked_handle');
        if (savedHandle) setHandle(savedHandle);
        else {
            const randomID = Math.floor(1000 + Math.random() * 9000);
            setHandle(`OPERATIVE_${randomID}`);
        }

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat');
            const data = await res.json();
            setMessages(data.reverse()); // Show newest first
        } catch (e) {
            console.error("Failed to fetch intel:", e);
        }
    };

    const send = async () => {
        if (!input.trim() || !handle.trim()) return;

        localStorage.setItem('unlocked_handle', handle);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input, author: handle })
            });
            if (res.ok) {
                setInput("");
                fetchMessages();
            }
        } catch (e) {
            console.error("Failed to publish intel:", e);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-black/40">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Live Intelligence Feed</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase italic">Terminal_Chat</h2>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-right">Intel Signature</span>
                    <div className="flex items-center gap-2 border-b-2 border-black pb-1">
                        <User className="w-3 h-3" />
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value.toUpperCase())}
                            className="bg-transparent text-sm font-bold uppercase outline-none w-32 placeholder:opacity-20"
                            placeholder="SET_HANDLE"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t-2 border-black min-h-[400px] flex flex-col bg-black/5 p-4 md:p-8 backdrop-blur-sm">
                <div className="flex-1 space-y-6 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="animate-pulse flex items-center gap-2 text-black/20 font-bold uppercase text-xs">
                            <span className="w-2 h-2 bg-black/20 rounded-full" />
                            Establishing encrypted connection...
                        </div>
                    ) : (
                        messages.map((m, idx) => (
                            <div key={m.id} className={`flex flex-col gap-1 ${idx === 0 ? 'animate-in fade-in slide-in-from-left-4 duration-500' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.5 tracking-tighter shrink-0">
                                        {m.author}
                                    </span>
                                    <span className="text-[8px] font-bold opacity-20 tracking-widest uppercase">
                                        {new Date(m.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="text-lg md:text-xl font-bold tracking-tight uppercase leading-none border-l-2 border-black/10 pl-4 py-1">
                                    {m.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-8 border-t border-black/10">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder="ENTER_INTEL_STREAM..."
                        className="flex-1 border-2 border-black px-6 py-4 font-bold uppercase text-sm focus:bg-white outline-none placeholder:opacity-20 bg-transparent text-black transition-colors"
                    />
                    <button
                        onClick={send}
                        className="bg-black text-white px-12 py-4 font-bold uppercase text-sm hover:invert transition-all flex items-center justify-center gap-2 group"
                    >
                        Publish_Intel
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-bold opacity-20 uppercase tracking-[0.4em]">
                <span>Status: Fully_Functional</span>
                <span>Active_Nodes: {messages.length + 12}</span>
                <span className="hidden sm:block">No_Censorship_Mode: On</span>
            </div>
        </div>
    );
}
