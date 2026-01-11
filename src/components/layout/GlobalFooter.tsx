'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LANGUAGE_FLAGS, Language } from '@/lib/i18n/translations';

export default function GlobalFooter() {
    const { translation, currentLanguage } = useLanguageStore();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-auto">
            {/* 상단 그라데이션 분리선 */}
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary-cyan)]/50 to-transparent" />

            {/* 메인 푸터 */}
            <div className="bg-[var(--bg-dark)]/80 backdrop-blur-xl border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* 브랜드 영역 */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center">
                                    <span className="text-xl">🌱</span>
                                </div>
                                <div>
                                    <h3 className="font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                        AgriNexus
                                    </h3>
                                    <p className="text-xs text-white/50">World OS</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed mb-4">
                                {translation.appDescription}
                            </p>
                            <div className="flex items-center gap-3">
                                <SocialIcon href="https://twitter.com" icon="𝕏" />
                                <SocialIcon href="https://linkedin.com" icon="in" />
                                <SocialIcon href="https://youtube.com" icon="▶" />
                                <SocialIcon href="https://instagram.com" icon="📷" />
                            </div>
                        </div>

                        {/* 제품 */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Products</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <FooterLink href="/smartfarm">3D Smart Farm Designer</FooterLink>
                                <FooterLink href="/digitaltwin">Digital Twin System</FooterLink>
                                <FooterLink href="/hyperevolution">Hyper Evolution AI</FooterLink>
                                <FooterLink href="/superintelligence">Super Intelligence</FooterLink>
                                <FooterLink href="/swarm">500+ AI Agent Swarm</FooterLink>
                            </ul>
                        </div>

                        {/* 회사 */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <FooterLink href="/">About Us</FooterLink>
                                <FooterLink href="/ai">Technology</FooterLink>
                                <FooterLink href="/hyper-agent">AI Automation</FooterLink>
                                <FooterLink href="/analytics">Analytics</FooterLink>
                                <FooterLink href="/monitoring">Contact</FooterLink>
                            </ul>
                        </div>

                        {/* 지원 & 인증 */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Trust & Security</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="text-[var(--primary-green)]">✓</span>
                                    <span>ISO 27001 Certified</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="text-[var(--primary-green)]">✓</span>
                                    <span>SOC 2 Type II</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="text-[var(--primary-green)]">✓</span>
                                    <span>GDPR Compliant</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="text-[var(--primary-green)]">✓</span>
                                    <span>99.9% SLA Guarantee</span>
                                </div>
                            </div>

                            {/* 지원 언어 */}
                            <div className="mt-6">
                                <p className="text-xs text-white/40 mb-2">Supported Languages</p>
                                <div className="flex flex-wrap gap-1">
                                    {(['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'ar', 'vi', 'th'] as Language[]).map((lang) => (
                                        <span
                                            key={lang}
                                            className={`text-lg ${currentLanguage === lang ? 'opacity-100' : 'opacity-40 hover:opacity-80'} transition-opacity cursor-default`}
                                            title={lang.toUpperCase()}
                                        >
                                            {LANGUAGE_FLAGS[lang]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 저작권 */}
                <div className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
                            <div className="flex items-center gap-2">
                                <span>© {currentYear} AgriNexus World OS.</span>
                                <span className="hidden sm:inline">All rights reserved.</span>
                                <span className="hidden md:inline">|</span>
                                <span className="hidden md:inline">{translation.company.unique}</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                                <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
                                <Link href="/" className="hover:text-white transition-colors">Cookie Policy</Link>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse" />
                                <span>All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href}>
                <motion.span
                    className="hover:text-white transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                >
                    {children}
                </motion.span>
            </Link>
        </li>
    );
}

function SocialIcon({ href, icon }: { href: string; icon: string }) {
    return (
        <motion.a
            href={href}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="text-xs font-bold">{icon}</span>
        </motion.a>
    );
}
