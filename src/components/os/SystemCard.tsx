'use client';

import { motion } from 'framer-motion';
import { AgriSystem, STATUS_COLORS } from '@/types/systems';

interface SystemCardProps {
    system: AgriSystem;
    clusterColor: string;
    onClick: () => void;
}

export default function SystemCard({ system, clusterColor, onClick }: SystemCardProps) {
    return (
        <motion.div
            className="glass rounded-xl p-4 cursor-pointer border border-white/10 hover:border-white/30 transition-all group overflow-hidden relative"
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background glow on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${clusterColor} 0%, transparent 70%)`,
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-2xl"
                            style={{ filter: `drop-shadow(0 0 8px ${clusterColor})` }}
                        >
                            {system.icon}
                        </span>
                        <div>
                            <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold" style={{ color: clusterColor }}>
                                {system.code}
                            </h3>
                            <p className="text-xs text-white/50">{system.name}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1">
                        <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: STATUS_COLORS[system.status],
                                boxShadow: `0 0 8px ${STATUS_COLORS[system.status]}`
                            }}
                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-[0.65rem] text-white/40 uppercase">
                            {system.status}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs text-white/60 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {system.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-[0.65rem] text-white/40">효율</div>
                        <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-green)]">
                            {system.metrics.efficiency.toFixed(0)}%
                        </div>
                    </div>
                    <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-[0.65rem] text-white/40">부하</div>
                        <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-cyan)]">
                            {system.metrics.load.toFixed(0)}%
                        </div>
                    </div>
                    <div className="text-center p-2 rounded bg-white/5">
                        <div className="text-[0.65rem] text-white/40">AI</div>
                        <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-purple)]">
                            {system.metrics.aiScore.toFixed(0)}
                        </div>
                    </div>
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {system.capabilities.slice(0, 3).map((cap, i) => (
                        <span
                            key={i}
                            className="px-2 py-0.5 text-[0.6rem] rounded-full bg-white/5 text-white/50"
                        >
                            {cap}
                        </span>
                    ))}
                    {system.capabilities.length > 3 && (
                        <span className="px-2 py-0.5 text-[0.6rem] rounded-full bg-white/10 text-white/50">
                            +{system.capabilities.length - 3}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
