'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { Menu, Bell, ChevronLeft, Activity, Cpu, Zap, Clock } from 'lucide-react';

export default function OSHeader() {
    const { globalStats, isConnected, alerts, currentCluster, setCurrentCluster, currentSystem, setCurrentSystem } = useOSStore();
    const [currentTime, setCurrentTime] = useState('--:--');
    const [currentDate, setCurrentDate] = useState('');
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }));
            setCurrentDate(now.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                weekday: 'short',
            }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

    const handleBack = () => {
        if (currentSystem) {
            setCurrentSystem(null);
        } else if (currentCluster) {
            setCurrentCluster(null);
        }
    };

    const handleGoHome = () => {
        setCurrentCluster(null);
        setCurrentSystem(null);
    };

    return (
        <header className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left Section: Logo & Navigation */}
                <div className="flex items-center gap-3">
                    {/* Back Button - Only show when navigating */}
                    {(currentCluster || currentSystem) && (
                        <motion.button
                            onClick={handleBack}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            whileTap={{ scale: 0.95 }}
                            aria-label="뒤로 가기"
                        >
                            <ChevronLeft size={20} />
                        </motion.button>
                    )}

                    {/* Logo */}
                    <button 
                        onClick={handleGoHome}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] flex items-center justify-center">
                            <span className="text-xl">🌱</span>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
                                AgriNexus
                            </h1>
                            <p className="text-xs text-[var(--text-muted)] -mt-0.5">
                                World OS 4.0
                            </p>
                        </div>
                    </button>
                </div>

                {/* Center: Key Stats - Desktop Only */}
                <div className="hidden lg:flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-green)]/10 flex items-center justify-center">
                            <Activity size={16} className="text-[var(--primary-green)]" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-xs">시스템</p>
                            <p className="font-semibold text-[var(--text-primary)]">
                                {globalStats.activeSystems}/{globalStats.totalSystems}
                            </p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-[var(--border-subtle)]" />

                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-blue)]/10 flex items-center justify-center">
                            <Cpu size={16} className="text-[var(--primary-blue)]" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-xs">효율</p>
                            <p className="font-semibold text-[var(--primary-green)]">
                                {globalStats.globalEfficiency}%
                            </p>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-[var(--border-subtle)]" />

                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-[var(--primary-indigo)]/10 flex items-center justify-center">
                            <Zap size={16} className="text-[var(--primary-indigo)]" />
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)] text-xs">AI 결정</p>
                            <p className="font-semibold text-[var(--text-primary)]">
                                {globalStats.aiDecisions.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Status & Actions */}
                <div className="flex items-center gap-3">
                    {/* Connection Status */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]">
                        <span className={`status-dot ${isConnected ? 'online' : 'offline'}`} />
                        <span className="text-xs text-[var(--text-secondary)]">
                            {isConnected ? '연결됨' : '오프라인'}
                        </span>
                    </div>

                    {/* Notifications */}
                    <button 
                        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label="알림"
                    >
                        <Bell size={20} className="text-[var(--text-secondary)]" />
                        {unreadAlerts > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--status-danger)] text-white text-xs flex items-center justify-center font-medium">
                                {unreadAlerts > 9 ? '9+' : unreadAlerts}
                            </span>
                        )}
                    </button>

                    {/* Time */}
                    <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[var(--border-subtle)]">
                        <Clock size={16} className="text-[var(--text-muted)]" />
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--text-primary)] font-mono">
                                {currentTime}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] -mt-0.5">
                                {currentDate}
                            </p>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        aria-label="메뉴"
                    >
                        <Menu size={20} className="text-[var(--text-secondary)]" />
                    </button>
                </div>
            </div>
        </header>
    );
}
