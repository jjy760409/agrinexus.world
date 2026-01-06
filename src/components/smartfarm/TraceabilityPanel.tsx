'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getTraceabilityService,
    createSampleTraceabilityData,
    ProductTraceability,
    SupplyChainNode,
    TraceabilityEvent,
    mintProductNFT,
    NFTCertificate
} from '@/lib/smartfarm/blockchainTraceability';

interface TraceabilityPanelProps {
    batchId?: string;
    cropType?: string;
}

export default function TraceabilityPanel({ batchId = 'BATCH-2026-001', cropType = '딸기' }: TraceabilityPanelProps) {
    const [activeTab, setActiveTab] = useState<'timeline' | 'supplychain' | 'carbon' | 'nft'>('timeline');
    const [productTrace, setProductTrace] = useState<ProductTraceability | null>(null);
    const [supplyChain, setSupplyChain] = useState<SupplyChainNode[]>([]);
    const [nftCertificate, setNftCertificate] = useState<NFTCertificate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const service = getTraceabilityService();

        // 샘플 데이터 생성
        createSampleTraceabilityData(batchId, cropType);

        // 데이터 조회
        const trace = service.getProductHistory(batchId);
        const chain = service.trackSupplyChain(batchId);

        setProductTrace(trace);
        setSupplyChain(chain);
        setIsLoading(false);
    }, [batchId, cropType]);

    const mintNFT = () => {
        if (productTrace) {
            const nft = mintProductNFT(productTrace);
            setNftCertificate(nft);
        }
    };

    const tabs = [
        { id: 'timeline' as const, label: '이력 추적', icon: '📜' },
        { id: 'supplychain' as const, label: '공급망', icon: '🔗' },
        { id: 'carbon' as const, label: '탄소 발자국', icon: '🌍' },
        { id: 'nft' as const, label: 'NFT 인증', icon: '🎨' },
    ];

    const recordTypeIcons: Record<string, string> = {
        seed_origin: '🌾',
        planting: '🌱',
        environment: '🌡️',
        nutrient: '💧',
        pest_control: '🛡️',
        harvest: '🌾',
        quality_check: '✅',
        packaging: '📦',
        storage: '🏪',
        transport: '🚚',
        distribution: '📍',
        retail: '🏬',
        certification: '📜'
    };

    if (isLoading || !productTrace) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-2 animate-pulse">⛓️</div>
                    <div className="text-white/50">블록체인 데이터 로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">⛓️</span>
                            블록체인 이력추적
                        </h2>
                        <div className="text-sm text-white/50 mt-1">
                            배치: {batchId} | {cropType}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {productTrace.verificationStatus.blockchain && (
                            <div className="px-3 py-1 bg-green-500/20 rounded-lg text-sm flex items-center gap-1">
                                <span className="text-green-400">✓</span> 블록체인 검증
                            </div>
                        )}
                        <a
                            href={productTrace.verificationStatus.qrCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white/10 rounded-lg text-sm"
                        >
                            📱 QR 코드
                        </a>
                    </div>
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
                    {/* 이력 타임라인 */}
                    {activeTab === 'timeline' && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* 농장 정보 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <span>🏡</span> 농장 정보
                                </h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">농장명</div>
                                        <div className="font-bold">{productTrace.farmInfo.name}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">위치</div>
                                        <div className="font-bold">{productTrace.farmInfo.location}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">작물</div>
                                        <div className="font-bold">{productTrace.cropType}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <div className="text-xs text-white/50">인증</div>
                                        <div className="flex gap-1 flex-wrap">
                                            {productTrace.farmInfo.certifications.map((cert, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 타임라인 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>📜</span> 이력 타임라인
                                </h3>
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-green-500 to-yellow-500" />
                                    <div className="space-y-4">
                                        {productTrace.timeline.map((event, i) => (
                                            <div key={event.id} className="flex gap-4 pl-8 relative">
                                                <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs ${event.verified ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}>
                                                    {event.verified ? '✓' : '?'}
                                                </div>
                                                <div className="flex-1 bg-white/5 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{recordTypeIcons[event.type]}</span>
                                                            <span className="font-medium">{event.description}</span>
                                                        </div>
                                                        <div className="text-xs text-white/40">
                                                            {new Date(event.timestamp).toLocaleString('ko-KR')}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs">
                                                        <span className="text-white/50">담당: {event.actor}</span>
                                                        <span className="text-white/30">|</span>
                                                        <span className="text-cyan-400 font-mono text-[10px]">
                                                            #{event.blockHash.substring(0, 12)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 품질 데이터 */}
                            {productTrace.qualityData.length > 0 && (
                                <div className="glass rounded-xl p-4">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <span>✅</span> 품질 검사 기록
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th className="text-left py-2">검사 항목</th>
                                                    <th className="text-center py-2">측정값</th>
                                                    <th className="text-center py-2">결과</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productTrace.qualityData[0]?.parameters.map((param, i) => (
                                                    <tr key={i} className="border-b border-white/5">
                                                        <td className="py-2 text-white/70">{param.name}</td>
                                                        <td className="py-2 text-center">
                                                            {param.value}{param.unit && ` ${param.unit}`}
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-xs ${param.pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                                }`}>
                                                                {param.pass ? '합격' : '불합격'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 공급망 */}
                    {activeTab === 'supplychain' && (
                        <motion.div
                            key="supplychain"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-xl p-4"
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span>🔗</span> 공급망 추적
                            </h3>

                            {/* 공급망 시각화 */}
                            <div className="flex items-center justify-between mb-6 overflow-x-auto py-4">
                                {['farm', 'processor', 'distributor', 'retailer', 'consumer'].map((type, i) => (
                                    <div key={type} className="flex items-center">
                                        <div className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center ${supplyChain.some(n => n.type === type)
                                                ? 'bg-gradient-to-br from-green-500/30 to-green-600/20 border border-green-500/30'
                                                : 'bg-white/5 border border-white/10'
                                            }`}>
                                            <span className="text-2xl">
                                                {type === 'farm' ? '🏡' :
                                                    type === 'processor' ? '🏭' :
                                                        type === 'distributor' ? '🚚' :
                                                            type === 'retailer' ? '🏬' : '👤'}
                                            </span>
                                            <span className="text-xs mt-1 text-white/60">
                                                {type === 'farm' ? '농장' :
                                                    type === 'processor' ? '가공' :
                                                        type === 'distributor' ? '유통' :
                                                            type === 'retailer' ? '소매' : '소비자'}
                                            </span>
                                        </div>
                                        {i < 4 && (
                                            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-green-500/30" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* 노드 상세 */}
                            <div className="space-y-2">
                                {supplyChain.map((node, i) => (
                                    <div key={node.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                            {node.type === 'farm' ? '🏡' :
                                                node.type === 'processor' ? '🏭' :
                                                    node.type === 'distributor' ? '🚚' : '🏬'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{node.name}</div>
                                            <div className="text-xs text-white/50">{node.location.address}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs px-2 py-0.5 rounded ${node.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    node.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-white/10'
                                                }`}>
                                                {node.status === 'completed' ? '완료' :
                                                    node.status === 'in_progress' ? '진행중' : '대기'}
                                            </div>
                                            <div className="text-xs text-white/40 mt-1">
                                                {new Date(node.timestamp).toLocaleDateString('ko-KR')}
                                            </div>
                                        </div>
                                        {node.conditions && (
                                            <div className="text-right">
                                                <div className="text-xs text-cyan-400">{node.conditions.temperature}°C</div>
                                                <div className="text-xs text-blue-400">{node.conditions.humidity}%</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 탄소 발자국 */}
                    {activeTab === 'carbon' && (
                        <motion.div
                            key="carbon"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🌍</span> 탄소 발자국 분석
                                </h3>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30 text-center">
                                        <div className="text-xs text-white/50 mb-1">총 탄소 배출</div>
                                        <div className="text-3xl font-bold text-green-400">
                                            {productTrace.carbonFootprint.total}
                                        </div>
                                        <div className="text-xs text-white/50">kg CO₂e</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-xs text-white/50 mb-1">업계 평균 대비</div>
                                        <div className="text-3xl font-bold text-cyan-400">
                                            -{productTrace.carbonFootprint.comparison.savings}%
                                        </div>
                                        <div className="text-xs text-white/50">절감</div>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-4 text-center">
                                        <div className="text-xs text-white/50 mb-1">친환경 순위</div>
                                        <div className="text-3xl font-bold text-yellow-400">
                                            {productTrace.carbonFootprint.comparison.ranking}
                                        </div>
                                    </div>
                                </div>

                                {/* 배출원별 분석 */}
                                <div className="bg-white/5 rounded-lg p-4 mb-4">
                                    <div className="text-sm font-bold mb-3">배출원별 분석</div>
                                    <div className="space-y-2">
                                        {productTrace.carbonFootprint.breakdown.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="w-16 text-sm text-white/70">{item.category}</span>
                                                <div className="flex-1 bg-white/10 rounded-full h-4">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-cyan-500 h-full rounded-full flex items-center justify-end pr-2"
                                                        style={{ width: `${item.percentage}%` }}
                                                    >
                                                        <span className="text-xs">{item.percentage}%</span>
                                                    </div>
                                                </div>
                                                <span className="w-16 text-right text-sm">{item.amount} kg</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 탄소 상쇄 */}
                                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-500/20">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-green-400">🌱 {productTrace.carbonFootprint.offset.status}</div>
                                            <div className="text-sm text-white/60">탄소 크레딧 {productTrace.carbonFootprint.offset.credits}개 보유</div>
                                        </div>
                                        <div className="text-4xl">🏆</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* NFT 인증 */}
                    {activeTab === 'nft' && (
                        <motion.div
                            key="nft"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass rounded-xl p-4"
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <span>🎨</span> NFT 디지털 인증서
                            </h3>

                            {nftCertificate ? (
                                <div className="space-y-4">
                                    {/* NFT 카드 */}
                                    <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-2xl p-6 border border-purple-500/30">
                                        <div className="text-center mb-4">
                                            <div className="text-6xl mb-2">🍓</div>
                                            <div className="text-xl font-bold">{nftCertificate.metadata.name}</div>
                                            <div className="text-sm text-white/50">Token ID: {nftCertificate.tokenId}</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {nftCertificate.metadata.attributes.map((attr, i) => (
                                                <div key={i} className="bg-white/5 rounded-lg p-3">
                                                    <div className="text-xs text-white/50">{attr.trait_type}</div>
                                                    <div className="font-bold">{attr.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 트랜잭션 정보 */}
                                    <div className="bg-white/5 rounded-lg p-4">
                                        <div className="text-sm font-bold mb-3">블록체인 정보</div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/50">소유자</span>
                                                <span>{nftCertificate.owner}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/50">발행일</span>
                                                <span>{new Date(nftCertificate.mintedAt).toLocaleDateString('ko-KR')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/50">트랜잭션</span>
                                                <span className="font-mono text-xs text-cyan-400">
                                                    {nftCertificate.transactionHash.substring(0, 20)}...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <div className="text-xl font-bold mb-2">NFT 인증서 발행</div>
                                    <div className="text-white/50 mb-6">
                                        이 제품의 고유한 디지털 인증서를 블록체인에 발행합니다.
                                    </div>
                                    <button
                                        onClick={mintNFT}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold hover:opacity-90 transition-opacity"
                                    >
                                        🚀 NFT 발행하기
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
