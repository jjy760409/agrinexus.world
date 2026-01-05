'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Background from '@/components/layout/Background';

const SuperIntelligenceDashboard = dynamic(
    () => import('@/components/os/SuperIntelligenceDashboard'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-32 h-32 mx-auto mb-4 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)'
                        }} />
                        <div className="absolute inset-3 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                            <motion.span
                                className="text-4xl font-bold font-[family-name:var(--font-orbitron)]"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Ω
                            </motion.span>
                        </div>
                    </motion.div>
                    <motion.h2
                        className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text mb-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        초지능 시스템 활성화
                    </motion.h2>
                    <motion.p
                        className="text-white/60"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                        500 살아있는 시스템 로딩 중...
                    </motion.p>
                    <div className="mt-4 flex justify-center gap-1">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: `hsl(${i * 36}, 100%, 60%)` }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
);

export default function SuperIntelligencePage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background />

            <div className="relative z-10 min-h-screen p-4 md:p-6">
                {/* Header */}
                <header className="glass rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <motion.div
                            className="w-10 h-10 rounded-full p-0.5"
                            style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-full h-full rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <span className="text-lg font-bold font-[family-name:var(--font-orbitron)]">Ω</span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text font-[family-name:var(--font-orbitron)]">
                                AgriNexus World OS
                            </h1>
                            <p className="text-xs text-white/50">초지능 통합 컨트롤</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            ← 대시보드
                        </Link>
                        <Link
                            href="/swarm"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            🧠 스웜
                        </Link>
                        <Link
                            href="/system"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            💚 시스템
                        </Link>
                        <Link
                            href="/smartfarm"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            🌱 스마트팜
                        </Link>
                    </nav>
                </header>

                <main>
                    <SuperIntelligenceDashboard />
                </main>
            </div>
        </div>
    );
}
