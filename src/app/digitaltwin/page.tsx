'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Background from '@/components/layout/Background';

const DigitalTwinDashboard = dynamic(
    () => import('@/components/os/DigitalTwinDashboard'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-32 h-32 mx-auto mb-4 relative"
                    >
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-[var(--primary-cyan)]/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className="absolute inset-4 rounded-full border-4 border-[var(--primary-green)]/50"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-8 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                            <motion.span
                                className="text-4xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🌐
                            </motion.span>
                        </div>
                    </motion.div>
                    <motion.h2
                        className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text mb-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        디지털 트윈 동기화 중
                    </motion.h2>
                    <motion.p
                        className="text-white/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        물리적 스마트팜과 연결 중...
                    </motion.p>
                </div>
            </div>
        )
    }
);

export default function DigitalTwinPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Background />

            <div className="relative z-10 min-h-screen p-4 md:p-6">
                <header className="glass rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-purple)] flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <span className="text-lg">🌐</span>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text font-[family-name:var(--font-orbitron)]">
                                AgriNexus World OS
                            </h1>
                            <p className="text-xs text-white/50">디지털 트윈</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2 flex-wrap">
                        <Link href="/" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors">
                            ← 대시보드
                        </Link>
                        <Link href="/hyperevolution" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors">
                            🧬 진화
                        </Link>
                        <Link href="/smartfarm" className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors">
                            🌱 스마트팜
                        </Link>
                    </nav>
                </header>

                <main>
                    <DigitalTwinDashboard />
                </main>
            </div>
        </div>
    );
}
