// AgriNexus World OS - AI 슈퍼 에이전트 시스템
// AI Super Agent System - 세계 최강 10인 에이전트 팀

// ============================================
// 타입 정의
// ============================================

export interface AIAgentSystem {
    id: string;
    farmId: string;
    agents: SuperAgent[];
    taskQueue: AgentTask[];
    completedTasks: CompletedTask[];
    discoveries: Discovery[];
    technologies: CollectedTechnology[];
    globalNetwork: GlobalNetwork;
    metrics: AgentSystemMetrics;
    status: 'running' | 'paused' | 'maintenance';
    startedAt: Date;
    uptime: number;                     // hours
}

export interface SuperAgent {
    id: string;
    name: string;
    koreanName: string;
    role: AgentRole;
    specialty: string[];
    avatar: string;                     // emoji
    status: AgentStatus;
    currentTask?: AgentTask;
    performance: AgentPerformance;
    skills: AgentSkill[];
    memory: AgentMemory;
    connections: string[];              // connected agent IDs
    lastAction: Date;
    totalActionsToday: number;
    discoveriesToday: number;
}

export type AgentRole =
    | 'research'            // 연구/논문 수집
    | 'technology_scout'    // 기술 발굴
    | 'patent_analyst'      // 특허 분석 및 회피
    | 'developer'           // 시스템 개발
    | 'innovator'           // 혁신 기능 생성
    | 'market_intelligence' // 시장 정보 수집
    | 'compliance'          // 법률/저작권 검토
    | 'integrator'          // 시스템 통합
    | 'quality_assurance'   // 품질 검증
    | 'global_expansion';   // 글로벌 확장

export type AgentStatus = 'working' | 'analyzing' | 'collecting' | 'developing' | 'idle' | 'resting' | 'collaborating';

export interface AgentPerformance {
    efficiency: number;                 // 0-100
    accuracy: number;                   // 0-100
    speed: number;                      // tasks/hour
    creativity: number;                 // 0-100
    collaboration: number;              // 0-100
    learningRate: number;               // 0-1
    totalTasksCompleted: number;
    successRate: number;                // %
    averageTaskTime: number;            // minutes
}

export interface AgentSkill {
    name: string;
    level: number;                      // 1-100
    experience: number;                 // hours
    certifications: string[];
}

export interface AgentMemory {
    shortTerm: MemoryItem[];
    longTerm: MemoryItem[];
    patterns: LearnedPattern[];
    expertise: string[];
    totalKnowledge: number;             // items
}

export interface MemoryItem {
    id: string;
    type: 'fact' | 'pattern' | 'method' | 'insight' | 'connection';
    content: string;
    source: string;
    confidence: number;
    timestamp: Date;
    accessCount: number;
}

export interface LearnedPattern {
    id: string;
    name: string;
    description: string;
    applications: string[];
    successRate: number;
}

export interface AgentTask {
    id: string;
    type: TaskType;
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    assignedTo: string[];               // agent IDs
    status: 'pending' | 'in_progress' | 'review' | 'completed' | 'failed';
    progress: number;                   // 0-100
    createdAt: Date;
    deadline?: Date;
    dependencies: string[];
    outputs: TaskOutput[];
    legalCleared: boolean;
}

export type TaskType =
    | 'research_collection'
    | 'technology_scan'
    | 'patent_analysis'
    | 'system_development'
    | 'innovation_creation'
    | 'market_analysis'
    | 'legal_review'
    | 'integration'
    | 'quality_test'
    | 'global_deployment';

export interface TaskOutput {
    type: 'report' | 'code' | 'design' | 'analysis' | 'recommendation' | 'system';
    name: string;
    content: string;
    quality: number;
    legalStatus: 'cleared' | 'pending' | 'requires_review';
}

export interface CompletedTask extends AgentTask {
    completedAt: Date;
    duration: number;                   // minutes
    qualityScore: number;
    impactScore: number;
    reusability: number;
}

export interface Discovery {
    id: string;
    type: DiscoveryType;
    title: string;
    description: string;
    source: string;
    country: string;
    discoveredBy: string;               // agent ID
    timestamp: Date;
    relevanceScore: number;             // 0-100
    innovationScore: number;            // 0-100
    legalStatus: LegalStatus;
    applicationPotential: string[];
    implemented: boolean;
}

export type DiscoveryType =
    | 'research_paper'
    | 'patent'
    | 'technology'
    | 'method'
    | 'product'
    | 'startup'
    | 'regulation'
    | 'market_trend';

export interface LegalStatus {
    copyrightFree: boolean;
    patentFree: boolean;
    openSource: boolean;
    publicDomain: boolean;
    requiresLicense: boolean;
    licenseType?: string;
    commercialUseAllowed: boolean;
    modificationAllowed: boolean;
    reviewedBy: string;
    reviewedAt: Date;
    notes: string;
}

export interface CollectedTechnology {
    id: string;
    name: string;
    koreanName: string;
    category: string;
    description: string;
    source: string;
    originalCreator: string;
    legalStatus: LegalStatus;
    adaptationPlan: string;
    implementationStatus: 'collected' | 'analyzing' | 'adapting' | 'implemented' | 'rejected';
    agrinexusVersion: string;
    improvements: string[];
    collectedBy: string;
    collectedAt: Date;
}

export interface GlobalNetwork {
    regions: NetworkRegion[];
    dataSources: DataSource[];
    partnerships: Partnership[];
    totalCountries: number;
    totalSources: number;
    lastGlobalScan: Date;
}

export interface NetworkRegion {
    id: string;
    name: string;
    countries: string[];
    activeSources: number;
    lastUpdate: Date;
    status: 'active' | 'limited' | 'offline';
}

export interface DataSource {
    id: string;
    name: string;
    type: 'academic' | 'patent' | 'news' | 'market' | 'government' | 'industry' | 'open_source';
    url: string;
    region: string;
    reliability: number;
    updateFrequency: string;
    legalCompliant: boolean;
    lastAccess: Date;
}

export interface Partnership {
    id: string;
    organization: string;
    type: 'research' | 'technology' | 'data' | 'market';
    country: string;
    status: 'active' | 'pending' | 'inactive';
    benefits: string[];
}

export interface AgentSystemMetrics {
    totalAgents: number;
    activeAgents: number;
    tasksCompletedToday: number;
    discoveriestoday: number;
    technologiesCollected: number;
    technologiesImplemented: number;
    globalCoverage: number;             // % of target countries
    legalComplianceRate: number;        // %
    systemUptime: number;               // hours
    averageAgentEfficiency: number;     // %
}

// ============================================
// AI 슈퍼 에이전트 엔진
// ============================================

export class AIAgentSystemEngine {
    private system: AIAgentSystem;
    private isRunning: boolean = false;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): AIAgentSystem {
        const agents = this.createSuperAgents();

        return {
            id: `agent-system-${Date.now()}`,
            farmId,
            agents,
            taskQueue: this.generateInitialTasks(),
            completedTasks: [],
            discoveries: this.generateInitialDiscoveries(),
            technologies: this.generateInitialTechnologies(),
            globalNetwork: this.createGlobalNetwork(),
            metrics: {
                totalAgents: 10,
                activeAgents: 10,
                tasksCompletedToday: 156,
                discoveriestoday: 23,
                technologiesCollected: 1250,
                technologiesImplemented: 485,
                globalCoverage: 78,
                legalComplianceRate: 100,
                systemUptime: 8760,
                averageAgentEfficiency: 94.5
            },
            status: 'running',
            startedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
            uptime: 8760
        };
    }

    private createSuperAgents(): SuperAgent[] {
        const agentDefinitions: { role: AgentRole; name: string; koreanName: string; avatar: string; specialty: string[] }[] = [
            { role: 'research', name: 'Dr. Research', koreanName: '리서치 박사', avatar: '🔬', specialty: ['논문 분석', '연구 동향', '학술 데이터베이스', '메타분석'] },
            { role: 'technology_scout', name: 'Tech Scout', koreanName: '기술 스카우트', avatar: '🔭', specialty: ['기술 발굴', '스타트업 모니터링', '혁신 트렌드', '기술 평가'] },
            { role: 'patent_analyst', name: 'Patent Master', koreanName: '특허 마스터', avatar: '📜', specialty: ['특허 분석', '특허 회피 설계', 'FTO 분석', 'IP 전략'] },
            { role: 'developer', name: 'Dev Genius', koreanName: '개발 천재', avatar: '💻', specialty: ['시스템 설계', '코드 개발', '아키텍처', '최적화'] },
            { role: 'innovator', name: 'Innovator X', koreanName: '이노베이터 X', avatar: '💡', specialty: ['혁신 아이디어', '창의적 솔루션', '파괴적 기술', '미래 예측'] },
            { role: 'market_intelligence', name: 'Market Eye', koreanName: '마켓 아이', avatar: '📊', specialty: ['시장 분석', '경쟁사 모니터링', '트렌드 예측', '소비자 인사이트'] },
            { role: 'compliance', name: 'Legal Guardian', koreanName: '법률 수호자', avatar: '⚖️', specialty: ['저작권 검토', '라이선스 분석', '법률 준수', '리스크 관리'] },
            { role: 'integrator', name: 'System Weaver', koreanName: '시스템 위버', avatar: '🔗', specialty: ['시스템 통합', 'API 연동', '데이터 파이프라인', '호환성'] },
            { role: 'quality_assurance', name: 'Quality Master', koreanName: '품질 마스터', avatar: '✅', specialty: ['품질 검증', '테스트 자동화', '성능 분석', '버그 탐지'] },
            { role: 'global_expansion', name: 'Global Connector', koreanName: '글로벌 커넥터', avatar: '🌍', specialty: ['글로벌 확장', '현지화', '파트너십', '규제 적응'] }
        ];

        return agentDefinitions.map((def, i) => this.createAgent(def, i));
    }

    private createAgent(def: { role: AgentRole; name: string; koreanName: string; avatar: string; specialty: string[] }, index: number): SuperAgent {
        return {
            id: `agent-${index}`,
            name: def.name,
            koreanName: def.koreanName,
            role: def.role,
            specialty: def.specialty,
            avatar: def.avatar,
            status: 'working',
            performance: {
                efficiency: 90 + Math.random() * 10,
                accuracy: 92 + Math.random() * 8,
                speed: 8 + Math.random() * 7,
                creativity: 85 + Math.random() * 15,
                collaboration: 88 + Math.random() * 12,
                learningRate: 0.15 + Math.random() * 0.1,
                totalTasksCompleted: 500 + Math.floor(Math.random() * 1000),
                successRate: 95 + Math.random() * 5,
                averageTaskTime: 15 + Math.random() * 30
            },
            skills: def.specialty.map(s => ({ name: s, level: 85 + Math.random() * 15, experience: 500 + Math.random() * 1000, certifications: [] })),
            memory: {
                shortTerm: [],
                longTerm: [],
                patterns: [],
                expertise: def.specialty,
                totalKnowledge: 10000 + Math.floor(Math.random() * 50000)
            },
            connections: [],
            lastAction: new Date(),
            totalActionsToday: 50 + Math.floor(Math.random() * 100),
            discoveriesToday: 2 + Math.floor(Math.random() * 8)
        };
    }

    private generateInitialTasks(): AgentTask[] {
        return [
            { id: 't-1', type: 'research_collection', priority: 'high', title: '최신 스마트팜 논문 수집', description: 'Nature, Science 등 최신 스마트팜 관련 논문 수집', assignedTo: ['agent-0'], status: 'in_progress', progress: 67, createdAt: new Date(), dependencies: [], outputs: [], legalCleared: true },
            { id: 't-2', type: 'technology_scan', priority: 'high', title: '글로벌 AgriTech 스타트업 스캔', description: '전세계 AgriTech 스타트업 신기술 발굴', assignedTo: ['agent-1'], status: 'in_progress', progress: 45, createdAt: new Date(), dependencies: [], outputs: [], legalCleared: true },
            { id: 't-3', type: 'patent_analysis', priority: 'medium', title: 'AI 관개 시스템 특허 분석', description: '경쟁사 특허 회피 설계', assignedTo: ['agent-2'], status: 'in_progress', progress: 78, createdAt: new Date(), dependencies: [], outputs: [], legalCleared: true },
            { id: 't-4', type: 'system_development', priority: 'critical', title: '양자 센서 통합 모듈 개발', description: '새로운 양자 센서 시스템 개발', assignedTo: ['agent-3'], status: 'in_progress', progress: 52, createdAt: new Date(), dependencies: [], outputs: [], legalCleared: true },
            { id: 't-5', type: 'innovation_creation', priority: 'high', title: '식물 신경망 혁신 기능', description: '세계 최초 식물-AI 직접 통신 시스템', assignedTo: ['agent-4'], status: 'in_progress', progress: 34, createdAt: new Date(), dependencies: [], outputs: [], legalCleared: true }
        ];
    }

    private generateInitialDiscoveries(): Discovery[] {
        return [
            { id: 'd-1', type: 'research_paper', title: 'MIT - 광합성 효율 50% 향상 나노 입자', description: '엽록체에 주입 가능한 나노 입자로 광합성 효율 증대', source: 'MIT Research', country: 'USA', discoveredBy: 'agent-0', timestamp: new Date(), relevanceScore: 95, innovationScore: 92, legalStatus: { copyrightFree: false, patentFree: false, openSource: false, publicDomain: false, requiresLicense: true, licenseType: 'Academic License', commercialUseAllowed: true, modificationAllowed: true, reviewedBy: 'agent-6', reviewedAt: new Date(), notes: '상업적 활용 가능, 라이선스 필요' }, applicationPotential: ['광합성 AI', '생체광자 수집'], implemented: false },
            { id: 'd-2', type: 'technology', title: '네덜란드 Wageningen - 수직농장 AI 제어', description: '완전 자율 수직농장 관리 AI 시스템', source: 'Wageningen University', country: 'Netherlands', discoveredBy: 'agent-1', timestamp: new Date(), relevanceScore: 88, innovationScore: 85, legalStatus: { copyrightFree: true, patentFree: true, openSource: true, publicDomain: false, requiresLicense: false, commercialUseAllowed: true, modificationAllowed: true, reviewedBy: 'agent-6', reviewedAt: new Date(), notes: '오픈소스, 자유 사용 가능' }, applicationPotential: ['전자동화', 'AI 에이전트'], implemented: true },
            { id: 'd-3', type: 'patent', title: '이스라엘 Netafim - 드립 관개 최적화', description: '토양 센서 기반 실시간 드립 관개 최적화', source: 'USPTO', country: 'Israel', discoveredBy: 'agent-2', timestamp: new Date(), relevanceScore: 82, innovationScore: 78, legalStatus: { copyrightFree: false, patentFree: false, openSource: false, publicDomain: false, requiresLicense: true, licenseType: 'Patent License', commercialUseAllowed: false, modificationAllowed: false, reviewedBy: 'agent-6', reviewedAt: new Date(), notes: '특허 보호, 회피 설계 필요' }, applicationPotential: ['대기 수분', '스마트 관개'], implemented: false }
        ];
    }

    private generateInitialTechnologies(): CollectedTechnology[] {
        return [
            { id: 'tech-1', name: 'Open Source Climate Control', koreanName: '오픈소스 기후제어', category: '환경제어', description: 'GPL 라이선스 기후 제어 알고리즘', source: 'GitHub', originalCreator: 'OpenAg Foundation', legalStatus: { copyrightFree: true, patentFree: true, openSource: true, publicDomain: false, requiresLicense: false, commercialUseAllowed: true, modificationAllowed: true, reviewedBy: 'agent-6', reviewedAt: new Date(), notes: '자유 사용' }, adaptationPlan: 'AgriNexus 아키텍처에 맞게 수정', implementationStatus: 'implemented', agrinexusVersion: '기상 공학 시스템', improvements: ['성능 40% 향상', 'AI 예측 추가'], collectedBy: 'agent-1', collectedAt: new Date() },
            { id: 'tech-2', name: 'Public Domain Sensor Fusion', koreanName: '퍼블릭 도메인 센서 융합', category: '센서', description: '공개 도메인 다중 센서 융합 알고리즘', source: 'Academic Paper', originalCreator: 'N/A', legalStatus: { copyrightFree: true, patentFree: true, openSource: false, publicDomain: true, requiresLicense: false, commercialUseAllowed: true, modificationAllowed: true, reviewedBy: 'agent-6', reviewedAt: new Date(), notes: '퍼블릭 도메인' }, adaptationPlan: '양자 센서와 통합', implementationStatus: 'implemented', agrinexusVersion: '양자 바이오센싱', improvements: ['양자 정밀도 추가'], collectedBy: 'agent-0', collectedAt: new Date() }
        ];
    }

    private createGlobalNetwork(): GlobalNetwork {
        return {
            regions: [
                { id: 'na', name: 'North America', countries: ['USA', 'Canada', 'Mexico'], activeSources: 250, lastUpdate: new Date(), status: 'active' },
                { id: 'eu', name: 'Europe', countries: ['Netherlands', 'Germany', 'UK', 'France', 'Spain', 'Italy'], activeSources: 320, lastUpdate: new Date(), status: 'active' },
                { id: 'asia', name: 'Asia Pacific', countries: ['Japan', 'Korea', 'China', 'Singapore', 'Australia'], activeSources: 280, lastUpdate: new Date(), status: 'active' },
                { id: 'mena', name: 'Middle East & Africa', countries: ['Israel', 'UAE', 'South Africa', 'Kenya'], activeSources: 120, lastUpdate: new Date(), status: 'active' },
                { id: 'latam', name: 'Latin America', countries: ['Brazil', 'Chile', 'Argentina', 'Colombia'], activeSources: 85, lastUpdate: new Date(), status: 'active' }
            ],
            dataSources: [
                { id: 'src-1', name: 'PubMed', type: 'academic', url: 'https://pubmed.ncbi.nlm.nih.gov', region: 'na', reliability: 98, updateFrequency: 'daily', legalCompliant: true, lastAccess: new Date() },
                { id: 'src-2', name: 'USPTO Patents', type: 'patent', url: 'https://www.uspto.gov', region: 'na', reliability: 100, updateFrequency: 'weekly', legalCompliant: true, lastAccess: new Date() },
                { id: 'src-3', name: 'Crunchbase', type: 'market', url: 'https://www.crunchbase.com', region: 'na', reliability: 92, updateFrequency: 'daily', legalCompliant: true, lastAccess: new Date() },
                { id: 'src-4', name: 'GitHub', type: 'open_source', url: 'https://github.com', region: 'na', reliability: 95, updateFrequency: 'hourly', legalCompliant: true, lastAccess: new Date() },
                { id: 'src-5', name: 'arXiv', type: 'academic', url: 'https://arxiv.org', region: 'na', reliability: 96, updateFrequency: 'daily', legalCompliant: true, lastAccess: new Date() }
            ],
            partnerships: [
                { id: 'p-1', organization: 'MIT Media Lab', type: 'research', country: 'USA', status: 'active', benefits: ['연구 협력', '데이터 공유'] },
                { id: 'p-2', organization: 'Wageningen University', type: 'research', country: 'Netherlands', status: 'active', benefits: ['농업 기술', '학술 교류'] }
            ],
            totalCountries: 35,
            totalSources: 1055,
            lastGlobalScan: new Date()
        };
    }

    // 에이전트 액션 실행
    executeAgentAction(agentId: string, action: string): { success: boolean; result: string } {
        const agent = this.system.agents.find(a => a.id === agentId);
        if (!agent) return { success: false, result: 'Agent not found' };

        agent.lastAction = new Date();
        agent.totalActionsToday++;

        return { success: true, result: `${agent.koreanName}이(가) ${action} 수행 완료` };
    }

    // 글로벌 스캔 실행
    runGlobalScan(): { discoveries: number; technologies: number } {
        const discoveries = Math.floor(5 + Math.random() * 15);
        const technologies = Math.floor(2 + Math.random() * 8);

        this.system.metrics.discoveriestoday += discoveries;
        this.system.globalNetwork.lastGlobalScan = new Date();

        return { discoveries, technologies };
    }

    // 시스템 상태 조회
    getSystem(): AIAgentSystem { return this.system; }
    getAgent(agentId: string): SuperAgent | undefined { return this.system.agents.find(a => a.id === agentId); }
    getAgentByRole(role: AgentRole): SuperAgent | undefined { return this.system.agents.find(a => a.role === role); }
    getMetrics(): AgentSystemMetrics { return this.system.metrics; }
    getTasks(): AgentTask[] { return this.system.taskQueue; }
    getDiscoveries(): Discovery[] { return this.system.discoveries; }
    getTechnologies(): CollectedTechnology[] { return this.system.technologies; }
}

// 싱글톤
const agentEngines: Map<string, AIAgentSystemEngine> = new Map();
export function getAIAgentSystemEngine(farmId: string): AIAgentSystemEngine {
    if (!agentEngines.has(farmId)) agentEngines.set(farmId, new AIAgentSystemEngine(farmId));
    return agentEngines.get(farmId)!;
}

export const AGENT_ROLE_ICONS: Record<AgentRole, string> = {
    research: '🔬',
    technology_scout: '🔭',
    patent_analyst: '📜',
    developer: '💻',
    innovator: '💡',
    market_intelligence: '📊',
    compliance: '⚖️',
    integrator: '🔗',
    quality_assurance: '✅',
    global_expansion: '🌍'
};

export const AGENT_ROLE_NAMES: Record<AgentRole, string> = {
    research: '연구 수집',
    technology_scout: '기술 발굴',
    patent_analyst: '특허 분석',
    developer: '시스템 개발',
    innovator: '혁신 생성',
    market_intelligence: '시장 정보',
    compliance: '법률 검토',
    integrator: '시스템 통합',
    quality_assurance: '품질 검증',
    global_expansion: '글로벌 확장'
};
