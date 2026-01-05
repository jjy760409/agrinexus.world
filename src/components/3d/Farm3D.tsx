'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Float, Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function Plant({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={meshRef} position={position} scale={scale}>
                {/* Stem */}
                <Cylinder args={[0.02, 0.03, 0.3, 8]} position={[0, 0.15, 0]}>
                    <meshStandardMaterial color="#2d5a27" />
                </Cylinder>
                {/* Leaves */}
                <Box args={[0.15, 0.02, 0.1]} position={[0.05, 0.25, 0]} rotation={[0, 0, 0.3]}>
                    <meshStandardMaterial color={color} />
                </Box>
                <Box args={[0.15, 0.02, 0.1]} position={[-0.05, 0.3, 0]} rotation={[0, 0, -0.3]}>
                    <meshStandardMaterial color={color} />
                </Box>
                <Box args={[0.1, 0.02, 0.15]} position={[0, 0.35, 0.03]} rotation={[0.2, 0, 0]}>
                    <meshStandardMaterial color={color} />
                </Box>
            </group>
        </Float>
    );
}

function Zone({ position, size, color, label }: { position: [number, number, number]; size: [number, number, number]; color: string; label: string }) {
    return (
        <group position={position}>
            {/* Zone base */}
            <Box args={size} position={[0, 0.025, 0]}>
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                    emissive={color}
                    emissiveIntensity={0.2}
                />
            </Box>

            {/* Zone border */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
                <lineBasicMaterial color={color} linewidth={2} />
            </lineSegments>

            {/* Plants in zone */}
            {Array.from({ length: 6 }).map((_, i) => (
                <Plant
                    key={i}
                    position={[
                        (i % 3 - 1) * 0.25,
                        0.05,
                        (Math.floor(i / 3) - 0.5) * 0.25,
                    ]}
                    color={color === '#00ff88' ? '#4ade80' : color === '#00d4ff' ? '#22d3ee' : '#fbbf24'}
                    scale={0.8}
                />
            ))}

            {/* Zone label */}
            <Text
                position={[0, 0.6, 0]}
                fontSize={0.12}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}

function FarmScene() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Floor Grid */}
            <Grid
                args={[4, 4]}
                cellSize={0.2}
                cellThickness={0.5}
                cellColor="#00ff8833"
                sectionSize={1}
                sectionThickness={1}
                sectionColor="#00ff8866"
                fadeDistance={10}
                fadeStrength={1}
                followCamera={false}
                position={[0, 0, 0]}
            />

            {/* Zones */}
            <Zone
                position={[-0.6, 0, -0.6]}
                size={[0.9, 0.05, 0.9]}
                color="#00ff88"
                label="Zone A"
            />
            <Zone
                position={[0.6, 0, -0.6]}
                size={[0.9, 0.05, 0.9]}
                color="#00d4ff"
                label="Zone B"
            />
            <Zone
                position={[-0.6, 0, 0.6]}
                size={[0.9, 0.05, 0.9]}
                color="#ffb800"
                label="Zone C"
            />
            <Zone
                position={[0.6, 0, 0.6]}
                size={[0.9, 0.05, 0.9]}
                color="#00ff88"
                label="Zone D"
            />

            {/* Central hub */}
            <Cylinder args={[0.15, 0.15, 0.3, 32]} position={[0, 0.15, 0]}>
                <meshStandardMaterial
                    color="#7b2fff"
                    emissive="#7b2fff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </Cylinder>

            {/* Light beams from hub */}
            {[0, 90, 180, 270].map((angle, i) => (
                <mesh
                    key={i}
                    position={[
                        Math.cos(angle * Math.PI / 180) * 0.3,
                        0.1,
                        Math.sin(angle * Math.PI / 180) * 0.3,
                    ]}
                    rotation={[0, -angle * Math.PI / 180, 0]}
                >
                    <boxGeometry args={[0.3, 0.02, 0.02]} />
                    <meshStandardMaterial
                        color="#00d4ff"
                        emissive="#00d4ff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function Farm3D() {
    return (
        <Canvas
            camera={{ position: [2, 2, 2], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
        >
            <Suspense fallback={null}>
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-5, 3, -5]} intensity={0.5} color="#00ff88" />
                <pointLight position={[5, 3, -5]} intensity={0.5} color="#00d4ff" />

                {/* Scene */}
                <FarmScene />

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={5}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.5}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Suspense>
        </Canvas>
    );
}
