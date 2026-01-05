'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useOSStore } from '@/store/useOSStore';
import { CLUSTERS, ClusterType } from '@/types/systems';

export default function UniverseCore() {
    const { globalStats, alerts, clusters, setCurrentCluster } = useOSStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Neural network animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const nodes: Array<{ x: number; y: number; vx: number; vy: number; color: string }> = [];
        const colors = ['#00ff88', '#00d4ff', '#7b2fff', '#ff2d92'];

        for (let i = 0; i < 50; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let animationId: number;

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw nodes
            nodes.forEach((node, i) => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                // Draw connections
                nodes.forEach((other, j) => {
                    if (i >= j) return;
                    const dist = Math.hypot(node.x - other.x, node.y - other.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 255, 136, ${(100 - dist) / 300})`;
                        ctx.stroke();
                    }
                });

                // Draw node
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
                gradient.addColorStop(0, node.color);
                gradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const clusterList = Object.entries(CLUSTERS) as [ClusterType, typeof CLUSTERS[ClusterType]][];

    const recentAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8">
                {/* Background Animation */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-30"
                />

                <div className="relative z-10">
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <motion.div
                            className="inline-block w-24 h-24 md:w-32 md:h-32 mb-4 relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary-green)] via-[var(--primary-cyan)] to-[var(--primary-purple)] opacity-20 blur-xl" />
                            <div className="absolute inset-2 rounded-full border border-[var(--primary-green)]/30" />
                            <div className="absolute inset-4 rounded-full border border-[var(--primary-cyan)]/30" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl md:text-6xl">🌌</span>
                            </div>
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-bold gradient-text font-[family-name:var(--font-orbitron)] mb-3">
                            AgriNexus World OS
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 mb-4">
                            초지능 완전 자동화 스마트팜 운영체제
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-sm bg-[var(--primary-green)]/20 border border-[var(--primary-green)]/50 text-[var(--primary-green)]">
                                🔗 500+ AI 시스템
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm bg-[var(--primary-cyan)]/20 border border-[var(--primary-cyan)]/50 text-[var(--primary-cyan)]">
                                🧠 AGI 통합
                            </span>
                            <span className="px-3 py-1 rounded-full text-sm bg-[var(--primary-purple)]/20 border border-[var(--primary-purple)]/50 text-[var(--primary-purple)]">
                                🚀 우주 농업
                            </span>
                        </div>
                    </motion.div>

                    {/* Global Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: '활성 시스템', value: `${globalStats.activeSystems}/${globalStats.totalSystems}`, icon: '🔗', color: 'var(--primary-green)' },
                            { label: '글로벌 효율', value: `${globalStats.globalEfficiency}%`, icon: '📊', color: 'var(--primary-cyan)' },
                            { label: 'AI 결정', value: globalStats.aiDecisions.toLocaleString(), icon: '🧠', color: 'var(--primary-purple)' },
                            { label: '에너지 절감', value: `${globalStats.energySaved}%`, icon: '⚡', color: 'var(--status-success)' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <span className="text-2xl mb-2 block">{stat.icon}</span>
                                <div className="font-[family-name:var(--font-orbitron)] text-xl md:text-2xl font-bold" style={{ color: stat.color }}>
                                    {stat.value}
                                </div>
                                <div className="text-xs text-white/50">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clusters Grid */}
            <div>
                <h2 className="text-xl font-bold font-[family-name:var(--font-orbitron)] mb-4 flex items-center gap-2">
                    <span>🌐</span> 시스템 클러스터
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {clusterList.map(([key, cluster], i) => (
                        <motion.button
                            key={key}
                            onClick={() => setCurrentCluster(key)}
                            className="p-4 rounded-xl glass border border-white/10 hover:border-white/30 transition-all group text-left"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span
                                    className="text-2xl"
                                    style={{ filter: `drop-shadow(0 0 10px ${cluster.color})` }}
                                >
                                    {cluster.icon}
                                </span>
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: cluster.status === 'active' ? 'var(--status-success)' : 'var(--status-warning)',
                                        boxShadow: cluster.status === 'active' ? '0 0 8px var(--status-success)' : 'none'
                                    }}
                                />
                            </div>
                            <h3 className="font-medium text-sm mb-1 group-hover:text-white transition-colors">
                                {cluster.koreanName}
                            </h3>
                            <div className="text-xs text-white/40">
                                {cluster.systemCount} 시스템
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Quick Access - Super Intelligence Control */}
            <Link href="/superintelligence">
                <motion.div
                    className="p-6 rounded-2xl glass border-2 border-[var(--primary-purple)]/50 hover:border-[var(--primary-purple)] transition-all cursor-pointer group relative overflow-hidden"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {/* Animated Background */}
                    <motion.div
                        className="absolute inset-0 opacity-10"
                        style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl flex items-center justify-center relative"
                                style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #00ff88)' }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-1 rounded-lg bg-[var(--bg-dark)] flex items-center justify-center">
                                    <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Ω</span>
                                </div>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] gradient-text group-hover:text-white transition-colors">
                                    초지능 통합 컨트롤
                                </h3>
                                <p className="text-sm text-white/60">
                                    500 살아있는 시스템 · 글로벌 정보 수집 · 자동 진화
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <motion.span
                                    className="px-2 py-1 text-xs rounded-full bg-[var(--primary-purple)]/20 text-[var(--primary-purple)]"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    ● SUPER AI
                                </motion.span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">💎 500 시스템</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🌍 글로벌</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - Hyper Evolution AI */}
            <Link href="/hyperevolution">
                <motion.div
                    className="p-6 rounded-2xl glass border-2 border-[#ffa500]/50 hover:border-[#ffa500] transition-all cursor-pointer group relative overflow-hidden"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {/* DNA Helix Background */}
                    <motion.div
                        className="absolute inset-0 opacity-5"
                        style={{ background: 'conic-gradient(from 0deg, #00ff88, #00d4ff, #7b2fff, #ff2d92, #ffa500, #00ff88)' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ffa500] via-[#ff2d92] to-[#7b2fff]"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.span
                                    className="text-3xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    🧬
                                </motion.span>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] gradient-text group-hover:text-white transition-colors">
                                    초진화 AI 코어
                                </h3>
                                <p className="text-sm text-white/60">
                                    양자 지능 · 뉴럴 메시 · 자율 로봇 · 무한 진화
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <motion.span
                                    className="px-2 py-1 text-xs rounded-full bg-[#ffa500]/20 text-[#ffa500]"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    ● EVOLVING
                                </motion.span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🔮 양자</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🤖 로봇</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - Smart Farm Designer */}
            <Link href="/smartfarm">
                <motion.div
                    className="p-6 rounded-2xl glass border border-[var(--primary-green)]/30 hover:border-[var(--primary-green)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-green)] to-[var(--primary-cyan)] flex items-center justify-center">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-green)] group-hover:text-white transition-colors">
                                    스마트팜 3D 설계 시스템
                                </h3>
                                <p className="text-sm text-white/60">
                                    AI 전자동화 실내 스마트팜 가상 설계 · 장비 설정 · 시뮬레이션
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🏗️ 3D 설계</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">⚙️ 장비</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🤖 AI 에이전트</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">📊 시뮬레이션</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - Lifeforce Dashboard */}
            <Link href="/lifeforce">
                <motion.div
                    className="p-6 rounded-2xl glass border border-[var(--primary-purple)]/30 hover:border-[var(--primary-purple)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--status-danger)] flex items-center justify-center"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            >
                                <span className="text-3xl">💚</span>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-purple)] group-hover:text-white transition-colors">
                                    생명력 대시보드
                                </h3>
                                <p className="text-sm text-white/60">
                                    초지능 에이전트 · 자율 의식 · 글로벌 데이터 연동
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🤖 15 에이전트</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">💚 생명력</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🌍 글로벌</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - Digital Twin */}
            <Link href="/digitaltwin">
                <motion.div
                    className="p-6 rounded-2xl glass border border-[var(--primary-cyan)]/30 hover:border-[var(--primary-cyan)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-purple)] flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <span className="text-2xl">🌐</span>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)] group-hover:text-white transition-colors">
                                    디지털 트윈
                                </h3>
                                <p className="text-sm text-white/60">
                                    실시간 동기화 · 예측 유지보수 · 스마트 알림
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <motion.span
                                    className="px-2 py-1 text-xs rounded-full bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)]"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    ● SYNCED
                                </motion.span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🔧 유지보수</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - Agent Swarm Network */}
            <Link href="/swarm">
                <motion.div
                    className="p-6 rounded-2xl glass border border-[var(--primary-cyan)]/30 hover:border-[var(--primary-cyan)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-cyan)] to-[var(--primary-green)] flex items-center justify-center relative overflow-hidden"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <span className="text-2xl font-bold font-[family-name:var(--font-orbitron)]">Ω</span>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-[var(--primary-cyan)] group-hover:text-white transition-colors">
                                    에이전트 스웜 네트워크
                                </h3>
                                <p className="text-sm text-white/60">
                                    500+ 초지능 에이전트 · 실시간 협업 · 자가 진화
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <motion.span
                                    className="px-2 py-1 text-xs rounded-full bg-white/10"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    ● LIVE
                                </motion.span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🧠 500+ 에이전트</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">⚡ 자가 업그레이드</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Quick Access - System Core */}
            <Link href="/system">
                <motion.div
                    className="p-6 rounded-2xl glass border border-[var(--status-success)]/30 hover:border-[var(--status-success)] transition-all cursor-pointer group"
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--status-success)] to-[var(--primary-cyan)] flex items-center justify-center"
                                animate={{
                                    boxShadow: ['0 0 10px #00ff88', '0 0 25px #00d4ff', '0 0 10px #00ff88']
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <span className="text-3xl">💚</span>
                            </motion.div>
                            <div>
                                <h3 className="text-lg font-bold font-[family-name:var(--font-orbitron)] text-[var(--status-success)] group-hover:text-white transition-colors">
                                    시스템 코어
                                </h3>
                                <p className="text-sm text-white/60">
                                    자가 치유 · 초거대 AI · 데이터 연동 · 모바일 최적화
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2">
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🔧 자가 치유</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">🧠 IQ 350+</span>
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10">📱 모바일</span>
                            </div>
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    </div>
                </motion.div>
            </Link>

            {/* Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold mb-4 flex items-center gap-2">
                        <span>🔔</span> 실시간 알림
                    </h3>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {recentAlerts.map((alert, i) => (
                            <motion.div
                                key={alert.id}
                                className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${alert.type === 'success' ? 'bg-[var(--status-success)]/10 border-l-[var(--status-success)]' :
                                    alert.type === 'warning' ? 'bg-[var(--status-warning)]/10 border-l-[var(--status-warning)]' :
                                        alert.type === 'danger' ? 'bg-[var(--status-danger)]/10 border-l-[var(--status-danger)]' :
                                            'bg-[var(--status-info)]/10 border-l-[var(--status-info)]'
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-white/40 font-[family-name:var(--font-orbitron)]">
                                        {alert.systemCode}
                                    </div>
                                    <div className="font-medium text-sm">{alert.title}</div>
                                    <div className="text-xs text-white/50 truncate">{alert.message}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* UNIVERSE System Status */}
                <motion.div
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold mb-4 flex items-center gap-2">
                        <span>🌌</span> UNIVERSE 코어 상태
                    </h3>

                    <div className="space-y-4">
                        {[
                            { name: 'AGI 통합 레이어', progress: 94, color: 'var(--primary-green)' },
                            { name: '글로벌 동기화', progress: 99, color: 'var(--primary-cyan)' },
                            { name: '자율 의사결정', progress: 87, color: 'var(--primary-purple)' },
                            { name: '실시간 데이터 처리', progress: 96, color: 'var(--status-success)' },
                        ].map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/70">{item.name}</span>
                                    <span className="font-[family-name:var(--font-orbitron)]" style={{ color: item.color }}>
                                        {item.progress}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.progress}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
