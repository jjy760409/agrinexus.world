// AgriNexus World OS - 군집 마이크로 로보틱스 시스템
// Swarm Micro-Robotics - 자가 조직화 초소형 로봇 생태계

// ============================================
// 타입 정의
// ============================================

export interface MicroBot {
    id: string;
    type: MicroBotType;
    status: BotStatus;
    position: Position3D;
    velocity: Vector3D;
    battery: BatteryStatus;
    sensors: MicroSensor[];
    actuators: Actuator[];
    currentTask: BotTask | null;
    swarmRole: SwarmRole;
    communication: SwarmCommunication;
    capabilities: BotCapability[];
    health: BotHealth;
}

export type MicroBotType =
    | 'pollinator'      // 수분 로봇 (꿀벌 모방)
    | 'harvester'       // 수확 로봇
    | 'pruner'          // 전지 로봇
    | 'pest_hunter'     // 해충 사냥 로봇
    | 'soil_doctor'     // 토양/뿌리 관리 로봇
    | 'photon_farmer'   // 광 조절 로봇
    | 'nutrient_carrier' // 양분 운반 로봇
    | 'health_monitor'  // 건강 모니터링 로봇
    | 'repair_bot'      // 다른 로봇 수리
    | 'scout';          // 정찰 로봇

export type BotStatus = 'idle' | 'working' | 'charging' | 'returning' | 'emergency' | 'maintenance';

export interface Position3D {
    x: number;      // mm
    y: number;
    z: number;
    zone: string;   // 작업 구역
}

export interface Vector3D {
    x: number;      // mm/s
    y: number;
    z: number;
}

export interface BatteryStatus {
    level: number;          // 0-100%
    voltage: number;        // V
    current: number;        // mA
    temperature: number;    // °C
    cycleCount: number;
    estimatedRuntime: number; // minutes
    isCharging: boolean;
}

export interface MicroSensor {
    type: SensorType;
    value: number;
    unit: string;
    accuracy: number;
    lastUpdate: Date;
}

export type SensorType =
    | 'camera_rgb'
    | 'camera_ir'
    | 'camera_uv'
    | 'lidar'
    | 'ultrasonic'
    | 'chemical'
    | 'humidity'
    | 'temperature'
    | 'spectroscopy'
    | 'force';

export interface Actuator {
    type: ActuatorType;
    status: 'ready' | 'active' | 'locked' | 'error';
    position: number;       // 0-100%
    force: number;          // mN
    speed: number;          // mm/s
}

export type ActuatorType =
    | 'gripper'
    | 'cutter'
    | 'sprayer'
    | 'injector'
    | 'brush'
    | 'suction'
    | 'vibrator'
    | 'led_array';

export interface BotTask {
    id: string;
    type: TaskType;
    priority: number;       // 1-10
    target: TaskTarget;
    startTime: Date;
    estimatedDuration: number;
    progress: number;       // 0-100%
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'paused';
}

export type TaskType =
    | 'pollinate'
    | 'harvest_ripe'
    | 'prune_dead'
    | 'spray_nutrients'
    | 'inject_treatment'
    | 'collect_sample'
    | 'repair_structure'
    | 'eliminate_pest'
    | 'transfer_pollen'
    | 'measure_health'
    | 'guide_growth'
    | 'clean_surface';

export interface TaskTarget {
    plantId?: string;
    location: Position3D;
    specificPart?: 'leaf' | 'stem' | 'flower' | 'fruit' | 'root';
    size: { width: number; height: number; depth: number };
}

export type SwarmRole =
    | 'leader'
    | 'worker'
    | 'scout'
    | 'defender'
    | 'caretaker'
    | 'specialist';

export interface SwarmCommunication {
    nearbyBots: string[];
    signalStrength: number;
    lastHeartbeat: Date;
    messageQueue: SwarmMessage[];
    pheromoneTrails: PheromoneTrail[];
}

export interface SwarmMessage {
    from: string;
    to: string | 'broadcast';
    type: 'task_assign' | 'status_update' | 'help_request' | 'warning' | 'discovery';
    payload: Record<string, unknown>;
    timestamp: Date;
    priority: number;
}

export interface PheromoneTrail {
    type: 'food' | 'danger' | 'path' | 'work' | 'home';
    intensity: number;
    path: Position3D[];
    expiresAt: Date;
}

export interface BotCapability {
    name: string;
    level: number;      // 1-5
    energyCost: number; // mWh
    successRate: number; // 0-1
}

export interface BotHealth {
    overall: number;    // 0-100
    motors: number;
    sensors: number;
    communication: number;
    structural: number;
    estimatedLifespan: number; // hours
    maintenanceNeeded: string[];
}

// ============================================
// 군집 시스템 통계
// ============================================

export interface SwarmStatistics {
    totalBots: number;
    activeCount: number;
    chargingCount: number;
    maintenanceCount: number;
    taskCompletion: {
        today: number;
        week: number;
        month: number;
    };
    efficiency: number;
    coverage: number;       // 0-100%
    uptime: number;         // 0-100%
    energyConsumption: number; // kWh/day
    roleDistribution: Record<MicroBotType, number>;
}

export interface SwarmEvent {
    id: string;
    timestamp: Date;
    type: 'task_complete' | 'bot_failure' | 'pest_detected' | 'harvest_ready' |
    'colony_formed' | 'emergency' | 'optimization' | 'discovery';
    botId?: string;
    location?: Position3D;
    details: string;
    severity: 'info' | 'warning' | 'critical';
}

// ============================================
// 군집 로보틱스 엔진
// ============================================

export class SwarmMicroRoboticsEngine {
    private swarm: Map<string, MicroBot> = new Map();
    private events: SwarmEvent[] = [];
    private pheromoneMap: Map<string, PheromoneTrail[]> = new Map();
    private taskQueue: BotTask[] = [];

    constructor() {
        this.initializeSwarm();
    }

    private initializeSwarm(): void {
        // 100대의 마이크로 로봇 초기화
        const types: MicroBotType[] = [
            'pollinator', 'pollinator', 'pollinator',
            'harvester', 'harvester',
            'pruner',
            'pest_hunter', 'pest_hunter',
            'soil_doctor',
            'photon_farmer', 'photon_farmer',
            'nutrient_carrier', 'nutrient_carrier',
            'health_monitor', 'health_monitor',
            'repair_bot',
            'scout', 'scout'
        ];

        for (let i = 0; i < 100; i++) {
            const type = types[i % types.length];
            const bot = this.createBot(`bot-${String(i).padStart(3, '0')}`, type);
            this.swarm.set(bot.id, bot);
        }

        console.log('🤖 Swarm initialized with 100 micro-robots');
    }

    private createBot(id: string, type: MicroBotType): MicroBot {
        const roleMap: Record<MicroBotType, SwarmRole> = {
            pollinator: 'worker',
            harvester: 'worker',
            pruner: 'specialist',
            pest_hunter: 'defender',
            soil_doctor: 'specialist',
            photon_farmer: 'worker',
            nutrient_carrier: 'caretaker',
            health_monitor: 'scout',
            repair_bot: 'caretaker',
            scout: 'scout'
        };

        const sensors = this.getSensorsForType(type);
        const actuators = this.getActuatorsForType(type);
        const capabilities = this.getCapabilitiesForType(type);

        return {
            id,
            type,
            status: 'idle',
            position: {
                x: Math.random() * 10000,
                y: Math.random() * 10000,
                z: Math.random() * 3000,
                zone: `zone-${Math.floor(Math.random() * 10)}`
            },
            velocity: { x: 0, y: 0, z: 0 },
            battery: {
                level: 80 + Math.random() * 20,
                voltage: 3.7 + Math.random() * 0.4,
                current: 0,
                temperature: 25 + Math.random() * 5,
                cycleCount: Math.floor(Math.random() * 100),
                estimatedRuntime: 60 + Math.random() * 60,
                isCharging: false
            },
            sensors,
            actuators,
            currentTask: null,
            swarmRole: roleMap[type],
            communication: {
                nearbyBots: [],
                signalStrength: 95 + Math.random() * 5,
                lastHeartbeat: new Date(),
                messageQueue: [],
                pheromoneTrails: []
            },
            capabilities,
            health: {
                overall: 90 + Math.random() * 10,
                motors: 95 + Math.random() * 5,
                sensors: 90 + Math.random() * 10,
                communication: 98 + Math.random() * 2,
                structural: 95 + Math.random() * 5,
                estimatedLifespan: 5000 + Math.random() * 3000,
                maintenanceNeeded: []
            }
        };
    }

    private getSensorsForType(type: MicroBotType): MicroSensor[] {
        const sensors: MicroSensor[] = [
            { type: 'camera_rgb', value: 0, unit: 'px', accuracy: 0.95, lastUpdate: new Date() },
            { type: 'lidar', value: 0, unit: 'mm', accuracy: 0.99, lastUpdate: new Date() }
        ];

        switch (type) {
            case 'pollinator':
                sensors.push({ type: 'camera_uv', value: 0, unit: 'px', accuracy: 0.90, lastUpdate: new Date() });
                break;
            case 'pest_hunter':
                sensors.push({ type: 'camera_ir', value: 0, unit: 'px', accuracy: 0.92, lastUpdate: new Date() });
                break;
            case 'health_monitor':
                sensors.push({ type: 'spectroscopy', value: 0, unit: 'nm', accuracy: 0.98, lastUpdate: new Date() });
                sensors.push({ type: 'chemical', value: 0, unit: 'ppm', accuracy: 0.85, lastUpdate: new Date() });
                break;
            case 'soil_doctor':
                sensors.push({ type: 'humidity', value: 0, unit: '%', accuracy: 0.95, lastUpdate: new Date() });
                sensors.push({ type: 'chemical', value: 0, unit: 'ppm', accuracy: 0.90, lastUpdate: new Date() });
                break;
        }

        return sensors;
    }

    private getActuatorsForType(type: MicroBotType): Actuator[] {
        const actuators: Actuator[] = [];

        switch (type) {
            case 'pollinator':
                actuators.push(
                    { type: 'brush', status: 'ready', position: 0, force: 5, speed: 50 },
                    { type: 'vibrator', status: 'ready', position: 0, force: 2, speed: 100 }
                );
                break;
            case 'harvester':
                actuators.push(
                    { type: 'gripper', status: 'ready', position: 0, force: 50, speed: 30 },
                    { type: 'cutter', status: 'ready', position: 0, force: 100, speed: 20 }
                );
                break;
            case 'pruner':
                actuators.push(
                    { type: 'cutter', status: 'ready', position: 0, force: 150, speed: 15 }
                );
                break;
            case 'pest_hunter':
                actuators.push(
                    { type: 'suction', status: 'ready', position: 0, force: 30, speed: 80 },
                    { type: 'sprayer', status: 'ready', position: 0, force: 10, speed: 100 }
                );
                break;
            case 'nutrient_carrier':
                actuators.push(
                    { type: 'injector', status: 'ready', position: 0, force: 20, speed: 50 },
                    { type: 'sprayer', status: 'ready', position: 0, force: 10, speed: 80 }
                );
                break;
            case 'photon_farmer':
                actuators.push(
                    { type: 'led_array', status: 'ready', position: 0, force: 0, speed: 0 }
                );
                break;
        }

        return actuators;
    }

    private getCapabilitiesForType(type: MicroBotType): BotCapability[] {
        const capabilities: BotCapability[] = [
            { name: 'navigate', level: 4, energyCost: 5, successRate: 0.99 },
            { name: 'communicate', level: 5, energyCost: 1, successRate: 0.999 }
        ];

        switch (type) {
            case 'pollinator':
                capabilities.push(
                    { name: 'pollinate', level: 5, energyCost: 8, successRate: 0.95 },
                    { name: 'flower_detect', level: 5, energyCost: 2, successRate: 0.98 }
                );
                break;
            case 'harvester':
                capabilities.push(
                    { name: 'harvest', level: 4, energyCost: 15, successRate: 0.92 },
                    { name: 'ripeness_detect', level: 5, energyCost: 3, successRate: 0.97 }
                );
                break;
            case 'pest_hunter':
                capabilities.push(
                    { name: 'pest_detect', level: 5, energyCost: 4, successRate: 0.96 },
                    { name: 'pest_eliminate', level: 4, energyCost: 12, successRate: 0.88 }
                );
                break;
            case 'health_monitor':
                capabilities.push(
                    { name: 'health_scan', level: 5, energyCost: 6, successRate: 0.99 },
                    { name: 'disease_detect', level: 4, energyCost: 8, successRate: 0.94 }
                );
                break;
        }

        return capabilities;
    }

    // 군집 통계 조회
    getSwarmStatistics(): SwarmStatistics {
        const bots = Array.from(this.swarm.values());
        const roleDistribution: Record<MicroBotType, number> = {} as Record<MicroBotType, number>;

        for (const bot of bots) {
            roleDistribution[bot.type] = (roleDistribution[bot.type] || 0) + 1;
        }

        return {
            totalBots: bots.length,
            activeCount: bots.filter(b => b.status === 'working').length,
            chargingCount: bots.filter(b => b.status === 'charging').length,
            maintenanceCount: bots.filter(b => b.status === 'maintenance').length,
            taskCompletion: {
                today: Math.floor(50 + Math.random() * 100),
                week: Math.floor(300 + Math.random() * 500),
                month: Math.floor(1200 + Math.random() * 2000)
            },
            efficiency: 85 + Math.random() * 12,
            coverage: 92 + Math.random() * 8,
            uptime: 98 + Math.random() * 2,
            energyConsumption: 2 + Math.random() * 3,
            roleDistribution
        };
    }

    // 작업 할당
    assignTask(task: BotTask): string[] {
        const assignedBots: string[] = [];
        const suitableBots = this.findSuitableBots(task.type);

        for (const bot of suitableBots.slice(0, 3)) {
            bot.currentTask = task;
            bot.status = 'working';
            assignedBots.push(bot.id);

            this.addEvent({
                id: `evt-${Date.now()}`,
                timestamp: new Date(),
                type: 'task_complete',
                botId: bot.id,
                location: task.target.location,
                details: `${bot.type} 로봇이 ${task.type} 작업에 할당됨`,
                severity: 'info'
            });
        }

        return assignedBots;
    }

    private findSuitableBots(taskType: TaskType): MicroBot[] {
        const taskToBotType: Record<TaskType, MicroBotType[]> = {
            pollinate: ['pollinator'],
            harvest_ripe: ['harvester'],
            prune_dead: ['pruner'],
            spray_nutrients: ['nutrient_carrier'],
            inject_treatment: ['nutrient_carrier', 'soil_doctor'],
            collect_sample: ['health_monitor', 'scout'],
            repair_structure: ['repair_bot'],
            eliminate_pest: ['pest_hunter'],
            transfer_pollen: ['pollinator'],
            measure_health: ['health_monitor'],
            guide_growth: ['photon_farmer'],
            clean_surface: ['pruner']
        };

        const suitableTypes = taskToBotType[taskType] || [];
        return Array.from(this.swarm.values())
            .filter(bot =>
                suitableTypes.includes(bot.type) &&
                bot.status === 'idle' &&
                bot.battery.level > 30
            )
            .sort((a, b) => b.battery.level - a.battery.level);
    }

    // 페로몬 트레일 생성 (개미 알고리즘)
    createPheromoneTrail(type: PheromoneTrail['type'], path: Position3D[], intensity: number): void {
        const trail: PheromoneTrail = {
            type,
            intensity,
            path,
            expiresAt: new Date(Date.now() + 3600000) // 1시간 후 만료
        };

        const zoneId = path[0]?.zone || 'default';
        const trails = this.pheromoneMap.get(zoneId) || [];
        trails.push(trail);
        this.pheromoneMap.set(zoneId, trails);
    }

    // 로봇 상태 조회
    getBotStatus(botId: string): MicroBot | undefined {
        return this.swarm.get(botId);
    }

    // 모든 로봇 조회
    getAllBots(): MicroBot[] {
        return Array.from(this.swarm.values());
    }

    // 이벤트 조회
    getRecentEvents(count: number = 10): SwarmEvent[] {
        return this.events.slice(-count);
    }

    private addEvent(event: SwarmEvent): void {
        this.events.push(event);
        if (this.events.length > 1000) {
            this.events.shift();
        }
    }

    // 실시간 시뮬레이션
    simulateStep(): void {
        for (const bot of this.swarm.values()) {
            // 배터리 소모
            if (bot.status === 'working') {
                bot.battery.level = Math.max(0, bot.battery.level - 0.1);

                // 작업 진행
                if (bot.currentTask) {
                    bot.currentTask.progress = Math.min(100, bot.currentTask.progress + Math.random() * 10);

                    if (bot.currentTask.progress >= 100) {
                        bot.currentTask.status = 'completed';
                        bot.status = 'idle';

                        this.addEvent({
                            id: `evt-${Date.now()}`,
                            timestamp: new Date(),
                            type: 'task_complete',
                            botId: bot.id,
                            details: `${bot.type} 로봇이 ${bot.currentTask.type} 작업 완료`,
                            severity: 'info'
                        });

                        bot.currentTask = null;
                    }
                }
            }

            // 저배터리 충전
            if (bot.battery.level < 20 && bot.status !== 'charging') {
                bot.status = 'charging';
            }

            if (bot.status === 'charging') {
                bot.battery.level = Math.min(100, bot.battery.level + 0.5);
                bot.battery.isCharging = true;

                if (bot.battery.level >= 95) {
                    bot.status = 'idle';
                    bot.battery.isCharging = false;
                }
            }

            // 위치 업데이트 (랜덤 이동)
            if (bot.status === 'working' || bot.status === 'idle') {
                bot.position.x += (Math.random() - 0.5) * 100;
                bot.position.y += (Math.random() - 0.5) * 100;
                bot.position.z += (Math.random() - 0.5) * 50;
            }
        }
    }

    // 긴급 상황 처리
    emergencyResponse(location: Position3D, type: 'pest' | 'disease' | 'damage'): void {
        const nearbyBots = this.findNearbyBots(location, 2000);

        // 방어/수리 로봇 우선 배치
        const responders = nearbyBots.filter(b =>
            b.type === 'pest_hunter' || b.type === 'repair_bot' || b.type === 'health_monitor'
        );

        for (const bot of responders) {
            bot.status = 'emergency';
            this.addEvent({
                id: `evt-${Date.now()}`,
                timestamp: new Date(),
                type: 'emergency',
                botId: bot.id,
                location,
                details: `긴급 출동: ${type} 발생 지점으로 이동`,
                severity: 'critical'
            });
        }
    }

    private findNearbyBots(location: Position3D, radius: number): MicroBot[] {
        return Array.from(this.swarm.values()).filter(bot => {
            const distance = Math.sqrt(
                Math.pow(bot.position.x - location.x, 2) +
                Math.pow(bot.position.y - location.y, 2) +
                Math.pow(bot.position.z - location.z, 2)
            );
            return distance <= radius;
        });
    }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let swarmEngine: SwarmMicroRoboticsEngine | null = null;

export function getSwarmMicroRoboticsEngine(): SwarmMicroRoboticsEngine {
    if (!swarmEngine) {
        swarmEngine = new SwarmMicroRoboticsEngine();
    }
    return swarmEngine;
}

// 로봇 타입 아이콘
export const BOT_TYPE_ICONS: Record<MicroBotType, string> = {
    pollinator: '🐝',
    harvester: '🦾',
    pruner: '✂️',
    pest_hunter: '🎯',
    soil_doctor: '💊',
    photon_farmer: '💡',
    nutrient_carrier: '🧪',
    health_monitor: '🔬',
    repair_bot: '🔧',
    scout: '🛸'
};

// 상태 색상
export const BOT_STATUS_COLORS: Record<BotStatus, string> = {
    idle: '#9ca3af',
    working: '#10b981',
    charging: '#f59e0b',
    returning: '#3b82f6',
    emergency: '#ef4444',
    maintenance: '#8b5cf6'
};
