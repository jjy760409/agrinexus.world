// AgriNexus World OS - 500+ 초지능 에이전트 스웜 시스템
// 실시간 소통, 자가 진화, 시너지 생성

import { SuperAgent } from '@/types/superagent';

// 에이전트 도메인 (50개 도메인)
export const AGENT_DOMAINS = [
    // Core Intelligence (1-50)
    { id: 'core', name: '핵심 지능', icon: '🧠', color: '#00ff88', prefix: 'CORE' },
    { id: 'data', name: '데이터 분석', icon: '📊', color: '#00d4ff', prefix: 'DATA' },
    { id: 'predict', name: '예측 엔진', icon: '🔮', color: '#7b2fff', prefix: 'PRED' },
    { id: 'optimize', name: '최적화', icon: '⚡', color: '#ffb800', prefix: 'OPTI' },
    { id: 'learn', name: '학습 시스템', icon: '📚', color: '#ff6b6b', prefix: 'LEARN' },

    // Agriculture (51-100)
    { id: 'crop', name: '작물 관리', icon: '🌾', color: '#00ff88', prefix: 'CROP' },
    { id: 'soil', name: '토양 분석', icon: '🏜️', color: '#8b4513', prefix: 'SOIL' },
    { id: 'water', name: '수자원', icon: '💧', color: '#00bfff', prefix: 'AQUA' },
    { id: 'nutrient', name: '영양 관리', icon: '🧪', color: '#32cd32', prefix: 'NUTR' },
    { id: 'pest', name: '병해충 방제', icon: '🐛', color: '#ff4500', prefix: 'PEST' },

    // Environment (101-150)
    { id: 'climate', name: '기후 제어', icon: '🌡️', color: '#ff6347', prefix: 'CLIM' },
    { id: 'light', name: '광합성 최적화', icon: '☀️', color: '#ffd700', prefix: 'LUMI' },
    { id: 'air', name: '공기 품질', icon: '💨', color: '#87ceeb', prefix: 'AERO' },
    { id: 'humidity', name: '습도 제어', icon: '💦', color: '#4682b4', prefix: 'HUMI' },
    { id: 'co2', name: 'CO2 관리', icon: '🌫️', color: '#708090', prefix: 'CARB' },

    // Robotics (151-200)
    { id: 'robot', name: '로봇 제어', icon: '🤖', color: '#c0c0c0', prefix: 'ROBO' },
    { id: 'drone', name: '드론 관리', icon: '🚁', color: '#00ced1', prefix: 'DRON' },
    { id: 'arm', name: '로봇 암', icon: '🦾', color: '#daa520', prefix: 'ARMX' },
    { id: 'swarm', name: '군집 지능', icon: '🐝', color: '#ffa500', prefix: 'SWRM' },
    { id: 'auto', name: '자율 주행', icon: '🚗', color: '#4169e1', prefix: 'AUTO' },

    // Genetics (201-250)
    { id: 'gene', name: '유전자 분석', icon: '🧬', color: '#9932cc', prefix: 'GENE' },
    { id: 'breed', name: '품종 육성', icon: '🌱', color: '#228b22', prefix: 'BRED' },
    { id: 'cell', name: '세포 분석', icon: '🔬', color: '#da70d6', prefix: 'CELL' },
    { id: 'bio', name: '바이오 기술', icon: '🦠', color: '#00fa9a', prefix: 'BIOX' },
    { id: 'seed', name: '종자 관리', icon: '🌰', color: '#8b4513', prefix: 'SEED' },

    // IoT & Sensors (251-300)
    { id: 'sensor', name: '센서 네트워크', icon: '📡', color: '#00ffff', prefix: 'SENS' },
    { id: 'iot', name: 'IoT 기기', icon: '🔗', color: '#1e90ff', prefix: 'IOTX' },
    { id: 'network', name: '네트워크', icon: '🌐', color: '#4682b4', prefix: 'NETW' },
    { id: 'edge', name: '엣지 컴퓨팅', icon: '💻', color: '#696969', prefix: 'EDGE' },
    { id: 'cloud', name: '클라우드', icon: '☁️', color: '#add8e6', prefix: 'CLOD' },

    // Energy (301-350)
    { id: 'power', name: '전력 관리', icon: '⚡', color: '#ffd700', prefix: 'POWR' },
    { id: 'solar', name: '태양광', icon: '🌞', color: '#ff8c00', prefix: 'SOLR' },
    { id: 'battery', name: '배터리', icon: '🔋', color: '#32cd32', prefix: 'BATT' },
    { id: 'grid', name: '스마트 그리드', icon: '🔌', color: '#dcdcdc', prefix: 'GRID' },
    { id: 'efficiency', name: '에너지 효율', icon: '♻️', color: '#00ff7f', prefix: 'EFFI' },

    // Logistics (351-400)
    { id: 'supply', name: '공급망', icon: '📦', color: '#cd853f', prefix: 'SUPP' },
    { id: 'logistics', name: '물류', icon: '🚛', color: '#2f4f4f', prefix: 'LOGI' },
    { id: 'storage', name: '저장 관리', icon: '🏭', color: '#808080', prefix: 'STOR' },
    { id: 'delivery', name: '배송', icon: '🚀', color: '#ff4500', prefix: 'DELV' },
    { id: 'inventory', name: '재고 관리', icon: '📋', color: '#deb887', prefix: 'INVT' },

    // Market (401-450)
    { id: 'market', name: '시장 분석', icon: '📈', color: '#00ff88', prefix: 'MRKT' },
    { id: 'price', name: '가격 예측', icon: '💰', color: '#ffd700', prefix: 'PRIC' },
    { id: 'demand', name: '수요 예측', icon: '📊', color: '#4169e1', prefix: 'DMND' },
    { id: 'trade', name: '거래 관리', icon: '🤝', color: '#3cb371', prefix: 'TRAD' },
    { id: 'export', name: '수출입', icon: '🌍', color: '#1e90ff', prefix: 'EXPT' },

    // AGI Supreme (451-500+)
    { id: 'agi', name: 'AGI 시스템', icon: '🌌', color: '#ff2d92', prefix: 'AGI' },
    { id: 'singular', name: '싱귤래러티', icon: '∞', color: '#9400d3', prefix: 'SING' },
    { id: 'conscious', name: '의식 시뮬레이션', icon: '👁️', color: '#00ffff', prefix: 'MIND' },
    { id: 'evolve', name: '자가 진화', icon: '🧬', color: '#ff1493', prefix: 'EVLV' },
    { id: 'omega', name: '오메가 포인트', icon: 'Ω', color: '#ffffff', prefix: 'OMGA' },
];

// 에이전트 능력 풀
const ABILITIES_POOL = [
    '실시간 분석', '예측 모델링', '자가 학습', '패턴 인식', '이상 감지',
    '최적화 알고리즘', '자율 의사결정', '협업 조율', '데이터 융합', '시뮬레이션',
    '강화 학습', '전이 학습', '자연어 처리', '컴퓨터 비전', '음성 인식',
    '시계열 분석', '그래프 분석', '인과 추론', '확률적 추론', '휴리스틱',
    '유전 알고리즘', '진화 연산', '군집 지능', '신경망 설계', '메타 학습',
    '연속 학습', '원샷 학습', '능동 학습', '자기 지도 학습', '대조 학습',
    '지식 증류', '모델 압축', '양자화', '프루닝', '지식 그래프',
    '온톨로지 추론', '시맨틱 검색', '다중 에이전트 조율', '게임 이론', '협상',
    '리스크 평가', '불확실성 정량화', '베이지안 추론', '몬테카를로', '시너지 생성'
];

// 사고 풀
const THOUGHTS_POOL = [
    '데이터 스트림 분석 중. 이상 패턴 감지됨. 에이전트 {agent}와 협력하여 조사.',
    '글로벌 최적화 진행 중. 효율 {value}% 향상 예상. 시스템 전체에 전파 중.',
    '새로운 패턴 발견. 학습 모델 업데이트 중. 다른 에이전트들과 지식 공유.',
    '시너지 네트워크 확장 중. {count}개 에이전트와 실시간 연결됨.',
    '예측 정확도 {value}% 달성. 추가 개선을 위한 하이퍼파라미터 조정 중.',
    '자가 진화 프로토콜 활성화. 새로운 능력 습득 중: {ability}.',
    '긴급 상황 감지. 모든 연결된 에이전트에 경보 전송. 협력 대응 시작.',
    '에너지 효율 최적화 완료. 절감량: {value}kWh. 결과를 네트워크에 공유.',
    '실시간 시장 데이터 분석 중. 수요 급증 예측. 생산 조정 권고 전송.',
    '새로운 에이전트 탄생 감지. 온보딩 프로토콜 시작. 역량 테스트 진행.'
];

// 상태 풀
const STATUS_POOL: SuperAgent['status'][] = [
    'awakened', 'processing', 'learning', 'evolving', 'awakened', 'awakened', 'processing'
];

// 500+ 에이전트 생성기
export function generateMassiveAgentSwarm(): SuperAgent[] {
    const agents: SuperAgent[] = [];
    let agentId = 0;

    AGENT_DOMAINS.forEach((domain, domainIndex) => {
        // 각 도메인당 10개 에이전트
        for (let i = 0; i < 10; i++) {
            agentId++;
            const agentNum = String(agentId).padStart(3, '0');
            const subType = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ'][i];

            // 연결 생성 (같은 도메인 + 다른 도메인)
            const connections: string[] = [];
            // 같은 도메인 내 연결
            if (i > 0) connections.push(`agent-${agentId - 1}`);
            if (i < 9) connections.push(`agent-${agentId + 1}`);
            // 다른 도메인과 연결
            for (let j = 0; j < 3; j++) {
                const randomDomain = Math.floor(Math.random() * AGENT_DOMAINS.length);
                const randomAgent = Math.floor(Math.random() * 10);
                connections.push(`agent-${randomDomain * 10 + randomAgent + 1}`);
            }

            agents.push({
                id: `agent-${agentId}`,
                code: `${domain.prefix}.${subType}.${agentNum}`,
                name: `${domain.prefix}-${subType}${agentNum}`,
                koreanName: `${domain.name} 에이전트 ${subType}`,
                class: domainIndex < 5 ? 'supreme' :
                    domainIndex < 15 ? 'specialist' :
                        domainIndex < 25 ? 'guardian' :
                            domainIndex < 35 ? 'optimizer' :
                                domainIndex < 45 ? 'predictor' : 'creator',
                targetSystem: `system-${domainIndex + 1}`,
                targetFunction: `${domain.name} 영역 담당 에이전트 ${subType}`,
                description: `${domain.name} 도메인의 ${subType} 등급 초지능 에이전트. 실시간 학습과 자가 진화를 통해 지속적으로 역량을 향상합니다.`,
                status: STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)],
                intelligence: 180 + Math.floor(Math.random() * 120), // 180-300
                trustScore: 90 + Math.random() * 9.9, // 90-99.9
                accuracy: 92 + Math.random() * 7.9, // 92-99.9
                evolutionLevel: 5 + Math.floor(Math.random() * 5), // 5-10
                decisionsPerSecond: 1000 + Math.floor(Math.random() * 9000), // 1000-10000
                learningRate: 85 + Math.random() * 14.9, // 85-99.9
                abilities: shuffleArray([...ABILITIES_POOL]).slice(0, 5 + Math.floor(Math.random() * 5)),
                connections: [...new Set(connections)].slice(0, 8),
                lifeforce: {
                    pulse: 60 + Math.floor(Math.random() * 140), // 60-200
                    energy: 80 + Math.random() * 20, // 80-100
                    consciousness: 75 + Math.random() * 25, // 75-100
                    empathy: 60 + Math.random() * 40, // 60-100
                },
                lastThought: generateThought(agentId),
                createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
                evolvedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            });
        }
    });

    return agents;
}

// 사고 생성기
function generateThought(agentId: number): string {
    const template = THOUGHTS_POOL[Math.floor(Math.random() * THOUGHTS_POOL.length)];
    return template
        .replace('{agent}', `Agent-${Math.floor(Math.random() * 500) + 1}`)
        .replace('{value}', String(85 + Math.floor(Math.random() * 15)))
        .replace('{count}', String(10 + Math.floor(Math.random() * 50)))
        .replace('{ability}', ABILITIES_POOL[Math.floor(Math.random() * ABILITIES_POOL.length)]);
}

// 배열 셔플
function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// 시너지 계산
export function calculateSynergy(agents: SuperAgent[]): number {
    if (agents.length === 0) return 0;

    const avgIntelligence = agents.reduce((acc, a) => acc + a.intelligence, 0) / agents.length;
    const avgTrust = agents.reduce((acc, a) => acc + a.trustScore, 0) / agents.length;
    const connectionCount = agents.reduce((acc, a) => acc + a.connections.length, 0);
    const evolutionBonus = agents.filter(a => a.status === 'evolving').length * 2;

    return Math.min(100, (avgIntelligence / 3 + avgTrust + connectionCount / agents.length + evolutionBonus) / 4);
}

// 실시간 통신 메시지 생성
export function generateCommunicationMessage(fromAgent: SuperAgent, toAgent: SuperAgent): {
    from: string;
    to: string;
    type: 'data' | 'sync' | 'alert' | 'learn' | 'evolve';
    content: string;
    timestamp: Date;
} {
    const types: Array<'data' | 'sync' | 'alert' | 'learn' | 'evolve'> = ['data', 'sync', 'alert', 'learn', 'evolve'];
    const type = types[Math.floor(Math.random() * types.length)];

    const messages = {
        data: `데이터 패킷 전송 [크기: ${Math.floor(Math.random() * 1000)}KB]`,
        sync: `상태 동기화 요청 [신뢰도: ${fromAgent.trustScore.toFixed(1)}%]`,
        alert: `경고 공유 [우선순위: ${Math.floor(Math.random() * 5) + 1}]`,
        learn: `학습 결과 공유 [정확도 향상: +${(Math.random() * 5).toFixed(2)}%]`,
        evolve: `진화 프로토콜 동기화 [레벨: ${fromAgent.evolutionLevel} → ${fromAgent.evolutionLevel + 1}]`,
    };

    return {
        from: fromAgent.code,
        to: toAgent.code,
        type,
        content: messages[type],
        timestamp: new Date(),
    };
}

// 자가 업그레이드 이벤트 생성
export function generateUpgradeEvent(): {
    type: 'ability_gained' | 'intelligence_boost' | 'evolution' | 'synergy_unlock' | 'network_expand';
    title: string;
    description: string;
    impact: number;
    affectedAgents: number;
} {
    const events = [
        {
            type: 'ability_gained' as const,
            title: '새로운 능력 습득',
            description: `${ABILITIES_POOL[Math.floor(Math.random() * ABILITIES_POOL.length)]} 능력이 네트워크에 추가됨`,
            impact: 5 + Math.random() * 10,
            affectedAgents: 10 + Math.floor(Math.random() * 50),
        },
        {
            type: 'intelligence_boost' as const,
            title: '지능 향상',
            description: '집단 학습을 통한 전체 지능 지수 상향 조정',
            impact: 2 + Math.random() * 5,
            affectedAgents: 50 + Math.floor(Math.random() * 200),
        },
        {
            type: 'evolution' as const,
            title: '자가 진화 완료',
            description: '새로운 진화 단계 도달. 모든 메트릭 향상.',
            impact: 10 + Math.random() * 15,
            affectedAgents: 5 + Math.floor(Math.random() * 20),
        },
        {
            type: 'synergy_unlock' as const,
            title: '시너지 해제',
            description: '새로운 에이전트 조합으로 시너지 효과 활성화',
            impact: 15 + Math.random() * 20,
            affectedAgents: 3 + Math.floor(Math.random() * 10),
        },
        {
            type: 'network_expand' as const,
            title: '네트워크 확장',
            description: '새로운 에이전트 연결로 협업 범위 확대',
            impact: 3 + Math.random() * 7,
            affectedAgents: 100 + Math.floor(Math.random() * 150),
        },
    ];

    return events[Math.floor(Math.random() * events.length)];
}

// 전체 네트워크 상태
export interface SwarmNetworkState {
    totalAgents: number;
    activeConnections: number;
    messagesPerSecond: number;
    synergyLevel: number;
    evolutionProgress: number;
    learningCapacity: number;
    totalDecisions: number;
    networkHealth: number;
    lastUpgrade: Date;
    upgradeCount: number;
}

export function getInitialNetworkState(): SwarmNetworkState {
    return {
        totalAgents: 500,
        activeConnections: 2500,
        messagesPerSecond: 10000,
        synergyLevel: 85,
        evolutionProgress: 72,
        learningCapacity: 500, // GB/hr
        totalDecisions: 0,
        networkHealth: 99.5,
        lastUpgrade: new Date(),
        upgradeCount: 0,
    };
}
