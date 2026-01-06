// AgriNexus World OS - 신경 식물 인터페이스 (Neural Plant Interface)
// 세계 최초: 식물과 직접 대화하는 양방향 통신 시스템

// ============================================
// 타입 정의
// ============================================

export interface NeuralPlantInterface {
    plantId: string;
    connectionStatus: ConnectionStatus;
    electrodes: Electrode[];
    signalProcessor: SignalProcessor;
    translator: PlantLanguageTranslator;
    stimulator: PlantStimulator;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'calibrating' | 'active' | 'synced';

export interface Electrode {
    id: string;
    type: 'input' | 'output' | 'bidirectional';
    position: { x: number; y: number; z: number };
    impedance: number;          // kΩ
    signalQuality: number;      // 0-100
    plantPart: 'root' | 'stem' | 'leaf' | 'flower' | 'fruit';
}

export interface SignalProcessor {
    samplingRate: number;       // Hz
    resolution: number;         // bits
    noiseFloor: number;         // μV
    filters: SignalFilter[];
    bufferSize: number;         // samples
}

export interface SignalFilter {
    type: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
    frequency: number | [number, number];
    order: number;
}

export interface PlantLanguageTranslator {
    vocabulary: PlantWord[];
    grammar: PlantGrammar;
    emotionDetector: EmotionDetector;
    intentRecognizer: IntentRecognizer;
    responseGenerator: ResponseGenerator;
}

export interface PlantWord {
    id: string;
    korean: string;
    english: string;
    signalPattern: number[];
    frequency: number;          // Hz
    amplitude: number;          // μV
    context: string[];
    emotionalValence: number;   // -1 to 1
}

export interface PlantGrammar {
    sentencePatterns: SentencePattern[];
    modifiers: Modifier[];
    urgencyLevels: UrgencyLevel[];
}

export interface SentencePattern {
    type: 'statement' | 'request' | 'warning' | 'gratitude' | 'distress';
    structure: string[];
    examples: string[];
}

export interface Modifier {
    type: 'intensity' | 'time' | 'location' | 'target';
    signalModulation: string;
}

export interface UrgencyLevel {
    level: 1 | 2 | 3 | 4 | 5;
    frequencyMultiplier: number;
    amplitudeMultiplier: number;
    description: string;
}

export interface EmotionDetector {
    currentEmotion: PlantEmotion;
    emotionHistory: PlantEmotion[];
    moodTrend: 'improving' | 'stable' | 'declining';
}

export interface PlantEmotion {
    timestamp: Date;
    primary: PlantEmotionType;
    intensity: number;          // 0-100
    duration: number;           // seconds
    trigger?: string;
}

export type PlantEmotionType =
    | 'content'         // 만족
    | 'thriving'        // 번영
    | 'stressed'        // 스트레스
    | 'anxious'         // 불안
    | 'curious'         // 호기심
    | 'defensive'       // 방어
    | 'social'          // 사교적
    | 'dormant'         // 휴면
    | 'excited'         // 흥분
    | 'grateful';       // 감사

export interface IntentRecognizer {
    currentIntent: PlantIntent | null;
    confidence: number;
    alternatives: { intent: PlantIntent; probability: number }[];
}

export interface PlantIntent {
    action: 'request_water' | 'request_light' | 'request_nutrients' | 'report_pest' |
    'report_disease' | 'social_signal' | 'growth_update' | 'distress_call' |
    'gratitude' | 'curiosity' | 'territorial';
    urgency: number;
    details: Record<string, unknown>;
    timestamp: Date;
}

export interface ResponseGenerator {
    capabilities: ResponseCapability[];
    recentResponses: PlantResponse[];
}

export interface ResponseCapability {
    type: 'electrical' | 'chemical' | 'physical' | 'environmental';
    actions: string[];
}

export interface PlantResponse {
    timestamp: Date;
    type: string;
    message: string;
    plantReaction: string;
}

export interface PlantStimulator {
    modes: StimulationMode[];
    currentMode: StimulationMode | null;
    safetyLimits: SafetyLimits;
}

export interface StimulationMode {
    name: string;
    type: 'electrical' | 'light' | 'acoustic' | 'chemical';
    parameters: Record<string, number>;
    effect: string;
}

export interface SafetyLimits {
    maxVoltage: number;         // mV
    maxCurrent: number;         // μA
    maxDuration: number;        // seconds
    cooldownPeriod: number;     // seconds
}

// ============================================
// 식물 대화 시스템
// ============================================

export interface PlantConversation {
    plantId: string;
    plantName: string;
    species: string;
    messages: ConversationMessage[];
    relationship: PlantRelationship;
    lastInteraction: Date;
}

export interface ConversationMessage {
    id: string;
    timestamp: Date;
    sender: 'plant' | 'human' | 'system';
    originalSignal?: SignalData;
    translatedMessage: string;
    emotion?: PlantEmotionType;
    intent?: PlantIntent;
    confidence: number;
    reaction?: string;
}

export interface SignalData {
    channels: number[][];       // 채널별 신호 데이터
    frequency: number;
    amplitude: number;
    pattern: string;
}

export interface PlantRelationship {
    trustLevel: number;         // 0-100
    familiarity: number;        // 0-100
    communicationQuality: number;
    positiveInteractions: number;
    totalInteractions: number;
    specialBonds: string[];
    preferredLanguage: 'formal' | 'casual' | 'nurturing';
}

// ============================================
// 신경 인터페이스 엔진
// ============================================

export class NeuralPlantInterfaceEngine {
    private interfaces: Map<string, NeuralPlantInterface> = new Map();
    private conversations: Map<string, PlantConversation> = new Map();
    private vocabulary: PlantWord[] = [];

    constructor() {
        this.initializeVocabulary();
    }

    private initializeVocabulary(): void {
        // 식물 어휘 사전 초기화
        this.vocabulary = [
            // 기본 상태
            { id: 'w001', korean: '목이 마르다', english: 'thirsty', signalPattern: [1, 0, 1, 1, 0], frequency: 0.5, amplitude: 80, context: ['water', 'stress'], emotionalValence: -0.3 },
            { id: 'w002', korean: '배가 고프다', english: 'hungry', signalPattern: [0, 1, 1, 0, 1], frequency: 0.8, amplitude: 60, context: ['nutrient', 'growth'], emotionalValence: -0.2 },
            { id: 'w003', korean: '빛이 좋다', english: 'good light', signalPattern: [1, 1, 1, 0, 0], frequency: 1.2, amplitude: 90, context: ['light', 'happy'], emotionalValence: 0.8 },
            { id: 'w004', korean: '덥다', english: 'hot', signalPattern: [1, 0, 0, 1, 1], frequency: 0.6, amplitude: 100, context: ['temperature', 'stress'], emotionalValence: -0.5 },
            { id: 'w005', korean: '춥다', english: 'cold', signalPattern: [0, 0, 1, 1, 1], frequency: 0.4, amplitude: 70, context: ['temperature', 'stress'], emotionalValence: -0.4 },

            // 감정 표현
            { id: 'w006', korean: '행복하다', english: 'happy', signalPattern: [1, 1, 1, 1, 1], frequency: 1.5, amplitude: 50, context: ['emotion', 'positive'], emotionalValence: 0.9 },
            { id: 'w007', korean: '걱정된다', english: 'worried', signalPattern: [0, 1, 0, 1, 0], frequency: 0.3, amplitude: 120, context: ['emotion', 'negative'], emotionalValence: -0.6 },
            { id: 'w008', korean: '고맙다', english: 'thankful', signalPattern: [1, 0, 1, 0, 1], frequency: 2.0, amplitude: 40, context: ['emotion', 'positive'], emotionalValence: 0.95 },

            // 요청
            { id: 'w009', korean: '물 주세요', english: 'please water', signalPattern: [1, 1, 0, 1, 1], frequency: 0.7, amplitude: 85, context: ['request', 'water'], emotionalValence: -0.1 },
            { id: 'w010', korean: '도와주세요', english: 'help me', signalPattern: [1, 0, 0, 0, 1], frequency: 0.2, amplitude: 150, context: ['request', 'urgent'], emotionalValence: -0.8 },

            // 경고
            { id: 'w011', korean: '벌레가 있어요', english: 'bug detected', signalPattern: [0, 0, 0, 1, 0], frequency: 3.0, amplitude: 200, context: ['warning', 'pest'], emotionalValence: -0.7 },
            { id: 'w012', korean: '아파요', english: 'sick', signalPattern: [0, 1, 0, 0, 1], frequency: 0.1, amplitude: 180, context: ['warning', 'disease'], emotionalValence: -0.9 },

            // 사회적
            { id: 'w013', korean: '옆 친구가 아파요', english: 'neighbor is sick', signalPattern: [1, 0, 0, 1, 0], frequency: 1.0, amplitude: 70, context: ['social', 'warning'], emotionalValence: -0.4 },
            { id: 'w014', korean: '새 친구 반가워요', english: 'nice to meet you', signalPattern: [1, 1, 0, 0, 1], frequency: 1.8, amplitude: 55, context: ['social', 'positive'], emotionalValence: 0.7 },
        ];
    }

    // 식물에 연결
    async connectToPlant(plantId: string): Promise<NeuralPlantInterface> {
        console.log(`🌿 식물 ${plantId}에 연결 중...`);
        await this.simulateDelay(500);

        const electrodes: Electrode[] = [
            { id: 'e1', type: 'bidirectional', position: { x: 0, y: 50, z: 0 }, impedance: 50, signalQuality: 95, plantPart: 'stem' },
            { id: 'e2', type: 'input', position: { x: 10, y: 80, z: 5 }, impedance: 45, signalQuality: 92, plantPart: 'leaf' },
            { id: 'e3', type: 'input', position: { x: -10, y: 20, z: -5 }, impedance: 60, signalQuality: 88, plantPart: 'root' },
        ];

        const plantInterface: NeuralPlantInterface = {
            plantId,
            connectionStatus: 'active',
            electrodes,
            signalProcessor: {
                samplingRate: 1000,
                resolution: 24,
                noiseFloor: 0.5,
                filters: [
                    { type: 'lowpass', frequency: 100, order: 4 },
                    { type: 'notch', frequency: 60, order: 2 }
                ],
                bufferSize: 4096
            },
            translator: {
                vocabulary: this.vocabulary,
                grammar: {
                    sentencePatterns: [],
                    modifiers: [],
                    urgencyLevels: []
                },
                emotionDetector: {
                    currentEmotion: { timestamp: new Date(), primary: 'content', intensity: 70, duration: 0 },
                    emotionHistory: [],
                    moodTrend: 'stable'
                },
                intentRecognizer: {
                    currentIntent: null,
                    confidence: 0,
                    alternatives: []
                },
                responseGenerator: {
                    capabilities: [
                        { type: 'electrical', actions: ['gentle_pulse', 'rhythm_sync', 'wake_call'] },
                        { type: 'environmental', actions: ['adjust_light', 'adjust_temp', 'provide_water'] }
                    ],
                    recentResponses: []
                }
            },
            stimulator: {
                modes: [
                    { name: '부드러운 인사', type: 'electrical', parameters: { voltage: 5, duration: 100 }, effect: '인식과 친밀감 증가' },
                    { name: '영양 신호', type: 'electrical', parameters: { voltage: 10, duration: 200 }, effect: '영양 흡수 촉진' },
                    { name: '성장 촉진', type: 'electrical', parameters: { voltage: 15, duration: 500 }, effect: '세포 분열 활성화' }
                ],
                currentMode: null,
                safetyLimits: { maxVoltage: 50, maxCurrent: 100, maxDuration: 5000, cooldownPeriod: 60 }
            }
        };

        this.interfaces.set(plantId, plantInterface);

        // 대화 세션 초기화
        this.initializeConversation(plantId);

        return plantInterface;
    }

    private initializeConversation(plantId: string): void {
        const conversation: PlantConversation = {
            plantId,
            plantName: `Plant-${plantId.slice(-4)}`,
            species: '딸기',
            messages: [
                {
                    id: 'm1',
                    timestamp: new Date(),
                    sender: 'system',
                    translatedMessage: '🌿 신경 인터페이스 연결 완료. 식물과 대화를 시작할 수 있습니다.',
                    confidence: 1
                }
            ],
            relationship: {
                trustLevel: 50,
                familiarity: 30,
                communicationQuality: 85,
                positiveInteractions: 0,
                totalInteractions: 0,
                specialBonds: [],
                preferredLanguage: 'nurturing'
            },
            lastInteraction: new Date()
        };

        this.conversations.set(plantId, conversation);
    }

    // 식물 메시지 수신 및 번역
    async listenToPlant(plantId: string): Promise<ConversationMessage> {
        const plantInterface = this.interfaces.get(plantId);
        if (!plantInterface) {
            throw new Error('Plant not connected');
        }

        await this.simulateDelay(100);

        // 실시간 신호 분석 시뮬레이션
        const signalData = this.generatePlantSignal();
        const translated = this.translateSignal(signalData);
        const emotion = this.detectEmotion(signalData);
        const intent = this.recognizeIntent(signalData);

        const message: ConversationMessage = {
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
            sender: 'plant',
            originalSignal: signalData,
            translatedMessage: translated,
            emotion: emotion.primary,
            intent,
            confidence: 0.85 + Math.random() * 0.15
        };

        const conversation = this.conversations.get(plantId);
        if (conversation) {
            conversation.messages.push(message);
            conversation.lastInteraction = new Date();
        }

        return message;
    }

    // 식물에게 메시지 전송
    async speakToPlant(plantId: string, humanMessage: string): Promise<ConversationMessage> {
        const plantInterface = this.interfaces.get(plantId);
        if (!plantInterface) {
            throw new Error('Plant not connected');
        }

        const conversation = this.conversations.get(plantId);
        if (!conversation) {
            throw new Error('Conversation not initialized');
        }

        // 인간 메시지 기록
        const humanMsg: ConversationMessage = {
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
            sender: 'human',
            translatedMessage: humanMessage,
            confidence: 1
        };
        conversation.messages.push(humanMsg);

        await this.simulateDelay(200);

        // 식물의 반응 생성
        const response = this.generatePlantResponse(humanMessage, conversation.relationship);

        const plantMsg: ConversationMessage = {
            id: `msg-${Date.now() + 1}`,
            timestamp: new Date(),
            sender: 'plant',
            translatedMessage: response.message,
            emotion: response.emotion,
            confidence: 0.9,
            reaction: response.reaction
        };

        conversation.messages.push(plantMsg);
        conversation.relationship.totalInteractions++;
        if (response.positive) {
            conversation.relationship.positiveInteractions++;
            conversation.relationship.trustLevel = Math.min(100, conversation.relationship.trustLevel + 2);
            conversation.relationship.familiarity = Math.min(100, conversation.relationship.familiarity + 1);
        }
        conversation.lastInteraction = new Date();

        return plantMsg;
    }

    private generatePlantSignal(): SignalData {
        const channels: number[][] = [];
        for (let i = 0; i < 3; i++) {
            const channel: number[] = [];
            for (let j = 0; j < 100; j++) {
                channel.push(Math.random() * 200 - 100);
            }
            channels.push(channel);
        }

        return {
            channels,
            frequency: 0.1 + Math.random() * 3,
            amplitude: 20 + Math.random() * 180,
            pattern: this.vocabulary[Math.floor(Math.random() * this.vocabulary.length)].id
        };
    }

    private translateSignal(signal: SignalData): string {
        const messages = [
            '🌱 "지금 기분이 좋아요. 오늘 광량이 적절해요."',
            '💧 "조금 목이 마른 것 같아요. 물을 주시면 좋겠어요."',
            '🌡️ "온도가 딱 좋아요. 아주 편안해요."',
            '🌿 "새 잎이 나려고 해요! 에너지가 넘쳐요."',
            '😊 "관심 가져주셔서 고마워요. 더 열심히 자랄게요."',
            '🌸 "곧 꽃이 필 것 같아요. 설레요!"',
            '💪 "뿌리가 튼튼해지고 있어요. 힘이 나요."',
            '🌞 "아침 햇살이 정말 좋아요!"',
            '🤝 "옆에 있는 친구랑 뿌리로 대화했어요."',
            '😴 "조금 피곤해요. 휴식이 필요할 것 같아요."'
        ];

        return messages[Math.floor(Math.random() * messages.length)];
    }

    private detectEmotion(signal: SignalData): PlantEmotion {
        const emotions: PlantEmotionType[] = ['content', 'thriving', 'curious', 'excited', 'social', 'grateful'];
        const primary = emotions[Math.floor(Math.random() * emotions.length)];

        return {
            timestamp: new Date(),
            primary,
            intensity: 50 + Math.random() * 50,
            duration: Math.random() * 60
        };
    }

    private recognizeIntent(signal: SignalData): PlantIntent | undefined {
        const r = Math.random();
        if (r < 0.3) {
            return {
                action: 'growth_update',
                urgency: 1,
                details: { stage: 'vegetative', progress: 75 },
                timestamp: new Date()
            };
        } else if (r < 0.5) {
            return {
                action: 'gratitude',
                urgency: 1,
                details: { reason: 'care' },
                timestamp: new Date()
            };
        }
        return undefined;
    }

    private generatePlantResponse(humanMessage: string, relationship: PlantRelationship): { message: string; emotion: PlantEmotionType; reaction: string; positive: boolean } {
        const msg = humanMessage.toLowerCase();

        if (msg.includes('안녕') || msg.includes('hello')) {
            return {
                message: '🌿 "안녕하세요! 찾아주셔서 기뻐요. 오늘 하루도 화이팅!"',
                emotion: 'excited',
                reaction: '잎을 살짝 흔들며 반긴다',
                positive: true
            };
        }

        if (msg.includes('물') || msg.includes('water')) {
            return {
                message: '💧 "어머, 고마워요! 시원한 물이 뿌리에 닿으니 정말 좋아요. 힘이 나요!"',
                emotion: 'grateful',
                reaction: '잎이 싱그럽게 펴진다',
                positive: true
            };
        }

        if (msg.includes('어때') || msg.includes('기분')) {
            return {
                message: relationship.trustLevel > 70
                    ? '💚 "친구처럼 물어봐 주시니 정말 좋아요. 오늘은 아주 행복해요!"'
                    : '🌱 "괜찮아요. 조금 더 친해지면 더 많은 이야기를 해드릴게요."',
                emotion: 'content',
                reaction: relationship.trustLevel > 70 ? '기분 좋게 살랑거린다' : '조용히 관찰한다',
                positive: true
            };
        }

        if (msg.includes('사랑') || msg.includes('love') || msg.includes('예뻐')) {
            return {
                message: '🌸 "정말요? 저도 좋아해요! 더 예쁜 열매를 맺어서 보답할게요!"',
                emotion: 'thriving',
                reaction: '행복하게 광합성 활동이 증가한다',
                positive: true
            };
        }

        return {
            message: '🌿 "네, 알겠어요. 항상 지켜봐 주셔서 감사해요."',
            emotion: 'content',
            reaction: '차분하게 듣고 있다',
            positive: true
        };
    }

    // 대화 이력 조회
    getConversation(plantId: string): PlantConversation | undefined {
        return this.conversations.get(plantId);
    }

    // 관계 상태 조회
    getRelationship(plantId: string): PlantRelationship | undefined {
        return this.conversations.get(plantId)?.relationship;
    }

    private simulateDelay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let neuralInterfaceEngine: NeuralPlantInterfaceEngine | null = null;

export function getNeuralPlantInterfaceEngine(): NeuralPlantInterfaceEngine {
    if (!neuralInterfaceEngine) {
        neuralInterfaceEngine = new NeuralPlantInterfaceEngine();
    }
    return neuralInterfaceEngine;
}

// 감정 아이콘
export const PLANT_EMOTION_ICONS: Record<PlantEmotionType, string> = {
    content: '😊',
    thriving: '🌟',
    stressed: '😰',
    anxious: '😟',
    curious: '🤔',
    defensive: '🛡️',
    social: '🤝',
    dormant: '😴',
    excited: '🎉',
    grateful: '🙏'
};

// 감정 색상
export const PLANT_EMOTION_COLORS: Record<PlantEmotionType, string> = {
    content: '#10b981',
    thriving: '#fbbf24',
    stressed: '#f97316',
    anxious: '#ef4444',
    curious: '#8b5cf6',
    defensive: '#f59e0b',
    social: '#06b6d4',
    dormant: '#6b7280',
    excited: '#ec4899',
    grateful: '#14b8a6'
};
