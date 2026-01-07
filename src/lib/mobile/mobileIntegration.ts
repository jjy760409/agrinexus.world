// AgriNexus World OS - 모바일 앱 통합 레이어
// Mobile App Integration - 푸시 알림, 오프라인 동기화, 앱 연동

// ============================================
// 타입 정의
// ============================================

export interface MobileIntegrationSystem {
    id: string;
    devices: MobileDevice[];
    pushService: PushNotificationService;
    offlineSync: OfflineSyncService;
    appConfig: MobileAppConfig;
    analytics: MobileAnalytics;
    status: 'active' | 'degraded' | 'maintenance';
}

export interface MobileDevice {
    id: string;
    userId: string;
    deviceType: 'ios' | 'android' | 'tablet';
    model: string;
    osVersion: string;
    appVersion: string;
    pushToken: string;
    lastSync: Date;
    lastActive: Date;
    status: 'active' | 'inactive' | 'offline';
    permissions: DevicePermission[];
}

export interface DevicePermission {
    type: 'push' | 'location' | 'camera' | 'storage' | 'biometric';
    granted: boolean;
    grantedAt?: Date;
}

export interface PushNotificationService {
    id: string;
    provider: 'fcm' | 'apns' | 'both';
    status: 'active' | 'degraded' | 'offline';
    templates: NotificationTemplate[];
    sentToday: number;
    deliveryRate: number;
    openRate: number;
}

export interface NotificationTemplate {
    id: string;
    name: string;
    koreanName: string;
    type: NotificationType;
    title: string;
    body: string;
    icon: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    sound: boolean;
    vibrate: boolean;
    actions?: NotificationAction[];
}

export type NotificationType =
    | 'alert'
    | 'harvest_ready'
    | 'sensor_warning'
    | 'order_update'
    | 'daily_report'
    | 'ai_recommendation'
    | 'system_update';

export interface NotificationAction {
    id: string;
    label: string;
    action: string;
    icon?: string;
}

export interface OfflineSyncService {
    id: string;
    strategy: 'incremental' | 'full' | 'smart';
    lastFullSync: Date;
    pendingChanges: number;
    conflictResolution: 'server_wins' | 'client_wins' | 'manual';
    syncQueue: SyncQueueItem[];
    cacheSize: number;
    maxCacheSize: number;
    status: 'synced' | 'syncing' | 'pending' | 'conflict';
}

export interface SyncQueueItem {
    id: string;
    type: 'create' | 'update' | 'delete';
    entity: string;
    entityId: string;
    data: Record<string, unknown>;
    createdAt: Date;
    attempts: number;
    status: 'pending' | 'syncing' | 'failed' | 'completed';
}

export interface MobileAppConfig {
    minVersion: string;
    currentVersion: string;
    forceUpdate: boolean;
    features: FeatureFlag[];
    themes: AppTheme[];
    languages: string[];
    defaultLanguage: string;
}

export interface FeatureFlag {
    id: string;
    name: string;
    enabled: boolean;
    rolloutPercentage: number;
    targetUsers?: string[];
}

export interface AppTheme {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
}

export interface MobileAnalytics {
    activeUsers: { daily: number; weekly: number; monthly: number };
    sessions: { today: number; avgDuration: number };
    screens: { name: string; views: number }[];
    events: { name: string; count: number }[];
    crashes: { count: number; rate: number };
    ratings: { average: number; count: number };
}

// ============================================
// 모바일 통합 엔진
// ============================================

export class MobileIntegrationEngine {
    private system: MobileIntegrationSystem;

    constructor() {
        this.system = this.initializeSystem();
    }

    private initializeSystem(): MobileIntegrationSystem {
        return {
            id: `mobile-${Date.now()}`,
            devices: this.createDevices(),
            pushService: {
                id: 'push-1',
                provider: 'both',
                status: 'active',
                templates: this.createTemplates(),
                sentToday: 4520,
                deliveryRate: 98.5,
                openRate: 45
            },
            offlineSync: {
                id: 'sync-1',
                strategy: 'smart',
                lastFullSync: new Date(Date.now() - 3600000),
                pendingChanges: 12,
                conflictResolution: 'server_wins',
                syncQueue: [
                    { id: 'sq-1', type: 'update', entity: 'sensor_reading', entityId: 'sr-123', data: { value: 24.5 }, createdAt: new Date(), attempts: 0, status: 'pending' }
                ],
                cacheSize: 150,
                maxCacheSize: 500,
                status: 'synced'
            },
            appConfig: {
                minVersion: '2.0.0',
                currentVersion: '2.5.3',
                forceUpdate: false,
                features: [
                    { id: 'f-1', name: '3D 농장 뷰', enabled: true, rolloutPercentage: 100 },
                    { id: 'f-2', name: 'AI 음성 제어', enabled: true, rolloutPercentage: 80 },
                    { id: 'f-3', name: 'AR 작물 진단', enabled: true, rolloutPercentage: 50 },
                    { id: 'f-4', name: '다크 모드', enabled: true, rolloutPercentage: 100 }
                ],
                themes: [
                    { id: 't-1', name: 'Aurora', primaryColor: '#00ff88', secondaryColor: '#00aaff', darkMode: true },
                    { id: 't-2', name: 'Nature', primaryColor: '#228B22', secondaryColor: '#90EE90', darkMode: false }
                ],
                languages: ['ko', 'en', 'ja', 'zh'],
                defaultLanguage: 'ko'
            },
            analytics: {
                activeUsers: { daily: 8500, weekly: 25000, monthly: 85000 },
                sessions: { today: 12500, avgDuration: 420 },
                screens: [
                    { name: '대시보드', views: 45000 },
                    { name: '센서 모니터링', views: 32000 },
                    { name: '수확 관리', views: 18000 },
                    { name: '설정', views: 8000 }
                ],
                events: [
                    { name: '센서 확인', count: 125000 },
                    { name: '알림 확인', count: 85000 },
                    { name: '수동 제어', count: 12000 }
                ],
                crashes: { count: 15, rate: 0.02 },
                ratings: { average: 4.8, count: 12500 }
            },
            status: 'active'
        };
    }

    private createDevices(): MobileDevice[] {
        return [
            { id: 'dev-1', userId: 'user-1', deviceType: 'ios', model: 'iPhone 15 Pro', osVersion: '17.2', appVersion: '2.5.3', pushToken: 'token_abc123', lastSync: new Date(), lastActive: new Date(), status: 'active', permissions: [{ type: 'push', granted: true, grantedAt: new Date() }, { type: 'location', granted: true, grantedAt: new Date() }] },
            { id: 'dev-2', userId: 'user-2', deviceType: 'android', model: 'Galaxy S24 Ultra', osVersion: '14', appVersion: '2.5.3', pushToken: 'token_def456', lastSync: new Date(), lastActive: new Date(), status: 'active', permissions: [{ type: 'push', granted: true, grantedAt: new Date() }] },
            { id: 'dev-3', userId: 'user-3', deviceType: 'tablet', model: 'iPad Pro 12.9', osVersion: '17.2', appVersion: '2.5.2', pushToken: 'token_ghi789', lastSync: new Date(Date.now() - 3600000), lastActive: new Date(Date.now() - 1800000), status: 'active', permissions: [{ type: 'push', granted: true, grantedAt: new Date() }] }
        ];
    }

    private createTemplates(): NotificationTemplate[] {
        return [
            { id: 'tmpl-1', name: 'Sensor Alert', koreanName: '🚨 센서 경보', type: 'sensor_warning', title: '센서 경고', body: '{{sensor_name}}이(가) 임계값을 초과했습니다: {{value}}{{unit}}', icon: '🚨', priority: 'high', sound: true, vibrate: true, actions: [{ id: 'a-1', label: '확인', action: 'view_sensor' }, { id: 'a-2', label: '무시', action: 'dismiss' }] },
            { id: 'tmpl-2', name: 'Harvest Ready', koreanName: '🌾 수확 준비', type: 'harvest_ready', title: '수확 시기 도래', body: '{{crop_name}}이(가) 수확 준비되었습니다. 예상 수확량: {{expected_yield}}kg', icon: '🌾', priority: 'normal', sound: true, vibrate: false, actions: [{ id: 'a-3', label: '수확 시작', action: 'start_harvest' }] },
            { id: 'tmpl-3', name: 'Daily Report', koreanName: '📊 일일 리포트', type: 'daily_report', title: '오늘의 농장 리포트', body: '수확량: {{harvest}}kg | 판매: ₩{{sales}} | AI 점수: {{score}}점', icon: '📊', priority: 'low', sound: false, vibrate: false },
            { id: 'tmpl-4', name: 'AI Recommendation', koreanName: '🧠 AI 추천', type: 'ai_recommendation', title: 'AI 최적화 제안', body: '{{agent_name}}이(가) 새로운 최적화 방안을 제안했습니다', icon: '🧠', priority: 'normal', sound: true, vibrate: false, actions: [{ id: 'a-4', label: '자세히 보기', action: 'view_recommendation' }] }
        ];
    }

    // 푸시 알림 전송
    async sendPushNotification(userId: string, templateId: string, data: Record<string, string>): Promise<boolean> {
        const device = this.system.devices.find(d => d.userId === userId);
        const template = this.system.pushService.templates.find(t => t.id === templateId);

        if (!device || !template) return false;

        const title = this.replaceTemplateVars(template.title, data);
        const body = this.replaceTemplateVars(template.body, data);

        console.log(`[푸시] ${device.deviceType}: ${title} - ${body}`);
        this.system.pushService.sentToday++;

        return true;
    }

    private replaceTemplateVars(text: string, data: Record<string, string>): string {
        return text.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
    }

    // 오프라인 동기화
    async syncOfflineData(deviceId: string): Promise<{ synced: number; failed: number }> {
        const queue = this.system.offlineSync.syncQueue.filter(item => item.status === 'pending');
        let synced = 0, failed = 0;

        for (const item of queue) {
            item.status = 'syncing';
            item.attempts++;

            // 시뮬레이션: 95% 성공률
            if (Math.random() > 0.05) {
                item.status = 'completed';
                synced++;
            } else {
                item.status = 'failed';
                failed++;
            }
        }

        this.system.offlineSync.lastFullSync = new Date();
        this.system.offlineSync.status = 'synced';

        return { synced, failed };
    }

    getSystem(): MobileIntegrationSystem { return this.system; }
    getDevices(): MobileDevice[] { return this.system.devices; }
    getAnalytics(): MobileAnalytics { return this.system.analytics; }
}

let mobileEngine: MobileIntegrationEngine | null = null;
export function getMobileIntegrationEngine(): MobileIntegrationEngine {
    if (!mobileEngine) mobileEngine = new MobileIntegrationEngine();
    return mobileEngine;
}
