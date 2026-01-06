'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVoiceService, VoiceCommand } from '@/lib/voice/voiceControl';
import { getChatService } from '@/lib/ai/chatService';

export default function VoiceControlButton() {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [pulseAnimation, setPulseAnimation] = useState(false);

    useEffect(() => {
        const service = getVoiceService();
        const support = service.isSupported();
        setIsSupported(support.recognition);

        service.onStateChange((listening) => {
            setIsListening(listening);
            if (listening) {
                setPulseAnimation(true);
            }
        });

        service.onCommand(async (command) => {
            setLastCommand(command);
            setPulseAnimation(false);

            // 명령어 처리
            if (command.action) {
                await handleVoiceAction(command);
            }

            // 3초 후 명령 표시 제거
            setTimeout(() => setLastCommand(null), 5000);
        });
    }, []);

    const handleVoiceAction = async (command: VoiceCommand) => {
        if (!command.action) return;

        const chatService = getChatService();

        switch (command.action.type) {
            case 'temperature':
                if (command.action.parameters?.query) {
                    await chatService.sendMessage('현재 온도 상태 알려줘');
                } else if (command.action.value) {
                    console.log(`🌡️ 온도 설정: ${command.action.value}°C`);
                }
                break;

            case 'humidity':
                if (command.action.parameters?.query) {
                    await chatService.sendMessage('습도 상태 확인해줘');
                }
                break;

            case 'navigate':
                if (command.action.target && typeof window !== 'undefined') {
                    window.location.href = command.action.target;
                }
                break;

            case 'report':
                await chatService.sendMessage('오늘 리포트 보여줘');
                break;

            case 'harvest':
                await chatService.sendMessage('수확 예정일 분석해줘');
                break;

            case 'help':
                setShowHelp(true);
                setTimeout(() => setShowHelp(false), 10000);
                break;
        }
    };

    const toggleListening = useCallback(() => {
        const service = getVoiceService();

        if (isListening) {
            service.stopListening();
        } else {
            service.startListening();
        }
    }, [isListening]);

    if (!isSupported) {
        return null;
    }

    return (
        <>
            {/* 음성 버튼 */}
            <motion.button
                onClick={toggleListening}
                className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${isListening
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={pulseAnimation ? {
                    scale: [1, 1.1, 1],
                    boxShadow: isListening
                        ? ['0 0 0 0 rgba(239,68,68,0.5)', '0 0 0 20px rgba(239,68,68,0)', '0 0 0 0 rgba(239,68,68,0)']
                        : undefined
                } : {}}
                transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
            >
                <span className="text-2xl">
                    {isListening ? '🎤' : '🗣️'}
                </span>
            </motion.button>

            {/* 듣기 표시 */}
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-6 z-50 p-4 rounded-2xl bg-red-500/90 backdrop-blur-xl text-white shadow-2xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-white rounded-full"
                                        animate={{
                                            height: [8, 24, 8],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </div>
                            <div>
                                <div className="font-bold text-sm">듣고 있습니다...</div>
                                <div className="text-xs opacity-80">명령어를 말씀해주세요</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 마지막 명령 표시 */}
            <AnimatePresence>
                {lastCommand && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed bottom-24 left-6 z-50 max-w-sm p-4 rounded-2xl bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-xl text-white shadow-2xl"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">
                                {lastCommand.action?.type === 'temperature' ? '🌡️' :
                                    lastCommand.action?.type === 'humidity' ? '💧' :
                                        lastCommand.action?.type === 'light' ? '💡' :
                                            lastCommand.action?.type === 'water' ? '🚿' :
                                                lastCommand.action?.type === 'harvest' ? '🌾' :
                                                    lastCommand.action?.type === 'report' ? '📊' :
                                                        lastCommand.action?.type === 'navigate' ? '🧭' :
                                                            lastCommand.action?.type === 'help' ? '❓' : '✅'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate">"{lastCommand.text}"</div>
                                <div className="text-xs opacity-80">
                                    {(lastCommand.confidence * 100).toFixed(0)}% 신뢰도
                                </div>
                                {lastCommand.action && lastCommand.action.type !== 'unknown' && (
                                    <div className="mt-1 text-xs bg-white/20 rounded-full px-2 py-0.5 inline-block">
                                        ✓ 명령 실행됨
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 도움말 */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-24 left-6 z-50 w-80 p-4 rounded-2xl bg-[var(--bg-dark)]/95 backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg">🗣️ 음성 명령어</h3>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="text-white/50 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            {getVoiceService().getHelpCommands().map((cmd, i) => (
                                <div key={i} className="text-white/70">{cmd}</div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
