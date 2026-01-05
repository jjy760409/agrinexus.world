'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Background from '@/components/layout/Background';

const HyperEvolutionDashboard = dynamic(
    () => import('@/components/os/HyperEvolutionDashboard'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-40 h-40 mx-auto mb-6 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full" style={{
                            background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #ffa500, #00ff88)'
                        }} />
                        <div className="absolute inset-4 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                            <motion.span
                                className="text-5xl"
                                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                🧬
                            </motion.span>
                        </div>
                    </motion.div>

                    <motion.h2
                        className="text-2xl font-bold font-[family-name:var(--font-orbitron)] gradient-text mb-3"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        초진화 AI 코어 활성화
                    </motion.h2>

                    <div className="space-y-2 text-sm text-white/60">
                        <motion.p
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        >
                            🔮 양자 코어 초기화...
                        </motion.p>
                        <motion.p
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        >
                            🧠 뉴럴 메시 연결 중...
                        </motion.p>
                        <motion.p
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        >
                            🤖 로봇 함대 동기화...
                        </motion.p>
                    </div>

                    <div className="mt-6 flex justify-center gap-2">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: `hsl(${i * 36}, 100%, 50%)` }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
);

export default function HyperEvolutionPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background />

            <div className="relative z-10 min-h-screen p-4 md:p-6">
                {/* Header */}
                <header className="glass rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <motion.div
                            className="w-10 h-10 rounded-full p-0.5 overflow-hidden"
                            style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-full h-full rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <span className="text-lg">🧬</span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text font-[family-name:var(--font-orbitron)]">
                                AgriNexus World OS
                            </h1>
                            <p className="text-xs text-white/50">초진화 AI 코어</p>
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
                            href="/superintelligence"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            Ω 초지능
                        </Link>
                        <Link
                            href="/swarm"
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            🧠 스웜
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
                    <HyperEvolutionDashboard />
                </main>
            </div>
        </div>
    );
}
