// AgriNexus World OS - 나노 로보틱스 군집 시스템
// Nano-Robotics Swarm - 분자 수준 식물 관리 및 치료

// ============================================
// 타입 정의
// ============================================

export interface NanoSwarmSystem {
    id: string;
    farmId: string;
    swarms: NanoSwarm[];
    controlCenter: SwarmControlCenter;
    missions: SwarmMission[];
    deployments: Deployment[];
    metrics: NanoSwarmMetrics;
    status: 'active' | 'deploying' | 'returning' | 'recharging';
}

export interface NanoSwarm {
    id: string;
    name: string;
    koreanName: string;
    type: NanoSwarmType;
    population: number;               // 나노봇 수
    activeUnits: number;
    size: number;                     // nanometers
    capability: string[];
    status: SwarmStatus;
    batteryLevel: number;             // %
    missionProgress: number;          // %
    location: string;
    performance: SwarmPerformance;
}

export type NanoSwarmType =
    | 'repair_bots'         // 세포 수복 봇
    | 'nutrient_delivery'   // 양분 전달 봇
    | 'pathogen_hunter'     // 병원균 사냥 봇
    | 'dna_repair'          // DNA 수복 봇
    | 'growth_enhancer'     // 성장 촉진 봇
    | 'stress_monitor'      // 스트레스 모니터링
    | 'pollinator'          // 수분 지원 봇
    | 'root_explorer';      // 뿌리 탐험 봇

export type SwarmStatus = 'active' | 'standby' | 'mission' | 'returning' | 'charging' | 'maintenance';

export interface SwarmPerformance {
    efficiency: number;               // %
    successRate: number;              // %
    responseTime: number;             // milliseconds
    coverage: number;                 // % of target area
    precision: number;                // nanometer accuracy
    coordinationScore: number;        // 0-100
    batteryEfficiency: number;        // hours per charge
}

export interface SwarmControlCenter {
    id: string;
    aiController: string;
    connectedSwarms: number;
    activeUnits: number;
    commandsPerSecond: number;
    latency: number;                  // microseconds
    coordinationAlgorithm: string;
    status: 'online' | 'processing' | 'optimizing';
}

export interface SwarmMission {
    id: string;
    name: string;
    type: MissionType;
    priority: 'critical' | 'high' | 'medium' | 'low';
    assignedSwarms: string[];
    target: MissionTarget;
    status: 'pending' | 'active' | 'completed' | 'failed';
    progress: number;
    startTime: Date;
    estimatedCompletion: Date;
    results?: MissionResult;
}

export type MissionType =
    | 'cell_repair'
    | 'nutrient_injection'
    | 'pathogen_elimination'
    | 'dna_correction'
    | 'growth_boost'
    | 'stress_relief'
    | 'pollination'
    | 'root_mapping';

export interface MissionTarget {
    type: 'plant' | 'zone' | 'system' | 'specific_cell';
    id: string;
    name: string;
    coordinates?: { x: number; y: number; z: number };
    cellCount?: number;
}

export interface MissionResult {
    success: boolean;
    cellsRepaired: number;
    pathogensNeutralized: number;
    nutrientsDelivered: number;
    dnaCorrections: number;
    timeElapsed: number;              // seconds
    efficiencyScore: number;
}

export interface Deployment {
    id: string;
    swarmId: string;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'completed' | 'aborted';
    unitsDeployed: number;
    missionType: MissionType;
    effectiveness: number;            // %
}

export interface NanoSwarmMetrics {
    totalNanobots: number;            // 총 나노봇 수
    activeNanobots: number;           // 활성 나노봇
    missionsCompleted: number;
    successRate: number;              // %
    cellsRepaired: number;
    pathogensDestroyed: number;
    nutrientsDelivered: number;       // molecules
    plantHealthImprovement: number;   // %
    responseTime: number;             // average ms
    uptime: number;                   // %
}

// ============================================
// 나노 스웜 엔진
// ============================================

export class NanoSwarmEngine {
    private system: NanoSwarmSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): NanoSwarmSystem {
        return {
            id: `nanoswarm-${Date.now()}`,
            farmId,
            swarms: this.createSwarms(),
            controlCenter: {
                id: 'control-1',
                aiController: 'SwarmMind AI v5.0',
                connectedSwarms: 8,
                activeUnits: 850000000,
                commandsPerSecond: 10000000,
                latency: 0.5,
                coordinationAlgorithm: 'Quantum-Enhanced Flocking',
                status: 'online'
            },
            missions: this.createMissions(),
            deployments: [],
            metrics: {
                totalNanobots: 1000000000,    // 10억
                activeNanobots: 850000000,
                missionsCompleted: 15420,
                successRate: 99.7,
                cellsRepaired: 25000000000,   // 250억
                pathogensDestroyed: 8500000000,
                nutrientsDelivered: 1e18,
                plantHealthImprovement: 45,
                responseTime: 0.3,
                uptime: 99.99
            },
            status: 'active'
        };
    }

    private createSwarms(): NanoSwarm[] {
        const swarmDefs: { type: NanoSwarmType; name: string; koreanName: string; size: number; capability: string[] }[] = [
            { type: 'repair_bots', name: 'CellDoc', koreanName: '🔧 셀닥터', size: 50, capability: ['세포막 수복', '미토콘드리아 최적화', '엽록체 복원'] },
            { type: 'nutrient_delivery', name: 'NutriCargo', koreanName: '📦 뉴트리카고', size: 80, capability: ['정밀 양분 전달', '특정 부위 타겟팅', '흡수율 극대화'] },
            { type: 'pathogen_hunter', name: 'BioGuard', koreanName: '🛡️ 바이오가드', size: 40, capability: ['바이러스 중화', '세균 분해', '곰팡이 제거'] },
            { type: 'dna_repair', name: 'GeneDoc', koreanName: '🧬 진닥터', size: 30, capability: ['DNA 손상 탐지', 'CRISPR 정밀 교정', '유전자 최적화'] },
            { type: 'growth_enhancer', name: 'GrowthMax', koreanName: '🌱 그로스맥스', size: 60, capability: ['세포 분열 촉진', '성장 호르몬 조절', '빠른 성숙'] },
            { type: 'stress_monitor', name: 'StressScan', koreanName: '📊 스트레스스캔', size: 20, capability: ['실시간 스트레스 감지', '조기 경보', '원인 분석'] },
            { type: 'pollinator', name: 'PolliBot', koreanName: '🐝 폴리봇', size: 100, capability: ['정밀 수분', '화분 최적화', '종자 품질 향상'] },
            { type: 'root_explorer', name: 'RootMap', koreanName: '🌿 루트맵', size: 45, capability: ['뿌리 3D 매핑', '영양 흡수 분석', '균근 최적화'] }
        ];

        return swarmDefs.map((def, i) => ({
            id: `swarm-${i}`,
            name: def.name,
            koreanName: def.koreanName,
            type: def.type,
            population: 100000000 + Math.floor(Math.random() * 50000000),
            activeUnits: 85000000 + Math.floor(Math.random() * 10000000),
            size: def.size,
            capability: def.capability,
            status: 'active' as SwarmStatus,
            batteryLevel: 85 + Math.random() * 15,
            missionProgress: Math.random() * 100,
            location: '전체 농장',
            performance: {
                efficiency: 95 + Math.random() * 5,
                successRate: 98 + Math.random() * 2,
                responseTime: 0.2 + Math.random() * 0.3,
                coverage: 95 + Math.random() * 5,
                precision: 0.5,
                coordinationScore: 95 + Math.random() * 5,
                batteryEfficiency: 48 + Math.random() * 24
            }
        }));
    }

    private createMissions(): SwarmMission[] {
        return [
            { id: 'm-1', name: '병원균 소탕작전', type: 'pathogen_elimination', priority: 'critical', assignedSwarms: ['swarm-2'], target: { type: 'zone', id: 'zone-a', name: 'A 구역' }, status: 'active', progress: 78, startTime: new Date(), estimatedCompletion: new Date(Date.now() + 3600000) },
            { id: 'm-2', name: '세포 대규모 복구', type: 'cell_repair', priority: 'high', assignedSwarms: ['swarm-0'], target: { type: 'plant', id: 'plant-142', name: '토마토 142' }, status: 'active', progress: 45, startTime: new Date(), estimatedCompletion: new Date(Date.now() + 7200000) },
            { id: 'm-3', name: '긴급 양분 전달', type: 'nutrient_injection', priority: 'high', assignedSwarms: ['swarm-1'], target: { type: 'zone', id: 'zone-c', name: 'C 구역' }, status: 'active', progress: 82, startTime: new Date(), estimatedCompletion: new Date(Date.now() + 1800000) }
        ];
    }

    deploySwarm(swarmId: string, missionType: MissionType, targetId: string): Deployment {
        const deployment: Deployment = {
            id: `dep-${Date.now()}`,
            swarmId,
            startTime: new Date(),
            status: 'active',
            unitsDeployed: 50000000,
            missionType,
            effectiveness: 0
        };
        this.system.deployments.push(deployment);
        return deployment;
    }

    getSystem(): NanoSwarmSystem { return this.system; }
    getMetrics(): NanoSwarmMetrics { return this.system.metrics; }
    getSwarm(swarmId: string): NanoSwarm | undefined { return this.system.swarms.find(s => s.id === swarmId); }
    getMissions(): SwarmMission[] { return this.system.missions; }
}

const nanoEngines: Map<string, NanoSwarmEngine> = new Map();
export function getNanoSwarmEngine(farmId: string): NanoSwarmEngine {
    if (!nanoEngines.has(farmId)) nanoEngines.set(farmId, new NanoSwarmEngine(farmId));
    return nanoEngines.get(farmId)!;
}

export const SWARM_TYPE_ICONS: Record<NanoSwarmType, string> = {
    repair_bots: '🔧',
    nutrient_delivery: '📦',
    pathogen_hunter: '🛡️',
    dna_repair: '🧬',
    growth_enhancer: '🌱',
    stress_monitor: '📊',
    pollinator: '🐝',
    root_explorer: '🌿'
};
