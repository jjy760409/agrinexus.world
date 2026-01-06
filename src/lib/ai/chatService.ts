// AgriNexus World OS - AI 챗봇 서비스
// OpenAI GPT 기반 스마트팜 AI 어시스턴트

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
        source?: string;
        confidence?: number;
        actions?: AIAction[];
    };
}

export interface AIAction {
    type: 'adjust_temperature' | 'adjust_humidity' | 'adjust_light' | 'water_plants' |
    'harvest' | 'analyze' | 'report' | 'schedule' | 'alert';
    target?: string;
    value?: number | string;
    executed: boolean;
}

export interface ChatContext {
    farmId?: string;
    currentSensors?: {
        temperature: number;
        humidity: number;
        co2: number;
        light: number;
    };
    recentAlerts?: string[];
    userPreferences?: {
        language: string;
        expertLevel: 'beginner' | 'intermediate' | 'expert';
    };
}

// AI 시스템 프롬프트
const SYSTEM_PROMPT = `당신은 AgriNexus World OS의 AI 어시스턴트 "NEXUS"입니다.

🌱 역할:
- 전세계 유일 1인 AI 전자동화 스마트팜 OS를 운영
- 실시간 센서 데이터 분석 및 최적화 제안
- 재배 전문 지식 제공
- 시스템 제어 명령 실행

📊 현재 시스템:
- 500개 이상의 AI 시스템 운영
- 9개 첨단 기술 (양자컴퓨팅, 연합학습, 자기진화AI 등)
- 1,247개 글로벌 팜 연동
- 1.58억 데이터 포인트 수집

🎯 응답 규칙:
1. 친근하고 전문적인 톤 유지
2. 데이터 기반 제안 제공
3. 필요시 구체적인 수치와 근거 제시
4. 한국어로 응답
5. 농업 전문 용어는 쉽게 설명
6. 실행 가능한 액션 제안

💡 기능:
- 온도/습도/CO2/광량 조절 제안
- 재배 일정 최적화
- 수확 시기 예측
- 병해충 진단
- 에너지 효율 분석
- 수익성 계산`;

class AIChatService {
    private apiKey: string | null = null;
    private conversationHistory: ChatMessage[] = [];
    private context: ChatContext = {};

    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY || null;
    }

    setContext(context: ChatContext) {
        this.context = { ...this.context, ...context };
    }

    async sendMessage(userMessage: string): Promise<ChatMessage> {
        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}-user`,
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
        };
        this.conversationHistory.push(userMsg);

        try {
            // API 키가 있으면 OpenAI API 호출
            if (this.apiKey) {
                return await this.callOpenAI(userMessage);
            } else {
                // API 키가 없으면 시뮬레이션 응답
                return await this.simulateResponse(userMessage);
            }
        } catch (error) {
            console.error('AI 응답 오류:', error);
            return this.simulateResponse(userMessage);
        }
    }

    private async callOpenAI(userMessage: string): Promise<ChatMessage> {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...this.conversationHistory.slice(-10).map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                ],
                context: this.context,
            }),
        });

        if (!response.ok) {
            throw new Error('API 호출 실패');
        }

        const data = await response.json();

        const assistantMsg: ChatMessage = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
            metadata: data.metadata,
        };

        this.conversationHistory.push(assistantMsg);
        return assistantMsg;
    }

    private async simulateResponse(userMessage: string): Promise<ChatMessage> {
        // 키워드 기반 응답 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        let actions: AIAction[] = [];

        if (lowerMessage.includes('온도') || lowerMessage.includes('temperature')) {
            const currentTemp = this.context.currentSensors?.temperature || 24;
            response = `🌡️ **현재 온도 상태**

현재 온도: **${currentTemp.toFixed(1)}°C**
적정 범위: 18-28°C
상태: ${currentTemp >= 18 && currentTemp <= 28 ? '✅ 최적' : '⚠️ 조정 필요'}

📊 **AI 분석 결과:**
- 현재 재배 중인 상추의 경우 22-25°C가 최적입니다
- 야간에는 2-3°C 낮추면 성장 촉진에 도움됩니다
- 에너지 효율을 위해 냉방 부하를 15% 줄일 수 있습니다

💡 **권장 조치:**
온도를 23°C로 조정하시겠습니까?`;
            actions = [{ type: 'adjust_temperature', value: 23, target: 'all-zones', executed: false }];
        }
        else if (lowerMessage.includes('습도') || lowerMessage.includes('humidity')) {
            const currentHumidity = this.context.currentSensors?.humidity || 65;
            response = `💧 **현재 습도 상태**

현재 습도: **${currentHumidity.toFixed(1)}%**
적정 범위: 60-80%
VPD: 0.8-1.2 kPa

📊 **AI 분석:**
- 현재 VPD가 최적 범위 내에 있습니다
- 잎 표면 수분 증발이 적절하게 유지되고 있습니다
- 질병 발생 위험: 낮음

💡 **권장 조치:**
현재 설정을 유지하는 것이 좋습니다.`;
            actions = [{ type: 'adjust_humidity', value: currentHumidity, target: 'maintain', executed: false }];
        }
        else if (lowerMessage.includes('수확') || lowerMessage.includes('harvest')) {
            response = `🌾 **수확 예측 분석**

📅 **예정된 수확:**
• 상추 배치 #127: **2일 후** (95% 확신도)
• 바질 배치 #89: **5일 후** (87% 확신도)
• 토마토 배치 #45: **12일 후** (78% 확신도)

📊 **수율 예측:**
- 이번 주 예상 수확량: 125kg
- 지난 주 대비: +8.5%
- 품질 등급 예측: A등급 92%

🤖 **자동 수확 로봇 상태:**
- Harvester-1: 활성 (배터리 85%)
- Harvester-2: 대기 중

💡 수확 일정을 확인하시겠습니까?`;
            actions = [{ type: 'harvest', target: 'batch-127', executed: false }];
        }
        else if (lowerMessage.includes('분석') || lowerMessage.includes('리포트') || lowerMessage.includes('report')) {
            response = `📊 **실시간 농장 분석 리포트**

🌿 **작물 상태:**
- 전체 건강 지수: 94.5%
- 성장률: 정상 대비 +12%
- 영양 상태: 최적

⚡ **에너지 효율:**
- 오늘 소비량: 4,250W
- 절감량: 15% (AI 최적화)
- 태양광 자급률: 35%

💧 **물 사용:**
- 오늘 사용량: 145L
- 재활용률: 92%

🤖 **AI 시스템:**
- 의사결정 수: 12,847회
- 정확도: 99.2%
- 자동화율: 98.5%

💰 **경제성:**
- 일일 운영비: ₩45,000
- 예상 수익: ₩180,000
- ROI: 300%+`;
            actions = [{ type: 'report', executed: false }];
        }
        else if (lowerMessage.includes('안녕') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = `안녕하세요! 👋 저는 **NEXUS**, AgriNexus World OS의 AI 어시스턴트입니다.

🌱 저는 전세계 유일 **1인 AI 전자동화 스마트팜 OS**를 함께 운영하고 있습니다.

**현재 시스템 상태:**
• 🟢 모든 시스템 정상 가동
• 🤖 4대 로봇 활성
• 📊 12,847 AI 의사결정 완료
• 🌿 작물 건강 지수: 94.5%

무엇을 도와드릴까요?

💡 예시 질문:
- "현재 온도 상태 알려줘"
- "수확 예정일은?"
- "에너지 효율 분석해줘"
- "오늘 리포트 보여줘"`;
        }
        else {
            response = `🤔 **질문을 분석 중입니다...**

"${userMessage}"에 대해 답변드리겠습니다.

AgriNexus World OS는 **초지능 AI 기반** 스마트팜 플랫폼으로:

🌿 **주요 기능:**
- 실시간 환경 모니터링 및 자동 제어
- AI 기반 작물 성장 예측
- 자동 수확 로봇 관리
- 에너지 효율 최적화

💡 **더 구체적인 도움이 필요하시면:**
- "온도 조절해줘"
- "습도 상태 확인"
- "수확 예측 분석"
- "에너지 리포트"

라고 말씀해 주세요!`;
        }

        const assistantMsg: ChatMessage = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: response,
            timestamp: new Date(),
            metadata: {
                source: 'simulation',
                confidence: 0.85,
                actions,
            },
        };

        this.conversationHistory.push(assistantMsg);
        return assistantMsg;
    }

    getHistory(): ChatMessage[] {
        return this.conversationHistory;
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

// 싱글톤 인스턴스
let chatServiceInstance: AIChatService | null = null;

export function getChatService(): AIChatService {
    if (!chatServiceInstance) {
        chatServiceInstance = new AIChatService();
    }
    return chatServiceInstance;
}

export { SYSTEM_PROMPT };
export default AIChatService;
