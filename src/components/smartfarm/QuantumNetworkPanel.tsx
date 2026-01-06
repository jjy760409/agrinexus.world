'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getQuantumCommunicationEngine,
    QuantumNode,
    QuantumChannel,
    QuantumKey,
    EntanglementPair,
    NODE_TYPE_ICONS,
    QKD_PROTOCOL_INFO,
    NetworkTopology,
    QKDProtocol
} from '@/lib/quantum/quantumCommunication';

export default function QuantumNetworkPanel() {
    const [nodes, setNodes] = useState<QuantumNode[]>([]);
    const [channels, setChannels] = useState<QuantumChannel[]>([]);
    const [keys, setKeys] = useState<QuantumKey[]>([]);
    const [entanglements, setEntanglements] = useState<EntanglementPair[]>([]);
    const [topology, setTopology] = useState<NetworkTopology | null>(null);
    const [selectedNode, setSelectedNode] = useState<QuantumNode | null>(null);
    const [activeTab, setActiveTab] = useState<'network' | 'keys' | 'entanglement' | 'security'>('network');
    const [selectedProtocol, setSelectedProtocol] = useState<QKDProtocol>('BB84');

    const engine = useMemo(() => getQuantumCommunicationEngine(), []);

    useEffect(() => {
        const updateData = () => {
            const status = engine.getNetworkStatus();
            setNodes(status.nodes);
            setChannels(status.channels);
            setKeys(status.keyPool);
            setEntanglements(status.entanglements);
            setTopology(engine.getNetworkTopology());
        };
        updateData();

        const interval = setInterval(updateData, 2000);
        return () => clearInterval(interval);
    }, [engine]);

    const generateKey = () => {
        if (nodes.length >= 2) {
            engine.generateQuantumKey(nodes[0].id, nodes[1].id, selectedProtocol);
            setKeys([...engine.getNetworkStatus().keyPool]);
        }
    };

    const createEntanglement = () => {
        if (nodes.length >= 2) {
            engine.createEntanglement(nodes[0].id, nodes[1].id);
            setEntanglements([...engine.getNetworkStatus().entanglements]);
        }
    };

    const tabs = [
        { id: 'network' as const, label: '네트워크', icon: '🌐' },
        { id: 'keys' as const, label: '양자 키', icon: '🔐' },
        { id: 'entanglement' as const, label: '얽힘', icon: '🔗' },
        { id: 'security' as const, label: '보안', icon: '🛡️' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': case 'active': case 'ready': return 'text-green-400';
            case 'syncing': case 'generating': return 'text-yellow-400';
            case 'offline': case 'error': return 'text-red-400';
            default: return 'text-white/60';
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">⚛️</span>
                            양자 통신 네트워크
                        </h2>
                        <div className="text-sm text-white/50">
                            QKD 암호화 · 양자 얽힘 · 절대 보안 채널
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-blue-400">{nodes.length}</div>
                            <div className="text-white/50">노드</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-green-400">{channels.length}</div>
                            <div className="text-white/50">채널</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-purple-400">{keys.length}</div>
                            <div className="text-white/50">키</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-2xl font-bold text-pink-400">{entanglements.length}</div>
                            <div className="text-white/50">얽힘</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* 네트워크 시각화 */}
                <div className="w-2/3 glass rounded-xl overflow-hidden relative">
                    {/* 네트워크 토폴로지 */}
                    <div className="absolute inset-0 p-8">
                        <svg className="w-full h-full">
                            {/* 채널 연결선 */}
                            {topology && topology.edges.map((edge, i) => {
                                const nodeA = topology.nodes.find(n => n.id === edge.source);
                                const nodeB = topology.nodes.find(n => n.id === edge.target);
                                if (!nodeA || !nodeB) return null;

                                const positions: Record<string, { x: number; y: number }> = {
                                    'hub-central': { x: 50, y: 50 },
                                    'relay-north': { x: 25, y: 25 },
                                    'relay-south': { x: 75, y: 75 },
                                    'sensor-cluster-1': { x: 15, y: 40 },
                                    'sensor-cluster-2': { x: 85, y: 60 },
                                    'satellite-link': { x: 50, y: 15 }
                                };

                                const posA = positions[edge.source] || { x: 50, y: 50 };
                                const posB = positions[edge.target] || { x: 50, y: 50 };

                                return (
                                    <g key={`edge-${i}`}>
                                        <motion.line
                                            x1={`${posA.x}%`} y1={`${posA.y}%`}
                                            x2={`${posB.x}%`} y2={`${posB.y}%`}
                                            stroke={edge.status === 'active' ? '#00ff88' : '#ff4444'}
                                            strokeWidth="2"
                                            strokeDasharray={edge.type === 'satellite_link' ? '5,5' : 'none'}
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                        />
                                        {/* 데이터 흐름 애니메이션 */}
                                        <motion.circle
                                            r="4"
                                            fill="#00ffff"
                                            animate={{
                                                cx: [`${posA.x}%`, `${posB.x}%`],
                                                cy: [`${posA.y}%`, `${posB.y}%`]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                        />
                                    </g>
                                );
                            })}

                            {/* 얽힘 표시 */}
                            {topology && topology.entanglements.map((ent, i) => {
                                const positions: Record<string, { x: number; y: number }> = {
                                    'hub-central': { x: 50, y: 50 },
                                    'relay-north': { x: 25, y: 25 },
                                    'relay-south': { x: 75, y: 75 },
                                };

                                const posA = positions[ent.nodeA] || { x: 50, y: 50 };
                                const posB = positions[ent.nodeB] || { x: 50, y: 50 };

                                return (
                                    <motion.line
                                        key={`ent-${i}`}
                                        x1={`${posA.x}%`} y1={`${posA.y}%`}
                                        x2={`${posB.x}%`} y2={`${posB.y}%`}
                                        stroke="#ff00ff"
                                        strokeWidth="3"
                                        strokeDasharray="10,5"
                                        opacity={0.7}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                );
                            })}
                        </svg>

                        {/* 노드 */}
                        {nodes.map(node => {
                            const positions: Record<string, { x: number; y: number }> = {
                                'hub-central': { x: 50, y: 50 },
                                'relay-north': { x: 25, y: 25 },
                                'relay-south': { x: 75, y: 75 },
                                'sensor-cluster-1': { x: 15, y: 40 },
                                'sensor-cluster-2': { x: 85, y: 60 },
                                'satellite-link': { x: 50, y: 15 }
                            };

                            const pos = positions[node.id] || { x: 50, y: 50 };

                            return (
                                <motion.div
                                    key={node.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                    onClick={() => setSelectedNode(node)}
                                >
                                    <div className={`relative p-3 rounded-xl transition-all ${selectedNode?.id === node.id
                                            ? 'bg-blue-500/40 border-2 border-blue-400'
                                            : 'bg-white/10 hover:bg-white/20'
                                        }`}>
                                        <div className="text-3xl mb-1">{NODE_TYPE_ICONS[node.type]}</div>
                                        <div className="text-xs text-center">{node.koreanName}</div>
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                                            } animate-pulse`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* 사이드 패널 */}
                <div className="w-1/3 glass rounded-xl p-4 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* 네트워크 탭 */}
                        {activeTab === 'network' && (
                            <motion.div
                                key="network"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🌐 노드 상태</h3>

                                {selectedNode ? (
                                    <div className="p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{NODE_TYPE_ICONS[selectedNode.type]}</span>
                                            <div>
                                                <div className="font-bold">{selectedNode.koreanName}</div>
                                                <div className={`text-sm ${getStatusColor(selectedNode.status)}`}>
                                                    {selectedNode.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">프로세서</span>
                                                <span>{selectedNode.hardware.processor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">큐빗 수</span>
                                                <span>{selectedNode.hardware.qubitCount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">결맞음 시간</span>
                                                <span>{selectedNode.hardware.coherenceTime}μs</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">키 버퍼</span>
                                                <span className="text-green-400">{selectedNode.keyBuffer}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-white/50 text-center py-4">
                                        노드를 클릭하여 상세 정보 확인
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {nodes.map(node => (
                                        <button
                                            key={node.id}
                                            onClick={() => setSelectedNode(node)}
                                            className={`w-full p-3 rounded-lg text-left transition-all ${selectedNode?.id === node.id
                                                    ? 'bg-blue-500/30 border border-blue-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{NODE_TYPE_ICONS[node.type]} {node.koreanName}</span>
                                                <span className={getStatusColor(node.status)}>{node.status}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 양자 키 탭 */}
                        {activeTab === 'keys' && (
                            <motion.div
                                key="keys"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🔐 양자 키 분배 (QKD)</h3>

                                {/* 프로토콜 선택 */}
                                <div className="grid grid-cols-2 gap-2">
                                    {(Object.keys(QKD_PROTOCOL_INFO) as QKDProtocol[]).slice(0, 4).map(proto => (
                                        <button
                                            key={proto}
                                            onClick={() => setSelectedProtocol(proto)}
                                            className={`p-2 rounded-lg text-sm ${selectedProtocol === proto
                                                    ? 'bg-purple-500/30 border border-purple-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-bold">{QKD_PROTOCOL_INFO[proto].name}</div>
                                            <div className="text-xs text-white/50">{QKD_PROTOCOL_INFO[proto].security}</div>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={generateKey}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold"
                                >
                                    + 양자 키 생성
                                </button>

                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {keys.slice(-5).reverse().map(key => (
                                        <div key={key.id} className="p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs">{key.id.slice(0, 20)}...</span>
                                                <span className={`text-xs ${getStatusColor(key.status)}`}>{key.status}</span>
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {key.protocol} · {key.length}bit · {key.sourceNode} → {key.destinationNode}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* 얽힘 탭 */}
                        {activeTab === 'entanglement' && (
                            <motion.div
                                key="entanglement"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🔗 양자 얽힘</h3>

                                <button
                                    onClick={createEntanglement}
                                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg font-bold"
                                >
                                    + 얽힘 쌍 생성
                                </button>

                                <div className="space-y-2">
                                    {entanglements.map(ent => (
                                        <div key={ent.id} className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-pink-400">{ent.bellState}</span>
                                                <span className="text-xs">충실도: {(ent.fidelity * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {ent.nodeA.nodeId}[Q{ent.nodeA.qubitId}] ⟷ {ent.nodeB.nodeId}[Q{ent.nodeB.qubitId}]
                                            </div>
                                        </div>
                                    ))}
                                    {entanglements.length === 0 && (
                                        <div className="text-center py-4 text-white/50">
                                            아직 얽힘 쌍이 없습니다
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* 보안 탭 */}
                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold">🛡️ 보안 상태</h3>

                                <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-center">
                                    <div className="text-4xl mb-2">✅</div>
                                    <div className="text-lg font-bold text-green-400">MAXIMUM 보안</div>
                                    <div className="text-sm text-white/60">모든 채널 양자 암호화 적용</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                                        <span>QBER (Quantum Bit Error Rate)</span>
                                        <span className="text-green-400">2.1%</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                                        <span>보안 인시던트</span>
                                        <span className="text-green-400">0건</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg flex justify-between">
                                        <span>업타임</span>
                                        <span className="text-green-400">99.99%</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
