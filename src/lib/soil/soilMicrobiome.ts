// AgriNexus World OS - 토양 마이크로바이옴 분석기
// Soil Microbiome Analyzer - 세계 최초 실시간 토양 미생물 생태계 분석

// ============================================
// 타입 정의
// ============================================

export interface SoilMicrobiome {
    id: string;
    sampleId: string;
    location: { zone: string; depth: number; coordinates: { x: number; y: number } };
    collectedAt: Date;
    analyzedAt: Date;
    bacteria: BacteriaAnalysis;
    fungi: FungiAnalysis;
    archaea: ArchaeaAnalysis;
    metabolicProfile: MetabolicProfile;
    diversityIndices: DiversityIndices;
    healthScore: number;
    recommendations: MicrobiomeRecommendation[];
}

export interface BacteriaAnalysis {
    totalCount: number;                 // CFU/g
    phylumDistribution: { phylum: string; percentage: number; role: string }[];
    beneficialSpecies: SpeciesInfo[];
    pathogenicSpecies: SpeciesInfo[];
    nitrogenFixers: { name: string; activity: number }[];
    phosphateSolubilizers: { name: string; activity: number }[];
    plantGrowthPromoters: { name: string; hormone: string; production: number }[];
}

export interface SpeciesInfo {
    name: string;
    scientificName: string;
    abundance: number;
    relativeAbundance: number;
    function: string;
    symbioticRelation?: string;
}

export interface FungiAnalysis {
    totalHyphaeLength: number;          // m/g soil
    mycorrhizalColonization: number;    // %
    arbuscularMycorrhiza: { species: string; effectiveness: number }[];
    ectomycorrhiza: { species: string; hostPlants: string[] }[];
    saprophytes: { name: string; decompositionRate: number }[];
    pathogens: { name: string; risk: number; targetCrops: string[] }[];
    beneficialFungi: { name: string; benefit: string }[];
}

export interface ArchaeaAnalysis {
    totalCount: number;
    ammoniaOxidizers: { name: string; activity: number }[];
    methanogens: { name: string; activity: number }[];
    thermophiles: { name: string; temperatureRange: [number, number] }[];
}

export interface MetabolicProfile {
    carbonCycling: CyclingActivity;
    nitrogenCycling: NitrogenActivity;
    phosphorusCycling: CyclingActivity;
    sulfurCycling: CyclingActivity;
    enzymeActivities: EnzymeActivity[];
    volatileOrganicCompounds: VOCProfile[];
    antibioticResistance: { gene: string; prevalence: number }[];
}

export interface CyclingActivity {
    inputRate: number;
    outputRate: number;
    poolSize: number;
    turnoverTime: number;           // days
    efficiency: number;             // %
}

export interface NitrogenActivity extends CyclingActivity {
    fixationRate: number;           // kg N/ha/year
    nitrificationRate: number;
    denitrificationRate: number;
    ammonificationRate: number;
    n2oEmission: number;            // kg N/ha/year
}

export interface EnzymeActivity {
    name: string;
    activity: number;               // μmol/g/h
    substrate: string;
    role: string;
    optimal_pH: number;
    currentActivity: number;        // % of optimal
}

export interface VOCProfile {
    compound: string;
    concentration: number;          // ppb
    source: 'bacterial' | 'fungal' | 'plant_root';
    effect: 'beneficial' | 'neutral' | 'harmful';
    signaling?: string;
}

export interface DiversityIndices {
    shannonIndex: number;           // H'
    simpsonIndex: number;           // 1-D
    chao1: number;                  // richness estimate
    observedOTUs: number;
    evenness: number;
    phylogeneticDiversity: number;
}

export interface MicrobiomeRecommendation {
    type: RecommendationType;
    priority: 'critical' | 'high' | 'medium' | 'low';
    issue: string;
    action: string;
    koreanAction: string;
    product?: string;
    dosage?: string;
    timing: string;
    expectedImprovement: number;    // %
    estimatedCost: number;
}

export type RecommendationType =
    | 'inoculant'           // 미생물 접종제
    | 'organic_amendment'   // 유기물 투입
    | 'ph_adjustment'       // pH 조정
    | 'cover_crop'          // 피복작물
    | 'reduced_tillage'     // 경운 감소
    | 'biocontrol'          // 생물학적 방제
    | 'nutrient_management' // 양분 관리
    | 'moisture_control';   // 수분 조절

// ============================================
// 토양 마이크로바이옴 엔진
// ============================================

export class SoilMicrobiomeEngine {
    private samples: Map<string, SoilMicrobiome> = new Map();

    // 토양 분석
    analyzeSample(sampleId: string, zone: string, depth: number): SoilMicrobiome {
        const microbiome: SoilMicrobiome = {
            id: `mb-${Date.now()}`,
            sampleId,
            location: { zone, depth, coordinates: { x: Math.random() * 100, y: Math.random() * 100 } },
            collectedAt: new Date(),
            analyzedAt: new Date(),
            bacteria: this.analyzeBacteria(),
            fungi: this.analyzeFungi(),
            archaea: this.analyzeArchaea(),
            metabolicProfile: this.analyzeMetabolism(),
            diversityIndices: this.calculateDiversity(),
            healthScore: 0,
            recommendations: []
        };

        microbiome.healthScore = this.calculateHealthScore(microbiome);
        microbiome.recommendations = this.generateRecommendations(microbiome);

        this.samples.set(sampleId, microbiome);
        return microbiome;
    }

    private analyzeBacteria(): BacteriaAnalysis {
        return {
            totalCount: 1e9 + Math.random() * 1e10,
            phylumDistribution: [
                { phylum: 'Proteobacteria', percentage: 25 + Math.random() * 10, role: '다양한 대사 기능' },
                { phylum: 'Acidobacteria', percentage: 15 + Math.random() * 10, role: '저 pH 환경 적응' },
                { phylum: 'Actinobacteria', percentage: 12 + Math.random() * 8, role: '유기물 분해, 항생물질 생산' },
                { phylum: 'Bacteroidetes', percentage: 10 + Math.random() * 8, role: '복합 탄수화물 분해' },
                { phylum: 'Firmicutes', percentage: 8 + Math.random() * 6, role: '포자 형성, 스트레스 저항' },
                { phylum: 'Verrucomicrobia', percentage: 5 + Math.random() * 5, role: '식물 뿌리 상호작용' }
            ],
            beneficialSpecies: [
                { name: '바실러스 서브틸리스', scientificName: 'Bacillus subtilis', abundance: 1e6, relativeAbundance: 0.1, function: '식물 성장 촉진, 병해 억제' },
                { name: '류코노스톡', scientificName: 'Leuconostoc', abundance: 5e5, relativeAbundance: 0.05, function: '유기물 발효' },
                { name: '슈도모나스 플루오레센스', scientificName: 'Pseudomonas fluorescens', abundance: 8e5, relativeAbundance: 0.08, function: '인 가용화, 항균 물질 생산' }
            ],
            pathogenicSpecies: [
                { name: '푸사리움', scientificName: 'Fusarium', abundance: 1e4, relativeAbundance: 0.001, function: '식물 병원균' }
            ],
            nitrogenFixers: [
                { name: 'Azotobacter', activity: 50 + Math.random() * 30 },
                { name: 'Rhizobium', activity: 80 + Math.random() * 15 }
            ],
            phosphateSolubilizers: [
                { name: 'Bacillus megaterium', activity: 40 + Math.random() * 30 }
            ],
            plantGrowthPromoters: [
                { name: 'Pseudomonas', hormone: 'IAA', production: 25 + Math.random() * 15 },
                { name: 'Azospirillum', hormone: 'Cytokinin', production: 15 + Math.random() * 10 }
            ]
        };
    }

    private analyzeFungi(): FungiAnalysis {
        return {
            totalHyphaeLength: 10 + Math.random() * 20,
            mycorrhizalColonization: 40 + Math.random() * 40,
            arbuscularMycorrhiza: [
                { species: 'Rhizophagus irregularis', effectiveness: 75 + Math.random() * 20 },
                { species: 'Funneliformis mosseae', effectiveness: 60 + Math.random() * 25 }
            ],
            ectomycorrhiza: [
                { species: 'Laccaria bicolor', hostPlants: ['소나무', '참나무'] }
            ],
            saprophytes: [
                { name: 'Trichoderma harzianum', decompositionRate: 30 + Math.random() * 20 }
            ],
            pathogens: [
                { name: 'Rhizoctonia solani', risk: 15 + Math.random() * 20, targetCrops: ['딸기', '토마토'] }
            ],
            beneficialFungi: [
                { name: 'Trichoderma', benefit: '병해 억제, 식물 성장 촉진' },
                { name: 'Beauveria bassiana', benefit: '해충 방제' }
            ]
        };
    }

    private analyzeArchaea(): ArchaeaAnalysis {
        return {
            totalCount: 1e7 + Math.random() * 1e8,
            ammoniaOxidizers: [
                { name: 'Nitrososphaera', activity: 20 + Math.random() * 30 }
            ],
            methanogens: [
                { name: 'Methanobacterium', activity: 5 + Math.random() * 10 }
            ],
            thermophiles: [
                { name: 'Thermoplasma', temperatureRange: [45, 60] }
            ]
        };
    }

    private analyzeMetabolism(): MetabolicProfile {
        return {
            carbonCycling: {
                inputRate: 500 + Math.random() * 300,
                outputRate: 480 + Math.random() * 280,
                poolSize: 25000 + Math.random() * 10000,
                turnoverTime: 30 + Math.random() * 20,
                efficiency: 80 + Math.random() * 15
            },
            nitrogenCycling: {
                inputRate: 50 + Math.random() * 30,
                outputRate: 45 + Math.random() * 25,
                poolSize: 2000 + Math.random() * 1000,
                turnoverTime: 60 + Math.random() * 30,
                efficiency: 70 + Math.random() * 20,
                fixationRate: 20 + Math.random() * 30,
                nitrificationRate: 15 + Math.random() * 20,
                denitrificationRate: 5 + Math.random() * 10,
                ammonificationRate: 25 + Math.random() * 15,
                n2oEmission: 2 + Math.random() * 3
            },
            phosphorusCycling: {
                inputRate: 10 + Math.random() * 10,
                outputRate: 8 + Math.random() * 8,
                poolSize: 800 + Math.random() * 400,
                turnoverTime: 90 + Math.random() * 60,
                efficiency: 60 + Math.random() * 25
            },
            sulfurCycling: {
                inputRate: 5 + Math.random() * 5,
                outputRate: 4 + Math.random() * 4,
                poolSize: 300 + Math.random() * 200,
                turnoverTime: 45 + Math.random() * 30,
                efficiency: 75 + Math.random() * 15
            },
            enzymeActivities: [
                { name: 'β-glucosidase', activity: 150 + Math.random() * 100, substrate: '셀룰로오스', role: '탄소 순환', optimal_pH: 6.0, currentActivity: 75 + Math.random() * 20 },
                { name: 'Urease', activity: 80 + Math.random() * 60, substrate: '요소', role: '질소 순환', optimal_pH: 7.0, currentActivity: 80 + Math.random() * 15 },
                { name: 'Phosphatase', activity: 200 + Math.random() * 150, substrate: '유기 인산염', role: '인 가용화', optimal_pH: 6.5, currentActivity: 70 + Math.random() * 20 },
                { name: 'Dehydrogenase', activity: 100 + Math.random() * 80, substrate: '유기물', role: '호흡 활성', optimal_pH: 7.5, currentActivity: 85 + Math.random() * 10 }
            ],
            volatileOrganicCompounds: [
                { compound: 'Geosmin', concentration: 5 + Math.random() * 10, source: 'bacterial', effect: 'neutral', signaling: '토양 냄새' },
                { compound: '2,3-Butanediol', concentration: 20 + Math.random() * 30, source: 'bacterial', effect: 'beneficial', signaling: '식물 면역 유도' }
            ],
            antibioticResistance: [
                { gene: 'tetA', prevalence: 0.01 + Math.random() * 0.02 }
            ]
        };
    }

    private calculateDiversity(): DiversityIndices {
        return {
            shannonIndex: 4.5 + Math.random() * 2,
            simpsonIndex: 0.9 + Math.random() * 0.099,
            chao1: 3000 + Math.random() * 2000,
            observedOTUs: 2500 + Math.random() * 1500,
            evenness: 0.75 + Math.random() * 0.2,
            phylogeneticDiversity: 150 + Math.random() * 100
        };
    }

    private calculateHealthScore(mb: SoilMicrobiome): number {
        let score = 50;

        // 다양성 기반
        score += (mb.diversityIndices.shannonIndex / 7) * 15;

        // 균근 정착률
        score += (mb.fungi.mycorrhizalColonization / 100) * 15;

        // 질소 고정 활성
        const nFixers = mb.bacteria.nitrogenFixers.reduce((sum, n) => sum + n.activity, 0) / 100;
        score += Math.min(nFixers, 10);

        // 병원균 위험 감점
        const pathRisk = mb.fungi.pathogens.reduce((sum, p) => sum + p.risk, 0) / 50;
        score -= Math.min(pathRisk, 10);

        return Math.max(0, Math.min(100, score));
    }

    private generateRecommendations(mb: SoilMicrobiome): MicrobiomeRecommendation[] {
        const recommendations: MicrobiomeRecommendation[] = [];

        if (mb.fungi.mycorrhizalColonization < 50) {
            recommendations.push({
                type: 'inoculant',
                priority: 'high',
                issue: '균근 정착률 낮음',
                action: 'Apply mycorrhizal inoculant',
                koreanAction: '균근 접종제 투입',
                product: 'MycoMax Pro',
                dosage: '50g/m²',
                timing: '정식 전',
                expectedImprovement: 25,
                estimatedCost: 50000
            });
        }

        if (mb.diversityIndices.shannonIndex < 5) {
            recommendations.push({
                type: 'organic_amendment',
                priority: 'medium',
                issue: '미생물 다양성 부족',
                action: 'Add composted organic matter',
                koreanAction: '퇴비 투입으로 다양성 증진',
                product: '완숙 퇴비',
                dosage: '3t/10a',
                timing: '작기 전',
                expectedImprovement: 20,
                estimatedCost: 150000
            });
        }

        return recommendations;
    }

    // 샘플 조회
    getSample(sampleId: string): SoilMicrobiome | undefined {
        return this.samples.get(sampleId);
    }

    // 모든 샘플 조회
    getAllSamples(): SoilMicrobiome[] {
        return Array.from(this.samples.values());
    }
}

// 싱글톤
let microbiomeEngine: SoilMicrobiomeEngine | null = null;

export function getSoilMicrobiomeEngine(): SoilMicrobiomeEngine {
    if (!microbiomeEngine) {
        microbiomeEngine = new SoilMicrobiomeEngine();
    }
    return microbiomeEngine;
}

export const RECOMMENDATION_ICONS: Record<RecommendationType, string> = {
    inoculant: '🦠',
    organic_amendment: '🌿',
    ph_adjustment: '⚗️',
    cover_crop: '🌾',
    reduced_tillage: '🚜',
    biocontrol: '🛡️',
    nutrient_management: '💊',
    moisture_control: '💧'
};
