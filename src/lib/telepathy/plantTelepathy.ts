// AgriNexus World OS - 식물 텔레파시 네트워크
// Plant Telepathy Network - 세계 최초 식물 간 양자 통신 시스템

// ============================================
// 타입 정의
// ============================================

export interface PlantTelepathyNetwork {
    id: string;
    farmId: string;
    nodes: PlantNode[];
    connections: PlantConnection[];
    messages: PlantMessage[];
    sharedConsciousness: SharedConsciousnessState;
    collectiveIntelligence: CollectiveIntelligence;
    status: NetworkStatus;
    metrics: TelepathyMetrics;
}

export interface PlantNode {
    id: string;
    plantId: string;
    species: string;
    position: { x: number; y: number; z: number };
    consciousnessLevel: number;         // 0-100
    quantumCoherence: number;           // 0-1
    bioelectricField: BioelectricField;
    phytohormones: PhytohormoneProfile;
    rootNetwork: RootNetworkState;
    status: 'active' | 'dormant' | 'stressed' | 'communicating';
    lastSignal: Date;
}

export interface BioelectricField {
    voltage: number;                    // mV
    frequency: number;                  // Hz
    amplitude: number;                  // μV
    pattern: 'normal' | 'alert' | 'distress' | 'joy' | 'growth';
    harmonics: number[];
}

export interface PhytohormoneProfile {
    auxin: number;                      // ng/g
    cytokinin: number;
    gibberellin: number;
    abscisicAcid: number;
    ethylene: number;                   // ppm
    jasmonate: number;
    salicylicAcid: number;
}

export interface RootNetworkState {
    mycorrhizalConnections: number;
    signalStrength: number;             // 0-100
    nutrientSharing: boolean;
    stressSignaling: boolean;
    connectedPlants: string[];
}

export interface PlantConnection {
    id: string;
    nodeA: string;
    nodeB: string;
    type: ConnectionType;
    strength: number;                   // 0-100
    bandwidth: number;                  // signals/second
    latency: number;                    // ms
    active: boolean;
    lastActivity: Date;
}

export type ConnectionType =
    | 'mycorrhizal'         // 균근 네트워크
    | 'root_exudate'        // 뿌리 삼출물
    | 'volatile'            // 휘발성 신호
    | 'bioelectric'         // 생체 전기
    | 'quantum'             // 양자 얽힘
    | 'biophoton';          // 생체 광자

export interface PlantMessage {
    id: string;
    senderId: string;
    receiverIds: string[];
    type: MessageType;
    content: MessageContent;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    timestamp: Date;
    decoded: boolean;
    humanReadable?: string;
}

export type MessageType =
    | 'warning'             // 경고 (해충, 병해)
    | 'resource'            // 자원 공유
    | 'growth'              // 성장 신호
    | 'stress'              // 스트레스
    | 'reproduction'        // 번식 신호
    | 'defense'             // 방어 신호
    | 'joy'                 // 기쁨/만족
    | 'request';            // 요청

export interface MessageContent {
    chemicalSignature: string;
    emotionalTone: number;              // -1 to 1
    urgency: number;                    // 0-100
    biologicalData?: Record<string, number>;
}

export interface SharedConsciousnessState {
    level: number;                      // 0-100
    synchronization: number;            // 동기화율
    dominantEmotion: string;
    collectiveGoal: string;
    coherencePattern: string;
    emergentBehaviors: string[];
}

export interface CollectiveIntelligence {
    problemSolving: number;
    patternRecognition: number;
    predictiveAbility: number;
    adaptationSpeed: number;
    coordinatedResponse: boolean;
    swarmDecisions: SwarmDecision[];
}

export interface SwarmDecision {
    id: string;
    issue: string;
    proposedBy: string[];
    consensus: number;                  // % agreement
    action: string;
    outcome?: string;
    timestamp: Date;
}

export type NetworkStatus = 'active' | 'dormant' | 'synchronizing' | 'fragmented';

export interface TelepathyMetrics {
    totalNodes: number;
    activeConnections: number;
    messagesPerHour: number;
    averageLatency: number;
    networkHealth: number;
    consciousnessIndex: number;
    synchronizationLevel: number;
}

// ============================================
// 텔레파시 네트워크 엔진
// ============================================

export class PlantTelepathyEngine {
    private network: PlantTelepathyNetwork;

    constructor(farmId: string) {
        this.network = this.initializeNetwork(farmId);
    }

    private initializeNetwork(farmId: string): PlantTelepathyNetwork {
        const nodes = this.createInitialNodes();
        const connections = this.establishConnections(nodes);

        return {
            id: `ptn-${Date.now()}`,
            farmId,
            nodes,
            connections,
            messages: [],
            sharedConsciousness: {
                level: 65,
                synchronization: 78,
                dominantEmotion: 'contentment',
                collectiveGoal: 'optimal growth',
                coherencePattern: 'harmonic',
                emergentBehaviors: ['자원_최적화', '집단_방어', '성장_동기화']
            },
            collectiveIntelligence: {
                problemSolving: 72,
                patternRecognition: 85,
                predictiveAbility: 68,
                adaptationSpeed: 79,
                coordinatedResponse: true,
                swarmDecisions: []
            },
            status: 'active',
            metrics: {
                totalNodes: nodes.length,
                activeConnections: connections.length,
                messagesPerHour: 1250,
                averageLatency: 45,
                networkHealth: 92,
                consciousnessIndex: 76,
                synchronizationLevel: 81
            }
        };
    }

    private createInitialNodes(): PlantNode[] {
        const species = ['딸기', '토마토', '상추', '허브'];
        const nodes: PlantNode[] = [];

        for (let i = 0; i < 24; i++) {
            nodes.push({
                id: `node-${i}`,
                plantId: `plant-${i}`,
                species: species[i % 4],
                position: {
                    x: (i % 6) * 2,
                    y: 0,
                    z: Math.floor(i / 6) * 2
                },
                consciousnessLevel: 50 + Math.random() * 50,
                quantumCoherence: 0.7 + Math.random() * 0.3,
                bioelectricField: {
                    voltage: -50 + Math.random() * 20,
                    frequency: 5 + Math.random() * 15,
                    amplitude: 100 + Math.random() * 200,
                    pattern: 'normal',
                    harmonics: [1, 2, 3, 5, 8, 13]
                },
                phytohormones: {
                    auxin: 50 + Math.random() * 100,
                    cytokinin: 30 + Math.random() * 70,
                    gibberellin: 20 + Math.random() * 60,
                    abscisicAcid: 10 + Math.random() * 40,
                    ethylene: 0.5 + Math.random() * 2,
                    jasmonate: 5 + Math.random() * 20,
                    salicylicAcid: 3 + Math.random() * 15
                },
                rootNetwork: {
                    mycorrhizalConnections: Math.floor(3 + Math.random() * 5),
                    signalStrength: 70 + Math.random() * 30,
                    nutrientSharing: Math.random() > 0.3,
                    stressSignaling: false,
                    connectedPlants: []
                },
                status: 'active',
                lastSignal: new Date()
            });
        }

        // 연결 설정
        nodes.forEach((node, i) => {
            const neighbors = nodes.filter((n, j) => {
                const dist = Math.sqrt(
                    Math.pow(n.position.x - node.position.x, 2) +
                    Math.pow(n.position.z - node.position.z, 2)
                );
                return dist > 0 && dist <= 3;
            });
            node.rootNetwork.connectedPlants = neighbors.slice(0, 4).map(n => n.id);
        });

        return nodes;
    }

    private establishConnections(nodes: PlantNode[]): PlantConnection[] {
        const connections: PlantConnection[] = [];
        const types: ConnectionType[] = ['mycorrhizal', 'volatile', 'bioelectric', 'biophoton'];

        nodes.forEach(node => {
            node.rootNetwork.connectedPlants.forEach(targetId => {
                if (!connections.some(c =>
                    (c.nodeA === node.id && c.nodeB === targetId) ||
                    (c.nodeA === targetId && c.nodeB === node.id)
                )) {
                    connections.push({
                        id: `conn-${connections.length}`,
                        nodeA: node.id,
                        nodeB: targetId,
                        type: types[Math.floor(Math.random() * types.length)],
                        strength: 50 + Math.random() * 50,
                        bandwidth: 10 + Math.random() * 90,
                        latency: 20 + Math.random() * 80,
                        active: true,
                        lastActivity: new Date()
                    });
                }
            });
        });

        return connections;
    }

    // 텔레파시 메시지 전송
    sendMessage(senderId: string, type: MessageType, content: string): PlantMessage {
        const sender = this.network.nodes.find(n => n.id === senderId);
        if (!sender) throw new Error('Sender not found');

        const receivers = sender.rootNetwork.connectedPlants;

        const message: PlantMessage = {
            id: `msg-${Date.now()}`,
            senderId,
            receiverIds: receivers,
            type,
            content: {
                chemicalSignature: this.generateChemicalSignature(type),
                emotionalTone: type === 'joy' ? 0.8 : type === 'stress' ? -0.6 : 0.2,
                urgency: type === 'warning' || type === 'defense' ? 90 : 30
            },
            priority: type === 'warning' ? 'urgent' : 'normal',
            timestamp: new Date(),
            decoded: true,
            humanReadable: content
        };

        this.network.messages.push(message);
        this.network.metrics.messagesPerHour++;

        // 연쇄 전파 시뮬레이션
        if (type === 'warning' || type === 'defense') {
            this.propagateAlert(receivers, type, message.content);
        }

        return message;
    }

    private generateChemicalSignature(type: MessageType): string {
        const signatures: Record<MessageType, string> = {
            warning: 'C6H10O4-JA',           // Jasmonic acid
            resource: 'C5H8O2-AUX',          // Auxin
            growth: 'C10H12N2O-IAA',         // Indole-3-acetic acid
            stress: 'C15H20O4-ABA',          // Abscisic acid
            reproduction: 'C19H22O6-GA3',    // Gibberellin
            defense: 'C7H6O3-SA',            // Salicylic acid
            joy: 'C10H13NO-5HT',             // Serotonin-like
            request: 'C4H4O3-Strigolactone'
        };
        return signatures[type];
    }

    private propagateAlert(initial: string[], type: MessageType, content: MessageContent): void {
        // 경고 메시지의 연쇄 전파 (실제로는 비동기 처리)
        initial.forEach(nodeId => {
            const node = this.network.nodes.find(n => n.id === nodeId);
            if (node) {
                node.bioelectricField.pattern = type === 'warning' ? 'alert' : 'normal';
                node.phytohormones.jasmonate *= 1.5;    // 방어 호르몬 증가
            }
        });
    }

    // 집단 의식 동기화
    synchronizeConsciousness(): SharedConsciousnessState {
        const avgConsciousness = this.network.nodes.reduce(
            (sum, n) => sum + n.consciousnessLevel, 0
        ) / this.network.nodes.length;

        this.network.sharedConsciousness.level = avgConsciousness;
        this.network.sharedConsciousness.synchronization =
            70 + Math.random() * 30;

        return this.network.sharedConsciousness;
    }

    // 집단 지능 결정
    makeCollectiveDecision(issue: string, options: string[]): SwarmDecision {
        const votes = options.map(() => Math.random() * 100);
        const totalVotes = votes.reduce((a, b) => a + b, 0);
        const normalized = votes.map(v => (v / totalVotes) * 100);
        const maxIndex = normalized.indexOf(Math.max(...normalized));

        const decision: SwarmDecision = {
            id: `decision-${Date.now()}`,
            issue,
            proposedBy: this.network.nodes.slice(0, 5).map(n => n.id),
            consensus: normalized[maxIndex],
            action: options[maxIndex],
            timestamp: new Date()
        };

        this.network.collectiveIntelligence.swarmDecisions.push(decision);
        return decision;
    }

    // 네트워크 상태 조회
    getNetwork(): PlantTelepathyNetwork {
        return this.network;
    }

    // 노드 조회
    getNode(nodeId: string): PlantNode | undefined {
        return this.network.nodes.find(n => n.id === nodeId);
    }

    // 최근 메시지 조회
    getRecentMessages(limit: number = 20): PlantMessage[] {
        return this.network.messages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
}

// 싱글톤
const telepathyEngines: Map<string, PlantTelepathyEngine> = new Map();

export function getPlantTelepathyEngine(farmId: string): PlantTelepathyEngine {
    if (!telepathyEngines.has(farmId)) {
        telepathyEngines.set(farmId, new PlantTelepathyEngine(farmId));
    }
    return telepathyEngines.get(farmId)!;
}

export const MESSAGE_TYPE_ICONS: Record<MessageType, string> = {
    warning: '⚠️',
    resource: '🔄',
    growth: '🌱',
    stress: '😰',
    reproduction: '🌸',
    defense: '🛡️',
    joy: '😊',
    request: '🙏'
};

export const CONNECTION_TYPE_ICONS: Record<ConnectionType, string> = {
    mycorrhizal: '🍄',
    root_exudate: '💧',
    volatile: '💨',
    bioelectric: '⚡',
    quantum: '⚛️',
    biophoton: '✨'
};
