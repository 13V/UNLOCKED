"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  Zap,
  Shield,
  CheckCircle,
  Terminal,
  Cpu,
  RefreshCw,
  Layers,
  Search
} from 'lucide-react';
import MilestoneCard from '../components/MilestoneCard';
import HypeWall from '../components/HypeWall';
import Philosophy from '../components/Philosophy';

type Milestone = {
  id: string;
  target: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  featureKey: string;
};

const MILESTONES: Milestone[] = [
  {
    id: '1',
    target: 5000,
    title: "Spatial Infrastructure",
    description: "Spatial anchors and navigation nodes confirmed.",
    icon: <Layers className="w-5 h-5" />,
    featureKey: "nav"
  },
  {
    id: '2',
    target: 10000,
    title: "The Core Directive",
    description: "The logic behind the protocol is now exposed.",
    icon: <Search className="w-5 h-5" />,
    featureKey: "philosophy"
  },
  {
    id: '3',
    target: 20000,
    title: "Revenue Harvester",
    description: "Autonomous fee monitoring and capture synchronized.",
    icon: <Cpu className="w-5 h-5" />,
    featureKey: "bot"
  },
  {
    id: '4',
    target: 30000,
    title: "Dex Payment",
    description: "The creator fees will be used to Purchase the DexScreener Information.",
    icon: <RefreshCw className="w-5 h-5" />,
    featureKey: "dex"
  },
  {
    id: '5',
    target: 45000,
    title: "Supply Erosion",
    description: "Burn logic triggered by objective supply metrics.",
    icon: <Zap className="w-5 h-5" />,
    featureKey: "burn"
  },
  {
    id: '6',
    target: 75000,
    title: "Yield Distribution",
    description: "Harmonic Distribution. 50% of fees execute automated buybacks and burns, with the remaining 50% systematically airdropped to holders.",
    icon: <Shield className="w-5 h-5" />,
    featureKey: "airdrop"
  },
  {
    id: '7',
    target: 200000,
    title: "Community DAO",
    description: "System Sovereignty. The community governs treasury allocation into strategic blue-chip assets.",
    icon: <Layers className="w-5 h-5" />,
    featureKey: "dao"
  },
  {
    id: '8',
    target: 500000,
    title: "Alpha Group",
    description: "Unlock Alpha Group and be an insider.",
    icon: <CheckCircle className="w-5 h-5" />,
    featureKey: "alpha"
  }
];

export default function Home() {
  const [marketCap, setMarketCap] = useState(0);
  const [stats, setStats] = useState({ accruedFees: 0, walletBalance: 0, totalFeesClaimed: 0, totalTokensBurned: 0 });
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const mcRes = await fetch('/api/market-cap');
        const mcData = await mcRes.json();
        if (mcData.marketCap !== undefined) {
          setMarketCap(mcData.marketCap);
          setIsLive(true);
        }

        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (e) {
        console.error("Failed to fetch live data:", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getProgress = () => {
    const max = MILESTONES[MILESTONES.length - 1].target;
    return Math.min((marketCap / max) * 100, 100);
  };

  const isUnlocked = (target: number) => marketCap >= target;

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white antialiased">

      <div className="max-w-4xl mx-auto px-6 py-20 relative">

        {/* TOP STATUS BAR */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-32 gap-6">
          <AnimatePresence>
            {isUnlocked(5000) ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold tracking-tighter uppercase text-lg">Deterministic Void Protocol</span>
              </motion.div>
            ) : <div />}
          </AnimatePresence>

          <div className="flex items-center gap-4">
            {isLive && (
              <div className="flex items-center gap-2 px-4 py-1.5 border border-black rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Protocol Live
                  {marketCap < 69000 ? ' | Bonding Curve' : ' | DEX FEED'}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* HERO - DYNAMIC GATING */}
        <div className={`space-y-6 transition-all duration-1000 ${isUnlocked(5000) ? 'mb-20 md:mb-40' : 'h-[60vh] flex flex-col justify-center'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
              <Activity className="w-3 h-3" />
              <span>Market Cap Status</span>
            </div>
            <motion.h1
              key={marketCap}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="text-[15vw] lg:text-[12rem] font-bold tracking-tighter leading-none"
            >
              ${marketCap.toLocaleString()}
            </motion.h1>
          </div>

          <AnimatePresence>
            {!isUnlocked(5000) && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="font-bold uppercase tracking-widest text-xs">
                Scanning for protocol growth...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* PROGRESS BAR */}
        <AnimatePresence>
          {isUnlocked(5000) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 md:mb-40 space-y-4">
              <div className="flex justify-between font-bold text-[10px] uppercase tracking-widest">
                <span>Next Target: ${MILESTONES.find(m => m.target > marketCap)?.target.toLocaleString() || "MAX"}</span>
                <span>{Math.floor(getProgress())}%</span>
              </div>
              <div className="h-1 w-full bg-black/5">
                <motion.div initial={{ width: 0 }} animate={{ width: `${getProgress()}%` }} className="h-full bg-black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHILOSOPHY */}
        <AnimatePresence>
          {isUnlocked(10000) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 md:mb-40">
              <Philosophy />
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOT TERMINAL */}
        <AnimatePresence>
          {isUnlocked(20000) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-20 md:mb-40 border-2 border-black p-6 md:p-10 space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Terminal className="w-6 h-6" />
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">Deterministic Operations</h3>
                </div>
                <div className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest">Autonomous</div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 font-mono text-xs">
                <div className="space-y-4">
                  <p className="font-bold uppercase tracking-widest opacity-40">Protocol Metrics</p>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span>Accrued Fees</span>
                      <span className="font-bold">{stats.accruedFees.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span>Protocol Treasury</span>
                      <span className="font-bold">{stats.walletBalance.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span>Fees Claimed</span>
                      <span className="font-bold">{stats.totalFeesClaimed.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between border-b border-black/10 pb-2">
                      <span>Total Burned</span>
                      <span className="font-bold">{(stats.totalTokensBurned / 1e6).toFixed(2)}M TOKENS</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-bold uppercase tracking-widest opacity-40">Operational Intel</p>
                  <div className="space-y-1 opacity-80 h-[100px] overflow-hidden">
                    <p>[SCAN] Spatial anchors synchronized</p>
                    <p>[SCAN] {stats.accruedFees > 0.001 ? 'FEE_PRESSURE: HIGH' : 'HARVESTER: IDLE'}</p>
                    {stats.walletBalance > 0.05 && <p className="font-bold text-red-500 uppercase animate-pulse">[SCAN] BUYBACK_IMMINENT: PRESSURE_OVERLOAD</p>}
                    {isUnlocked(25000) && <p className="font-bold text-black uppercase">[LOG] Flywheel engaged: DEX Routing Active</p>}
                    {isUnlocked(30000) && <p className="font-bold text-black uppercase">[LOG] Erosion active: Supply Reduction Synced</p>}
                    {isUnlocked(50000) && <p className="font-bold text-black uppercase">[LOG] Yield routing: Holder base verification live</p>}
                    <p className="animate-pulse">_</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MILESTONE GRID */}
        <AnimatePresence>
          {isUnlocked(5000) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 border-t border-l border-black mb-20 md:mb-40">
              {MILESTONES.map((m, idx) => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  unlocked={isUnlocked(m.target)}
                  idx={idx}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMMUNITY HUB */}
        <AnimatePresence>
          {isUnlocked(5000) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-40 border-t border-black pt-20">
              <HypeWall />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
