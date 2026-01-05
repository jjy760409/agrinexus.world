'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    generateDigitalTwinData,
    generateEquipmentHealth,
    generateSmartAlert,
    DigitalTwin,
    EquipmentHealth,
    SmartAlert,
} from '@/lib/systems/advancedSystems';

export default function DigitalTwinDashboard() {
    const [twin, setTwin] = useState<DigitalTwin | null>(null);
    const [equipment, setEquipment] = useState<EquipmentHealth[]>([]);
    const [alerts, setAlerts] = useState<SmartAlert[]>([]);
    const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'overview' | 'sensors' | 'maintenance' | 'simulation'>('overview');
    const [isLive, setIsLive] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setTwin(generateDigitalTwinData());
        setEquipment(generateEquipmentHealth());
    }, []);

    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setTwin(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    accuracy: 99.5 + Math.random() * 0.5,
                    lastSync: new Date(),
                    metrics: {
                        ...prev.metrics,
                        harvestReady: prev.metrics.harvestReady + Math.floor(Math.random() * 10),
                    },
                };
            });

            if (Math.random() > 0.8) {
                const alert = generateSmartAlert();
                setAlerts(prev => [alert, ...prev.slice(0, 9)]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [isLive]);

    // 3D Visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !twin) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };
        resize();

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        let frame = 0;
        let animationId: number;

        const animate = () => {
            frame++;
            ctx.fillStyle = 'rgba(10, 20, 30, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Grid floor
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
            ctx.lineWidth = 0.5;
            for (let x = 0; x < width; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, height * 0.6);
                ctx.lineTo(x + (x - width / 2) * 0.3, height);
                ctx.stroke();
            }
            for (let y = height * 0.6; y < height; y += 20) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Farm building outline
            const buildingWidth = width * 0.6;
            const buildingHeight = height * 0.4;
            const buildingX = (width - buildingWidth) / 2;
            const buildingY = height * 0.2;

            // 3D building effect
            ctx.fillStyle = 'rgba(30, 50, 70, 0.8)';
            ctx.fillRect(buildingX, buildingY, buildingWidth, buildingHeight);

            // Rack sections
            const rackCount = 6;
            for (let i = 0; i < rackCount; i++) {
                const x = buildingX + 20 + i * (buildingWidth - 40) / rackCount;
                const rackW = (buildingWidth - 60) / rackCount - 10;

                // Rack glow based on status
                const glowColor = twin.systems[i % twin.systems.length].status === 'online'
                    ? `rgba(0, 255, 136, ${0.3 + Math.sin(frame * 0.05 + i) * 0.1})`
                    : 'rgba(255, 100, 100, 0.3)';

                ctx.fillStyle = glowColor;
                ctx.fillRect(x, buildingY + 20, rackW, buildingHeight - 40);

                // LED strips
                for (let j = 0; j < 4; j++) {
                    ctx.fillStyle = `rgba(255, 136, 255, ${0.5 + Math.sin(frame * 0.1 + i + j) * 0.3})`;
                    ctx.fillRect(x, buildingY + 30 + j * 25, rackW, 3);
                }
            }

            // Sensor points
            twin.sensors.slice(0, 20).forEach((sensor, i) => {
                const x = buildingX + 20 + (sensor.location.x / 20) * (buildingWidth - 40);
                const y = buildingY + 20 + (sensor.location.y / 15) * (buildingHeight - 40);

                ctx.beginPath();
                ctx.arc(x, y, 3 + Math.sin(frame * 0.1 + i) * 1, 0, Math.PI * 2);
                ctx.fillStyle = sensor.status === 'active'
                    ? `rgba(0, 212, 255, ${0.5 + Math.sin(frame * 0.05 + i) * 0.3})`
                    : 'rgba(255, 200, 100, 0.7)';
                ctx.fill();
            });

            // Sync pulse
            const pulseRadius = 20 + (frame % 60) * 3;
            const pulseOpacity = 1 - (frame % 60) / 60;
            ctx.beginPath();
            ctx.arc(width / 2, buildingY + buildingHeight / 2, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 255, 136, ${pulseOpacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, [twin]);

    if (!twin) {
        return (
            <div className="h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                    🌐
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4 overflow-hidden">
            {/* Header */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-purple)] flex items-center justify-center"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-2xl">🌐</span>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                디지털 트윈
                            </h1>
                            <p className="text-sm text-white/60">
                                {twin.name} · 정확도 {twin.accuracy.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.div
                            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${twin.syncStatus === 'synced'
                                    ? 'bg-[var(--primary-green)]/20 text-[var(--primary-green)]'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            ● {twin.syncStatus === 'synced' ? '실시간 동기화' : '동기화 중...'}
                        </motion.div>

                        <div className="hidden md:flex items-center gap-2">
                            {['overview', 'sensors', 'maintenance', 'simulation'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode as typeof viewMode)}
                                    className={`px-3 py-1 rounded-lg text-sm ${viewMode === mode
                                            ? 'bg-[var(--primary-cyan)] text-[var(--bg-dark)]'
                                            : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    {mode === 'overview' ? '개요' : mode === 'sensors' ? '센서' : mode === 'maintenance' ? '유지보수' : '시뮬레이션'}
                                </button>
                            ))}
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
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Left - 3D View */}
                <div className="flex-1 glass rounded-xl overflow-hidden relative">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* Metrics Overlay */}
                    <div className="absolute top-4 left-4 grid grid-cols-3 gap-2">
                        <MetricBadge label="식물" value={twin.metrics.totalPlants.toLocaleString()} icon="🌱" />
                        <MetricBadge label="활성 구역" value={twin.metrics.activeZones.toString()} icon="📍" />
                        <MetricBadge label="수확 준비" value={twin.metrics.harvestReady.toLocaleString()} icon="✂️" />
                    </div>

                    {/* Systems Status */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {twin.systems.map(system => (
                                <button
                                    key={system.id}
                                    onClick={() => setSelectedSystem(system.id === selectedSystem ? null : system.id)}
                                    className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${selectedSystem === system.id
                                            ? 'bg-[var(--primary-cyan)]/30 border border-[var(--primary-cyan)]'
                                            : 'bg-black/50'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${system.status === 'online' ? 'bg-[var(--status-success)]' : 'bg-yellow-400'
                                        }`} />
                                    <span className="text-sm">{system.name}</span>
                                    <span className="text-xs text-white/50">{system.efficiency.toFixed(0)}%</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right - Details */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Equipment Health */}
                    <div className="glass rounded-xl p-4 flex-1 overflow-y-auto">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🔧</span> 장비 상태
                        </h3>
                        <div className="space-y-2">
                            {equipment.slice(0, 5).map(eq => (
                                <div key={eq.id} className="p-2 rounded-lg bg-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{eq.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${eq.riskLevel === 'low' ? 'bg-[var(--primary-green)]/20 text-[var(--primary-green)]' :
                                                eq.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {eq.healthScore.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${eq.healthScore}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">
                                        수명: {eq.remainingLife}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="glass rounded-xl p-4 max-h-48 overflow-y-auto">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🔔</span> 스마트 알림
                        </h3>
                        <div className="space-y-2">
                            <AnimatePresence>
                                {alerts.slice(0, 4).map(alert => (
                                    <motion.div
                                        key={alert.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`p-2 rounded-lg text-xs border-l-2 ${alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500' :
                                                alert.type === 'error' ? 'bg-red-500/10 border-red-500' :
                                                    'bg-[var(--primary-cyan)]/10 border-[var(--primary-cyan)]'
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">{alert.source}</span>
                                            {alert.autoResolved && (
                                                <span className="text-[var(--primary-green)]">✓ 자동해결</span>
                                            )}
                                        </div>
                                        <div className="text-white/60">{alert.message}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricBadge({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-center">
            <div className="text-lg">{icon}</div>
            <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">{value}</div>
            <div className="text-xs text-white/50">{label}</div>
        </div>
    );
}
