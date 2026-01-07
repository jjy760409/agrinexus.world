// AgriNexus World OS - 자율 배송 드론 시스템
// Autonomous Delivery Drones - AI 기반 농산물 자율 배송 및 물류

// ============================================
// 타입 정의
// ============================================

export interface DroneDeliverySystem {
    id: string;
    farmId: string;
    fleet: Drone[];
    fleetAI: FleetAI;
    missions: DeliveryMission[];
    hubs: DroneHub[];
    routes: DeliveryRoute[];
    customers: CustomerLocation[];
    metrics: DroneMetrics;
    status: 'active' | 'busy' | 'weather_hold' | 'maintenance';
}

export interface Drone {
    id: string;
    name: string;
    model: string;
    type: DroneType;
    status: DroneStatus;
    batteryLevel: number;             // %
    payload: { current: number; max: number };  // kg
    location: { lat: number; lon: number; altitude: number };
    speed: number;                    // km/h
    currentMission?: string;
    flightTime: number;               // hours today
    totalFlights: number;
    maintenanceScore: number;         // 0-100
    sensors: DroneSensor[];
    capabilities: string[];
}

export type DroneType =
    | 'cargo_light'      // 5kg 이하
    | 'cargo_medium'     // 5-15kg
    | 'cargo_heavy'      // 15-30kg
    | 'multi_drop'       // 다중 배송
    | 'cold_chain'       // 냉장 배송
    | 'express';         // 초고속 배송

export type DroneStatus = 'idle' | 'flying' | 'loading' | 'unloading' | 'returning' | 'charging' | 'maintenance';

export interface DroneSensor {
    type: 'obstacle' | 'weather' | 'gps' | 'cargo' | 'thermal';
    status: 'active' | 'error';
    value?: number;
    unit?: string;
}

export interface FleetAI {
    id: string;
    name: string;
    version: string;
    dronesManaged: number;
    routeOptimization: number;        // % efficiency
    collisionAvoidance: number;       // % accuracy
    weatherPrediction: number;        // % accuracy
    deliveryPrioritization: string;
    learningRate: number;
    status: 'active' | 'optimizing' | 'rerouting';
}

export interface DeliveryMission {
    id: string;
    type: 'single' | 'multi_drop' | 'return_pickup' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedDrone: string;
    origin: Location;
    destinations: Destination[];
    cargo: CargoItem[];
    status: MissionStatus;
    createdAt: Date;
    estimatedArrival: Date;
    actualArrival?: Date;
    distance: number;                 // km
    efficiency: number;               // %
}

export type MissionStatus = 'pending' | 'assigned' | 'loading' | 'in_transit' | 'delivering' | 'completed' | 'failed' | 'cancelled';

export interface Location {
    name: string;
    lat: number;
    lon: number;
    type: 'farm' | 'hub' | 'customer' | 'partner';
}

export interface Destination {
    location: Location;
    sequence: number;
    status: 'pending' | 'delivered' | 'failed';
    deliveryTime?: Date;
    signature?: string;
    photo?: string;
}

export interface CargoItem {
    id: string;
    name: string;
    type: 'produce' | 'seeds' | 'equipment' | 'samples';
    weight: number;                   // kg
    temperature?: { min: number; max: number };
    fragile: boolean;
    value: number;                    // USD
}

export interface DroneHub {
    id: string;
    name: string;
    location: { lat: number; lon: number };
    capacity: { drones: number; charging: number };
    currentDrones: number;
    chargingSlots: number;
    maintenanceBay: boolean;
    weatherStation: boolean;
    status: 'operational' | 'busy' | 'maintenance';
}

export interface DeliveryRoute {
    id: string;
    name: string;
    type: 'regular' | 'express' | 'specialized';
    waypoints: { lat: number; lon: number; altitude: number }[];
    distance: number;                 // km
    avgTime: number;                  // minutes
    restrictions: string[];
    popularTimes: string[];
    efficiency: number;               // %
}

export interface CustomerLocation {
    id: string;
    name: string;
    type: 'restaurant' | 'grocery' | 'distributor' | 'consumer' | 'business';
    location: { lat: number; lon: number };
    deliveryFrequency: string;
    preferredTime: string;
    accessType: 'outdoor' | 'rooftop' | 'designated_area';
    satisfaction: number;             // 1-5
    totalOrders: number;
}

export interface DroneMetrics {
    totalDrones: number;
    activeDrones: number;
    deliveriesToday: number;
    deliveriesTotal: number;
    onTimeDeliveryRate: number;       // %
    avgDeliveryTime: number;          // minutes
    totalDistance: number;            // km today
    cargoDelivered: number;           // kg today
    customerSatisfaction: number;     // 1-5
    fleetUtilization: number;         // %
    batteryEfficiency: number;        // km/% battery
    incidentRate: number;             // per 1000 deliveries
}

// ============================================
// 드론 배송 엔진
// ============================================

export class DroneDeliveryEngine {
    private system: DroneDeliverySystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): DroneDeliverySystem {
        return {
            id: `drone-${Date.now()}`,
            farmId,
            fleet: this.createFleet(),
            fleetAI: {
                id: 'fleet-ai-1',
                name: 'SkyMind AI',
                version: '5.0',
                dronesManaged: 50,
                routeOptimization: 98.5,
                collisionAvoidance: 99.99,
                weatherPrediction: 96,
                deliveryPrioritization: 'AI Dynamic Scoring',
                learningRate: 0.15,
                status: 'active'
            },
            missions: this.createMissions(),
            hubs: this.createHubs(),
            routes: this.createRoutes(),
            customers: this.createCustomers(),
            metrics: {
                totalDrones: 50,
                activeDrones: 38,
                deliveriesToday: 245,
                deliveriesTotal: 125000,
                onTimeDeliveryRate: 98.7,
                avgDeliveryTime: 18,
                totalDistance: 1850,
                cargoDelivered: 520,
                customerSatisfaction: 4.9,
                fleetUtilization: 76,
                batteryEfficiency: 2.5,
                incidentRate: 0.02
            },
            status: 'active'
        };
    }

    private createFleet(): Drone[] {
        const droneModels: { model: string; type: DroneType; maxPayload: number; caps: string[] }[] = [
            { model: 'Swift-X1', type: 'express', maxPayload: 3, caps: ['초고속', 'GPS+', '자동회피'] },
            { model: 'Cargo-M5', type: 'cargo_medium', maxPayload: 12, caps: ['대용량', '안정성', '야간비행'] },
            { model: 'Frost-C2', type: 'cold_chain', maxPayload: 8, caps: ['냉장', '온도유지', '신선도센서'] },
            { model: 'Multi-D3', type: 'multi_drop', maxPayload: 15, caps: ['다중배송', '자동분류', '스마트락'] },
            { model: 'Heavy-H7', type: 'cargo_heavy', maxPayload: 28, caps: ['중량물', '강풍대응', '정밀착륙'] }
        ];

        return Array.from({ length: 50 }, (_, i) => {
            const model = droneModels[i % droneModels.length];
            return {
                id: `drone-${i}`,
                name: `${model.model}-${String(i + 1).padStart(3, '0')}`,
                model: model.model,
                type: model.type,
                status: i < 38 ? (Math.random() > 0.5 ? 'flying' : 'idle') : 'charging',
                batteryLevel: 60 + Math.random() * 40,
                payload: { current: Math.random() * model.maxPayload * 0.7, max: model.maxPayload },
                location: { lat: 37.5 + Math.random() * 0.1, lon: 127 + Math.random() * 0.1, altitude: 50 + Math.random() * 100 },
                speed: 40 + Math.random() * 40,
                flightTime: Math.random() * 4,
                totalFlights: 500 + Math.floor(Math.random() * 2000),
                maintenanceScore: 85 + Math.random() * 15,
                sensors: [
                    { type: 'obstacle', status: 'active' },
                    { type: 'weather', status: 'active' },
                    { type: 'gps', status: 'active' },
                    { type: 'cargo', status: 'active', value: Math.random() * model.maxPayload, unit: 'kg' }
                ],
                capabilities: model.caps
            };
        });
    }

    private createMissions(): DeliveryMission[] {
        return [
            { id: 'mis-1', type: 'single', priority: 'high', assignedDrone: 'drone-0', origin: { name: '메인 농장', lat: 37.5665, lon: 126.978, type: 'farm' }, destinations: [{ location: { name: '강남 레스토랑', lat: 37.4979, lon: 127.0276, type: 'customer' }, sequence: 1, status: 'pending' }], cargo: [{ id: 'c-1', name: '유기농 상추', type: 'produce', weight: 2.5, fragile: true, value: 45 }], status: 'in_transit', createdAt: new Date(), estimatedArrival: new Date(Date.now() + 1200000), distance: 15.5, efficiency: 94 },
            { id: 'mis-2', type: 'multi_drop', priority: 'medium', assignedDrone: 'drone-3', origin: { name: '메인 농장', lat: 37.5665, lon: 126.978, type: 'farm' }, destinations: [{ location: { name: '마트 A', lat: 37.52, lon: 127.02, type: 'customer' }, sequence: 1, status: 'delivered', deliveryTime: new Date() }, { location: { name: '마트 B', lat: 37.55, lon: 127.05, type: 'customer' }, sequence: 2, status: 'pending' }], cargo: [{ id: 'c-2', name: '딸기', type: 'produce', weight: 5, temperature: { min: 2, max: 8 }, fragile: true, value: 120 }], status: 'in_transit', createdAt: new Date(), estimatedArrival: new Date(Date.now() + 1800000), distance: 22, efficiency: 91 }
        ];
    }

    private createHubs(): DroneHub[] {
        return [
            { id: 'hub-1', name: '중앙 허브', location: { lat: 37.5665, lon: 126.978 }, capacity: { drones: 30, charging: 15 }, currentDrones: 22, chargingSlots: 12, maintenanceBay: true, weatherStation: true, status: 'operational' },
            { id: 'hub-2', name: '강남 허브', location: { lat: 37.4979, lon: 127.0276 }, capacity: { drones: 15, charging: 8 }, currentDrones: 10, chargingSlots: 5, maintenanceBay: false, weatherStation: true, status: 'operational' },
            { id: 'hub-3', name: '인천 허브', location: { lat: 37.4563, lon: 126.7052 }, capacity: { drones: 20, charging: 10 }, currentDrones: 15, chargingSlots: 8, maintenanceBay: true, weatherStation: true, status: 'operational' }
        ];
    }

    private createRoutes(): DeliveryRoute[] {
        return [
            { id: 'route-1', name: '강남 익스프레스', type: 'express', waypoints: [{ lat: 37.5665, lon: 126.978, altitude: 80 }, { lat: 37.53, lon: 127, altitude: 100 }, { lat: 37.4979, lon: 127.0276, altitude: 60 }], distance: 12, avgTime: 15, restrictions: ['공항 근처 비행 금지'], popularTimes: ['10:00-12:00', '17:00-19:00'], efficiency: 96 },
            { id: 'route-2', name: '도심 루트', type: 'regular', waypoints: [{ lat: 37.5665, lon: 126.978, altitude: 100 }], distance: 8, avgTime: 12, restrictions: [], popularTimes: ['09:00-18:00'], efficiency: 94 }
        ];
    }

    private createCustomers(): CustomerLocation[] {
        return [
            { id: 'cust-1', name: '미슐랭 레스토랑 A', type: 'restaurant', location: { lat: 37.52, lon: 127.03 }, deliveryFrequency: '매일', preferredTime: '06:00-08:00', accessType: 'rooftop', satisfaction: 5, totalOrders: 850 },
            { id: 'cust-2', name: '프리미엄 마트', type: 'grocery', location: { lat: 37.55, lon: 127.01 }, deliveryFrequency: '주 3회', preferredTime: '05:00-07:00', accessType: 'designated_area', satisfaction: 4.8, totalOrders: 420 }
        ];
    }

    dispatch(droneId: string, missionId: string): boolean {
        const drone = this.system.fleet.find(d => d.id === droneId);
        const mission = this.system.missions.find(m => m.id === missionId);
        if (drone && mission && drone.status === 'idle') {
            drone.status = 'loading';
            drone.currentMission = missionId;
            mission.status = 'assigned';
            return true;
        }
        return false;
    }

    getSystem(): DroneDeliverySystem { return this.system; }
    getMetrics(): DroneMetrics { return this.system.metrics; }
    getFleet(): Drone[] { return this.system.fleet; }
    getMissions(): DeliveryMission[] { return this.system.missions; }
}

const droneEngines: Map<string, DroneDeliveryEngine> = new Map();
export function getDroneDeliveryEngine(farmId: string): DroneDeliveryEngine {
    if (!droneEngines.has(farmId)) droneEngines.set(farmId, new DroneDeliveryEngine(farmId));
    return droneEngines.get(farmId)!;
}
