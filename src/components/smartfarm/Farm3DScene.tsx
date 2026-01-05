'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { Equipment, FarmType } from '@/types/smartfarm';

interface Farm3DSceneProps {
    farmType: FarmType;
    dimensions: { width: number; length: number; height: number; floors: number };
    equipment: Equipment[];
}

export default function Farm3DScene({ farmType, dimensions, equipment }: Farm3DSceneProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Calculate rack positions - More detailed layout
    const racks = useMemo(() => {
        const rackList = [];
        const rackWidth = 1.0;
        const aisle = 0.8;
        const racksPerRow = Math.floor((dimensions.width - 2) / (rackWidth + aisle));
        const racksPerCol = Math.floor((dimensions.length - 4) / (rackWidth + aisle));

        for (let row = 0; row < Math.min(racksPerRow, 6); row++) {
            for (let col = 0; col < Math.min(racksPerCol, 8); col++) {
                rackList.push({
                    x: (row - (Math.min(racksPerRow, 6) - 1) / 2) * (rackWidth + aisle),
                    z: (col - (Math.min(racksPerCol, 8) - 1) / 2) * (rackWidth + aisle) - 1,
                    isAisle: (row + 1) % 2 === 0,
                });
            }
        }
        return rackList;
    }, [dimensions.width, dimensions.length]);

    return (
        <group ref={groupRef}>
            {/* Epoxy Floor - Reflective green like in images */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[dimensions.width, dimensions.length]} />
                <meshStandardMaterial color="#0a3a2a" metalness={0.3} roughness={0.4} />
            </mesh>

            {/* Floor Grid Lines */}
            <FloorGrid width={dimensions.width} length={dimensions.length} />

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, dimensions.height, 0]}>
                <planeGeometry args={[dimensions.width, dimensions.length]} />
                <meshStandardMaterial color="#1a1a2a" side={THREE.DoubleSide} />
            </mesh>

            {/* Walls with panels */}
            <WallPanels dimensions={dimensions} />

            {/* Growing Racks with LED strips */}
            {racks.map((rack, index) => (
                <AdvancedGrowingRack
                    key={index}
                    position={[rack.x, 0, rack.z]}
                    floors={dimensions.floors}
                    height={dimensions.height - 0.5}
                    rackIndex={index}
                />
            ))}

            {/* Ceiling LED Lights */}
            <CeilingLEDSystem width={dimensions.width} length={dimensions.length} height={dimensions.height} />

            {/* HVAC System - Complete */}
            <HVACSystem dimensions={dimensions} />

            {/* CCTV Cameras */}
            <CCTVCamera position={[-dimensions.width / 2 + 0.5, dimensions.height - 0.5, -dimensions.length / 2 + 0.5]} />
            <CCTVCamera position={[dimensions.width / 2 - 0.5, dimensions.height - 0.5, -dimensions.length / 2 + 0.5]} />
            <CCTVCamera position={[0, dimensions.height - 0.5, dimensions.length / 2 - 0.5]} />

            {/* Humidifiers */}
            <Humidifier position={[dimensions.width / 2 - 1.5, dimensions.height - 0.8, 0]} />
            <Humidifier position={[-dimensions.width / 2 + 1.5, dimensions.height - 0.8, 0]} />

            {/* Nutrient Solution System */}
            <NutrientSystem position={[-dimensions.width / 2 + 1, 0, dimensions.length / 2 - 2]} />

            {/* Control Room Area */}
            <ControlRoom position={[dimensions.width / 2 - 1.5, 0, dimensions.length / 2 - 1.5]} />

            {/* Circulation Fans */}
            <CirculationFan position={[0, dimensions.height - 0.5, -dimensions.length / 2 + 1]} />
            <CirculationFan position={[0, dimensions.height - 0.5, dimensions.length / 2 - 1]} />

            {/* Exhaust and Intake Fans */}
            <ExhaustFan position={[dimensions.width / 2 - 0.1, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
            <IntakeFan position={[-dimensions.width / 2 + 0.1, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} />

            {/* IoT Sensors distributed */}
            {racks.slice(0, 6).map((rack, i) => (
                <IoTSensor key={`sensor-${i}`} position={[rack.x, 0.5 + (i % dimensions.floors) * 0.8, rack.z + 0.4]} />
            ))}

            {/* CO2 Generator */}
            <CO2Generator position={[-dimensions.width / 2 + 2, 0, -dimensions.length / 2 + 2]} />

            {/* Ambient Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[0, dimensions.height - 0.5, 0]} intensity={0.5} color="#ff88ff" />
        </group>
    );
}

// Floor Grid Component
function FloorGrid({ width, length }: { width: number; length: number }) {
    return (
        <group position={[0, 0.01, 0]}>
            {/* Grid lines */}
            {Array.from({ length: Math.floor(width) + 1 }).map((_, i) => (
                <mesh key={`vline-${i}`} position={[i - width / 2, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.02, length]} />
                    <meshBasicMaterial color="#1a5a3a" transparent opacity={0.3} />
                </mesh>
            ))}
            {Array.from({ length: Math.floor(length) + 1 }).map((_, i) => (
                <mesh key={`hline-${i}`} position={[0, 0.001, i - length / 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
                    <planeGeometry args={[0.02, width]} />
                    <meshBasicMaterial color="#1a5a3a" transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    );
}

// Wall Panels Component
function WallPanels({ dimensions }: { dimensions: { width: number; length: number; height: number } }) {
    return (
        <group>
            {/* Back wall with panels */}
            <mesh position={[0, dimensions.height / 2, -dimensions.length / 2]}>
                <boxGeometry args={[dimensions.width, dimensions.height, 0.15]} />
                <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Side walls */}
            <mesh position={[-dimensions.width / 2, dimensions.height / 2, 0]}>
                <boxGeometry args={[0.15, dimensions.height, dimensions.length]} />
                <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[dimensions.width / 2, dimensions.height / 2, 0]}>
                <boxGeometry args={[0.15, dimensions.height, dimensions.length]} />
                <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
            </mesh>
            {/* Front wall with door opening */}
            <mesh position={[-dimensions.width / 4, dimensions.height / 2, dimensions.length / 2]}>
                <boxGeometry args={[dimensions.width / 2 - 1, dimensions.height, 0.15]} />
                <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[dimensions.width / 4 + 0.5, dimensions.height / 2, dimensions.length / 2]}>
                <boxGeometry args={[dimensions.width / 2 - 1, dimensions.height, 0.15]} />
                <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.3} />
            </mesh>
        </group>
    );
}

// Advanced Growing Rack with LED strips per shelf
function AdvancedGrowingRack({ position, floors, height, rackIndex }: {
    position: [number, number, number];
    floors: number;
    height: number;
    rackIndex: number;
}) {
    const shelfHeight = height / floors;

    return (
        <group position={position}>
            {/* Aluminum Frame - 4 vertical posts */}
            {[[-0.45, -0.25], [0.45, -0.25], [-0.45, 0.25], [0.45, 0.25]].map(([x, z], i) => (
                <Box key={i} args={[0.04, height, 0.04]} position={[x, height / 2, z]}>
                    <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </Box>
            ))}

            {/* Horizontal frame supports */}
            {Array.from({ length: floors + 1 }).map((_, i) => (
                <group key={`frame-${i}`} position={[0, i * shelfHeight, 0]}>
                    <Box args={[0.9, 0.03, 0.03]} position={[0, 0, -0.25]}>
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                    </Box>
                    <Box args={[0.9, 0.03, 0.03]} position={[0, 0, 0.25]}>
                        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                    </Box>
                </group>
            ))}

            {/* Shelves with NFT channels and plants */}
            {Array.from({ length: floors }).map((_, floor) => (
                <group key={floor} position={[0, floor * shelfHeight + 0.1, 0]}>
                    {/* White shelf tray */}
                    <Box args={[0.85, 0.05, 0.5]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#f0f0f0" />
                    </Box>

                    {/* NFT Growing channels */}
                    {[-0.15, 0, 0.15].map((z, ci) => (
                        <Box key={ci} args={[0.8, 0.06, 0.08]} position={[0, 0.05, z]}>
                            <meshStandardMaterial color="#e0e0e0" />
                        </Box>
                    ))}

                    {/* Lettuce plants - More realistic */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <LettucePlant
                            key={i}
                            position={[(i - 3.5) * 0.1, 0.08, (i % 3 - 1) * 0.15]}
                            growthStage={0.5 + Math.random() * 0.5}
                        />
                    ))}

                    {/* LED Strip above each shelf */}
                    <LEDStrip
                        position={[0, shelfHeight - 0.1, 0]}
                        width={0.8}
                        color={floor % 2 === 0 ? '#ff88ff' : '#ff44aa'}
                    />
                </group>
            ))}
        </group>
    );
}

// Lettuce Plant Component
function LettucePlant({ position, growthStage }: { position: [number, number, number]; growthStage: number }) {
    const leafCount = Math.floor(5 + growthStage * 8);
    const size = 0.03 + growthStage * 0.04;

    return (
        <group position={position}>
            {/* Lettuce leaves in rosette pattern */}
            {Array.from({ length: leafCount }).map((_, i) => {
                const angle = (i / leafCount) * Math.PI * 2;
                const radius = size * (0.5 + (i / leafCount) * 0.5);
                const tilt = 0.3 + (i / leafCount) * 0.4;

                return (
                    <mesh
                        key={i}
                        position={[
                            Math.cos(angle) * radius * 0.3,
                            size * 0.5 + (i / leafCount) * size * 0.3,
                            Math.sin(angle) * radius * 0.3
                        ]}
                        rotation={[tilt, angle, 0]}
                    >
                        <sphereGeometry args={[size * 0.8, 6, 4]} />
                        <meshStandardMaterial
                            color={i < leafCount / 2 ? '#2d8a2d' : '#4ade80'}
                            roughness={0.8}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}

// LED Strip Component
function LEDStrip({ position, width, color }: { position: [number, number, number]; width: number; color: string }) {
    return (
        <group position={position}>
            <Box args={[width, 0.015, 0.05]}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                />
            </Box>
            <pointLight color={color} intensity={0.15} distance={1} />
        </group>
    );
}

// Ceiling LED System
function CeilingLEDSystem({ width, length, height }: { width: number; length: number; height: number }) {
    const rows = Math.floor(length / 2);

    return (
        <group>
            {Array.from({ length: rows }).map((_, i) => (
                <group key={i} position={[0, height - 0.15, (i - rows / 2) * 2 + 1]}>
                    <Box args={[width - 2, 0.05, 0.15]}>
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#ff88ff"
                            emissiveIntensity={0.3}
                        />
                    </Box>
                    <pointLight color="#ff88ff" intensity={0.2} distance={3} />
                </group>
            ))}
        </group>
    );
}

// Complete HVAC System
function HVACSystem({ dimensions }: { dimensions: { width: number; length: number; height: number } }) {
    return (
        <group>
            {/* Main AC Unit on wall */}
            <AirConditioner position={[0, dimensions.height - 1, -dimensions.length / 2 + 0.3]} />

            {/* Ductwork */}
            <Duct start={[0, dimensions.height - 0.5, -dimensions.length / 2 + 0.5]}
                end={[-dimensions.width / 3, dimensions.height - 0.5, 0]} />
            <Duct start={[0, dimensions.height - 0.5, -dimensions.length / 2 + 0.5]}
                end={[dimensions.width / 3, dimensions.height - 0.5, 0]} />
        </group>
    );
}

// Air Conditioner Unit
function AirConditioner({ position }: { position: [number, number, number] }) {
    const fanRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (fanRef.current) {
            fanRef.current.rotation.z += 0.05;
        }
    });

    return (
        <group position={position}>
            {/* Unit body */}
            <Box args={[1.2, 0.4, 0.25]}>
                <meshStandardMaterial color="#e8e8e8" />
            </Box>
            {/* Vents */}
            {[-0.4, 0, 0.4].map((x, i) => (
                <Box key={i} args={[0.25, 0.25, 0.01]} position={[x, -0.05, 0.13]}>
                    <meshStandardMaterial color="#2a2a3a" />
                </Box>
            ))}
            {/* Status indicator */}
            <Box args={[0.05, 0.05, 0.01]} position={[0.5, 0.12, 0.13]}>
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
            </Box>
        </group>
    );
}

// Duct Component
function Duct({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
    const length = Math.sqrt(
        Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2;
    const midZ = (start[2] + end[2]) / 2;

    return (
        <Box args={[0.2, 0.15, length]} position={[midX, midY, midZ]} rotation={[0, Math.atan2(end[0] - start[0], end[2] - start[2]), 0]}>
            <meshStandardMaterial color="#a0a0a0" metalness={0.7} roughness={0.3} />
        </Box>
    );
}

// CCTV Camera
function CCTVCamera({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Mount */}
            <Box args={[0.1, 0.15, 0.1]} position={[0, 0.08, 0]}>
                <meshStandardMaterial color="#2a2a3a" />
            </Box>
            {/* Camera body */}
            <Cylinder args={[0.04, 0.05, 0.12, 8]} rotation={[Math.PI / 6, 0, 0]} position={[0, -0.05, 0.05]}>
                <meshStandardMaterial color="#1a1a2a" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Lens */}
            <Sphere args={[0.025, 8, 8]} position={[0, -0.08, 0.1]}>
                <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
            </Sphere>
            {/* IR LED */}
            <pointLight color="#ff0000" intensity={0.05} distance={0.3} position={[0, -0.08, 0.12]} />
        </group>
    );
}

// Humidifier
function Humidifier({ position }: { position: [number, number, number] }) {
    const mistRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (mistRef.current) {
            mistRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
    });

    return (
        <group position={position}>
            {/* Unit */}
            <Box args={[0.4, 0.2, 0.2]}>
                <meshStandardMaterial color="#e0e0e0" />
            </Box>
            {/* Nozzle */}
            <Cylinder args={[0.03, 0.02, 0.1, 8]} position={[0, -0.15, 0]}>
                <meshStandardMaterial color="#808080" />
            </Cylinder>
            {/* Mist effect */}
            <mesh ref={mistRef} position={[0, -0.3, 0]}>
                <coneGeometry args={[0.15, 0.3, 8]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
            </mesh>
        </group>
    );
}

// Nutrient Solution System
function NutrientSystem({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Tank A - Red */}
            <Cylinder args={[0.15, 0.15, 0.5, 16]} position={[0, 0.25, 0]}>
                <meshStandardMaterial color="#cc3333" metalness={0.3} roughness={0.5} />
            </Cylinder>
            {/* Tank B - Blue */}
            <Cylinder args={[0.15, 0.15, 0.5, 16]} position={[0.35, 0.25, 0]}>
                <meshStandardMaterial color="#3333cc" metalness={0.3} roughness={0.5} />
            </Cylinder>
            {/* Main reservoir */}
            <Box args={[0.8, 0.4, 0.5]} position={[0.15, 0.2, 0.5]}>
                <meshStandardMaterial color="#404040" metalness={0.5} roughness={0.3} />
            </Box>
            {/* Pump */}
            <Box args={[0.2, 0.15, 0.15]} position={[0.15, 0.5, 0.5]}>
                <meshStandardMaterial color="#2a4a2a" />
            </Box>
            {/* Pipes */}
            <Cylinder args={[0.02, 0.02, 0.4, 8]} rotation={[0, 0, Math.PI / 2]} position={[0.15, 0.45, 0.25]}>
                <meshStandardMaterial color="#505050" />
            </Cylinder>
        </group>
    );
}

// Control Room
function ControlRoom({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Desk */}
            <Box args={[1.2, 0.8, 0.6]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color="#4a4a5a" />
            </Box>
            {/* Main Monitor */}
            <Box args={[0.8, 0.5, 0.03]} position={[0, 1, 0]}>
                <meshStandardMaterial color="#1a1a2a" />
            </Box>
            {/* Screen content */}
            <Box args={[0.7, 0.4, 0.01]} position={[0, 1, 0.02]}>
                <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.4} />
            </Box>
            {/* Secondary monitor */}
            <Box args={[0.5, 0.35, 0.02]} position={[-0.5, 0.95, 0.1]} rotation={[0, 0.3, 0]}>
                <meshStandardMaterial color="#1a1a2a" />
            </Box>
            <Box args={[0.45, 0.3, 0.01]} position={[-0.5, 0.95, 0.12]} rotation={[0, 0.3, 0]}>
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} />
            </Box>
            {/* Chair */}
            <Box args={[0.4, 0.4, 0.4]} position={[0, 0.2, 0.6]}>
                <meshStandardMaterial color="#2a2a3a" />
            </Box>
        </group>
    );
}

// Circulation Fan
function CirculationFan({ position }: { position: [number, number, number] }) {
    const fanRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (fanRef.current) {
            fanRef.current.rotation.z += 0.15;
        }
    });

    return (
        <group position={position}>
            {/* Housing */}
            <Cylinder args={[0.25, 0.25, 0.1, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#404040" metalness={0.6} roughness={0.4} />
            </Cylinder>
            {/* Fan blades */}
            <group ref={fanRef} position={[0, 0, 0.03]}>
                {[0, 1, 2, 3].map(i => (
                    <Box key={i} args={[0.18, 0.04, 0.01]} rotation={[0, 0, (i * Math.PI) / 2]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
                    </Box>
                ))}
            </group>
            {/* Center hub */}
            <Sphere args={[0.04, 8, 8]} position={[0, 0, 0.03]}>
                <meshStandardMaterial color="#2a2a3a" />
            </Sphere>
        </group>
    );
}

// Exhaust Fan
function ExhaustFan({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
    const fanRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (fanRef.current) {
            fanRef.current.rotation.z += 0.1;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Frame */}
            <Box args={[0.5, 0.5, 0.1]}>
                <meshStandardMaterial color="#606060" />
            </Box>
            {/* Grill */}
            <Box args={[0.45, 0.45, 0.02]} position={[0, 0, 0.05]}>
                <meshStandardMaterial color="#404040" wireframe />
            </Box>
            {/* Fan */}
            <group ref={fanRef} position={[0, 0, 0]}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <Box key={i} args={[0.15, 0.03, 0.02]} rotation={[0, 0, (i * Math.PI) / 3]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#808080" />
                    </Box>
                ))}
            </group>
            {/* Label */}
            <Box args={[0.15, 0.04, 0.01]} position={[0.15, 0.2, 0.06]}>
                <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.5} />
            </Box>
        </group>
    );
}

// Intake Fan
function IntakeFan({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
    const fanRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (fanRef.current) {
            fanRef.current.rotation.z -= 0.08;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            <Box args={[0.4, 0.4, 0.08]}>
                <meshStandardMaterial color="#404040" />
            </Box>
            <group ref={fanRef} position={[0, 0, 0.05]}>
                {[0, 1, 2, 3, 4].map(i => (
                    <Box key={i} args={[0.12, 0.025, 0.01]} rotation={[0, 0, (i * Math.PI * 2) / 5]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#a0a0a0" />
                    </Box>
                ))}
            </group>
            <Box args={[0.12, 0.03, 0.01]} position={[0.12, 0.17, 0.05]}>
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
            </Box>
        </group>
    );
}

// CO2 Generator
function CO2Generator({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Tank */}
            <Cylinder args={[0.12, 0.12, 0.6, 16]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#2a4a6a" metalness={0.6} roughness={0.3} />
            </Cylinder>
            {/* Valve */}
            <Cylinder args={[0.04, 0.04, 0.08, 8]} position={[0, 0.65, 0]}>
                <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Gauge */}
            <Sphere args={[0.04, 8, 8]} position={[0.1, 0.55, 0.05]}>
                <meshStandardMaterial color="#ffffff" />
            </Sphere>
            {/* CO2 label */}
            <Box args={[0.1, 0.04, 0.01]} position={[0, 0.4, 0.13]}>
                <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
            </Box>
        </group>
    );
}

// IoT Sensor Component
function IoTSensor({ position }: { position: [number, number, number] }) {
    const blinkRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (blinkRef.current) {
            const material = blinkRef.current.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
        }
    });

    return (
        <group position={position}>
            <Cylinder args={[0.025, 0.02, 0.06, 8]}>
                <meshStandardMaterial color="#3a3a4a" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <mesh ref={blinkRef} position={[0, 0.04, 0]}>
                <sphereGeometry args={[0.008, 6, 6]} />
                <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} />
            </mesh>
        </group>
    );
}
