'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AR 포인트 오브 인터레스트
interface ARPoint {
    id: string;
    name: string;
    description: string;
    icon: string;
    position: { x: number; y: number; z: number };
    category: 'sensor' | 'plant' | 'equipment' | 'zone';
    data?: Record<string, any>;
}

// AR 농장 투어 컴포넌트
export default function ARFarmTour() {
    const [isARSupported, setIsARSupported] = useState(false);
    const [isARActive, setIsARActive] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState<ARPoint | null>(null);
    const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    // AR 포인트들
    const [arPoints] = useState<ARPoint[]>([
        {
            id: 'sensor-1',
            name: '환경 센서 허브',
            description: '온도, 습도, CO2, 광량을 실시간 모니터링',
            icon: '📡',
            position: { x: 0.3, y: 0.4, z: 0 },
            category: 'sensor',
            data: { temperature: 24.5, humidity: 65, co2: 800, light: 450 }
        },
        {
            id: 'plant-1',
            name: '상추 재배 구역',
            description: '버터헤드 상추 배치 #127',
            icon: '🥬',
            position: { x: 0.5, y: 0.6, z: 0 },
            category: 'plant',
            data: { variety: 'Butterhead', growthDay: 28, harvestETA: '2일' }
        },
        {
            id: 'equipment-1',
            name: 'LED 조명 시스템',
            description: '풀 스펙트럼 LED 200W',
            icon: '💡',
            position: { x: 0.7, y: 0.3, z: 0 },
            category: 'equipment',
            data: { power: '200W', spectrum: 'Full', ppfd: 600 }
        },
        {
            id: 'robot-1',
            name: '수확 로봇',
            description: 'Harvester-1 활성 상태',
            icon: '🤖',
            position: { x: 0.2, y: 0.7, z: 0 },
            category: 'equipment',
            data: { status: 'active', battery: 85, task: '상추 수확 중' }
        },
        {
            id: 'zone-1',
            name: 'Zone A - 발아실',
            description: '온도 22°C, 습도 80%',
            icon: '🌱',
            position: { x: 0.8, y: 0.5, z: 0 },
            category: 'zone',
            data: { temp: 22, humidity: 80, seedlings: 500 }
        },
    ]);

    useEffect(() => {
        // WebXR 지원 확인
        if (typeof navigator !== 'undefined' && 'xr' in navigator) {
            (navigator as any).xr?.isSessionSupported('immersive-ar')
                .then((supported: boolean) => setIsARSupported(supported))
                .catch(() => setIsARSupported(false));
        }
    }, []);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setCameraPermission('granted');
            setIsARActive(true);
            startAROverlay();
        } catch (error) {
            console.error('카메라 권한 거부:', error);
            setCameraPermission('denied');
        }
    };

    const stopAR = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
        cancelAnimationFrame(animationRef.current);
        setIsARActive(false);
    };

    const startAROverlay = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // AR 포인트 렌더링
            arPoints.forEach(point => {
                const x = point.position.x * canvas.width;
                const y = point.position.y * canvas.height;

                // 펄스 효과
                const time = Date.now() / 1000;
                const pulse = Math.sin(time * 3) * 5 + 25;

                // 외부 링
                ctx.beginPath();
                ctx.arc(x, y, pulse, 0, Math.PI * 2);
                ctx.strokeStyle = getCategoryColor(point.category);
                ctx.lineWidth = 2;
                ctx.stroke();

                // 내부 원
                ctx.beginPath();
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fillStyle = getCategoryColor(point.category) + '80';
                ctx.fill();

                // 아이콘
                ctx.font = '20px serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(point.icon, x, y);
            });

            animationRef.current = requestAnimationFrame(render);
        };

        render();
    };

    const getCategoryColor = (category: ARPoint['category']) => {
        switch (category) {
            case 'sensor': return '#00ff88';
            case 'plant': return '#88ff00';
            case 'equipment': return '#00ffff';
            case 'zone': return '#ff88ff';
            default: return '#ffffff';
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // 가장 가까운 포인트 찾기
        let closest: ARPoint | null = null;
        let minDist = Infinity;

        arPoints.forEach(point => {
            const dist = Math.sqrt(
                Math.pow(x - point.position.x, 2) +
                Math.pow(y - point.position.y, 2)
            );
            if (dist < 0.1 && dist < minDist) {
                closest = point;
                minDist = dist;
            }
        });

        setSelectedPoint(closest);
    };

    return (
        <div className="relative">
            {/* AR 시작 버튼 */}
            {!isARActive && (
                <motion.button
                    onClick={requestCameraPermission}
                    className="w-full p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                            📱
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="text-xl font-bold">AR 농장 투어</h3>
                            <p className="text-sm text-white/60">카메라로 스마트팜을 증강현실로 체험하세요</p>
                        </div>
                        <span className="text-3xl">→</span>
                    </div>

                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {['📡 센서', '🥬 작물', '🤖 로봇', '💡 장비'].map((item, i) => (
                            <div key={i} className="p-2 rounded-lg bg-white/5 text-center text-xs">
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.button>
            )}

            {/* AR 뷰 */}
            <AnimatePresence>
                {isARActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black"
                    >
                        {/* 카메라 피드 */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            playsInline
                            muted
                        />

                        {/* AR 오버레이 캔버스 */}
                        <canvas
                            ref={canvasRef}
                            width={window.innerWidth}
                            height={window.innerHeight}
                            className="absolute inset-0 w-full h-full"
                            onClick={handleCanvasClick}
                        />

                        {/* 상단 UI */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                            <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-sm font-medium">AR 모드 활성</span>
                            </div>

                            <button
                                onClick={stopAR}
                                className="glass rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/20"
                            >
                                <span>✕</span>
                                <span className="text-sm">종료</span>
                            </button>
                        </div>

                        {/* 하단 가이드 */}
                        <div className="absolute bottom-8 left-4 right-4">
                            <div className="glass rounded-xl p-4">
                                <div className="flex items-center justify-center gap-4 mb-2">
                                    <span className="text-sm text-white/60">카메라를 농장으로 향하세요</span>
                                </div>
                                <div className="flex justify-center gap-3">
                                    {['📡 센서', '🥬 식물', '🤖 로봇', '💡 장비'].map((item, i) => (
                                        <div
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs"
                                            style={{
                                                backgroundColor: [
                                                    'rgba(0,255,136,0.2)',
                                                    'rgba(136,255,0,0.2)',
                                                    'rgba(0,255,255,0.2)',
                                                    'rgba(255,136,255,0.2)'
                                                ][i]
                                            }}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 선택된 포인트 정보 */}
                        <AnimatePresence>
                            {selectedPoint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-32 left-4 right-4"
                                >
                                    <div className="glass rounded-2xl p-4">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                                style={{ backgroundColor: getCategoryColor(selectedPoint.category) + '30' }}
                                            >
                                                {selectedPoint.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{selectedPoint.name}</h3>
                                                <p className="text-sm text-white/60">{selectedPoint.description}</p>

                                                {selectedPoint.data && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {Object.entries(selectedPoint.data).map(([key, value]) => (
                                                            <span
                                                                key={key}
                                                                className="px-2 py-0.5 rounded-full bg-white/10 text-xs"
                                                            >
                                                                {key}: {value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedPoint(null)}
                                                className="text-white/50 hover:text-white"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 카메라 권한 거부 */}
            {cameraPermission === 'denied' && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    ⚠️ 카메라 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.
                </div>
            )}
        </div>
    );
}
