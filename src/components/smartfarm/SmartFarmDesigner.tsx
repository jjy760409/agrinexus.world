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
import TransparentFarm from './TransparentFarm';
import FullAutomationSimulation from './FullAutomationSimulation';
import CropInfoPanel from './CropInfoPanel';
import EquipmentInfoPanel from './EquipmentInfoPanel';
import AIDashboard from './AIDashboard';
import TraceabilityPanel from './TraceabilityPanel';
import PlantConversationPanel from './PlantConversationPanel';
import SwarmRoboticsPanel from './SwarmRoboticsPanel';
import SpaceAgriculturePanel from './SpaceAgriculturePanel';
import DNAEditorPanel from './DNAEditorPanel';
import LogisticsDashboard from './LogisticsDashboard';
import HologramPanel from './HologramPanel';
import QuantumNetworkPanel from './QuantumNetworkPanel';
import BlockchainExchangePanel from './BlockchainExchangePanel';
import NegotiationPanel from './NegotiationPanel';
import FileUploadAnalyzer from '@/components/upload/FileUploadAnalyzer';
import SuperAgentPanel from './SuperAgentPanel';

type DesignerTab = 'design' | 'automation' | 'crops' | 'systems' | 'ai' | 'traceability' | 'conversation' | 'swarm' | 'space' | 'dna' | 'logistics' | 'hologram' | 'quantum' | 'blockchain' | 'negotiation' | 'telepathy' | 'biophoton' | 'chrono' | 'water' | 'rootai' | 'gravity' | 'emotion' | 'molecular' | 'bioelectric' | 'weathereng' | 'seedopt' | 'superagent' | 'upload' | 'equipment' | 'agents' | 'simulation' | 'whitepaper';

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
        { id: 'automation' as const, label: '🍓 전자동화', icon: '🏭' },
        { id: 'hologram' as const, label: '🔮 홀로그램', icon: '✨' },
        { id: 'quantum' as const, label: '⚛️ 양자통신', icon: '🌐' },
        { id: 'blockchain' as const, label: '⛓️ 블록체인', icon: '💎' },
        { id: 'negotiation' as const, label: '🤖 AI협상', icon: '🤝' },
        { id: 'telepathy' as const, label: '🔮 식물텔레파시', icon: '💭' },
        { id: 'biophoton' as const, label: '✨ 생체광자', icon: '💫' },
        { id: 'chrono' as const, label: '⏩ 시간농업', icon: '⏰' },
        { id: 'water' as const, label: '💧 대기수분', icon: '🌫️' },
        { id: 'rootai' as const, label: '🧠 뿌리AI', icon: '🌿' },
        { id: 'gravity' as const, label: '🌍 중력제어', icon: '🚀' },
        { id: 'emotion' as const, label: '💖 식물감정', icon: '😊' },
        { id: 'molecular' as const, label: '⚗️ 분자조립', icon: '🔬' },
        { id: 'bioelectric' as const, label: '⚡ 생체전기', icon: '🔋' },
        { id: 'weathereng' as const, label: '🌤️ 기상공학', icon: '☁️' },
        { id: 'seedopt' as const, label: '🌱 양자종자', icon: '✨' },
        { id: 'superagent' as const, label: '🦸 슈퍼에이전트', icon: '🤖' },
        { id: 'conversation' as const, label: '🌿 식물대화', icon: '💬' },
        { id: 'swarm' as const, label: '🤖 군집로봇', icon: '🐝' },
        { id: 'space' as const, label: '🚀 우주농업', icon: '🌌' },
        { id: 'dna' as const, label: '🧬 DNA편집', icon: '✂️' },
        { id: 'logistics' as const, label: '🚚 글로벌물류', icon: '📦' },
        { id: 'crops' as const, label: '작물 정보', icon: '🌱' },
        { id: 'systems' as const, label: '설비 시스템', icon: '⚡' },
        { id: 'ai' as const, label: 'AI 분석', icon: '🧠' },
        { id: 'traceability' as const, label: '이력추적', icon: '⛓️' },
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
        { type: 'underground' as const, label: '지하 농장', icon: '🔽' },
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
                                        <TransparentFarm
                                            farmType={farmType}
                                            dimensions={farmDimensions}
                                            autoRotate={cameraView === 'free'}
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

                    {/* Automation Tab - Full 3D Simulation */}
                    {activeTab === 'automation' && (
                        <motion.div
                            key="automation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full flex gap-4"
                        >
                            {/* Left Panel - Info */}
                            <div className="w-72 glass rounded-xl p-4 overflow-y-auto">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <span>🍓</span> 딸기 전자동화 시스템
                                </h3>

                                <div className="space-y-4">
                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">🌱 재배 구역</div>
                                        <p className="text-xs text-white/60">다층 수경재배 시스템에서 딸기가 자라고 있습니다. LED 조명이 최적 스펙트럼을 제공합니다.</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">🤖 수확 로봇</div>
                                        <p className="text-xs text-white/60">AI 비전으로 익은 딸기를 감지하고 자동으로 수확합니다.</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">🔍 선별 라인</div>
                                        <p className="text-xs text-white/60">컴퓨터 비전이 등급별로 자동 분류합니다. A/B/C 등급.</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">📦 포장 라인</div>
                                        <p className="text-xs text-white/60">트레이 공급 → 딸기 충전 → 라벨링 → 밀봉 자동화.</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">📤 박스 포장</div>
                                        <p className="text-xs text-white/60">로봇 암이 완제품을 박스에 담아 팔레트에 적재합니다.</p>
                                    </div>

                                    <div className="p-3 rounded-lg bg-white/5">
                                        <div className="text-sm font-medium mb-2">🚚 물류 배송</div>
                                        <p className="text-xs text-white/60">지게차가 팔레트를 트럭에 상차하고 배송됩니다.</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30">
                                    <div className="text-sm font-bold text-green-400">✨ 완전 자동화</div>
                                    <p className="text-xs text-white/60 mt-1">씨앗부터 배송까지 100% 무인 운영 가능</p>
                                </div>
                            </div>

                            {/* 3D Simulation Canvas */}
                            <div className="flex-1 glass rounded-xl overflow-hidden relative">
                                <div className="absolute top-4 left-4 z-10 glass rounded-lg px-4 py-2">
                                    <div className="text-sm font-bold text-green-400">🍓 Strawberry Farm Full Automation</div>
                                    <div className="text-xs text-white/60">실시간 시뮬레이션 진행 중</div>
                                </div>

                                <Canvas camera={{ position: [25, 15, 25], fov: 50 }}>
                                    <Suspense fallback={null}>
                                        <OrbitControls
                                            enablePan
                                            enableZoom
                                            enableRotate
                                            minDistance={10}
                                            maxDistance={80}
                                        />
                                        <ambientLight intensity={0.4} />
                                        <pointLight position={[20, 20, 20]} intensity={1} />
                                        <pointLight position={[-20, 15, -20]} intensity={0.5} />
                                        <directionalLight position={[10, 20, 10]} intensity={0.5} />

                                        <FullAutomationSimulation
                                            dimensions={farmDimensions}
                                            simulationSpeed={1}
                                        />

                                        <Grid
                                            args={[80, 80]}
                                            cellSize={2}
                                            cellThickness={0.5}
                                            cellColor="#00ff8822"
                                            sectionSize={10}
                                            sectionThickness={1}
                                            sectionColor="#00ff8844"
                                        />
                                        <Environment preset="warehouse" />
                                    </Suspense>
                                </Canvas>
                            </div>
                        </motion.div>
                    )}

                    {/* Crops Info Tab */}
                    {activeTab === 'crops' && (
                        <motion.div
                            key="crops"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <CropInfoPanel
                                farmArea={growingArea}
                                onCropSelect={(crop) => console.log('Selected crop:', crop)}
                            />
                        </motion.div>
                    )}

                    {/* Systems Info Tab */}
                    {activeTab === 'systems' && (
                        <motion.div
                            key="systems"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <EquipmentInfoPanel
                                farmArea={growingArea}
                                onEquipmentSelect={(eq) => console.log('Selected equipment:', eq)}
                            />
                        </motion.div>
                    )}

                    {/* AI Dashboard Tab */}
                    {activeTab === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <AIDashboard
                                farmProfile={{
                                    location: { country: 'Korea', region: 'Seoul', climate: 'temperate', latitude: 37.5, longitude: 127 },
                                    facility: { type: farmType, area: growingArea, height: farmDimensions.height, floors: farmDimensions.floors, existingEquipment: [] },
                                    budget: { initial: 100000000, monthly: 5000000, targetROI: 20, paybackMonths: 36 },
                                    experience: 'intermediate',
                                    goals: ['profit', 'sustainability'],
                                    preferences: { cropTypes: [], automationLevel: 'high', organicCertification: true, exportFocus: false },
                                    constraints: { laborAvailable: 2, electricityLimit: 50, waterLimit: 5000 }
                                }}
                                selectedCropId="strawberry"
                            />
                        </motion.div>
                    )}

                    {/* Traceability Tab */}
                    {activeTab === 'traceability' && (
                        <motion.div
                            key="traceability"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <TraceabilityPanel
                                batchId="BATCH-2026-001"
                                cropType="딸기"
                            />
                        </motion.div>
                    )}

                    {/* Plant Conversation Tab - 세계 최초 식물 대화 */}
                    {activeTab === 'conversation' && (
                        <motion.div
                            key="conversation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <PlantConversationPanel
                                plantId="plant-001"
                                cropType="딸기"
                            />
                        </motion.div>
                    )}

                    {/* Swarm Robotics Tab - 군집 마이크로 로봇 */}
                    {activeTab === 'swarm' && (
                        <motion.div
                            key="swarm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <SwarmRoboticsPanel />
                        </motion.div>
                    )}

                    {/* Space Agriculture Tab - 우주 농업 */}
                    {activeTab === 'space' && (
                        <motion.div
                            key="space"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <SpaceAgriculturePanel />
                        </motion.div>
                    )}

                    {/* DNA Editor Tab - CRISPR 편집 시뮬레이터 */}
                    {activeTab === 'dna' && (
                        <motion.div
                            key="dna"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <DNAEditorPanel />
                        </motion.div>
                    )}

                    {/* Logistics Dashboard - 글로벌 물류 */}
                    {activeTab === 'logistics' && (
                        <motion.div
                            key="logistics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <LogisticsDashboard />
                        </motion.div>
                    )}

                    {/* Hologram Tab - 홀로그램 3D 시각화 */}
                    {activeTab === 'hologram' && (
                        <motion.div
                            key="hologram"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <HologramPanel />
                        </motion.div>
                    )}

                    {/* Quantum Tab - 양자 통신 네트워크 */}
                    {activeTab === 'quantum' && (
                        <motion.div
                            key="quantum"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <QuantumNetworkPanel />
                        </motion.div>
                    )}

                    {/* Blockchain Tab - 블록체인 거래소 */}
                    {activeTab === 'blockchain' && (
                        <motion.div
                            key="blockchain"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <BlockchainExchangePanel />
                        </motion.div>
                    )}

                    {/* Negotiation Tab - AI 자동 협상 */}
                    {activeTab === 'negotiation' && (
                        <motion.div
                            key="negotiation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="h-full"
                        >
                            <NegotiationPanel />
                        </motion.div>
                    )}

                    {/* Telepathy Tab */}
                    {activeTab === 'telepathy' && (
                        <motion.div key="telepathy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🔮</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">식물 텔레파시 네트워크</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 식물 간 양자 통신 & 공유 의식 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">🍄</div><div className="font-bold">균근 연결</div></div>
                                    <div className="bg-pink-500/20 border border-pink-500 rounded-xl p-4"><div className="text-3xl mb-2">💭</div><div className="font-bold">공유 의식</div></div>
                                    <div className="bg-cyan-500/20 border border-cyan-500 rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><div className="font-bold">신호 전송</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">🧠</div><div className="font-bold">집단 지능</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Biophoton Tab */}
                    {activeTab === 'biophoton' && (
                        <motion.div key="biophoton" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">✨</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">생체광자 에너지 수확</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 식물 발광 에너지 수집 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">💫</div><div className="font-bold">광자 수집</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">🔋</div><div className="font-bold">양자 배터리</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><div className="font-bold">자가 발전</div></div>
                                    <div className="bg-emerald-500/20 border border-emerald-500 rounded-xl p-4"><div className="text-3xl mb-2">🌍</div><div className="font-bold">탄소 상쇄</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Chrono Tab */}
                    {activeTab === 'chrono' && (
                        <motion.div key="chrono" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">⏩</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">시간 농업 엔진</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 시간 조작 기반 성장 가속 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-indigo-500/20 border border-indigo-500 rounded-xl p-4"><div className="text-3xl mb-2">⏱️</div><div className="font-bold">시간 가속</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">📅</div><div className="font-bold">일주기 조절</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">📈</div><div className="font-bold">수확량 증가</div></div>
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">💰</div><div className="font-bold">경제 이익</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Water Tab */}
                    {activeTab === 'water' && (
                        <motion.div key="water" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">💧</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">대기 수분 생성기</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 나노 테크 대기 수분 수집 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">🌫️</div><div className="font-bold">나노 메쉬</div></div>
                                    <div className="bg-cyan-500/20 border border-cyan-500 rounded-xl p-4"><div className="text-3xl mb-2">🧊</div><div className="font-bold">MOF 흡착</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">☀️</div><div className="font-bold">태양광 구동</div></div>
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">🚿</div><div className="font-bold">스마트 관개</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Root AI Tab */}
                    {activeTab === 'rootai' && (
                        <motion.div key="rootai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🧠</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">뿌리 AI 네트워크</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 지하 뿌리 집단 지능 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-amber-500/20 border border-amber-500 rounded-xl p-4"><div className="text-3xl mb-2">🌿</div><div className="font-bold">뿌리 노드</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">🔗</div><div className="font-bold">균근 연결</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">🎯</div><div className="font-bold">양분 최적화</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">⚡</div><div className="font-bold">AI 결정</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Gravity Tab */}
                    {activeTab === 'gravity' && (
                        <motion.div key="gravity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🌍</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">중력 제어 농업</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 중력 조작 기반 작물 성장 최적화</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">🌙</div><div className="font-bold">0.3g 미세중력</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">⬇️</div><div className="font-bold">0.5g 저중력</div></div>
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">🌍</div><div className="font-bold">1.0g 표준</div></div>
                                    <div className="bg-red-500/20 border border-red-500 rounded-xl p-4"><div className="text-3xl mb-2">⬆️</div><div className="font-bold">1.5g 고중력</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Emotion Tab */}
                    {activeTab === 'emotion' && (
                        <motion.div key="emotion" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">💖</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">식물 감정 AI</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 식물 감정 인식 및 대화 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-pink-500/20 border border-pink-500 rounded-xl p-4"><div className="text-3xl mb-2">😊</div><div className="font-bold">기쁨</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">😌</div><div className="font-bold">만족</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">🤔</div><div className="font-bold">호기심</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">💬</div><div className="font-bold">대화</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Molecular Tab */}
                    {activeTab === 'molecular' && (
                        <motion.div key="molecular" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">⚗️</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">분자 조립기</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 나노 수준 영양소 조립 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-emerald-500/20 border border-emerald-500 rounded-xl p-4"><div className="text-3xl mb-2">🧪</div><div className="font-bold">영양소</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">💊</div><div className="font-bold">호르몬</div></div>
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">🍊</div><div className="font-bold">비타민</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">⚙️</div><div className="font-bold">효소</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Bioelectric Tab */}
                    {activeTab === 'bioelectric' && (
                        <motion.div key="bioelectric" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">⚡</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">생체 전기 그리드</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 식물 기반 전력 생산 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">🌱</div><div className="font-bold">광합성 발전</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">🦠</div><div className="font-bold">미생물 연료전지</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">🔋</div><div className="font-bold">바이오 커패시터</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">📊</div><div className="font-bold">전력 네트워크</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Weather Engineering Tab */}
                    {activeTab === 'weathereng' && (
                        <motion.div key="weathereng" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🌤️</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">기상 공학 시스템</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 농장 규모 기상 제어 시스템</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-orange-500/20 border border-orange-500 rounded-xl p-4"><div className="text-3xl mb-2">🌡️</div><div className="font-bold">온도 제어</div></div>
                                    <div className="bg-blue-500/20 border border-blue-500 rounded-xl p-4"><div className="text-3xl mb-2">💧</div><div className="font-bold">습도 조절</div></div>
                                    <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4"><div className="text-3xl mb-2">☀️</div><div className="font-bold">광량 관리</div></div>
                                    <div className="bg-gray-500/20 border border-gray-500 rounded-xl p-4"><div className="text-3xl mb-2">🌧️</div><div className="font-bold">강수 생성</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Seed Optimizer Tab */}
                    {activeTab === 'seedopt' && (
                        <motion.div key="seedopt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full glass rounded-xl p-6">
                            <div className="text-center py-12">
                                <div className="text-8xl mb-6">🌱</div>
                                <h2 className="text-3xl font-bold gradient-text mb-4">양자 종자 최적화기</h2>
                                <p className="text-white/60 max-w-2xl mx-auto mb-8">세계 최초 양자 기술 기반 종자 잠재력 극대화</p>
                                <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
                                    <div className="bg-indigo-500/20 border border-indigo-500 rounded-xl p-4"><div className="text-3xl mb-2">⚛️</div><div className="font-bold">양자 어닐링</div></div>
                                    <div className="bg-purple-500/20 border border-purple-500 rounded-xl p-4"><div className="text-3xl mb-2">🧬</div><div className="font-bold">유전자 프로파일</div></div>
                                    <div className="bg-pink-500/20 border border-pink-500 rounded-xl p-4"><div className="text-3xl mb-2">📈</div><div className="font-bold">형질 개선</div></div>
                                    <div className="bg-green-500/20 border border-green-500 rounded-xl p-4"><div className="text-3xl mb-2">✨</div><div className="font-bold">잠재력 극대화</div></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Super Agent Tab */}
                    {activeTab === 'superagent' && (
                        <motion.div key="superagent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
                            <SuperAgentPanel />
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
