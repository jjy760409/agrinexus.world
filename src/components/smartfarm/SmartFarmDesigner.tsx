'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import { EQUIPMENT_CATALOG, AI_AGENTS, COUNTRY_PRESETS, SEED_CATALOG } from '@/lib/smartfarm/farmData';
import { CountryPreset, Equipment, AIAgent, SeedVariety, FarmType } from '@/types/smartfarm';
import EquipmentPanel from './EquipmentPanel';
import AIAgentPanel from './AIAgentPanel';
import SimulationPanel from './SimulationPanel';
import Farm3DScene from './Farm3DScene';
import FileUploadAnalyzer from '@/components/upload/FileUploadAnalyzer';

type DesignerTab = 'design' | 'upload' | 'equipment' | 'agents' | 'simulation' | 'whitepaper';

export default function SmartFarmDesigner() {
    const [activeTab, setActiveTab] = useState<DesignerTab>('design');
    const [selectedCountry, setSelectedCountry] = useState<CountryPreset>(COUNTRY_PRESETS[0]);
    const [farmType, setFarmType] = useState<FarmType>('vertical');
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
    const [selectedSeeds, setSelectedSeeds] = useState<SeedVariety[]>([]);
    const [farmDimensions, setFarmDimensions] = useState({ width: 10, length: 20, height: 4, floors: 3 });
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationDay, setSimulationDay] = useState(0);
    const orbitControlsRef = useRef<any>(null);
    const [cameraView, setCameraView] = useState<'free' | 'top' | 'front' | 'side' | 'isometric'>('free');

    // Calculate stats
    const totalPower = selectedEquipment.reduce((acc, eq) => acc + eq.powerConsumption, 0);
    const activeAgents = AI_AGENTS.filter(a => a.status === 'active').length;
    const growingArea = farmDimensions.width * farmDimensions.length * farmDimensions.floors;

    const tabs = [
        { id: 'design' as const, label: '3D 설계', icon: '🏗️' },
        { id: 'upload' as const, label: '파일 업로드', icon: '📁' },
        { id: 'equipment' as const, label: '장비 설정', icon: '⚙️' },
        { id: 'agents' as const, label: 'AI 에이전트', icon: '🤖' },
        { id: 'simulation' as const, label: '시뮬레이션', icon: '📊' },
        { id: 'whitepaper' as const, label: '백서', icon: '📄' },
    ];

    // Camera presets for 3D view
    const cameraPresets = [
        { id: 'free' as const, label: '자유', icon: '🔄' },
        { id: 'top' as const, label: '상단', icon: '⬆️' },
        { id: 'front' as const, label: '정면', icon: '⏩' },
        { id: 'side' as const, label: '측면', icon: '↔️' },
        { id: 'isometric' as const, label: '등각', icon: '📐' },
    ];

    const setCameraPosition = (view: typeof cameraView) => {
        setCameraView(view);
        if (orbitControlsRef.current) {
            const distance = Math.max(farmDimensions.width, farmDimensions.length) * 1.5;
            switch (view) {
                case 'top':
                    orbitControlsRef.current.object.position.set(0, distance, 0.01);
                    break;
                case 'front':
                    orbitControlsRef.current.object.position.set(0, distance / 2, distance);
                    break;
                case 'side':
                    orbitControlsRef.current.object.position.set(distance, distance / 2, 0);
                    break;
                case 'isometric':
                    orbitControlsRef.current.object.position.set(distance * 0.7, distance * 0.7, distance * 0.7);
                    break;
                default:
                    orbitControlsRef.current.object.position.set(15, 10, 15);
            }
            orbitControlsRef.current.target.set(0, 0, 0);
            orbitControlsRef.current.update();
        }
    };

    const farmTypes = [
        { type: 'vertical' as const, label: '수직 농장', icon: '🏢' },
        { type: 'container' as const, label: '컨테이너', icon: '📦' },
        { type: 'greenhouse' as const, label: '유리 온실', icon: '🏠' },
        { type: 'indoor' as const, label: '실내 농장', icon: '🏭' },
        { type: 'rooftop' as const, label: '옥상 농장', icon: '🌆' },
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🌱</span>
                        <div>
                            <h1 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text">
                                스마트팜 3D 설계 시스템
                            </h1>
                            <p className="text-sm text-white/60">AI 전자동화 실내 스마트팜 가상 설계</p>
                        </div>
                    </div>

                    {/* Country Selector */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">국가:</span>
                            <select
                                value={selectedCountry.code}
                                onChange={(e) => setSelectedCountry(COUNTRY_PRESETS.find(c => c.code === e.target.value) || COUNTRY_PRESETS[0])}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                            >
                                {COUNTRY_PRESETS.map(country => (
                                    <option key={country.code} value={country.code} className="bg-[var(--bg-dark)]">
                                        {country.flag} {country.koreanName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs text-white/50">면적</span>
                                <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                    {growingArea}m²
                                </span>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs text-white/50">전력</span>
                                <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                    {(totalPower / 1000).toFixed(1)}kW
                                </span>
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <span className="text-xs text-white/50">AI</span>
                                <span className="ml-2 font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)]">
                                    {activeAgents} 활성
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)]'
                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* 3D Design Tab */}
                    {activeTab === 'design' && (
                        <motion.div
                            key="design"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full flex gap-4"
                        >
                            {/* Left Panel - Settings */}
                            <div className="w-80 glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🏗️</span> 농장 설정
                                </h3>

                                {/* Farm Type */}
                                <div className="mb-4">
                                    <label className="text-sm text-white/60 block mb-2">농장 유형</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {farmTypes.map(ft => (
                                            <button
                                                key={ft.type}
                                                onClick={() => setFarmType(ft.type)}
                                                className={`p-2 rounded-lg text-sm flex items-center gap-2 transition-all ${farmType === ft.type
                                                    ? 'bg-[var(--primary-green)]/20 border border-[var(--primary-green)]'
                                                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <span>{ft.icon}</span>
                                                {ft.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dimensions */}
                                <div className="mb-4">
                                    <label className="text-sm text-white/60 block mb-2">크기 (m)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-xs text-white/40">가로</span>
                                            <input
                                                type="number"
                                                value={farmDimensions.width}
                                                onChange={(e) => setFarmDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                                                className="w-full mt-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs text-white/40">세로</span>
                                            <input
                                                type="number"
                                                value={farmDimensions.length}
                                                onChange={(e) => setFarmDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                                                className="w-full mt-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs text-white/40">높이</span>
                                            <input
                                                type="number"
                                                value={farmDimensions.height}
                                                onChange={(e) => setFarmDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                                                className="w-full mt-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-xs text-white/40">층수</span>
                                            <input
                                                type="number"
                                                value={farmDimensions.floors}
                                                onChange={(e) => setFarmDimensions(prev => ({ ...prev, floors: Number(e.target.value) }))}
                                                className="w-full mt-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Country Info */}
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{selectedCountry.flag}</span>
                                        <div>
                                            <div className="font-medium">{selectedCountry.koreanName}</div>
                                            <div className="text-xs text-white/50">{selectedCountry.climate} 기후</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-white/60">
                                        <div>⚡ 전기: ${selectedCountry.avgElectricityCost}/kWh</div>
                                        <div>💧 수도: ${selectedCountry.waterCost}/m³</div>
                                        <div>👷 인건비: ${selectedCountry.laborCost}/hr</div>
                                    </div>
                                </div>

                                {/* Seed Selection */}
                                <div className="mt-4">
                                    <label className="text-sm text-white/60 block mb-2">재배 작물</label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {SEED_CATALOG.map(seed => (
                                            <button
                                                key={seed.id}
                                                onClick={() => {
                                                    if (selectedSeeds.find(s => s.id === seed.id)) {
                                                        setSelectedSeeds(prev => prev.filter(s => s.id !== seed.id));
                                                    } else {
                                                        setSelectedSeeds(prev => [...prev, seed]);
                                                    }
                                                }}
                                                className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 transition-all ${selectedSeeds.find(s => s.id === seed.id)
                                                    ? 'bg-[var(--primary-green)]/20 border border-[var(--primary-green)]'
                                                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <span className="text-lg">{seed.icon}</span>
                                                <div>
                                                    <div>{seed.koreanName}</div>
                                                    <div className="text-xs text-white/40">{seed.growthDays}일 재배</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 3D View */}
                            <div className="flex-1 glass rounded-xl overflow-hidden relative">
                                {/* Camera Controls UI */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                    <div className="glass rounded-lg p-2">
                                        <div className="text-xs text-white/50 mb-2">카메라 뷰</div>
                                        <div className="grid grid-cols-5 gap-1">
                                            {cameraPresets.map(preset => (
                                                <button
                                                    key={preset.id}
                                                    onClick={() => setCameraPosition(preset.id)}
                                                    className={`px-2 py-1 rounded text-xs flex flex-col items-center ${cameraView === preset.id ? 'bg-[var(--primary-green)] text-[var(--bg-dark)]' : 'bg-white/10 hover:bg-white/20'}`}
                                                    title={preset.label}
                                                >
                                                    <span>{preset.icon}</span>
                                                    <span className="text-[0.6rem] hidden md:block">{preset.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 3D Controls Info */}
                                <div className="absolute bottom-4 left-4 z-10 glass rounded-lg px-3 py-2 text-xs text-white/60">
                                    <div className="flex items-center gap-4">
                                        <span>🖱️ 드래그: 회전</span>
                                        <span>⚙️ 스크롤: 줌</span>
                                        <span>🔄 Shift+드래그: 이동</span>
                                    </div>
                                </div>

                                <Canvas>
                                    <Suspense fallback={null}>
                                        <PerspectiveCamera makeDefault position={[15, 10, 15]} />
                                        <OrbitControls
                                            ref={orbitControlsRef}
                                            enablePan
                                            enableZoom
                                            enableRotate
                                            minDistance={5}
                                            maxDistance={100}
                                            minPolarAngle={0}
                                            maxPolarAngle={Math.PI / 2}
                                        />
                                        <ambientLight intensity={0.5} />
                                        <pointLight position={[10, 10, 10]} intensity={1} />
                                        <pointLight position={[-10, 10, -10]} intensity={0.5} />
                                        <Farm3DScene
                                            farmType={farmType}
                                            dimensions={farmDimensions}
                                            equipment={selectedEquipment}
                                        />
                                        <Grid
                                            args={[50, 50]}
                                            cellSize={1}
                                            cellThickness={0.5}
                                            cellColor="#00ff8833"
                                            sectionSize={5}
                                            sectionThickness={1}
                                            sectionColor="#00ff8866"
                                        />
                                        <Environment preset="city" />
                                    </Suspense>
                                </Canvas>
                            </div>
                        </motion.div>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full overflow-y-auto glass rounded-xl p-6"
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] gradient-text mb-2">
                                        📁 스마트팜 자료 업로드
                                    </h2>
                                    <p className="text-white/60">
                                        설계도, 평면도, 이미지, 문서 등을 업로드하면 AI 에이전트가 자동으로 분석하여
                                        최적의 스마트팜 설계를 제안합니다.
                                    </p>
                                </div>

                                <FileUploadAnalyzer
                                    onFileAnalyzed={(file) => {
                                        console.log('File analyzed:', file);
                                        // 분석된 파일 데이터를 3D 설계에 반영할 수 있습니다
                                        if (file.analysis?.extractedData.dimensions) {
                                            const dims = file.analysis.extractedData.dimensions;
                                            setFarmDimensions(prev => ({
                                                ...prev,
                                                width: dims.width,
                                                length: dims.height,
                                                height: dims.depth || prev.height,
                                            }));
                                        }
                                    }}
                                />

                                <div className="mt-6 p-4 rounded-xl bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30">
                                    <h4 className="font-medium text-[var(--primary-green)] mb-2">💡 AI 설계 지원</h4>
                                    <ul className="text-sm text-white/70 space-y-1">
                                        <li>• 설계도면 업로드 → 자동 구역 분석 및 최적화 제안</li>
                                        <li>• 스프레드시트 업로드 → 비용/수익 분석 및 ROI 계산</li>
                                        <li>• 이미지 업로드 → 시설 상태 진단 및 개선점 도출</li>
                                        <li>• 3D 모델 업로드 → 실시간 환경 시뮬레이션</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Equipment Tab */}
                    {activeTab === 'equipment' && (
                        <motion.div
                            key="equipment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <EquipmentPanel
                                selectedEquipment={selectedEquipment}
                                onEquipmentChange={setSelectedEquipment}
                            />
                        </motion.div>
                    )}

                    {/* AI Agents Tab */}
                    {activeTab === 'agents' && (
                        <motion.div
                            key="agents"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <AIAgentPanel />
                        </motion.div>
                    )}

                    {/* Simulation Tab */}
                    {activeTab === 'simulation' && (
                        <motion.div
                            key="simulation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <SimulationPanel
                                seeds={selectedSeeds}
                                equipment={selectedEquipment}
                                country={selectedCountry}
                                dimensions={farmDimensions}
                            />
                        </motion.div>
                    )}

                    {/* Whitepaper Tab */}
                    {activeTab === 'whitepaper' && (
                        <motion.div
                            key="whitepaper"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full overflow-y-auto glass rounded-xl p-6"
                        >
                            <div className="max-w-4xl mx-auto prose prose-invert">
                                <h1 className="gradient-text font-[family-name:var(--font-orbitron)]">
                                    📄 AgriNexus World OS 스마트팜 백서
                                </h1>

                                <div className="p-4 rounded-xl bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30 mb-6">
                                    <h3 className="text-[var(--primary-green)] mt-0">🌱 비전</h3>
                                    <p className="mb-0">
                                        AgriNexus World OS는 AI 전자동화 기술을 통해 전세계 어디서나 최적의 스마트팜을
                                        구축할 수 있는 완전 자율 농업 운영체제입니다. 종자 선택부터 수확까지 전 과정을
                                        8개의 전문 AI 에이전트가 24시간 관리합니다.
                                    </p>
                                </div>

                                <h2>🏗️ 시스템 아키텍처</h2>
                                <ul>
                                    <li><strong>구조 시스템</strong>: 수직 재배 랙, NFT 트레이, 다층 구조</li>
                                    <li><strong>조명 시스템</strong>: 풀 스펙트럼 LED, UV-C 살균, 자동 광주기</li>
                                    <li><strong>공조 시스템</strong>: 정밀 기후 제어, CO2 주입, 공기 순환</li>
                                    <li><strong>관개 시스템</strong>: 자동 양액 배합, pH/EC 제어, 점적 관수</li>
                                    <li><strong>IoT 센서망</strong>: 환경, 토양, 수질, 비전 모니터링</li>
                                    <li><strong>제어 시스템</strong>: 중앙 제어, 구역별 제어, Edge AI</li>
                                    <li><strong>전력 시스템</strong>: 스마트 배전, UPS 백업, 에너지 최적화</li>
                                </ul>

                                <h2>🤖 AI 에이전트 시스템</h2>
                                <div className="grid grid-cols-2 gap-4 not-prose">
                                    {AI_AGENTS.slice(0, 4).map(agent => (
                                        <div key={agent.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="font-bold text-[var(--primary-cyan)]">{agent.code}</div>
                                            <div className="text-sm text-white/70">{agent.role}</div>
                                            <div className="text-xs text-white/50 mt-1">신뢰도: {agent.confidence}%</div>
                                        </div>
                                    ))}
                                </div>

                                <h2>🌍 글로벌 적용</h2>
                                <p>
                                    {COUNTRY_PRESETS.length}개국의 환경, 규정, 비용 구조에 최적화된 프리셋을 제공합니다.
                                    각 국가의 기후, 전력, 수도, 인건비, 인센티브를 고려하여 최적의 설계를 자동 생성합니다.
                                </p>

                                <h2>📊 예상 ROI</h2>
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th>항목</th>
                                            <th>수치</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>초기 투자비</td><td>₩{(growingArea * 2000000).toLocaleString()}</td></tr>
                                        <tr><td>월 운영비</td><td>₩{(growingArea * 50000).toLocaleString()}</td></tr>
                                        <tr><td>예상 월 수익</td><td>₩{(growingArea * 150000).toLocaleString()}</td></tr>
                                        <tr><td>손익분기점</td><td>약 18-24개월</td></tr>
                                    </tbody>
                                </table>

                                <h2>🚀 다음 단계</h2>
                                <ol>
                                    <li>3D 설계 탭에서 농장 유형과 크기를 설정합니다</li>
                                    <li>장비 설정 탭에서 필요한 설비를 선택합니다</li>
                                    <li>AI 에이전트 탭에서 자동화 수준을 확인합니다</li>
                                    <li>시뮬레이션 탭에서 전체 생장 과정을 미리 봅니다</li>
                                </ol>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
