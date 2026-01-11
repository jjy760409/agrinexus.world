'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useOSStore } from '@/store/useOSStore';
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
    Microscope
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

const stagger = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function UniverseCore() {
    const { globalStats, alerts, clusters, setCurrentCluster } = useOSStore();

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];
    const recentAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);

    // Quick access cards data
    const quickAccessCards = [
        {
            title: 'AI 작물 예측',
            description: '수확량 예측 및 성장 분석',
            icon: <Leaf size={24} />,
            href: '/ai/crop-prediction',
            color: 'var(--primary-green)',
            badge: 'AI'
        },
        {
            title: '질병 진단',
            description: 'AI 이미지 분석 진단',
            icon: <Microscope size={24} />,
            href: '/ai/disease-diagnosis',
            color: 'var(--status-warning)',
            badge: 'NEW'
        },
        {
            title: '실시간 모니터링',
            description: '센서 데이터 및 알람',
            icon: <BarChart3 size={24} />,
            href: '/monitoring',
            color: 'var(--primary-blue)',
            badge: 'LIVE'
        },
        {
            title: 'AI 통합 허브',
            description: '모든 AI 서비스 관리',
            icon: <Brain size={24} />,
            href: '/ai',
            color: 'var(--primary-indigo)',
            badge: null
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
            {/* Hero Section */}
            <motion.section
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-subtle)] p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid opacity-30" />

                <div className="relative z-10">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] mb-4">
                            <span className="text-3xl">🌱</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
                            AgriNexus World OS
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            초지능 스마트팜 통합 운영 시스템
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <span className="badge badge-success">
                                <span className="status-dot online" />
                                시스템 정상
                            </span>
                            <span className="badge badge-neutral">v4.0</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                label: '활성 시스템',
                                value: `${globalStats.activeSystems}/${globalStats.totalSystems}`,
                                icon: <Activity size={20} />,
                                color: 'var(--primary-green)'
                            },
                            {
                                label: '글로벌 효율',
                                value: `${globalStats.globalEfficiency}%`,
                                icon: <TrendingUp size={20} />,
                                color: 'var(--primary-blue)'
                            },
                            {
                                label: 'AI 결정',
                                value: globalStats.aiDecisions.toLocaleString(),
                                icon: <Cpu size={20} />,
                                color: 'var(--primary-indigo)'
                            },
                            {
                                label: '에너지 절감',
                                value: `${globalStats.energySaved}%`,
                                icon: <Zap size={20} />,
                                color: 'var(--status-success)'
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div
                                    className="stat-icon"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                                        color: stat.color
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div className="stat-value" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Quick Access Cards */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[var(--primary-green)]" />
                    빠른 액세스
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickAccessCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={card.href}>
                                <div className="card-interactive group h-full">
                                    <div className="flex items-start justify-between mb-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                                            style={{
                                                backgroundColor: `color-mix(in srgb, ${card.color} 15%, transparent)`,
                                                color: card.color
                                            }}
                                        >
                                            {card.icon}
                                        </div>
                                        {card.badge && (
                                            <span className={`badge ${card.badge === 'LIVE' ? 'badge-success' : card.badge === 'NEW' ? 'badge-warning' : 'badge-info'}`}>
                                                {card.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--primary-green)] transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        {card.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-sm text-[var(--primary-green)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>바로가기</span>
                                        <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* System Clusters */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Globe2 size={20} className="text-[var(--primary-blue)]" />
                    시스템 클러스터
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {clusterList.slice(0, 10).map(([key, cluster], i) => (
                        <motion.button
                            key={key}
                            onClick={() => setCurrentCluster(key)}
                            className="card-interactive text-left p-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">{cluster.icon}</span>
                                <span className={`status-dot ${cluster.status === 'active' ? 'online' : 'warning'}`} />
                            </div>
                            <h3 className="font-medium text-sm text-[var(--text-primary)] truncate">
                                {cluster.koreanName}
                            </h3>
                            <p className="text-xs text-[var(--text-muted)]">
                                {cluster.systemCount} 시스템
                            </p>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Bottom Grid: Alerts & Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Alerts */}
                <motion.section
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Bell size={18} className="text-[var(--text-muted)]" />
                            최근 알림
                        </h3>
                        <span className="badge badge-neutral">{alerts.length}</span>
                    </div>

                    <div className="space-y-3">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert, i) => (
                                <motion.div
                                    key={alert.id}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                >
                                    {getAlertIcon(alert.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">
                                            {alert.title}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] truncate">
                                            {alert.message}
                                        </p>
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                                        {alert.systemCode}
                                    </span>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)]">
                                <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">새로운 알림이 없습니다</p>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* System Status */}
                <motion.section
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                        <Activity size={18} className="text-[var(--text-muted)]" />
                        코어 시스템 상태
                    </h3>

                    <div className="space-y-4">
                        {[
                            { name: 'AI 통합 레이어', progress: 94, color: 'var(--primary-green)' },
                            { name: '글로벌 동기화', progress: 99, color: 'var(--primary-blue)' },
                            { name: '자율 의사결정', progress: 87, color: 'var(--primary-indigo)' },
                            { name: '데이터 처리', progress: 96, color: 'var(--status-success)' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-[var(--text-secondary)]">{item.name}</span>
                                    <span className="font-medium font-mono" style={{ color: item.color }}>
                                        {item.progress}%
                                    </span>
                                </div>
                                <div className="progress">
                                    <motion.div
                                        className="progress-bar"
                                        style={{ backgroundColor: item.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.progress}%` }}
                                        transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
