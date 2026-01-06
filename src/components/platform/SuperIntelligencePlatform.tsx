'use client';

import { motion } from 'framer-motion';

// 초지능 연구 플랫폼 - 전세계 유일 1인 AI 전자동화 기업
export default function SuperIntelligencePlatform() {
    const researchAreas = [
        {
            icon: '🧬',
            title: '초지능 알고리즘',
            titleEn: 'Super Intelligence Algorithm',
            description: '자기 진화 학습 시스템 - 인간 개입 없이 지속 발전',
            stats: '99.7% 자율성',
            color: 'purple',
        },
        {
            icon: '🌐',
            title: '디지털 트윈 엔진',
            titleEn: 'Digital Twin Engine',
            description: '완벽한 1:1 가상 복제 - 실시간 시뮬레이션',
            stats: '밀리초 동기화',
            color: 'cyan',
        },
        {
            icon: '🤖',
            title: '자율 로봇 네트워크',
            titleEn: 'Autonomous Robot Network',
            description: '500+ AI 에이전트 협업 - 무인 운영',
            stats: '24/7 자율 가동',
            color: 'green',
        },
        {
            icon: '📡',
            title: '글로벌 IoT 메시',
            titleEn: 'Global IoT Mesh',
            description: '수백만 센서 실시간 연동 - 초저지연',
            stats: '<10ms 지연',
            color: 'orange',
        },
        {
            icon: '🔮',
            title: '예측 분석 엔진',
            titleEn: 'Predictive Analytics',
            description: '양자 컴퓨팅 기반 미래 예측',
            stats: '95% 정확도',
            color: 'pink',
        },
        {
            icon: '⚡',
            title: '에너지 자립 시스템',
            titleEn: 'Energy Self-Sufficiency',
            description: '탄소 제로 완전 자립 에너지',
            stats: '100% 재생에너지',
            color: 'yellow',
        },
    ];

    const uniqueFeatures = [
        { icon: '🌍', text: '전세계 유일 완전 자동화 플랫폼' },
        { icon: '👤', text: '1인 AI 기업 운영 가능' },
        { icon: '🚀', text: '인간 노동력 0% 필요' },
        { icon: '📈', text: '무한 확장 가능 아키텍처' },
        { icon: '🔒', text: '엔터프라이즈급 보안' },
        { icon: '🌱', text: '지속가능한 미래 농업' },
    ];

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/40',
            cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/40',
            green: 'from-green-500/20 to-green-600/20 border-green-500/40',
            orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/40',
            pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/40',
            yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/40',
        };
        return colors[color] || colors.cyan;
    };

    return (
        <div className="space-y-8">
            {/* 헤더 배너 */}
            <motion.div
                className="relative p-8 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* 배경 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-cyan-900/40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* 글로우 효과 */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 text-center">
                    <motion.div
                        className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🌟 전세계 유일 · 독보적 기술력 · 완전 자동화
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-orbitron)] mb-4">
                        <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                            Super Intelligence
                        </span>
                        <br />
                        <span className="text-white">Research Platform</span>
                    </h1>

                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        1인 AI 전자동화 기업을 위한 초지능 연구 플랫폼
                        <br />
                        <span className="text-[var(--primary-cyan)]">World&apos;s Only Fully Automated Smart Farm Platform</span>
                    </p>

                    {/* 핵심 지표 */}
                    <div className="flex justify-center gap-8 mt-8">
                        {[
                            { value: '500+', label: 'AI Systems' },
                            { value: '99.9%', label: 'Automation' },
                            { value: '0', label: 'Human Labor' },
                            { value: '∞', label: 'Scalability' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                                <div className="text-xs text-white/40">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* 연구 영역 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {researchAreas.map((area, index) => (
                    <motion.div
                        key={index}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${getColorClass(area.color)} border backdrop-blur-sm`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                    >
                        <div className="text-4xl mb-4">{area.icon}</div>
                        <h3 className="text-lg font-bold mb-1">{area.title}</h3>
                        <p className="text-xs text-white/40 mb-2">{area.titleEn}</p>
                        <p className="text-sm text-white/60 mb-3">{area.description}</p>
                        <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                            {area.stats}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 독보적 특징 */}
            <motion.div
                className="p-6 rounded-2xl glass border border-[var(--primary-purple)]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    🏆 전세계 유일한 <span className="gradient-text">1인 AI 전자동화 기업</span> 플랫폼
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {uniqueFeatures.map((feature, i) => (
                        <motion.div
                            key={i}
                            className="p-3 rounded-xl bg-white/5 text-center hover:bg-white/10 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-2xl mb-1">{feature.icon}</div>
                            <div className="text-xs text-white/60">{feature.text}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 기술 아키텍처 */}
            <div className="p-6 rounded-2xl bg-[var(--bg-dark)]/80 border border-white/10">
                <h2 className="text-xl font-bold mb-6 text-center">
                    ⚙️ 초고도화 기술 아키텍처
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { layer: 'Layer 1', name: '센서 & IoT', items: ['환경 센서', '비전 AI', 'RFID'] },
                        { layer: 'Layer 2', name: 'Edge AI', items: ['실시간 처리', '로컬 추론', '저지연'] },
                        { layer: 'Layer 3', name: 'Cloud Brain', items: ['디지털 트윈', '예측 분석', '최적화'] },
                        { layer: 'Layer 4', name: 'Autonomy', items: ['완전 자율', '자가 복구', '진화'] },
                    ].map((arch, i) => (
                        <motion.div
                            key={i}
                            className="p-4 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <div className="text-xs text-[var(--primary-cyan)] font-medium mb-1">{arch.layer}</div>
                            <div className="font-bold mb-2">{arch.name}</div>
                            <ul className="space-y-1">
                                {arch.items.map((item, j) => (
                                    <li key={j} className="text-xs text-white/60 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[var(--primary-green)]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <motion.div
                className="text-center p-8 rounded-2xl bg-gradient-to-r from-[var(--primary-purple)]/20 via-[var(--primary-cyan)]/20 to-[var(--primary-green)]/20 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h2 className="text-2xl font-bold mb-2">
                    🚀 세계 최초 1인 AI 스마트팜 기업
                </h2>
                <p className="text-white/60 mb-4">
                    당신도 AgriNexus World OS로 글로벌 스마트팜 기업을 시작하세요
                </p>
                <motion.button
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)] font-bold"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,136,0.5)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    무료로 시작하기
                </motion.button>
            </motion.div>
        </div>
    );
}
