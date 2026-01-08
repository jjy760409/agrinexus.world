// AgriNexus World OS - 실제 기상청 API 연동
// Real Weather API Service - 실제 기상청 데이터 연동

// ============================================
// 타입 정의
// ============================================

export interface WeatherData {
    temperature: number;              // 기온 (°C)
    humidity: number;                 // 습도 (%)
    windSpeed: number;                // 풍속 (m/s)
    windDirection: string;            // 풍향
    precipitation: number;            // 강수량 (mm)
    precipitationType: PrecipitationType;
    sky: SkyCondition;
    hourlyForecasts: HourlyForecast[];
    fetchedAt: Date;
    location: { nx: number; ny: number };
    isRealData: boolean;
}

export type PrecipitationType = '없음' | '비' | '비/눈' | '눈' | '소나기';
export type SkyCondition = '맑음' | '구름많음' | '흐림';

export interface HourlyForecast {
    time: string;
    temperature: number;
    humidity: number;
    sky: SkyCondition;
    precipitation: number;
    precipitationProbability: number;
}

// ============================================
// 기상청 API 응답 타입
// ============================================

interface KMAResponse {
    response: {
        header: { resultCode: string; resultMsg: string };
        body: {
            dataType: string;
            items: { item: KMAItem[] };
            pageNo: number;
            numOfRows: number;
            totalCount: number;
        };
    };
}

interface KMAItem {
    baseDate: string;
    baseTime: string;
    category: string;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}

// ============================================
// 격자 좌표 변환 (위경도 → 기상청 격자)
// ============================================

export function convertToGrid(lat: number, lon: number): { nx: number; ny: number } {
    const RE = 6371.00877;
    const GRID = 5.0;
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;

    const DEGRAD = Math.PI / 180.0;
    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    ra = (re * sf) / Math.pow(ra, sn);
    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

    return { nx, ny };
}

// ============================================
// 실제 날씨 서비스
// ============================================

export class RealWeatherService {
    private apiKey: string;
    private baseUrl = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
    private cache: Map<string, { data: WeatherData; expiry: Date }> = new Map();
    private cacheDuration = 30 * 60 * 1000; // 30분

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';
    }

    // 기준 시간 계산 (기상청 API는 3시간 단위)
    private getBaseDateTime(): { baseDate: string; baseTime: string } {
        const now = new Date();
        const hours = now.getHours();
        const baseTimes = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

        let baseTimeIndex = baseTimes.findIndex(t => parseInt(t) > hours * 100);
        if (baseTimeIndex === -1 || baseTimeIndex === 0) {
            baseTimeIndex = baseTimes.length - 1;
            now.setDate(now.getDate() - 1);
        } else {
            baseTimeIndex -= 1;
        }

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');

        return {
            baseDate: `${year}${month}${day}`,
            baseTime: baseTimes[baseTimeIndex]
        };
    }

    // 실제 API 호출
    async fetchWeather(lat: number = 37.5665, lon: number = 126.9780): Promise<WeatherData> {
        const { nx, ny } = convertToGrid(lat, lon);
        const cacheKey = `${nx}-${ny}`;

        // 캐시 확인
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > new Date()) {
            console.log('🌤️ [캐시] 날씨 데이터 반환');
            return cached.data;
        }

        // API 키 확인
        if (!this.apiKey || this.apiKey === '여기에복사한키붙여넣기') {
            console.log('⚠️ API 키 없음 - 시뮬레이션 데이터 반환');
            return this.getSimulatedData(nx, ny);
        }

        try {
            const { baseDate, baseTime } = this.getBaseDateTime();
            const url = `${this.baseUrl}/getVilageFcst?serviceKey=${encodeURIComponent(this.apiKey)}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

            console.log('🌤️ [실제 API] 기상청 데이터 요청 중...');
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: KMAResponse = await response.json();

            if (data.response.header.resultCode !== '00') {
                throw new Error(`API Error: ${data.response.header.resultMsg}`);
            }

            const weatherData = this.parseWeatherData(data.response.body.items.item, nx, ny);

            // 캐시 저장
            this.cache.set(cacheKey, {
                data: weatherData,
                expiry: new Date(Date.now() + this.cacheDuration)
            });

            console.log('✅ [실제 API] 기상청 데이터 수신 완료!');
            return weatherData;

        } catch (error) {
            console.error('❌ 기상청 API 오류:', error);
            return this.getSimulatedData(nx, ny);
        }
    }

    // API 응답 파싱
    private parseWeatherData(items: KMAItem[], nx: number, ny: number): WeatherData {
        const now = new Date();
        const currentHour = String(now.getHours()).padStart(2, '0') + '00';

        let temperature = 0;
        let humidity = 0;
        let windSpeed = 0;
        let windDirection = '북';
        let precipitation = 0;
        let precipitationType: PrecipitationType = '없음';
        let sky: SkyCondition = '맑음';

        // 현재 시간에 가장 가까운 데이터 찾기
        for (const item of items) {
            if (item.fcstTime === currentHour ||
                Math.abs(parseInt(item.fcstTime) - parseInt(currentHour)) <= 100) {
                switch (item.category) {
                    case 'TMP': temperature = parseFloat(item.fcstValue); break;
                    case 'REH': humidity = parseFloat(item.fcstValue); break;
                    case 'WSD': windSpeed = parseFloat(item.fcstValue); break;
                    case 'VEC': windDirection = this.getWindDirection(parseFloat(item.fcstValue)); break;
                    case 'PCP': precipitation = item.fcstValue === '강수없음' ? 0 : parseFloat(item.fcstValue) || 0; break;
                    case 'PTY': precipitationType = this.getPrecipitationType(item.fcstValue); break;
                    case 'SKY': sky = this.getSkyCondition(item.fcstValue); break;
                }
            }
        }

        // 시간별 예보 생성
        const hourlyForecasts: HourlyForecast[] = [];
        const forecastTimes = new Set<string>();

        for (const item of items) {
            if (item.category === 'TMP' && !forecastTimes.has(item.fcstTime)) {
                forecastTimes.add(item.fcstTime);
                const tempItem = items.find(i => i.fcstTime === item.fcstTime && i.category === 'TMP');
                const humidItem = items.find(i => i.fcstTime === item.fcstTime && i.category === 'REH');
                const skyItem = items.find(i => i.fcstTime === item.fcstTime && i.category === 'SKY');
                const popItem = items.find(i => i.fcstTime === item.fcstTime && i.category === 'POP');
                const pcpItem = items.find(i => i.fcstTime === item.fcstTime && i.category === 'PCP');

                hourlyForecasts.push({
                    time: item.fcstTime,
                    temperature: tempItem ? parseFloat(tempItem.fcstValue) : 0,
                    humidity: humidItem ? parseFloat(humidItem.fcstValue) : 0,
                    sky: skyItem ? this.getSkyCondition(skyItem.fcstValue) : '맑음',
                    precipitation: pcpItem && pcpItem.fcstValue !== '강수없음' ? parseFloat(pcpItem.fcstValue) || 0 : 0,
                    precipitationProbability: popItem ? parseFloat(popItem.fcstValue) : 0
                });
            }
        }

        return {
            temperature,
            humidity,
            windSpeed,
            windDirection,
            precipitation,
            precipitationType,
            sky,
            hourlyForecasts: hourlyForecasts.slice(0, 24),
            fetchedAt: new Date(),
            location: { nx, ny },
            isRealData: true
        };
    }

    private getWindDirection(deg: number): string {
        const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'];
        return directions[Math.round(deg / 45) % 8];
    }

    private getPrecipitationType(value: string): PrecipitationType {
        const types: Record<string, PrecipitationType> = {
            '0': '없음', '1': '비', '2': '비/눈', '3': '눈', '4': '소나기'
        };
        return types[value] || '없음';
    }

    private getSkyCondition(value: string): SkyCondition {
        const conditions: Record<string, SkyCondition> = {
            '1': '맑음', '3': '구름많음', '4': '흐림'
        };
        return conditions[value] || '맑음';
    }

    // 시뮬레이션 데이터 (API 실패시 대체)
    private getSimulatedData(nx: number, ny: number): WeatherData {
        return {
            temperature: 18 + Math.random() * 10,
            humidity: 50 + Math.random() * 30,
            windSpeed: 1 + Math.random() * 5,
            windDirection: '남서',
            precipitation: 0,
            precipitationType: '없음',
            sky: '맑음',
            hourlyForecasts: Array.from({ length: 24 }, (_, i) => ({
                time: String(i).padStart(2, '0') + '00',
                temperature: 15 + Math.sin(i / 24 * Math.PI * 2) * 8,
                humidity: 60 + Math.random() * 20,
                sky: '맑음' as SkyCondition,
                precipitation: 0,
                precipitationProbability: Math.random() * 20
            })),
            fetchedAt: new Date(),
            location: { nx, ny },
            isRealData: false
        };
    }
}

// 싱글톤 인스턴스
let weatherService: RealWeatherService | null = null;
export function getRealWeatherService(): RealWeatherService {
    if (!weatherService) weatherService = new RealWeatherService();
    return weatherService;
}
