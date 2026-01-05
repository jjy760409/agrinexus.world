// AgriNexus World OS - 500 살아있는 시스템 아키텍처
// 모든 시스템이 유기체처럼 살아 움직이며 상호 연동

export interface LivingSystem {
    id: string;
    name: string;
    koreanName: string;
    category: SystemCategory;
    status: 'dormant' | 'awakening' | 'active' | 'evolving' | 'optimizing';
    vitality: number;         // 0-100 생명력
    consciousness: number;    // 0-100 의식 수준
    connectivity: number;     // 0-100 연결성
    evolution: number;        // 진화 레벨
    heartbeat: number;        // 분당 펄스
    dependencies: string[];   // 연결된 시스템 ID
    capabilities: string[];
    lastPulse: Date;
    metrics: SystemMetrics;
}

export type SystemCategory =
    | 'core'           // 코어 시스템
    | 'intelligence'   // 지능 시스템
    | 'monitoring'     // 모니터링
    | 'control'        // 제어
    | 'analysis'       // 분석
    | 'prediction'     // 예측
    | 'automation'     // 자동화
    | 'integration'    // 통합
    | 'security'       // 보안
    | 'optimization';  // 최적화

export interface SystemMetrics {
    throughput: number;
    latency: number;
    accuracy: number;
    uptime: number;
    decisionsPerSecond: number;
    dataProcessed: number;
}

// 500 살아있는 시스템 카테고리
export const LIVING_SYSTEM_CATEGORIES: {
    id: SystemCategory;
    name: string;
    icon: string;
    count: number;
    color: string;
}[] = [
        { id: 'core', name: '코어 시스템', icon: '💎', count: 50, color: '#00ff88' },
        { id: 'intelligence', name: '지능 시스템', icon: '🧠', count: 80, color: '#00d4ff' },
        { id: 'monitoring', name: '모니터링', icon: '📊', count: 60, color: '#7b2fff' },
        { id: 'control', name: '제어 시스템', icon: '🎮', count: 55, color: '#ff2d92' },
        { id: 'analysis', name: '분석 시스템', icon: '🔬', count: 50, color: '#ffa500' },
        { id: 'prediction', name: '예측 시스템', icon: '🔮', count: 45, color: '#00ffcc' },
        { id: 'automation', name: '자동화', icon: '⚙️', count: 60, color: '#ff6b6b' },
        { id: 'integration', name: '통합 시스템', icon: '🔗', count: 40, color: '#4ecdc4' },
        { id: 'security', name: '보안 시스템', icon: '🛡️', count: 30, color: '#f7dc6f' },
        { id: 'optimization', name: '최적화', icon: '⚡', count: 30, color: '#a29bfe' },
    ];

// 시스템 이름 템플릿
const SYSTEM_NAMES: Record<SystemCategory, { prefix: string; suffixes: string[] }> = {
    core: { prefix: 'CORE', suffixes: ['Nexus', 'Hub', 'Matrix', 'Engine', 'Foundation', 'Kernel', 'Pulse', 'Essence'] },
    intelligence: { prefix: 'INTEL', suffixes: ['Mind', 'Brain', 'Neural', 'Cognition', 'Wisdom', 'Logic', 'Reason', 'Think'] },
    monitoring: { prefix: 'MONITOR', suffixes: ['Watch', 'Guard', 'Sense', 'Observe', 'Track', 'Scan', 'View', 'Eye'] },
    control: { prefix: 'CTRL', suffixes: ['Command', 'Direct', 'Manage', 'Govern', 'Lead', 'Pilot', 'Drive', 'Steer'] },
    analysis: { prefix: 'ANALYZE', suffixes: ['Insight', 'Deep', 'Pattern', 'Data', 'Logic', 'Parse', 'Study', 'Examine'] },
    prediction: { prefix: 'PREDICT', suffixes: ['Future', 'Forecast', 'Vision', 'Oracle', 'Foresee', 'Model', 'Trend', 'Project'] },
    automation: { prefix: 'AUTO', suffixes: ['Execute', 'Process', 'Flow', 'Run', 'Operate', 'Action', 'Perform', 'Task'] },
    integration: { prefix: 'INTEGRATE', suffixes: ['Link', 'Connect', 'Bridge', 'Sync', 'Merge', 'Unite', 'Bond', 'Join'] },
    security: { prefix: 'SECURE', suffixes: ['Shield', 'Protect', 'Guard', 'Defend', 'Armor', 'Fort', 'Safe', 'Trust'] },
    optimization: { prefix: 'OPTIMIZE', suffixes: ['Boost', 'Enhance', 'Tune', 'Refine', 'Perfect', 'Max', 'Peak', 'Prime'] },
};

// 500 살아있는 시스템 생성
export function generate500LivingSystems(): LivingSystem[] {
    const systems: LivingSystem[] = [];
    let systemId = 1;

    for (const category of LIVING_SYSTEM_CATEGORIES) {
        const names = SYSTEM_NAMES[category.id];

        for (let i = 0; i < category.count; i++) {
            const suffix = names.suffixes[i % names.suffixes.length];
            const variant = Math.floor(i / names.suffixes.length) + 1;

            const system: LivingSystem = {
                id: `SYS-${String(systemId).padStart(4, '0')}`,
                name: `${names.prefix}.${suffix}${variant > 1 ? `.v${variant}` : ''}`,
                koreanName: `${category.name} ${i + 1}`,
                category: category.id,
                status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'evolving' : 'optimizing',
                vitality: 80 + Math.random() * 20,
                consciousness: 70 + Math.random() * 30,
                connectivity: 60 + Math.random() * 40,
                evolution: Math.floor(Math.random() * 10) + 1,
                heartbeat: 60 + Math.floor(Math.random() * 60),
                dependencies: [],
                capabilities: generateCapabilities(category.id),
                lastPulse: new Date(),
                metrics: {
                    throughput: 1000 + Math.random() * 9000,
                    latency: 5 + Math.random() * 45,
                    accuracy: 90 + Math.random() * 10,
                    uptime: 99 + Math.random() * 0.99,
                    decisionsPerSecond: 100 + Math.random() * 900,
                    dataProcessed: Math.floor(Math.random() * 1000000),
                },
            };

            // 의존성 연결 (각 시스템은 3-7개의 다른 시스템과 연결)
            const connectionCount = 3 + Math.floor(Math.random() * 5);
            for (let j = 0; j < connectionCount; j++) {
                const targetId = `SYS-${String(Math.floor(Math.random() * 500) + 1).padStart(4, '0')}`;
                if (targetId !== system.id && !system.dependencies.includes(targetId)) {
                    system.dependencies.push(targetId);
                }
            }

            systems.push(system);
            systemId++;
        }
    }

    return systems;
}

function generateCapabilities(category: SystemCategory): string[] {
    const allCapabilities: Record<SystemCategory, string[]> = {
        core: ['데이터 처리', '상태 관리', '이벤트 라우팅', '로드 밸런싱', '장애 복구'],
        intelligence: ['패턴 인식', '의사 결정', '학습', '추론', '자연어 처리'],
        monitoring: ['실시간 감시', '이상 탐지', '알림 생성', '로그 분석', '성능 추적'],
        control: ['명령 실행', '상태 제어', '스케줄링', '우선순위 관리', '리소스 할당'],
        analysis: ['데이터 분석', '통계 처리', '상관관계 분석', '리포트 생성', '시각화'],
        prediction: ['미래 예측', '트렌드 분석', '시계열 모델링', '위험 평가', '시나리오 분석'],
        automation: ['작업 자동화', '워크플로우', '트리거 처리', '배치 처리', '스크립트 실행'],
        integration: ['API 연동', '데이터 동기화', '프로토콜 변환', '메시지 큐', '이벤트 버스'],
        security: ['접근 제어', '암호화', '위협 탐지', '감사 로그', '인증 관리'],
        optimization: ['성능 튜닝', '리소스 최적화', '캐싱', '압축', '부하 분산'],
    };

    const caps = allCapabilities[category];
    const count = 2 + Math.floor(Math.random() * 3);
    return caps.slice(0, count);
}

// 전체 시스템 상태 요약
export interface GlobalSystemStatus {
    totalSystems: number;
    activeSystems: number;
    evolvingSystems: number;
    totalConnections: number;
    avgVitality: number;
    avgConsciousness: number;
    totalThroughput: number;
    systemSynergy: number;
    lastEvolvedAt: Date;
    uptime: number;
}

export function calculateGlobalStatus(systems: LivingSystem[]): GlobalSystemStatus {
    const active = systems.filter(s => s.status === 'active').length;
    const evolving = systems.filter(s => s.status === 'evolving').length;
    const connections = systems.reduce((sum, s) => sum + s.dependencies.length, 0);
    const avgVitality = systems.reduce((sum, s) => sum + s.vitality, 0) / systems.length;
    const avgConsciousness = systems.reduce((sum, s) => sum + s.consciousness, 0) / systems.length;
    const totalThroughput = systems.reduce((sum, s) => sum + s.metrics.throughput, 0);

    return {
        totalSystems: systems.length,
        activeSystems: active,
        evolvingSystems: evolving,
        totalConnections: connections,
        avgVitality,
        avgConsciousness,
        totalThroughput,
        systemSynergy: (avgVitality + avgConsciousness) / 2 * (connections / systems.length / 5),
        lastEvolvedAt: new Date(),
        uptime: 99.97,
    };
}

// 시스템 진화 이벤트
export function generateEvolutionEvent(system: LivingSystem): {
    systemId: string;
    systemName: string;
    evolutionType: string;
    description: string;
    improvement: number;
} {
    const evolutionTypes = [
        { type: '능력 확장', desc: '새로운 처리 능력이 추가되었습니다' },
        { type: '효율 향상', desc: '처리 효율이 최적화되었습니다' },
        { type: '연결 강화', desc: '다른 시스템과의 연결이 강화되었습니다' },
        { type: '지능 상승', desc: '의사결정 능력이 향상되었습니다' },
        { type: '자가 치유', desc: '자동 복구 능력이 강화되었습니다' },
    ];

    const evolution = evolutionTypes[Math.floor(Math.random() * evolutionTypes.length)];

    return {
        systemId: system.id,
        systemName: system.name,
        evolutionType: evolution.type,
        description: evolution.desc,
        improvement: 5 + Math.floor(Math.random() * 20),
    };
}
