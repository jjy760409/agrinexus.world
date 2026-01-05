// AgriNexus World OS - 글로벌 초지능 정보 수집 시스템
// 전세계 스마트팜 정보 실시간 수집, 분석, 자동 적용

export type IntelligenceCategory =
    | 'trend'           // 트렌드
    | 'policy'          // 정책
    | 'technology'      // 기술
    | 'equipment'       // 장비/설비
    | 'seeds'           // 종자
    | 'cultivation'     // 재배 기술
    | 'market'          // 시장
    | 'research'        // 연구
    | 'public_data';    // 공공 데이터

export interface GlobalIntelligence {
    id: string;
    category: IntelligenceCategory;
    title: string;
    summary: string;
    country: string;
    source: string;
    reliability: number; // 0-100
    timestamp: Date;
    impact: 'low' | 'medium' | 'high' | 'critical';
    autoApplicable: boolean;
    appliedAt?: Date;
    tags: string[];
    data?: Record<string, unknown>;
}

export interface PolicyUpdate {
    id: string;
    country: string;
    agency: string;
    title: string;
    description: string;
    effectiveDate: Date;
    incentives?: string[];
    requirements?: string[];
    budget?: string;
    impact: string;
}

export interface TechnologyInnovation {
    id: string;
    name: string;
    category: string;
    description: string;
    origin: string;
    maturityLevel: 'research' | 'pilot' | 'commercial' | 'mainstream';
    efficiency: number;
    cost: string;
    autoDeployable: boolean;
}

export interface SeedInformation {
    id: string;
    name: string;
    scientificName: string;
    category: string;
    origin: string;
    characteristics: string[];
    growthDays: number;
    optimalConditions: {
        temperature: { min: number; max: number };
        humidity: { min: number; max: number };
        light: number;
    };
    yield: string;
    diseaseResistance: string[];
}

// 글로벌 정보 수집 전문 에이전트
export const GLOBAL_INTELLIGENCE_AGENTS = {
    sentinel: {
        id: 'agent-sentinel',
        code: 'S.E.N.T.I.N.E.L.',
        name: 'Strategic Environmental Network Technology Intelligence & Learning',
        koreanName: '글로벌 정보 초지능',
        role: '전세계 스마트팜 정보 실시간 모니터링 및 수집',
        capabilities: [
            '24시간 글로벌 모니터링',
            '195개국 정보 수집',
            '실시간 번역 및 분석',
            '신뢰도 자동 평가',
        ],
        sources: ['FAO', 'USDA', 'EU Agriculture', 'WTO', 'Research Papers', 'News', 'Government Portals'],
        updateFrequency: 'real-time',
        intelligence: 98,
        status: 'active',
    },
    policyTracker: {
        id: 'agent-policy',
        code: 'P.O.L.I.C.Y.T.R.A.C.K.E.R.',
        name: 'Policy Observation & Legislative Intelligence Capture Yield Tracker',
        koreanName: '정책 추적 에이전트',
        role: '각국 농업 정책, 지원금, 규제 변화 모니터링',
        capabilities: [
            '정책 변화 감지',
            '지원금 자동 알림',
            '규제 준수 검토',
            '영향 분석',
        ],
        coverage: ['한국', '미국', 'EU', '일본', '중국', '중동', '동남아', '아프리카'],
        updateFrequency: 'hourly',
        intelligence: 96,
        status: 'active',
    },
    techScout: {
        id: 'agent-tech',
        code: 'T.E.C.H.S.C.O.U.T.',
        name: 'Technology Evolution & Cultivation Hardware Scout',
        koreanName: '신기술 탐지 에이전트',
        role: '최신 스마트팜 기술, 장비, 혁신 발견 및 분석',
        capabilities: [
            '신기술 자동 발견',
            '특허 모니터링',
            '학술 연구 추적',
            '스타트업 동향',
        ],
        focus: ['LED 기술', 'AI/ML', '로보틱스', '센서 기술', '양액 시스템', '에너지 효율'],
        updateFrequency: 'daily',
        intelligence: 97,
        status: 'active',
    },
    autoDeployer: {
        id: 'agent-deployer',
        code: 'A.U.T.O.D.E.P.L.O.Y.',
        name: 'Automated Universal Technology Optimization & Deployment System',
        koreanName: '자동 배포 에이전트',
        role: '검증된 신기술 자동 분석, 테스트, 플랫폼 적용',
        capabilities: [
            '호환성 분석',
            '시뮬레이션 테스트',
            '점진적 배포',
            '롤백 관리',
        ],
        deploymentTypes: ['소프트웨어 업데이트', '알고리즘 개선', '데이터 모델 업데이트', '설정 최적화'],
        successRate: 99.2,
        intelligence: 95,
        status: 'active',
    },
    marketAnalyst: {
        id: 'agent-market',
        code: 'M.A.R.K.E.T.A.I.',
        name: 'Market Analysis & Revenue Kinetics Enhanced Trading AI',
        koreanName: '시장 분석 에이전트',
        role: '농산물 시장 동향, 가격 예측, 수급 분석',
        capabilities: [
            '실시간 가격 추적',
            '수요 예측',
            '수출입 동향',
            '경쟁 분석',
        ],
        markets: ['국내', '미국', 'EU', '일본', '중국', '중동'],
        accuracy: 94.7,
        intelligence: 93,
        status: 'active',
    },
    researchCollector: {
        id: 'agent-research',
        code: 'R.E.S.E.A.R.C.H.',
        name: 'Research Extraction & Scientific Evaluation Analytics Resource Collector Hub',
        koreanName: '연구 수집 에이전트',
        role: '학술 논문, 연구 결과, 실험 데이터 수집 및 분석',
        capabilities: [
            '논문 자동 수집',
            '핵심 발견 추출',
            '적용 가능성 평가',
            '연구 트렌드 분석',
        ],
        databases: ['PubMed', 'arXiv', 'ScienceDirect', 'Nature', 'IEEE', 'KISTI'],
        papersAnalyzed: 150000,
        intelligence: 98,
        status: 'active',
    },
};

// 실시간 글로벌 정보 피드 생성
export function generateGlobalIntelligenceFeed(): GlobalIntelligence[] {
    const categories: IntelligenceCategory[] = ['trend', 'policy', 'technology', 'equipment', 'seeds', 'cultivation', 'market', 'research', 'public_data'];
    const countries = ['KR', 'US', 'JP', 'NL', 'DE', 'CN', 'AE', 'SG', 'AU', 'IL'];

    const feed: GlobalIntelligence[] = [];

    const intelligenceData: Record<IntelligenceCategory, { title: string; summary: string; impact: 'low' | 'medium' | 'high' | 'critical' }[]> = {
        trend: [
            { title: '수직농장 시장 25% 성장 전망', summary: '2026년 글로벌 수직농장 시장이 전년 대비 25% 성장할 것으로 예측됩니다.', impact: 'high' },
            { title: '식물공장 LED 효율 신기록', summary: '새로운 LED 기술이 기존 대비 40% 높은 광효율을 달성했습니다.', impact: 'high' },
            { title: '로봇 수확 기술 상용화 가속', summary: '딸기, 토마토 수확 로봇이 농가에 보급되기 시작했습니다.', impact: 'medium' },
        ],
        policy: [
            { title: '한국 스마트팜 지원금 확대', summary: '농림축산식품부가 2026년 스마트팜 지원 예산을 30% 증액했습니다.', impact: 'critical' },
            { title: 'EU 친환경 농업 인센티브', summary: '탄소 중립 농장에 대한 추가 보조금 정책이 발표되었습니다.', impact: 'high' },
            { title: '일본 식물공장 세제 혜택', summary: '에너지 효율 기준을 충족한 식물공장에 세금 감면이 적용됩니다.', impact: 'medium' },
        ],
        technology: [
            { title: 'AI 병해충 조기 감지 시스템', summary: '딥러닝 기반 병해충 감지가 95% 정확도로 7일 전 예측 가능합니다.', impact: 'critical' },
            { title: '양자 센서 기반 토양 분석', summary: '양자 기술을 활용한 초정밀 토양 분석이 가능해졌습니다.', impact: 'high' },
            { title: '자율주행 파종 로봇', summary: 'GPS와 비전 센서를 결합한 자율 파종 시스템이 개발되었습니다.', impact: 'medium' },
        ],
        equipment: [
            { title: '차세대 다층 재배 시스템', summary: '층간 간격을 30% 줄인 고밀도 재배 시스템이 출시되었습니다.', impact: 'high' },
            { title: '스마트 양액 컨트롤러 v2.0', summary: 'AI 기반 실시간 양액 조절로 수확량이 15% 증가합니다.', impact: 'medium' },
            { title: '태양광 연동 기후 조절 시스템', summary: '재생에너지와 연동된 에너지 효율적 공조 시스템입니다.', impact: 'medium' },
        ],
        seeds: [
            { title: '고기능성 상추 신품종', summary: '비타민 C 함량이 3배 높은 상추 품종이 등록되었습니다.', impact: 'high' },
            { title: '저온 저항성 토마토', summary: '15°C에서도 정상 생육이 가능한 토마토 품종입니다.', impact: 'medium' },
            { title: '급속 생장 바질', summary: '재배 기간이 기존 대비 40% 단축된 바질 품종입니다.', impact: 'medium' },
        ],
        cultivation: [
            { title: 'LED 간헐조명 기술', summary: '간헐적 LED 조사로 전력을 25% 절감하면서 수확량 유지합니다.', impact: 'high' },
            { title: '이산화탄소 펄스 공급', summary: 'CO2 펄스 공급으로 광합성 효율이 18% 향상됩니다.', impact: 'medium' },
            { title: '마이크로바이옴 최적화', summary: '근권 미생물 조절로 양분 흡수율이 개선됩니다.', impact: 'medium' },
        ],
        market: [
            { title: '유기농 채소 수요 급증', summary: '프리미엄 유기농 채소 시장이 전년 대비 40% 성장했습니다.', impact: 'high' },
            { title: '중동 수출 기회 확대', summary: 'UAE, 사우디아라비아의 스마트팜 채소 수입이 증가하고 있습니다.', impact: 'medium' },
            { title: '대형마트 직거래 확대', summary: '주요 유통사가 스마트팜 직접 계약을 늘리고 있습니다.', impact: 'medium' },
        ],
        research: [
            { title: '광합성 효율 최적화 연구', summary: '파장별 광합성 반응 최적화로 수확량 20% 증가 가능합니다.', impact: 'critical' },
            { title: '식물 스트레스 바이오마커', summary: '식물 스트레스를 조기에 감지할 수 있는 바이오마커가 발견되었습니다.', impact: 'high' },
            { title: '수경재배 양액 재활용', summary: '폐양액 90% 이상 재활용 기술이 개발되었습니다.', impact: 'medium' },
        ],
        public_data: [
            { title: 'KOSIS 농업 통계 업데이트', summary: '2025년 스마트팜 현황 통계가 공개되었습니다.', impact: 'medium' },
            { title: 'FAO 글로벌 식량안보 보고서', summary: '실내농업의 식량안보 기여도 분석 보고서입니다.', impact: 'high' },
            { title: 'USDA 실내농업 가이드라인', summary: '미국 실내농업 표준 가이드라인이 개정되었습니다.', impact: 'medium' },
        ],
    };

    for (let i = 0; i < 20; i++) {
        const category = categories[i % categories.length];
        const items = intelligenceData[category];
        const item = items[Math.floor(Math.random() * items.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];

        feed.push({
            id: `intel-${Date.now()}-${i}`,
            category,
            title: item.title,
            summary: item.summary,
            country,
            source: ['FAO', 'USDA', 'EU', 'KISTI', 'arXiv', 'AgriNexus AI'][Math.floor(Math.random() * 6)],
            reliability: 85 + Math.random() * 14,
            timestamp: new Date(Date.now() - Math.random() * 86400000),
            impact: item.impact,
            autoApplicable: Math.random() > 0.6,
            tags: [category, country, 'smartfarm'],
        });
    }

    return feed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// 자동 기술 적용 이벤트 생성
export function generateAutoDeployEvent() {
    const events = [
        { tech: 'LED 스펙트럼 최적화 v2.1', target: '조명 시스템', improvement: '+12% 광효율' },
        { tech: '양액 배합 알고리즘 개선', target: '관개 시스템', improvement: '+8% 양분 흡수' },
        { tech: '병해충 예측 모델 업데이트', target: 'AI 에이전트', improvement: '+5% 정확도' },
        { tech: '에너지 절약 스케줄링', target: '전력 시스템', improvement: '-15% 전력 소비' },
        { tech: '수확 시점 예측 강화', target: '시뮬레이션', improvement: '+3일 정확도' },
    ];

    const event = events[Math.floor(Math.random() * events.length)];

    return {
        id: `deploy-${Date.now()}`,
        ...event,
        status: 'deployed',
        deployedAt: new Date(),
        affectedSystems: Math.floor(Math.random() * 50) + 10,
        successRate: 95 + Math.random() * 5,
    };
}

// 국가별 스마트팜 현황
export const COUNTRY_SMARTFARM_STATUS = {
    KR: { name: '한국', farms: 8500, growth: 15, policy: 'active', incentives: ['세제혜택', '보조금', '기술지원'] },
    US: { name: '미국', farms: 2500, growth: 22, policy: 'active', incentives: ['세금공제', '연구지원'] },
    NL: { name: '네덜란드', farms: 12000, growth: 8, policy: 'mature', incentives: ['EU보조금', '에너지지원'] },
    JP: { name: '일본', farms: 6200, growth: 12, policy: 'active', incentives: ['세금감면', '시설보조'] },
    AE: { name: 'UAE', farms: 450, growth: 45, policy: 'aggressive', incentives: ['무관세', '토지제공', '전력지원'] },
    SG: { name: '싱가포르', farms: 280, growth: 35, policy: 'aggressive', incentives: ['보조금', '연구지원'] },
    CN: { name: '중국', farms: 15000, growth: 28, policy: 'active', incentives: ['정부보조', '기술이전'] },
    AU: { name: '호주', farms: 890, growth: 18, policy: 'emerging', incentives: ['세금혜택', '물지원'] },
    IL: { name: '이스라엘', farms: 320, growth: 20, policy: 'active', incentives: ['연구지원', '수출지원'] },
    DE: { name: '독일', farms: 4500, growth: 10, policy: 'mature', incentives: ['EU보조금', '친환경인증'] },
};
