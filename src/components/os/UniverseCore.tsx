'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useOSStore } from '@/store/useOSStore';
import { useAgentStore } from '@/store/useAgentStore';
import { CLUSTERS, ClusterType } from '@/types/systems';
import {
    Activity,
    Cpu,
    Zap,
    TrendingUp,
    ArrowRight,
    Bell,
    CheckCircle,
    AlertTriangle,
    AlertCircle,
    Info,
    Leaf,
    Brain,
    Globe2,
    Sparkles,
    BarChart3,
    Microscope,
    Bot,
    Box,
    Infinity,
    Rocket,
    Shield,
    Network,
    Workflow,
    ChevronRight,
    Play
} from 'lucide-react';

export default function UniverseCore() {
    const { globalStats, alerts, setCurrentCluster } = useOSStore();
    const { decisionsToday, automationLevel, activeAgents, totalAgents } = useAgentStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];
    const recentAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);

    // 초지능 빠른 액세스 카드
    const hyperAccessCards = [
        {
            title: '슈퍼 에이전트',
            description: '완전 자율 AI 시스템',
            icon: <Bot size={28} />,
            href: '/hyper-agent',
            gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
            badge: 'HYPER',
            stats: `${activeAgents} 활성`
        },
        {
            title: '스마트팜 3D',
            description: '실시간 4D 설계 시스템',
            icon: <Box size={28} />,
            href: '/smartfarm',
            gradient: 'from-emerald-500 via-green-500 to-teal-500',
            badge: '4D',
            stats: '설계 시작'
        },
        {
            title: 'AI 초지능 허브',
            description: '양자 AI 서비스 관리',
            icon: <Brain size={28} />,
            href: '/ai',
            gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
            badge: 'Ω AI',
            stats: `${decisionsToday.toLocaleString()} 결정`
        },
        {
            title: '실시간 모니터링',
            description: '글로벌 센서 네트워크',
            icon: <Activity size={28} />,
            href: '/monitoring',
            gradient: 'from-orange-500 via-amber-500 to-yellow-500',
            badge: 'LIVE',
            stats: '실시간'
        },
        {
            title: '디지털 트윈',
            description: '물리-디지털 동기화',
            icon: <Globe2 size={28} />,
            href: '/digitaltwin',
            gradient: 'from-pink-500 via-rose-500 to-red-500',
            badge: 'SYNC',
            stats: '동기화됨'
        },
        {
            title: '초진화 AI 코어',
            description: '무한 진화 시스템',
            icon: <Infinity size={28} />,
            href: '/hyperevolution',
            gradient: 'from-indigo-500 via-violet-500 to-purple-500',
            badge: 'EVOLVE',
            stats: '진화 중'
        }
    ];

    // 초지능 시스템 클러스터
    const hyperSystems = [
        {
            title: '초지능 통합 컨트롤',
            href: '/superintelligence',
            icon: <Sparkles size={24} />,
            description: '500+ AI 시스템 자율 제어',
            color: 'text-violet-400',
            bg: 'from-violet-500/20 to-purple-500/10'
        },
        {
            title: '에이전트 스웜 네트워크',
            href: '/swarm',
            icon: <Network size={24} />,
            description: '분산 에이전트 집단 지능',
            color: 'text-cyan-400',
            bg: 'from-cyan-500/20 to-blue-500/10'
        },
        {
            title: '생명역 대시보드',
            href: '/lifeforce',
            icon: <Leaf size={24} />,
            description: 'AI 에이전트 생명력 관리',
            color: 'text-green-400',
            bg: 'from-green-500/20 to-emerald-500/10'
        },
        {
            title: '통합 분석 센터',
            href: '/analytics',
            icon: <BarChart3 size={24} />,
            description: '실시간 데이터 시각화',
            color: 'text-blue-400',
            bg: 'from-blue-500/20 to-indigo-500/10'
        }
    ];

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle size={16} className="text-[var(--status-success)]" />;
            case 'warning': return <AlertTriangle size={16} className="text-[var(--status-warning)]" />;
            case 'danger': return <AlertCircle size={16} className="text-[var(--status-danger)]" />;
            default: return <Info size={16} className="text-[var(--status-info)]" />;
        }
    };

    return (
        <div className="space-y-8 pb-8">
            {/* Hero Section - 초지능 */}
            <motion.section
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F1E] via-[#111827] to-[#1F2937] border border-[var(--border-default)] p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] via-[var(--primary-blue)] to-[var(--primary-indigo)] mb-4"
                            animate={{
                                boxShadow: ['0 0 20px rgba(0,255,136,0.3)', '0 0 40px rgba(0,212,255,0.5)', '0 0 20px rgba(139,92,246,0.3)']
                            }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                        >
                            <span className="text-4xl">🌱</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-bold orbitron mb-2">
                            <span className="hyper-text">AgriNexus World OS</span>
                        </h1>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            초지능 완전 자율화 스마트팜 운영 시스템
                        </p>
                        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                            <span className="badge badge-hyper">
                                <Sparkles size={12} />
                                HYPER-INTELLIGENCE
                            </span>
                            <span className="badge badge-success">
                                <span className="status-dot online" />
                                전체 시스템 활성
                            </span>
                            <span className="badge badge-info">
                                v5.0 Ω
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                label: '활성 시스템',
                                value: `${globalStats.activeSystems}/${globalStats.totalSystems}`,
                                icon: <Activity size={20} />,
                                color: 'var(--primary-green)',
                                glow: 'var(--glow-green)'
                            },
                            {
                                label: '자동화율',
                                value: `${automationLevel}%`,
                                icon: <Workflow size={20} />,
                                color: 'var(--primary-blue)',
                                glow: 'var(--glow-cyan)'
                            },
                            {
                                label: 'AI 결정',
                                value: decisionsToday.toLocaleString(),
                                icon: <Brain size={20} />,
                                color: 'var(--primary-indigo)',
                                glow: 'var(--glow-violet)'
                            },
                            {
                                label: '에너지 절감',
                                value: `${globalStats.energySaved}%`,
                                icon: <Zap size={20} />,
                                color: 'var(--status-warning)',
                                glow: '0 0 20px rgba(255,184,0,0.5)'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    className="stat-icon transition-all group-hover:scale-110"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                                        color: stat.color
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div className="stat-value glow-text" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Hyper Access Cards */}
            <section>
                <h2 className="text-2xl font-bold orbitron mb-4 flex items-center gap-3">
                    <Sparkles size={24} className="text-[var(--primary-green)]" />
                    <span className="gradient-text">초지능 시스템</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hyperAccessCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={card.href}>
                                <div className="card-hyper group h-full cursor-pointer transition-all hover:border-[var(--border-strong)]">
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                                {card.icon}
                                            </div>
                                            <span className="badge badge-hyper text-xs">
                                                {card.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-green)] transition-colors orbitron">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)] mb-4">
                                            {card.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-mono text-[var(--primary-blue)]">
                                                {card.stats}
                                            </span>
                                            <ArrowRight size={18} className="text-[var(--text-muted)] group-hover:text-[var(--primary-green)] group-hover:translate-x-2 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Hyper Systems */}
            <section>
                <h2 className="text-2xl font-bold orbitron mb-4 flex items-center gap-3">
                    <Rocket size={24} className="text-[var(--primary-indigo)]" />
                    <span className="gradient-text">고급 시스템</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hyperSystems.map((system, i) => (
                        <motion.div
                            key={system.title}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={system.href}>
                                <div className={`card-interactive flex items-center gap-4 bg-gradient-to-r ${system.bg}`}>
                                    <div className={`w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center ${system.color}`}>
                                        {system.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-green)]">
                                            {system.title}
                                        </h3>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {system.description}
                                        </p>
                                    </div>
                                    <ChevronRight size={20} className="text-[var(--text-muted)]" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* System Clusters */}
            <section>
                <h2 className="text-2xl font-bold orbitron mb-4 flex items-center gap-3">
                    <Globe2 size={24} className="text-[var(--primary-blue)]" />
                    <span className="gradient-text">시스템 클러스터</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {clusterList.slice(0, 10).map(([key, cluster], i) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={`/${key.toLowerCase()}`}>
                                <div className="card-interactive text-center p-4 group">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-3xl group-hover:scale-110 transition-transform">{cluster.icon}</span>
                                        <span className={`status-dot ${cluster.status === 'active' ? 'online' : 'warning'}`} />
                                    </div>
                                    <h3 className="font-medium text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--primary-green)]">
                                        {cluster.koreanName}
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {cluster.systemCount} 시스템
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Bottom Grid: Alerts & AI Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts */}
                <motion.section
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 orbitron">
                            <Bell size={18} className="text-[var(--status-warning)]" />
                            실시간 알림
                        </h3>
                        <span className="badge badge-warning">{alerts.length}</span>
                    </div>

                    <div className="space-y-3">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert, i) => (
                                <motion.div
                                    key={alert.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                >
                                    {getAlertIcon(alert.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                            {alert.title}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {alert.timestamp.toLocaleTimeString('ko-KR')}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-[var(--text-muted)]">
                                <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">모든 시스템 정상</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* AI Status */}
                <motion.section
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2 orbitron">
                            <Brain size={18} className="text-[var(--primary-indigo)]" />
                            AI 자율 시스템
                        </h3>
                        <span className="badge badge-hyper">HYPER</span>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: '자동화율', value: automationLevel, color: 'var(--primary-green)' },
                            { label: '에이전트 활성도', value: Math.round((activeAgents / totalAgents) * 100), color: 'var(--primary-blue)' },
                            { label: 'AI 신뢰도', value: 97, color: 'var(--primary-indigo)' }
                        ].map((item, i) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--text-secondary)]">{item.label}</span>
                                    <span className="font-bold font-mono" style={{ color: item.color }}>
                                        {item.value}%
                                    </span>
                                </div>
                                <div className="progress-hyper">
                                    <motion.div
                                        className="progress-bar"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                    />
                                </div>
                            </div>
                        ))}

                        <Link href="/hyper-agent" className="btn btn-hyper w-full mt-4">
                            <Play size={16} />
                            슈퍼 에이전트 허브
                        </Link>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
