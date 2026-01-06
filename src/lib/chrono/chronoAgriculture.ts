// AgriNexus World OS - 시간 농업 엔진
// Chrono-Agriculture Engine - 세계 최초 시간 조작 기반 성장 가속 시스템

// ============================================
// 타입 정의
// ============================================

export interface ChronoAgricultureSystem {
    id: string;
    farmId: string;
    timeZones: TimeZone[];
    chronoFields: ChronoField[];
    accelerators: GrowthAccelerator[];
    schedule: ChronoSchedule;
    effects: ChronoEffect[];
    metrics: ChronoMetrics;
    status: SystemStatus;
}

export interface TimeZone {
    id: string;
    name: string;
    koreanName: string;
    area: { x1: number; y1: number; x2: number; y2: number };
    timeMultiplier: number;             // 1.0 = 정상, 2.0 = 2배속
    temperature: number;
    humidity: number;
    lightPhase: LightPhase;
    crops: string[];
    active: boolean;
}

export type LightPhase =
    | 'dawn'        // 새벽 (4-6)
    | 'morning'     // 아침 (6-10)
    | 'noon'        // 정오 (10-14)
    | 'afternoon'   // 오후 (14-18)
    | 'dusk'        // 황혼 (18-20)
    | 'night'       // 밤 (20-4)
    | 'custom';     // 사용자 정의

export interface ChronoField {
    id: string;
    zoneId: string;
    type: FieldType;
    strength: number;                   // 0-100
    radius: number;                     // meters
    frequency: number;                  // Hz
    waveform: Waveform;
    biologicalEffect: string;
    sideEffects: string[];
    powerConsumption: number;           // kW
    status: 'active' | 'standby' | 'calibrating' | 'offline';
}

export type FieldType =
    | 'temporal_acceleration'   // 시간 가속
    | 'circadian_modulation'    // 일주기 조절
    | 'photosynthesis_boost'    // 광합성 부스트
    | 'metabolic_enhancement'   // 대사 증진
    | 'celluar_regeneration'    // 세포 재생
    | 'dormancy_override';      // 휴면 해제

export type Waveform = 'sine' | 'square' | 'triangle' | 'sawtooth' | 'custom';

export interface GrowthAccelerator {
    id: string;
    zoneId: string;
    targetCrop: string;
    status: AcceleratorStatus;
    originalGrowthDays: number;
    acceleratedGrowthDays: number;
    accelerationFactor: number;
    qualityRetention: number;           // % of original quality
    energyCost: number;                 // kWh per day saved
    startDate: Date;
    projectedHarvest: Date;
    actualProgress: number;             // %
    sideEffects: AcceleratorSideEffect[];
}

export type AcceleratorStatus = 'idle' | 'accelerating' | 'paused' | 'completed' | 'aborted';

export interface AcceleratorSideEffect {
    type: 'nutrient_depletion' | 'size_increase' | 'flavor_change' | 'color_variation' | 'stress_markers';
    severity: 'minimal' | 'moderate' | 'significant';
    mitigation: string;
}

export interface ChronoSchedule {
    zones: ZoneSchedule[];
    globalCycle: number;                // hours
    currentPhase: string;
    nextTransition: Date;
    automaticMode: boolean;
}

export interface ZoneSchedule {
    zoneId: string;
    phases: SchedulePhase[];
    currentPhaseIndex: number;
}

export interface SchedulePhase {
    lightPhase: LightPhase;
    duration: number;                   // minutes (in accelerated time)
    realDuration: number;               // minutes (real time)
    temperature: number;
    humidity: number;
    co2Level: number;
}

export interface ChronoEffect {
    id: string;
    zoneId: string;
    effectType: EffectType;
    magnitude: number;
    startTime: Date;
    duration: number;                   // hours
    reversible: boolean;
    observations: string[];
}

export type EffectType =
    | 'growth_rate_increase'
    | 'flowering_trigger'
    | 'fruiting_acceleration'
    | 'root_development'
    | 'nutrient_uptake'
    | 'stress_resistance'
    | 'quality_enhancement';

export interface ChronoMetrics {
    totalDaysSaved: number;
    averageAcceleration: number;
    energyEfficiency: number;
    qualityScore: number;
    yieldIncrease: number;              // %
    activeZones: number;
    totalHarvestsAccelerated: number;
    economicBenefit: number;            // KRW
}

export type SystemStatus = 'operational' | 'calibrating' | 'maintenance' | 'emergency_stop';

// ============================================
// 시간 농업 엔진
// ============================================

export class ChronoAgricultureEngine {
    private system: ChronoAgricultureSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): ChronoAgricultureSystem {
        const timeZones = this.createTimeZones();
        const chronoFields = this.createChronoFields(timeZones);
        const accelerators = this.createAccelerators(timeZones);

        return {
            id: `chrono-${Date.now()}`,
            farmId,
            timeZones,
            chronoFields,
            accelerators,
            schedule: this.createSchedule(timeZones),
            effects: [],
            metrics: {
                totalDaysSaved: 450,
                averageAcceleration: 2.3,
                energyEfficiency: 78,
                qualityScore: 92,
                yieldIncrease: 35,
                activeZones: timeZones.length,
                totalHarvestsAccelerated: 156,
                economicBenefit: 75000000
            },
            status: 'operational'
        };
    }

    private createTimeZones(): TimeZone[] {
        return [
            {
                id: 'zone-a',
                name: 'Rapid Growth Zone',
                koreanName: '급속 성장 구역',
                area: { x1: 0, y1: 0, x2: 10, y2: 10 },
                timeMultiplier: 2.5,
                temperature: 24,
                humidity: 75,
                lightPhase: 'noon',
                crops: ['딸기', '토마토'],
                active: true
            },
            {
                id: 'zone-b',
                name: 'Standard Zone',
                koreanName: '표준 구역',
                area: { x1: 10, y1: 0, x2: 20, y2: 10 },
                timeMultiplier: 1.0,
                temperature: 22,
                humidity: 65,
                lightPhase: 'morning',
                crops: ['상추', '바질'],
                active: true
            },
            {
                id: 'zone-c',
                name: 'Ultra-Accelerated Zone',
                koreanName: '초가속 구역',
                area: { x1: 0, y1: 10, x2: 10, y2: 20 },
                timeMultiplier: 4.0,
                temperature: 26,
                humidity: 80,
                lightPhase: 'custom',
                crops: ['마이크로그린'],
                active: true
            },
            {
                id: 'zone-d',
                name: 'Rest & Recovery Zone',
                koreanName: '휴식 회복 구역',
                area: { x1: 10, y1: 10, x2: 20, y2: 20 },
                timeMultiplier: 0.5,
                temperature: 18,
                humidity: 60,
                lightPhase: 'night',
                crops: ['수확 직전'],
                active: true
            }
        ];
    }

    private createChronoFields(zones: TimeZone[]): ChronoField[] {
        const fieldTypes: FieldType[] = [
            'temporal_acceleration',
            'circadian_modulation',
            'photosynthesis_boost',
            'metabolic_enhancement'
        ];

        return zones.map((zone, i) => ({
            id: `field-${i}`,
            zoneId: zone.id,
            type: fieldTypes[i % fieldTypes.length],
            strength: 50 + Math.random() * 50,
            radius: 5 + Math.random() * 5,
            frequency: 7.83 + Math.random() * 2,   // 슈만 공명 근처
            waveform: 'sine',
            biologicalEffect: this.getFieldEffect(fieldTypes[i % fieldTypes.length]),
            sideEffects: ['미세 스트레스 반응'],
            powerConsumption: 1 + Math.random() * 2,
            status: 'active'
        }));
    }

    private getFieldEffect(type: FieldType): string {
        const effects: Record<FieldType, string> = {
            temporal_acceleration: '세포 분열 속도 증가',
            circadian_modulation: '일주기 유전자 발현 조절',
            photosynthesis_boost: '명반응 효율 향상',
            metabolic_enhancement: '탄수화물 합성 촉진',
            celluar_regeneration: '손상 세포 복구 촉진',
            dormancy_override: '휴면 억제 신호 발생'
        };
        return effects[type];
    }

    private createAccelerators(zones: TimeZone[]): GrowthAccelerator[] {
        return zones.flatMap(zone =>
            zone.crops.map((crop, i) => {
                const originalDays = this.getOriginalGrowthDays(crop);
                const accelerationFactor = zone.timeMultiplier;
                const acceleratedDays = originalDays / accelerationFactor;

                return {
                    id: `acc-${zone.id}-${i}`,
                    zoneId: zone.id,
                    targetCrop: crop,
                    status: 'accelerating' as AcceleratorStatus,
                    originalGrowthDays: originalDays,
                    acceleratedGrowthDays: acceleratedDays,
                    accelerationFactor,
                    qualityRetention: 95 - (accelerationFactor - 1) * 5,
                    energyCost: (accelerationFactor - 1) * 10,
                    startDate: new Date(Date.now() - Math.random() * 10 * 86400000),
                    projectedHarvest: new Date(Date.now() + Math.random() * 15 * 86400000),
                    actualProgress: 30 + Math.random() * 60,
                    sideEffects: this.generateSideEffects(accelerationFactor)
                };
            })
        );
    }

    private getOriginalGrowthDays(crop: string): number {
        const days: Record<string, number> = {
            '딸기': 90,
            '토마토': 70,
            '상추': 35,
            '바질': 30,
            '마이크로그린': 10,
            '수확 직전': 5
        };
        return days[crop] || 45;
    }

    private generateSideEffects(factor: number): AcceleratorSideEffect[] {
        const effects: AcceleratorSideEffect[] = [];

        if (factor >= 2) {
            effects.push({
                type: 'nutrient_depletion',
                severity: factor >= 3 ? 'moderate' : 'minimal',
                mitigation: '영양액 농도 15% 증가'
            });
        }

        if (factor >= 3) {
            effects.push({
                type: 'size_increase',
                severity: 'moderate',
                mitigation: '정상 현상, 추가 조치 불필요'
            });
        }

        return effects;
    }

    private createSchedule(zones: TimeZone[]): ChronoSchedule {
        return {
            zones: zones.map(zone => ({
                zoneId: zone.id,
                phases: [
                    { lightPhase: 'dawn', duration: 60, realDuration: 60 / zone.timeMultiplier, temperature: 18, humidity: 80, co2Level: 400 },
                    { lightPhase: 'morning', duration: 180, realDuration: 180 / zone.timeMultiplier, temperature: 22, humidity: 70, co2Level: 800 },
                    { lightPhase: 'noon', duration: 240, realDuration: 240 / zone.timeMultiplier, temperature: 26, humidity: 65, co2Level: 1000 },
                    { lightPhase: 'afternoon', duration: 180, realDuration: 180 / zone.timeMultiplier, temperature: 24, humidity: 68, co2Level: 900 },
                    { lightPhase: 'dusk', duration: 60, realDuration: 60 / zone.timeMultiplier, temperature: 20, humidity: 75, co2Level: 600 },
                    { lightPhase: 'night', duration: 360, realDuration: 360 / zone.timeMultiplier, temperature: 16, humidity: 85, co2Level: 400 }
                ],
                currentPhaseIndex: Math.floor(Math.random() * 6)
            })),
            globalCycle: 24,
            currentPhase: 'noon',
            nextTransition: new Date(Date.now() + 2 * 3600000),
            automaticMode: true
        };
    }

    // 시간 가속 설정
    setTimeMultiplier(zoneId: string, multiplier: number): TimeZone | null {
        const zone = this.system.timeZones.find(z => z.id === zoneId);
        if (!zone) return null;

        zone.timeMultiplier = Math.max(0.1, Math.min(10, multiplier));

        // 관련 가속기 업데이트
        this.system.accelerators
            .filter(a => a.zoneId === zoneId)
            .forEach(a => {
                a.accelerationFactor = zone.timeMultiplier;
                a.acceleratedGrowthDays = a.originalGrowthDays / zone.timeMultiplier;
                a.qualityRetention = 95 - (zone.timeMultiplier - 1) * 5;
            });

        return zone;
    }

    // 효과 추가
    addEffect(zoneId: string, effectType: EffectType, magnitude: number, duration: number): ChronoEffect {
        const effect: ChronoEffect = {
            id: `effect-${Date.now()}`,
            zoneId,
            effectType,
            magnitude,
            startTime: new Date(),
            duration,
            reversible: magnitude <= 50,
            observations: []
        };

        this.system.effects.push(effect);
        return effect;
    }

    // 시스템 상태 조회
    getSystem(): ChronoAgricultureSystem {
        return this.system;
    }

    // 구역 조회
    getZone(zoneId: string): TimeZone | undefined {
        return this.system.timeZones.find(z => z.id === zoneId);
    }

    // 가속기 조회
    getAccelerator(acceleratorId: string): GrowthAccelerator | undefined {
        return this.system.accelerators.find(a => a.id === acceleratorId);
    }

    // 메트릭스 조회
    getMetrics(): ChronoMetrics {
        return this.system.metrics;
    }
}

// 싱글톤
const chronoEngines: Map<string, ChronoAgricultureEngine> = new Map();

export function getChronoAgricultureEngine(farmId: string): ChronoAgricultureEngine {
    if (!chronoEngines.has(farmId)) {
        chronoEngines.set(farmId, new ChronoAgricultureEngine(farmId));
    }
    return chronoEngines.get(farmId)!;
}

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
    temporal_acceleration: '⏩',
    circadian_modulation: '🌙',
    photosynthesis_boost: '☀️',
    metabolic_enhancement: '💪',
    celluar_regeneration: '🔄',
    dormancy_override: '⏰'
};

export const LIGHT_PHASE_ICONS: Record<LightPhase, string> = {
    dawn: '🌅',
    morning: '🌄',
    noon: '☀️',
    afternoon: '🌤️',
    dusk: '🌇',
    night: '🌙',
    custom: '⚙️'
};
