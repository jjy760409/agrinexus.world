'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface GlassFarm3DProps {
    dimensions?: { width: number; length: number; height: number };
    showInterior?: boolean;
}

// 유리 재질 생성
function createGlassMaterial(color: string = '#88ccff', opacity: number = 0.15) {
    return new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.5,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide,
    });
}

// 프레임 재질
function createFrameMaterial() {
    return new THREE.MeshStandardMaterial({
        color: '#2a3f5f',
        metalness: 0.8,
        roughness: 0.2,
    });
}

export default function GlassFarm3D({
    dimensions = { width: 12, length: 20, height: 4 },
    showInterior = true,
}: GlassFarm3DProps) {
    const groupRef = useRef<THREE.Group>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    // 내부 활성화 효과
    useFrame((state) => {
        if (glowRef.current) {
            const material = glowRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        }
    });

    const { width, length, height } = dimensions;
    const wallThickness = 0.05;
    const frameSize = 0.08;

    // 창문 패널 그리드 계산
    const panelCountX = 6;
    const panelCountZ = 10;
    const panelWidth = width / panelCountX;
    const panelLength = length / panelCountZ;

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
                <meshStandardMaterial
                    color="#0a2a2a"
                    transparent
                    opacity={0.8}
                    metalness={0.4}
                    roughness={0.3}
                />
            </mesh>

            {/* 바닥 그리드 라인 */}
            <FloorGridLines width={width} length={length} />

            {/* 유리 벽면들 */}
            <GlassWalls width={width} length={length} height={height} />

            {/* 프레임 구조 */}
            <FrameStructure width={width} length={length} height={height} />

            {/* 지붕 (투명 유리) */}
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

            {/* 지붕 프레임 그리드 */}
            <RoofFrameGrid width={width} length={length} height={height} />

            {/* 내부 장비 (투명도 적용) */}
            {showInterior && (
                <group>
                    {/* 재배 랙 */}
                    <TransparentGrowingRacks width={width} length={length} height={height} />

                    {/* LED 조명 스트립 */}
                    <LEDStrips width={width} length={length} height={height} />

                    {/* 입구/문 */}
                    <EntranceDoor position={[0, 0, length / 2]} height={height * 0.6} />
                </group>
            )}

            {/* 내부 글로우 효과 */}
            <mesh ref={glowRef} position={[0, height / 2, 0]}>
                <boxGeometry args={[width - 0.2, height - 0.2, length - 0.2]} />
                <meshBasicMaterial
                    color="#00ff88"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* 코너 하이라이트 */}
            <CornerHighlights width={width} length={length} height={height} />
        </group>
    );
}

// 바닥 그리드 라인
function FloorGridLines({ width, length }: { width: number; length: number }) {
    const lines = useMemo(() => {
        const lineData: { x: number; z: number; isVertical: boolean }[] = [];
        const gridSize = 1;

        // X 방향 라인
        for (let z = -length / 2; z <= length / 2; z += gridSize) {
            lineData.push({ x: 0, z, isVertical: false });
        }

        // Z 방향 라인
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

// 유리 벽면
function GlassWalls({ width, length, height }: { width: number; length: number; height: number }) {
    const glassMaterial = useMemo(() => createGlassMaterial('#88ddff', 0.12), []);

    return (
        <group>
            {/* 앞 벽 */}
            <mesh position={[0, height / 2, length / 2]}>
                <planeGeometry args={[width, height]} />
                <primitive object={glassMaterial.clone()} attach="material" />
            </mesh>

            {/* 뒤 벽 */}
            <mesh position={[0, height / 2, -length / 2]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width, height]} />
                <primitive object={glassMaterial.clone()} attach="material" />
            </mesh>

            {/* 왼쪽 벽 */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <primitive object={glassMaterial.clone()} attach="material" />
            </mesh>

            {/* 오른쪽 벽 */}
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <primitive object={glassMaterial.clone()} attach="material" />
            </mesh>
        </group>
    );
}

// 프레임 구조
function FrameStructure({ width, length, height }: { width: number; length: number; height: number }) {
    const frameSize = 0.06;
    const frameMaterial = useMemo(() => createFrameMaterial(), []);

    const verticalFrames = useMemo(() => {
        const frames = [];
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
                    <primitive object={frameMaterial.clone()} attach="material" />
                </mesh>
            ))}

            {/* 하단 프레임 */}
            <mesh position={[0, 0, -length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[0, 0, length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[-width / 2, 0, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[width / 2, 0, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>

            {/* 상단 프레임 */}
            <mesh position={[0, height, -length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[0, height, length / 2]}>
                <boxGeometry args={[width, frameSize, frameSize]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[-width / 2, height, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
            <mesh position={[width / 2, height, 0]}>
                <boxGeometry args={[frameSize, frameSize, length]} />
                <primitive object={frameMaterial.clone()} attach="material" />
            </mesh>
        </group>
    );
}

// 지붕 프레임 그리드
function RoofFrameGrid({ width, length, height }: { width: number; length: number; height: number }) {
    const frameSize = 0.04;

    const roofFrames = useMemo(() => {
        const frames = [];
        const xDivisions = 4;
        const zDivisions = 8;

        // X 방향 빔
        for (let i = 0; i <= zDivisions; i++) {
            const z = -length / 2 + (length / zDivisions) * i;
            frames.push({ type: 'x', pos: [0, height, z], size: [width, frameSize, frameSize] });
        }

        // Z 방향 빔
        for (let i = 0; i <= xDivisions; i++) {
            const x = -width / 2 + (width / xDivisions) * i;
            frames.push({ type: 'z', pos: [x, height, 0], size: [frameSize, frameSize, length] });
        }

        return frames;
    }, [width, length, height]);

    return (
        <group>
            {roofFrames.map((frame, i) => (
                <mesh key={i} position={frame.pos as [number, number, number]}>
                    <boxGeometry args={frame.size as [number, number, number]} />
                    <meshStandardMaterial color="#2a4a6a" metalness={0.7} roughness={0.3} />
                </mesh>
            ))}
        </group>
    );
}

// 투명 재배 랙
function TransparentGrowingRacks({ width, length, height }: { width: number; length: number; height: number }) {
    const racks = useMemo(() => {
        const rackList = [];
        const rackWidth = 0.8;
        const aisle = 0.6;
        const rackCount = 4;

        for (let i = 0; i < rackCount; i++) {
            const x = -width / 2 + 1.5 + i * (rackWidth + aisle);
            for (let z = -length / 2 + 2; z < length / 2 - 2; z += 1.5) {
                rackList.push({ x, z });
            }
        }

        return rackList;
    }, [width, length]);

    return (
        <group>
            {racks.map((rack, i) => (
                <group key={i} position={[rack.x, 0, rack.z]}>
                    {/* 랙 프레임 */}
                    <mesh position={[0, height * 0.4, 0]}>
                        <boxGeometry args={[0.6, height * 0.7, 0.4]} />
                        <meshPhysicalMaterial
                            color="#88ffaa"
                            transparent
                            opacity={0.08}
                            metalness={0.3}
                            roughness={0.2}
                        />
                    </mesh>

                    {/* LED 스트립 (각 층) */}
                    {[0.3, 0.6, 0.9, 1.2].map((y, j) => (
                        <mesh key={j} position={[0, y, 0]}>
                            <boxGeometry args={[0.5, 0.02, 0.3]} />
                            <meshBasicMaterial color="#ff88ff" transparent opacity={0.6} />
                        </mesh>
                    ))}

                    {/* 식물 표시 (작은 구체들) */}
                    {[0.35, 0.65, 0.95, 1.25].map((y, j) => (
                        <Sphere key={`plant-${j}`} args={[0.08, 8, 8]} position={[0, y, 0]}>
                            <meshBasicMaterial color="#00ff66" transparent opacity={0.5} />
                        </Sphere>
                    ))}
                </group>
            ))}
        </group>
    );
}

// LED 스트립
function LEDStrips({ width, length, height }: { width: number; length: number; height: number }) {
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

// 입구 문
function EntranceDoor({ position, height }: { position: [number, number, number]; height: number }) {
    return (
        <group position={position}>
            {/* 문 프레임 */}
            <mesh position={[0, height / 2, 0]}>
                <boxGeometry args={[1.2, height, 0.1]} />
                <meshPhysicalMaterial
                    color="#aaddff"
                    transparent
                    opacity={0.2}
                    metalness={0.2}
                    roughness={0.1}
                />
            </mesh>

            {/* 문 손잡이 */}
            <Cylinder args={[0.03, 0.03, 0.15]} position={[0.4, height / 2, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#888888" metalness={0.8} />
            </Cylinder>
        </group>
    );
}

// 코너 하이라이트
function CornerHighlights({ width, length, height }: { width: number; length: number; height: number }) {
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
                    {/* 하단 글로우 */}
                    <mesh position={[0, 0.1, 0]}>
                        <sphereGeometry args={[0.15, 16, 16]} />
                        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
                    </mesh>

                    {/* 상단 글로우 */}
                    <mesh position={[0, height - 0.1, 0]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// Camera View 컨트롤을 위한 프리셋
export const CAMERA_PRESETS = {
    free: { position: [15, 10, 15], target: [0, 2, 0] },
    top: { position: [0, 20, 0.1], target: [0, 0, 0] },
    front: { position: [0, 3, 20], target: [0, 2, 0] },
    side: { position: [20, 3, 0], target: [0, 2, 0] },
    isometric: { position: [12, 12, 12], target: [0, 1, 0] },
};
