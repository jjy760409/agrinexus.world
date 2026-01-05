import { create } from 'zustand';
import {
    AgriSystem,
    ClusterType,
    Cluster,
    Alert,
    GlobalStats,
    CLUSTERS
} from '@/types/systems';
import { ALL_SYSTEMS, getSystemsByCluster } from '@/lib/systems/systemsData';

interface OSState {
    // Current view
    currentCluster: ClusterType | null;
    currentSystem: AgriSystem | null;
    isFullscreen: boolean;

    // Systems data
    systems: AgriSystem[];
    clusters: Record<ClusterType, Cluster>;

    // Alerts
    alerts: Alert[];

    // Global stats
    globalStats: GlobalStats;

    // Connection
    isConnected: boolean;
    lastSync: Date;

    // Actions
    setCurrentCluster: (cluster: ClusterType | null) => void;
    setCurrentSystem: (system: AgriSystem | null) => void;
    toggleFullscreen: () => void;

    // System updates
    updateSystemMetrics: (systemId: string) => void;
    updateAllSystems: () => void;

    // Alerts
    addAlert: (alert: Alert) => void;
    acknowledgeAlert: (alertId: string) => void;
    clearAlerts: () => void;

    // Stats
    updateGlobalStats: () => void;

    // Initialize
    initialize: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
    // Initial state
    currentCluster: null,
    currentSystem: null,
    isFullscreen: false,

    systems: [],
    clusters: {} as Record<ClusterType, Cluster>,

    alerts: [],

    globalStats: {
        totalSystems: 0,
        activeSystems: 0,
        totalAlerts: 0,
        criticalAlerts: 0,
        globalEfficiency: 0,
        dataProcessed: '0 TB',
        aiDecisions: 0,
        energySaved: 0,
    },

    isConnected: true,
    lastSync: new Date(),

    // Actions
    setCurrentCluster: (cluster) => set({ currentCluster: cluster, currentSystem: null }),
    setCurrentSystem: (system) => set({ currentSystem: system }),
    toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

    // System updates
    updateSystemMetrics: (systemId) => set((state) => ({
        systems: state.systems.map(s => {
            if (s.id === systemId) {
                return {
                    ...s,
                    metrics: {
                        efficiency: Math.min(100, Math.max(70, s.metrics.efficiency + (Math.random() - 0.5) * 5)),
                        uptime: Math.min(100, Math.max(95, s.metrics.uptime + (Math.random() - 0.5) * 0.5)),
                        load: Math.min(100, Math.max(10, s.metrics.load + (Math.random() - 0.5) * 10)),
                        dataFlow: Math.max(1, s.metrics.dataFlow + (Math.random() - 0.5) * 5),
                        aiScore: Math.min(100, Math.max(80, s.metrics.aiScore + (Math.random() - 0.5) * 2)),
                    },
                    lastUpdate: new Date(),
                };
            }
            return s;
        }),
    })),

    updateAllSystems: () => {
        const state = get();
        state.systems.forEach(s => {
            state.updateSystemMetrics(s.id);
        });
        set({ lastSync: new Date() });
        state.updateGlobalStats();
    },

    // Alerts
    addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts].slice(0, 50),
    })),

    acknowledgeAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map(a =>
            a.id === alertId ? { ...a, acknowledged: true } : a
        ),
    })),

    clearAlerts: () => set({ alerts: [] }),

    // Stats
    updateGlobalStats: () => set((state) => {
        const activeSystems = state.systems.filter(s => s.status === 'active').length;
        const avgEfficiency = state.systems.reduce((acc, s) => acc + s.metrics.efficiency, 0) / state.systems.length;
        const totalDataFlow = state.systems.reduce((acc, s) => acc + s.metrics.dataFlow, 0);

        return {
            globalStats: {
                totalSystems: state.systems.length,
                activeSystems,
                totalAlerts: state.alerts.length,
                criticalAlerts: state.alerts.filter(a => a.type === 'critical').length,
                globalEfficiency: Math.round(avgEfficiency * 10) / 10,
                dataProcessed: `${(totalDataFlow / 1000).toFixed(1)} TB`,
                aiDecisions: Math.floor(Math.random() * 10000) + 50000,
                energySaved: Math.floor(Math.random() * 10) + 20,
            },
        };
    }),

    // Initialize
    initialize: () => {
        // Initialize clusters
        const clusterEntries = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];
        const clusters: Record<ClusterType, Cluster> = {} as Record<ClusterType, Cluster>;

        clusterEntries.forEach(([key, cluster]) => {
            clusters[key] = {
                ...cluster,
                systems: getSystemsByCluster(key),
            };
        });

        // Initialize systems with randomized metrics
        const systems = ALL_SYSTEMS.map(s => ({
            ...s,
            metrics: {
                efficiency: 85 + Math.random() * 15,
                uptime: 99 + Math.random() * 0.9,
                load: 30 + Math.random() * 40,
                dataFlow: 10 + Math.random() * 50,
                aiScore: 90 + Math.random() * 10,
            },
        }));

        // Create initial alerts
        const initialAlerts: Alert[] = [
            {
                id: `alert-${Date.now()}-1`,
                type: 'success',
                systemId: '200',
                systemCode: 'U.N.I.V.E.R.S.E.',
                title: '초지능 시스템 활성화',
                message: 'AgriNexus World OS 총괄 지휘 체계가 정상 가동 중입니다.',
                timestamp: new Date(),
                acknowledged: false,
            },
            {
                id: `alert-${Date.now()}-2`,
                type: 'info',
                systemId: '101',
                systemCode: 'N.E.X.U.S.',
                title: '글로벌 네트워크 동기화',
                message: '전세계 47개국 농업 생태계와 실시간 연결이 완료되었습니다.',
                timestamp: new Date(),
                acknowledged: false,
            },
            {
                id: `alert-${Date.now()}-3`,
                type: 'success',
                systemId: '103',
                systemCode: 'I.M.P.U.L.S.E.',
                title: '에너지 최적화 완료',
                message: '오늘 총 23% 에너지 절감을 달성했습니다.',
                timestamp: new Date(),
                acknowledged: false,
            },
        ];

        set({
            systems,
            clusters,
            alerts: initialAlerts,
        });

        // Update global stats
        get().updateGlobalStats();
    },
}));
