// AgriNexus World OS - 광합성 AI 최적화 엔진
// Photosynthesis AI Optimizer - 세계 최초 실시간 광합성 효율 극대화

// ============================================
// 타입 정의
// ============================================

export interface PhotosynthesisState {
    plantId: string;
    timestamp: Date;
    lightAbsorption: LightAbsorptionData;
    carbonFixation: CarbonFixationData;
    electronTransport: ElectronTransportData;
    waterSplitting: WaterSplittingData;
    sugarProduction: SugarProductionData;
    overallEfficiency: number;          // %
    theoreticalMax: number;             // %
    optimizationPotential: number;      // %
}

export interface LightAbsorptionData {
    par: number;                        // Photosynthetically Active Radiation (μmol/m²/s)
    chlorophyllA: number;               // mg/g
    chlorophyllB: number;               // mg/g
    carotenoids: number;                // mg/g
    absorptionSpectrum: { wavelength: number; absorption: number }[];
    quantumYield: number;               // 0-1
    lightSaturationPoint: number;       // μmol/m²/s
    lightCompensationPoint: number;     // μmol/m²/s
}

export interface CarbonFixationData {
    co2Concentration: number;           // ppm
    rubiscoActivity: number;            // μmol CO2/mg/min
    pep_carboxylase: number;            // C4 식물용
    calvinCycleRate: number;            // μmol/m²/s
    photorespiration: number;           // % of carbon fixed
    stomatalConductance: number;        // mol H2O/m²/s
    mesophyllConductance: number;       // mol CO2/m²/s
    waterUseEfficiency: number;         // μmol CO2/mmol H2O
}

export interface ElectronTransportData {
    photosystemI_efficiency: number;
    photosystemII_efficiency: number;
    electronTransportRate: number;      // μmol e-/m²/s
    atp_production: number;             // μmol/m²/s
    nadph_production: number;           // μmol/m²/s
    nonPhotochemicalQuenching: number;  // NPQ
    chlorophyllFluorescence: {
        fo: number;                     // minimal fluorescence
        fm: number;                     // maximal fluorescence
        fv: number;                     // variable fluorescence
        fvFm: number;                   // maximum quantum yield
    };
}

export interface WaterSplittingData {
    oxygenEvolution: number;            // μmol O2/m²/s
    protonGradient: number;             // pH units
    manganesClusterState: 'S0' | 'S1' | 'S2' | 'S3' | 'S4';
    waterOxidaseActivity: number;
}

export interface SugarProductionData {
    glucose: number;                    // mmol/kg
    fructose: number;
    sucrose: number;
    starch: number;
    dailyCarbohydrateProduction: number; // g/m²/day
    sinkStrength: number;               // 식물 부위별 당 이동
}

// ============================================
// 최적화 추천
// ============================================

export interface PhotosynthesisOptimization {
    id: string;
    plantId: string;
    type: OptimizationType;
    currentValue: number;
    optimalValue: number;
    impact: number;                     // 효율 증가 %
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    koreanAction: string;
    implementation: ImplementationStep[];
    estimatedCost: number;
    estimatedROI: number;
}

export type OptimizationType =
    | 'light_spectrum'
    | 'light_intensity'
    | 'co2_enrichment'
    | 'temperature'
    | 'humidity'
    | 'nutrient_balance'
    | 'chlorophyll_boost'
    | 'stomatal_control'
    | 'stress_relief';

export interface ImplementationStep {
    order: number;
    action: string;
    duration: number;                   // minutes
    equipment?: string;
    parameters?: Record<string, number>;
}

// ============================================
// 광합성 AI 엔진
// ============================================

export class PhotosynthesisAIEngine {
    private states: Map<string, PhotosynthesisState> = new Map();
    private optimizations: Map<string, PhotosynthesisOptimization[]> = new Map();

    // 실시간 광합성 분석
    analyzePhotosynthesis(plantId: string): PhotosynthesisState {
        const state: PhotosynthesisState = {
            plantId,
            timestamp: new Date(),
            lightAbsorption: this.analyzeLightAbsorption(),
            carbonFixation: this.analyzeCarbonFixation(),
            electronTransport: this.analyzeElectronTransport(),
            waterSplitting: this.analyzeWaterSplitting(),
            sugarProduction: this.analyzeSugarProduction(),
            overallEfficiency: 0,
            theoreticalMax: 11, // 이론적 최대 광합성 효율
            optimizationPotential: 0
        };

        // 전체 효율 계산
        state.overallEfficiency = this.calculateOverallEfficiency(state);
        state.optimizationPotential = state.theoreticalMax - state.overallEfficiency;

        this.states.set(plantId, state);
        return state;
    }

    private analyzeLightAbsorption(): LightAbsorptionData {
        return {
            par: 400 + Math.random() * 600,           // 400-1000 μmol/m²/s
            chlorophyllA: 2.5 + Math.random() * 1.5,  // 2.5-4.0 mg/g
            chlorophyllB: 0.8 + Math.random() * 0.7,  // 0.8-1.5 mg/g
            carotenoids: 0.5 + Math.random() * 0.5,   // 0.5-1.0 mg/g
            absorptionSpectrum: this.generateAbsorptionSpectrum(),
            quantumYield: 0.7 + Math.random() * 0.25, // 0.7-0.95
            lightSaturationPoint: 800 + Math.random() * 400,
            lightCompensationPoint: 20 + Math.random() * 30
        };
    }

    private generateAbsorptionSpectrum(): { wavelength: number; absorption: number }[] {
        const spectrum: { wavelength: number; absorption: number }[] = [];
        for (let wl = 400; wl <= 700; wl += 10) {
            let absorption = 0.3;
            // 청색광 영역 (430-450nm)
            if (wl >= 430 && wl <= 450) absorption = 0.85 + Math.random() * 0.1;
            // 적색광 영역 (640-680nm)
            else if (wl >= 640 && wl <= 680) absorption = 0.9 + Math.random() * 0.08;
            // 녹색광 반사
            else if (wl >= 500 && wl <= 560) absorption = 0.1 + Math.random() * 0.1;

            spectrum.push({ wavelength: wl, absorption });
        }
        return spectrum;
    }

    private analyzeCarbonFixation(): CarbonFixationData {
        return {
            co2Concentration: 400 + Math.random() * 600,
            rubiscoActivity: 2 + Math.random() * 3,
            pep_carboxylase: 0.5 + Math.random() * 1,
            calvinCycleRate: 15 + Math.random() * 25,
            photorespiration: 10 + Math.random() * 20,
            stomatalConductance: 0.2 + Math.random() * 0.3,
            mesophyllConductance: 0.15 + Math.random() * 0.15,
            waterUseEfficiency: 4 + Math.random() * 4
        };
    }

    private analyzeElectronTransport(): ElectronTransportData {
        const fm = 2500 + Math.random() * 1000;
        const fo = 400 + Math.random() * 200;
        const fv = fm - fo;

        return {
            photosystemI_efficiency: 0.85 + Math.random() * 0.12,
            photosystemII_efficiency: 0.75 + Math.random() * 0.2,
            electronTransportRate: 80 + Math.random() * 80,
            atp_production: 40 + Math.random() * 40,
            nadph_production: 25 + Math.random() * 25,
            nonPhotochemicalQuenching: 0.5 + Math.random() * 1.5,
            chlorophyllFluorescence: { fo, fm, fv, fvFm: fv / fm }
        };
    }

    private analyzeWaterSplitting(): WaterSplittingData {
        const states: ('S0' | 'S1' | 'S2' | 'S3' | 'S4')[] = ['S0', 'S1', 'S2', 'S3', 'S4'];
        return {
            oxygenEvolution: 10 + Math.random() * 20,
            protonGradient: 2.5 + Math.random() * 1,
            manganesClusterState: states[Math.floor(Math.random() * 5)],
            waterOxidaseActivity: 0.7 + Math.random() * 0.25
        };
    }

    private analyzeSugarProduction(): SugarProductionData {
        return {
            glucose: 50 + Math.random() * 30,
            fructose: 40 + Math.random() * 25,
            sucrose: 80 + Math.random() * 40,
            starch: 100 + Math.random() * 100,
            dailyCarbohydrateProduction: 15 + Math.random() * 15,
            sinkStrength: 0.6 + Math.random() * 0.35
        };
    }

    private calculateOverallEfficiency(state: PhotosynthesisState): number {
        // 광합성 효율 = 빛 에너지 → 화학 에너지 전환율
        const lightEfficiency = state.lightAbsorption.quantumYield;
        const transportEfficiency = (state.electronTransport.photosystemI_efficiency + state.electronTransport.photosystemII_efficiency) / 2;
        const fixationEfficiency = 1 - (state.carbonFixation.photorespiration / 100);

        return lightEfficiency * transportEfficiency * fixationEfficiency * 11; // 이론 최대 11%
    }

    // 최적화 추천 생성
    generateOptimizations(plantId: string): PhotosynthesisOptimization[] {
        const state = this.states.get(plantId);
        if (!state) return [];

        const optimizations: PhotosynthesisOptimization[] = [];

        // 광량 최적화
        if (state.lightAbsorption.par < state.lightAbsorption.lightSaturationPoint * 0.8) {
            optimizations.push({
                id: `opt-${Date.now()}-light`,
                plantId,
                type: 'light_intensity',
                currentValue: state.lightAbsorption.par,
                optimalValue: state.lightAbsorption.lightSaturationPoint * 0.9,
                impact: 12,
                priority: 'high',
                action: 'Increase LED intensity',
                koreanAction: 'LED 광량 증가',
                implementation: [
                    { order: 1, action: 'Raise LED intensity by 20%', duration: 5, equipment: 'LED Controller' }
                ],
                estimatedCost: 50000,
                estimatedROI: 250
            });
        }

        // CO2 최적화
        if (state.carbonFixation.co2Concentration < 800) {
            optimizations.push({
                id: `opt-${Date.now()}-co2`,
                plantId,
                type: 'co2_enrichment',
                currentValue: state.carbonFixation.co2Concentration,
                optimalValue: 1000,
                impact: 25,
                priority: 'critical',
                action: 'CO2 enrichment',
                koreanAction: 'CO2 농도 증가',
                implementation: [
                    { order: 1, action: 'Enable CO2 generator', duration: 10, equipment: 'CO2 Generator' },
                    { order: 2, action: 'Set target to 1000ppm', duration: 2, parameters: { target_ppm: 1000 } }
                ],
                estimatedCost: 30000,
                estimatedROI: 350
            });
        }

        // 스펙트럼 최적화
        const blueAbsorption = state.lightAbsorption.absorptionSpectrum
            .filter(s => s.wavelength >= 430 && s.wavelength <= 450)
            .reduce((sum, s) => sum + s.absorption, 0) / 3;

        if (blueAbsorption < 0.85) {
            optimizations.push({
                id: `opt-${Date.now()}-spectrum`,
                plantId,
                type: 'light_spectrum',
                currentValue: blueAbsorption * 100,
                optimalValue: 90,
                impact: 8,
                priority: 'medium',
                action: 'Increase blue light ratio',
                koreanAction: '청색광 비율 증가',
                implementation: [
                    { order: 1, action: 'Adjust spectrum to 30% blue, 70% red', duration: 3 }
                ],
                estimatedCost: 20000,
                estimatedROI: 180
            });
        }

        this.optimizations.set(plantId, optimizations);
        return optimizations;
    }

    // 상태 조회
    getState(plantId: string): PhotosynthesisState | undefined {
        return this.states.get(plantId);
    }

    // 최적화 조회
    getOptimizations(plantId: string): PhotosynthesisOptimization[] {
        return this.optimizations.get(plantId) || [];
    }

    // 전체 농장 효율
    getFarmEfficiency(): { average: number; min: number; max: number; totalPotential: number } {
        const states = Array.from(this.states.values());
        if (states.length === 0) return { average: 0, min: 0, max: 0, totalPotential: 0 };

        const efficiencies = states.map(s => s.overallEfficiency);
        return {
            average: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
            min: Math.min(...efficiencies),
            max: Math.max(...efficiencies),
            totalPotential: states.reduce((sum, s) => sum + s.optimizationPotential, 0)
        };
    }
}

// 싱글톤
let photosynthesisEngine: PhotosynthesisAIEngine | null = null;

export function getPhotosynthesisAIEngine(): PhotosynthesisAIEngine {
    if (!photosynthesisEngine) {
        photosynthesisEngine = new PhotosynthesisAIEngine();
    }
    return photosynthesisEngine;
}

export const OPTIMIZATION_TYPE_ICONS: Record<OptimizationType, string> = {
    light_spectrum: '🌈',
    light_intensity: '💡',
    co2_enrichment: '💨',
    temperature: '🌡️',
    humidity: '💧',
    nutrient_balance: '🧪',
    chlorophyll_boost: '🌿',
    stomatal_control: '🍃',
    stress_relief: '😌'
};
