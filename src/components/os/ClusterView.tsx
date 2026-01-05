'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOSStore } from '@/store/useOSStore';
import { ClusterType, CLUSTERS } from '@/types/systems';
import SystemCard from './SystemCard';

interface ClusterViewProps {
    clusterId: ClusterType;
}

export default function ClusterView({ clusterId }: ClusterViewProps) {
    const { clusters, setCurrentSystem } = useOSStore();

    const cluster = CLUSTERS[clusterId];
    const systems = useMemo(() => {
        return clusters[clusterId]?.systems || [];
    }, [clusters, clusterId]);

    // Calculate cluster stats
    const clusterStats = useMemo(() => {
        if (systems.length === 0) return { avgEfficiency: 0, totalLoad: 0, activeCount: 0 };

        const avgEfficiency = systems.reduce((acc, s) => acc + s.metrics.efficiency, 0) / systems.length;
        const totalLoad = systems.reduce((acc, s) => acc + s.metrics.load, 0) / systems.length;
        const activeCount = systems.filter(s => s.status === 'active').length;

        return { avgEfficiency, totalLoad, activeCount };
    }, [systems]);

    return (
        <div className="space-y-6">
            {/* Cluster Header */}
            <motion.div
                className="glass rounded-2xl p-6 overflow-hidden relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Background Glow */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `radial-gradient(circle at 30% 50%, ${cluster.color}40 0%, transparent 50%)`,
                    }}
                />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <motion.span
                                className="text-5xl"
                                style={{ filter: `drop-shadow(0 0 20px ${cluster.color})` }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {cluster.icon}
                            </motion.span>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-orbitron)]" style={{ color: cluster.color }}>
                                    {cluster.koreanName}
                                </h1>
                                <p className="text-white/60">{cluster.name}</p>
                            </div>
                        </div>

                        {/* Cluster Stats */}
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-white/50">시스템</div>
                                <div className="font-[family-name:var(--font-orbitron)] text-lg" style={{ color: cluster.color }}>
                                    {clusterStats.activeCount}/{systems.length}
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-white/50">효율</div>
                                <div className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--primary-green)]">
                                    {clusterStats.avgEfficiency.toFixed(1)}%
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-center">
                                <div className="text-xs text-white/50">부하</div>
                                <div className="font-[family-name:var(--font-orbitron)] text-lg text-[var(--primary-cyan)]">
                                    {clusterStats.totalLoad.toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-white/60 text-sm md:text-base">
                        {cluster.description}
                    </p>
                </div>
            </motion.div>

            {/* Systems Grid */}
            <div>
                <h2 className="text-lg font-bold font-[family-name:var(--font-orbitron)] mb-4 flex items-center gap-2">
                    <span>🔧</span> 시스템 목록
                    <span className="text-sm text-white/40 font-normal">({systems.length}개)</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {systems.map((system, i) => (
                        <motion.div
                            key={system.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <SystemCard
                                system={system}
                                clusterColor={cluster.color}
                                onClick={() => setCurrentSystem(system)}
                            />
                        </motion.div>
                    ))}
                </div>

                {systems.length === 0 && (
                    <div className="text-center py-12 glass rounded-2xl">
                        <span className="text-4xl block mb-3">🔧</span>
                        <p className="text-white/60">이 클러스터에 시스템이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
