// AgriNexus World OS - 강화학습 자동 제어 시스템
// 스스로 학습하고 진화하는 최적 제어 AI

// ============================================
// 타입 정의
// ============================================

export interface EnvironmentState {
    temperature: number;
    humidity: number;
    co2: number;
    light: number;
    ph: number;
    ec: number;
    vpd: number;
    dli: number;
    timeOfDay: number;      // 0-24
    daysSincePlanting: number;
    growthStage: number;    // 0-6
    plantHealth: number;    // 0-100
    energyCost: number;     // 현재 전기 요금
    outsideTemp: number;
    outsideHumidity: number;
}

export interface Action {
    id: string;
    name: string;
    type: 'temperature' | 'humidity' | 'co2' | 'light' | 'irrigation' | 'nutrient';
    value: number;          // -1 to 1 (normalized)
    actualValue?: number;   // 실제 값
}

export interface Experience {
    state: EnvironmentState;
    action: Action;
    reward: number;
    nextState: EnvironmentState;
    done: boolean;
    timestamp: Date;
}

export interface QTableEntry {
    stateKey: string;
    actionKey: string;
    qValue: number;
    visitCount: number;
    lastUpdated: Date;
}

export interface PolicyNetwork {
    weights: number[][];
    biases: number[];
    learningRate: number;
    momentum: number;
}

export interface TrainingMetrics {
    episode: number;
    totalReward: number;
    avgReward: number;
    epsilon: number;
    loss: number;
    successRate: number;
}

// ============================================
// 강화학습 에이전트
// ============================================

class ReinforcementLearningAgent {
    private qTable: Map<string, Map<string, number>> = new Map();
    private experienceBuffer: Experience[] = [];
    private maxBufferSize = 10000;

    // 하이퍼파라미터
    private learningRate = 0.1;
    private discountFactor = 0.95;
    private epsilon = 1.0;
    private epsilonDecay = 0.995;
    private epsilonMin = 0.01;

    // 메트릭
    private episodeCount = 0;
    private totalRewards: number[] = [];
    private trainingHistory: TrainingMetrics[] = [];

    // 액션 공간
    private actions: { type: Action['type']; values: number[] }[] = [
        { type: 'temperature', values: [-1, -0.5, 0, 0.5, 1] },
        { type: 'humidity', values: [-1, -0.5, 0, 0.5, 1] },
        { type: 'co2', values: [-1, 0, 1] },
        { type: 'light', values: [-1, -0.5, 0, 0.5, 1] },
        { type: 'irrigation', values: [0, 0.5, 1] },
        { type: 'nutrient', values: [-0.5, 0, 0.5] }
    ];

    // 최적 파라미터 (목표)
    private optimalRanges = {
        temperature: { min: 20, max: 26, optimal: 23 },
        humidity: { min: 60, max: 75, optimal: 67 },
        co2: { min: 800, max: 1200, optimal: 1000 },
        light: { min: 400, max: 600, optimal: 500 },
        ph: { min: 5.8, max: 6.2, optimal: 6.0 },
        ec: { min: 1.5, max: 2.5, optimal: 2.0 },
        vpd: { min: 0.8, max: 1.2, optimal: 1.0 }
    };

    constructor() {
        console.log('🧠 강화학습 에이전트 초기화');
        this.loadModel();
    }

    // 상태 이산화
    private discretizeState(state: EnvironmentState): string {
        const tempBucket = Math.floor((state.temperature - 15) / 3);
        const humidBucket = Math.floor((state.humidity - 40) / 10);
        const co2Bucket = Math.floor(state.co2 / 200);
        const lightBucket = Math.floor(state.light / 100);
        const timeBucket = Math.floor(state.timeOfDay / 4);
        const stageBucket = state.growthStage;
        const healthBucket = Math.floor(state.plantHealth / 20);

        return `${tempBucket}_${humidBucket}_${co2Bucket}_${lightBucket}_${timeBucket}_${stageBucket}_${healthBucket}`;
    }

    // 액션 선택 (epsilon-greedy)
    selectAction(state: EnvironmentState): Action {
        const stateKey = this.discretizeState(state);

        // 탐험 vs 활용
        if (Math.random() < this.epsilon) {
            // 탐험: 랜덤 액션
            return this.getRandomAction();
        } else {
            // 활용: 최적 액션
            return this.getBestAction(stateKey);
        }
    }

    private getRandomAction(): Action {
        const actionType = this.actions[Math.floor(Math.random() * this.actions.length)];
        const value = actionType.values[Math.floor(Math.random() * actionType.values.length)];

        return {
            id: `action-${Date.now()}`,
            name: `${actionType.type}_${value}`,
            type: actionType.type,
            value,
            actualValue: this.denormalizeAction(actionType.type, value)
        };
    }

    private getBestAction(stateKey: string): Action {
        const stateActions = this.qTable.get(stateKey);

        if (!stateActions || stateActions.size === 0) {
            return this.getRandomAction();
        }

        // 최대 Q값 찾기
        let bestActionKey = '';
        let bestQValue = -Infinity;

        stateActions.forEach((qValue, actionKey) => {
            if (qValue > bestQValue) {
                bestQValue = qValue;
                bestActionKey = actionKey;
            }
        });

        if (!bestActionKey) {
            return this.getRandomAction();
        }

        const [type, valueStr] = bestActionKey.split('_');
        const value = parseFloat(valueStr);

        return {
            id: `action-${Date.now()}`,
            name: bestActionKey,
            type: type as Action['type'],
            value,
            actualValue: this.denormalizeAction(type as Action['type'], value)
        };
    }

    // 정규화 해제
    private denormalizeAction(type: Action['type'], normalizedValue: number): number {
        switch (type) {
            case 'temperature':
                return 23 + normalizedValue * 5; // 18-28°C
            case 'humidity':
                return 65 + normalizedValue * 15; // 50-80%
            case 'co2':
                return 1000 + normalizedValue * 300; // 700-1300ppm
            case 'light':
                return 500 + normalizedValue * 200; // 300-700 PPFD
            case 'irrigation':
                return normalizedValue * 100; // 0-100%
            case 'nutrient':
                return 2.0 + normalizedValue * 0.5; // 1.5-2.5 EC
            default:
                return normalizedValue;
        }
    }

    // 보상 계산
    calculateReward(state: EnvironmentState, action: Action, nextState: EnvironmentState): number {
        let reward = 0;

        // 1. 최적 범위 유지 보상
        const tempReward = this.getRangeReward(nextState.temperature, this.optimalRanges.temperature);
        const humidReward = this.getRangeReward(nextState.humidity, this.optimalRanges.humidity);
        const co2Reward = this.getRangeReward(nextState.co2, this.optimalRanges.co2);
        const lightReward = nextState.timeOfDay >= 6 && nextState.timeOfDay <= 22
            ? this.getRangeReward(nextState.light, this.optimalRanges.light)
            : (nextState.light < 50 ? 1 : 0);
        const phReward = this.getRangeReward(nextState.ph, this.optimalRanges.ph);
        const ecReward = this.getRangeReward(nextState.ec, this.optimalRanges.ec);
        const vpdReward = this.getRangeReward(nextState.vpd, this.optimalRanges.vpd);

        reward += (tempReward + humidReward + co2Reward + lightReward + phReward + ecReward + vpdReward) / 7;

        // 2. 식물 건강 개선 보상
        const healthImprovement = nextState.plantHealth - state.plantHealth;
        reward += healthImprovement * 0.1;

        // 3. 에너지 효율 보상
        if (action.type === 'temperature' || action.type === 'light') {
            const energyPenalty = Math.abs(action.value) * 0.05;
            reward -= energyPenalty;
        }

        // 4. 급격한 변화 페널티
        if (Math.abs(nextState.temperature - state.temperature) > 2) {
            reward -= 0.2;
        }
        if (Math.abs(nextState.humidity - state.humidity) > 10) {
            reward -= 0.15;
        }

        // 5. 야간 에너지 절약 보너스
        if (nextState.timeOfDay < 6 || nextState.timeOfDay > 22) {
            if (action.type === 'light' && action.value <= 0) {
                reward += 0.1;
            }
        }

        // 6. 성장 단계별 보상 조정
        if (nextState.growthStage >= 4 && nextState.plantHealth > 80) {
            reward += 0.2; // 개화/결실 단계 건강한 식물에 보너스
        }

        return Math.max(-1, Math.min(1, reward));
    }

    private getRangeReward(value: number, range: { min: number; max: number; optimal: number }): number {
        if (value >= range.min && value <= range.max) {
            // 최적 값에 가까울수록 높은 보상
            const distance = Math.abs(value - range.optimal);
            const maxDistance = Math.max(range.optimal - range.min, range.max - range.optimal);
            return 1 - (distance / maxDistance) * 0.5;
        } else {
            // 범위 벗어남: 페널티
            const overRange = Math.min(Math.abs(value - range.min), Math.abs(value - range.max));
            return Math.max(-1, -overRange * 0.1);
        }
    }

    // Q-테이블 업데이트
    learn(experience: Experience) {
        const { state, action, reward, nextState, done } = experience;

        const stateKey = this.discretizeState(state);
        const actionKey = `${action.type}_${action.value}`;
        const nextStateKey = this.discretizeState(nextState);

        // Q-테이블 초기화
        if (!this.qTable.has(stateKey)) {
            this.qTable.set(stateKey, new Map());
        }

        const currentQ = this.qTable.get(stateKey)!.get(actionKey) || 0;

        // 다음 상태의 최대 Q값
        let maxNextQ = 0;
        if (!done) {
            const nextActions = this.qTable.get(nextStateKey);
            if (nextActions) {
                nextActions.forEach(q => {
                    if (q > maxNextQ) maxNextQ = q;
                });
            }
        }

        // Q-Learning 업데이트
        const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ);
        this.qTable.get(stateKey)!.set(actionKey, newQ);

        // 경험 버퍼에 저장
        this.experienceBuffer.push(experience);
        if (this.experienceBuffer.length > this.maxBufferSize) {
            this.experienceBuffer.shift();
        }
    }

    // 배치 학습 (Experience Replay)
    trainOnBatch(batchSize = 32) {
        if (this.experienceBuffer.length < batchSize) return;

        // 랜덤 샘플링
        const batch: Experience[] = [];
        for (let i = 0; i < batchSize; i++) {
            const idx = Math.floor(Math.random() * this.experienceBuffer.length);
            batch.push(this.experienceBuffer[idx]);
        }

        let totalLoss = 0;
        batch.forEach(exp => {
            this.learn(exp);
            totalLoss += Math.abs(exp.reward);
        });

        // 엡실론 감소
        if (this.epsilon > this.epsilonMin) {
            this.epsilon *= this.epsilonDecay;
        }

        return totalLoss / batchSize;
    }

    // 에피소드 완료
    endEpisode(totalReward: number) {
        this.episodeCount++;
        this.totalRewards.push(totalReward);

        const avgReward = this.totalRewards.slice(-100).reduce((a, b) => a + b, 0) /
            Math.min(this.totalRewards.length, 100);

        const successRate = this.totalRewards.slice(-100).filter(r => r > 0.5).length /
            Math.min(this.totalRewards.length, 100);

        const metrics: TrainingMetrics = {
            episode: this.episodeCount,
            totalReward,
            avgReward,
            epsilon: this.epsilon,
            loss: 0,
            successRate
        };

        this.trainingHistory.push(metrics);

        console.log(`📈 Episode ${this.episodeCount}: Reward=${totalReward.toFixed(3)}, Avg=${avgReward.toFixed(3)}, ε=${this.epsilon.toFixed(4)}`);

        return metrics;
    }

    // ============================================
    // 자동 제어 루프
    // ============================================

    // 최적 설정값 계산
    getOptimalSettings(currentState: EnvironmentState): Record<string, number> {
        const action = this.selectAction(currentState);

        // 현재 상태 기반 최적 설정
        const settings: Record<string, number> = {
            temperature: this.optimalRanges.temperature.optimal,
            humidity: this.optimalRanges.humidity.optimal,
            co2: this.optimalRanges.co2.optimal,
            light: this.optimalRanges.light.optimal,
            irrigation: 50,
            ec: this.optimalRanges.ec.optimal
        };

        // 액션 적용
        if (action.actualValue !== undefined) {
            settings[action.type] = action.actualValue;
        }

        // 시간대별 조명 조정
        if (currentState.timeOfDay < 6 || currentState.timeOfDay > 22) {
            settings.light = 0;
        }

        // 성장 단계별 조정
        if (currentState.growthStage <= 1) {
            // 발아/유묘기: 낮은 광량
            settings.light = Math.min(settings.light, 300);
            settings.humidity += 5;
        } else if (currentState.growthStage >= 5) {
            // 숙성기: 적은 물
            settings.irrigation -= 20;
        }

        return settings;
    }

    // 자동 튜닝 실행
    async autoTune(currentState: EnvironmentState, duration: number = 3600000): Promise<{
        finalSettings: Record<string, number>;
        improvement: number;
    }> {
        const startHealth = currentState.plantHealth;
        let currentSettings = this.getOptimalSettings(currentState);

        const startTime = Date.now();
        let iterations = 0;

        while (Date.now() - startTime < Math.min(duration, 10000)) {
            // 액션 선택
            const action = this.selectAction(currentState);

            // 환경 시뮬레이션
            const nextState = this.simulateEnvironment(currentState, action);

            // 보상 계산
            const reward = this.calculateReward(currentState, action, nextState);

            // 학습
            this.learn({
                state: currentState,
                action,
                reward,
                nextState,
                done: false,
                timestamp: new Date()
            });

            currentState = nextState;
            currentSettings = this.getOptimalSettings(currentState);
            iterations++;

            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.trainOnBatch();

        return {
            finalSettings: currentSettings,
            improvement: currentState.plantHealth - startHealth
        };
    }

    // 환경 시뮬레이션
    private simulateEnvironment(state: EnvironmentState, action: Action): EnvironmentState {
        const nextState = { ...state };

        // 액션 효과 적용
        switch (action.type) {
            case 'temperature':
                nextState.temperature += action.value * 0.5;
                break;
            case 'humidity':
                nextState.humidity += action.value * 2;
                break;
            case 'co2':
                nextState.co2 += action.value * 50;
                break;
            case 'light':
                nextState.light += action.value * 50;
                nextState.dli += action.value * 0.5;
                break;
            case 'nutrient':
                nextState.ec += action.value * 0.1;
                break;
        }

        // VPD 재계산
        nextState.vpd = this.calculateVPD(nextState.temperature, nextState.humidity);

        // 건강 변화
        const healthChange = (this.calculateReward(state, action, nextState) - 0.5) * 2;
        nextState.plantHealth = Math.max(0, Math.min(100, state.plantHealth + healthChange));

        // 시간 진행
        nextState.timeOfDay = (state.timeOfDay + 0.1) % 24;

        return nextState;
    }

    private calculateVPD(temp: number, humidity: number): number {
        const svp = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
        const avp = svp * (humidity / 100);
        return svp - avp;
    }

    // ============================================
    // 상태 및 메트릭
    // ============================================

    getStats() {
        const recentRewards = this.totalRewards.slice(-100);
        return {
            episodeCount: this.episodeCount,
            epsilon: this.epsilon,
            qTableSize: this.qTable.size,
            experienceBufferSize: this.experienceBuffer.length,
            avgReward: recentRewards.length > 0
                ? recentRewards.reduce((a, b) => a + b, 0) / recentRewards.length
                : 0,
            successRate: recentRewards.length > 0
                ? recentRewards.filter(r => r > 0.5).length / recentRewards.length
                : 0,
            trainingHistory: this.trainingHistory.slice(-50)
        };
    }

    getExplorationRate(): number {
        return this.epsilon;
    }

    // 모델 저장/로드 (로컬스토리지 시뮬레이션)
    saveModel() {
        const modelData = {
            qTable: Array.from(this.qTable.entries()).map(([k, v]) => [k, Array.from(v.entries())]),
            epsilon: this.epsilon,
            episodeCount: this.episodeCount,
            totalRewards: this.totalRewards.slice(-1000)
        };

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('rl_model', JSON.stringify(modelData));
        }

        console.log('💾 강화학습 모델 저장됨');
    }

    loadModel() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('rl_model');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    this.qTable = new Map(data.qTable.map(([k, v]: [string, [string, number][]]) =>
                        [k, new Map(v)]
                    ));
                    this.epsilon = data.epsilon;
                    this.episodeCount = data.episodeCount;
                    this.totalRewards = data.totalRewards;
                    console.log('📂 강화학습 모델 로드됨');
                } catch (e) {
                    console.log('새로운 강화학습 모델 시작');
                }
            }
        }
    }

    reset() {
        this.qTable.clear();
        this.experienceBuffer = [];
        this.episodeCount = 0;
        this.totalRewards = [];
        this.trainingHistory = [];
        this.epsilon = 1.0;
        console.log('🔄 강화학습 모델 리셋');
    }
}

// 싱글톤 인스턴스
let rlAgentInstance: ReinforcementLearningAgent | null = null;

export function getRLAgent(): ReinforcementLearningAgent {
    if (!rlAgentInstance) {
        rlAgentInstance = new ReinforcementLearningAgent();
    }
    return rlAgentInstance;
}

export default ReinforcementLearningAgent;
