'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FullAutomationSimulationProps {
    dimensions: { width: number; length: number; height: number; floors: number };
    simulationSpeed?: number;
}

// ============================================
// 메인 풀 자동화 시뮬레이션 컴포넌트
// ============================================

export default function FullAutomationSimulation({
    dimensions,
    simulationSpeed = 1
}: FullAutomationSimulationProps) {
    const { width, length, height, floors } = dimensions;
    const [phase, setPhase] = useState(0);

    // 시뮬레이션 단계 진행
    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p + 0.01 * simulationSpeed) % 5);
        }, 50);
        return () => clearInterval(interval);
    }, [simulationSpeed]);

    return (
        <group position={[0, 0, 0]}>
            {/* === 섹션 1: 딸기 재배 구역 === */}
            <group position={[-width * 0.6, 0, 0]}>
                <StrawberryGrowingSection
                    width={width * 0.8}
                    length={length}
                    height={height}
                    floors={floors}
                    phase={phase}
                />
            </group>

            {/* === 섹션 2: 수확 & 선별 구역 === */}
            <group position={[width * 0.3, 0, -length * 0.3]}>
                <HarvestingSection
                    width={width * 0.4}
                    length={length * 0.4}
                    phase={phase}
                />
            </group>

            {/* === 섹션 3: 포장 라인 === */}
            <group position={[width * 0.3, 0, 0]}>
                <PackagingLine
                    width={width * 0.5}
                    length={length * 0.3}
                    phase={phase}
                />
            </group>

            {/* === 섹션 4: 박스 포장 & 팔레타이징 === */}
            <group position={[width * 0.3, 0, length * 0.35]}>
                <BoxPackagingSection
                    width={width * 0.4}
                    length={length * 0.25}
                    phase={phase}
                />
            </group>

            {/* === 섹션 5: 물류 & 배송 구역 === */}
            <group position={[width * 0.8, 0, 0]}>
                <LogisticsSection
                    width={width * 0.3}
                    length={length}
                    phase={phase}
                />
            </group>

            {/* 컨베이어 벨트 연결 */}
            <ConveyorConnections
                width={width}
                length={length}
                phase={phase}
            />

            {/* 바닥 표시 */}
            <FloorMarkings width={width * 2} length={length * 1.5} />
        </group>
    );
}

// ============================================
// 딸기 재배 섹션
// ============================================

function StrawberryGrowingSection({ width, length, height, floors, phase }: {
    width: number; length: number; height: number; floors: number; phase: number;
}) {
    const shelfHeight = (height - 0.8) / floors;
    const rackCount = Math.max(3, Math.floor(width / 1.5));

    return (
        <group>
            {/* 재배실 외벽 (반투명) */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[width, height, length]} />
                <meshPhysicalMaterial
                    color="#88ccff"
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 재배 랙들 */}
            {Array.from({ length: rackCount }).map((_, rackIdx) => {
                const x = -width / 2 + 1 + rackIdx * (width / rackCount);
                return (
                    <group key={rackIdx} position={[x, 0, 0]}>
                        {/* 랙 프레임 */}
                        <mesh position={[0, height / 2, -length / 2 + 0.1]}>
                            <boxGeometry args={[0.05, height, 0.05]} />
                            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
                        </mesh>
                        <mesh position={[0, height / 2, length / 2 - 0.1]}>
                            <boxGeometry args={[0.05, height, 0.05]} />
                            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
                        </mesh>

                        {/* 각 층 선반 + 딸기 */}
                        {Array.from({ length: floors }).map((_, floorIdx) => {
                            const y = 0.3 + floorIdx * shelfHeight;
                            return (
                                <group key={floorIdx} position={[0, y, 0]}>
                                    {/* 선반 */}
                                    <mesh>
                                        <boxGeometry args={[0.8, 0.03, length - 0.5]} />
                                        <meshStandardMaterial color="#e8e8e8" />
                                    </mesh>

                                    {/* 수경 트레이 */}
                                    <mesh position={[0, 0.03, 0]}>
                                        <boxGeometry args={[0.75, 0.06, length - 0.6]} />
                                        <meshStandardMaterial color="#333333" />
                                    </mesh>

                                    {/* 딸기 딸기 식물들 */}
                                    <StrawberryPlants
                                        length={length - 0.8}
                                        plantCount={8}
                                        growthPhase={phase}
                                    />

                                    {/* LED 조명 (상단) */}
                                    <mesh position={[0, shelfHeight - 0.15, 0]}>
                                        <boxGeometry args={[0.7, 0.03, length - 0.7]} />
                                        <meshBasicMaterial color="#ff88cc" transparent opacity={0.6} />
                                    </mesh>
                                </group>
                            );
                        })}
                    </group>
                );
            })}

            {/* 수확 로봇 */}
            <HarvestRobot
                width={width}
                length={length}
                height={height}
                phase={phase}
            />

            {/* 라벨 */}
            <SectionLabel
                text="🍓 STRAWBERRY CULTIVATION"
                position={[0, height + 0.3, 0]}
            />
        </group>
    );
}

// ============================================
// 딸기 식물
// ============================================

function StrawberryPlants({ length, plantCount, growthPhase }: {
    length: number; plantCount: number; growthPhase: number;
}) {
    const plants = useMemo(() => {
        return Array.from({ length: plantCount }).map((_, i) => ({
            z: -length / 2 + (length / plantCount) * (i + 0.5),
            growth: 0.8 + Math.random() * 0.2,
            berries: Math.floor(2 + Math.random() * 4)
        }));
    }, [length, plantCount]);

    return (
        <group position={[0, 0.1, 0]}>
            {plants.map((plant, i) => (
                <group key={i} position={[0, 0, plant.z]}>
                    {/* 잎 */}
                    {[0, 1, 2].map((leafIdx) => (
                        <mesh
                            key={leafIdx}
                            position={[
                                Math.sin(leafIdx * 2.1) * 0.08,
                                0.05,
                                Math.cos(leafIdx * 2.1) * 0.08
                            ]}
                            rotation={[0.3, leafIdx * 2.1, 0]}
                        >
                            <sphereGeometry args={[0.05, 6, 4]} />
                            <meshStandardMaterial color="#228b22" />
                        </mesh>
                    ))}

                    {/* 딸기 열매들 */}
                    {Array.from({ length: plant.berries }).map((_, berryIdx) => {
                        const angle = (berryIdx / plant.berries) * Math.PI * 2;
                        const ripe = (growthPhase + berryIdx * 0.3) % 1;
                        const color = ripe > 0.7 ? '#ff2222' : ripe > 0.4 ? '#ff6666' : '#88cc88';
                        return (
                            <group
                                key={berryIdx}
                                position={[
                                    Math.sin(angle) * 0.12,
                                    -0.02,
                                    Math.cos(angle) * 0.05
                                ]}
                            >
                                {/* 딸기 몸체 */}
                                <mesh>
                                    <coneGeometry args={[0.02 * plant.growth, 0.04 * plant.growth, 6]} />
                                    <meshStandardMaterial color={color} />
                                </mesh>
                                {/* 딸기 꼭지 */}
                                <mesh position={[0, 0.025, 0]}>
                                    <sphereGeometry args={[0.008, 6, 4]} />
                                    <meshStandardMaterial color="#228b22" />
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
// 수확 로봇
// ============================================

function HarvestRobot({ width, length, height, phase }: {
    width: number; length: number; height: number; phase: number;
}) {
    const robotRef = useRef<THREE.Group>(null);
    const armRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (robotRef.current) {
            // 레일 위 좌우 이동
            robotRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * (width * 0.3);
            // 앞뒤 이동
            robotRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.2) * (length * 0.3);
        }
        if (armRef.current) {
            // 팔 동작
            armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.3 - 0.5;
        }
    });

    return (
        <group ref={robotRef} position={[0, 0, 0]}>
            {/* 레일 */}
            <mesh position={[0, height - 0.3, 0]}>
                <boxGeometry args={[width * 0.8, 0.05, 0.05]} />
                <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>

            {/* 로봇 캐리지 */}
            <mesh position={[0, height - 0.4, 0]}>
                <boxGeometry args={[0.3, 0.15, 0.3]} />
                <meshStandardMaterial color="#ff6600" metalness={0.5} />
            </mesh>

            {/* 수직 암 */}
            <mesh position={[0, height * 0.5, 0]}>
                <boxGeometry args={[0.05, height * 0.7, 0.05]} />
                <meshStandardMaterial color="#666666" metalness={0.6} />
            </mesh>

            {/* 수확 암 */}
            <group ref={armRef} position={[0, height * 0.3, 0]}>
                <mesh position={[0.15, 0, 0]} rotation={[0, 0, 0]}>
                    <boxGeometry args={[0.25, 0.04, 0.04]} />
                    <meshStandardMaterial color="#444444" />
                </mesh>
                {/* 그리퍼 */}
                <mesh position={[0.28, 0, 0]}>
                    <boxGeometry args={[0.06, 0.08, 0.06]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                {/* 센서 */}
                <mesh position={[0.3, 0.05, 0]}>
                    <sphereGeometry args={[0.015, 8, 8]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>
        </group>
    );
}

// ============================================
// 수확 & 선별 섹션
// ============================================

function HarvestingSection({ width, length, phase }: {
    width: number; length: number; phase: number;
}) {
    return (
        <group>
            {/* 선별대 */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[width, 0.1, length]} />
                <meshStandardMaterial color="#e0e0e0" metalness={0.3} />
            </mesh>

            {/* 선별 컨베이어 */}
            <ConveyorBelt
                position={[0, 0.55, 0]}
                width={width * 0.8}
                length={length * 0.8}
                speed={phase * 2}
            />

            {/* 비전 카메라 */}
            <group position={[0, 1.2, 0]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.1, 0.15]} />
                    <meshStandardMaterial color="#222222" />
                </mesh>
                <mesh position={[0, -0.08, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
                    <meshStandardMaterial color="#111111" />
                </mesh>
                {/* 카메라 LED */}
                <mesh position={[0, -0.12, 0]}>
                    <sphereGeometry args={[0.015, 8, 8]} />
                    <meshBasicMaterial color="#ff0000" />
                </mesh>
            </group>

            {/* 등급별 분류 슈트 */}
            {['A등급', 'B등급', 'C등급'].map((grade, i) => (
                <group key={i} position={[-width * 0.3 + i * width * 0.3, 0.3, length * 0.5]}>
                    <mesh rotation={[0.3, 0, 0]}>
                        <boxGeometry args={[0.3, 0.02, 0.3]} />
                        <meshStandardMaterial color={['#22aa22', '#aaaa22', '#aa8822'][i]} />
                    </mesh>
                </group>
            ))}

            {/* 딸기들 (이동 중) */}
            <MovingStrawberries count={8} width={width * 0.6} length={length * 0.6} phase={phase} y={0.6} />

            <SectionLabel text="🔍 SORTING" position={[0, 1.5, 0]} />
        </group>
    );
}

// ============================================
// 포장 라인
// ============================================

function PackagingLine({ width, length, phase }: {
    width: number; length: number; phase: number;
}) {
    return (
        <group>
            {/* 포장 컨베이어 */}
            <ConveyorBelt
                position={[0, 0.5, 0]}
                width={width}
                length={length * 0.6}
                speed={phase * 1.5}
            />

            {/* 포장 트레이 공급기 */}
            <group position={[-width * 0.4, 0, 0]}>
                <mesh position={[0, 0.7, 0]}>
                    <boxGeometry args={[0.4, 0.6, 0.4]} />
                    <meshStandardMaterial color="#4488ff" />
                </mesh>
                {/* 트레이 스택 */}
                {[0, 1, 2, 3].map((i) => (
                    <mesh key={i} position={[0, 1.05 + i * 0.03, 0]}>
                        <boxGeometry args={[0.25, 0.02, 0.2]} />
                        <meshStandardMaterial color="#ffcccc" />
                    </mesh>
                ))}
            </group>

            {/* 딸기 충전 스테이션 */}
            <group position={[0, 0, 0]}>
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#888888" metalness={0.5} />
                </mesh>
                {/* 호퍼 */}
                <mesh position={[0, 0.7, 0]}>
                    <coneGeometry args={[0.15, 0.2, 4]} />
                    <meshStandardMaterial color="#666666" metalness={0.6} />
                </mesh>
            </group>

            {/* 라벨링 기계 */}
            <group position={[width * 0.25, 0, 0]}>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[0.25, 0.3, 0.25]} />
                    <meshStandardMaterial color="#44aa44" />
                </mesh>
                {/* 라벨 롤 */}
                <mesh position={[0.15, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </group>

            {/* 밀봉 기계 */}
            <group position={[width * 0.4, 0, 0]}>
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[0.3, 0.4, 0.3]} />
                    <meshStandardMaterial color="#ff6644" />
                </mesh>
                {/* 프레스 */}
                <mesh position={[0, 0.65, 0]}>
                    <boxGeometry args={[0.25, 0.05, 0.25]} />
                    <meshStandardMaterial color="#444444" metalness={0.7} />
                </mesh>
            </group>

            {/* 완성된 트레이들 (이동 중) */}
            <PackagedTrays count={5} width={width * 0.7} phase={phase} y={0.55} />

            <SectionLabel text="📦 PACKAGING" position={[0, 1.5, 0]} />
        </group>
    );
}

// ============================================
// 박스 포장 섹션
// ============================================

function BoxPackagingSection({ width, length, phase }: {
    width: number; length: number; phase: number;
}) {
    const boxArmRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (boxArmRef.current) {
            boxArmRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.5;
        }
    });

    return (
        <group>
            {/* 박스 접기 기계 */}
            <group position={[-width * 0.3, 0, 0]}>
                <mesh position={[0, 0.6, 0]}>
                    <boxGeometry args={[0.5, 0.8, 0.5]} />
                    <meshStandardMaterial color="#8866aa" />
                </mesh>
                {/* 박스 원단 */}
                <mesh position={[0, 1.1, 0]}>
                    <boxGeometry args={[0.4, 0.02, 0.3]} />
                    <meshStandardMaterial color="#cd853f" />
                </mesh>
            </group>

            {/* 로봇 암 (팔레타이징) */}
            <group ref={boxArmRef} position={[0, 0, 0]}>
                {/* 베이스 */}
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
                    <meshStandardMaterial color="#ff8800" metalness={0.5} />
                </mesh>
                {/* 암 1 */}
                <mesh position={[0, 0.7, 0.1]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.08, 0.5, 0.08]} />
                    <meshStandardMaterial color="#666666" />
                </mesh>
                {/* 암 2 */}
                <mesh position={[0, 1.1, 0.25]} rotation={[-0.5, 0, 0]}>
                    <boxGeometry args={[0.06, 0.4, 0.06]} />
                    <meshStandardMaterial color="#555555" />
                </mesh>
                {/* 그리퍼 */}
                <mesh position={[0, 1.25, 0.4]}>
                    <boxGeometry args={[0.2, 0.05, 0.15]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
            </group>

            {/* 팔레트 */}
            <group position={[width * 0.3, 0, 0]}>
                <mesh position={[0, 0.05, 0]}>
                    <boxGeometry args={[0.5, 0.1, 0.4]} />
                    <meshStandardMaterial color="#8b4513" />
                </mesh>
                {/* 쌓인 박스들 */}
                {[0, 1, 2].map((row) => (
                    [0, 1].map((col) => (
                        <mesh
                            key={`${row}-${col}`}
                            position={[-0.12 + col * 0.24, 0.2 + row * 0.15, 0]}
                        >
                            <boxGeometry args={[0.22, 0.12, 0.3]} />
                            <meshStandardMaterial color="#cd853f" />
                        </mesh>
                    ))
                ))}
            </group>

            <SectionLabel text="📤 BOX PACKING" position={[0, 1.8, 0]} />
        </group>
    );
}

// ============================================
// 물류 & 배송 섹션
// ============================================

function LogisticsSection({ width, length, phase }: {
    width: number; length: number; phase: number;
}) {
    const truckRef = useRef<THREE.Group>(null);
    const forkliftRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (truckRef.current) {
            // 트럭이 도착했다가 출발하는 애니메이션
            const truckPhase = (state.clock.elapsedTime * 0.1) % 2;
            if (truckPhase < 1) {
                truckRef.current.position.z = length * 0.5 - truckPhase * length * 0.3;
            } else {
                truckRef.current.position.z = length * 0.2 + (truckPhase - 1) * length * 0.8;
            }
        }
        if (forkliftRef.current) {
            forkliftRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * width * 0.2;
        }
    });

    return (
        <group>
            {/* 로딩 도크 */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[width, 0.6, length * 0.3]} />
                <meshStandardMaterial color="#555555" />
            </mesh>

            {/* 도크 레벨러 */}
            <mesh position={[0, 0.62, -length * 0.15]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[width * 0.6, 0.05, 0.4]} />
                <meshStandardMaterial color="#888888" metalness={0.7} />
            </mesh>

            {/* 배송 트럭 */}
            <group ref={truckRef} position={[0, 0, length * 0.3]}>
                {/* 트럭 캐빈 */}
                <mesh position={[0, 0.8, 1.2]}>
                    <boxGeometry args={[0.8, 0.7, 0.5]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
                {/* 캐빈 창문 */}
                <mesh position={[0, 0.9, 1.46]}>
                    <boxGeometry args={[0.6, 0.3, 0.02]} />
                    <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
                </mesh>

                {/* 트럭 화물칸 */}
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[0.9, 1.2, 2]} />
                    <meshStandardMaterial color="#ff4444" />
                </mesh>

                {/* 바퀴 */}
                {[[-0.35, 0.9], [0.35, 0.9], [-0.35, -0.5], [0.35, -0.5]].map(([x, z], i) => (
                    <mesh key={i} position={[x, 0.2, z]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                ))}

                {/* 화물 (박스들) */}
                {[0, 1, 2].map((row) => (
                    [0, 1].map((col) => (
                        <mesh
                            key={`cargo-${row}-${col}`}
                            position={[-0.2 + col * 0.4, 0.5 + row * 0.25, 0]}
                        >
                            <boxGeometry args={[0.35, 0.2, 0.4]} />
                            <meshStandardMaterial color="#cd853f" />
                        </mesh>
                    ))
                ))}
            </group>

            {/* 지게차 */}
            <group ref={forkliftRef} position={[0, 0, -length * 0.2]}>
                {/* 본체 */}
                <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[0.35, 0.4, 0.5]} />
                    <meshStandardMaterial color="#ffcc00" />
                </mesh>
                {/* 지붕 */}
                <mesh position={[0, 0.65, 0]}>
                    <boxGeometry args={[0.38, 0.05, 0.52]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                {/* 포크 마스트 */}
                <mesh position={[0, 0.4, -0.35]}>
                    <boxGeometry args={[0.3, 0.7, 0.05]} />
                    <meshStandardMaterial color="#444444" />
                </mesh>
                {/* 포크 */}
                <mesh position={[-0.1, 0.15, -0.5]}>
                    <boxGeometry args={[0.03, 0.02, 0.3]} />
                    <meshStandardMaterial color="#666666" />
                </mesh>
                <mesh position={[0.1, 0.15, -0.5]}>
                    <boxGeometry args={[0.03, 0.02, 0.3]} />
                    <meshStandardMaterial color="#666666" />
                </mesh>
                {/* 바퀴 */}
                {[[-0.15, 0.15], [0.15, 0.15], [-0.15, -0.15], [0.15, -0.15]].map(([x, z], i) => (
                    <mesh key={i} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                ))}
            </group>

            {/* 배송 상태 표시판 */}
            <group position={[0, 1.5, -length * 0.3]}>
                <mesh>
                    <boxGeometry args={[0.8, 0.4, 0.05]} />
                    <meshStandardMaterial color="#222222" />
                </mesh>
                <mesh position={[0, 0, 0.03]}>
                    <boxGeometry args={[0.75, 0.35, 0.01]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
                </mesh>
            </group>

            <SectionLabel text="🚚 LOGISTICS & DELIVERY" position={[0, 2, 0]} />
        </group>
    );
}

// ============================================
// 보조 컴포넌트들
// ============================================

function ConveyorBelt({ position, width, length, speed }: {
    position: [number, number, number]; width: number; length: number; speed: number;
}) {
    const beltRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (beltRef.current) {
            const mat = beltRef.current.material as THREE.MeshStandardMaterial;
            if (mat.map) {
                mat.map.offset.x += speed * 0.001;
            }
        }
    });

    return (
        <group position={position}>
            {/* 벨트 프레임 */}
            <mesh>
                <boxGeometry args={[width, 0.05, length]} />
                <meshStandardMaterial color="#333333" metalness={0.5} />
            </mesh>
            {/* 벨트 표면 */}
            <mesh ref={beltRef} position={[0, 0.03, 0]}>
                <boxGeometry args={[width - 0.05, 0.01, length - 0.02]} />
                <meshStandardMaterial color="#444444" roughness={0.8} />
            </mesh>
            {/* 롤러 */}
            {[-length / 2 + 0.05, length / 2 - 0.05].map((z, i) => (
                <mesh key={i} position={[0, -0.02, z]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.03, 0.03, width - 0.1, 16]} />
                    <meshStandardMaterial color="#666666" metalness={0.6} />
                </mesh>
            ))}
        </group>
    );
}

function ConveyorConnections({ width, length, phase }: {
    width: number; length: number; phase: number;
}) {
    return (
        <group>
            {/* 재배실 → 선별 */}
            <mesh position={[-width * 0.1, 0.5, -length * 0.25]}>
                <boxGeometry args={[width * 0.4, 0.03, 0.15]} />
                <meshStandardMaterial color="#444444" />
            </mesh>

            {/* 선별 → 포장 */}
            <mesh position={[width * 0.3, 0.5, -length * 0.15]}>
                <boxGeometry args={[0.15, 0.03, length * 0.3]} />
                <meshStandardMaterial color="#444444" />
            </mesh>

            {/* 포장 → 박스 */}
            <mesh position={[width * 0.3, 0.5, length * 0.17]}>
                <boxGeometry args={[0.15, 0.03, length * 0.35]} />
                <meshStandardMaterial color="#444444" />
            </mesh>

            {/* 박스 → 물류 */}
            <mesh position={[width * 0.55, 0.5, length * 0.35]}>
                <boxGeometry args={[width * 0.5, 0.03, 0.15]} />
                <meshStandardMaterial color="#444444" />
            </mesh>
        </group>
    );
}

function MovingStrawberries({ count, width, length, phase, y }: {
    count: number; width: number; length: number; phase: number; y: number;
}) {
    return (
        <group>
            {Array.from({ length: count }).map((_, i) => {
                const progress = ((phase * 2 + i / count) % 1);
                const x = -width / 2 + progress * width;
                const z = (Math.sin(i * 1.5) * 0.3) * length / 2;
                return (
                    <mesh key={i} position={[x, y, z]}>
                        <coneGeometry args={[0.015, 0.03, 6]} />
                        <meshStandardMaterial color="#ff2222" />
                    </mesh>
                );
            })}
        </group>
    );
}

function PackagedTrays({ count, width, phase, y }: {
    count: number; width: number; phase: number; y: number;
}) {
    return (
        <group>
            {Array.from({ length: count }).map((_, i) => {
                const progress = ((phase * 1.5 + i / count) % 1);
                const x = -width / 2 + progress * width;
                return (
                    <group key={i} position={[x, y, 0]}>
                        {/* 트레이 */}
                        <mesh>
                            <boxGeometry args={[0.12, 0.03, 0.08]} />
                            <meshStandardMaterial color="#ffcccc" />
                        </mesh>
                        {/* 딸기들 */}
                        {[0, 1, 2].map((j) => (
                            <mesh key={j} position={[-0.03 + j * 0.03, 0.025, 0]}>
                                <coneGeometry args={[0.01, 0.02, 6]} />
                                <meshStandardMaterial color="#ff2222" />
                            </mesh>
                        ))}
                        {/* 필름 */}
                        <mesh position={[0, 0.04, 0]}>
                            <boxGeometry args={[0.11, 0.005, 0.07]} />
                            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

function FloorMarkings({ width, length }: { width: number; length: number }) {
    return (
        <group position={[0, 0.01, 0]}>
            {/* 바닥 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, length]} />
                <meshStandardMaterial color="#2a3a4a" />
            </mesh>

            {/* 구역 표시선 */}
            <mesh position={[-width * 0.2, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, length]} />
                <meshBasicMaterial color="#ffff00" />
            </mesh>
            <mesh position={[width * 0.55, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.05, length]} />
                <meshBasicMaterial color="#ffff00" />
            </mesh>

            {/* 통로 표시 */}
            <mesh position={[width * 0.15, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.3, length * 0.9]} />
                <meshStandardMaterial color="#3a4a5a" />
            </mesh>
        </group>
    );
}

function SectionLabel({ text, position }: { text: string; position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[1.2, 0.2, 0.02]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
            </mesh>
        </group>
    );
}
