'use client';

import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { CLUSTERS, ClusterType } from '@/types/systems';

export default function OSSidebar() {
    const { currentCluster, setCurrentCluster, clusters, setCurrentSystem } = useOSStore();

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];

    return (
        <aside className="w-16 md:w-64 glass border-r border-white/10 flex flex-col overflow-hidden">
            {/* Cluster Navigation */}
            <div className="flex-1 overflow-y-auto py-3">
                <div className="px-3 mb-3 hidden md:block">
                    <h3 className="text-[0.65rem] uppercase tracking-wider text-white/40 font-[family-name:var(--font-orbitron)]">
                        시스템 클러스터
                    </h3>
                </div>

                <nav className="space-y-1 px-2">
                    {clusterList.map(([key, cluster]) => {
                        const isActive = currentCluster === key;
                        const systemsInCluster = clusters[key]?.systems.length || 0;

                        return (
                            <motion.button
                                key={key}
                                onClick={() => {
                                    setCurrentCluster(key);
                                    setCurrentSystem(null);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-lg
                  transition-all duration-200 group
                  ${isActive
                                        ? 'bg-gradient-to-r from-white/10 to-transparent border-l-2'
                                        : 'hover:bg-white/5'
                                    }
                `}
                                style={{
                                    borderLeftColor: isActive ? cluster.color : 'transparent',
                                }}
                                whileHover={{ x: 3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Icon */}
                                <span
                                    className="text-xl md:text-2xl"
                                    style={{
                                        filter: isActive ? `drop-shadow(0 0 8px ${cluster.color})` : 'none'
                                    }}
                                >
                                    {cluster.icon}
                                </span>

                                {/* Text (hidden on mobile) */}
                                <div className="hidden md:flex flex-col items-start flex-1 min-w-0">
                                    <span className={`text-sm font-medium truncate w-full text-left ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
                                        }`}>
                                        {cluster.koreanName}
                                    </span>
                                    <span className="text-[0.65rem] text-white/40">
                                        {systemsInCluster} 시스템
                                    </span>
                                </div>

                                {/* Status Dot */}
                                <div
                                    className={`w-2 h-2 rounded-full hidden md:block ${cluster.status === 'active' ? 'bg-[var(--status-success)]' : 'bg-[var(--status-warning)]'
                                        }`}
                                    style={{
                                        boxShadow: cluster.status === 'active' ? '0 0 8px var(--status-success)' : 'none'
                                    }}
                                />
                            </motion.button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="p-3 border-t border-white/10">
                <motion.button
                    onClick={() => {
                        setCurrentCluster(null);
                        setCurrentSystem(null);
                    }}
                    className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[var(--primary-green)]/10 to-[var(--primary-cyan)]/10 border border-[var(--primary-green)]/30 hover:border-[var(--primary-green)] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="text-lg">🌌</span>
                    <span className="text-sm text-white/80 hidden md:inline">UNIVERSE 코어</span>
                </motion.button>
            </div>
        </aside>
    );
}
