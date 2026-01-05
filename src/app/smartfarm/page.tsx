'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Background from '@/components/layout/Background';

// Dynamic import to avoid SSR issues with Three.js
const SmartFarmDesigner = dynamic(
    () => import('@/components/smartfarm/SmartFarmDesigner'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        className="w-24 h-24 mx-auto mb-4 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-[var(--primary-green)]/20" />
                        <motion.div
                            className="absolute inset-2 rounded-full border-4 border-t-[var(--primary-green)] border-r-transparent border-b-transparent border-l-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl">🌱</span>
                        </div>
                    </motion.div>
                    <p className="text-white/60">3D 설계 시스템 로딩 중...</p>
                </div>
            </div>
        )
    }
);

export default function SmartFarmPage() {
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
                                <span className="text-lg">🌌</span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-bold gradient-text font-[family-name:var(--font-orbitron)]">
                                AgriNexus World OS
                            </h1>
                            <p className="text-xs text-white/50">스마트팜 3D 설계</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
                        >
                            ← OS 대시보드
                        </Link>
                    </nav>
                </header>

                {/* Main Content */}
                <main>
                    <SmartFarmDesigner />
                </main>
            </div>
        </div>
    );
}
