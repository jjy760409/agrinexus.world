'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getQuantumBiosensingEngine,
    PlantQuantumState,
    PlantConsciousnessLevel,
    PlantCommunicationSignal,
    STRESS_COLORS
} from '@/lib/quantum/quantumBiosensing';
import {
    getNeuralPlantInterfaceEngine,
    PlantConversation,
    ConversationMessage,
    PLANT_EMOTION_ICONS,
    PLANT_EMOTION_COLORS
} from '@/lib/neural/neuralPlantInterface';

interface PlantConversationPanelProps {
    plantId?: string;
    cropType?: string;
}

export default function PlantConversationPanel({ plantId = 'plant-001', cropType = '딸기' }: PlantConversationPanelProps) {
    const [activeTab, setActiveTab] = useState<'conversation' | 'quantum' | 'signals'>('conversation');
    const [quantumState, setQuantumState] = useState<PlantQuantumState | null>(null);
    const [conversation, setConversation] = useState<PlantConversation | null>(null);
    const [userInput, setUserInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quantumEngine = useMemo(() => getQuantumBiosensingEngine(), []);
    const neuralEngine = useMemo(() => getNeuralPlantInterfaceEngine(), []);

    useEffect(() => {
        const connect = async () => {
            setIsLoading(true);
            await neuralEngine.connectToPlant(plantId);
            const state = quantumEngine.getPlantQuantumState(plantId, cropType);
            setQuantumState(state);
            setConversation(neuralEngine.getConversation(plantId) || null);
            setIsConnected(true);
            setIsLoading(false);
        };
        connect();
    }, [plantId, cropType, quantumEngine, neuralEngine]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    const sendMessage = async () => {
        if (!userInput.trim() || !isConnected) return;

        setIsLoading(true);
        const input = userInput;
        setUserInput('');

        await neuralEngine.speakToPlant(plantId, input);
        setConversation(neuralEngine.getConversation(plantId) || null);

        // 양자 상태 업데이트
        const state = quantumEngine.getPlantQuantumState(plantId, cropType);
        setQuantumState(state);

        setIsLoading(false);
    };

    const listenToPlant = async () => {
        if (!isConnected) return;
        setIsLoading(true);

        await neuralEngine.listenToPlant(plantId);
        setConversation(neuralEngine.getConversation(plantId) || null);

        setIsLoading(false);
    };

    const tabs = [
        { id: 'conversation' as const, label: '대화', icon: '💬' },
        { id: 'quantum' as const, label: '양자 상태', icon: '⚛️' },
        { id: 'signals' as const, label: '통신 신호', icon: '📡' },
    ];

    if (!isConnected && isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🌱</div>
                    <div className="text-xl font-bold mb-2">신경 인터페이스 연결 중...</div>
                    <div className="text-white/50">식물과의 연결을 설정하고 있습니다</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl">
                            🍓
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">식물과의 대화</h2>
                            <div className="text-sm text-white/50">
                                {cropType} • {plantId}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isConnected && (
                            <>
                                <div className="px-3 py-1 bg-green-500/20 rounded-lg text-sm flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    연결됨
                                </div>
                                {quantumState && (
                                    <div className="px-3 py-1 bg-purple-500/20 rounded-lg text-sm">
                                        건강: {quantumState.overallHealth.toFixed(0)}%
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* 탭 */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400'
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
                    {/* 대화 탭 */}
                    {activeTab === 'conversation' && conversation && (
                        <motion.div
                            key="conversation"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full flex flex-col"
                        >
                            {/* 관계 상태 */}
                            <div className="glass rounded-xl p-3 mb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-xs text-white/50">신뢰도</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-white/10 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-full rounded-full transition-all"
                                                        style={{ width: `${conversation.relationship.trustLevel}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm">{conversation.relationship.trustLevel}%</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/50">친밀도</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-white/10 rounded-full h-2">
                                                    <div
                                                        className="bg-pink-500 h-full rounded-full transition-all"
                                                        style={{ width: `${conversation.relationship.familiarity}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm">{conversation.relationship.familiarity}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white/50">총 대화</div>
                                        <div className="text-lg font-bold">{conversation.relationship.totalInteractions}회</div>
                                    </div>
                                </div>
                            </div>

                            {/* 메시지 영역 */}
                            <div className="flex-1 overflow-y-auto glass rounded-xl p-4 mb-3">
                                <div className="space-y-3">
                                    {conversation.messages.map((msg, i) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'human' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'human'
                                                    ? 'bg-blue-500/20 rounded-tr-none border border-blue-500/30'
                                                    : msg.sender === 'plant'
                                                        ? 'bg-green-500/20 rounded-tl-none border border-green-500/30'
                                                        : 'bg-white/5 border border-white/10 text-center'
                                                }`}>
                                                {msg.sender === 'plant' && msg.emotion && (
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            className="text-lg"
                                                            style={{ color: PLANT_EMOTION_COLORS[msg.emotion] }}
                                                        >
                                                            {PLANT_EMOTION_ICONS[msg.emotion]}
                                                        </span>
                                                        <span className="text-xs text-white/50">{msg.emotion}</span>
                                                    </div>
                                                )}
                                                <div className="text-sm">{msg.translatedMessage}</div>
                                                {msg.reaction && (
                                                    <div className="text-xs text-white/40 mt-1 italic">
                                                        ✨ {msg.reaction}
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-white/30 mt-1">
                                                    {new Date(msg.timestamp).toLocaleTimeString('ko-KR')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            {/* 입력 영역 */}
                            <div className="flex gap-2">
                                <button
                                    onClick={listenToPlant}
                                    disabled={isLoading}
                                    className="px-4 py-3 bg-green-500/20 rounded-xl hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                >
                                    👂 듣기
                                </button>
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="식물에게 말해보세요..."
                                    className="flex-1 px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-green-400 focus:outline-none"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !userInput.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    전송 🌿
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 양자 상태 탭 */}
                    {activeTab === 'quantum' && quantumState && (
                        <motion.div
                            key="quantum"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            {/* 의식 수준 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🧠</span> 식물 의식 분석
                                </h3>
                                <div className="grid grid-cols-5 gap-3">
                                    {[
                                        { label: '환경 인지', value: quantumState.consciousness.awarenessIndex, color: 'cyan' },
                                        { label: '반응 속도', value: Math.max(0, 100 - quantumState.consciousness.responseLatency / 5), color: 'green' },
                                        { label: '기억 형성', value: quantumState.consciousness.memoryFormation, color: 'purple' },
                                        { label: '의사 결정', value: quantumState.consciousness.decisionMaking, color: 'pink' },
                                        { label: '사회적 상호작용', value: quantumState.consciousness.socialInteraction, color: 'yellow' },
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className={`text-2xl font-bold text-${item.color}-400`}>
                                                {item.value.toFixed(0)}
                                            </div>
                                            <div className="text-xs text-white/50 mt-1">{item.label}</div>
                                            <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                                                <div
                                                    className={`bg-${item.color}-500 h-full rounded-full transition-all`}
                                                    style={{ width: `${item.value}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 광합성 양자 효율 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>☀️</span> 광합성 양자 분석
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-lg p-4 border border-yellow-500/30">
                                        <div className="text-xs text-white/50 mb-1">양자 효율</div>
                                        <div className="text-3xl font-bold text-yellow-400">
                                            {quantumState.photosynthesisEfficiency.efficiency.toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-xs text-white/50 mb-1">양자 결맞음</div>
                                        <div className="text-3xl font-bold text-purple-400">
                                            {(quantumState.photosynthesisEfficiency.quantumCoherence * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-xs text-white/50 mb-1">반응 중심 상태</div>
                                        <div className={`text-2xl font-bold ${quantumState.photosynthesisEfficiency.reactionCenterState === 'optimal' ? 'text-green-400' :
                                                quantumState.photosynthesisEfficiency.reactionCenterState === 'stressed' ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                            {quantumState.photosynthesisEfficiency.reactionCenterState === 'optimal' ? '최적' :
                                                quantumState.photosynthesisEfficiency.reactionCenterState === 'stressed' ? '스트레스' : '손상'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 양자 지문 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>🔬</span> 양자 지문
                                </h3>
                                <div className="bg-black/30 rounded-lg p-3 font-mono text-sm text-cyan-400">
                                    {quantumState.quantumSignature}
                                </div>
                            </div>

                            {/* 스트레스 상태 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>💚</span> 스트레스 분석
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                                        style={{
                                            backgroundColor: `${STRESS_COLORS[quantumState.stressResponse.type]}20`,
                                            borderColor: STRESS_COLORS[quantumState.stressResponse.type],
                                            borderWidth: 2
                                        }}
                                    >
                                        {quantumState.stressResponse.type === 'none' ? '😊' :
                                            quantumState.stressResponse.type === 'mild' ? '😐' :
                                                quantumState.stressResponse.type === 'moderate' ? '😟' :
                                                    quantumState.stressResponse.type === 'severe' ? '😰' : '😱'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-lg font-bold mb-2" style={{ color: STRESS_COLORS[quantumState.stressResponse.type] }}>
                                            {quantumState.stressResponse.type === 'none' ? '스트레스 없음' :
                                                quantumState.stressResponse.type === 'mild' ? '경미한 스트레스' :
                                                    quantumState.stressResponse.type === 'moderate' ? '중간 스트레스' :
                                                        quantumState.stressResponse.type === 'severe' ? '심각한 스트레스' : '위험'}
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <span className="text-white/50">적응력: </span>
                                                <span className="text-green-400">{(quantumState.stressResponse.adaptationLevel * 100).toFixed(0)}%</span>
                                            </div>
                                            <div>
                                                <span className="text-white/50">회복력: </span>
                                                <span className="text-cyan-400">{(quantumState.stressResponse.healingPotential * 100).toFixed(0)}%</span>
                                            </div>
                                            <div>
                                                <span className="text-white/50">양자 회복력: </span>
                                                <span className="text-purple-400">{(quantumState.stressResponse.quantumResilience * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 신호 탭 */}
                    {activeTab === 'signals' && quantumState && (
                        <motion.div
                            key="signals"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>📡</span> 식물 간 통신 신호
                                </h3>
                                <div className="space-y-3">
                                    {quantumState.communicationSignals.map((signal, i) => (
                                        <div key={i} className={`p-4 rounded-lg border ${signal.type === 'chemical' ? 'bg-purple-500/10 border-purple-500/30' :
                                                signal.type === 'electrical' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                                    signal.type === 'acoustic' ? 'bg-blue-500/10 border-blue-500/30' :
                                                        'bg-green-500/10 border-green-500/30'
                                            }`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">
                                                        {signal.type === 'chemical' ? '🧪' :
                                                            signal.type === 'electrical' ? '⚡' :
                                                                signal.type === 'acoustic' ? '🔊' : '📶'}
                                                    </span>
                                                    <span className="font-medium capitalize">{signal.type} 신호</span>
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {new Date(signal.timestamp).toLocaleTimeString('ko-KR')}
                                                </div>
                                            </div>
                                            <div className="bg-black/30 rounded p-3 mb-2">
                                                <div className="text-sm">{signal.message.content}</div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-white/50">
                                                <span>카테고리: {signal.message.category}</span>
                                                <span>강도: {(signal.intensity * 100).toFixed(0)}%</span>
                                                <span>범위: {signal.propagationRange}cm</span>
                                                {signal.recipients.length > 0 && (
                                                    <span>대상: {signal.recipients.join(', ')}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 미래 예측 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🔮</span> 양자 미래 예측 (7일)
                                </h3>
                                <div className="space-y-2">
                                    {quantumState.futureState.slice(0, 5).map((state, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                            <div className="w-20 text-sm text-white/50">
                                                {new Date(state.timestamp).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-white/10 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-full rounded-full"
                                                            style={{ width: `${state.healthScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-green-400">{state.healthScore.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-white/50">
                                                신뢰도: {(state.probability * 100).toFixed(0)}%
                                            </div>
                                            {state.interventionRecommended && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                                                    개입 권장
                                                </span>
                                            )}
                                        </div>
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
