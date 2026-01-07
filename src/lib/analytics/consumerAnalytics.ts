// AgriNexus World OS - 소비자 분석 플랫폼
// Consumer Analytics Platform - AI 기반 소비자 인사이트 및 수요 예측

// ============================================
// 타입 정의
// ============================================

export interface ConsumerAnalyticsSystem {
    id: string;
    farmId: string;
    analyticsAI: AnalyticsAI;
    consumers: ConsumerProfile[];
    segments: ConsumerSegment[];
    trends: MarketTrend[];
    demandPredictions: DemandPrediction[];
    campaigns: MarketingCampaign[];
    feedback: ConsumerFeedback[];
    metrics: AnalyticsMetrics;
    status: 'active' | 'analyzing' | 'reporting';
}

export interface AnalyticsAI {
    id: string;
    name: string;
    version: string;
    capabilities: string[];
    predictionAccuracy: number;       // %
    segmentationAccuracy: number;     // %
    sentimentAccuracy: number;        // %
    dataProcessed: number;            // records/day
    modelUpdateFrequency: string;
    status: 'active' | 'training' | 'analyzing';
}

export interface ConsumerProfile {
    id: string;
    segment: string;
    demographics: Demographics;
    preferences: Preference[];
    purchaseHistory: PurchaseRecord[];
    engagementScore: number;          // 0-100
    lifetimeValue: number;            // USD
    churnRisk: number;                // %
    lastPurchase: Date;
    favoriteProducts: string[];
}

export interface Demographics {
    ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
    location: string;
    income: 'low' | 'medium' | 'high' | 'premium';
    lifestyle: string[];
}

export interface Preference {
    category: string;
    preference: string;
    strength: number;                 // 1-10
    source: 'explicit' | 'inferred';
}

export interface PurchaseRecord {
    date: Date;
    products: { name: string; quantity: number; price: number }[];
    total: number;
    channel: 'direct' | 'online' | 'retail' | 'wholesale';
    satisfaction: number;             // 1-5
}

export interface ConsumerSegment {
    id: string;
    name: string;
    koreanName: string;
    size: number;                     // customers
    characteristics: string[];
    avgSpend: number;                 // USD/month
    growthRate: number;               // %
    topProducts: string[];
    marketingStrategy: string;
    color: string;
}

export interface MarketTrend {
    id: string;
    name: string;
    category: 'preference' | 'behavior' | 'seasonal' | 'emerging';
    direction: 'up' | 'down' | 'stable';
    strength: number;                 // 1-10
    description: string;
    affectedProducts: string[];
    startDate: Date;
    confidence: number;               // %
}

export interface DemandPrediction {
    id: string;
    product: string;
    period: string;
    predictedDemand: number;          // units
    confidence: number;               // %
    factors: string[];
    priceRecommendation: number;      // USD
    productionRecommendation: number; // units
    createdAt: Date;
}

export interface MarketingCampaign {
    id: string;
    name: string;
    targetSegment: string;
    channel: 'email' | 'social' | 'app' | 'sms' | 'direct';
    status: 'planned' | 'active' | 'completed' | 'paused';
    startDate: Date;
    endDate: Date;
    budget: number;                   // USD
    spent: number;                    // USD
    reach: number;
    engagement: number;               // %
    conversions: number;
    roi: number;                      // %
}

export interface ConsumerFeedback {
    id: string;
    consumerId: string;
    type: 'review' | 'survey' | 'complaint' | 'suggestion';
    product: string;
    rating: number;                   // 1-5
    sentiment: 'positive' | 'neutral' | 'negative';
    content: string;
    keywords: string[];
    actionable: boolean;
    resolved: boolean;
    date: Date;
}

export interface AnalyticsMetrics {
    totalConsumers: number;
    activeConsumers: number;          // last 30 days
    newConsumers: number;             // this month
    churnRate: number;                // %
    avgOrderValue: number;            // USD
    avgPurchaseFrequency: number;     // orders/month
    customerSatisfaction: number;     // 1-5
    nps: number;                      // Net Promoter Score
    repeatPurchaseRate: number;       // %
    conversionRate: number;           // %
    marketShare: number;              // %
    brandAwareness: number;           // %
}

// ============================================
// 소비자 분석 엔진
// ============================================

export class ConsumerAnalyticsEngine {
    private system: ConsumerAnalyticsSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): ConsumerAnalyticsSystem {
        return {
            id: `analytics-${Date.now()}`,
            farmId,
            analyticsAI: {
                id: 'ai-1',
                name: 'ConsumerMind AI',
                version: '6.0',
                capabilities: ['수요 예측', '세분화', '감성 분석', '추천 엔진', '가격 최적화', '이탈 예측'],
                predictionAccuracy: 94.5,
                segmentationAccuracy: 96,
                sentimentAccuracy: 92,
                dataProcessed: 5000000,
                modelUpdateFrequency: '실시간',
                status: 'active'
            },
            consumers: this.createConsumers(),
            segments: this.createSegments(),
            trends: this.createTrends(),
            demandPredictions: this.createPredictions(),
            campaigns: this.createCampaigns(),
            feedback: this.createFeedback(),
            metrics: {
                totalConsumers: 125000,
                activeConsumers: 85000,
                newConsumers: 4500,
                churnRate: 2.5,
                avgOrderValue: 65,
                avgPurchaseFrequency: 3.2,
                customerSatisfaction: 4.7,
                nps: 72,
                repeatPurchaseRate: 78,
                conversionRate: 8.5,
                marketShare: 15,
                brandAwareness: 45
            },
            status: 'active'
        };
    }

    private createConsumers(): ConsumerProfile[] {
        return Array.from({ length: 10 }, (_, i) => ({
            id: `consumer-${i}`,
            segment: ['프리미엄', '헬스케어', '가족', '에코', '미식가'][i % 5],
            demographics: {
                ageGroup: ['25-34', '35-44', '45-54', '25-34', '35-44'][i % 5] as Demographics['ageGroup'],
                location: ['서울', '경기', '부산', '대전', '대구'][i % 5],
                income: ['high', 'medium', 'high', 'premium', 'high'][i % 5] as Demographics['income'],
                lifestyle: ['건강관리', '유기농선호']
            },
            preferences: [
                { category: '농산물', preference: '유기농', strength: 9, source: 'explicit' },
                { category: '배송', preference: '새벽배송', strength: 8, source: 'inferred' }
            ],
            purchaseHistory: [
                { date: new Date(), products: [{ name: '유기농 상추', quantity: 2, price: 8 }], total: 16, channel: 'online', satisfaction: 5 }
            ],
            engagementScore: 70 + Math.random() * 30,
            lifetimeValue: 500 + Math.random() * 2000,
            churnRisk: Math.random() * 20,
            lastPurchase: new Date(Date.now() - Math.random() * 30 * 86400000),
            favoriteProducts: ['유기농 상추', '방울토마토', '딸기']
        }));
    }

    private createSegments(): ConsumerSegment[] {
        return [
            { id: 'seg-1', name: 'Premium Health', koreanName: '🌟 프리미엄 헬스', size: 25000, characteristics: ['고소득', '건강중시', '유기농선호'], avgSpend: 180, growthRate: 15, topProducts: ['유기농 샐러드', '슈퍼푸드'], marketingStrategy: '품질 강조', color: '#FFD700' },
            { id: 'seg-2', name: 'Eco Conscious', koreanName: '🌱 에코 의식형', size: 35000, characteristics: ['환경보호', '지속가능성', '로컬푸드'], avgSpend: 95, growthRate: 22, topProducts: ['무농약 채소', '친환경 포장'], marketingStrategy: '지속가능성 강조', color: '#228B22' },
            { id: 'seg-3', name: 'Family Care', koreanName: '👨‍👩‍👧‍👦 가족 케어', size: 40000, characteristics: ['가족건강', '안전성', '가성비'], avgSpend: 120, growthRate: 8, topProducts: ['아이채소', '간편 샐러드'], marketingStrategy: '안전/신뢰 강조', color: '#4169E1' },
            { id: 'seg-4', name: 'Gourmet Chef', koreanName: '👨‍🍳 미식가', size: 15000, characteristics: ['요리애호가', '고품질', '희귀품종'], avgSpend: 250, growthRate: 12, topProducts: ['특수 허브', '희귀 채소'], marketingStrategy: '독점/프리미엄 강조', color: '#8B0000' },
            { id: 'seg-5', name: 'Quick Convenience', koreanName: '⚡ 편의 추구형', size: 10000, characteristics: ['시간절약', '간편식', '즉석구매'], avgSpend: 55, growthRate: 5, topProducts: ['밀키트', '세척채소'], marketingStrategy: '편의성 강조', color: '#FF6347' }
        ];
    }

    private createTrends(): MarketTrend[] {
        return [
            { id: 'trend-1', name: '식물성 단백질 수요 급증', category: 'emerging', direction: 'up', strength: 9, description: '비건/플렉시테리언 증가로 식물성 단백질 수요 폭발적 증가', affectedProducts: ['콩나물', '두부', '버섯'], startDate: new Date(Date.now() - 90 * 86400000), confidence: 92 },
            { id: 'trend-2', name: '프리미엄 딸기 시즌', category: 'seasonal', direction: 'up', strength: 8, description: '겨울철 프리미엄 딸기 수요 증가', affectedProducts: ['설향딸기', '금실딸기'], startDate: new Date(), confidence: 95 },
            { id: 'trend-3', name: '건강 주스 트렌드', category: 'preference', direction: 'up', strength: 7, description: '착즙용 채소/과일 수요 증가', affectedProducts: ['케일', '당근', '셀러리'], startDate: new Date(Date.now() - 60 * 86400000), confidence: 88 }
        ];
    }

    private createPredictions(): DemandPrediction[] {
        return [
            { id: 'pred-1', product: '유기농 상추', period: '다음 주', predictedDemand: 25000, confidence: 94, factors: ['계절', '프로모션', '트렌드'], priceRecommendation: 4.5, productionRecommendation: 27000, createdAt: new Date() },
            { id: 'pred-2', product: '딸기', period: '다음 주', predictedDemand: 15000, confidence: 92, factors: ['시즌', '가격', '경쟁'], priceRecommendation: 12, productionRecommendation: 16000, createdAt: new Date() },
            { id: 'pred-3', product: '방울토마토', period: '다음 주', predictedDemand: 18000, confidence: 91, factors: ['날씨', '건강트렌드'], priceRecommendation: 6, productionRecommendation: 19000, createdAt: new Date() }
        ];
    }

    private createCampaigns(): MarketingCampaign[] {
        return [
            { id: 'camp-1', name: '겨울 딸기 페스티벌', targetSegment: '프리미엄 헬스', channel: 'app', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 30 * 86400000), budget: 50000, spent: 15000, reach: 45000, engagement: 12.5, conversions: 2800, roi: 185 },
            { id: 'camp-2', name: '에코 포장 리뉴얼', targetSegment: '에코 의식형', channel: 'social', status: 'active', startDate: new Date(), endDate: new Date(Date.now() + 14 * 86400000), budget: 20000, spent: 8000, reach: 120000, engagement: 8.2, conversions: 4500, roi: 220 }
        ];
    }

    private createFeedback(): ConsumerFeedback[] {
        return [
            { id: 'fb-1', consumerId: 'consumer-1', type: 'review', product: '유기농 상추', rating: 5, sentiment: 'positive', content: '정말 싱싱하고 맛있어요!', keywords: ['싱싱', '맛있음', '배송빠름'], actionable: false, resolved: true, date: new Date() },
            { id: 'fb-2', consumerId: 'consumer-2', type: 'suggestion', product: '딸기', rating: 4, sentiment: 'positive', content: '소포장 옵션이 있으면 좋겠어요', keywords: ['소포장', '1인가구'], actionable: true, resolved: false, date: new Date() }
        ];
    }

    getSystem(): ConsumerAnalyticsSystem { return this.system; }
    getMetrics(): AnalyticsMetrics { return this.system.metrics; }
    getSegments(): ConsumerSegment[] { return this.system.segments; }
    getTrends(): MarketTrend[] { return this.system.trends; }
    getPredictions(): DemandPrediction[] { return this.system.demandPredictions; }
}

const analyticsEngines: Map<string, ConsumerAnalyticsEngine> = new Map();
export function getConsumerAnalyticsEngine(farmId: string): ConsumerAnalyticsEngine {
    if (!analyticsEngines.has(farmId)) analyticsEngines.set(farmId, new ConsumerAnalyticsEngine(farmId));
    return analyticsEngines.get(farmId)!;
}
