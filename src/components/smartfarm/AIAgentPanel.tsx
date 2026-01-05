'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AI_AGENTS } from '@/lib/smartfarm/farmData';
import { AIAgent } from '@/types/smartfarm';

const STATUS_COLORS = {
    active: 'var(--status-success)',
    learning: 'var(--primary-cyan)',
    standby: 'var(--status-warning)',
    error: 'var(--status-danger)',
};

export default function AIAgentPanel() {
    const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

    const totalDecisions = AI_AGENTS.reduce((acc, a) => acc + a.decisionsToday, 0);
    const avgConfidence = AI_AGENTS.reduce((acc, a) => acc + a.confidence, 0) / AI_AGENTS.length;

    return (
        <div className="h-full flex gap-4">
            {/* Agent List */}
            <div className="flex-1 glass rounded-xl p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] flex items-center gap-2">
                        <span>🤖</span> AI 에이전트 시스템
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs text-white/50">오늘 결정</span>
                            <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {totalDecisions.toLocaleString()}
                            </span>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs text-white/50">평균 신뢰도</span>
                            <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {avgConfidence.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {AI_AGENTS.map((agent, i) => (
                        <motion.div
                            key={agent.id}
                            className="p-4 rounded-xl glass border border-white/10 hover:border-white/30 cursor-pointer transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedAgent(agent)}
                            whileHover={{ scale: 1.02, y: -2 }}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center">
                                    <span className="text-xl">🤖</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <motion.div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: STATUS_COLORS[agent.status] }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-xs text-white/40 uppercase">{agent.status}</span>
                                </div>
                            </div>

                            {/* Name */}
                            <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-bold text-[var(--primary-cyan)] mb-1">
                                {agent.code}
                            </h3>
                            <p className="text-sm text-white/70 mb-2">{agent.role}</p>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="p-2 rounded bg-white/5 text-center">
                                    <div className="text-xs text-white/40">신뢰도</div>
                                    <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                        {agent.confidence}%
                                    </div>
                                </div>
                                <div className="p-2 rounded bg-white/5 text-center">
                                    <div className="text-xs text-white/40">정확도</div>
                                    <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                        {agent.accuracy}%
                                    </div>
                                </div>
                            </div>

                            {/* Learning Progress */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white/40">학습 진행</span>
                                    <span className="text-[var(--primary-purple)]">{agent.learningProgress}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${agent.learningProgress}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Panel */}
            {selectedAgent && (
                <motion.div
                    className="w-96 glass rounded-xl p-5 overflow-y-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">에이전트 상세</h3>
                        <button
                            onClick={() => setSelectedAgent(null)}
                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <motion.div
                            className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center mb-3"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <span className="text-4xl">🤖</span>
                        </motion.div>
                        <h4 className="text-xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                            {selectedAgent.code}
                        </h4>
                        <p className="text-white/60">{selectedAgent.name}</p>
                        <p className="text-sm text-white/40">{selectedAgent.role}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/70 mb-4 p-3 rounded-lg bg-white/5">
                        {selectedAgent.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30 text-center">
                            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {selectedAgent.confidence}%
                            </div>
                            <div className="text-xs text-white/50">신뢰도</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30 text-center">
                            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                {selectedAgent.accuracy}%
                            </div>
                            <div className="text-xs text-white/50">정확도</div>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--primary-purple)]/10 border border-[var(--primary-purple)]/30 text-center">
                            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">
                                {selectedAgent.decisionsToday.toLocaleString()}
                            </div>
                            <div className="text-xs text-white/50">오늘 결정</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">
                                {selectedAgent.learningProgress}%
                            </div>
                            <div className="text-xs text-white/50">학습 진행</div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                        <h5 className="text-sm font-bold mb-2">전문 분야</h5>
                        <div className="flex flex-wrap gap-1">
                            {selectedAgent.specialties.map((specialty, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-xs rounded-full bg-[var(--primary-green)]/10 text-[var(--primary-green)] border border-[var(--primary-green)]/30"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Controlled Systems */}
                    <div>
                        <h5 className="text-sm font-bold mb-2">제어 시스템</h5>
                        <div className="space-y-1">
                            {selectedAgent.controlledSystems.map((system, i) => (
                                <div
                                    key={i}
                                    className="p-2 rounded bg-white/5 text-sm flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[var(--status-success)]" />
                                    {system}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2 rounded-lg bg-[var(--primary-green)] text-[var(--bg-dark)] font-medium">
                            설정
                        </button>
                        <button className="flex-1 py-2 rounded-lg bg-white/10 text-white font-medium">
                            로그
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
