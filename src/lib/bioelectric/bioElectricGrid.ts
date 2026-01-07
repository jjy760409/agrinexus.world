// AgriNexus World OS - 생체 전기 그리드
// Bio-Electric Grid - 세계 최초 식물 기반 전력 생산 시스템

export interface BioElectricGrid {
    id: string;
    farmId: string;
    generators: BioGenerator[];
    storage: EnergyStorage;
    consumers: EnergyConsumer[];
    network: PowerNetwork;
    metrics: GridMetrics;
    status: 'generating' | 'storing' | 'distributing' | 'maintenance';
}

export interface BioGenerator {
    id: string;
    plantId: string;
    species: string;
    type: GeneratorType;
    voltage: number;                    // mV
    current: number;                    // μA
    power: number;                      // μW
    efficiency: number;                 // %
    electrodes: Electrode[];
    status: 'active' | 'resting' | 'maintenance';
}

export type GeneratorType = 'photosynthetic' | 'microbial_fuel_cell' | 'enzymatic' | 'bioelectrochemical' | 'hybrid';

export interface Electrode {
    id: string;
    position: 'root' | 'stem' | 'leaf' | 'soil';
    material: 'graphene' | 'carbon_nanotube' | 'gold' | 'platinum';
    surfaceArea: number;                // cm²
    resistance: number;                 // Ω
    lastReading: number;                // mV
}

export interface EnergyStorage {
    type: 'bio_capacitor' | 'flow_battery' | 'supercapacitor';
    capacity: number;                   // mWh
    currentCharge: number;              // mWh
    chargeRate: number;                 // μW
    dischargeRate: number;              // μW
    cycles: number;
    health: number;                     // %
}

export interface EnergyConsumer {
    id: string;
    name: string;
    koreanName: string;
    powerRequirement: number;           // μW
    priority: number;                   // 1-10
    status: 'active' | 'standby' | 'off';
    uptime: number;                     // hours
}

export interface PowerNetwork {
    nodes: NetworkNode[];
    connections: PowerConnection[];
    totalCapacity: number;              // mW
    currentLoad: number;                // mW
    efficiency: number;
}

export interface NetworkNode {
    id: string;
    type: 'generator' | 'storage' | 'consumer' | 'junction';
    power: number;
    status: 'active' | 'idle';
}

export interface PowerConnection {
    from: string;
    to: string;
    resistance: number;
    current: number;
    active: boolean;
}

export interface GridMetrics {
    totalGenerators: number;
    totalPowerGenerated: number;        // mWh (lifetime)
    currentPowerOutput: number;         // mW
    selfSufficiency: number;            // %
    carbonOffset: number;               // kg CO2
    plantsContributing: number;
}

export class BioElectricGridEngine {
    private grid: BioElectricGrid;

    constructor(farmId: string) {
        this.grid = this.initializeGrid(farmId);
    }

    private initializeGrid(farmId: string): BioElectricGrid {
        return {
            id: `biogrid-${Date.now()}`,
            farmId,
            generators: [
                { id: 'gen-1', plantId: 'plant-1', species: '딸기', type: 'photosynthetic', voltage: 450, current: 120, power: 54, efficiency: 12, electrodes: [{ id: 'e-1', position: 'root', material: 'graphene', surfaceArea: 10, resistance: 50, lastReading: 450 }, { id: 'e-2', position: 'leaf', material: 'carbon_nanotube', surfaceArea: 15, resistance: 30, lastReading: 420 }], status: 'active' },
                { id: 'gen-2', plantId: 'plant-2', species: '토마토', type: 'microbial_fuel_cell', voltage: 380, current: 200, power: 76, efficiency: 18, electrodes: [{ id: 'e-3', position: 'soil', material: 'graphene', surfaceArea: 25, resistance: 40, lastReading: 380 }], status: 'active' },
                { id: 'gen-3', plantId: 'plant-3', species: '상추', type: 'enzymatic', voltage: 520, current: 80, power: 41.6, efficiency: 15, electrodes: [{ id: 'e-4', position: 'stem', material: 'platinum', surfaceArea: 8, resistance: 60, lastReading: 520 }], status: 'active' }
            ],
            storage: { type: 'bio_capacitor', capacity: 50, currentCharge: 28, chargeRate: 170, dischargeRate: 120, cycles: 5000, health: 92 },
            consumers: [
                { id: 'con-1', name: 'Micro Sensors', koreanName: '마이크로 센서', powerRequirement: 50, priority: 10, status: 'active', uptime: 2400 },
                { id: 'con-2', name: 'LED Indicators', koreanName: 'LED 표시등', powerRequirement: 30, priority: 5, status: 'active', uptime: 2400 },
                { id: 'con-3', name: 'Data Logger', koreanName: '데이터 로거', powerRequirement: 80, priority: 8, status: 'active', uptime: 2000 }
            ],
            network: { nodes: [], connections: [], totalCapacity: 0.5, currentLoad: 0.16, efficiency: 85 },
            metrics: { totalGenerators: 3, totalPowerGenerated: 125, currentPowerOutput: 0.172, selfSufficiency: 45, carbonOffset: 0.8, plantsContributing: 3 },
            status: 'generating'
        };
    }

    harvestEnergy(): number {
        const totalHarvested = this.grid.generators.filter(g => g.status === 'active').reduce((sum, g) => sum + g.power, 0) / 1000000;
        this.grid.storage.currentCharge = Math.min(this.grid.storage.capacity, this.grid.storage.currentCharge + totalHarvested);
        return totalHarvested;
    }

    getGrid(): BioElectricGrid { return this.grid; }
    getGenerator(id: string): BioGenerator | undefined { return this.grid.generators.find(g => g.id === id); }
}

const bioGridEngines: Map<string, BioElectricGridEngine> = new Map();
export function getBioElectricGridEngine(farmId: string): BioElectricGridEngine {
    if (!bioGridEngines.has(farmId)) bioGridEngines.set(farmId, new BioElectricGridEngine(farmId));
    return bioGridEngines.get(farmId)!;
}
