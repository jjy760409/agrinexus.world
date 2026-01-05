'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

export default function OSHeader() {
    const { globalStats, isConnected, alerts, currentCluster, setCurrentCluster, currentSystem, setCurrentSystem } = useOSStore();
    const [currentTime, setCurrentTime] = useState('--:--:--');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }));
            setCurrentDate(now.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

    const handleBackToHome = () => {
        if (currentSystem) {
            setCurrentSystem(null);
        } else if (currentCluster) {
            setCurrentCluster(null);
        }
    };

    return (
        <header className="relative z-50 glass border-b border-white/10 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 md:px-6 py-3">
                {/* Left: Logo & Navigation */}
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    {(currentCluster || currentSystem) && (
                        <motion.button
                            onClick={handleBackToHome}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-[var(--primary-cyan)] transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ←
                        </motion.button>
                    )}

                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => { setCurrentCluster(null); setCurrentSystem(null); }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="relative w-10 h-10 md:w-12 md:h-12">
                            <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] opacity-20"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-1 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <span className="text-xl md:text-2xl">🌌</span>
                            </div>
                        </div>

                        <div className="hidden sm:block">
                            <h1 className="text-lg md:text-xl font-bold gradient-text font-[family-name:var(--font-orbitron)] tracking-wide">
                                AgriNexus World
                            </h1>
                            <div className="flex items-center gap-2">
                                <motion.span
                                    className="inline-block px-2 py-0.5 text-[0.6rem] font-bold tracking-wider rounded bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] text-[var(--bg-dark)]"
                                    animate={{ opacity: [1, 0.7, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    OS 3.0
                                </motion.span>
                                <span className="text-[0.6rem] text-white/40 font-[family-name:var(--font-orbitron)]">
                                    UNIVERSE
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Center: Global Stats */}
                <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[var(--primary-green)]">🔗</span>
                        <span className="text-xs text-white/60">시스템</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-sm text-white">
                            {globalStats.activeSystems}/{globalStats.totalSystems}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[var(--primary-cyan)]">📊</span>
                        <span className="text-xs text-white/60">효율</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-green)]">
                            {globalStats.globalEfficiency}%
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[var(--primary-purple)]">🧠</span>
                        <span className="text-xs text-white/60">AI 결정</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-sm text-white">
                            {globalStats.aiDecisions.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-[var(--status-success)]">⚡</span>
                        <span className="text-xs text-white/60">절감</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--status-success)]">
                            {globalStats.energySaved}%
                        </span>
                    </div>
                </div>

                {/* Right: Status & Time */}
                <div className="flex items-center gap-4">
                    {/* Alerts */}
                    <motion.div
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                    >
                        <span className="text-xl">🔔</span>
                        {unreadAlerts > 0 && (
                            <motion.span
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--status-danger)] text-[0.6rem] flex items-center justify-center font-bold"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                {unreadAlerts}
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Connection Status */}
                    <div className="hidden md:flex items-center gap-2">
                        <motion.span
                            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[var(--status-success)]' : 'bg-[var(--status-danger)]'}`}
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-xs text-white/60">
                            {isConnected ? '실시간' : '오프라인'}
                        </span>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                        <div className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--primary-cyan)] tracking-wider">
                            {currentTime}
                        </div>
                        <div className="text-[0.65rem] text-white/40 hidden md:block">
                            {currentDate}
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated border */}
            <motion.div
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--primary-green)] to-transparent"
                animate={{
                    background: [
                        'linear-gradient(90deg, transparent 0%, #00ff88 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, #00d4ff 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, #7b2fff 50%, transparent 100%)',
                        'linear-gradient(90deg, transparent 0%, #00ff88 50%, transparent 100%)',
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ width: '100%' }}
            />
        </header>
    );
}
