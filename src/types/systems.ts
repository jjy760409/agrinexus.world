// AgriNexus World OS - System Type Definitions

export type ClusterType =
    | 'core'
    | 'lifescience'
    | 'robotics'
    | 'logistics'
    | 'emotion'
    | 'crisis'
    | 'space'
    | 'agi'
    | 'civilization'
    | 'infinite';

export type SystemStatus = 'active' | 'standby' | 'processing' | 'warning' | 'offline';
export type SystemPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AgriSystem {
    id: string;
    code: string; // e.g., "N.E.X.U.S."
    name: string;
    fullName: string;
    description: string;
    icon: string;
    cluster: ClusterType;
    status: SystemStatus;
    priority: SystemPriority;
    metrics: SystemMetrics;
    capabilities: string[];
    connections: string[]; // IDs of connected systems
    lastUpdate: Date;
}

export interface SystemMetrics {
    efficiency: number; // 0-100
    uptime: number; // percentage
    load: number; // 0-100
    dataFlow: number; // MB/s
    aiScore: number; // 0-100
    customMetrics?: Record<string, number | string>;
}

export interface Cluster {
    id: ClusterType;
    name: string;
    koreanName: string;
    icon: string;
    color: string;
    description: string;
    systemCount: number;
    systems: AgriSystem[];
    status: SystemStatus;
}

export interface Alert {
    id: string;
    type: 'info' | 'success' | 'warning' | 'danger' | 'critical';
    systemId: string;
    systemCode: string;
    title: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
}

export interface GlobalStats {
    totalSystems: number;
    activeSystems: number;
    totalAlerts: number;
    criticalAlerts: number;
    globalEfficiency: number;
    dataProcessed: string;
    aiDecisions: number;
    energySaved: number;
}

// Cluster definitions - 500+ Systems Total
export const CLUSTERS: Record<ClusterType, Omit<Cluster, 'systems'>> = {
    core: {
        id: 'core',
        name: 'Core Systems',
        koreanName: '핵심 시스템',
        icon: '🔗',
        color: '#00ff88',
        description: '글로벌 연결, 환경 조절, 에너지, 규정 자동화 등 핵심 인프라',
        systemCount: 52,
        status: 'active',
    },
    lifescience: {
        id: 'lifescience',
        name: 'Life Sciences',
        koreanName: '생명과학',
        icon: '🧬',
        color: '#00d4ff',
        description: '유전자 편집, 세포 분석, 미생물 배양, 수생농업 AI',
        systemCount: 48,
        status: 'active',
    },
    robotics: {
        id: 'robotics',
        name: 'Robotics & IoT',
        koreanName: '로보틱스',
        icon: '🤖',
        color: '#7b2fff',
        description: '사람-로봇 협업, 드론 군집, 장비 유지보수, 스마트 수확',
        systemCount: 56,
        status: 'active',
    },
    logistics: {
        id: 'logistics',
        name: 'Global Logistics',
        koreanName: '글로벌 물류',
        icon: '🚚',
        color: '#ff9500',
        description: '콜드체인, 품질검사, 부정유통 감지, 고객경험 분석',
        systemCount: 42,
        status: 'active',
    },
    emotion: {
        id: 'emotion',
        name: 'Emotion AI',
        koreanName: '감성 AI',
        icon: '😌',
        color: '#ff2d92',
        description: 'AI 감정 교감, 심리적 지지, 감성회복 알고리즘',
        systemCount: 38,
        status: 'active',
    },
    crisis: {
        id: 'crisis',
        name: 'Crisis Response',
        koreanName: '위기 대응',
        icon: '🛡️',
        color: '#ff3366',
        description: '긴급복원, 탄소중립, 재난 조기경보, 위성 복구',
        systemCount: 45,
        status: 'active',
    },
    space: {
        id: 'space',
        name: 'Space Agriculture',
        koreanName: '우주 농업',
        icon: '🚀',
        color: '#4a90d9',
        description: '달/화성 기지, 궤도 태양광, 다행성 생태계 설계',
        systemCount: 68,
        status: 'active',
    },
    agi: {
        id: 'agi',
        name: 'AGI Systems',
        koreanName: '초지능',
        icon: '🧠',
        color: '#9b59b6',
        description: '총괄 지휘 체계, 완전 통합형 AGI, 양심 기반 운영',
        systemCount: 72,
        status: 'active',
    },
    civilization: {
        id: 'civilization',
        name: 'Civilization',
        koreanName: '문명 설계',
        icon: '🏛️',
        color: '#f39c12',
        description: '농업 문명 도시, 평화유지, 메타스마트팜 도시',
        systemCount: 44,
        status: 'active',
    },
    infinite: {
        id: 'infinite',
        name: 'Infinite Systems',
        koreanName: '무한 진화',
        icon: '♾️',
        color: '#1abc9c',
        description: '무한 진화 순환, 시작과 끝의 통합, 초월적 농업',
        systemCount: 62,
        status: 'active',
    },
};

// System status colors
export const STATUS_COLORS: Record<SystemStatus, string> = {
    active: '#00ff88',
    standby: '#ffb800',
    processing: '#00d4ff',
    warning: '#ff9500',
    offline: '#ff3366',
};

// Priority colors
export const PRIORITY_COLORS: Record<SystemPriority, string> = {
    critical: '#ff3366',
    high: '#ff9500',
    medium: '#ffb800',
    low: '#00d4ff',
};
