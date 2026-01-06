'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getHyperLogisticsEngine,
    Shipment,
    ShipmentStatistics,
    CreateShipmentConfig,
    ShippedProduct,
    SHIPMENT_STATUS_ICONS,
    SHIPMENT_TYPE_ICONS,
    DOCUMENT_TYPE_NAMES,
    ShipmentType,
    ShipmentStatus
} from '@/lib/logistics/hyperLogistics';

export default function LogisticsDashboard() {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [stats, setStats] = useState<ShipmentStatistics | null>(null);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'shipments' | 'create' | 'documents'>('overview');
    const [trackingInput, setTrackingInput] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const engine = useMemo(() => getHyperLogisticsEngine(), []);

    useEffect(() => {
        const updateData = () => {
            setShipments(engine.getAllShipments());
            setStats(engine.getShipmentStats());
        };
        updateData();

        const interval = setInterval(updateData, 5000);
        return () => clearInterval(interval);
    }, [engine]);

    const trackShipment = () => {
        if (!trackingInput.trim()) return;
        const shipment = engine.trackShipment(trackingInput.trim());
        if (shipment) {
            setSelectedShipment(shipment);
        } else {
            alert('배송을 찾을 수 없습니다.');
        }
    };

    const createSampleShipment = () => {
        setIsCreating(true);

        const products: ShippedProduct[] = [{
            id: 'prod-001',
            name: 'Premium Strawberries',
            koreanName: '프리미엄 딸기',
            quantity: 100,
            unit: 'box',
            weight: 5,
            volume: 0.02,
            hsCode: '0810.10',
            originCountry: 'Korea',
            value: 50,
            certificates: ['GAP', 'HACCP', 'phytosanitary'],
            storageConditions: {
                temperature: { min: 0, max: 5 },
                humidity: { min: 85, max: 95 },
                ventilation: true,
                lightSensitive: false,
                stackable: true,
                maxStack: 3
            },
            shelfLife: 14,
            harvestDate: new Date(),
            batchId: 'BATCH-2026-001'
        }];

        const config: CreateShipmentConfig = {
            shipmentType: 'cold_chain',
            carrierId: 'dhl_express',
            originId: 'agrinexus_farm',
            destinationAddress: {
                country: 'Japan',
                city: 'Tokyo',
                address: '1-1 Marunouchi, Chiyoda-ku'
            },
            products
        };

        const newShipment = engine.createShipment(config);
        setShipments(engine.getAllShipments());
        setStats(engine.getShipmentStats());
        setSelectedShipment(newShipment);
        setIsCreating(false);
        setActiveTab('shipments');
    };

    const tabs = [
        { id: 'overview' as const, label: '대시보드', icon: '📊' },
        { id: 'shipments' as const, label: '배송 관리', icon: '📦' },
        { id: 'create' as const, label: '신규 배송', icon: '➕' },
        { id: 'documents' as const, label: '서류 센터', icon: '📋' },
    ];

    const getStatusColor = (status: ShipmentStatus): string => {
        switch (status) {
            case 'delivered': return 'text-green-400';
            case 'in_transit': case 'out_for_delivery': return 'text-blue-400';
            case 'customs_hold': case 'pending': return 'text-yellow-400';
            case 'failed': case 'cancelled': return 'text-red-400';
            default: return 'text-white/70';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🚚</span>
                            초일류 글로벌 물류 시스템
                        </h2>
                        <div className="text-sm text-white/50">
                            항공 · 해상 · 육로 · 택배 · 콜드체인 통합 관리
                        </div>
                    </div>

                    {/* 실시간 추적 */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            placeholder="추적번호 입력..."
                            className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 focus:border-cyan-400 focus:outline-none w-48"
                            onKeyPress={(e) => e.key === 'Enter' && trackShipment()}
                        />
                        <button
                            onClick={trackShipment}
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-500/30"
                        >
                            🔍 추적
                        </button>
                    </div>
                </div>

                {/* 탭 */}
                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400'
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
                    {activeTab === 'overview' && stats && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto space-y-4"
                        >
                            {/* 주요 지표 */}
                            <div className="grid grid-cols-5 gap-4">
                                <div className="glass rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-white">{stats.total}</div>
                                    <div className="text-sm text-white/50">총 배송</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center bg-green-500/10 border border-green-500/30">
                                    <div className="text-4xl font-bold text-green-400">{stats.delivered}</div>
                                    <div className="text-sm text-white/50">배송 완료</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center bg-blue-500/10 border border-blue-500/30">
                                    <div className="text-4xl font-bold text-blue-400">{stats.inTransit}</div>
                                    <div className="text-sm text-white/50">운송 중</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-cyan-400">{stats.onTimeRate.toFixed(1)}%</div>
                                    <div className="text-sm text-white/50">정시 배송률</div>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <div className="text-4xl font-bold text-purple-400">{stats.averageDeliveryTime.toFixed(1)}일</div>
                                    <div className="text-sm text-white/50">평균 배송시간</div>
                                </div>
                            </div>

                            {/* 운송 유형별 현황 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📊 운송 유형별 현황</h3>
                                <div className="grid grid-cols-6 gap-3">
                                    {Object.entries(SHIPMENT_TYPE_ICONS).map(([type, icon]) => (
                                        <div key={type} className="bg-white/5 rounded-lg p-3 text-center">
                                            <div className="text-3xl mb-2">{icon}</div>
                                            <div className="text-xl font-bold">{stats.byType[type as ShipmentType] || 0}</div>
                                            <div className="text-xs text-white/50">
                                                {type === 'air_freight' ? '항공' :
                                                    type === 'sea_freight' ? '해상' :
                                                        type === 'road_freight' ? '육로' :
                                                            type === 'express_courier' ? '특급' :
                                                                type === 'cold_chain' ? '콜드체인' : '복합'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 최근 배송 */}
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📦 최근 배송</h3>
                                {shipments.length > 0 ? (
                                    <div className="space-y-2">
                                        {shipments.slice(0, 5).map(shipment => (
                                            <div
                                                key={shipment.id}
                                                onClick={() => { setSelectedShipment(shipment); setActiveTab('shipments'); }}
                                                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{SHIPMENT_TYPE_ICONS[shipment.type]}</span>
                                                    <div>
                                                        <div className="font-medium">{shipment.trackingNumber}</div>
                                                        <div className="text-xs text-white/50">
                                                            {shipment.origin.city} → {shipment.destination.city}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>{SHIPMENT_STATUS_ICONS[shipment.status]}</span>
                                                    <span className={getStatusColor(shipment.status)}>
                                                        {shipment.status === 'delivered' ? '배송완료' :
                                                            shipment.status === 'in_transit' ? '운송중' :
                                                                shipment.status === 'pending' ? '대기' : shipment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/50">
                                        배송 내역이 없습니다. 새 배송을 생성하세요.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 배송 관리 */}
                    {activeTab === 'shipments' && (
                        <motion.div
                            key="shipments"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full flex gap-4"
                        >
                            {/* 배송 목록 */}
                            <div className="w-1/3 glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-3">📋 배송 목록</h3>
                                {shipments.length > 0 ? (
                                    <div className="space-y-2">
                                        {shipments.map(shipment => (
                                            <button
                                                key={shipment.id}
                                                onClick={() => setSelectedShipment(shipment)}
                                                className={`w-full text-left p-3 rounded-lg transition-all ${selectedShipment?.id === shipment.id
                                                        ? 'bg-blue-500/30 border border-blue-400'
                                                        : 'bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="flex items-center gap-2">
                                                        <span>{SHIPMENT_TYPE_ICONS[shipment.type]}</span>
                                                        <span className="font-mono text-sm">{shipment.trackingNumber}</span>
                                                    </span>
                                                    <span>{SHIPMENT_STATUS_ICONS[shipment.status]}</span>
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    {shipment.origin.city} → {shipment.destination.city}
                                                </div>
                                                <div className="text-xs text-white/40 mt-1">
                                                    {shipment.products.length}개 품목 · {shipment.costs.total.toLocaleString()}원
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/50">
                                        배송 없음
                                    </div>
                                )}
                            </div>

                            {/* 배송 상세 */}
                            <div className="w-2/3 glass rounded-xl p-4 overflow-y-auto">
                                {selectedShipment ? (
                                    <div className="space-y-4">
                                        {/* 헤더 */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl">{SHIPMENT_TYPE_ICONS[selectedShipment.type]}</span>
                                                    <div>
                                                        <h3 className="text-xl font-bold font-mono">{selectedShipment.trackingNumber}</h3>
                                                        <div className="text-sm text-white/50">{selectedShipment.carrier.name}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedShipment.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                    selectedShipment.status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {SHIPMENT_STATUS_ICONS[selectedShipment.status]}
                                                {selectedShipment.status === 'delivered' ? '배송완료' :
                                                    selectedShipment.status === 'in_transit' ? '운송중' :
                                                        selectedShipment.status === 'pending' ? '대기중' : selectedShipment.status}
                                            </div>
                                        </div>

                                        {/* 경로 */}
                                        <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-lg p-4">
                                            <div>
                                                <div className="text-xs text-white/50">출발지</div>
                                                <div className="font-medium">{selectedShipment.origin.city}</div>
                                                <div className="text-xs text-white/40">{selectedShipment.origin.country}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl">✈️→</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-white/50">도착지</div>
                                                <div className="font-medium">{selectedShipment.destination.city}</div>
                                                <div className="text-xs text-white/40">{selectedShipment.destination.country}</div>
                                            </div>
                                        </div>

                                        {/* 타임라인 */}
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <h4 className="font-medium mb-3">📍 배송 타임라인</h4>
                                            <div className="space-y-2">
                                                {selectedShipment.timeline.map((event, i) => (
                                                    <div key={event.id} className="flex items-start gap-3">
                                                        <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5" />
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-medium text-sm">{event.description}</span>
                                                                <span className="text-xs text-white/50">
                                                                    {new Date(event.timestamp).toLocaleString('ko-KR')}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-white/40">{event.location.city}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 비용 */}
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <h4 className="font-medium mb-3">💰 비용 내역</h4>
                                            <div className="space-y-1 text-sm">
                                                {selectedShipment.costs.breakdown.slice(0, 5).map((item, i) => (
                                                    <div key={i} className="flex justify-between">
                                                        <span className="text-white/60">{item.category}</span>
                                                        <span>{item.amount.toLocaleString()}원</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                                                    <span>총계</span>
                                                    <span className="text-green-400">{selectedShipment.costs.total.toLocaleString()}원</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 환경 모니터링 */}
                                        {selectedShipment.environmentControl.required && (
                                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                                    ❄️ 콜드체인 모니터링
                                                </h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-cyan-400">
                                                            {selectedShipment.environmentControl.temperature.current}°C
                                                        </div>
                                                        <div className="text-xs text-white/50">현재 온도</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-blue-400">
                                                            {selectedShipment.environmentControl.humidity.current}%
                                                        </div>
                                                        <div className="text-xs text-white/50">습도</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-green-400">
                                                            {selectedShipment.environmentControl.alerts.length === 0 ? '정상' : '주의'}
                                                        </div>
                                                        <div className="text-xs text-white/50">상태</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/50">
                                        ← 왼쪽에서 배송을 선택하세요
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* 신규 배송 */}
                    {activeTab === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto"
                        >
                            <div className="glass rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-6">➕ 새 배송 생성</h3>

                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-white/60 mb-6">
                                        새로운 배송을 생성하고 실시간으로 추적하세요.<br />
                                        콜드체인, 통관, 문서 관리까지 모든 것을 한 곳에서 관리합니다.
                                    </p>

                                    <button
                                        onClick={createSampleShipment}
                                        disabled={isCreating}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50"
                                    >
                                        {isCreating ? '생성 중...' : '🍓 샘플 딸기 배송 생성 (일본 도쿄)'}
                                    </button>

                                    <div className="mt-8 grid grid-cols-4 gap-4 text-sm">
                                        {['항공화물', '해상화물', '특급택배', '콜드체인'].map(type => (
                                            <div key={type} className="bg-white/5 rounded-lg p-4">
                                                <div className="text-2xl mb-2">
                                                    {type === '항공화물' ? '✈️' : type === '해상화물' ? '🚢' : type === '특급택배' ? '📮' : '❄️'}
                                                </div>
                                                <div>{type}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 서류 센터 */}
                    {activeTab === 'documents' && (
                        <motion.div
                            key="documents"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-full overflow-y-auto"
                        >
                            <div className="glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📋 물류 서류 센터</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {Object.entries(DOCUMENT_TYPE_NAMES).map(([type, name]) => (
                                        <div key={type} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition-all">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">
                                                    {type.includes('invoice') ? '📄' :
                                                        type.includes('packing') ? '📦' :
                                                            type.includes('bill') || type.includes('waybill') ? '🚢' :
                                                                type.includes('certificate') ? '📜' :
                                                                    type.includes('declaration') ? '🏛️' : '📋'}
                                                </span>
                                                <div>
                                                    <div className="font-medium">{name}</div>
                                                    <div className="text-xs text-white/50">{type}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-1 bg-blue-500/20 rounded text-xs text-blue-400">
                                                    새로 작성
                                                </button>
                                                <button className="flex-1 py-1 bg-white/10 rounded text-xs">
                                                    템플릿
                                                </button>
                                            </div>
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
