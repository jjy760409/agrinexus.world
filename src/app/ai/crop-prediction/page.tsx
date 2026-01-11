'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Leaf,
    TrendingUp,
    Calendar,
    Droplets,
    Sun,
    ThermometerSun,
    BarChart3,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Filter,
    Download
} from 'lucide-react';

// Sample prediction data
const cropData = [
    { id: 1, name: '토마토', currentYield: 2450, predictedYield: 2680, accuracy: 97.5, status: 'growing', growthRate: 4.2, harvestDate: '2026-01-25' },
    { id: 2, name: '상추', currentYield: 1820, predictedYield: 1950, accuracy: 98.1, status: 'ready', growthRate: 2.8, harvestDate: '2026-01-12' },
    { id: 3, name: '오이', currentYield: 3200, predictedYield: 3450, accuracy: 96.8, status: 'growing', growthRate: 3.5, harvestDate: '2026-01-20' },
    { id: 4, name: '파프리카', currentYield: 1650, predictedYield: 1780, accuracy: 95.2, status: 'seeding', growthRate: 1.2, harvestDate: '2026-02-15' },
    { id: 5, name: '딸기', currentYield: 890, predictedYield: 1020, accuracy: 94.7, status: 'growing', growthRate: 5.1, harvestDate: '2026-01-30' }
];

const environmentData = [
    { label: '평균 온도', value: '24.5°C', icon: <ThermometerSun size={18} />, optimal: true },
    { label: '습도', value: '68%', icon: <Droplets size={18} />, optimal: true },
    { label: '일조량', value: '8.2h', icon: <Sun size={18} />, optimal: false },
    { label: '토양 수분', value: '42%', icon: <Droplets size={18} />, optimal: true }
];

const weeklyPrediction = [
    { day: '월', yield: 245 },
    { day: '화', yield: 268 },
    { day: '수', yield: 312 },
    { day: '목', yield: 289 },
    { day: '금', yield: 356 },
    { day: '토', yield: 298 },
    { day: '일', yield: 320 }
];

export default function CropPredictionPage() {
    const [selectedCrop, setSelectedCrop] = useState<number | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const totalPredicted = useMemo(() =>
        cropData.reduce((acc, crop) => acc + crop.predictedYield, 0),
        []
    );

    const avgAccuracy = useMemo(() =>
        (cropData.reduce((acc, crop) => acc + crop.accuracy, 0) / cropData.length).toFixed(1),
        []
    );

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const maxYield = Math.max(...weeklyPrediction.map(d => d.yield));

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--secondary-teal)] flex items-center justify-center">
                        <Leaf size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            작물 수확량 예측
                        </h1>
                        <p className="text-[var(--text-muted)]">AI 기반 정밀 예측 시스템</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="btn btn-secondary"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        새로고침
                    </button>
                    <button className="btn btn-secondary">
                        <Filter size={16} />
                        필터
                    </button>
                    <button className="btn btn-primary">
                        <Download size={16} />
                        리포트 다운로드
                    </button>
                </div>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: '총 예측 수확량', value: `${totalPredicted.toLocaleString()}kg`, icon: <TrendingUp size={20} />, color: 'var(--primary-green)' },
                    { label: '평균 예측 정확도', value: `${avgAccuracy}%`, icon: <BarChart3 size={20} />, color: 'var(--primary-blue)' },
                    { label: '모니터링 작물', value: `${cropData.length}종`, icon: <Leaf size={20} />, color: 'var(--primary-indigo)' },
                    { label: '다음 수확일', value: '2일 후', icon: <Calendar size={20} />, color: 'var(--status-success)' }
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

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Crop List */}
                <motion.div
                    className="lg:col-span-2 card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Leaf size={18} className="text-[var(--primary-green)]" />
                            작물별 예측 현황
                        </h3>
                        <span className="badge badge-neutral">{cropData.length} 작물</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)]">
                                    <th className="text-left py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">작물</th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">현재</th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">예측</th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">정확도</th>
                                    <th className="text-center py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">상태</th>
                                    <th className="text-right py-3 px-2 text-xs font-semibold text-[var(--text-muted)] uppercase">성장률</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cropData.map((crop, i) => {
                                    const diff = ((crop.predictedYield - crop.currentYield) / crop.currentYield * 100).toFixed(1);
                                    const isPositive = parseFloat(diff) > 0;

                                    return (
                                        <motion.tr
                                            key={crop.id}
                                            className={`border-b border-[var(--border-subtle)] hover:bg-[var(--bg-tertiary)] cursor-pointer transition-colors ${selectedCrop === crop.id ? 'bg-[var(--bg-tertiary)]' : ''}`}
                                            onClick={() => setSelectedCrop(crop.id)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + i * 0.05 }}
                                        >
                                            <td className="py-3 px-2">
                                                <span className="font-medium text-[var(--text-primary)]">{crop.name}</span>
                                            </td>
                                            <td className="py-3 px-2 text-right text-[var(--text-secondary)] font-mono">
                                                {crop.currentYield.toLocaleString()}kg
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <span className="font-semibold text-[var(--primary-green)] font-mono">
                                                        {crop.predictedYield.toLocaleString()}kg
                                                    </span>
                                                    <span className={`text-xs flex items-center ${isPositive ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'}`}>
                                                        {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                                        {diff}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-2 text-right">
                                                <span className="font-mono text-[var(--primary-blue)]">{crop.accuracy}%</span>
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`badge ${crop.status === 'ready' ? 'badge-success' : crop.status === 'growing' ? 'badge-info' : 'badge-neutral'}`}>
                                                    {crop.status === 'ready' ? '수확 가능' : crop.status === 'growing' ? '성장 중' : '파종'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 text-right font-mono text-[var(--status-success)]">
                                                +{crop.growthRate}%
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Environment & Chart */}
                <div className="space-y-6">
                    {/* Environment Status */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <ThermometerSun size={18} className="text-[var(--primary-blue)]" />
                            환경 상태
                        </h3>

                        <div className="space-y-3">
                            {environmentData.map((env, i) => (
                                <div key={env.label} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[var(--text-muted)]">{env.icon}</span>
                                        <span className="text-sm text-[var(--text-secondary)]">{env.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold font-mono text-[var(--text-primary)]">{env.value}</span>
                                        <span className={`status-dot ${env.optimal ? 'online' : 'warning'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Weekly Prediction Chart */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <BarChart3 size={18} className="text-[var(--primary-indigo)]" />
                            주간 예측 트렌드
                        </h3>

                        <div className="h-40 flex items-end justify-between gap-2">
                            {weeklyPrediction.map((day, i) => {
                                const height = (day.yield / maxYield) * 100;
                                return (
                                    <motion.div
                                        key={day.day}
                                        className="flex-1 flex flex-col items-center gap-2"
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        transition={{ delay: 0.5 + i * 0.05 }}
                                    >
                                        <span className="text-xs text-[var(--text-muted)] font-mono">
                                            {day.yield}
                                        </span>
                                        <div
                                            className="w-full rounded-t-md bg-gradient-to-t from-[var(--primary-green)] to-[var(--primary-blue)]"
                                            style={{ height: `${height}%`, minHeight: '20px' }}
                                        />
                                        <span className="text-xs text-[var(--text-muted)]">{day.day}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* AI Recommendations */}
            <motion.section
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <Leaf size={18} className="text-[var(--primary-green)]" />
                    AI 추천 최적 재배 조건
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: '온도 조절', desc: '낮 시간대 온도를 1-2°C 낮추면 토마토 성장률이 8% 향상될 것으로 예측됩니다.', action: '자동 적용' },
                        { title: '관수 스케줄', desc: '상추의 경우 오전 6시 관수가 최적입니다. 현재 설정보다 30분 앞당기는 것을 추천합니다.', action: '스케줄 변경' },
                        { title: '광량 증가', desc: '딸기 재배 구역의 보조 조명을 2시간 추가하면 수확량이 12% 증가할 것으로 예상됩니다.', action: '검토하기' }
                    ].map((rec, i) => (
                        <div key={rec.title} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                            <h4 className="font-medium text-[var(--text-primary)] mb-2">{rec.title}</h4>
                            <p className="text-sm text-[var(--text-muted)] mb-3">{rec.desc}</p>
                            <button className="btn btn-ghost text-[var(--primary-green)] text-sm p-0 h-auto">
                                {rec.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
