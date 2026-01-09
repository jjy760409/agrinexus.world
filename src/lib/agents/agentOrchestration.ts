// AgriNexus World OS - 통합 에이전트 오케스트레이션 시스템
// Unified Agent Orchestration System - 전체 시스템 전담 에이전트 연동

// ============================================
// 타입 정의
// ============================================

export interface AgentOrchestrationSystem {
    id: string;
    coreCoordinator: CoreCoordinator;
    dedicatedAgents: DedicatedAgent[];
    agentConnections: AgentConnection[];
    messageQueue: AgentMessage[];
    workflows: Workflow[];
    realTimeStatus: SystemStatus;
    metrics: OrchestrationMetrics;
}

export interface CoreCoordinator {
    id: string;
    name: string;
    status: 'active' | 'busy' | 'maintenance';
    activeWorkflows: number;
    decisionsPerMinute: number;
    lastHeartbeat: Date;
}

export interface DedicatedAgent {
    id: string;
    name: string;
    koreanName: string;
    emoji: string;
    targetSystem: string;               // 담당 시스템 파일명
    targetSystemName: string;           // 담당 시스템 한국어명
    category: AgentCategory;
    capabilities: string[];
    status: 'active' | 'busy' | 'idle' | 'error';
    currentTask: string | null;
    completedTasks: number;
    successRate: number;
    responseTime: number;               // ms
    lastActivity: Date;
    connectedAgents: string[];          // 연결된 다른 에이전트 ID
}

export type AgentCategory =
    | 'cultivation'      // 재배
    | 'environment'      // 환경
    | 'automation'       // 자동화
    | 'analytics'        // 분석
    | 'logistics'        // 물류
    | 'security'         // 보안
    | 'energy'           // 에너지
    | 'api'              // API 연동
    | 'ai_core';         // AI 코어

export interface AgentConnection {
    fromAgent: string;
    toAgent: string;
    connectionType: 'data_flow' | 'command' | 'collaboration' | 'escalation';
    strength: number;                   // 연결 강도 0-100
    latency: number;                    // ms
    messagesExchanged: number;
    lastCommunication: Date;
}

export interface AgentMessage {
    id: string;
    from: string;
    to: string;
    type: 'request' | 'response' | 'notification' | 'alert' | 'data';
    priority: 'low' | 'normal' | 'high' | 'critical';
    payload: Record<string, unknown>;
    timestamp: Date;
    processed: boolean;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    status: 'running' | 'completed' | 'paused' | 'failed';
    startedAt: Date;
    completedAt?: Date;
}

export interface WorkflowStep {
    id: string;
    agentId: string;
    action: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    output?: unknown;
}

export interface SystemStatus {
    totalAgents: number;
    activeAgents: number;
    busyAgents: number;
    idleAgents: number;
    errorAgents: number;
    totalConnections: number;
    activeWorkflows: number;
    messagesInQueue: number;
}

export interface OrchestrationMetrics {
    avgResponseTime: number;
    overallSuccessRate: number;
    tasksCompletedToday: number;
    messagesProcessedToday: number;
    systemUptime: number;
    peakLoad: number;
}

// ============================================
// 전담 에이전트 정의 (50+개)
// ============================================

const DEDICATED_AGENTS: Omit<DedicatedAgent, 'id' | 'status' | 'currentTask' | 'completedTasks' | 'lastActivity' | 'connectedAgents'>[] = [
    // === 재배 시스템 에이전트 (10개) ===
    { name: 'HydroMaster', koreanName: '💧 하이드로마스터', emoji: '💧', targetSystem: 'soillessSmartFarm.ts', targetSystemName: '무토양 스마트팜', category: 'cultivation', capabilities: ['양액관리', 'pH조절', 'EC관리', '순환제어'], successRate: 99.2, responseTime: 15 },
    { name: 'PhotoSynth', koreanName: '☀️ 포토신스', emoji: '☀️', targetSystem: 'quantumPhotosynthesis.ts', targetSystemName: '양자 광합성', category: 'cultivation', capabilities: ['광합성최적화', 'LED스펙트럼', '광량조절'], successRate: 98.8, responseTime: 12 },
    { name: 'GeneEditor', koreanName: '🧬 진에디터', emoji: '🧬', targetSystem: 'dnaEditingSimulator.ts', targetSystemName: 'DNA 편집', category: 'cultivation', capabilities: ['유전자분석', 'CRISPR시뮬', '형질예측'], successRate: 97.5, responseTime: 50 },
    { name: 'SeedOptimizer', koreanName: '🌱 시드옵티마이저', emoji: '🌱', targetSystem: 'quantumSeedOptimizer.ts', targetSystemName: '양자 종자 최적화', category: 'cultivation', capabilities: ['종자선별', '발아최적화', '유전자강화'], successRate: 98.5, responseTime: 20 },
    { name: 'PlantEmpath', koreanName: '💚 플랜트엠파스', emoji: '💚', targetSystem: 'plantEmotionAI.ts', targetSystemName: '식물 감정 AI', category: 'cultivation', capabilities: ['스트레스감지', '건강진단', '성장예측'], successRate: 96.8, responseTime: 18 },
    { name: 'RootNetwork', koreanName: '🌿 루트네트워크', emoji: '🌿', targetSystem: 'rootAINetwork.ts', targetSystemName: '뿌리 AI 네트워크', category: 'cultivation', capabilities: ['뿌리분석', '양분흐름', '지하통신'], successRate: 97.2, responseTime: 25 },
    { name: 'CropDoctor', koreanName: '🩺 크롭닥터', emoji: '🩺', targetSystem: 'cropInfo.ts', targetSystemName: '작물 정보', category: 'cultivation', capabilities: ['질병진단', '해충탐지', '치료추천'], successRate: 98.0, responseTime: 22 },
    { name: 'HarvestAI', koreanName: '🌾 하베스트AI', emoji: '🌾', targetSystem: 'harvestPredictor.ts', targetSystemName: '수확 예측', category: 'cultivation', capabilities: ['수확시기예측', '품질판정', '수확량추정'], successRate: 95.5, responseTime: 30 },
    { name: 'GrowthTracker', koreanName: '📈 그로스트래커', emoji: '📈', targetSystem: 'plantGrowthAnalytics.ts', targetSystemName: '성장 분석', category: 'cultivation', capabilities: ['성장모니터링', '생육단계판정', '성장률계산'], successRate: 97.8, responseTime: 15 },
    { name: 'PlantTalker', koreanName: '🗣️ 플랜트토커', emoji: '🗣️', targetSystem: 'plantConversation.ts', targetSystemName: '식물 대화', category: 'cultivation', capabilities: ['상태전달', '욕구해석', '대화인터페이스'], successRate: 94.5, responseTime: 35 },

    // === 환경 시스템 에이전트 (8개) ===
    { name: 'WeatherMaster', koreanName: '🌤️ 웨더마스터', emoji: '🌤️', targetSystem: 'realWeatherService.ts', targetSystemName: '실제 기상 서비스', category: 'environment', capabilities: ['날씨예보', '기상분석', 'API연동'], successRate: 98.5, responseTime: 100 },
    { name: 'ClimateSync', koreanName: '🌍 클라이메이트싱크', emoji: '🌍', targetSystem: 'globalClimateSync.ts', targetSystemName: '글로벌 기후 동기화', category: 'environment', capabilities: ['기후조율', '지역연동', '예측모델'], successRate: 97.0, responseTime: 80 },
    { name: 'WeatherEngineer', koreanName: '⛈️ 웨더엔지니어', emoji: '⛈️', targetSystem: 'weatherEngineering.ts', targetSystemName: '기상 공학', category: 'environment', capabilities: ['기상제어', '구름생성', '습도조절'], successRate: 96.5, responseTime: 45 },
    { name: 'AquaHarvest', koreanName: '💦 아쿠아하베스트', emoji: '💦', targetSystem: 'atmosphericWater.ts', targetSystemName: '대기 수분 수확', category: 'environment', capabilities: ['수분수집', '안개채취', '물저장'], successRate: 95.8, responseTime: 40 },
    { name: 'AirQuality', koreanName: '🌬️ 에어퀄리티', emoji: '🌬️', targetSystem: 'airQualityMonitor.ts', targetSystemName: '공기질 모니터', category: 'environment', capabilities: ['CO2측정', '공기정화', '환기제어'], successRate: 99.0, responseTime: 10 },
    { name: 'TempControl', koreanName: '🌡️ 템프컨트롤', emoji: '🌡️', targetSystem: 'hvacController.ts', targetSystemName: 'HVAC 제어', category: 'environment', capabilities: ['온도조절', '냉난방', '에너지절약'], successRate: 98.8, responseTime: 8 },
    { name: 'LightMaster', koreanName: '💡 라이트마스터', emoji: '💡', targetSystem: 'ledController.ts', targetSystemName: 'LED 제어', category: 'environment', capabilities: ['광량조절', '스펙트럼변환', '일출일몰시뮬'], successRate: 99.5, responseTime: 5 },
    { name: 'BioElectric', koreanName: '⚡ 바이오일렉트릭', emoji: '⚡', targetSystem: 'bioElectricGrid.ts', targetSystemName: '생체 전기 그리드', category: 'environment', capabilities: ['생체전기측정', '전자기장', '에너지흐름'], successRate: 96.0, responseTime: 20 },

    // === 자동화 시스템 에이전트 (8개) ===
    { name: 'SwarmCommander', koreanName: '🐝 스웜커맨더', emoji: '🐝', targetSystem: 'swarmMicroRobotics.ts', targetSystemName: '군집 마이크로 로봇', category: 'automation', capabilities: ['군집제어', '작업분배', '협동조율'], successRate: 98.2, responseTime: 15 },
    { name: 'NanoSwarm', koreanName: '🔬 나노스웜', emoji: '🔬', targetSystem: 'nanoSwarm.ts', targetSystemName: '나노 로봇 군집', category: 'automation', capabilities: ['분자수준작업', '세포치료', 'DNA수리'], successRate: 97.5, responseTime: 25 },
    { name: 'DroneFleet', koreanName: '🚁 드론플릿', emoji: '🚁', targetSystem: 'droneDelivery.ts', targetSystemName: '드론 배송', category: 'automation', capabilities: ['드론관제', '경로최적화', '배송추적'], successRate: 98.7, responseTime: 12 },
    { name: 'RobotArm', koreanName: '🦾 로봇암', emoji: '🦾', targetSystem: 'robotController.ts', targetSystemName: '로봇 제어', category: 'automation', capabilities: ['수확작업', '이식작업', '정밀조작'], successRate: 99.0, responseTime: 8 },
    { name: 'Conveyor', koreanName: '🔄 컨베이어', emoji: '🔄', targetSystem: 'conveyorSystem.ts', targetSystemName: '컨베이어 시스템', category: 'automation', capabilities: ['물류이동', '분류작업', '속도조절'], successRate: 99.5, responseTime: 5 },
    { name: 'PackMaster', koreanName: '📦 팩마스터', emoji: '📦', targetSystem: 'smartPackaging.ts', targetSystemName: '스마트 포장', category: 'automation', capabilities: ['자동포장', '품질검사', '라벨링'], successRate: 98.5, responseTime: 10 },
    { name: 'MaintBot', koreanName: '🔧 메인트봇', emoji: '🔧', targetSystem: 'predictiveMaintenance.ts', targetSystemName: '예측 유지보수', category: 'automation', capabilities: ['고장예측', '정비스케줄', '부품관리'], successRate: 97.5, responseTime: 50 },
    { name: 'FullAutoAgent', koreanName: '🤖 풀오토에이전트', emoji: '🤖', targetSystem: 'fullAutomationEngine.ts', targetSystemName: '전자동화 엔진', category: 'automation', capabilities: ['통합자동화', '시나리오실행', '예외처리'], successRate: 96.8, responseTime: 20 },

    // === 분석 시스템 에이전트 (6개) ===
    { name: 'MarketAnalyst', koreanName: '📊 마켓애널리스트', emoji: '📊', targetSystem: 'realMarketPriceService.ts', targetSystemName: '실제 시세 서비스', category: 'analytics', capabilities: ['시세분석', '가격예측', '트렌드파악'], successRate: 94.5, responseTime: 150 },
    { name: 'ConsumerMind', koreanName: '🧠 컨슈머마인드', emoji: '🧠', targetSystem: 'consumerAnalytics.ts', targetSystemName: '소비자 분석', category: 'analytics', capabilities: ['수요예측', '세분화', '마케팅최적화'], successRate: 94.5, responseTime: 80 },
    { name: 'DataCruncher', koreanName: '📈 데이터크런처', emoji: '📈', targetSystem: 'analyticsEngine.ts', targetSystemName: '분석 엔진', category: 'analytics', capabilities: ['빅데이터분석', '패턴인식', '인사이트도출'], successRate: 96.0, responseTime: 100 },
    { name: 'SimulatorPro', koreanName: '🎮 시뮬레이터프로', emoji: '🎮', targetSystem: 'simulationEngine.ts', targetSystemName: '시뮬레이션 엔진', category: 'analytics', capabilities: ['시나리오시뮬', '예측모델', '최적화탐색'], successRate: 95.5, responseTime: 200 },
    { name: 'DashboardAI', koreanName: '📱 대시보드AI', emoji: '📱', targetSystem: 'realtimeDashboard.ts', targetSystemName: '실시간 대시보드', category: 'analytics', capabilities: ['실시간모니터링', '알림관리', '시각화'], successRate: 99.0, responseTime: 5 },
    { name: 'ReportGen', koreanName: '📄 리포트젠', emoji: '📄', targetSystem: 'reportGenerator.ts', targetSystemName: '리포트 생성', category: 'analytics', capabilities: ['보고서생성', '인사이트요약', '자동배포'], successRate: 98.0, responseTime: 30 },

    // === 물류 시스템 에이전트 (5개) ===
    { name: 'LogiMaster', koreanName: '🚚 로지마스터', emoji: '🚚', targetSystem: 'hyperLogistics.ts', targetSystemName: '하이퍼 물류', category: 'logistics', capabilities: ['물류최적화', '경로계획', '재고관리'], successRate: 97.5, responseTime: 25 },
    { name: 'TraceChain', koreanName: '⛓️ 트레이스체인', emoji: '⛓️', targetSystem: 'traceabilitySystem.ts', targetSystemName: '이력추적 시스템', category: 'logistics', capabilities: ['이력추적', '진위확인', '투명성보장'], successRate: 99.5, responseTime: 10 },
    { name: 'BlockTrust', koreanName: '💎 블록트러스트', emoji: '💎', targetSystem: 'blockchainExchange.ts', targetSystemName: '블록체인 거래소', category: 'logistics', capabilities: ['스마트계약', '거래검증', '토큰관리'], successRate: 99.8, responseTime: 8 },
    { name: 'OrderFlow', koreanName: '🛒 오더플로우', emoji: '🛒', targetSystem: 'orderManagement.ts', targetSystemName: '주문 관리', category: 'logistics', capabilities: ['주문처리', '배송관리', '고객응대'], successRate: 98.5, responseTime: 15 },
    { name: 'InventoryAI', koreanName: '📦 인벤토리AI', emoji: '📦', targetSystem: 'inventoryOptimizer.ts', targetSystemName: '재고 최적화', category: 'logistics', capabilities: ['재고예측', '발주자동화', '적정재고'], successRate: 96.5, responseTime: 20 },

    // === 보안 에이전트 (3개) ===
    { name: 'BioShield', koreanName: '🛡️ 바이오쉴드', emoji: '🛡️', targetSystem: 'biosecurityAI.ts', targetSystemName: '생체보안 AI', category: 'security', capabilities: ['병원균탐지', '격리제어', '방역관리'], successRate: 99.5, responseTime: 3 },
    { name: 'CyberGuard', koreanName: '🔒 사이버가드', emoji: '🔒', targetSystem: 'cyberSecurity.ts', targetSystemName: '사이버 보안', category: 'security', capabilities: ['침입탐지', '악성코드차단', '접근제어'], successRate: 99.9, responseTime: 1 },
    { name: 'AccessControl', koreanName: '🚪 액세스컨트롤', emoji: '🚪', targetSystem: 'accessManagement.ts', targetSystemName: '접근 관리', category: 'security', capabilities: ['출입관리', '권한제어', '인증처리'], successRate: 99.8, responseTime: 2 },

    // === 에너지 에이전트 (3개) ===
    { name: 'PowerGrid', koreanName: '⚡ 파워그리드', emoji: '⚡', targetSystem: 'energyHarvesting.ts', targetSystemName: '에너지 수확', category: 'energy', capabilities: ['에너지수집', '분배최적화', '저장관리'], successRate: 98.0, responseTime: 10 },
    { name: 'SolarMax', koreanName: '☀️ 솔라맥스', emoji: '☀️', targetSystem: 'solarController.ts', targetSystemName: '태양광 제어', category: 'energy', capabilities: ['태양광최적화', '패널추적', '효율극대화'], successRate: 97.5, responseTime: 15 },
    { name: 'BatteryMind', koreanName: '🔋 배터리마인드', emoji: '🔋', targetSystem: 'batteryManager.ts', targetSystemName: '배터리 관리', category: 'energy', capabilities: ['충전관리', '수명최적화', '방전제어'], successRate: 98.5, responseTime: 8 },

    // === API 연동 에이전트 (4개) ===
    { name: 'APIBridge', koreanName: '🌐 API브릿지', emoji: '🌐', targetSystem: 'realAPIIntegration.ts', targetSystemName: '실제 API 통합', category: 'api', capabilities: ['API연동', '데이터변환', '에러처리'], successRate: 98.0, responseTime: 50 },
    { name: 'DBMaster', koreanName: '💾 DB마스터', emoji: '💾', targetSystem: 'databaseIntegration.ts', targetSystemName: '데이터베이스 통합', category: 'api', capabilities: ['CRUD작업', '캐싱', '백업관리'], successRate: 99.5, responseTime: 5 },
    { name: 'MobileLink', koreanName: '📱 모바일링크', emoji: '📱', targetSystem: 'mobileIntegration.ts', targetSystemName: '모바일 통합', category: 'api', capabilities: ['푸시알림', '오프라인동기화', '앱연동'], successRate: 98.5, responseTime: 20 },
    { name: 'IoTGateway', koreanName: '📡 IoT게이트웨이', emoji: '📡', targetSystem: 'iotGateway.ts', targetSystemName: 'IoT 게이트웨이', category: 'api', capabilities: ['센서연동', '프로토콜변환', '디바이스관리'], successRate: 97.5, responseTime: 10 },

    // === AI 코어 에이전트 (3개) ===
    { name: 'OmniMind', koreanName: '🌌 옴니마인드', emoji: '🌌', targetSystem: 'megaSuperintelligence.ts', targetSystemName: '메가 초지능', category: 'ai_core', capabilities: ['전체조율', '전략수립', '진화관리'], successRate: 99.9, responseTime: 1 },
    { name: 'AgentManager', koreanName: '👑 에이전트매니저', emoji: '👑', targetSystem: 'aiAgentSystem.ts', targetSystemName: 'AI 에이전트 시스템', category: 'ai_core', capabilities: ['에이전트배치', '작업분배', '성능최적화'], successRate: 99.5, responseTime: 2 },
    { name: 'NegotiatorAI', koreanName: '🤝 네고시에이터AI', emoji: '🤝', targetSystem: 'aiNegotiation.ts', targetSystemName: 'AI 협상', category: 'ai_core', capabilities: ['가격협상', '계약체결', '거래최적화'], successRate: 95.0, responseTime: 100 }
];

// ============================================
// 에이전트 오케스트레이션 엔진
// ============================================

export class AgentOrchestrationEngine {
    private system: AgentOrchestrationSystem;

    constructor() {
        this.system = this.initializeSystem();
    }

    private initializeSystem(): AgentOrchestrationSystem {
        const agents = this.createAgents();
        const connections = this.createConnections(agents);

        return {
            id: `orchestration-${Date.now()}`,
            coreCoordinator: {
                id: 'core-1',
                name: 'AgriNexus Central Coordinator',
                status: 'active',
                activeWorkflows: 12,
                decisionsPerMinute: 5000,
                lastHeartbeat: new Date()
            },
            dedicatedAgents: agents,
            agentConnections: connections,
            messageQueue: [],
            workflows: [
                { id: 'wf-1', name: '수확 자동화 워크플로우', description: '식물상태확인→수확시기판정→로봇수확→포장→배송', steps: [], status: 'running', startedAt: new Date() },
                { id: 'wf-2', name: '환경 최적화 워크플로우', description: '센서데이터수집→분석→HVAC조절→조명조절', steps: [], status: 'running', startedAt: new Date() }
            ],
            realTimeStatus: {
                totalAgents: agents.length,
                activeAgents: agents.filter(a => a.status === 'active').length,
                busyAgents: agents.filter(a => a.status === 'busy').length,
                idleAgents: agents.filter(a => a.status === 'idle').length,
                errorAgents: agents.filter(a => a.status === 'error').length,
                totalConnections: connections.length,
                activeWorkflows: 12,
                messagesInQueue: 0
            },
            metrics: {
                avgResponseTime: 25,
                overallSuccessRate: 97.8,
                tasksCompletedToday: 125000,
                messagesProcessedToday: 2500000,
                systemUptime: 99.99,
                peakLoad: 75
            }
        };
    }

    private createAgents(): DedicatedAgent[] {
        return DEDICATED_AGENTS.map((agent, i) => ({
            ...agent,
            id: `agent-${i}`,
            status: Math.random() > 0.1 ? 'active' : 'busy',
            currentTask: Math.random() > 0.7 ? '데이터 분석 중...' : null,
            completedTasks: Math.floor(Math.random() * 10000) + 1000,
            lastActivity: new Date(),
            connectedAgents: []
        }));
    }

    private createConnections(agents: DedicatedAgent[]): AgentConnection[] {
        const connections: AgentConnection[] = [];

        // 같은 카테고리 에이전트 연결
        const categories = [...new Set(agents.map(a => a.category))];
        categories.forEach(cat => {
            const catAgents = agents.filter(a => a.category === cat);
            for (let i = 0; i < catAgents.length; i++) {
                for (let j = i + 1; j < catAgents.length; j++) {
                    connections.push({
                        fromAgent: catAgents[i].id,
                        toAgent: catAgents[j].id,
                        connectionType: 'collaboration',
                        strength: 80 + Math.random() * 20,
                        latency: 5 + Math.random() * 10,
                        messagesExchanged: Math.floor(Math.random() * 100000),
                        lastCommunication: new Date()
                    });
                    catAgents[i].connectedAgents.push(catAgents[j].id);
                    catAgents[j].connectedAgents.push(catAgents[i].id);
                }
            }
        });

        // AI 코어와 모든 에이전트 연결
        const coreAgents = agents.filter(a => a.category === 'ai_core');
        const otherAgents = agents.filter(a => a.category !== 'ai_core');
        coreAgents.forEach(core => {
            otherAgents.forEach(other => {
                connections.push({
                    fromAgent: core.id,
                    toAgent: other.id,
                    connectionType: 'command',
                    strength: 95,
                    latency: 2,
                    messagesExchanged: Math.floor(Math.random() * 50000),
                    lastCommunication: new Date()
                });
            });
        });

        return connections;
    }

    // 에이전트에게 작업 요청
    async requestTask(agentId: string, task: string, data: Record<string, unknown>): Promise<unknown> {
        const agent = this.system.dedicatedAgents.find(a => a.id === agentId);
        if (!agent) throw new Error(`Agent ${agentId} not found`);

        agent.status = 'busy';
        agent.currentTask = task;

        // 시뮬레이션: 응답 시간 후 완료
        await new Promise(resolve => setTimeout(resolve, agent.responseTime));

        agent.status = 'active';
        agent.currentTask = null;
        agent.completedTasks++;
        agent.lastActivity = new Date();

        return { success: true, agent: agent.name, task, result: 'completed' };
    }

    // 에이전트 간 메시지 전송
    sendMessage(from: string, to: string, type: AgentMessage['type'], payload: Record<string, unknown>): void {
        const message: AgentMessage = {
            id: `msg-${Date.now()}`,
            from, to, type, payload,
            priority: 'normal',
            timestamp: new Date(),
            processed: false
        };
        this.system.messageQueue.push(message);
    }

    // 시스템 상태 조회
    getSystem(): AgentOrchestrationSystem { return this.system; }
    getAgents(): DedicatedAgent[] { return this.system.dedicatedAgents; }
    getAgentsByCategory(category: AgentCategory): DedicatedAgent[] {
        return this.system.dedicatedAgents.filter(a => a.category === category);
    }
    getConnections(): AgentConnection[] { return this.system.agentConnections; }
    getMetrics(): OrchestrationMetrics { return this.system.metrics; }
    getStatus(): SystemStatus { return this.system.realTimeStatus; }
}

let orchestrationEngine: AgentOrchestrationEngine | null = null;
export function getAgentOrchestrationEngine(): AgentOrchestrationEngine {
    if (!orchestrationEngine) orchestrationEngine = new AgentOrchestrationEngine();
    return orchestrationEngine;
}

export { DEDICATED_AGENTS };
