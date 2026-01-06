// AgriNexus World OS - 블록체인 농산물 거래소
// Blockchain Agricultural Exchange - 세계 최초 분산형 스마트팜 거래 플랫폼

// ============================================
// 타입 정의
// ============================================

export interface BlockchainExchange {
    id: string;
    name: string;
    network: BlockchainNetwork;
    markets: Market[];
    orders: Order[];
    trades: Trade[];
    tokenRegistry: Token[];
    smartContracts: SmartContract[];
    wallets: Map<string, Wallet>;
    metrics: ExchangeMetrics;
    status: ExchangeStatus;
}

export interface BlockchainNetwork {
    chainId: number;
    name: string;
    consensus: ConsensusType;
    blockTime: number;          // seconds
    currentBlock: number;
    validators: Validator[];
    gasPrice: number;           // in native token
    tps: number;                // transactions per second
}

export type ConsensusType = 'PoS' | 'DPoS' | 'PoA' | 'PBFT' | 'Tendermint';
export type ExchangeStatus = 'active' | 'maintenance' | 'halted';

export interface Validator {
    id: string;
    name: string;
    address: string;
    stake: number;
    uptime: number;
    blocksProduced: number;
    rewards: number;
}

// ============================================
// 토큰 및 자산
// ============================================

export interface Token {
    id: string;
    symbol: string;
    name: string;
    koreanName: string;
    type: TokenType;
    contractAddress: string;
    decimals: number;
    totalSupply: number;
    circulatingSupply: number;
    price: number;              // KRW
    marketCap: number;
    metadata: TokenMetadata;
    verified: boolean;
}

export type TokenType =
    | 'native'          // 네이티브 토큰
    | 'crop'            // 농산물 토큰
    | 'carbon_credit'   // 탄소 크레딧
    | 'nft'             // NFT (고유 자산)
    | 'governance'      // 거버넌스 토큰
    | 'stablecoin';     // 스테이블코인

export interface TokenMetadata {
    description: string;
    category: CropCategory | 'utility' | 'governance';
    origin?: string;
    certification?: string[];
    harvestDate?: Date;
    expiryDate?: Date;
    imageUrl?: string;
    traceabilityId?: string;
}

export type CropCategory = 'fruit' | 'vegetable' | 'grain' | 'herb' | 'processed';

// ============================================
// 시장 및 거래
// ============================================

export interface Market {
    id: string;
    baseToken: string;          // 기준 토큰 (예: STRAWBERRY)
    quoteToken: string;         // 견적 토큰 (예: KRW)
    status: MarketStatus;
    price: number;
    priceChange24h: number;     // %
    high24h: number;
    low24h: number;
    volume24h: number;
    orderBook: OrderBook;
    lastTrade?: Trade;
    createdAt: Date;
}

export type MarketStatus = 'active' | 'paused' | 'delisted';

export interface OrderBook {
    bids: OrderBookEntry[];     // 구매 주문 (가격 내림차순)
    asks: OrderBookEntry[];     // 판매 주문 (가격 오름차순)
    spread: number;             // bid-ask 스프레드
    depth: { bids: number; asks: number }; // 총 물량
}

export interface OrderBookEntry {
    price: number;
    quantity: number;
    total: number;
    orderCount: number;
}

export interface Order {
    id: string;
    marketId: string;
    walletAddress: string;
    type: OrderType;
    side: OrderSide;
    price?: number;             // limit 주문의 경우
    quantity: number;
    filledQuantity: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
    txHash?: string;
    conditions?: OrderCondition[];
}

export type OrderType = 'market' | 'limit' | 'stop_loss' | 'take_profit' | 'trailing_stop';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'expired';

export interface OrderCondition {
    type: 'price_above' | 'price_below' | 'time' | 'volume';
    value: number;
    triggered: boolean;
}

export interface Trade {
    id: string;
    marketId: string;
    buyOrderId: string;
    sellOrderId: string;
    buyerAddress: string;
    sellerAddress: string;
    price: number;
    quantity: number;
    total: number;
    fee: number;
    txHash: string;
    blockNumber: number;
    timestamp: Date;
    settlement: SettlementStatus;
}

export type SettlementStatus = 'pending' | 'confirmed' | 'finalized' | 'failed';

// ============================================
// 스마트 컨트랙트
// ============================================

export interface SmartContract {
    id: string;
    address: string;
    name: string;
    type: ContractType;
    abi: unknown[];
    version: string;
    owner: string;
    verified: boolean;
    deployedAt: Date;
    functions: ContractFunction[];
}

export type ContractType =
    | 'exchange'        // 거래소
    | 'escrow'          // 에스크로
    | 'auction'         // 경매
    | 'forward'         // 선물
    | 'insurance'       // 보험
    | 'governance'      // 거버넌스
    | 'staking';        // 스테이킹

export interface ContractFunction {
    name: string;
    inputs: { name: string; type: string }[];
    outputs: { name: string; type: string }[];
    stateMutability: 'pure' | 'view' | 'nonpayable' | 'payable';
}

// ============================================
// 지갑
// ============================================

export interface Wallet {
    address: string;
    name?: string;
    type: WalletType;
    balances: Map<string, number>;  // tokenId -> balance
    orders: string[];               // 주문 IDs
    trades: string[];               // 거래 IDs
    stakingPositions: StakingPosition[];
    nfts: NFT[];
    createdAt: Date;
}

export type WalletType = 'farm' | 'distributor' | 'consumer' | 'investor' | 'platform';

export interface StakingPosition {
    tokenId: string;
    amount: number;
    stakedAt: Date;
    lockPeriod: number;         // days
    rewardRate: number;         // APY %
    pendingRewards: number;
}

export interface NFT {
    id: string;
    tokenId: string;
    name: string;
    description: string;
    imageUrl: string;
    attributes: { trait: string; value: string }[];
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    mintedAt: Date;
    ownership: { address: string; percentage: number }[];
}

// ============================================
// 메트릭스
// ============================================

export interface ExchangeMetrics {
    totalVolume24h: number;
    totalTrades24h: number;
    totalMarkets: number;
    activeMarkets: number;
    totalUsers: number;
    activeUsers24h: number;
    totalValueLocked: number;     // TVL
    totalTokensListed: number;
    averageTxTime: number;        // seconds
    gasUsed24h: number;
}

// ============================================
// 블록체인 거래소 엔진
// ============================================

export class BlockchainExchangeEngine {
    private exchange: BlockchainExchange;

    constructor() {
        this.exchange = this.initializeExchange();
    }

    private initializeExchange(): BlockchainExchange {
        const network = this.createNetwork();
        const tokens = this.createInitialTokens();
        const markets = this.createInitialMarkets(tokens);
        const contracts = this.createSmartContracts();

        return {
            id: 'anx-exchange-001',
            name: 'AgriNexus DEX',
            network,
            markets,
            orders: [],
            trades: [],
            tokenRegistry: tokens,
            smartContracts: contracts,
            wallets: new Map(),
            metrics: {
                totalVolume24h: 0,
                totalTrades24h: 0,
                totalMarkets: markets.length,
                activeMarkets: markets.length,
                totalUsers: 0,
                activeUsers24h: 0,
                totalValueLocked: 1000000000, // 10억원
                totalTokensListed: tokens.length,
                averageTxTime: 2.5,
                gasUsed24h: 0
            },
            status: 'active'
        };
    }

    private createNetwork(): BlockchainNetwork {
        return {
            chainId: 53710,
            name: 'AgriNexus Chain',
            consensus: 'DPoS',
            blockTime: 2,
            currentBlock: 15000000,
            validators: [
                { id: 'v1', name: 'AgriNexus Foundation', address: '0xANX001...', stake: 1000000, uptime: 99.99, blocksProduced: 5000000, rewards: 50000 },
                { id: 'v2', name: 'Smart Farm Alliance', address: '0xANX002...', stake: 800000, uptime: 99.95, blocksProduced: 4000000, rewards: 40000 },
                { id: 'v3', name: 'Agricultural DAO', address: '0xANX003...', stake: 600000, uptime: 99.90, blocksProduced: 3000000, rewards: 30000 },
            ],
            gasPrice: 0.001,
            tps: 10000
        };
    }

    private createInitialTokens(): Token[] {
        return [
            {
                id: 'anx',
                symbol: 'ANX',
                name: 'AgriNexus Token',
                koreanName: '애그리넥서스 토큰',
                type: 'native',
                contractAddress: '0x0000...',
                decimals: 18,
                totalSupply: 1000000000,
                circulatingSupply: 300000000,
                price: 1000,
                marketCap: 300000000000,
                metadata: { description: 'AgriNexus 플랫폼 네이티브 토큰', category: 'utility' },
                verified: true
            },
            {
                id: 'strawberry-token',
                symbol: 'STB',
                name: 'Premium Strawberry Token',
                koreanName: '프리미엄 딸기 토큰',
                type: 'crop',
                contractAddress: '0xSTB001...',
                decimals: 6,
                totalSupply: 100000,
                circulatingSupply: 50000,
                price: 5000,
                marketCap: 250000000,
                metadata: {
                    description: '프리미엄 딸기 1kg = 1 STB',
                    category: 'fruit',
                    origin: 'Korea',
                    certification: ['GAP', 'HACCP']
                },
                verified: true
            },
            {
                id: 'tomato-token',
                symbol: 'TMT',
                name: 'Organic Tomato Token',
                koreanName: '유기농 토마토 토큰',
                type: 'crop',
                contractAddress: '0xTMT001...',
                decimals: 6,
                totalSupply: 200000,
                circulatingSupply: 100000,
                price: 3000,
                marketCap: 300000000,
                metadata: {
                    description: '유기농 토마토 1kg = 1 TMT',
                    category: 'vegetable',
                    origin: 'Korea',
                    certification: ['Organic', 'HACCP']
                },
                verified: true
            },
            {
                id: 'carbon-credit',
                symbol: 'CRC',
                name: 'Carbon Credit',
                koreanName: '탄소 크레딧',
                type: 'carbon_credit',
                contractAddress: '0xCRC001...',
                decimals: 18,
                totalSupply: 1000000,
                circulatingSupply: 500000,
                price: 50000,
                marketCap: 25000000000,
                metadata: {
                    description: '1 CRC = 1톤 CO2 상쇄',
                    category: 'utility',
                    certification: ['VCS', 'Gold Standard']
                },
                verified: true
            },
            {
                id: 'krw-stable',
                symbol: 'KRWS',
                name: 'Korean Won Stablecoin',
                koreanName: '원화 스테이블코인',
                type: 'stablecoin',
                contractAddress: '0xKRWS001...',
                decimals: 18,
                totalSupply: 100000000000,
                circulatingSupply: 50000000000,
                price: 1,
                marketCap: 50000000000,
                metadata: { description: '1 KRWS = 1 KRW', category: 'utility' },
                verified: true
            }
        ];
    }

    private createInitialMarkets(tokens: Token[]): Market[] {
        return [
            this.createMarket('strawberry-token', 'krw-stable', 5000),
            this.createMarket('tomato-token', 'krw-stable', 3000),
            this.createMarket('carbon-credit', 'krw-stable', 50000),
            this.createMarket('anx', 'krw-stable', 1000),
            this.createMarket('strawberry-token', 'anx', 5)
        ];
    }

    private createMarket(baseToken: string, quoteToken: string, price: number): Market {
        return {
            id: `${baseToken}-${quoteToken}`,
            baseToken,
            quoteToken,
            status: 'active',
            price,
            priceChange24h: (Math.random() - 0.5) * 10,
            high24h: price * 1.05,
            low24h: price * 0.95,
            volume24h: Math.random() * 1000000000,
            orderBook: this.generateOrderBook(price),
            createdAt: new Date()
        };
    }

    private generateOrderBook(price: number): OrderBook {
        const bids: OrderBookEntry[] = [];
        const asks: OrderBookEntry[] = [];

        for (let i = 0; i < 10; i++) {
            const bidPrice = price * (1 - 0.001 * (i + 1));
            const askPrice = price * (1 + 0.001 * (i + 1));
            const bidQty = Math.random() * 1000;
            const askQty = Math.random() * 1000;

            bids.push({
                price: bidPrice,
                quantity: bidQty,
                total: bidPrice * bidQty,
                orderCount: Math.floor(Math.random() * 10) + 1
            });

            asks.push({
                price: askPrice,
                quantity: askQty,
                total: askPrice * askQty,
                orderCount: Math.floor(Math.random() * 10) + 1
            });
        }

        return {
            bids,
            asks,
            spread: asks[0].price - bids[0].price,
            depth: {
                bids: bids.reduce((s, b) => s + b.quantity, 0),
                asks: asks.reduce((s, a) => s + a.quantity, 0)
            }
        };
    }

    private createSmartContracts(): SmartContract[] {
        return [
            {
                id: 'sc-exchange',
                address: '0xEXCH001...',
                name: 'AgriNexus DEX',
                type: 'exchange',
                abi: [],
                version: '2.0.0',
                owner: '0xANX001...',
                verified: true,
                deployedAt: new Date(),
                functions: [
                    { name: 'swap', inputs: [{ name: 'tokenIn', type: 'address' }, { name: 'tokenOut', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: 'amountOut', type: 'uint256' }], stateMutability: 'payable' },
                    { name: 'addLiquidity', inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }, { name: 'amountA', type: 'uint256' }, { name: 'amountB', type: 'uint256' }], outputs: [{ name: 'liquidity', type: 'uint256' }], stateMutability: 'payable' }
                ]
            },
            {
                id: 'sc-escrow',
                address: '0xESCR001...',
                name: 'Trade Escrow',
                type: 'escrow',
                abi: [],
                version: '1.5.0',
                owner: '0xANX001...',
                verified: true,
                deployedAt: new Date(),
                functions: [
                    { name: 'createEscrow', inputs: [{ name: 'buyer', type: 'address' }, { name: 'seller', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: 'escrowId', type: 'uint256' }], stateMutability: 'payable' },
                    { name: 'release', inputs: [{ name: 'escrowId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' }
                ]
            },
            {
                id: 'sc-auction',
                address: '0xAUCT001...',
                name: 'Crop Auction',
                type: 'auction',
                abi: [],
                version: '1.2.0',
                owner: '0xANX001...',
                verified: true,
                deployedAt: new Date(),
                functions: [
                    { name: 'createAuction', inputs: [{ name: 'token', type: 'address' }, { name: 'startPrice', type: 'uint256' }, { name: 'duration', type: 'uint256' }], outputs: [{ name: 'auctionId', type: 'uint256' }], stateMutability: 'nonpayable' },
                    { name: 'bid', inputs: [{ name: 'auctionId', type: 'uint256' }], outputs: [], stateMutability: 'payable' }
                ]
            }
        ];
    }

    // 지갑 생성
    createWallet(name: string, type: WalletType): Wallet {
        const address = `0x${Math.random().toString(16).slice(2, 42)}`;
        const wallet: Wallet = {
            address,
            name,
            type,
            balances: new Map([['krw-stable', 10000000], ['anx', 1000]]),
            orders: [],
            trades: [],
            stakingPositions: [],
            nfts: [],
            createdAt: new Date()
        };

        this.exchange.wallets.set(address, wallet);
        this.exchange.metrics.totalUsers++;
        return wallet;
    }

    // 주문 생성
    createOrder(walletAddress: string, marketId: string, side: OrderSide, type: OrderType, quantity: number, price?: number): Order {
        const wallet = this.exchange.wallets.get(walletAddress);
        if (!wallet) throw new Error('Wallet not found');

        const market = this.exchange.markets.find(m => m.id === marketId);
        if (!market) throw new Error('Market not found');

        const order: Order = {
            id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            marketId,
            walletAddress,
            type,
            side,
            price: type === 'market' ? undefined : price,
            quantity,
            filledQuantity: 0,
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.exchange.orders.push(order);
        wallet.orders.push(order.id);

        // 자동 매칭 시뮬레이션
        this.matchOrder(order, market);

        return order;
    }

    private matchOrder(order: Order, market: Market): void {
        const oppositeBook = order.side === 'buy' ? market.orderBook.asks : market.orderBook.bids;

        if (oppositeBook.length === 0) return;

        const matchPrice = order.type === 'market'
            ? oppositeBook[0].price
            : order.price!;

        // 부분 체결 시뮬레이션
        const fillQuantity = Math.min(order.quantity, oppositeBook[0].quantity);
        order.filledQuantity = fillQuantity;
        order.status = fillQuantity >= order.quantity ? 'filled' : 'partially_filled';
        order.updatedAt = new Date();

        // 거래 생성
        const trade: Trade = {
            id: `trade-${Date.now()}`,
            marketId: market.id,
            buyOrderId: order.side === 'buy' ? order.id : 'external',
            sellOrderId: order.side === 'sell' ? order.id : 'external',
            buyerAddress: order.side === 'buy' ? order.walletAddress : 'external',
            sellerAddress: order.side === 'sell' ? order.walletAddress : 'external',
            price: matchPrice,
            quantity: fillQuantity,
            total: matchPrice * fillQuantity,
            fee: matchPrice * fillQuantity * 0.001, // 0.1% 수수료
            txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
            blockNumber: this.exchange.network.currentBlock++,
            timestamp: new Date(),
            settlement: 'confirmed'
        };

        this.exchange.trades.push(trade);
        this.exchange.metrics.totalTrades24h++;
        this.exchange.metrics.totalVolume24h += trade.total;

        // 시장 가격 업데이트
        market.price = matchPrice;
        market.lastTrade = trade;
    }

    // 시장 조회
    getMarket(marketId: string): Market | undefined {
        return this.exchange.markets.find(m => m.id === marketId);
    }

    // 모든 시장 조회
    getAllMarkets(): Market[] {
        return this.exchange.markets;
    }

    // 토큰 조회
    getToken(tokenId: string): Token | undefined {
        return this.exchange.tokenRegistry.find(t => t.id === tokenId);
    }

    // 모든 토큰 조회
    getAllTokens(): Token[] {
        return this.exchange.tokenRegistry;
    }

    // 거래소 메트릭스 조회
    getExchangeMetrics(): ExchangeMetrics {
        return this.exchange.metrics;
    }

    // 거래소 상태 조회
    getExchangeStatus(): BlockchainExchange {
        return this.exchange;
    }

    // 주문 조회
    getOrder(orderId: string): Order | undefined {
        return this.exchange.orders.find(o => o.id === orderId);
    }

    // 지갑 주문 조회
    getWalletOrders(walletAddress: string): Order[] {
        return this.exchange.orders.filter(o => o.walletAddress === walletAddress);
    }

    // 최근 거래 조회
    getRecentTrades(marketId: string, limit: number = 20): Trade[] {
        return this.exchange.trades
            .filter(t => t.marketId === marketId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let exchangeEngine: BlockchainExchangeEngine | null = null;

export function getBlockchainExchangeEngine(): BlockchainExchangeEngine {
    if (!exchangeEngine) {
        exchangeEngine = new BlockchainExchangeEngine();
    }
    return exchangeEngine;
}

// 토큰 타입 아이콘
export const TOKEN_TYPE_ICONS: Record<TokenType, string> = {
    native: '💎',
    crop: '🌾',
    carbon_credit: '🌍',
    nft: '🎨',
    governance: '🗳️',
    stablecoin: '💵'
};

// 주문 상태 아이콘
export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
    pending: '⏳',
    open: '📖',
    partially_filled: '🔄',
    filled: '✅',
    cancelled: '❌',
    expired: '⏰'
};
