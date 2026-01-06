'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import LanguageSelector from '@/components/ui/LanguageSelector';

export default function GlobalHeader() {
    const { translation } = useLanguageStore();

    return (
        <header className="relative z-50">
            {/* 최상단 신뢰 배너 */}
            <div className="bg-gradient-to-r from-[var(--primary-green)]/10 via-[var(--primary-cyan)]/10 to-[var(--primary-purple)]/10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                            <span className="text-[var(--primary-green)]">LIVE</span>
                        </span>
                        <span className="hidden sm:inline text-white/40">|</span>
                        <span className="hidden sm:flex items-center gap-1 text-white/60">
                            🌍 {translation.company.slogan}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:flex items-center gap-1 text-white/60">
                            ⚡ 500+ AI Systems Active
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="text-white/60">99.9% Uptime</span>
                    </div>
                </div>
            </div>

            {/* 메인 헤더 */}
            <div className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* 로고 & 브랜드 */}
                        <Link href="/" className="flex items-center gap-4 group">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* 로고 글로우 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />

                                {/* 로고 */}
                                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--bg-dark)] to-[var(--bg-card)] border border-white/20 flex items-center justify-center overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[var(--primary-green)]/20 via-[var(--primary-cyan)]/20 to-[var(--primary-purple)]/20"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    />
                                    <span className="text-2xl relative z-10">🌱</span>
                                </div>
                            </motion.div>

                            <div>
                                <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)]">
                                    <span className="gradient-text">{translation.appName}</span>
                                </h1>
                                <p className="text-xs text-white/50 hidden sm:block">
                                    {translation.appTagline}
                                </p>
                            </div>
                        </Link>

                        {/* 네비게이션 */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {[
                                { href: '/', label: translation.nav.dashboard, icon: '📊' },
                                { href: '/smartfarm', label: translation.nav.smartfarm, icon: '🌱' },
                                { href: '/digitaltwin', label: translation.nav.digitalTwin, icon: '🌐' },
                                { href: '/hyperevolution', label: translation.nav.hyperEvolution, icon: '🧬' },
                                { href: '/superintelligence', label: translation.nav.superIntelligence, icon: 'Ω' },
                            ].map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
                                        whileHover={{ y: -2 }}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </nav>

                        {/* 언어 & 액션 */}
                        <div className="flex items-center gap-3">
                            <LanguageSelector />

                            {/* 데모 버튼 */}
                            <motion.button
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)] font-medium text-sm"
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,255,136,0.4)' }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>🚀</span>
                                <span>Start Demo</span>
                            </motion.button>

                            {/* 모바일 메뉴 */}
                            <button className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 신뢰 지표 바 */}
            <div className="bg-[var(--bg-dark)]/50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-center gap-8 text-xs text-white/40 overflow-x-auto">
                        <TrustBadge icon="🏆" text="World's #1 Smart Farm OS" />
                        <TrustBadge icon="🤖" text="500+ AI Agents" />
                        <TrustBadge icon="🌍" text="Global Coverage" />
                        <TrustBadge icon="⚡" text="Real-time Control" />
                        <TrustBadge icon="🔒" text="Enterprise Security" />
                        <TrustBadge icon="☁️" text="Cloud Native" />
                    </div>
                </div>
            </div>
        </header>
    );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
    return (
        <motion.div
            className="flex items-center gap-1.5 whitespace-nowrap"
            whileHover={{ scale: 1.05, color: 'rgba(255,255,255,0.8)' }}
        >
            <span>{icon}</span>
            <span>{text}</span>
        </motion.div>
    );
}
