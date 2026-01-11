'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Brain,
    Zap,
    Activity,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    Clock,
    Play,
    Pause,
    Settings,
    RefreshCw,
    ChevronRight,
    Cpu,
    Workflow,
    History,
    Target,
    Sparkles,
    Shield,
    BarChart3
} from 'lucide-react';
import { useAgentStore, agentTypeLabels, agentTypeColors, priorityColors, AgentType } from '@/store/useAgentStore';
import { useHyperautomationEngine, createDefaultRules } from '@/components/ai/HyperautomationEngine';

export default function HyperAgentDashboard() {
    const {
        isSystemActive,
        totalAgents,
        activeAgents,
        automationLevel,
        decisionsToday,
        activeTasks,
        pipelines,
        recentDecisions,
        totalDecisions,
        successRate,
        avgConfidence,
        energySaved,
        activateSystem,
        deactivateSystem,
        togglePipeline,
    } = useAgentStore();

    const { generateAutonomousTask, makeAutonomousDecision, isRunning } = useHyperautomationEngine();
    const [selectedTab, setSelectedTab] = useState<'overview' | 'pipelines' | 'decisions'>('overview');

    // Register default rules on mount
    useEffect(() => {
        // Rules are created and managed by the engine
    }, []);

    const stats = [
        { label: '활성 에이전트', value: `${activeAgents}/${totalAgents}`, icon: <Bot size={20} />, color: 'var(--primary-green)' },
        { label: '자동화율', value: `${automationLevel}%`, icon: <Workflow size={20} />, color: 'var(--primary-blue)' },
        { label: '오늘 결정', value: decisionsToday.toLocaleString(), icon: <Brain size={20} />, color: 'var(--primary-indigo)' },
        { label: '에너지 절감', value: `${energySaved}%`, icon: <Zap size={20} />, color: 'var(--status-success)' },
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-indigo)] via-[var(--secondary-violet)] to-[var(--primary-green)] flex items-center justify-center">
                        <Bot size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            슈퍼 에이전트 허브
                        </h1>
                        <p className="text-[var(--text-muted)]">Hyperautomation + Autonomous Agent System</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isSystemActive ? 'bg-[var(--status-success)]/10' : 'bg-[var(--status-danger)]/10'}`}>
                        <span className={`status-dot ${isSystemActive ? 'online' : 'offline'}`} />
                        <span className={`text-sm font-medium ${isSystemActive ? 'text-[var(--status-success)]' : 'text-[var(--status-danger)]'}`}>
                            {isSystemActive ? '시스템 활성' : '시스템 비활성'}
                        </span>
                    </div>
                    <button
                        onClick={() => isSystemActive ? deactivateSystem() : activateSystem()}
                        className={`btn ${isSystemActive ? 'btn-secondary' : 'btn-primary'}`}
                    >
                        {isSystemActive ? <Pause size={16} /> : <Play size={16} />}
                        {isSystemActive ? '중지' : '시작'}
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div
                            className="stat-icon"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`,
                                color: stat.color
                            }}
                        >
                            {stat.icon}
                        </div>
                        <div className="stat-value" style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="tab-nav">
                {[
                    { id: 'overview', label: '개요', icon: <Activity size={16} /> },
                    { id: 'pipelines', label: '자동화 파이프라인', icon: <Workflow size={16} /> },
                    { id: 'decisions', label: '의사결정 히스토리', icon: <History size={16} /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                        className={`tab-item ${selectedTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {selectedTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {/* Active Tasks */}
                        <div className="card">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                <Target size={18} className="text-[var(--primary-green)]" />
                                활성 작업
                                <span className="badge badge-info ml-auto">{activeTasks.length}</span>
                            </h3>

                            {activeTasks.length > 0 ? (
                                <div className="space-y-3">
                                    {activeTasks.slice(0, 5).map((task) => (
                                        <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `color-mix(in srgb, ${agentTypeColors[task.type]} 15%, transparent)` }}
                                            >
                                                <Cpu size={18} style={{ color: agentTypeColors[task.type] }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                                    {task.title}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {agentTypeLabels[task.type]} • {task.status}
                                                </p>
                                            </div>
                                            <span
                                                className="badge"
                                                style={{
                                                    backgroundColor: `color-mix(in srgb, ${priorityColors[task.priority]} 15%, transparent)`,
                                                    color: priorityColors[task.priority]
                                                }}
                                            >
                                                {task.priority}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-[var(--text-muted)]">
                                    <CheckCircle size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">모든 작업이 완료되었습니다</p>
                                </div>
                            )}
                        </div>

                        {/* System Stats */}
                        <div className="card">
                            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                                <BarChart3 size={18} className="text-[var(--primary-blue)]" />
                                시스템 성능
                            </h3>

                            <div className="space-y-4">
                                {[
                                    { label: '총 의사결정', value: totalDecisions.toLocaleString(), progress: 100 },
                                    { label: '성공률', value: `${successRate}%`, progress: successRate },
                                    { label: '평균 신뢰도', value: `${avgConfidence}%`, progress: avgConfidence },
                                    { label: '자동화 수준', value: `${automationLevel}%`, progress: automationLevel },
                                ].map((item, i) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-[var(--text-secondary)]">{item.label}</span>
                                            <span className="font-medium font-mono text-[var(--text-primary)]">
                                                {item.value}
                                            </span>
                                        </div>
                                        <div className="progress">
                                            <motion.div
                                                className="progress-bar"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.progress}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {selectedTab === 'pipelines' && (
                    <motion.div
                        key="pipelines"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <Workflow size={18} className="text-[var(--primary-indigo)]" />
                            자동화 파이프라인
                        </h3>

                        <div className="space-y-3">
                            {pipelines.map((pipeline, i) => (
                                <motion.div
                                    key={pipeline.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${pipeline.isActive ? 'bg-[var(--bg-primary)] border-[var(--primary-green)]/30' : 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]'}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <button
                                        onClick={() => togglePipeline(pipeline.id)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${pipeline.isActive ? 'bg-[var(--primary-green)]' : 'bg-[var(--bg-secondary)]'}`}
                                    >
                                        {pipeline.isActive ? (
                                            <Play size={20} className="text-white" />
                                        ) : (
                                            <Pause size={20} className="text-[var(--text-muted)]" />
                                        )}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[var(--text-primary)]">{pipeline.name}</p>
                                        <p className="text-xs text-[var(--text-muted)]">{pipeline.trigger}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {pipeline.actions.map((action, j) => (
                                                <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                                                    {action}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-bold font-mono text-[var(--primary-green)]">
                                            {pipeline.executionCount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)]">실행 횟수</p>
                                        <span className="badge badge-success mt-1">
                                            {pipeline.successRate}% 성공
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {selectedTab === 'decisions' && (
                    <motion.div
                        key="decisions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="card"
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <History size={18} className="text-[var(--secondary-violet)]" />
                            최근 의사결정
                        </h3>

                        {recentDecisions.length > 0 ? (
                            <div className="space-y-3">
                                {recentDecisions.slice(0, 10).map((decision, i) => (
                                    <motion.div
                                        key={decision.id}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `color-mix(in srgb, ${agentTypeColors[decision.agentType]} 15%, transparent)` }}
                                        >
                                            <Brain size={18} style={{ color: agentTypeColors[decision.agentType] }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                                    {decision.decision}
                                                </p>
                                                {decision.wasApplied && (
                                                    <CheckCircle size={14} className="text-[var(--status-success)]" />
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">
                                                {decision.reasoning}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="badge badge-info">
                                                    신뢰도 {decision.confidence.toFixed(1)}%
                                                </span>
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    {agentTypeLabels[decision.agentType]}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
                                            <Clock size={12} className="inline mr-1" />
                                            {new Date(decision.timestamp).toLocaleTimeString('ko-KR')}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)]">
                                <Brain size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">아직 의사결정 기록이 없습니다</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Insights */}
            <motion.section
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-[var(--primary-green)]" />
                    AI 자율 시스템 인사이트
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            title: '시스템 효율 최적화',
                            desc: '현재 자동화 수준이 94%입니다. 추가 2개 프로세스 자동화로 97%까지 향상 가능합니다.',
                            action: '최적화 적용',
                            icon: <TrendingUp size={20} />,
                            href: '/smartfarm',
                        },
                        {
                            title: '에이전트 성능 분석',
                            desc: '예측 에이전트의 정확도가 98.2%로 상승했습니다. 모델 업그레이드가 성공적으로 적용되었습니다.',
                            action: '상세 보기',
                            icon: <Bot size={20} />,
                            href: '/analytics',
                        },
                        {
                            title: '보안 상태',
                            desc: '모든 자율 에이전트가 정상 범위 내에서 작동 중입니다. 이상 행동 감지 없음.',
                            action: '보안 점검',
                            icon: <Shield size={20} />,
                            href: '/monitoring',
                        },
                    ].map((item, i) => (
                        <div key={item.title} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2 text-[var(--primary-indigo)] mb-2">
                                {item.icon}
                                <h4 className="font-medium text-[var(--text-primary)]">{item.title}</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] mb-3">
                                {item.desc}
                            </p>
                            <a href={item.href} className="btn btn-ghost text-[var(--primary-green)] text-sm p-0 h-auto inline-flex items-center gap-1">
                                {item.action} <ChevronRight size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
