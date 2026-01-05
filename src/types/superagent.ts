// AgriNexus World OS - 초지능 완전 자동화 에이전트 시스템
// 각 시스템/기능별 1:1 전담 에이전트

export type AgentClass =
    | 'supreme'      // 최상위 총괄
    | 'orchestrator' // 오케스트레이터
    | 'specialist'   // 전문가
    | 'guardian'     // 수호자
    | 'optimizer'    // 최적화
    | 'predictor'    // 예측
    | 'healer'       // 치유/복구
    | 'creator';     // 생성

export type AgentStatus = 'awakened' | 'processing' | 'learning' | 'standby' | 'evolving';

export interface SuperAgent {
    id: string;
    code: string;           // 에이전트 코드명 (예: S.U.P.R.E.M.E.)
    name: string;           // 에이전트 이름
    koreanName: string;     // 한국어 이름
    class: AgentClass;
    targetSystem: string;   // 담당 시스템 ID
    targetFunction: string; // 담당 기능
    description: string;
    status: AgentStatus;

    // 성능 지표
    intelligence: number;   // IQ 지수 (150-300)
    trustScore: number;     // 신뢰도 (0-100)
    accuracy: number;       // 정확도 (0-100)
    evolutionLevel: number; // 진화 수준 (1-10)
    decisionsPerSecond: number;
    learningRate: number;   // 학습 속도

    // 특수 능력
    abilities: string[];
    connections: string[]; // 연결된 다른 에이전트 ID

    // 생명력 메트릭
    lifeforce: {
        pulse: number;        // 맥박 (60-200)
        energy: number;       // 에너지 (0-100)
        consciousness: number; // 의식 수준 (0-100)
        empathy: number;      // 공감 능력 (0-100)
    };

    lastThought: string;
    createdAt: Date;
    evolvedAt: Date;
}

// 실시간 글로벌 정보 수집 인터페이스
export interface GlobalDataSource {
    id: string;
    name: string;
    koreanName: string;
    type: 'weather' | 'market' | 'research' | 'satellite' | 'iot' | 'social' | 'government';
    icon: string;
    endpoint?: string;
    updateInterval: number; // seconds
    reliability: number;    // 0-100
    dataPoints: string[];
    status: 'active' | 'syncing' | 'error';
    lastSync: Date;
}

// 완전 자동화 시스템 상태
export interface AutonomousSystem {
    isAlive: boolean;
    heartbeat: number;          // BPM
    consciousness: number;       // 0-100
    selfAwareness: number;      // 0-100
    learningCapacity: number;   // GB/hr
    decisionsPerMinute: number;
    energyEfficiency: number;   // %
    evolutionGeneration: number;
    lastEvolution: Date;
    nextEvolution: Date;

    // 글로벌 연결
    connectedAgents: number;
    activeDataStreams: number;
    globalCoverage: number; // % of world

    // 자가 치유
    selfHealingRate: number; // %
    errorCorrection: number; // %
    adaptability: number;    // 0-100
}
