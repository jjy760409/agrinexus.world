'use client';

import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { CLUSTERS, ClusterType } from '@/types/systems';
import {
    Cpu,
    Leaf,
    Bot,
    Globe,
    Brain,
    Shield,
    Rocket,
    Sparkles,
    Infinity,
    Home
} from 'lucide-react';

// Icon mapping for clusters
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

export default function OSSidebar() {
    const { currentCluster, setCurrentCluster, clusters, setCurrentSystem } = useOSStore();

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];

    return (
        <aside className="hidden md:flex w-64 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] h-full">
            {/* Navigation Header */}
            <div className="p-4 border-b border-[var(--border-subtle)]">
                <h2 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    시스템 클러스터
                </h2>
            </div>

            {/* Cluster Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                    {clusterList.map(([key, cluster]) => {
                        const isActive = currentCluster === key;
                        const systemCount = clusters[key]?.systems.length || cluster.systemCount;
                        const Icon = clusterIcons[key] || <Cpu size={20} />;

                        return (
                            <li key={key}>
                                <motion.button
                                    onClick={() => {
                                        setCurrentCluster(key);
                                        setCurrentSystem(null);
                                    }}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                        transition-all duration-200 group text-left
                                        ${isActive
                                            ? 'bg-[var(--primary-green)]/10 text-[var(--primary-green)] border-l-2 border-[var(--primary-green)]'
                                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                                        }
                                    `}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Icon */}
                                    <span className={`flex-shrink-0 ${isActive ? 'text-[var(--primary-green)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'}`}>
                                        {Icon}
                                    </span>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-[var(--primary-green)]' : ''}`}>
                                            {cluster.koreanName}
                                        </p>
                                    </div>

                                    {/* System Count Badge */}
                                    <span className={`
                                        text-xs px-2 py-0.5 rounded-full flex-shrink-0
                                        ${isActive
                                            ? 'bg-[var(--primary-green)]/20 text-[var(--primary-green)]'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                                        }
                                    `}>
                                        {systemCount}
                                    </span>
                                </motion.button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom: Universe Core Button */}
            <div className="p-3 border-t border-[var(--border-subtle)]">
                <motion.button
                    onClick={() => {
                        setCurrentCluster(null);
                        setCurrentSystem(null);
                    }}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                        transition-all duration-200
                        ${!currentCluster
                            ? 'bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-blue)] text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }
                    `}
                    whileTap={{ scale: 0.98 }}
                >
                    <Home size={18} />
                    <span className="text-sm font-medium">대시보드 홈</span>
                </motion.button>
            </div>
        </aside>
    );
}
