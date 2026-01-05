'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { scheduleData } from '@/lib/initialData';

export default function SmartControl() {
    const {
        equipment,
        toggleEquipment,
        rules,
        toggleRule,
        energyData,
        updateEnergyData
    } = useStore();

    useEffect(() => {
        const interval = setInterval(() => {
            updateEnergyData();
        }, 2000);

        return () => clearInterval(interval);
    }, [updateEnergyData]);

    return (
        <div className="space-y-6">
            {/* Module Header */}
            <div className="text-center mb-8">
                <motion.h2
                    className="text-2xl md:text-3xl font-bold gradient-text font-[family-name:var(--font-orbitron)] mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    ⚡ Smart Control
                </motion.h2>
                <p className="text-white/60">자동화 제어 & 에너지 관리 시스템</p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Equipment Controls Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🎛️ 장비 제어
                        </h3>
                        <span className="badge badge-auto animate-blink">자동 모드</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(equipment).map((eq) => (
                            <motion.div
                                key={eq.id}
                                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${eq.active
                                        ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)] shadow-[0_0_20px_rgba(0,255,136,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleEquipment(eq.id)}
                            >
                                <div className="text-3xl mb-2">{eq.icon}</div>
                                <div className="font-medium text-sm mb-1">{eq.name}</div>
                                <div className={`text-xs ${eq.active ? 'text-[var(--primary-green)]' : 'text-white/40'}`}>
                                    {eq.status}
                                </div>

                                {/* Toggle Switch */}
                                <div className="mt-3 flex justify-center">
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${eq.active ? 'bg-[var(--primary-green)]' : 'bg-white/20'
                                        }`}>
                                        <motion.div
                                            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg"
                                            animate={{ left: eq.active ? '1.75rem' : '0.25rem' }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Automation Rules Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            🔧 자동화 룰
                        </h3>
                        <button className="px-3 py-1 text-xs bg-[var(--primary-cyan)]/20 border border-[var(--primary-cyan)] rounded-full text-[var(--primary-cyan)] hover:bg-[var(--primary-cyan)]/30 transition-colors">
                            + 새 룰
                        </button>
                    </div>

                    <div className="space-y-3">
                        {rules.map((rule) => (
                            <motion.div
                                key={rule.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${rule.active
                                        ? 'bg-[var(--primary-green)]/5 border-[var(--primary-green)]/30'
                                        : 'bg-white/5 border-white/10'
                                    }`}
                                whileHover={{ x: 3 }}
                            >
                                <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-[var(--primary-green)]' : 'bg-white/30'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{rule.name}</div>
                                    <div className="text-xs text-white/50 truncate">{rule.condition}</div>
                                </div>

                                {/* Toggle */}
                                <button
                                    onClick={() => toggleRule(rule.id)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${rule.active ? 'bg-[var(--primary-green)]' : 'bg-white/20'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                                        animate={{ left: rule.active ? '1.25rem' : '0.125rem' }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Schedule Timeline Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            📅 스케줄 타임라인
                        </h3>
                        <div className="flex items-center gap-2">
                            <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">
                                ◀
                            </button>
                            <span className="text-sm text-white/60">오늘</span>
                            <button className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-sm">
                                ▶
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {scheduleData.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`flex items-center gap-3 p-3 rounded-lg ${item.status === 'done' ? 'bg-white/5 opacity-60' :
                                        item.status === 'pending' ? 'bg-[var(--primary-cyan)]/10 border border-[var(--primary-cyan)]/30' :
                                            'bg-white/5'
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className="font-[family-name:var(--font-orbitron)] text-sm text-white/60 w-14">
                                    {item.time}
                                </span>
                                <span className="flex-1 text-sm">{item.task}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'done' ? 'bg-[var(--status-success)]/20 text-[var(--status-success)]' :
                                        item.status === 'pending' ? 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)] animate-pulse' :
                                            'bg-white/10 text-white/50'
                                    }`}>
                                    {item.status === 'done' ? '완료' : item.status === 'pending' ? '진행중' : '예정'}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Energy Monitor Card */}
                <motion.div
                    className="glass rounded-2xl p-5 card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold">
                            ⚡ 에너지 모니터
                        </h3>
                    </div>

                    <div className="flex gap-6">
                        {/* Energy Ring */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                    <motion.circle
                                        cx="70"
                                        cy="70"
                                        r="60"
                                        fill="none"
                                        stroke="#00ff88"
                                        strokeWidth="12"
                                        strokeLinecap="round"
                                        strokeDasharray="377"
                                        initial={{ strokeDashoffset: 377 }}
                                        animate={{ strokeDashoffset: 377 * (1 - Math.min(energyData.total / 10, 1)) }}
                                        transition={{ duration: 1 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                        {energyData.total.toFixed(1)}
                                    </span>
                                    <span className="text-sm text-white/60">kW</span>
                                </div>
                            </div>
                            <span className="text-sm text-white/60 mt-2">현재 소비량</span>
                        </div>

                        {/* Energy Breakdown */}
                        <div className="flex-1 space-y-3">
                            {[
                                { icon: '💡', name: '조명', value: energyData.light },
                                { icon: '❄️', name: '냉난방', value: energyData.hvac },
                                { icon: '💧', name: '관개', value: energyData.irrigation },
                                { icon: '🌀', name: '환기', value: energyData.ventilation },
                            ].map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="flex-1 text-sm text-white/60">{item.name}</span>
                                    <span className="font-[family-name:var(--font-orbitron)] text-sm text-white/80">
                                        {item.value.toFixed(1)} kW
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Savings Badge */}
                    <div className="mt-4 p-3 bg-[var(--primary-green)]/10 rounded-xl border border-[var(--primary-green)]/30 flex items-center justify-center gap-2">
                        <span className="text-lg">🌱</span>
                        <span className="text-sm">
                            오늘 <strong className="text-[var(--primary-green)]">23%</strong> 에너지 절약
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
