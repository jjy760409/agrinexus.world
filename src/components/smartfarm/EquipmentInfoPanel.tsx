'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    EQUIPMENT_DATABASE,
    getEquipmentById,
    getEquipmentByCategory,
    getEssentialEquipment,
    getCriticalEquipment,
    calculateTotalSetupCost,
    getEquipmentCategories,
    SmartFarmEquipment,
    EquipmentCategory
} from '@/lib/smartfarm/equipmentDatabase';

interface EquipmentInfoPanelProps {
    onEquipmentSelect?: (equipment: SmartFarmEquipment) => void;
    selectedEquipmentIds?: string[];
    farmArea?: number;
}

export default function EquipmentInfoPanel({
    onEquipmentSelect,
    selectedEquipmentIds = [],
    farmArea = 100
}: EquipmentInfoPanelProps) {
    const [activeCategory, setActiveCategory] = useState<EquipmentCategory | 'all' | 'essential'>('all');
    const [selectedEquipment, setSelectedEquipment] = useState<SmartFarmEquipment | null>(
        EQUIPMENT_DATABASE[0]
    );
    const [showCostCalculator, setShowCostCalculator] = useState(false);
    const [cartItems, setCartItems] = useState<string[]>([]);

    const categories = useMemo(() => getEquipmentCategories(), []);

    const filteredEquipment = useMemo(() => {
        if (activeCategory === 'all') return EQUIPMENT_DATABASE;
        if (activeCategory === 'essential') return getEssentialEquipment();
        return getEquipmentByCategory(activeCategory);
    }, [activeCategory]);

    const totalCost = useMemo(() =>
        calculateTotalSetupCost(cartItems),
        [cartItems]);

    const categoryIcons: Record<EquipmentCategory | 'all' | 'essential', string> = {
        all: '🏭',
        essential: '⭐',
        hvac: '❄️',
        lighting: '💡',
        irrigation: '🚿',
        nutrient: '🧪',
        control: '🎛️',
        sensor: '📡',
        electrical: '⚡',
        plumbing: '🔧',
        structure: '🏗️',
        robotics: '🤖',
        packaging: '📦',
        storage: '🗄️',
        monitoring: '📊',
        safety: '🛡️'
    };

    const priorityColors = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };

    const toggleCartItem = (id: string) => {
        setCartItems(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-3xl">⚙️</span>
                        스마트팜 설비 시스템
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCostCalculator(!showCostCalculator)}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${showCostCalculator ? 'bg-green-500' : 'bg-white/10'
                                } transition-colors`}
                        >
                            🧮 비용 계산기
                            {cartItems.length > 0 && (
                                <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all ${activeCategory === 'all'
                                ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border border-green-400'
                                : 'bg-white/5 border border-white/10 hover:border-white/30'
                            }`}
                    >
                        <span>{categoryIcons.all}</span>
                        <span>전체 ({EQUIPMENT_DATABASE.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveCategory('essential')}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all ${activeCategory === 'essential'
                                ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400'
                                : 'bg-white/5 border border-white/10 hover:border-white/30'
                            }`}
                    >
                        <span>{categoryIcons.essential}</span>
                        <span>필수 ({getEssentialEquipment().length})</span>
                    </button>
                    {categories.filter(c => c.count > 0).map(cat => (
                        <button
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all ${activeCategory === cat.category
                                    ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border border-green-400'
                                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                                }`}
                        >
                            <span>{categoryIcons[cat.category]}</span>
                            <span>{cat.koreanName} ({cat.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 비용 계산기 */}
            <AnimatePresence>
                {showCostCalculator && cartItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass rounded-xl p-4 mb-4"
                    >
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🧮</span> 설비 비용 계산 ({farmArea}m² 기준)
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-xs text-white/50">구매 비용</div>
                                <div className="text-xl font-bold text-cyan-400">
                                    ₩{(totalCost.totalPurchase / 100000000).toFixed(2)}억
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-xs text-white/50">설치 비용</div>
                                <div className="text-xl font-bold text-orange-400">
                                    ₩{(totalCost.totalInstallation / 10000000).toFixed(1)}천만
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="text-xs text-white/50">연간 운영비</div>
                                <div className="text-xl font-bold text-green-400">
                                    ₩{(totalCost.annualOperating / 10000000).toFixed(1)}천만
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {cartItems.map(id => {
                                const eq = getEquipmentById(id);
                                if (!eq) return null;
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5"
                                    >
                                        <span className="text-sm">{eq.koreanName}</span>
                                        <button
                                            onClick={() => toggleCartItem(id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* 장비 목록 */}
                <div className="w-80 glass rounded-xl p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {filteredEquipment.map(eq => (
                            <motion.div
                                key={eq.id}
                                onClick={() => {
                                    setSelectedEquipment(eq);
                                    onEquipmentSelect?.(eq);
                                }}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedEquipment?.id === eq.id
                                        ? 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/50'
                                        : 'bg-white/5 border border-white/10 hover:border-white/30'
                                    }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{categoryIcons[eq.category]}</span>
                                        <div>
                                            <div className="font-medium text-sm">{eq.koreanName}</div>
                                            <div className="text-xs text-white/50">{eq.name}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`text-xs px-2 py-0.5 rounded border ${priorityColors[eq.priority]}`}>
                                            {eq.priority === 'critical' ? '필수' :
                                                eq.priority === 'high' ? '중요' :
                                                    eq.priority === 'medium' ? '권장' : '선택'}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCartItem(eq.id);
                                            }}
                                            className={`text-xs px-2 py-0.5 rounded ${cartItems.includes(eq.id)
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-white/10 hover:bg-white/20'
                                                }`}
                                        >
                                            {cartItems.includes(eq.id) ? '✓ 추가됨' : '+ 추가'}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                                    <span>₩{(eq.costs.purchase.avg / 10000).toFixed(0)}만</span>
                                    <span>•</span>
                                    <span>{eq.specifications.lifespan}년</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 상세 정보 */}
                {selectedEquipment && (
                    <div className="flex-1 glass rounded-xl p-4 overflow-y-auto">
                        <div className="mb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{categoryIcons[selectedEquipment.category]}</span>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedEquipment.koreanName}</h3>
                                    <div className="text-sm text-white/60">{selectedEquipment.name}</div>
                                </div>
                                <span className={`ml-auto px-3 py-1 rounded-lg border ${priorityColors[selectedEquipment.priority]}`}>
                                    {selectedEquipment.priority === 'critical' ? '🔴 필수' :
                                        selectedEquipment.priority === 'high' ? '🟠 중요' :
                                            selectedEquipment.priority === 'medium' ? '🟡 권장' : '🟢 선택'}
                                </span>
                            </div>
                            <p className="text-sm text-white/70">{selectedEquipment.description}</p>
                        </div>

                        {/* 사양 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                            {selectedEquipment.specifications.power && (
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xs text-white/50">전력</div>
                                    <div className="text-lg font-bold text-yellow-400">
                                        {selectedEquipment.specifications.power.rating}{selectedEquipment.specifications.power.unit}
                                    </div>
                                </div>
                            )}
                            {selectedEquipment.specifications.capacity && (
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xs text-white/50">용량</div>
                                    <div className="text-lg font-bold text-cyan-400">
                                        {selectedEquipment.specifications.capacity.value}{selectedEquipment.specifications.capacity.unit}
                                    </div>
                                </div>
                            )}
                            {selectedEquipment.specifications.coverage && (
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xs text-white/50">커버리지</div>
                                    <div className="text-lg font-bold text-green-400">
                                        {selectedEquipment.specifications.coverage.area}{selectedEquipment.specifications.coverage.unit}
                                    </div>
                                </div>
                            )}
                            {selectedEquipment.specifications.lifespan && (
                                <div className="bg-white/5 rounded-lg p-3 text-center">
                                    <div className="text-xs text-white/50">수명</div>
                                    <div className="text-lg font-bold text-purple-400">
                                        {selectedEquipment.specifications.lifespan}년
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 비용 */}
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <h4 className="font-bold mb-3">💰 비용 정보</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-white/50 mb-2">구매 비용</div>
                                    <div className="text-lg font-bold text-cyan-400">
                                        ₩{(selectedEquipment.costs.purchase.avg / 10000).toLocaleString()}만
                                    </div>
                                    <div className="text-xs text-white/40">
                                        ({(selectedEquipment.costs.purchase.min / 10000).toLocaleString()}~
                                        {(selectedEquipment.costs.purchase.max / 10000).toLocaleString()}만)
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 mb-2">설치 비용</div>
                                    <div className="text-lg font-bold text-orange-400">
                                        ₩{(selectedEquipment.costs.installation / 10000).toLocaleString()}만
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-xs text-white/50 mb-2">연간 운영 비용</div>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                    <div className="bg-white/5 rounded p-2 text-center">
                                        <div className="text-white/50">에너지</div>
                                        <div className="font-bold">₩{(selectedEquipment.costs.annual.energy / 10000).toFixed(0)}만</div>
                                    </div>
                                    <div className="bg-white/5 rounded p-2 text-center">
                                        <div className="text-white/50">유지보수</div>
                                        <div className="font-bold">₩{(selectedEquipment.costs.annual.maintenance / 10000).toFixed(0)}만</div>
                                    </div>
                                    <div className="bg-white/5 rounded p-2 text-center">
                                        <div className="text-white/50">소모품</div>
                                        <div className="font-bold">₩{(selectedEquipment.costs.annual.consumables / 10000).toFixed(0)}만</div>
                                    </div>
                                    <div className="bg-green-500/10 rounded p-2 text-center border border-green-500/30">
                                        <div className="text-green-400">합계</div>
                                        <div className="font-bold text-green-400">₩{(selectedEquipment.costs.annual.total / 10000).toFixed(0)}만</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 기능 */}
                        {selectedEquipment.specifications.features && (
                            <div className="bg-white/5 rounded-lg p-4 mb-4">
                                <h4 className="font-bold mb-3">✨ 주요 기능</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEquipment.specifications.features.map((feature, i) => (
                                        <span key={i} className="px-3 py-1 bg-green-500/20 rounded-full text-sm">
                                            ✓ {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 설치 & 운영 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">🔧 설치 정보</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">소요 시간</span>
                                        <span>{selectedEquipment.installation.duration}</span>
                                    </div>
                                    <div>
                                        <div className="text-white/60 mb-1">요구 사항</div>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedEquipment.installation.requirements.map((req, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-white/60 mb-1">전문가</div>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedEquipment.installation.professionals.map((pro, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-cyan-500/20 rounded text-xs">
                                                    {pro}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">⚡ 운영 정보</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">자동화 레벨</span>
                                        <span className={`px-2 py-0.5 rounded ${selectedEquipment.operation.automationLevel === 'full-auto'
                                                ? 'bg-green-500/20 text-green-400'
                                                : selectedEquipment.operation.automationLevel === 'semi-auto'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {selectedEquipment.operation.automationLevel === 'full-auto' ? '전자동' :
                                                selectedEquipment.operation.automationLevel === 'semi-auto' ? '반자동' : '수동'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">가동 시간</span>
                                        <span>{selectedEquipment.operation.operatingHours}시간/일</span>
                                    </div>
                                    <div>
                                        <div className="text-white/60 mb-1">안전 기능</div>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedEquipment.operation.safetyFeatures.map((sf, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-red-500/20 rounded text-xs">
                                                    🛡️ {sf}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 유지보수 */}
                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                            <h4 className="font-bold mb-3">🔩 유지보수</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-white/50 mb-2">정기 점검</div>
                                    <div className="space-y-1">
                                        {selectedEquipment.maintenance.schedule.map((s, i) => (
                                            <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5">
                                                <span>{s.task}</span>
                                                <span className="text-white/60">{s.frequency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 mb-2">필요 부품</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedEquipment.maintenance.sparePartsRequired.map((part, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-orange-500/20 rounded text-xs">
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-sm">
                                        <span className="text-white/60">연간 비용: </span>
                                        <span className="font-bold text-orange-400">
                                            ₩{(selectedEquipment.maintenance.avgAnnualCost / 10000).toFixed(0)}만
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 연결성 */}
                        <div className="bg-white/5 rounded-lg p-4">
                            <h4 className="font-bold mb-3">🔗 연결성 & IoT</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div>
                                    <div className="text-xs text-white/50 mb-2">프로토콜</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedEquipment.connectivity.protocols.map((p, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-blue-500/20 rounded text-xs">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 mb-2">통합</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedEquipment.connectivity.integration.map((int, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-purple-500/20 rounded text-xs">
                                                {int}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-white/50 mb-2">데이터 출력</div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedEquipment.connectivity.dataOutput.map((d, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-green-500/20 rounded text-xs">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <span className={`px-3 py-1 rounded-lg ${selectedEquipment.connectivity.cloudCompatible
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        ☁️ {selectedEquipment.connectivity.cloudCompatible ? '클라우드 지원' : '클라우드 미지원'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 제조사 */}
                        <div className="mt-4 text-sm text-white/50">
                            <span>제조사: </span>
                            {selectedEquipment.manufacturer.join(' • ')}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
