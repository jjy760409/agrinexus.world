'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import RealtimeChart from '@/components/ui/RealtimeChart';
import Farm3D from '@/components/3d/Farm3D';

export default function IoTNexus() {
    const { sensors, updateSensor, alerts, addAlert, clearAlerts } = useStore();

    // Update sensors periodically
    useEffect(() => {
        const interval = setInterval(() => {
            Object.keys(sensors).forEach(id => {
                const sensor = sensors[id];
                const change = (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.05;
                const newValue = Math.max(sensor.min, Math.min(sensor.max, sensor.value + change));

                updateSensor(id, {
                    value: newValue,
                    trend: newValue > sensor.value ? 'up' : newValue < sensor.value ? 'down' : 'stable',
                    history: [...sensor.history.slice(-19), newValue],
                });
            });

            // Random alert
            if (Math.random() > 0.85) {
                const alertTypes = [
                    { type: 'info' as const, icon: 'ℹ️', title: 'AI 분석 업데이트', desc: '센서 데이터 패턴이 정상입니다' },
                    { type: 'success' as const, icon: '✅', title: '자동 조절 완료', desc: '환경이 최적 상태로 유지됩니다' },
                    { type: 'warning' as const, icon: '⚠️', title: '센서 주의', desc: '일부 수치가 경계값에 근접했습니다' },
                ];
                const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
                addAlert({
                    ...randomAlert,
                    id: `alert-${Date.now()}`,
                    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [sensors, updateSensor, addAlert]);

    const getSensorStatus = useCallback((sensor: typeof sensors[string]) => {
        const { value, optimal, min, max } = sensor;
        if (value >= optimal[0] && value <= optimal[1]) return 'optimal';
        if (value < min * 1.1 || value > max * 0.9) return 'critical';
        return 'warning';
    }, []);

    const getTrendIcon = (trend: string) => {
        return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    };

    const activeSensors = Object.keys(sensors).length;

    return (
        <div className="space-y-6">
            {/* Module Header */}
            <div className="text-center mb-8">
                <motion.h2
                    className="text-2xl md:text-3xl font-bold gradient-text font-[family-name:var(--font-orbitron)] mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    📡 IoT Nexus
                </motion.h2>
                <p className="text-white/60">실시간 센서 네트워크 & 데이터 허브</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sensors Grid Card */}
                <motion.div
                    className="lg:row-span-2 glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🌡️ 실시간 센서
                        </h3>
                        <span className="text-sm text-white/60">
                            <span className="text-[var(--primary-green)]">{activeSensors}</span>/{activeSensors} 활성
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {Object.values(sensors).map((sensor) => {
                            const status = getSensorStatus(sensor);
                            return (
                                <motion.div
                                    key={sensor.id}
                                    className={`p-3 rounded-xl text-center border transition-all ${status === 'optimal'
                                            ? 'bg-white/5 border-white/10 hover:border-[var(--primary-cyan)]'
                                            : status === 'warning'
                                                ? 'bg-[var(--status-warning)]/10 border-[var(--status-warning)]'
                                                : 'bg-[var(--status-danger)]/10 border-[var(--status-danger)] animate-pulse'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="text-2xl mb-1">{sensor.icon}</div>
                                    <div className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                        {sensor.unit === '' ? sensor.value.toFixed(1) : Math.round(sensor.value)}
                                    </div>
                                    <div className="text-xs text-white/40">{sensor.unit}</div>
                                    <div className="text-xs text-white/60 mt-1">{sensor.name}</div>
                                    <div className={`text-xs mt-1 ${sensor.trend === 'up' ? 'text-[var(--status-success)]' :
                                            sensor.trend === 'down' ? 'text-[var(--status-danger)]' :
                                                'text-white/40'
                                        }`}>
                                        {getTrendIcon(sensor.trend)}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* 3D Farm Map Card */}
                <motion.div
                    className="lg:col-span-2 glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🗺️ 3D 스마트팜 맵
                        </h3>
                        <div className="flex gap-1">
                            {['상단', '등각', '측면'].map((view, i) => (
                                <button
                                    key={view}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${i === 1
                                            ? 'bg-[var(--primary-green)] border-[var(--primary-green)] text-[var(--bg-dark)]'
                                            : 'border-white/20 text-white/60 hover:border-[var(--primary-cyan)]'
                                        }`}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-72 rounded-xl overflow-hidden bg-black/30">
                        <Farm3D />
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        {[
                            { label: '최적', color: 'bg-[var(--status-success)]' },
                            { label: '양호', color: 'bg-[var(--status-info)]' },
                            { label: '주의', color: 'bg-[var(--status-warning)]' },
                            { label: '위험', color: 'bg-[var(--status-danger)]' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2 text-xs text-white/60">
                                <span className={`w-3 h-3 rounded ${item.color}`} />
                                {item.label}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Alerts Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🔔 알림 센터
                        </h3>
                        <button
                            onClick={clearAlerts}
                            className="text-xs text-white/40 hover:text-white/70 transition-colors"
                        >
                            모두 읽음
                        </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {alerts.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border-l-3 ${alert.type === 'success' ? 'bg-[var(--status-success)]/10 border-l-[var(--status-success)]' :
                                        alert.type === 'warning' ? 'bg-[var(--status-warning)]/10 border-l-[var(--status-warning)]' :
                                            alert.type === 'danger' ? 'bg-[var(--status-danger)]/10 border-l-[var(--status-danger)]' :
                                                'bg-[var(--status-info)]/10 border-l-[var(--status-info)]'
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className="text-lg">{alert.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{alert.title}</div>
                                    <div className="text-xs text-white/50 line-clamp-1">{alert.desc}</div>
                                </div>
                                <span className="text-xs text-white/30">{alert.time}</span>
                            </motion.div>
                        ))}

                        {alerts.length === 0 && (
                            <div className="text-center py-8 text-white/40">
                                <span className="text-4xl block mb-2">🔕</span>
                                새 알림이 없습니다
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Realtime Chart Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            📈 실시간 데이터
                        </h3>
                        <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-xs text-white/80 focus:outline-none focus:border-[var(--primary-cyan)]">
                            <option value="temperature">온도</option>
                            <option value="humidity">습도</option>
                            <option value="co2">CO2</option>
                            <option value="light">조도</option>
                        </select>
                    </div>

                    <div className="h-52">
                        <RealtimeChart data={sensors.temp?.history || []} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
