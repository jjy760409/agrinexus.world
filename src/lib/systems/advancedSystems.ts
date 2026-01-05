// AgriNexus World OS - 디지털 트윈 시스템
// 전체 스마트팜 시설의 완벽한 가상 복제

export interface DigitalTwin {
    id: string;
    name: string;
    physicalLocation: {
        country: string;
        city: string;
        coordinates: { lat: number; lng: number };
    };
    syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
    lastSync: Date;
    accuracy: number; // 0-100%
    systems: TwinSystem[];
    sensors: TwinSensor[];
    predictions: TwinPrediction[];
    metrics: TwinMetrics;
}

export interface TwinSystem {
    id: string;
    name: string;
    type: 'hvac' | 'lighting' | 'irrigation' | 'nutrient' | 'monitoring' | 'robot';
    status: 'online' | 'warning' | 'offline';
    efficiency: number;
    realTimeData: Record<string, number>;
}

export interface TwinSensor {
    id: string;
    type: 'temperature' | 'humidity' | 'co2' | 'light' | 'ph' | 'ec' | 'moisture';
    location: { x: number; y: number; z: number };
    value: number;
    unit: string;
    status: 'active' | 'warning' | 'error';
    lastUpdate: Date;
}

export interface TwinPrediction {
    id: string;
    type: 'maintenance' | 'yield' | 'disease' | 'energy' | 'growth';
    prediction: string;
    probability: number;
    timeframe: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface TwinMetrics {
    totalPlants: number;
    activeZones: number;
    energyUsage: number;
    waterUsage: number;
    harvestReady: number;
    alertCount: number;
}

// AR/VR 인터페이스 시스템
export interface ARVRInterface {
    id: string;
    mode: 'ar' | 'vr' | 'mixed';
    resolution: string;
    frameRate: number;
    handTracking: boolean;
    eyeTracking: boolean;
    voiceControl: boolean;
    gestures: GestureControl[];
    overlays: AROverlay[];
}

export interface GestureControl {
    name: string;
    action: string;
    enabled: boolean;
}

export interface AROverlay {
    id: string;
    type: 'info' | 'alert' | 'control' | 'data';
    visible: boolean;
    content: string;
    position: { x: number; y: number };
}

// 실시간 협업 시스템
export interface CollaborationHub {
    id: string;
    activeUsers: CollaborationUser[];
    sharedViews: SharedView[];
    annotations: Annotation[];
    voiceChannels: VoiceChannel[];
}

export interface CollaborationUser {
    id: string;
    name: string;
    role: 'admin' | 'operator' | 'analyst' | 'viewer';
    avatar: string;
    status: 'online' | 'away' | 'busy';
    currentView: string;
}

export interface SharedView {
    id: string;
    name: string;
    type: 'dashboard' | '3d-view' | 'analytics' | 'control';
    participants: string[];
}

export interface Annotation {
    id: string;
    author: string;
    content: string;
    position: { x: number; y: number; z?: number };
    timestamp: Date;
    resolved: boolean;
}

export interface VoiceChannel {
    id: string;
    name: string;
    participants: string[];
    muted: boolean;
}

// 예측 유지보수 시스템
export interface PredictiveMaintenanceSystem {
    equipmentHealth: EquipmentHealth[];
    maintenanceSchedule: MaintenanceTask[];
    sparePartsInventory: SparePart[];
    historicalFailures: FailureRecord[];
    mtbf: number; // Mean Time Between Failures
    mttr: number; // Mean Time To Repair
}

export interface EquipmentHealth {
    id: string;
    name: string;
    type: string;
    healthScore: number;
    remainingLife: string;
    lastMaintenance: Date;
    nextMaintenance: Date;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    anomalies: string[];
}

export interface MaintenanceTask {
    id: string;
    equipment: string;
    type: 'preventive' | 'corrective' | 'predictive';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledDate: Date;
    estimatedDuration: string;
    assignedTo: string;
    status: 'pending' | 'in-progress' | 'completed';
}

export interface SparePart {
    id: string;
    name: string;
    quantity: number;
    reorderLevel: number;
    supplier: string;
    leadTime: string;
}

export interface FailureRecord {
    id: string;
    equipment: string;
    failureType: string;
    date: Date;
    resolution: string;
    downtime: string;
    cost: number;
}

// 지능형 알림 시스템
export interface SmartAlertSystem {
    alerts: SmartAlert[];
    alertRules: AlertRule[];
    escalationPolicy: EscalationPolicy;
    notificationChannels: NotificationChannel[];
}

export interface SmartAlert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'critical';
    source: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
    resolvedAt?: Date;
    aiRecommendation?: string;
    autoResolved?: boolean;
}

export interface AlertRule {
    id: string;
    name: string;
    condition: string;
    threshold: number;
    severity: 'info' | 'warning' | 'error' | 'critical';
    enabled: boolean;
    cooldown: number;
}

export interface EscalationPolicy {
    levels: EscalationLevel[];
    defaultTimeout: number;
}

export interface EscalationLevel {
    level: number;
    contacts: string[];
    timeout: number;
}

export interface NotificationChannel {
    id: string;
    type: 'email' | 'sms' | 'push' | 'slack' | 'webhook';
    enabled: boolean;
    config: Record<string, string>;
}

// 시뮬레이션 엔진
export interface SimulationEngine {
    scenarios: Scenario[];
    activeSimulation: Simulation | null;
    results: SimulationResult[];
}

export interface Scenario {
    id: string;
    name: string;
    description: string;
    type: 'growth' | 'disaster' | 'optimization' | 'expansion' | 'market';
    parameters: Record<string, unknown>;
}

export interface Simulation {
    id: string;
    scenario: string;
    status: 'running' | 'paused' | 'completed' | 'failed';
    progress: number;
    startTime: Date;
    estimatedCompletion: Date;
}

export interface SimulationResult {
    id: string;
    scenario: string;
    completedAt: Date;
    outcomes: Record<string, unknown>;
    recommendations: string[];
    confidence: number;
}

// 데이터 생성 함수들
export function generateDigitalTwinData(): DigitalTwin {
    return {
        id: 'twin-main',
        name: 'AgriNexus 메인 스마트팜',
        physicalLocation: {
            country: 'KR',
            city: '세종시',
            coordinates: { lat: 36.4800, lng: 127.2890 },
        },
        syncStatus: 'synced',
        lastSync: new Date(),
        accuracy: 99.7 + Math.random() * 0.3,
        systems: [
            { id: 'hvac-1', name: '공조 시스템', type: 'hvac', status: 'online', efficiency: 95.5, realTimeData: { temp: 22.5, humidity: 65 } },
            { id: 'led-1', name: 'LED 조명', type: 'lighting', status: 'online', efficiency: 98.2, realTimeData: { intensity: 850, spectrum: 6500 } },
            { id: 'irr-1', name: '관개 시스템', type: 'irrigation', status: 'online', efficiency: 97.8, realTimeData: { flow: 12.5, pressure: 2.1 } },
            { id: 'nut-1', name: '양액 시스템', type: 'nutrient', status: 'online', efficiency: 99.1, realTimeData: { ec: 1.8, ph: 6.2 } },
            { id: 'mon-1', name: '모니터링', type: 'monitoring', status: 'online', efficiency: 99.9, realTimeData: { sensors: 128, alerts: 0 } },
            { id: 'rob-1', name: '로봇 시스템', type: 'robot', status: 'online', efficiency: 96.5, realTimeData: { active: 45, tasks: 127 } },
        ],
        sensors: generateSensors(50),
        predictions: [
            { id: 'pred-1', type: 'yield', prediction: '다음 주 수확량 15% 증가 예상', probability: 92, timeframe: '7일', impact: 'high' },
            { id: 'pred-2', type: 'maintenance', prediction: 'HVAC 필터 교체 필요', probability: 87, timeframe: '14일', impact: 'medium' },
            { id: 'pred-3', type: 'energy', prediction: '태양광 발전 최적화 가능', probability: 78, timeframe: '3일', impact: 'low' },
        ],
        metrics: {
            totalPlants: 125000,
            activeZones: 24,
            energyUsage: 450,
            waterUsage: 2500,
            harvestReady: 8500,
            alertCount: 2,
        },
    };
}

function generateSensors(count: number): TwinSensor[] {
    const types: TwinSensor['type'][] = ['temperature', 'humidity', 'co2', 'light', 'ph', 'ec', 'moisture'];
    const units = { temperature: '°C', humidity: '%', co2: 'ppm', light: 'lux', ph: 'pH', ec: 'mS/cm', moisture: '%' };
    const ranges = { temperature: [18, 28], humidity: [50, 80], co2: [400, 1200], light: [500, 1500], ph: [5.5, 7.0], ec: [1.0, 2.5], moisture: [40, 70] };

    return Array.from({ length: count }, (_, i) => {
        const type = types[i % types.length];
        const range = ranges[type];
        return {
            id: `sensor-${i}`,
            type,
            location: { x: Math.random() * 20, y: Math.random() * 15, z: Math.random() * 5 },
            value: range[0] + Math.random() * (range[1] - range[0]),
            unit: units[type],
            status: Math.random() > 0.05 ? 'active' : 'warning',
            lastUpdate: new Date(),
        };
    });
}

export function generateEquipmentHealth(): EquipmentHealth[] {
    const equipment = [
        { name: 'LED 패널 A1-A10', type: 'lighting' },
        { name: 'HVAC 유닛 #1', type: 'hvac' },
        { name: '양액 펌프 P1', type: 'pump' },
        { name: '순환 팬 F1-F4', type: 'fan' },
        { name: '수확 로봇 R1', type: 'robot' },
        { name: 'CO2 발생기', type: 'generator' },
        { name: '가습기 H1-H2', type: 'humidifier' },
    ];

    return equipment.map((eq, i) => ({
        id: `eq-${i}`,
        name: eq.name,
        type: eq.type,
        healthScore: 80 + Math.random() * 20,
        remainingLife: `${Math.floor(Math.random() * 24) + 6}개월`,
        lastMaintenance: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        riskLevel: Math.random() > 0.8 ? 'medium' : 'low',
        anomalies: Math.random() > 0.9 ? ['진동 이상 감지'] : [],
    }));
}

export function generateSmartAlert(): SmartAlert {
    const alerts = [
        { type: 'info' as const, source: '센서', message: '온도 최적 범위 도달' },
        { type: 'warning' as const, source: 'HVAC', message: '필터 수명 30% 남음' },
        { type: 'info' as const, source: '로봇', message: '수확 작업 완료' },
        { type: 'warning' as const, source: '양액', message: 'EC 레벨 상한 접근' },
    ];

    const alert = alerts[Math.floor(Math.random() * alerts.length)];

    return {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: alert.type,
        source: alert.source,
        message: alert.message,
        timestamp: new Date(),
        acknowledged: false,
        aiRecommendation: '자동 조치 권장',
        autoResolved: Math.random() > 0.7,
    };
}
