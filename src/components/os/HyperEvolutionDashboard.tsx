'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HYPER_EVOLUTION_SYSTEMS,
    generateEvolutionEvent,
    generateQuantumPrediction,
    generateRobotActivity,
    calculateHyperSystemStatus,
    EvolutionEvent,
    QuantumPrediction,
    HyperSystemStatus,
} from '@/lib/ai/hyperEvolution';

export default function HyperEvolutionDashboard() {
    const [systemStatus, setSystemStatus] = useState<HyperSystemStatus | null>(null);
    const [evolutionEvents, setEvolutionEvents] = useState<EvolutionEvent[]>([]);
    const [predictions, setPredictions] = useState<QuantumPrediction[]>([]);
    const [robotActivities, setRobotActivities] = useState<ReturnType<typeof generateRobotActivity>[]>([]);
    const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize
    useEffect(() => {
        setSystemStatus(calculateHyperSystemStatus());
        setPredictions(Array.from({ length: 5 }, () => generateQuantumPrediction()));
    }, []);

    // Live simulation
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            setSystemStatus(calculateHyperSystemStatus());

            // Evolution events
            if (Math.random() > 0.85) {
                const event = generateEvolutionEvent();
                setEvolutionEvents(prev => [event, ...prev.slice(0, 9)]);
            }

            // Quantum predictions
            if (Math.random() > 0.9) {
                const pred = generateQuantumPrediction();
                setPredictions(prev => [pred, ...prev.slice(0, 4)]);
            }

            // Robot activities
            if (Math.random() > 0.7) {
                const activity = generateRobotActivity();
                setRobotActivities(prev => [activity, ...prev.slice(0, 4)]);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isLive]);

    // Quantum visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

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
        const centerX = width / 2;
        const centerY = height / 2;

        let frame = 0;
        let animationId: number;

        const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number }[] = [];

        // Create particles
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: centerX + (Math.random() - 0.5) * width * 0.8,
                y: centerY + (Math.random() - 0.5) * height * 0.8,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: ['#00ff88', '#00d4ff', '#7b2fff', '#ff2d92', '#ffa500'][Math.floor(Math.random() * 5)],
                life: Math.random() * 100,
            });
        }

        const animate = () => {
            frame++;
            ctx.fillStyle = 'rgba(10, 14, 23, 0.08)';
            ctx.fillRect(0, 0, width, height);

            // Update and draw particles
            particles.forEach((p, i) => {
                // Quantum tunneling effect
                if (Math.random() > 0.99) {
                    p.x = centerX + (Math.random() - 0.5) * width * 0.5;
                    p.y = centerY + (Math.random() - 0.5) * height * 0.5;
                }

                // Move toward center (entanglement)
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 50) {
                    p.vx += (dx / dist) * 0.02;
                    p.vy += (dy / dist) * 0.02;
                } else {
                    p.vx += (Math.random() - 0.5) * 0.5;
                    p.vy += (Math.random() - 0.5) * 0.5;
                }

                p.vx *= 0.98;
                p.vy *= 0.98;
                p.x += p.vx;
                p.y += p.vy;

                // Draw particle with glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Connect nearby particles (entanglement lines)
                particles.slice(i + 1).forEach(p2 => {
                    const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                    if (d < 50) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 - d / 250})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            // Central quantum core
            const coreRadius = 30 + Math.sin(frame * 0.05) * 5;
            const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2);
            coreGradient.addColorStop(0, 'rgba(123, 47, 255, 0.8)');
            coreGradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.5)');
            coreGradient.addColorStop(0.6, 'rgba(0, 255, 136, 0.3)');
            coreGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = coreGradient;
            ctx.fill();

            // Orbiting rings
            for (let r = 0; r < 3; r++) {
                const ringRadius = 60 + r * 30;
                ctx.beginPath();
                ctx.arc(centerX, centerY, ringRadius, frame * 0.02 + r, frame * 0.02 + r + Math.PI * 1.5);
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.3 - r * 0.08})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, []);

    const systems = useMemo(() => Object.values(HYPER_EVOLUTION_SYSTEMS), []);

    if (!systemStatus) {
        return (
            <div className="h-screen flex items-center justify-center">
                <motion.div
                    className="text-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="text-6xl mb-4">🧬</div>
                    <p className="text-white/60">초거대 AI 시스템 초기화 중...</p>
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
                            className="w-16 h-16 rounded-full relative overflow-hidden"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-0" style={{
                                background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #ffa500, #00ff88)'
                            }} />
                            <div className="absolute inset-2 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <motion.span
                                    className="text-2xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    🧬
                                </motion.span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                초진화 AI 코어
                            </h1>
                            <p className="text-sm text-white/60">
                                세대 #{systemStatus.evolutionGeneration} · 자가 진화 활성
                            </p>
                        </div>
                    </div>

                    {/* Status Metrics */}
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:grid grid-cols-5 gap-3">
                            <MetricCard label="집단 지능" value={systemStatus.totalIntelligence.toLocaleString()} unit="IQ" color="green" />
                            <MetricCard label="양자 코히런스" value={systemStatus.quantumCoherence.toFixed(1)} unit="%" color="cyan" />
                            <MetricCard label="뉴럴 연결" value={`${(systemStatus.neuralConnections / 1e9).toFixed(1)}B`} color="purple" />
                            <MetricCard label="로봇 활성" value={systemStatus.robotsActive.toString()} color="pink" />
                            <MetricCard label="시스템 헬스" value={systemStatus.overallHealth.toFixed(1)} unit="%" color="green" />
                        </div>

                        <button
                            onClick={() => setIsLive(!isLive)}
                            className={`px-4 py-2 rounded-lg font-medium ${isLive ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)]' : 'bg-white/10'
                                }`}
                        >
                            {isLive ? '● EVOLVING' : '○ PAUSED'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Left - Quantum Visualization */}
                <div className="flex-1 glass rounded-xl overflow-hidden relative">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* Evolution Events Overlay */}
                    <div className="absolute top-4 left-4 z-10 max-w-xs space-y-2">
                        <h3 className="text-sm font-bold text-white/70 mb-2">🧬 진화 로그</h3>
                        <AnimatePresence mode="popLayout">
                            {evolutionEvents.slice(0, 5).map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={`px-3 py-2 rounded-lg text-xs border-l-2 ${event.type === 'transcendence' ? 'bg-[var(--primary-purple)]/20 border-[var(--primary-purple)]' :
                                        event.type === 'synthesis' ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]' :
                                            event.type === 'mutation' ? 'bg-[var(--status-warning)]/20 border-[var(--status-warning)]' :
                                                'bg-[var(--primary-green)]/20 border-[var(--primary-green)]'
                                        }`}
                                >
                                    <div className="font-medium capitalize">{event.type}</div>
                                    <div className="text-white/60">{event.description}</div>
                                    <div className="text-white/40 text-[0.65rem]">+{event.improvement}% 향상</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Quantum Predictions Overlay */}
                    <div className="absolute bottom-4 right-4 z-10 max-w-xs space-y-2">
                        <h3 className="text-sm font-bold text-white/70 mb-2 text-right">🔮 양자 예측</h3>
                        <AnimatePresence mode="popLayout">
                            {predictions.slice(0, 3).map((pred, i) => (
                                <motion.div
                                    key={pred.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="px-3 py-2 rounded-lg bg-[var(--primary-cyan)]/10 border-r-2 border-[var(--primary-cyan)] text-xs text-right"
                                >
                                    <div className="font-medium">{pred.domain}</div>
                                    <div className="text-white/60">{pred.prediction}</div>
                                    <div className="text-[var(--primary-cyan)]">{pred.probability.toFixed(1)}% 확률</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right - Systems & Controls */}
                <div className="w-96 flex flex-col gap-4">
                    {/* AI Systems Grid */}
                    <div className="glass rounded-xl p-4 flex-1 overflow-y-auto">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                ⚡
                            </motion.span>
                            초거대 AI 시스템
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {systems.map(system => (
                                <motion.button
                                    key={system.id}
                                    onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
                                    className={`p-3 rounded-lg text-left transition-all ${selectedSystem === system.id
                                        ? 'bg-[var(--primary-purple)]/30 border border-[var(--primary-purple)]'
                                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="font-[family-name:var(--font-orbitron)] text-xs text-[var(--primary-cyan)] mb-1">
                                        {system.code}
                                    </div>
                                    <div className="text-sm font-medium">{system.koreanName}</div>
                                    <motion.div
                                        className={`mt-1 text-xs ${system.status === 'active' ? 'text-[var(--status-success)]' :
                                            system.status === 'evolving' ? 'text-[var(--primary-purple)]' :
                                                'text-white/50'
                                            }`}
                                        animate={system.status === 'active' || system.status === 'evolving' ? { opacity: [1, 0.5, 1] } : {}}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        ● {system.status === 'active' ? '활성' : system.status === 'evolving' ? '진화중' : system.status}
                                    </motion.div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Robot Fleet Status */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🤖</span> 자율 로봇 함대
                        </h3>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            <AnimatePresence mode="popLayout">
                                {robotActivities.map((activity, i) => (
                                    <motion.div
                                        key={`${activity.robot}-${i}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="p-2 rounded-lg bg-white/5 text-xs"
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-medium">{activity.robot}</span>
                                            <span className="text-[var(--primary-green)]">{activity.count}</span>
                                        </div>
                                        <div className="text-white/50">{activity.action} · {activity.area}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {robotActivities.length === 0 && (
                                <div className="text-center py-4 text-white/40 text-sm">
                                    로봇 활동 대기 중...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected System Details */}
            <AnimatePresence>
                {selectedSystem && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="glass rounded-xl p-4"
                    >
                        <SystemDetails systemId={selectedSystem} onClose={() => setSelectedSystem(null)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Metric Card Component
function MetricCard({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
    const colorClass = {
        green: 'text-[var(--primary-green)]',
        cyan: 'text-[var(--primary-cyan)]',
        purple: 'text-[var(--primary-purple)]',
        pink: 'text-[#ff2d92]',
        orange: 'text-[#ffa500]',
    }[color];

    return (
        <div className="px-3 py-2 rounded-lg bg-white/5 text-center min-w-[80px]">
            <div className={`font-[family-name:var(--font-orbitron)] text-lg ${colorClass}`}>
                {value}{unit && <span className="text-xs ml-0.5">{unit}</span>}
            </div>
            <div className="text-xs text-white/50">{label}</div>
        </div>
    );
}

// System Details Component
function SystemDetails({ systemId, onClose }: { systemId: string; onClose: () => void }) {
    const system = HYPER_EVOLUTION_SYSTEMS[systemId as keyof typeof HYPER_EVOLUTION_SYSTEMS];

    if (!system) return null;

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                            {system.code}
                        </div>
                        <h3 className="text-lg font-bold">{system.koreanName}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                        ✕
                    </button>
                </div>
                <p className="text-sm text-white/70 mb-3">{system.description}</p>
                <div className="grid grid-cols-2 gap-2">
                    {(system.capabilities as string[]).map((cap: string, i: number) => (
                        <div key={i} className="px-3 py-2 rounded-lg bg-white/5 text-xs flex items-center gap-2">
                            <span className="text-[var(--primary-green)]">✓</span>
                            {cap}
                        </div>
                    ))}
                </div>
            </div>
            <div className="md:w-64">
                <h4 className="text-sm font-bold mb-2">사양</h4>
                <div className="space-y-1 text-xs">
                    {'specs' in system && Object.entries(system.specs as Record<string, unknown>).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/60">{key}</span>
                            <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {String(value)}
                            </span>
                        </div>
                    ))}
                    {'nodes' in system && (
                        <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/60">노드 수</span>
                            <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {(system.nodes as number).toLocaleString()}
                            </span>
                        </div>
                    )}
                    {'intelligence' in system && (
                        <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-white/60">지능 지수</span>
                            <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {system.intelligence}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
