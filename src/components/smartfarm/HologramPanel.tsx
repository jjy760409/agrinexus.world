'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getHologramVisualizationEngine,
    HologramScene,
    SceneType,
    SCENE_TYPE_ICONS,
    SCENE_TYPE_NAMES,
    SceneStats
} from '@/lib/hologram/hologramVisualization';

export default function HologramPanel() {
    const [scenes, setScenes] = useState<HologramScene[]>([]);
    const [activeScene, setActiveScene] = useState<HologramScene | null>(null);
    const [activeTab, setActiveTab] = useState<'scenes' | 'objects' | 'data' | 'animation'>('scenes');
    const [stats, setStats] = useState<SceneStats | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedSceneType, setSelectedSceneType] = useState<SceneType>('farm_overview');

    const engine = useMemo(() => getHologramVisualizationEngine(), []);

    useEffect(() => {
        setScenes(engine.getAllScenes());
        const active = engine.getActiveScene();
        if (active) {
            setActiveScene(active);
            setStats(engine.getSceneStats(active.id));
        }
    }, [engine]);

    const createNewScene = () => {
        setIsCreating(true);
        const newScene = engine.createScene(
            `Scene ${scenes.length + 1}`,
            selectedSceneType
        );

        // 샘플 식물 추가
        for (let i = 0; i < 12; i++) {
            engine.createPlantHologram(newScene.id, {
                id: `plant-${i}`,
                species: ['딸기', '토마토', '상추'][i % 3],
                position: { x: (i % 4) * 2 - 3, y: 0, z: Math.floor(i / 4) * 2 - 2 },
                growthStage: 0.3 + Math.random() * 0.7,
                health: 60 + Math.random() * 40,
                height: 15 + Math.random() * 25
            });
        }

        // 성장 애니메이션 추가
        engine.createGrowthTimelapse(newScene.id, 'plant-0', 10000);

        setScenes(engine.getAllScenes());
        setActiveScene(engine.getScene(newScene.id) || null);
        setStats(engine.getSceneStats(newScene.id));
        setIsCreating(false);
    };

    const tabs = [
        { id: 'scenes' as const, label: '씬 관리', icon: '🎬' },
        { id: 'objects' as const, label: '오브젝트', icon: '🌱' },
        { id: 'data' as const, label: '데이터 바인딩', icon: '📊' },
        { id: 'animation' as const, label: '애니메이션', icon: '🎥' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🔮</span>
                            홀로그램 3D 시각화 엔진
                        </h2>
                        <div className="text-sm text-white/50">
                            실시간 식물 홀로그램 · 분자수준 시각화 · 성장 타임랩스
                        </div>
                    </div>

                    {stats && (
                        <div className="flex gap-4 text-sm">
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-purple-400">{stats.objectCount}</div>
                                <div className="text-white/50">오브젝트</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-cyan-400">{stats.animationCount}</div>
                                <div className="text-white/50">애니메이션</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-pink-400">{(stats.estimatedMemory).toFixed(1)} MB</div>
                                <div className="text-white/50">메모리</div>
                            </div>
                        </div>
                    )}
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
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* 3D 뷰포트 */}
                <div className="w-2/3 glass rounded-xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-cyan-900/30" />

                    {/* 홀로그램 그리드 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* 그리드 라인 */}
                            <svg className="absolute inset-0 w-full h-full opacity-20">
                                {Array.from({ length: 20 }, (_, i) => (
                                    <line key={`h-${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="cyan" strokeWidth="0.5" />
                                ))}
                                {Array.from({ length: 20 }, (_, i) => (
                                    <line key={`v-${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="cyan" strokeWidth="0.5" />
                                ))}
                            </svg>

                            {/* 홀로그램 식물들 */}
                            {activeScene && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-4 gap-8 p-8">
                                        {activeScene.objects.slice(0, 12).map((obj, i) => (
                                            <motion.div
                                                key={obj.id}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="w-20 h-32 flex flex-col items-center justify-end">
                                                    {/* 식물 이미지 */}
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -5, 0],
                                                            filter: ['hue-rotate(0deg)', 'hue-rotate(10deg)', 'hue-rotate(0deg)']
                                                        }}
                                                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                                        className="text-5xl filter drop-shadow-lg"
                                                        style={{
                                                            transform: `scale(${obj.scale.x})`,
                                                            textShadow: `0 0 20px rgba(0, 255, 255, ${obj.glow.intensity})`
                                                        }}
                                                    >
                                                        {obj.name === '딸기' ? '🍓' : obj.name === '토마토' ? '🍅' : '🥬'}
                                                    </motion.div>

                                                    {/* 스캔라인 효과 */}
                                                    <motion.div
                                                        animate={{ y: ['0%', '100%'] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
                                                    />

                                                    {/* 건강도 표시 */}
                                                    <div className="mt-2 text-xs text-center">
                                                        <div className="text-white/70">{obj.name}</div>
                                                        <div className={`${obj.metadata.dataPoints[0]?.value as number >= 80 ? 'text-green-400' :
                                                                obj.metadata.dataPoints[0]?.value as number >= 60 ? 'text-yellow-400' :
                                                                    'text-red-400'
                                                            }`}>
                                                            {(obj.metadata.dataPoints[0]?.value as number)?.toFixed(0)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!activeScene && (
                                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🔮</div>
                                        <div>씬을 생성하여 홀로그램 시작</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 뷰포트 컨트롤 */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button className="px-3 py-2 glass rounded-lg text-xs hover:bg-white/10">🔄 회전</button>
                        <button className="px-3 py-2 glass rounded-lg text-xs hover:bg-white/10">🔍 줌</button>
                        <button className="px-3 py-2 glass rounded-lg text-xs hover:bg-white/10">📷 스크린샷</button>
                    </div>

                    {/* 카메라 뷰 */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {['자유', '상단', '전면', '측면'].map(view => (
                            <button key={view} className="px-3 py-1 glass rounded text-xs hover:bg-white/10">
                                {view}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 사이드 패널 */}
                <div className="w-1/3 glass rounded-xl p-4 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* 씬 관리 */}
                        {activeTab === 'scenes' && (
                            <motion.div
                                key="scenes"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🎬 씬 관리</h3>

                                {/* 씬 타입 선택 */}
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(SCENE_TYPE_ICONS) as SceneType[]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedSceneType(type)}
                                            className={`p-3 rounded-lg text-left transition-all ${selectedSceneType === type
                                                    ? 'bg-purple-500/30 border border-purple-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="text-lg mr-2">{SCENE_TYPE_ICONS[type]}</span>
                                            <span className="text-sm">{SCENE_TYPE_NAMES[type]}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={createNewScene}
                                    disabled={isCreating}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:opacity-90 disabled:opacity-50"
                                >
                                    {isCreating ? '생성 중...' : '+ 새 씬 생성'}
                                </button>

                                {/* 씬 목록 */}
                                <div className="space-y-2">
                                    {scenes.map(scene => (
                                        <button
                                            key={scene.id}
                                            onClick={() => {
                                                setActiveScene(scene);
                                                setStats(engine.getSceneStats(scene.id));
                                            }}
                                            className={`w-full p-3 rounded-lg text-left transition-all ${activeScene?.id === scene.id
                                                    ? 'bg-cyan-500/30 border border-cyan-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{SCENE_TYPE_ICONS[scene.type]} {scene.name}</span>
                                                <span className="text-xs text-white/50">{scene.objects.length} 객체</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 오브젝트 패널 */}
                        {activeTab === 'objects' && activeScene && (
                            <motion.div
                                key="objects"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🌱 오브젝트 목록</h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {activeScene.objects.map(obj => (
                                        <div key={obj.id} className="p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{obj.name}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${obj.visible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {obj.visible ? '표시' : '숨김'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-white/50 grid grid-cols-2 gap-1">
                                                <div>위치: ({obj.position.x.toFixed(1)}, {obj.position.y.toFixed(1)})</div>
                                                <div>크기: {(obj.scale.x * 100).toFixed(0)}%</div>
                                                {obj.metadata.dataPoints.map((dp, i) => (
                                                    <div key={i}>{dp.key}: {String(dp.value)}{dp.unit}</div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 애니메이션 패널 */}
                        {activeTab === 'animation' && activeScene && (
                            <motion.div
                                key="animation"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🎥 애니메이션</h3>
                                {activeScene.animations.length > 0 ? (
                                    <div className="space-y-2">
                                        {activeScene.animations.map(anim => (
                                            <div key={anim.id} className="p-3 bg-white/5 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span>{anim.name}</span>
                                                    <button className={`px-2 py-1 rounded text-xs ${anim.playing ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                                        }`}>
                                                        {anim.playing ? '⏹ 정지' : '▶ 재생'}
                                                    </button>
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    타입: {anim.type} · 길이: {anim.duration / 1000}s · 반복: {anim.loop ? 'O' : 'X'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/50">
                                        애니메이션이 없습니다
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* 데이터 바인딩 */}
                        {activeTab === 'data' && (
                            <motion.div
                                key="data"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">📊 실시간 데이터 바인딩</h3>
                                <div className="space-y-2">
                                    {['온도', '습도', 'CO₂', '조도', 'EC', 'pH'].map((source, i) => (
                                        <div key={source} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                                            <span>{source}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-cyan-400 font-mono">
                                                    {[23.5, 75, 800, 15000, 1.8, 6.2][i]}{['°C', '%', 'ppm', 'lux', 'mS/cm', ''][i]}
                                                </span>
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
