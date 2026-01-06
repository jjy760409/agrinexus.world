'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AIRecommendationEngine,
    FarmProfile,
    CropRecommendation,
    CultivationPlan,
    DEFAULT_FARM_PROFILE
} from '@/lib/smartfarm/aiRecommendation';
import {
    PredictiveAnalyticsEngine,
    PlantHealth,
    YieldPrediction,
    SimulationResult,
    SIMULATION_SCENARIOS,
    createPredictiveEngine
} from '@/lib/smartfarm/predictiveAnalytics';
import { CROP_DATABASE, CropData } from '@/lib/smartfarm/cropDatabase';

interface AIDashboardProps {
    farmProfile?: FarmProfile;
    selectedCropId?: string;
}

export default function AIDashboard({ farmProfile = DEFAULT_FARM_PROFILE, selectedCropId = 'strawberry' }: AIDashboardProps) {
    const [activeTab, setActiveTab] = useState<'recommendations' | 'predictions' | 'simulations' | 'plan'>('recommendations');
    const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
    const [plantHealth, setPlantHealth] = useState<PlantHealth | null>(null);
    const [yieldPrediction, setYieldPrediction] = useState<YieldPrediction | null>(null);
    const [cultivationPlan, setCultivationPlan] = useState<CultivationPlan | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<string>('optimal');
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const aiEngine = useMemo(() => new AIRecommendationEngine(farmProfile), [farmProfile]);
    const predictiveEngine = useMemo(() => createPredictiveEngine(selectedCropId), [selectedCropId]);

    // AI 추천 생성
    useEffect(() => {
        setIsLoading(true);
        const recs = aiEngine.recommendCrops(5);
        setRecommendations(recs);
        setIsLoading(false);
    }, [aiEngine]);

    // 예측 분석
    useEffect(() => {
        const currentData = {
            timestamp: new Date(),
            temperature: 22,
            humidity: 70,
            co2: 1000,
            light: { ppfd: 450, dli: 17 },
            nutrient: { ph: 6.0, ec: 1.5, waterTemp: 20 }
        };

        const health = predictiveEngine.analyzePlantHealth(currentData, 60);
        const yield_pred = predictiveEngine.predictYield(currentData, 60, farmProfile.facility.area);

        setPlantHealth(health);
        setYieldPrediction(yield_pred);
    }, [predictiveEngine, farmProfile]);

    // 재배 계획 생성
    const generatePlan = () => {
        const plan = aiEngine.generateCultivationPlan([selectedCropId]);
        setCultivationPlan(plan);
    };

    // 시뮬레이션 실행
    const runSimulation = () => {
        const scenario = SIMULATION_SCENARIOS.find(s => s.id === selectedScenario);
        if (scenario) {
            const result = predictiveEngine.runSimulation(scenario, 30);
            setSimulationResult(result);
        }
    };

    const tabs = [
        { id: 'recommendations' as const, label: 'AI 추천', icon: '🤖' },
        { id: 'predictions' as const, label: '예측 분석', icon: '📊' },
        { id: 'simulations' as const, label: '시뮬레이션', icon: '🔬' },
        { id: 'plan' as const, label: '재배 계획', icon: '📋' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-3xl">🧠</span>
                        AI 분석 대시보드
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-green-500/20 rounded-lg text-sm">
                            <span className="text-green-400">●</span> AI 활성화
                        </div>
                    </div>
                </div>

                {/* 탭 */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400'
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
                    {/* AI 추천 */}
                    {activeTab === 'recommendations' && (
                        <motion.div
                            key="recommendations"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🌱</span> 최적 작물 추천 (Top 5)
                                </h3>
                                <div className="space-y-3">
                                    {recommendations.map((rec, i) => (
                                        <div
                                            key={rec.crop.id}
                                            className={`p-4 rounded-lg border transition-all ${i === 0
                                                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                                                    : 'bg-white/5 border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-500 text-black' :
                                                            i === 1 ? 'bg-gray-300 text-black' :
                                                                i === 2 ? 'bg-orange-600' :
                                                                    'bg-white/20'
                                                        }`}>
                                                        {rec.ranking}
                                                    </span>
                                                    <div>
                                                        <div className="font-bold">{rec.crop.koreanName}</div>
                                                        <div className="text-xs text-white/50">{rec.crop.name}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-purple-400">
                                                        {rec.score.toFixed(0)}점
                                                    </div>
                                                    <div className="text-xs text-white/50">적합도</div>
                                                </div>
                                            </div>

                                            {/* 점수 상세 */}
                                            <div className="grid grid-cols-5 gap-2 mb-3">
                                                {rec.reasons.map((reason, j) => (
                                                    <div key={j} className="text-center">
                                                        <div className="text-xs text-white/50">{reason.category}</div>
                                                        <div className="font-bold text-cyan-400">{reason.score.toFixed(0)}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* 예상 수익 */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div>
                                                    <span className="text-white/50">예상 수익: </span>
                                                    <span className="font-bold text-green-400">
                                                        ₩{(rec.projectedOutcome.revenue / 10000).toFixed(0)}만/년
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-white/50">ROI: </span>
                                                    <span className="font-bold text-cyan-400">{rec.projectedOutcome.roi}%</span>
                                                </div>
                                                <div>
                                                    <span className="text-white/50">회수: </span>
                                                    <span className="font-bold">{rec.projectedOutcome.paybackMonths}개월</span>
                                                </div>
                                            </div>

                                            {/* 리스크 & 제안 */}
                                            {i === 0 && (
                                                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-xs text-red-400 mb-1">⚠️ 위험 요소</div>
                                                        {rec.risks.map((risk, j) => (
                                                            <div key={j} className="text-xs text-white/60">• {risk}</div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-green-400 mb-1">💡 제안</div>
                                                        {rec.suggestions.slice(0, 2).map((sug, j) => (
                                                            <div key={j} className="text-xs text-white/60">• {sug}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 예측 분석 */}
                    {activeTab === 'predictions' && plantHealth && yieldPrediction && (
                        <motion.div
                            key="predictions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 식물 건강 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🌿</span> 식물 건강 분석
                                </h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-4xl font-bold text-green-400 mb-1">
                                            {plantHealth.overall}
                                        </div>
                                        <div className="text-xs text-white/50">전체 건강 점수</div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-green-500 h-full rounded-full transition-all"
                                                style={{ width: `${plantHealth.overall}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-4xl font-bold text-cyan-400 mb-1">
                                            {plantHealth.growth.rate}%
                                        </div>
                                        <div className="text-xs text-white/50">성장률</div>
                                        <div className="text-sm mt-2">
                                            Stage {plantHealth.growth.stage}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className={`text-4xl font-bold mb-1 ${plantHealth.stress.level === 'none' ? 'text-green-400' :
                                                plantHealth.stress.level === 'mild' ? 'text-yellow-400' :
                                                    plantHealth.stress.level === 'moderate' ? 'text-orange-400' : 'text-red-400'
                                            }`}>
                                            {plantHealth.stress.level === 'none' ? '정상' :
                                                plantHealth.stress.level === 'mild' ? '경미' :
                                                    plantHealth.stress.level === 'moderate' ? '중등' : '심각'}
                                        </div>
                                        <div className="text-xs text-white/50">스트레스</div>
                                        <div className="text-xs mt-2 text-white/60">
                                            {plantHealth.stress.factors.join(', ') || '없음'}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-4xl font-bold text-purple-400 mb-1">
                                            {plantHealth.growth.daysToHarvest}
                                        </div>
                                        <div className="text-xs text-white/50">수확까지 (일)</div>
                                    </div>
                                </div>
                            </div>

                            {/* 수확량 예측 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>📈</span> 수확량 예측
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
                                        <div className="text-xs text-white/50 mb-1">예상 수확량</div>
                                        <div className="text-3xl font-bold text-green-400">
                                            {yieldPrediction.estimated} kg
                                        </div>
                                        <div className="text-xs text-white/40">
                                            ({yieldPrediction.range.min} ~ {yieldPrediction.range.max} kg)
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-xs text-white/50 mb-1">신뢰도</div>
                                        <div className="text-3xl font-bold text-cyan-400">
                                            {yieldPrediction.confidence}%
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-cyan-500 h-full rounded-full"
                                                style={{ width: `${yieldPrediction.confidence}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-xs text-white/50 mb-1">예상 등급</div>
                                        <div className={`text-3xl font-bold ${yieldPrediction.quality.grade === 'A' ? 'text-yellow-400' :
                                                yieldPrediction.quality.grade === 'B' ? 'text-blue-400' : 'text-gray-400'
                                            }`}>
                                            {yieldPrediction.quality.grade}등급
                                        </div>
                                        {yieldPrediction.quality.brix && (
                                            <div className="text-sm mt-1">
                                                당도: {yieldPrediction.quality.brix.toFixed(1)} Brix
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 영향 요인 */}
                                {yieldPrediction.factors.length > 0 && (
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm font-bold mb-2">영향 요인</div>
                                        {yieldPrediction.factors.map((factor, i) => (
                                            <div key={i} className="flex items-center gap-3 py-1">
                                                <span className={`text-sm font-bold w-16 ${factor.impact > 0 ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    {factor.impact > 0 ? '+' : ''}{factor.impact}%
                                                </span>
                                                <span className="text-sm">{factor.name}</span>
                                                <span className="text-xs text-white/50">{factor.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 시뮬레이션 */}
                    {activeTab === 'simulations' && (
                        <motion.div
                            key="simulations"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🔬</span> 시나리오 시뮬레이션
                                </h3>

                                {/* 시나리오 선택 */}
                                <div className="grid grid-cols-5 gap-2 mb-4">
                                    {SIMULATION_SCENARIOS.map(scenario => (
                                        <button
                                            key={scenario.id}
                                            onClick={() => setSelectedScenario(scenario.id)}
                                            className={`p-3 rounded-lg text-center transition-all ${selectedScenario === scenario.id
                                                    ? 'bg-purple-500/30 border border-purple-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">
                                                {scenario.id === 'heat-wave' ? '🔥' :
                                                    scenario.id === 'power-outage' ? '⚡' :
                                                        scenario.id === 'optimal' ? '✨' :
                                                            scenario.id === 'cold-snap' ? '❄️' : '🧪'}
                                            </div>
                                            <div className="text-xs font-medium">{scenario.name}</div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={runSimulation}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                >
                                    🚀 시뮬레이션 실행
                                </button>
                            </div>

                            {/* 시뮬레이션 결과 */}
                            {simulationResult && (
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <span>📊</span> 시뮬레이션 결과: {simulationResult.scenario.name}
                                    </h3>

                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-xs text-white/50">수확량 변화</div>
                                            <div className={`text-2xl font-bold ${simulationResult.outcome.yieldChange > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {simulationResult.outcome.yieldChange > 0 ? '+' : ''}{simulationResult.outcome.yieldChange}%
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-xs text-white/50">품질 변화</div>
                                            <div className={`text-2xl font-bold ${simulationResult.outcome.qualityChange > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {simulationResult.outcome.qualityChange > 0 ? '+' : ''}{simulationResult.outcome.qualityChange}%
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-xs text-white/50">비용 변화</div>
                                            <div className={`text-2xl font-bold ${simulationResult.outcome.costChange > 0 ? 'text-red-400' : 'text-green-400'
                                                }`}>
                                                {simulationResult.outcome.costChange > 0 ? '+' : ''}{simulationResult.outcome.costChange}%
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-xs text-white/50">위험도</div>
                                            <div className={`text-2xl font-bold ${simulationResult.outcome.riskLevel < 30 ? 'text-green-400' :
                                                    simulationResult.outcome.riskLevel < 60 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                {simulationResult.outcome.riskLevel}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* 타임라인 그래프 */}
                                    <div className="bg-white/5 rounded-lg p-4 mb-4">
                                        <div className="text-sm font-bold mb-2">30일 시뮬레이션 타임라인</div>
                                        <div className="flex items-end gap-1 h-24">
                                            {simulationResult.timeline.filter((_, i) => i % 3 === 0).map((point, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-purple-600 to-pink-400 rounded-t"
                                                        style={{ height: `${point.metrics.yield}%` }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-white/40 mt-1">
                                            <span>1일</span>
                                            <span>15일</span>
                                            <span>30일</span>
                                        </div>
                                    </div>

                                    {/* 인사이트 */}
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm font-bold mb-2">💡 분석 인사이트</div>
                                        {simulationResult.insights.map((insight, i) => (
                                            <div key={i} className="text-sm text-white/70 py-1">• {insight}</div>
                                        ))}
                                        <div className={`mt-2 p-2 rounded ${simulationResult.outcome.yieldChange >= -10 ? 'bg-green-500/20' : 'bg-red-500/20'
                                            }`}>
                                            <span className="text-sm font-bold">권장사항: </span>
                                            <span className="text-sm">{simulationResult.recommendation}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 재배 계획 */}
                    {activeTab === 'plan' && (
                        <motion.div
                            key="plan"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span>📋</span> AI 재배 계획 생성
                                    </h3>
                                    <button
                                        onClick={generatePlan}
                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg font-bold hover:opacity-90 transition-opacity"
                                    >
                                        🤖 계획 생성
                                    </button>
                                </div>

                                {cultivationPlan ? (
                                    <div className="space-y-4">
                                        {/* 계획 개요 */}
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="text-lg font-bold mb-2">{cultivationPlan.name}</div>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-xs text-white/50">총 투자</div>
                                                    <div className="text-xl font-bold text-cyan-400">
                                                        ₩{(cultivationPlan.financials.totalInvestment / 100000000).toFixed(2)}억
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs text-white/50">예상 연수익</div>
                                                    <div className="text-xl font-bold text-green-400">
                                                        ₩{(cultivationPlan.financials.projectedAnnualRevenue / 10000000).toFixed(1)}천만
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs text-white/50">ROI</div>
                                                    <div className="text-xl font-bold text-purple-400">
                                                        {cultivationPlan.financials.roi.toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-xs text-white/50">회수 기간</div>
                                                    <div className="text-xl font-bold text-orange-400">
                                                        {cultivationPlan.financials.paybackMonths}개월
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 스케줄 */}
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="text-sm font-bold mb-3">📅 주요 일정</div>
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {cultivationPlan.schedule.slice(0, 10).map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                                                        <span className={`text-xl ${item.type === 'planting' ? '🌱' :
                                                                item.type === 'harvest' ? '🌾' :
                                                                    item.type === 'maintenance' ? '🔧' :
                                                                        item.type === 'inspection' ? '🔍' : '📋'
                                                            }`}>{
                                                                item.type === 'planting' ? '🌱' :
                                                                    item.type === 'harvest' ? '🌾' :
                                                                        item.type === 'maintenance' ? '🔧' :
                                                                            item.type === 'inspection' ? '🔍' : '📋'
                                                            }</span>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium">{item.title}</div>
                                                            <div className="text-xs text-white/50">{item.description}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-xs px-2 py-0.5 rounded ${item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                                    item.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                                        'bg-white/10'
                                                                }`}>
                                                                {item.priority}
                                                            </div>
                                                            <div className="text-xs text-white/40 mt-1">
                                                                {new Date(item.startDate).toLocaleDateString('ko-KR')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 리스크 평가 */}
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm font-bold">⚠️ 리스크 평가</div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${cultivationPlan.riskAssessment.level === 'low' ? 'bg-green-500/20 text-green-400' :
                                                        cultivationPlan.riskAssessment.level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {cultivationPlan.riskAssessment.level === 'low' ? '낮음' :
                                                        cultivationPlan.riskAssessment.level === 'medium' ? '보통' : '높음'}
                                                </span>
                                            </div>
                                            {cultivationPlan.riskAssessment.factors.map((factor, i) => (
                                                <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5">
                                                    <div className="w-24 text-sm">{factor.name}</div>
                                                    <div className="flex-1 bg-white/10 rounded-full h-2">
                                                        <div
                                                            className={`h-full rounded-full ${factor.severity > 6 ? 'bg-red-500' :
                                                                    factor.severity > 3 ? 'bg-yellow-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${factor.severity * 10}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-white/50 w-40">{factor.mitigation}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-white/50">
                                        <div className="text-4xl mb-2">🤖</div>
                                        <div>버튼을 클릭하여 AI 재배 계획을 생성하세요</div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
