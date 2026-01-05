// AgriNexus World OS - 자가 치유 시스템 (Self-Healing System)
// 실시간 오류 감지, 자동 복구, 예방적 유지보수

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'recovering';
export type IssueType = 'performance' | 'memory' | 'network' | 'render' | 'data' | 'agent' | 'sync';

export interface SystemHealth {
    overall: HealthStatus;
    score: number; // 0-100
    uptime: number; // seconds
    lastCheck: Date;
    issues: SystemIssue[];
    heals: HealEvent[];
    metrics: HealthMetrics;
}

export interface SystemIssue {
    id: string;
    type: IssueType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    detectedAt: Date;
    autoHealable: boolean;
    status: 'detected' | 'analyzing' | 'healing' | 'resolved' | 'escalated';
    healingProgress: number;
}

export interface HealEvent {
    id: string;
    issueId: string;
    action: string;
    result: 'success' | 'partial' | 'failed';
    duration: number; // ms
    timestamp: Date;
    improvement: number; // percentage
}

export interface HealthMetrics {
    cpu: number;
    memory: number;
    networkLatency: number;
    renderFps: number;
    agentResponseTime: number;
    dataIntegrity: number;
    errorRate: number;
    healSuccessRate: number;
}

// 자가 치유 액션 정의
export const HEAL_ACTIONS: Record<IssueType, string[]> = {
    performance: [
        '불필요한 리렌더링 최적화',
        '메모이제이션 적용',
        '지연 로딩 활성화',
        '웹 워커 분산 처리',
    ],
    memory: [
        '가비지 컬렉션 트리거',
        '캐시 정리',
        '미사용 객체 해제',
        '메모리 풀 재할당',
    ],
    network: [
        '연결 재시도',
        '대체 엔드포인트 전환',
        '요청 배치 처리',
        '오프라인 모드 활성화',
    ],
    render: [
        'DOM 가상화 적용',
        '애니메이션 최적화',
        'GPU 가속 활성화',
        '컴포넌트 분할',
    ],
    data: [
        '데이터 유효성 검증',
        '캐시 무효화',
        '상태 동기화',
        '백업 데이터 복원',
    ],
    agent: [
        '에이전트 재시작',
        '연결 재설정',
        '상태 초기화',
        '백업 에이전트 활성화',
    ],
    sync: [
        '동기화 재시도',
        '충돌 해결',
        '버전 병합',
        '강제 동기화',
    ],
};

// 초기 건강 상태
export function getInitialHealth(): SystemHealth {
    return {
        overall: 'healthy',
        score: 98.5,
        uptime: 0,
        lastCheck: new Date(),
        issues: [],
        heals: [],
        metrics: {
            cpu: 25,
            memory: 45,
            networkLatency: 15,
            renderFps: 60,
            agentResponseTime: 50,
            dataIntegrity: 100,
            errorRate: 0.01,
            healSuccessRate: 99.5,
        },
    };
}

// 이슈 시뮬레이션 생성기
export function simulateIssue(): SystemIssue | null {
    if (Math.random() > 0.05) return null; // 5% 확률로 이슈 발생

    const types: IssueType[] = ['performance', 'memory', 'network', 'render', 'data', 'agent', 'sync'];
    const type = types[Math.floor(Math.random() * types.length)];

    const descriptions: Record<IssueType, string[]> = {
        performance: ['렌더링 지연 감지', 'CPU 사용량 급증', '응답 시간 초과'],
        memory: ['메모리 사용량 증가', '메모리 누수 의심', '힙 크기 초과'],
        network: ['네트워크 지연', '연결 불안정', '패킷 손실'],
        render: ['프레임 드랍', 'DOM 크기 초과', '리페인트 과다'],
        data: ['데이터 불일치', '캐시 만료', '동기화 지연'],
        agent: ['에이전트 응답 없음', '연결 타임아웃', '상태 불일치'],
        sync: ['동기화 충돌', '버전 불일치', '데이터 손실 위험'],
    };

    return {
        id: `issue-${Date.now()}`,
        type,
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
        detectedAt: new Date(),
        autoHealable: Math.random() > 0.1, // 90% 자동 치유 가능
        status: 'detected',
        healingProgress: 0,
    };
}

// 자동 치유 시뮬레이션
export function simulateHeal(issue: SystemIssue): HealEvent {
    const actions = HEAL_ACTIONS[issue.type];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return {
        id: `heal-${Date.now()}`,
        issueId: issue.id,
        action,
        result: Math.random() > 0.05 ? 'success' : Math.random() > 0.5 ? 'partial' : 'failed',
        duration: 100 + Math.floor(Math.random() * 900),
        timestamp: new Date(),
        improvement: 5 + Math.floor(Math.random() * 20),
    };
}

// 건강 점수 계산
export function calculateHealthScore(metrics: HealthMetrics): number {
    const weights = {
        cpu: -0.1,
        memory: -0.1,
        networkLatency: -0.2,
        renderFps: 0.3,
        agentResponseTime: -0.1,
        dataIntegrity: 0.4,
        errorRate: -5,
        healSuccessRate: 0.1,
    };

    let score = 100;
    score += (100 - metrics.cpu) * weights.cpu;
    score += (100 - metrics.memory) * weights.memory;
    score += Math.max(0, 100 - metrics.networkLatency) * weights.networkLatency;
    score += (metrics.renderFps / 60) * 100 * weights.renderFps;
    score += Math.max(0, 100 - metrics.agentResponseTime) * weights.agentResponseTime;
    score += metrics.dataIntegrity * weights.dataIntegrity;
    score += (1 - metrics.errorRate) * 100 * Math.abs(weights.errorRate);
    score += metrics.healSuccessRate * weights.healSuccessRate;

    return Math.max(0, Math.min(100, score));
}
