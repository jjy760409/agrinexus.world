// AgriNexus World OS - AI 자동 협상 시스템
// AI Auto-Negotiation Engine - 세계 최초 지능형 농산물 가격 협상 AI

// ============================================
// 타입 정의
// ============================================

export interface NegotiationSession {
    id: string;
    type: NegotiationType;
    status: NegotiationStatus;
    parties: NegotiationParty[];
    subject: NegotiationSubject;
    rounds: NegotiationRound[];
    constraints: NegotiationConstraint[];
    aiAgent: AIAgent;
    outcome?: NegotiationOutcome;
    startedAt: Date;
    completedAt?: Date;
    deadline: Date;
}

export type NegotiationType =
    | 'price'           // 가격 협상
    | 'contract'        // 계약 조건
    | 'bulk_order'      // 대량 주문
    | 'partnership'     // 파트너십
    | 'dispute'         // 분쟁 해결
    | 'auction';        // 경매

export type NegotiationStatus =
    | 'pending'
    | 'active'
    | 'counter_offer'
    | 'review'
    | 'accepted'
    | 'rejected'
    | 'timeout'
    | 'cancelled';

export interface NegotiationParty {
    id: string;
    name: string;
    type: PartyType;
    role: 'buyer' | 'seller' | 'mediator';
    preferences: PartyPreferences;
    reputation: ReputationScore;
    history: TransactionHistory;
    aiAssisted: boolean;
    currentOffer?: Offer;
}

export type PartyType = 'farm' | 'distributor' | 'retailer' | 'consumer' | 'platform';

export interface PartyPreferences {
    priceRange: { min: number; max: number };
    quantityRange: { min: number; max: number };
    deliveryTimeframe: { earliest: Date; latest: Date };
    qualityRequirements: QualitySpec[];
    paymentTerms: PaymentTerm[];
    priority: { price: number; quality: number; delivery: number; relationship: number }; // 0-1
}

export interface QualitySpec {
    metric: string;
    minValue: number;
    maxValue?: number;
    unit: string;
    weight: number;     // 중요도 0-1
}

export interface PaymentTerm {
    type: 'upfront' | 'on_delivery' | 'net_30' | 'net_60' | 'escrow' | 'installment';
    percentage: number;
    dueDate?: Date;
}

export interface ReputationScore {
    overall: number;        // 0-100
    reliability: number;
    quality: number;
    communication: number;
    fairness: number;
    totalTransactions: number;
    successRate: number;
}

export interface TransactionHistory {
    totalTransactions: number;
    totalVolume: number;
    averageOrderValue: number;
    successfulNegotiations: number;
    averageDiscount: number;
    preferredProducts: string[];
    preferredPaymentTerms: string[];
}

// ============================================
// 협상 주제 및 제안
// ============================================

export interface NegotiationSubject {
    productId: string;
    productName: string;
    productCategory: string;
    basePrice: number;
    marketPrice: number;
    quantity: number;
    unit: string;
    quality: QualityGrade;
    specifications: ProductSpec[];
    availability: AvailabilityInfo;
}

export interface ProductSpec {
    name: string;
    value: string | number;
    certified: boolean;
}

export type QualityGrade = 'A' | 'B' | 'C' | 'premium' | 'organic' | 'special';

export interface AvailabilityInfo {
    stock: number;
    harvestDate: Date;
    expiryDate: Date;
    leadTime: number;       // days
    minOrder: number;
    maxOrder: number;
}

export interface Offer {
    id: string;
    partyId: string;
    roundNumber: number;
    price: number;
    quantity: number;
    deliveryDate: Date;
    paymentTerms: PaymentTerm[];
    conditions: OfferCondition[];
    validUntil: Date;
    confidence: number;     // AI 신뢰도 0-1
    reasoning?: string;
    timestamp: Date;
}

export interface OfferCondition {
    type: 'quality_guarantee' | 'return_policy' | 'exclusivity' | 'volume_discount' | 'loyalty_bonus';
    description: string;
    value?: number;
    accepted: boolean;
}

// ============================================
// 협상 라운드 및 결과
// ============================================

export interface NegotiationRound {
    number: number;
    offers: Offer[];
    analysis: RoundAnalysis;
    aiRecommendation: AIRecommendation;
    duration: number;       // seconds
    startedAt: Date;
    endedAt?: Date;
}

export interface RoundAnalysis {
    priceGap: number;
    convergenceRate: number;    // 수렴 속도
    sentiment: { buyer: number; seller: number };  // -1 to 1
    criticalIssues: string[];
    progressScore: number;      // 0-100
}

export interface AIRecommendation {
    action: RecommendedAction;
    suggestedOffer?: Partial<Offer>;
    rationale: string[];
    confidence: number;
    alternativeActions: { action: RecommendedAction; probability: number }[];
    riskAssessment: RiskAssessment;
}

export type RecommendedAction =
    | 'accept'
    | 'counter'
    | 'hold'
    | 'concede'
    | 'escalate'
    | 'walk_away'
    | 'split_difference';

export interface RiskAssessment {
    overall: 'low' | 'medium' | 'high';
    factors: { factor: string; level: string; mitigation: string }[];
    probabilityOfSuccess: number;
    expectedValue: number;
}

export interface NegotiationOutcome {
    status: 'agreement' | 'no_deal' | 'partial' | 'pending_approval';
    finalOffer?: Offer;
    savings: number;            // 절감액
    savingsPercentage: number;
    satisfaction: { buyer: number; seller: number };
    contractGenerated: boolean;
    contractId?: string;
    nextSteps: string[];
}

export interface NegotiationConstraint {
    type: 'price_floor' | 'price_ceiling' | 'min_quantity' | 'max_quantity' | 'deadline' | 'quality';
    value: number;
    hard: boolean;              // 절대적 제약 여부
    penalty?: number;           // 위반 시 페널티
}

// ============================================
// AI 에이전트
// ============================================

export interface AIAgent {
    id: string;
    name: string;
    version: string;
    personality: AIPersonality;
    strategy: NegotiationStrategy;
    learningEnabled: boolean;
    performance: AIPerformance;
}

export interface AIPersonality {
    assertiveness: number;      // 0-1 (passive - aggressive)
    flexibility: number;        // 0-1 (rigid - adaptable)
    riskTolerance: number;      // 0-1 (conservative - risk-seeking)
    empathy: number;            // 0-1 (cold - warm)
    patience: number;           // 0-1 (impulsive - patient)
}

export type NegotiationStrategy =
    | 'collaborative'   // 상생 추구
    | 'competitive'     // 최대 이익
    | 'compromising'    // 빠른 합의
    | 'accommodating'   // 관계 중시
    | 'avoiding'        // 리스크 회피
    | 'adaptive';       // 상대 반응 적응

export interface AIPerformance {
    totalNegotiations: number;
    successRate: number;
    averageSavings: number;
    averageRounds: number;
    satisfactionScore: number;
    learningProgress: number;
}

// ============================================
// AI 협상 엔진
// ============================================

export class AINegotiationEngine {
    private sessions: Map<string, NegotiationSession> = new Map();
    private agents: Map<string, AIAgent> = new Map();
    private marketIntelligence: MarketIntelligence;

    constructor() {
        this.initializeAgents();
        this.marketIntelligence = this.initializeMarketIntelligence();
    }

    private initializeAgents(): void {
        const defaultAgent: AIAgent = {
            id: 'agent-default',
            name: 'AgriNexus Negotiator',
            version: '2.0.0',
            personality: {
                assertiveness: 0.6,
                flexibility: 0.7,
                riskTolerance: 0.4,
                empathy: 0.7,
                patience: 0.8
            },
            strategy: 'adaptive',
            learningEnabled: true,
            performance: {
                totalNegotiations: 1500,
                successRate: 92,
                averageSavings: 8.5,
                averageRounds: 3.2,
                satisfactionScore: 88,
                learningProgress: 85
            }
        };
        this.agents.set(defaultAgent.id, defaultAgent);
    }

    private initializeMarketIntelligence(): MarketIntelligence {
        return {
            priceHistory: new Map(),
            seasonalFactors: new Map([
                ['strawberry', [0.8, 0.7, 0.9, 1.0, 1.2, 1.1, 0.9, 0.8, 0.9, 1.0, 1.1, 1.3]],
                ['tomato', [1.1, 1.0, 0.9, 0.8, 0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.2]]
            ]),
            competitorPrices: new Map(),
            demandForecast: new Map(),
            supplyForecast: new Map()
        };
    }

    // 협상 세션 생성
    createSession(config: CreateSessionConfig): NegotiationSession {
        const agent = this.agents.get('agent-default')!;

        const session: NegotiationSession = {
            id: `neg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            type: config.type,
            status: 'pending',
            parties: config.parties,
            subject: config.subject,
            rounds: [],
            constraints: config.constraints || [],
            aiAgent: agent,
            startedAt: new Date(),
            deadline: config.deadline || new Date(Date.now() + 86400000) // 24시간 후
        };

        this.sessions.set(session.id, session);
        return session;
    }

    // 협상 시작
    startNegotiation(sessionId: string): NegotiationSession {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        session.status = 'active';

        // 첫 번째 라운드 시작
        const round = this.startNewRound(session);
        session.rounds.push(round);

        return session;
    }

    private startNewRound(session: NegotiationSession): NegotiationRound {
        const roundNumber = session.rounds.length + 1;

        return {
            number: roundNumber,
            offers: [],
            analysis: {
                priceGap: 0,
                convergenceRate: 0,
                sentiment: { buyer: 0, seller: 0 },
                criticalIssues: [],
                progressScore: 0
            },
            aiRecommendation: this.generateRecommendation(session, roundNumber),
            duration: 0,
            startedAt: new Date()
        };
    }

    // AI 추천 생성
    private generateRecommendation(session: NegotiationSession, roundNumber: number): AIRecommendation {
        const buyer = session.parties.find(p => p.role === 'buyer');
        const seller = session.parties.find(p => p.role === 'seller');

        if (!buyer || !seller) {
            return this.defaultRecommendation();
        }

        const marketPrice = session.subject.marketPrice;
        const buyerMax = buyer.preferences.priceRange.max;
        const sellerMin = seller.preferences.priceRange.min;

        // 시장 분석 기반 적정가 계산
        const fairPrice = this.calculateFairPrice(session.subject, buyer, seller);
        const priceGap = ((sellerMin - buyerMax) / marketPrice) * 100;

        let action: RecommendedAction;
        let suggestedPrice: number;
        const rationale: string[] = [];

        if (roundNumber === 1) {
            // 첫 라운드: 시작 가격 제안
            suggestedPrice = buyer.role === 'buyer'
                ? fairPrice * 0.92   // 구매자: 8% 할인 시작
                : fairPrice * 1.05;  // 판매자: 5% 프리미엄
            action = 'counter';
            rationale.push('첫 라운드 - 협상 여지를 남긴 합리적 시작가 제안');
        } else if (priceGap > 20) {
            action = 'hold';
            suggestedPrice = fairPrice;
            rationale.push('가격 차이가 큼 - 추가 정보 수집 필요');
        } else if (priceGap < 5) {
            action = 'split_difference';
            suggestedPrice = (buyerMax + sellerMin) / 2;
            rationale.push('합의 근접 - 중간값 제안으로 빠른 마무리');
        } else {
            action = 'concede';
            suggestedPrice = fairPrice * (1 - roundNumber * 0.02);
            rationale.push('점진적 양보 - 상대방 신뢰 구축');
        }

        // 위험 평가
        const riskAssessment: RiskAssessment = {
            overall: priceGap > 15 ? 'high' : priceGap > 8 ? 'medium' : 'low',
            factors: [
                { factor: '가격 차이', level: priceGap > 10 ? 'high' : 'low', mitigation: '단계적 양보 전략' },
                { factor: '시간 압박', level: 'medium', mitigation: '빠른 대응' }
            ],
            probabilityOfSuccess: Math.max(20, 95 - priceGap * 3),
            expectedValue: suggestedPrice * session.subject.quantity
        };

        return {
            action,
            suggestedOffer: {
                price: suggestedPrice,
                quantity: session.subject.quantity,
                deliveryDate: new Date(Date.now() + 7 * 86400000),
                confidence: 0.8 + Math.random() * 0.15
            },
            rationale,
            confidence: 0.75 + Math.random() * 0.2,
            alternativeActions: [
                { action: 'hold', probability: 0.2 },
                { action: 'walk_away', probability: 0.05 }
            ],
            riskAssessment
        };
    }

    private calculateFairPrice(subject: NegotiationSubject, buyer: NegotiationParty, seller: NegotiationParty): number {
        let fairPrice = subject.marketPrice;

        // 품질 프리미엄
        if (subject.quality === 'premium' || subject.quality === 'organic') {
            fairPrice *= 1.15;
        }

        // 수량 할인
        if (subject.quantity > 100) fairPrice *= 0.95;
        if (subject.quantity > 1000) fairPrice *= 0.90;

        // 평판 조정
        const sellerReliability = seller.reputation.reliability / 100;
        fairPrice *= (0.9 + sellerReliability * 0.2);

        // 시즌 요인
        const month = new Date().getMonth();
        const seasonalFactors = this.marketIntelligence.seasonalFactors.get(subject.productCategory);
        if (seasonalFactors) {
            fairPrice *= seasonalFactors[month];
        }

        return fairPrice;
    }

    private defaultRecommendation(): AIRecommendation {
        return {
            action: 'hold',
            rationale: ['정보 부족 - 대기'],
            confidence: 0.5,
            alternativeActions: [],
            riskAssessment: {
                overall: 'medium',
                factors: [],
                probabilityOfSuccess: 50,
                expectedValue: 0
            }
        };
    }

    // 제안 제출
    submitOffer(sessionId: string, partyId: string, offer: Partial<Offer>): Offer {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        const currentRound = session.rounds[session.rounds.length - 1];

        const fullOffer: Offer = {
            id: `offer-${Date.now()}`,
            partyId,
            roundNumber: currentRound.number,
            price: offer.price || session.subject.basePrice,
            quantity: offer.quantity || session.subject.quantity,
            deliveryDate: offer.deliveryDate || new Date(Date.now() + 7 * 86400000),
            paymentTerms: offer.paymentTerms || [{ type: 'on_delivery', percentage: 100 }],
            conditions: offer.conditions || [],
            validUntil: new Date(Date.now() + 3600000), // 1시간
            confidence: offer.confidence || 0.8,
            reasoning: offer.reasoning,
            timestamp: new Date()
        };

        currentRound.offers.push(fullOffer);

        // 분석 업데이트
        this.updateRoundAnalysis(session, currentRound);

        // 자동 응답 확인
        if (this.shouldAutoRespond(session, fullOffer)) {
            const aiResponse = this.generateAIResponse(session, fullOffer);
            currentRound.offers.push(aiResponse);
        }

        return fullOffer;
    }

    private updateRoundAnalysis(session: NegotiationSession, round: NegotiationRound): void {
        const offers = round.offers;
        if (offers.length < 2) return;

        const buyerOffer = offers.find(o => {
            const party = session.parties.find(p => p.id === o.partyId);
            return party?.role === 'buyer';
        });
        const sellerOffer = offers.find(o => {
            const party = session.parties.find(p => p.id === o.partyId);
            return party?.role === 'seller';
        });

        if (buyerOffer && sellerOffer) {
            round.analysis.priceGap = ((sellerOffer.price - buyerOffer.price) / session.subject.marketPrice) * 100;
        }

        // 수렴 속도 계산
        if (session.rounds.length > 1) {
            const prevRound = session.rounds[session.rounds.length - 2];
            const prevGap = prevRound.analysis.priceGap;
            round.analysis.convergenceRate = (prevGap - round.analysis.priceGap) / prevGap;
        }

        round.analysis.progressScore = Math.max(0, 100 - round.analysis.priceGap * 5);
    }

    private shouldAutoRespond(session: NegotiationSession, offer: Offer): boolean {
        const party = session.parties.find(p => p.id === offer.partyId);
        const oppositeParty = session.parties.find(p => p.role !== party?.role);
        return oppositeParty?.aiAssisted || false;
    }

    private generateAIResponse(session: NegotiationSession, incomingOffer: Offer): Offer {
        const recommendation = this.generateRecommendation(session, session.rounds.length);

        return {
            id: `offer-ai-${Date.now()}`,
            partyId: 'ai-agent',
            roundNumber: session.rounds.length,
            price: recommendation.suggestedOffer?.price || incomingOffer.price * 0.98,
            quantity: incomingOffer.quantity,
            deliveryDate: recommendation.suggestedOffer?.deliveryDate || incomingOffer.deliveryDate,
            paymentTerms: [{ type: 'on_delivery', percentage: 100 }],
            conditions: [],
            validUntil: new Date(Date.now() + 3600000),
            confidence: recommendation.confidence,
            reasoning: recommendation.rationale.join('; '),
            timestamp: new Date()
        };
    }

    // 협상 수락
    acceptNegotiation(sessionId: string, partyId: string): NegotiationOutcome {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        const currentRound = session.rounds[session.rounds.length - 1];
        const lastOffer = currentRound.offers[currentRound.offers.length - 1];

        session.status = 'accepted';
        session.completedAt = new Date();

        const outcome: NegotiationOutcome = {
            status: 'agreement',
            finalOffer: lastOffer,
            savings: (session.subject.marketPrice - lastOffer.price) * lastOffer.quantity,
            savingsPercentage: ((session.subject.marketPrice - lastOffer.price) / session.subject.marketPrice) * 100,
            satisfaction: { buyer: 85, seller: 80 },
            contractGenerated: true,
            contractId: `contract-${Date.now()}`,
            nextSteps: ['계약서 검토', '결제 진행', '배송 일정 확정']
        };

        session.outcome = outcome;
        return outcome;
    }

    // 세션 조회
    getSession(sessionId: string): NegotiationSession | undefined {
        return this.sessions.get(sessionId);
    }

    // 모든 세션 조회
    getAllSessions(): NegotiationSession[] {
        return Array.from(this.sessions.values());
    }

    // AI 에이전트 조회
    getAIAgent(agentId: string): AIAgent | undefined {
        return this.agents.get(agentId);
    }

    // 협상 통계
    getNegotiationStats(): NegotiationStats {
        const sessions = Array.from(this.sessions.values());
        const completed = sessions.filter(s => s.status === 'accepted' || s.status === 'rejected');

        return {
            totalSessions: sessions.length,
            activeSessions: sessions.filter(s => s.status === 'active').length,
            successRate: completed.length > 0
                ? (completed.filter(s => s.status === 'accepted').length / completed.length) * 100
                : 0,
            averageSavings: sessions
                .filter(s => s.outcome)
                .reduce((sum, s) => sum + (s.outcome?.savingsPercentage || 0), 0) / Math.max(1, sessions.filter(s => s.outcome).length),
            averageRounds: sessions.reduce((sum, s) => sum + s.rounds.length, 0) / Math.max(1, sessions.length),
            totalValueNegotiated: sessions.reduce((sum, s) => sum + s.subject.basePrice * s.subject.quantity, 0)
        };
    }
}

export interface CreateSessionConfig {
    type: NegotiationType;
    parties: NegotiationParty[];
    subject: NegotiationSubject;
    constraints?: NegotiationConstraint[];
    deadline?: Date;
}

export interface MarketIntelligence {
    priceHistory: Map<string, { date: Date; price: number }[]>;
    seasonalFactors: Map<string, number[]>;      // 12개월 계수
    competitorPrices: Map<string, number>;
    demandForecast: Map<string, number>;
    supplyForecast: Map<string, number>;
}

export interface NegotiationStats {
    totalSessions: number;
    activeSessions: number;
    successRate: number;
    averageSavings: number;
    averageRounds: number;
    totalValueNegotiated: number;
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let negotiationEngine: AINegotiationEngine | null = null;

export function getAINegotiationEngine(): AINegotiationEngine {
    if (!negotiationEngine) {
        negotiationEngine = new AINegotiationEngine();
    }
    return negotiationEngine;
}

// 협상 상태 아이콘
export const NEGOTIATION_STATUS_ICONS: Record<NegotiationStatus, string> = {
    pending: '⏳',
    active: '💬',
    counter_offer: '🔄',
    review: '👀',
    accepted: '✅',
    rejected: '❌',
    timeout: '⏰',
    cancelled: '🚫'
};

// 추천 행동 아이콘
export const ACTION_ICONS: Record<RecommendedAction, string> = {
    accept: '✅',
    counter: '🔄',
    hold: '⏸️',
    concede: '🤝',
    escalate: '⬆️',
    walk_away: '🚪',
    split_difference: '⚖️'
};
