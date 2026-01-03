"use client";

import React from 'react';

export default function Philosophy() {
    return (
        <div className="max-w-2xl mx-auto py-20 px-0 space-y-24 border-t-2 border-dashed border-black/10">

            <div className="space-y-10">
                <h2 className="text-sm font-bold tracking-[0.5em] uppercase opacity-40">01 / Objective</h2>
                <div className="space-y-4 text-4xl font-bold tracking-tighter leading-[0.9]">
                    <p>Growth is not a gift.</p>
                    <p>Growth is a calculated result.</p>
                </div>
            </div>

            <div className="space-y-10">
                <h2 className="text-sm font-bold tracking-[0.5em] uppercase opacity-40">02 / Sovereignty</h2>
                <div className="space-y-8">
                    <p className="text-5xl font-bold tracking-tighter uppercase leading-[0.8]">consensus controls<br />the protocol</p>
                    <p className="text-5xl font-bold tracking-tighter uppercase leading-[0.8]">the interface<br />validates the pool</p>
                    <div className="pt-4 space-y-2">
                        <p className="text-lg font-bold opacity-40 uppercase">Human interference is a protocol violation</p>
                        <p className="text-2xl font-black uppercase underline decoration-4 underline-offset-8">Execution is deterministic. Not manual.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <h2 className="text-sm font-bold tracking-[0.5em] uppercase opacity-40">03 / Reality</h2>
                <div className="space-y-6 text-2xl font-bold leading-none tracking-tight">
                    <p className="italic opacity-60">"Trust is a human failure. I wanted progress to be an unchangeable sequence of logic gated by liquidity."</p>
                    <div className="space-y-2 pt-6">
                        <p className="uppercase">No validation without pressure.</p>
                        <p className="uppercase">No pressure without market survival.</p>
                    </div>
                    <p className="text-8xl font-black border-b-8 border-black pb-4 inline-block mt-8">LOGIC OVER ALL.</p>
                </div>
            </div>

            <div className="pt-20 border-t border-black/10 flex flex-col items-start gap-8">
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest max-w-sm leading-relaxed">
                    All conditions are enforced by code. If market cap drops, features can stop triggering. Nothing is guaranteed.
                </p>
            </div>
        </div>
    );
}
