'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FarmType } from '@/types/smartfarm';

interface DetailedFarmInteriorProps {
    farmType: FarmType;
    dimensions: { width: number; length: number; height: number; floors: number };
}

// ============================================
// 메인 컴포넌트
// ============================================

export default function DetailedFarmInterior({ farmType, dimensions }: DetailedFarmInteriorProps) {
    const { width, length, height, floors } = dimensions;

    return (
        <group>
            {/* 재배 랙 시스템 */}
            <GrowingRacks width={width} length={length} height={height} floors={floors} />

            {/* LED 조명 시스템 */}
            <LEDLightingSystem width={width} length={length} height={height} floors={floors} />

            {/* HVAC 시스템 */}
            <HVACSystem width={width} length={length} height={height} />

            {/* 영양액 탱크 */}
            <NutrientTanks width={width} length={length} />

            {/* 센서 네트워크 */}
            <SensorNetwork width={width} length={length} height={height} />

            {/* 로봇 시스템 */}
            <RobotSystems width={width} length={length} height={height} />

            {/* 제어 패널 */}
            <ControlPanel width={width} length={length} height={height} />

            {/* 관수 시스템 */}
            <IrrigationSystem width={width} length={length} floors={floors} />

            {/* CO2 공급 시스템 */}
            <CO2System width={width} length={length} height={height} />

            {/* 통로 */}
            <Walkways width={width} length={length} />

            {/* 식물들 */}
            <PlantBeds width={width} length={length} height={height} floors={floors} />
        </group>
    );
}

// ============================================
// 재배 랙 시스템
// ============================================

function GrowingRacks({ width, length, height, floors }: { width: number; length: number; height: number; floors: number }) {
    const shelfHeight = (height - 0.8) / floors;
    const rackWidth = 1.2;
    const aisle = 0.8;
    const rackCount = Math.max(2, Math.floor((width - 2) / (rackWidth + aisle)));
    const rackLength = length - 3;

    const racks = useMemo(() => {
        const result: { x: number; z: number }[] = [];
        for (let i = 0; i < rackCount; i++) {
            const x = -width / 2 + 1.5 + i * (rackWidth + aisle) + rackWidth / 2;
            result.push({ x, z: 0 });
        }
        return result;
    }, [width, rackCount, rackWidth, aisle]);

    return (
        <group>
            {racks.map((rack, rackIdx) => (
                <group key={rackIdx} position={[rack.x, 0, rack.z]}>
                    {/* 랙 프레임 (알루미늄) */}
                    {[0, rackLength / 3, rackLength * 2 / 3, rackLength].map((zPos, i) => (
                        <group key={i}>
                            {/* 수직 기둥 */}
                            <mesh position={[-rackWidth / 2, height / 2, -rackLength / 2 + zPos]}>
                                <boxGeometry args={[0.05, height - 0.2, 0.05]} />
                                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.3} />
                            </mesh>
                            <mesh position={[rackWidth / 2, height / 2, -rackLength / 2 + zPos]}>
                                <boxGeometry args={[0.05, height - 0.2, 0.05]} />
                                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.3} />
                            </mesh>
                        </group>
                    ))}

                    {/* 각 층의 선반 */}
                    {Array.from({ length: floors }).map((_, floorIdx) => {
                        const y = 0.3 + floorIdx * shelfHeight;
                        return (
                            <group key={floorIdx}>
                                {/* 선반 바닥 */}
                                <mesh position={[0, y, 0]}>
                                    <boxGeometry args={[rackWidth, 0.02, rackLength]} />
                                    <meshStandardMaterial color="#e8e8e8" metalness={0.3} roughness={0.5} />
                                </mesh>

                                {/* 수경재배 트레이 */}
                                <mesh position={[0, y + 0.03, 0]}>
                                    <boxGeometry args={[rackWidth - 0.1, 0.08, rackLength - 0.2]} />
                                    <meshStandardMaterial color="#333333" />
                                </mesh>

                                {/* 양액 표면 */}
                                <mesh position={[0, y + 0.06, 0]}>
                                    <boxGeometry args={[rackWidth - 0.15, 0.02, rackLength - 0.3]} />
                                    <meshStandardMaterial color="#8B4513" transparent opacity={0.6} />
                                </mesh>
                            </group>
                        );
                    })}

                    {/* 가로 지지대 */}
                    {Array.from({ length: floors + 1 }).map((_, i) => {
                        const y = 0.2 + i * shelfHeight;
                        return (
                            <group key={`support-${i}`}>
                                <mesh position={[0, y, -rackLength / 2]}>
                                    <boxGeometry args={[rackWidth, 0.03, 0.03]} />
                                    <meshStandardMaterial color="#a0a0a0" metalness={0.7} />
                                </mesh>
                                <mesh position={[0, y, rackLength / 2]}>
                                    <boxGeometry args={[rackWidth, 0.03, 0.03]} />
                                    <meshStandardMaterial color="#a0a0a0" metalness={0.7} />
                                </mesh>
                            </group>
                        );
                    })}
                </group>
            ))}
        </group>
    );
}

// ============================================
// LED 조명 시스템
// ============================================

function LEDLightingSystem({ width, length, height, floors }: { width: number; length: number; height: number; floors: number }) {
    const ledRef = useRef<THREE.Group>(null);
    const shelfHeight = (height - 0.8) / floors;
    const rackWidth = 1.2;
    const aisle = 0.8;
    const rackCount = Math.max(2, Math.floor((width - 2) / (rackWidth + aisle)));

    // 조명 펄스 애니메이션
    useFrame((state) => {
        if (ledRef.current) {
            const intensity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            ledRef.current.children.forEach((child) => {
                if ((child as THREE.Mesh).material) {
                    const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                    if (mat.opacity !== undefined) {
                        mat.opacity = intensity;
                    }
                }
            });
        }
    });

    const leds = useMemo(() => {
        const result: { x: number; y: number; z: number; color: string }[] = [];

        for (let r = 0; r < rackCount; r++) {
            const x = -width / 2 + 1.5 + r * (rackWidth + aisle) + rackWidth / 2;

            for (let f = 0; f < floors; f++) {
                const y = 0.3 + f * shelfHeight + shelfHeight - 0.1;

                // 각 선반당 여러 LED 바
                for (let l = 0; l < 4; l++) {
                    const z = -length / 2 + 2 + l * ((length - 4) / 3);
                    // 풀스펙트럼 색상 (빨강 + 파랑 혼합)
                    const color = l % 2 === 0 ? '#ff00ff' : '#ff88ff';
                    result.push({ x, y, z, color });
                }
            }
        }

        return result;
    }, [rackCount, floors, width, length, shelfHeight, rackWidth, aisle]);

    return (
        <group ref={ledRef}>
            {leds.map((led, i) => (
                <group key={i} position={[led.x, led.y, led.z]}>
                    {/* LED 하우징 */}
                    <mesh>
                        <boxGeometry args={[rackWidth - 0.2, 0.03, 0.8]} />
                        <meshStandardMaterial color="#222222" metalness={0.6} />
                    </mesh>

                    {/* LED 발광면 */}
                    <mesh position={[0, -0.02, 0]}>
                        <boxGeometry args={[rackWidth - 0.25, 0.01, 0.75]} />
                        <meshBasicMaterial color={led.color} transparent opacity={0.8} />
                    </mesh>

                    {/* 광원 (포인트 라이트 대신 글로우 효과) */}
                    <mesh position={[0, -0.05, 0]}>
                        <boxGeometry args={[rackWidth - 0.1, 0.02, 0.85]} />
                        <meshBasicMaterial color={led.color} transparent opacity={0.2} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// ============================================
// HVAC 시스템
// ============================================

function HVACSystem({ width, length, height }: { width: number; length: number; height: number }) {
    const fanRef = useRef<THREE.Group>(null);

    // 팬 회전 애니메이션
    useFrame((state) => {
        if (fanRef.current) {
            fanRef.current.rotation.y = state.clock.elapsedTime * 3;
        }
    });

    return (
        <group>
            {/* 메인 에어컨 유닛 */}
            <group position={[-width / 2 + 0.5, height - 0.5, 0]}>
                {/* 본체 */}
                <mesh>
                    <boxGeometry args={[0.8, 0.5, 2]} />
                    <meshStandardMaterial color="#f0f0f0" metalness={0.3} />
                </mesh>

                {/* 통풍구 */}
                {[-0.6, -0.2, 0.2, 0.6].map((z, i) => (
                    <mesh key={i} position={[0.41, 0, z]}>
                        <boxGeometry args={[0.02, 0.3, 0.3]} />
                        <meshStandardMaterial color="#333333" />
                    </mesh>
                ))}

                {/* LED 표시등 */}
                <mesh position={[0.41, 0.15, -0.8]}>
                    <boxGeometry args={[0.02, 0.05, 0.1]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>

            {/* 덕트 */}
            <mesh position={[0, height - 0.15, 0]}>
                <boxGeometry args={[width - 1, 0.15, 0.3]} />
                <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
            </mesh>

            {/* 통풍구들 */}
            {[-2, 0, 2].map((x, i) => (
                <group key={i} position={[x, height - 0.3, 0]}>
                    <mesh>
                        <boxGeometry args={[0.5, 0.1, 0.4]} />
                        <meshStandardMaterial color="#e0e0e0" />
                    </mesh>
                    {/* 루버 */}
                    {[-0.15, 0, 0.15].map((z, j) => (
                        <mesh key={j} position={[0, -0.06, z]} rotation={[0.3, 0, 0]}>
                            <boxGeometry args={[0.45, 0.01, 0.08]} />
                            <meshStandardMaterial color="#c0c0c0" />
                        </mesh>
                    ))}
                </group>
            ))}

            {/* 서큘레이터 팬 */}
            <group position={[width / 2 - 0.7, height * 0.6, -length / 3]}>
                <mesh>
                    <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <group ref={fanRef}>
                    {[0, 1, 2, 3].map((i) => (
                        <mesh key={i} rotation={[0, (i * Math.PI) / 2, 0]} position={[0.1, 0, 0]}>
                            <boxGeometry args={[0.15, 0.02, 0.05]} />
                            <meshStandardMaterial color="#888888" />
                        </mesh>
                    ))}
                </group>
            </group>
        </group>
    );
}

// ============================================
// 영양액 탱크
// ============================================

function NutrientTanks({ width, length }: { width: number; length: number }) {
    const liquidRef = useRef<THREE.Mesh>(null);

    // 액체 움직임
    useFrame((state) => {
        if (liquidRef.current) {
            liquidRef.current.position.y = -0.35 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
        }
    });

    return (
        <group position={[width / 2 - 1, 0, length / 2 - 1.5]}>
            {/* 메인 탱크 A (질소) */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
                    <meshStandardMaterial color="#3366ff" transparent opacity={0.7} />
                </mesh>
                <mesh ref={liquidRef} position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.6, 16]} />
                    <meshStandardMaterial color="#0066cc" transparent opacity={0.5} />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
                    <meshStandardMaterial color="#444444" metalness={0.8} />
                </mesh>
                {/* 라벨 A */}
                <mesh position={[0.41, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry args={[0.3, 0.15]} />
                    <meshBasicMaterial color="#3366ff" />
                </mesh>
            </group>

            {/* 탱크 B (인산) */}
            <group position={[-0.9, 0, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
                    <meshStandardMaterial color="#ff6633" transparent opacity={0.7} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.35, 0.35, 0.5, 16]} />
                    <meshStandardMaterial color="#cc4400" transparent opacity={0.5} />
                </mesh>
                <mesh position={[0, 0.05, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.1, 16]} />
                    <meshStandardMaterial color="#444444" metalness={0.8} />
                </mesh>
            </group>

            {/* pH 조절 탱크 */}
            <group position={[-0.45, 0, 0.8]}>
                <mesh position={[0, 0.35, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
                    <meshStandardMaterial color="#00cc66" transparent opacity={0.7} />
                </mesh>
            </group>

            {/* 배관 */}
            <mesh position={[-0.45, 0.05, 0.3]}>
                <boxGeometry args={[1.2, 0.05, 0.05]} />
                <meshStandardMaterial color="#666666" metalness={0.6} />
            </mesh>

            {/* 펌프 */}
            <mesh position={[-0.45, 0.15, 0.4]}>
                <boxGeometry args={[0.2, 0.15, 0.15]} />
                <meshStandardMaterial color="#444444" metalness={0.7} />
            </mesh>
        </group>
    );
}

// ============================================
// 센서 네트워크
// ============================================

function SensorNetwork({ width, length, height }: { width: number; length: number; height: number }) {
    const sensorLightRef = useRef<THREE.Group>(null);

    // 센서 LED 깜빡임
    useFrame((state) => {
        if (sensorLightRef.current) {
            const blink = Math.sin(state.clock.elapsedTime * 4) > 0;
            sensorLightRef.current.children.forEach((child, i) => {
                const shouldBlink = (Math.floor(state.clock.elapsedTime + i * 0.5) % 3) === 0;
                if ((child as THREE.Mesh).material) {
                    const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                    mat.opacity = shouldBlink && blink ? 1 : 0.3;
                }
            });
        }
    });

    const sensors = useMemo(() => {
        const result: { x: number; y: number; z: number; type: string; color: string }[] = [];

        // 온습도 센서
        result.push({ x: 0, y: height - 0.5, z: 0, type: 'temp', color: '#ff4444' });
        result.push({ x: width / 3, y: height - 0.5, z: length / 3, type: 'temp', color: '#ff4444' });
        result.push({ x: -width / 3, y: height - 0.5, z: -length / 3, type: 'temp', color: '#ff4444' });

        // CO2 센서
        result.push({ x: width / 4, y: height * 0.6, z: 0, type: 'co2', color: '#44ff44' });
        result.push({ x: -width / 4, y: height * 0.6, z: 0, type: 'co2', color: '#44ff44' });

        // 광량 센서
        result.push({ x: 0, y: 0.5, z: 0, type: 'light', color: '#ffff44' });

        // pH/EC 센서 (양액 내)
        result.push({ x: width / 2 - 1, y: 0.3, z: length / 2 - 1, type: 'ph', color: '#44ffff' });

        return result;
    }, [width, length, height]);

    return (
        <group>
            {sensors.map((sensor, i) => (
                <group key={i} position={[sensor.x, sensor.y, sensor.z]}>
                    {/* 센서 본체 */}
                    <mesh>
                        <boxGeometry args={[0.08, 0.08, 0.08]} />
                        <meshStandardMaterial color="#ffffff" />
                    </mesh>

                    {/* 센서 안테나 */}
                    <mesh position={[0, 0.07, 0]}>
                        <cylinderGeometry args={[0.005, 0.005, 0.06, 8]} />
                        <meshStandardMaterial color="#333333" />
                    </mesh>
                </group>
            ))}

            {/* LED 표시등 */}
            <group ref={sensorLightRef}>
                {sensors.map((sensor, i) => (
                    <mesh key={i} position={[sensor.x, sensor.y + 0.05, sensor.z + 0.045]}>
                        <sphereGeometry args={[0.015, 8, 8]} />
                        <meshBasicMaterial color={sensor.color} transparent opacity={0.8} />
                    </mesh>
                ))}
            </group>
        </group>
    );
}

// ============================================
// 로봇 시스템
// ============================================

function RobotSystems({ width, length, height }: { width: number; length: number; height: number }) {
    const robotRef = useRef<THREE.Group>(null);
    const droneRef = useRef<THREE.Group>(null);

    // 로봇 이동 애니메이션
    useFrame((state) => {
        if (robotRef.current) {
            const t = state.clock.elapsedTime * 0.3;
            robotRef.current.position.z = Math.sin(t) * (length / 3);
        }
        if (droneRef.current) {
            const t = state.clock.elapsedTime;
            droneRef.current.position.x = Math.sin(t * 0.5) * (width / 4);
            droneRef.current.position.z = Math.cos(t * 0.5) * (length / 4);
            droneRef.current.position.y = height * 0.7 + Math.sin(t * 2) * 0.1;
            droneRef.current.rotation.y = t * 0.5;
        }
    });

    return (
        <group>
            {/* 지상 수확 로봇 */}
            <group ref={robotRef} position={[0, 0, 0]}>
                {/* 본체 */}
                <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.5, 0.25, 0.4]} />
                    <meshStandardMaterial color="#ff8800" metalness={0.5} />
                </mesh>

                {/* 로봇 암 */}
                <mesh position={[0.3, 0.35, 0]} rotation={[0, 0, 0.3]}>
                    <boxGeometry args={[0.3, 0.05, 0.05]} />
                    <meshStandardMaterial color="#666666" metalness={0.7} />
                </mesh>

                {/* 그리퍼 */}
                <mesh position={[0.45, 0.4, 0]}>
                    <boxGeometry args={[0.08, 0.1, 0.08]} />
                    <meshStandardMaterial color="#444444" />
                </mesh>

                {/* 바퀴 */}
                {[[-0.2, -0.15], [0.2, -0.15], [-0.2, 0.15], [0.2, 0.15]].map(([x, z], i) => (
                    <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                ))}

                {/* 센서 */}
                <mesh position={[0.26, 0.3, 0]}>
                    <boxGeometry args={[0.03, 0.03, 0.15]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>

            {/* 드론 */}
            <group ref={droneRef} position={[0, height * 0.7, 0]}>
                {/* 본체 */}
                <mesh>
                    <boxGeometry args={[0.15, 0.05, 0.15]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>

                {/* 암 */}
                {[[0.15, 0.15], [0.15, -0.15], [-0.15, 0.15], [-0.15, -0.15]].map(([x, z], i) => (
                    <group key={i}>
                        <mesh position={[x, 0, z]}>
                            <boxGeometry args={[0.02, 0.02, 0.02]} />
                            <meshStandardMaterial color="#444444" />
                        </mesh>
                        {/* 프로펠러 */}
                        <mesh position={[x, 0.03, z]} rotation={[0, Date.now() * 0.01 + i, 0]}>
                            <boxGeometry args={[0.12, 0.005, 0.02]} />
                            <meshStandardMaterial color="#666666" />
                        </mesh>
                    </group>
                ))}

                {/* 카메라 */}
                <mesh position={[0, -0.04, 0]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial color="#222222" />
                </mesh>
            </group>

            {/* 레일 시스템 (로봇 이동용) */}
            <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.1, 0.02, length - 2]} />
                <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>
        </group>
    );
}

// ============================================
// 제어 패널
// ============================================

function ControlPanel({ width, length, height }: { width: number; length: number; height: number }) {
    const screenRef = useRef<THREE.Mesh>(null);

    // 화면 애니메이션
    useFrame((state) => {
        if (screenRef.current) {
            const mat = screenRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }
    });

    return (
        <group position={[-width / 2 + 0.3, 0, -length / 2 + 1]}>
            {/* 제어 스테이션 */}
            <group>
                {/* 콘솔 */}
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[0.6, 1, 0.4]} />
                    <meshStandardMaterial color="#2a2a2a" />
                </mesh>

                {/* 메인 모니터 */}
                <mesh position={[0.02, 0.9, 0]}>
                    <boxGeometry args={[0.5, 0.35, 0.03]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh ref={screenRef} position={[0.04, 0.9, 0]}>
                    <boxGeometry args={[0.45, 0.3, 0.01]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
                </mesh>

                {/* 버튼 패널 */}
                <mesh position={[0.02, 0.6, 0.15]} rotation={[-0.5, 0, 0]}>
                    <boxGeometry args={[0.4, 0.2, 0.02]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>

                {/* 버튼들 */}
                {[[-0.12, 0], [0, 0], [0.12, 0]].map(([x, z], i) => (
                    <mesh key={i} position={[0.02 + x, 0.62, 0.2]} rotation={[-0.5, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 0.02, 16]} />
                        <meshStandardMaterial color={['#ff4444', '#44ff44', '#4444ff'][i]} />
                    </mesh>
                ))}

                {/* 비상 정지 버튼 */}
                <mesh position={[0.02, 0.55, 0.25]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
                    <meshStandardMaterial color="#ff0000" />
                </mesh>
            </group>

            {/* 보조 모니터 */}
            <group position={[0.4, 0, 0]}>
                <mesh position={[0, 1.2, 0]}>
                    <boxGeometry args={[0.35, 0.25, 0.02]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                <mesh position={[0.01, 1.2, 0]}>
                    <boxGeometry args={[0.32, 0.22, 0.01]} />
                    <meshBasicMaterial color="#0088ff" transparent opacity={0.7} />
                </mesh>
            </group>
        </group>
    );
}

// ============================================
// 관수 시스템
// ============================================

function IrrigationSystem({ width, length, floors }: { width: number; length: number; floors: number }) {
    const rackWidth = 1.2;
    const aisle = 0.8;
    const rackCount = Math.max(2, Math.floor((width - 2) / (rackWidth + aisle)));

    return (
        <group>
            {/* 메인 급수관 */}
            <mesh position={[0, 0.1, length / 2 - 0.5]}>
                <cylinderGeometry args={[0.05, 0.05, width - 1, 16]} />
                <meshStandardMaterial color="#3366ff" metalness={0.5} />
            </mesh>

            {/* 배수관 */}
            <mesh position={[0, 0.05, -length / 2 + 0.5]}>
                <cylinderGeometry args={[0.04, 0.04, width - 1, 16]} />
                <meshStandardMaterial color="#666666" metalness={0.6} />
            </mesh>

            {/* 각 랙으로 연결되는 파이프 */}
            {Array.from({ length: rackCount }).map((_, i) => {
                const x = -width / 2 + 1.5 + i * (rackWidth + aisle) + rackWidth / 2;
                return (
                    <group key={i}>
                        <mesh position={[x, 0.1, length / 2 - 1]} rotation={[Math.PI / 2, 0, 0]}>
                            <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                            <meshStandardMaterial color="#3366ff" transparent opacity={0.8} />
                        </mesh>
                    </group>
                );
            })}

            {/* 밸브 */}
            <mesh position={[width / 2 - 1.5, 0.1, length / 2 - 0.5]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
                <meshStandardMaterial color="#ff0000" metalness={0.6} />
            </mesh>
        </group>
    );
}

// ============================================
// CO2 공급 시스템
// ============================================

function CO2System({ width, length, height }: { width: number; length: number; height: number }) {
    return (
        <group position={[-width / 2 + 0.5, 0, length / 2 - 0.5]}>
            {/* CO2 탱크 */}
            <mesh position={[0, 0.6, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
                <meshStandardMaterial color="#444444" metalness={0.7} />
            </mesh>

            {/* 밸브 */}
            <mesh position={[0, 1.25, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
                <meshStandardMaterial color="#888888" metalness={0.8} />
            </mesh>

            {/* 압력 게이지 */}
            <mesh position={[0.18, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                <meshStandardMaterial color="#333333" />
            </mesh>

            {/* 분배 파이프 */}
            <mesh position={[0.15, height - 0.3, -length / 4]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial color="#666666" />
            </mesh>
        </group>
    );
}

// ============================================
// 통로
// ============================================

function Walkways({ width, length }: { width: number; length: number }) {
    return (
        <group>
            {/* 메인 통로 */}
            <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.8, length - 1]} />
                <meshStandardMaterial color="#444466" metalness={0.2} roughness={0.8} />
            </mesh>

            {/* 안전 라인 */}
            <mesh position={[-0.35, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, length - 1]} />
                <meshBasicMaterial color="#ffff00" />
            </mesh>
            <mesh position={[0.35, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, length - 1]} />
                <meshBasicMaterial color="#ffff00" />
            </mesh>

            {/* 입구 매트 */}
            <mesh position={[0, 0.01, length / 2 - 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1, 0.8]} />
                <meshStandardMaterial color="#333333" roughness={0.9} />
            </mesh>
        </group>
    );
}

// ============================================
// 식물 베드
// ============================================

function PlantBeds({ width, length, height, floors }: { width: number; length: number; height: number; floors: number }) {
    const shelfHeight = (height - 0.8) / floors;
    const rackWidth = 1.2;
    const aisle = 0.8;
    const rackCount = Math.max(2, Math.floor((width - 2) / (rackWidth + aisle)));

    const plants = useMemo(() => {
        const result: { x: number; y: number; z: number; scale: number; color: string }[] = [];

        for (let r = 0; r < rackCount; r++) {
            const baseX = -width / 2 + 1.5 + r * (rackWidth + aisle) + rackWidth / 2;

            for (let f = 0; f < floors; f++) {
                const baseY = 0.3 + f * shelfHeight + 0.12;

                // 각 선반에 12~16개 식물
                for (let p = 0; p < 14; p++) {
                    const x = baseX + (Math.random() - 0.5) * (rackWidth - 0.3);
                    const z = -length / 2 + 2 + (p / 14) * (length - 4);
                    const scale = 0.05 + Math.random() * 0.08;
                    const color = Math.random() > 0.3 ? '#22aa44' : '#44cc66';
                    result.push({ x, y: baseY, z, scale, color });
                }
            }
        }

        return result;
    }, [rackCount, floors, width, length, shelfHeight, rackWidth, aisle]);

    return (
        <group>
            {plants.map((plant, i) => (
                <group key={i} position={[plant.x, plant.y, plant.z]}>
                    {/* 식물 (간단한 구체로 표현) */}
                    <mesh>
                        <sphereGeometry args={[plant.scale, 8, 6]} />
                        <meshStandardMaterial color={plant.color} />
                    </mesh>
                    <mesh position={[0, plant.scale * 0.5, 0]}>
                        <sphereGeometry args={[plant.scale * 0.7, 8, 6]} />
                        <meshStandardMaterial color={plant.color} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
