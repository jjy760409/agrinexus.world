'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getSpaceAgricultureEngine,
    SpaceEnvironment,
    SpaceCrop,
    SpaceMission,
    SpaceLocation,
    SPACE_LOCATION_ICONS,
    SPACE_LOCATION_NAMES
} from '@/lib/space/spaceAgriculture';

export default function SpaceAgriculturePanel() {
    const [selectedLocation, setSelectedLocation] = useState<SpaceLocation>('mars_colony');
    const [environment, setEnvironment] = useState<SpaceEnvironment | null>(null);
    const [spaceCrops, setSpaceCrops] = useState<SpaceCrop[]>([]);
    const [selectedCrops, setSelectedCrops] = useState<string[]>(['space-lettuce', 'space-tomato']);
    const [mission, setMission] = useState<SpaceMission | null>(null);
    const [activeTab, setActiveTab] = useState<'environment' | 'crops' | 'mission'>('environment');

    const engine = useMemo(() => getSpaceAgricultureEngine(), []);

    useEffect(() => {
        setEnvironment(engine.getEnvironment(selectedLocation) || null);
        setSpaceCrops(engine.getAllSpaceCrops());
    }, [engine, selectedLocation]);

    const createMission = () => {
        const newMission = engine.createMission({
            name: `${SPACE_LOCATION_NAMES[selectedLocation]} 농업 미션`,
            destination: selectedLocation,
            duration: 365,
            crewSize: 6,
            farmArea: 50,
            selectedCrops
        });
        setMission(newMission);
        setActiveTab('mission');
    };

    const toggleCropSelection = (cropId: string) => {
        if (selectedCrops.includes(cropId)) {
            setSelectedCrops(selectedCrops.filter(id => id !== cropId));
        } else if (selectedCrops.length < 4) {
            setSelectedCrops([...selectedCrops, cropId]);
        }
    };

    const locations: SpaceLocation[] = ['iss', 'lunar_base', 'mars_colony', 'orbital_farm', 'deep_space'];

    const tabs = [
        { id: 'environment' as const, label: '환경', icon: '🌍' },
        { id: 'crops' as const, label: '우주작물', icon: '🌱' },
        { id: 'mission' as const, label: '미션', icon: '🚀' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🚀</span>
                            우주 농업 시뮬레이션
                        </h2>
                        <div className="text-sm text-white/50">
                            화성 · 달 · 우주정거장 농업 계획 및 시뮬레이션
                        </div>
                    </div>
                    <button
                        onClick={createMission}
                        disabled={selectedCrops.length === 0}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        🛸 미션 생성
                    </button>
                </div>

                {/* 위치 선택 */}
                <div className="flex gap-2 mb-4">
                    {locations.map(loc => (
                        <button
                            key={loc}
                            onClick={() => setSelectedLocation(loc)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${selectedLocation === loc
                                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span className="text-xl">{SPACE_LOCATION_ICONS[loc]}</span>
                            {SPACE_LOCATION_NAMES[loc]}
                        </button>
                    ))}
                </div>

                {/* 탭 */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400'
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
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* 환경 탭 */}
                    {activeTab === 'environment' && environment && (
                        <motion.div
                            key="environment"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 중력 & 방사선 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <span>⬇️</span> 중력
                                    </h3>
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-cyan-400">
                                            {environment.gravity.value.toFixed(3)}g
                                        </div>
                                        <div className="text-sm text-white/50">{environment.gravity.type}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="flex justify-between text-sm">
                                            <span>적응 필요:</span>
                                            <span className={environment.gravity.adaptationRequired ? 'text-yellow-400' : 'text-green-400'}>
                                                {environment.gravity.adaptationRequired ? '예' : '아니오'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <span>☢️</span> 방사선
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-white/60">우주 방사선:</span>
                                            <span className="text-yellow-400">{environment.radiation.cosmic} mSv/day</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">태양 방사선:</span>
                                            <span className="text-orange-400">{environment.radiation.solar} mSv/day</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">차폐율:</span>
                                            <span className="text-green-400">{environment.radiation.shielding}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">DNA 위험도:</span>
                                            <span className={environment.radiation.dnaRisk > 30 ? 'text-red-400' : 'text-green-400'}>
                                                {environment.radiation.dnaRisk}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 대기 조성 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>💨</span> 대기 환경
                                </h3>
                                <div className="grid grid-cols-5 gap-3">
                                    <div className="bg-white/5 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold">{environment.atmosphere.pressure}</div>
                                        <div className="text-xs text-white/50">기압 (kPa)</div>
                                    </div>
                                    <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/30">
                                        <div className="text-2xl font-bold text-green-400">{environment.atmosphere.composition.o2}%</div>
                                        <div className="text-xs text-white/50">O₂</div>
                                    </div>
                                    <div className="bg-blue-500/10 rounded-lg p-3 text-center border border-blue-500/30">
                                        <div className="text-2xl font-bold text-blue-400">{environment.atmosphere.composition.n2}%</div>
                                        <div className="text-xs text-white/50">N₂</div>
                                    </div>
                                    <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/30">
                                        <div className="text-2xl font-bold text-yellow-400">{environment.atmosphere.composition.co2}%</div>
                                        <div className="text-xs text-white/50">CO₂</div>
                                    </div>
                                    <div className="bg-cyan-500/10 rounded-lg p-3 text-center border border-cyan-500/30">
                                        <div className="text-2xl font-bold text-cyan-400">{environment.atmosphere.recyclingEfficiency}%</div>
                                        <div className="text-xs text-white/50">재활용율</div>
                                    </div>
                                </div>
                            </div>

                            {/* 자원 상태 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>📦</span> 자원 상태
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { label: '물', data: environment.resourceConstraints.water, icon: '💧', color: 'blue' },
                                        { label: '에너지', data: environment.resourceConstraints.energy, icon: '⚡', color: 'yellow' },
                                        { label: '영양분', data: environment.resourceConstraints.nutrients, icon: '🧪', color: 'green' },
                                        { label: '대기', data: environment.resourceConstraints.atmosphere, icon: '💨', color: 'cyan' },
                                    ].map(resource => (
                                        <div key={resource.label} className="flex items-center gap-3">
                                            <span className="text-xl w-8">{resource.icon}</span>
                                            <span className="w-16 text-sm">{resource.label}</span>
                                            <div className="flex-1 bg-white/10 rounded-full h-3">
                                                <div
                                                    className={`bg-${resource.color}-500 h-full rounded-full`}
                                                    style={{ width: `${Math.min(100, (resource.data.daysRemaining / 100) * 100)}%` }}
                                                />
                                            </div>
                                            <span className="w-20 text-right text-sm">
                                                {resource.data.daysRemaining}일
                                            </span>
                                            <span className="w-16 text-right text-xs text-white/50">
                                                ({resource.data.recycleRate}% 재활용)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 작물 탭 */}
                    {activeTab === 'crops' && (
                        <motion.div
                            key="crops"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <span>🌱</span> 우주 농업용 작물 (최대 4개 선택)
                                </h3>
                                <div className="text-sm text-white/50">
                                    선택됨: {selectedCrops.length}/4
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {spaceCrops.map(crop => {
                                    const compatibility = engine.analyzeCropCompatibility(crop.id, selectedLocation);
                                    const isSelected = selectedCrops.includes(crop.id);

                                    return (
                                        <div
                                            key={crop.id}
                                            onClick={() => toggleCropSelection(crop.id)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all ${isSelected
                                                    ? 'bg-green-500/20 border-2 border-green-400'
                                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-600/30 flex items-center justify-center text-2xl">
                                                        {crop.id.includes('lettuce') ? '🥬' :
                                                            crop.id.includes('tomato') ? '🍅' :
                                                                crop.id.includes('wheat') ? '🌾' :
                                                                    crop.id.includes('strawberry') ? '🍓' :
                                                                        crop.id.includes('spirulina') ? '🌊' : '🥔'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{crop.koreanName}</div>
                                                        <div className="text-xs text-white/50">{crop.name}</div>
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-1 rounded text-sm ${compatibility.compatible
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    적합도 {compatibility.score}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                                                <div className="bg-white/5 rounded p-2">
                                                    <div className="text-white/50">적응성</div>
                                                    <div className="font-bold">{crop.spaceAdaptability}</div>
                                                </div>
                                                <div className="bg-white/5 rounded p-2">
                                                    <div className="text-white/50">주기</div>
                                                    <div className="font-bold">{crop.growthCycle}일</div>
                                                </div>
                                                <div className="bg-white/5 rounded p-2">
                                                    <div className="text-white/50">칼로리</div>
                                                    <div className="font-bold">{crop.calorieDensity}</div>
                                                </div>
                                                <div className="bg-white/5 rounded p-2">
                                                    <div className="text-white/50">심리</div>
                                                    <div className="font-bold">{crop.psychologicalValue}</div>
                                                </div>
                                            </div>

                                            {!compatibility.compatible && compatibility.issues.length > 0 && (
                                                <div className="text-xs text-yellow-400 bg-yellow-500/10 rounded p-2">
                                                    ⚠️ {compatibility.issues[0]}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* 미션 탭 */}
                    {activeTab === 'mission' && mission && (
                        <motion.div
                            key="mission"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 미션 개요 */}
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-4xl">
                                        {SPACE_LOCATION_ICONS[mission.destination]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{mission.name}</h3>
                                        <div className="text-sm text-white/50">
                                            {mission.duration}일 미션 · 승무원 {mission.crewSize}명 · 농장 {mission.farmArea}m²
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                                        <div className="text-3xl font-bold text-green-400">
                                            {mission.calorieSelfSufficiency.toFixed(0)}%
                                        </div>
                                        <div className="text-xs text-white/50">칼로리 자급률</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold">
                                            {mission.dailyCalorieNeed.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-white/50">일일 필요 칼로리</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-cyan-400">
                                            {mission.crops.length}
                                        </div>
                                        <div className="text-xs text-white/50">재배 작물 수</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-3xl font-bold text-purple-400">
                                            {mission.timeline.phases.length}
                                        </div>
                                        <div className="text-xs text-white/50">미션 단계</div>
                                    </div>
                                </div>
                            </div>

                            {/* 위험 평가 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>⚠️</span> 위험 평가
                                </h3>
                                <div className="space-y-2">
                                    {mission.risks.map((risk, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                            <span className="text-xl">
                                                {risk.type === 'radiation' ? '☢️' :
                                                    risk.type === 'equipment' ? '🔧' :
                                                        risk.type === 'resource' ? '📦' :
                                                            risk.type === 'mutation' ? '🧬' : '👤'}
                                            </span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium capitalize">{risk.type}</span>
                                                    <span className={`text-sm ${risk.severity > 7 ? 'text-red-400' :
                                                            risk.severity > 4 ? 'text-yellow-400' : 'text-green-400'
                                                        }`}>
                                                        발생 확률: {(risk.probability * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="text-xs text-white/50 mt-1">
                                                    대응: {risk.mitigation}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 타임라인 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>📅</span> 미션 타임라인
                                </h3>
                                <div className="space-y-2">
                                    {mission.timeline.phases.map((phase, i) => (
                                        <div key={phase.id} className={`p-3 rounded-lg ${phase.status === 'active' ? 'bg-green-500/20 border border-green-500/30' :
                                                phase.status === 'completed' ? 'bg-white/5' :
                                                    'bg-white/5 opacity-60'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                                                        {i + 1}
                                                    </span>
                                                    <span className="font-medium">{phase.name}</span>
                                                </div>
                                                <span className="text-xs text-white/50">
                                                    Day {phase.startDay} - {phase.endDay}
                                                </span>
                                            </div>
                                            <div className="ml-8 mt-1 text-xs text-white/60">
                                                {phase.objectives.join(' · ')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'mission' && !mission && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="text-6xl mb-4">🛸</div>
                                <div className="text-xl font-bold mb-2">미션 생성 필요</div>
                                <div className="text-white/50">작물을 선택하고 "미션 생성" 버튼을 클릭하세요</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
