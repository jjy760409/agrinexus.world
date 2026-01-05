'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    generateMassiveAgentSwarm,
    AGENT_DOMAINS,
    calculateSynergy,
    generateCommunicationMessage,
    generateUpgradeEvent,
    getInitialNetworkState,
    SwarmNetworkState
} from '@/lib/agents/agentSwarm';
import { SuperAgent } from '@/types/superagent';

interface Connection {
    id: string;
    from: { x: number; y: number };
    to: { x: number; y: number };
    color: string;
    active: boolean;
}

interface Message {
    id: string;
    from: string;
    to: string;
    type: string;
    content: string;
    timestamp: Date;
}

export default function AgentSwarmVisualization() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [agents, setAgents] = useState<SuperAgent[]>([]);
    const [networkState, setNetworkState] = useState<SwarmNetworkState>(getInitialNetworkState());
    const [messages, setMessages] = useState<Message[]>([]);
    const [upgradeEvents, setUpgradeEvents] = useState<Array<ReturnType<typeof generateUpgradeEvent> & { id: string }>>([]);
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'network' | 'grid' | 'flow'>('network');
    const [isLive, setIsLive] = useState(true);

    // Initialize agents
    useEffect(() => {
        const generatedAgents = generateMassiveAgentSwarm();
        setAgents(generatedAgents);
    }, []);

    // Live simulation
    useEffect(() => {
        if (!isLive || agents.length === 0) return;

        const interval = setInterval(() => {
            // Update network state
            setNetworkState(prev => ({
                ...prev,
                activeConnections: prev.activeConnections + Math.floor((Math.random() - 0.4) * 50),
                messagesPerSecond: 8000 + Math.floor(Math.random() * 4000),
                synergyLevel: Math.min(100, prev.synergyLevel + (Math.random() - 0.48) * 0.5),
                evolutionProgress: Math.min(100, prev.evolutionProgress + Math.random() * 0.1),
                learningCapacity: prev.learningCapacity + (Math.random() - 0.4) * 10,
                totalDecisions: prev.totalDecisions + Math.floor(Math.random() * 1000),
                networkHealth: Math.min(100, 95 + Math.random() * 5),
            }));

            // Generate random messages
            if (Math.random() > 0.3) {
                const fromAgent = agents[Math.floor(Math.random() * agents.length)];
                const toIndex = fromAgent.connections[Math.floor(Math.random() * fromAgent.connections.length)];
                const toAgent = agents.find(a => a.id === toIndex) || agents[Math.floor(Math.random() * agents.length)];

                const msg = generateCommunicationMessage(fromAgent, toAgent);
                setMessages(prev => [...prev.slice(-19), { ...msg, id: `msg-${Date.now()}` }]);
            }

            // Generate upgrade events
            if (Math.random() > 0.95) {
                const event = generateUpgradeEvent();
                setUpgradeEvents(prev => [...prev.slice(-4), { ...event, id: `evt-${Date.now()}` }]);
                setNetworkState(prev => ({
                    ...prev,
                    lastUpgrade: new Date(),
                    upgradeCount: prev.upgradeCount + 1,
                }));
            }

            // Update some agents
            setAgents(prev => prev.map(agent => {
                if (Math.random() > 0.95) {
                    return {
                        ...agent,
                        lifeforce: {
                            ...agent.lifeforce,
                            pulse: Math.max(60, Math.min(200, agent.lifeforce.pulse + Math.floor((Math.random() - 0.5) * 10))),
                            energy: Math.min(100, agent.lifeforce.energy + (Math.random() - 0.4) * 2),
                        },
                        decisionsPerSecond: agent.decisionsPerSecond + Math.floor((Math.random() - 0.3) * 100),
                    };
                }
                return agent;
            }));
        }, 100);

        return () => clearInterval(interval);
    }, [isLive, agents]);

    // Canvas animation for network
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || agents.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetHeight * 2;
            ctx.scale(2, 2);
        };
        resize();
        window.addEventListener('resize', resize);

        // Create nodes for visualization
        const nodes: Array<{ x: number; y: number; vx: number; vy: number; agent: SuperAgent; domain: typeof AGENT_DOMAINS[0] }> = [];
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        agents.slice(0, 200).forEach((agent, i) => {
            const domainIndex = Math.floor(i / 10) % AGENT_DOMAINS.length;
            const angle = (domainIndex / AGENT_DOMAINS.length) * Math.PI * 2;
            const radius = 100 + (i % 10) * 20;

            nodes.push({
                x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
                y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                agent,
                domain: AGENT_DOMAINS[domainIndex],
            });
        });

        let animationId: number;
        let frame = 0;

        const animate = () => {
            frame++;
            ctx.fillStyle = 'rgba(10, 14, 23, 0.15)';
            ctx.fillRect(0, 0, width, height);

            // Draw connections
            nodes.forEach((node, i) => {
                node.agent.connections.slice(0, 3).forEach(connId => {
                    const targetIndex = nodes.findIndex(n => n.agent.id === connId);
                    if (targetIndex !== -1 && targetIndex > i) {
                        const target = nodes[targetIndex];
                        const dist = Math.hypot(node.x - target.x, node.y - target.y);

                        if (dist < 200) {
                            ctx.beginPath();
                            ctx.moveTo(node.x, node.y);
                            ctx.lineTo(target.x, target.y);

                            // Animated gradient
                            const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
                            const pulseAlpha = 0.1 + Math.sin(frame * 0.05 + i) * 0.1;
                            gradient.addColorStop(0, `${node.domain.color}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`);
                            gradient.addColorStop(1, `${target.domain?.color || '#00ff88'}${Math.floor(pulseAlpha * 255).toString(16).padStart(2, '0')}`);

                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();

                            // Data packet animation
                            if (Math.random() > 0.99) {
                                const packetPos = (frame * 0.02) % 1;
                                const px = node.x + (target.x - node.x) * packetPos;
                                const py = node.y + (target.y - node.y) * packetPos;

                                ctx.beginPath();
                                ctx.arc(px, py, 3, 0, Math.PI * 2);
                                ctx.fillStyle = node.domain.color;
                                ctx.fill();
                            }
                        }
                    }
                });
            });

            // Update and draw nodes
            nodes.forEach((node, i) => {
                // Physics
                node.x += node.vx;
                node.y += node.vy;

                // Boundaries
                if (node.x < 50 || node.x > width - 50) node.vx *= -1;
                if (node.y < 50 || node.y > height - 50) node.vy *= -1;

                // Center gravity
                const dx = width / 2 - node.x;
                const dy = height / 2 - node.y;
                node.vx += dx * 0.0001;
                node.vy += dy * 0.0001;

                // Damping
                node.vx *= 0.99;
                node.vy *= 0.99;

                // Draw node
                const pulseScale = 1 + Math.sin(frame * 0.1 + i) * 0.2;
                const radius = 4 * pulseScale * (node.agent.status === 'evolving' ? 1.5 : 1);

                // Glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
                gradient.addColorStop(0, node.domain.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Core
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = node.domain.color;
                ctx.fill();
            });

            // Center core
            const coreRadius = 30 + Math.sin(frame * 0.05) * 5;
            const coreGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, coreRadius * 2);
            coreGradient.addColorStop(0, '#00ff88');
            coreGradient.addColorStop(0.5, '#00d4ff');
            coreGradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, coreRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = coreGradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(width / 2, height / 2, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff88';
            ctx.fill();

            // Core text
            ctx.font = 'bold 12px Orbitron, sans-serif';
            ctx.fillStyle = '#0a0e17';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Ω', width / 2, height / 2);

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [agents]);

    const filteredAgents = useMemo(() => {
        if (!selectedDomain) return agents;
        return agents.filter(a => {
            const domainIndex = Math.floor((parseInt(a.id.split('-')[1]) - 1) / 10);
            return AGENT_DOMAINS[domainIndex]?.id === selectedDomain;
        });
    }, [agents, selectedDomain]);

    const synergy = useMemo(() => calculateSynergy(agents), [agents]);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
            {/* Header Stats */}
            <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] flex items-center justify-center"
                            animate={{
                                scale: [1, 1.1, 1],
                                boxShadow: ['0 0 20px #00ff88', '0 0 40px #00d4ff', '0 0 20px #00ff88']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-3xl font-bold font-[family-name:var(--font-orbitron)]">Ω</span>
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                에이전트 스웜 네트워크
                            </h1>
                            <p className="text-sm text-white/60">
                                {agents.length}+ 초지능 에이전트 실시간 협업
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <motion.div
                                    className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]"
                                    animate={{ scale: isLive ? [1, 1.05, 1] : 1 }}
                                    transition={{ duration: 0.5, repeat: isLive ? Infinity : 0 }}
                                >
                                    {agents.length}
                                </motion.div>
                                <div className="text-xs text-white/50">에이전트</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                    {networkState.activeConnections.toLocaleString()}
                                </div>
                                <div className="text-xs text-white/50">연결</div>
                            </div>
                            <div className="text-center">
                                <motion.div
                                    className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]"
                                    key={networkState.messagesPerSecond}
                                >
                                    {(networkState.messagesPerSecond / 1000).toFixed(1)}K
                                </motion.div>
                                <div className="text-xs text-white/50">메시지/초</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--status-success)]">
                                    {synergy.toFixed(1)}%
                                </div>
                                <div className="text-xs text-white/50">시너지</div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsLive(!isLive)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isLive ? 'bg-[var(--primary-green)] text-[var(--bg-dark)]' : 'bg-white/10'
                                    }`}
                            >
                                {isLive ? '● LIVE' : '○ PAUSED'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Network Visualization */}
                <div className="flex-1 glass rounded-xl overflow-hidden relative">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                    {/* Overlay Stats */}
                    <div className="absolute top-4 left-4 space-y-2">
                        <div className="px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-sm">
                            <span className="text-white/50">진화 진행:</span>
                            <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {networkState.evolutionProgress.toFixed(1)}%
                            </span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-sm">
                            <span className="text-white/50">총 결정:</span>
                            <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {networkState.totalDecisions.toLocaleString()}
                            </span>
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-sm">
                            <span className="text-white/50">네트워크:</span>
                            <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--status-success)]">
                                {networkState.networkHealth.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="w-80 flex flex-col gap-4">
                    {/* Domain Filter */}
                    <div className="glass rounded-xl p-3 max-h-60 overflow-y-auto">
                        <h3 className="text-sm font-bold mb-2">도메인 필터</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedDomain(null)}
                                className={`w-full px-2 py-1 rounded text-left text-sm flex items-center gap-2 ${!selectedDomain ? 'bg-white/20' : 'hover:bg-white/10'
                                    }`}
                            >
                                <span>🌐</span>
                                <span>전체 ({agents.length})</span>
                            </button>
                            {AGENT_DOMAINS.slice(0, 15).map(domain => {
                                const count = agents.filter((_, i) => {
                                    const idx = Math.floor(i / 10);
                                    return AGENT_DOMAINS[idx]?.id === domain.id;
                                }).length;
                                return (
                                    <button
                                        key={domain.id}
                                        onClick={() => setSelectedDomain(domain.id)}
                                        className={`w-full px-2 py-1 rounded text-left text-sm flex items-center gap-2 ${selectedDomain === domain.id ? 'bg-white/20' : 'hover:bg-white/10'
                                            }`}
                                    >
                                        <span>{domain.icon}</span>
                                        <span style={{ color: domain.color }}>{domain.name}</span>
                                        <span className="ml-auto text-white/40">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Live Messages */}
                    <div className="flex-1 glass rounded-xl p-3 overflow-hidden flex flex-col">
                        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                            <motion.span
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                ●
                            </motion.span>
                            실시간 통신
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-1">
                            <AnimatePresence mode="popLayout">
                                {messages.map(msg => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -20, height: 0 }}
                                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        className="p-2 rounded bg-white/5 text-xs"
                                    >
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                                {msg.from}
                                            </span>
                                            <span className="text-white/30">→</span>
                                            <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                                {msg.to}
                                            </span>
                                        </div>
                                        <div className="text-white/60">{msg.content}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Upgrade Events */}
                    <div className="glass rounded-xl p-3">
                        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                            <span>⚡</span>
                            자가 업그레이드
                            <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-[var(--primary-green)]/20 text-[var(--primary-green)]">
                                #{networkState.upgradeCount}
                            </span>
                        </h3>
                        <div className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {upgradeEvents.map(event => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-2 rounded-lg bg-[var(--primary-green)]/10 border-l-2 border-[var(--primary-green)]"
                                    >
                                        <div className="font-medium text-sm text-[var(--primary-green)]">{event.title}</div>
                                        <div className="text-xs text-white/60">{event.description}</div>
                                        <div className="text-xs text-white/40 mt-1">
                                            영향: {event.affectedAgents} 에이전트 • +{event.impact.toFixed(1)}%
                                        </div>
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
