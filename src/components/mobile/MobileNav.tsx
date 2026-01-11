'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { CLUSTERS, ClusterType } from '@/types/systems';
import Link from 'next/link';
import {
    Menu,
    X,
    Home,
    Cpu,
    Leaf,
    Bot,
    Globe,
    Brain,
    Shield,
    Rocket,
    Sparkles,
    Infinity,
    BarChart3,
    Activity,
    Microscope,
    Settings,
    Bell,
    ChevronRight
} from 'lucide-react';

// Icon mapping
const clusterIcons: Record<string, React.ReactNode> = {
    'CORE': <Cpu size={20} />,
    'BIOSCIENCE': <Leaf size={20} />,
    'ROBOTICS': <Bot size={20} />,
    'GLOBAL': <Globe size={20} />,
    'SENTIENT': <Brain size={20} />,
    'CRISIS': <Shield size={20} />,
    'SPACE': <Rocket size={20} />,
    'SUPERINTELLIGENCE': <Sparkles size={20} />,
    'CIVILIZATION': <Home size={20} />,
    'INFINITE': <Infinity size={20} />,
};

// Quick links for mobile
const quickLinks = [
    { href: '/', label: '대시보드', icon: <Home size={20} /> },
    { href: '/ai', label: 'AI 허브', icon: <Brain size={20} /> },
    { href: '/ai/crop-prediction', label: '작물 예측', icon: <Leaf size={20} /> },
    { href: '/ai/disease-diagnosis', label: '질병 진단', icon: <Microscope size={20} /> },
    { href: '/monitoring', label: '모니터링', icon: <Activity size={20} /> },
    { href: '/analytics', label: '분석', icon: <BarChart3 size={20} /> },
];

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
    const { currentCluster, setCurrentCluster, setCurrentSystem, alerts } = useOSStore();
    const [showClusters, setShowClusters] = useState(false);

    const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];

    const handleClusterSelect = (key: ClusterType) => {
        setCurrentCluster(key);
        setCurrentSystem(null);
        setShowClusters(false);
        onClose();
    };

    const slideVariants = {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Slide-in Panel */}
                    <motion.nav
                        className="fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-[var(--bg-secondary)] border-l border-[var(--border-subtle)] z-[70] flex flex-col"
                        variants={slideVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-blue)] flex items-center justify-center">
                                    <span className="text-xl">🌱</span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-[var(--text-primary)]">AgriNexus</h2>
                                    <p className="text-xs text-[var(--text-muted)]">World OS 4.0</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
                                aria-label="닫기"
                            >
                                <X size={24} className="text-[var(--text-secondary)]" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Quick Links */}
                            <div className="p-4">
                                <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    빠른 이동
                                </h3>
                                <div className="space-y-1">
                                    {quickLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={onClose}
                                            className="flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors active:scale-[0.98]"
                                        >
                                            <span className="text-[var(--text-muted)]">{link.icon}</span>
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Clusters Section */}
                            <div className="p-4 border-t border-[var(--border-subtle)]">
                                <button
                                    onClick={() => setShowClusters(!showClusters)}
                                    className="flex items-center justify-between w-full text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3"
                                >
                                    <span>시스템 클러스터</span>
                                    <ChevronRight
                                        size={16}
                                        className={`transition-transform ${showClusters ? 'rotate-90' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {showClusters && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-1 overflow-hidden"
                                        >
                                            {clusterList.slice(0, 6).map(([key, cluster]) => {
                                                const isActive = currentCluster === key;
                                                const Icon = clusterIcons[key] || <Cpu size={20} />;

                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => handleClusterSelect(key)}
                                                        className={`
                                                            w-full flex items-center gap-3 px-3 py-3 rounded-lg
                                                            transition-all active:scale-[0.98]
                                                            ${isActive
                                                                ? 'bg-[var(--primary-green)]/10 text-[var(--primary-green)]'
                                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                                            }
                                                        `}
                                                    >
                                                        <span className={isActive ? 'text-[var(--primary-green)]' : 'text-[var(--text-muted)]'}>
                                                            {Icon}
                                                        </span>
                                                        <span className="font-medium flex-1 text-left">{cluster.koreanName}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-[var(--primary-green)]/20' : 'bg-[var(--bg-tertiary)]'}`}>
                                                            {cluster.systemCount}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                                <Bell size={20} className="text-[var(--text-muted)]" />
                                <span className="font-medium flex-1 text-left">알림</span>
                                {unreadAlerts > 0 && (
                                    <span className="w-5 h-5 rounded-full bg-[var(--status-danger)] text-white text-xs flex items-center justify-center">
                                        {unreadAlerts > 9 ? '9+' : unreadAlerts}
                                    </span>
                                )}
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
                                <Settings size={20} className="text-[var(--text-muted)]" />
                                <span className="font-medium">설정</span>
                            </button>
                        </div>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    );
}

// Export toggle button component
export function MobileNavToggle({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="메뉴 열기"
        >
            <Menu size={22} className="text-[var(--text-secondary)]" />
        </button>
    );
}
