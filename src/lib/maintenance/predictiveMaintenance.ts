// AgriNexus World OS - 예측 유지보수 AI 시스템
// Predictive Maintenance AI - 장비 고장 예측 및 자동 유지보수 스케줄링

// ============================================
// 타입 정의
// ============================================

export interface PredictiveMaintenanceSystem {
    id: string;
    farmId: string;
    aiEngine: MaintenanceAI;
    equipment: MonitoredEquipment[];
    predictions: FailurePrediction[];
    maintenanceSchedule: MaintenanceTask[];
    repairHistory: RepairRecord[];
    spareParts: SparePart[];
    technicians: Technician[];
    metrics: MaintenanceMetrics;
    status: 'monitoring' | 'alert' | 'maintenance_in_progress';
}

export interface MaintenanceAI {
    id: string;
    name: string;
    version: string;
    models: PredictionModel[];
    accuracy: number;                 // %
    falsePositiveRate: number;        // %
    predictionHorizon: number;        // days
    learningRate: number;
    dataPoints: number;
    status: 'active' | 'learning' | 'analyzing';
}

export interface PredictionModel {
    id: string;
    name: string;
    type: 'vibration' | 'thermal' | 'acoustic' | 'electrical' | 'performance' | 'wear';
    accuracy: number;                 // %
    lastTraining: Date;
    features: string[];
}

export interface MonitoredEquipment {
    id: string;
    name: string;
    koreanName: string;
    type: EquipmentType;
    model: string;
    location: string;
    installDate: Date;
    lastMaintenance: Date;
    operatingHours: number;
    healthScore: number;              // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    sensors: EquipmentSensor[];
    status: 'running' | 'idle' | 'warning' | 'maintenance' | 'failed';
    efficiency: number;               // %
    mtbf: number;                     // Mean Time Between Failures (hours)
}

export type EquipmentType =
    | 'hvac'
    | 'pump'
    | 'motor'
    | 'compressor'
    | 'conveyor'
    | 'robot'
    | 'led_system'
    | 'sensor_array'
    | 'control_panel'
    | 'generator';

export interface EquipmentSensor {
    id: string;
    type: 'temperature' | 'vibration' | 'current' | 'pressure' | 'humidity' | 'rpm' | 'noise';
    value: number;
    unit: string;
    normalRange: { min: number; max: number };
    status: 'normal' | 'warning' | 'critical';
    trend: 'stable' | 'increasing' | 'decreasing' | 'fluctuating';
}

export interface FailurePrediction {
    id: string;
    equipmentId: string;
    equipmentName: string;
    failureType: string;
    probability: number;              // %
    predictedDate: Date;
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    impact: string;
    recommendedAction: string;
    estimatedCost: number;            // USD
    confidence: number;               // %
    createdAt: Date;
    status: 'pending' | 'acknowledged' | 'scheduled' | 'resolved';
}

export interface MaintenanceTask {
    id: string;
    equipmentId: string;
    type: 'preventive' | 'predictive' | 'corrective' | 'emergency';
    priority: 1 | 2 | 3 | 4 | 5;
    description: string;
    scheduledDate: Date;
    estimatedDuration: number;        // minutes
    assignedTechnician?: string;
    parts: string[];
    status: 'scheduled' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
    cost: number;                     // USD
}

export interface RepairRecord {
    id: string;
    equipmentId: string;
    date: Date;
    type: string;
    description: string;
    technician: string;
    duration: number;                 // minutes
    partsUsed: { name: string; quantity: number; cost: number }[];
    totalCost: number;                // USD
    success: boolean;
    notes: string;
}

export interface SparePart {
    id: string;
    name: string;
    partNumber: string;
    category: string;
    stock: number;
    minStock: number;
    location: string;
    unitCost: number;                 // USD
    leadTime: number;                 // days
    supplier: string;
    compatibleEquipment: string[];
}

export interface Technician {
    id: string;
    name: string;
    specialization: string[];
    certifications: string[];
    availability: 'available' | 'busy' | 'off_duty';
    currentTask?: string;
    rating: number;                   // 1-5
    completedTasks: number;
}

export interface MaintenanceMetrics {
    equipmentMonitored: number;
    predictionsAccuracy: number;      // %
    plannedDowntime: number;          // hours/month
    unplannedDowntime: number;        // hours/month
    mtbfAverage: number;              // hours
    mttrAverage: number;              // hours (Mean Time To Repair)
    preventiveMaintenance: number;    // % of total
    predictiveMaintenance: number;    // % of total
    costSavings: number;              // USD/month
    partsAvailability: number;        // %
    technicianUtilization: number;    // %
    oee: number;                      // Overall Equipment Effectiveness %
}

// ============================================
// 예측 유지보수 엔진
// ============================================

export class PredictiveMaintenanceEngine {
    private system: PredictiveMaintenanceSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): PredictiveMaintenanceSystem {
        return {
            id: `pm-${Date.now()}`,
            farmId,
            aiEngine: {
                id: 'ai-1',
                name: 'MaintainGenius AI',
                version: '5.0',
                models: [
                    { id: 'm-1', name: 'VibrationNet', type: 'vibration', accuracy: 98.5, lastTraining: new Date(), features: ['진폭', '주파수', '스펙트럼'] },
                    { id: 'm-2', name: 'ThermalPredict', type: 'thermal', accuracy: 97.8, lastTraining: new Date(), features: ['온도', '방열패턴', '열화상'] },
                    { id: 'm-3', name: 'AcousticSense', type: 'acoustic', accuracy: 96.5, lastTraining: new Date(), features: ['소음레벨', '주파수분석', '이상음'] },
                    { id: 'm-4', name: 'WearAnalyzer', type: 'wear', accuracy: 95, lastTraining: new Date(), features: ['마모도', '사용시간', '부하이력'] }
                ],
                accuracy: 97.5,
                falsePositiveRate: 1.2,
                predictionHorizon: 30,
                learningRate: 0.08,
                dataPoints: 150000000,
                status: 'active'
            },
            equipment: this.createEquipment(),
            predictions: this.createPredictions(),
            maintenanceSchedule: this.createSchedule(),
            repairHistory: [],
            spareParts: this.createSpareParts(),
            technicians: this.createTechnicians(),
            metrics: {
                equipmentMonitored: 150,
                predictionsAccuracy: 97.5,
                plannedDowntime: 8,
                unplannedDowntime: 0.5,
                mtbfAverage: 8760,
                mttrAverage: 45,
                preventiveMaintenance: 30,
                predictiveMaintenance: 65,
                costSavings: 45000,
                partsAvailability: 98,
                technicianUtilization: 75,
                oee: 94
            },
            status: 'monitoring'
        };
    }

    private createEquipment(): MonitoredEquipment[] {
        const equipment: { name: string; korean: string; type: EquipmentType }[] = [
            { name: 'HVAC System A', korean: '🌡️ 공조 시스템 A', type: 'hvac' },
            { name: 'Nutrient Pump 1', korean: '💧 양액 펌프 1', type: 'pump' },
            { name: 'LED Controller', korean: '💡 LED 제어기', type: 'led_system' },
            { name: 'Harvesting Robot', korean: '🤖 수확 로봇', type: 'robot' },
            { name: 'Conveyor System', korean: '🔄 컨베이어', type: 'conveyor' },
            { name: 'Air Compressor', korean: '💨 에어 컴프레서', type: 'compressor' },
            { name: 'Main Motor', korean: '⚙️ 메인 모터', type: 'motor' },
            { name: 'Control Panel', korean: '🎛️ 제어 패널', type: 'control_panel' }
        ];

        return equipment.map((e, i) => ({
            id: `equip-${i}`,
            name: e.name,
            koreanName: e.korean,
            type: e.type,
            model: `Model-${String.fromCharCode(65 + i)}${1000 + i}`,
            location: `구역 ${String.fromCharCode(65 + i % 4)}`,
            installDate: new Date(Date.now() - Math.random() * 730 * 86400000),
            lastMaintenance: new Date(Date.now() - Math.random() * 60 * 86400000),
            operatingHours: 5000 + Math.floor(Math.random() * 10000),
            healthScore: 75 + Math.floor(Math.random() * 25),
            riskLevel: Math.random() > 0.9 ? 'high' : Math.random() > 0.7 ? 'medium' : 'low',
            sensors: [
                { id: `s-${i}-1`, type: 'temperature', value: 35 + Math.random() * 20, unit: '°C', normalRange: { min: 30, max: 60 }, status: 'normal', trend: 'stable' },
                { id: `s-${i}-2`, type: 'vibration', value: 0.5 + Math.random() * 2, unit: 'mm/s', normalRange: { min: 0, max: 4 }, status: 'normal', trend: 'stable' }
            ],
            status: 'running',
            efficiency: 85 + Math.random() * 15,
            mtbf: 6000 + Math.floor(Math.random() * 4000)
        }));
    }

    private createPredictions(): FailurePrediction[] {
        return [
            { id: 'pred-1', equipmentId: 'equip-1', equipmentName: '양액 펌프 1', failureType: '씰 마모', probability: 85, predictedDate: new Date(Date.now() + 14 * 86400000), severity: 'moderate', impact: '양액 순환 중단', recommendedAction: '씰 교체 예정', estimatedCost: 250, confidence: 92, createdAt: new Date(), status: 'acknowledged' },
            { id: 'pred-2', equipmentId: 'equip-5', equipmentName: '에어 컴프레서', failureType: '베어링 이상', probability: 72, predictedDate: new Date(Date.now() + 21 * 86400000), severity: 'major', impact: '공압 시스템 정지', recommendedAction: '베어링 점검 및 교체', estimatedCost: 800, confidence: 88, createdAt: new Date(), status: 'scheduled' }
        ];
    }

    private createSchedule(): MaintenanceTask[] {
        return [
            { id: 'task-1', equipmentId: 'equip-1', type: 'predictive', priority: 2, description: '씰 교체 및 점검', scheduledDate: new Date(Date.now() + 7 * 86400000), estimatedDuration: 120, assignedTechnician: 'tech-1', parts: ['씰 키트'], status: 'scheduled', cost: 300 },
            { id: 'task-2', equipmentId: 'equip-0', type: 'preventive', priority: 3, description: '필터 교체 및 청소', scheduledDate: new Date(Date.now() + 14 * 86400000), estimatedDuration: 90, parts: ['HEPA 필터'], status: 'scheduled', cost: 150 }
        ];
    }

    private createSpareParts(): SparePart[] {
        return [
            { id: 'part-1', name: '펌프 씰 키트', partNumber: 'PSK-1000', category: '펌프 부품', stock: 25, minStock: 10, location: 'A-1-1', unitCost: 45, leadTime: 3, supplier: 'PumpParts Co.', compatibleEquipment: ['equip-1', 'equip-2'] },
            { id: 'part-2', name: '베어링 6205', partNumber: 'BRG-6205', category: '베어링', stock: 50, minStock: 20, location: 'A-2-3', unitCost: 25, leadTime: 2, supplier: 'SKF Korea', compatibleEquipment: ['equip-5', 'equip-6'] },
            { id: 'part-3', name: 'HEPA 필터', partNumber: 'HF-H13', category: '필터', stock: 30, minStock: 15, location: 'B-1-2', unitCost: 80, leadTime: 5, supplier: 'FilterTech', compatibleEquipment: ['equip-0'] }
        ];
    }

    private createTechnicians(): Technician[] {
        return [
            { id: 'tech-1', name: '김기술', specialization: ['펌프', 'HVAC', '전기'], certifications: ['전기기사', 'HVAC 전문가'], availability: 'available', rating: 4.9, completedTasks: 450 },
            { id: 'tech-2', name: '박수리', specialization: ['로봇', '컨베이어', 'PLC'], certifications: ['로봇공학', 'PLC 프로그래밍'], availability: 'available', rating: 4.8, completedTasks: 380 }
        ];
    }

    getSystem(): PredictiveMaintenanceSystem { return this.system; }
    getMetrics(): MaintenanceMetrics { return this.system.metrics; }
    getPredictions(): FailurePrediction[] { return this.system.predictions; }
    getEquipment(): MonitoredEquipment[] { return this.system.equipment; }
}

const pmEngines: Map<string, PredictiveMaintenanceEngine> = new Map();
export function getPredictiveMaintenanceEngine(farmId: string): PredictiveMaintenanceEngine {
    if (!pmEngines.has(farmId)) pmEngines.set(farmId, new PredictiveMaintenanceEngine(farmId));
    return pmEngines.get(farmId)!;
}
