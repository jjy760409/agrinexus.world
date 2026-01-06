// AgriNexus World OS - 실시간 데이터 서비스
// Pusher 기반 실시간 센서 데이터 스트리밍

import Pusher from 'pusher-js';

// 센서 데이터 타입
export interface SensorData {
    timestamp: Date;
    temperature: number;
    humidity: number;
    co2: number;
    light: number;
    ph: number;
    ec: number;
    waterLevel: number;
    airFlow: number;
}

export interface FarmMetrics {
    energyConsumption: number;
    waterUsage: number;
    harvestRate: number;
    growthProgress: number;
    aiDecisions: number;
    systemHealth: number;
}

export interface AlertData {
    id: string;
    type: 'info' | 'warning' | 'critical' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    source: string;
    acknowledged: boolean;
}

export interface RobotStatus {
    id: string;
    name: string;
    type: 'harvester' | 'seeder' | 'patrol' | 'transport';
    status: 'active' | 'idle' | 'charging' | 'maintenance';
    battery: number;
    position: { x: number; y: number; z: number };
    currentTask: string;
    completedTasks: number;
}

// 실시간 데이터 클래스
class RealTimeDataService {
    private pusher: Pusher | null = null;
    private channels: Map<string, any> = new Map();
    private listeners: Map<string, Set<(data: any) => void>> = new Map();
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    // 시뮬레이션 인터벌
    private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();

    constructor() {
        if (typeof window !== 'undefined') {
            this.initializePusher();
        }
    }

    private initializePusher() {
        const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
        const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap3';

        if (pusherKey) {
            try {
                this.pusher = new Pusher(pusherKey, {
                    cluster: pusherCluster,
                    forceTLS: true,
                });

                this.pusher.connection.bind('connected', () => {
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    console.log('🔌 Pusher 연결됨');
                });

                this.pusher.connection.bind('disconnected', () => {
                    this.isConnected = false;
                    console.log('⚠️ Pusher 연결 해제됨');
                    this.attemptReconnect();
                });

                this.pusher.connection.bind('error', (err: any) => {
                    console.error('Pusher 오류:', err);
                    this.startSimulation();
                });
            } catch (error) {
                console.log('Pusher 초기화 실패, 시뮬레이션 모드 사용');
                this.startSimulation();
            }
        } else {
            console.log('Pusher 키 없음, 시뮬레이션 모드 사용');
            this.startSimulation();
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                this.pusher?.connect();
            }, 1000 * this.reconnectAttempts);
        } else {
            this.startSimulation();
        }
    }

    // 채널 구독
    subscribe(channelName: string, eventName: string, callback: (data: any) => void) {
        const key = `${channelName}:${eventName}`;

        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key)!.add(callback);

        if (this.pusher && this.isConnected) {
            let channel = this.channels.get(channelName);
            if (!channel) {
                channel = this.pusher.subscribe(channelName);
                this.channels.set(channelName, channel);
            }
            channel.bind(eventName, callback);
        }

        return () => {
            this.listeners.get(key)?.delete(callback);
        };
    }

    // 구독 해제
    unsubscribe(channelName: string) {
        if (this.pusher) {
            this.pusher.unsubscribe(channelName);
        }
        this.channels.delete(channelName);
    }

    // 시뮬레이션 모드 시작
    private startSimulation() {
        console.log('🔄 시뮬레이션 모드 시작');

        // 센서 데이터 시뮬레이션 (1초마다)
        const sensorInterval = setInterval(() => {
            const sensorData = this.generateSensorData();
            this.emitToListeners('farm-sensors', 'sensor-update', sensorData);
        }, 1000);
        this.simulationIntervals.set('sensors', sensorInterval);

        // 메트릭 시뮬레이션 (5초마다)
        const metricsInterval = setInterval(() => {
            const metrics = this.generateMetrics();
            this.emitToListeners('farm-metrics', 'metrics-update', metrics);
        }, 5000);
        this.simulationIntervals.set('metrics', metricsInterval);

        // 알림 시뮬레이션 (30초마다)
        const alertInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                const alert = this.generateAlert();
                this.emitToListeners('farm-alerts', 'new-alert', alert);
            }
        }, 30000);
        this.simulationIntervals.set('alerts', alertInterval);

        // 로봇 상태 시뮬레이션 (3초마다)
        const robotInterval = setInterval(() => {
            const robots = this.generateRobotStatuses();
            this.emitToListeners('farm-robots', 'robot-update', robots);
        }, 3000);
        this.simulationIntervals.set('robots', robotInterval);
    }

    private emitToListeners(channel: string, event: string, data: any) {
        const key = `${channel}:${event}`;
        this.listeners.get(key)?.forEach(callback => callback(data));
    }

    // 센서 데이터 생성
    private generateSensorData(): SensorData {
        const baseTemp = 24;
        const baseHumidity = 65;
        const baseCO2 = 800;
        const baseLight = 450;

        return {
            timestamp: new Date(),
            temperature: baseTemp + (Math.random() - 0.5) * 4,
            humidity: baseHumidity + (Math.random() - 0.5) * 10,
            co2: baseCO2 + (Math.random() - 0.5) * 200,
            light: baseLight + (Math.random() - 0.5) * 100,
            ph: 6.2 + (Math.random() - 0.5) * 0.4,
            ec: 1.8 + (Math.random() - 0.5) * 0.4,
            waterLevel: 85 + (Math.random() - 0.5) * 10,
            airFlow: 120 + (Math.random() - 0.5) * 30,
        };
    }

    // 메트릭 생성
    private generateMetrics(): FarmMetrics {
        return {
            energyConsumption: 4500 + Math.random() * 500,
            waterUsage: 120 + Math.random() * 20,
            harvestRate: 92 + Math.random() * 5,
            growthProgress: 67 + Math.random() * 3,
            aiDecisions: Math.floor(12000 + Math.random() * 1000),
            systemHealth: 98 + Math.random() * 2,
        };
    }

    // 알림 생성
    private generateAlert(): AlertData {
        const types: AlertData['type'][] = ['info', 'warning', 'success'];
        const alerts = [
            { type: 'info' as const, title: '환경 최적화 완료', message: '온도가 최적 범위로 조정되었습니다.', source: 'Climate AI' },
            { type: 'success' as const, title: '수확 완료', message: '상추 배치 #127 수확이 완료되었습니다.', source: 'Harvest Robot' },
            { type: 'warning' as const, title: 'EC 수치 변동', message: 'Zone-3의 EC가 1.9mS/cm로 상승했습니다.', source: 'Nutrient AI' },
            { type: 'info' as const, title: 'AI 학습 완료', message: '새로운 성장 패턴이 학습되었습니다.', source: 'Master AI' },
        ];

        const selected = alerts[Math.floor(Math.random() * alerts.length)];
        return {
            id: `alert-${Date.now()}`,
            ...selected,
            timestamp: new Date(),
            acknowledged: false,
        };
    }

    // 로봇 상태 생성
    private generateRobotStatuses(): RobotStatus[] {
        return [
            {
                id: 'robot-001',
                name: 'Harvester-1',
                type: 'harvester',
                status: 'active',
                battery: 75 + Math.random() * 10,
                position: { x: 5 + Math.random() * 2, y: 0, z: 8 + Math.random() * 2 },
                currentTask: '상추 수확 중',
                completedTasks: Math.floor(45 + Math.random() * 5),
            },
            {
                id: 'robot-002',
                name: 'Seeder-1',
                type: 'seeder',
                status: Math.random() > 0.3 ? 'active' : 'idle',
                battery: 60 + Math.random() * 20,
                position: { x: -3 + Math.random() * 2, y: 0, z: 2 + Math.random() * 2 },
                currentTask: '파종 대기',
                completedTasks: Math.floor(120 + Math.random() * 10),
            },
            {
                id: 'robot-003',
                name: 'Patrol-1',
                type: 'patrol',
                status: 'active',
                battery: 88 + Math.random() * 8,
                position: { x: Math.sin(Date.now() / 1000) * 5, y: 2, z: Math.cos(Date.now() / 1000) * 5 },
                currentTask: '구역 순찰 중',
                completedTasks: Math.floor(200 + Math.random() * 20),
            },
            {
                id: 'robot-004',
                name: 'Transport-1',
                type: 'transport',
                status: Math.random() > 0.5 ? 'active' : 'charging',
                battery: 45 + Math.random() * 30,
                position: { x: 0, y: 0, z: -5 + Math.random() * 3 },
                currentTask: '수확물 운반',
                completedTasks: Math.floor(80 + Math.random() * 8),
            },
        ];
    }

    // 정리
    destroy() {
        this.simulationIntervals.forEach(interval => clearInterval(interval));
        this.simulationIntervals.clear();

        if (this.pusher) {
            this.pusher.disconnect();
        }

        this.channels.clear();
        this.listeners.clear();
    }
}

// 싱글톤 인스턴스
let realTimeServiceInstance: RealTimeDataService | null = null;

export function getRealTimeService(): RealTimeDataService {
    if (!realTimeServiceInstance) {
        realTimeServiceInstance = new RealTimeDataService();
    }
    return realTimeServiceInstance;
}

export default RealTimeDataService;
