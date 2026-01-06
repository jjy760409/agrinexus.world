'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DESIGN_PRESETS,
    EQUIPMENT_CATALOG,
    BuildingShape,
    RoofType,
    WallType,
    FloorType,
    GrowingSystem,
    AutomationLevel,
    EquipmentItem,
} from '@/lib/design/farmDesignSystem';

interface DesignCustomizerProps {
    onConfigChange?: (config: CustomConfig) => void;
}

interface CustomConfig {
    preset: string;
    building: {
        shape: BuildingShape;
        width: number;
        length: number;
        height: number;
        floors: number;
        roofType: RoofType;
        wallType: WallType;
        floorType: FloorType;
        transparency: number;
    };
    systems: {
        growing: GrowingSystem;
        lighting: string;
        hvac: string;
        automation: AutomationLevel;
    };
    equipment: string[];
    aiFeatures: string[];
}

const BUILDING_SHAPES: { value: BuildingShape; label: string; icon: string }[] = [
    { value: 'rectangular', label: '직사각형', icon: '▬' },
    { value: 'l_shaped', label: 'L자형', icon: '⌐' },
    { value: 'u_shaped', label: 'U자형', icon: '⊔' },
    { value: 'circular', label: '원형', icon: '○' },
    { value: 'hexagonal', label: '육각형', icon: '⬡' },
    { value: 'custom', label: '커스텀', icon: '✏️' },
];

const ROOF_TYPES: { value: RoofType; label: string; icon: string }[] = [
    { value: 'flat', label: '평지붕', icon: '═' },
    { value: 'gable', label: '박공지붕', icon: '⌂' },
    { value: 'arched', label: '아치형', icon: '⌒' },
    { value: 'greenhouse', label: '온실형', icon: '△' },
    { value: 'retractable', label: '개폐형', icon: '↕️' },
    { value: 'solar_integrated', label: '태양광 통합', icon: '☀️' },
];

const WALL_TYPES: { value: WallType; label: string; desc: string }[] = [
    { value: 'glass', label: '유리', desc: '최대 투명도' },
    { value: 'insulated_panel', label: '단열 패널', desc: '에너지 효율' },
    { value: 'polycarbonate', label: '폴리카보네이트', desc: '가벼움/내구성' },
    { value: 'hybrid', label: '하이브리드', desc: '유리+패널' },
    { value: 'smart_glass', label: '스마트 유리', desc: '자동 투명도' },
    { value: 'transparent_led', label: '투명 LED', desc: 'LED 통합' },
];

const FLOOR_TYPES: { value: FloorType; label: string }[] = [
    { value: 'epoxy', label: '에폭시' },
    { value: 'concrete', label: '콘크리트' },
    { value: 'raised_floor', label: '이중 바닥' },
    { value: 'drainage', label: '배수형' },
    { value: 'heated', label: '바닥 난방' },
    { value: 'modular', label: '모듈형' },
];

const GROWING_SYSTEMS: { value: GrowingSystem; label: string; icon: string }[] = [
    { value: 'nft', label: 'NFT', icon: '🌊' },
    { value: 'dwc', label: 'DWC', icon: '💧' },
    { value: 'aeroponics', label: '에어로포닉스', icon: '💨' },
    { value: 'vertical_tower', label: '수직 타워', icon: '🗼' },
    { value: 'moving_gutter', label: '무빙 거터', icon: '🔄' },
    { value: 'a_frame', label: 'A프레임', icon: '🔺' },
    { value: 'rotating_drum', label: '회전 드럼', icon: '🥁' },
];

const AI_FEATURES = [
    { id: 'growth_prediction', label: '성장 예측 AI', icon: '📈' },
    { id: 'disease_detection', label: '병해충 감지 AI', icon: '🔬' },
    { id: 'harvest_optimization', label: '수확 최적화 AI', icon: '✂️' },
    { id: 'energy_management', label: '에너지 관리 AI', icon: '⚡' },
    { id: 'climate_control', label: '기후 제어 AI', icon: '🌡️' },
    { id: 'market_pricing', label: '시장 가격 AI', icon: '💰' },
    { id: 'supply_chain', label: '공급망 AI', icon: '🚚' },
    { id: 'digital_twin', label: '디지털 트윈', icon: '🌐' },
    { id: 'autonomous_control', label: '완전 자율 제어', icon: '🤖' },
];

export default function DesignCustomizer({ onConfigChange }: DesignCustomizerProps) {
    const [activeTab, setActiveTab] = useState<'preset' | 'building' | 'systems' | 'equipment' | 'ai'>('preset');
    const [selectedPreset, setSelectedPreset] = useState('professional');
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [selectedAI, setSelectedAI] = useState<string[]>(['growth_prediction', 'climate_control', 'digital_twin']);
    const [expandedCategory, setExpandedCategory] = useState<string | null>('growing');

    const [buildingConfig, setBuildingConfig] = useState({
        shape: 'rectangular' as BuildingShape,
        width: 20,
        length: 40,
        height: 5,
        floors: 2,
        roofType: 'greenhouse' as RoofType,
        wallType: 'glass' as WallType,
        floorType: 'raised_floor' as FloorType,
        transparency: 80,
    });

    const [systemConfig, setSystemConfig] = useState({
        growing: 'nft' as GrowingSystem,
        lighting: 'ai_adaptive',
        hvac: 'vrf',
        automation: 'ai_autonomous' as AutomationLevel,
    });

    // 예상 비용 계산
    const estimates = useMemo(() => {
        const area = buildingConfig.width * buildingConfig.length * buildingConfig.floors;
        const equipmentCost = selectedEquipment.reduce((sum, id) => {
            const item = EQUIPMENT_CATALOG.flatMap(c => c.items).find(i => i.id === id);
            return sum + (item?.price || 0);
        }, 0);

        return {
            area,
            constructionCost: area * 2000,
            equipmentCost,
            totalCost: area * 2000 + equipmentCost,
            annualYield: area * 40,
            annualRevenue: area * 40 * 8,
        };
    }, [buildingConfig, selectedEquipment]);

    const toggleEquipment = (id: string) => {
        setSelectedEquipment(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const toggleAI = (id: string) => {
        setSelectedAI(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const tabs = [
        { id: 'preset', label: '프리셋', icon: '📋' },
        { id: 'building', label: '건물 구조', icon: '🏗️' },
        { id: 'systems', label: '재배 시스템', icon: '🌱' },
        { id: 'equipment', label: '설비 장비', icon: '⚙️' },
        { id: 'ai', label: 'AI 자동화', icon: '🤖' },
    ];

    return (
        <div className="h-full flex flex-col bg-[var(--bg-dark)]/50 rounded-xl border border-white/10 overflow-hidden">
            {/* 헤더 */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[var(--primary-cyan)]/10 to-[var(--primary-purple)]/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                            🏗️ 3D 스마트팜 설계
                        </h2>
                        <p className="text-xs text-white/50">건축 설계 수준의 완전 커스터마이징</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-white/40">예상 총 비용</div>
                        <div className="text-lg font-bold text-[var(--primary-green)]">
                            ${estimates.totalCost.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 min-w-[100px] px-3 py-2 text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)] border-b-2 border-[var(--primary-cyan)]'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span className="mr-1">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto p-4">
                <AnimatePresence mode="wait">
                    {/* 프리셋 탭 */}
                    {activeTab === 'preset' && (
                        <motion.div
                            key="preset"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <h3 className="text-sm font-medium text-white/60 mb-3">빠른 시작 템플릿</h3>
                            {Object.entries(DESIGN_PRESETS).map(([key, preset]) => (
                                <motion.button
                                    key={key}
                                    onClick={() => setSelectedPreset(key)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all ${selectedPreset === key
                                            ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                        }`}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold">{preset.projectName}</div>
                                            <div className="text-xs text-white/50 mt-1">
                                                {preset.building?.dimensions?.width}m × {preset.building?.dimensions?.length}m × {preset.building?.dimensions?.floors}층
                                            </div>
                                        </div>
                                        {selectedPreset === key && (
                                            <span className="text-[var(--primary-cyan)]">✓</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">{preset.building?.roof?.type}</span>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">{preset.building?.walls?.type}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* 건물 구조 탭 */}
                    {activeTab === 'building' && (
                        <motion.div
                            key="building"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* 건물 형태 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">건물 형태</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {BUILDING_SHAPES.map(shape => (
                                        <button
                                            key={shape.value}
                                            onClick={() => setBuildingConfig(prev => ({ ...prev, shape: shape.value }))}
                                            className={`p-3 rounded-lg border text-center transition-all ${buildingConfig.shape === shape.value
                                                    ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="text-2xl">{shape.icon}</div>
                                            <div className="text-xs mt-1">{shape.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 크기 설정 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">크기 설정</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-white/40">가로 (m)</label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            value={buildingConfig.width}
                                            onChange={e => setBuildingConfig(prev => ({ ...prev, width: +e.target.value }))}
                                            className="w-full accent-[var(--primary-cyan)]"
                                        />
                                        <div className="text-center text-sm font-bold">{buildingConfig.width}m</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40">세로 (m)</label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="150"
                                            value={buildingConfig.length}
                                            onChange={e => setBuildingConfig(prev => ({ ...prev, length: +e.target.value }))}
                                            className="w-full accent-[var(--primary-cyan)]"
                                        />
                                        <div className="text-center text-sm font-bold">{buildingConfig.length}m</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40">높이 (m)</label>
                                        <input
                                            type="range"
                                            min="3"
                                            max="15"
                                            value={buildingConfig.height}
                                            onChange={e => setBuildingConfig(prev => ({ ...prev, height: +e.target.value }))}
                                            className="w-full accent-[var(--primary-cyan)]"
                                        />
                                        <div className="text-center text-sm font-bold">{buildingConfig.height}m</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/40">층수</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={buildingConfig.floors}
                                            onChange={e => setBuildingConfig(prev => ({ ...prev, floors: +e.target.value }))}
                                            className="w-full accent-[var(--primary-cyan)]"
                                        />
                                        <div className="text-center text-sm font-bold">{buildingConfig.floors}층</div>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 rounded-lg bg-[var(--primary-green)]/10 text-center">
                                    <div className="text-xs text-white/40">총 재배 면적</div>
                                    <div className="text-xl font-bold text-[var(--primary-green)]">
                                        {(buildingConfig.width * buildingConfig.length * buildingConfig.floors).toLocaleString()} m²
                                    </div>
                                </div>
                            </div>

                            {/* 지붕 타입 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">지붕 타입</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {ROOF_TYPES.map(roof => (
                                        <button
                                            key={roof.value}
                                            onClick={() => setBuildingConfig(prev => ({ ...prev, roofType: roof.value }))}
                                            className={`p-2 rounded-lg border text-center transition-all ${buildingConfig.roofType === roof.value
                                                    ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="text-lg">{roof.icon}</div>
                                            <div className="text-xs">{roof.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 벽면 타입 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">벽면 재질</h3>
                                <div className="space-y-2">
                                    {WALL_TYPES.map(wall => (
                                        <button
                                            key={wall.value}
                                            onClick={() => setBuildingConfig(prev => ({ ...prev, wallType: wall.value }))}
                                            className={`w-full p-3 rounded-lg border text-left transition-all ${buildingConfig.wallType === wall.value
                                                    ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex justify-between">
                                                <span className="font-medium">{wall.label}</span>
                                                <span className="text-xs text-white/40">{wall.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 투명도 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">벽면 투명도</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={buildingConfig.transparency}
                                    onChange={e => setBuildingConfig(prev => ({ ...prev, transparency: +e.target.value }))}
                                    className="w-full accent-[var(--primary-cyan)]"
                                />
                                <div className="text-center text-sm">{buildingConfig.transparency}% 투명</div>
                            </div>

                            {/* 바닥 타입 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">바닥 타입</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {FLOOR_TYPES.map(floor => (
                                        <button
                                            key={floor.value}
                                            onClick={() => setBuildingConfig(prev => ({ ...prev, floorType: floor.value }))}
                                            className={`p-2 rounded-lg border text-center text-sm transition-all ${buildingConfig.floorType === floor.value
                                                    ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            {floor.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 재배 시스템 탭 */}
                    {activeTab === 'systems' && (
                        <motion.div
                            key="systems"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">재배 방식</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {GROWING_SYSTEMS.map(system => (
                                        <button
                                            key={system.value}
                                            onClick={() => setSystemConfig(prev => ({ ...prev, growing: system.value }))}
                                            className={`p-3 rounded-lg border text-left transition-all ${systemConfig.growing === system.value
                                                    ? 'bg-[var(--primary-green)]/20 border-[var(--primary-green)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{system.icon}</span>
                                                <span className="font-medium">{system.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 자동화 수준 */}
                            <div>
                                <h3 className="text-sm font-medium text-white/60 mb-3">자동화 수준</h3>
                                <div className="space-y-2">
                                    {[
                                        { value: 'manual', label: '수동', desc: '기본 제어', color: 'white' },
                                        { value: 'semi_auto', label: '반자동', desc: '부분 자동화', color: 'yellow' },
                                        { value: 'full_auto', label: '전자동', desc: '완전 자동화', color: 'cyan' },
                                        { value: 'ai_autonomous', label: 'AI 자율', desc: '초지능 자율 제어', color: 'green' },
                                    ].map(level => (
                                        <button
                                            key={level.value}
                                            onClick={() => setSystemConfig(prev => ({ ...prev, automation: level.value as AutomationLevel }))}
                                            className={`w-full p-3 rounded-lg border text-left transition-all ${systemConfig.automation === level.value
                                                    ? 'bg-[var(--primary-cyan)]/20 border-[var(--primary-cyan)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-medium">{level.label}</span>
                                                    <span className="text-xs text-white/40 ml-2">{level.desc}</span>
                                                </div>
                                                {systemConfig.automation === level.value && (
                                                    <span className="text-[var(--primary-cyan)]">✓</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 설비 장비 탭 */}
                    {activeTab === 'equipment' && (
                        <motion.div
                            key="equipment"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-white/60">장비 선택</h3>
                                <span className="text-xs text-[var(--primary-cyan)]">{selectedEquipment.length}개 선택</span>
                            </div>

                            {EQUIPMENT_CATALOG.map(category => (
                                <div key={category.id} className="border border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                                        className="w-full p-3 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{category.icon}</span>
                                            <span className="font-medium">{category.nameKo}</span>
                                            <span className="text-xs text-white/40">({category.items.length})</span>
                                        </div>
                                        <motion.span
                                            animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                                        >
                                            ▼
                                        </motion.span>
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === category.id && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-2 space-y-2">
                                                    {category.items.map(item => (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => toggleEquipment(item.id)}
                                                            className={`w-full p-3 rounded-lg border text-left transition-all ${selectedEquipment.includes(item.id)
                                                                    ? 'bg-[var(--primary-green)]/20 border-[var(--primary-green)]'
                                                                    : 'bg-white/5 border-white/10 hover:border-white/30'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="font-medium text-sm">{item.nameKo}</div>
                                                                    <div className="text-xs text-white/50">{item.description}</div>
                                                                    <div className="flex gap-1 mt-1 flex-wrap">
                                                                        {item.features.slice(0, 2).map((f, i) => (
                                                                            <span key={i} className="px-1.5 py-0.5 text-xs rounded bg-white/10">{f}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-bold text-[var(--primary-cyan)]">
                                                                        ${item.price.toLocaleString()}
                                                                    </div>
                                                                    <div className="text-xs text-white/40">{item.powerConsumption}W</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* AI 자동화 탭 */}
                    {activeTab === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="p-4 rounded-xl bg-gradient-to-r from-[var(--primary-purple)]/20 to-[var(--primary-cyan)]/20 border border-[var(--primary-purple)]/30">
                                <h3 className="font-bold text-lg gradient-text">🧠 초지능 AI 시스템</h3>
                                <p className="text-xs text-white/60 mt-1">
                                    전세계 유일 1인 AI 전자동화 플랫폼 - 독보적 기술력
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {AI_FEATURES.map(feature => (
                                    <button
                                        key={feature.id}
                                        onClick={() => toggleAI(feature.id)}
                                        className={`p-3 rounded-lg border text-left transition-all ${selectedAI.includes(feature.id)
                                                ? 'bg-[var(--primary-purple)]/20 border-[var(--primary-purple)]'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{feature.icon}</span>
                                            <span className="font-medium">{feature.label}</span>
                                            {selectedAI.includes(feature.id) && (
                                                <span className="ml-auto text-[var(--primary-purple)]">✓</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 rounded-xl bg-[var(--bg-dark)] border border-white/10">
                                <div className="text-xs text-white/40 mb-2">선택된 AI 시스템</div>
                                <div className="text-2xl font-bold text-[var(--primary-purple)]">
                                    {selectedAI.length} / {AI_FEATURES.length}
                                </div>
                                <div className="text-xs text-white/60 mt-1">
                                    자율 제어 수준: {Math.round((selectedAI.length / AI_FEATURES.length) * 100)}%
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 하단 요약 */}
            <div className="p-4 border-t border-white/10 bg-[var(--bg-dark)]/80">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                        <div className="text-white/40">면적</div>
                        <div className="font-bold text-[var(--primary-cyan)]">{estimates.area.toLocaleString()}m²</div>
                    </div>
                    <div>
                        <div className="text-white/40">장비</div>
                        <div className="font-bold text-[var(--primary-green)]">{selectedEquipment.length}개</div>
                    </div>
                    <div>
                        <div className="text-white/40">AI</div>
                        <div className="font-bold text-[var(--primary-purple)]">{selectedAI.length}개</div>
                    </div>
                    <div>
                        <div className="text-white/40">예상 수익</div>
                        <div className="font-bold text-[var(--status-success)]">${(estimates.annualRevenue / 1000).toFixed(0)}K/년</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
