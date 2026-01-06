// AgriNexus World OS - 블록체인 이력추적 시스템
// 생산부터 소비자까지 완벽한 투명성

import { CropData } from './cropDatabase';
import { SmartFarmEquipment } from './equipmentDatabase';

// ============================================
// 타입 정의
// ============================================

export interface BlockchainRecord {
    id: string;
    hash: string;
    previousHash: string;
    timestamp: Date;
    data: TraceabilityData;
    signature: string;
    verified: boolean;
}

export interface TraceabilityData {
    type: RecordType;
    farmId: string;
    batchId: string;
    productId?: string;
    data: Record<string, unknown>;
    metadata: {
        recordedBy: string;
        device?: string;
        location?: { lat: number; lng: number };
    };
}

export type RecordType =
    | 'seed_origin'
    | 'planting'
    | 'environment'
    | 'nutrient'
    | 'pest_control'
    | 'harvest'
    | 'quality_check'
    | 'packaging'
    | 'storage'
    | 'transport'
    | 'distribution'
    | 'retail'
    | 'certification';

export interface ProductTraceability {
    productId: string;
    batchId: string;
    cropType: string;
    farmInfo: {
        id: string;
        name: string;
        location: string;
        certifications: string[];
    };
    timeline: TraceabilityEvent[];
    certifications: Certification[];
    qualityData: QualityRecord[];
    carbonFootprint: CarbonFootprint;
    verificationStatus: {
        blockchain: boolean;
        certifier: boolean;
        qrCode: string;
    };
}

export interface TraceabilityEvent {
    id: string;
    type: RecordType;
    timestamp: Date;
    location: string;
    description: string;
    actor: string;
    data: Record<string, unknown>;
    verified: boolean;
    blockHash: string;
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate: Date;
    scope: string[];
    documentUrl: string;
    verified: boolean;
}

export interface QualityRecord {
    id: string;
    timestamp: Date;
    type: 'visual' | 'chemical' | 'microbial' | 'sensory';
    parameters: {
        name: string;
        value: number | string;
        unit?: string;
        standard?: string;
        pass: boolean;
    }[];
    inspector: string;
    notes?: string;
}

export interface CarbonFootprint {
    total: number;                  // kg CO2e
    breakdown: {
        category: string;
        amount: number;
        percentage: number;
    }[];
    comparison: {
        industry: number;
        savings: number;
        ranking: string;
    };
    offset: {
        credits: number;
        status: string;
    };
}

export interface SupplyChainNode {
    id: string;
    type: 'farm' | 'processor' | 'distributor' | 'retailer' | 'consumer';
    name: string;
    location: {
        address: string;
        coordinates: { lat: number; lng: number };
    };
    timestamp: Date;
    status: 'pending' | 'in_progress' | 'completed';
    conditions?: {
        temperature: number;
        humidity: number;
    };
}

// ============================================
// 블록체인 이력추적 서비스
// ============================================

export class BlockchainTraceabilityService {
    private chain: BlockchainRecord[] = [];
    private pendingRecords: TraceabilityData[] = [];

    constructor() {
        // Genesis block
        this.chain.push({
            id: 'genesis',
            hash: this.generateHash('genesis'),
            previousHash: '0',
            timestamp: new Date(),
            data: {
                type: 'seed_origin',
                farmId: 'system',
                batchId: 'genesis',
                data: { message: 'AgriNexus Traceability Chain Initialized' },
                metadata: { recordedBy: 'system' }
            },
            signature: 'genesis-signature',
            verified: true
        });
    }

    // 레코드 추가
    async addRecord(data: TraceabilityData): Promise<BlockchainRecord> {
        const previousBlock = this.chain[this.chain.length - 1];
        const newBlock: BlockchainRecord = {
            id: `block-${Date.now()}`,
            hash: this.generateHash(JSON.stringify(data) + previousBlock.hash),
            previousHash: previousBlock.hash,
            timestamp: new Date(),
            data,
            signature: this.signRecord(data),
            verified: false
        };

        // 검증 시뮬레이션 (실제로는 분산 노드에서 검증)
        await this.simulateVerification(newBlock);

        this.chain.push(newBlock);
        return newBlock;
    }

    // 제품 이력 조회
    getProductHistory(batchId: string): ProductTraceability {
        const records = this.chain.filter(r => r.data.batchId === batchId);

        const timeline: TraceabilityEvent[] = records.map(r => ({
            id: r.id,
            type: r.data.type,
            timestamp: r.timestamp,
            location: (r.data.metadata.location?.lat || 0).toString() + ', ' + (r.data.metadata.location?.lng || 0).toString(),
            description: this.getEventDescription(r.data.type, r.data.data),
            actor: r.data.metadata.recordedBy,
            data: r.data.data as Record<string, unknown>,
            verified: r.verified,
            blockHash: r.hash
        }));

        return {
            productId: batchId,
            batchId,
            cropType: this.extractCropType(records),
            farmInfo: this.extractFarmInfo(records),
            timeline,
            certifications: this.extractCertifications(records),
            qualityData: this.extractQualityData(records),
            carbonFootprint: this.calculateCarbonFootprint(records),
            verificationStatus: {
                blockchain: records.every(r => r.verified),
                certifier: true,
                qrCode: this.generateQRCode(batchId)
            }
        };
    }

    // 공급망 추적
    trackSupplyChain(batchId: string): SupplyChainNode[] {
        const records = this.chain.filter(r => r.data.batchId === batchId);
        const nodes: SupplyChainNode[] = [];

        const typeToNodeType: Record<RecordType, SupplyChainNode['type']> = {
            seed_origin: 'farm',
            planting: 'farm',
            environment: 'farm',
            nutrient: 'farm',
            pest_control: 'farm',
            harvest: 'farm',
            quality_check: 'processor',
            packaging: 'processor',
            storage: 'distributor',
            transport: 'distributor',
            distribution: 'distributor',
            retail: 'retailer',
            certification: 'farm'
        };

        for (const record of records) {
            nodes.push({
                id: record.id,
                type: typeToNodeType[record.data.type] || 'farm',
                name: this.getNodeName(record.data.type),
                location: {
                    address: '서울특별시',
                    coordinates: record.data.metadata.location || { lat: 37.5665, lng: 126.9780 }
                },
                timestamp: record.timestamp,
                status: 'completed',
                conditions: record.data.data.temperature ? {
                    temperature: record.data.data.temperature as number,
                    humidity: (record.data.data.humidity as number) || 70
                } : undefined
            });
        }

        return nodes;
    }

    // 인증 발급
    issueCertification(batchId: string, certification: Omit<Certification, 'id' | 'verified'>): Certification {
        const cert: Certification = {
            ...certification,
            id: `cert-${Date.now()}`,
            verified: true
        };

        this.addRecord({
            type: 'certification',
            farmId: 'system',
            batchId,
            data: cert as unknown as Record<string, unknown>,
            metadata: { recordedBy: certification.issuer }
        });

        return cert;
    }

    // 체인 검증
    verifyChain(): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.previousHash !== previous.hash) {
                errors.push(`Block ${i}: Hash chain broken`);
            }

            if (!current.verified) {
                errors.push(`Block ${i}: Not verified`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // 유틸리티 함수들
    private generateHash(data: string): string {
        // 간단한 해시 시뮬레이션 (실제로는 SHA-256 등 사용)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(64, '0');
    }

    private signRecord(data: TraceabilityData): string {
        return this.generateHash(JSON.stringify(data) + Date.now());
    }

    private async simulateVerification(block: BlockchainRecord): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 100));
        block.verified = true;
    }

    private getEventDescription(type: RecordType, data: Record<string, unknown>): string {
        const descriptions: Record<RecordType, string> = {
            seed_origin: `종자 원산지: ${data.origin || '국내'}`,
            planting: `파종 완료: ${data.quantity || 0}주`,
            environment: `환경 데이터 기록: ${data.temperature || 0}°C, ${data.humidity || 0}%`,
            nutrient: `양액 공급: EC ${data.ec || 0}, pH ${data.ph || 0}`,
            pest_control: `병해충 관리: ${data.method || '예방 처리'}`,
            harvest: `수확 완료: ${data.quantity || 0}kg`,
            quality_check: `품질 검사 통과: 등급 ${data.grade || 'A'}`,
            packaging: `포장 완료: ${data.type || '표준'} 포장`,
            storage: `저장 시작: ${data.temperature || 0}°C 냉장`,
            transport: `운송 시작: 목적지 ${data.destination || '-'}`,
            distribution: `유통 완료`,
            retail: `소매점 입고: ${data.retailer || '-'}`,
            certification: `인증 획득: ${data.name || '-'}`
        };
        return descriptions[type] || '이벤트 기록';
    }

    private extractCropType(records: BlockchainRecord[]): string {
        const plantingRecord = records.find(r => r.data.type === 'planting');
        return (plantingRecord?.data.data.cropType as string) || 'Unknown';
    }

    private extractFarmInfo(records: BlockchainRecord[]): ProductTraceability['farmInfo'] {
        return {
            id: records[0]?.data.farmId || 'unknown',
            name: 'AgriNexus Smart Farm',
            location: '대한민국 경기도',
            certifications: ['GAP', 'HACCP', '친환경']
        };
    }

    private extractCertifications(records: BlockchainRecord[]): Certification[] {
        return records
            .filter(r => r.data.type === 'certification')
            .map(r => r.data.data as unknown as Certification);
    }

    private extractQualityData(records: BlockchainRecord[]): QualityRecord[] {
        return records
            .filter(r => r.data.type === 'quality_check')
            .map(r => ({
                id: r.id,
                timestamp: r.timestamp,
                type: 'visual' as const,
                parameters: [
                    { name: '외관', value: (r.data.data.appearance as string) || '양호', pass: true },
                    { name: '당도', value: (r.data.data.brix as number) || 12, unit: 'Brix', pass: true },
                    { name: '크기', value: (r.data.data.size as string) || '대', pass: true }
                ],
                inspector: r.data.metadata.recordedBy
            }));
    }

    private calculateCarbonFootprint(records: BlockchainRecord[]): CarbonFootprint {
        // 간단한 탄소 발자국 계산
        const totalKg = 2.5; // 기본값

        return {
            total: totalKg,
            breakdown: [
                { category: '재배', amount: 0.8, percentage: 32 },
                { category: '수확', amount: 0.3, percentage: 12 },
                { category: '포장', amount: 0.5, percentage: 20 },
                { category: '운송', amount: 0.6, percentage: 24 },
                { category: '기타', amount: 0.3, percentage: 12 }
            ],
            comparison: {
                industry: 4.5,
                savings: 44,
                ranking: '상위 15%'
            },
            offset: {
                credits: 10,
                status: '탄소중립 달성'
            }
        };
    }

    private generateQRCode(batchId: string): string {
        return `https://agrinexus.world/trace/${batchId}`;
    }

    private getNodeName(type: RecordType): string {
        const names: Record<RecordType, string> = {
            seed_origin: '종자 공급업체',
            planting: '스마트팜 농장',
            environment: '스마트팜 농장',
            nutrient: '스마트팜 농장',
            pest_control: '스마트팜 농장',
            harvest: '수확 센터',
            quality_check: '품질관리센터',
            packaging: '포장 센터',
            storage: '물류창고',
            transport: '운송업체',
            distribution: '유통센터',
            retail: '소매점',
            certification: '인증기관'
        };
        return names[type] || '기타';
    }
}

// ============================================
// NFT 인증서
// ============================================

export interface NFTCertificate {
    tokenId: string;
    productId: string;
    imageUrl: string;
    metadata: {
        name: string;
        description: string;
        attributes: { trait_type: string; value: string | number }[];
    };
    owner: string;
    mintedAt: Date;
    transactionHash: string;
}

export function mintProductNFT(product: ProductTraceability): NFTCertificate {
    return {
        tokenId: `ANX-${Date.now()}`,
        productId: product.productId,
        imageUrl: `https://agrinexus.world/nft/${product.productId}.png`,
        metadata: {
            name: `AgriNexus ${product.cropType} #${product.batchId}`,
            description: `Verified sustainable produce from ${product.farmInfo.name}`,
            attributes: [
                { trait_type: 'Crop Type', value: product.cropType },
                { trait_type: 'Farm', value: product.farmInfo.name },
                { trait_type: 'Carbon Footprint', value: product.carbonFootprint.total },
                { trait_type: 'Certifications', value: product.certifications.length },
                { trait_type: 'Sustainability Rating', value: product.carbonFootprint.comparison.ranking }
            ]
        },
        owner: 'AgriNexus',
        mintedAt: new Date(),
        transactionHash: '0x' + Math.random().toString(16).substring(2, 66)
    };
}

// 싱글톤 인스턴스
let traceabilityService: BlockchainTraceabilityService | null = null;

export function getTraceabilityService(): BlockchainTraceabilityService {
    if (!traceabilityService) {
        traceabilityService = new BlockchainTraceabilityService();
    }
    return traceabilityService;
}

// 샘플 데이터 생성
export function createSampleTraceabilityData(batchId: string, cropType: string): void {
    const service = getTraceabilityService();
    const farmId = 'farm-001';

    const events: Omit<TraceabilityData, 'farmId' | 'batchId'>[] = [
        {
            type: 'seed_origin',
            data: { origin: '국내', supplier: '한국종묘', variety: '설향' },
            metadata: { recordedBy: 'system' }
        },
        {
            type: 'planting',
            data: { quantity: 1000, cropType, date: new Date().toISOString() },
            metadata: { recordedBy: 'farmer-001', device: 'Sensor-A1' }
        },
        {
            type: 'environment',
            data: { temperature: 22, humidity: 70, co2: 1000, light: 450 },
            metadata: { recordedBy: 'IoT-System', device: 'EnvSensor-001' }
        },
        {
            type: 'nutrient',
            data: { ec: 1.5, ph: 6.0, solution: 'Yamazaki' },
            metadata: { recordedBy: 'IoT-System', device: 'NutrientMixer-001' }
        },
        {
            type: 'harvest',
            data: { quantity: 150, grade: 'A', harvestDate: new Date().toISOString() },
            metadata: { recordedBy: 'farmer-001' }
        },
        {
            type: 'quality_check',
            data: { grade: 'A', brix: 12.5, appearance: '우수', size: '대' },
            metadata: { recordedBy: 'quality-inspector-001' }
        },
        {
            type: 'packaging',
            data: { type: '500g 팩', quantity: 300, packagingDate: new Date().toISOString() },
            metadata: { recordedBy: 'packaging-system' }
        }
    ];

    for (const event of events) {
        service.addRecord({
            ...event,
            farmId,
            batchId
        });
    }
}
