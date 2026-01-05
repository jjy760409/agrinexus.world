import type { Sensor, Alert, Decision, Equipment, Rule } from '@/store/useStore';

// Sensor types configuration
export const sensorTypes = [
    { id: 'temp', name: '온도', icon: '🌡️', unit: '°C', min: 18, max: 32, optimal: [22, 26] as [number, number] },
    { id: 'humidity', name: '습도', icon: '💧', unit: '%', min: 40, max: 90, optimal: [60, 75] as [number, number] },
    { id: 'co2', name: 'CO2', icon: '🌫️', unit: 'ppm', min: 300, max: 1200, optimal: [400, 800] as [number, number] },
    { id: 'light', name: '조도', icon: '☀️', unit: 'lux', min: 100, max: 5000, optimal: [2000, 4000] as [number, number] },
    { id: 'soil', name: '토양수분', icon: '🌱', unit: '%', min: 20, max: 80, optimal: [40, 60] as [number, number] },
    { id: 'ph', name: 'pH', icon: '🧪', unit: '', min: 5, max: 8, optimal: [6, 7] as [number, number] },
    { id: 'ec', name: 'EC', icon: '⚡', unit: 'mS/cm', min: 0.5, max: 3, optimal: [1.2, 2.2] as [number, number] },
    { id: 'wind', name: '풍속', icon: '💨', unit: 'm/s', min: 0, max: 5, optimal: [0.5, 2] as [number, number] },
];

export function initializeSensors(): Record<string, Sensor> {
    const sensors: Record<string, Sensor> = {};

    sensorTypes.forEach(sensor => {
        sensors[sensor.id] = {
            ...sensor,
            value: sensor.min + Math.random() * (sensor.max - sensor.min),
            trend: 'stable' as const,
            history: Array.from({ length: 20 }, () =>
                sensor.min + Math.random() * (sensor.max - sensor.min)
            ),
        };
    });

    return sensors;
}

export function initializeEquipment(): Record<string, Equipment> {
    const equipmentList = [
        { id: 'irrigation', name: '관개 시스템', icon: '💧', status: '정상 가동', active: true },
        { id: 'lighting', name: 'LED 조명', icon: '💡', status: '100% 출력', active: true },
        { id: 'hvac', name: '냉난방', icon: '❄️', status: '냉방 모드', active: true },
        { id: 'ventilation', name: '환기 시스템', icon: '🌀', status: '30% 출력', active: false },
        { id: 'co2', name: 'CO2 공급', icon: '🌫️', status: '대기 중', active: false },
        { id: 'fertigation', name: '양액 공급', icon: '🧪', status: '자동 모드', active: true },
    ];

    const equipment: Record<string, Equipment> = {};
    equipmentList.forEach(eq => {
        equipment[eq.id] = eq;
    });

    return equipment;
}

export function initializeRules(): Rule[] {
    return [
        { id: 0, name: '자동 관개', condition: '토양 수분 < 40% → 관개 시작', active: true },
        { id: 1, name: '온도 유지', condition: '온도 > 28°C → 냉방 가동', active: true },
        { id: 2, name: '야간 모드', condition: '22:00 이후 → 조명 OFF', active: true },
        { id: 3, name: 'CO2 보충', condition: 'CO2 < 600ppm → CO2 공급', active: false },
        { id: 4, name: '습도 제어', condition: '습도 > 80% → 환기 가동', active: true },
    ];
}

export function initializeDecisions(): Decision[] {
    return [
        { id: '1', priority: 'high', title: '관개 시스템 가동', desc: 'Zone A 토양 수분 35% 미만 감지. 즉시 관개 권장' },
        { id: '2', priority: 'medium', title: '환기 조절', desc: 'CO2 농도 최적화를 위해 환기팬 출력 30% 증가 권장' },
        { id: '3', priority: 'low', title: '조명 스케줄 조정', desc: '일출 시간 변화에 따라 LED 점등 시간 15분 앞당김 권장' },
        { id: '4', priority: 'high', title: '온도 제어', desc: '야간 온도 하락 예측. 난방 시스템 사전 가동 권장' },
    ];
}

export function initializeAlerts(): Alert[] {
    const alertTemplates = [
        { type: 'info' as const, icon: 'ℹ️', title: 'AI 분석 완료', desc: '작물 생장 패턴이 정상 범위입니다' },
        { type: 'success' as const, icon: '✅', title: '자동 관개 완료', desc: 'Zone A 관개가 성공적으로 완료되었습니다' },
        { type: 'warning' as const, icon: '⚠️', title: '습도 주의', desc: 'Zone B 습도가 최적 범위를 벗어났습니다' },
        { type: 'danger' as const, icon: '🚨', title: 'CO2 경고', desc: 'Zone C CO2 농도가 높습니다. 환기 권장' },
    ];

    return alertTemplates.map((template, index) => ({
        ...template,
        id: `alert-${Date.now()}-${index}`,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    }));
}

export const scheduleData = [
    { time: '06:00', task: 'LED 조명 점등', status: 'done' },
    { time: '07:00', task: '1차 관개', status: 'done' },
    { time: '09:00', task: '양액 공급', status: 'done' },
    { time: '12:00', task: '2차 관개', status: 'pending' },
    { time: '14:00', task: 'CO2 보충', status: 'upcoming' },
    { time: '18:00', task: '3차 관개', status: 'upcoming' },
    { time: '20:00', task: 'LED 조명 소등', status: 'upcoming' },
];
