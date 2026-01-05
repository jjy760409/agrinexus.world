// AgriNexus World OS - 실시간 API 통합 시스템
// 날씨, 농산물 시세, AI 어시스턴트 등 외부 API 연동

// 날씨 데이터 타입
export interface WeatherData {
    location: string;
    temperature: number;
    humidity: number;
    description: string;
    icon: string;
    windSpeed: number;
    pressure: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    feels_like: number;
    uv_index?: number;
}

// 농산물 시세 데이터
export interface MarketPrice {
    name: string;
    price: number;
    unit: string;
    change: number;
    changePercent: number;
    market: string;
    date: string;
}

// AI 응답 타입
export interface AIResponse {
    message: string;
    suggestions: string[];
    confidence: number;
    sources?: string[];
}

// 실시간 알림 타입
export interface RealtimeNotification {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

// 시뮬레이션된 날씨 데이터 (API 키 없을 때 사용)
export function getSimulatedWeather(): WeatherData {
    const conditions = [
        { description: '맑음', icon: '☀️' },
        { description: '구름 조금', icon: '⛅' },
        { description: '흐림', icon: '☁️' },
        { description: '비', icon: '🌧️' },
    ];

    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    return {
        location: '세종시',
        temperature: 18 + Math.random() * 10,
        humidity: 55 + Math.random() * 25,
        description: condition.description,
        icon: condition.icon,
        windSpeed: 2 + Math.random() * 8,
        pressure: 1010 + Math.random() * 20,
        visibility: 8 + Math.random() * 4,
        sunrise: '06:45',
        sunset: '17:30',
        feels_like: 17 + Math.random() * 10,
        uv_index: Math.floor(Math.random() * 11),
    };
}

// 시뮬레이션된 농산물 시세
export function getSimulatedMarketPrices(): MarketPrice[] {
    const products = [
        { name: '상추', basePrice: 3500, unit: '4kg' },
        { name: '토마토', basePrice: 8500, unit: '10kg' },
        { name: '오이', basePrice: 4200, unit: '10kg' },
        { name: '파프리카', basePrice: 12000, unit: '5kg' },
        { name: '바질', basePrice: 15000, unit: '1kg' },
        { name: '딸기', basePrice: 25000, unit: '2kg' },
    ];

    return products.map(p => {
        const change = (Math.random() - 0.5) * 1000;
        const price = p.basePrice + change;
        return {
            name: p.name,
            price: Math.round(price),
            unit: p.unit,
            change: Math.round(change),
            changePercent: Math.round((change / p.basePrice) * 100 * 10) / 10,
            market: '가락시장',
            date: new Date().toLocaleDateString('ko-KR'),
        };
    });
}

// 시뮬레이션된 AI 응답
export function getSimulatedAIResponse(query: string): AIResponse {
    const responses: Record<string, AIResponse> = {
        default: {
            message: `"${query}"에 대한 분석을 완료했습니다. AgriNexus AI가 최적의 재배 조건을 추천합니다.`,
            suggestions: [
                '온도를 22-25°C로 유지하세요',
                '습도를 60-70%로 조절하세요',
                'LED 조명 시간을 16시간으로 설정하세요',
            ],
            confidence: 85 + Math.random() * 15,
        },
        온도: {
            message: '현재 온도 상태를 분석했습니다. 상추 재배에 적합한 온도 범위입니다.',
            suggestions: [
                '야간 온도를 18-20°C로 낮추면 성장이 촉진됩니다',
                '급격한 온도 변화를 피하세요',
                '환기 시스템을 자동 모드로 설정하세요',
            ],
            confidence: 92,
        },
        수확: {
            message: '수확 시기 분석 결과입니다. 3일 후 수확이 최적입니다.',
            suggestions: [
                '아침 6-8시 사이에 수확하세요',
                '수확 전 12시간 관수를 중단하세요',
                '수확 후 즉시 예냉 처리하세요',
            ],
            confidence: 88,
        },
    };

    // 키워드 매칭
    for (const keyword of Object.keys(responses)) {
        if (query.includes(keyword)) {
            return responses[keyword];
        }
    }

    return responses.default;
}

// 실시간 알림 생성
export function generateNotification(): RealtimeNotification {
    const notifications = [
        { type: 'success' as const, title: '수확 완료', message: 'Zone A-3 상추 수확이 완료되었습니다 (150kg)' },
        { type: 'info' as const, title: '시스템 업데이트', message: 'AI 예측 모델이 새 버전으로 업데이트되었습니다' },
        { type: 'warning' as const, title: '습도 알림', message: 'Zone B-2 습도가 상한(75%)에 근접했습니다' },
        { type: 'info' as const, title: '에너지 최적화', message: '태양광 발전량이 오늘 목표치를 초과했습니다 (+15%)' },
        { type: 'success' as const, title: '로봇 작업', message: '파종 로봇이 300개 정식을 완료했습니다' },
    ];

    const n = notifications[Math.floor(Math.random() * notifications.length)];

    return {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: new Date(),
        read: false,
    };
}

// 스마트팜 추천 시스템
export interface SmartRecommendation {
    category: 'climate' | 'nutrition' | 'harvest' | 'energy' | 'pest';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    action: string;
    expectedImprovement: string;
}

export function generateSmartRecommendations(): SmartRecommendation[] {
    return [
        {
            category: 'climate',
            priority: 'high',
            title: '야간 온도 최적화',
            description: '현재 야간 온도(20°C)를 18°C로 낮추면 성장 속도가 향상됩니다.',
            action: 'HVAC 야간 설정 변경',
            expectedImprovement: '+12% 성장률',
        },
        {
            category: 'nutrition',
            priority: 'medium',
            title: 'EC 레벨 조정',
            description: 'EC를 1.8에서 2.0으로 올려 영양 공급을 강화하세요.',
            action: '양액 농도 조절',
            expectedImprovement: '+8% 수확량',
        },
        {
            category: 'energy',
            priority: 'low',
            title: 'LED 스케줄 최적화',
            description: '일출 시간에 맞춰 LED를 30분 늦게 시작하면 전력 절감됩니다.',
            action: '조명 타이머 변경',
            expectedImprovement: '-5% 전력비',
        },
        {
            category: 'harvest',
            priority: 'high',
            title: '수확 시기 도래',
            description: 'Zone A-3의 상추가 최적 수확 시기에 도달했습니다.',
            action: '수확 작업 시작',
            expectedImprovement: '품질 등급 A+',
        },
    ];
}
