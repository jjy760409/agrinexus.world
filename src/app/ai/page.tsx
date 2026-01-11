'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Brain,
    Leaf,
    Microscope,
    TrendingUp,
    BarChart3,
    Sparkles,
    ArrowRight,
    Bot,
    Zap,
    Activity
} from 'lucide-react';

const aiServices = [
    {
        id: 'crop-prediction',
        title: '작물 수확량 예측',
        description: 'AI/ML 기반 정밀 수확량 예측 시스템. 기상데이터, 토양분석, 과거 데이터를 종합하여 예측합니다.',
        icon: <Leaf size={28} />,
        href: '/ai/crop-prediction',
        color: 'var(--primary-green)',
        stats: { value: '97.3%', label: '예측 정확도' },
        badge: 'AI',
        features: ['수확량 예측', '성장 패턴 분석', '최적 재배 조건 추천']
    },
    {
        id: 'disease-diagnosis',
        title: '질병 진단 AI',
        description: '딥러닝 이미지 분석을 통한 작물 질병 조기 진단. 실시간 치료 방법을 추천합니다.',
        icon: <Microscope size={28} />,
        href: '/ai/disease-diagnosis',
        color: 'var(--status-warning)',
        stats: { value: '150+', label: '진단 가능 질병' },
        badge: 'NEW',
        features: ['이미지 업로드 진단', '질병 식별', '치료 방법 추천']
    },
    {
        id: 'growth-optimization',
        title: '성장 최적화',
        description: '환경 변수 실시간 조정으로 작물 성장률 최대화. 자동 제어 시스템과 연동됩니다.',
        icon: <TrendingUp size={28} />,
        href: '#',
        color: 'var(--primary-blue)',
        stats: { value: '+23%', label: '평균 성장률 향상' },
        badge: null,
        features: ['환경 최적화', '자동 제어', '성장 모니터링']
    },
    {
        id: 'predictive-analytics',
        title: '예측 분석',
        description: '빅데이터 기반 시장 가격 예측 및 최적 출하 시점 분석을 제공합니다.',
        icon: <BarChart3 size={28} />,
        href: '#',
        color: 'var(--primary-indigo)',
        stats: { value: '89%', label: '시장 예측 정확도' },
        badge: null,
        features: ['시장 분석', '가격 예측', '출하 시점 최적화']
    }
];

const aiStats = [
    { label: 'AI 모델 수', value: '47', icon: <Brain size={20} /> },
    { label: '일일 추론 횟수', value: '2.4M', icon: <Zap size={20} /> },
    { label: '평균 응답 시간', value: '12ms', icon: <Activity size={20} /> },
    { label: '자동화율', value: '94%', icon: <Bot size={20} /> }
];

export default function AIHubPage() {
    return (
        <div className="space-y-8 pb-8">
            {/* Hero Section */}
            <motion.section
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary-indigo)]/20 via-[var(--bg-secondary)] to-[var(--primary-green)]/10 border border-[var(--border-subtle)] p-8 md:p-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="absolute inset-0 bg-grid opacity-20" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-indigo)] to-[var(--primary-green)] flex items-center justify-center flex-shrink-0">
                            <Brain size={40} className="text-white" />
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                                    AI 통합 허브
                                </h1>
                                <span className="badge badge-info">v3.0</span>
                            </div>
                            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                                47개의 특화 AI 모델이 실시간으로 농업 데이터를 분석하고,
                                최적의 의사결정을 지원합니다.
                            </p>
                        </div>
                    </div>

                    {/* AI Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {aiStats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="p-4 rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-[var(--primary-indigo)]/10 flex items-center justify-center text-[var(--primary-indigo)] mx-auto mb-2">
                                    {stat.icon}
                                </div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                                <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* AI Services Grid */}
            <section>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-[var(--primary-indigo)]" />
                    AI 서비스
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiServices.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={service.href}>
                                <div className="card-interactive group h-full">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                backgroundColor: `color-mix(in srgb, ${service.color} 15%, transparent)`,
                                                color: service.color
                                            }}
                                        >
                                            {service.icon}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--primary-green)] transition-colors">
                                                    {service.title}
                                                </h3>
                                                {service.badge && (
                                                    <span className={`badge ${service.badge === 'NEW' ? 'badge-warning' : 'badge-info'}`}>
                                                        {service.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-muted)] mb-3">
                                                {service.description}
                                            </p>

                                            {/* Features */}
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {service.features.map((feature) => (
                                                    <span key={feature} className="text-xs px-2 py-1 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Stats & Action */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold" style={{ color: service.color }}>
                                                        {service.stats.value}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-muted)]">
                                                        {service.stats.label}
                                                    </span>
                                                </div>

                                                <div className="flex items-center text-sm text-[var(--primary-green)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span>시작하기</span>
                                                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Quick Insight Panel */}
            <motion.section
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <Activity size={18} className="text-[var(--primary-green)]" />
                    실시간 AI 인사이트
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: '오늘 예측된 수확량', value: '1,247톤', change: '+5.2%', positive: true },
                        { label: '감지된 질병 위험', value: '3건', change: '조기 대응 중', positive: null },
                        { label: 'AI 자동 조치', value: '156건', change: '오늘 실행됨', positive: true }
                    ].map((insight, i) => (
                        <div key={insight.label} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-muted)] mb-1">{insight.label}</p>
                            <p className="text-2xl font-bold text-[var(--text-primary)]">{insight.value}</p>
                            <p className={`text-xs mt-1 ${insight.positive === true ? 'text-[var(--status-success)]' : insight.positive === false ? 'text-[var(--status-danger)]' : 'text-[var(--text-muted)]'}`}>
                                {insight.change}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
