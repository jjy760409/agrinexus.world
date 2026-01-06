'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getSwarmMicroRoboticsEngine,
    SwarmStatistics,
    MicroBot,
    SwarmEvent,
    BOT_TYPE_ICONS,
    BOT_STATUS_COLORS,
    MicroBotType,
    BotTask
} from '@/lib/swarm/swarmMicroRobotics';

export default function SwarmRoboticsPanel() {
    const [stats, setStats] = useState<SwarmStatistics | null>(null);
    const [bots, setBots] = useState<MicroBot[]>([]);
    const [events, setEvents] = useState<SwarmEvent[]>([]);
    const [selectedBot, setSelectedBot] = useState<MicroBot | null>(null);
    const [filterType, setFilterType] = useState<MicroBotType | 'all'>('all');
    const [isSimulating, setIsSimulating] = useState(false);

    const engine = useMemo(() => getSwarmMicroRoboticsEngine(), []);

    useEffect(() => {
        const updateData = () => {
            setStats(engine.getSwarmStatistics());
            setBots(engine.getAllBots());
            setEvents(engine.getRecentEvents(10));
        };

        updateData();

        const interval = setInterval(() => {
            if (isSimulating) {
                engine.simulateStep();
                updateData();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [engine, isSimulating]);

    const filteredBots = filterType === 'all'
        ? bots
        : bots.filter(b => b.type === filterType);

    const botTypes: { type: MicroBotType | 'all'; label: string }[] = [
        { type: 'all', label: '전체' },
        { type: 'pollinator', label: '수분' },
        { type: 'harvester', label: '수확' },
        { type: 'pest_hunter', label: '해충' },
        { type: 'health_monitor', label: '모니터' },
        { type: 'nutrient_carrier', label: '양분' },
        { type: 'photon_farmer', label: '광' },
    ];

    const assignTestTask = () => {
        const task: BotTask = {
            id: `task-${Date.now()}`,
            type: 'measure_health',
            priority: 5,
            target: {
                location: { x: 5000, y: 5000, z: 1000, zone: 'zone-5' },
                size: { width: 100, height: 100, depth: 50 }
            },
            startTime: new Date(),
            estimatedDuration: 300,
            progress: 0,
            status: 'pending'
        };
        engine.assignTask(task);
        setStats(engine.getSwarmStatistics());
        setBots(engine.getAllBots());
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">🤖</span>
                            군집 마이크로 로보틱스
                        </h2>
                        <div className="text-sm text-white/50">
                            100대의 자가 조직화 초소형 로봇
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSimulating(!isSimulating)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all ${isSimulating
                                    ? 'bg-red-500/20 border border-red-500 text-red-400'
                                    : 'bg-green-500/20 border border-green-500 text-green-400'
                                }`}
                        >
                            {isSimulating ? '⏸ 정지' : '▶ 시뮬레이션'}
                        </button>
                        <button
                            onClick={assignTestTask}
                            className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg text-purple-400"
                        >
                            📋 작업 할당
                        </button>
                    </div>
                </div>

                {/* 통계 */}
                {stats && (
                    <div className="grid grid-cols-6 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-white">{stats.totalBots}</div>
                            <div className="text-xs text-white/50">총 로봇</div>
                        </div>
                        <div className="bg-green-500/10 rounded-lg p-3 text-center border border-green-500/30">
                            <div className="text-2xl font-bold text-green-400">{stats.activeCount}</div>
                            <div className="text-xs text-white/50">작업 중</div>
                        </div>
                        <div className="bg-yellow-500/10 rounded-lg p-3 text-center border border-yellow-500/30">
                            <div className="text-2xl font-bold text-yellow-400">{stats.chargingCount}</div>
                            <div className="text-xs text-white/50">충전 중</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-cyan-400">{stats.efficiency.toFixed(0)}%</div>
                            <div className="text-xs text-white/50">효율</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-purple-400">{stats.coverage.toFixed(0)}%</div>
                            <div className="text-xs text-white/50">커버리지</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{stats.taskCompletion.today}</div>
                            <div className="text-xs text-white/50">오늘 완료</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* 로봇 목록 */}
                <div className="w-2/3 flex flex-col">
                    {/* 필터 */}
                    <div className="flex gap-2 mb-3">
                        {botTypes.map(bt => (
                            <button
                                key={bt.type}
                                onClick={() => setFilterType(bt.type)}
                                className={`px-3 py-1 rounded-lg text-sm transition-all ${filterType === bt.type
                                        ? 'bg-purple-500/30 border border-purple-400'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {bt.type !== 'all' && <span>{BOT_TYPE_ICONS[bt.type as MicroBotType]} </span>}
                                {bt.label}
                            </button>
                        ))}
                    </div>

                    {/* 로봇 그리드 */}
                    <div className="flex-1 overflow-y-auto glass rounded-xl p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {filteredBots.slice(0, 50).map(bot => (
                                <motion.div
                                    key={bot.id}
                                    onClick={() => setSelectedBot(bot)}
                                    whileHover={{ scale: 1.05 }}
                                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedBot?.id === bot.id
                                            ? 'bg-purple-500/30 border-2 border-purple-400'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{BOT_TYPE_ICONS[bot.type]}</span>
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: BOT_STATUS_COLORS[bot.status] }}
                                        />
                                    </div>
                                    <div className="text-xs font-mono text-white/70">
                                        {bot.id.slice(-3)}
                                    </div>
                                    <div className="mt-1">
                                        <div className="w-full bg-white/10 rounded-full h-1">
                                            <div
                                                className="bg-green-500 h-full rounded-full"
                                                style={{ width: `${bot.battery.level}%` }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 상세 정보 & 이벤트 */}
                <div className="w-1/3 flex flex-col gap-4">
                    {/* 선택된 봇 상세 */}
                    <div className="glass rounded-xl p-4 flex-1">
                        <h3 className="font-bold mb-3">🔍 봇 상세정보</h3>
                        {selectedBot ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-4xl">
                                        {BOT_TYPE_ICONS[selectedBot.type]}
                                    </div>
                                    <div>
                                        <div className="font-bold">{selectedBot.id}</div>
                                        <div className="text-sm text-white/50">{selectedBot.type}</div>
                                        <div
                                            className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
                                            style={{
                                                backgroundColor: `${BOT_STATUS_COLORS[selectedBot.status]}20`,
                                                color: BOT_STATUS_COLORS[selectedBot.status]
                                            }}
                                        >
                                            {selectedBot.status}
                                        </div>
                                    </div>
                                </div>

                                {/* 배터리 */}
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-white/50 mb-1">배터리</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white/10 rounded-full h-3">
                                            <div
                                                className={`h-full rounded-full ${selectedBot.battery.level > 50 ? 'bg-green-500' :
                                                        selectedBot.battery.level > 20 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${selectedBot.battery.level}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold">{selectedBot.battery.level.toFixed(0)}%</span>
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">
                                        예상 작동: {selectedBot.battery.estimatedRuntime.toFixed(0)}분
                                    </div>
                                </div>

                                {/* 위치 */}
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-white/50 mb-1">위치</div>
                                    <div className="text-sm font-mono">
                                        X: {selectedBot.position.x.toFixed(0)} |
                                        Y: {selectedBot.position.y.toFixed(0)} |
                                        Z: {selectedBot.position.z.toFixed(0)}
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">{selectedBot.position.zone}</div>
                                </div>

                                {/* 건강 */}
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-white/50 mb-2">상태</div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-white/50">모터: </span>
                                            <span className="text-green-400">{selectedBot.health.motors.toFixed(0)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-white/50">센서: </span>
                                            <span className="text-cyan-400">{selectedBot.health.sensors.toFixed(0)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-white/50">통신: </span>
                                            <span className="text-purple-400">{selectedBot.health.communication.toFixed(0)}%</span>
                                        </div>
                                        <div>
                                            <span className="text-white/50">구조: </span>
                                            <span>{selectedBot.health.structural.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 현재 작업 */}
                                {selectedBot.currentTask && (
                                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                                        <div className="text-xs text-white/50 mb-1">현재 작업</div>
                                        <div className="font-medium">{selectedBot.currentTask.type}</div>
                                        <div className="mt-2 bg-white/10 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-full rounded-full transition-all"
                                                style={{ width: `${selectedBot.currentTask.progress}%` }}
                                            />
                                        </div>
                                        <div className="text-xs text-white/40 mt-1">
                                            {selectedBot.currentTask.progress.toFixed(0)}% 완료
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-white/50 py-8">
                                로봇을 클릭하여 상세 정보를 확인하세요
                            </div>
                        )}
                    </div>

                    {/* 이벤트 로그 */}
                    <div className="glass rounded-xl p-4 h-48 overflow-y-auto">
                        <h3 className="font-bold mb-3">📋 이벤트 로그</h3>
                        <div className="space-y-2">
                            {events.length > 0 ? events.map(event => (
                                <div key={event.id} className={`p-2 rounded text-xs ${event.severity === 'critical' ? 'bg-red-500/20 border border-red-500/30' :
                                        event.severity === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                                            'bg-white/5'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <span>{event.details}</span>
                                        <span className="text-white/40">
                                            {new Date(event.timestamp).toLocaleTimeString('ko-KR')}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-white/50 py-4">
                                    이벤트 없음
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
