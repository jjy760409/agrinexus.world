// AgriNexus World OS - 기상 공학 시스템
// Weather Engineering - 세계 최초 농장 규모 기상 제어 시스템

export interface WeatherEngineeringSystem {
    id: string;
    farmId: string;
    zones: WeatherZone[];
    controllers: WeatherController[];
    forecasts: WeatherPlan[];
    currentWeather: CurrentWeather;
    history: WeatherEvent[];
    metrics: WeatherMetrics;
    status: 'auto' | 'manual' | 'emergency' | 'calibrating';
}

export interface WeatherZone {
    id: string;
    name: string;
    koreanName: string;
    area: { x1: number; y1: number; x2: number; y2: number };
    targetWeather: TargetWeather;
    currentConditions: ZoneConditions;
    crops: string[];
    priority: number;
}

export interface TargetWeather {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    lightIntensity: { min: number; max: number };
    co2Level: { min: number; max: number };
    windSpeed: { min: number; max: number };
    precipitation: number;              // mm/day
}

export interface ZoneConditions {
    temperature: number;
    humidity: number;
    lightIntensity: number;             // μmol/m²/s
    co2Level: number;                   // ppm
    windSpeed: number;                  // m/s
    precipitation: number;
    cloudCover: number;                 // %
    uvIndex: number;
}

export interface WeatherController {
    id: string;
    zoneId: string;
    type: ControllerType;
    capacity: number;
    currentOutput: number;
    efficiency: number;                 // %
    status: 'active' | 'standby' | 'maintenance';
}

export type ControllerType = 'temperature_regulator' | 'humidity_generator' | 'light_emitter' | 'co2_injector' | 'wind_generator' | 'rain_maker' | 'cloud_seeder' | 'uv_filter';

export interface WeatherPlan {
    id: string;
    zoneId: string;
    startTime: Date;
    duration: number;                   // hours
    phases: WeatherPhase[];
    cropOptimized: boolean;
    energyCost: number;
}

export interface WeatherPhase {
    name: string;
    duration: number;                   // minutes
    conditions: Partial<ZoneConditions>;
    transition: 'gradual' | 'immediate';
}

export interface CurrentWeather {
    outdoor: ZoneConditions;
    indoor: ZoneConditions;
    variance: number;                   // % difference
}

export interface WeatherEvent {
    id: string;
    type: 'adjustment' | 'emergency' | 'optimization' | 'user_request';
    zoneId: string;
    description: string;
    timestamp: Date;
    success: boolean;
}

export interface WeatherMetrics {
    totalZones: number;
    activeControllers: number;
    temperatureAccuracy: number;        // %
    humidityAccuracy: number;           // %
    energyEfficiency: number;           // %
    cropYieldImprovement: number;       // %
    weatherEventsToday: number;
}

export class WeatherEngineeringEngine {
    private system: WeatherEngineeringSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): WeatherEngineeringSystem {
        return {
            id: `weather-${Date.now()}`,
            farmId,
            zones: [
                { id: 'wz-1', name: 'Tropical Zone', koreanName: '열대 구역', area: { x1: 0, y1: 0, x2: 10, y2: 10 }, targetWeather: { temperature: { min: 28, max: 32 }, humidity: { min: 75, max: 90 }, lightIntensity: { min: 800, max: 1200 }, co2Level: { min: 800, max: 1200 }, windSpeed: { min: 0.5, max: 2 }, precipitation: 5 }, currentConditions: { temperature: 30, humidity: 82, lightIntensity: 950, co2Level: 1000, windSpeed: 1.2, precipitation: 0, cloudCover: 20, uvIndex: 6 }, crops: ['열대과일'], priority: 8 },
                { id: 'wz-2', name: 'Temperate Zone', koreanName: '온대 구역', area: { x1: 10, y1: 0, x2: 20, y2: 10 }, targetWeather: { temperature: { min: 18, max: 25 }, humidity: { min: 60, max: 75 }, lightIntensity: { min: 600, max: 900 }, co2Level: { min: 600, max: 1000 }, windSpeed: { min: 1, max: 3 }, precipitation: 3 }, currentConditions: { temperature: 22, humidity: 68, lightIntensity: 750, co2Level: 850, windSpeed: 1.8, precipitation: 0, cloudCover: 35, uvIndex: 4 }, crops: ['딸기', '토마토'], priority: 10 },
                { id: 'wz-3', name: 'Arid Zone', koreanName: '건조 구역', area: { x1: 0, y1: 10, x2: 10, y2: 20 }, targetWeather: { temperature: { min: 25, max: 35 }, humidity: { min: 30, max: 50 }, lightIntensity: { min: 1000, max: 1500 }, co2Level: { min: 500, max: 800 }, windSpeed: { min: 2, max: 5 }, precipitation: 0.5 }, currentConditions: { temperature: 32, humidity: 40, lightIntensity: 1250, co2Level: 650, windSpeed: 3.5, precipitation: 0, cloudCover: 5, uvIndex: 9 }, crops: ['선인장', '알로에'], priority: 5 }
            ],
            controllers: [
                { id: 'ctrl-1', zoneId: 'wz-1', type: 'humidity_generator', capacity: 100, currentOutput: 82, efficiency: 90, status: 'active' },
                { id: 'ctrl-2', zoneId: 'wz-2', type: 'temperature_regulator', capacity: 50, currentOutput: 22, efficiency: 95, status: 'active' },
                { id: 'ctrl-3', zoneId: 'wz-2', type: 'light_emitter', capacity: 1200, currentOutput: 750, efficiency: 88, status: 'active' },
                { id: 'ctrl-4', zoneId: 'wz-3', type: 'uv_filter', capacity: 10, currentOutput: 9, efficiency: 92, status: 'active' }
            ],
            forecasts: [],
            currentWeather: { outdoor: { temperature: 15, humidity: 55, lightIntensity: 600, co2Level: 420, windSpeed: 4, precipitation: 0, cloudCover: 60, uvIndex: 3 }, indoor: { temperature: 24, humidity: 70, lightIntensity: 850, co2Level: 900, windSpeed: 1.5, precipitation: 0, cloudCover: 0, uvIndex: 0 }, variance: 40 },
            history: [],
            metrics: { totalZones: 3, activeControllers: 4, temperatureAccuracy: 97, humidityAccuracy: 94, energyEfficiency: 85, cropYieldImprovement: 32, weatherEventsToday: 15 },
            status: 'auto'
        };
    }

    setZoneWeather(zoneId: string, conditions: Partial<ZoneConditions>): WeatherZone | null {
        const zone = this.system.zones.find(z => z.id === zoneId);
        if (!zone) return null;
        Object.assign(zone.currentConditions, conditions);
        this.system.history.push({ id: `event-${Date.now()}`, type: 'adjustment', zoneId, description: `조건 조정: ${JSON.stringify(conditions)}`, timestamp: new Date(), success: true });
        return zone;
    }

    getSystem(): WeatherEngineeringSystem { return this.system; }
    getZone(zoneId: string): WeatherZone | undefined { return this.system.zones.find(z => z.id === zoneId); }
}

const weatherEngines: Map<string, WeatherEngineeringEngine> = new Map();
export function getWeatherEngineeringEngine(farmId: string): WeatherEngineeringEngine {
    if (!weatherEngines.has(farmId)) weatherEngines.set(farmId, new WeatherEngineeringEngine(farmId));
    return weatherEngines.get(farmId)!;
}
