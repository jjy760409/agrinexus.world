// AgriNexus World OS - 대기 수분 생성기
// Atmospheric Water Generator - 세계 최초 나노 테크 대기 수분 수집 시스템

// ============================================
// 타입 정의
// ============================================

export interface AtmosphericWaterSystem {
    id: string;
    farmId: string;
    generators: WaterGenerator[];
    production: WaterProduction;
    quality: WaterQuality;
    distribution: WaterDistribution;
    energyBalance: EnergyBalance;
    metrics: AWGMetrics;
    status: SystemStatus;
}

export interface WaterGenerator {
    id: string;
    name: string;
    koreanName: string;
    type: GeneratorType;
    position: { x: number; y: number; z: number };
    capacity: number;                   // L/day
    currentOutput: number;              // L/hour
    efficiency: number;                 // %
    temperature: number;
    dewPoint: number;
    relativeHumidity: number;
    nanoMaterial: NanoMaterial;
    status: GeneratorStatus;
    maintenanceScore: number;           // 0-100
    lastMaintenance: Date;
}

export type GeneratorType =
    | 'fog_harvester'           // 안개 수확
    | 'desiccant_absorption'    // 흡습제 흡수
    | 'thermoelectric_cooling'  // 열전 냉각
    | 'membrane_separation'     // 막 분리
    | 'nano_mesh'               // 나노 메쉬
    | 'hybrid_system';          // 하이브리드

export interface NanoMaterial {
    type: 'MOF' | 'graphene_oxide' | 'zeolite' | 'hydrogel' | 'bio_inspired';
    surfaceArea: number;                // m²/g
    waterCapacity: number;              // g/g
    regenerationTemp: number;           // °C
    cycleTime: number;                  // minutes
    lifetime: number;                   // cycles
    currentCycles: number;
}

export type GeneratorStatus =
    | 'producing' | 'regenerating' | 'standby' | 'maintenance' | 'offline';

export interface WaterProduction {
    hourly: number[];                   // 24 values, L/hour
    daily: number;                      // L/day
    weekly: number;                     // L/week
    monthly: number;                    // L/month
    peakHour: number;
    peakOutput: number;
    costPerLiter: number;               // KRW
    comparedToMunicipal: number;        // % savings vs city water
}

export interface WaterQuality {
    ph: number;
    tds: number;                        // ppm
    conductivity: number;               // μS/cm
    hardness: number;                   // ppm CaCO3
    dissolvedOxygen: number;            // mg/L
    temperature: number;
    turbidity: number;                  // NTU
    bacteria: number;                   // CFU/mL
    minerals: MineralContent;
    purity: number;                     // %
    drinkable: boolean;
    irrigationSuitable: boolean;
}

export interface MineralContent {
    calcium: number;
    magnesium: number;
    potassium: number;
    sodium: number;
    iron: number;
    zinc: number;
}

export interface WaterDistribution {
    totalStorage: number;               // L
    currentLevel: number;               // L
    zones: DistributionZone[];
    pipelines: Pipeline[];
    irrigationSchedule: IrrigationSchedule;
}

export interface DistributionZone {
    id: string;
    name: string;
    area: number;                       // m²
    cropType: string;
    dailyRequirement: number;           // L
    currentAllocation: number;          // L
    priority: number;                   // 1-10
    moisture: number;                   // %
    lastIrrigation: Date;
}

export interface Pipeline {
    id: string;
    from: string;
    to: string;
    flowRate: number;                   // L/min
    pressure: number;                   // bar
    status: 'flowing' | 'idle' | 'blocked' | 'maintenance';
}

export interface IrrigationSchedule {
    automatic: boolean;
    nextEvent: Date;
    dailySlots: { time: string; zones: string[]; duration: number }[];
    weatherAdjustment: boolean;
    moistureThreshold: number;          // %
}

export interface EnergyBalance {
    solarPanels: number;                // kW capacity
    energyConsumption: number;          // kWh/day
    energyGeneration: number;           // kWh/day
    netEnergy: number;                  // kWh/day
    batteryCapacity: number;            // kWh
    batteryCurrent: number;             // kWh
    gridDependency: number;             // %
    carbonFootprint: number;            // kg CO2/L
}

export interface AWGMetrics {
    totalWaterProduced: number;         // L (lifetime)
    waterSavings: number;               // KRW (lifetime)
    carbonOffset: number;               // kg CO2
    selfSufficiency: number;            // %
    systemEfficiency: number;           // %
    uptime: number;                     // %
    averageHumidityCapture: number;     // %
    optimalHumidityRange: { min: number; max: number };
}

export type SystemStatus = 'optimal' | 'good' | 'degraded' | 'critical' | 'maintenance';

// ============================================
// 대기 수분 생성 엔진
// ============================================

export class AtmosphericWaterEngine {
    private system: AtmosphericWaterSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): AtmosphericWaterSystem {
        const generators = this.createGenerators();

        return {
            id: `awg-${Date.now()}`,
            farmId,
            generators,
            production: this.calculateProduction(generators),
            quality: this.measureWaterQuality(),
            distribution: this.createDistribution(),
            energyBalance: {
                solarPanels: 15,
                energyConsumption: 35,
                energyGeneration: 42,
                netEnergy: 7,
                batteryCapacity: 50,
                batteryCurrent: 38,
                gridDependency: 15,
                carbonFootprint: 0.02
            },
            metrics: {
                totalWaterProduced: 125000,
                waterSavings: 2500000,
                carbonOffset: 1250,
                selfSufficiency: 85,
                systemEfficiency: 78,
                uptime: 98.5,
                averageHumidityCapture: 35,
                optimalHumidityRange: { min: 40, max: 90 }
            },
            status: 'optimal'
        };
    }

    private createGenerators(): WaterGenerator[] {
        const types: { type: GeneratorType; name: string; koreanName: string }[] = [
            { type: 'nano_mesh', name: 'Nano Mesh Alpha', koreanName: '나노 메쉬 알파' },
            { type: 'fog_harvester', name: 'Fog Collector Beta', koreanName: '안개 수집기 베타' },
            { type: 'desiccant_absorption', name: 'MOF Absorber', koreanName: 'MOF 흡착기' },
            { type: 'thermoelectric_cooling', name: 'Peltier Condenser', koreanName: '펠티에 응축기' },
            { type: 'membrane_separation', name: 'Membrane Extractor', koreanName: '멤브레인 추출기' },
            { type: 'hybrid_system', name: 'Hybrid Harvester Pro', koreanName: '하이브리드 수확기 Pro' }
        ];

        const nanoMaterials: NanoMaterial[] = [
            { type: 'graphene_oxide', surfaceArea: 2500, waterCapacity: 1.2, regenerationTemp: 65, cycleTime: 30, lifetime: 10000, currentCycles: 2500 },
            { type: 'MOF', surfaceArea: 5000, waterCapacity: 1.5, regenerationTemp: 85, cycleTime: 45, lifetime: 8000, currentCycles: 1800 },
            { type: 'hydrogel', surfaceArea: 1500, waterCapacity: 2.0, regenerationTemp: 50, cycleTime: 60, lifetime: 5000, currentCycles: 1200 },
            { type: 'zeolite', surfaceArea: 800, waterCapacity: 0.8, regenerationTemp: 120, cycleTime: 90, lifetime: 15000, currentCycles: 3500 },
            { type: 'bio_inspired', surfaceArea: 3000, waterCapacity: 1.8, regenerationTemp: 55, cycleTime: 40, lifetime: 12000, currentCycles: 2800 },
            { type: 'MOF', surfaceArea: 6000, waterCapacity: 1.6, regenerationTemp: 80, cycleTime: 35, lifetime: 9000, currentCycles: 2100 }
        ];

        return types.map((t, i) => ({
            id: `gen-${i}`,
            name: t.name,
            koreanName: t.koreanName,
            type: t.type,
            position: { x: (i % 3) * 10, y: 2, z: Math.floor(i / 3) * 10 },
            capacity: 50 + Math.random() * 100,
            currentOutput: 2 + Math.random() * 4,
            efficiency: 65 + Math.random() * 25,
            temperature: 20 + Math.random() * 10,
            dewPoint: 12 + Math.random() * 8,
            relativeHumidity: 50 + Math.random() * 40,
            nanoMaterial: nanoMaterials[i],
            status: 'producing',
            maintenanceScore: 80 + Math.random() * 20,
            lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000)
        }));
    }

    private calculateProduction(generators: WaterGenerator[]): WaterProduction {
        const hourly: number[] = [];
        for (let h = 0; h < 24; h++) {
            // 새벽/밤에 더 높은 습도로 더 많은 수분 수집
            const humidityFactor = h >= 22 || h <= 6 ? 1.5 :
                h >= 10 && h <= 16 ? 0.7 : 1.0;
            const totalOutput = generators.reduce((sum, g) =>
                sum + g.currentOutput * humidityFactor, 0);
            hourly.push(totalOutput);
        }

        const daily = hourly.reduce((a, b) => a + b, 0);

        return {
            hourly,
            daily,
            weekly: daily * 7,
            monthly: daily * 30,
            peakHour: 4,
            peakOutput: Math.max(...hourly),
            costPerLiter: 15,
            comparedToMunicipal: 40
        };
    }

    private measureWaterQuality(): WaterQuality {
        return {
            ph: 6.8 + Math.random() * 0.6,
            tds: 20 + Math.random() * 30,
            conductivity: 30 + Math.random() * 20,
            hardness: 10 + Math.random() * 20,
            dissolvedOxygen: 7 + Math.random() * 2,
            temperature: 18 + Math.random() * 4,
            turbidity: 0.1 + Math.random() * 0.3,
            bacteria: Math.random() * 10,
            minerals: {
                calcium: 5 + Math.random() * 10,
                magnesium: 2 + Math.random() * 5,
                potassium: 1 + Math.random() * 3,
                sodium: 3 + Math.random() * 5,
                iron: 0.01 + Math.random() * 0.05,
                zinc: 0.005 + Math.random() * 0.02
            },
            purity: 95 + Math.random() * 4,
            drinkable: true,
            irrigationSuitable: true
        };
    }

    private createDistribution(): WaterDistribution {
        return {
            totalStorage: 5000,
            currentLevel: 3200,
            zones: [
                { id: 'zone-a', name: '딸기 구역', area: 200, cropType: '딸기', dailyRequirement: 400, currentAllocation: 380, priority: 10, moisture: 72, lastIrrigation: new Date(Date.now() - 4 * 3600000) },
                { id: 'zone-b', name: '토마토 구역', area: 150, cropType: '토마토', dailyRequirement: 350, currentAllocation: 340, priority: 9, moisture: 68, lastIrrigation: new Date(Date.now() - 6 * 3600000) },
                { id: 'zone-c', name: '상추 구역', area: 100, cropType: '상추', dailyRequirement: 200, currentAllocation: 200, priority: 7, moisture: 78, lastIrrigation: new Date(Date.now() - 3 * 3600000) },
                { id: 'zone-d', name: '허브 구역', area: 50, cropType: '바질', dailyRequirement: 80, currentAllocation: 80, priority: 5, moisture: 65, lastIrrigation: new Date(Date.now() - 8 * 3600000) }
            ],
            pipelines: [
                { id: 'pipe-1', from: 'storage', to: 'zone-a', flowRate: 5, pressure: 2.5, status: 'idle' },
                { id: 'pipe-2', from: 'storage', to: 'zone-b', flowRate: 4, pressure: 2.3, status: 'idle' },
                { id: 'pipe-3', from: 'storage', to: 'zone-c', flowRate: 3, pressure: 2.1, status: 'idle' },
                { id: 'pipe-4', from: 'storage', to: 'zone-d', flowRate: 2, pressure: 1.8, status: 'idle' }
            ],
            irrigationSchedule: {
                automatic: true,
                nextEvent: new Date(Date.now() + 2 * 3600000),
                dailySlots: [
                    { time: '06:00', zones: ['zone-a', 'zone-b'], duration: 30 },
                    { time: '14:00', zones: ['zone-c', 'zone-d'], duration: 20 },
                    { time: '20:00', zones: ['zone-a', 'zone-b', 'zone-c'], duration: 25 }
                ],
                weatherAdjustment: true,
                moistureThreshold: 50
            }
        };
    }

    // 수분 생성
    generateWater(duration: number = 60): number {
        let total = 0;
        this.system.generators
            .filter(g => g.status === 'producing')
            .forEach(g => {
                const produced = g.currentOutput * (duration / 60);
                total += produced;
            });

        this.system.distribution.currentLevel = Math.min(
            this.system.distribution.totalStorage,
            this.system.distribution.currentLevel + total
        );

        return total;
    }

    // 관개 실행
    irrigate(zoneId: string, amount: number): boolean {
        const zone = this.system.distribution.zones.find(z => z.id === zoneId);
        if (!zone) return false;

        if (this.system.distribution.currentLevel >= amount) {
            this.system.distribution.currentLevel -= amount;
            zone.currentAllocation = amount;
            zone.lastIrrigation = new Date();
            zone.moisture = Math.min(100, zone.moisture + amount / zone.area * 10);
            return true;
        }

        return false;
    }

    // 시스템 조회
    getSystem(): AtmosphericWaterSystem {
        return this.system;
    }

    // 생성기 조회
    getGenerator(generatorId: string): WaterGenerator | undefined {
        return this.system.generators.find(g => g.id === generatorId);
    }

    // 수질 조회
    getWaterQuality(): WaterQuality {
        return this.system.quality;
    }
}

// 싱글톤
const awgEngines: Map<string, AtmosphericWaterEngine> = new Map();

export function getAtmosphericWaterEngine(farmId: string): AtmosphericWaterEngine {
    if (!awgEngines.has(farmId)) {
        awgEngines.set(farmId, new AtmosphericWaterEngine(farmId));
    }
    return awgEngines.get(farmId)!;
}

export const GENERATOR_TYPE_ICONS: Record<GeneratorType, string> = {
    fog_harvester: '🌫️',
    desiccant_absorption: '🧽',
    thermoelectric_cooling: '❄️',
    membrane_separation: '🔬',
    nano_mesh: '🕸️',
    hybrid_system: '⚡'
};

export const NANO_MATERIAL_NAMES: Record<NanoMaterial['type'], string> = {
    MOF: '금속-유기 골격체',
    graphene_oxide: '산화 그래핀',
    zeolite: '제올라이트',
    hydrogel: '하이드로겔',
    bio_inspired: '생체 모방 소재'
};
