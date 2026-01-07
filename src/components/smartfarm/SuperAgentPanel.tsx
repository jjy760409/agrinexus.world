'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 에이전트 타입
interface SuperAgent {
    id: string;
    name: string;
    koreanName: string;
    role: string;
    specialty: string[];
    avatar: string;
    status: string;
    performance: { efficiency: number; accuracy: number; speed: number; totalTasksCompleted: number; successRate: number };
    totalActionsToday: number;
    discoveriesToday: number;
}

interface AgentTask {
    id: string;
    type: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    assignedTo: string[];
    status: string;
    progress: number;
}

interface Discovery {
    id: string;
    type: string;
    title: string;
    country: string;
    relevanceScore: number;
    innovationScore: number;
    implemented: boolean;
    legalCleared: boolean;
}

// 10명의 슈퍼 에이전트 생성
const createSuperAgents = (): SuperAgent[] => [
    { id: 'agent-0', name: 'Dr. Research', koreanName: '🔬 리서치 박사', role: 'research', specialty: ['논문 분석', '연구 동향', '학술 DB'], avatar: '🔬', status: 'working', performance: { efficiency: 96, accuracy: 98, speed: 12, totalTasksCompleted: 1250, successRate: 98.5 }, totalActionsToday: 87, discoveriesToday: 8 },
    { id: 'agent-1', name: 'Tech Scout', koreanName: '🔭 기술 스카우트', role: 'technology_scout', specialty: ['기술 발굴', '스타트업 탐색', '혁신 트렌드'], avatar: '🔭', status: 'collecting', performance: { efficiency: 94, accuracy: 95, speed: 15, totalTasksCompleted: 980, successRate: 97.2 }, totalActionsToday: 102, discoveriesToday: 12 },
    { id: 'agent-2', name: 'Patent Master', koreanName: '📜 특허 마스터', role: 'patent_analyst', specialty: ['특허 분석', 'FTO 분석', 'IP 전략'], avatar: '📜', status: 'analyzing', performance: { efficiency: 97, accuracy: 99, speed: 8, totalTasksCompleted: 650, successRate: 99.1 }, totalActionsToday: 45, discoveriesToday: 3 },
    { id: 'agent-3', name: 'Dev Genius', koreanName: '💻 개발 천재', role: 'developer', specialty: ['시스템 설계', '코드 개발', '최적화'], avatar: '💻', status: 'developing', performance: { efficiency: 95, accuracy: 97, speed: 10, totalTasksCompleted: 890, successRate: 98.8 }, totalActionsToday: 68, discoveriesToday: 2 },
    { id: 'agent-4', name: 'Innovator X', koreanName: '💡 이노베이터 X', role: 'innovator', specialty: ['혁신 아이디어', '창의적 솔루션', '미래 예측'], avatar: '💡', status: 'working', performance: { efficiency: 92, accuracy: 90, speed: 6, totalTasksCompleted: 420, successRate: 94.5 }, totalActionsToday: 35, discoveriesToday: 15 },
    { id: 'agent-5', name: 'Market Eye', koreanName: '📊 마켓 아이', role: 'market_intelligence', specialty: ['시장 분석', '경쟁사 모니터링', '소비자 인사이트'], avatar: '📊', status: 'collecting', performance: { efficiency: 93, accuracy: 94, speed: 14, totalTasksCompleted: 1100, successRate: 96.7 }, totalActionsToday: 95, discoveriesToday: 6 },
    { id: 'agent-6', name: 'Legal Guardian', koreanName: '⚖️ 법률 수호자', role: 'compliance', specialty: ['저작권 검토', '라이선스 분석', '리스크 관리'], avatar: '⚖️', status: 'analyzing', performance: { efficiency: 99, accuracy: 100, speed: 5, totalTasksCompleted: 780, successRate: 100 }, totalActionsToday: 42, discoveriesToday: 0 },
    { id: 'agent-7', name: 'System Weaver', koreanName: '🔗 시스템 위버', role: 'integrator', specialty: ['시스템 통합', 'API 연동', '호환성'], avatar: '🔗', status: 'developing', performance: { efficiency: 96, accuracy: 98, speed: 9, totalTasksCompleted: 560, successRate: 99.2 }, totalActionsToday: 52, discoveriesToday: 1 },
    { id: 'agent-8', name: 'Quality Master', koreanName: '✅ 품질 마스터', role: 'quality_assurance', specialty: ['품질 검증', '테스트 자동화', '버그 탐지'], avatar: '✅', status: 'working', performance: { efficiency: 98, accuracy: 99, speed: 11, totalTasksCompleted: 920, successRate: 99.5 }, totalActionsToday: 78, discoveriesToday: 0 },
    { id: 'agent-9', name: 'Global Connector', koreanName: '🌍 글로벌 커넥터', role: 'global_expansion', specialty: ['글로벌 확장', '현지화', '파트너십'], avatar: '🌍', status: 'collaborating', performance: { efficiency: 91, accuracy: 93, speed: 7, totalTasksCompleted: 380, successRate: 95.8 }, totalActionsToday: 55, discoveriesToday: 5 }
];

const createTasks = (): AgentTask[] => [
    { id: 't-1', type: 'research_collection', priority: 'high', title: '최신 스마트팜 논문 수집 (Nature, Science)', assignedTo: ['agent-0'], status: 'in_progress', progress: 67 },
    { id: 't-2', type: 'technology_scan', priority: 'high', title: '글로벌 AgriTech 스타트업 스캔', assignedTo: ['agent-1'], status: 'in_progress', progress: 45 },
    { id: 't-3', type: 'patent_analysis', priority: 'critical', title: 'AI 관개 시스템 특허 회피 설계', assignedTo: ['agent-2'], status: 'in_progress', progress: 78 },
    { id: 't-4', type: 'system_development', priority: 'critical', title: '양자 센서 통합 모듈 개발', assignedTo: ['agent-3'], status: 'in_progress', progress: 52 },
    { id: 't-5', type: 'innovation_creation', priority: 'high', title: '식물 신경망 혁신 기능 개발', assignedTo: ['agent-4'], status: 'in_progress', progress: 34 },
    { id: 't-6', type: 'market_analysis', priority: 'medium', title: '글로벌 스마트팜 시장 트렌드 분석', assignedTo: ['agent-5'], status: 'in_progress', progress: 89 },
    { id: 't-7', type: 'legal_review', priority: 'high', title: '오픈소스 기술 라이선스 검토', assignedTo: ['agent-6'], status: 'in_progress', progress: 91 }
];

const createDiscoveries = (): Discovery[] => [
    { id: 'd-1', type: 'research_paper', title: 'MIT - 광합성 효율 50% 향상 나노 입자', country: 'USA', relevanceScore: 95, innovationScore: 92, implemented: false, legalCleared: true },
    { id: 'd-2', type: 'technology', title: 'Wageningen - 수직농장 AI 제어', country: 'Netherlands', relevanceScore: 88, innovationScore: 85, implemented: true, legalCleared: true },
    { id: 'd-3', type: 'patent', title: 'Netafim - 드립 관개 최적화', country: 'Israel', relevanceScore: 82, innovationScore: 78, implemented: false, legalCleared: false },
    { id: 'd-4', type: 'startup', title: 'PlantX - 식물 감정 센서', country: 'Japan', relevanceScore: 90, innovationScore: 88, implemented: true, legalCleared: true },
    { id: 'd-5', type: 'open_source', title: 'OpenAg - 기후 제어 알고리즘', country: 'USA', relevanceScore: 85, innovationScore: 80, implemented: true, legalCleared: true }
];

const ROLE_COLORS: Record<string, string> = {
    research: 'from-blue-500 to-cyan-500',
    technology_scout: 'from-purple-500 to-pink-500',
    patent_analyst: 'from-amber-500 to-orange-500',
    developer: 'from-green-500 to-emerald-500',
    innovator: 'from-yellow-500 to-amber-500',
    market_intelligence: 'from-indigo-500 to-blue-500',
    compliance: 'from-red-500 to-rose-500',
    integrator: 'from-cyan-500 to-teal-500',
    quality_assurance: 'from-emerald-500 to-green-500',
    global_expansion: 'from-violet-500 to-purple-500'
};

export default function SuperAgentPanel() {
    const [agents] = useState<SuperAgent[]>(createSuperAgents());
    const [tasks] = useState<AgentTask[]>(createTasks());
    const [discoveries] = useState<Discovery[]>(createDiscoveries());
    const [selectedAgent, setSelectedAgent] = useState<SuperAgent | null>(null);
    const [activeView, setActiveView] = useState<'agents' | 'tasks' | 'discoveries' | 'global'>('agents');
    const [uptime, setUptime] = useState(8760);
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(u => u + 1 / 3600);
            setPulse(p => p + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = { working: 'bg-green-500', analyzing: 'bg-blue-500', collecting: 'bg-purple-500', developing: 'bg-yellow-500', idle: 'bg-gray-500', resting: 'bg-gray-400', collaborating: 'bg-pink-500' };
        return colors[status] || 'bg-gray-500';
    };

    const totalActions = agents.reduce((sum, a) => sum + a.totalActionsToday, 0);
    const totalDiscoveries = agents.reduce((sum, a) => sum + a.discoveriesToday, 0);

    return (
        <div className="h-full glass rounded-xl p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div animate={{ rotate: pulse % 4 === 0 ? [0, 10, -10, 0] : 0 }} className="text-5xl">🤖</motion.div>
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">AI 슈퍼 에이전트 팀</h2>
                        <p className="text-white/60 text-sm">24/7 글로벌 스마트팜 기술 수집 · 연구 · 개발 · 법률 검토</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center"><div className="text-xs text-white/50">가동 시간</div><div className="text-xl font-bold text-green-400">{Math.floor(uptime).toLocaleString()}h</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">오늘 액션</div><div className="text-xl font-bold text-cyan-400">{totalActions}</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">오늘 발견</div><div className="text-xl font-bold text-purple-400">{totalDiscoveries}</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">법률 준수</div><div className="text-xl font-bold text-yellow-400">100%</div></div>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-full flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 font-bold">LIVE 24/7</span>
                    </motion.div>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
                {[{ id: 'agents' as const, label: '🤖 에이전트 10', count: 10 }, { id: 'tasks' as const, label: '📋 진행 작업', count: tasks.length }, { id: 'discoveries' as const, label: '🔍 발견', count: discoveries.length }, { id: 'global' as const, label: '🌍 글로벌 네트워크', count: 35 }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeView === tab.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        {tab.label} <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeView === 'agents' && (
                        <motion.div key="agents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-5 gap-3 overflow-y-auto">
                            {agents.map((agent, i) => (
                                <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03, y: -5 }} onClick={() => setSelectedAgent(agent)} className={`bg-gradient-to-br ${ROLE_COLORS[agent.role]} p-[1px] rounded-xl cursor-pointer`}>
                                    <div className="h-full bg-[#0a0a0a] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-4xl">{agent.avatar}</div>
                                            <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(agent.status)} text-white`}>{agent.status}</div>
                                        </div>
                                        <div className="font-bold text-white mb-1">{agent.koreanName}</div>
                                        <div className="text-xs text-white/50 mb-3">{agent.specialty.join(' · ')}</div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-green-400 font-bold">{agent.performance.efficiency.toFixed(0)}%</div><div className="text-white/40">효율</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-blue-400 font-bold">{agent.performance.accuracy.toFixed(0)}%</div><div className="text-white/40">정확도</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-purple-400 font-bold">{agent.totalActionsToday}</div><div className="text-white/40">액션</div></div>
                                            <div className="bg-white/5 rounded p-2 text-center"><div className="text-yellow-400 font-bold">{agent.discoveriesToday}</div><div className="text-white/40">발견</div></div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-white/10 text-center">
                                            <div className="text-xs text-white/40">총 완료 작업</div>
                                            <div className="text-lg font-bold text-white">{agent.performance.totalTasksCompleted.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'tasks' && (
                        <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto space-y-3">
                            {tasks.map((task, i) => (
                                <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`bg-white/5 border rounded-xl p-4 ${task.priority === 'critical' ? 'border-red-500' : task.priority === 'high' ? 'border-orange-500' : 'border-white/10'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${task.priority === 'critical' ? 'bg-red-500/20 text-red-400' : task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>{task.priority}</span>
                                            <h3 className="font-bold text-white">{task.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {task.assignedTo.map(id => { const agent = agents.find(a => a.id === id); return agent ? <span key={id} className="text-2xl" title={agent.koreanName}>{agent.avatar}</span> : null; })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-purple-500 to-pink-500" /></div>
                                        <span className="text-white font-bold w-12 text-right">{task.progress}%</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'discoveries' && (
                        <motion.div key="discoveries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto space-y-3">
                            {discoveries.map((d, i) => (
                                <motion.div key={d.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{d.type === 'research_paper' ? '📄' : d.type === 'technology' ? '💡' : d.type === 'patent' ? '📜' : d.type === 'startup' ? '🚀' : '📦'}</span>
                                            <div><h3 className="font-bold text-white">{d.title}</h3><span className="text-xs text-white/50">🌍 {d.country}</span></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`px-3 py-1 rounded-full text-sm ${d.legalCleared ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{d.legalCleared ? '⚖️ 법률 ✓' : '⚖️ 검토중'}</div>
                                            <div className={`px-3 py-1 rounded-full text-sm ${d.implemented ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{d.implemented ? '✅ 적용됨' : '⏳ 대기중'}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                        <div><span className="text-white/50">관련성: </span><span className="text-cyan-400">{d.relevanceScore}%</span></div>
                                        <div><span className="text-white/50">혁신성: </span><span className="text-purple-400">{d.innovationScore}%</span></div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'global' && (
                        <motion.div key="global" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-2 gap-4 overflow-y-auto">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">🌍 활성 지역 네트워크</h3>
                                <div className="space-y-3">
                                    {[{ name: '북미', countries: 'USA, Canada, Mexico', sources: 250, flag: '🇺🇸' }, { name: '유럽', countries: 'Netherlands, Germany, UK, France', sources: 320, flag: '🇪🇺' }, { name: '아시아', countries: 'Japan, Korea, China, Singapore', sources: 280, flag: '🇯🇵' }, { name: '중동 & 아프리카', countries: 'Israel, UAE, South Africa', sources: 120, flag: '🇮🇱' }, { name: '남미', countries: 'Brazil, Chile, Argentina', sources: 85, flag: '🇧🇷' }].map((region, i) => (
                                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3"><span className="text-2xl">{region.flag}</span><div><div className="font-bold text-white">{region.name}</div><div className="text-xs text-white/50">{region.countries}</div></div></div>
                                            <div className="text-right"><div className="text-green-400 font-bold">{region.sources} 소스</div><div className="flex items-center gap-1 justify-end"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-xs text-green-400">24/7 활성</span></div></div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">📊 글로벌 통계</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[{ label: '모니터링 국가', value: '35', icon: '🌍', color: 'text-blue-400' }, { label: '데이터 소스', value: '1,055', icon: '📡', color: 'text-cyan-400' }, { label: '수집 기술', value: '1,250', icon: '💡', color: 'text-yellow-400' }, { label: '적용 기술', value: '485', icon: '✅', color: 'text-green-400' }, { label: '법률 준수율', value: '100%', icon: '⚖️', color: 'text-red-400' }, { label: '글로벌 커버리지', value: '78%', icon: '📈', color: 'text-purple-400' }].map((stat, i) => (
                                        <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors">
                                            <div className="text-3xl mb-2">{stat.icon}</div>
                                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                            <div className="text-xs text-white/50">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
