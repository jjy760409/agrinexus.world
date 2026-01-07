'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoillessSystem {
    id: string;
    name: string;
    koreanName: string;
    type: string;
    capacity: number;
    activeSlots: number;
    efficiency: number;
    waterUsage: number;
    nutrientEfficiency: number;
    growthBoost: number;
    status: string;
}

interface NutrientProfile {
    id: string;
    name: string;
    koreanName: string;
    cropType: string;
    growthStage: string;
    targetPH: { min: number; max: number };
    targetEC: { min: number; max: number };
}

interface WaterQuality {
    ph: number;
    ec: number;
    dissolvedOxygen: number;
    temperature: number;
    pathogenLevel: string;
}

const createSystems = (): SoillessSystem[] => [
    { id: 'sys-1', name: 'NFT Hydroponic', koreanName: '📏 NFT 수경재배', type: 'nutrient_film', capacity: 10000, activeSlots: 8500, efficiency: 96, waterUsage: 150, nutrientEfficiency: 98, growthBoost: 45, status: 'running' },
    { id: 'sys-2', name: 'Deep Water Culture', koreanName: '🌊 DWC 심수경', type: 'deep_water', capacity: 8000, activeSlots: 7200, efficiency: 94, waterUsage: 200, nutrientEfficiency: 96, growthBoost: 40, status: 'running' },
    { id: 'sys-3', name: 'Aeroponics Tower', koreanName: '💨 에어로포닉스 타워', type: 'aeroponics', capacity: 5000, activeSlots: 4800, efficiency: 98, waterUsage: 50, nutrientEfficiency: 99, growthBoost: 65, status: 'running' },
    { id: 'sys-4', name: 'Fogponics Chamber', koreanName: '🌫️ 포그포닉스 챔버', type: 'fogponics', capacity: 3000, activeSlots: 2800, efficiency: 99, waterUsage: 20, nutrientEfficiency: 99.5, growthBoost: 70, status: 'running' },
    { id: 'sys-5', name: 'Aquaponics Ecosystem', koreanName: '🐟 아쿠아포닉스 생태계', type: 'aquaponics', capacity: 4000, activeSlots: 3500, efficiency: 92, waterUsage: 100, nutrientEfficiency: 95, growthBoost: 35, status: 'running' },
    { id: 'sys-6', name: 'Ebb & Flow System', koreanName: '🔄 간헐식 재배', type: 'ebb_flow', capacity: 6000, activeSlots: 5200, efficiency: 90, waterUsage: 180, nutrientEfficiency: 94, growthBoost: 30, status: 'running' }
];

const createProfiles = (): NutrientProfile[] => [
    { id: 'prof-1', name: 'Lettuce Vegetative', koreanName: '상추 영양생장', cropType: '상추', growthStage: 'vegetative', targetPH: { min: 5.5, max: 6.2 }, targetEC: { min: 1.5, max: 2.0 } },
    { id: 'prof-2', name: 'Tomato Fruiting', koreanName: '토마토 결실기', cropType: '토마토', growthStage: 'fruiting', targetPH: { min: 5.8, max: 6.3 }, targetEC: { min: 2.5, max: 3.5 } },
    { id: 'prof-3', name: 'Strawberry Flowering', koreanName: '딸기 개화기', cropType: '딸기', growthStage: 'flowering', targetPH: { min: 5.5, max: 6.0 }, targetEC: { min: 1.8, max: 2.5 } },
    { id: 'prof-4', name: 'Basil Growth', koreanName: '바질 성장기', cropType: '바질', growthStage: 'vegetative', targetPH: { min: 5.5, max: 6.5 }, targetEC: { min: 1.0, max: 1.6 } }
];

const createWaterQuality = (): WaterQuality => ({
    ph: 5.8,
    ec: 2.4,
    dissolvedOxygen: 8.5,
    temperature: 22,
    pathogenLevel: 'safe'
});

const TYPE_COLORS: Record<string, string> = {
    nutrient_film: 'from-blue-500 to-cyan-500',
    deep_water: 'from-cyan-500 to-teal-500',
    aeroponics: 'from-purple-500 to-pink-500',
    fogponics: 'from-gray-400 to-gray-600',
    aquaponics: 'from-green-500 to-emerald-500',
    ebb_flow: 'from-orange-500 to-amber-500'
};

export default function SoillessPanel() {
    const [systems] = useState<SoillessSystem[]>(createSystems());
    const [profiles] = useState<NutrientProfile[]>(createProfiles());
    const [waterQuality, setWaterQuality] = useState<WaterQuality>(createWaterQuality());
    const [activeView, setActiveView] = useState<'systems' | 'nutrients' | 'water' | 'ai'>('systems');
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => p + 1);
            setWaterQuality(q => ({
                ...q,
                ph: 5.7 + Math.random() * 0.2,
                ec: 2.3 + Math.random() * 0.2,
                dissolvedOxygen: 8.3 + Math.random() * 0.4,
                temperature: 21.5 + Math.random() * 1
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const totalCapacity = systems.reduce((sum, s) => sum + s.capacity, 0);
    const totalActive = systems.reduce((sum, s) => sum + s.activeSlots, 0);
    const avgEfficiency = systems.reduce((sum, s) => sum + s.efficiency, 0) / systems.length;
    const avgWaterUsage = systems.reduce((sum, s) => sum + s.waterUsage, 0);

    return (
        <div className="h-full glass rounded-xl p-4 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div animate={{ y: pulse % 3 === 0 ? [0, -5, 0] : 0 }} className="text-5xl">🌿</motion.div>
                    <div>
                        <h2 className="text-2xl font-bold gradient-text">무토양 스마트팜 시스템</h2>
                        <p className="text-white/60 text-sm">수경 · 분무 · 아쿠아포닉스 · 포그포닉스 통합 관리</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center"><div className="text-xs text-white/50">총 용량</div><div className="text-xl font-bold text-blue-400">{(totalCapacity / 1000).toFixed(0)}K</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">활성 슬롯</div><div className="text-xl font-bold text-green-400">{(totalActive / 1000).toFixed(1)}K</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">평균 효율</div><div className="text-xl font-bold text-purple-400">{avgEfficiency.toFixed(1)}%</div></div>
                    <div className="text-center"><div className="text-xs text-white/50">물 사용</div><div className="text-xl font-bold text-cyan-400">{avgWaterUsage}L/일</div></div>
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="px-4 py-2 bg-green-500/20 border border-green-500 rounded-full flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-green-400 font-bold">98% 물 재활용</span>
                    </motion.div>
                </div>
            </div>

            {/* View Tabs */}
            <div className="flex gap-2 mb-4 flex-shrink-0">
                {[{ id: 'systems' as const, label: '💧 재배 시스템', count: systems.length }, { id: 'nutrients' as const, label: '🧪 양분 관리', count: profiles.length }, { id: 'water' as const, label: '🌊 수질 모니터링', count: null }, { id: 'ai' as const, label: '🧠 AI 최적화', count: null }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeView === tab.id ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        {tab.label} {tab.count !== null && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeView === 'systems' && (
                        <motion.div key="systems" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-3 gap-4 overflow-y-auto">
                            {systems.map((system, i) => (
                                <motion.div key={system.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.02 }} className={`bg-gradient-to-br ${TYPE_COLORS[system.type]} p-[2px] rounded-xl`}>
                                    <div className="h-full bg-[#0a0a0a] rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-bold text-white">{system.koreanName}</h3>
                                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{system.status}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-cyan-400 font-bold">{system.activeSlots.toLocaleString()}</div><div className="text-xs text-white/50">활성 슬롯</div></div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-blue-400 font-bold">{system.efficiency}%</div><div className="text-xs text-white/50">효율</div></div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-purple-400 font-bold">{system.nutrientEfficiency}%</div><div className="text-xs text-white/50">양분 효율</div></div>
                                            <div className="bg-white/5 rounded-lg p-2 text-center"><div className="text-green-400 font-bold">+{system.growthBoost}%</div><div className="text-xs text-white/50">성장 부스트</div></div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/50">물 사용량</span>
                                            <span className="text-cyan-400">{system.waterUsage}L/일</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeView === 'nutrients' && (
                        <motion.div key="nutrients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {[{ element: 'N', value: 200, color: 'bg-green-500' }, { element: 'P', value: 60, color: 'bg-purple-500' }, { element: 'K', value: 250, color: 'bg-blue-500' }, { element: 'Ca', value: 200, color: 'bg-orange-500' }, { element: 'Mg', value: 50, color: 'bg-pink-500' }, { element: 'S', value: 60, color: 'bg-yellow-500' }].map((nutrient, i) => (
                                    <motion.div key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                        <div className={`w-12 h-12 ${nutrient.color} rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold text-white`}>{nutrient.element}</div>
                                        <div className="text-2xl font-bold text-white">{nutrient.value}</div>
                                        <div className="text-xs text-white/50">ppm</div>
                                    </motion.div>
                                ))}
                            </div>
                            <h3 className="text-lg font-bold text-white mt-4">작물별 양분 프로파일</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {profiles.map((profile, i) => (
                                    <motion.div key={profile.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/5 border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-white">{profile.koreanName}</h4>
                                            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{profile.growthStage}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div><span className="text-white/50">pH 범위: </span><span className="text-green-400">{profile.targetPH.min}-{profile.targetPH.max}</span></div>
                                            <div><span className="text-white/50">EC 범위: </span><span className="text-purple-400">{profile.targetEC.min}-{profile.targetEC.max}</span></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'water' && (
                        <motion.div key="water" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4">🌊 실시간 수질 모니터링</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'pH', value: waterQuality.ph.toFixed(2), target: '5.5-6.5', icon: '🧪', color: 'text-green-400' },
                                        { label: 'EC', value: `${waterQuality.ec.toFixed(2)} mS/cm`, target: '2.0-3.0', icon: '⚡', color: 'text-purple-400' },
                                        { label: '용존산소', value: `${waterQuality.dissolvedOxygen.toFixed(1)} mg/L`, target: '>6.0', icon: '💨', color: 'text-cyan-400' },
                                        { label: '수온', value: `${waterQuality.temperature.toFixed(1)}°C`, target: '18-24', icon: '🌡️', color: 'text-orange-400' }
                                    ].map((item, i) => (
                                        <motion.div key={i} animate={{ scale: pulse % 4 === i ? [1, 1.02, 1] : 1 }} className="bg-white/5 rounded-xl p-4 text-center">
                                            <div className="text-2xl mb-2">{item.icon}</div>
                                            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                                            <div className="text-xs text-white/50">{item.label}</div>
                                            <div className="text-xs text-white/30 mt-1">목표: {item.target}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4">🔄 수순환 시스템</h3>
                                <div className="space-y-4">
                                    {[
                                        { stage: '침전 필터', status: 'good', life: 85, icon: '🔽' },
                                        { stage: '활성탄 필터', status: 'good', life: 72, icon: '⚫' },
                                        { stage: '멤브레인 필터', status: 'good', life: 90, icon: '🔲' },
                                        { stage: 'UV 살균', status: 'active', life: 95, icon: '☀️' }
                                    ].map((filter, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="text-2xl">{filter.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-white">{filter.stage}</span>
                                                    <span className="text-green-400 text-sm">{filter.life}%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${filter.life}%` }} className="h-full bg-gradient-to-r from-green-500 to-emerald-500" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                                    <div className="text-green-400 font-bold text-lg">98% 물 재활용률</div>
                                    <div className="text-xs text-white/50">일일 절감량: 4,500L</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'ai' && (
                        <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl">🧠</span>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">HydroGenius AI</h3>
                                        <p className="text-xs text-white/50">초지능 무토양 최적화 엔진 v3.0</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {[
                                        { label: 'AI 정확도', value: '99.2%', color: 'text-green-400' },
                                        { label: '학습률', value: '0.15', color: 'text-blue-400' },
                                        { label: '데이터 포인트', value: '2.8M', color: 'text-purple-400' },
                                        { label: '최적화 횟수', value: '1,250', color: 'text-yellow-400' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                            <div className="text-xs text-white/50">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <h4 className="text-sm font-bold text-white mb-2">AI 기능</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['실시간 양분 최적화', '질병 예측', '수확량 예측', '에너지 최적화', '물 재활용 최적화'].map((cap, i) => (
                                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">✓ {cap}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4">📈 AI 예측 & 최적화</h3>
                                <div className="space-y-3">
                                    {[
                                        { type: '수확량 예측', target: '상추', prediction: '주당 2.5kg', confidence: 98, icon: '🥬' },
                                        { type: '질병 예측', target: 'DWC Zone', prediction: '피튬 위험 낮음', confidence: 99, icon: '🛡️' },
                                        { type: 'EC 최적화', target: '전체', prediction: '2.2→2.4 권장', confidence: 95, icon: '⚡' },
                                        { type: '물 절감', target: '분무재배', prediction: '13% 추가 절감 가능', confidence: 92, icon: '💧' }
                                    ].map((pred, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                                            <span className="text-2xl">{pred.icon}</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="text-white font-medium">{pred.type}</span>
                                                    <span className="text-green-400 text-sm">{pred.confidence}% 신뢰</span>
                                                </div>
                                                <div className="text-xs text-white/50">{pred.target}: {pred.prediction}</div>
                                            </div>
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
