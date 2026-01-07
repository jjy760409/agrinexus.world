'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VerificationAgent {
    id: string;
    name: string;
    koreanName: string;
    role: string;
    specialty: string[];
    avatar: string;
    intelligenceLevel: number;
    trustRating: number;
    status: string;
    verificationsMade: number;
    improvementsSuggested: number;
    evolutionsApplied: number;
}

interface VerificationTask {
    id: string;
    type: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    targetSystem: string;
    description: string;
    assignedTo: string[];
    status: string;
    progress: number;
    hasEvolutionPlan: boolean;
}

interface EvolutionRecord {
    id: string;
    targetSystem: string;
    versionBefore: string;
    versionAfter: string;
    improvements: string[];
    performanceGain: number;
    reliabilityGain: number;
    capabilityGain: number;
}

const createAgents = (): VerificationAgent[] => [
    { id: 'v-0', name: 'Omega Prime', koreanName: '👑 오메가 프라임', role: 'chief_supervisor', specialty: ['총괄 감독', '최종 승인'], avatar: '👑', intelligenceLevel: 300, trustRating: 99.9, status: 'supervising', verificationsMade: 1850, improvementsSuggested: 450, evolutionsApplied: 180 },
    { id: 'v-1', name: 'Tech Inspector X', koreanName: '🔍 테크 인스펙터', role: 'technology_inspector', specialty: ['기술 분석', '코드 검사'], avatar: '🔍', intelligenceLevel: 280, trustRating: 99.5, status: 'inspecting', verificationsMade: 1620, improvementsSuggested: 380, evolutionsApplied: 145 },
    { id: 'v-2', name: 'Guardian Shield', koreanName: '🛡️ 가디언 쉴드', role: 'security_auditor', specialty: ['보안 감사', '취약점 탐지'], avatar: '🛡️', intelligenceLevel: 285, trustRating: 99.8, status: 'inspecting', verificationsMade: 1450, improvementsSuggested: 320, evolutionsApplied: 98 },
    { id: 'v-3', name: 'Quality Oracle', koreanName: '⭐ 퀄리티 오라클', role: 'quality_validator', specialty: ['품질 검증', '결함 탐지'], avatar: '⭐', intelligenceLevel: 275, trustRating: 99.2, status: 'verifying', verificationsMade: 1380, improvementsSuggested: 290, evolutionsApplied: 112 },
    { id: 'v-4', name: 'Speed Demon', koreanName: '⚡ 스피드 데몬', role: 'performance_optimizer', specialty: ['성능 최적화', '병목 분석'], avatar: '⚡', intelligenceLevel: 270, trustRating: 98.8, status: 'optimizing', verificationsMade: 1520, improvementsSuggested: 410, evolutionsApplied: 165 },
    { id: 'v-5', name: 'Evolution Master', koreanName: '🧬 진화 마스터', role: 'evolution_architect', specialty: ['진화 설계', '혁신 융합'], avatar: '🧬', intelligenceLevel: 295, trustRating: 99.7, status: 'evolving', verificationsMade: 980, improvementsSuggested: 520, evolutionsApplied: 210 },
    { id: 'v-6', name: 'Harmony Keeper', koreanName: '🔗 하모니 키퍼', role: 'integration_guardian', specialty: ['통합 검증', '호환성'], avatar: '🔗', intelligenceLevel: 265, trustRating: 98.5, status: 'verifying', verificationsMade: 1250, improvementsSuggested: 280, evolutionsApplied: 95 },
    { id: 'v-7', name: 'Ethics Sage', koreanName: '⚖️ 윤리 세이지', role: 'ethical_overseer', specialty: ['윤리 검토', '지속가능성'], avatar: '⚖️', intelligenceLevel: 260, trustRating: 99.9, status: 'supervising', verificationsMade: 890, improvementsSuggested: 180, evolutionsApplied: 45 },
    { id: 'v-8', name: 'Rock Solid', koreanName: '🏔️ 록 솔리드', role: 'reliability_engineer', specialty: ['신뢰성 테스트', '안정성'], avatar: '🏔️', intelligenceLevel: 275, trustRating: 99.4, status: 'verifying', verificationsMade: 1680, improvementsSuggested: 350, evolutionsApplied: 130 },
    { id: 'v-9', name: 'Vision Prophet', koreanName: '🔮 비전 프로펫', role: 'future_strategist', specialty: ['미래 전략', '기술 로드맵'], avatar: '🔮', intelligenceLevel: 290, trustRating: 99.6, status: 'supervising', verificationsMade: 720, improvementsSuggested: 480, evolutionsApplied: 175 }
];

const createTasks = (): VerificationTask[] => [
    { id: 'vt-1', type: 'technology_inspection', priority: 'critical', targetSystem: '양자 센서 통합', description: '양자 바이오센싱 시스템 진화 검증', assignedTo: ['v-1'], status: 'in_progress', progress: 72, hasEvolutionPlan: true },
    { id: 'vt-2', type: 'security_audit', priority: 'high', targetSystem: '블록체인 거래소', description: '스마트 컨트랙트 보안 감사', assignedTo: ['v-2'], status: 'in_progress', progress: 45, hasEvolutionPlan: false },
    { id: 'vt-3', type: 'evolution_design', priority: 'critical', targetSystem: '식물 텔레파시', description: '집단 지능 IQ 120→180 진화', assignedTo: ['v-5'], status: 'in_progress', progress: 58, hasEvolutionPlan: true },
    { id: 'vt-4', type: 'performance_test', priority: 'high', targetSystem: '시간 농업 엔진', description: '4x 가속 안정성 검증', assignedTo: ['v-4'], status: 'in_progress', progress: 85, hasEvolutionPlan: true },
    { id: 'vt-5', type: 'reliability_test', priority: 'medium', targetSystem: '대기 수분 생성기', description: '24시간 연속 운전 테스트', assignedTo: ['v-8'], status: 'in_progress', progress: 91, hasEvolutionPlan: false }
];

const createEvolutions = (): EvolutionRecord[] => [
    { id: 'ev-1', targetSystem: '양자 통신', versionBefore: '1.0', versionAfter: '2.0', improvements: ['QKD 암호화 강화', '전송 속도 3배', '오류 정정 99.99%'], performanceGain: 200, reliabilityGain: 50, capabilityGain: 300 },
    { id: 'ev-2', targetSystem: '중력 제어', versionBefore: '1.0', versionAfter: '1.5', improvements: ['균일성 99%', '안정성 98%', '에너지 효율 40%↑'], performanceGain: 40, reliabilityGain: 60, capabilityGain: 50 },
    { id: 'ev-3', targetSystem: '광합성 AI', versionBefore: '1.2', versionAfter: '2.0', improvements: ['효율 85%→98%', '예측 정확도 99%', '자가 최적화'], performanceGain: 15, reliabilityGain: 45, capabilityGain: 120 },
    { id: 'ev-4', targetSystem: '뿌리 AI 네트워크', versionBefore: '1.0', versionAfter: '2.0', improvements: ['집단 IQ 120→180', '결정 속도 3배', '적응력 향상'], performanceGain: 80, reliabilityGain: 35, capabilityGain: 200 }
];

const ROLE_COLORS: Record<string, string> = {
    chief_supervisor: 'from-amber-500 to-yellow-500',
    technology_inspector: 'from-blue-500 to-cyan-500',
    security_auditor: 'from-red-500 to-rose-500',
    quality_validator: 'from-yellow-500 to-amber-500',
    performance_optimizer: 'from-purple-500 to-pink-500',
    evolution_architect: 'from-green-500 to-emerald-500',
    integration_guardian: 'from-cyan-500 to-teal-500',
    ethical_overseer: 'from-indigo-500 to-blue-500',
    reliability_engineer: 'from-gray-500 to-slate-500',
    future_strategist: 'from-violet-500 to-purple-500'
};

export default function SuperIntelligencePanel() {
    const [agents] = useState<VerificationAgent[]>(createAgents());
    const [tasks] = useState<VerificationTask[]>(createTasks());
    const [evolutions] = useState<EvolutionRecord[]>(createEvolutions());
    const [activeView, setActiveView] = useState<'agents' | 'verification' | 'evolution' | 'metrics'>('agents');
    const [trustScore, setTrustScore] = useState(99.9);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrustScore(99.85 + Math.random() * 0.15);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { supervising: 'bg-amber-500', inspecting: 'bg-blue-500', verifying: 'bg-green-500', evolving: 'bg-purple-500', optimizing: 'bg-pink-500', idle: 'bg-gray-500', learning: 'bg-cyan-500' };
        return colors[status] || 'bg-gray-500';
    };

    const avgIQ = Math.round(agents.reduce((sum, a) => sum + a.intelligenceLevel, 0) / agents.length);
    const totalVerifications = agents.reduce((sum, a) => sum + a.verificationsMade, 0);
    const totalEvolutions = agents.reduce((sum, a) => sum + a.evolutionsApplied, 0);

    return (
        <div className="h-full glass rounded-xl p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-5xl">🧠</motion.div>
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">초지능 검증 에이전트 팀</h2>
                        <p className="text-white/60 text-sm">감독 · 검사 · 검증 · 진화 전담 10인 초지능 팀</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center"><div className="text-xs text-white/50">평균 IQ</div><div className="text-xl font-bold text-purple-400">{avgIQ}</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">총 검증</div><div className="text-xl font-bold text-blue-400">{totalVerifications.toLocaleString()}</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">총 진화</div><div className="text-xl font-bold text-green-400">{totalEvolutions}</div></div>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500 rounded-full">
                        <div className="text-xs text-white/50">신뢰도 점수</div>
                        <div className="text-xl font-bold text-amber-400">{trustScore.toFixed(1)}%</div>
                    </motion.div>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
                {[{ id: 'agents' as const, label: '🧠 초지능 에이전트', count: 10 }, { id: 'verification' as const, label: '✅ 검증 현황', count: tasks.length }, { id: 'evolution' as const, label: '🧬 진화 기록', count: evolutions.length }, { id: 'metrics' as const, label: '📊 품질 지표', count: null }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeView === tab.id ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        {tab.label} {tab.count !== null && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeView === 'agents' && (
                        <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-5 gap-3 overflow-y-auto">
                            {agents.map((agent, i) => (
                                <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03, y: -5 }} className={`bg-gradient-to-br ${ROLE_COLORS[agent.role]} p-[2px] rounded-xl cursor-pointer`}>
                                    <div className="h-full bg-[#0a0a0a] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-4xl">{agent.avatar}</div>
                                            <div className="text-right">
                                                <div className="text-xs text-white/50">IQ</div>
                                                <div className="text-lg font-bold text-purple-400">{agent.intelligenceLevel}</div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-white mb-1 text-sm">{agent.koreanName}</div>
                                        <div className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(agent.status)} text-white mb-2`}>{agent.status}</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-amber-400 font-bold">{agent.trustRating.toFixed(1)}%</div><div className="text-white/40">신뢰도</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-blue-400 font-bold">{agent.verificationsMade}</div><div className="text-white/40">검증</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-yellow-400 font-bold">{agent.improvementsSuggested}</div><div className="text-white/40">개선안</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-green-400 font-bold">{agent.evolutionsApplied}</div><div className="text-white/40">진화</div></div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'verification' && (
                        <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto space-y-3">
                            {tasks.map((task, i) => (
                                <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white/5 border rounded-xl p-4 ${task.priority === 'critical' ? 'border-red-500' : task.priority === 'high' ? 'border-orange-500' : 'border-white/10'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${task.priority === 'critical' ? 'bg-red-500/20 text-red-400' : task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>{task.priority}</span>
                                            <div>
                                                <h3 className="font-bold text-white">{task.targetSystem}</h3>
                                                <p className="text-xs text-white/50">{task.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {task.hasEvolutionPlan && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">🧬 진화 예정</span>}
                                            {task.assignedTo.map(id => { const agent = agents.find(a => a.id === id); return agent ? <span key={id} className="text-2xl" title={agent.koreanName}>{agent.avatar}</span> : null; })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-amber-500 to-yellow-500" /></div>
                                        <span className="text-white font-bold w-12 text-right">{task.progress}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'evolution' && (
                        <motion.div key="evolution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto space-y-3">
                            {evolutions.map((ev, i) => (
                                <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">🧬</span>
                                            <div>
                                                <h3 className="font-bold text-white">{ev.targetSystem}</h3>
                                                <p className="text-xs text-white/50">v{ev.versionBefore} → v{ev.versionAfter}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 text-center">
                                            <div><div className="text-lg font-bold text-purple-400">+{ev.performanceGain}%</div><div className="text-xs text-white/50">성능</div></div>
                                            <div><div className="text-lg font-bold text-blue-400">+{ev.reliabilityGain}%</div><div className="text-xs text-white/50">신뢰성</div></div>
                                            <div><div className="text-lg font-bold text-green-400">+{ev.capabilityGain}%</div><div className="text-xs text-white/50">기능</div></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {ev.improvements.map((imp, j) => <span key={j} className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">✓ {imp}</span>)}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'metrics' && (
                        <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-3 gap-4 overflow-y-auto">
                            {[
                                { label: '전체 품질 점수', value: '98.5%', icon: '🏆', color: 'from-amber-500 to-yellow-500' },
                                { label: '보안 점수', value: '99.8%', icon: '🛡️', color: 'from-red-500 to-rose-500' },
                                { label: '신뢰성 점수', value: '99.2%', icon: '🏔️', color: 'from-gray-500 to-slate-500' },
                                { label: '성능 점수', value: '97.5%', icon: '⚡', color: 'from-purple-500 to-pink-500' },
                                { label: '진화 잠재력', value: '85%', icon: '🧬', color: 'from-green-500 to-emerald-500' },
                                { label: '신뢰도', value: '99.9%', icon: '✅', color: 'from-blue-500 to-cyan-500' },
                                { label: '검증 커버리지', value: '100%', icon: '📊', color: 'from-indigo-500 to-blue-500' },
                                { label: '해결된 치명적 이슈', value: '247', icon: '🔧', color: 'from-orange-500 to-amber-500' },
                                { label: '적용된 진화', value: '156', icon: '🚀', color: 'from-violet-500 to-purple-500' }
                            ].map((metric, i) => (
                                <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.05 }} className={`bg-gradient-to-br ${metric.color} p-[1px] rounded-xl`}>
                                    <div className="h-full bg-[#0a0a0a] rounded-xl p-6 text-center">
                                        <div className="text-4xl mb-3">{metric.icon}</div>
                                        <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                                        <div className="text-sm text-white/60">{metric.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
