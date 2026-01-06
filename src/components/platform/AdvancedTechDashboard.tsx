'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    generateAdvancedSystemsData,
    calculateTechnologyLevel,
    calculateGlobalCompetitiveness
} from '@/lib/systems/advancedTechnology';

export default function AdvancedTechDashboard() {
    const [activeSystem, setActiveSystem] = useState<string>('quantum');
    const [systems, setSystems] = useState(generateAdvancedSystemsData());
    const [techLevel, setTechLevel] = useState(0);
    const [competitiveness, setCompetitiveness] = useState(calculateGlobalCompetitiveness());
    const [isLive, setIsLive] = useState(true);

    useEffect(() => {
        setTechLevel(calculateTechnologyLevel(systems));

        if (isLive) {
            const interval = setInterval(() => {
                setSystems(generateAdvancedSystemsData());
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [systems, isLive]);

    const systemCards = [
        { id: 'quantum', icon: '⚛️', title: '양자 컴퓨팅', titleEn: 'Quantum Computing', color: 'purple' },
        { id: 'federated', icon: '🌐', title: '연합 학습', titleEn: 'Federated Learning', color: 'cyan' },
        { id: 'selfevolving', icon: '🧬', title: '자기 진화 AI', titleEn: 'Self-Evolving AI', color: 'green' },
        { id: 'ecosystem', icon: '🔮', title: '생태계 시뮬레이터', titleEn: 'Ecosystem Simulator', color: 'blue' },
        { id: 'globaldata', icon: '📡', title: '글로벌 데이터', titleEn: 'Global Data Network', color: 'orange' },
        { id: 'knowledge', icon: '🧠', title: '지식 그래프', titleEn: 'Knowledge Graph', color: 'pink' },
        { id: 'preemptive', icon: '🎯', title: '선제 학습', titleEn: 'Pre-emptive Learning', color: 'red' },
        { id: 'biosensing', icon: '🌿', title: '바이오 센싱', titleEn: 'Bio-Sensing', color: 'teal' },
        { id: 'climate', icon: '🌍', title: '기후 적응', titleEn: 'Climate Adaptation', color: 'yellow' },
    ];

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            purple: 'from-purple-500/20 to-purple-600/30 border-purple-500/50',
            cyan: 'from-cyan-500/20 to-cyan-600/30 border-cyan-500/50',
            green: 'from-green-500/20 to-green-600/30 border-green-500/50',
            blue: 'from-blue-500/20 to-blue-600/30 border-blue-500/50',
            orange: 'from-orange-500/20 to-orange-600/30 border-orange-500/50',
            pink: 'from-pink-500/20 to-pink-600/30 border-pink-500/50',
            red: 'from-red-500/20 to-red-600/30 border-red-500/50',
            teal: 'from-teal-500/20 to-teal-600/30 border-teal-500/50',
            yellow: 'from-yellow-500/20 to-yellow-600/30 border-yellow-500/50',
        };
        return colors[color] || colors.cyan;
    };

    return (
        <div className="space-y-6">
            {/* 헤더 - 기술 수준 & 경쟁력 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 전체 기술 수준 */}
                <motion.div
                    className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold">
                                🚀 <span className="gradient-text">첨단 기술 시스템</span>
                            </h2>
                            <p className="text-sm text-white/50">전세계 실내 스마트팜 시장 선점 기술</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                            <span className="text-xs text-white/50">{isLive ? 'LIVE' : 'PAUSED'}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 rounded-xl bg-white/5">
                            <div className="text-4xl font-bold gradient-text">{techLevel.toFixed(1)}%</div>
                            <div className="text-xs text-white/40">기술 수준</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5">
                            <div className="text-4xl font-bold text-[var(--primary-cyan)]">{systems.globalData.totalDataPoints.toLocaleString()}</div>
                            <div className="text-xs text-white/40">수집 데이터</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/5">
                            <div className="text-4xl font-bold text-[var(--primary-green)]">{systems.federated.participatingFarms}</div>
                            <div className="text-xs text-white/40">글로벌 팜 연동</div>
                        </div>
                    </div>
                </motion.div>

                {/* 글로벌 경쟁력 */}
                <motion.div
                    className="p-6 rounded-2xl bg-gradient-to-b from-green-900/30 to-cyan-900/30 border border-green-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-lg font-bold mb-3">🏆 글로벌 경쟁력</h3>
                    <div className="text-5xl font-bold text-center gradient-text mb-4">
                        {competitiveness.overall}%
                    </div>
                    <div className="space-y-2">
                        {Object.entries(competitiveness.categories).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-sm">
                                <span className="text-white/60">{key}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                                            style={{ width: `${value}%` }}
                                        />
                                    </div>
                                    <span className="text-white/80 w-8">{value}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 시스템 카드 그리드 */}
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
                {systemCards.map((card, index) => (
                    <motion.button
                        key={card.id}
                        onClick={() => setActiveSystem(card.id)}
                        className={`p-3 rounded-xl border backdrop-blur-sm transition-all ${activeSystem === card.id
                                ? `bg-gradient-to-b ${getColorClass(card.color)} scale-105`
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -2 }}
                    >
                        <div className="text-2xl mb-1">{card.icon}</div>
                        <div className="text-xs font-medium truncate">{card.title}</div>
                    </motion.button>
                ))}
            </div>

            {/* 상세 정보 패널 */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSystem}
                    className="p-6 rounded-2xl glass border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {activeSystem === 'quantum' && (
                        <QuantumPanel data={systems.quantum} />
                    )}
                    {activeSystem === 'federated' && (
                        <FederatedPanel data={systems.federated} />
                    )}
                    {activeSystem === 'selfevolving' && (
                        <SelfEvolvingPanel data={systems.selfEvolving} />
                    )}
                    {activeSystem === 'ecosystem' && (
                        <EcosystemPanel data={systems.ecosystem} />
                    )}
                    {activeSystem === 'globaldata' && (
                        <GlobalDataPanel data={systems.globalData} />
                    )}
                    {activeSystem === 'knowledge' && (
                        <KnowledgePanel data={systems.knowledgeGraph} />
                    )}
                    {activeSystem === 'preemptive' && (
                        <PreemptivePanel data={systems.preemptive} />
                    )}
                    {activeSystem === 'biosensing' && (
                        <BioSensingPanel data={systems.bioSensing} />
                    )}
                    {activeSystem === 'climate' && (
                        <ClimatePanel data={systems.climate} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// 양자 컴퓨팅 패널
function QuantumPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['quantum'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚛️</span>
                <div>
                    <h3 className="text-xl font-bold">양자 컴퓨팅 예측 엔진</h3>
                    <p className="text-sm text-white/50">Quantum Computing Prediction Engine</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-purple-400">{data.accuracy}%</div>
                    <div className="text-xs text-white/40">정확도</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-purple-400">{data.processingSpeed}</div>
                    <div className="text-xs text-white/40">처리 속도</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-purple-400">{data.type}</div>
                    <div className="text-xs text-white/40">타입</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                    <div className="text-2xl font-bold text-purple-400">4</div>
                    <div className="text-xs text-white/40">활성 기능</div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-2">🔧 활성화된 기능</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(data.capabilities).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-400' : 'bg-gray-500'}`} />
                            <span className="text-white/70">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 연합 학습 패널
function FederatedPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['federated'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌐</span>
                <div>
                    <h3 className="text-xl font-bold">글로벌 연합 학습 네트워크</h3>
                    <p className="text-sm text-white/50">개인정보 보호 분산 학습</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-cyan-500/10">
                    <div className="text-2xl font-bold text-cyan-400">{data.participatingFarms}</div>
                    <div className="text-xs text-white/40">참여 팜</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10">
                    <div className="text-2xl font-bold text-cyan-400">{data.globalAccuracy}%</div>
                    <div className="text-xs text-white/40">글로벌 정확도</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10">
                    <div className="text-2xl font-bold text-cyan-400">{data.learningRounds}</div>
                    <div className="text-xs text-white/40">학습 라운드</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10">
                    <div className="text-2xl font-bold text-cyan-400">{data.privacyLevel}</div>
                    <div className="text-xs text-white/40">프라이버시</div>
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-medium">📍 주요 참여 노드</h4>
                {data.localModels.map((model, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            <span>{model.region}</span>
                        </div>
                        <span className="text-sm text-white/60">{model.dataContribution.toLocaleString()} 데이터</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 자기 진화 AI 패널
function SelfEvolvingPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['selfEvolving'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧬</span>
                <div>
                    <h3 className="text-xl font-bold">자기 진화 AI 시스템</h3>
                    <p className="text-sm text-white/50">Self-Evolving AI - Generation {data.generation}</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-400">Gen {data.generation}</div>
                    <div className="text-xs text-white/40">세대</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-400">{data.fitnessScore}%</div>
                    <div className="text-xs text-white/40">적합도</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-400">{(data.learningRate * 1000).toFixed(1)}</div>
                    <div className="text-xs text-white/40">학습률 (×10⁻³)</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10">
                    <div className="text-2xl font-bold text-green-400">{data.currentCapabilities.length}</div>
                    <div className="text-xs text-white/40">능력</div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 mb-4">
                <h4 className="font-medium mb-2">🎯 다음 진화 목표</h4>
                <div className="text-[var(--primary-green)]">{data.nextEvolutionTarget}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {data.currentCapabilities.map((cap, i) => (
                    <div key={i} className="p-2 rounded-lg bg-green-500/10 text-sm flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-white/80">{cap}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 생태계 시뮬레이터 패널
function EcosystemPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['ecosystem'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🔮</span>
                <div>
                    <h3 className="text-xl font-bold">디지털 생태계 시뮬레이터</h3>
                    <p className="text-sm text-white/50">정확도 {data.accuracy}% - {data.simulationType} 방식</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">📊 예측 결과</h4>
                    {data.predictions.map((pred, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <div>
                                <span className="text-white/80">{pred.metric}</span>
                                <span className="text-xs text-white/40 ml-2">({pred.timeframe})</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-[var(--primary-cyan)]">{pred.predicted.toLocaleString()}</div>
                                <div className="text-xs text-white/40">신뢰도 {pred.confidence}%</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">🎲 시나리오</h4>
                    {data.scenarios.map((scenario, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/80">{scenario.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${scenario.impact === 'positive' ? 'bg-green-500/20 text-green-400' :
                                    scenario.impact === 'negative' ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-400'
                                }`}>
                                {(scenario.probability * 100).toFixed(0)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 글로벌 데이터 네트워크 패널
function GlobalDataPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['globalData'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">📡</span>
                <div>
                    <h3 className="text-xl font-bold">글로벌 데이터 수집 네트워크</h3>
                    <p className="text-sm text-white/50">{data.updateFrequency} 업데이트 - {data.nodes.length}개 노드</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-orange-500/10">
                    <div className="text-2xl font-bold text-orange-400">{(data.totalDataPoints / 1000000).toFixed(0)}M</div>
                    <div className="text-xs text-white/40">총 데이터</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10">
                    <div className="text-2xl font-bold text-orange-400">{data.dataSources.length}</div>
                    <div className="text-xs text-white/40">데이터 소스</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10">
                    <div className="text-2xl font-bold text-orange-400">{data.processingPipeline.ingestion}</div>
                    <div className="text-xs text-white/40">수집 방식</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10">
                    <div className="text-2xl font-bold text-orange-400">{data.processingPipeline.processing}</div>
                    <div className="text-xs text-white/40">처리 방식</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">📍 데이터 노드</h4>
                    {data.nodes.map((node, i) => (
                        <div key={i} className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${node.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                <span>{node.location.country} - {node.location.city}</span>
                            </div>
                            <span className="text-sm text-white/60">{(node.dataVolume / 1000000).toFixed(1)}M</span>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">📊 데이터 소스</h4>
                    {data.dataSources.map((source, i) => (
                        <div key={i} className="flex justify-between items-center py-2">
                            <span className="text-white/80">{source.name}</span>
                            <span className="text-xs text-white/40">{source.reliability}% 신뢰도</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 지식 그래프 패널
function KnowledgePanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['knowledgeGraph'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <div>
                    <h3 className="text-xl font-bold">스마트팜 지식 그래프</h3>
                    <p className="text-sm text-white/50">{data.totalFacts.toLocaleString()}개 팩트 - {data.inferenceEngine} 엔진</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-pink-500/10">
                    <div className="text-2xl font-bold text-pink-400">{(data.totalFacts / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-white/40">팩트 수</div>
                </div>
                <div className="p-3 rounded-lg bg-pink-500/10">
                    <div className="text-2xl font-bold text-pink-400">{data.domains.length}</div>
                    <div className="text-xs text-white/40">도메인</div>
                </div>
                <div className="p-3 rounded-lg bg-pink-500/10">
                    <div className="text-2xl font-bold text-pink-400">{data.inferenceEngine}</div>
                    <div className="text-xs text-white/40">추론 엔진</div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-2">📚 지식 도메인</h4>
                <div className="flex flex-wrap gap-2">
                    {data.domains.map((domain, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-pink-500/20 text-sm text-pink-300">
                            {domain}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 선제 학습 패널
function PreemptivePanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['preemptive'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎯</span>
                <div>
                    <h3 className="text-xl font-bold">선제 학습 시스템</h3>
                    <p className="text-sm text-white/50">미래 도전과 시장 트렌드 예측</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">📈 시장 트렌드</h4>
                    {data.marketTrends.map((trend, i) => (
                        <div key={i} className="py-2 border-b border-white/5 last:border-0">
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">{trend.trend}</span>
                                <span className={`text-sm ${trend.direction === 'growing' ? 'text-green-400' : 'text-red-400'}`}>
                                    {trend.direction === 'growing' ? '↑' : '↓'} {trend.magnitude}%
                                </span>
                            </div>
                            <div className="text-xs text-white/40">{trend.regions.join(', ')}</div>
                        </div>
                    ))}
                </div>

                <div className="p-4 rounded-lg bg-white/5">
                    <h4 className="font-medium mb-2">🛠️ 기술 레이더</h4>
                    {data.technologyRadar.map((tech, i) => (
                        <div key={i} className="py-2 border-b border-white/5 last:border-0">
                            <div className="flex justify-between items-center">
                                <span className="text-white/80">{tech.technology}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${tech.category === 'adopt' ? 'bg-green-500/20 text-green-400' :
                                        tech.category === 'trial' ? 'bg-blue-500/20 text-blue-400' :
                                            tech.category === 'assess' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {tech.category}
                                </span>
                            </div>
                            <div className="text-xs text-white/40">경쟁 우위: {tech.competitiveAdvantage}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 바이오 센싱 패널
function BioSensingPanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['bioSensing'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌿</span>
                <div>
                    <h3 className="text-xl font-bold">바이오 센싱 네트워크</h3>
                    <p className="text-sm text-white/50">식물 건강 지수: {data.plantHealthIndex}%</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-teal-500/10">
                    <div className="text-2xl font-bold text-teal-400">{data.sensors.length}</div>
                    <div className="text-xs text-white/40">센서</div>
                </div>
                <div className="p-3 rounded-lg bg-teal-500/10">
                    <div className="text-2xl font-bold text-teal-400">{data.plantHealthIndex}%</div>
                    <div className="text-xs text-white/40">건강 지수</div>
                </div>
                <div className="p-3 rounded-lg bg-teal-500/10">
                    <div className="text-2xl font-bold text-teal-400">{data.stressIndicators.length}</div>
                    <div className="text-xs text-white/40">스트레스</div>
                </div>
                <div className="p-3 rounded-lg bg-teal-500/10">
                    <div className="text-2xl font-bold text-teal-400">{data.diseaseRisk.length}</div>
                    <div className="text-xs text-white/40">질병 위험</div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-2">🧪 영양 상태</h4>
                <div className="grid grid-cols-3 gap-4">
                    {Object.entries(data.nutritionStatus).slice(0, 3).map(([key, value]) => (
                        <div key={key}>
                            <div className="text-xs text-white/40 mb-1 capitalize">{key}</div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-400 to-green-400"
                                    style={{ width: `${Math.min((value.level / value.optimal) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="text-xs text-right text-white/60">{value.level}/{value.optimal}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 기후 적응 패널
function ClimatePanel({ data }: { data: ReturnType<typeof generateAdvancedSystemsData>['climate'] }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🌍</span>
                <div>
                    <h3 className="text-xl font-bold">기후 변화 적응 시스템</h3>
                    <p className="text-sm text-white/50">{data.currentClimateZone} - 회복력 {data.resilenceScore}%</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                    <div className="text-2xl font-bold text-yellow-400">{data.resilenceScore}%</div>
                    <div className="text-xs text-white/40">회복력</div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                    <div className="text-2xl font-bold text-yellow-400">{data.carbonFootprint.netEmissions}</div>
                    <div className="text-xs text-white/40">순 배출량 (tCO2)</div>
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10">
                    <div className="text-2xl font-bold text-yellow-400">{data.carbonFootprint.reductionProgress}%</div>
                    <div className="text-xs text-white/40">감축 진행률</div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-2">🛡️ 적응 전략</h4>
                <div className="space-y-2">
                    {data.adaptationStrategies.map((strategy, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <span className="text-white/80">{strategy.strategy}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40">{strategy.implementationTime}</span>
                                <span className="text-green-400">{strategy.effectiveness}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
