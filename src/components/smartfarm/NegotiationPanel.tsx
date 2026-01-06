'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getAINegotiationEngine,
    NegotiationSession,
    NegotiationStats,
    NEGOTIATION_STATUS_ICONS,
    ACTION_ICONS,
    NegotiationType,
    PartyType,
    RecommendedAction
} from '@/lib/ai/aiNegotiation';

export default function NegotiationPanel() {
    const [sessions, setSessions] = useState<NegotiationSession[]>([]);
    const [stats, setStats] = useState<NegotiationStats | null>(null);
    const [selectedSession, setSelectedSession] = useState<NegotiationSession | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'create' | 'ai'>('dashboard');
    const [isCreating, setIsCreating] = useState(false);

    const engine = useMemo(() => getAINegotiationEngine(), []);

    useEffect(() => {
        const updateData = () => {
            setSessions(engine.getAllSessions());
            setStats(engine.getNegotiationStats());
        };
        updateData();

        const interval = setInterval(updateData, 3000);
        return () => clearInterval(interval);
    }, [engine]);

    const createDemoSession = () => {
        setIsCreating(true);

        const session = engine.createSession({
            type: 'bulk_order',
            parties: [
                {
                    id: 'buyer-1',
                    name: '대형마트 A',
                    type: 'distributor',
                    role: 'buyer',
                    preferences: {
                        priceRange: { min: 4000, max: 5000 },
                        quantityRange: { min: 500, max: 1000 },
                        deliveryTimeframe: { earliest: new Date(), latest: new Date(Date.now() + 7 * 86400000) },
                        qualityRequirements: [{ metric: '당도', minValue: 12, unit: 'Brix', weight: 0.8 }],
                        paymentTerms: [{ type: 'net_30', percentage: 100 }],
                        priority: { price: 0.6, quality: 0.3, delivery: 0.07, relationship: 0.03 }
                    },
                    reputation: { overall: 85, reliability: 90, quality: 80, communication: 85, fairness: 80, totalTransactions: 150, successRate: 92 },
                    history: { totalTransactions: 150, totalVolume: 500000000, averageOrderValue: 3333333, successfulNegotiations: 138, averageDiscount: 7, preferredProducts: ['딸기', '토마토'], preferredPaymentTerms: ['net_30'] },
                    aiAssisted: true
                },
                {
                    id: 'seller-1',
                    name: 'AgriNexus 스마트팜',
                    type: 'farm',
                    role: 'seller',
                    preferences: {
                        priceRange: { min: 4500, max: 6000 },
                        quantityRange: { min: 100, max: 2000 },
                        deliveryTimeframe: { earliest: new Date(Date.now() + 2 * 86400000), latest: new Date(Date.now() + 14 * 86400000) },
                        qualityRequirements: [],
                        paymentTerms: [{ type: 'upfront', percentage: 30 }, { type: 'on_delivery', percentage: 70 }],
                        priority: { price: 0.5, quality: 0.2, delivery: 0.2, relationship: 0.1 }
                    },
                    reputation: { overall: 92, reliability: 95, quality: 94, communication: 90, fairness: 88, totalTransactions: 300, successRate: 96 },
                    history: { totalTransactions: 300, totalVolume: 1200000000, averageOrderValue: 4000000, successfulNegotiations: 288, averageDiscount: 5, preferredProducts: ['딸기', '상추'], preferredPaymentTerms: ['upfront'] },
                    aiAssisted: true
                }
            ],
            subject: {
                productId: 'strawberry-premium',
                productName: 'Premium Strawberry',
                productCategory: 'fruit',
                basePrice: 5500,
                marketPrice: 5200,
                quantity: 800,
                unit: 'kg',
                quality: 'premium',
                specifications: [
                    { name: '당도', value: 14, certified: true },
                    { name: '크기', value: 'L등급', certified: true }
                ],
                availability: {
                    stock: 2000,
                    harvestDate: new Date(),
                    expiryDate: new Date(Date.now() + 14 * 86400000),
                    leadTime: 2,
                    minOrder: 100,
                    maxOrder: 1500
                }
            }
        });

        engine.startNegotiation(session.id);

        setSessions(engine.getAllSessions());
        setStats(engine.getNegotiationStats());
        setSelectedSession(engine.getSession(session.id) || null);
        setIsCreating(false);
        setActiveTab('sessions');
    };

    const tabs = [
        { id: 'dashboard' as const, label: '대시보드', icon: '📊' },
        { id: 'sessions' as const, label: '협상 세션', icon: '💬' },
        { id: 'create' as const, label: '새 협상', icon: '➕' },
        { id: 'ai' as const, label: 'AI 에이전트', icon: '🤖' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'text-green-400';
            case 'active': case 'counter_offer': return 'text-blue-400';
            case 'pending': case 'review': return 'text-yellow-400';
            case 'rejected': case 'timeout': case 'cancelled': return 'text-red-400';
            default: return 'text-white/60';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🤖</span>
                            AI 자동 협상 시스템
                        </h2>
                        <div className="text-sm text-white/50">
                            적응형 전략 · 시장 인텔리전스 · 자동 계약
                        </div>
                    </div>

                    {stats && (
                        <div className="flex gap-4 text-sm">
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-green-400">{stats.successRate.toFixed(0)}%</div>
                                <div className="text-white/50">성공률</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-purple-400">{stats.averageSavings.toFixed(1)}%</div>
                                <div className="text-white/50">평균 절감</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-cyan-400">{stats.averageRounds.toFixed(1)}</div>
                                <div className="text-white/50">평균 라운드</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-pink-400">{stats.activeSessions}</div>
                                <div className="text-white/50">진행 중</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* 대시보드 */}
                    {activeTab === 'dashboard' && stats && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            {/* 주요 지표 */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="glass rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-white">{stats.totalSessions}</div>
                                    <div className="text-sm text-white/50">총 협상</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center bg-green-500/10 border border-green-500/30">
                                    <div className="text-4xl font-bold text-green-400">{stats.successRate.toFixed(0)}%</div>
                                    <div className="text-sm text-white/50">성공률</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center bg-purple-500/10 border border-purple-500/30">
                                    <div className="text-4xl font-bold text-purple-400">{stats.averageSavings.toFixed(1)}%</div>
                                    <div className="text-sm text-white/50">평균 절감</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-cyan-400">₩{(stats.totalValueNegotiated / 1000000).toFixed(0)}M</div>
                                    <div className="text-sm text-white/50">총 협상액</div>
                                </div>
                            </div>

                            {/* AI 에이전트 성능 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">🤖 AI 에이전트 성능</h3>
                                <div className="grid grid-cols-6 gap-4">
                                    {[
                                        { label: '주장성', value: 60, color: 'from-red-500 to-orange-500' },
                                        { label: '유연성', value: 70, color: 'from-blue-500 to-cyan-500' },
                                        { label: '위험 허용', value: 40, color: 'from-yellow-500 to-amber-500' },
                                        { label: '공감력', value: 70, color: 'from-pink-500 to-rose-500' },
                                        { label: '인내심', value: 80, color: 'from-purple-500 to-indigo-500' },
                                        { label: '학습', value: 85, color: 'from-green-500 to-emerald-500' },
                                    ].map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <div className="relative w-16 h-16 mx-auto mb-2">
                                                <svg className="w-16 h-16 transform -rotate-90">
                                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
                                                    <circle
                                                        cx="32" cy="32" r="28"
                                                        stroke="url(#gradient)"
                                                        strokeWidth="8"
                                                        fill="none"
                                                        strokeDasharray={`${stat.value * 1.76} 176`}
                                                        className="text-cyan-400"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                                                    {stat.value}%
                                                </div>
                                            </div>
                                            <div className="text-xs text-white/60">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 최근 협상 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📋 최근 협상</h3>
                                {sessions.length > 0 ? (
                                    <div className="space-y-2">
                                        {sessions.slice(0, 5).map(session => (
                                            <div
                                                key={session.id}
                                                onClick={() => { setSelectedSession(session); setActiveTab('sessions'); }}
                                                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{NEGOTIATION_STATUS_ICONS[session.status]}</span>
                                                    <div>
                                                        <div className="font-medium">{session.subject.productName}</div>
                                                        <div className="text-xs text-white/50">
                                                            {session.parties[0]?.name} ↔ {session.parties[1]?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={getStatusColor(session.status)}>{session.status}</div>
                                                    <div className="text-xs text-white/50">{session.rounds.length} 라운드</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/50">
                                        진행 중인 협상이 없습니다
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 세션 목록 */}
                    {activeTab === 'sessions' && (
                        <motion.div
                            key="sessions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex gap-4"
                        >
                            {/* 세션 목록 */}
                            <div className="w-1/3 glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-3">💬 협상 세션</h3>
                                <div className="space-y-2">
                                    {sessions.map(session => (
                                        <button
                                            key={session.id}
                                            onClick={() => setSelectedSession(session)}
                                            className={`w-full p-3 rounded-lg text-left transition-all ${selectedSession?.id === session.id
                                                    ? 'bg-indigo-500/30 border border-indigo-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span>{NEGOTIATION_STATUS_ICONS[session.status]} {session.type}</span>
                                                <span className={`text-xs ${getStatusColor(session.status)}`}>{session.status}</span>
                                            </div>
                                            <div className="text-xs text-white/50">{session.subject.productName}</div>
                                        </button>
                                    ))}
                                    {sessions.length === 0 && (
                                        <div className="text-center py-8 text-white/50">협상 없음</div>
                                    )}
                                </div>
                            </div>

                            {/* 세션 상세 */}
                            <div className="w-2/3 glass rounded-xl p-4 overflow-y-auto">
                                {selectedSession ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold">{selectedSession.subject.productName}</h3>
                                            <span className={`px-3 py-1 rounded-lg ${getStatusColor(selectedSession.status)} bg-white/10`}>
                                                {NEGOTIATION_STATUS_ICONS[selectedSession.status]} {selectedSession.status}
                                            </span>
                                        </div>

                                        {/* 당사자 */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedSession.parties.map(party => (
                                                <div key={party.id} className={`p-4 rounded-xl ${party.role === 'buyer' ? 'bg-blue-500/20 border border-blue-500' : 'bg-green-500/20 border border-green-500'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-bold">{party.name}</span>
                                                        <span className="text-sm">{party.role === 'buyer' ? '구매자' : '판매자'}</span>
                                                    </div>
                                                    <div className="text-sm space-y-1">
                                                        <div>평판: {party.reputation.overall}/100</div>
                                                        <div>거래 수: {party.history.totalTransactions}</div>
                                                        <div>성공률: {party.reputation.successRate}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 협상 라운드 */}
                                        <div className="space-y-2">
                                            <h4 className="font-bold">📍 협상 진행</h4>
                                            {selectedSession.rounds.map(round => (
                                                <div key={round.number} className="p-3 bg-white/5 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium">라운드 {round.number}</span>
                                                        <span className="text-xs text-white/50">
                                                            진행도: {round.analysis.progressScore.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {round.offers.map(offer => (
                                                            <div key={offer.id} className="flex justify-between text-sm">
                                                                <span>{offer.partyId}: ₩{offer.price.toLocaleString()}</span>
                                                                <span className="text-white/50">{offer.quantity}개</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {round.aiRecommendation && (
                                                        <div className="mt-2 p-2 bg-indigo-500/20 rounded text-sm">
                                                            <span className="text-indigo-400">AI 추천:</span>{' '}
                                                            {ACTION_ICONS[round.aiRecommendation.action]}{' '}
                                                            {round.aiRecommendation.action}
                                                            <span className="text-white/50 ml-2">
                                                                (신뢰도: {(round.aiRecommendation.confidence * 100).toFixed(0)}%)
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* 결과 */}
                                        {selectedSession.outcome && (
                                            <div className={`p-4 rounded-xl ${selectedSession.outcome.status === 'agreement'
                                                    ? 'bg-green-500/20 border border-green-500'
                                                    : 'bg-red-500/20 border border-red-500'
                                                }`}>
                                                <h4 className="font-bold mb-2">📝 협상 결과</h4>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>최종가: ₩{selectedSession.outcome.finalOffer?.price.toLocaleString()}</div>
                                                    <div>절감액: ₩{selectedSession.outcome.savings.toLocaleString()}</div>
                                                    <div>절감률: {selectedSession.outcome.savingsPercentage.toFixed(1)}%</div>
                                                    <div>계약: {selectedSession.outcome.contractGenerated ? '생성됨' : '미생성'}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/50">
                                        ← 왼쪽에서 세션을 선택하세요
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 새 협상 */}
                    {activeTab === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full glass rounded-xl p-6"
                        >
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🤝</div>
                                <h3 className="text-2xl font-bold mb-4">AI 자동 협상 시작</h3>
                                <p className="text-white/60 max-w-lg mx-auto mb-8">
                                    AI가 시장 분석, 상대방 성향 파악, 최적 전략 수립까지<br />
                                    모든 협상 과정을 자동으로 진행합니다.
                                </p>
                                <button
                                    onClick={createDemoSession}
                                    disabled={isCreating}
                                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50"
                                >
                                    {isCreating ? '생성 중...' : '🍓 딸기 대량 구매 협상 시작'}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* AI 에이전트 */}
                    {activeTab === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full glass rounded-xl p-6"
                        >
                            <h3 className="font-bold mb-4">🤖 AgriNexus AI Negotiator v2.0</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-4 bg-indigo-500/20 border border-indigo-500 rounded-xl">
                                    <h4 className="font-bold mb-3">협상 전략</h4>
                                    <div className="space-y-2">
                                        {[
                                            { name: '협력형', desc: '상생 추구', active: true },
                                            { name: '경쟁형', desc: '최대 이익', active: false },
                                            { name: '절충형', desc: '빠른 합의', active: false },
                                            { name: '적응형', desc: '상대 반응 적응', active: true },
                                        ].map(strategy => (
                                            <div key={strategy.name} className={`p-2 rounded ${strategy.active ? 'bg-indigo-500/30' : 'bg-white/5'}`}>
                                                <span className="font-medium">{strategy.name}</span>
                                                <span className="text-xs text-white/50 ml-2">{strategy.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-purple-500/20 border border-purple-500 rounded-xl">
                                    <h4 className="font-bold mb-3">성능 지표</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>총 협상 횟수</span>
                                            <span className="font-bold">1,500회</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>성공률</span>
                                            <span className="font-bold text-green-400">92%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>평균 절감</span>
                                            <span className="font-bold text-purple-400">8.5%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>만족도</span>
                                            <span className="font-bold text-cyan-400">88%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>학습 진행도</span>
                                            <span className="font-bold text-pink-400">85%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
