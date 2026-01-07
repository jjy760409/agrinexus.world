// AgriNexus World OS - 무토양 스마트팜 초지능 시스템
// Soilless Smart Farm Superintelligence - 수경재배, 분무재배, 아쿠아포닉스 통합

// ============================================
// 타입 정의
// ============================================

export interface SoillessSmartFarm {
    id: string;
    farmId: string;
    systems: SoillessSystem[];
    nutrientManagement: NutrientManagement;
    waterCirculation: WaterCirculation;
    rootZoneControl: RootZoneControl;
    aiOptimizer: SoillessAI;
    metrics: SoillessMetrics;
    status: 'active' | 'calibrating' | 'maintenance' | 'emergency';
}

export interface SoillessSystem {
    id: string;
    name: string;
    koreanName: string;
    type: SoillessType;
    subType: string;
    capacity: number;                   // plants
    activeSlots: number;
    efficiency: number;                 // %
    waterUsage: number;                 // L/day
    nutrientEfficiency: number;         // %
    growthBoost: number;                // % vs soil
    configuration: SystemConfiguration;
    status: 'running' | 'idle' | 'cleaning' | 'maintenance';
}

export type SoillessType =
    | 'hydroponics'     // 수경재배
    | 'aeroponics'      // 분무재배
    | 'aquaponics'      // 아쿠아포닉스
    | 'fogponics'       // 안개재배
    | 'bioponics'       // 바이오포닉스
    | 'nutrient_film'   // NFT
    | 'deep_water'      // DWC
    | 'ebb_flow'        // 간헐식
    | 'drip_system'     // 점적관수
    | 'wick_system';    // 심지재배

export interface SystemConfiguration {
    tankVolume: number;                 // L
    pumpPower: number;                  // W
    airStones: number;
    nozzles: number;
    channels: number;
    lightIntegration: boolean;
    co2Injection: boolean;
    temperatureControl: boolean;
    automationLevel: 'manual' | 'semi' | 'full' | 'ai_controlled';
}

export interface NutrientManagement {
    id: string;
    solutions: NutrientSolution[];
    mixingTanks: MixingTank[];
    injectors: NutrientInjector[];
    profiles: NutrientProfile[];
    realTimeAdjustment: boolean;
    aiOptimization: boolean;
    deficiencyDetection: boolean;
}

export interface NutrientSolution {
    id: string;
    name: string;
    type: 'macro' | 'micro' | 'organic' | 'chelated' | 'custom';
    elements: { element: string; concentration: number; unit: string }[];
    ph: number;
    ec: number;                         // mS/cm
    temperature: number;
    dissolved_oxygen: number;           // mg/L
    remainingVolume: number;            // L
    lastCalibration: Date;
}

export interface MixingTank {
    id: string;
    name: string;
    capacity: number;                   // L
    currentVolume: number;
    currentPH: number;
    currentEC: number;
    targetPH: number;
    targetEC: number;
    temperature: number;
    mixingSpeed: number;                // rpm
    status: 'mixing' | 'ready' | 'empty' | 'cleaning';
}

export interface NutrientInjector {
    id: string;
    type: 'venturi' | 'diaphragm' | 'peristaltic' | 'piston';
    channel: string;
    flowRate: number;                   // mL/min
    accuracy: number;                   // %
    calibration: number;
    status: 'active' | 'standby' | 'error';
}

export interface NutrientProfile {
    id: string;
    name: string;
    koreanName: string;
    cropType: string;
    growthStage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
    macros: { N: number; P: number; K: number; Ca: number; Mg: number; S: number };
    micros: { Fe: number; Mn: number; Zn: number; Cu: number; B: number; Mo: number };
    targetPH: { min: number; max: number };
    targetEC: { min: number; max: number };
    waterTemperature: { min: number; max: number };
}

export interface WaterCirculation {
    id: string;
    totalVolume: number;                // L
    circulationRate: number;            // L/hour
    filtration: FiltrationSystem;
    sterilization: SterilizationSystem;
    recirculationPercentage: number;    // %
    waterQuality: WaterQuality;
    recyclingEfficiency: number;        // %
}

export interface FiltrationSystem {
    stages: FilterStage[];
    efficiency: number;                 // %
    lastMaintenance: Date;
    nextMaintenance: Date;
}

export interface FilterStage {
    type: 'sediment' | 'carbon' | 'membrane' | 'uv' | 'ozone' | 'reverse_osmosis';
    micronRating: number;
    status: 'good' | 'replace_soon' | 'replace_now';
    lifeRemaining: number;              // %
}

export interface SterilizationSystem {
    type: 'uv' | 'ozone' | 'hydrogen_peroxide' | 'chlorine' | 'silver_ions' | 'ultrasonic';
    power: number;                      // W
    coverage: number;                   // %
    pathogenReduction: number;          // log reduction
    status: 'active' | 'standby' | 'maintenance';
}

export interface WaterQuality {
    ph: number;
    ec: number;
    tds: number;                        // ppm
    dissolvedOxygen: number;            // mg/L
    orp: number;                        // mV
    temperature: number;
    turbidity: number;                  // NTU
    pathogenLevel: 'safe' | 'low' | 'moderate' | 'high';
    lastTest: Date;
}

export interface RootZoneControl {
    id: string;
    zones: RootZone[];
    monitoring: RootMonitoring;
    oxygenation: OxygenationSystem;
    temperatureControl: ZoneTemperatureControl;
}

export interface RootZone {
    id: string;
    name: string;
    type: SoillessType;
    plants: number;
    rootHealth: number;                 // 0-100
    moistureLevel: number;              // %
    dissolvedOxygen: number;            // mg/L
    rootTemperature: number;
    biofilmLevel: number;               // 0-100 (lower is better)
    pythiumRisk: number;                // 0-100
}

export interface RootMonitoring {
    cameras: number;
    oxygenSensors: number;
    temperatureSensors: number;
    bioSensors: number;
    aiAnalysis: boolean;
    realTimeImaging: boolean;
}

export interface OxygenationSystem {
    type: 'air_stones' | 'venturi' | 'dissolved_oxygen' | 'nano_bubbles' | 'electrolysis';
    capacity: number;                   // L O2/hour
    targetDO: number;                   // mg/L
    currentDO: number;
    efficiency: number;                 // %
}

export interface ZoneTemperatureControl {
    heatingCapacity: number;            // W
    coolingCapacity: number;            // W
    targetTemperature: number;
    currentTemperature: number;
    uniformity: number;                 // %
    method: 'water_jacket' | 'air_cooling' | 'peltier' | 'chiller';
}

export interface SoillessAI {
    id: string;
    name: string;
    koreanName: string;
    version: string;
    capabilities: string[];
    activeModels: AIModel[];
    predictions: AIPrediction[];
    optimizations: AIOptimization[];
    learningRate: number;
    accuracy: number;                   // %
}

export interface AIModel {
    id: string;
    name: string;
    type: 'nutrient' | 'disease' | 'growth' | 'yield' | 'quality' | 'resource';
    accuracy: number;
    lastTraining: Date;
    dataPoints: number;
}

export interface AIPrediction {
    id: string;
    type: string;
    target: string;
    prediction: string;
    confidence: number;
    timeframe: string;
    timestamp: Date;
}

export interface AIOptimization {
    id: string;
    target: string;
    currentValue: number;
    optimizedValue: number;
    improvement: number;                // %
    applied: boolean;
    timestamp: Date;
}

export interface SoillessMetrics {
    systemsActive: number;
    totalCapacity: number;
    plantsGrowing: number;
    waterEfficiency: number;            // % vs traditional
    nutrientEfficiency: number;         // % vs soil
    growthSpeedBoost: number;           // % vs soil
    yieldBoost: number;                 // % vs soil
    pathogenFreeRate: number;           // %
    energyEfficiency: number;           // kWh/kg produce
    sustainabilityScore: number;        // 0-100
}

// ============================================
// 무토양 스마트팜 엔진
// ============================================

export class SoillessSmartFarmEngine {
    private farm: SoillessSmartFarm;

    constructor(farmId: string) {
        this.farm = this.initializeFarm(farmId);
    }

    private initializeFarm(farmId: string): SoillessSmartFarm {
        return {
            id: `soilless-${Date.now()}`,
            farmId,
            systems: this.createSystems(),
            nutrientManagement: this.createNutrientManagement(),
            waterCirculation: this.createWaterCirculation(),
            rootZoneControl: this.createRootZoneControl(),
            aiOptimizer: this.createAIOptimizer(),
            metrics: {
                systemsActive: 10,
                totalCapacity: 50000,
                plantsGrowing: 42500,
                waterEfficiency: 95,
                nutrientEfficiency: 98,
                growthSpeedBoost: 50,
                yieldBoost: 40,
                pathogenFreeRate: 99.9,
                energyEfficiency: 0.8,
                sustainabilityScore: 95
            },
            status: 'active'
        };
    }

    private createSystems(): SoillessSystem[] {
        return [
            { id: 'sys-1', name: 'NFT Hydroponic', koreanName: 'NFT 수경재배', type: 'nutrient_film', subType: 'L-channel', capacity: 10000, activeSlots: 8500, efficiency: 96, waterUsage: 150, nutrientEfficiency: 98, growthBoost: 45, configuration: { tankVolume: 2000, pumpPower: 500, airStones: 20, nozzles: 0, channels: 50, lightIntegration: true, co2Injection: true, temperatureControl: true, automationLevel: 'ai_controlled' }, status: 'running' },
            { id: 'sys-2', name: 'Deep Water Culture', koreanName: 'DWC 심수경', type: 'deep_water', subType: 'raft', capacity: 8000, activeSlots: 7200, efficiency: 94, waterUsage: 200, nutrientEfficiency: 96, growthBoost: 40, configuration: { tankVolume: 5000, pumpPower: 300, airStones: 40, nozzles: 0, channels: 0, lightIntegration: true, co2Injection: true, temperatureControl: true, automationLevel: 'ai_controlled' }, status: 'running' },
            { id: 'sys-3', name: 'Aeroponics Tower', koreanName: '에어로포닉스 타워', type: 'aeroponics', subType: 'high_pressure', capacity: 5000, activeSlots: 4800, efficiency: 98, waterUsage: 50, nutrientEfficiency: 99, growthBoost: 65, configuration: { tankVolume: 500, pumpPower: 800, airStones: 0, nozzles: 200, channels: 0, lightIntegration: true, co2Injection: true, temperatureControl: true, automationLevel: 'ai_controlled' }, status: 'running' },
            { id: 'sys-4', name: 'Fogponics Chamber', koreanName: '포그포닉스 챔버', type: 'fogponics', subType: 'ultrasonic', capacity: 3000, activeSlots: 2800, efficiency: 99, waterUsage: 20, nutrientEfficiency: 99.5, growthBoost: 70, configuration: { tankVolume: 200, pumpPower: 100, airStones: 0, nozzles: 0, channels: 0, lightIntegration: true, co2Injection: true, temperatureControl: true, automationLevel: 'ai_controlled' }, status: 'running' },
            { id: 'sys-5', name: 'Aquaponics Ecosystem', koreanName: '아쿠아포닉스 생태계', type: 'aquaponics', subType: 'media_bed', capacity: 4000, activeSlots: 3500, efficiency: 92, waterUsage: 100, nutrientEfficiency: 95, growthBoost: 35, configuration: { tankVolume: 10000, pumpPower: 400, airStones: 30, nozzles: 0, channels: 20, lightIntegration: true, co2Injection: false, temperatureControl: true, automationLevel: 'ai_controlled' }, status: 'running' }
        ];
    }

    private createNutrientManagement(): NutrientManagement {
        return {
            id: 'nut-mgmt-1',
            solutions: [
                { id: 'sol-1', name: 'Macro A', type: 'macro', elements: [{ element: 'N', concentration: 200, unit: 'ppm' }, { element: 'K', concentration: 250, unit: 'ppm' }], ph: 5.8, ec: 2.2, temperature: 22, dissolved_oxygen: 8, remainingVolume: 500, lastCalibration: new Date() },
                { id: 'sol-2', name: 'Macro B', type: 'macro', elements: [{ element: 'P', concentration: 60, unit: 'ppm' }, { element: 'Ca', concentration: 200, unit: 'ppm' }], ph: 5.8, ec: 1.8, temperature: 22, dissolved_oxygen: 8, remainingVolume: 500, lastCalibration: new Date() },
                { id: 'sol-3', name: 'Micro Mix', type: 'micro', elements: [{ element: 'Fe', concentration: 5, unit: 'ppm' }, { element: 'Mn', concentration: 2, unit: 'ppm' }], ph: 5.5, ec: 0.5, temperature: 22, dissolved_oxygen: 8, remainingVolume: 200, lastCalibration: new Date() }
            ],
            mixingTanks: [
                { id: 'tank-1', name: 'Main Mix', capacity: 1000, currentVolume: 850, currentPH: 5.9, currentEC: 2.4, targetPH: 5.8, targetEC: 2.5, temperature: 22, mixingSpeed: 60, status: 'ready' }
            ],
            injectors: [
                { id: 'inj-1', type: 'peristaltic', channel: 'A', flowRate: 100, accuracy: 99, calibration: 100, status: 'active' },
                { id: 'inj-2', type: 'peristaltic', channel: 'B', flowRate: 100, accuracy: 99, calibration: 100, status: 'active' }
            ],
            profiles: [
                { id: 'prof-1', name: 'Lettuce Vegetative', koreanName: '상추 영양생장', cropType: '상추', growthStage: 'vegetative', macros: { N: 200, P: 50, K: 200, Ca: 150, Mg: 50, S: 60 }, micros: { Fe: 5, Mn: 1, Zn: 0.5, Cu: 0.1, B: 0.5, Mo: 0.05 }, targetPH: { min: 5.5, max: 6.2 }, targetEC: { min: 1.5, max: 2.0 }, waterTemperature: { min: 18, max: 24 } },
                { id: 'prof-2', name: 'Tomato Fruiting', koreanName: '토마토 결실기', cropType: '토마토', growthStage: 'fruiting', macros: { N: 180, P: 60, K: 300, Ca: 200, Mg: 60, S: 80 }, micros: { Fe: 6, Mn: 1.5, Zn: 0.8, Cu: 0.15, B: 0.7, Mo: 0.08 }, targetPH: { min: 5.8, max: 6.3 }, targetEC: { min: 2.5, max: 3.5 }, waterTemperature: { min: 20, max: 26 } },
                { id: 'prof-3', name: 'Strawberry Flowering', koreanName: '딸기 개화기', cropType: '딸기', growthStage: 'flowering', macros: { N: 150, P: 80, K: 250, Ca: 180, Mg: 55, S: 70 }, micros: { Fe: 5.5, Mn: 1.2, Zn: 0.6, Cu: 0.12, B: 0.6, Mo: 0.06 }, targetPH: { min: 5.5, max: 6.0 }, targetEC: { min: 1.8, max: 2.5 }, waterTemperature: { min: 18, max: 22 } }
            ],
            realTimeAdjustment: true,
            aiOptimization: true,
            deficiencyDetection: true
        };
    }

    private createWaterCirculation(): WaterCirculation {
        return {
            id: 'water-circ-1',
            totalVolume: 50000,
            circulationRate: 5000,
            filtration: {
                stages: [
                    { type: 'sediment', micronRating: 100, status: 'good', lifeRemaining: 85 },
                    { type: 'carbon', micronRating: 50, status: 'good', lifeRemaining: 72 },
                    { type: 'membrane', micronRating: 5, status: 'good', lifeRemaining: 90 },
                    { type: 'uv', micronRating: 0, status: 'good', lifeRemaining: 95 }
                ],
                efficiency: 99.5,
                lastMaintenance: new Date(),
                nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            sterilization: { type: 'uv', power: 500, coverage: 100, pathogenReduction: 5, status: 'active' },
            recirculationPercentage: 98,
            waterQuality: { ph: 5.8, ec: 2.4, tds: 1200, dissolvedOxygen: 8.5, orp: 350, temperature: 22, turbidity: 0.5, pathogenLevel: 'safe', lastTest: new Date() },
            recyclingEfficiency: 98
        };
    }

    private createRootZoneControl(): RootZoneControl {
        return {
            id: 'root-ctrl-1',
            zones: [
                { id: 'rz-1', name: 'NFT Zone A', type: 'nutrient_film', plants: 5000, rootHealth: 98, moistureLevel: 100, dissolvedOxygen: 8.5, rootTemperature: 21, biofilmLevel: 5, pythiumRisk: 2 },
                { id: 'rz-2', name: 'DWC Zone', type: 'deep_water', plants: 7200, rootHealth: 96, moistureLevel: 100, dissolvedOxygen: 9.0, rootTemperature: 20, biofilmLevel: 8, pythiumRisk: 5 },
                { id: 'rz-3', name: 'Aero Zone', type: 'aeroponics', plants: 4800, rootHealth: 99, moistureLevel: 95, dissolvedOxygen: 12, rootTemperature: 19, biofilmLevel: 2, pythiumRisk: 1 }
            ],
            monitoring: { cameras: 50, oxygenSensors: 100, temperatureSensors: 100, bioSensors: 25, aiAnalysis: true, realTimeImaging: true },
            oxygenation: { type: 'nano_bubbles', capacity: 500, targetDO: 8.5, currentDO: 8.7, efficiency: 98 },
            temperatureControl: { heatingCapacity: 5000, coolingCapacity: 10000, targetTemperature: 21, currentTemperature: 21.2, uniformity: 98, method: 'chiller' }
        };
    }

    private createAIOptimizer(): SoillessAI {
        return {
            id: 'soilless-ai-1',
            name: 'HydroGenius AI',
            koreanName: '하이드로지니어스 AI',
            version: '3.0',
            capabilities: ['실시간 양분 최적화', '질병 예측', '수확량 예측', '에너지 최적화', '물 재활용 최적화'],
            activeModels: [
                { id: 'model-1', name: 'NutrientOptimizer', type: 'nutrient', accuracy: 99.2, lastTraining: new Date(), dataPoints: 1500000 },
                { id: 'model-2', name: 'DiseasePredictor', type: 'disease', accuracy: 98.5, lastTraining: new Date(), dataPoints: 500000 },
                { id: 'model-3', name: 'YieldForecaster', type: 'yield', accuracy: 97.8, lastTraining: new Date(), dataPoints: 800000 }
            ],
            predictions: [
                { id: 'pred-1', type: 'yield', target: '상추', prediction: '주당 2.5kg 예상', confidence: 98, timeframe: '7일', timestamp: new Date() },
                { id: 'pred-2', type: 'disease', target: 'DWC Zone', prediction: '피튬 위험 낮음', confidence: 99, timeframe: '14일', timestamp: new Date() }
            ],
            optimizations: [
                { id: 'opt-1', target: 'EC 수준', currentValue: 2.2, optimizedValue: 2.4, improvement: 8, applied: true, timestamp: new Date() },
                { id: 'opt-2', target: '물 사용량', currentValue: 520, optimizedValue: 450, improvement: 13, applied: true, timestamp: new Date() }
            ],
            learningRate: 0.15,
            accuracy: 98.5
        };
    }

    adjustNutrients(tankId: string, targetPH: number, targetEC: number): boolean {
        const tank = this.farm.nutrientManagement.mixingTanks.find(t => t.id === tankId);
        if (!tank) return false;
        tank.targetPH = targetPH;
        tank.targetEC = targetEC;
        return true;
    }

    getFarm(): SoillessSmartFarm { return this.farm; }
    getSystem(systemId: string): SoillessSystem | undefined { return this.farm.systems.find(s => s.id === systemId); }
    getMetrics(): SoillessMetrics { return this.farm.metrics; }
    getAI(): SoillessAI { return this.farm.aiOptimizer; }
}

const soillessEngines: Map<string, SoillessSmartFarmEngine> = new Map();
export function getSoillessSmartFarmEngine(farmId: string): SoillessSmartFarmEngine {
    if (!soillessEngines.has(farmId)) soillessEngines.set(farmId, new SoillessSmartFarmEngine(farmId));
    return soillessEngines.get(farmId)!;
}

export const SOILLESS_TYPE_ICONS: Record<SoillessType, string> = {
    hydroponics: '💧',
    aeroponics: '💨',
    aquaponics: '🐟',
    fogponics: '🌫️',
    bioponics: '🦠',
    nutrient_film: '📏',
    deep_water: '🌊',
    ebb_flow: '🔄',
    drip_system: '💦',
    wick_system: '🕯️'
};

export const SOILLESS_TYPE_NAMES: Record<SoillessType, string> = {
    hydroponics: '수경재배',
    aeroponics: '분무재배',
    aquaponics: '아쿠아포닉스',
    fogponics: '안개재배',
    bioponics: '바이오포닉스',
    nutrient_film: 'NFT',
    deep_water: '심수경(DWC)',
    ebb_flow: '간헐식',
    drip_system: '점적관수',
    wick_system: '심지재배'
};
