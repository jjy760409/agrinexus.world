'use client';

import { useState, useEffect } from 'react';
import { useOSStore } from '@/store/useOSStore';
import { Wifi, WifiOff, ArrowUp, ArrowDown, Clock } from 'lucide-react';

export default function OSFooter() {
    const { globalStats, isConnected, lastSync } = useOSStore();
    const [uploadRate, setUploadRate] = useState(0);
    const [downloadRate, setDownloadRate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setUploadRate(5 + Math.random() * 15);
            setDownloadRate(10 + Math.random() * 30);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] px-4 lg:px-6 py-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                {/* Left: Connection Status */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <Wifi size={14} className="text-[var(--status-success)]" />
                        ) : (
                            <WifiOff size={14} className="text-[var(--status-danger)]" />
                        )}
                        <span className="text-xs text-[var(--text-muted)]">
                            {isConnected ? '연결됨' : '오프라인'}
                        </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Clock size={12} />
                        <span>동기화: {formatTime(lastSync)}</span>
                    </div>
                </div>

                {/* Center: Data Transfer */}
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <ArrowUp size={12} className="text-[var(--primary-green)]" />
                        <span className="font-mono text-[var(--text-secondary)]">{uploadRate.toFixed(1)}</span>
                        <span className="text-[var(--text-muted)]">MB/s</span>
                    </div>
                    <div className="w-px h-3 bg-[var(--border-subtle)]" />
                    <div className="flex items-center gap-1">
                        <ArrowDown size={12} className="text-[var(--primary-blue)]" />
                        <span className="font-mono text-[var(--text-secondary)]">{downloadRate.toFixed(1)}</span>
                        <span className="text-[var(--text-muted)]">MB/s</span>
                    </div>
                </div>

                {/* Right: Copyright */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--status-success)]/10">
                        <span className="text-xs text-[var(--status-success)]">
                            ⚡ {globalStats.energySaved}% 절감
                        </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                        © 2026 AgriNexus
                    </span>
                </div>
            </div>
        </footer>
    );
}
