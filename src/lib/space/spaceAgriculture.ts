// AgriNexus World OS - 우주 농업 시뮬레이션 시스템
// Space Agriculture Module - 화성/달/우주정거장 농업 시뮬레이션

// ============================================
// 타입 정의
// ============================================

export interface SpaceEnvironment {
    location: SpaceLocation;
    gravity: GravityCondition;
    radiation: RadiationLevel;
    atmosphere: AtmosphereConfig;
    lighting: SpaceLighting;
    temperature: TemperatureProfile;
    resourceConstraints: ResourceConstraints;
}

export type SpaceLocation =
    | 'iss'                 // 국제우주정거장
    | 'lunar_base'          // 달 기지
    | 'mars_colony'         // 화성 식민지
    | 'deep_space'          // 심우주
    | 'orbital_farm'        // 궤도 농장
    | 'asteroid_station'    // 소행성 스테이션
    | 'europa_base';        // 유로파 기지

export interface GravityCondition {
    type: 'microgravity' | 'partial' | 'artificial' | 'lunar' | 'martian';
    value: number;              // g (지구 = 1)
    variation: number;          // % 변동
    adaptationRequired: boolean;
}

export interface RadiationLevel {
    cosmic: number;             // mSv/day
    solar: number;
    shielding: number;          // % 차폐
    dnaRisk: number;            // 0-100
    plantMutationRate: number;  // mutations/generation
}

export interface AtmosphereConfig {
    pressure: number;           // kPa
    composition: {
        co2: number;            // %
        o2: number;
        n2: number;
        h2o: number;
    };
    sealed: boolean;
    recyclingEfficiency: number;
}

export interface SpaceLighting {
    source: 'natural' | 'artificial' | 'hybrid';
    intensity: number;          // μmol/m²/s
    photoperiod: number;        // hours
    spectrum: LightSpectrum;
    solarAngle: number;
}

export interface LightSpectrum {
    red: number;                // 630-700nm, %
    blue: number;               // 400-500nm
    green: number;
    farRed: number;
    uv: number;
}

export interface TemperatureProfile {
    day: number;                // °C
    night: number;
    variation: number;          // max daily swing
    heatingSource: 'solar' | 'nuclear' | 'electric';
    coolingMethod: 'radiative' | 'evaporative' | 'active';
}

export interface ResourceConstraints {
    water: ResourceLimit;
    energy: ResourceLimit;
    nutrients: ResourceLimit;
    atmosphere: ResourceLimit;
    waste: WasteManagement;
}

export interface ResourceLimit {
    available: number;
    consumption: number;
    recycleRate: number;
    critical: boolean;
    daysRemaining: number;
}

export interface WasteManagement {
    organicRecycling: number;   // %
    waterReclamation: number;
    co2Capture: number;
    bioconversion: number;
}

// ============================================
// 우주 작물
// ============================================

export interface SpaceCrop {
    id: string;
    name: string;
    koreanName: string;
    spaceAdaptability: number;  // 0-100
    requirements: SpaceCropRequirements;
    growthModifiers: SpaceGrowthModifiers;
    psychologicalValue: number; // 승무원 정신건강 기여도
    calorieDensity: number;     // kcal/kg
    growthCycle: number;        // days
    radiation: RadiationTolerance;
    microgravityAdaptation: MicrogravityAdaptation;
}

export interface SpaceCropRequirements {
    minGravity: number;
    maxRadiation: number;
    waterPerDay: number;        // L/m²
    energyPerDay: number;       // kWh/m²
    co2Consumption: number;     // L/day/plant
    o2Production: number;       // L/day/plant
}

export interface SpaceGrowthModifiers {
    gravityEffect: number;      // -1 to 1 (negative = slower)
    radiationEffect: number;
    lightEfficiency: number;
    cycleModifier: number;
}

export interface RadiationTolerance {
    threshold: number;          // mSv/day
    shieldingRequired: boolean;
    mutationResistance: number;
    repairMechanism: 'standard' | 'enhanced' | 'engineered';
}

export interface MicrogravityAdaptation {
    rootGuidance: 'required' | 'recommended' | 'optional';
    waterDelivery: 'capillary' | 'injection' | 'aeroponic';
    structuralSupport: 'none' | 'mesh' | 'scaffold';
    harvestMethod: 'manual' | 'robotic' | 'continuous';
}

// ============================================
// 미션 시뮬레이션
// ============================================

export interface SpaceMission {
    id: string;
    name: string;
    destination: SpaceLocation;
    duration: number;           // days
    crewSize: number;
    farmArea: number;           // m²
    crops: SpaceCropPlan[];
    environment: SpaceEnvironment;
    dailyCalorieNeed: number;
    calorieSelfSufficiency: number; // %
    timeline: MissionTimeline;
    risks: SpaceRisk[];
    status: MissionStatus;
}

export interface SpaceCropPlan {
    cropId: string;
    area: number;               // m²
    expectedYield: number;      // kg/cycle
    plantingSchedule: Date[];
    harvestSchedule: Date[];
    calorieContribution: number;
}

export interface MissionTimeline {
    phases: MissionPhase[];
    currentPhase: string;
    progress: number;           // 0-100
    events: TimelineEvent[];
}

export interface MissionPhase {
    id: string;
    name: string;
    startDay: number;
    endDay: number;
    objectives: string[];
    status: 'upcoming' | 'active' | 'completed' | 'failed';
}

export interface TimelineEvent {
    day: number;
    type: 'harvest' | 'planting' | 'emergency' | 'milestone' | 'radiation' | 'maintenance';
    title: string;
    description: string;
    impact: 'positive' | 'neutral' | 'negative';
}

export interface SpaceRisk {
    type: 'radiation' | 'equipment' | 'contamination' | 'resource' | 'mutation' | 'crew';
    probability: number;        // 0-1
    severity: number;           // 1-10
    mitigation: string;
    status: 'monitored' | 'triggered' | 'resolved';
}

export type MissionStatus = 'planning' | 'launching' | 'transit' | 'active' | 'returning' | 'completed';

// ============================================
// 우주 농업 시뮬레이션 엔진
// ============================================

export class SpaceAgricultureEngine {
    private environments: Map<SpaceLocation, SpaceEnvironment> = new Map();
    private crops: Map<string, SpaceCrop> = new Map();
    private activeMissions: Map<string, SpaceMission> = new Map();

    constructor() {
        this.initializeEnvironments();
        this.initializeSpaceCrops();
    }

    private initializeEnvironments(): void {
        // ISS 환경
        this.environments.set('iss', {
            location: 'iss',
            gravity: { type: 'microgravity', value: 0.0001, variation: 5, adaptationRequired: true },
            radiation: { cosmic: 0.5, solar: 0.3, shielding: 60, dnaRisk: 25, plantMutationRate: 0.01 },
            atmosphere: { pressure: 101.3, composition: { co2: 0.5, o2: 21, n2: 78, h2o: 0.5 }, sealed: true, recyclingEfficiency: 95 },
            lighting: { source: 'hybrid', intensity: 500, photoperiod: 16, spectrum: { red: 40, blue: 30, green: 20, farRed: 5, uv: 5 }, solarAngle: 0 },
            temperature: { day: 24, night: 20, variation: 3, heatingSource: 'solar', coolingMethod: 'active' },
            resourceConstraints: {
                water: { available: 2000, consumption: 50, recycleRate: 98, critical: false, daysRemaining: 40 },
                energy: { available: 100, consumption: 20, recycleRate: 0, critical: false, daysRemaining: 999 },
                nutrients: { available: 500, consumption: 2, recycleRate: 80, critical: false, daysRemaining: 250 },
                atmosphere: { available: 1000, consumption: 100, recycleRate: 99, critical: false, daysRemaining: 999 },
                waste: { organicRecycling: 95, waterReclamation: 98, co2Capture: 85, bioconversion: 70 }
            }
        });

        // 화성 기지 환경
        this.environments.set('mars_colony', {
            location: 'mars_colony',
            gravity: { type: 'martian', value: 0.38, variation: 0, adaptationRequired: true },
            radiation: { cosmic: 0.7, solar: 0.5, shielding: 80, dnaRisk: 35, plantMutationRate: 0.02 },
            atmosphere: { pressure: 90, composition: { co2: 0.4, o2: 21, n2: 78, h2o: 0.6 }, sealed: true, recyclingEfficiency: 90 },
            lighting: { source: 'artificial', intensity: 600, photoperiod: 16, spectrum: { red: 45, blue: 30, green: 15, farRed: 8, uv: 2 }, solarAngle: 25 },
            temperature: { day: 22, night: 18, variation: 2, heatingSource: 'nuclear', coolingMethod: 'radiative' },
            resourceConstraints: {
                water: { available: 5000, consumption: 80, recycleRate: 95, critical: false, daysRemaining: 62 },
                energy: { available: 500, consumption: 100, recycleRate: 0, critical: false, daysRemaining: 999 },
                nutrients: { available: 1000, consumption: 5, recycleRate: 70, critical: false, daysRemaining: 200 },
                atmosphere: { available: 2000, consumption: 150, recycleRate: 97, critical: false, daysRemaining: 999 },
                waste: { organicRecycling: 90, waterReclamation: 95, co2Capture: 92, bioconversion: 75 }
            }
        });

        // 달 기지 환경
        this.environments.set('lunar_base', {
            location: 'lunar_base',
            gravity: { type: 'lunar', value: 0.166, variation: 0, adaptationRequired: true },
            radiation: { cosmic: 1.0, solar: 0.8, shielding: 90, dnaRisk: 40, plantMutationRate: 0.015 },
            atmosphere: { pressure: 101.3, composition: { co2: 0.35, o2: 21, n2: 78.5, h2o: 0.15 }, sealed: true, recyclingEfficiency: 92 },
            lighting: { source: 'artificial', intensity: 550, photoperiod: 16, spectrum: { red: 42, blue: 32, green: 18, farRed: 6, uv: 2 }, solarAngle: 0 },
            temperature: { day: 23, night: 19, variation: 2, heatingSource: 'solar', coolingMethod: 'radiative' },
            resourceConstraints: {
                water: { available: 3000, consumption: 60, recycleRate: 96, critical: false, daysRemaining: 50 },
                energy: { available: 300, consumption: 80, recycleRate: 0, critical: false, daysRemaining: 999 },
                nutrients: { available: 800, consumption: 4, recycleRate: 75, critical: false, daysRemaining: 200 },
                atmosphere: { available: 1500, consumption: 120, recycleRate: 98, critical: false, daysRemaining: 999 },
                waste: { organicRecycling: 88, waterReclamation: 96, co2Capture: 90, bioconversion: 72 }
            }
        });
    }

    private initializeSpaceCrops(): void {
        const spaceCrops: SpaceCrop[] = [
            {
                id: 'space-lettuce',
                name: 'Space Romaine Lettuce',
                koreanName: '우주 로메인 상추',
                spaceAdaptability: 95,
                requirements: { minGravity: 0, maxRadiation: 1.5, waterPerDay: 0.5, energyPerDay: 0.3, co2Consumption: 2, o2Production: 3 },
                growthModifiers: { gravityEffect: 0.1, radiationEffect: -0.05, lightEfficiency: 1.2, cycleModifier: 0.9 },
                psychologicalValue: 80,
                calorieDensity: 150,
                growthCycle: 28,
                radiation: { threshold: 2.0, shieldingRequired: false, mutationResistance: 0.8, repairMechanism: 'enhanced' },
                microgravityAdaptation: { rootGuidance: 'optional', waterDelivery: 'capillary', structuralSupport: 'mesh', harvestMethod: 'manual' }
            },
            {
                id: 'space-tomato',
                name: 'Dwarf Space Tomato',
                koreanName: '왜성 우주 토마토',
                spaceAdaptability: 85,
                requirements: { minGravity: 0.1, maxRadiation: 1.0, waterPerDay: 0.8, energyPerDay: 0.5, co2Consumption: 4, o2Production: 5 },
                growthModifiers: { gravityEffect: -0.2, radiationEffect: -0.1, lightEfficiency: 1.0, cycleModifier: 1.2 },
                psychologicalValue: 90,
                calorieDensity: 200,
                growthCycle: 65,
                radiation: { threshold: 1.5, shieldingRequired: true, mutationResistance: 0.6, repairMechanism: 'standard' },
                microgravityAdaptation: { rootGuidance: 'required', waterDelivery: 'injection', structuralSupport: 'scaffold', harvestMethod: 'robotic' }
            },
            {
                id: 'space-wheat',
                name: 'Compact Space Wheat',
                koreanName: '소형 우주 밀',
                spaceAdaptability: 75,
                requirements: { minGravity: 0.2, maxRadiation: 0.8, waterPerDay: 0.4, energyPerDay: 0.4, co2Consumption: 3, o2Production: 4 },
                growthModifiers: { gravityEffect: -0.15, radiationEffect: -0.2, lightEfficiency: 0.9, cycleModifier: 1.4 },
                psychologicalValue: 60,
                calorieDensity: 3390,
                growthCycle: 90,
                radiation: { threshold: 1.0, shieldingRequired: true, mutationResistance: 0.5, repairMechanism: 'standard' },
                microgravityAdaptation: { rootGuidance: 'required', waterDelivery: 'injection', structuralSupport: 'scaffold', harvestMethod: 'robotic' }
            },
            {
                id: 'space-strawberry',
                name: 'Zero-G Strawberry',
                koreanName: '무중력 딸기',
                spaceAdaptability: 70,
                requirements: { minGravity: 0.15, maxRadiation: 0.7, waterPerDay: 0.6, energyPerDay: 0.4, co2Consumption: 2.5, o2Production: 3.5 },
                growthModifiers: { gravityEffect: -0.25, radiationEffect: -0.15, lightEfficiency: 1.1, cycleModifier: 1.3 },
                psychologicalValue: 95,
                calorieDensity: 320,
                growthCycle: 45,
                radiation: { threshold: 1.0, shieldingRequired: true, mutationResistance: 0.55, repairMechanism: 'enhanced' },
                microgravityAdaptation: { rootGuidance: 'required', waterDelivery: 'aeroponic', structuralSupport: 'scaffold', harvestMethod: 'manual' }
            },
            {
                id: 'space-spirulina',
                name: 'Space Spirulina',
                koreanName: '우주 스피루리나',
                spaceAdaptability: 98,
                requirements: { minGravity: 0, maxRadiation: 3.0, waterPerDay: 0.2, energyPerDay: 0.15, co2Consumption: 5, o2Production: 8 },
                growthModifiers: { gravityEffect: 0.3, radiationEffect: 0.1, lightEfficiency: 1.5, cycleModifier: 0.7 },
                psychologicalValue: 40,
                calorieDensity: 2600,
                growthCycle: 14,
                radiation: { threshold: 5.0, shieldingRequired: false, mutationResistance: 0.95, repairMechanism: 'engineered' },
                microgravityAdaptation: { rootGuidance: 'optional', waterDelivery: 'capillary', structuralSupport: 'none', harvestMethod: 'continuous' }
            },
            {
                id: 'space-potato',
                name: 'Martian Potato',
                koreanName: '화성 감자',
                spaceAdaptability: 80,
                requirements: { minGravity: 0.3, maxRadiation: 0.6, waterPerDay: 0.5, energyPerDay: 0.35, co2Consumption: 3.5, o2Production: 4.5 },
                growthModifiers: { gravityEffect: -0.1, radiationEffect: -0.25, lightEfficiency: 0.95, cycleModifier: 1.1 },
                psychologicalValue: 75,
                calorieDensity: 770,
                growthCycle: 80,
                radiation: { threshold: 0.8, shieldingRequired: true, mutationResistance: 0.6, repairMechanism: 'standard' },
                microgravityAdaptation: { rootGuidance: 'required', waterDelivery: 'injection', structuralSupport: 'scaffold', harvestMethod: 'robotic' }
            }
        ];

        for (const crop of spaceCrops) {
            this.crops.set(crop.id, crop);
        }
    }

    // 미션 생성
    createMission(config: {
        name: string;
        destination: SpaceLocation;
        duration: number;
        crewSize: number;
        farmArea: number;
        selectedCrops: string[];
    }): SpaceMission {
        const environment = this.environments.get(config.destination);
        if (!environment) {
            throw new Error(`Unknown destination: ${config.destination}`);
        }

        const dailyCalorieNeed = config.crewSize * 2500;
        const crops: SpaceCropPlan[] = config.selectedCrops.map(cropId => {
            const crop = this.crops.get(cropId);
            if (!crop) return null;

            const areaPerCrop = config.farmArea / config.selectedCrops.length;
            const cyclesInMission = Math.floor(config.duration / crop.growthCycle);
            const yieldPerCycle = areaPerCrop * 3; // 3kg/m² 평균

            return {
                cropId,
                area: areaPerCrop,
                expectedYield: yieldPerCycle * cyclesInMission,
                plantingSchedule: this.generateSchedule(config.duration, crop.growthCycle, 'planting'),
                harvestSchedule: this.generateSchedule(config.duration, crop.growthCycle, 'harvest'),
                calorieContribution: (yieldPerCycle * crop.calorieDensity * cyclesInMission) / config.duration
            } as SpaceCropPlan;
        }).filter(Boolean) as SpaceCropPlan[];

        const totalDailyCalories = crops.reduce((sum, c) => sum + c.calorieContribution, 0);
        const calorieSelfSufficiency = (totalDailyCalories / dailyCalorieNeed) * 100;

        const mission: SpaceMission = {
            id: `mission-${Date.now()}`,
            name: config.name,
            destination: config.destination,
            duration: config.duration,
            crewSize: config.crewSize,
            farmArea: config.farmArea,
            crops,
            environment,
            dailyCalorieNeed,
            calorieSelfSufficiency: Math.min(100, calorieSelfSufficiency),
            timeline: this.generateTimeline(config.duration, crops),
            risks: this.assessRisks(config.destination, config.duration),
            status: 'planning'
        };

        this.activeMissions.set(mission.id, mission);
        return mission;
    }

    private generateSchedule(duration: number, cycle: number, type: 'planting' | 'harvest'): Date[] {
        const dates: Date[] = [];
        const now = new Date();
        const offset = type === 'harvest' ? cycle : 0;

        for (let day = offset; day < duration; day += cycle) {
            dates.push(new Date(now.getTime() + day * 86400000));
        }

        return dates;
    }

    private generateTimeline(duration: number, crops: SpaceCropPlan[]): MissionTimeline {
        const phases: MissionPhase[] = [
            { id: 'setup', name: '시설 설정', startDay: 1, endDay: 7, objectives: ['환경 안정화', '장비 점검', '초기 파종'], status: 'upcoming' },
            { id: 'growth1', name: '1차 재배기', startDay: 8, endDay: Math.floor(duration * 0.3), objectives: ['작물 생육 모니터링', '환경 최적화'], status: 'upcoming' },
            { id: 'harvest1', name: '1차 수확기', startDay: Math.floor(duration * 0.3) + 1, endDay: Math.floor(duration * 0.5), objectives: ['수확 및 데이터 수집', '2차 파종'], status: 'upcoming' },
            { id: 'optimization', name: '최적화기', startDay: Math.floor(duration * 0.5) + 1, endDay: Math.floor(duration * 0.8), objectives: ['생산성 극대화', '자급자족 달성'], status: 'upcoming' },
            { id: 'finale', name: '마무리기', startDay: Math.floor(duration * 0.8) + 1, endDay: duration, objectives: ['최종 수확', '데이터 정리', '시스템 백업'], status: 'upcoming' }
        ];

        return {
            phases,
            currentPhase: 'setup',
            progress: 0,
            events: []
        };
    }

    private assessRisks(destination: SpaceLocation, duration: number): SpaceRisk[] {
        const risks: SpaceRisk[] = [
            { type: 'radiation', probability: 0.15, severity: 7, mitigation: '방사선 차폐 강화 및 내성 품종 사용', status: 'monitored' },
            { type: 'equipment', probability: 0.2, severity: 6, mitigation: '예비 부품 확보 및 정기 점검', status: 'monitored' },
            { type: 'resource', probability: 0.1, severity: 8, mitigation: '재활용 효율 극대화 및 비상 비축', status: 'monitored' },
            { type: 'mutation', probability: 0.05, severity: 4, mitigation: '유전자 모니터링 및 격리 프로토콜', status: 'monitored' },
            { type: 'crew', probability: 0.1, severity: 5, mitigation: '심리 지원 프로그램 및 자동화 강화', status: 'monitored' }
        ];

        // 목적지에 따른 위험도 조정
        if (destination === 'mars_colony') {
            risks.find(r => r.type === 'radiation')!.probability *= 1.5;
            risks.find(r => r.type === 'resource')!.probability *= 1.3;
        } else if (destination === 'deep_space') {
            risks.find(r => r.type === 'radiation')!.probability *= 2;
            risks.find(r => r.type === 'equipment')!.probability *= 1.5;
        }

        // 기간에 따른 위험도 조정
        const durationMultiplier = 1 + (duration / 365) * 0.3;
        for (const risk of risks) {
            risk.probability = Math.min(0.9, risk.probability * durationMultiplier);
        }

        return risks;
    }

    // 환경 조회
    getEnvironment(location: SpaceLocation): SpaceEnvironment | undefined {
        return this.environments.get(location);
    }

    // 작물 조회
    getAllSpaceCrops(): SpaceCrop[] {
        return Array.from(this.crops.values());
    }

    // 미션 조회
    getMission(missionId: string): SpaceMission | undefined {
        return this.activeMissions.get(missionId);
    }

    // 적합성 분석
    analyzeCropCompatibility(cropId: string, location: SpaceLocation): {
        compatible: boolean;
        score: number;
        issues: string[];
        recommendations: string[];
    } {
        const crop = this.crops.get(cropId);
        const env = this.environments.get(location);

        if (!crop || !env) {
            return { compatible: false, score: 0, issues: ['작물 또는 환경 정보 없음'], recommendations: [] };
        }

        const issues: string[] = [];
        const recommendations: string[] = [];
        let score = crop.spaceAdaptability;

        // 중력 체크
        if (env.gravity.value < crop.requirements.minGravity) {
            issues.push(`중력 부족: ${env.gravity.value}g < ${crop.requirements.minGravity}g`);
            score -= 20;
            recommendations.push('회전 원심력을 이용한 인공 중력 구역 권장');
        }

        // 방사선 체크
        if ((env.radiation.cosmic + env.radiation.solar) > crop.requirements.maxRadiation) {
            issues.push(`방사선 초과: ${(env.radiation.cosmic + env.radiation.solar).toFixed(1)}mSv > ${crop.requirements.maxRadiation}mSv`);
            score -= 15;
            recommendations.push('추가 차폐막 설치 또는 지하 재배 구역 활용');
        }

        // 자원 체크
        if (env.resourceConstraints.water.daysRemaining < 30) {
            issues.push('물 자원 부족 위험');
            score -= 10;
            recommendations.push('물 소비량이 적은 작물로 대체 고려');
        }

        return {
            compatible: issues.length === 0,
            score: Math.max(0, score),
            issues,
            recommendations: recommendations.length > 0 ? recommendations : ['현재 조건에서 재배 가능']
        };
    }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let spaceAgricultureEngine: SpaceAgricultureEngine | null = null;

export function getSpaceAgricultureEngine(): SpaceAgricultureEngine {
    if (!spaceAgricultureEngine) {
        spaceAgricultureEngine = new SpaceAgricultureEngine();
    }
    return spaceAgricultureEngine;
}

// 위치 아이콘
export const SPACE_LOCATION_ICONS: Record<SpaceLocation, string> = {
    iss: '🛸',
    lunar_base: '🌙',
    mars_colony: '🔴',
    deep_space: '🌌',
    orbital_farm: '🛰️',
    asteroid_station: '☄️',
    europa_base: '🧊'
};

// 위치 한글명
export const SPACE_LOCATION_NAMES: Record<SpaceLocation, string> = {
    iss: '국제우주정거장',
    lunar_base: '달 기지',
    mars_colony: '화성 식민지',
    deep_space: '심우주 탐사선',
    orbital_farm: '궤도 농장',
    asteroid_station: '소행성 스테이션',
    europa_base: '유로파 기지'
};
