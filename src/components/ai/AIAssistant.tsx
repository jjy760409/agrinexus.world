'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatService, ChatMessage } from '@/lib/ai/chatService';
import { getRealTimeService } from '@/lib/realtime/realtimeService';

export default function AIAssistant() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // 실시간 센서 데이터로 컨텍스트 업데이트
    useEffect(() => {
        const service = getRealTimeService();
        const chatService = getChatService();

        const unsubscribe = service.subscribe('farm-sensors', 'sensor-update', (data) => {
            chatService.setContext({
                currentSensors: {
                    temperature: data.temperature,
                    humidity: data.humidity,
                    co2: data.co2,
                    light: data.light,
                },
            });
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setIsTyping(true);

        // 사용자 메시지 추가
        const userMsg: ChatMessage = {
            id: `msg-${Date.now()}-user`,
            role: 'user',
            content: userMessage,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            const chatService = getChatService();
            const response = await chatService.sendMessage(userMessage);

            // 타이핑 효과를 위한 딜레이
            setIsTyping(false);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error('메시지 전송 오류:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: `msg-${Date.now()}-error`,
                role: 'assistant',
                content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { label: '🌡️ 온도 상태', message: '현재 온도 상태 알려줘' },
        { label: '💧 습도 확인', message: '습도 상태 확인해줘' },
        { label: '🌾 수확 예측', message: '수확 예정일 분석해줘' },
        { label: '📊 리포트', message: '오늘 리포트 보여줘' },
    ];

    return (
        <>
            {/* 플로팅 버튼 */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: isOpen ? 45 : 0 }}
            >
                <span className="text-2xl">{isOpen ? '✕' : '🤖'}</span>
            </motion.button>

            {/* 채팅 창 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl bg-[var(--bg-dark)]/95"
                    >
                        {/* 헤더 */}
                        <div className="p-4 bg-gradient-to-r from-[var(--primary-green)]/20 to-[var(--primary-cyan)]/20 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                >
                                    <span className="text-xl">🧠</span>
                                </motion.div>
                                <div>
                                    <h3 className="font-bold text-white">NEXUS AI</h3>
                                    <p className="text-xs text-white/50 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        온라인 · 응답 준비됨
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 메시지 영역 */}
                        <div className="h-[320px] overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <span className="text-4xl mb-4 block">👋</span>
                                    <p className="text-white/60 text-sm">
                                        안녕하세요! NEXUS AI입니다.
                                        <br />
                                        무엇을 도와드릴까요?
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                        {quickActions.map((action, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setInput(action.message);
                                                    setTimeout(sendMessage, 100);
                                                }}
                                                className="px-3 py-1.5 rounded-full bg-white/5 text-xs hover:bg-white/10 transition-colors"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                                        ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] text-[var(--bg-dark)]'
                                                        : 'bg-white/10 text-white'
                                                    }`}
                                            >
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {msg.content.split('\n').map((line, i) => (
                                                        <span key={i}>
                                                            {line.startsWith('**') && line.endsWith('**') ? (
                                                                <strong>{line.replace(/\*\*/g, '')}</strong>
                                                            ) : line.startsWith('•') || line.startsWith('-') ? (
                                                                <span className="block ml-2">{line}</span>
                                                            ) : (
                                                                line
                                                            )}
                                                            {i < msg.content.split('\n').length - 1 && <br />}
                                                        </span>
                                                    ))}
                                                </div>
                                                {msg.metadata?.actions && msg.metadata.actions.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-white/10">
                                                        <button className="text-xs px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                                                            🚀 실행하기
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-1">
                                                <motion.span
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                    className="w-2 h-2 rounded-full bg-white/60"
                                                />
                                                <motion.span
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                    className="w-2 h-2 rounded-full bg-white/60"
                                                />
                                                <motion.span
                                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                    className="w-2 h-2 rounded-full bg-white/60"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* 입력 영역 */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="메시지를 입력하세요..."
                                    className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm focus:outline-none focus:border-[var(--primary-cyan)]"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                >
                                    {isLoading ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            ⏳
                                        </motion.span>
                                    ) : (
                                        <span>➤</span>
                                    )}
                                </button>
                            </div>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(action.message);
                                        }}
                                        className="flex-shrink-0 px-2 py-1 rounded-full bg-white/5 text-xs hover:bg-white/10 transition-colors whitespace-nowrap"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
