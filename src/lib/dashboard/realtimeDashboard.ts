// AgriNexus World OS - 실시간 대시보드 시스템
// Real-time Dashboard System - WebSocket 기반 실시간 모니터링

// ============================================
// 타입 정의
// ============================================

export interface RealtimeDashboardSystem {
    id: string;
    connections: DashboardConnection[];
    widgets: DashboardWidget[];
    layouts: DashboardLayout[];
    alerts: RealtimeAlert[];
    dataStreams: LiveDataStream[];
    metrics: DashboardMetrics;
    status: 'live' | 'connecting' | 'offline';
}

export interface DashboardConnection {
    id: string;
    userId: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    connectedAt: Date;
    lastActivity: Date;
    subscriptions: string[];
    status: 'connected' | 'idle' | 'disconnected';
}

export interface DashboardWidget {
    id: string;
    type: WidgetType;
    title: string;
    koreanTitle: string;
    dataSource: string;
    refreshRate: number;          // ms
    size: { width: number; height: number };
    position: { x: number; y: number };
    config: WidgetConfig;
    status: 'live' | 'loading' | 'error';
}

export type WidgetType =
    | 'line_chart'
    | 'bar_chart'
    | 'pie_chart'
    | 'gauge'
    | 'stat_card'
    | 'map'
    | 'table'
    | 'heatmap'
    | 'camera_feed'
    | 'alert_list'
    | '3d_view'
    | 'timeline';

export interface WidgetConfig {
    colors?: string[];
    thresholds?: { value: number; color: string }[];
    unit?: string;
    precision?: number;
    showLegend?: boolean;
    animated?: boolean;
}

export interface DashboardLayout {
    id: string;
    name: string;
    isDefault: boolean;
    columns: number;
    widgets: string[];
    createdBy: string;
    createdAt: Date;
}

export interface RealtimeAlert {
    id: string;
    type: 'info' | 'warning' | 'critical' | 'success';
    title: string;
    message: string;
    source: string;
    timestamp: Date;
    acknowledged: boolean;
    acknowledgedBy?: string;
    autoResolve: boolean;
    resolvedAt?: Date;
}

export interface LiveDataStream {
    id: string;
    name: string;
    source: string;
    dataType: 'sensor' | 'metric' | 'event' | 'status';
    currentValue: number | string;
    previousValue: number | string;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
    lastUpdate: Date;
    subscribers: number;
}

export interface DashboardMetrics {
    activeConnections: number;
    widgetsRendered: number;
    dataPointsPerSecond: number;
    avgLatency: number;
    uptime: number;
    alertsActive: number;
}

// ============================================
// 대시보드 엔진
// ============================================

export class RealtimeDashboardEngine {
    private system: RealtimeDashboardSystem;
    private eventListeners: Map<string, ((data: unknown) => void)[]> = new Map();

    constructor() {
        this.system = this.initializeSystem();
    }

    private initializeSystem(): RealtimeDashboardSystem {
        return {
            id: `dashboard-${Date.now()}`,
            connections: [],
            widgets: this.createWidgets(),
            layouts: [
                { id: 'layout-1', name: '기본 레이아웃', isDefault: true, columns: 4, widgets: ['w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6'], createdBy: 'system', createdAt: new Date() },
                { id: 'layout-2', name: '모니터링 집중', isDefault: false, columns: 3, widgets: ['w-7', 'w-8', 'w-9', 'w-10'], createdBy: 'system', createdAt: new Date() }
            ],
            alerts: [
                { id: 'alert-1', type: 'warning', title: '습도 경고', message: 'A 구역 습도가 85%를 초과했습니다', source: 'sensor-humid-a1', timestamp: new Date(), acknowledged: false, autoResolve: true },
                { id: 'alert-2', type: 'info', title: '수확 예정', message: '토마토 B-12 수확 시기가 도래했습니다', source: 'harvest-scheduler', timestamp: new Date(), acknowledged: true, acknowledgedBy: 'admin', autoResolve: false }
            ],
            dataStreams: this.createDataStreams(),
            metrics: {
                activeConnections: 45,
                widgetsRendered: 128,
                dataPointsPerSecond: 5000,
                avgLatency: 25,
                uptime: 99.99,
                alertsActive: 3
            },
            status: 'live'
        };
    }

    private createWidgets(): DashboardWidget[] {
        return [
            { id: 'w-1', type: 'gauge', title: 'Temperature', koreanTitle: '🌡️ 온도', dataSource: 'sensor/temperature', refreshRate: 1000, size: { width: 2, height: 2 }, position: { x: 0, y: 0 }, config: { unit: '°C', thresholds: [{ value: 18, color: '#00aaff' }, { value: 25, color: '#00ff88' }, { value: 30, color: '#ff8800' }], animated: true }, status: 'live' },
            { id: 'w-2', type: 'gauge', title: 'Humidity', koreanTitle: '💧 습도', dataSource: 'sensor/humidity', refreshRate: 1000, size: { width: 2, height: 2 }, position: { x: 2, y: 0 }, config: { unit: '%', thresholds: [{ value: 50, color: '#ff8800' }, { value: 70, color: '#00ff88' }, { value: 90, color: '#ff0000' }], animated: true }, status: 'live' },
            { id: 'w-3', type: 'line_chart', title: 'Growth Rate', koreanTitle: '📈 성장률', dataSource: 'analytics/growth', refreshRate: 5000, size: { width: 4, height: 2 }, position: { x: 0, y: 2 }, config: { colors: ['#00ff88', '#00aaff'], showLegend: true, animated: true }, status: 'live' },
            { id: 'w-4', type: 'stat_card', title: 'Active Agents', koreanTitle: '🤖 활성 에이전트', dataSource: 'agents/active', refreshRate: 2000, size: { width: 1, height: 1 }, position: { x: 0, y: 4 }, config: { precision: 0 }, status: 'live' },
            { id: 'w-5', type: 'stat_card', title: 'Today Harvest', koreanTitle: '🌾 오늘 수확량', dataSource: 'harvest/today', refreshRate: 10000, size: { width: 1, height: 1 }, position: { x: 1, y: 4 }, config: { unit: 'kg', precision: 1 }, status: 'live' },
            { id: 'w-6', type: 'pie_chart', title: 'Crop Distribution', koreanTitle: '🥬 작물 비율', dataSource: 'crops/distribution', refreshRate: 30000, size: { width: 2, height: 2 }, position: { x: 2, y: 4 }, config: { colors: ['#00ff88', '#00aaff', '#ff8800', '#ff00aa', '#8800ff'], showLegend: true }, status: 'live' },
            { id: 'w-7', type: 'camera_feed', title: 'Zone A Camera', koreanTitle: '📹 A 구역 카메라', dataSource: 'camera/zone-a', refreshRate: 100, size: { width: 2, height: 2 }, position: { x: 0, y: 6 }, config: {}, status: 'live' },
            { id: 'w-8', type: 'heatmap', title: 'Temperature Map', koreanTitle: '🌡️ 온도 분포', dataSource: 'spatial/temperature', refreshRate: 5000, size: { width: 2, height: 2 }, position: { x: 2, y: 6 }, config: { colors: ['#0000ff', '#00ff00', '#ffff00', '#ff0000'] }, status: 'live' },
            { id: 'w-9', type: 'alert_list', title: 'Recent Alerts', koreanTitle: '🚨 최근 알림', dataSource: 'alerts/recent', refreshRate: 1000, size: { width: 2, height: 3 }, position: { x: 0, y: 8 }, config: {}, status: 'live' },
            { id: 'w-10', type: 'table', title: 'Sensor Status', koreanTitle: '📊 센서 상태', dataSource: 'sensors/status', refreshRate: 2000, size: { width: 2, height: 3 }, position: { x: 2, y: 8 }, config: {}, status: 'live' }
        ];
    }

    private createDataStreams(): LiveDataStream[] {
        return [
            { id: 'stream-1', name: '온도', source: 'sensor/temperature', dataType: 'sensor', currentValue: 24.5, previousValue: 24.3, trend: 'up', changePercent: 0.8, lastUpdate: new Date(), subscribers: 45 },
            { id: 'stream-2', name: '습도', source: 'sensor/humidity', dataType: 'sensor', currentValue: 72, previousValue: 71, trend: 'up', changePercent: 1.4, lastUpdate: new Date(), subscribers: 45 },
            { id: 'stream-3', name: 'CO2', source: 'sensor/co2', dataType: 'sensor', currentValue: 850, previousValue: 860, trend: 'down', changePercent: -1.2, lastUpdate: new Date(), subscribers: 32 },
            { id: 'stream-4', name: '조도', source: 'sensor/light', dataType: 'sensor', currentValue: 15000, previousValue: 14500, trend: 'up', changePercent: 3.4, lastUpdate: new Date(), subscribers: 28 },
            { id: 'stream-5', name: '활성 에이전트', source: 'agents/active', dataType: 'metric', currentValue: 40, previousValue: 40, trend: 'stable', changePercent: 0, lastUpdate: new Date(), subscribers: 50 }
        ];
    }

    // WebSocket 시뮬레이션
    subscribe(streamId: string, callback: (data: unknown) => void): () => void {
        if (!this.eventListeners.has(streamId)) {
            this.eventListeners.set(streamId, []);
        }
        this.eventListeners.get(streamId)!.push(callback);

        // 연결 해제 함수 반환
        return () => {
            const listeners = this.eventListeners.get(streamId);
            if (listeners) {
                const index = listeners.indexOf(callback);
                if (index > -1) listeners.splice(index, 1);
            }
        };
    }

    // 실시간 데이터 발행 (시뮬레이션)
    private publishUpdate(streamId: string, data: unknown): void {
        const listeners = this.eventListeners.get(streamId) || [];
        listeners.forEach(callback => callback(data));
    }

    // 시뮬레이션 데이터 생성기
    startSimulation(): void {
        setInterval(() => {
            this.system.dataStreams.forEach(stream => {
                if (stream.dataType === 'sensor') {
                    const change = (Math.random() - 0.5) * 2;
                    stream.previousValue = stream.currentValue as number;
                    stream.currentValue = (stream.currentValue as number) + change;
                    stream.trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
                    stream.changePercent = (change / (stream.previousValue as number)) * 100;
                    stream.lastUpdate = new Date();

                    this.publishUpdate(stream.source, { value: stream.currentValue, timestamp: stream.lastUpdate });
                }
            });
        }, 1000);
    }

    getSystem(): RealtimeDashboardSystem { return this.system; }
    getWidgets(): DashboardWidget[] { return this.system.widgets; }
    getAlerts(): RealtimeAlert[] { return this.system.alerts; }
    getStreams(): LiveDataStream[] { return this.system.dataStreams; }
}

let dashboardEngine: RealtimeDashboardEngine | null = null;
export function getRealtimeDashboardEngine(): RealtimeDashboardEngine {
    if (!dashboardEngine) dashboardEngine = new RealtimeDashboardEngine();
    return dashboardEngine;
}
