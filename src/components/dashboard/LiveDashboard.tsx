'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getRealTimeService,
    SensorData,
    FarmMetrics,
    AlertData,
    RobotStatus
} from '@/lib/realtime/realtimeService';

export default function LiveDashboard() {
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [metrics, setMetrics] = useState<FarmMetrics | null>(null);
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [robots, setRobots] = useState<RobotStatus[]>([]);
    const [isLive, setIsLive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    useEffect(() => {
        const service = getRealTimeService();

        // 센서 데이터 구독
        const unsubSensors = service.subscribe('farm-sensors', 'sensor-update', (data: SensorData) => {
            setSensorData(data);
            setLastUpdate(new Date());
        });

        // 메트릭 구독
        const unsubMetrics = service.subscribe('farm-metrics', 'metrics-update', (data: FarmMetrics) => {
            setMetrics(data);
        });

        // 알림 구독
        const unsubAlerts = service.subscribe('farm-alerts', 'new-alert', (data: AlertData) => {
            setAlerts(prev => [data, ...prev].slice(0, 10));
        });

        // 로봇 상태 구독
        const unsubRobots = service.subscribe('farm-robots', 'robot-update', (data: RobotStatus[]) => {
            setRobots(data);
        });

        return () => {
            unsubSensors();
            unsubMetrics();
            unsubAlerts();
            unsubRobots();
        };
    }, []);

    const formatTime = useCallback((date: Date) => {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }, []);

    const getStatusColor = (value: number, min: number, max: number) => {
        if (value < min || value > max) return 'text-red-400';
        if (value < min * 1.1 || value > max * 0.9) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    <h2 className="text-xl font-bold gradient-text">실시간 모니터링</h2>
                    <span className="text-xs text-white/40">
                        마지막 업데이트: {formatTime(lastUpdate)}
                    </span>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-3 py-1 rounded-full text-xs ${isLive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}
                >
                    {isLive ? '🔴 LIVE' : '⏸️ PAUSED'}
                </button>
            </div>

            {/* 센서 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <SensorCard
                    icon="🌡️"
                    label="온도"
                    value={sensorData?.temperature ?? 0}
                    unit="°C"
                    min={18}
                    max={28}
                    color="red"
                />
                <SensorCard
                    icon="💧"
                    label="습도"
                    value={sensorData?.humidity ?? 0}
                    unit="%"
                    min={50}
                    max={80}
                    color="blue"
                />
                <SensorCard
                    icon="🌿"
                    label="CO₂"
                    value={sensorData?.co2 ?? 0}
                    unit="ppm"
                    min={600}
                    max={1200}
                    color="green"
                />
                <SensorCard
                    icon="☀️"
                    label="광량"
                    value={sensorData?.light ?? 0}
                    unit="μmol"
                    min={300}
                    max={600}
                    color="yellow"
                />
                <SensorCard
                    icon="🧪"
                    label="pH"
                    value={sensorData?.ph ?? 0}
                    unit=""
                    min={5.5}
                    max={6.5}
                    precision={2}
                    color="purple"
                />
                <SensorCard
                    icon="⚡"
                    label="EC"
                    value={sensorData?.ec ?? 0}
                    unit="mS/cm"
                    min={1.5}
                    max={2.5}
                    precision={2}
                    color="cyan"
                />
                <SensorCard
                    icon="🌊"
                    label="수위"
                    value={sensorData?.waterLevel ?? 0}
                    unit="%"
                    min={70}
                    max={100}
                    color="blue"
                />
                <SensorCard
                    icon="🌀"
                    label="공기 유량"
                    value={sensorData?.airFlow ?? 0}
                    unit="m³/h"
                    min={100}
                    max={150}
                    color="teal"
                />
            </div>

            {/* 메트릭 & 로봇 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 시스템 메트릭 */}
                <div className="glass rounded-xl p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <span>📊</span> 시스템 메트릭
                    </h3>
                    <div className="space-y-3">
                        <MetricBar label="에너지 소비" value={metrics?.energyConsumption ?? 0} max={6000} unit="W" color="yellow" />
                        <MetricBar label="물 사용량" value={metrics?.waterUsage ?? 0} max={200} unit="L/hr" color="blue" />
                        <MetricBar label="수확률" value={metrics?.harvestRate ?? 0} max={100} unit="%" color="green" />
                        <MetricBar label="성장 진행" value={metrics?.growthProgress ?? 0} max={100} unit="%" color="purple" />
                        <MetricBar label="시스템 건강" value={metrics?.systemHealth ?? 0} max={100} unit="%" color="cyan" />
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-sm">
                        <span className="text-white/50">AI 의사결정</span>
                        <span className="font-bold gradient-text">{metrics?.aiDecisions.toLocaleString() ?? 0}회</span>
                    </div>
                </div>

                {/* 로봇 상태 */}
                <div className="glass rounded-xl p-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                        <span>🤖</span> 로봇 상태
                    </h3>
                    <div className="space-y-2">
                        {robots.map((robot) => (
                            <motion.div
                                key={robot.id}
                                className="p-3 rounded-lg bg-white/5 flex items-center justify-between"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${robot.status === 'active' ? 'bg-green-400 animate-pulse' :
                                            robot.status === 'charging' ? 'bg-yellow-400' :
                                                robot.status === 'idle' ? 'bg-blue-400' : 'bg-red-400'
                                        }`} />
                                    <div>
                                        <div className="text-sm font-medium">{robot.name}</div>
                                        <div className="text-xs text-white/50">{robot.currentTask}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-xs text-white/50">배터리</div>
                                        <div className={`text-sm font-bold ${robot.battery > 60 ? 'text-green-400' :
                                                robot.battery > 30 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>{robot.battery.toFixed(0)}%</div>
                                    </div>
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${robot.battery > 60 ? 'bg-green-400' :
                                                    robot.battery > 30 ? 'bg-yellow-400' : 'bg-red-400'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${robot.battery}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 알림 피드 */}
            <div className="glass rounded-xl p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>🔔</span> 실시간 알림
                    {alerts.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                            {alerts.length}
                        </span>
                    )}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    <AnimatePresence>
                        {alerts.length === 0 ? (
                            <div className="text-center text-white/40 py-4">
                                아직 알림이 없습니다
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <motion.div
                                    key={alert.id}
                                    className={`p-3 rounded-lg flex items-start gap-3 ${alert.type === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                                            alert.type === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                                                alert.type === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                                                    'bg-blue-500/10 border border-blue-500/30'
                                        }`}
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 100 }}
                                >
                                    <span className="text-lg">
                                        {alert.type === 'critical' ? '🚨' :
                                            alert.type === 'warning' ? '⚠️' :
                                                alert.type === 'success' ? '✅' : 'ℹ️'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{alert.title}</span>
                                            <span className="text-xs text-white/40">{alert.source}</span>
                                        </div>
                                        <p className="text-xs text-white/60 truncate">{alert.message}</p>
                                    </div>
                                    <span className="text-xs text-white/40 whitespace-nowrap">
                                        {formatTime(new Date(alert.timestamp))}
                                    </span>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// 센서 카드 컴포넌트
function SensorCard({ icon, label, value, unit, min, max, color, precision = 1 }: {
    icon: string;
    label: string;
    value: number;
    unit: string;
    min: number;
    max: number;
    color: string;
    precision?: number;
}) {
    const isOptimal = value >= min && value <= max;
    const isWarning = value < min * 0.9 || value > max * 1.1;

    const colorClasses: Record<string, string> = {
        red: 'from-red-500/20 to-red-600/10 border-red-500/30',
        blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
        green: 'from-green-500/20 to-green-600/10 border-green-500/30',
        yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
        purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
        cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
        teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30',
    };

    return (
        <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}
            animate={{
                scale: isWarning ? [1, 1.02, 1] : 1,
                borderColor: isWarning ? ['rgba(255,100,100,0.3)', 'rgba(255,100,100,0.6)', 'rgba(255,100,100,0.3)'] : undefined
            }}
            transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{icon}</span>
                <span className={`w-2 h-2 rounded-full ${isOptimal ? 'bg-green-400' : isWarning ? 'bg-red-400 animate-pulse' : 'bg-yellow-400'
                    }`} />
            </div>
            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">
                <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={isOptimal ? 'text-white' : isWarning ? 'text-red-400' : 'text-yellow-400'}
                >
                    {value.toFixed(precision)}
                </motion.span>
                <span className="text-sm text-white/50 ml-1">{unit}</span>
            </div>
            <div className="text-xs text-white/50">{label}</div>
            <div className="text-xs text-white/30 mt-1">
                적정: {min} - {max}
            </div>
        </motion.div>
    );
}

// 메트릭 바 컴포넌트
function MetricBar({ label, value, max, unit, color }: {
    label: string;
    value: number;
    max: number;
    unit: string;
    color: string;
}) {
    const percentage = Math.min((value / max) * 100, 100);

    const colorClasses: Record<string, string> = {
        red: 'from-red-400 to-red-600',
        blue: 'from-blue-400 to-blue-600',
        green: 'from-green-400 to-green-600',
        yellow: 'from-yellow-400 to-yellow-600',
        purple: 'from-purple-400 to-purple-600',
        cyan: 'from-cyan-400 to-cyan-600',
        teal: 'from-teal-400 to-teal-600',
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-white/60">{label}</span>
                <span className="font-medium">{value.toFixed(1)}{unit}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}
