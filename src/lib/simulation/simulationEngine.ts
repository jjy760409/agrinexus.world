// AgriNexus World OS - 고급 디지털 트윈 시뮬레이션 엔진
// 물리 기반 정밀 시뮬레이션 및 예측 분석

// ============================================
// 타입 정의
// ============================================

export interface SimulationConfig {
    farmId: string;
    duration: number;          // 시뮬레이션 기간 (일)
    timeStep: number;          // 시간 단위 (시간)
    initialState: FarmState;
    scenarios: Scenario[];
    randomSeed?: number;
}

export interface FarmState {
    timestamp: Date;
    environment: EnvironmentParameters;
    plants: PlantState[];
    resources: ResourceState;
    equipment: EquipmentState[];
    economics: EconomicState;
}

export interface EnvironmentParameters {
    temperature: number;
    humidity: number;
    co2: number;
    light: number;
    vpd: number;
    outsideTemp: number;
    outsideHumidity: number;
    windSpeed: number;
    cloudCover: number;
    rainProbability: number;
    season: 'spring' | 'summer' | 'fall' | 'winter';
}

export interface PlantState {
    id: string;
    variety: string;
    zone: string;
    plantedDate: Date;
    growthStage: number;       // 0-100%
    biomass: number;           // kg
    height: number;            // cm
    leafArea: number;          // m²
    health: number;            // 0-100
    stressLevel: number;       // 0-100
    waterContent: number;      // %
    nutrientStatus: {
        nitrogen: number;
        phosphorus: number;
        potassium: number;
        calcium: number;
        magnesium: number;
    };
    yieldPotential: number;    // kg
    harvestReady: boolean;
}

export interface ResourceState {
    water: {
        available: number;       // L
        dailyUsage: number;
        recycleRate: number;
    };
    energy: {
        solarGeneration: number;
        gridConsumption: number;
        batteryLevel: number;
        dailyCost: number;
    };
    nutrients: {
        concentrateA: number;
        concentrateB: number;
        phUp: number;
        phDown: number;
    };
    co2Tank: number;
}

export interface EquipmentState {
    id: string;
    type: string;
    status: 'running' | 'idle' | 'maintenance' | 'error';
    efficiency: number;
    uptime: number;
    lastMaintenance: Date;
    nextMaintenance: Date;
}

export interface EconomicState {
    operatingCosts: {
        energy: number;
        water: number;
        nutrients: number;
        labor: number;
        maintenance: number;
        total: number;
    };
    revenue: {
        projected: number;
        realized: number;
    };
    inventory: {
        harvestedKg: number;
        soldKg: number;
        wasteKg: number;
    };
}

export interface Scenario {
    id: string;
    name: string;
    type: 'baseline' | 'optimistic' | 'pessimistic' | 'what_if' | 'stress_test';
    modifications: ScenarioModification[];
}

export interface ScenarioModification {
    parameter: string;
    operation: 'set' | 'add' | 'multiply';
    value: number;
    startTime?: number;
    endTime?: number;
}

export interface SimulationResult {
    scenarioId: string;
    scenarioName: string;
    timeSeriesData: TimeSeriesPoint[];
    summary: SimulationSummary;
    predictions: Prediction[];
    risks: RiskAssessment[];
    recommendations: string[];
}

export interface TimeSeriesPoint {
    timestamp: Date;
    day: number;
    hour: number;
    state: Partial<FarmState>;
}

export interface SimulationSummary {
    totalYield: number;
    avgHealth: number;
    totalCost: number;
    totalRevenue: number;
    roi: number;
    waterEfficiency: number;
    energyEfficiency: number;
    carbonFootprint: number;
    peakStressLevel: number;
    harvestCount: number;
}

export interface Prediction {
    type: 'yield' | 'harvest_date' | 'cost' | 'revenue' | 'risk';
    value: number | Date;
    confidence: number;
    range: { min: number | Date; max: number | Date };
}

export interface RiskAssessment {
    type: string;
    probability: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    mitigation: string;
}

// ============================================
// 물리 모델 상수
// ============================================

const PHYSICS = {
    // 광합성 모델
    PHOTOSYNTHESIS_RATE: 0.02,          // mol CO2/m²/s per PPFD
    LIGHT_SATURATION: 800,              // PPFD
    LIGHT_COMPENSATION: 50,             // PPFD

    // 호흡 모델
    DARK_RESPIRATION: 0.001,            // mol CO2/m²/s
    Q10_RESPIRATION: 2.0,               // 온도 계수

    // 증산 모델
    STOMATAL_CONDUCTANCE: 0.3,          // mol/m²/s
    BOUNDARY_LAYER: 0.01,               // m/s

    // 성장 모델
    MAX_GROWTH_RATE: 0.05,              // kg/day per plant
    THERMAL_TIME_BASE: 10,              // °C

    // 물 관련
    WATER_USE_EFFICIENCY: 4,            // g biomass/L water
    WILTING_POINT: 30,                  // % soil moisture

    // 영양소
    N_UPTAKE_RATE: 0.01,                // g N/day per plant
    CRITICAL_N_CONTENT: 3,              // % dry weight
};

// ============================================
// 시뮬레이션 엔진 클래스
// ============================================

class SimulationEngine {
    private currentSimulation: SimulationConfig | null = null;
    private results: Map<string, SimulationResult> = new Map();
    private isRunning = false;
    private progress = 0;

    // 시뮬레이션 실행
    async runSimulation(config: SimulationConfig): Promise<SimulationResult[]> {
        this.currentSimulation = config;
        this.isRunning = true;
        this.progress = 0;

        console.log(`🔬 시뮬레이션 시작: ${config.duration}일, ${config.scenarios.length}개 시나리오`);

        const results: SimulationResult[] = [];

        for (const scenario of config.scenarios) {
            const result = await this.runScenario(config, scenario);
            results.push(result);
            this.results.set(scenario.id, result);
        }

        this.isRunning = false;
        this.progress = 100;

        console.log('✅ 시뮬레이션 완료');

        return results;
    }

    private async runScenario(config: SimulationConfig, scenario: Scenario): Promise<SimulationResult> {
        const timeSeriesData: TimeSeriesPoint[] = [];
        let currentState = this.cloneState(config.initialState);

        const totalSteps = config.duration * 24 / config.timeStep;

        for (let step = 0; step < totalSteps; step++) {
            // 시나리오 수정 적용
            currentState = this.applyScenarioModifications(currentState, scenario, step, config.timeStep);

            // 물리 시뮬레이션
            currentState = this.simulateStep(currentState, config.timeStep);

            // 시계열 데이터 저장 (매시간)
            if (step % (1 / config.timeStep) === 0) {
                timeSeriesData.push({
                    timestamp: new Date(currentState.timestamp),
                    day: Math.floor(step * config.timeStep / 24),
                    hour: (step * config.timeStep) % 24,
                    state: this.extractKeyMetrics(currentState)
                });
            }

            // 진행률 업데이트
            this.progress = ((config.scenarios.indexOf(scenario) * totalSteps + step) /
                (config.scenarios.length * totalSteps)) * 100;

            // 비동기 처리 (UI 블로킹 방지)
            if (step % 100 === 0) {
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }

        return {
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            timeSeriesData,
            summary: this.calculateSummary(timeSeriesData, currentState),
            predictions: this.generatePredictions(timeSeriesData),
            risks: this.assessRisks(timeSeriesData),
            recommendations: this.generateRecommendations(timeSeriesData)
        };
    }

    private simulateStep(state: FarmState, timeStep: number): FarmState {
        const newState = this.cloneState(state);

        // 시간 진행
        newState.timestamp = new Date(state.timestamp.getTime() + timeStep * 3600 * 1000);
        const hour = newState.timestamp.getHours();

        // 외부 환경 시뮬레이션
        newState.environment = this.simulateEnvironment(newState.environment, hour);

        // 각 식물 시뮬레이션
        newState.plants = newState.plants.map(plant =>
            this.simulatePlant(plant, newState.environment, timeStep)
        );

        // 자원 소비 시뮬레이션
        newState.resources = this.simulateResources(newState.resources, newState.plants, newState.environment);

        // 장비 상태 시뮬레이션
        newState.equipment = newState.equipment.map(eq => this.simulateEquipment(eq, timeStep));

        // 경제 상태 업데이트
        newState.economics = this.updateEconomics(newState.economics, newState.resources, newState.plants);

        return newState;
    }

    // 환경 시뮬레이션
    private simulateEnvironment(env: EnvironmentParameters, hour: number): EnvironmentParameters {
        const newEnv = { ...env };

        // 일주기 온도 변화
        const tempAmplitude = 3;
        newEnv.temperature += Math.sin((hour - 14) * Math.PI / 12) * tempAmplitude * 0.1;

        // 습도 변화 (온도와 반비례)
        newEnv.humidity -= (newEnv.temperature - 22) * 0.5;
        newEnv.humidity = Math.max(40, Math.min(90, newEnv.humidity));

        // VPD 재계산
        const svp = 0.6108 * Math.exp((17.27 * newEnv.temperature) / (newEnv.temperature + 237.3));
        newEnv.vpd = svp * (1 - newEnv.humidity / 100);

        // 조명 (자연광 + 인공광)
        if (hour >= 6 && hour <= 20) {
            const solarAngle = Math.sin((hour - 6) * Math.PI / 14);
            newEnv.light = 200 + solarAngle * 400 * (1 - newEnv.cloudCover);
        } else {
            newEnv.light = 50; // 야간 최소 조명
        }

        // CO2 변화 (광합성에 따른 소비)
        if (newEnv.light > 100) {
            newEnv.co2 = Math.max(400, newEnv.co2 - 5);
        } else {
            newEnv.co2 = Math.min(1500, newEnv.co2 + 2);
        }

        return newEnv;
    }

    // 식물 성장 시뮬레이션
    private simulatePlant(plant: PlantState, env: EnvironmentParameters, timeStep: number): PlantState {
        const newPlant = { ...plant };

        // 광합성 계산
        const photosynthesisRate = this.calculatePhotosynthesis(env.light, env.co2, env.temperature);

        // 호흡 계산
        const respirationRate = this.calculateRespiration(env.temperature);

        // 순 탄소 고정
        const netCarbon = (photosynthesisRate - respirationRate) * plant.leafArea * timeStep;

        // 바이오매스 증가
        const biomassGain = Math.max(0, netCarbon * 0.6); // 탄소 → 바이오매스 변환
        newPlant.biomass += biomassGain;

        // 높이 증가
        newPlant.height += biomassGain * 2;

        // 잎 면적 증가
        newPlant.leafArea += biomassGain * 0.1;

        // 성장 단계 진행
        const ageDays = (Date.now() - plant.plantedDate.getTime()) / (24 * 3600 * 1000);
        newPlant.growthStage = Math.min(100, ageDays / 35 * 100); // 35일 기준

        // 수분 스트레스
        const optimalVPD = 1.0;
        const vpdStress = Math.abs(env.vpd - optimalVPD) * 20;
        newPlant.stressLevel = Math.min(100, vpdStress);

        // 건강 점수
        const tempOptimal = 23;
        const tempStress = Math.abs(env.temperature - tempOptimal) * 2;
        newPlant.health = Math.max(0, 100 - vpdStress - tempStress);

        // 영양소 소비
        newPlant.nutrientStatus.nitrogen -= PHYSICS.N_UPTAKE_RATE * timeStep / 24;
        newPlant.nutrientStatus.nitrogen = Math.max(0, newPlant.nutrientStatus.nitrogen);

        // 수확 준비 체크
        newPlant.harvestReady = newPlant.growthStage >= 95 && newPlant.health > 60;

        // 수확량 잠재력 업데이트
        newPlant.yieldPotential = newPlant.biomass * 0.7 * (newPlant.health / 100);

        return newPlant;
    }

    private calculatePhotosynthesis(light: number, co2: number, temp: number): number {
        // Michaelis-Menten 모델
        const lightResponse = light / (light + 200);
        const co2Response = co2 / (co2 + 200);

        // 온도 응답 (최적 23°C)
        const tempOptimal = 23;
        const tempResponse = Math.exp(-Math.pow(temp - tempOptimal, 2) / 100);

        return PHYSICS.PHOTOSYNTHESIS_RATE * lightResponse * co2Response * tempResponse;
    }

    private calculateRespiration(temp: number): number {
        // Q10 모델
        const refTemp = 25;
        return PHYSICS.DARK_RESPIRATION * Math.pow(PHYSICS.Q10_RESPIRATION, (temp - refTemp) / 10);
    }

    // 자원 시뮬레이션
    private simulateResources(resources: ResourceState, plants: PlantState[], env: EnvironmentParameters): ResourceState {
        const newResources = { ...resources };

        // 물 사용량 (증산 기반)
        const totalTranspiration = plants.reduce((sum, p) =>
            sum + p.leafArea * env.vpd * 0.5, 0);
        newResources.water.dailyUsage = totalTranspiration;
        newResources.water.available -= totalTranspiration / 24;

        // 재활용
        newResources.water.available += totalTranspiration * newResources.water.recycleRate / 24;

        // 에너지 (조명 + HVAC)
        const lightEnergy = env.light > 100 ? plants.length * 0.05 : 0;
        const hvacEnergy = Math.abs(env.temperature - 23) * 0.1;
        newResources.energy.gridConsumption = lightEnergy + hvacEnergy;

        // 태양광 발전
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 18) {
            const solarFactor = Math.sin((hour - 6) * Math.PI / 12);
            newResources.energy.solarGeneration = 5 * solarFactor * (1 - env.cloudCover);
        } else {
            newResources.energy.solarGeneration = 0;
        }

        // 배터리
        const netEnergy = newResources.energy.solarGeneration - newResources.energy.gridConsumption;
        newResources.energy.batteryLevel = Math.max(0, Math.min(100,
            newResources.energy.batteryLevel + netEnergy * 2
        ));

        // 비용
        const gridCost = Math.max(0, newResources.energy.gridConsumption - newResources.energy.solarGeneration) * 0.15;
        newResources.energy.dailyCost = gridCost;

        return newResources;
    }

    // 장비 시뮬레이션
    private simulateEquipment(eq: EquipmentState, timeStep: number): EquipmentState {
        const newEq = { ...eq };

        // 가동 시간 누적
        if (eq.status === 'running') {
            newEq.uptime += timeStep;
        }

        // 효율 감소 (마모)
        newEq.efficiency = Math.max(0.7, newEq.efficiency - 0.0001 * timeStep);

        // 유지보수 필요 체크
        const daysSinceMaintenance = (Date.now() - eq.lastMaintenance.getTime()) / (24 * 3600 * 1000);
        if (daysSinceMaintenance > 30 && Math.random() < 0.01) {
            newEq.status = 'maintenance';
        }

        return newEq;
    }

    // 경제 상태 업데이트
    private updateEconomics(economics: EconomicState, resources: ResourceState, plants: PlantState[]): EconomicState {
        const newEcon = { ...economics };

        // 운영 비용
        newEcon.operatingCosts.energy = resources.energy.dailyCost;
        newEcon.operatingCosts.water = resources.water.dailyUsage * 0.002;
        newEcon.operatingCosts.total =
            newEcon.operatingCosts.energy +
            newEcon.operatingCosts.water +
            newEcon.operatingCosts.nutrients +
            newEcon.operatingCosts.labor +
            newEcon.operatingCosts.maintenance;

        // 수확 가능한 식물
        const harvestable = plants.filter(p => p.harvestReady);
        const potentialHarvest = harvestable.reduce((sum, p) => sum + p.yieldPotential, 0);

        // 예상 수익 (kg당 5,000원)
        newEcon.revenue.projected = (newEcon.inventory.harvestedKg + potentialHarvest) * 5;

        return newEcon;
    }

    // 시나리오 수정 적용
    private applyScenarioModifications(state: FarmState, scenario: Scenario, step: number, timeStep: number): FarmState {
        const currentTime = step * timeStep;

        scenario.modifications.forEach(mod => {
            if (mod.startTime !== undefined && currentTime < mod.startTime) return;
            if (mod.endTime !== undefined && currentTime > mod.endTime) return;

            // 파라미터 경로 파싱
            const path = mod.parameter.split('.');
            let target: any = state;

            for (let i = 0; i < path.length - 1; i++) {
                target = target[path[i]];
            }

            const key = path[path.length - 1];
            const currentValue = target[key];

            switch (mod.operation) {
                case 'set':
                    target[key] = mod.value;
                    break;
                case 'add':
                    target[key] = currentValue + mod.value;
                    break;
                case 'multiply':
                    target[key] = currentValue * mod.value;
                    break;
            }
        });

        return state;
    }

    // 요약 계산
    private calculateSummary(timeSeries: TimeSeriesPoint[], finalState: FarmState): SimulationSummary {
        const plants = finalState.plants;

        return {
            totalYield: plants.reduce((sum, p) => sum + p.yieldPotential, 0),
            avgHealth: plants.reduce((sum, p) => sum + p.health, 0) / plants.length,
            totalCost: finalState.economics.operatingCosts.total * timeSeries.length / 24,
            totalRevenue: finalState.economics.revenue.projected,
            roi: finalState.economics.revenue.projected / (finalState.economics.operatingCosts.total * timeSeries.length / 24 + 0.01),
            waterEfficiency: plants.reduce((sum, p) => sum + p.biomass, 0) / (finalState.resources.water.dailyUsage * timeSeries.length / 24 + 0.01),
            energyEfficiency: plants.reduce((sum, p) => sum + p.biomass, 0) / (finalState.resources.energy.gridConsumption * timeSeries.length / 24 + 0.01),
            carbonFootprint: finalState.resources.energy.gridConsumption * timeSeries.length / 24 * 0.5,
            peakStressLevel: Math.max(...plants.map(p => p.stressLevel)),
            harvestCount: plants.filter(p => p.harvestReady).length
        };
    }

    // 예측 생성
    private generatePredictions(timeSeries: TimeSeriesPoint[]): Prediction[] {
        const lastPoint = timeSeries[timeSeries.length - 1];

        return [
            {
                type: 'yield',
                value: (lastPoint.state.plants?.[0]?.yieldPotential || 0) * (lastPoint.state.plants?.length || 1),
                confidence: 0.85,
                range: { min: 0, max: 0 }
            },
            {
                type: 'harvest_date',
                value: new Date(Date.now() + 7 * 24 * 3600 * 1000),
                confidence: 0.78,
                range: { min: new Date(Date.now() + 5 * 24 * 3600 * 1000), max: new Date(Date.now() + 10 * 24 * 3600 * 1000) }
            },
            {
                type: 'revenue',
                value: (lastPoint.state.economics?.revenue.projected || 0),
                confidence: 0.72,
                range: { min: 0, max: 0 }
            }
        ];
    }

    // 리스크 평가
    private assessRisks(timeSeries: TimeSeriesPoint[]): RiskAssessment[] {
        const risks: RiskAssessment[] = [];

        // 고온 스트레스 리스크
        const highTempPoints = timeSeries.filter(p =>
            (p.state.environment?.temperature || 0) > 28
        ).length;
        if (highTempPoints > 10) {
            risks.push({
                type: '고온 스트레스',
                probability: Math.min(highTempPoints / timeSeries.length * 2, 0.9),
                impact: 'high',
                description: '온도가 최적 범위를 자주 초과함',
                mitigation: '냉방 시스템 가동 시간 증가 또는 차광막 설치'
            });
        }

        // 영양 결핍 리스크
        const lowNutrientPoints = timeSeries.filter(p =>
            (p.state.plants?.[0]?.nutrientStatus.nitrogen || 100) < 2
        ).length;
        if (lowNutrientPoints > 20) {
            risks.push({
                type: '영양 결핍',
                probability: Math.min(lowNutrientPoints / timeSeries.length, 0.8),
                impact: 'medium',
                description: '질소 수준이 임계값 이하로 떨어짐',
                mitigation: '양액 농도 조정 또는 시비 빈도 증가'
            });
        }

        // 물 부족 리스크
        const lowWaterPoints = timeSeries.filter(p =>
            (p.state.resources?.water.available || 100) < 50
        ).length;
        if (lowWaterPoints > 5) {
            risks.push({
                type: '물 부족',
                probability: Math.min(lowWaterPoints / timeSeries.length * 3, 0.7),
                impact: 'critical',
                description: '수자원이 부족할 수 있음',
                mitigation: '관수 효율 개선 또는 재순환 시스템 점검'
            });
        }

        return risks;
    }

    // 권장사항 생성
    private generateRecommendations(timeSeries: TimeSeriesPoint[]): string[] {
        const recommendations: string[] = [];
        const lastPoint = timeSeries[timeSeries.length - 1];

        const avgTemp = timeSeries.reduce((sum, p) => sum + (p.state.environment?.temperature || 0), 0) / timeSeries.length;
        const avgHumidity = timeSeries.reduce((sum, p) => sum + (p.state.environment?.humidity || 0), 0) / timeSeries.length;

        if (avgTemp > 25) {
            recommendations.push('평균 온도가 높습니다. 야간 냉방을 강화하세요.');
        }
        if (avgTemp < 20) {
            recommendations.push('평균 온도가 낮습니다. 난방 시간을 늘리세요.');
        }
        if (avgHumidity < 55) {
            recommendations.push('습도가 낮습니다. 가습기를 가동하세요.');
        }
        if (avgHumidity > 80) {
            recommendations.push('습도가 높습니다. 환기를 증가시키세요.');
        }

        const avgHealth = (lastPoint.state.plants || []).reduce((sum, p) => sum + (p.health || 0), 0) /
            ((lastPoint.state.plants || []).length || 1);
        if (avgHealth < 70) {
            recommendations.push('식물 건강 점수가 낮습니다. 스트레스 요인을 점검하세요.');
        }

        if (recommendations.length === 0) {
            recommendations.push('시스템이 최적 상태로 운영되고 있습니다. 현재 설정을 유지하세요.');
        }

        return recommendations;
    }

    // 유틸리티
    private cloneState(state: FarmState): FarmState {
        return JSON.parse(JSON.stringify(state));
    }

    private extractKeyMetrics(state: FarmState): Partial<FarmState> {
        return {
            environment: state.environment,
            plants: state.plants.map(p => ({
                ...p,
                nutrientStatus: p.nutrientStatus
            })),
            resources: state.resources,
            economics: state.economics
        };
    }

    // 외부 인터페이스
    getProgress(): number {
        return this.progress;
    }

    isSimulationRunning(): boolean {
        return this.isRunning;
    }

    getResult(scenarioId: string): SimulationResult | undefined {
        return this.results.get(scenarioId);
    }

    getAllResults(): SimulationResult[] {
        return Array.from(this.results.values());
    }

    // 빠른 예측
    quickPredict(currentState: FarmState, days: number): Prediction[] {
        // 간단한 선형 외삽
        const growthRate = 0.03; // 일당 3% 성장
        const yieldPerPlant = currentState.plants[0]?.biomass || 0.1;
        const plantCount = currentState.plants.length;

        const projectedYield = yieldPerPlant * (1 + growthRate * days) * plantCount * 0.7;
        const projectedCost = currentState.economics.operatingCosts.total * days;
        const projectedRevenue = projectedYield * 5; // kg당 5,000원

        return [
            {
                type: 'yield',
                value: projectedYield,
                confidence: Math.max(0.5, 0.95 - days * 0.02),
                range: { min: projectedYield * 0.8, max: projectedYield * 1.2 }
            },
            {
                type: 'cost',
                value: projectedCost,
                confidence: 0.9,
                range: { min: projectedCost * 0.9, max: projectedCost * 1.1 }
            },
            {
                type: 'revenue',
                value: projectedRevenue,
                confidence: 0.7,
                range: { min: projectedRevenue * 0.7, max: projectedRevenue * 1.3 }
            }
        ];
    }
}

// 싱글톤 인스턴스
let simulationInstance: SimulationEngine | null = null;

export function getSimulationEngine(): SimulationEngine {
    if (!simulationInstance) {
        simulationInstance = new SimulationEngine();
    }
    return simulationInstance;
}

export default SimulationEngine;
