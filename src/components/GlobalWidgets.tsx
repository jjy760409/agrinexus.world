'use client';

import dynamic from 'next/dynamic';

// 동적 임포트 (클라이언트 전용)
const AIAssistant = dynamic(() => import('@/components/ai/AIAssistant'), { ssr: false });
const VoiceControlButton = dynamic(() => import('@/components/voice/VoiceControlButton'), { ssr: false });

export default function GlobalWidgets() {
    return (
        <>
            <AIAssistant />
            <VoiceControlButton />
        </>
    );
}
