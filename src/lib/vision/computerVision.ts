// AgriNexus World OS - 컴퓨터 비전 식물 건강 분석 시스템
// TensorFlow.js 기반 실시간 병해충 감지 및 생장 분석

// ============================================
// 타입 정의
// ============================================

export interface PlantAnalysis {
    id: string;
    timestamp: Date;
    imageData?: string;
    plantId?: string;
    zone?: string;

    // 건강 상태
    health: {
        score: number;           // 0-100
        status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
        trend: 'improving' | 'stable' | 'declining';
    };

    // 병해충 감지
    diseases: DiseaseDetection[];
    pests: PestDetection[];

    // 생장 분석
    growth: {
        stage: GrowthStage;
        progress: number;        // 0-100%
        estimatedHarvest: Date;
        biomassIndex: number;
    };

    // 영양 상태
    nutrition: {
        chlorophyllLevel: number;
        nitrogenStatus: 'deficient' | 'optimal' | 'excess';
        potassiumStatus: 'deficient' | 'optimal' | 'excess';
        ironStatus: 'deficient' | 'optimal' | 'excess';
        overallScore: number;
    };

    // 물 스트레스
    waterStress: {
        level: 'none' | 'mild' | 'moderate' | 'severe';
        wiltingIndex: number;
        turgidity: number;
    };

    // 권장 조치
    recommendations: Recommendation[];

    // 신뢰도
    confidence: number;
    processingTime: number;    // ms
}

export interface DiseaseDetection {
    id: string;
    name: string;
    scientificName: string;
    category: 'fungal' | 'bacterial' | 'viral' | 'physiological';
    confidence: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedArea: number;      // %
    location: { x: number; y: number; width: number; height: number };
    treatment: string[];
    spreadRisk: 'low' | 'medium' | 'high';
}

export interface PestDetection {
    id: string;
    name: string;
    scientificName: string;
    category: 'insect' | 'mite' | 'nematode' | 'other';
    confidence: number;
    count: number;
    location: { x: number; y: number; width: number; height: number };
    lifecycle: 'egg' | 'larva' | 'nymph' | 'adult';
    treatment: string[];
    infestation: 'early' | 'moderate' | 'severe';
}

export type GrowthStage =
    | 'germination'
    | 'seedling'
    | 'vegetative'
    | 'flowering'
    | 'fruiting'
    | 'ripening'
    | 'harvest_ready';

export interface Recommendation {
    id: string;
    type: 'immediate' | 'preventive' | 'optimization';
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'treatment' | 'nutrition' | 'environment' | 'irrigation' | 'harvest';
    action: string;
    description: string;
    expectedOutcome: string;
    timeframe: string;
    estimatedCost?: number;
    automatable: boolean;
}

// ============================================
// 병해충 데이터베이스
// ============================================

const DISEASE_DATABASE: Record<string, Omit<DiseaseDetection, 'id' | 'confidence' | 'affectedArea' | 'location' | 'severity'>> = {
    powdery_mildew: {
        name: '흰가루병',
        scientificName: 'Erysiphales',
        category: 'fungal',
        treatment: ['살균제 스프레이', '환기 개선', '습도 낮추기'],
        spreadRisk: 'high'
    },
    downy_mildew: {
        name: '노균병',
        scientificName: 'Peronospora',
        category: 'fungal',
        treatment: ['구리 살균제', '잎 건조 유지', '감염 잎 제거'],
        spreadRisk: 'high'
    },
    botrytis: {
        name: '잿빛곰팡이병',
        scientificName: 'Botrytis cinerea',
        category: 'fungal',
        treatment: ['환기 증가', '습도 감소', '감염 부위 제거'],
        spreadRisk: 'medium'
    },
    bacterial_leaf_spot: {
        name: '세균성 점무늬병',
        scientificName: 'Xanthomonas',
        category: 'bacterial',
        treatment: ['구리 살균제', '물 스플래시 방지', '감염 식물 격리'],
        spreadRisk: 'medium'
    },
    root_rot: {
        name: '뿌리썩음병',
        scientificName: 'Pythium/Phytophthora',
        category: 'fungal',
        treatment: ['배수 개선', 'pH 조정', '살균제 처리'],
        spreadRisk: 'high'
    },
    tobacco_mosaic: {
        name: '담배모자이크바이러스',
        scientificName: 'Tobacco mosaic virus',
        category: 'viral',
        treatment: ['감염 식물 제거', '도구 소독', '손 씻기 철저'],
        spreadRisk: 'high'
    },
    calcium_deficiency: {
        name: '칼슘 결핍증',
        scientificName: 'Ca Deficiency',
        category: 'physiological',
        treatment: ['칼슘 엽면 시비', 'pH 조정', '습도 관리'],
        spreadRisk: 'low'
    },
    tip_burn: {
        name: '팁번',
        scientificName: 'Tipburn',
        category: 'physiological',
        treatment: ['칼슘 공급 증가', '온도 조절', '환기 개선'],
        spreadRisk: 'low'
    }
};

const PEST_DATABASE: Record<string, Omit<PestDetection, 'id' | 'confidence' | 'count' | 'location' | 'lifecycle' | 'infestation'>> = {
    aphid: {
        name: '진딧물',
        scientificName: 'Aphididae',
        category: 'insect',
        treatment: ['천적 투입 (무당벌레)', '비눗물 스프레이', '니모일 처리']
    },
    whitefly: {
        name: '가루이',
        scientificName: 'Aleyrodidae',
        category: 'insect',
        treatment: ['황색 끈끈이 트랩', '천적 투입', '니모일 처리']
    },
    spider_mite: {
        name: '점박이응애',
        scientificName: 'Tetranychus urticae',
        category: 'mite',
        treatment: ['습도 증가', '천적 응애 투입', '미생물 살충제']
    },
    thrips: {
        name: '총채벌레',
        scientificName: 'Thysanoptera',
        category: 'insect',
        treatment: ['청색 끈끈이 트랩', '천적 투입', '스피네토람 처리']
    },
    fungus_gnat: {
        name: '버섯파리',
        scientificName: 'Sciaridae',
        category: 'insect',
        treatment: ['황색 끈끈이', '선충 투입', '배지 건조']
    },
    leafminer: {
        name: '잎굴파리',
        scientificName: 'Liriomyza',
        category: 'insect',
        treatment: ['감염 잎 제거', '천적 기생봉', '스피노사드 처리']
    }
};

// ============================================
// 컴퓨터 비전 서비스 클래스
// ============================================

class ComputerVisionService {
    private isInitialized = false;
    private processingQueue: { imageData: string; resolve: (r: PlantAnalysis) => void }[] = [];
    private isProcessing = false;

    // 분석 히스토리
    private analysisHistory: PlantAnalysis[] = [];
    private alerts: { timestamp: Date; type: string; message: string; severity: string }[] = [];

    constructor() {
        this.initialize();
    }

    private async initialize() {
        // 실제 구현에서는 TensorFlow.js 모델 로드
        console.log('🔬 Computer Vision 서비스 초기화 중...');

        // 모델 로드 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 100));

        this.isInitialized = true;
        console.log('✅ Computer Vision 서비스 준비 완료');
    }

    // 이미지 분석
    async analyzeImage(imageData: string, metadata?: { plantId?: string; zone?: string }): Promise<PlantAnalysis> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        return new Promise((resolve) => {
            this.processingQueue.push({ imageData, resolve: (r) => resolve({ ...r, ...metadata }) });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.processingQueue.length === 0) return;

        this.isProcessing = true;
        const { imageData, resolve } = this.processingQueue.shift()!;

        const startTime = Date.now();

        // 분석 실행 (시뮬레이션)
        const analysis = await this.performAnalysis(imageData);
        analysis.processingTime = Date.now() - startTime;

        // 히스토리 저장
        this.analysisHistory.push(analysis);
        if (this.analysisHistory.length > 1000) {
            this.analysisHistory = this.analysisHistory.slice(-500);
        }

        // 알림 생성
        this.generateAlerts(analysis);

        resolve(analysis);
        this.isProcessing = false;

        // 다음 항목 처리
        if (this.processingQueue.length > 0) {
            this.processQueue();
        }
    }

    private async performAnalysis(imageData: string): Promise<PlantAnalysis> {
        // 실제 구현에서는 TensorFlow.js로 이미지 분석
        // 여기서는 현실적인 결과 시뮬레이션

        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

        const healthScore = 60 + Math.random() * 40;
        const diseases = this.detectDiseases();
        const pests = this.detectPests();

        const analysis: PlantAnalysis = {
            id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            imageData: imageData.length > 100 ? undefined : imageData,

            health: {
                score: healthScore - (diseases.length * 5) - (pests.length * 3),
                status: this.getHealthStatus(healthScore - (diseases.length * 5) - (pests.length * 3)),
                trend: Math.random() > 0.3 ? 'stable' : (Math.random() > 0.5 ? 'improving' : 'declining')
            },

            diseases,
            pests,

            growth: {
                stage: this.getRandomStage(),
                progress: Math.floor(20 + Math.random() * 70),
                estimatedHarvest: new Date(Date.now() + (7 + Math.random() * 21) * 24 * 60 * 60 * 1000),
                biomassIndex: 0.6 + Math.random() * 0.35
            },

            nutrition: {
                chlorophyllLevel: 0.7 + Math.random() * 0.25,
                nitrogenStatus: this.getRandomNutrientStatus(),
                potassiumStatus: this.getRandomNutrientStatus(),
                ironStatus: this.getRandomNutrientStatus(),
                overallScore: 70 + Math.random() * 25
            },

            waterStress: {
                level: this.getRandomWaterStress(),
                wiltingIndex: Math.random() * 0.3,
                turgidity: 0.7 + Math.random() * 0.3
            },

            recommendations: this.generateRecommendations(diseases, pests),

            confidence: 0.85 + Math.random() * 0.12,
            processingTime: 0
        };

        return analysis;
    }

    private detectDiseases(): DiseaseDetection[] {
        const diseases: DiseaseDetection[] = [];

        // 30% 확률로 병해 감지
        if (Math.random() < 0.3) {
            const diseaseKeys = Object.keys(DISEASE_DATABASE);
            const key = diseaseKeys[Math.floor(Math.random() * diseaseKeys.length)];
            const template = DISEASE_DATABASE[key];

            diseases.push({
                id: `disease-${Date.now()}`,
                ...template,
                confidence: 0.7 + Math.random() * 0.25,
                severity: this.getRandomSeverity(),
                affectedArea: 5 + Math.random() * 30,
                location: {
                    x: Math.random() * 0.8,
                    y: Math.random() * 0.8,
                    width: 0.1 + Math.random() * 0.2,
                    height: 0.1 + Math.random() * 0.2
                }
            });
        }

        return diseases;
    }

    private detectPests(): PestDetection[] {
        const pests: PestDetection[] = [];

        // 20% 확률로 해충 감지
        if (Math.random() < 0.2) {
            const pestKeys = Object.keys(PEST_DATABASE);
            const key = pestKeys[Math.floor(Math.random() * pestKeys.length)];
            const template = PEST_DATABASE[key];

            pests.push({
                id: `pest-${Date.now()}`,
                ...template,
                confidence: 0.75 + Math.random() * 0.2,
                count: Math.floor(1 + Math.random() * 20),
                location: {
                    x: Math.random() * 0.8,
                    y: Math.random() * 0.8,
                    width: 0.05 + Math.random() * 0.1,
                    height: 0.05 + Math.random() * 0.1
                },
                lifecycle: ['egg', 'larva', 'nymph', 'adult'][Math.floor(Math.random() * 4)] as PestDetection['lifecycle'],
                infestation: ['early', 'moderate', 'severe'][Math.floor(Math.random() * 3)] as PestDetection['infestation']
            });
        }

        return pests;
    }

    private generateRecommendations(diseases: DiseaseDetection[], pests: PestDetection[]): Recommendation[] {
        const recommendations: Recommendation[] = [];

        // 병해 관련 권장사항
        diseases.forEach(disease => {
            disease.treatment.forEach((treatment, idx) => {
                recommendations.push({
                    id: `rec-disease-${disease.id}-${idx}`,
                    type: disease.severity === 'critical' || disease.severity === 'high' ? 'immediate' : 'preventive',
                    priority: disease.severity as 'low' | 'medium' | 'high' | 'critical',
                    category: 'treatment',
                    action: treatment,
                    description: `${disease.name} 치료를 위한 조치`,
                    expectedOutcome: '병해 확산 방지 및 치료',
                    timeframe: disease.severity === 'critical' ? '즉시' : '24시간 이내',
                    automatable: treatment.includes('환기') || treatment.includes('습도')
                });
            });
        });

        // 해충 관련 권장사항
        pests.forEach(pest => {
            pest.treatment.forEach((treatment, idx) => {
                recommendations.push({
                    id: `rec-pest-${pest.id}-${idx}`,
                    type: pest.infestation === 'severe' ? 'immediate' : 'preventive',
                    priority: pest.infestation === 'severe' ? 'high' : 'medium',
                    category: 'treatment',
                    action: treatment,
                    description: `${pest.name} 방제를 위한 조치`,
                    expectedOutcome: '해충 개체수 감소',
                    timeframe: pest.infestation === 'severe' ? '즉시' : '48시간 이내',
                    automatable: treatment.includes('트랩')
                });
            });
        });

        // 기본 최적화 권장사항
        if (recommendations.length === 0) {
            recommendations.push({
                id: `rec-optimize-${Date.now()}`,
                type: 'optimization',
                priority: 'low',
                category: 'environment',
                action: '현재 환경 조건 유지',
                description: '작물이 건강한 상태입니다. 현재 조건을 유지하세요.',
                expectedOutcome: '최적 생장 지속',
                timeframe: '계속',
                automatable: true
            });
        }

        return recommendations;
    }

    private generateAlerts(analysis: PlantAnalysis) {
        // 심각한 병해충 발견 시 알림
        analysis.diseases.forEach(disease => {
            if (disease.severity === 'critical' || disease.severity === 'high') {
                this.alerts.push({
                    timestamp: new Date(),
                    type: 'disease',
                    message: `${disease.name} 감지됨 (심각도: ${disease.severity}, 신뢰도: ${(disease.confidence * 100).toFixed(0)}%)`,
                    severity: disease.severity
                });
            }
        });

        analysis.pests.forEach(pest => {
            if (pest.infestation === 'severe') {
                this.alerts.push({
                    timestamp: new Date(),
                    type: 'pest',
                    message: `${pest.name} 심각한 감염 감지 (개체수: ${pest.count})`,
                    severity: 'high'
                });
            }
        });

        // 건강 점수 낮을 때 알림
        if (analysis.health.score < 50) {
            this.alerts.push({
                timestamp: new Date(),
                type: 'health',
                message: `식물 건강 점수 위험 수준 (${analysis.health.score.toFixed(0)}점)`,
                severity: 'critical'
            });
        }

        // 알림 제한
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(-50);
        }
    }

    // 유틸리티 메서드
    private getHealthStatus(score: number): PlantAnalysis['health']['status'] {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        if (score >= 40) return 'poor';
        return 'critical';
    }

    private getRandomStage(): GrowthStage {
        const stages: GrowthStage[] = ['germination', 'seedling', 'vegetative', 'flowering', 'fruiting', 'ripening', 'harvest_ready'];
        return stages[Math.floor(Math.random() * stages.length)];
    }

    private getRandomNutrientStatus(): 'deficient' | 'optimal' | 'excess' {
        const r = Math.random();
        if (r < 0.15) return 'deficient';
        if (r < 0.9) return 'optimal';
        return 'excess';
    }

    private getRandomWaterStress(): PlantAnalysis['waterStress']['level'] {
        const r = Math.random();
        if (r < 0.7) return 'none';
        if (r < 0.85) return 'mild';
        if (r < 0.95) return 'moderate';
        return 'severe';
    }

    private getRandomSeverity(): DiseaseDetection['severity'] {
        const r = Math.random();
        if (r < 0.4) return 'low';
        if (r < 0.7) return 'medium';
        if (r < 0.9) return 'high';
        return 'critical';
    }

    // 외부 인터페이스
    getRecentAnalyses(limit = 10): PlantAnalysis[] {
        return this.analysisHistory.slice(-limit);
    }

    getAlerts(since?: Date): typeof this.alerts {
        if (since) {
            return this.alerts.filter(a => a.timestamp > since);
        }
        return this.alerts;
    }

    getStatistics() {
        const total = this.analysisHistory.length;
        if (total === 0) {
            return {
                totalAnalyses: 0,
                avgHealthScore: 0,
                diseaseDetectionRate: 0,
                pestDetectionRate: 0,
                avgProcessingTime: 0
            };
        }

        return {
            totalAnalyses: total,
            avgHealthScore: this.analysisHistory.reduce((sum, a) => sum + a.health.score, 0) / total,
            diseaseDetectionRate: this.analysisHistory.filter(a => a.diseases.length > 0).length / total,
            pestDetectionRate: this.analysisHistory.filter(a => a.pests.length > 0).length / total,
            avgProcessingTime: this.analysisHistory.reduce((sum, a) => sum + a.processingTime, 0) / total
        };
    }

    // 배치 분석
    async analyzeBatch(images: { data: string; metadata?: { plantId?: string; zone?: string } }[]): Promise<PlantAnalysis[]> {
        const results = await Promise.all(
            images.map(img => this.analyzeImage(img.data, img.metadata))
        );
        return results;
    }

    // 실시간 스트림 분석 준비
    startRealtimeAnalysis(intervalMs = 5000): NodeJS.Timeout {
        return setInterval(async () => {
            // 시뮬레이션: 가상 이미지 분석
            const mockImage = `mock-${Date.now()}`;
            const analysis = await this.analyzeImage(mockImage, { zone: `zone-${Math.floor(Math.random() * 5) + 1}` });

            console.log(`📷 실시간 분석 완료 - 건강점수: ${analysis.health.score.toFixed(0)}, 병해: ${analysis.diseases.length}, 해충: ${analysis.pests.length}`);
        }, intervalMs);
    }
}

// 싱글톤 인스턴스
let cvServiceInstance: ComputerVisionService | null = null;

export function getComputerVisionService(): ComputerVisionService {
    if (!cvServiceInstance) {
        cvServiceInstance = new ComputerVisionService();
    }
    return cvServiceInstance;
}

export default ComputerVisionService;
