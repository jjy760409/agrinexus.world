'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { FarmType } from '@/types/smartfarm';
import DetailedFarmInterior from './DetailedFarmInterior';

interface TransparentFarmProps {
    farmType: FarmType;
    dimensions: { width: number; length: number; height: number; floors: number };
    autoRotate?: boolean;
}

// 농장 유형별 설정
const FARM_TYPE_CONFIGS: Record<FarmType, {
    wallColor: string;
    wallOpacity: number;
    roofType: 'flat' | 'peaked' | 'arched' | 'none';
    hasFrame: boolean;
    frameColor: string;
    interiorColor: string;
}> = {
    vertical: {
        wallColor: '#88ccff',
        wallOpacity: 0.1,
        roofType: 'flat',
        hasFrame: true,
        frameColor: '#4488aa',
        interiorColor: '#00ff88',
    },
    container: {
        wallColor: '#ff8844',
        wallOpacity: 0.15,
        roofType: 'flat',
        hasFrame: true,
        frameColor: '#aa6633',
        interiorColor: '#88ff00',
    },
    greenhouse: {
        wallColor: '#aaffaa',
        wallOpacity: 0.08,
        roofType: 'peaked',
        hasFrame: true,
        frameColor: '#88aa88',
        interiorColor: '#00ffaa',
    },
    indoor: {
        wallColor: '#aaaaff',
        wallOpacity: 0.12,
        roofType: 'flat',
        hasFrame: true,
        frameColor: '#6666aa',
        interiorColor: '#ff88ff',
    },
    rooftop: {
        wallColor: '#ffaaff',
        wallOpacity: 0.05,
        roofType: 'none',
        hasFrame: false,
        frameColor: '#aa88aa',
        interiorColor: '#ffff00',
    },
    underground: {
        wallColor: '#886644',
        wallOpacity: 0.2,
        roofType: 'flat',
        hasFrame: true,
        frameColor: '#664422',
        interiorColor: '#ffaa00',
    },
};

export default function TransparentFarm({ farmType, dimensions, autoRotate = true }: TransparentFarmProps) {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const config = FARM_TYPE_CONFIGS[farmType];
    const { width, length, height } = dimensions;

    // 자동 회전 (마우스로 멈춤 가능 - OrbitControls로 제어)
    useFrame((state) => {
        if (glowRef.current) {
            const material = glowRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
        }
    });

    // 투명 유리 재질
    const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: config.wallColor,
        transparent: true,
        opacity: config.wallOpacity,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.5,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
    }), [config.wallColor, config.wallOpacity]);

    // 프레임 재질
    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: config.frameColor,
        metalness: 0.8,
        roughness: 0.2,
    }), [config.frameColor]);

    return (
        <group ref={groupRef}>
            {/* 베이스 플랫폼 */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
                <boxGeometry args={[width + 0.5, 0.1, length + 0.5]} />
                <meshStandardMaterial color="#1a2a3a" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* 바닥 (반투명 그리드) */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width, length]} />
                <meshStandardMaterial color="#0a2a2a" transparent opacity={0.8} metalness={0.4} roughness={0.3} />
            </mesh>

            {/* 바닥 그리드 */}
            <FloorGridLines width={width} length={length} />

            {/* 투명 벽면들 */}
            <TransparentWalls width={width} length={length} height={height} material={glassMaterial} />

            {/* 프레임 구조 */}
            {config.hasFrame && (
                <FrameStructure width={width} length={length} height={height} material={frameMaterial} />
            )}

            {/* 지붕 */}
            <Roof
                width={width}
                length={length}
                height={height}
                type={config.roofType}
                material={glassMaterial}
            />

            {/* 상세 내부 스마트팜 설비 */}
            <DetailedFarmInterior
                farmType={farmType}
                dimensions={dimensions}
            />

            {/* 내부 글로우 효과 */}
            <mesh ref={glowRef} position={[0, height / 2, 0]}>
                <boxGeometry args={[width - 0.2, height - 0.2, length - 0.2]} />
                <meshBasicMaterial
                    color={config.interiorColor}
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 코너 글로우 */}
            <CornerGlows width={width} length={length} height={height} color={config.interiorColor} />

            {/* 입구 */}
            <Entrance position={[0, 0, length / 2]} height={height * 0.6} />

            {/* 조명 */}
            <ambientLight intensity={0.3} />
            <pointLight position={[0, height - 0.5, 0]} intensity={0.5} color="#ffffff" />
            <pointLight position={[0, height / 2, 0]} intensity={0.3} color={config.interiorColor} />
        </group>
    );
}

// 바닥 그리드
function FloorGridLines({ width, length }: { width: number; length: number }) {
    const lines = useMemo(() => {
        const lineData: { x: number; z: number; isVertical: boolean }[] = [];
        const gridSize = 1;

        for (let z = -length / 2; z <= length / 2; z += gridSize) {
            lineData.push({ x: 0, z, isVertical: false });
        }
        for (let x = -width / 2; x <= width / 2; x += gridSize) {
            lineData.push({ x, z: 0, isVertical: true });
        }
        return lineData;
    }, [width, length]);

    return (
        <group>
            {lines.map((line, i) => (
                <mesh key={i} position={[line.isVertical ? line.x : 0, 0.015, line.isVertical ? 0 : line.z]}>
                    <boxGeometry args={[line.isVertical ? 0.01 : width, 0.005, line.isVertical ? length : 0.01]} />
                    <meshBasicMaterial color="#00ff88" transparent opacity={0.15} />
                </mesh>
            ))}
        </group>
    );
}

// 투명 벽면
function TransparentWalls({ width, length, height, material }: {
    width: number; length: number; height: number; material: THREE.Material;
}) {
    return (
        <group>
            {/* 앞 벽 */}
            <mesh position={[0, height / 2, length / 2]}>
                <planeGeometry args={[width, height]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            {/* 뒤 벽 */}
            <mesh position={[0, height / 2, -length / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width, height]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            {/* 왼쪽 벽 */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            {/* 오른쪽 벽 */}
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
        </group>
    );
}

// 프레임 구조
function FrameStructure({ width, length, height, material }: {
    width: number; length: number; height: number; material: THREE.Material;
}) {
    const frameSize = 0.06;

    const verticalFrames = useMemo(() => {
        const frames: [number, number][] = [];
        const divisions = 4;

        // 코너 기둥
        frames.push([-width / 2, -length / 2]);
        frames.push([width / 2, -length / 2]);
        frames.push([-width / 2, length / 2]);
        frames.push([width / 2, length / 2]);

        // 중간 기둥들
        for (let i = 1; i < divisions; i++) {
            const x = -width / 2 + (width / divisions) * i;
            frames.push([x, -length / 2]);
            frames.push([x, length / 2]);
        }

        for (let i = 1; i < divisions * 2; i++) {
            const z = -length / 2 + (length / (divisions * 2)) * i;
            frames.push([-width / 2, z]);
            frames.push([width / 2, z]);
        }

        return frames;
    }, [width, length]);

    return (
        <group>
            {/* 수직 프레임 */}
            {verticalFrames.map((pos, i) => (
                <mesh key={`v-${i}`} position={[pos[0], height / 2, pos[1]]}>
                    <boxGeometry args={[frameSize, height, frameSize]} />
                    <primitive object={material.clone()} attach="material" />
                </mesh>
            ))}

            {/* 하단 프레임 */}
            <mesh position={[0, 0, -length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[0, 0, length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[-width / 2, 0, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[width / 2, 0, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>

            {/* 상단 프레임 */}
            <mesh position={[0, height, -length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[0, height, length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[-width / 2, height, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
            <mesh position={[width / 2, height, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={material.clone()} attach="material" />
            </mesh>
        </group>
    );
}

// 지붕
function Roof({ width, length, height, type, material }: {
    width: number; length: number; height: number; type: 'flat' | 'peaked' | 'arched' | 'none'; material: THREE.Material;
}) {
    if (type === 'none') return null;

    if (type === 'peaked') {
        return (
            <group position={[0, height, 0]}>
                {/* 박공 지붕 */}
                <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
                    <planeGeometry args={[width * 0.6, length]} />
                    <primitive object={material.clone()} attach="material" />
                </mesh>
                <mesh position={[0, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
                    <planeGeometry args={[width * 0.6, length]} />
                    <primitive object={material.clone()} attach="material" />
                </mesh>
            </group>
        );
    }

    // 평지붕
    return (
        <mesh position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[width, length]} />
            <meshPhysicalMaterial
                color="#aaddff"
                transparent
                opacity={0.1}
                metalness={0.1}
                roughness={0.1}
                transmission={0.95}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// 내부 재배 시스템
function InteriorGrowingSystems({ width, length, height, floors, farmType, interiorColor }: {
    width: number; length: number; height: number; floors: number; farmType: FarmType; interiorColor: string;
}) {
    const racks = useMemo(() => {
        const rackList: { x: number; z: number }[] = [];
        const rackWidth = 0.8;
        const aisle = 0.6;
        const rackCount = Math.min(Math.floor((width - 2) / (rackWidth + aisle)), 5);

        for (let i = 0; i < rackCount; i++) {
            const x = -width / 2 + 1.5 + i * (rackWidth + aisle);
            for (let z = -length / 2 + 2; z < length / 2 - 2; z += 1.5) {
                rackList.push({ x, z });
            }
        }
        return rackList;
    }, [width, length]);

    const shelfHeight = (height - 0.5) / floors;

    return (
        <group>
            {racks.map((rack, i) => (
                <group key={i} position={[rack.x, 0, rack.z]}>
                    {/* 랙 프레임 */}
                    <mesh position={[0, height * 0.4, 0]}>
                        <boxGeometry args={[0.6, height * 0.7, 0.4]} />
                        <meshPhysicalMaterial
                            color={interiorColor}
                            transparent
                            opacity={0.06}
                            metalness={0.3}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* 각 층의 선반 및 LED */}
                    {Array.from({ length: floors }).map((_, j) => (
                        <group key={j}>
                            {/* 선반 */}
                            <mesh position={[0, 0.1 + j * shelfHeight, 0]}>
                                <boxGeometry args={[0.55, 0.02, 0.35]} />
                                <meshStandardMaterial color="#f0f0f0" transparent opacity={0.8} />
                            </mesh>
                            {/* LED */}
                            <mesh position={[0, 0.15 + j * shelfHeight, 0]}>
                                <boxGeometry args={[0.5, 0.01, 0.3]} />
                                <meshBasicMaterial color="#ff88ff" transparent opacity={0.6} />
                            </mesh>
                            {/* 식물 */}
                            <Sphere args={[0.06, 8, 8]} position={[0, 0.2 + j * shelfHeight, 0]}>
                                <meshBasicMaterial color="#00ff66" transparent opacity={0.5} />
                            </Sphere>
                        </group>
                    ))}
                </group>
            ))}
        </group>
    );
}

// LED 조명 시스템
function LEDLighting({ width, length, height, floors }: {
    width: number; length: number; height: number; floors: number;
}) {
    return (
        <group>
            {/* 천장 LED 스트립 */}
            {[-2, 0, 2].map((x, i) => (
                <mesh key={i} position={[x, height - 0.1, 0]}>
                    <boxGeometry args={[0.1, 0.05, length - 1]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
}

// 코너 글로우
function CornerGlows({ width, length, height, color }: {
    width: number; length: number; height: number; color: string;
}) {
    const corners = [
        [-width / 2, 0, -length / 2],
        [width / 2, 0, -length / 2],
        [-width / 2, 0, length / 2],
        [width / 2, 0, length / 2],
    ];

    return (
        <group>
            {corners.map((pos, i) => (
                <group key={i} position={pos as [number, number, number]}>
                    <mesh position={[0, 0.1, 0]}>
                        <sphereGeometry args={[0.12, 16, 16]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
                    </mesh>
                    <mesh position={[0, height - 0.1, 0]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.4} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// 입구
function Entrance({ position, height }: { position: [number, number, number]; height: number }) {
    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[1.2, height, 0.08]} />
                <meshPhysicalMaterial
                    color="#aaddff"
                    transparent
                    opacity={0.15}
                    metalness={0.2}
                    roughness={0.1}
                />
            </mesh>
            <Cylinder args={[0.03, 0.03, 0.15]} position={[0.4, height / 2, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#888888" metalness={0.8} />
            </Cylinder>
        </group>
    );
}
