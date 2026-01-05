'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import NeuralNetwork from '@/components/ui/NeuralNetwork';
import PredictionChart from '@/components/ui/PredictionChart';

export default function AIBrain() {
    const {
        neuralStats,
        updateNeuralStats,
        learningProgress,
        updateLearningProgress,
        decisions,
        removeDecision,
        addAlert
    } = useStore();

    useEffect(() => {
        const interval = setInterval(() => {
            updateNeuralStats();
            updateLearningProgress();
        }, 2000);

        return () => clearInterval(interval);
    }, [updateNeuralStats, updateLearningProgress]);

    const handleExecuteDecision = useCallback((id: string, title: string) => {
        removeDecision(id);
        addAlert({
            id: `alert-${Date.now()}`,
            type: 'success',
            icon: '✅',
            title: 'AI 결정 실행됨',
            desc: `${title} 작업이 성공적으로 수행되었습니다`,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        });
    }, [removeDecision, addAlert]);

    return (
        <div className="space-y-6">
            {/* Module Header */}
            <div className="text-center mb-8">
                <motion.h2
                    className="text-2xl md:text-3xl font-bold gradient-text font-[family-name:var(--font-orbitron)] mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    🧠 AI Brain
                </motion.h2>
                <p className="text-white/60">초지능 신경망 기반 의사결정 시스템</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Neural Network Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🔮 신경망 활성화
                        </h3>
                        <span className="badge badge-live animate-blink">LIVE</span>
                    </div>

                    <div className="h-64 mb-4">
                        <NeuralNetwork />
                    </div>

                    <div className="flex justify-around pt-4 border-t border-white/10">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[var(--primary-cyan)] font-[family-name:var(--font-orbitron)] drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                                {neuralStats.neurons.toLocaleString()}
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-wider">활성 뉴런</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[var(--primary-cyan)] font-[family-name:var(--font-orbitron)] drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                                {(neuralStats.synapses / 1000).toFixed(1)}K
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-wider">시냅스 연결</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[var(--primary-cyan)] font-[family-name:var(--font-orbitron)] drop-shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                                {neuralStats.processSpeed}
                            </span>
                            <span className="text-xs text-white/40 uppercase tracking-wider">처리 속도/ms</span>
                        </div>
                    </div>
                </motion.div>

                {/* Predictions Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            📊 AI 예측 분석
                        </h3>
                        <div className="flex gap-1">
                            {['수확량', '병해충', '기상'].map((tab, i) => (
                                <button
                                    key={tab}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${i === 0
                                            ? 'bg-[var(--primary-green)] border-[var(--primary-green)] text-[var(--bg-dark)]'
                                            : 'border-white/20 text-white/60 hover:border-[var(--primary-cyan)] hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-48 mb-4">
                        <PredictionChart />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border-l-3 border-l-[var(--status-success)]">
                            <span className="text-2xl">📈</span>
                            <div className="flex-1">
                                <span className="block text-sm text-white/60">예상 수확량</span>
                                <span className="font-[family-name:var(--font-orbitron)] font-semibold text-[var(--status-success)]">+23.5%</span>
                            </div>
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">신뢰도 94%</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border-l-3 border-l-[var(--status-warning)]">
                            <span className="text-2xl">⚠️</span>
                            <div className="flex-1">
                                <span className="block text-sm text-white/60">병해충 위험</span>
                                <span className="font-[family-name:var(--font-orbitron)] font-semibold text-[var(--status-warning)]">낮음</span>
                            </div>
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full">신뢰도 89%</span>
                        </div>
                    </div>
                </motion.div>

                {/* Decisions Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🎯 자율 의사결정
                        </h3>
                        <span className="badge badge-auto animate-blink">AUTO</span>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {decisions.map((decision) => (
                            <motion.div
                                key={decision.id}
                                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[var(--primary-green)] hover:bg-[var(--primary-green)]/5 transition-all group"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 ${decision.priority === 'high' ? 'bg-[var(--status-danger)]' :
                                        decision.priority === 'medium' ? 'bg-[var(--status-warning)]' :
                                            'bg-[var(--status-success)]'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm mb-1">{decision.title}</div>
                                    <div className="text-xs text-white/50 line-clamp-2">{decision.desc}</div>
                                </div>
                                <motion.button
                                    className="px-3 py-1.5 bg-[var(--primary-green)] rounded-full text-xs font-semibold text-[var(--bg-dark)] opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleExecuteDecision(decision.id, decision.title)}
                                >
                                    실행
                                </motion.button>
                            </motion.div>
                        ))}

                        {decisions.length === 0 && (
                            <div className="text-center py-8 text-white/40">
                                <span className="text-4xl block mb-2">✨</span>
                                모든 결정이 실행되었습니다
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Learning Progress Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            📚 학습 진행 상태
                        </h3>
                    </div>

                    <div className="space-y-4 mb-6">
                        {[
                            { label: '작물 패턴 인식', value: learningProgress.crop },
                            { label: '환경 최적화', value: learningProgress.env },
                            { label: '에너지 효율화', value: learningProgress.energy },
                            { label: '수확 시기 예측', value: learningProgress.harvest },
                        ].map((item) => (
                            <div key={item.label} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">{item.label}</span>
                                    <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">{item.value}%</span>
                                </div>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Intelligence Ring */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-28 h-28">
                            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray="339.3"
                                    initial={{ strokeDashoffset: 339.3 }}
                                    animate={{ strokeDashoffset: 339.3 * (1 - neuralStats.intelligence / 100) }}
                                    transition={{ duration: 1 }}
                                />
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00ff88" />
                                        <stop offset="50%" stopColor="#00d4ff" />
                                        <stop offset="100%" stopColor="#7b2fff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                    {neuralStats.intelligence.toFixed(1)}
                                </span>
                                <span className="text-sm text-white/60">%</span>
                            </div>
                        </div>
                        <span className="text-sm text-white/60 mt-2">총 지능 수준</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
