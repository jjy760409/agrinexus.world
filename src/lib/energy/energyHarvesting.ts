// AgriNexus World OS - 에너지 하베스팅 시스템
// Energy Harvesting System - 다중 소스 에너지 수확 및 최적화

// ============================================
// 타입 정의
// ============================================

export interface EnergyHarvestingSystem {
    id: string;
    farmId: string;
    sources: EnergySource[];
    storage: EnergyStorage[];
    distribution: PowerDistribution;
    optimizer: EnergyOptimizer;
    metrics: EnergyMetrics;
    status: 'generating' | 'storing' | 'distributing' | 'maintenance';
}

export interface EnergySource {
    id: string;
    name: string;
    koreanName: string;
    type: SourceType;
    capacity: number;                 // kW
    currentOutput: number;            // kW
    efficiency: number;               // %
    availability: number;             // hours/day
    location: string;
    status: 'active' | 'standby' | 'maintenance';
    installation: Date;
    lifetime: number;                 // years
    co2Saved: number;                 // kg/day
}

export type SourceType =
    | 'solar_panel'           // 태양광
    | 'solar_thermal'         // 태양열
    | 'wind_turbine'          // 풍력
    | 'geothermal'            // 지열
    | 'biogas'                // 바이오가스
    | 'piezoelectric'         // 압전
    | 'thermoelectric'        // 열전
    | 'kinetic'               // 운동에너지
    | 'plant_microbial';      // 식물-미생물 연료전지

export interface EnergyStorage {
    id: string;
    name: string;
    type: StorageType;
    capacity: number;                 // kWh
    currentCharge: number;            // kWh
    chargeRate: number;               // kW
    dischargeRate: number;            // kW
    efficiency: number;               // %
    cycles: number;                   // charge cycles
    maxCycles: number;
    health: number;                   // %
    status: 'charging' | 'discharging' | 'idle' | 'maintenance';
}

export type StorageType =
    | 'lithium_ion'
    | 'solid_state'
    | 'flow_battery'
    | 'hydrogen_fuel_cell'
    | 'compressed_air'
    | 'thermal_storage'
    | 'gravity_storage';

export interface PowerDistribution {
    id: string;
    grid: SmartGrid;
    consumers: PowerConsumer[];
    priorityMatrix: PriorityRule[];
    loadBalancing: LoadBalancer;
    realTimeDemand: number;           // kW
    peakDemand: number;               // kW
    efficiency: number;               // %
}

export interface SmartGrid {
    nodes: number;
    connections: number;
    voltage: number;                  // V
    frequency: number;                // Hz
    powerFactor: number;
    stability: number;                // %
    selfHealing: boolean;
    predictiveRouting: boolean;
}

export interface PowerConsumer {
    id: string;
    name: string;
    type: string;
    priority: 1 | 2 | 3 | 4 | 5;
    demand: number;                   // kW
    consumption: number;              // kWh/day
    flexible: boolean;
    curtailable: boolean;
}

export interface PriorityRule {
    condition: string;
    action: string;
    priority: number;
    active: boolean;
}

export interface LoadBalancer {
    algorithm: string;
    responseTime: number;             // ms
    accuracy: number;                 // %
    peakShaving: boolean;
    demandResponse: boolean;
}

export interface EnergyOptimizer {
    id: string;
    aiModel: string;
    version: string;
    predictions: EnergyPrediction[];
    recommendations: Recommendation[];
    savingsAchieved: number;          // %
    accuracy: number;                 // %
    optimizationFrequency: number;    // minutes
    status: 'active' | 'analyzing' | 'optimizing';
}

export interface EnergyPrediction {
    type: 'generation' | 'consumption' | 'price' | 'weather';
    timeframe: string;
    value: number;
    unit: string;
    confidence: number;               // %
    timestamp: Date;
}

export interface Recommendation {
    id: string;
    type: 'efficiency' | 'storage' | 'timing' | 'curtailment';
    description: string;
    potentialSavings: number;         // %
    priority: 'low' | 'medium' | 'high';
    implemented: boolean;
}

export interface EnergyMetrics {
    totalGeneration: number;          // kWh/day
    totalConsumption: number;         // kWh/day
    selfSufficiency: number;          // %
    gridExport: number;               // kWh/day
    gridImport: number;               // kWh/day
    peakDemand: number;               // kW
    avgEfficiency: number;            // %
    co2Avoided: number;               // kg/day
    costSavings: number;              // USD/day
    renewableRatio: number;           // %
    storageUtilization: number;       // %
    uptime: number;                   // %
}

// ============================================
// 에너지 하베스팅 엔진
// ============================================

export class EnergyHarvestingEngine {
    private system: EnergyHarvestingSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): EnergyHarvestingSystem {
        return {
            id: `energy-${Date.now()}`,
            farmId,
            sources: this.createSources(),
            storage: this.createStorage(),
            distribution: this.createDistribution(),
            optimizer: {
                id: 'opt-1',
                aiModel: 'EnergyMind AI',
                version: '4.5',
                predictions: [
                    { type: 'generation', timeframe: '다음 24시간', value: 2500, unit: 'kWh', confidence: 95, timestamp: new Date() },
                    { type: 'consumption', timeframe: '다음 24시간', value: 2200, unit: 'kWh', confidence: 97, timestamp: new Date() }
                ],
                recommendations: [
                    { id: 'r-1', type: 'timing', description: 'LED 조명 시간대 조정으로 피크 부하 15% 감소', potentialSavings: 12, priority: 'high', implemented: true },
                    { id: 'r-2', type: 'storage', description: '야간 저장 에너지 활용 최적화', potentialSavings: 8, priority: 'medium', implemented: false }
                ],
                savingsAchieved: 35,
                accuracy: 97.5,
                optimizationFrequency: 5,
                status: 'active'
            },
            metrics: {
                totalGeneration: 2800,
                totalConsumption: 2200,
                selfSufficiency: 95,
                gridExport: 450,
                gridImport: 50,
                peakDemand: 180,
                avgEfficiency: 92,
                co2Avoided: 1250,
                costSavings: 320,
                renewableRatio: 98,
                storageUtilization: 78,
                uptime: 99.9
            },
            status: 'generating'
        };
    }

    private createSources(): EnergySource[] {
        const sources: { name: string; korean: string; type: SourceType; cap: number; eff: number }[] = [
            { name: 'Solar Array A', korean: '☀️ 태양광 A동', type: 'solar_panel', cap: 500, eff: 24 },
            { name: 'Solar Array B', korean: '☀️ 태양광 B동', type: 'solar_panel', cap: 400, eff: 23 },
            { name: 'Wind Turbine', korean: '💨 풍력 터빈', type: 'wind_turbine', cap: 200, eff: 45 },
            { name: 'Geothermal', korean: '🌡️ 지열 시스템', type: 'geothermal', cap: 150, eff: 85 },
            { name: 'Biogas Generator', korean: '♻️ 바이오가스', type: 'biogas', cap: 100, eff: 60 },
            { name: 'Plant MFC', korean: '🌱 식물연료전지', type: 'plant_microbial', cap: 50, eff: 15 },
            { name: 'Piezo Floor', korean: '👟 압전 바닥', type: 'piezoelectric', cap: 20, eff: 8 },
            { name: 'Thermoelectric', korean: '🔥 열전 발전', type: 'thermoelectric', cap: 80, eff: 12 }
        ];

        return sources.map((s, i) => ({
            id: `source-${i}`,
            name: s.name,
            koreanName: s.korean,
            type: s.type,
            capacity: s.cap,
            currentOutput: s.cap * (0.4 + Math.random() * 0.5),
            efficiency: s.eff,
            availability: s.type === 'solar_panel' ? 8 : s.type === 'geothermal' ? 24 : 18,
            location: `구역 ${String.fromCharCode(65 + i % 4)}`,
            status: 'active',
            installation: new Date(Date.now() - Math.random() * 365 * 86400000),
            lifetime: 20 + Math.floor(Math.random() * 10),
            co2Saved: s.cap * 0.5
        }));
    }

    private createStorage(): EnergyStorage[] {
        return [
            { id: 'stor-1', name: '고체 배터리 A', type: 'solid_state', capacity: 2000, currentCharge: 1600, chargeRate: 200, dischargeRate: 300, efficiency: 98, cycles: 500, maxCycles: 10000, health: 99, status: 'idle' },
            { id: 'stor-2', name: '리튬 배터리', type: 'lithium_ion', capacity: 1500, currentCharge: 1200, chargeRate: 150, dischargeRate: 200, efficiency: 95, cycles: 2000, maxCycles: 5000, health: 92, status: 'discharging' },
            { id: 'stor-3', name: '수소 연료전지', type: 'hydrogen_fuel_cell', capacity: 1000, currentCharge: 800, chargeRate: 100, dischargeRate: 150, efficiency: 60, cycles: 100, maxCycles: 20000, health: 98, status: 'idle' },
            { id: 'stor-4', name: '열 저장조', type: 'thermal_storage', capacity: 800, currentCharge: 650, chargeRate: 80, dischargeRate: 100, efficiency: 85, cycles: 1500, maxCycles: 50000, health: 95, status: 'charging' }
        ];
    }

    private createDistribution(): PowerDistribution {
        return {
            id: 'dist-1',
            grid: { nodes: 48, connections: 120, voltage: 380, frequency: 60, powerFactor: 0.98, stability: 99.9, selfHealing: true, predictiveRouting: true },
            consumers: [
                { id: 'con-1', name: 'LED 조명', type: 'lighting', priority: 1, demand: 80, consumption: 1920, flexible: true, curtailable: false },
                { id: 'con-2', name: 'HVAC', type: 'climate', priority: 1, demand: 120, consumption: 2880, flexible: true, curtailable: true },
                { id: 'con-3', name: '양액 펌프', type: 'irrigation', priority: 1, demand: 30, consumption: 720, flexible: false, curtailable: false },
                { id: 'con-4', name: 'AI 서버', type: 'computing', priority: 2, demand: 50, consumption: 1200, flexible: false, curtailable: false },
                { id: 'con-5', name: '로봇 충전', type: 'charging', priority: 3, demand: 40, consumption: 600, flexible: true, curtailable: true }
            ],
            priorityMatrix: [
                { condition: '배터리 < 20%', action: 'P3 이상 차단', priority: 1, active: true },
                { condition: '피크 시간대', action: '유연 부하 지연', priority: 2, active: true }
            ],
            loadBalancing: { algorithm: 'AI 동적 분배', responseTime: 10, accuracy: 99, peakShaving: true, demandResponse: true },
            realTimeDemand: 185,
            peakDemand: 220,
            efficiency: 96
        };
    }

    getSystem(): EnergyHarvestingSystem { return this.system; }
    getMetrics(): EnergyMetrics { return this.system.metrics; }
    getSources(): EnergySource[] { return this.system.sources; }
    getStorage(): EnergyStorage[] { return this.system.storage; }
}

const energyEngines: Map<string, EnergyHarvestingEngine> = new Map();
export function getEnergyHarvestingEngine(farmId: string): EnergyHarvestingEngine {
    if (!energyEngines.has(farmId)) energyEngines.set(farmId, new EnergyHarvestingEngine(farmId));
    return energyEngines.get(farmId)!;
}

export const SOURCE_TYPE_ICONS: Record<SourceType, string> = {
    solar_panel: '☀️',
    solar_thermal: '🌞',
    wind_turbine: '💨',
    geothermal: '🌡️',
    biogas: '♻️',
    piezoelectric: '👟',
    thermoelectric: '🔥',
    kinetic: '⚡',
    plant_microbial: '🌱'
};
