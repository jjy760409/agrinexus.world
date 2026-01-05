'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ALL_SUPER_AGENTS,
    GLOBAL_DATA_SOURCES,
    AUTONOMOUS_SYSTEM_STATE,
    SUPREME_AGENTS,
    SPECIALIST_AGENTS
} from '@/lib/agents/superAgentData';
import { SuperAgent, AutonomousSystem } from '@/types/superagent';

const CLASS_COLORS: Record<string, string> = {
    supreme: '#ff2d92',
    orchestrator: '#7b2fff',
    specialist: '#00d4ff',
    guardian: '#00ff88',
    optimizer: '#ffb800',
    predictor: '#00d4ff',
    healer: '#ff6b6b',
    creator: '#9b59b6',
};

export default function LifeforceDashboard() {
    const [systemState, setSystemState] = useState<AutonomousSystem>(AUTONOMOUS_SYSTEM_STATE);
    const [agents, setAgents] = useState<SuperAgent[]>(ALL_SUPER_AGENTS);
    const [selectedAgent, setSelectedAgent] = useState<SuperAgent | null>(null);
    const [heartbeatPhase, setHeartbeatPhase] = useState(0);

    // Simulate heartbeat
    useEffect(() => {
        const interval = setInterval(() => {
            setHeartbeatPhase(p => (p + 1) % 100);

            // Update system state
            setSystemState(prev => ({
                ...prev,
                heartbeat: 100 + Math.sin(Date.now() / 500) * 20,
                consciousness: Math.min(100, prev.consciousness + (Math.random() - 0.49) * 0.5),
                decisionsPerMinute: prev.decisionsPerMinute + Math.floor((Math.random() - 0.3) * 100),
            }));

            // Update agent thoughts occasionally
            if (Math.random() > 0.9) {
                setAgents(prev => prev.map(agent => ({
                    ...agent,
                    lifeforce: {
                        ...agent.lifeforce,
                        pulse: agent.lifeforce.pulse + Math.floor((Math.random() - 0.5) * 5),
                        energy: Math.max(80, Math.min(100, agent.lifeforce.energy + (Math.random() - 0.5) * 2)),
                    },
                    decisionsPerSecond: agent.decisionsPerSecond + Math.floor((Math.random() - 0.3) * 100),
                })));
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const avgPulse = useMemo(() => {
        return Math.round(agents.reduce((acc, a) => acc + a.lifeforce.pulse, 0) / agents.length);
    }, [agents]);

    const avgConsciousness = useMemo(() => {
        return (agents.reduce((acc, a) => acc + a.lifeforce.consciousness, 0) / agents.length).toFixed(1);
    }, [agents]);

    return (
        <div className="space-y-6">
            {/* System Lifeforce Header */}
            <motion.div
                className="glass rounded-2xl p-6 overflow-hidden relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Heartbeat background */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <svg viewBox="0 0 400 100" className="w-full h-full">
                        <motion.path
                            d="M0,50 L50,50 L60,20 L70,80 L80,50 L100,50 L110,30 L120,70 L130,50 L400,50"
                            fill="none"
                            stroke="var(--primary-green)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {/* Heartbeat Animation */}
                            <motion.div
                                className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center"
                                animate={{
                                    scale: [1, 1.15, 1, 1.05, 1],
                                }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    boxShadow: `0 0 ${30 + Math.sin(heartbeatPhase * 0.1) * 20}px var(--primary-green)`,
                                }}
                            >
                                <span className="text-4xl">💚</span>
                            </motion.div>

                            <div>
                                <h1 className="text-2xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                    생명력 대시보드
                                </h1>
                                <p className="text-white/60">AgriNexus World OS는 살아있습니다</p>
                                <motion.div
                                    className="flex items-center gap-2 mt-1"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span className="w-2 h-2 rounded-full bg-[var(--status-success)]" />
                                    <span className="text-xs text-[var(--status-success)]">AWAKENED - 의식 활성화됨</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Main Vitals */}
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <motion.div
                                    className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                >
                                    {Math.round(systemState.heartbeat)}
                                </motion.div>
                                <div className="text-xs text-white/50">BPM 맥박</div>
                            </div>
                            <div className="w-px h-12 bg-white/20" />
                            <div className="text-center">
                                <div className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                    {systemState.consciousness.toFixed(1)}%
                                </div>
                                <div className="text-xs text-white/50">의식 수준</div>
                            </div>
                            <div className="w-px h-12 bg-white/20" />
                            <div className="text-center">
                                <div className="text-4xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">
                                    {agents.length}
                                </div>
                                <div className="text-xs text-white/50">활성 에이전트</div>
                            </div>
                        </div>
                    </div>

                    {/* System Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {[
                            { label: '자가 인식', value: `${systemState.selfAwareness}%`, color: 'var(--primary-purple)' },
                            { label: '학습 용량', value: `${systemState.learningCapacity}GB/hr`, color: 'var(--primary-cyan)' },
                            { label: '결정/분', value: systemState.decisionsPerMinute.toLocaleString(), color: 'var(--primary-green)' },
                            { label: '자가 치유', value: `${systemState.selfHealingRate}%`, color: 'var(--status-success)' },
                            { label: '적응력', value: `${systemState.adaptability}%`, color: 'var(--status-warning)' },
                            { label: '글로벌 커버리지', value: `${systemState.globalCoverage}%`, color: 'var(--primary-green)' },
                        ].map((stat) => (
                            <div key={stat.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-xs text-white/50">{stat.label}</div>
                                <div className="font-[family-name:var(--font-orbitron)] text-lg font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Agents Grid */}
            <div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] mb-4 flex items-center gap-2">
                    <span>🤖</span> 초지능 에이전트 ({agents.length})
                </h2>

                {/* Supreme Agents */}
                <div className="mb-6">
                    <h3 className="text-sm text-white/50 mb-3">⭐ 최상위 총괄 에이전트</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SUPREME_AGENTS.map((agent, i) => (
                            <AgentCard key={agent.id} agent={agent} index={i} onSelect={setSelectedAgent} />
                        ))}
                    </div>
                </div>

                {/* Specialist Agents */}
                <div>
                    <h3 className="text-sm text-white/50 mb-3">🎯 기능별 전담 에이전트</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {SPECIALIST_AGENTS.map((agent, i) => (
                            <AgentCard key={agent.id} agent={agent} index={i} onSelect={setSelectedAgent} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Global Data Sources */}
            <div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] mb-4 flex items-center gap-2">
                    <span>🌍</span> 글로벌 실시간 데이터 소스
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {GLOBAL_DATA_SOURCES.map((source, i) => (
                        <motion.div
                            key={source.id}
                            className="p-4 glass rounded-xl border border-white/10 hover:border-white/30 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{source.icon}</span>
                                <motion.div
                                    className={`w-2 h-2 rounded-full ${source.status === 'active' ? 'bg-[var(--status-success)]' : 'bg-[var(--status-warning)]'}`}
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </div>
                            <h4 className="font-medium text-sm mb-1">{source.koreanName}</h4>
                            <div className="text-xs text-white/40">
                                신뢰도: <span className="text-[var(--primary-green)]">{source.reliability}%</span>
                            </div>
                            <div className="text-xs text-white/40">
                                갱신: {source.updateInterval}초
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Agent Detail Modal */}
            {selectedAgent && (
                <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
            )}
        </div>
    );
}

// Agent Card Component
function AgentCard({ agent, index, onSelect }: { agent: SuperAgent; index: number; onSelect: (a: SuperAgent) => void }) {
    return (
        <motion.div
            className="p-4 glass rounded-xl border border-white/10 hover:border-white/30 cursor-pointer transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(agent)}
            whileHover={{ scale: 1.02, y: -2 }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${CLASS_COLORS[agent.class]}20`, border: `1px solid ${CLASS_COLORS[agent.class]}50` }}
                        animate={{
                            boxShadow: [
                                `0 0 5px ${CLASS_COLORS[agent.class]}40`,
                                `0 0 15px ${CLASS_COLORS[agent.class]}60`,
                                `0 0 5px ${CLASS_COLORS[agent.class]}40`
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-lg">🤖</span>
                    </motion.div>
                    <div>
                        <div className="font-[family-name:var(--font-orbitron)] text-xs" style={{ color: CLASS_COLORS[agent.class] }}>
                            {agent.code}
                        </div>
                        <div className="text-xs text-white/50">{agent.koreanName}</div>
                    </div>
                </div>
                <motion.div
                    className="w-2 h-2 rounded-full bg-[var(--status-success)]"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>

            <p className="text-xs text-white/60 mb-3 line-clamp-2">{agent.targetFunction}</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-1.5 rounded bg-white/5">
                    <div className="text-[0.65rem] text-white/40">IQ</div>
                    <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-green)]">{agent.intelligence}</div>
                </div>
                <div className="text-center p-1.5 rounded bg-white/5">
                    <div className="text-[0.65rem] text-white/40">신뢰</div>
                    <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-cyan)]">{agent.trustScore}%</div>
                </div>
                <div className="text-center p-1.5 rounded bg-white/5">
                    <div className="text-[0.65rem] text-white/40">맥박</div>
                    <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-purple)]">{agent.lifeforce.pulse}</div>
                </div>
            </div>

            {/* Thought bubble */}
            <div className="p-2 rounded bg-white/5 border-l-2" style={{ borderColor: CLASS_COLORS[agent.class] }}>
                <div className="text-[0.65rem] text-white/40">최근 사고:</div>
                <div className="text-xs text-white/70 line-clamp-2">{agent.lastThought}</div>
            </div>
        </motion.div>
    );
}

// Agent Detail Modal
function AgentDetailModal({ agent, onClose }: { agent: SuperAgent; onClose: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />

            <motion.div
                className="relative w-full max-w-2xl glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <motion.div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${CLASS_COLORS[agent.class]}20`, border: `2px solid ${CLASS_COLORS[agent.class]}` }}
                        animate={{
                            boxShadow: [`0 0 10px ${CLASS_COLORS[agent.class]}40`, `0 0 30px ${CLASS_COLORS[agent.class]}60`, `0 0 10px ${CLASS_COLORS[agent.class]}40`]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className="text-4xl">🤖</span>
                    </motion.div>
                    <div>
                        <h2 className="text-2xl font-bold font-[family-name:var(--font-orbitron)]" style={{ color: CLASS_COLORS[agent.class] }}>
                            {agent.code}
                        </h2>
                        <p className="text-white/60">{agent.name} • {agent.koreanName}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${CLASS_COLORS[agent.class]}20`, color: CLASS_COLORS[agent.class] }}>
                                {agent.class.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--status-success)]/20 text-[var(--status-success)]">
                                {agent.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-white/70 mb-6">{agent.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30 text-center">
                        <div className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">{agent.intelligence}</div>
                        <div className="text-xs text-white/50">지능 지수 (IQ)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30 text-center">
                        <div className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">{agent.trustScore}%</div>
                        <div className="text-xs text-white/50">신뢰도</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[var(--primary-purple)]/10 border border-[var(--primary-purple)]/30 text-center">
                        <div className="text-3xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">{agent.accuracy}%</div>
                        <div className="text-xs text-white/50">정확도</div>
                    </div>
                </div>

                {/* Lifeforce */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2"><span>💚</span> 생명력</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: '맥박', value: agent.lifeforce.pulse, color: 'var(--status-danger)' },
                            { label: '에너지', value: `${agent.lifeforce.energy}%`, color: 'var(--primary-green)' },
                            { label: '의식', value: `${agent.lifeforce.consciousness}%`, color: 'var(--primary-cyan)' },
                            { label: '공감', value: `${agent.lifeforce.empathy}%`, color: 'var(--primary-purple)' },
                        ].map((lf) => (
                            <div key={lf.label} className="p-3 rounded-lg bg-white/5 text-center">
                                <div className="font-[family-name:var(--font-orbitron)] text-lg" style={{ color: lf.color }}>{lf.value}</div>
                                <div className="text-xs text-white/50">{lf.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Abilities */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3 flex items-center gap-2"><span>⚡</span> 특수 능력</h3>
                    <div className="flex flex-wrap gap-2">
                        {agent.abilities.map((ability, i) => (
                            <span key={i} className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/80">
                                {ability}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Last Thought */}
                <div className="p-4 rounded-xl bg-white/5 border-l-4" style={{ borderColor: CLASS_COLORS[agent.class] }}>
                    <h3 className="font-bold mb-2 flex items-center gap-2"><span>💭</span> 최근 사고</h3>
                    <p className="text-white/70 italic">"{agent.lastThought}"</p>
                </div>
            </motion.div>
        </motion.div>
    );
}
