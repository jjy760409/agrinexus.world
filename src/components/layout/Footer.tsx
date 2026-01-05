'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function Footer() {
    const { isConnected } = useStore();
    const [uploadRate, setUploadRate] = useState(2.4);
    const [downloadRate, setDownloadRate] = useState(5.7);

    useEffect(() => {
        const interval = setInterval(() => {
            setUploadRate(1 + Math.random() * 3);
            setDownloadRate(3 + Math.random() * 5);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="relative z-50 flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 lg:px-8 py-2 md:py-3 glass border-t border-white/10 text-sm gap-2 sm:gap-0">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
                <span className="text-white/50">연결 상태:</span>
                <motion.span
                    className={`flex items-center gap-1 ${isConnected ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'}`}
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span className="text-lg">●</span>
                    {isConnected ? '실시간 연결' : '연결 끊김'}
                </motion.span>
            </div>

            {/* Data Rates */}
            <div className="flex items-center gap-4 text-white/70">
                <span className="flex items-center gap-1">
                    <span className="text-[var(--primary-green)]">↑</span>
                    <span className="font-[family-name:var(--font-orbitron)] text-xs">{uploadRate.toFixed(1)}</span>
                    <span className="text-white/50">MB/s</span>
                </span>
                <span className="text-white/30">|</span>
                <span className="flex items-center gap-1">
                    <span className="text-[var(--primary-cyan)]">↓</span>
                    <span className="font-[family-name:var(--font-orbitron)] text-xs">{downloadRate.toFixed(1)}</span>
                    <span className="text-white/50">MB/s</span>
                </span>
            </div>

            {/* Copyright */}
            <div className="text-white/40 text-xs md:text-sm">
                © 2026 AgriNexus World 3.0 | 초지능 스마트팜 플랫폼
            </div>
        </footer>
    );
}
