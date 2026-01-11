'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Thermometer,
    Droplets,
    Wind,
    Sun,
    Gauge,
    Bell,
    AlertTriangle,
    CheckCircle,
    Clock,
    RefreshCw,
    Settings,
    Power,
    Zap,
    Leaf,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

// Sensor data types
interface SensorData {
    id: string;
    name: string;
    value: number;
    unit: string;
    min: number;
    max: number;
    optimal: [number, number];
    icon: React.ReactNode;
    color: string;
}

interface Alert {
    id: number;
    type: 'warning' | 'danger' | 'success' | 'info';
    title: string;
    message: string;
    time: string;
    acknowledged: boolean;
}

// Initial sensor configurations
const initialSensors: SensorData[] = [
    { id: 'temp', name: '온도', value: 24.5, unit: '°C', min: 0, max: 40, optimal: [20, 28], icon: <Thermometer size={20} />, color: 'var(--status-warning)' },
    { id: 'humidity', name: '습도', value: 68, unit: '%', min: 0, max: 100, optimal: [60, 80], icon: <Droplets size={20} />, color: 'var(--primary-blue)' },
    { id: 'soil', name: '토양 수분', value: 42, unit: '%', min: 0, max: 100, optimal: [35, 60], icon: <Droplets size={20} />, color: 'var(--primary-green)' },
    { id: 'light', name: '광량', value: 850, unit: 'lux', min: 0, max: 2000, optimal: [600, 1200], icon: <Sun size={20} />, color: 'var(--status-warning)' },
    { id: 'co2', name: 'CO₂ 농도', value: 420, unit: 'ppm', min: 0, max: 1000, optimal: [350, 600], icon: <Wind size={20} />, color: 'var(--primary-indigo)' },
    { id: 'ec', name: 'EC 농도', value: 1.8, unit: 'mS/cm', min: 0, max: 4, optimal: [1.5, 2.5], icon: <Gauge size={20} />, color: 'var(--secondary-teal)' }
];

const mockAlerts: Alert[] = [
    { id: 1, type: 'warning', title: '습도 상승 감지', message: 'A-3 구역 습도가 85%로 상승했습니다.', time: '5분 전', acknowledged: false },
    { id: 2, type: 'success', title: '관수 완료', message: 'B-2 구역 자동 관수가 완료되었습니다.', time: '12분 전', acknowledged: true },
    { id: 3, type: 'info', title: 'AI 분석 업데이트', message: '오늘의 성장 예측 리포트가 준비되었습니다.', time: '30분 전', acknowledged: true },
    { id: 4, type: 'danger', title: '센서 오류', message: 'C-1 구역 온도 센서 점검이 필요합니다.', time: '1시간 전', acknowledged: false }
];

const zones = ['A-1', 'A-2', 'A-3', 'B-1', 'B-2', 'B-3', 'C-1', 'C-2', 'C-3'];

export default function MonitoringPage() {
    const [sensors, setSensors] = useState(initialSensors);
    const [alerts, setAlerts] = useState(mockAlerts);
    const [selectedZone, setSelectedZone] = useState('A-1');
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prevSensors =>
                prevSensors.map(sensor => ({
                    ...sensor,
                    value: parseFloat(
                        (sensor.value + (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.02).toFixed(1)
                    )
                }))
            );
            setLastUpdate(new Date());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastUpdate(new Date());
        setIsRefreshing(false);
    };

    const acknowledgeAlert = (id: number) => {
        setAlerts(prevAlerts =>
            prevAlerts.map(alert =>
                alert.id === id ? { ...alert, acknowledged: true } : alert
            )
        );
    };

    const unacknowledgedCount = useMemo(() =>
        alerts.filter(a => !a.acknowledged).length,
        [alerts]
    );

    const isOptimal = (sensor: SensorData) => {
        return sensor.value >= sensor.optimal[0] && sensor.value <= sensor.optimal[1];
    };

    const getProgress = (sensor: SensorData) => {
        return ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'danger': return <AlertTriangle size={16} className="text-[var(--status-danger)]" />;
            case 'warning': return <AlertTriangle size={16} className="text-[var(--status-warning)]" />;
            case 'success': return <CheckCircle size={16} className="text-[var(--status-success)]" />;
            default: return <Bell size={16} className="text-[var(--status-info)]" />;
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-indigo)] flex items-center justify-center">
                        <Activity size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            실시간 모니터링
                        </h1>
                        <p className="text-[var(--text-muted)]">센서 데이터 및 시스템 상태</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">
                        <span className="status-dot online" />
                        <span className="text-xs text-[var(--text-secondary)]">
                            실시간 연결
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">
                        <Clock size={14} className="text-[var(--text-muted)]" />
                        <span className="text-xs text-[var(--text-secondary)] font-mono">
                            {lastUpdate.toLocaleTimeString('ko-KR')}
                        </span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-secondary"
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                        새로고침
                    </button>
                </div>
            </motion.div>

            {/* Zone Selector */}
            <motion.div
                className="flex items-center gap-2 overflow-x-auto pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <span className="text-sm text-[var(--text-muted)] flex-shrink-0">구역:</span>
                {zones.map((zone) => (
                    <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0
                            ${selectedZone === zone
                                ? 'bg-[var(--primary-green)] text-white'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                            }
                        `}
                    >
                        {zone}
                    </button>
                ))}
            </motion.div>

            {/* Sensor Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {sensors.map((sensor, i) => {
                    const optimal = isOptimal(sensor);
                    const progress = getProgress(sensor);

                    return (
                        <motion.div
                            key={sensor.id}
                            className="card p-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span style={{ color: sensor.color }}>{sensor.icon}</span>
                                <span className={`status-dot ${optimal ? 'online' : 'warning'}`} />
                            </div>

                            <p className="text-2xl font-bold text-[var(--text-primary)] font-mono mb-1">
                                {sensor.value}
                                <span className="text-sm font-normal text-[var(--text-muted)] ml-1">
                                    {sensor.unit}
                                </span>
                            </p>

                            <p className="text-xs text-[var(--text-muted)] mb-3">{sensor.name}</p>

                            <div className="progress h-1.5">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor: optimal ? 'var(--status-success)' : 'var(--status-warning)'
                                    }}
                                />
                            </div>

                            <p className="text-xs text-[var(--text-muted)] mt-2">
                                적정: {sensor.optimal[0]}-{sensor.optimal[1]}{sensor.unit}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Main Grid: Overview & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <motion.div
                    className="lg:col-span-2 card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                        <TrendingUp size={18} className="text-[var(--primary-green)]" />
                        시스템 개요
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: '활성 센서', value: '54/56', icon: <Activity size={16} />, trend: null },
                            { label: '자동화율', value: '94%', icon: <Zap size={16} />, trend: 'up' },
                            { label: '에너지 효율', value: '87%', icon: <Power size={16} />, trend: 'up' },
                            { label: '작물 상태', value: '양호', icon: <Leaf size={16} />, trend: null }
                        ].map((stat, i) => (
                            <div key={stat.label} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                                    {stat.icon}
                                    <span className="text-xs">{stat.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-[var(--text-primary)]">
                                        {stat.value}
                                    </span>
                                    {stat.trend && (
                                        <span className="text-xs text-[var(--status-success)] flex items-center">
                                            {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Controls */}
                    <h4 className="font-medium text-[var(--text-secondary)] mb-3">빠른 제어</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: '자동 관수', active: true, icon: <Droplets size={18} /> },
                            { label: '환기 시스템', active: true, icon: <Wind size={18} /> },
                            { label: '보조 조명', active: false, icon: <Sun size={18} /> },
                            { label: '온도 조절', active: true, icon: <Thermometer size={18} /> }
                        ].map((control) => (
                            <button
                                key={control.label}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                                    ${control.active
                                        ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)]/30 text-[var(--primary-green)]'
                                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                                    }
                                `}
                            >
                                {control.icon}
                                <span className="text-sm font-medium">{control.label}</span>
                                <span className={`ml-auto w-2 h-2 rounded-full ${control.active ? 'bg-[var(--primary-green)]' : 'bg-[var(--text-muted)]'}`} />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Alerts */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Bell size={18} className="text-[var(--status-warning)]" />
                            알림 센터
                        </h3>
                        {unacknowledgedCount > 0 && (
                            <span className="badge badge-danger">{unacknowledgedCount} 새 알림</span>
                        )}
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer
                                    ${alert.acknowledged
                                        ? 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
                                        : 'bg-[var(--bg-tertiary)] border-[var(--border-default)]'
                                    }
                                `}
                                onClick={() => acknowledgeAlert(alert.id)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {getAlertIcon(alert.type)}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${alert.acknowledged ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                                        {alert.title}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] truncate">
                                        {alert.message}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                        {alert.time}
                                    </p>
                                </div>
                                {!alert.acknowledged && (
                                    <span className="w-2 h-2 rounded-full bg-[var(--status-info)] flex-shrink-0 mt-1" />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full btn btn-ghost mt-4 text-sm">
                        전체 알림 보기
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
