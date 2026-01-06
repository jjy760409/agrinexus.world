// AgriNexus World OS - 완전 커스텀 3D 설계 시스템
// 건축 설계 수준의 상세한 커스터마이징

// ===== 건물 구조 타입 =====
export type BuildingShape = 'rectangular' | 'l_shaped' | 'u_shaped' | 'circular' | 'hexagonal' | 'custom';
export type RoofType = 'flat' | 'gable' | 'arched' | 'greenhouse' | 'retractable' | 'solar_integrated';
export type WallType = 'glass' | 'insulated_panel' | 'polycarbonate' | 'hybrid' | 'smart_glass' | 'transparent_led';
export type FloorType = 'epoxy' | 'concrete' | 'raised_floor' | 'drainage' | 'heated' | 'modular';

// ===== 재배 시스템 타입 =====
export type GrowingSystem = 'nft' | 'dwc' | 'aeroponics' | 'vertical_tower' | 'moving_gutter' | 'a_frame' | 'rotating_drum';
export type LightingSystem = 'led_bar' | 'led_panel' | 'hybrid_sunlight' | 'programmable_spectrum' | 'movable_led' | 'ai_adaptive';
export type IrrigationSystem = 'drip' | 'flood_drain' | 'mist' | 'fogponics' | 'ai_precision';

// ===== 설비 장비 카테고리 =====
export interface EquipmentCategory {
    id: string;
    name: string;
    nameKo: string;
    icon: string;
    items: EquipmentItem[];
}

export interface EquipmentItem {
    id: string;
    name: string;
    nameKo: string;
    description: string;
    category: string;
    price: number;
    powerConsumption: number;
    dimensions: { width: number; height: number; depth: number };
    automation: AutomationLevel;
    features: string[];
    model3D?: string;
}

export type AutomationLevel = 'manual' | 'semi_auto' | 'full_auto' | 'ai_autonomous';

// ===== 전체 설계 구성 =====
export interface FarmDesignConfig {
    // 기본 정보
    projectName: string;
    createdAt: Date;
    lastModified: Date;

    // 건물 구조
    building: BuildingConfig;

    // 재배 구역
    growingZones: GrowingZone[];

    // 설비 시스템
    hvacSystem: HVACConfig;
    lightingSystem: LightingConfig;
    irrigationSystem: IrrigationConfig;
    nutrientSystem: NutrientConfig;

    // 자동화 시스템
    automationSystems: AutomationConfig;

    // 모니터링 & AI
    monitoringSystem: MonitoringConfig;
    aiSystems: AISystemConfig;

    // 예상 비용 & 생산량
    estimates: EstimateConfig;
}

export interface BuildingConfig {
    shape: BuildingShape;
    dimensions: {
        width: number;
        length: number;
        height: number;
        floors: number;
    };
    roof: {
        type: RoofType;
        material: string;
        insulation: number;
        solarPanels: boolean;
    };
    walls: {
        type: WallType;
        thickness: number;
        insulation: number;
        transparency: number;
    };
    floor: {
        type: FloorType;
        drainage: boolean;
        heating: boolean;
    };
    entrances: EntranceConfig[];
    windows: WindowConfig[];
}

export interface EntranceConfig {
    position: { x: number; y: number; z: number };
    type: 'single' | 'double' | 'airlock' | 'loading_dock';
    width: number;
    height: number;
    automation: boolean;
}

export interface WindowConfig {
    position: { x: number; y: number; z: number };
    width: number;
    height: number;
    type: 'fixed' | 'openable' | 'motorized';
}

export interface GrowingZone {
    id: string;
    name: string;
    position: { x: number; y: number; z: number };
    dimensions: { width: number; length: number; height: number };
    system: GrowingSystem;
    crops: CropConfig[];
    rackCount: number;
    levelsPerRack: number;
    climate: ZoneClimate;
}

export interface CropConfig {
    type: string;
    variety: string;
    plantCount: number;
    growthPhase: 'seedling' | 'vegetative' | 'flowering' | 'harvest';
    daysToHarvest: number;
}

export interface ZoneClimate {
    temperature: { min: number; max: number; target: number };
    humidity: { min: number; max: number; target: number };
    co2: { min: number; max: number; target: number };
    lightHours: number;
    lightIntensity: number;
}

export interface HVACConfig {
    units: HVACUnit[];
    ductwork: DuctConfig[];
    humidifiers: HumidifierConfig[];
    dehumidifiers: DehumidifierConfig[];
    fans: FanConfig[];
    heatExchangers: HeatExchangerConfig[];
}

export interface HVACUnit {
    id: string;
    type: 'split' | 'central' | 'vrf' | 'geothermal' | 'ai_adaptive';
    capacity: number;
    efficiency: number;
    position: { x: number; y: number; z: number };
}

export interface DuctConfig {
    path: { x: number; y: number; z: number }[];
    diameter: number;
    insulated: boolean;
}

export interface HumidifierConfig {
    id: string;
    type: 'ultrasonic' | 'evaporative' | 'steam' | 'fog';
    capacity: number;
    position: { x: number; y: number; z: number };
}

export interface DehumidifierConfig {
    id: string;
    capacity: number;
    position: { x: number; y: number; z: number };
}

export interface FanConfig {
    id: string;
    type: 'circulation' | 'exhaust' | 'intake' | 'ceiling';
    diameter: number;
    cfm: number;
    position: { x: number; y: number; z: number };
}

export interface HeatExchangerConfig {
    id: string;
    type: 'air_to_air' | 'water_to_air' | 'ground_source';
    efficiency: number;
}

export interface LightingConfig {
    type: LightingSystem;
    fixtures: LightFixture[];
    schedule: LightSchedule[];
    spectrumControl: boolean;
    aiOptimization: boolean;
}

export interface LightFixture {
    id: string;
    type: 'bar' | 'panel' | 'spot' | 'strip';
    wattage: number;
    spectrum: 'full' | 'red_blue' | 'grow' | 'bloom' | 'custom';
    position: { x: number; y: number; z: number };
    dimmable: boolean;
}

export interface LightSchedule {
    zone: string;
    onTime: string;
    offTime: string;
    intensity: number;
}

export interface IrrigationConfig {
    type: IrrigationSystem;
    mainTank: TankConfig;
    reservoirs: ReservoirConfig[];
    pumps: PumpConfig[];
    valves: ValveConfig[];
    sensors: IrrigationSensor[];
}

export interface TankConfig {
    capacity: number;
    position: { x: number; y: number; z: number };
    material: 'plastic' | 'stainless' | 'fiberglass';
}

export interface ReservoirConfig {
    id: string;
    zone: string;
    capacity: number;
    position: { x: number; y: number; z: number };
}

export interface PumpConfig {
    id: string;
    type: 'submersible' | 'inline' | 'peristaltic';
    flowRate: number;
    pressure: number;
}

export interface ValveConfig {
    id: string;
    type: 'solenoid' | 'motorized' | 'manual';
    zone: string;
}

export interface IrrigationSensor {
    id: string;
    type: 'flow' | 'pressure' | 'moisture' | 'ec' | 'ph';
    position: { x: number; y: number; z: number };
}

export interface NutrientConfig {
    type: 'ab_formula' | 'organic' | 'custom_blend' | 'ai_adaptive';
    mixingTanks: MixingTankConfig[];
    dosers: DoserConfig[];
    sensors: NutrientSensor[];
}

export interface MixingTankConfig {
    id: string;
    capacity: number;
    agitator: boolean;
    heater: boolean;
}

export interface DoserConfig {
    id: string;
    nutrient: string;
    type: 'peristaltic' | 'diaphragm' | 'venturi';
    precision: number;
}

export interface NutrientSensor {
    id: string;
    type: 'ec' | 'ph' | 'orp' | 'dissolved_oxygen' | 'temperature';
    position: { x: number; y: number; z: number };
}

export interface AutomationConfig {
    level: AutomationLevel;
    robots: RobotConfig[];
    conveyors: ConveyorConfig[];
    harvestSystem: HarvestConfig;
    packingSystem: PackingConfig;
    cleaningSystem: CleaningConfig;
}

export interface RobotConfig {
    id: string;
    type: 'seeding' | 'transplanting' | 'harvesting' | 'inspection' | 'spraying' | 'delivery';
    model: string;
    count: number;
    autonomyLevel: number;
}

export interface ConveyorConfig {
    id: string;
    path: { x: number; y: number; z: number }[];
    speed: number;
    width: number;
}

export interface HarvestConfig {
    type: 'manual' | 'semi_auto' | 'robotic' | 'ai_vision';
    capacity: number;
    robots: number;
}

export interface PackingConfig {
    type: 'manual' | 'automated' | 'ai_sorting';
    packagesPerHour: number;
}

export interface CleaningConfig {
    type: 'manual' | 'automated' | 'uv_sterilization' | 'ozone';
    frequency: 'daily' | 'weekly' | 'continuous';
}

export interface MonitoringConfig {
    cameras: CameraConfig[];
    sensors: SensorConfig[];
    weatherStation: boolean;
    airQuality: boolean;
    pestDetection: boolean;
}

export interface CameraConfig {
    id: string;
    type: 'security' | 'growth_monitoring' | 'thermal' | 'multispectral' | 'ai_vision';
    resolution: string;
    position: { x: number; y: number; z: number };
    ptz: boolean;
}

export interface SensorConfig {
    id: string;
    type: string;
    zone: string;
    position: { x: number; y: number; z: number };
}

export interface AISystemConfig {
    growthPrediction: boolean;
    yieldOptimization: boolean;
    diseaseDetection: boolean;
    pestPrediction: boolean;
    energyOptimization: boolean;
    harvestTiming: boolean;
    marketPricing: boolean;
    supplyChain: boolean;
    digitalTwin: boolean;
    autonomousControl: boolean;
}

export interface EstimateConfig {
    constructionCost: number;
    equipmentCost: number;
    annualOperatingCost: number;
    expectedYield: number;
    expectedRevenue: number;
    roi: number;
    paybackPeriod: number;
    carbonFootprint: number;
    waterEfficiency: number;
    energyEfficiency: number;
}

// ===== 프리셋 템플릿 =====
export const DESIGN_PRESETS: Record<string, Partial<FarmDesignConfig>> = {
    starter: {
        projectName: 'Starter Farm',
        building: {
            shape: 'rectangular',
            dimensions: { width: 10, length: 15, height: 3.5, floors: 1 },
            roof: { type: 'flat', material: 'insulated_panel', insulation: 80, solarPanels: false },
            walls: { type: 'insulated_panel', thickness: 0.1, insulation: 80, transparency: 0 },
            floor: { type: 'epoxy', drainage: true, heating: false },
            entrances: [],
            windows: [],
        },
    },
    professional: {
        projectName: 'Professional Farm',
        building: {
            shape: 'rectangular',
            dimensions: { width: 20, length: 40, height: 5, floors: 2 },
            roof: { type: 'greenhouse', material: 'polycarbonate', insulation: 70, solarPanels: true },
            walls: { type: 'glass', thickness: 0.12, insulation: 70, transparency: 80 },
            floor: { type: 'raised_floor', drainage: true, heating: true },
            entrances: [],
            windows: [],
        },
    },
    enterprise: {
        projectName: 'Enterprise Farm',
        building: {
            shape: 'l_shaped',
            dimensions: { width: 50, length: 80, height: 8, floors: 4 },
            roof: { type: 'solar_integrated', material: 'smart_glass', insulation: 95, solarPanels: true },
            walls: { type: 'smart_glass', thickness: 0.15, insulation: 95, transparency: 60 },
            floor: { type: 'modular', drainage: true, heating: true },
            entrances: [],
            windows: [],
        },
    },
    research: {
        projectName: 'Research Lab',
        building: {
            shape: 'hexagonal',
            dimensions: { width: 30, length: 30, height: 6, floors: 3 },
            roof: { type: 'retractable', material: 'smart_glass', insulation: 90, solarPanels: true },
            walls: { type: 'transparent_led', thickness: 0.2, insulation: 85, transparency: 70 },
            floor: { type: 'heated', drainage: true, heating: true },
            entrances: [],
            windows: [],
        },
    },
};

// ===== 장비 카탈로그 =====
export const EQUIPMENT_CATALOG: EquipmentCategory[] = [
    {
        id: 'hvac',
        name: 'HVAC Systems',
        nameKo: '공조 시스템',
        icon: '❄️',
        items: [
            { id: 'hvac-1', name: 'AI Climate Controller', nameKo: 'AI 기후 제어기', description: '자율 온습도 제어', category: 'hvac', price: 15000, powerConsumption: 5000, dimensions: { width: 1.2, height: 0.8, depth: 0.5 }, automation: 'ai_autonomous', features: ['자동 온도 조절', 'AI 예측 제어', '에너지 최적화'] },
            { id: 'hvac-2', name: 'VRF System', nameKo: 'VRF 시스템', description: '변냉매량 시스템', category: 'hvac', price: 25000, powerConsumption: 8000, dimensions: { width: 2, height: 1.5, depth: 0.8 }, automation: 'full_auto', features: ['개별 제어', '에너지 효율', '확장 가능'] },
            { id: 'hvac-3', name: 'Geothermal Unit', nameKo: '지열 유닛', description: '지열 냉난방', category: 'hvac', price: 50000, powerConsumption: 2000, dimensions: { width: 1.5, height: 2, depth: 1 }, automation: 'full_auto', features: ['탄소 제로', '저운영비', '안정적'] },
        ],
    },
    {
        id: 'lighting',
        name: 'Lighting Systems',
        nameKo: '조명 시스템',
        icon: '💡',
        items: [
            { id: 'light-1', name: 'AI Spectrum LED', nameKo: 'AI 스펙트럼 LED', description: 'AI 적응형 스펙트럼', category: 'lighting', price: 800, powerConsumption: 400, dimensions: { width: 1.2, height: 0.05, depth: 0.15 }, automation: 'ai_autonomous', features: ['자동 스펙트럼', '성장 단계 인식', '에너지 절감'] },
            { id: 'light-2', name: 'Movable LED Track', nameKo: '이동식 LED 트랙', description: '레일 이동형 조명', category: 'lighting', price: 1500, powerConsumption: 600, dimensions: { width: 2, height: 0.1, depth: 0.1 }, automation: 'full_auto', features: ['자동 이동', '균일 조사', '유지보수 용이'] },
            { id: 'light-3', name: 'Hybrid Solar LED', nameKo: '하이브리드 태양광 LED', description: '태양광 연동 조명', category: 'lighting', price: 2000, powerConsumption: 200, dimensions: { width: 1.5, height: 0.08, depth: 0.2 }, automation: 'full_auto', features: ['자연광 연동', '80% 절전', '스마트 제어'] },
        ],
    },
    {
        id: 'growing',
        name: 'Growing Systems',
        nameKo: '재배 시스템',
        icon: '🌱',
        items: [
            { id: 'grow-1', name: 'Vertical Tower Pro', nameKo: '버티컬 타워 프로', description: '고밀도 수직 재배', category: 'growing', price: 3000, powerConsumption: 100, dimensions: { width: 0.6, height: 3, depth: 0.6 }, automation: 'full_auto', features: ['360° 회전', '자동 급수', '40층 재배'] },
            { id: 'grow-2', name: 'Rotating Drum System', nameKo: '회전 드럼 시스템', description: '회전식 재배 드럼', category: 'growing', price: 5000, powerConsumption: 200, dimensions: { width: 2, height: 2, depth: 3 }, automation: 'full_auto', features: ['중력 활용', '균일 성장', '자동 수확'] },
            { id: 'grow-3', name: 'Moving Gutter NFT', nameKo: '무빙 거터 NFT', description: '이동식 NFT 시스템', category: 'growing', price: 4000, powerConsumption: 150, dimensions: { width: 1, height: 0.15, depth: 10 }, automation: 'full_auto', features: ['자동 이동', '수확 자동화', '고효율'] },
        ],
    },
    {
        id: 'robots',
        name: 'Automation Robots',
        nameKo: '자동화 로봇',
        icon: '🤖',
        items: [
            { id: 'robot-1', name: 'Harvest Bot X1', nameKo: '하베스트 봇 X1', description: 'AI 수확 로봇', category: 'robots', price: 45000, powerConsumption: 500, dimensions: { width: 0.8, height: 1.2, depth: 1 }, automation: 'ai_autonomous', features: ['AI 비전', '99.9% 정확도', '24시간 가동'] },
            { id: 'robot-2', name: 'Seeding Arm Pro', nameKo: '시딩 암 프로', description: '정밀 파종 로봇팔', category: 'robots', price: 25000, powerConsumption: 200, dimensions: { width: 0.5, height: 2, depth: 0.5 }, automation: 'ai_autonomous', features: ['밀리미터 정밀도', '시간당 1000개', '자동 보충'] },
            { id: 'robot-3', name: 'Patrol Drone', nameKo: '순찰 드론', description: '실내 모니터링 드론', category: 'robots', price: 8000, powerConsumption: 50, dimensions: { width: 0.4, height: 0.15, depth: 0.4 }, automation: 'ai_autonomous', features: ['멀티스펙트럼', '자동 충전', '이상 감지'] },
            { id: 'robot-4', name: 'Delivery AGV', nameKo: '배송 AGV', description: '자율 주행 배송 로봇', category: 'robots', price: 15000, powerConsumption: 100, dimensions: { width: 0.6, height: 0.4, depth: 0.8 }, automation: 'ai_autonomous', features: ['자율 주행', '100kg 탑재', '충돌 방지'] },
        ],
    },
    {
        id: 'monitoring',
        name: 'Monitoring & Sensors',
        nameKo: '모니터링 & 센서',
        icon: '📡',
        items: [
            { id: 'sensor-1', name: 'Multi-Sensor Hub', nameKo: '멀티 센서 허브', description: '12종 통합 센서', category: 'monitoring', price: 500, powerConsumption: 5, dimensions: { width: 0.1, height: 0.15, depth: 0.1 }, automation: 'full_auto', features: ['온습도/CO2/광량', '실시간 전송', '배터리 5년'] },
            { id: 'sensor-2', name: 'AI Vision Camera', nameKo: 'AI 비전 카메라', description: 'AI 성장 분석 카메라', category: 'monitoring', price: 1200, powerConsumption: 15, dimensions: { width: 0.08, height: 0.08, depth: 0.12 }, automation: 'ai_autonomous', features: ['성장률 분석', '병해충 감지', '수확 예측'] },
            { id: 'sensor-3', name: 'Hyperspectral Scanner', nameKo: '초분광 스캐너', description: '초분광 영상 분석', category: 'monitoring', price: 8000, powerConsumption: 50, dimensions: { width: 0.3, height: 0.2, depth: 0.4 }, automation: 'ai_autonomous', features: ['영양 상태 분석', '스트레스 감지', '품질 예측'] },
        ],
    },
    {
        id: 'energy',
        name: 'Energy Systems',
        nameKo: '에너지 시스템',
        icon: '⚡',
        items: [
            { id: 'energy-1', name: 'Solar Roof Panel', nameKo: '태양광 지붕 패널', description: '고효율 태양광', category: 'energy', price: 300, powerConsumption: -500, dimensions: { width: 1.7, height: 0.05, depth: 1 }, automation: 'full_auto', features: ['23% 효율', '30년 보증', 'MPPT 컨트롤러'] },
            { id: 'energy-2', name: 'Battery Storage 100kWh', nameKo: '배터리 저장 100kWh', description: 'ESS 에너지 저장', category: 'energy', price: 25000, powerConsumption: 0, dimensions: { width: 2, height: 2, depth: 1 }, automation: 'full_auto', features: ['리튬인산철', '10년 수명', '스마트 충방전'] },
            { id: 'energy-3', name: 'Fuel Cell Generator', nameKo: '연료전지 발전기', description: '수소 연료전지', category: 'energy', price: 50000, powerConsumption: -10000, dimensions: { width: 3, height: 2.5, depth: 2 }, automation: 'full_auto', features: ['무공해', '95% 효율', '열병합'] },
        ],
    },
];

// ===== 유틸리티 함수 =====
export function calculateEstimates(config: FarmDesignConfig): EstimateConfig {
    const area = config.building.dimensions.width * config.building.dimensions.length;
    const floors = config.building.dimensions.floors;
    const totalArea = area * floors;

    // 기본 비용 계산
    const constructionCost = totalArea * 2000;
    const equipmentCost = totalArea * 1500;
    const annualOperatingCost = totalArea * 300;

    // 생산량 추정 (kg/m²/year)
    const yieldPerSqm = 40;
    const expectedYield = totalArea * yieldPerSqm;

    // 수익 추정
    const pricePerKg = 8;
    const expectedRevenue = expectedYield * pricePerKg;

    // ROI 계산
    const totalInvestment = constructionCost + equipmentCost;
    const annualProfit = expectedRevenue - annualOperatingCost;
    const roi = (annualProfit / totalInvestment) * 100;
    const paybackPeriod = totalInvestment / annualProfit;

    return {
        constructionCost,
        equipmentCost,
        annualOperatingCost,
        expectedYield,
        expectedRevenue,
        roi,
        paybackPeriod,
        carbonFootprint: totalArea * 0.5,
        waterEfficiency: 95,
        energyEfficiency: 85,
    };
}

export function generateDesignId(): string {
    return `design-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
