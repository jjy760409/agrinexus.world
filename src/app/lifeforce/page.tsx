'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Background from '@/components/layout/Background';

// Dynamic import to avoid SSR issues
const LifeforceDashboard = dynamic(
    () => import('@/components/os/LifeforceDashboard'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-24 h-24 mx-auto mb-4 relative"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-green)] opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">💚</span>
                        </div>
                    </motion.div>
                    <p className="text-white/60">생명력 시스템 활성화 중...</p>
                </div>
            </div>
        )
    }
);

export default function LifeforcePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background />

            <div className="relative z-10 min-h-screen p-4 md:p-6">
                {/* Header */}
                <header className="glass rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] p-0.5"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-full h-full rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <span className="text-lg">💚</span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text font-[family-name:var(--font-orbitron)]">
                                AgriNexus World OS
                            </h1>
                            <p className="text-xs text-white/50">생명력 대시보드</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            ← OS 대시보드
                        </Link>
                        <Link
                            href="/smartfarm"
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            🌱 스마트팜
                        </Link>
                    </nav>
                </header>

                {/* Main Content */}
                <main>
                    <LifeforceDashboard />
                </main>
            </div>
        </div>
    );
}
