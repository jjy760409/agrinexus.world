'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AgriSystem, CLUSTERS, STATUS_COLORS } from '@/types/systems';
import { useOSStore } from '@/store/useOSStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SystemDetailProps {
    system: AgriSystem;
}

export default function SystemDetail({ system }: SystemDetailProps) {
    const { updateSystemMetrics, setCurrentSystem } = useOSStore();
    const [history, setHistory] = useState<Array<{ time: number; efficiency: number; load: number; aiScore: number }>>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const cluster = CLUSTERS[system.cluster];

    // Generate history data
    useEffect(() => {
        const initialHistory = Array.from({ length: 20 }, (_, i) => ({
            time: i,
            efficiency: 80 + Math.random() * 20,
            load: 30 + Math.random() * 40,
            aiScore: 85 + Math.random() * 15,
        }));
        setHistory(initialHistory);

        const interval = setInterval(() => {
            updateSystemMetrics(system.id);
            setHistory(prev => {
                const newPoint = {
                    time: prev.length,
                    efficiency: system.metrics.efficiency,
                    load: system.metrics.load,
                    aiScore: system.metrics.aiScore,
                };
                return [...prev.slice(-19), newPoint];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [system.id, system.metrics, updateSystemMetrics]);

    // Neural visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        let angle = 0;
        let animationId: number;

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            angle += 0.01;

            // Draw concentric circles
            for (let i = 0; i < 5; i++) {
                const r = radius * (1 - i * 0.15);
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 + i * 0.05})`;
                ctx.stroke();
            }

            // Draw rotating nodes
            const nodeCount = 12;
            for (let i = 0; i < nodeCount; i++) {
                const nodeAngle = (i / nodeCount) * Math.PI * 2 + angle;
                const x = centerX + Math.cos(nodeAngle) * radius * 0.8;
                const y = centerY + Math.sin(nodeAngle) * radius * 0.8;

                // Draw connection to center
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 + Math.sin(angle * 2 + i) * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // Draw node
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
                gradient.addColorStop(0, cluster.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Center icon glow
            const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
            centerGradient.addColorStop(0, cluster.color + '60');
            centerGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
            ctx.fillStyle = centerGradient;
            ctx.fill();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, [cluster.color]);

    return (
        <div className="space-y-6">
            {/* System Header */}
            <motion.div
                className="glass rounded-2xl p-6 overflow-hidden relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Background */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        background: `radial-gradient(ellipse at 0% 50%, ${cluster.color} 0%, transparent 50%)`,
                    }}
                />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                            style={{ backgroundColor: cluster.color + '20', border: `1px solid ${cluster.color}50` }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <span className="text-4xl" style={{ filter: `drop-shadow(0 0 15px ${cluster.color})` }}>
                                {system.icon}
                            </span>
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-orbitron)]" style={{ color: cluster.color }}>
                                    {system.code}
                                </h1>
                                <motion.div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: STATUS_COLORS[system.status],
                                        boxShadow: `0 0 10px ${STATUS_COLORS[system.status]}`
                                    }}
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </div>
                            <p className="text-white/60 text-sm">{system.fullName}</p>
                            <p className="text-white/40 text-xs mt-1">{cluster.koreanName} • {cluster.name}</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-3 rounded-xl bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30 text-center min-w-[80px]">
                            <div className="text-xs text-white/50">효율</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-xl text-[var(--primary-green)]">
                                {system.metrics.efficiency.toFixed(1)}%
                            </div>
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30 text-center min-w-[80px]">
                            <div className="text-xs text-white/50">가동률</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-xl text-[var(--primary-cyan)]">
                                {system.metrics.uptime.toFixed(1)}%
                            </div>
                        </div>
                        <div className="px-4 py-3 rounded-xl bg-[var(--primary-purple)]/10 border border-[var(--primary-purple)]/30 text-center min-w-[80px]">
                            <div className="text-xs text-white/50">AI 점수</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-xl text-[var(--primary-purple)]">
                                {system.metrics.aiScore.toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="mt-6 text-white/70 text-sm md:text-base relative z-10">
                    {system.description}
                </p>

                {/* Capabilities */}
                <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                    {system.capabilities.map((cap, i) => (
                        <motion.span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full border"
                            style={{
                                backgroundColor: cluster.color + '10',
                                borderColor: cluster.color + '30',
                                color: cluster.color
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {cap}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Charts & Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Neural Visualization */}
                <motion.div
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold mb-4 flex items-center gap-2">
                        <span>🧠</span> 신경망 활성화
                    </h3>
                    <div className="h-64 rounded-xl overflow-hidden bg-black/30">
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                </motion.div>

                {/* Performance Chart */}
                <motion.div
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold mb-4 flex items-center gap-2">
                        <span>📊</span> 실시간 성능
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 14, 23, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="efficiency"
                                    stroke="#00ff88"
                                    strokeWidth={2}
                                    fill="url(#efficiencyGradient)"
                                    name="효율"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="load"
                                    stroke="#00d4ff"
                                    strokeWidth={2}
                                    fill="url(#loadGradient)"
                                    name="부하"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Detailed Metrics */}
            <motion.div
                className="glass rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold mb-4 flex items-center gap-2">
                    <span>⚙️</span> 상세 메트릭스
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { name: '시스템 효율', value: system.metrics.efficiency, unit: '%', color: 'var(--primary-green)' },
                        { name: '가동률', value: system.metrics.uptime, unit: '%', color: 'var(--primary-cyan)' },
                        { name: '시스템 부하', value: system.metrics.load, unit: '%', color: 'var(--status-warning)' },
                        { name: '데이터 흐름', value: system.metrics.dataFlow, unit: 'MB/s', color: 'var(--primary-purple)' },
                        { name: 'AI 점수', value: system.metrics.aiScore, unit: 'pts', color: 'var(--status-success)' },
                    ].map((metric) => (
                        <div key={metric.name} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-white/50 mb-2">{metric.name}</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-2xl font-bold" style={{ color: metric.color }}>
                                {metric.value.toFixed(1)}
                            </div>
                            <div className="text-xs text-white/40">{metric.unit}</div>

                            {/* Progress bar */}
                            <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: metric.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(metric.value, 100)}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
