// AgriNexus World OS - 뿌리 AI 네트워크
// Root AI Network - 세계 최초 지하 뿌리 지능 시스템

export interface RootAINetwork {
    id: string;
    farmId: string;
    nodes: RootNode[];
    connections: RootConnection[];
    intelligence: RootIntelligence;
    metrics: RootNetworkMetrics;
    status: 'optimal' | 'growing' | 'stressed' | 'dormant';
}

export interface RootNode {
    id: string;
    plantId: string;
    species: string;
    position: { x: number; y: number; depth: number };
    rootMass: number;
    rootLength: number;
    activeRootTips: number;
    mycorrhizalColonization: number;
    signalProcessingPower: number;
    aiDecisions: AIDecision[];
    status: 'active' | 'growing' | 'stressed' | 'dormant';
}

export interface AIDecision {
    id: string;
    timestamp: Date;
    type: DecisionType;
    trigger: string;
    action: string;
    confidence: number;
}

export type DecisionType = 'root_growth_direction' | 'nutrient_seeking' | 'water_seeking' | 'defense_response' | 'resource_sharing';

export interface RootConnection {
    id: string;
    nodeA: string;
    nodeB: string;
    type: 'mycorrhizal_network' | 'root_graft' | 'exudate_channel' | 'electrical_coupling';
    strength: number;
    transferRate: number;
    active: boolean;
}

export interface RootIntelligence {
    collectiveIQ: number;
    learningRate: number;
    patternRecognition: number;
    predictiveAbility: number;
    adaptationSpeed: number;
    problemSolvingScore: number;
    emergentBehaviors: { id: string; name: string; koreanName: string; description: string; frequency: number }[];
    learnedPatterns: { id: string; stimulus: string; response: string; successRate: number }[];
}

export interface RootNetworkMetrics {
    totalNodes: number;
    totalConnections: number;
    networkDensity: number;
    totalRootLength: number;
    nutrientUptakeEfficiency: number;
    waterUptakeEfficiency: number;
    collectiveDecisionsPerHour: number;
}

export class RootAIEngine {
    private network: RootAINetwork;

    constructor(farmId: string) {
        this.network = this.initializeNetwork(farmId);
    }

    private initializeNetwork(farmId: string): RootAINetwork {
        const nodes = this.createNodes();
        const connections = this.createConnections(nodes);

        return {
            id: `root-ai-${Date.now()}`,
            farmId,
            nodes,
            connections,
            intelligence: {
                collectiveIQ: 120,
                learningRate: 0.15,
                patternRecognition: 85,
                predictiveAbility: 72,
                adaptationSpeed: 78,
                problemSolvingScore: 80,
                emergentBehaviors: [
                    { id: 'eb-1', name: 'Collective Nutrient Mining', koreanName: '집단 양분 채굴', description: '여러 뿌리가 협력하여 양분 탐색', frequency: 8 },
                    { id: 'eb-2', name: 'Drought Defense', koreanName: '가뭄 방어', description: '수분 스트레스 시 자원 재분배', frequency: 3 },
                    { id: 'eb-3', name: 'Pathogen Alert', koreanName: '병원균 경보', description: '병원균 감지 시 네트워크 전체 경보', frequency: 1 }
                ],
                learnedPatterns: [
                    { id: 'lp-1', stimulus: '질소 결핍', response: '뿌리 성장 방향 조정', successRate: 92 },
                    { id: 'lp-2', stimulus: '수분 기울기', response: '수분 방향 굴성', successRate: 88 }
                ]
            },
            metrics: {
                totalNodes: nodes.length,
                totalConnections: connections.length,
                networkDensity: 0.65,
                totalRootLength: nodes.reduce((sum, n) => sum + n.rootLength, 0),
                nutrientUptakeEfficiency: 82,
                waterUptakeEfficiency: 88,
                collectiveDecisionsPerHour: 45
            },
            status: 'optimal'
        };
    }

    private createNodes(): RootNode[] {
        const species = ['딸기', '토마토', '상추', '바질'];
        return Array.from({ length: 20 }, (_, i) => ({
            id: `root-${i}`,
            plantId: `plant-${i}`,
            species: species[i % 4],
            position: { x: (i % 5) * 3, y: Math.floor(i / 5) * 3, depth: 20 + Math.random() * 30 },
            rootMass: 50 + Math.random() * 150,
            rootLength: 2 + Math.random() * 8,
            activeRootTips: 100 + Math.floor(Math.random() * 400),
            mycorrhizalColonization: 40 + Math.random() * 55,
            signalProcessingPower: 50 + Math.random() * 50,
            aiDecisions: [],
            status: 'active'
        }));
    }

    private createConnections(nodes: RootNode[]): RootConnection[] {
        const connections: RootConnection[] = [];
        const types: RootConnection['type'][] = ['mycorrhizal_network', 'root_graft', 'exudate_channel'];

        nodes.forEach(node => {
            const nearby = nodes.filter(n => {
                const dist = Math.sqrt(Math.pow(n.position.x - node.position.x, 2) + Math.pow(n.position.y - node.position.y, 2));
                return n.id !== node.id && dist <= 5;
            });

            nearby.slice(0, 3).forEach(target => {
                if (!connections.some(c => (c.nodeA === node.id && c.nodeB === target.id) || (c.nodeA === target.id && c.nodeB === node.id))) {
                    connections.push({
                        id: `conn-${connections.length}`,
                        nodeA: node.id,
                        nodeB: target.id,
                        type: types[Math.floor(Math.random() * types.length)],
                        strength: 50 + Math.random() * 50,
                        transferRate: 0.5 + Math.random() * 2,
                        active: true
                    });
                }
            });
        });
        return connections;
    }

    makeDecision(nodeId: string, type: DecisionType, trigger: string): AIDecision {
        const node = this.network.nodes.find(n => n.id === nodeId);
        if (!node) throw new Error('Node not found');

        const actions: Record<DecisionType, string[]> = {
            root_growth_direction: ['하향 성장', '측면 분기', '상향 굴성'],
            nutrient_seeking: ['질소 방향 성장', '인산 추적', '칼륨 탐색'],
            water_seeking: ['수분 추적', '심층 성장', '측면 확장'],
            defense_response: ['방어 물질 분비', '세포벽 강화', '화학 신호 발송'],
            resource_sharing: ['탄소 공유', '질소 전달', '수분 분배']
        };

        const decision: AIDecision = {
            id: `decision-${Date.now()}`,
            timestamp: new Date(),
            type,
            trigger,
            action: actions[type][Math.floor(Math.random() * actions[type].length)],
            confidence: 0.7 + Math.random() * 0.3
        };

        node.aiDecisions.push(decision);
        return decision;
    }

    getNetwork(): RootAINetwork { return this.network; }
    getNode(nodeId: string): RootNode | undefined { return this.network.nodes.find(n => n.id === nodeId); }
    getIntelligence(): RootIntelligence { return this.network.intelligence; }
}

const rootAIEngines: Map<string, RootAIEngine> = new Map();
export function getRootAIEngine(farmId: string): RootAIEngine {
    if (!rootAIEngines.has(farmId)) rootAIEngines.set(farmId, new RootAIEngine(farmId));
    return rootAIEngines.get(farmId)!;
}

export const DECISION_TYPE_ICONS: Record<DecisionType, string> = {
    root_growth_direction: '📍', nutrient_seeking: '🔍', water_seeking: '💧', defense_response: '🛡️', resource_sharing: '🤝'
};
