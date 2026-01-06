// AgriNexus World OS - 음성 제어 시스템
// Web Speech API 기반 음성 인식 및 제어

export interface VoiceCommand {
    text: string;
    confidence: number;
    timestamp: Date;
    action?: VoiceAction;
}

export interface VoiceAction {
    type: 'temperature' | 'humidity' | 'light' | 'water' | 'harvest' |
    'report' | 'navigate' | 'search' | 'help' | 'unknown';
    target?: string;
    value?: number | string;
    parameters?: Record<string, any>;
}

// 음성 명령 패턴
const COMMAND_PATTERNS: { pattern: RegExp; action: VoiceAction['type']; extract?: (match: RegExpMatchArray) => Partial<VoiceAction> }[] = [
    // 온도 명령
    {
        pattern: /온도\s*(를|을)?\s*(\d+)\s*(도|°)?로?\s*(설정|조절|변경|높여|낮춰)/i,
        action: 'temperature',
        extract: (m) => ({ value: parseInt(m[2]), target: 'all-zones' })
    },
    {
        pattern: /온도\s*(높여|올려|내려|낮춰)/i,
        action: 'temperature',
        extract: (m) => ({ parameters: { direction: m[1].includes('높') || m[1].includes('올') ? 'up' : 'down' } })
    },
    {
        pattern: /온도\s*(상태|확인|알려|보여)/i,
        action: 'temperature',
        extract: () => ({ parameters: { query: true } })
    },

    // 습도 명령
    {
        pattern: /습도\s*(를|을)?\s*(\d+)\s*(%)?로?\s*(설정|조절|변경)/i,
        action: 'humidity',
        extract: (m) => ({ value: parseInt(m[2]) })
    },
    {
        pattern: /습도\s*(상태|확인|알려|보여)/i,
        action: 'humidity',
        extract: () => ({ parameters: { query: true } })
    },

    // 조명 명령
    {
        pattern: /(조명|불|라이트|LED)\s*(켜|끄|on|off)/i,
        action: 'light',
        extract: (m) => ({ value: m[2].includes('켜') || m[2].toLowerCase() === 'on' ? 'on' : 'off' })
    },
    {
        pattern: /(조명|광량)\s*(밝기|강도)?\s*(\d+)\s*(%)?/i,
        action: 'light',
        extract: (m) => ({ value: parseInt(m[3]) })
    },

    // 관수 명령
    {
        pattern: /(물\s*줘|관수|급수|물주기)\s*(시작|중지)?/i,
        action: 'water',
        extract: (m) => ({ value: m[2]?.includes('중지') ? 'stop' : 'start' })
    },

    // 수확 명령
    {
        pattern: /(수확|하베스트)\s*(시작|예측|상태|확인)?/i,
        action: 'harvest',
        extract: (m) => ({ parameters: { mode: m[2] || 'status' } })
    },

    // 리포트 명령
    {
        pattern: /(리포트|보고서|분석|상태|현황)\s*(보여|확인|알려)?/i,
        action: 'report',
        extract: () => ({})
    },

    // 네비게이션
    {
        pattern: /(스마트팜|설계|디자인|디지털\s*트윈|시스템|대시보드)\s*(페이지|화면)?\s*(으로|로)?\s*(이동|가|열어)/i,
        action: 'navigate',
        extract: (m) => {
            let page = '/';
            if (m[1].includes('스마트팜') || m[1].includes('설계')) page = '/smartfarm';
            else if (m[1].includes('트윈')) page = '/digitaltwin';
            else if (m[1].includes('시스템')) page = '/system';
            return { target: page };
        }
    },

    // 도움말
    {
        pattern: /(도움|헬프|help|뭐\s*할\s*수|명령어)/i,
        action: 'help',
        extract: () => ({})
    },
];

// 응답 메시지
const RESPONSES: Record<VoiceAction['type'], (action: VoiceAction) => string> = {
    temperature: (a) => {
        if (a.parameters?.query) return '현재 온도를 확인하고 있습니다';
        if (a.parameters?.direction) return `온도를 ${a.parameters.direction === 'up' ? '높이' : '낮추'}겠습니다`;
        return `온도를 ${a.value}도로 설정하겠습니다`;
    },
    humidity: (a) => {
        if (a.parameters?.query) return '현재 습도를 확인하고 있습니다';
        return `습도를 ${a.value}%로 설정하겠습니다`;
    },
    light: (a) => {
        if (a.value === 'on' || a.value === 'off') return `조명을 ${a.value === 'on' ? '켜' : '끄'}겠습니다`;
        return `조명 밝기를 ${a.value}%로 조절하겠습니다`;
    },
    water: (a) => a.value === 'stop' ? '관수를 중지하겠습니다' : '관수를 시작하겠습니다',
    harvest: (a) => {
        if (a.parameters?.mode === '예측') return '수확 예측을 분석하고 있습니다';
        return '수확 상태를 확인하고 있습니다';
    },
    report: () => '리포트를 불러오고 있습니다',
    navigate: (a) => `${a.target} 페이지로 이동합니다`,
    search: () => '검색 중입니다',
    help: () => '사용 가능한 명령어를 알려드리겠습니다',
    unknown: () => '명령을 이해하지 못했습니다. 다시 말씀해주세요',
};

class VoiceControlService {
    private recognition: any = null;
    private synthesis: SpeechSynthesis | null = null;
    private isListening: boolean = false;
    private onCommandCallback: ((cmd: VoiceCommand) => void) | null = null;
    private onStateChangeCallback: ((listening: boolean) => void) | null = null;
    private preferredVoice: SpeechSynthesisVoice | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    private init() {
        // 음성 인식 초기화
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'ko-KR';
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.maxAlternatives = 3;

            this.recognition.onresult = (event: any) => this.handleResult(event);
            this.recognition.onstart = () => this.handleStart();
            this.recognition.onend = () => this.handleEnd();
            this.recognition.onerror = (e: any) => this.handleError(e);
        }

        // 음성 합성 초기화
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;

            // 한국어 음성 찾기
            const loadVoices = () => {
                const voices = this.synthesis!.getVoices();
                this.preferredVoice = voices.find(v => v.lang.includes('ko')) || voices[0];
            };

            if (this.synthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                this.synthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    // 음성 인식 시작
    startListening() {
        if (!this.recognition) {
            console.error('음성 인식 미지원');
            return false;
        }

        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('음성 인식 시작 실패:', error);
            return false;
        }
    }

    // 음성 인식 중지
    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    // 듣기 상태
    getListeningState(): boolean {
        return this.isListening;
    }

    // 음성 인식 결과 처리
    private handleResult(event: any) {
        const results = event.results;
        const lastResult = results[results.length - 1];

        if (lastResult.isFinal) {
            const text = lastResult[0].transcript.trim();
            const confidence = lastResult[0].confidence;

            console.log(`🎤 인식됨: "${text}" (${(confidence * 100).toFixed(1)}%)`);

            // 명령어 분석
            const action = this.parseCommand(text);

            const command: VoiceCommand = {
                text,
                confidence,
                timestamp: new Date(),
                action
            };

            // 콜백 실행
            if (this.onCommandCallback) {
                this.onCommandCallback(command);
            }

            // 응답 음성 출력
            if (action) {
                const response = RESPONSES[action.type](action);
                this.speak(response);
            }
        }
    }

    // 명령어 파싱
    private parseCommand(text: string): VoiceAction | undefined {
        for (const { pattern, action, extract } of COMMAND_PATTERNS) {
            const match = text.match(pattern);
            if (match) {
                const extracted = extract ? extract(match) : {};
                return {
                    type: action,
                    ...extracted
                };
            }
        }

        // 알 수 없는 명령
        return {
            type: 'unknown'
        };
    }

    // 음성 출력
    speak(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synthesis) {
                reject(new Error('음성 합성 미지원'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 1.1;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            if (this.preferredVoice) {
                utterance.voice = this.preferredVoice;
            }

            utterance.onend = () => resolve();
            utterance.onerror = (e) => reject(e);

            this.synthesis.speak(utterance);
        });
    }

    // 음성 출력 중지
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    // 이벤트 핸들러
    private handleStart() {
        this.isListening = true;
        console.log('🎤 음성 인식 시작');
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(true);
        }
    }

    private handleEnd() {
        this.isListening = false;
        console.log('🎤 음성 인식 종료');
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(false);
        }
    }

    private handleError(error: any) {
        console.error('음성 인식 오류:', error.error);
        this.isListening = false;
        if (this.onStateChangeCallback) {
            this.onStateChangeCallback(false);
        }
    }

    // 콜백 설정
    onCommand(callback: (cmd: VoiceCommand) => void) {
        this.onCommandCallback = callback;
    }

    onStateChange(callback: (listening: boolean) => void) {
        this.onStateChangeCallback = callback;
    }

    // 지원 여부 확인
    isSupported(): { recognition: boolean; synthesis: boolean } {
        return {
            recognition: !!this.recognition,
            synthesis: !!this.synthesis
        };
    }

    // 도움말 명령어 목록
    getHelpCommands(): string[] {
        return [
            '🌡️ "온도 25도로 설정해줘"',
            '🌡️ "온도 높여" / "온도 낮춰"',
            '💧 "습도 상태 확인해줘"',
            '💡 "조명 켜" / "조명 꺼"',
            '🚿 "물 줘" / "관수 시작"',
            '🌾 "수확 예측 분석"',
            '📊 "리포트 보여줘"',
            '🧭 "스마트팜 페이지로 이동"',
            '❓ "도움말" / "명령어"',
        ];
    }
}

// 싱글톤 인스턴스
let voiceServiceInstance: VoiceControlService | null = null;

export function getVoiceService(): VoiceControlService {
    if (!voiceServiceInstance) {
        voiceServiceInstance = new VoiceControlService();
    }
    return voiceServiceInstance;
}

export default VoiceControlService;
