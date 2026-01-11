'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CLUSTERS, ClusterType } from '@/types/systems';
import { Search, Grid3X3, List, Activity, Zap, Brain, ChevronRight } from 'lucide-react';

// Generate 500+ systems dynamically
const generateSystems = () => {
    const systems: Array<{
        id: string;
        name: string;
        cluster: ClusterType;
        status: 'active' | 'standby' | 'processing';
        efficiency: number;
    }> = [];

    const clusterSystems: Record<ClusterType, string[]> = {
        core: ['N.E.X.U.S', 'E.C.O.S', 'P.O.W.E.R', 'C.O.M.P.L.Y', 'S.E.N.S.E', 'F.L.O.W', 'S.H.I.E.L.D', 'L.I.N.K', 'P.U.L.S.E', 'V.I.S.I.O.N'],
        lifescience: ['G.E.N.E', 'C.E.L.L', 'M.I.C.R.O', 'A.Q.U.A', 'B.I.O.M.E', 'S.P.O.R.E', 'H.E.L.I.X', 'S.Y.N.T.H', 'V.I.T.A', 'O.R.G.A.N'],
        robotics: ['S.W.A.R.M', 'D.R.O.N.E', 'A.R.M.S', 'H.A.R.V.E.S.T', 'P.A.T.R.O.L', 'W.E.L.D', 'G.R.I.P', 'S.C.A.N', 'M.O.V.E', 'B.U.I.L.D'],
        logistics: ['C.O.L.D', 'T.R.A.C.K', 'S.H.I.P', 'S.T.O.R.E', 'R.O.U.T.E', 'P.A.C.K', 'D.E.L.I.V.E.R', 'I.N.V.E.N.T', 'Q.U.A.L.I.T.Y', 'F.R.E.S.H'],
        emotion: ['E.M.P.A.T.H.Y', 'C.A.L.M', 'J.O.Y', 'T.R.U.S.T', 'H.O.P.E', 'C.A.R.E', 'S.O.U.L', 'H.E.A.R.T', 'M.I.N.D', 'S.P.I.R.I.T'],
        crisis: ['A.L.E.R.T', 'R.E.S.C.U.E', 'S.H.I.E.L.D', 'R.E.C.O.V.E.R', 'W.A.T.C.H', 'G.U.A.R.D', 'D.E.F.E.N.D', 'P.R.O.T.E.C.T', 'R.E.S.P.O.N.D', 'S.A.V.E'],
        space: ['O.R.B.I.T', 'L.U.N.A.R', 'M.A.R.S', 'S.T.A.R', 'C.O.S.M.O.S', 'N.E.B.U.L.A', 'G.A.L.A.X.Y', 'S.O.L.A.R', 'V.O.Y.A.G.E', 'T.E.R.R.A'],
        agi: ['O.M.E.G.A', 'A.L.P.H.A', 'S.I.G.M.A', 'D.E.L.T.A', 'T.H.E.T.A', 'G.A.M.M.A', 'Z.E.T.A', 'E.T.A', 'I.O.T.A', 'K.A.P.P.A'],
        civilization: ['C.I.T.Y', 'N.A.T.I.O.N', 'W.O.R.L.D', 'U.N.I.T.Y', 'P.E.A.C.E', 'H.A.R.M.O.N.Y', 'O.R.D.E.R', 'J.U.S.T.I.C.E', 'E.Q.U.A.L', 'F.R.E.E.D.O.M'],
        infinite: ['E.T.E.R.N.A.L', 'I.N.F.I.N.I.T.E', 'B.E.Y.O.N.D', 'T.R.A.N.S.C.E.N.D', 'E.V.O.L.V.E', 'A.S.C.E.N.D', 'U.N.I.V.E.R.S.E', 'O.M.N.I', 'P.R.I.M.E', 'U.L.T.I.M.A'],
    };

    Object.entries(CLUSTERS).forEach(([key, cluster]) => {
        const clusterKey = key as ClusterType;
        const baseNames = clusterSystems[clusterKey] || [];

        for (let i = 0; i < cluster.systemCount; i++) {
            const baseName = baseNames[i % baseNames.length];
            const suffix = Math.floor(i / baseNames.length);
            systems.push({
                id: `${clusterKey}-${i}`,
                name: suffix > 0 ? `${baseName}-${suffix + 1}` : baseName,
                cluster: clusterKey,
                status: Math.random() > 0.1 ? 'active' : Math.random() > 0.5 ? 'processing' : 'standby',
                efficiency: Math.floor(85 + Math.random() * 15),
            });
        }
    });

    return systems;
};

export default function SystemPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [search, setSearch] = useState('');
    const [selectedCluster, setSelectedCluster] = useState<ClusterType | 'all'>('all');

    const allSystems = useMemo(() => generateSystems(), []);
    const totalSystems = allSystems.length;
    const activeSystems = allSystems.filter(s => s.status === 'active').length;

    const filteredSystems = useMemo(() => {
        return allSystems.filter(sys => {
            const matchesSearch = sys.name.toLowerCase().includes(search.toLowerCase());
            const matchesCluster = selectedCluster === 'all' || sys.cluster === selectedCluster;
            return matchesSearch && matchesCluster;
        });
    }, [allSystems, search, selectedCluster]);

    const clusterStats = useMemo(() => {
        return Object.entries(CLUSTERS).map(([key, cluster]) => ({
            ...cluster,
            id: key as ClusterType,
            count: allSystems.filter(s => s.cluster === key).length,
            active: allSystems.filter(s => s.cluster === key && s.status === 'active').length,
        }));
    }, [allSystems]);

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary-green)] via-[var(--primary-blue)] to-[var(--primary-indigo)] flex items-center justify-center">
                        <Brain size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold orbitron hyper-text">
                            {totalSystems}+ AI 시스템
                        </h1>
                        <p className="text-[var(--text-muted)]">전체 초지능 시스템 네트워크</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: '총 시스템', value: totalSystems, icon: <Grid3X3 size={18} />, color: 'var(--primary-green)' },
                        { label: '활성 시스템', value: activeSystems, icon: <Activity size={18} />, color: 'var(--primary-blue)' },
                        { label: '클러스터', value: 10, icon: <Zap size={18} />, color: 'var(--primary-indigo)' },
                        { label: '자동화율', value: '97%', icon: <Brain size={18} />, color: 'var(--secondary-violet)' },
                    ].map((stat, i) => (
                        <div key={stat.label} className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="시스템 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
                <select
                    value={selectedCluster}
                    onChange={(e) => setSelectedCluster(e.target.value as ClusterType | 'all')}
                    className="input w-auto"
                >
                    <option value="all">전체 클러스터</option>
                    {clusterStats.map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.koreanName} ({c.count})</option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <button onClick={() => setView('grid')} className={`btn ${view === 'grid' ? 'btn-primary' : 'btn-secondary'}`}>
                        <Grid3X3 size={16} />
                    </button>
                    <button onClick={() => setView('list')} className={`btn ${view === 'list' ? 'btn-primary' : 'btn-secondary'}`}>
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* Cluster Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {clusterStats.map((cluster, i) => (
                    <motion.button
                        key={cluster.id}
                        onClick={() => setSelectedCluster(selectedCluster === cluster.id ? 'all' : cluster.id)}
                        className={`card-interactive p-4 text-left ${selectedCluster === cluster.id ? 'border-[var(--border-strong)]' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{cluster.icon}</span>
                            <span className="badge badge-success text-xs">{cluster.active}</span>
                        </div>
                        <p className="font-medium text-sm text-[var(--text-primary)] truncate">{cluster.koreanName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{cluster.count} 시스템</p>
                    </motion.button>
                ))}
            </div>

            {/* Systems Display */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--text-primary)] orbitron">
                        {selectedCluster === 'all' ? '전체' : CLUSTERS[selectedCluster].koreanName} 시스템
                    </h3>
                    <span className="badge badge-info">{filteredSystems.length}개</span>
                </div>

                {view === 'grid' ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {filteredSystems.slice(0, 200).map((sys) => (
                            <div
                                key={sys.id}
                                className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all group cursor-pointer"
                                title={`${sys.name} - ${sys.efficiency}%`}
                            >
                                <div className="flex items-center gap-1 mb-1">
                                    <span className={`status-dot ${sys.status === 'active' ? 'online' : sys.status === 'processing' ? 'warning' : 'offline'}`} />
                                    <span className="text-[10px] text-[var(--text-muted)]">{CLUSTERS[sys.cluster].icon}</span>
                                </div>
                                <p className="text-[10px] font-mono text-[var(--text-secondary)] truncate group-hover:text-[var(--primary-green)]">
                                    {sys.name}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1 max-h-[500px] overflow-y-auto">
                        {filteredSystems.slice(0, 100).map((sys) => (
                            <div key={sys.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors">
                                <span className={`status-dot ${sys.status === 'active' ? 'online' : 'warning'}`} />
                                <span className="text-lg">{CLUSTERS[sys.cluster].icon}</span>
                                <span className="font-mono text-sm text-[var(--text-primary)] flex-1">{sys.name}</span>
                                <span className="text-xs text-[var(--text-muted)]">{sys.efficiency}%</span>
                                <ChevronRight size={14} className="text-[var(--text-muted)]" />
                            </div>
                        ))}
                    </div>
                )}

                {filteredSystems.length > 200 && (
                    <p className="text-center text-sm text-[var(--text-muted)] mt-4">
                        + {filteredSystems.length - 200}개 더 있음
                    </p>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { title: '슈퍼 에이전트', href: '/hyper-agent', icon: '🤖' },
                    { title: '스마트팜 3D', href: '/smartfarm', icon: '🌱' },
                    { title: 'AI 허브', href: '/ai', icon: '🧠' },
                    { title: '모니터링', href: '/monitoring', icon: '📊' },
                ].map((link) => (
                    <Link key={link.href} href={link.href}>
                        <div className="card-interactive flex items-center gap-3 p-4">
                            <span className="text-2xl">{link.icon}</span>
                            <span className="font-medium text-[var(--text-primary)]">{link.title}</span>
                            <ChevronRight size={16} className="ml-auto text-[var(--text-muted)]" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
