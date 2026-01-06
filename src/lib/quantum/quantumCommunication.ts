// AgriNexus World OS - 양자 통신 네트워크
// Quantum Communication Network - 세계 최초 양자 암호화 스마트팜 통신

// ============================================
// 타입 정의
// ============================================

export interface QuantumNetwork {
    id: string;
    name: string;
    nodes: QuantumNode[];
    channels: QuantumChannel[];
    entanglements: EntanglementPair[];
    keyPool: QuantumKey[];
    status: NetworkStatus;
    metrics: NetworkMetrics;
    securityLevel: SecurityLevel;
    createdAt: Date;
}

export interface QuantumNode {
    id: string;
    name: string;
    koreanName: string;
    type: NodeType;
    location: NodeLocation;
    hardware: QuantumHardware;
    status: NodeStatus;
    connections: string[];      // 연결된 노드 IDs
    entangledWith: string[];    // 얽힘 상태 노드 IDs
    keyBuffer: number;          // 사용 가능한 키 수
    qubits: QubitState[];
    lastHeartbeat: Date;
}

export type NodeType =
    | 'hub'                // 중앙 허브
    | 'relay'              // 중계 노드
    | 'endpoint'           // 단말 노드
    | 'sensor_cluster'     // 센서 클러스터
    | 'edge_device'        // 엣지 디바이스
    | 'mobile'             // 모바일
    | 'satellite';         // 위성

export type NodeStatus = 'online' | 'offline' | 'syncing' | 'entangling' | 'key_generation' | 'maintenance';
export type NetworkStatus = 'operational' | 'degraded' | 'emergency' | 'offline';
export type SecurityLevel = 'standard' | 'enhanced' | 'maximum' | 'military';

export interface NodeLocation {
    name: string;
    coordinates: { lat: number; lng: number };
    facility: string;
    floor?: number;
    zone?: string;
}

export interface QuantumHardware {
    processor: string;
    qubitCount: number;
    coherenceTime: number;      // microseconds
    gateError: number;          // %
    readoutError: number;       // %
    connectionType: 'fiber' | 'satellite' | 'free_space';
    wavelength: number;         // nm
}

export interface QubitState {
    id: number;
    state: 'superposition' | 'collapsed_0' | 'collapsed_1' | 'entangled';
    coherenceRemaining: number; // %
    entangledPartner?: { nodeId: string; qubitId: number };
    lastMeasurement?: Date;
}

// ============================================
// 양자 채널 및 얽힘
// ============================================

export interface QuantumChannel {
    id: string;
    nodeA: string;
    nodeB: string;
    type: ChannelType;
    status: ChannelStatus;
    bandwidth: number;          // qubits/second
    latency: number;            // microseconds
    errorRate: number;          // %
    distance: number;           // km
    lastSync: Date;
    metrics: ChannelMetrics;
}

export type ChannelType = 'optical_fiber' | 'free_space' | 'satellite_link' | 'trusted_node';
export type ChannelStatus = 'active' | 'idle' | 'error' | 'calibrating';

export interface ChannelMetrics {
    throughput: number;         // bits/second (quantum key rate)
    availability: number;       // %
    qber: number;               // Quantum Bit Error Rate
    snr: number;                // Signal to Noise Ratio
    photonLoss: number;         // dB
}

export interface EntanglementPair {
    id: string;
    nodeA: { nodeId: string; qubitId: number };
    nodeB: { nodeId: string; qubitId: number };
    bellState: BellState;
    fidelity: number;           // 0-1
    createdAt: Date;
    expiresAt: Date;
    verified: boolean;
}

export type BellState = 'phi_plus' | 'phi_minus' | 'psi_plus' | 'psi_minus';

// ============================================
// 양자 키 및 암호화
// ============================================

export interface QuantumKey {
    id: string;
    key: string;                // Base64 encoded
    length: number;             // bits
    sourceNode: string;
    destinationNode: string;
    protocol: QKDProtocol;
    status: KeyStatus;
    createdAt: Date;
    expiresAt: Date;
    usedAt?: Date;
    securityLevel: SecurityLevel;
    verificationHash: string;
}

export type QKDProtocol = 'BB84' | 'E91' | 'B92' | 'SARG04' | 'COW' | 'DPS';
export type KeyStatus = 'generating' | 'ready' | 'in_use' | 'expired' | 'compromised';

export interface EncryptedMessage {
    id: string;
    sender: string;
    receiver: string;
    keyId: string;
    ciphertext: string;
    timestamp: Date;
    verified: boolean;
    priority: MessagePriority;
    type: MessageType;
}

export type MessagePriority = 'low' | 'normal' | 'high' | 'critical';
export type MessageType =
    | 'sensor_data'
    | 'control_command'
    | 'alert'
    | 'configuration'
    | 'financial'
    | 'logistics'
    | 'system';

export interface NetworkMetrics {
    totalNodes: number;
    activeNodes: number;
    totalChannels: number;
    activeChannels: number;
    keyGenerationRate: number;   // keys/second
    averageQBER: number;
    totalKeysGenerated: number;
    totalMessagesSecured: number;
    uptime: number;              // %
    securityIncidents: number;
}

// ============================================
// 양자 통신 엔진
// ============================================

export class QuantumCommunicationEngine {
    private network: QuantumNetwork;
    private messageQueue: EncryptedMessage[] = [];
    private securityLog: SecurityEvent[] = [];

    constructor() {
        this.network = this.initializeNetwork();
    }

    private initializeNetwork(): QuantumNetwork {
        const nodes = this.createInitialNodes();
        const channels = this.createInitialChannels(nodes);

        return {
            id: 'qnet-agrinexus-001',
            name: 'AgriNexus Quantum Network',
            nodes,
            channels,
            entanglements: [],
            keyPool: [],
            status: 'operational',
            metrics: {
                totalNodes: nodes.length,
                activeNodes: nodes.length,
                totalChannels: channels.length,
                activeChannels: channels.length,
                keyGenerationRate: 1000,
                averageQBER: 0.02,
                totalKeysGenerated: 0,
                totalMessagesSecured: 0,
                uptime: 99.99,
                securityIncidents: 0
            },
            securityLevel: 'maximum',
            createdAt: new Date()
        };
    }

    private createInitialNodes(): QuantumNode[] {
        return [
            {
                id: 'hub-central',
                name: 'Central Hub',
                koreanName: '중앙 허브',
                type: 'hub',
                location: { name: 'AgriNexus HQ', coordinates: { lat: 36.5684, lng: 127.2570 }, facility: 'Main Building' },
                hardware: { processor: 'IBM Quantum Falcon', qubitCount: 64, coherenceTime: 100, gateError: 0.1, readoutError: 0.5, connectionType: 'fiber', wavelength: 1550 },
                status: 'online',
                connections: ['relay-north', 'relay-south', 'satellite-link'],
                entangledWith: [],
                keyBuffer: 1000,
                qubits: this.initializeQubits(64),
                lastHeartbeat: new Date()
            },
            {
                id: 'relay-north',
                name: 'Northern Relay',
                koreanName: '북부 중계소',
                type: 'relay',
                location: { name: 'Northern Farm', coordinates: { lat: 37.5665, lng: 126.9780 }, facility: 'Seoul Data Center' },
                hardware: { processor: 'Rigetti Aspen-M', qubitCount: 32, coherenceTime: 80, gateError: 0.15, readoutError: 0.8, connectionType: 'fiber', wavelength: 1550 },
                status: 'online',
                connections: ['hub-central', 'sensor-cluster-1'],
                entangledWith: [],
                keyBuffer: 500,
                qubits: this.initializeQubits(32),
                lastHeartbeat: new Date()
            },
            {
                id: 'relay-south',
                name: 'Southern Relay',
                koreanName: '남부 중계소',
                type: 'relay',
                location: { name: 'Southern Farm', coordinates: { lat: 35.1796, lng: 129.0756 }, facility: 'Busan Center' },
                hardware: { processor: 'IonQ Harmony', qubitCount: 32, coherenceTime: 200, gateError: 0.05, readoutError: 0.3, connectionType: 'fiber', wavelength: 1550 },
                status: 'online',
                connections: ['hub-central', 'sensor-cluster-2'],
                entangledWith: [],
                keyBuffer: 500,
                qubits: this.initializeQubits(32),
                lastHeartbeat: new Date()
            },
            {
                id: 'sensor-cluster-1',
                name: 'Sensor Cluster Alpha',
                koreanName: '센서 클러스터 알파',
                type: 'sensor_cluster',
                location: { name: 'Smart Farm Zone A', coordinates: { lat: 36.8, lng: 127.1 }, facility: 'Greenhouse A', zone: 'A-1' },
                hardware: { processor: 'Quantum Edge QE-100', qubitCount: 8, coherenceTime: 50, gateError: 0.5, readoutError: 1.0, connectionType: 'fiber', wavelength: 1310 },
                status: 'online',
                connections: ['relay-north'],
                entangledWith: [],
                keyBuffer: 100,
                qubits: this.initializeQubits(8),
                lastHeartbeat: new Date()
            },
            {
                id: 'sensor-cluster-2',
                name: 'Sensor Cluster Beta',
                koreanName: '센서 클러스터 베타',
                type: 'sensor_cluster',
                location: { name: 'Smart Farm Zone B', coordinates: { lat: 35.2, lng: 128.9 }, facility: 'Greenhouse B', zone: 'B-1' },
                hardware: { processor: 'Quantum Edge QE-100', qubitCount: 8, coherenceTime: 50, gateError: 0.5, readoutError: 1.0, connectionType: 'fiber', wavelength: 1310 },
                status: 'online',
                connections: ['relay-south'],
                entangledWith: [],
                keyBuffer: 100,
                qubits: this.initializeQubits(8),
                lastHeartbeat: new Date()
            },
            {
                id: 'satellite-link',
                name: 'Satellite Uplink',
                koreanName: '위성 업링크',
                type: 'satellite',
                location: { name: 'Ground Station', coordinates: { lat: 36.5, lng: 127.3 }, facility: 'Satellite Ground Station' },
                hardware: { processor: 'SpaceQ Micius-II', qubitCount: 16, coherenceTime: 30, gateError: 0.8, readoutError: 1.5, connectionType: 'satellite', wavelength: 850 },
                status: 'online',
                connections: ['hub-central'],
                entangledWith: [],
                keyBuffer: 200,
                qubits: this.initializeQubits(16),
                lastHeartbeat: new Date()
            }
        ];
    }

    private initializeQubits(count: number): QubitState[] {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            state: 'superposition' as const,
            coherenceRemaining: 100,
            lastMeasurement: undefined
        }));
    }

    private createInitialChannels(nodes: QuantumNode[]): QuantumChannel[] {
        const channels: QuantumChannel[] = [];

        for (const node of nodes) {
            for (const connId of node.connections) {
                // 중복 방지
                if (!channels.some(c =>
                    (c.nodeA === node.id && c.nodeB === connId) ||
                    (c.nodeA === connId && c.nodeB === node.id)
                )) {
                    const targetNode = nodes.find(n => n.id === connId);
                    if (!targetNode) continue;

                    const distance = this.calculateDistance(
                        node.location.coordinates,
                        targetNode.location.coordinates
                    );

                    channels.push({
                        id: `ch-${node.id}-${connId}`,
                        nodeA: node.id,
                        nodeB: connId,
                        type: targetNode.type === 'satellite' ? 'satellite_link' : 'optical_fiber',
                        status: 'active',
                        bandwidth: 1000,
                        latency: distance * 5, // 5 microseconds per km
                        errorRate: 0.02,
                        distance,
                        lastSync: new Date(),
                        metrics: {
                            throughput: 950,
                            availability: 99.9,
                            qber: 0.02,
                            snr: 25,
                            photonLoss: distance * 0.2 // 0.2 dB per km
                        }
                    });
                }
            }
        }

        return channels;
    }

    private calculateDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
        const R = 6371; // 지구 반지름 km
        const dLat = (b.lat - a.lat) * Math.PI / 180;
        const dLon = (b.lng - a.lng) * Math.PI / 180;
        const lat1 = a.lat * Math.PI / 180;
        const lat2 = b.lat * Math.PI / 180;

        const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

        return R * c;
    }

    // 양자 키 생성
    generateQuantumKey(sourceId: string, destinationId: string, protocol: QKDProtocol = 'BB84'): QuantumKey {
        const keyLength = 256;
        const keyBytes = new Uint8Array(keyLength / 8);
        crypto.getRandomValues(keyBytes);
        const key = btoa(String.fromCharCode(...keyBytes));

        const quantumKey: QuantumKey = {
            id: `qkey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            key,
            length: keyLength,
            sourceNode: sourceId,
            destinationNode: destinationId,
            protocol,
            status: 'ready',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000), // 1시간 후 만료
            securityLevel: this.network.securityLevel,
            verificationHash: this.hashKey(key)
        };

        this.network.keyPool.push(quantumKey);
        this.network.metrics.totalKeysGenerated++;

        return quantumKey;
    }

    private hashKey(key: string): string {
        // 간단한 해시 시뮬레이션
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            const char = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    // 양자 암호화 메시지 전송
    sendSecureMessage(sender: string, receiver: string, data: unknown, type: MessageType, priority: MessagePriority = 'normal'): EncryptedMessage {
        // 사용 가능한 키 찾기
        let key = this.network.keyPool.find(k =>
            k.status === 'ready' &&
            k.sourceNode === sender &&
            k.destinationNode === receiver
        );

        // 키가 없으면 생성
        if (!key) {
            key = this.generateQuantumKey(sender, receiver);
        }

        key.status = 'in_use';
        key.usedAt = new Date();

        // 암호화 (시뮬레이션)
        const plaintext = JSON.stringify(data);
        const ciphertext = btoa(plaintext); // 실제로는 양자 키로 암호화

        const message: EncryptedMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sender,
            receiver,
            keyId: key.id,
            ciphertext,
            timestamp: new Date(),
            verified: true,
            priority,
            type
        };

        this.messageQueue.push(message);
        this.network.metrics.totalMessagesSecured++;

        return message;
    }

    // 얽힘 쌍 생성
    createEntanglement(nodeAId: string, nodeBId: string): EntanglementPair | null {
        const nodeA = this.network.nodes.find(n => n.id === nodeAId);
        const nodeB = this.network.nodes.find(n => n.id === nodeBId);

        if (!nodeA || !nodeB) return null;

        // 사용 가능한 큐비트 찾기
        const qubitA = nodeA.qubits.find(q => q.state === 'superposition');
        const qubitB = nodeB.qubits.find(q => q.state === 'superposition');

        if (!qubitA || !qubitB) return null;

        // 얽힘 상태로 변경
        qubitA.state = 'entangled';
        qubitA.entangledPartner = { nodeId: nodeBId, qubitId: qubitB.id };
        qubitB.state = 'entangled';
        qubitB.entangledPartner = { nodeId: nodeAId, qubitId: qubitA.id };

        const entanglement: EntanglementPair = {
            id: `ent-${Date.now()}`,
            nodeA: { nodeId: nodeAId, qubitId: qubitA.id },
            nodeB: { nodeId: nodeBId, qubitId: qubitB.id },
            bellState: 'phi_plus',
            fidelity: 0.95 + Math.random() * 0.05,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 60000), // 1분 후 만료
            verified: true
        };

        this.network.entanglements.push(entanglement);
        nodeA.entangledWith.push(nodeBId);
        nodeB.entangledWith.push(nodeAId);

        return entanglement;
    }

    // 네트워크 상태 조회
    getNetworkStatus(): QuantumNetwork {
        return this.network;
    }

    // 노드 조회
    getNode(nodeId: string): QuantumNode | undefined {
        return this.network.nodes.find(n => n.id === nodeId);
    }

    // 모든 노드 조회
    getAllNodes(): QuantumNode[] {
        return this.network.nodes;
    }

    // 채널 조회
    getChannel(channelId: string): QuantumChannel | undefined {
        return this.network.channels.find(c => c.id === channelId);
    }

    // 보안 이벤트 로그
    logSecurityEvent(event: SecurityEvent): void {
        this.securityLog.push(event);
        if (event.severity === 'critical') {
            this.network.metrics.securityIncidents++;
        }
    }

    // 보안 로그 조회
    getSecurityLog(): SecurityEvent[] {
        return this.securityLog;
    }

    // 네트워크 토폴로지
    getNetworkTopology(): NetworkTopology {
        return {
            nodes: this.network.nodes.map(n => ({
                id: n.id,
                name: n.koreanName,
                type: n.type,
                status: n.status,
                position: n.location.coordinates
            })),
            edges: this.network.channels.map(c => ({
                source: c.nodeA,
                target: c.nodeB,
                type: c.type,
                status: c.status
            })),
            entanglements: this.network.entanglements.map(e => ({
                nodeA: e.nodeA.nodeId,
                nodeB: e.nodeB.nodeId,
                fidelity: e.fidelity
            }))
        };
    }
}

export interface SecurityEvent {
    id: string;
    timestamp: Date;
    type: 'intrusion_attempt' | 'key_compromise' | 'channel_error' | 'node_offline' | 'authentication_failure';
    severity: 'low' | 'medium' | 'high' | 'critical';
    nodeId?: string;
    channelId?: string;
    description: string;
    resolved: boolean;
    resolution?: string;
}

export interface NetworkTopology {
    nodes: { id: string; name: string; type: NodeType; status: NodeStatus; position: { lat: number; lng: number } }[];
    edges: { source: string; target: string; type: ChannelType; status: ChannelStatus }[];
    entanglements: { nodeA: string; nodeB: string; fidelity: number }[];
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let quantumEngine: QuantumCommunicationEngine | null = null;

export function getQuantumCommunicationEngine(): QuantumCommunicationEngine {
    if (!quantumEngine) {
        quantumEngine = new QuantumCommunicationEngine();
    }
    return quantumEngine;
}

// 노드 타입 아이콘
export const NODE_TYPE_ICONS: Record<NodeType, string> = {
    hub: '🌐',
    relay: '📡',
    endpoint: '💻',
    sensor_cluster: '📊',
    edge_device: '📱',
    mobile: '📲',
    satellite: '🛰️'
};

// QKD 프로토콜 설명
export const QKD_PROTOCOL_INFO: Record<QKDProtocol, { name: string; description: string; security: string }> = {
    BB84: { name: 'BB84', description: '최초의 양자 키 분배 프로토콜', security: '정보이론적 보안' },
    E91: { name: 'E91', description: '양자 얽힘 기반 프로토콜', security: '벨 부등식 검증' },
    B92: { name: 'B92', description: '단순화된 BB84', security: '2상태 기반' },
    SARG04: { name: 'SARG04', description: 'PNS 공격 대응', security: '광자 수 분할 공격 방어' },
    COW: { name: 'COW', description: '결맞음 일방향 프로토콜', security: '고속 키 생성' },
    DPS: { name: 'DPS', description: '차등 위상 변조', security: '간섭계 기반' }
};
