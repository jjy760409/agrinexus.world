'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getInitialHealth,
    simulateIssue,
    simulateHeal,
    calculateHealthScore,
    SystemHealth,
    SystemIssue,
    HealEvent,
    HEAL_ACTIONS,
} from '@/lib/system/selfHealing';
import {
    getInitialSuperAI,
    generateImprovement,
    INNOVATION_TECHNOLOGIES,
    DATA_INTEGRATIONS,
    EVOLUTION_PHASES,
    PLATFORM_COMPATIBILITY,
    SuperAICore,
    Improvement,
} from '@/lib/system/superAI';

export default function SystemCoreDashboard() {
    const [health, setHealth] = useState<SystemHealth>(getInitialHealth());
    const [superAI, setSuperAI] = useState<SuperAICore>(getInitialSuperAI());
    const [improvements, setImprovements] = useState<Improvement[]>([]);
    const [activeTab, setActiveTab] = useState<'health' | 'ai' | 'integrations'>('health');
    const [isLive, setIsLive] = useState(true);

    // Live simulation
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            // Update uptime
            setHealth(prev => ({
                ...prev,
                uptime: prev.uptime + 1,
                lastCheck: new Date(),
            }));

            // Update metrics with small variations
            setHealth(prev => ({
                ...prev,
                metrics: {
                    cpu: Math.max(10, Math.min(90, prev.metrics.cpu + (Math.random() - 0.5) * 5)),
                    memory: Math.max(20, Math.min(80, prev.metrics.memory + (Math.random() - 0.5) * 3)),
                    networkLatency: Math.max(5, Math.min(100, prev.metrics.networkLatency + (Math.random() - 0.5) * 10)),
                    renderFps: Math.max(30, Math.min(60, prev.metrics.renderFps + (Math.random() - 0.3) * 5)),
                    agentResponseTime: Math.max(20, Math.min(200, prev.metrics.agentResponseTime + (Math.random() - 0.5) * 20)),
                    dataIntegrity: Math.max(95, Math.min(100, prev.metrics.dataIntegrity + (Math.random() - 0.3) * 0.5)),
                    errorRate: Math.max(0, Math.min(5, prev.metrics.errorRate + (Math.random() - 0.6) * 0.1)),
                    healSuccessRate: Math.max(90, Math.min(100, prev.metrics.healSuccessRate + (Math.random() - 0.3) * 0.5)),
                },
            }));

            // Simulate issues and auto-heal
            const issue = simulateIssue();
            if (issue) {
                setHealth(prev => ({
                    ...prev,
                    issues: [...prev.issues.slice(-9), issue],
                }));

                // Auto-heal after delay
                setTimeout(() => {
                    const heal = simulateHeal(issue);
                    setHealth(prev => ({
                        ...prev,
                        issues: prev.issues.map(i =>
                            i.id === issue.id ? { ...i, status: 'resolved' as const } : i
                        ),
                        heals: [...prev.heals.slice(-9), heal],
                    }));
                }, 500 + Math.random() * 1500);
            }

            // Calculate health score
            setHealth(prev => ({
                ...prev,
                score: calculateHealthScore(prev.metrics),
                overall: prev.score > 90 ? 'healthy' : prev.score > 70 ? 'degraded' : prev.score > 50 ? 'recovering' : 'critical',
            }));

            // Super AI evolution
            setSuperAI(prev => ({
                ...prev,
                evolution: {
                    ...prev.evolution,
                    progress: Math.min(100, prev.evolution.progress + Math.random() * 0.1),
                    mutations: prev.evolution.mutations + (Math.random() > 0.9 ? 1 : 0),
                },
                learning: {
                    ...prev.learning,
                    totalKnowledge: prev.learning.totalKnowledge + prev.learning.learningRate / 3600,
                },
                intelligence: {
                    ...prev.intelligence,
                    iq: Math.min(500, prev.intelligence.iq + (Math.random() > 0.99 ? 1 : 0)),
                },
                predictions: {
                    ...prev.predictions,
                    activePredictions: prev.predictions.activePredictions + Math.floor((Math.random() - 0.3) * 10),
                },
            }));

            // Generate improvements
            if (Math.random() > 0.95) {
                const improvement = generateImprovement();
                setImprovements(prev => [...prev.slice(-4), improvement]);
                setSuperAI(prev => ({
                    ...prev,
                    evolution: {
                        ...prev.evolution,
                        improvements: [...prev.evolution.improvements.slice(-9), improvement],
                    },
                }));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isLive]);

    const healthColor = useMemo(() => {
        if (health.score > 90) return 'var(--status-success)';
        if (health.score > 70) return 'var(--status-warning)';
        return 'var(--status-danger)';
    }, [health.score]);

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4 overflow-hidden">
            {/* Header */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-16 h-16 rounded-full flex items-center justify-center relative"
                            style={{
                                background: `conic-gradient(from 0deg, ${healthColor}, var(--primary-cyan), var(--primary-purple), ${healthColor})`
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-1.5 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <motion.span
                                    className="text-2xl"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    {health.overall === 'healthy' ? '💚' : health.overall === 'degraded' ? '💛' : '❤️'}
                                </motion.span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                시스템 코어
                            </h1>
                            <p className="text-sm text-white/60">자가 치유 · 초거대 AI · 데이터 연동</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Core Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)]" style={{ color: healthColor }}>
                                    {health.score.toFixed(1)}%
                                </div>
                                <div className="text-xs text-white/50">건강도</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                    {superAI.intelligence.iq}
                                </div>
                                <div className="text-xs text-white/50">AI IQ</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">
                                    {health.heals.filter(h => h.result === 'success').length}
                                </div>
                                <div className="text-xs text-white/50">자가 치유</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                    {formatUptime(health.uptime)}
                                </div>
                                <div className="text-xs text-white/50">가동 시간</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsLive(!isLive)}
                            className={`px-4 py-2 rounded-lg font-medium ${isLive ? 'bg-[var(--primary-green)] text-[var(--bg-dark)]' : 'bg-white/10'
                                }`}
                        >
                            {isLive ? '● LIVE' : '○ PAUSED'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    {[
                        { id: 'health' as const, label: '자가 치유', icon: '💚' },
                        { id: 'ai' as const, label: '초거대 AI', icon: '🧠' },
                        { id: 'integrations' as const, label: '데이터 연동', icon: '🔗' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)]'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* Health Tab */}
                    {activeTab === 'health' && (
                        <motion.div
                            key="health"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4"
                        >
                            {/* Metrics */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>📊</span> 시스템 메트릭
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(health.metrics).map(([key, value]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-white/60 capitalize">{key}</span>
                                                <span className="font-[family-name:var(--font-orbitron)]">
                                                    {typeof value === 'number' ? value.toFixed(1) : value}
                                                    {key.includes('Rate') || key.includes('Integrity') ? '%' : key === 'networkLatency' ? 'ms' : key === 'renderFps' ? 'fps' : ''}
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        backgroundColor: key.includes('error') ? 'var(--status-danger)' :
                                                            value > 80 ? 'var(--status-success)' :
                                                                value > 50 ? 'var(--status-warning)' : 'var(--primary-cyan)',
                                                        width: `${Math.min(100, typeof value === 'number' ? value : 0)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Issues & Heals */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🔧</span> 이슈 & 자동 치유
                                </h3>
                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {health.issues.slice(-10).reverse().map(issue => (
                                            <motion.div
                                                key={issue.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className={`p-3 rounded-lg border-l-2 ${issue.status === 'resolved'
                                                        ? 'bg-[var(--status-success)]/10 border-[var(--status-success)]'
                                                        : 'bg-[var(--status-warning)]/10 border-[var(--status-warning)]'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-sm">{issue.description}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${issue.status === 'resolved' ? 'bg-[var(--status-success)]/20 text-[var(--status-success)]' : 'bg-[var(--status-warning)]/20 text-[var(--status-warning)]'
                                                        }`}>
                                                        {issue.status === 'resolved' ? '✓ 해결' : '치유 중...'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-white/50">{issue.type} • {issue.severity}</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {health.issues.length === 0 && (
                                        <div className="text-center py-8 text-white/50">
                                            <span className="text-3xl block mb-2">✨</span>
                                            모든 시스템 정상
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Heal Log */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>💊</span> 치유 로그
                                </h3>
                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {health.heals.slice(-10).reverse().map(heal => (
                                            <motion.div
                                                key={heal.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="p-3 rounded-lg bg-white/5"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-sm text-[var(--primary-green)]">{heal.action}</span>
                                                    <span className={`text-xs ${heal.result === 'success' ? 'text-[var(--status-success)]' : 'text-[var(--status-warning)]'}`}>
                                                        {heal.result === 'success' ? '성공' : heal.result}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {heal.duration}ms • +{heal.improvement}% 개선
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* AI Tab */}
                    {activeTab === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4"
                        >
                            {/* AI Core */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <div className="text-center mb-4">
                                    <motion.div
                                        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--primary-purple)] via-[var(--primary-cyan)] to-[var(--primary-green)] flex items-center justify-center"
                                        animate={{
                                            boxShadow: ['0 0 30px #7b2fff', '0 0 60px #00d4ff', '0 0 30px #00ff88', '0 0 60px #7b2fff']
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <span className="text-4xl font-bold font-[family-name:var(--font-orbitron)]">Ω</span>
                                    </motion.div>
                                    <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] mt-3 gradient-text">
                                        {superAI.name}
                                    </h2>
                                    <p className="text-sm text-white/50">{superAI.version} • Gen {superAI.generation}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {Object.entries(superAI.intelligence).map(([key, value]) => (
                                        <div key={key} className="p-2 rounded-lg bg-white/5 text-center">
                                            <div className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--primary-cyan)]">{value}</div>
                                            <div className="text-[0.65rem] text-white/50 uppercase">{key}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Evolution */}
                                <div className="p-3 rounded-lg bg-white/5">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm">{superAI.evolution.currentPhase}</span>
                                        <span className="text-sm text-[var(--primary-green)]">{superAI.evolution.progress.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                            style={{ width: `${superAI.evolution.progress}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">
                                        다음: {superAI.evolution.nextMilestone}
                                    </div>
                                </div>
                            </div>

                            {/* Technologies */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🚀</span> 혁신 기술
                                </h3>
                                <div className="space-y-2">
                                    {INNOVATION_TECHNOLOGIES.map((tech, i) => (
                                        <motion.div
                                            key={tech.id}
                                            className="p-3 rounded-lg bg-white/5 flex items-center justify-between"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{tech.name}</div>
                                                <div className="text-xs text-white/40">
                                                    {tech.status === 'active' ? '✓ 활성화' : '🔄 개발 중'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                                    {tech.impact}%
                                                </div>
                                                <div className="text-xs text-white/40">영향력</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Improvements */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>⚡</span> 실시간 개선
                                </h3>
                                <div className="space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {improvements.map(imp => (
                                            <motion.div
                                                key={imp.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="p-3 rounded-lg bg-[var(--primary-green)]/10 border-l-2 border-[var(--primary-green)]"
                                            >
                                                <div className="font-medium text-sm text-[var(--primary-green)]">{imp.title}</div>
                                                <div className="text-xs text-white/60">{imp.description}</div>
                                                <div className="text-xs text-white/40 mt-1">+{imp.impact}% 향상</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {improvements.length === 0 && (
                                        <div className="text-center py-8 text-white/50">
                                            <motion.span
                                                className="text-3xl block mb-2"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            >
                                                ⚙️
                                            </motion.span>
                                            개선 분석 중...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Integrations Tab */}
                    {activeTab === 'integrations' && (
                        <motion.div
                            key="integrations"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4"
                        >
                            {/* Data Sources */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🔗</span> 데이터 소스 연동
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(DATA_INTEGRATIONS).map(([key, source], i) => (
                                        <motion.div
                                            key={key}
                                            className="p-4 rounded-lg bg-white/5"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{source.name}</h4>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${source.simulated
                                                        ? 'bg-[var(--status-warning)]/20 text-[var(--status-warning)]'
                                                        : 'bg-[var(--status-success)]/20 text-[var(--status-success)]'
                                                    }`}>
                                                    {source.simulated ? '시뮬레이션' : '실시간'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-white/60 mb-2">{source.description}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {source.sources.map(s => (
                                                    <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-white/10">{s}</span>
                                                ))}
                                            </div>
                                            <div className="text-xs text-white/40 mt-2">갱신: {source.updateInterval}초</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-4 p-4 rounded-lg bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30">
                                    <h4 className="font-medium text-[var(--primary-cyan)] mb-2">💡 API 연동 안내</h4>
                                    <p className="text-xs text-white/70">
                                        현재 MVP는 시뮬레이션 데이터로 작동합니다.
                                        프로덕션 환경에서는 각 서비스의 API 키를 .env 파일에 설정하면
                                        자동으로 실시간 데이터로 전환됩니다.
                                    </p>
                                </div>
                            </div>

                            {/* Platform Compatibility */}
                            <div className="glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>📱</span> 플랫폼 호환성
                                </h3>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {Object.entries(PLATFORM_COMPATIBILITY).map(([platform, info], i) => (
                                        <motion.div
                                            key={platform}
                                            className="p-4 rounded-lg bg-white/5 text-center"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className="text-2xl mb-2">
                                                {platform === 'web' ? '🌐' : platform === 'mobile' ? '📱' : platform === 'tablet' ? '📟' : platform === 'desktop' ? '💻' : platform === 'pwa' ? '📦' : '📴'}
                                            </div>
                                            <div className="font-medium capitalize">{platform}</div>
                                            <div className={`text-xs mt-1 ${info.status === 'full' ? 'text-[var(--status-success)]' : 'text-[var(--status-warning)]'
                                                }`}>
                                                {info.features} 지원
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="p-4 rounded-lg bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30">
                                    <h4 className="font-medium text-[var(--primary-green)] mb-2">✅ 모바일 최적화</h4>
                                    <ul className="text-xs text-white/70 space-y-1">
                                        <li>• 터치 제스처 지원</li>
                                        <li>• 반응형 레이아웃</li>
                                        <li>• 오프라인 지원 (PWA)</li>
                                        <li>• 적응형 품질 조절</li>
                                        <li>• 배터리 최적화</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
