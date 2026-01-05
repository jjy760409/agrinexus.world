'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';

export default function OSFooter() {
    const { globalStats, isConnected, lastSync } = useOSStore();
    const [uploadRate, setUploadRate] = useState(0);
    const [downloadRate, setDownloadRate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setUploadRate(5 + Math.random() * 15);
            setDownloadRate(10 + Math.random() * 30);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <footer className="relative z-50 glass border-t border-white/10 px-4 md:px-6 py-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                {/* Left: Connection & Sync */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <motion.span
                            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[var(--status-success)]' : 'bg-[var(--status-danger)]'}`}
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="text-xs text-white/60">
                            {isConnected ? '🌐 글로벌 연결' : '⚠️ 오프라인'}
                        </span>
                    </div>

                    <span className="text-white/20 hidden sm:inline">|</span>

                    <span className="text-xs text-white/40 hidden sm:inline">
                        마지막 동기화: {formatTime(lastSync)}
                    </span>
                </div>

                {/* Center: Data Flow */}
                <div className="flex items-center gap-4 text-white/70">
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--primary-green)]">↑</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-xs">{uploadRate.toFixed(1)}</span>
                        <span className="text-white/40 text-xs">MB/s</span>
                    </div>
                    <span className="text-white/20">|</span>
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--primary-cyan)]">↓</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-xs">{downloadRate.toFixed(1)}</span>
                        <span className="text-white/40 text-xs">MB/s</span>
                    </div>
                    <span className="text-white/20 hidden md:inline">|</span>
                    <div className="hidden md:flex items-center gap-1">
                        <span className="text-[var(--primary-purple)]">💾</span>
                        <span className="font-[family-name:var(--font-orbitron)] text-xs">{globalStats.dataProcessed}</span>
                        <span className="text-white/40 text-xs">처리됨</span>
                    </div>
                </div>

                {/* Right: Copyright & Version */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/20">
                        <span className="text-xs">🌱</span>
                        <span className="text-xs text-[var(--status-success)]">
                            {globalStats.energySaved}% 에너지 절감
                        </span>
                    </div>

                    <span className="text-xs text-white/30">
                        © 2026 AgriNexus World OS
                    </span>
                </div>
            </div>

            {/* Animated top border */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                    background: 'linear-gradient(90deg, transparent, var(--primary-green), var(--primary-cyan), var(--primary-purple), transparent)',
                    backgroundSize: '200% 100%',
                }}
                animate={{
                    backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
        </footer>
    );
}
