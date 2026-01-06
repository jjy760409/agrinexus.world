'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CROP_DATABASE, getCropById, compareCrops, calculateProjectedRevenue, CropData, CropCategory } from '@/lib/smartfarm/cropDatabase';

interface CropInfoPanelProps {
    onCropSelect?: (crop: CropData) => void;
    selectedCropId?: string;
    farmArea?: number;
}

export default function CropInfoPanel({ onCropSelect, selectedCropId, farmArea = 100 }: CropInfoPanelProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'cultivation' | 'economics' | 'harvest' | 'market'>('overview');
    const [compareMode, setCompareMode] = useState(false);
    const [compareList, setCompareList] = useState<string[]>([]);
    const [showProjection, setShowProjection] = useState(false);
    const [projectionMonths, setProjectionMonths] = useState(12);

    const selectedCrop = useMemo(() =>
        selectedCropId ? getCropById(selectedCropId) : CROP_DATABASE[0],
        [selectedCropId]);

    const projection = useMemo(() =>
        selectedCrop ? calculateProjectedRevenue(selectedCrop.id, farmArea, projectionMonths) : null,
        [selectedCrop, farmArea, projectionMonths]);

    const comparison = useMemo(() =>
        compareList.length >= 2 ? compareCrops(compareList) : null,
        [compareList]);

    const categoryIcons: Record<CropCategory, string> = {
        leafy: '🥬',
        fruit: '🍎',
        root: '🥕',
        herb: '🌿',
        berry: '🍓',
        flower: '🌸',
        sprout: '🌱',
        mushroom: '🍄'
    };

    const tabs = [
        { id: 'overview' as const, label: '개요', icon: '📋' },
        { id: 'cultivation' as const, label: '재배 조건', icon: '🌡️' },
        { id: 'economics' as const, label: '경제성 분석', icon: '💰' },
        { id: 'harvest' as const, label: '수확 & 포장', icon: '📦' },
        { id: 'market' as const, label: '시장 정보', icon: '📊' },
    ];

    const toggleCompare = (cropId: string) => {
        setCompareList(prev =>
            prev.includes(cropId)
                ? prev.filter(id => id !== cropId)
                : prev.length < 3 ? [...prev, cropId] : prev
        );
    };

    if (!selectedCrop) return null;

    return (
        <div className="h-full flex flex-col">
            {/* 작물 선택 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-3xl">{categoryIcons[selectedCrop.category]}</span>
                        {selectedCrop.koreanName}
                        <span className="text-sm text-white/50 font-normal">({selectedCrop.name})</span>
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCompareMode(!compareMode)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${compareMode ? 'bg-blue-500' : 'bg-white/10'} transition-colors`}
                        >
                            📊 비교 분석
                        </button>
                        <button
                            onClick={() => setShowProjection(!showProjection)}
                            className={`px-3 py-1.5 rounded-lg text-sm ${showProjection ? 'bg-green-500' : 'bg-white/10'} transition-colors`}
                        >
                            📈 수익 예측
                        </button>
                    </div>
                </div>

                {/* 작물 선택 그리드 */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {CROP_DATABASE.map(crop => (
                        <motion.button
                            key={crop.id}
                            onClick={() => {
                                onCropSelect?.(crop);
                                if (compareMode) toggleCompare(crop.id);
                            }}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${selectedCrop.id === crop.id
                                    ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border-green-400'
                                    : compareList.includes(crop.id)
                                        ? 'bg-blue-500/20 border-blue-400'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-xl mr-2">{categoryIcons[crop.category]}</span>
                            <span className="text-sm">{crop.koreanName}</span>
                            {compareList.includes(crop.id) && (
                                <span className="ml-2 text-xs bg-blue-500 px-1.5 rounded">✓</span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* 수익 예측 패널 */}
            <AnimatePresence>
                {showProjection && projection && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass rounded-xl p-4 mb-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <span>📈</span> {projectionMonths}개월 수익 예측 ({farmArea}m²)
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-white/60">기간:</span>
                                <input
                                    type="range"
                                    min="3"
                                    max="36"
                                    value={projectionMonths}
                                    onChange={(e) => setProjectionMonths(Number(e.target.value))}
                                    className="w-24 accent-green-500"
                                />
                                <span className="text-sm w-12">{projectionMonths}개월</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-white/50">예상 수확량</div>
                                <div className="text-xl font-bold text-green-400">
                                    {projection.projectedYield.toFixed(0)} kg
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-white/50">예상 매출</div>
                                <div className="text-xl font-bold text-cyan-400">
                                    ₩{(projection.projectedRevenue / 10000).toFixed(0)}만
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-white/50">예상 비용</div>
                                <div className="text-xl font-bold text-orange-400">
                                    ₩{(projection.projectedCost / 10000).toFixed(0)}만
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-white/50">예상 순이익</div>
                                <div className={`text-xl font-bold ${projection.projectedProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ₩{(projection.projectedProfit / 10000).toFixed(0)}만
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 비교 분석 패널 */}
            <AnimatePresence>
                {compareMode && comparison && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass rounded-xl p-4 mb-4"
                    >
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span>📊</span> 작물 비교 분석
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-2 px-3">항목</th>
                                        {comparison.crops.map(crop => (
                                            <th key={crop.id} className="text-center py-2 px-3">
                                                {categoryIcons[crop.category]} {crop.koreanName}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-white/5">
                                        <td className="py-2 px-3 text-white/60">ROI</td>
                                        {comparison.profitability.map((p, i) => (
                                            <td key={i} className="text-center py-2 px-3 font-bold text-green-400">
                                                {p.roi.toFixed(1)}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-2 px-3 text-white/60">이익률</td>
                                        {comparison.profitability.map((p, i) => (
                                            <td key={i} className="text-center py-2 px-3 font-bold text-cyan-400">
                                                {p.margin.toFixed(1)}%
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-2 px-3 text-white/60">회수 기간</td>
                                        {comparison.profitability.map((p, i) => (
                                            <td key={i} className="text-center py-2 px-3">
                                                {p.payback}개월
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-2 px-3 text-white/60">재배 기간</td>
                                        {comparison.difficulty.map((d, i) => (
                                            <td key={i} className="text-center py-2 px-3">
                                                {d.cycleDays}일
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-white/5">
                                        <td className="py-2 px-3 text-white/60">난이도</td>
                                        {comparison.difficulty.map((d, i) => (
                                            <td key={i} className="text-center py-2 px-3">
                                                <span className={`px-2 py-0.5 rounded text-xs ${d.level === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                        d.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {d.level === 'easy' ? '쉬움' : d.level === 'medium' ? '보통' : '어려움'}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 text-white/60">적정 온도</td>
                                        {comparison.requirements.map((r, i) => (
                                            <td key={i} className="text-center py-2 px-3">
                                                {r.temp}°C
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 탭 네비게이션 */}
            <div className="glass rounded-xl p-2 mb-4 flex gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 text-white'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 탭 컨텐츠 */}
            <div className="flex-1 glass rounded-xl p-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 기본 정보 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <span>📋</span> 기본 정보
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/60">학명</span>
                                            <span className="italic">{selectedCrop.scientificName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">원산지</span>
                                            <span>{selectedCrop.origin}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">카테고리</span>
                                            <span>{selectedCrop.category}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/60">재배 난이도</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${selectedCrop.cultivation.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                    selectedCrop.cultivation.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {selectedCrop.cultivation.difficulty === 'easy' ? '쉬움' :
                                                    selectedCrop.cultivation.difficulty === 'medium' ? '보통' : '어려움'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <span>🌾</span> 품종
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCrop.varieties.map((variety, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                                                {variety}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 설명 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-2">📝 설명</h4>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {selectedCrop.description}
                                </p>
                            </div>

                            {/* 영양 정보 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3 flex items-center gap-2">
                                    <span>🥗</span> 영양 정보 (100g 기준)
                                </h4>
                                <div className="grid grid-cols-5 gap-3 mb-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-orange-400">{selectedCrop.nutrition.calories}</div>
                                        <div className="text-xs text-white/50">kcal</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-red-400">{selectedCrop.nutrition.protein}g</div>
                                        <div className="text-xs text-white/50">단백질</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-yellow-400">{selectedCrop.nutrition.carbohydrates}g</div>
                                        <div className="text-xs text-white/50">탄수화물</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-green-400">{selectedCrop.nutrition.fiber}g</div>
                                        <div className="text-xs text-white/50">식이섬유</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-blue-400">{selectedCrop.nutrition.fat}g</div>
                                        <div className="text-xs text-white/50">지방</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">비타민</div>
                                        {selectedCrop.nutrition.vitamins.map((v, i) => (
                                            <div key={i} className="flex justify-between text-sm py-1 border-b border-white/5">
                                                <span className="text-white/70">{v.name}</span>
                                                <span>{v.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">건강 효능</div>
                                        <ul className="text-sm space-y-1">
                                            {selectedCrop.nutrition.healthBenefits.map((b, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <span className="text-green-400">✓</span>
                                                    <span className="text-white/80">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'cultivation' && (
                        <motion.div
                            key="cultivation"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 환경 조건 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <ConditionCard
                                    icon="🌡️"
                                    label="온도"
                                    value={`${selectedCrop.cultivation.temperature.optimal}°C`}
                                    range={`${selectedCrop.cultivation.temperature.min}~${selectedCrop.cultivation.temperature.max}`}
                                />
                                <ConditionCard
                                    icon="💧"
                                    label="습도"
                                    value={`${selectedCrop.cultivation.humidity.optimal}%`}
                                    range={`${selectedCrop.cultivation.humidity.min}~${selectedCrop.cultivation.humidity.max}`}
                                />
                                <ConditionCard
                                    icon="🌬️"
                                    label="CO2"
                                    value={`${selectedCrop.cultivation.co2.optimal}ppm`}
                                    range={`${selectedCrop.cultivation.co2.min}~${selectedCrop.cultivation.co2.max}`}
                                />
                                <ConditionCard
                                    icon="💡"
                                    label="광량"
                                    value={`${selectedCrop.cultivation.light.ppfd.optimal} PPFD`}
                                    range={`${selectedCrop.cultivation.light.photoperiod}시간`}
                                />
                                <ConditionCard
                                    icon="⚗️"
                                    label="pH"
                                    value={selectedCrop.cultivation.ph.optimal.toString()}
                                    range={`${selectedCrop.cultivation.ph.min}~${selectedCrop.cultivation.ph.max}`}
                                />
                                <ConditionCard
                                    icon="🧪"
                                    label="EC"
                                    value={`${selectedCrop.cultivation.ec.optimal} mS/cm`}
                                    range={`${selectedCrop.cultivation.ec.min}~${selectedCrop.cultivation.ec.max}`}
                                />
                                <ConditionCard
                                    icon="🌊"
                                    label="수온"
                                    value={`${selectedCrop.cultivation.waterTemperature.optimal}°C`}
                                    range={`${selectedCrop.cultivation.waterTemperature.min}~${selectedCrop.cultivation.waterTemperature.max}`}
                                />
                                <ConditionCard
                                    icon="📏"
                                    label="재식 간격"
                                    value={`${selectedCrop.cultivation.spacing.plant}cm`}
                                    range={`열간 ${selectedCrop.cultivation.spacing.row}cm`}
                                />
                            </div>

                            {/* 영양소 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">🧬 필수 영양소 (ppm)</h4>
                                <div className="grid grid-cols-5 gap-3">
                                    {Object.entries(selectedCrop.cultivation.nutrients).map(([key, value]) => (
                                        <div key={key} className="text-center bg-white/5 rounded-lg p-2">
                                            <div className="text-lg font-bold text-cyan-400">{value}</div>
                                            <div className="text-xs text-white/50 uppercase">{key}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 재배 일정 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">📅 재배 일정</h4>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <span className="text-sm">{selectedCrop.cultivation.totalCycleDays}일</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                    <div className="bg-white/5 rounded p-2">
                                        <div className="text-xs text-white/50">발아</div>
                                        <div className="font-bold">{selectedCrop.cultivation.germinationDays}일</div>
                                    </div>
                                    <div className="bg-white/5 rounded p-2">
                                        <div className="text-xs text-white/50">육묘</div>
                                        <div className="font-bold">{selectedCrop.cultivation.transplantDays}일</div>
                                    </div>
                                    <div className="bg-white/5 rounded p-2">
                                        <div className="text-xs text-white/50">생장</div>
                                        <div className="font-bold">{selectedCrop.cultivation.harvestDays - selectedCrop.cultivation.transplantDays}일</div>
                                    </div>
                                    <div className="bg-white/5 rounded p-2">
                                        <div className="text-xs text-white/50">수확까지</div>
                                        <div className="font-bold text-green-400">{selectedCrop.cultivation.harvestDays}일</div>
                                    </div>
                                </div>
                            </div>

                            {/* 성장 단계 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">🌱 성장 단계별 관리</h4>
                                <div className="space-y-3">
                                    {selectedCrop.growthStages.map((stage, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center text-xs">
                                                        {stage.stage}
                                                    </span>
                                                    <span className="font-medium">{stage.koreanName}</span>
                                                    <span className="text-xs text-white/50">({stage.name})</span>
                                                </div>
                                                <span className="text-xs text-white/50">
                                                    {stage.daysFromStart}일 ~ {stage.daysFromStart + stage.duration}일
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/70 mb-2">{stage.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {stage.actions.map((action, j) => (
                                                    <span key={j} className="px-2 py-0.5 bg-green-500/20 rounded text-xs text-green-300">
                                                        ✓ {action}
                                                    </span>
                                                ))}
                                                {stage.risks.map((risk, j) => (
                                                    <span key={j} className="px-2 py-0.5 bg-red-500/20 rounded text-xs text-red-300">
                                                        ⚠ {risk}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'economics' && (
                        <motion.div
                            key="economics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 핵심 지표 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
                                    <div className="text-xs text-white/50 mb-1">ROI</div>
                                    <div className="text-2xl font-bold text-green-400">{selectedCrop.economics.roi}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-lg p-4 border border-cyan-500/30">
                                    <div className="text-xs text-white/50 mb-1">이익률</div>
                                    <div className="text-2xl font-bold text-cyan-400">{selectedCrop.economics.profitMargin}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg p-4 border border-orange-500/30">
                                    <div className="text-xs text-white/50 mb-1">투자 회수</div>
                                    <div className="text-2xl font-bold text-orange-400">{selectedCrop.economics.paybackMonths}개월</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-4 border border-purple-500/30">
                                    <div className="text-xs text-white/50 mb-1">리스크</div>
                                    <div className={`text-2xl font-bold ${selectedCrop.economics.riskLevel === 'low' ? 'text-green-400' :
                                            selectedCrop.economics.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {selectedCrop.economics.riskLevel === 'low' ? '낮음' :
                                            selectedCrop.economics.riskLevel === 'medium' ? '보통' : '높음'}
                                    </div>
                                </div>
                            </div>

                            {/* 비용 분석 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">💸 운영 비용 (1사이클/m²)</h4>
                                    <div className="space-y-2">
                                        {Object.entries(selectedCrop.economics.operatingCosts)
                                            .filter(([key]) => key !== 'total')
                                            .map(([key, value]) => {
                                                const labels: Record<string, string> = {
                                                    seeds: '종자',
                                                    nutrients: '양액',
                                                    energy: '에너지',
                                                    water: '용수',
                                                    labor: '인건비',
                                                    packaging: '포장',
                                                    other: '기타'
                                                };
                                                const percentage = ((value as number) / selectedCrop.economics.operatingCosts.total * 100).toFixed(0);
                                                return (
                                                    <div key={key} className="flex items-center gap-2">
                                                        <span className="w-16 text-sm text-white/60">{labels[key]}</span>
                                                        <div className="flex-1 bg-white/10 rounded-full h-2">
                                                            <div
                                                                className="bg-orange-500 h-full rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-20 text-sm text-right">₩{(value as number).toLocaleString()}</span>
                                                    </div>
                                                );
                                            })}
                                        <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                                            <span>합계</span>
                                            <span className="text-orange-400">₩{selectedCrop.economics.operatingCosts.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">💰 판매 가격 (kg당)</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                                            <span className="text-white/60">도매</span>
                                            <span className="font-bold">₩{selectedCrop.economics.sellingPrice.wholesale.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                                            <span className="text-white/60">소매</span>
                                            <span className="font-bold text-cyan-400">₩{selectedCrop.economics.sellingPrice.retail.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                                            <span className="text-white/60">프리미엄</span>
                                            <span className="font-bold text-green-400">₩{selectedCrop.economics.sellingPrice.premium.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded">
                                            <span className="text-white/60">유기농</span>
                                            <span className="font-bold text-yellow-400">₩{selectedCrop.economics.sellingPrice.organic.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 수익 분석 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">📈 수익 분석</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="text-center p-3 bg-white/5 rounded-lg">
                                        <div className="text-xs text-white/50 mb-1">수확량/m²</div>
                                        <div className="text-lg font-bold">{selectedCrop.economics.yieldPerM2.avg}kg</div>
                                        <div className="text-xs text-white/40">
                                            ({selectedCrop.economics.yieldPerM2.min}~{selectedCrop.economics.yieldPerM2.max})
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-lg">
                                        <div className="text-xs text-white/50 mb-1">연간 수확</div>
                                        <div className="text-lg font-bold">{selectedCrop.economics.harvestsPerYear}회</div>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-lg">
                                        <div className="text-xs text-white/50 mb-1">연간 수익/m²</div>
                                        <div className="text-lg font-bold text-green-400">
                                            ₩{(selectedCrop.economics.annualRevenue / 1000).toFixed(0)}천
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-white/5 rounded-lg">
                                        <div className="text-xs text-white/50 mb-1">연간 이익/m²</div>
                                        <div className="text-lg font-bold text-cyan-400">
                                            ₩{(selectedCrop.economics.annualProfit / 1000).toFixed(0)}천
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'harvest' && (
                        <motion.div
                            key="harvest"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 수확 정보 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">🌾 수확 방법</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-sm">
                                                {selectedCrop.harvest.method === 'manual' ? '수동' :
                                                    selectedCrop.harvest.method === 'semi-auto' ? '반자동' : '전자동'}
                                            </span>
                                            <span className="text-white/60 text-sm">수확 방식</span>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/50 mb-1">수확 시기 지표</div>
                                            <ul className="space-y-1">
                                                {selectedCrop.harvest.indicators.map((ind, i) => (
                                                    <li key={i} className="text-sm flex items-center gap-2">
                                                        <span className="text-green-400">✓</span>
                                                        {ind}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/50 mb-1">최적 수확 시간</div>
                                            <div className="text-sm">{selectedCrop.harvest.timing}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">📦 수확 후 관리</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-white/50 mb-1">세척</div>
                                            <div className="text-sm">{selectedCrop.harvest.postHarvest.cleaning}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-white/50 mb-1">예냉</div>
                                            <div className="text-sm">{selectedCrop.harvest.postHarvest.cooling}</div>
                                        </div>
                                        <div className="bg-white/5 rounded p-2">
                                            <div className="text-xs text-white/50 mb-2">저장 조건</div>
                                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                                <div>
                                                    <div className="text-white/50">온도</div>
                                                    <div className="font-bold text-cyan-400">
                                                        {selectedCrop.harvest.postHarvest.storage.temperature}°C
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-white/50">습도</div>
                                                    <div className="font-bold text-blue-400">
                                                        {selectedCrop.harvest.postHarvest.storage.humidity}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-white/50">유통기한</div>
                                                    <div className="font-bold text-green-400">
                                                        {selectedCrop.harvest.postHarvest.storage.shelfLife}일
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 포장 유형 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">🎁 포장 유형</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {selectedCrop.packaging.types.map((pkg, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="font-medium">{pkg.type}</div>
                                            <div className="text-sm text-white/60">{pkg.weight}</div>
                                            <div className="text-xs text-white/40">{pkg.targetMarket}</div>
                                            <div className="text-sm font-bold text-green-400 mt-1">
                                                x{pkg.priceMultiplier}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 병해충 */}
                            {(selectedCrop.pests.length > 0 || selectedCrop.diseases.length > 0) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedCrop.pests.length > 0 && (
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <h4 className="font-bold mb-3">🐛 주요 해충</h4>
                                            <div className="space-y-3">
                                                {selectedCrop.pests.map((pest, i) => (
                                                    <div key={i} className="bg-white/5 rounded p-3">
                                                        <div className="font-medium text-red-400">{pest.koreanName}</div>
                                                        <div className="text-xs text-white/60 mb-2">{pest.description}</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {pest.prevention.map((p, j) => (
                                                                <span key={j} className="px-2 py-0.5 bg-green-500/20 rounded text-xs">
                                                                    예방: {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedCrop.diseases.length > 0 && (
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <h4 className="font-bold mb-3">🦠 주요 병해</h4>
                                            <div className="space-y-3">
                                                {selectedCrop.diseases.map((disease, i) => (
                                                    <div key={i} className="bg-white/5 rounded p-3">
                                                        <div className="font-medium text-orange-400">{disease.koreanName}</div>
                                                        <div className="text-xs text-white/60 mb-2">{disease.cause}</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {disease.prevention.map((p, j) => (
                                                                <span key={j} className="px-2 py-0.5 bg-green-500/20 rounded text-xs">
                                                                    예방: {p}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'market' && (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 시장 현황 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <div className="text-xs text-white/50 mb-1">수요 트렌드</div>
                                    <div className={`text-xl font-bold ${selectedCrop.market.demandTrend === 'rising' ? 'text-green-400' :
                                            selectedCrop.market.demandTrend === 'stable' ? 'text-cyan-400' : 'text-red-400'
                                        }`}>
                                        {selectedCrop.market.demandTrend === 'rising' ? '📈 상승' :
                                            selectedCrop.market.demandTrend === 'stable' ? '➡️ 안정' : '📉 하락'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <div className="text-xs text-white/50 mb-1">시장 안정성</div>
                                    <div className={`text-xl font-bold ${selectedCrop.economics.marketStability === 'stable' ? 'text-green-400' :
                                            selectedCrop.economics.marketStability === 'seasonal' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {selectedCrop.economics.marketStability === 'stable' ? '안정' :
                                            selectedCrop.economics.marketStability === 'seasonal' ? '계절성' : '변동'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <div className="text-xs text-white/50 mb-1">수출 가능</div>
                                    <div className={`text-xl font-bold ${selectedCrop.market.exportPotential ? 'text-green-400' : 'text-white/30'}`}>
                                        {selectedCrop.market.exportPotential ? '✓ 가능' : '✗ 불가'}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <div className="text-xs text-white/50 mb-1">인증</div>
                                    <div className="text-sm">
                                        {selectedCrop.market.certifications.slice(0, 2).join(', ')}
                                    </div>
                                </div>
                            </div>

                            {/* 계절별 수요 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">📅 월별 수요 지수</h4>
                                <div className="flex items-end gap-1 h-32">
                                    {selectedCrop.market.seasonality.map((s, i) => {
                                        const height = (s.demand / 150) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className={`w-full rounded-t ${s.demand > 100 ? 'bg-green-500' :
                                                            s.demand > 80 ? 'bg-cyan-500' :
                                                                s.demand > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="text-xs text-white/50 mt-1">{s.month}월</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 가격 추이 */}
                            <div className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-bold mb-3">💲 가격 이력</h4>
                                <div className="flex items-end gap-2 h-24">
                                    {selectedCrop.market.priceHistory.map((p, i) => {
                                        const maxPrice = Math.max(...selectedCrop.market.priceHistory.map(x => x.price));
                                        const height = (p.price / maxPrice) * 100;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="text-xs text-white/50 mt-1">{p.date}</div>
                                                <div className="text-xs">₩{(p.price / 1000).toFixed(0)}천</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 타겟 시장 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">🎯 타겟 시장</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCrop.market.targetMarkets.map((market, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-500/20 rounded-full text-sm">
                                                {market}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4">
                                    <h4 className="font-bold mb-3">🏆 경쟁</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCrop.market.competitors.map((comp, i) => (
                                            <span key={i} className="px-3 py-1 bg-orange-500/20 rounded-full text-sm">
                                                {comp}
                                            </span>
                                        ))}
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

// 조건 카드 컴포넌트
function ConditionCard({ icon, label, value, range }: {
    icon: string;
    label: string;
    value: string;
    range: string;
}) {
    return (
        <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-xs text-white/50">{label}</div>
            <div className="text-lg font-bold text-cyan-400">{value}</div>
            <div className="text-xs text-white/40">{range}</div>
        </div>
    );
}
