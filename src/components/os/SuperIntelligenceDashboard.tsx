'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    generate500LivingSystems,
    calculateGlobalStatus,
    generateEvolutionEvent,
    LIVING_SYSTEM_CATEGORIES,
    LivingSystem,
    GlobalSystemStatus,
} from '@/lib/systems/livingSystems';
import {
    generateGlobalIntelligenceFeed,
    generateAutoDeployEvent,
    GLOBAL_INTELLIGENCE_AGENTS,
    COUNTRY_SMARTFARM_STATUS,
    GlobalIntelligence,
} from '@/lib/intelligence/globalIntelligence';

export default function SuperIntelligenceDashboard() {
    const [systems, setSystems] = useState<LivingSystem[]>([]);
    const [globalStatus, setGlobalStatus] = useState<GlobalSystemStatus | null>(null);
    const [intelligenceFeed, setIntelligenceFeed] = useState<GlobalIntelligence[]>([]);
    const [deployEvents, setDeployEvents] = useState<ReturnType<typeof generateAutoDeployEvent>[]>([]);
    const [evolutionEvents, setEvolutionEvents] = useState<ReturnType<typeof generateEvolutionEvent>[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(true);
    const [activeTab, setActiveTab] = useState<'systems' | 'intelligence' | 'global'>('systems');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize systems
    useEffect(() => {
        const generatedSystems = generate500LivingSystems();
        setSystems(generatedSystems);
        setGlobalStatus(calculateGlobalStatus(generatedSystems));
        setIntelligenceFeed(generateGlobalIntelligenceFeed());
    }, []);

    // Live simulation
    useEffect(() => {
        if (!isLive || systems.length === 0) return;

        const interval = setInterval(() => {
            // Update system vitality and consciousness
            setSystems(prev => prev.map(system => {
                if (Math.random() > 0.95) {
                    return {
                        ...system,
                        vitality: Math.min(100, system.vitality + (Math.random() - 0.3) * 2),
                        consciousness: Math.min(100, system.consciousness + (Math.random() - 0.3) * 2),
                        heartbeat: 60 + Math.floor(Math.random() * 60),
                        lastPulse: new Date(),
                    };
                }
                return system;
            }));

            // Generate evolution events
            if (Math.random() > 0.92) {
                const randomSystem = systems[Math.floor(Math.random() * systems.length)];
                if (randomSystem) {
                    const event = generateEvolutionEvent(randomSystem);
                    setEvolutionEvents(prev => [...prev.slice(-4), event]);
                }
            }

            // Generate auto-deploy events
            if (Math.random() > 0.97) {
                const deployEvent = generateAutoDeployEvent();
                setDeployEvents(prev => [...prev.slice(-2), deployEvent]);
            }

            // Refresh intelligence feed occasionally
            if (Math.random() > 0.98) {
                setIntelligenceFeed(prev => {
                    const newFeed = generateGlobalIntelligenceFeed();
                    return [...newFeed.slice(0, 3), ...prev.slice(0, 17)];
                });
            }

            // Update global status
            setGlobalStatus(calculateGlobalStatus(systems));
        }, 500);

        return () => clearInterval(interval);
    }, [isLive, systems]);

    // Canvas visualization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || systems.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };
        resize();
        window.addEventListener('resize', resize);

        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Create node positions by category
        const nodes: { x: number; y: number; system: LivingSystem; category: typeof LIVING_SYSTEM_CATEGORIES[0] }[] = [];

        systems.slice(0, 100).forEach((system, i) => {
            const catIndex = LIVING_SYSTEM_CATEGORIES.findIndex(c => c.id === system.category);
            const category = LIVING_SYSTEM_CATEGORIES[catIndex];
            const angle = (catIndex / LIVING_SYSTEM_CATEGORIES.length) * Math.PI * 2;
            const radius = 80 + (i % 10) * 12;

            nodes.push({
                x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
                y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
                system,
                category,
            });
        });

        let animationId: number;
        let frame = 0;

        const animate = () => {
            frame++;
            ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Draw connections
            nodes.forEach((node, i) => {
                if (i % 3 === 0) {
                    const targetIndex = (i + Math.floor(Math.random() * 5) + 1) % nodes.length;
                    const target = nodes[targetIndex];

                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(target.x, target.y);

                    const alpha = 0.05 + Math.sin(frame * 0.03 + i) * 0.03;
                    ctx.strokeStyle = `${node.category.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            // Draw nodes
            nodes.forEach((node, i) => {
                const pulseScale = 1 + Math.sin(frame * 0.1 + i * 0.5) * 0.15;
                const radius = 3 * pulseScale * (node.system.status === 'evolving' ? 1.5 : 1);

                // Glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
                gradient.addColorStop(0, node.category.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = node.category.color;
                ctx.fill();
            });

            // Center core (Super Intelligence)
            const coreRadius = 20 + Math.sin(frame * 0.05) * 3;
            const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2);
            coreGradient.addColorStop(0, '#00ff88');
            coreGradient.addColorStop(0.3, '#00d4ff');
            coreGradient.addColorStop(0.6, '#7b2fff');
            coreGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(centerX, centerY, coreRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = coreGradient;
            ctx.fill();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [systems]);

    const filteredSystems = useMemo(() => {
        if (!selectedCategory) return systems;
        return systems.filter(s => s.category === selectedCategory);
    }, [systems, selectedCategory]);

    if (!globalStatus) {
        return (
            <div className="h-screen flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="mt-4 text-white/60">500 살아있는 시스템 활성화 중...</p>
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
                            className="w-16 h-16 rounded-full relative"
                            style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-1.5 rounded-full bg-[var(--bg-dark)] flex items-center justify-center">
                                <motion.span
                                    className="text-2xl font-bold font-[family-name:var(--font-orbitron)]"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Ω
                                </motion.span>
                            </div>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                초지능 통합 컨트롤
                            </h1>
                            <p className="text-sm text-white/60">
                                500 살아있는 시스템 · 글로벌 정보 수집 · 자동 진화
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Global Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <motion.div
                                    className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]"
                                    key={globalStatus.totalSystems}
                                >
                                    {globalStatus.totalSystems}
                                </motion.div>
                                <div className="text-xs text-white/50">시스템</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                    {globalStatus.activeSystems}
                                </div>
                                <div className="text-xs text-white/50">활성</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">
                                    {globalStatus.totalConnections.toLocaleString()}
                                </div>
                                <div className="text-xs text-white/50">연결</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--status-success)]">
                                    {globalStatus.systemSynergy.toFixed(1)}%
                                </div>
                                <div className="text-xs text-white/50">시너지</div>
                            </div>
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

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                    {[
                        { id: 'systems' as const, label: '500 시스템', icon: '💎' },
                        { id: 'intelligence' as const, label: '글로벌 정보', icon: '🌍' },
                        { id: 'global' as const, label: '국가별 현황', icon: '📊' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)]'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === 'systems' && (
                        <motion.div
                            key="systems"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex gap-4"
                        >
                            {/* Network Visualization */}
                            <div className="flex-1 glass rounded-xl overflow-hidden relative">
                                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                                {/* Category Legend */}
                                <div className="absolute top-4 left-4 z-10 space-y-1">
                                    {LIVING_SYSTEM_CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                                            className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-black/30 hover:bg-black/50'
                                                }`}
                                        >
                                            <span style={{ color: cat.color }}>●</span>
                                            <span>{cat.icon}</span>
                                            <span>{cat.name}</span>
                                            <span className="text-white/40">{cat.count}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Evolution Events */}
                                <div className="absolute bottom-4 right-4 z-10 space-y-2 max-w-xs">
                                    <AnimatePresence mode="popLayout">
                                        {evolutionEvents.map((event, i) => (
                                            <motion.div
                                                key={`${event.systemId}-${i}`}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="px-3 py-2 rounded-lg bg-[var(--primary-green)]/20 border-l-2 border-[var(--primary-green)] text-xs"
                                            >
                                                <div className="text-[var(--primary-green)] font-medium">{event.evolutionType}</div>
                                                <div className="text-white/60">{event.systemName} +{event.improvement}%</div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* System List */}
                            <div className="w-80 glass rounded-xl p-4 overflow-hidden flex flex-col">
                                <h3 className="font-bold mb-3 flex items-center justify-between">
                                    <span>활성 시스템</span>
                                    <span className="text-sm text-white/50">{filteredSystems.length}</span>
                                </h3>
                                <div className="flex-1 overflow-y-auto space-y-1">
                                    {filteredSystems.slice(0, 50).map(system => (
                                        <div
                                            key={system.id}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <motion.span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: LIVING_SYSTEM_CATEGORIES.find(c => c.id === system.category)?.color }}
                                                        animate={{ scale: [1, 1.3, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                                                    />
                                                    <span className="font-[family-name:var(--font-orbitron)] text-xs">{system.name}</span>
                                                </div>
                                                <span className={`text-xs ${system.status === 'active' ? 'text-[var(--status-success)]' :
                                                        system.status === 'evolving' ? 'text-[var(--primary-purple)]' :
                                                            'text-white/50'
                                                    }`}>
                                                    {system.status === 'active' ? '●' : system.status === 'evolving' ? '↑' : '○'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 text-[0.65rem] text-white/40">
                                                <span>생명력 {system.vitality.toFixed(0)}%</span>
                                                <span>•</span>
                                                <span>의식 {system.consciousness.toFixed(0)}%</span>
                                                <span>•</span>
                                                <span>Lv.{system.evolution}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'intelligence' && (
                        <motion.div
                            key="intelligence"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex gap-4"
                        >
                            {/* Intelligence Feed */}
                            <div className="flex-1 glass rounded-xl p-4 overflow-hidden flex flex-col">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    >
                                        🌍
                                    </motion.span>
                                    실시간 글로벌 정보
                                </h3>
                                <div className="flex-1 overflow-y-auto space-y-2">
                                    <AnimatePresence mode="popLayout">
                                        {intelligenceFeed.map(intel => (
                                            <motion.div
                                                key={intel.id}
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className={`p-3 rounded-lg border-l-2 ${intel.impact === 'critical' ? 'bg-[var(--status-danger)]/10 border-[var(--status-danger)]' :
                                                        intel.impact === 'high' ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)]' :
                                                            'bg-white/5 border-white/20'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-medium text-sm">{intel.title}</span>
                                                    {intel.autoApplicable && (
                                                        <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary-green)]/20 text-[var(--primary-green)]">
                                                            ⚡ 자동적용
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/60 mb-2">{intel.summary}</p>
                                                <div className="flex items-center gap-2 text-[0.65rem] text-white/40">
                                                    <span>{intel.country}</span>
                                                    <span>•</span>
                                                    <span>{intel.category}</span>
                                                    <span>•</span>
                                                    <span>신뢰도 {intel.reliability.toFixed(0)}%</span>
                                                    <span>•</span>
                                                    <span>{intel.source}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Agents & Auto-Deploy */}
                            <div className="w-80 space-y-4">
                                {/* Intelligence Agents */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <span>🤖</span> 정보 수집 에이전트
                                    </h3>
                                    <div className="space-y-2">
                                        {Object.values(GLOBAL_INTELLIGENCE_AGENTS).map(agent => (
                                            <div key={agent.id} className="p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-[family-name:var(--font-orbitron)] text-xs text-[var(--primary-cyan)]">
                                                        {agent.code}
                                                    </span>
                                                    <motion.span
                                                        className="text-xs text-[var(--status-success)]"
                                                        animate={{ opacity: [1, 0.5, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                    >
                                                        ● 활성
                                                    </motion.span>
                                                </div>
                                                <div className="text-xs text-white/60 mt-1">{agent.role}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Auto Deploy Events */}
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <span>⚡</span> 자동 기술 적용
                                    </h3>
                                    <div className="space-y-2">
                                        <AnimatePresence mode="popLayout">
                                            {deployEvents.map(event => (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="p-2 rounded-lg bg-[var(--primary-green)]/10 border-l-2 border-[var(--primary-green)]"
                                                >
                                                    <div className="text-sm text-[var(--primary-green)]">{event.tech}</div>
                                                    <div className="text-xs text-white/60">{event.target} • {event.improvement}</div>
                                                    <div className="text-xs text-white/40">영향: {event.affectedSystems} 시스템</div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {deployEvents.length === 0 && (
                                            <div className="text-center py-4 text-white/40 text-sm">
                                                <motion.span
                                                    className="block text-2xl mb-2"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    ⚙️
                                                </motion.span>
                                                신기술 탐지 중...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'global' && (
                        <motion.div
                            key="global"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 glass rounded-xl p-4 overflow-y-auto"
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span>📊</span> 국가별 스마트팜 현황
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(COUNTRY_SMARTFARM_STATUS).map(([code, country]) => (
                                    <div key={code} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold">{country.name}</h4>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${country.policy === 'aggressive' ? 'bg-[var(--primary-green)]/20 text-[var(--primary-green)]' :
                                                    country.policy === 'active' ? 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)]' :
                                                        'bg-white/10 text-white/60'
                                                }`}>
                                                {country.policy}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-center">
                                                <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                                    {country.farms.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-white/50">농장 수</div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-white/5 text-center">
                                                <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                                    +{country.growth}%
                                                </div>
                                                <div className="text-xs text-white/50">성장률</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {country.incentives.map((incentive, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary-purple)]/20 text-[var(--primary-purple)]">
                                                    {incentive}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
