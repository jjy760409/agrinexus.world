// AgriNexus World OS - 생체광자 에너지 수확기
// Biophoton Energy Harvester - 세계 최초 식물 발광 에너지 수집 시스템

// ============================================
// 타입 정의
// ============================================

export interface BiophotonHarvester {
    id: string;
    farmId: string;
    collectors: PhotonCollector[];
    energyStorage: EnergyStorage;
    production: EnergyProduction;
    applications: EnergyApplication[];
    efficiency: HarvesterEfficiency;
    status: HarvesterStatus;
}

export interface PhotonCollector {
    id: string;
    zone: string;
    position: { x: number; y: number; z: number };
    type: CollectorType;
    sensitivity: number;                // photons/cm²/s
    spectralRange: { min: number; max: number }; // nm
    activeArea: number;                 // cm²
    temperature: number;
    efficiency: number;                 // %
    currentOutput: number;              // μW
    status: 'active' | 'calibrating' | 'maintenance' | 'offline';
}

export type CollectorType =
    | 'ultraweak_photon'    // 초미약 광자 (380-780nm)
    | 'delayed_luminescence' // 지연 발광
    | 'bioluminescence'      // 생물 발광
    | 'chlorophyll_fluorescence' // 엽록소 형광
    | 'stress_emission';     // 스트레스 방출

export interface EnergyStorage {
    capacity: number;                   // mWh
    currentCharge: number;              // mWh
    chargeRate: number;                 // μW
    dischargeRate: number;              // μW
    cycles: number;
    health: number;                     // %
    technology: 'quantum_battery' | 'bio_capacitor' | 'organic_solar';
}

export interface EnergyProduction {
    hourly: number[];                   // 24 hours, μWh
    daily: number;                      // μWh
    weekly: number;                     // mWh
    monthly: number;                    // mWh
    peakHour: number;
    peakOutput: number;                 // μW
    efficiency: number;                 // %
    carbonOffset: number;               // g CO2
}

export interface EnergyApplication {
    id: string;
    name: string;
    koreanName: string;
    powerRequirement: number;           // μW
    priority: number;                   // 1-10
    status: 'active' | 'standby' | 'disabled';
    uptime: number;                     // hours
    description: string;
}

export interface HarvesterEfficiency {
    collectionEfficiency: number;       // %
    conversionEfficiency: number;       // %
    storageEfficiency: number;          // %
    overallEfficiency: number;          // %
    theoreticalMax: number;             // %
    improvementPotential: number;       // %
}

export type HarvesterStatus = 'operational' | 'charging' | 'discharging' | 'maintenance' | 'offline';

// ============================================
// 생체광자 분석
// ============================================

export interface BiophotonAnalysis {
    timestamp: Date;
    zone: string;
    emissionRate: number;               // photons/cm²/s
    spectralDistribution: SpectralData[];
    coherenceLevel: number;             // 0-1
    patternType: EmissionPattern;
    healthIndicator: number;            // 0-100
    stressLevel: number;                // 0-100
    growthPhase: GrowthPhase;
    anomalies: Anomaly[];
}

export interface SpectralData {
    wavelength: number;                 // nm
    intensity: number;                  // relative units
    source: PhotonSource;
}

export type PhotonSource =
    | 'chlorophyll_a'       // 685nm peak
    | 'chlorophyll_b'       // 650nm peak
    | 'carotenoid'          // 450-530nm
    | 'flavonoid'           // 500-600nm
    | 'anthocyanin'         // 520-620nm
    | 'reactive_oxygen'     // 340-560nm
    | 'unknown';

export type EmissionPattern =
    | 'normal_photosynthetic'
    | 'stress_response'
    | 'circadian_rhythm'
    | 'growth_burst'
    | 'defense_activation'
    | 'senescence';

export type GrowthPhase =
    | 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'dormant';

export interface Anomaly {
    type: 'spike' | 'drop' | 'oscillation' | 'shift';
    wavelength?: number;
    magnitude: number;
    possibleCause: string;
    recommendation: string;
}

// ============================================
// 생체광자 에너지 엔진
// ============================================

export class BiophotonEnergyEngine {
    private harvester: BiophotonHarvester;
    private analyses: Map<string, BiophotonAnalysis[]> = new Map();

    constructor(farmId: string) {
        this.harvester = this.initializeHarvester(farmId);
    }

    private initializeHarvester(farmId: string): BiophotonHarvester {
        const collectors = this.createCollectors();
        const applications = this.createApplications();

        return {
            id: `bph-${Date.now()}`,
            farmId,
            collectors,
            energyStorage: {
                capacity: 100,              // 100 mWh
                currentCharge: 45,
                chargeRate: 2.5,
                dischargeRate: 1.8,
                cycles: 1250,
                health: 95,
                technology: 'quantum_battery'
            },
            production: this.calculateProduction(),
            applications,
            efficiency: {
                collectionEfficiency: 85,
                conversionEfficiency: 72,
                storageEfficiency: 94,
                overallEfficiency: 58,
                theoreticalMax: 75,
                improvementPotential: 17
            },
            status: 'operational'
        };
    }

    private createCollectors(): PhotonCollector[] {
        const types: CollectorType[] = [
            'ultraweak_photon',
            'chlorophyll_fluorescence',
            'delayed_luminescence',
            'bioluminescence'
        ];

        return Array.from({ length: 8 }, (_, i) => ({
            id: `collector-${i}`,
            zone: `Zone-${String.fromCharCode(65 + Math.floor(i / 2))}`,
            position: { x: (i % 4) * 5, y: 0.5, z: Math.floor(i / 4) * 5 },
            type: types[i % 4],
            sensitivity: 1000 + Math.random() * 4000,
            spectralRange: { min: 380, max: 780 },
            activeArea: 100 + Math.random() * 100,
            temperature: 22 + Math.random() * 4,
            efficiency: 70 + Math.random() * 25,
            currentOutput: 0.5 + Math.random() * 2,
            status: 'active'
        }));
    }

    private createApplications(): EnergyApplication[] {
        return [
            { id: 'app-1', name: 'Micro Sensors', koreanName: '마이크로 센서', powerRequirement: 0.1, priority: 10, status: 'active', uptime: 2500, description: '초저전력 환경 센서' },
            { id: 'app-2', name: 'Quantum Transceiver', koreanName: '양자 송수신기', powerRequirement: 0.5, priority: 8, status: 'active', uptime: 1800, description: '식물 간 양자 통신' },
            { id: 'app-3', name: 'Bio-LED Indicators', koreanName: '바이오 LED', powerRequirement: 0.2, priority: 6, status: 'active', uptime: 3000, description: '식물 상태 표시기' },
            { id: 'app-4', name: 'Data Logger', koreanName: '데이터 로거', powerRequirement: 0.3, priority: 7, status: 'active', uptime: 2200, description: '자율 데이터 기록' },
            { id: 'app-5', name: 'Emergency Beacon', koreanName: '비상 비콘', powerRequirement: 1.0, priority: 9, status: 'standby', uptime: 0, description: '긴급 상황 알림' }
        ];
    }

    private calculateProduction(): EnergyProduction {
        const hourly: number[] = [];
        for (let h = 0; h < 24; h++) {
            // 광합성 활성 시간대 (6-18시) 에 더 많은 에너지
            const factor = h >= 6 && h <= 18
                ? Math.sin((h - 6) * Math.PI / 12)
                : 0.1;
            hourly.push(factor * (50 + Math.random() * 30));
        }

        const daily = hourly.reduce((a, b) => a + b, 0);

        return {
            hourly,
            daily,
            weekly: daily * 7 * (0.9 + Math.random() * 0.2),
            monthly: daily * 30 * (0.85 + Math.random() * 0.3),
            peakHour: 12,
            peakOutput: Math.max(...hourly) / 60,
            efficiency: 58 + Math.random() * 12,
            carbonOffset: daily * 0.0005
        };
    }

    // 생체광자 분석 실행
    analyzeBiophotons(zone: string): BiophotonAnalysis {
        const analysis: BiophotonAnalysis = {
            timestamp: new Date(),
            zone,
            emissionRate: 100 + Math.random() * 500,
            spectralDistribution: this.generateSpectralDistribution(),
            coherenceLevel: 0.6 + Math.random() * 0.35,
            patternType: 'normal_photosynthetic',
            healthIndicator: 70 + Math.random() * 30,
            stressLevel: 5 + Math.random() * 25,
            growthPhase: 'vegetative',
            anomalies: this.detectAnomalies()
        };

        // 저장
        if (!this.analyses.has(zone)) {
            this.analyses.set(zone, []);
        }
        this.analyses.get(zone)!.push(analysis);

        return analysis;
    }

    private generateSpectralDistribution(): SpectralData[] {
        const sources: { source: PhotonSource; peakWl: number; width: number }[] = [
            { source: 'chlorophyll_a', peakWl: 685, width: 30 },
            { source: 'chlorophyll_b', peakWl: 650, width: 25 },
            { source: 'carotenoid', peakWl: 490, width: 80 },
            { source: 'flavonoid', peakWl: 550, width: 100 },
            { source: 'reactive_oxygen', peakWl: 450, width: 120 }
        ];

        const data: SpectralData[] = [];
        for (let wl = 380; wl <= 780; wl += 10) {
            let intensity = 0.1 + Math.random() * 0.1;
            let source: PhotonSource = 'unknown';

            sources.forEach(s => {
                const dist = Math.abs(wl - s.peakWl);
                if (dist < s.width) {
                    const contribution = Math.exp(-dist * dist / (2 * s.width * s.width));
                    if (contribution > 0.5) {
                        intensity += contribution * (0.5 + Math.random() * 0.5);
                        source = s.source;
                    }
                }
            });

            data.push({ wavelength: wl, intensity, source });
        }

        return data;
    }

    private detectAnomalies(): Anomaly[] {
        const anomalies: Anomaly[] = [];

        // 20% 확률로 이상 감지
        if (Math.random() < 0.2) {
            anomalies.push({
                type: 'spike',
                wavelength: 520,
                magnitude: 2.5,
                possibleCause: '일시적 스트레스 반응',
                recommendation: '환경 조건 확인'
            });
        }

        return anomalies;
    }

    // 에너지 수확
    harvestEnergy(): number {
        const collected = this.harvester.collectors
            .filter(c => c.status === 'active')
            .reduce((sum, c) => sum + c.currentOutput, 0);

        this.harvester.energyStorage.currentCharge = Math.min(
            this.harvester.energyStorage.capacity,
            this.harvester.energyStorage.currentCharge + collected / 1000
        );

        return collected;
    }

    // 상태 조회
    getHarvester(): BiophotonHarvester {
        return this.harvester;
    }

    // 수집기 조회
    getCollector(collectorId: string): PhotonCollector | undefined {
        return this.harvester.collectors.find(c => c.id === collectorId);
    }

    // 분석 이력 조회
    getAnalysisHistory(zone: string): BiophotonAnalysis[] {
        return this.analyses.get(zone) || [];
    }
}

// 싱글톤
const biophotonEngines: Map<string, BiophotonEnergyEngine> = new Map();

export function getBiophotonEnergyEngine(farmId: string): BiophotonEnergyEngine {
    if (!biophotonEngines.has(farmId)) {
        biophotonEngines.set(farmId, new BiophotonEnergyEngine(farmId));
    }
    return biophotonEngines.get(farmId)!;
}

export const COLLECTOR_TYPE_ICONS: Record<CollectorType, string> = {
    ultraweak_photon: '✨',
    delayed_luminescence: '🌟',
    bioluminescence: '💫',
    chlorophyll_fluorescence: '🟢',
    stress_emission: '⚡'
};

export const PATTERN_TYPE_NAMES: Record<EmissionPattern, string> = {
    normal_photosynthetic: '정상 광합성',
    stress_response: '스트레스 반응',
    circadian_rhythm: '일주기 리듬',
    growth_burst: '성장 폭발',
    defense_activation: '방어 활성화',
    senescence: '노화'
};
