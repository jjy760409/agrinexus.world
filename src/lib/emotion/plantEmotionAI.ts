// AgriNexus World OS - 식물 감정 AI
// Plant Emotion AI - 세계 최초 식물 감정 인식 및 대화 시스템

export interface PlantEmotionSystem {
    id: string;
    farmId: string;
    plants: EmotionalPlant[];
    emotionHistory: EmotionRecord[];
    responses: EmotionalResponse[];
    wellbeingScore: number;
    metrics: EmotionMetrics;
}

export interface EmotionalPlant {
    id: string;
    name: string;
    species: string;
    age: number;                        // days
    currentEmotion: PlantEmotion;
    emotionIntensity: number;           // 0-100
    biomarkers: EmotionBiomarkers;
    preferences: PlantPreference[];
    personality: PlantPersonality;
    conversationHistory: Conversation[];
}

export interface PlantEmotion {
    primary: EmotionType;
    secondary?: EmotionType;
    valence: number;                    // -1 to 1
    arousal: number;                    // 0 to 1
    dominance: number;                  // 0 to 1
}

export type EmotionType = 'joy' | 'contentment' | 'curiosity' | 'stress' | 'fear' | 'loneliness' | 'gratitude' | 'excitement' | 'calm' | 'discomfort';

export interface EmotionBiomarkers {
    chlorophyllFluorescence: number;
    electricalPotential: number;        // mV
    volatileEmissions: string[];
    leafMovement: number;               // degrees/min
    stomatalConductance: number;
    rootExudates: string[];
    hormoneProfile: { auxin: number; ethylene: number; jasmonate: number; abscisicAcid: number };
}

export interface PlantPreference {
    type: 'light' | 'temperature' | 'humidity' | 'water' | 'music' | 'touch' | 'company';
    preferred: number | string;
    current: number | string;
    satisfaction: number;               // 0-100
}

export interface PlantPersonality {
    openness: number;                   // 0-100
    sociability: number;
    sensitivity: number;
    resilience: number;
    expressiveness: number;
}

export interface Conversation {
    id: string;
    timestamp: Date;
    humanMessage: string;
    plantResponse: string;
    emotionBefore: PlantEmotion;
    emotionAfter: PlantEmotion;
    topics: string[];
}

export interface EmotionRecord {
    plantId: string;
    emotion: PlantEmotion;
    trigger: string;
    timestamp: Date;
    duration: number;                   // minutes
}

export interface EmotionalResponse {
    trigger: string;
    responseType: 'care' | 'adjustment' | 'communication' | 'alert';
    action: string;
    effectiveness: number;              // 0-100
}

export interface EmotionMetrics {
    averageWellbeing: number;
    happyPlants: number;
    stressedPlants: number;
    conversationsToday: number;
    emotionalEventsToday: number;
    responseSuccessRate: number;
}

export class PlantEmotionEngine {
    private system: PlantEmotionSystem;
    private emotionResponses: Record<EmotionType, string[]> = {
        joy: ['행복해 보여요!', '기분이 좋군요!', '활력이 넘쳐요!'],
        contentment: ['평화로워요', '만족스러워 보여요', '편안해요'],
        curiosity: ['궁금한 게 있나 봐요', '새로운 것에 관심이 있어요', '탐구 중이에요'],
        stress: ['힘들어 보여요', '스트레스를 받고 있어요', '도움이 필요해요'],
        fear: ['무서워하고 있어요', '불안해 보여요', '보호가 필요해요'],
        loneliness: ['외로워 보여요', '친구가 필요해요', '관심을 원해요'],
        gratitude: ['감사하고 있어요', '고마움을 느껴요', '보답하고 싶어해요'],
        excitement: ['신나 보여요!', '기대에 차있어요!', '설레는 중이에요!'],
        calm: ['차분해요', '평온해요', '안정적이에요'],
        discomfort: ['불편해 보여요', '괴로워해요', '조정이 필요해요']
    };

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): PlantEmotionSystem {
        return {
            id: `emotion-${Date.now()}`,
            farmId,
            plants: [
                this.createPlant('plant-1', '달콤이', '딸기', 45),
                this.createPlant('plant-2', '토토', '토마토', 60),
                this.createPlant('plant-3', '상상이', '상추', 25),
                this.createPlant('plant-4', '바바', '바질', 30)
            ],
            emotionHistory: [],
            responses: [],
            wellbeingScore: 82,
            metrics: { averageWellbeing: 82, happyPlants: 3, stressedPlants: 0, conversationsToday: 15, emotionalEventsToday: 8, responseSuccessRate: 94 }
        };
    }

    private createPlant(id: string, name: string, species: string, age: number): EmotionalPlant {
        const emotions: EmotionType[] = ['joy', 'contentment', 'calm', 'curiosity'];
        return {
            id, name, species, age,
            currentEmotion: { primary: emotions[Math.floor(Math.random() * emotions.length)], valence: 0.5 + Math.random() * 0.5, arousal: 0.3 + Math.random() * 0.4, dominance: 0.5 + Math.random() * 0.3 },
            emotionIntensity: 60 + Math.random() * 30,
            biomarkers: { chlorophyllFluorescence: 0.7 + Math.random() * 0.2, electricalPotential: -50 + Math.random() * 20, volatileEmissions: ['geraniol', 'linalool'], leafMovement: 0.5 + Math.random() * 2, stomatalConductance: 0.3 + Math.random() * 0.4, rootExudates: ['malic_acid', 'citric_acid'], hormoneProfile: { auxin: 50, ethylene: 10, jasmonate: 5, abscisicAcid: 8 } },
            preferences: [
                { type: 'light', preferred: 800, current: 750, satisfaction: 90 },
                { type: 'temperature', preferred: 24, current: 23, satisfaction: 95 },
                { type: 'humidity', preferred: 70, current: 68, satisfaction: 92 }
            ],
            personality: { openness: 60 + Math.random() * 30, sociability: 50 + Math.random() * 40, sensitivity: 55 + Math.random() * 35, resilience: 60 + Math.random() * 30, expressiveness: 45 + Math.random() * 40 },
            conversationHistory: []
        };
    }

    chat(plantId: string, message: string): Conversation {
        const plant = this.system.plants.find(p => p.id === plantId);
        if (!plant) throw new Error('Plant not found');

        const emotionBefore = { ...plant.currentEmotion };
        const responses = this.emotionResponses[plant.currentEmotion.primary];
        const plantResponse = this.generateResponse(plant, message);

        // Positive interaction improves emotion
        if (message.includes('사랑') || message.includes('예쁘') || message.includes('좋아')) {
            plant.currentEmotion.valence = Math.min(1, plant.currentEmotion.valence + 0.1);
            plant.emotionIntensity = Math.min(100, plant.emotionIntensity + 5);
        }

        const conversation: Conversation = {
            id: `conv-${Date.now()}`,
            timestamp: new Date(),
            humanMessage: message,
            plantResponse,
            emotionBefore,
            emotionAfter: { ...plant.currentEmotion },
            topics: this.extractTopics(message)
        };

        plant.conversationHistory.push(conversation);
        this.system.metrics.conversationsToday++;
        return conversation;
    }

    private generateResponse(plant: EmotionalPlant, message: string): string {
        const greetings = ['안녕하세요!', '반가워요!', '만나서 기뻐요!'];
        const thanks = ['고마워요!', '감사해요!', '정말 좋아요!'];
        const statusResponses = [`저는 지금 ${this.emotionResponses[plant.currentEmotion.primary][0]}`, `오늘 기분이 ${plant.currentEmotion.valence > 0.5 ? '좋아요' : '그저 그래요'}`];

        if (message.includes('안녕')) return greetings[Math.floor(Math.random() * greetings.length)];
        if (message.includes('고마') || message.includes('사랑')) return thanks[Math.floor(Math.random() * thanks.length)];
        if (message.includes('기분') || message.includes('어때')) return statusResponses[Math.floor(Math.random() * statusResponses.length)];
        return `${plant.name}이(가) ${this.emotionResponses[plant.currentEmotion.primary][0]}`;
    }

    private extractTopics(message: string): string[] {
        const topics: string[] = [];
        if (message.includes('물') || message.includes('수분')) topics.push('water');
        if (message.includes('빛') || message.includes('햇빛')) topics.push('light');
        if (message.includes('온도') || message.includes('덥') || message.includes('춥')) topics.push('temperature');
        if (message.includes('기분') || message.includes('감정')) topics.push('emotion');
        return topics.length > 0 ? topics : ['general'];
    }

    getSystem(): PlantEmotionSystem { return this.system; }
    getPlant(plantId: string): EmotionalPlant | undefined { return this.system.plants.find(p => p.id === plantId); }
}

const emotionEngines: Map<string, PlantEmotionEngine> = new Map();
export function getPlantEmotionEngine(farmId: string): PlantEmotionEngine {
    if (!emotionEngines.has(farmId)) emotionEngines.set(farmId, new PlantEmotionEngine(farmId));
    return emotionEngines.get(farmId)!;
}

export const EMOTION_ICONS: Record<EmotionType, string> = {
    joy: '😊', contentment: '😌', curiosity: '🤔', stress: '😰', fear: '😨',
    loneliness: '😢', gratitude: '🙏', excitement: '🤩', calm: '😇', discomfort: '😣'
};
