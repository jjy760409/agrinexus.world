'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// Autonomous Agent Types
// ============================================

export type AgentStatus = 'idle' | 'analyzing' | 'executing' | 'completed' | 'error';
export type AgentPriority = 'critical' | 'high' | 'medium' | 'low';
export type AgentType = 'monitor' | 'optimizer' | 'predictor' | 'controller' | 'executor';

export interface AgentTask {
    id: string;
    type: AgentType;
    title: string;
    description: string;
    status: AgentStatus;
    priority: AgentPriority;
    createdAt: Date;
    completedAt?: Date;
    result?: string;
    confidence: number;
    automationLevel: number; // 0-100%
}

export interface AutomationPipeline {
    id: string;
    name: string;
    trigger: string;
    actions: string[];
    isActive: boolean;
    executionCount: number;
    lastExecuted?: Date;
    successRate: number;
}

export interface AgentDecision {
    id: string;
    agentType: AgentType;
    decision: string;
    reasoning: string;
    confidence: number;
    timestamp: Date;
    wasApplied: boolean;
    impact?: string;
}

export interface GlobalAgentState {
    // Status
    isSystemActive: boolean;
    totalAgents: number;
    activeAgents: number;
    automationLevel: number;
    decisionsToday: number;

    // Tasks
    activeTasks: AgentTask[];
    completedTasks: AgentTask[];

    // Pipelines
    pipelines: AutomationPipeline[];

    // Decisions
    recentDecisions: AgentDecision[];

    // Stats
    totalDecisions: number;
    successRate: number;
    avgConfidence: number;
    energySaved: number;

    // Actions
    activateSystem: () => void;
    deactivateSystem: () => void;
    addTask: (task: Omit<AgentTask, 'id' | 'createdAt'>) => void;
    completeTask: (taskId: string, result: string) => void;
    addDecision: (decision: Omit<AgentDecision, 'id' | 'timestamp'>) => void;
    togglePipeline: (pipelineId: string) => void;
    executeAutomation: (pipelineId: string) => void;
}

// ============================================
// Default Pipelines
// ============================================

const defaultPipelines: AutomationPipeline[] = [
    {
        id: 'pipe-1',
        name: '온도 자동 조절',
        trigger: '온도 임계값 초과 시',
        actions: ['센서 분석', 'HVAC 조정', '알림 전송'],
        isActive: true,
        executionCount: 1247,
        successRate: 99.2,
    },
    {
        id: 'pipe-2',
        name: '관수 최적화',
        trigger: '토양 수분 감지',
        actions: ['수분 레벨 분석', '관수량 계산', '밸브 제어'],
        isActive: true,
        executionCount: 856,
        successRate: 98.7,
    },
    {
        id: 'pipe-3',
        name: '질병 조기 경보',
        trigger: '이미지 분석 이상 감지',
        actions: ['AI 진단', '위험 평가', '방역 권장', '알림'],
        isActive: true,
        executionCount: 423,
        successRate: 94.5,
    },
    {
        id: 'pipe-4',
        name: '에너지 최적화',
        trigger: '30분마다 자동 실행',
        actions: ['소비 분석', '부하 예측', '전력 분배 최적화'],
        isActive: true,
        executionCount: 2890,
        successRate: 97.8,
    },
    {
        id: 'pipe-5',
        name: '수확량 예측 업데이트',
        trigger: '새로운 생장 데이터 수신 시',
        actions: ['데이터 수집', 'ML 모델 추론', '예측 갱신'],
        isActive: true,
        executionCount: 1567,
        successRate: 96.3,
    },
];

// ============================================
// Generate Unique ID
// ============================================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// Zustand Store
// ============================================

export const useAgentStore = create<GlobalAgentState>()(
    persist(
        (set, get) => ({
            // Initial State
            isSystemActive: true,
            totalAgents: 47,
            activeAgents: 42,
            automationLevel: 94,
            decisionsToday: 2847,

            activeTasks: [],
            completedTasks: [],
            pipelines: defaultPipelines,
            recentDecisions: [],

            totalDecisions: 158432,
            successRate: 97.3,
            avgConfidence: 92.8,
            energySaved: 23.4,

            // Actions
            activateSystem: () => set({ isSystemActive: true }),
            deactivateSystem: () => set({ isSystemActive: false }),

            addTask: (task) => set((state) => ({
                activeTasks: [
                    ...state.activeTasks,
                    {
                        ...task,
                        id: generateId(),
                        createdAt: new Date(),
                    }
                ]
            })),

            completeTask: (taskId, result) => set((state) => {
                const task = state.activeTasks.find(t => t.id === taskId);
                if (!task) return state;

                return {
                    activeTasks: state.activeTasks.filter(t => t.id !== taskId),
                    completedTasks: [
                        { ...task, status: 'completed', completedAt: new Date(), result },
                        ...state.completedTasks.slice(0, 99)
                    ],
                    decisionsToday: state.decisionsToday + 1,
                };
            }),

            addDecision: (decision) => set((state) => ({
                recentDecisions: [
                    { ...decision, id: generateId(), timestamp: new Date() },
                    ...state.recentDecisions.slice(0, 49)
                ],
                totalDecisions: state.totalDecisions + 1,
                decisionsToday: state.decisionsToday + 1,
            })),

            togglePipeline: (pipelineId) => set((state) => ({
                pipelines: state.pipelines.map(p =>
                    p.id === pipelineId ? { ...p, isActive: !p.isActive } : p
                )
            })),

            executeAutomation: (pipelineId) => set((state) => ({
                pipelines: state.pipelines.map(p =>
                    p.id === pipelineId
                        ? { ...p, executionCount: p.executionCount + 1, lastExecuted: new Date() }
                        : p
                ),
                decisionsToday: state.decisionsToday + 1,
            })),
        }),
        {
            name: 'agrinexus-agent-store',
        }
    )
);

// ============================================
// Agent Helper Functions
// ============================================

export const agentTypeLabels: Record<AgentType, string> = {
    monitor: '모니터링 에이전트',
    optimizer: '최적화 에이전트',
    predictor: '예측 에이전트',
    controller: '제어 에이전트',
    executor: '실행 에이전트',
};

export const agentTypeColors: Record<AgentType, string> = {
    monitor: 'var(--primary-blue)',
    optimizer: 'var(--primary-green)',
    predictor: 'var(--primary-indigo)',
    controller: 'var(--status-warning)',
    executor: 'var(--secondary-teal)',
};

export const priorityColors: Record<AgentPriority, string> = {
    critical: 'var(--status-danger)',
    high: 'var(--status-warning)',
    medium: 'var(--primary-blue)',
    low: 'var(--text-muted)',
};

export default useAgentStore;
