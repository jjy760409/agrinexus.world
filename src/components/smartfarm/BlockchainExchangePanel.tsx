'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getBlockchainExchangeEngine,
    Market,
    Token,
    Order,
    Trade,
    ExchangeMetrics,
    TOKEN_TYPE_ICONS,
    ORDER_STATUS_ICONS,
    OrderSide
} from '@/lib/blockchain/blockchainExchange';

export default function BlockchainExchangePanel() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [tokens, setTokens] = useState<Token[]>([]);
    const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
    const [metrics, setMetrics] = useState<ExchangeMetrics | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
    const [activeTab, setActiveTab] = useState<'markets' | 'trade' | 'tokens' | 'portfolio'>('markets');
    const [orderSide, setOrderSide] = useState<OrderSide>('buy');
    const [orderAmount, setOrderAmount] = useState('');
    const [orderPrice, setOrderPrice] = useState('');

    const engine = useMemo(() => getBlockchainExchangeEngine(), []);

    useEffect(() => {
        const updateData = () => {
            setMarkets(engine.getAllMarkets());
            setTokens(engine.getAllTokens());
            setMetrics(engine.getExchangeMetrics());

            const firstMarket = engine.getAllMarkets()[0];
            if (firstMarket && !selectedMarket) {
                setSelectedMarket(firstMarket);
                setRecentTrades(engine.getRecentTrades(firstMarket.id, 10));
            }
        };
        updateData();

        const interval = setInterval(updateData, 3000);
        return () => clearInterval(interval);
    }, [engine, selectedMarket]);

    const selectMarket = (market: Market) => {
        setSelectedMarket(market);
        setRecentTrades(engine.getRecentTrades(market.id, 10));
        setOrderPrice(market.price.toString());
    };

    const tabs = [
        { id: 'markets' as const, label: '마켓', icon: '📊' },
        { id: 'trade' as const, label: '거래', icon: '💱' },
        { id: 'tokens' as const, label: '토큰', icon: '🪙' },
        { id: 'portfolio' as const, label: '포트폴리오', icon: '💼' },
    ];

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toFixed(0);
    };

    return (
        <div className="h-full flex flex-col">
            {/* 헤더 */}
            <div className="glass rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="text-3xl">⛓️</span>
                            AgriNexus DEX
                        </h2>
                        <div className="text-sm text-white/50">
                            분산형 농산물 거래소 · 10,000 TPS · DPoS 합의
                        </div>
                    </div>

                    {metrics && (
                        <div className="flex gap-4 text-sm">
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-green-400">₩{formatNumber(metrics.totalVolume24h)}</div>
                                <div className="text-white/50">24h 거래량</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-blue-400">{metrics.totalTrades24h}</div>
                                <div className="text-white/50">거래 수</div>
                            </div>
                            <div className="text-center px-4">
                                <div className="text-2xl font-bold text-purple-400">₩{formatNumber(metrics.totalValueLocked)}</div>
                                <div className="text-white/50">TVL</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-400'
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
                <AnimatePresence mode="wait">
                    {/* 마켓 탭 */}
                    {activeTab === 'markets' && (
                        <motion.div
                            key="markets"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 glass rounded-xl p-4 overflow-y-auto"
                        >
                            <h3 className="font-bold mb-4">📊 마켓 목록</h3>
                            <div className="space-y-2">
                                {markets.map(market => {
                                    const baseToken = tokens.find(t => t.id === market.baseToken);
                                    const quoteToken = tokens.find(t => t.id === market.quoteToken);

                                    return (
                                        <button
                                            key={market.id}
                                            onClick={() => selectMarket(market)}
                                            className={`w-full p-4 rounded-lg text-left transition-all ${selectedMarket?.id === market.id
                                                    ? 'bg-yellow-500/20 border border-yellow-400'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">
                                                        {baseToken ? TOKEN_TYPE_ICONS[baseToken.type] : '🪙'}
                                                    </span>
                                                    <div>
                                                        <div className="font-bold">
                                                            {baseToken?.symbol || market.baseToken} / {quoteToken?.symbol || market.quoteToken}
                                                        </div>
                                                        <div className="text-xs text-white/50">
                                                            {baseToken?.koreanName}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold">₩{market.price.toLocaleString()}</div>
                                                    <div className={`text-sm ${market.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>24h 거래량: ₩{formatNumber(market.volume24h)}</span>
                                                <span>고가: ₩{market.high24h.toLocaleString()}</span>
                                                <span>저가: ₩{market.low24h.toLocaleString()}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* 거래 탭 */}
                    {activeTab === 'trade' && selectedMarket && (
                        <motion.div
                            key="trade"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex gap-4"
                        >
                            {/* 오더북 */}
                            <div className="w-1/3 glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📖 오더북</h3>

                                {/* 매도 호가 */}
                                <div className="space-y-1 mb-4">
                                    {selectedMarket.orderBook.asks.slice(0, 5).reverse().map((ask, i) => (
                                        <div key={`ask-${i}`} className="flex justify-between text-sm relative">
                                            <div className="absolute inset-0 bg-red-500/20" style={{ width: `${Math.min(100, ask.quantity / 10)}%` }} />
                                            <span className="relative text-red-400">₩{ask.price.toLocaleString()}</span>
                                            <span className="relative">{ask.quantity.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* 현재가 */}
                                <div className="py-2 border-y border-white/10 text-center mb-4">
                                    <span className={`text-xl font-bold ${selectedMarket.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        ₩{selectedMarket.price.toLocaleString()}
                                    </span>
                                </div>

                                {/* 매수 호가 */}
                                <div className="space-y-1">
                                    {selectedMarket.orderBook.bids.slice(0, 5).map((bid, i) => (
                                        <div key={`bid-${i}`} className="flex justify-between text-sm relative">
                                            <div className="absolute inset-0 bg-green-500/20" style={{ width: `${Math.min(100, bid.quantity / 10)}%` }} />
                                            <span className="relative text-green-400">₩{bid.price.toLocaleString()}</span>
                                            <span className="relative">{bid.quantity.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 주문 */}
                            <div className="w-1/3 glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">💱 주문</h3>

                                {/* 매수/매도 탭 */}
                                <div className="flex mb-4">
                                    <button
                                        onClick={() => setOrderSide('buy')}
                                        className={`flex-1 py-2 rounded-l-lg font-bold ${orderSide === 'buy'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white/10 text-white/60'
                                            }`}
                                    >
                                        매수
                                    </button>
                                    <button
                                        onClick={() => setOrderSide('sell')}
                                        className={`flex-1 py-2 rounded-r-lg font-bold ${orderSide === 'sell'
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/10 text-white/60'
                                            }`}
                                    >
                                        매도
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-white/60 block mb-1">가격 (KRW)</label>
                                        <input
                                            type="text"
                                            value={orderPrice}
                                            onChange={(e) => setOrderPrice(e.target.value)}
                                            className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-yellow-400 focus:outline-none"
                                            placeholder="가격 입력"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-white/60 block mb-1">수량</label>
                                        <input
                                            type="text"
                                            value={orderAmount}
                                            onChange={(e) => setOrderAmount(e.target.value)}
                                            className="w-full p-3 bg-white/5 rounded-lg border border-white/10 focus:border-yellow-400 focus:outline-none"
                                            placeholder="수량 입력"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        {[25, 50, 75, 100].map(pct => (
                                            <button
                                                key={pct}
                                                className="flex-1 py-1 bg-white/10 rounded text-xs hover:bg-white/20"
                                            >
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className={`w-full py-3 rounded-lg font-bold ${orderSide === 'buy'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-r from-red-500 to-pink-500'
                                            }`}
                                    >
                                        {orderSide === 'buy' ? '매수' : '매도'}
                                    </button>
                                </div>
                            </div>

                            {/* 최근 거래 */}
                            <div className="w-1/3 glass rounded-xl p-4">
                                <h3 className="font-bold mb-4">📜 최근 거래</h3>
                                <div className="space-y-2">
                                    {recentTrades.map(trade => (
                                        <div key={trade.id} className="p-2 bg-white/5 rounded text-sm">
                                            <div className="flex justify-between">
                                                <span className={trade.buyerAddress === 'external' ? 'text-red-400' : 'text-green-400'}>
                                                    ₩{trade.price.toLocaleString()}
                                                </span>
                                                <span>{trade.quantity.toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-white/50">
                                                {new Date(trade.timestamp).toLocaleTimeString('ko-KR')}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 토큰 탭 */}
                    {activeTab === 'tokens' && (
                        <motion.div
                            key="tokens"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 glass rounded-xl p-4 overflow-y-auto"
                        >
                            <h3 className="font-bold mb-4">🪙 등록 토큰</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {tokens.map(token => (
                                    <div key={token.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-4xl">{TOKEN_TYPE_ICONS[token.type]}</span>
                                            <div>
                                                <div className="font-bold">{token.symbol}</div>
                                                <div className="text-sm text-white/60">{token.koreanName}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/60">가격</span>
                                                <span className="text-green-400">₩{token.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">시가총액</span>
                                                <span>₩{formatNumber(token.marketCap)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/60">유통량</span>
                                                <span>{formatNumber(token.circulatingSupply)}</span>
                                            </div>
                                        </div>
                                        {token.verified && (
                                            <div className="mt-2 text-xs text-green-400">✓ 검증됨</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 포트폴리오 탭 */}
                    {activeTab === 'portfolio' && (
                        <motion.div
                            key="portfolio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 glass rounded-xl p-4"
                        >
                            <h3 className="font-bold mb-4">💼 내 포트폴리오</h3>

                            <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl mb-4">
                                <div className="text-sm text-white/60 mb-1">총 자산</div>
                                <div className="text-3xl font-bold">₩12,450,000</div>
                                <div className="text-green-400 text-sm">+5.2% (24h)</div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { symbol: 'ANX', amount: 1000, value: 1000000 },
                                    { symbol: 'STB', amount: 500, value: 2500000 },
                                    { symbol: 'TMT', amount: 1000, value: 3000000 },
                                    { symbol: 'CRC', amount: 50, value: 2500000 },
                                    { symbol: 'KRWS', amount: 3450000, value: 3450000 },
                                ].map(holding => {
                                    const token = tokens.find(t => t.symbol === holding.symbol);
                                    return (
                                        <div key={holding.symbol} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{token ? TOKEN_TYPE_ICONS[token.type] : '🪙'}</span>
                                                <div>
                                                    <div className="font-bold">{holding.symbol}</div>
                                                    <div className="text-xs text-white/50">{holding.amount.toLocaleString()} 개</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">₩{holding.value.toLocaleString()}</div>
                                                <div className="text-xs text-white/50">
                                                    {((holding.value / 12450000) * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
