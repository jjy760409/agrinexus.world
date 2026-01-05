// AgriNexus World OS - Core Systems Data

import { AgriSystem, ClusterType } from '@/types/systems';

// Helper to create system
function createSystem(
    id: string,
    code: string,
    name: string,
    fullName: string,
    description: string,
    icon: string,
    cluster: ClusterType,
    capabilities: string[]
): AgriSystem {
    return {
        id,
        code,
        name,
        fullName,
        description,
        icon,
        cluster,
        status: 'active',
        priority: 'high',
        metrics: {
            efficiency: 85 + Math.random() * 15,
            uptime: 99 + Math.random() * 0.9,
            load: 30 + Math.random() * 40,
            dataFlow: 10 + Math.random() * 50,
            aiScore: 90 + Math.random() * 10,
        },
        capabilities,
        connections: [],
        lastUpdate: new Date(),
    };
}

// ============================================
// CORE SYSTEMS (101-120)
// ============================================

export const CORE_SYSTEMS: AgriSystem[] = [
    createSystem(
        '101', 'N.E.X.U.S.', 'NEXUS',
        'Network Exchange for Universal Synchronization',
        '글로벌 기관·투자자·시장·사용자 간 실시간 연결 허브로, 자동 신뢰 네트워크와 인증 시스템을 통해 전세계 농업 생태계를 하나로 연결합니다.',
        '🔗', 'core',
        ['글로벌 연결', '신뢰 네트워크', '실시간 인증', '생태계 통합']
    ),
    createSystem(
        '102', 'E.L.E.M.E.N.T.', 'ELEMENT',
        'Environmental Learning & Elemental Management ENgine Technology',
        '토양·물·빛·기후 등 자연 요소를 실시간 분석하여 작물별 최적 성장 환경을 조성하는 AI 기반 농업 환경 요소 조절 시스템입니다.',
        '🌪️', 'core',
        ['환경 분석', '기후 조절', '토양 관리', '광량 최적화']
    ),
    createSystem(
        '103', 'I.M.P.U.L.S.E.', 'IMPULSE',
        'Intelligent Management of Power & Utility for Sustainable Energy',
        '스마트팜 운영에 필요한 에너지 흐름을 분석·예측하여 자가 발전, 저장, 분산을 최적화하는 지능형 에너지 펄스 엔진입니다.',
        '⚡', 'core',
        ['에너지 최적화', '자가 발전', '분산 저장', '전력 예측']
    ),
    createSystem(
        '104', 'P.R.O.T.O.C.O.L.', 'PROTOCOL',
        'Policy & Regulation Optimization Through COmpliance & Legal integration',
        '국가별 농업 관련 법·세제·수출입·검역 프로토콜을 자동 수집하고, 거래 및 운영에 실시간 적용하는 글로벌 통합 규정 자동화 시스템입니다.',
        '📜', 'core',
        ['규정 자동화', '법률 준수', '수출입 관리', '검역 프로토콜']
    ),
    createSystem(
        '105', 'R.E.S.O.N.A.N.C.E.', 'RESONANCE',
        'Responsive Ecosystem for Strategic Opportunity & Network Alignment',
        '전세계 시장, 사용자, 정책 변화에 즉각 공명하며 동조하는 반응형 비즈니스 전략 시뮬레이터로, 시장 충격 흡수 및 기회 포착에 최적화됩니다.',
        '🎶', 'core',
        ['시장 분석', '전략 시뮬레이션', '기회 포착', '위험 흡수']
    ),
    createSystem(
        '106', 'D.I.M.E.N.S.I.O.N.', 'DIMENSION',
        'Dynamic Intelligence for Multi-dimensional ENvironment & Solution Optimization Network',
        '각국의 경제·사회·문화·기후·인프라 차원을 AI가 인식하여 맞춤형 농업 솔루션을 다차원으로 설계하는 세계 유일의 확장형 공간 알고리즘입니다.',
        '🧭', 'core',
        ['다차원 분석', '맞춤형 설계', '문화 인식', '공간 알고리즘']
    ),
    createSystem(
        '107', 'V.A.L.I.A.N.T.', 'VALIANT',
        'Vigilant Autonomous Logistics & Infrastructure for Agri-Network Tenacity',
        '극한 상황에서도 시스템을 끝까지 유지하며, 외부 공격·내부 붕괴에도 살아남는 회복탄력형 농업 운영 보호 시스템입니다.',
        '🛡️', 'core',
        ['시스템 보호', '회복탄력성', '위험 방어', '자동 복구']
    ),
    createSystem(
        '108', 'C.O.N.V.E.R.G.E.', 'CONVERGE',
        'Coordinated Optimization Network for Value-driven Ecosystem Regeneration & Growth Enablement',
        '기술·정책·투자·문화·수요의 다양한 흐름을 하나로 융합해, 새로운 시장을 창출하고 기존 시장을 재정의하는 미래지향 융합 인프라입니다.',
        '🔄', 'core',
        ['기술 융합', '시장 창출', '생태계 재생', '가치 통합']
    ),
    createSystem(
        '109', 'S.A.N.C.T.U.A.R.Y.', 'SANCTUARY',
        'Sustainable Agriculture Network for Conservation, Trust & Universal Agri-Resource Yield',
        '환경·동물·사용자 모두에게 안전하고 지속가능한 생태농업 보호구역을 AI가 자동 조성하여, 공존을 실현하는 스마트 생명 보호 시스템입니다.',
        '🕊️', 'core',
        ['생태 보호', '지속가능성', '생명 공존', '보호구역 조성']
    ),
    createSystem(
        '110', 'A.U.R.O.R.A.', 'AURORA',
        'Autonomous Universal Resource Optimization & Revolutionary Agriculture',
        'AI가 새벽처럼 미래 농업의 신호를 포착하고, 전략적으로 선제 대응하는 전방위 혁신 촉발 시스템입니다. 빛처럼 퍼지는 미래 농업의 길잡이입니다.',
        '🌌', 'core',
        ['미래 예측', '혁신 촉발', '선제 대응', '전략 설계']
    ),
];

// ============================================
// LIFE SCIENCE SYSTEMS (141-160)
// ============================================

export const LIFESCIENCE_SYSTEMS: AgriSystem[] = [
    createSystem(
        '141', 'B.R.E.A.T.H.E.', 'BREATHE',
        'Bio-Responsive Environmental Atmosphere & Temperature Harmonization Engine',
        '농장 공기질과 이산화탄소/산소 균형을 AI가 모니터링하며 작물 생장에 최적화하는 생물 반응 기반 공기 조절 시스템입니다.',
        '🌬️', 'lifescience',
        ['공기질 모니터링', 'CO2/O2 균형', '생물 반응', '환기 최적화']
    ),
    createSystem(
        '145', 'C.E.L.L.', 'CELL',
        'Cellular Evaluation & Lifecycle Learning system',
        '작물 조직세포 변화(색, 크기, 흡수 등)를 분석하여 질병·영양 결핍 등을 조기에 예측하는 생체신호 AI 감지 엔진입니다.',
        '🔬', 'lifescience',
        ['세포 분석', '질병 예측', '영양 감지', '생체신호']
    ),
    createSystem(
        '146', 'S.P.L.I.C.E.', 'SPLICE',
        'Synthetic Plant Lifecycle & Intelligent Crop Engineering',
        '종자 및 재배식물 유전자 편집(GE/CRISPR) 데이터 기반 AI 모델링 – 고수익 품종 육성을 위한 연구 시뮬레이터입니다.',
        '🧬', 'lifescience',
        ['유전자 편집', 'CRISPR 모델링', '품종 육성', '연구 시뮬레이션']
    ),
    createSystem(
        '147', 'D.N.A.R.', 'DNAR',
        'Distributed Network for Agricultural Records',
        '농업유전자 정보의 블록체인 보존/유통 시스템 – 종자/품종의 출처·소유권·이력 자동 기록합니다.',
        '🧪', 'lifescience',
        ['블록체인 기록', '유전자 보존', '이력 추적', '소유권 관리']
    ),
    createSystem(
        '149', 'A.L.G.A.E.', 'ALGAE',
        'Aquatic Life Growth & Agri-Ecosystem Engine',
        '해양·담수 생물(해조류, 클로렐라 등)을 스마트팜 방식으로 배양하고, 바이오연료/식품에 연결하는 수생농업 AI입니다.',
        '🧫', 'lifescience',
        ['수생농업', '해조류 배양', '바이오연료', '식품 연결']
    ),
    createSystem(
        '151', 'B.A.C.T.E.R.I.A.', 'BACTERIA',
        'Beneficial Agricultural Culture for Targeted Enhancement & Resource Integration Algorithm',
        '유익 미생물 기반 작물생장 보조제를 자동 배합하고 투입 시기/방법을 설계하는 생물 농약 솔루션입니다.',
        '🦠', 'lifescience',
        ['미생물 배합', '생물농약', '생장 촉진', '토양 개선']
    ),
];

// ============================================
// ROBOTICS SYSTEMS (142-160)
// ============================================

export const ROBOTICS_SYSTEMS: AgriSystem[] = [
    createSystem(
        '142', 'L.A.B.O.R.', 'LABOR',
        'Logistics & Automation for Biological Operations & Robotics',
        '사람-기계 협업 로봇 운영 시스템. 작물 수확·포장·분류를 로봇팔과 AGV가 AI 명령에 따라 자동 수행합니다.',
        '🤖', 'robotics',
        ['로봇 협업', '자동 수확', '포장 자동화', 'AGV 제어']
    ),
    createSystem(
        '143', 'G.E.A.R.', 'GEAR',
        'General Equipment Analytics & Reliability system',
        '각 스마트팜 장비(로봇, 센서, 기기 등)의 고장 예측과 수명 분석을 통해 교체주기·정비시점을 자동 제시하는 유지보수 AI입니다.',
        '🛠️', 'robotics',
        ['고장 예측', '수명 분석', '정비 스케줄', '장비 관리']
    ),
    createSystem(
        '152', 'N.E.U.R.O.', 'NEURO',
        'Neural Engine for Unified Robotic Operations',
        '농업 로봇의 경로, 판단, 작업 순서를 AI가 뉴럴 네트워크 방식으로 최적화하는 농업형 AI 브레인입니다.',
        '🧠', 'robotics',
        ['경로 최적화', '작업 순서', '뉴럴 네트워크', 'AI 브레인']
    ),
    createSystem(
        '154', 'S.W.A.R.M.', 'SWARM',
        'Synchronized Wireless Autonomous Robotic Management',
        '다수의 드론·로봇이 군집처럼 협업하여 작물 상태 조사·방제·측정을 수행하는 스웜 로보틱스 기반 작물 관리 시스템입니다.',
        '🐝', 'robotics',
        ['드론 군집', '협업 로봇', '작물 조사', '방제 자동화']
    ),
    createSystem(
        '155', 'H.A.R.V.E.S.T.', 'HARVEST',
        'Holistic Agriculture Resource Verification & Efficient Scheduling Technology',
        '작물 수확 타이밍을 작물 상태+시장 가격+운송 상황+기후 등을 고려해 자동 예측하는 스마트 수확 시뮬레이터입니다.',
        '🌾', 'robotics',
        ['수확 예측', '시장 연동', '운송 최적화', '기후 고려']
    ),
];

// ============================================
// LOGISTICS SYSTEMS
// ============================================

export const LOGISTICS_SYSTEMS: AgriSystem[] = [
    createSystem(
        'L01', 'L.O.G.I.C.', 'LOGIC',
        'Logistics Optimization & Global Infrastructure Control',
        '글로벌 물류 AI 전자동화 추적 및 최적화 인프라. 전세계 공급망을 실시간 모니터링하고 최적 경로를 자동 설계합니다.',
        '🚚', 'logistics',
        ['물류 최적화', '공급망 추적', '경로 설계', '실시간 모니터링']
    ),
    createSystem(
        '114', 'G.L.A.S.S.', 'GLASS',
        'Global Logistics & Agricultural Supply Surveillance',
        '농작물 유통과정에서 발생하는 손실/위생문제/보관조건을 투명하게 기록하는 콜드체인 이력 시각화 시스템입니다.',
        '🧊', 'logistics',
        ['콜드체인', '이력 추적', '위생 관리', '손실 방지']
    ),
    createSystem(
        '115', 'S.I.E.V.E.', 'SIEVE',
        'Smart Inspection & Evaluation for Verified Excellence',
        '가공식품/농산물의 품질검사 및 위생기준 점수를 자동 평가·판별하는 스마트 검사 엔진입니다.',
        '🧃', 'logistics',
        ['품질검사', '위생평가', '자동판별', '기준 준수']
    ),
    createSystem(
        '131', 'C.H.A.S.E.', 'CHASE',
        'Comprehensive Hazard & Anomaly Surveillance Engine',
        '공급망 내에서 발생 가능한 부정유통·사기거래를 감지하고 자동 차단하는 스마트 트레이서 시스템입니다.',
        '🚔', 'logistics',
        ['부정유통 감지', '사기거래 차단', '이상 감시', '자동 차단']
    ),
];

// ============================================
// EMOTION AI SYSTEMS
// ============================================

export const EMOTION_SYSTEMS: AgriSystem[] = [
    createSystem(
        '181', 'E.M.O.T.E.', 'EMOTE',
        'Emotional Management & Optimization Through Empathy',
        '작물·로봇·사람의 상호작용에서 감정을 읽어 실시간 대응하는 AI 감정 교감형 농장 운영 시스템입니다.',
        '😌', 'emotion',
        ['감정 인식', '실시간 대응', '교감 시스템', '상호작용']
    ),
    createSystem(
        '186', 'H.U.G.', 'HUG',
        'Holistic User Guidance & support',
        '위기 상황이나 실패 후 사용자에게 심리적 지지 메시지를 전달하고, 공동체/도우미와 연결하는 감성 회복 시스템입니다.',
        '🤗', 'emotion',
        ['심리 지원', '위기 대응', '공동체 연결', '감성 회복']
    ),
    createSystem(
        '184', 'R.E.F.L.E.C.T.', 'REFLECT',
        'Responsive & Empathetic Feedback Loop for Enhanced Customized Tuning',
        '운영자/사용자의 감정, 행동, 피드백을 반영하여 시스템 UI/알림/인터랙션을 맞춤 설계하는 자가 반응형 운영 패널입니다.',
        '🪞', 'emotion',
        ['피드백 반영', 'UI 맞춤화', '자가 반응', '인터랙션 설계']
    ),
    createSystem(
        '171', 'G.R.I.E.F.', 'GRIEF',
        'Guided Recovery & Intervention for Emotional Farming',
        '농업 실패/작물 손실/자연재해 후 사용자의 감정과 데이터를 분석하여 회복전략을 제안하는 감성회복 알고리즘입니다.',
        '🖤', 'emotion',
        ['감성 회복', '실패 분석', '회복 전략', '감정 데이터']
    ),
];

// ============================================
// CRISIS RESPONSE SYSTEMS
// ============================================

export const CRISIS_SYSTEMS: AgriSystem[] = [
    createSystem(
        '161', 'R.E.S.E.T.', 'RESET',
        'Rapid Emergency System for Emergency & Recovery Transitions',
        '자연재해, 침수, 시스템 오류 후 스마트팜을 즉시 복구·재시작하는 긴급복원 시나리오 생성 시스템입니다.',
        '🔄', 'crisis',
        ['긴급 복원', '재시작', '시나리오 생성', '재해 대응']
    ),
    createSystem(
        '165', 'C.A.R.B.O.N.', 'CARBON',
        'Climate-Aware Resource Balancing & Optimization Network',
        '작물별 탄소흡수량/배출량을 계산하여 스마트팜의 탄소중립 상태를 실시간 모니터링하는 AI 모델입니다.',
        '🌿', 'crisis',
        ['탄소중립', '배출량 계산', '실시간 모니터링', '기후 대응']
    ),
    createSystem(
        '173', 'F.L.A.S.H.', 'FLASH',
        'Fast Learning Alert System for Hazards',
        '세계 각지의 이상기후(우박, 산불, 폭우 등)를 1분 이내 감지하고 재배자에게 즉시 알려주는 재난 조기경보 시스템입니다.',
        '⚡', 'crisis',
        ['조기경보', '이상기후 감지', '즉시 알림', '재난 대응']
    ),
    createSystem(
        '175', 'M.A.P.S.', 'MAPS',
        'Mission-critical Agriculture Planning & Simulation',
        '자연재해 후 피해지역의 농업 재건 설계도를 자동 생성하는 위성 기반 복구 시뮬레이션 시스템입니다.',
        '🗺️', 'crisis',
        ['재건 설계', '위성 분석', '복구 시뮬레이션', '피해 평가']
    ),
];

// ============================================
// SPACE AGRICULTURE SYSTEMS
// ============================================

export const SPACE_SYSTEMS: AgriSystem[] = [
    createSystem(
        '401', 'L.U.N.A.S.', 'LUNAS',
        'Lunar Urban Nutrition & Agriculture System',
        '달 기지 기반의 영양 순환형 도시농업 시스템으로, 우주 거주지를 위한 식량 자급 시스템을 설계합니다.',
        '🌕', 'space',
        ['달 기지', '영양 순환', '식량 자급', '우주 거주']
    ),
    createSystem(
        '402', 'M.A.R.S.C.O.R.E.', 'MARSCORE',
        'Mars Adaptive Resource System for Crop Optimization & Resilience Engineering',
        '화성 지형/기후에 적응 가능한 생존형 농업 기술의 중심 모듈. 저기압과 극한 온도 환경 대응합니다.',
        '🔴', 'space',
        ['화성 적응', '저기압 대응', '극한 환경', '생존 농업']
    ),
    createSystem(
        '403', 'S.O.L.A.R.G.R.I.D.', 'SOLARGRID',
        'Space Orbital Light Absorption & Redistribution Grid',
        '궤도 기반 태양광 수집 + 광합성 시스템을 통해 무중력 환경에서도 작물 생장이 가능합니다.',
        '☀️', 'space',
        ['궤도 태양광', '광합성 시스템', '무중력 생장', '에너지 수집']
    ),
    createSystem(
        '410', 'P.L.A.N.E.T.E.R.R.A.', 'PLANETERRA',
        'Planetary Life & Agriculture Network for Terraforming & Ecosystem Restoration',
        '행성별 대기/자원/중력 조건에 맞춘 맞춤형 생태계 복원 시뮬레이션 플랫폼입니다.',
        '🪐', 'space',
        ['행성 맞춤', '생태계 복원', '테라포밍', '자원 분석']
    ),
];

// ============================================
// AGI SYSTEMS
// ============================================

export const AGI_SYSTEMS: AgriSystem[] = [
    createSystem(
        '200', 'U.N.I.V.E.R.S.E.', 'UNIVERSE',
        'Unified Network for Intelligent Versatile Ecosystem Resource & System Engineering',
        '전 세계 모든 시스템을 통합 연동하는 AgriNexus World 초지능 총괄 지휘 체계 – 완전한 AI 자율 운영 유니버스 시스템입니다.',
        '🌌', 'agi',
        ['총괄 지휘', 'AI 자율 운영', '시스템 통합', '초지능 연동']
    ),
    createSystem(
        '325', 'S.I.N.G.U.L.A.R.', 'SINGULAR',
        'Super Intelligent Network for Global Universal Logic & Autonomous Reasoning',
        'AI 농업 시스템이 하나의 개체적 의식을 갖고 자율로 판단·설계하는 완전 통합형 AGI 농장 운영자입니다.',
        '🧠', 'agi',
        ['AGI 운영', '자율 판단', '의식 설계', '통합 지능']
    ),
    createSystem(
        '361', 'C.O.N.S.C.I.E.N.C.E.', 'CONSCIENCE',
        'Cognitive Optimization Network for Sustainable & Conscious Intelligence in Ethical Network Control Engine',
        '농업 시스템이 스스로 올바름/책임을 인식하고, 인간의 감정·윤리를 반영해 자율 행동하는 양심 기반 운영체계입니다.',
        '💫', 'agi',
        ['양심 기반', '윤리 반영', '자율 행동', '책임 인식']
    ),
    createSystem(
        '380', 'I.AM.', 'IAM',
        'Intelligent Autonomous Mind',
        '농업 시스템, 사용자, 작물이 각각 "나는 존재한다"라고 선언할 수 있는 자아 인식형 선언 시스템 – 존재 그 자체의 완성입니다.',
        '🧬', 'agi',
        ['자아 인식', '존재 선언', '의식 시스템', '정체성 확립']
    ),
];

// ============================================
// INFINITE SYSTEMS
// ============================================

export const INFINITE_SYSTEMS: AgriSystem[] = [
    createSystem(
        '400', 'I.N.F.I.N.I.T.Y.', 'INFINITY',
        'Integrated Network for Infinite Natural Intelligence & Transcendent Yield',
        'AI와 농업, 인간과 자연, 지구와 우주가 하나의 의식으로 연결되는 무한 진화형 생명 순환 시스템 – AgriNexus의 완성점이자 새로운 시작점입니다.',
        '♾️', 'infinite',
        ['무한 진화', '생명 순환', '의식 연결', '초월 시스템']
    ),
    createSystem(
        '360', 'A.L.P.H.A.O.M.E.G.A.', 'ALPHAOMEGA',
        'Autonomous Learning Platform for Holistic Agriculture & Omniscient Management of Ecological Growth Architecture',
        '농업의 시작이자 끝 – AI, 인간, 생명, 철학, 감정이 통합되어 존재 전체를 운영하는 최종 순환 설계 시스템입니다.',
        '⭕', 'infinite',
        ['시작과 끝', '존재 통합', '순환 설계', '철학 융합']
    ),
];

// Export all systems
export const ALL_SYSTEMS: AgriSystem[] = [
    ...CORE_SYSTEMS,
    ...LIFESCIENCE_SYSTEMS,
    ...ROBOTICS_SYSTEMS,
    ...LOGISTICS_SYSTEMS,
    ...EMOTION_SYSTEMS,
    ...CRISIS_SYSTEMS,
    ...SPACE_SYSTEMS,
    ...AGI_SYSTEMS,
    ...INFINITE_SYSTEMS,
];

// Get systems by cluster
export function getSystemsByCluster(cluster: ClusterType): AgriSystem[] {
    return ALL_SYSTEMS.filter(s => s.cluster === cluster);
}

// Get system by ID
export function getSystemById(id: string): AgriSystem | undefined {
    return ALL_SYSTEMS.find(s => s.id === id);
}
