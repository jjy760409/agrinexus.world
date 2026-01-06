// AgriNexus World OS - Smart Farm Designer Types

// ============================================
// EQUIPMENT CATEGORIES
// ============================================

export type EquipmentCategory =
    | 'structure'      // 구조물
    | 'lighting'       // LED 조명
    | 'hvac'           // 공조 설비
    | 'irrigation'     // 관개/영양 설비
    | 'iot'            // IoT 센서
    | 'control'        // 제어 설비
    | 'power'          // 전기/전자 장비
    | 'cultivation'    // 재배 설비
    | 'harvest'        // 수확 장비
    | 'monitoring';    // 모니터링

export interface Equipment {
    id: string;
    name: string;
    koreanName: string;
    category: EquipmentCategory;
    icon: string;
    description: string;
    specs: EquipmentSpecs;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    connections: string[]; // Connected equipment IDs
    status: 'active' | 'standby' | 'error' | 'offline';
    aiControlled: boolean;
    powerConsumption: number; // Watts
    dataPoints: string[]; // Sensor data types
}

export interface EquipmentSpecs {
    model: string;
    manufacturer: string;
    voltage?: string;
    wattage?: number;
    dimensions?: { width: number; height: number; depth: number };
    weight?: number;
    lifespan?: number; // hours
    efficiency?: number; // percentage
    customSpecs?: Record<string, string | number>;
}

// ============================================
// SMART FARM DESIGN
// ============================================

export interface SmartFarmDesign {
    id: string;
    name: string;
    type: FarmType;
    country: string;
    climate: ClimateType;
    dimensions: FarmDimensions;
    equipment: Equipment[];
    zones: FarmZone[];
    systems: FarmSystem[];
    simulation: SimulationData;
    aiAgents: AIAgent[];
    createdAt: Date;
    updatedAt: Date;
}

export type FarmType =
    | 'vertical'       // 수직 농장
    | 'container'      // 컨테이너 농장
    | 'greenhouse'     // 유리 온실
    | 'indoor'         // 실내 농장
    | 'rooftop'        // 옥상 농장
    | 'underground';   // 지하 농장

export type ClimateType =
    | 'tropical'       // 열대
    | 'subtropical'    // 아열대
    | 'temperate'      // 온대
    | 'continental'    // 대륙성
    | 'polar'          // 극지
    | 'arid'           // 건조
    | 'mediterranean'; // 지중해성

export interface FarmDimensions {
    width: number;   // meters
    length: number;  // meters
    height: number;  // meters
    floors: number;
    growingArea: number; // square meters
}

export interface FarmZone {
    id: string;
    name: string;
    type: 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'harvest' | 'storage' | 'processing';
    position: { x: number; y: number; z: number };
    dimensions: { width: number; height: number; depth: number };
    temperature: { min: number; max: number; target: number };
    humidity: { min: number; max: number; target: number };
    co2: { min: number; max: number; target: number };
    lightLevel: { min: number; max: number; target: number }; // PPFD
    crops: CropAssignment[];
}

export interface CropAssignment {
    cropId: string;
    cropName: string;
    variety: string;
    quantity: number;
    plantedDate: Date;
    expectedHarvestDate: Date;
    growthStage: 'seed' | 'germination' | 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
    healthScore: number;
}

// ============================================
// FARM SYSTEMS
// ============================================

export interface FarmSystem {
    id: string;
    name: string;
    type: SystemType;
    status: 'online' | 'offline' | 'error' | 'maintenance';
    equipment: string[]; // Equipment IDs
    aiAgent: string; // AI Agent ID
    metrics: SystemMetrics;
    automationLevel: number; // 0-100
}

export type SystemType =
    | 'lighting'
    | 'climate'
    | 'irrigation'
    | 'nutrition'
    | 'monitoring'
    | 'security'
    | 'power'
    | 'harvest'
    | 'logistics';

export interface SystemMetrics {
    efficiency: number;
    uptime: number;
    energyConsumption: number;
    automationScore: number;
    lastMaintenance: Date;
    nextMaintenance: Date;
}

// ============================================
// AI AGENTS
// ============================================

export interface AIAgent {
    id: string;
    name: string;
    code: string;
    type: AgentType;
    role: string;
    description: string;
    status: 'active' | 'learning' | 'standby' | 'error';
    confidence: number; // 0-100
    decisionsToday: number;
    accuracy: number; // 0-100
    specialties: string[];
    controlledSystems: string[];
    learningProgress: number;
}

export type AgentType =
    | 'master'        // 총괄 에이전트
    | 'climate'       // 기후 제어
    | 'lighting'      // 조명 제어
    | 'nutrition'     // 영양 관리
    | 'harvest'       // 수확 관리
    | 'quality'       // 품질 관리
    | 'logistics'     // 물류 관리
    | 'maintenance'   // 유지보수
    | 'security'      // 보안
    | 'optimization'; // 최적화

// ============================================
// SIMULATION
// ============================================

export interface SimulationData {
    currentDay: number;
    totalDays: number;
    speed: number; // 1 = realtime, 60 = 1 min/sec
    status: 'running' | 'paused' | 'stopped';
    crops: CropSimulation[];
    resources: ResourceUsage;
    predictions: Prediction[];
    events: SimulationEvent[];
}

export interface CropSimulation {
    cropId: string;
    name: string;
    growthProgress: number; // 0-100
    healthScore: number;
    yieldPrediction: number; // kg
    daysToHarvest: number;
    issues: string[];
}

export interface ResourceUsage {
    water: { daily: number; total: number; unit: string };
    electricity: { daily: number; total: number; unit: string };
    nutrients: { daily: number; total: number; unit: string };
    co2: { daily: number; total: number; unit: string };
}

export interface Prediction {
    type: 'yield' | 'quality' | 'cost' | 'revenue' | 'issue';
    title: string;
    value: number | string;
    confidence: number;
    timeframe: string;
}

export interface SimulationEvent {
    id: string;
    day: number;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    description: string;
    aiAction?: string;
}

// ============================================
// COUNTRY PRESETS
// ============================================

export interface CountryPreset {
    code: string;
    name: string;
    koreanName: string;
    flag: string;
    climate: ClimateType;
    regulations: string[];
    popularCrops: string[];
    electricityVoltage: string;
    avgElectricityCost: number; // USD per kWh
    waterCost: number; // USD per m3
    laborCost: number; // USD per hour
    incentives: string[];
    challenges: string[];
}

// ============================================
// SEED CATALOG
// ============================================

export interface SeedVariety {
    id: string;
    name: string;
    koreanName: string;
    scientificName: string;
    category: 'leafy' | 'herb' | 'fruit' | 'flower' | 'root' | 'microgreen' | 'sprout';
    icon: string;
    growthDays: number;
    optimalTemp: { min: number; max: number };
    optimalHumidity: { min: number; max: number };
    optimalPH: { min: number; max: number };
    lightRequirement: number; // PPFD
    photoperiod: number; // hours of light
    yieldPerSquareMeter: number; // kg
    difficulty: 'easy' | 'medium' | 'hard';
    nutritionRequirements: NutritionRequirement;
}

export interface NutritionRequirement {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    calcium: number;
    magnesium: number;
    sulfur: number;
    iron: number;
    manganese: number;
    zinc: number;
    copper: number;
    boron: number;
    molybdenum: number;
}
