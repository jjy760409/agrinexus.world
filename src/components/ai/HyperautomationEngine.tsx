'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAgentStore, AgentType, AgentPriority } from '@/store/useAgentStore';

// ============================================
// Hyperautomation Engine Types
// ============================================

interface AutomationRule {
    id: string;
    name: string;
    condition: () => boolean;
    action: () => void;
    cooldown: number; // ms
    lastExecuted?: number;
}

interface EngineConfig {
    checkInterval: number;
    maxConcurrentTasks: number;
    enableAutoDecisions: boolean;
    confidenceThreshold: number;
}

// ============================================
// Default Configuration
// ============================================

const defaultConfig: EngineConfig = {
    checkInterval: 5000, // 5초마다 체크
    maxConcurrentTasks: 10,
    enableAutoDecisions: true,
    confidenceThreshold: 85,
};

// ============================================
// Hyperautomation Engine Hook
// ============================================

export function useHyperautomationEngine(config: Partial<EngineConfig> = {}) {
    const mergedConfig = { ...defaultConfig, ...config };
    const rulesRef = useRef<AutomationRule[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const {
        isSystemActive,
        addTask,
        completeTask,
        addDecision,
        executeAutomation,
        pipelines,
        activeTasks,
    } = useAgentStore();

    // Register automation rule
    const registerRule = useCallback((rule: Omit<AutomationRule, 'lastExecuted'>) => {
        rulesRef.current.push({ ...rule, lastExecuted: 0 });
    }, []);

    // Unregister rule
    const unregisterRule = useCallback((ruleId: string) => {
        rulesRef.current = rulesRef.current.filter(r => r.id !== ruleId);
    }, []);

    // Execute single rule
    const executeRule = useCallback((rule: AutomationRule) => {
        const now = Date.now();
        if (rule.lastExecuted && now - rule.lastExecuted < rule.cooldown) {
            return false;
        }

        if (rule.condition()) {
            rule.action();
            rule.lastExecuted = now;
            return true;
        }
        return false;
    }, []);

    // Run automation cycle
    const runAutomationCycle = useCallback(() => {
        if (!isSystemActive) return;
        if (activeTasks.length >= mergedConfig.maxConcurrentTasks) return;

        rulesRef.current.forEach(rule => {
            try {
                executeRule(rule);
            } catch (error) {
                console.error(`Automation rule ${rule.id} failed:`, error);
            }
        });
    }, [isSystemActive, activeTasks.length, executeRule, mergedConfig.maxConcurrentTasks]);

    // Auto-execute active pipelines simulation
    const simulatePipelineExecution = useCallback(() => {
        if (!isSystemActive) return;

        const activePipelines = pipelines.filter(p => p.isActive);

        // Randomly execute one pipeline (simulation)
        if (activePipelines.length > 0 && Math.random() > 0.7) {
            const randomPipeline = activePipelines[Math.floor(Math.random() * activePipelines.length)];
            executeAutomation(randomPipeline.id);

            // Add decision record
            addDecision({
                agentType: 'executor',
                decision: `${randomPipeline.name} 자동 실행`,
                reasoning: `트리거 조건 충족: ${randomPipeline.trigger}`,
                confidence: 90 + Math.random() * 10,
                wasApplied: true,
                impact: '시스템 효율 향상',
            });
        }
    }, [isSystemActive, pipelines, executeAutomation, addDecision]);

    // Generate autonomous task
    const generateAutonomousTask = useCallback((
        type: AgentType,
        title: string,
        description: string,
        priority: AgentPriority = 'medium'
    ) => {
        addTask({
            type,
            title,
            description,
            status: 'analyzing',
            priority,
            confidence: 85 + Math.random() * 15,
            automationLevel: 80 + Math.random() * 20,
        });
    }, [addTask]);

    // Make autonomous decision
    const makeAutonomousDecision = useCallback((
        agentType: AgentType,
        decision: string,
        reasoning: string,
        apply: boolean = true
    ) => {
        const confidence = mergedConfig.confidenceThreshold + Math.random() * (100 - mergedConfig.confidenceThreshold);

        if (confidence >= mergedConfig.confidenceThreshold && mergedConfig.enableAutoDecisions) {
            addDecision({
                agentType,
                decision,
                reasoning,
                confidence,
                wasApplied: apply,
                impact: apply ? '자동 적용됨' : '사용자 확인 대기',
            });
            return true;
        }
        return false;
    }, [addDecision, mergedConfig.confidenceThreshold, mergedConfig.enableAutoDecisions]);

    // Start engine
    const startEngine = useCallback(() => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            runAutomationCycle();
            simulatePipelineExecution();
        }, mergedConfig.checkInterval);
    }, [runAutomationCycle, simulatePipelineExecution, mergedConfig.checkInterval]);

    // Stop engine
    const stopEngine = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Auto-start on mount
    useEffect(() => {
        if (isSystemActive) {
            startEngine();
        }
        return () => stopEngine();
    }, [isSystemActive, startEngine, stopEngine]);

    return {
        registerRule,
        unregisterRule,
        generateAutonomousTask,
        makeAutonomousDecision,
        startEngine,
        stopEngine,
        isRunning: !!intervalRef.current,
    };
}

// ============================================
// Predefined Automation Rules
// ============================================

export const createDefaultRules = (
    generateTask: ReturnType<typeof useHyperautomationEngine>['generateAutonomousTask'],
    makeDecision: ReturnType<typeof useHyperautomationEngine>['makeAutonomousDecision']
): AutomationRule[] => [
        {
            id: 'rule-temp-monitor',
            name: '온도 모니터링',
            condition: () => Math.random() > 0.95,
            action: () => {
                generateTask('monitor', '온도 이상 감지', '구역 A-3에서 온도 상승 감지됨', 'high');
                makeDecision('controller', 'HVAC 냉각 모드 활성화', '온도 28°C 초과 감지');
            },
            cooldown: 30000,
        },
        {
            id: 'rule-moisture-optimize',
            name: '수분 최적화',
            condition: () => Math.random() > 0.92,
            action: () => {
                makeDecision('optimizer', '관수량 15% 증가', '토양 수분 최적 범위 이탈');
            },
            cooldown: 60000,
        },
        {
            id: 'rule-energy-save',
            name: '에너지 절감',
            condition: () => Math.random() > 0.88,
            action: () => {
                makeDecision('optimizer', '야간 조명 타이머 조정', '에너지 분석 결과 최적화 가능');
            },
            cooldown: 120000,
        },
        {
            id: 'rule-growth-predict',
            name: '성장 예측 업데이트',
            condition: () => Math.random() > 0.85,
            action: () => {
                generateTask('predictor', '수확량 예측 갱신', '새로운 생장 데이터 기반 예측 모델 업데이트', 'medium');
            },
            cooldown: 180000,
        },
    ];

export default useHyperautomationEngine;
