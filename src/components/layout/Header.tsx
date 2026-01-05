'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Radio, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

const modules = [
    { id: 'ai-brain' as const, icon: Brain, label: 'AI Brain', emoji: '🧠' },
    { id: 'iot-nexus' as const, icon: Radio, label: 'IoT Nexus', emoji: '📡' },
    { id: 'smart-control' as const, icon: Zap, label: 'Smart Control', emoji: '⚡' },
];

export default function Header() {
    const { currentModule, setCurrentModule, isConnected } = useStore();
    const [currentTime, setCurrentTime] = useState('--:--:--');

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="relative z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 glass border-b border-white/10 backdrop-blur-xl">
            {/* Logo Section */}
            <motion.div
                className="flex items-center gap-3 md:gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo Icon */}
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                    <motion.svg
                        viewBox="0 0 60 60"
                        className="w-full h-full"
                        animate={{
                            filter: [
                                'drop-shadow(0 0 10px #00ff88)',
                                'drop-shadow(0 0 20px #00d4ff)',
                                'drop-shadow(0 0 10px #00ff88)',
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00ff88" />
                                <stop offset="50%" stopColor="#00d4ff" />
                                <stop offset="100%" stopColor="#7b2fff" />
                            </linearGradient>
                        </defs>
                        <circle cx="30" cy="30" r="28" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />
                        <path d="M30 10 L30 50 M20 20 Q30 30 20 40 M40 20 Q30 30 40 40" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
                        <circle cx="30" cy="30" r="6" fill="url(#logoGradient)" />
                    </motion.svg>
                </div>

                {/* Logo Text */}
                <div className="hidden sm:block">
                    <h1 className="text-lg md:text-xl font-bold gradient-text font-[family-name:var(--font-orbitron)] tracking-wide">
                        AgriNexus World
                    </h1>
                    <motion.span
                        className="inline-block px-2 py-0.5 text-[0.65rem] font-bold tracking-wider rounded bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] text-[var(--bg-dark)]"
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        3.0 ULTRA
                    </motion.span>
                </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex gap-1 md:gap-2">
                {modules.map((module) => {
                    const Icon = module.icon;
                    const isActive = currentModule === module.id;

                    return (
                        <motion.button
                            key={module.id}
                            onClick={() => setCurrentModule(module.id)}
                            className={`
                relative flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5
                rounded-full text-sm font-medium transition-all duration-300
                border backdrop-blur-sm
                ${isActive
                                    ? 'bg-gradient-to-r from-[var(--primary-green)]/20 to-[var(--primary-cyan)]/20 border-[var(--primary-green)] text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-[var(--primary-cyan)] hover:text-white hover:-translate-y-0.5'
                                }
              `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-base md:text-lg">{module.emoji}</span>
                            <span className="hidden md:inline font-[family-name:var(--font-orbitron)] tracking-wide text-xs">
                                {module.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary-green)]/10 to-[var(--primary-cyan)]/10"
                                    layoutId="activeModule"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Status Section */}
            <motion.div
                className="hidden lg:flex items-center gap-4 md:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Connection Status */}
                <div className="flex items-center gap-2 text-sm text-white/70">
                    <motion.span
                        className={`status-dot ${isConnected ? 'online' : 'bg-red-500'}`}
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>{isConnected ? '시스템 정상' : '연결 끊김'}</span>
                </div>

                {/* Current Time */}
                <div className="font-[family-name:var(--font-orbitron)] text-base md:text-lg tracking-[3px] text-[var(--primary-cyan)]">
                    {currentTime}
                </div>
            </motion.div>
        </header>
    );
}
