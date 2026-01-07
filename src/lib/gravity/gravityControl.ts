// AgriNexus World OS - 중력 제어 농업
// Gravity Control Agriculture - 세계 최초 중력 조작 농업 시스템

export interface GravityControlSystem {
    id: string;
    farmId: string;
    zones: GravityZone[];
    generators: GravityGenerator[];
    effects: GravityEffect[];
    experiments: GravityExperiment[];
    metrics: GravityMetrics;
    status: 'active' | 'calibrating' | 'maintenance' | 'offline';
}

export interface GravityZone {
    id: string;
    name: string;
    koreanName: string;
    position: { x: number; y: number; z: number };
    radius: number;
    gravityLevel: number;               // 0-2g (1g = Earth normal)
    uniformity: number;                 // %
    stability: number;                  // %
    crops: string[];
    effects: ZoneEffect[];
    active: boolean;
}

export interface ZoneEffect {
    type: 'root_direction' | 'stem_strength' | 'water_distribution' | 'nutrient_transport' | 'cell_division' | 'root_depth';
    magnitude: number;
    direction: 'enhanced' | 'reduced' | 'reversed';
    observation: string;
}

export interface GravityGenerator {
    id: string;
    zoneId: string;
    type: GeneratorType;
    power: number;                      // kW
    efficiency: number;                 // %
    temperature: number;
    magneticField: number;              // Tesla
    status: 'running' | 'standby' | 'cooldown' | 'maintenance';
}

export type GeneratorType = 'electromagnetic' | 'acoustic_levitation' | 'diamagnetic' | 'centrifugal' | 'hybrid';

export interface GravityEffect {
    id: string;
    zoneId: string;
    effectType: EffectType;
    beforeGravity: number;
    afterGravity: number;
    measuredChange: number;             // %
    timestamp: Date;
}

export type EffectType = 'growth_rate' | 'root_depth' | 'stem_thickness' | 'leaf_area' | 'fruit_weight' | 'sugar_content';

export interface GravityExperiment {
    id: string;
    name: string;
    hypothesis: string;
    gravityLevels: number[];
    duration: number;                   // days
    crops: string[];
    status: 'planned' | 'running' | 'completed' | 'analyzed';
    results?: ExperimentResult;
}

export interface ExperimentResult {
    conclusion: string;
    optimalGravity: number;
    yieldChange: number;                // %
    qualityChange: number;              // %
    recommendations: string[];
}

export interface GravityMetrics {
    totalZones: number;
    activeGenerators: number;
    averageGravity: number;
    energyConsumption: number;          // kWh/day
    yieldImprovement: number;           // %
    experimentsCompleted: number;
}

export class GravityControlEngine {
    private system: GravityControlSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): GravityControlSystem {
        return {
            id: `gravity-${Date.now()}`,
            farmId,
            zones: [
                { id: 'gz-1', name: 'Micro-Gravity Zone', koreanName: '미세중력 구역', position: { x: 0, y: 0, z: 0 }, radius: 5, gravityLevel: 0.3, uniformity: 92, stability: 88, crops: ['딸기'], effects: [{ type: 'root_direction', magnitude: 40, direction: 'reversed', observation: '360도 방사형 뿌리 성장' }], active: true },
                { id: 'gz-2', name: 'Low Gravity Zone', koreanName: '저중력 구역', position: { x: 10, y: 0, z: 0 }, radius: 5, gravityLevel: 0.5, uniformity: 95, stability: 92, crops: ['토마토'], effects: [{ type: 'stem_strength', magnitude: 25, direction: 'enhanced', observation: '줄기 두께 25% 증가' }], active: true },
                { id: 'gz-3', name: 'Normal Zone', koreanName: '표준 구역', position: { x: 20, y: 0, z: 0 }, radius: 5, gravityLevel: 1.0, uniformity: 100, stability: 100, crops: ['상추'], effects: [], active: true },
                { id: 'gz-4', name: 'High Gravity Zone', koreanName: '고중력 구역', position: { x: 30, y: 0, z: 0 }, radius: 5, gravityLevel: 1.5, uniformity: 90, stability: 85, crops: ['바질'], effects: [{ type: 'root_depth', magnitude: 35, direction: 'enhanced', observation: '뿌리 깊이 35% 증가' }], active: true }
            ],
            generators: [
                { id: 'gen-1', zoneId: 'gz-1', type: 'diamagnetic', power: 50, efficiency: 75, temperature: 28, magneticField: 15, status: 'running' },
                { id: 'gen-2', zoneId: 'gz-2', type: 'electromagnetic', power: 35, efficiency: 82, temperature: 25, magneticField: 10, status: 'running' },
                { id: 'gen-4', zoneId: 'gz-4', type: 'centrifugal', power: 25, efficiency: 88, temperature: 22, magneticField: 5, status: 'running' }
            ],
            effects: [],
            experiments: [
                { id: 'exp-1', name: '딸기 무중력 성장', hypothesis: '0.3g에서 딸기 당도 증가', gravityLevels: [0.3, 0.5, 1.0], duration: 45, crops: ['딸기'], status: 'running' },
                { id: 'exp-2', name: '토마토 저중력 재배', hypothesis: '0.5g에서 과실 크기 증가', gravityLevels: [0.5, 1.0, 1.5], duration: 60, crops: ['토마토'], status: 'completed', results: { conclusion: '0.5g에서 과실 15% 증가', optimalGravity: 0.5, yieldChange: 15, qualityChange: 8, recommendations: ['저중력 재배 권장'] } }
            ],
            metrics: { totalZones: 4, activeGenerators: 3, averageGravity: 0.825, energyConsumption: 110, yieldImprovement: 18, experimentsCompleted: 1 },
            status: 'active'
        };
    }

    setGravity(zoneId: string, level: number): GravityZone | null {
        const zone = this.system.zones.find(z => z.id === zoneId);
        if (!zone) return null;
        zone.gravityLevel = Math.max(0, Math.min(2, level));
        return zone;
    }

    getSystem(): GravityControlSystem { return this.system; }
    getZone(zoneId: string): GravityZone | undefined { return this.system.zones.find(z => z.id === zoneId); }
}

const gravityEngines: Map<string, GravityControlEngine> = new Map();
export function getGravityControlEngine(farmId: string): GravityControlEngine {
    if (!gravityEngines.has(farmId)) gravityEngines.set(farmId, new GravityControlEngine(farmId));
    return gravityEngines.get(farmId)!;
}
