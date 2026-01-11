'use client';

import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Activity,
    Leaf,
    Cpu,
    Zap,
    RefreshCw,
    Download,
    Calendar
} from 'lucide-react';
import {
    RealTimeLineChart,
    PredictionAreaChart,
    CropDistributionChart,
    SensorHealthChart,
    WeeklyPerformanceChart,
    ChartCard,
    CHART_COLORS
} from '@/components/charts/ChartComponents';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-indigo)] to-[var(--secondary-violet)] flex items-center justify-center">
                        <BarChart3 size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            통합 분석 대시보드
                        </h1>
                        <p className="text-[var(--text-muted)]">실시간 데이터 시각화 및 인사이트</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select className="input bg-[var(--bg-secondary)] text-sm py-2 w-auto">
                        <option>최근 7일</option>
                        <option>최근 30일</option>
                        <option>최근 90일</option>
                        <option>올해</option>
                    </select>
                    <button className="btn btn-secondary">
                        <RefreshCw size={16} />
                        새로고침
                    </button>
                    <button className="btn btn-primary">
                        <Download size={16} />
                        리포트
                    </button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: '일일 수확량', value: '1,247kg', change: '+12%', positive: true, icon: <Leaf size={20} />, color: CHART_COLORS.primary },
                    { label: '평균 효율', value: '94.2%', change: '+3.1%', positive: true, icon: <TrendingUp size={20} />, color: CHART_COLORS.secondary },
                    { label: 'AI 분석 결정', value: '2,847', change: '+156', positive: true, icon: <Cpu size={20} />, color: CHART_COLORS.tertiary },
                    { label: '에너지 절감', value: '23.4%', change: '+5.2%', positive: true, icon: <Zap size={20} />, color: CHART_COLORS.quaternary }
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
                        <div className="flex items-end gap-2">
                            <span className="stat-value" style={{ color: stat.color }}>
                                {stat.value}
                            </span>
                            <span className={`text-sm font-medium ${stat.positive ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-time Environment */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <ChartCard
                        title="실시간 환경 모니터링"
                        icon={<Activity size={18} className="text-[var(--primary-green)]" />}
                        badge="LIVE"
                    >
                        <RealTimeLineChart />
                    </ChartCard>
                </motion.div>

                {/* Prediction vs Actual */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <ChartCard
                        title="수확량 예측 vs 실제"
                        icon={<TrendingUp size={18} className="text-[var(--primary-blue)]" />}
                        badge="AI 예측"
                    >
                        <PredictionAreaChart />
                    </ChartCard>
                </motion.div>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Crop Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <ChartCard
                        title="작물 분포"
                        icon={<Leaf size={18} className="text-[var(--status-success)]" />}
                    >
                        <CropDistributionChart />
                    </ChartCard>
                </motion.div>

                {/* Sensor Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <ChartCard
                        title="센서 상태"
                        icon={<Activity size={18} className="text-[var(--primary-indigo)]" />}
                    >
                        <SensorHealthChart />
                    </ChartCard>
                </motion.div>

                {/* Weekly Performance */}
                <motion.div
                    className="md:col-span-2 lg:col-span-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <ChartCard
                        title="주간 성과"
                        icon={<Calendar size={18} className="text-[var(--status-warning)]" />}
                    >
                        <WeeklyPerformanceChart />
                    </ChartCard>
                </motion.div>
            </div>

            {/* AI Insights */}
            <motion.section
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <Cpu size={18} className="text-[var(--primary-indigo)]" />
                    AI 데이터 인사이트
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            title: '성장 패턴 분석',
                            insight: '토마토 성장률이 지난주 대비 8% 향상되었습니다. 최적 온도 유지가 주요 요인입니다.',
                            confidence: 94,
                            action: '상세 보기'
                        },
                        {
                            title: '에너지 최적화',
                            insight: '야간 조명 시간을 2시간 단축하면 전력 소비 15% 절감이 예상됩니다.',
                            confidence: 89,
                            action: '적용하기'
                        },
                        {
                            title: '수확 시점 예측',
                            insight: '딸기 수확 최적 시점은 3일 후로 예측됩니다. 당도 수치가 최고점에 도달할 것으로 보입니다.',
                            confidence: 92,
                            action: '일정 설정'
                        }
                    ].map((item, i) => (
                        <div key={item.title} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-[var(--text-primary)]">{item.title}</h4>
                                <span className="badge badge-success">신뢰도 {item.confidence}%</span>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] mb-4">
                                {item.insight}
                            </p>
                            <button className="btn btn-ghost text-[var(--primary-green)] text-sm p-0 h-auto">
                                {item.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
