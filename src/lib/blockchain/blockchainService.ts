// AgriNexus World OS - 블록체인 공급망 추적 시스템
// 씨앗부터 수확까지 완전한 투명성 제공

import { EventEmitter } from 'events';

// ============================================
// 타입 정의
// ============================================

export interface Block {
    index: number;
    timestamp: Date;
    data: BlockData;
    previousHash: string;
    hash: string;
    nonce: number;
    validator: string;
}

export interface BlockData {
    type: TransactionType;
    transactionId: string;
    productId: string;
    batchId: string;
    farmId: string;
    actor: string;
    action: string;
    details: Record<string, any>;
    certifications: string[];
    geoLocation?: { lat: number; lng: number };
    signature: string;
}

export type TransactionType =
    | 'seed_registration'
    | 'planting'
    | 'growth_record'
    | 'treatment'
    | 'harvest'
    | 'quality_check'
    | 'packaging'
    | 'storage'
    | 'transport'
    | 'delivery'
    | 'sale';

export interface Product {
    id: string;
    name: string;
    variety: string;
    batchId: string;
    farmId: string;
    farmName: string;
    plantDate: Date;
    harvestDate?: Date;
    status: ProductStatus;
    certifications: Certification[];
    carbonFootprint: number;
    transactions: string[];
    currentLocation: string;
    qrCode: string;
}

export type ProductStatus =
    | 'registered'
    | 'growing'
    | 'harvested'
    | 'processed'
    | 'in_transit'
    | 'delivered'
    | 'sold';

export interface Certification {
    id: string;
    type: CertificationType;
    issuer: string;
    issuedDate: Date;
    expiryDate?: Date;
    verified: boolean;
    metadata: Record<string, any>;
}

export type CertificationType =
    | 'organic'
    | 'gap'
    | 'haccp'
    | 'non_gmo'
    | 'fair_trade'
    | 'carbon_neutral'
    | 'pesticide_free'
    | 'local_farm';

export interface CarbonCredit {
    id: string;
    farmId: string;
    amount: number; // tons CO2 equivalent
    generatedDate: Date;
    verifier: string;
    status: 'pending' | 'verified' | 'traded' | 'retired';
    price?: number;
    buyer?: string;
    tradedDate?: Date;
}

export interface NFTCertificate {
    tokenId: string;
    productId: string;
    batchId: string;
    farmId: string;
    metadata: {
        name: string;
        description: string;
        image: string;
        attributes: { trait_type: string; value: string }[];
    };
    owner: string;
    mintedAt: Date;
    transferHistory: { from: string; to: string; date: Date }[];
}

// ============================================
// 블록체인 서비스 클래스
// ============================================

class BlockchainService extends EventEmitter {
    private chain: Block[] = [];
    private products: Map<string, Product> = new Map();
    private carbonCredits: CarbonCredit[] = [];
    private nftCertificates: Map<string, NFTCertificate> = new Map();
    private pendingTransactions: BlockData[] = [];
    private difficulty = 2;
    private validatorAddress = 'nexus-validator-001';

    constructor() {
        super();
        this.initializeChain();
    }

    private initializeChain() {
        // Genesis Block
        const genesisBlock: Block = {
            index: 0,
            timestamp: new Date('2024-01-01'),
            data: {
                type: 'seed_registration',
                transactionId: 'genesis',
                productId: 'genesis',
                batchId: 'genesis',
                farmId: 'agrinexus-main',
                actor: 'system',
                action: 'Genesis Block - AgriNexus Blockchain Initialized',
                details: { message: 'AgriNexus World OS Blockchain Network Started' },
                certifications: [],
                signature: 'genesis-signature'
            },
            previousHash: '0',
            hash: this.calculateHash(0, new Date('2024-01-01'), {} as BlockData, '0', 0),
            nonce: 0,
            validator: 'system'
        };

        this.chain.push(genesisBlock);
        console.log('⛓️ Blockchain 초기화 완료 - Genesis Block 생성');
    }

    // 해시 계산
    private calculateHash(index: number, timestamp: Date, data: BlockData, previousHash: string, nonce: number): string {
        const str = `${index}${timestamp.toISOString()}${JSON.stringify(data)}${previousHash}${nonce}`;
        return this.simpleHash(str);
    }

    private simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(64, '0');
    }

    // 작업 증명
    private proofOfWork(block: Omit<Block, 'hash' | 'nonce'>): { hash: string; nonce: number } {
        let nonce = 0;
        let hash = '';
        const target = '0'.repeat(this.difficulty);

        while (!hash.startsWith(target)) {
            nonce++;
            hash = this.calculateHash(block.index, block.timestamp, block.data, block.previousHash, nonce);
            if (nonce > 100000) break; // 안전장치
        }

        return { hash, nonce };
    }

    // 블록 추가
    addBlock(data: BlockData): Block {
        const previousBlock = this.chain[this.chain.length - 1];

        const newBlock: Omit<Block, 'hash' | 'nonce'> = {
            index: previousBlock.index + 1,
            timestamp: new Date(),
            data,
            previousHash: previousBlock.hash,
            validator: this.validatorAddress
        };

        const { hash, nonce } = this.proofOfWork(newBlock);

        const block: Block = {
            ...newBlock,
            hash,
            nonce
        };

        this.chain.push(block);
        this.emit('block_added', block);

        console.log(`⛓️ Block #${block.index} 추가됨 - ${data.type}`);

        return block;
    }

    // 체인 검증
    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 해시 검증
            const recalculatedHash = this.calculateHash(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.data,
                currentBlock.previousHash,
                currentBlock.nonce
            );

            if (currentBlock.hash !== recalculatedHash) {
                return false;
            }

            // 이전 해시 연결 검증
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    // ============================================
    // 제품 추적 API
    // ============================================

    // 새 제품 등록
    registerProduct(productData: {
        name: string;
        variety: string;
        farmId: string;
        farmName: string;
    }): Product {
        const productId = `PRD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const batchId = `BATCH-${Date.now()}`;

        const product: Product = {
            id: productId,
            name: productData.name,
            variety: productData.variety,
            batchId,
            farmId: productData.farmId,
            farmName: productData.farmName,
            plantDate: new Date(),
            status: 'registered',
            certifications: [],
            carbonFootprint: 0,
            transactions: [],
            currentLocation: productData.farmName,
            qrCode: this.generateQRCode(productId)
        };

        this.products.set(productId, product);

        // 블록체인에 기록
        const block = this.addBlock({
            type: 'seed_registration',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId,
            farmId: productData.farmId,
            actor: 'system',
            action: '제품 등록',
            details: productData,
            certifications: [],
            signature: this.generateSignature(productId)
        });

        product.transactions.push(block.data.transactionId);

        this.emit('product_registered', product);
        return product;
    }

    // 재배 기록 추가
    recordGrowthData(productId: string, data: {
        day: number;
        height: number;
        leafCount: number;
        healthScore: number;
        notes?: string;
    }): Block {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');

        product.status = 'growing';
        product.carbonFootprint += 0.01; // 탄소 발자국 누적

        const block = this.addBlock({
            type: 'growth_record',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            actor: 'growth-sensor',
            action: `Day ${data.day} 성장 기록`,
            details: data,
            certifications: [],
            signature: this.generateSignature(productId)
        });

        product.transactions.push(block.data.transactionId);

        return block;
    }

    // 처리(농약/비료) 기록
    recordTreatment(productId: string, treatment: {
        type: 'fertilizer' | 'pesticide' | 'water' | 'prune' | 'other';
        name: string;
        amount: number;
        unit: string;
        organic: boolean;
    }): Block {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');

        const block = this.addBlock({
            type: 'treatment',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            actor: 'farm-operator',
            action: `${treatment.type} 적용: ${treatment.name}`,
            details: treatment,
            certifications: treatment.organic ? ['organic'] : [],
            signature: this.generateSignature(productId)
        });

        product.transactions.push(block.data.transactionId);
        product.carbonFootprint += treatment.organic ? 0.005 : 0.02;

        return block;
    }

    // 수확 기록
    recordHarvest(productId: string, harvestData: {
        weight: number;
        grade: 'A' | 'B' | 'C';
        operator: string;
    }): Block {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');

        product.status = 'harvested';
        product.harvestDate = new Date();

        const block = this.addBlock({
            type: 'harvest',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            actor: harvestData.operator,
            action: `수확 완료 - ${harvestData.weight}kg, ${harvestData.grade}급`,
            details: harvestData,
            certifications: [],
            signature: this.generateSignature(productId)
        });

        product.transactions.push(block.data.transactionId);

        this.emit('product_harvested', product);
        return block;
    }

    // 인증 추가
    addCertification(productId: string, certification: {
        type: CertificationType;
        issuer: string;
        metadata?: Record<string, any>;
    }): Certification {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');

        const cert: Certification = {
            id: `CERT-${Date.now()}`,
            type: certification.type,
            issuer: certification.issuer,
            issuedDate: new Date(),
            verified: true,
            metadata: certification.metadata || {}
        };

        product.certifications.push(cert);

        // 블록체인에 기록
        this.addBlock({
            type: 'quality_check',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            actor: certification.issuer,
            action: `${certification.type} 인증 발급`,
            details: cert,
            certifications: [certification.type],
            signature: this.generateSignature(productId)
        });

        return cert;
    }

    // ============================================
    // 탄소 크레딧
    // ============================================

    generateCarbonCredit(farmId: string, amount: number, verifier: string): CarbonCredit {
        const credit: CarbonCredit = {
            id: `CC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            farmId,
            amount,
            generatedDate: new Date(),
            verifier,
            status: 'verified'
        };

        this.carbonCredits.push(credit);

        // 블록체인에 기록
        this.addBlock({
            type: 'quality_check',
            transactionId: `TXN-${Date.now()}`,
            productId: credit.id,
            batchId: 'carbon-credit',
            farmId,
            actor: verifier,
            action: `탄소 크레딧 ${amount}톤 CO2e 발급`,
            details: credit,
            certifications: ['carbon_neutral'],
            signature: this.generateSignature(credit.id)
        });

        this.emit('carbon_credit_generated', credit);
        return credit;
    }

    tradeCarbonCredit(creditId: string, buyer: string, price: number): CarbonCredit {
        const credit = this.carbonCredits.find(c => c.id === creditId);
        if (!credit) throw new Error('Carbon credit not found');
        if (credit.status === 'traded') throw new Error('Already traded');

        credit.status = 'traded';
        credit.buyer = buyer;
        credit.price = price;
        credit.tradedDate = new Date();

        this.emit('carbon_credit_traded', credit);
        return credit;
    }

    // ============================================
    // NFT 인증서
    // ============================================

    mintNFTCertificate(productId: string, owner: string): NFTCertificate {
        const product = this.products.get(productId);
        if (!product) throw new Error('Product not found');

        const tokenId = `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const nft: NFTCertificate = {
            tokenId,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            metadata: {
                name: `${product.name} - ${product.variety}`,
                description: `AgriNexus 인증 ${product.name}. ${product.farmName}에서 재배.`,
                image: `https://agrinexus.world/nft/${tokenId}.png`,
                attributes: [
                    { trait_type: 'Farm', value: product.farmName },
                    { trait_type: 'Variety', value: product.variety },
                    { trait_type: 'Harvest Date', value: product.harvestDate?.toISOString() || 'Pending' },
                    { trait_type: 'Certifications', value: product.certifications.map(c => c.type).join(', ') || 'None' },
                    { trait_type: 'Carbon Footprint', value: `${product.carbonFootprint.toFixed(3)} kg CO2e` },
                    { trait_type: 'Transactions', value: product.transactions.length.toString() }
                ]
            },
            owner,
            mintedAt: new Date(),
            transferHistory: []
        };

        this.nftCertificates.set(tokenId, nft);

        // 블록체인에 기록
        this.addBlock({
            type: 'packaging',
            transactionId: `TXN-${Date.now()}`,
            productId,
            batchId: product.batchId,
            farmId: product.farmId,
            actor: 'nft-minter',
            action: `NFT 인증서 발급 - ${tokenId}`,
            details: { tokenId, owner },
            certifications: product.certifications.map(c => c.type),
            signature: this.generateSignature(tokenId)
        });

        this.emit('nft_minted', nft);
        return nft;
    }

    transferNFT(tokenId: string, from: string, to: string): NFTCertificate {
        const nft = this.nftCertificates.get(tokenId);
        if (!nft) throw new Error('NFT not found');
        if (nft.owner !== from) throw new Error('Not the owner');

        nft.transferHistory.push({ from, to, date: new Date() });
        nft.owner = to;

        return nft;
    }

    // ============================================
    // 조회 API
    // ============================================

    getProduct(productId: string): Product | undefined {
        return this.products.get(productId);
    }

    getProductHistory(productId: string): Block[] {
        return this.chain.filter(block => block.data.productId === productId);
    }

    getProductByQRCode(qrCode: string): Product | undefined {
        return Array.from(this.products.values()).find(p => p.qrCode === qrCode);
    }

    getAllProducts(): Product[] {
        return Array.from(this.products.values());
    }

    getCarbonCredits(farmId?: string): CarbonCredit[] {
        if (farmId) {
            return this.carbonCredits.filter(c => c.farmId === farmId);
        }
        return this.carbonCredits;
    }

    getNFT(tokenId: string): NFTCertificate | undefined {
        return this.nftCertificates.get(tokenId);
    }

    getChainStats() {
        return {
            blockCount: this.chain.length,
            productCount: this.products.size,
            totalTransactions: this.chain.reduce((sum, b) => sum + 1, 0),
            carbonCreditsIssued: this.carbonCredits.length,
            nftsMinted: this.nftCertificates.size,
            chainValid: this.isChainValid()
        };
    }

    // 유틸리티
    private generateQRCode(productId: string): string {
        return `https://agrinexus.world/trace/${productId}`;
    }

    private generateSignature(data: string): string {
        return this.simpleHash(`${data}-${this.validatorAddress}-${Date.now()}`).substring(0, 32);
    }
}

// 싱글톤 인스턴스
let blockchainInstance: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
    if (!blockchainInstance) {
        blockchainInstance = new BlockchainService();
    }
    return blockchainInstance;
}

export default BlockchainService;
