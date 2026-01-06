'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getDNAEditingSimulator,
    CropGenome,
    Gene,
    CRISPREdit,
    EditResult,
    EditType,
    EDIT_TYPE_ICONS,
    TRAIT_CATEGORY_ICONS
} from '@/lib/genetics/dnaEditingSimulator';

export default function DNAEditorPanel() {
    const [selectedCrop, setSelectedCrop] = useState<string>('strawberry');
    const [genome, setGenome] = useState<CropGenome | null>(null);
    const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
    const [selectedEditType, setSelectedEditType] = useState<EditType>('knockout');
    const [activeEdit, setActiveEdit] = useState<CRISPREdit | null>(null);
    const [editResult, setEditResult] = useState<EditResult | null>(null);
    const [activeTab, setActiveTab] = useState<'genome' | 'edit' | 'result'>('genome');
    const [isEditing, setIsEditing] = useState(false);

    const simulator = useMemo(() => getDNAEditingSimulator(), []);

    useEffect(() => {
        const g = simulator.getGenome(selectedCrop);
        setGenome(g || null);
        setSelectedGene(null);
        setActiveEdit(null);
        setEditResult(null);
    }, [selectedCrop, simulator]);

    const designEdit = () => {
        if (!selectedGene) return;

        const edit = simulator.designEdit(selectedCrop, selectedGene.id, selectedEditType);
        setActiveEdit(edit);
        setActiveTab('edit');
    };

    const executeEdit = async () => {
        if (!activeEdit) return;

        setIsEditing(true);
        // 시뮬레이션 딜레이
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = simulator.executeEdit(activeEdit.id);
        setEditResult(result);
        setActiveTab('result');
        setIsEditing(false);
    };

    const crops = simulator.getAllGenomes();
    const editTypes: { type: EditType; name: string; desc: string }[] = [
        { type: 'knockout', name: '유전자 제거', desc: '유전자 기능 비활성화' },
        { type: 'knockin', name: '유전자 삽입', desc: '새로운 유전자 삽입' },
        { type: 'base_edit', name: '염기 교정', desc: '단일 염기 변이 수정' },
        { type: 'prime_edit', name: '프라임 편집', desc: '정밀 서열 교체' },
        { type: 'activation', name: '유전자 활성화', desc: 'CRISPRa - 발현 증가' },
        { type: 'repression', name: '유전자 억제', desc: 'CRISPRi - 발현 감소' },
    ];

    const tabs = [
        { id: 'genome' as const, label: '게놈 탐색', icon: '🧬' },
        { id: 'edit' as const, label: 'CRISPR 편집', icon: '✂️' },
        { id: 'result' as const, label: '결과 분석', icon: '📊' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🧬</span>
                            CRISPR DNA 편집 시뮬레이터
                        </h2>
                        <div className="text-sm text-white/50">
                            세계 최초: 실시간 유전자 편집 및 형질 예측 시스템
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {crops.map(crop => (
                            <button
                                key={crop.cropId}
                                onClick={() => setSelectedCrop(crop.cropId)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCrop === crop.cropId
                                        ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {crop.cropId === 'strawberry' ? '🍓' : crop.cropId === 'tomato' ? '🍅' : '🥬'}
                                {crop.koreanName}
                            </button>
                        ))}
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
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* 게놈 탐색 */}
                    {activeTab === 'genome' && genome && (
                        <motion.div
                            key="genome"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full flex gap-4"
                        >
                            {/* 게놈 정보 */}
                            <div className="w-1/3 glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    📚 게놈 정보
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-sm text-white/50">학명</div>
                                        <div className="italic">{genome.scientificName}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-purple-400">{genome.chromosomeCount}</div>
                                            <div className="text-xs text-white/50">염색체</div>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-2xl font-bold text-cyan-400">{genome.genomeSize}</div>
                                            <div className="text-xs text-white/50">Mb</div>
                                        </div>
                                    </div>

                                    <h4 className="font-medium mt-4 mb-2">🎯 편집 가능 대상</h4>
                                    {genome.editableTargets.map(target => (
                                        <button
                                            key={target.geneId}
                                            onClick={() => setSelectedGene(genome.genes.find(g => g.id === target.geneId) || null)}
                                            className={`w-full text-left p-3 rounded-lg transition-all ${selectedGene?.id === target.geneId
                                                    ? 'bg-purple-500/30 border border-purple-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{target.geneId}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${target.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                                                        target.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {target.difficulty === 'easy' ? '쉬움' : target.difficulty === 'medium' ? '보통' : '어려움'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-white/50 mt-1">{target.purpose}</div>
                                            <div className="text-xs text-white/40 mt-1">
                                                예상 결과: {target.expectedOutcome}
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 text-xs">
                                                <span className="text-white/50">성공률:</span>
                                                <div className="flex-1 bg-white/10 rounded-full h-1.5">
                                                    <div
                                                        className="bg-green-500 h-full rounded-full"
                                                        style={{ width: `${target.successRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-green-400">{target.successRate}%</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 유전자 상세 */}
                            <div className="w-2/3 glass rounded-xl p-4">
                                {selectedGene ? (
                                    <div className="h-full flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{selectedGene.id}</h3>
                                                <div className="text-sm text-white/50">{selectedGene.name}</div>
                                            </div>
                                            <button
                                                onClick={designEdit}
                                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90"
                                            >
                                                ✂️ 편집 설계
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-white/50">염색체</div>
                                                <div className="text-xl font-bold">{selectedGene.chromosome}</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-white/50">위치</div>
                                                <div className="text-xl font-bold font-mono">{(selectedGene.position / 1000000).toFixed(2)} Mb</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-xs text-white/50">길이</div>
                                                <div className="text-xl font-bold">{selectedGene.length} bp</div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium mb-2">🔬 기능</h4>
                                            <p className="text-sm text-white/70">{selectedGene.function}</p>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-4 mb-4">
                                            <h4 className="font-medium mb-2">🧬 서열 미리보기</h4>
                                            <div className="font-mono text-xs text-green-400 bg-black/30 rounded p-2 overflow-x-auto">
                                                {selectedGene.sequence.substring(0, 100)}...
                                            </div>
                                        </div>

                                        {/* 편집 유형 선택 */}
                                        <div className="flex-1">
                                            <h4 className="font-medium mb-3">✏️ 편집 유형 선택</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {editTypes.map(et => (
                                                    <button
                                                        key={et.type}
                                                        onClick={() => setSelectedEditType(et.type)}
                                                        className={`p-3 rounded-lg text-left transition-all ${selectedEditType === et.type
                                                                ? 'bg-purple-500/30 border border-purple-400'
                                                                : 'bg-white/5 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span>{EDIT_TYPE_ICONS[et.type]}</span>
                                                            <span className="font-medium text-sm">{et.name}</span>
                                                        </div>
                                                        <div className="text-xs text-white/50">{et.desc}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/50">
                                        ← 왼쪽에서 편집할 유전자를 선택하세요
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* CRISPR 편집 */}
                    {activeTab === 'edit' && activeEdit && (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            {/* 편집 정보 */}
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        ✂️ CRISPR 편집 설계
                                    </h3>
                                    <div className={`px-3 py-1 rounded text-sm ${activeEdit.status === 'designed' ? 'bg-blue-500/20 text-blue-400' :
                                            activeEdit.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {activeEdit.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">대상 유전자</div>
                                        <div className="font-bold text-purple-400">{activeEdit.targetGene}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">편집 유형</div>
                                        <div className="font-bold flex items-center gap-1">
                                            {EDIT_TYPE_ICONS[activeEdit.editType]}
                                            {activeEdit.editType}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">PAM 서열</div>
                                        <div className="font-bold font-mono">{activeEdit.pamSequence}</div>
                                    </div>
                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                                        <div className="text-xs text-white/50">예상 효율</div>
                                        <div className="text-2xl font-bold text-green-400">{activeEdit.efficiency.toFixed(1)}%</div>
                                    </div>
                                </div>

                                {/* 가이드 RNA */}
                                <div className="bg-black/30 rounded-lg p-4 mb-4">
                                    <div className="text-xs text-white/50 mb-1">가이드 RNA (20bp)</div>
                                    <div className="font-mono text-lg text-cyan-400 tracking-wider">
                                        {activeEdit.guideRNA}
                                    </div>
                                </div>

                                {/* 오프타겟 분석 */}
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">⚠️ 오프타겟 예측</h4>
                                    {activeEdit.offTargets.length > 0 ? (
                                        <div className="space-y-2">
                                            {activeEdit.offTargets.map((ot, i) => (
                                                <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${ot.risk === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                                                        ot.risk === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                                                            'bg-green-500/10 border border-green-500/30'
                                                    }`}>
                                                    <div>
                                                        <span className="font-mono text-sm">Chr{ot.location.chromosome}:{ot.location.position}</span>
                                                        <span className="text-xs text-white/50 ml-2">{ot.mismatches} mismatches</span>
                                                    </div>
                                                    <div className={`text-sm ${ot.risk === 'high' ? 'text-red-400' :
                                                            ot.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
                                                        }`}>
                                                        {(ot.probability * 100).toFixed(2)}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center text-green-400">
                                            ✓ 오프타겟 없음 - 안전한 편집 설계
                                        </div>
                                    )}
                                </div>

                                {/* 실행 버튼 */}
                                <button
                                    onClick={executeEdit}
                                    disabled={isEditing}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isEditing ? (
                                        <>
                                            <span className="animate-spin">⚙️</span>
                                            유전자 편집 시뮬레이션 중...
                                        </>
                                    ) : (
                                        <>🧬 편집 실행 시뮬레이션</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* 결과 분석 */}
                    {activeTab === 'result' && editResult && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            {/* 성공/실패 */}
                            <div className={`glass rounded-xl p-6 text-center ${editResult.success ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                <div className="text-6xl mb-4">{editResult.success ? '✅' : '❌'}</div>
                                <h3 className={`text-2xl font-bold mb-2 ${editResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                    {editResult.success ? '유전자 편집 성공!' : '편집 실패'}
                                </h3>
                                <div className="text-white/60">
                                    실제 효율: {editResult.efficiency.toFixed(1)}% | 안정화까지 {editResult.generationsToStabilize} 세대 필요
                                </div>
                            </div>

                            {/* 형질 변화 */}
                            {editResult.phenotypeChanges.length > 0 && (
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-4">🌿 형질 변화</h3>
                                    <div className="space-y-3">
                                        {editResult.phenotypeChanges.map((change, i) => (
                                            <div key={i} className="bg-white/5 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">{change.trait}</span>
                                                    <span className="text-green-400 font-bold">+{change.improvement}%</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <div className="text-xs text-white/50">이전</div>
                                                        <div className="text-lg">{change.beforeValue} {change.unit}</div>
                                                    </div>
                                                    <div className="text-2xl text-green-400">→</div>
                                                    <div className="text-center">
                                                        <div className="text-xs text-white/50">이후</div>
                                                        <div className="text-lg text-green-400">{change.afterValue} {change.unit}</div>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-white/40 mt-2">신뢰도: {(change.confidence * 100).toFixed(0)}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 경제적 영향 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">💰 경제적 영향 예측</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                                        <div className="text-3xl font-bold text-green-400">
                                            +{editResult.economicProjection.yieldIncrease.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-white/50">수확량 증가</div>
                                    </div>
                                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30 text-center">
                                        <div className="text-3xl font-bold text-yellow-400">
                                            +{editResult.economicProjection.qualityPremium.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-white/50">품질 프리미엄</div>
                                    </div>
                                    <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/30 text-center">
                                        <div className="text-3xl font-bold text-cyan-400">
                                            {editResult.economicProjection.roi.toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-white/50">ROI</div>
                                    </div>
                                </div>
                                <div className="mt-4 bg-white/5 rounded-lg p-3 text-center">
                                    <span className="text-white/50">예상 수익 변화: </span>
                                    <span className="text-green-400 font-bold">
                                        +{editResult.economicProjection.revenueChange.toLocaleString()}원/m²/년
                                    </span>
                                </div>
                            </div>

                            {/* 규제 상태 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📋 규제 및 승인</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">분류</div>
                                        <div className={`font-bold ${editResult.regulatoryStatus.classification === 'GMO' ? 'text-red-400' : 'text-green-400'
                                            }`}>
                                            {editResult.regulatoryStatus.classification}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">표시 의무</div>
                                        <div>{editResult.regulatoryStatus.labeling}</div>
                                    </div>
                                </div>
                                {editResult.regulatoryStatus.restrictions.length > 0 && (
                                    <div className="mt-3 text-sm">
                                        {editResult.regulatoryStatus.restrictions.map((r, i) => (
                                            <div key={i} className="text-white/60">• {r}</div>
                                        ))}
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
