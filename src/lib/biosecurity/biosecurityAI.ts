// AgriNexus World OS - 생체보안 AI 시스템
// Biosecurity AI - 질병 예방, 검역, 실시간 위협 탐지

// ============================================
// 타입 정의
// ============================================

export interface BiosecuritySystem {
    id: string;
    farmId: string;
    aiEngine: BiosecurityAI;
    sensors: BioSensor[];
    zones: SecurityZone[];
    threats: ThreatRecord[];
    quarantine: QuarantineArea[];
    protocols: SecurityProtocol[];
    metrics: BiosecurityMetrics;
    status: 'secure' | 'alert' | 'containment' | 'lockdown';
}

export interface BiosecurityAI {
    id: string;
    name: string;
    version: string;
    models: AIModel[];
    scanRate: number;                 // scans/second
    accuracy: number;                 // %
    falsePositiveRate: number;        // %
    responseTime: number;             // ms
    learningRate: number;
    status: 'active' | 'scanning' | 'analyzing' | 'learning';
}

export interface AIModel {
    id: string;
    name: string;
    type: 'pathogen_detection' | 'pest_identification' | 'contamination' | 'anomaly' | 'predictive';
    accuracy: number;
    lastTraining: Date;
    dataPoints: number;
    version: string;
}

export interface BioSensor {
    id: string;
    name: string;
    type: SensorType;
    location: string;
    sensitivity: number;              // detection threshold
    status: 'active' | 'calibrating' | 'alert' | 'error';
    lastReading: SensorReading;
    alerts: number;
}

export type SensorType =
    | 'pathogen_scanner'
    | 'dna_analyzer'
    | 'air_quality'
    | 'water_quality'
    | 'pest_detector'
    | 'spore_counter'
    | 'thermal_imaging'
    | 'volatile_organic';

export interface SensorReading {
    timestamp: Date;
    value: number;
    unit: string;
    normalRange: { min: number; max: number };
    status: 'normal' | 'warning' | 'critical';
    details?: string;
}

export interface SecurityZone {
    id: string;
    name: string;
    level: 1 | 2 | 3 | 4 | 5;          // 1=최고보안
    sensors: string[];
    accessControl: AccessControl;
    currentStatus: 'clear' | 'monitoring' | 'alert' | 'restricted';
    lastIncident?: Date;
    threatLevel: number;              // 0-100
}

export interface AccessControl {
    type: 'biometric' | 'rfid' | 'keycard' | 'multi_factor';
    authorizedPersonnel: number;
    entryPoints: number;
    airlock: boolean;
    decontamination: boolean;
}

export interface ThreatRecord {
    id: string;
    type: ThreatType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: Date;
    location: string;
    source: string;
    status: 'detected' | 'contained' | 'neutralized' | 'monitoring';
    response: ResponseAction[];
    impactArea: number;               // m²
    casualties: number;               // affected plants
}

export type ThreatType =
    | 'virus'
    | 'bacteria'
    | 'fungus'
    | 'pest'
    | 'contamination'
    | 'unauthorized_access'
    | 'cross_contamination'
    | 'airborne_pathogen';

export interface ResponseAction {
    action: string;
    timestamp: Date;
    automated: boolean;
    effectiveness: number;            // %
    status: 'pending' | 'in_progress' | 'completed';
}

export interface QuarantineArea {
    id: string;
    name: string;
    reason: string;
    affectedPlants: number;
    startDate: Date;
    estimatedClearance: Date;
    protocols: string[];
    status: 'active' | 'monitoring' | 'cleared';
    containmentLevel: number;         // %
}

export interface SecurityProtocol {
    id: string;
    name: string;
    koreanName: string;
    trigger: string;
    actions: string[];
    automationLevel: 'manual' | 'semi' | 'full';
    lastActivated?: Date;
    effectiveness: number;            // %
}

export interface BiosecurityMetrics {
    overallSecurityScore: number;     // 0-100
    threatsDetected: number;
    threatsNeutralized: number;
    containmentSuccessRate: number;   // %
    responseTime: number;             // avg seconds
    falseAlarmRate: number;           // %
    plantsProtected: number;
    incidentFreeDays: number;
    scansConducted: number;
    pathogensBlocked: number;
}

// ============================================
// 생체보안 엔진
// ============================================

export class BiosecurityEngine {
    private system: BiosecuritySystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): BiosecuritySystem {
        return {
            id: `biosec-${Date.now()}`,
            farmId,
            aiEngine: {
                id: 'ai-1',
                name: 'BioShield AI',
                version: '4.0',
                models: [
                    { id: 'm-1', name: 'PathogenNet', type: 'pathogen_detection', accuracy: 99.8, lastTraining: new Date(), dataPoints: 5000000, version: '3.2' },
                    { id: 'm-2', name: 'PestVision', type: 'pest_identification', accuracy: 99.5, lastTraining: new Date(), dataPoints: 2000000, version: '2.8' },
                    { id: 'm-3', name: 'AnomalyX', type: 'anomaly', accuracy: 98.9, lastTraining: new Date(), dataPoints: 3000000, version: '2.5' },
                    { id: 'm-4', name: 'PredictGuard', type: 'predictive', accuracy: 97.5, lastTraining: new Date(), dataPoints: 8000000, version: '4.0' }
                ],
                scanRate: 100000,
                accuracy: 99.5,
                falsePositiveRate: 0.02,
                responseTime: 50,
                learningRate: 0.08,
                status: 'active'
            },
            sensors: this.createSensors(),
            zones: this.createZones(),
            threats: this.createThreats(),
            quarantine: [],
            protocols: this.createProtocols(),
            metrics: {
                overallSecurityScore: 98.5,
                threatsDetected: 1247,
                threatsNeutralized: 1245,
                containmentSuccessRate: 99.8,
                responseTime: 2.5,
                falseAlarmRate: 0.02,
                plantsProtected: 50000,
                incidentFreeDays: 127,
                scansConducted: 85000000,
                pathogensBlocked: 4520
            },
            status: 'secure'
        };
    }

    private createSensors(): BioSensor[] {
        const sensorTypes: { type: SensorType; name: string }[] = [
            { type: 'pathogen_scanner', name: '병원균 스캐너' },
            { type: 'dna_analyzer', name: 'DNA 분석기' },
            { type: 'air_quality', name: '공기질 센서' },
            { type: 'water_quality', name: '수질 센서' },
            { type: 'pest_detector', name: '해충 탐지기' },
            { type: 'spore_counter', name: '포자 계수기' },
            { type: 'thermal_imaging', name: '열화상 카메라' },
            { type: 'volatile_organic', name: 'VOC 센서' }
        ];

        return sensorTypes.map((s, i) => ({
            id: `sensor-${i}`,
            name: s.name,
            type: s.type,
            location: `구역 ${String.fromCharCode(65 + i % 5)}`,
            sensitivity: 0.01,
            status: 'active',
            lastReading: { timestamp: new Date(), value: Math.random() * 10, unit: 'ppm', normalRange: { min: 0, max: 15 }, status: 'normal' },
            alerts: Math.floor(Math.random() * 5)
        }));
    }

    private createZones(): SecurityZone[] {
        return [
            { id: 'zone-1', name: '클린룸 A', level: 1, sensors: ['sensor-0', 'sensor-1'], accessControl: { type: 'multi_factor', authorizedPersonnel: 5, entryPoints: 1, airlock: true, decontamination: true }, currentStatus: 'clear', threatLevel: 2 },
            { id: 'zone-2', name: '재배실 B', level: 2, sensors: ['sensor-2', 'sensor-4'], accessControl: { type: 'biometric', authorizedPersonnel: 15, entryPoints: 2, airlock: true, decontamination: false }, currentStatus: 'monitoring', threatLevel: 8 },
            { id: 'zone-3', name: '수확실', level: 3, sensors: ['sensor-3', 'sensor-5'], accessControl: { type: 'rfid', authorizedPersonnel: 25, entryPoints: 3, airlock: false, decontamination: true }, currentStatus: 'clear', threatLevel: 5 }
        ];
    }

    private createThreats(): ThreatRecord[] {
        return [
            { id: 't-1', type: 'fungus', severity: 'medium', detectedAt: new Date(Date.now() - 86400000), location: '구역 C', source: '외부 공기', status: 'neutralized', response: [{ action: '격리', timestamp: new Date(), automated: true, effectiveness: 100, status: 'completed' }], impactArea: 5, casualties: 12 }
        ];
    }

    private createProtocols(): SecurityProtocol[] {
        return [
            { id: 'p-1', name: 'Lockdown Alpha', koreanName: '완전 봉쇄', trigger: '치명적 병원균 탐지', actions: ['전체 환기 중단', '모든 출입문 폐쇄', 'UV 살균 가동'], automationLevel: 'full', effectiveness: 99.9 },
            { id: 'p-2', name: 'Containment Beta', koreanName: '구역 격리', trigger: '해충 대량 발견', actions: ['해당 구역 격리', '주변 구역 경계', '해충 포획기 가동'], automationLevel: 'full', effectiveness: 98.5 },
            { id: 'p-3', name: 'Decon Gamma', koreanName: '소독 프로토콜', trigger: '오염 물질 감지', actions: ['오염 지역 표시', '자동 소독 시작', '작업자 대피'], automationLevel: 'semi', effectiveness: 97 }
        ];
    }

    getSystem(): BiosecuritySystem { return this.system; }
    getMetrics(): BiosecurityMetrics { return this.system.metrics; }
    getThreats(): ThreatRecord[] { return this.system.threats; }
}

const biosecEngines: Map<string, BiosecurityEngine> = new Map();
export function getBiosecurityEngine(farmId: string): BiosecurityEngine {
    if (!biosecEngines.has(farmId)) biosecEngines.set(farmId, new BiosecurityEngine(farmId));
    return biosecEngines.get(farmId)!;
}
