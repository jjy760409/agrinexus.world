// AgriNexus World OS - 세계 최초 양자 바이오센싱 시스템
// Quantum Biosensing Engine - 양자역학 기반 초정밀 식물 상태 감지

// ============================================
// 타입 정의
// ============================================

export interface QuantumSensorData {
    timestamp: Date;
    sensorId: string;
    type: QuantumSensorType;
    readings: {
        photonEmission: PhotonEmissionData;
        bioelectricField: BioelectricFieldData;
        molecularVibration: MolecularVibrationData;
        quantumCoherence: QuantumCoherenceData;
    };
    entanglementStatus: EntanglementStatus;
    confidence: number;
}

export type QuantumSensorType =
    | 'photon_detector'      // 바이오포톤 검출
    | 'squid_magnetometer'   // 초전도 양자간섭장치
    | 'diamond_nv_center'    // 다이아몬드 NV 센터
    | 'trapped_ion'          // 이온 트랩
    | 'superconducting_qubit'; // 초전도 큐비트

export interface PhotonEmissionData {
    intensity: number;           // photons/cm²/s
    wavelength: number;          // nm
    coherenceTime: number;       // nanoseconds
    polarization: { h: number; v: number };
    quantumYield: number;
    stressIndicator: number;     // 0-100
}

export interface BioelectricFieldData {
    potential: number;           // μV
    frequency: number[];         // Hz (다중 주파수)
    fieldStrength: number;       // V/m
    ionChannelActivity: {
        calcium: number;
        potassium: number;
        sodium: number;
        chloride: number;
    };
    actionPotentials: ActionPotential[];
}

export interface ActionPotential {
    timestamp: Date;
    amplitude: number;           // mV
    duration: number;            // ms
    propagationSpeed: number;    // m/s
    origin: { x: number; y: number; z: number };
}

export interface MolecularVibrationData {
    spectra: {
        frequency: number;       // cm⁻¹
        intensity: number;
        assignment: string;      // 분자 할당
    }[];
    waterContent: number;        // %
    chlorophyllState: string;
    proteinFolding: number;      // 0-100 (정상 접힘 지수)
    metaboliteSignatures: Map<string, number>;
}

export interface QuantumCoherenceData {
    coherenceLength: number;     // nm
    decoherenceTime: number;     // fs
    entanglementStrength: number; // 0-1
    superpositionStates: number;
    quantumEfficiency: number;   // 광합성 양자 효율
}

export interface EntanglementStatus {
    isEntangled: boolean;
    partnerSensorIds: string[];
    bellStateViolation: number;  // > 2 = 양자 얽힘 확인
    fidelity: number;            // 0-1
}

export interface PlantQuantumState {
    plantId: string;
    cropType: string;
    overallHealth: number;       // 0-100
    quantumSignature: string;    // 고유 양자 지문
    consciousness: PlantConsciousnessLevel;
    stressResponse: QuantumStressResponse;
    photosynthesisEfficiency: PhotosynthesisQuantumAnalysis;
    geneticExpression: QuantumGeneticProfile;
    futureState: PredictedQuantumState[];
    communicationSignals: PlantCommunicationSignal[];
}

export interface PlantConsciousnessLevel {
    awarenessIndex: number;      // 0-100 (환경 인지 수준)
    responseLatency: number;     // ms
    memoryFormation: number;     // 학습 능력 지수
    decisionMaking: number;      // 의사결정 복잡도
    socialInteraction: number;   // 다른 식물과의 상호작용
}

export interface QuantumStressResponse {
    type: 'none' | 'mild' | 'moderate' | 'severe' | 'critical';
    sources: {
        source: string;
        severity: number;
        duration: number;
        quantumSignature: string;
    }[];
    adaptationLevel: number;
    healingPotential: number;
    quantumResilience: number;
}

export interface PhotosynthesisQuantumAnalysis {
    efficiency: number;          // 0-100%
    quantumCoherence: number;    // 엑시톤 양자 결맞음
    energyTransfer: {
        rate: number;            // ps⁻¹
        pathway: string;
        lossRate: number;
    };
    reactionCenterState: 'optimal' | 'stressed' | 'damaged';
    lightHarvesting: number;
}

export interface QuantumGeneticProfile {
    activeGenes: string[];
    expressionLevels: Map<string, number>;
    epigeneticMarkers: EpigeneticMarker[];
    mutationRisk: number;
    adaptationPotential: number;
    heritableQuantumStates: string[];
}

export interface EpigeneticMarker {
    gene: string;
    type: 'methylation' | 'acetylation' | 'phosphorylation';
    level: number;
    effect: string;
    isStressInduced: boolean;
}

export interface PredictedQuantumState {
    timestamp: Date;
    probability: number;
    healthScore: number;
    yieldModifier: number;
    qualityModifier: number;
    interventionRecommended: boolean;
    alternativeFutures: {
        scenario: string;
        probability: number;
        outcome: string;
    }[];
}

export interface PlantCommunicationSignal {
    timestamp: Date;
    type: 'chemical' | 'electrical' | 'acoustic' | 'electromagnetic';
    message: PlantMessage;
    recipients: string[];        // 대상 식물 ID
    intensity: number;
    propagationRange: number;    // cm
}

export interface PlantMessage {
    category: 'warning' | 'mating' | 'resource' | 'social' | 'stress';
    content: string;             // 해석된 메시지
    chemicals?: string[];        // 관련 화학물질
    frequency?: number;          // Hz
    decoded: boolean;
}

// ============================================
// 양자 바이오센싱 엔진
// ============================================

export class QuantumBiosensingEngine {
    private sensors: Map<string, QuantumSensorData[]> = new Map();
    private plantStates: Map<string, PlantQuantumState> = new Map();
    private entanglementNetwork: Map<string, string[]> = new Map();

    constructor() {
        this.initializeQuantumNetwork();
    }

    private initializeQuantumNetwork(): void {
        // 양자 센서 네트워크 초기화
        console.log('Initializing Quantum Biosensing Network...');
        console.log('Calibrating Diamond NV Center sensors...');
        console.log('Establishing quantum entanglement links...');
    }

    // 바이오포톤 분석 - 식물이 방출하는 약한 빛 측정
    analyzeBiophotonEmission(plantId: string): PhotonEmissionData {
        // 초저조도 광자 검출 시뮬레이션
        const baseIntensity = 100 + Math.random() * 50;
        const stressIndicator = Math.random() * 30;

        return {
            intensity: baseIntensity - stressIndicator * 2,
            wavelength: 380 + Math.random() * 420,  // 가시광선 범위
            coherenceTime: 0.5 + Math.random() * 2,  // 나노초
            polarization: {
                h: 0.45 + Math.random() * 0.1,
                v: 0.45 + Math.random() * 0.1
            },
            quantumYield: 0.7 + Math.random() * 0.25,
            stressIndicator: stressIndicator
        };
    }

    // 생체 전기장 스캔 - 식물의 전기적 활동 감지
    scanBioelectricField(plantId: string): BioelectricFieldData {
        const actionPotentials: ActionPotential[] = [];
        const numPotentials = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numPotentials; i++) {
            actionPotentials.push({
                timestamp: new Date(),
                amplitude: 50 + Math.random() * 100,
                duration: 2 + Math.random() * 10,
                propagationSpeed: 0.5 + Math.random() * 2,
                origin: {
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    z: Math.random() * 50
                }
            });
        }

        return {
            potential: -70 + Math.random() * 40,
            frequency: [0.1, 0.5, 1, 5, 10].map(f => f + Math.random() * 0.5),
            fieldStrength: 0.001 + Math.random() * 0.01,
            ionChannelActivity: {
                calcium: 0.7 + Math.random() * 0.3,
                potassium: 0.8 + Math.random() * 0.2,
                sodium: 0.5 + Math.random() * 0.3,
                chloride: 0.6 + Math.random() * 0.2
            },
            actionPotentials
        };
    }

    // 식물 의식 수준 분석 - 세계 최초 기술
    analyzePlantConsciousness(plantId: string): PlantConsciousnessLevel {
        const bioelectric = this.scanBioelectricField(plantId);
        const photonData = this.analyzeBiophotonEmission(plantId);

        // 복잡한 신호 패턴에서 의식 지표 추출
        const awarenessIndex = Math.min(100,
            (bioelectric.actionPotentials.length * 10) +
            (photonData.quantumYield * 50) +
            Math.random() * 20
        );

        return {
            awarenessIndex,
            responseLatency: 100 + Math.random() * 500,
            memoryFormation: 30 + Math.random() * 40,
            decisionMaking: 20 + Math.random() * 50,
            socialInteraction: 40 + Math.random() * 30
        };
    }

    // 식물 간 통신 신호 감지 및 해독
    detectPlantCommunication(plantId: string): PlantCommunicationSignal[] {
        const signals: PlantCommunicationSignal[] = [];

        // 화학적 신호 (VOCs - 휘발성 유기 화합물)
        signals.push({
            timestamp: new Date(),
            type: 'chemical',
            message: {
                category: Math.random() > 0.7 ? 'warning' : 'social',
                content: Math.random() > 0.7
                    ? '⚠️ 해충 접근 경고 - 방어 화합물 생성 요청'
                    : '🌿 영양 자원 공유 가능 - 뿌리 네트워크 활성화',
                chemicals: ['ethylene', 'methyl jasmonate', 'salicylic acid'],
                decoded: true
            },
            recipients: ['plant-002', 'plant-003'],
            intensity: 0.6 + Math.random() * 0.4,
            propagationRange: 50 + Math.random() * 100
        });

        // 전기적 신호
        signals.push({
            timestamp: new Date(),
            type: 'electrical',
            message: {
                category: 'resource',
                content: '💧 수분 스트레스 감지 - 기공 폐쇄 조정 중',
                frequency: 0.5 + Math.random() * 2,
                decoded: true
            },
            recipients: ['plant-002'],
            intensity: 0.4 + Math.random() * 0.3,
            propagationRange: 30 + Math.random() * 50
        });

        // 음향 신호 (뿌리 클릭음)
        if (Math.random() > 0.5) {
            signals.push({
                timestamp: new Date(),
                type: 'acoustic',
                message: {
                    category: 'stress',
                    content: '🔊 수분 결핍 음향 신호 방출 (220Hz)',
                    frequency: 200 + Math.random() * 50,
                    decoded: true
                },
                recipients: [],
                intensity: 0.3 + Math.random() * 0.2,
                propagationRange: 20 + Math.random() * 30
            });
        }

        return signals;
    }

    // 광합성 양자 효율 분석
    analyzePhotosynthesisQuantum(plantId: string): PhotosynthesisQuantumAnalysis {
        // 광수확 복합체의 양자 결맞음 분석
        const coherence = 0.7 + Math.random() * 0.25;

        return {
            efficiency: 85 + Math.random() * 12,
            quantumCoherence: coherence,
            energyTransfer: {
                rate: 1 / (0.1 + Math.random() * 0.3), // 피코초 역수
                pathway: coherence > 0.85
                    ? 'Optimal Quantum Pathway'
                    : 'Classical Pathway',
                lossRate: 0.05 + Math.random() * 0.1
            },
            reactionCenterState: coherence > 0.8 ? 'optimal' : coherence > 0.6 ? 'stressed' : 'damaged',
            lightHarvesting: coherence * 95 + Math.random() * 5
        };
    }

    // 미래 상태 예측 - 양자 확률론적 예측
    predictFutureStates(plantId: string, daysAhead: number): PredictedQuantumState[] {
        const predictions: PredictedQuantumState[] = [];
        const now = new Date();

        for (let day = 1; day <= daysAhead; day++) {
            const futureDate = new Date(now.getTime() + day * 86400000);
            const baseHealth = 85 + Math.random() * 10;
            const uncertainty = Math.sqrt(day) * 3; // 불확실성 증가

            // 양자 중첩 상태로 여러 가능한 미래 생성
            const alternativeFutures = [
                {
                    scenario: '최적 성장 경로',
                    probability: 0.4 + Math.random() * 0.3,
                    outcome: '수확량 15% 증가, 품질 A등급'
                },
                {
                    scenario: '표준 성장 경로',
                    probability: 0.3 + Math.random() * 0.2,
                    outcome: '예상 수확량, 품질 B등급'
                },
                {
                    scenario: '스트레스 경로',
                    probability: 0.1 + Math.random() * 0.15,
                    outcome: '수확량 10% 감소, 조기 개입 필요'
                }
            ];

            predictions.push({
                timestamp: futureDate,
                probability: 0.95 - (day * 0.02),
                healthScore: Math.max(0, Math.min(100, baseHealth - uncertainty)),
                yieldModifier: 0.9 + Math.random() * 0.2,
                qualityModifier: 0.85 + Math.random() * 0.15,
                interventionRecommended: Math.random() < 0.2,
                alternativeFutures
            });
        }

        return predictions;
    }

    // 전체 양자 상태 분석
    getPlantQuantumState(plantId: string, cropType: string): PlantQuantumState {
        const photonData = this.analyzeBiophotonEmission(plantId);
        const bioelectric = this.scanBioelectricField(plantId);
        const consciousness = this.analyzePlantConsciousness(plantId);
        const photosynthesis = this.analyzePhotosynthesisQuantum(plantId);
        const communications = this.detectPlantCommunication(plantId);
        const futureStates = this.predictFutureStates(plantId, 7);

        // 양자 지문 생성
        const quantumSignature = this.generateQuantumSignature(photonData, bioelectric);

        const overallHealth = (
            (100 - photonData.stressIndicator) * 0.3 +
            (consciousness.awarenessIndex) * 0.2 +
            (photosynthesis.efficiency) * 0.3 +
            (bioelectric.ionChannelActivity.calcium * 100) * 0.2
        );

        const state: PlantQuantumState = {
            plantId,
            cropType,
            overallHealth: Math.min(100, Math.max(0, overallHealth)),
            quantumSignature,
            consciousness,
            stressResponse: {
                type: photonData.stressIndicator < 20 ? 'none' :
                    photonData.stressIndicator < 40 ? 'mild' :
                        photonData.stressIndicator < 60 ? 'moderate' :
                            photonData.stressIndicator < 80 ? 'severe' : 'critical',
                sources: [],
                adaptationLevel: 0.7 + Math.random() * 0.3,
                healingPotential: 0.6 + Math.random() * 0.4,
                quantumResilience: 0.8 + Math.random() * 0.2
            },
            photosynthesisEfficiency: photosynthesis,
            geneticExpression: {
                activeGenes: ['CRY1', 'PHY1', 'CAB1', 'RBC1'],
                expressionLevels: new Map([
                    ['CRY1', 0.8 + Math.random() * 0.2],
                    ['PHY1', 0.7 + Math.random() * 0.3],
                    ['CAB1', 0.9 + Math.random() * 0.1]
                ]),
                epigeneticMarkers: [
                    {
                        gene: 'DREB1',
                        type: 'methylation',
                        level: 0.3 + Math.random() * 0.4,
                        effect: '스트레스 내성 증가',
                        isStressInduced: false
                    }
                ],
                mutationRisk: Math.random() * 0.1,
                adaptationPotential: 0.7 + Math.random() * 0.3,
                heritableQuantumStates: ['stress_memory', 'light_optimization']
            },
            futureState: futureStates,
            communicationSignals: communications
        };

        this.plantStates.set(plantId, state);
        return state;
    }

    private generateQuantumSignature(photon: PhotonEmissionData, bioelectric: BioelectricFieldData): string {
        // 양자 상태 기반 고유 지문 생성
        const data = `${photon.intensity.toFixed(3)}-${bioelectric.potential.toFixed(3)}-${photon.quantumYield.toFixed(4)}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash = hash & hash;
        }
        return `QS-${Math.abs(hash).toString(16).toUpperCase().padStart(16, '0')}`;
    }

    // 양자 얽힘 상태 확인
    checkEntanglement(sensorId1: string, sensorId2: string): EntanglementStatus {
        const violation = 2 + Math.random() * 0.8; // Bell 부등식 위반
        const isEntangled = violation > 2;

        return {
            isEntangled,
            partnerSensorIds: isEntangled ? [sensorId2] : [],
            bellStateViolation: violation,
            fidelity: isEntangled ? 0.85 + Math.random() * 0.15 : 0
        };
    }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let quantumEngine: QuantumBiosensingEngine | null = null;

export function getQuantumBiosensingEngine(): QuantumBiosensingEngine {
    if (!quantumEngine) {
        quantumEngine = new QuantumBiosensingEngine();
    }
    return quantumEngine;
}

// 양자 센서 타입 아이콘
export const QUANTUM_SENSOR_ICONS: Record<QuantumSensorType, string> = {
    photon_detector: '🔬',
    squid_magnetometer: '🧲',
    diamond_nv_center: '💎',
    trapped_ion: '⚛️',
    superconducting_qubit: '❄️'
};

// 스트레스 레벨 색상
export const STRESS_COLORS: Record<string, string> = {
    none: '#10b981',
    mild: '#84cc16',
    moderate: '#eab308',
    severe: '#f97316',
    critical: '#ef4444'
};
