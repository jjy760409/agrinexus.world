'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import { Equipment, CountryPreset, SeedVariety, SimulationEvent } from '@/types/smartfarm';
import { AI_AGENTS } from '@/lib/smartfarm/farmData';

interface SimulationPanelProps {
    seeds: SeedVariety[];
    equipment: Equipment[];
    country: CountryPreset;
    dimensions: { width: number; length: number; height: number; floors: number };
}

export default function SimulationPanel({ seeds, equipment, country, dimensions }: SimulationPanelProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [currentDay, setCurrentDay] = useState(0);
    const [events, setEvents] = useState<SimulationEvent[]>([]);
    const [growthData, setGrowthData] = useState<Array<{ day: number; growth: number; health: number; yield: number }>>([]);
    const [resourceData, setResourceData] = useState<Array<{ day: number; water: number; power: number; nutrients: number }>>([]);

    // Calculate growing area
    const growingArea = dimensions.width * dimensions.length * dimensions.floors;
    const totalPower = equipment.reduce((acc, eq) => acc + eq.powerConsumption, 0);

    // Calculate max days based on longest growing seed
    const maxDays = useMemo(() => {
        if (seeds.length === 0) return 90;
        return Math.max(...seeds.map(s => s.growthDays)) + 15;
    }, [seeds]);

    // Simulation effect
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setCurrentDay(prev => {
                const next = prev + 1;
                if (next >= maxDays) {
                    setIsRunning(false);
                    return maxDays;
                }

                // Add growth data
                setGrowthData(gd => {
                    const progress = Math.min(100, (next / (maxDays * 0.8)) * 100);
                    const health = 85 + Math.random() * 15 - (next > maxDays * 0.9 ? 5 : 0);
                    const yieldValue = progress > 80 ? (progress - 80) * 5 : 0;
                    return [...gd.slice(-29), { day: next, growth: progress, health, yield: yieldValue }];
                });

                // Add resource data
                setResourceData(rd => {
                    return [...rd.slice(-29), {
                        day: next,
                        water: (growingArea * 2) + Math.random() * 10,
                        power: (totalPower * 24 / 1000) + Math.random() * 5,
                        nutrients: (growingArea * 0.1) + Math.random() * 0.5,
                    }];
                });

                // Random events
                if (Math.random() < 0.1) {
                    const eventTypes = [
                        { type: 'success' as const, title: 'AI 최적화', desc: 'AI가 광량을 5% 조절하여 성장률 향상' },
                        { type: 'info' as const, title: '영양 조절', desc: '질소 농도를 미세 조정했습니다' },
                        { type: 'warning' as const, title: '습도 경고', desc: '습도가 목표 범위를 벗어남, 자동 조절 중' },
                        { type: 'success' as const, title: '병해 예방', desc: 'AI가 병해 조기 징후를 감지하고 예방 조치' },
                    ];
                    const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
                    setEvents(e => [...e.slice(-9), {
                        id: `evt-${Date.now()}`,
                        day: next,
                        type: event.type,
                        title: event.title,
                        description: event.desc,
                        aiAction: AI_AGENTS[Math.floor(Math.random() * AI_AGENTS.length)].code,
                    }]);
                }

                return next;
            });
        }, 1000 / speed);

        return () => clearInterval(interval);
    }, [isRunning, speed, maxDays, growingArea, totalPower]);

    const resetSimulation = () => {
        setIsRunning(false);
        setCurrentDay(0);
        setGrowthData([]);
        setResourceData([]);
        setEvents([]);
    };

    // Calculate costs
    const dailyWater = growingArea * 2;
    const dailyPower = (totalPower * 24) / 1000;
    const dailyCost = (dailyWater * country.waterCost) + (dailyPower * country.avgElectricityCost);

    return (
        <div className="h-full flex gap-4">
            {/* Main Simulation Area */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Control Bar */}
                <div className="glass rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => setIsRunning(!isRunning)}
                            className={`px-6 py-2 rounded-lg font-medium ${isRunning
                                    ? 'bg-[var(--status-warning)] text-[var(--bg-dark)]'
                                    : 'bg-[var(--primary-green)] text-[var(--bg-dark)]'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isRunning ? '⏸️ 일시정지' : '▶️ 시뮬레이션 시작'}
                        </motion.button>

                        <button
                            onClick={resetSimulation}
                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            🔄 초기화
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">속도:</span>
                            {[1, 2, 5, 10].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSpeed(s)}
                                    className={`px-2 py-1 rounded text-sm ${speed === s ? 'bg-[var(--primary-cyan)] text-[var(--bg-dark)]' : 'bg-white/10'
                                        }`}
                                >
                                    {s}x
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {currentDay}
                            </div>
                            <div className="text-xs text-white/50">현재 일차 / {maxDays}</div>
                        </div>
                        <div className="w-48 h-2 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                style={{ width: `${(currentDay / maxDays) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
                    {/* Growth Chart */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🌱</span> 생장 추이
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" stroke="#ffffff40" />
                                    <YAxis domain={[0, 100]} stroke="#ffffff40" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10,14,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    <Area type="monotone" dataKey="growth" stroke="#00ff88" fill="url(#growthGrad)" name="성장률 %" />
                                    <Area type="monotone" dataKey="health" stroke="#00d4ff" fill="transparent" name="건강도 %" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Resource Chart */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>💧</span> 자원 사용량
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={resourceData}>
                                    <XAxis dataKey="day" stroke="#ffffff40" />
                                    <YAxis stroke="#ffffff40" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(10,14,23,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    <Line type="monotone" dataKey="water" stroke="#00d4ff" name="물 (L)" dot={false} />
                                    <Line type="monotone" dataKey="power" stroke="#ffb800" name="전력 (kWh)" dot={false} />
                                    <Line type="monotone" dataKey="nutrients" stroke="#7b2fff" name="영양제 (L)" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Crop Status */}
                    <div className="glass rounded-xl p-4 overflow-y-auto">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>🌾</span> 작물 상태
                        </h3>
                        {seeds.length === 0 ? (
                            <div className="text-center py-8 text-white/50">
                                <span className="text-3xl block mb-2">🌱</span>
                                재배할 작물을 선택해주세요
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {seeds.map(seed => {
                                    const progress = Math.min(100, (currentDay / seed.growthDays) * 100);
                                    const stage = progress < 10 ? '발아' : progress < 30 ? '유묘' : progress < 60 ? '생장' : progress < 90 ? '성숙' : '수확';

                                    return (
                                        <div key={seed.id} className="p-3 rounded-lg bg-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{seed.icon}</span>
                                                    <span className="font-medium">{seed.koreanName}</span>
                                                </div>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary-green)]/20 text-[var(--primary-green)]">
                                                    {stage}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-[family-name:var(--font-orbitron)]">{progress.toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-white/50 mt-1">
                                                <span>Day {currentDay} / {seed.growthDays}</span>
                                                <span>예상 수확: {seed.yieldPerSquareMeter * growingArea / dimensions.floors}kg</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Cost Analysis */}
                    <div className="glass rounded-xl p-4">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <span>💰</span> 비용 분석 ({country.flag} {country.koreanName})
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white/60">일일 수도비</span>
                                    <span className="font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                        ${(dailyWater * country.waterCost).toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-xs text-white/40">{dailyWater.toFixed(0)}L × ${country.waterCost}/m³</div>
                            </div>

                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white/60">일일 전력비</span>
                                    <span className="font-[family-name:var(--font-orbitron)] text-[var(--status-warning)]">
                                        ${(dailyPower * country.avgElectricityCost).toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-xs text-white/40">{dailyPower.toFixed(1)}kWh × ${country.avgElectricityCost}/kWh</div>
                            </div>

                            <div className="p-3 rounded-lg bg-[var(--primary-green)]/10 border border-[var(--primary-green)]/30">
                                <div className="flex justify-between mb-1">
                                    <span>총 일일 비용</span>
                                    <span className="font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                        ${dailyCost.toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-xs text-white/40">
                                    시뮬레이션 총: ${(dailyCost * currentDay).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Log */}
            <div className="w-80 glass rounded-xl p-4 flex flex-col">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                    <span>📋</span> AI 이벤트 로그
                </h3>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {events.length === 0 ? (
                        <div className="text-center py-8 text-white/50">
                            <span className="text-3xl block mb-2">🤖</span>
                            시뮬레이션을 시작하면<br />AI 이벤트가 표시됩니다
                        </div>
                    ) : (
                        events.slice().reverse().map(event => (
                            <motion.div
                                key={event.id}
                                className={`p-3 rounded-lg border-l-2 ${event.type === 'success' ? 'bg-[var(--status-success)]/10 border-l-[var(--status-success)]' :
                                        event.type === 'warning' ? 'bg-[var(--status-warning)]/10 border-l-[var(--status-warning)]' :
                                            'bg-[var(--status-info)]/10 border-l-[var(--status-info)]'
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-white/50">Day {event.day}</span>
                                    <span className="text-xs font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)]">
                                        {event.aiAction}
                                    </span>
                                </div>
                                <div className="font-medium text-sm">{event.title}</div>
                                <div className="text-xs text-white/60">{event.description}</div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
