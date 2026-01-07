// AgriNexus World OS - 스마트 포장 시스템
// Smart Packaging System - AI 기반 자동 포장, 선도 추적, 맞춤형 패키징

// ============================================
// 타입 정의
// ============================================

export interface SmartPackagingSystem {
    id: string;
    farmId: string;
    packingLines: PackingLine[];
    packagingAI: PackagingAI;
    materials: PackagingMaterial[];
    packages: SmartPackage[];
    tracking: FreshnessTracker[];
    qualityControl: QualityControlSystem;
    metrics: PackagingMetrics;
    status: 'running' | 'setup' | 'maintenance' | 'idle';
}

export interface PackingLine {
    id: string;
    name: string;
    type: LineType;
    capacity: number;                 // packages/hour
    currentSpeed: number;             // packages/hour
    efficiency: number;               // %
    products: string[];
    status: 'running' | 'idle' | 'setup' | 'maintenance';
    operators: number;
    automationLevel: number;          // %
    sensors: PackingSensor[];
}

export type LineType =
    | 'leafy_greens'
    | 'fruits'
    | 'tomatoes'
    | 'berries'
    | 'herbs'
    | 'mixed'
    | 'bulk'
    | 'premium';

export interface PackingSensor {
    type: 'weight' | 'vision' | 'temperature' | 'humidity' | 'gas';
    value: number;
    unit: string;
    status: 'active' | 'error';
}

export interface PackagingAI {
    id: string;
    name: string;
    version: string;
    capabilities: string[];
    defectDetection: number;          // % accuracy
    sortingAccuracy: number;          // %
    optimizationEfficiency: number;   // %
    gradeClassification: number;      // % accuracy
    wasteReduction: number;           // %
    learningRate: number;
    status: 'active' | 'learning' | 'optimizing';
}

export interface PackagingMaterial {
    id: string;
    name: string;
    type: MaterialType;
    biodegradable: boolean;
    recyclable: boolean;
    carbonFootprint: number;          // g CO2 per unit
    cost: number;                     // USD per unit
    stock: number;
    reorderPoint: number;
    supplier: string;
    sustainability: number;           // 1-10
}

export type MaterialType =
    | 'bio_plastic'
    | 'recycled_paper'
    | 'compostable_film'
    | 'mushroom_foam'
    | 'seaweed_wrap'
    | 'plant_fiber'
    | 'edible_coating';

export interface SmartPackage {
    id: string;
    productId: string;
    productName: string;
    weight: number;                   // kg
    grade: 'premium' | 'standard' | 'economy';
    packingTime: Date;
    freshness: FreshnessData;
    qrCode: string;
    nfcTag: string;
    sensors: PackageSensor[];
    destination: string;
    status: 'packed' | 'shipped' | 'delivered' | 'consumed';
}

export interface FreshnessData {
    initialScore: number;             // 0-100
    currentScore: number;             // 0-100
    degradationRate: number;          // % per day
    estimatedShelfLife: number;       // days
    harvestDate: Date;
    packDate: Date;
    expiryDate: Date;
    optimalTemperature: { min: number; max: number };
    currentTemperature: number;
}

export interface PackageSensor {
    type: 'temperature' | 'humidity' | 'ethylene' | 'co2' | 'shock';
    value: number;
    unit: string;
    threshold: { min: number; max: number };
    alerts: number;
    lastUpdate: Date;
}

export interface FreshnessTracker {
    id: string;
    packageId: string;
    timeline: FreshnessEvent[];
    currentLocation: string;
    temperature: number[];
    humidity: number[];
    shockEvents: number;
    estimatedQuality: number;         // %
    alerts: TrackingAlert[];
}

export interface FreshnessEvent {
    timestamp: Date;
    event: string;
    location: string;
    temperature: number;
    freshnessScore: number;
}

export interface TrackingAlert {
    id: string;
    type: 'temperature' | 'humidity' | 'shock' | 'delay' | 'quality';
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: Date;
    resolved: boolean;
}

export interface QualityControlSystem {
    id: string;
    aiVision: AIVisionSystem;
    samplingRate: number;             // %
    passRate: number;                 // %
    defectsDetected: number;
    gradeDistribution: { premium: number; standard: number; economy: number };
    rejectRate: number;               // %
}

export interface AIVisionSystem {
    cameras: number;
    resolution: string;
    fps: number;
    detectionTypes: string[];
    accuracy: number;                 // %
    processingSpeed: number;          // ms per item
}

export interface PackagingMetrics {
    packagesProducedToday: number;
    packagesProducedTotal: number;
    avgFreshnessScore: number;        // 0-100
    wasteReduction: number;           // %
    materialEfficiency: number;       // %
    qualityScore: number;             // 0-100
    customerSatisfaction: number;     // 1-5
    sustainabilityIndex: number;      // 1-10
    costPerPackage: number;           // USD
    throughput: number;               // packages/hour
    defectRate: number;               // %
}

// ============================================
// 스마트 포장 엔진
// ============================================

export class SmartPackagingEngine {
    private system: SmartPackagingSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): SmartPackagingSystem {
        return {
            id: `packaging-${Date.now()}`,
            farmId,
            packingLines: this.createPackingLines(),
            packagingAI: {
                id: 'pkg-ai-1',
                name: 'PackGenius AI',
                version: '3.5',
                capabilities: ['결함 탐지', '등급 분류', '최적 포장 선택', '선도 예측', '배치 최적화'],
                defectDetection: 99.5,
                sortingAccuracy: 99.8,
                optimizationEfficiency: 95,
                gradeClassification: 99.2,
                wasteReduction: 35,
                learningRate: 0.1,
                status: 'active'
            },
            materials: this.createMaterials(),
            packages: [],
            tracking: [],
            qualityControl: {
                id: 'qc-1',
                aiVision: { cameras: 24, resolution: '4K', fps: 120, detectionTypes: ['색상', '크기', '형태', '손상', '이물질'], accuracy: 99.5, processingSpeed: 5 },
                samplingRate: 100,
                passRate: 98.5,
                defectsDetected: 1250,
                gradeDistribution: { premium: 45, standard: 40, economy: 15 },
                rejectRate: 1.5
            },
            metrics: {
                packagesProducedToday: 15420,
                packagesProducedTotal: 2500000,
                avgFreshnessScore: 95,
                wasteReduction: 35,
                materialEfficiency: 92,
                qualityScore: 98,
                customerSatisfaction: 4.9,
                sustainabilityIndex: 9.2,
                costPerPackage: 0.45,
                throughput: 2500,
                defectRate: 0.5
            },
            status: 'running'
        };
    }

    private createPackingLines(): PackingLine[] {
        const lines: { name: string; type: LineType; capacity: number }[] = [
            { name: '상추/엽채류 라인', type: 'leafy_greens', capacity: 3000 },
            { name: '토마토 라인', type: 'tomatoes', capacity: 2500 },
            { name: '딸기/베리류 라인', type: 'berries', capacity: 2000 },
            { name: '허브 라인', type: 'herbs', capacity: 1500 },
            { name: '프리미엄 라인', type: 'premium', capacity: 800 }
        ];

        return lines.map((l, i) => ({
            id: `line-${i}`,
            name: l.name,
            type: l.type,
            capacity: l.capacity,
            currentSpeed: l.capacity * (0.8 + Math.random() * 0.2),
            efficiency: 90 + Math.random() * 10,
            products: [],
            status: 'running',
            operators: 1 + Math.floor(Math.random() * 2),
            automationLevel: 95,
            sensors: [
                { type: 'weight', value: 0.5 + Math.random() * 2, unit: 'kg', status: 'active' },
                { type: 'vision', value: 99, unit: '%', status: 'active' },
                { type: 'temperature', value: 4 + Math.random() * 2, unit: '°C', status: 'active' }
            ]
        }));
    }

    private createMaterials(): PackagingMaterial[] {
        return [
            { id: 'mat-1', name: 'BioPLA 필름', type: 'bio_plastic', biodegradable: true, recyclable: true, carbonFootprint: 15, cost: 0.08, stock: 50000, reorderPoint: 10000, supplier: 'GreenPack Co.', sustainability: 9 },
            { id: 'mat-2', name: '재생 종이박스', type: 'recycled_paper', biodegradable: true, recyclable: true, carbonFootprint: 8, cost: 0.12, stock: 30000, reorderPoint: 8000, supplier: 'EcoPaper Ltd.', sustainability: 10 },
            { id: 'mat-3', name: '퇴비화 필름', type: 'compostable_film', biodegradable: true, recyclable: false, carbonFootprint: 12, cost: 0.15, stock: 20000, reorderPoint: 5000, supplier: 'CompostWrap Inc.', sustainability: 9 },
            { id: 'mat-4', name: '버섯 폼', type: 'mushroom_foam', biodegradable: true, recyclable: false, carbonFootprint: 5, cost: 0.25, stock: 10000, reorderPoint: 3000, supplier: 'MycoPackaging', sustainability: 10 },
            { id: 'mat-5', name: '해조류 랩', type: 'seaweed_wrap', biodegradable: true, recyclable: false, carbonFootprint: 3, cost: 0.30, stock: 8000, reorderPoint: 2000, supplier: 'OceanWrap', sustainability: 10 }
        ];
    }

    createPackage(productId: string, productName: string, weight: number, grade: 'premium' | 'standard' | 'economy'): SmartPackage {
        const pkg: SmartPackage = {
            id: `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId,
            productName,
            weight,
            grade,
            packingTime: new Date(),
            freshness: {
                initialScore: 98,
                currentScore: 98,
                degradationRate: 2,
                estimatedShelfLife: 14,
                harvestDate: new Date(Date.now() - 3600000),
                packDate: new Date(),
                expiryDate: new Date(Date.now() + 14 * 86400000),
                optimalTemperature: { min: 2, max: 8 },
                currentTemperature: 4
            },
            qrCode: `QR-${Date.now()}`,
            nfcTag: `NFC-${Date.now()}`,
            sensors: [
                { type: 'temperature', value: 4, unit: '°C', threshold: { min: 0, max: 10 }, alerts: 0, lastUpdate: new Date() },
                { type: 'humidity', value: 85, unit: '%', threshold: { min: 80, max: 95 }, alerts: 0, lastUpdate: new Date() }
            ],
            destination: '',
            status: 'packed'
        };
        this.system.packages.push(pkg);
        return pkg;
    }

    getSystem(): SmartPackagingSystem { return this.system; }
    getMetrics(): PackagingMetrics { return this.system.metrics; }
    getLines(): PackingLine[] { return this.system.packingLines; }
}

const packagingEngines: Map<string, SmartPackagingEngine> = new Map();
export function getSmartPackagingEngine(farmId: string): SmartPackagingEngine {
    if (!packagingEngines.has(farmId)) packagingEngines.set(farmId, new SmartPackagingEngine(farmId));
    return packagingEngines.get(farmId)!;
}
