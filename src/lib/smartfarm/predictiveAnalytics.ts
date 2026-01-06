// AgriNexus World OS - 예측 분석 & 디지털 트윈 시뮬레이션 엔진
// 실시간 예측, 시뮬레이션, 최적화

import { CropData, getCropById } from './cropDatabase';

// ============================================
// 타입 정의
// ============================================

export interface SensorData {
    timestamp: Date;
    temperature: number;
    humidity: number;
    co2: number;
    light: {
        ppfd: number;
        dli: number;
    };
    nutrient: {
        ph: number;
        ec: number;
        waterTemp: number;
    };
    soil?: {
        moisture: number;
        temperature: number;
    };
}

export interface PlantHealth {
    overall: number;            // 0-100
    growth: {
        rate: number;           // 예상 대비 %
        stage: number;
        daysToHarvest: number;
    };
    stress: {
        level: 'none' | 'mild' | 'moderate' | 'severe';
        factors: string[];
    };
    nutrition: {
        status: 'deficient' | 'optimal' | 'excess';
        issues: string[];
    };
    disease: {
        risk: number;           // 0-100
        detected: string[];
    };
}

export interface YieldPrediction {
    estimated: number;
    confidence: number;
    range: { min: number; max: number };
    factors: {
        name: string;
        impact: number;         // -100 to +100
        description: string;
    }[];
    harvestDate: {
        optimal: Date;
        earliest: Date;
        latest: Date;
    };
    quality: {
        grade: 'A' | 'B' | 'C';
        brix?: number;
        size?: string;
    };
}

export interface EnvironmentForecast {
    timestamp: Date;
    duration: number;           // hours
    predictions: {
        temperature: { value: number; confidence: number };
        humidity: { value: number; confidence: number };
        co2: { value: number; confidence: number };
        light: { value: number; confidence: number };
    };
    recommendations: {
        action: string;
        priority: 'low' | 'medium' | 'high';
        automated: boolean;
    }[];
    alerts: {
        type: 'warning' | 'critical';
        message: string;
        action: string;
    }[];
}

export interface SimulationScenario {
    id: string;
    name: string;
    description: string;
    parameters: {
        temperature?: number;
        humidity?: number;
        co2?: number;
        light?: number;
        ec?: number;
        duration?: number;      // days
    };
}

export interface SimulationResult {
    scenario: SimulationScenario;
    outcome: {
        yieldChange: number;    // %
        qualityChange: number;  // %
        costChange: number;     // %
        riskLevel: number;      // 0-100
    };
    timeline: {
        day: number;
        metrics: {
            growth: number;
            health: number;
            yield: number;
        };
    }[];
    insights: string[];
    recommendation: string;
}

export interface EnergyOptimization {
    current: {
        daily: number;          // kWh
        monthly: number;
        cost: number;
    };
    optimized: {
        daily: number;
        monthly: number;
        cost: number;
        savings: number;
    };
    recommendations: {
        action: string;
        savings: number;
        investment: number;
        payback: number;        // months
    }[];
    schedule: {
        hour: number;
        hvac: number;           // % power
        lighting: number;
        irrigation: number;
    }[];
}

// ============================================
// 예측 분석 엔진
// ============================================

export class PredictiveAnalyticsEngine {
    private cropId: string;
    private crop: CropData | undefined;
    private historicalData: SensorData[] = [];

    constructor(cropId: string) {
        this.cropId = cropId;
        this.crop = getCropById(cropId);
    }

    // 센서 데이터 추가
    addSensorData(data: SensorData): void {
        this.historicalData.push(data);
        // 최근 30일 데이터만 유지
        if (this.historicalData.length > 720) {
            this.historicalData.shift();
        }
    }

    // 식물 건강 분석
    analyzePlantHealth(currentData: SensorData, daysSincePlanting: number): PlantHealth {
        if (!this.crop) {
            throw new Error('Crop not found');
        }

        const tempDev = this.calculateDeviation(currentData.temperature, this.crop.cultivation.temperature);
        const humidityDev = this.calculateDeviation(currentData.humidity, this.crop.cultivation.humidity);
        const co2Dev = this.calculateDeviation(currentData.co2, this.crop.cultivation.co2);
        const phDev = this.calculateDeviation(currentData.nutrient.ph, this.crop.cultivation.ph);
        const ecDev = this.calculateDeviation(currentData.nutrient.ec, this.crop.cultivation.ec);

        // 스트레스 요인 분석
        const stressFactors: string[] = [];
        if (tempDev > 0.3) stressFactors.push('온도 편차');
        if (humidityDev > 0.3) stressFactors.push('습도 편차');
        if (co2Dev > 0.3) stressFactors.push('CO2 부적정');
        if (phDev > 0.2) stressFactors.push('pH 이상');
        if (ecDev > 0.3) stressFactors.push('EC 이상');

        const stressLevel = stressFactors.length === 0 ? 'none' :
            stressFactors.length <= 1 ? 'mild' :
                stressFactors.length <= 2 ? 'moderate' : 'severe';

        // 영양 상태
        let nutritionStatus: 'deficient' | 'optimal' | 'excess' = 'optimal';
        const nutritionIssues: string[] = [];

        if (currentData.nutrient.ec < this.crop.cultivation.ec.min) {
            nutritionStatus = 'deficient';
            nutritionIssues.push('양분 부족');
        } else if (currentData.nutrient.ec > this.crop.cultivation.ec.max) {
            nutritionStatus = 'excess';
            nutritionIssues.push('양분 과다');
        }

        // 병해 위험도
        const diseaseRisk = this.calculateDiseaseRisk(currentData);

        // 전체 건강 점수
        const overallHealth = Math.max(0, 100 -
            (tempDev * 15) -
            (humidityDev * 10) -
            (co2Dev * 10) -
            (phDev * 20) -
            (ecDev * 15) -
            (diseaseRisk * 0.3)
        );

        // 성장 단계 계산
        const currentStage = this.crop.growthStages.find(s =>
            daysSincePlanting >= s.daysFromStart &&
            daysSincePlanting < s.daysFromStart + s.duration
        ) || this.crop.growthStages[0];

        const daysToHarvest = Math.max(0, this.crop.cultivation.harvestDays - daysSincePlanting);

        // 성장률 계산 (환경 조건 기반)
        const growthRate = 100 - (tempDev * 20) - (humidityDev * 15) - (co2Dev * 10);

        return {
            overall: Math.round(overallHealth),
            growth: {
                rate: Math.round(growthRate),
                stage: currentStage.stage,
                daysToHarvest
            },
            stress: {
                level: stressLevel,
                factors: stressFactors
            },
            nutrition: {
                status: nutritionStatus,
                issues: nutritionIssues
            },
            disease: {
                risk: Math.round(diseaseRisk),
                detected: []
            }
        };
    }

    // 수확량 예측
    predictYield(currentData: SensorData, daysSincePlanting: number, areaM2: number): YieldPrediction {
        if (!this.crop) {
            throw new Error('Crop not found');
        }

        const health = this.analyzePlantHealth(currentData, daysSincePlanting);
        const baseYield = this.crop.economics.yieldPerM2.avg * areaM2;

        // 환경 요인에 따른 수확량 조정
        const environmentFactor = health.overall / 100;
        const stressFactor = health.stress.level === 'none' ? 1.0 :
            health.stress.level === 'mild' ? 0.95 :
                health.stress.level === 'moderate' ? 0.85 : 0.70;

        const estimatedYield = baseYield * environmentFactor * stressFactor;
        const confidence = 70 + (this.historicalData.length / 10);

        const factors: YieldPrediction['factors'] = [];

        if (environmentFactor < 0.9) {
            factors.push({
                name: '환경 조건',
                impact: Math.round((environmentFactor - 1) * 100),
                description: '현재 환경 조건이 최적에서 벗어남'
            });
        }

        if (stressFactor < 1) {
            factors.push({
                name: '스트레스',
                impact: Math.round((stressFactor - 1) * 100),
                description: `${health.stress.factors.join(', ')}로 인한 스트레스`
            });
        }

        if (health.nutrition.status !== 'optimal') {
            factors.push({
                name: '영양 상태',
                impact: health.nutrition.status === 'deficient' ? -15 : -10,
                description: health.nutrition.issues.join(', ')
            });
        }

        const now = new Date();
        const optimalHarvest = new Date(now.getTime() + health.growth.daysToHarvest * 86400000);

        return {
            estimated: Math.round(estimatedYield * 10) / 10,
            confidence: Math.min(95, Math.round(confidence)),
            range: {
                min: Math.round(estimatedYield * 0.85 * 10) / 10,
                max: Math.round(estimatedYield * 1.15 * 10) / 10
            },
            factors,
            harvestDate: {
                optimal: optimalHarvest,
                earliest: new Date(optimalHarvest.getTime() - 5 * 86400000),
                latest: new Date(optimalHarvest.getTime() + 7 * 86400000)
            },
            quality: {
                grade: health.overall > 85 ? 'A' : health.overall > 70 ? 'B' : 'C',
                brix: this.crop.category === 'berry' ? 10 + (health.overall / 20) : undefined
            }
        };
    }

    // 환경 예측
    forecastEnvironment(currentData: SensorData, hoursAhead: number): EnvironmentForecast {
        const predictions = {
            temperature: this.predictValue(currentData.temperature, 2),
            humidity: this.predictValue(currentData.humidity, 5),
            co2: this.predictValue(currentData.co2, 50),
            light: this.predictValue(currentData.light.ppfd, 30)
        };

        const recommendations: EnvironmentForecast['recommendations'] = [];
        const alerts: EnvironmentForecast['alerts'] = [];

        if (this.crop) {
            // 온도 경고
            if (predictions.temperature.value > this.crop.cultivation.temperature.max) {
                alerts.push({
                    type: 'warning',
                    message: `온도 ${predictions.temperature.value}°C 예상 - 최대 ${this.crop.cultivation.temperature.max}°C 초과`,
                    action: '냉방 시스템 가동 권장'
                });
                recommendations.push({
                    action: '냉방 사전 가동',
                    priority: 'high',
                    automated: true
                });
            }

            // 습도 경고
            if (predictions.humidity.value > this.crop.cultivation.humidity.max) {
                recommendations.push({
                    action: '제습 시스템 가동',
                    priority: 'medium',
                    automated: true
                });
            }

            // CO2 경고
            if (predictions.co2.value < this.crop.cultivation.co2.min) {
                recommendations.push({
                    action: 'CO2 공급 증가',
                    priority: 'medium',
                    automated: true
                });
            }
        }

        return {
            timestamp: new Date(),
            duration: hoursAhead,
            predictions,
            recommendations,
            alerts
        };
    }

    // 시뮬레이션 실행
    runSimulation(scenario: SimulationScenario, durationDays: number = 30): SimulationResult {
        if (!this.crop) {
            throw new Error('Crop not found');
        }

        const timeline: SimulationResult['timeline'] = [];
        let cumulativeGrowth = 0;
        let cumulativeHealth = 100;
        let cumulativeYield = 100;

        for (let day = 1; day <= durationDays; day++) {
            // 시뮬레이션 파라미터 적용
            const tempEffect = scenario.parameters.temperature
                ? this.calculateDeviation(scenario.parameters.temperature, this.crop.cultivation.temperature)
                : 0;
            const humidityEffect = scenario.parameters.humidity
                ? this.calculateDeviation(scenario.parameters.humidity, this.crop.cultivation.humidity)
                : 0;

            const dailyGrowth = 100 - (tempEffect * 30) - (humidityEffect * 20);
            cumulativeGrowth = (cumulativeGrowth + dailyGrowth) / 2;
            cumulativeHealth = Math.max(0, cumulativeHealth - (tempEffect + humidityEffect) * 2);
            cumulativeYield = cumulativeGrowth * 0.7 + cumulativeHealth * 0.3;

            timeline.push({
                day,
                metrics: {
                    growth: Math.round(cumulativeGrowth),
                    health: Math.round(cumulativeHealth),
                    yield: Math.round(cumulativeYield)
                }
            });
        }

        const finalMetrics = timeline[timeline.length - 1].metrics;
        const insights: string[] = [];

        if (finalMetrics.yield < 80) {
            insights.push('이 시나리오에서는 수확량이 20% 이상 감소할 수 있습니다.');
        }
        if (finalMetrics.health < 70) {
            insights.push('식물 건강에 심각한 영향이 예상됩니다.');
        }
        if (finalMetrics.growth > 95) {
            insights.push('현재 조건이 최적에 가깝습니다.');
        }

        return {
            scenario,
            outcome: {
                yieldChange: Math.round(finalMetrics.yield - 100),
                qualityChange: Math.round(finalMetrics.health - 100),
                costChange: scenario.parameters.temperature && scenario.parameters.temperature > this.crop.cultivation.temperature.optimal ? 15 : 0,
                riskLevel: 100 - Math.min(finalMetrics.health, finalMetrics.yield)
            },
            timeline,
            insights,
            recommendation: finalMetrics.yield >= 90
                ? '이 시나리오는 적합합니다.'
                : '환경 조건 조정이 필요합니다.'
        };
    }

    // 에너지 최적화 분석
    analyzeEnergyOptimization(currentUsage: { hvac: number; lighting: number; irrigation: number; other: number }): EnergyOptimization {
        const totalDaily = currentUsage.hvac + currentUsage.lighting + currentUsage.irrigation + currentUsage.other;
        const energyCost = 120; // 원/kWh
        const currentCost = totalDaily * 30 * energyCost;

        // 최적화 스케줄 생성
        const schedule: EnergyOptimization['schedule'] = [];
        for (let hour = 0; hour < 24; hour++) {
            // 야간 (22-06): 조명 75%, HVAC 60%
            // 주간 피크 (14-18): 조명 100%, HVAC 100%
            // 기타 시간: 조명 85%, HVAC 80%

            let hvac = 80, lighting = 85, irrigation = 50;

            if (hour >= 22 || hour < 6) {
                hvac = 60;
                lighting = 75;
                irrigation = 30;
            } else if (hour >= 14 && hour < 18) {
                hvac = 100;
                lighting = 100;
                irrigation = 70;
            }

            schedule.push({ hour, hvac, lighting, irrigation });
        }

        // 절감 효과 계산
        const avgReduction = 0.15; // 15% 평균 절감
        const optimizedDaily = totalDaily * (1 - avgReduction);
        const optimizedCost = optimizedDaily * 30 * energyCost;

        const recommendations: EnergyOptimization['recommendations'] = [
            {
                action: 'LED 조명 효율 모드 적용',
                savings: currentUsage.lighting * 0.2 * 30 * energyCost,
                investment: 0,
                payback: 0
            },
            {
                action: '야간 HVAC 스케줄링',
                savings: currentUsage.hvac * 0.15 * 30 * energyCost,
                investment: 500000,
                payback: 3
            },
            {
                action: '인버터 모터 업그레이드',
                savings: (currentUsage.hvac + currentUsage.irrigation) * 0.3 * 30 * energyCost,
                investment: 5000000,
                payback: 12
            }
        ];

        return {
            current: {
                daily: totalDaily,
                monthly: totalDaily * 30,
                cost: currentCost
            },
            optimized: {
                daily: Math.round(optimizedDaily * 10) / 10,
                monthly: Math.round(optimizedDaily * 30),
                cost: Math.round(optimizedCost),
                savings: Math.round(currentCost - optimizedCost)
            },
            recommendations,
            schedule
        };
    }

    // 유틸리티 함수들
    private calculateDeviation(value: number, range: { min: number; max: number; optimal: number }): number {
        if (value >= range.min && value <= range.max) {
            return Math.abs(value - range.optimal) / (range.max - range.min);
        }
        if (value < range.min) {
            return 0.5 + (range.min - value) / range.min;
        }
        return 0.5 + (value - range.max) / range.max;
    }

    private calculateDiseaseRisk(data: SensorData): number {
        let risk = 0;

        // 고습도 = 곰팡이 위험 증가
        if (data.humidity > 85) {
            risk += 30;
        } else if (data.humidity > 75) {
            risk += 15;
        }

        // 온도 변동 = 스트레스로 인한 질병 취약
        // 저조도 = 생장 저하로 질병 취약
        if (data.light.ppfd < 200) {
            risk += 20;
        }

        return Math.min(100, risk);
    }

    private predictValue(current: number, variance: number): { value: number; confidence: number } {
        // 간단한 선형 예측 (실제로는 ML 모델 사용)
        const trend = this.historicalData.length > 10
            ? (this.historicalData[this.historicalData.length - 1].temperature -
                this.historicalData[this.historicalData.length - 10].temperature) / 10
            : 0;

        return {
            value: Math.round((current + trend * 4) * 10) / 10,
            confidence: 75 + Math.min(20, this.historicalData.length)
        };
    }
}

// ============================================
// 사전 정의 시뮬레이션 시나리오
// ============================================

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
    {
        id: 'heat-wave',
        name: '폭염 시나리오',
        description: '외부 온도 35°C 이상 지속 상황',
        parameters: { temperature: 32, humidity: 50, duration: 7 }
    },
    {
        id: 'power-outage',
        name: '정전 시나리오',
        description: '4시간 정전으로 환경 제어 중단',
        parameters: { light: 0, duration: 1 }
    },
    {
        id: 'optimal',
        name: '최적 조건',
        description: '모든 환경 요소가 최적 범위 유지',
        parameters: { temperature: 22, humidity: 70, co2: 1000, light: 400 }
    },
    {
        id: 'cold-snap',
        name: '한파 시나리오',
        description: '외부 온도 -10°C 이하 상황',
        parameters: { temperature: 15, humidity: 80, duration: 5 }
    },
    {
        id: 'nutrient-boost',
        name: '양액 농도 증가',
        description: 'EC 20% 증가 효과 분석',
        parameters: { ec: 1.8, duration: 14 }
    }
];

// 팩토리 함수
export function createPredictiveEngine(cropId: string): PredictiveAnalyticsEngine {
    return new PredictiveAnalyticsEngine(cropId);
}
