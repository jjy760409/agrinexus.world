// AgriNexus World OS - 종합 작물 데이터베이스
// 재배, 비용, 수익, 시세, 관리 정보 통합

// ============================================
// 타입 정의
// ============================================

export interface CropData {
    id: string;
    name: string;
    koreanName: string;
    scientificName: string;
    category: CropCategory;
    image: string;
    model3D?: string;

    // 기본 정보
    description: string;
    origin: string;
    varieties: string[];

    // 재배 조건
    cultivation: CultivationRequirements;

    // 성장 단계
    growthStages: GrowthStage[];

    // 경제성 분석
    economics: CropEconomics;

    // 영양 정보
    nutrition: NutritionInfo;

    // 병해충 정보
    pests: PestInfo[];
    diseases: DiseaseInfo[];

    // 수확 정보
    harvest: HarvestInfo;

    // 포장 및 유통
    packaging: PackagingInfo;

    // 시장 정보
    market: MarketInfo;
}

export type CropCategory =
    | 'leafy'      // 엽채류
    | 'fruit'      // 과채류
    | 'root'       // 근채류
    | 'herb'       // 허브
    | 'berry'      // 베리류
    | 'flower'     // 식용꽃
    | 'sprout'     // 새싹채소
    | 'mushroom';  // 버섯류

export interface CultivationRequirements {
    temperature: { min: number; max: number; optimal: number };
    humidity: { min: number; max: number; optimal: number };
    co2: { min: number; max: number; optimal: number };
    light: {
        ppfd: { min: number; max: number; optimal: number };
        dli: number;
        photoperiod: number; // 일조 시간
        spectrum: string;
    };
    ph: { min: number; max: number; optimal: number };
    ec: { min: number; max: number; optimal: number };
    waterTemperature: { min: number; max: number; optimal: number };
    nutrients: {
        nitrogen: number;
        phosphorus: number;
        potassium: number;
        calcium: number;
        magnesium: number;
    };
    spacing: { plant: number; row: number }; // cm
    germinationDays: number;
    transplantDays: number;
    harvestDays: number;
    totalCycleDays: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface GrowthStage {
    stage: number;
    name: string;
    koreanName: string;
    daysFromStart: number;
    duration: number;
    description: string;
    requirements: {
        temperature?: number;
        humidity?: number;
        light?: number;
        ec?: number;
    };
    actions: string[];
    risks: string[];
}

export interface CropEconomics {
    // 초기 투자
    setupCostPerM2: number;         // ₩/m²

    // 운영 비용 (1 사이클 기준)
    operatingCosts: {
        seeds: number;              // ₩/m²
        nutrients: number;
        energy: number;
        water: number;
        labor: number;
        packaging: number;
        other: number;
        total: number;
    };

    // 수확량
    yieldPerM2: { min: number; max: number; avg: number }; // kg/m²
    harvestsPerYear: number;
    annualYieldPerM2: number;      // kg/m²/년

    // 수익
    sellingPrice: {
        wholesale: number;          // ₩/kg
        retail: number;
        premium: number;
        organic: number;
    };

    // 수익성 분석
    revenuePerCycle: number;        // ₩/m²
    profitPerCycle: number;
    annualRevenue: number;
    annualProfit: number;
    roi: number;                    // %
    paybackMonths: number;
    profitMargin: number;           // %

    // 리스크
    riskLevel: 'low' | 'medium' | 'high';
    marketStability: 'stable' | 'volatile' | 'seasonal';
}

export interface NutritionInfo {
    calories: number;               // kcal/100g
    protein: number;                // g/100g
    carbohydrates: number;
    fiber: number;
    fat: number;
    vitamins: { name: string; amount: string }[];
    minerals: { name: string; amount: string }[];
    healthBenefits: string[];
}

export interface PestInfo {
    name: string;
    koreanName: string;
    description: string;
    symptoms: string[];
    prevention: string[];
    treatment: string[];
    organicTreatment?: string[];
}

export interface DiseaseInfo {
    name: string;
    koreanName: string;
    cause: string;
    symptoms: string[];
    prevention: string[];
    treatment: string[];
}

export interface HarvestInfo {
    method: 'manual' | 'semi-auto' | 'full-auto';
    indicators: string[];           // 수확 시기 지표
    timing: string;                 // 최적 수확 시간
    handling: string[];             // 취급 주의사항
    postHarvest: {
        cleaning: string;
        cooling: string;
        storage: {
            temperature: number;
            humidity: number;
            shelfLife: number;      // 일
        };
    };
}

export interface PackagingInfo {
    types: {
        type: string;
        weight: string;
        targetMarket: string;
        priceMultiplier: number;
    }[];
    requirements: string[];
    labeling: string[];
}

export interface MarketInfo {
    demandTrend: 'rising' | 'stable' | 'declining';
    seasonality: { month: number; demand: number }[];
    targetMarkets: string[];
    competitors: string[];
    priceHistory: { date: string; price: number }[];
    exportPotential: boolean;
    certifications: string[];
}

// ============================================
// 작물 데이터베이스
// ============================================

export const CROP_DATABASE: CropData[] = [
    // 🍓 딸기
    {
        id: 'strawberry',
        name: 'Strawberry',
        koreanName: '딸기',
        scientificName: 'Fragaria × ananassa',
        category: 'berry',
        image: '/crops/strawberry.png',

        description: '달콤하고 향긋한 베리로, 스마트팜에서 가장 수익성 높은 작물 중 하나입니다. 연중 재배가 가능하며 프리미엄 시장에서 높은 가격을 받습니다.',
        origin: '프랑스 (18세기 교배종)',
        varieties: ['설향', '매향', '금실', '죽향', '킹스베리', '산타', '장희'],

        cultivation: {
            temperature: { min: 15, max: 28, optimal: 20 },
            humidity: { min: 60, max: 80, optimal: 70 },
            co2: { min: 800, max: 1500, optimal: 1000 },
            light: {
                ppfd: { min: 300, max: 600, optimal: 450 },
                dli: 17,
                photoperiod: 16,
                spectrum: '적색:청색 = 8:2'
            },
            ph: { min: 5.5, max: 6.5, optimal: 6.0 },
            ec: { min: 1.0, max: 2.0, optimal: 1.5 },
            waterTemperature: { min: 18, max: 22, optimal: 20 },
            nutrients: {
                nitrogen: 150,
                phosphorus: 50,
                potassium: 200,
                calcium: 150,
                magnesium: 50
            },
            spacing: { plant: 25, row: 30 },
            germinationDays: 14,
            transplantDays: 30,
            harvestDays: 120,
            totalCycleDays: 150,
            difficulty: 'medium'
        },

        growthStages: [
            {
                stage: 1,
                name: 'Germination',
                koreanName: '발아기',
                daysFromStart: 0,
                duration: 14,
                description: '종자에서 싹이 트는 단계',
                requirements: { temperature: 22, humidity: 85 },
                actions: ['일정한 수분 유지', '암실 보관'],
                risks: ['과습으로 인한 곰팡이']
            },
            {
                stage: 2,
                name: 'Seedling',
                koreanName: '육묘기',
                daysFromStart: 14,
                duration: 30,
                description: '본잎이 3-4장 생성되는 단계',
                requirements: { temperature: 20, humidity: 75, light: 300 },
                actions: ['광량 점진적 증가', '양액 공급 시작'],
                risks: ['웃자람', '양분 결핍']
            },
            {
                stage: 3,
                name: 'Vegetative',
                koreanName: '영양생장기',
                daysFromStart: 44,
                duration: 40,
                description: '잎과 크라운이 활발히 성장',
                requirements: { temperature: 22, humidity: 70, light: 400, ec: 1.2 },
                actions: ['러너 제거', '충분한 광량 확보'],
                risks: ['과다 질소로 인한 웃자람']
            },
            {
                stage: 4,
                name: 'Flowering',
                koreanName: '개화기',
                daysFromStart: 84,
                duration: 20,
                description: '꽃이 피고 수분이 이루어지는 단계',
                requirements: { temperature: 18, humidity: 65, light: 450, ec: 1.5 },
                actions: ['수분 보조 (팬, 벌)', '꽃솎기'],
                risks: ['고온 화분 불임', '저온 피해']
            },
            {
                stage: 5,
                name: 'Fruiting',
                koreanName: '착과기',
                daysFromStart: 104,
                duration: 30,
                description: '열매가 맺히고 비대해지는 단계',
                requirements: { temperature: 20, humidity: 70, light: 500, ec: 1.8 },
                actions: ['과일 매트 설치', '잿빛곰팡이 예방'],
                risks: ['기형과', '칼슘 결핍']
            },
            {
                stage: 6,
                name: 'Ripening',
                koreanName: '성숙기',
                daysFromStart: 134,
                duration: 16,
                description: '열매가 붉게 익는 단계',
                requirements: { temperature: 18, humidity: 65, light: 450 },
                actions: ['수확 타이밍 판단', '선별 준비'],
                risks: ['과숙', '열과']
            }
        ],

        economics: {
            setupCostPerM2: 500000,
            operatingCosts: {
                seeds: 15000,
                nutrients: 8000,
                energy: 25000,
                water: 3000,
                labor: 20000,
                packaging: 10000,
                other: 5000,
                total: 86000
            },
            yieldPerM2: { min: 3, max: 6, avg: 4.5 },
            harvestsPerYear: 2.5,
            annualYieldPerM2: 11.25,
            sellingPrice: {
                wholesale: 15000,
                retail: 25000,
                premium: 40000,
                organic: 50000
            },
            revenuePerCycle: 112500,
            profitPerCycle: 26500,
            annualRevenue: 281250,
            annualProfit: 66250,
            roi: 13.25,
            paybackMonths: 36,
            profitMargin: 23.6,
            riskLevel: 'medium',
            marketStability: 'stable'
        },

        nutrition: {
            calories: 32,
            protein: 0.7,
            carbohydrates: 7.7,
            fiber: 2.0,
            fat: 0.3,
            vitamins: [
                { name: 'Vitamin C', amount: '58.8mg (65% DV)' },
                { name: 'Folate', amount: '24μg' },
                { name: 'Vitamin K', amount: '2.2μg' }
            ],
            minerals: [
                { name: '망간', amount: '0.39mg' },
                { name: '칼륨', amount: '153mg' },
                { name: '마그네슘', amount: '13mg' }
            ],
            healthBenefits: [
                '강력한 항산화 작용',
                '혈당 조절 도움',
                '피부 건강 개선',
                '심장 건강 지원',
                '면역력 강화'
            ]
        },

        pests: [
            {
                name: 'Aphids',
                koreanName: '진딧물',
                description: '잎 뒷면에 서식하며 즙을 빨아먹음',
                symptoms: ['잎 말림', '생장 저해', '바이러스 매개'],
                prevention: ['천적 도입', '환기 관리'],
                treatment: ['니코틴계 약제', '오일 스프레이'],
                organicTreatment: ['님 오일', '친환경 살충제']
            },
            {
                name: 'Spider Mites',
                koreanName: '점박이응애',
                description: '잎에서 즙을 빨아먹어 반점 생성',
                symptoms: ['잎 황변', '거미줄 생성', '생육 저하'],
                prevention: ['습도 관리', '천적 도입'],
                treatment: ['응애 전용 약제'],
                organicTreatment: ['칠레이리응애 천적']
            }
        ],

        diseases: [
            {
                name: 'Gray Mold',
                koreanName: '잿빛곰팡이병',
                cause: 'Botrytis cinerea 곰팡이',
                symptoms: ['회색 곰팡이 발생', '과일 부패'],
                prevention: ['환기', '적정 습도 유지', '낙엽 제거'],
                treatment: ['살균제 처리', '감염 부위 제거']
            },
            {
                name: 'Powdery Mildew',
                koreanName: '흰가루병',
                cause: 'Podosphaera aphanis 곰팡이',
                symptoms: ['잎에 흰 가루', '잎 말림'],
                prevention: ['적정 환기', '밀식 피하기'],
                treatment: ['황 살균제', '탄산수소칼륨']
            }
        ],

        harvest: {
            method: 'semi-auto',
            indicators: ['80% 이상 착색', '꼭지 여전히 녹색', '단단한 상태'],
            timing: '오전 10시 이전 (당도 최고)',
            handling: ['꼭지 부분 잡기', '부드럽게 다루기', '직사광선 피하기'],
            postHarvest: {
                cleaning: '마른 솔로 가볍게 세척',
                cooling: '예냉 처리 (2-4°C, 1시간)',
                storage: {
                    temperature: 2,
                    humidity: 95,
                    shelfLife: 7
                }
            }
        },

        packaging: {
            types: [
                { type: '500g 팩', weight: '500g', targetMarket: '소매', priceMultiplier: 1.0 },
                { type: '1kg 박스', weight: '1kg', targetMarket: '도매', priceMultiplier: 0.85 },
                { type: '선물세트', weight: '2kg', targetMarket: '프리미엄', priceMultiplier: 1.5 },
                { type: '대용량', weight: '3kg', targetMarket: '급식/가공', priceMultiplier: 0.7 }
            ],
            requirements: ['저온 유통', '통풍 포장', '충격 방지'],
            labeling: ['품종', '등급', '재배자', '포장일자', 'GAP 인증']
        },

        market: {
            demandTrend: 'rising',
            seasonality: [
                { month: 1, demand: 120 }, { month: 2, demand: 130 },
                { month: 3, demand: 100 }, { month: 4, demand: 80 },
                { month: 5, demand: 70 }, { month: 6, demand: 60 },
                { month: 7, demand: 50 }, { month: 8, demand: 50 },
                { month: 9, demand: 60 }, { month: 10, demand: 80 },
                { month: 11, demand: 100 }, { month: 12, demand: 150 }
            ],
            targetMarkets: ['대형마트', '백화점', '온라인몰', '수출'],
            competitors: ['논산', '진주', '담양', '수입딸기'],
            priceHistory: [
                { date: '2024-01', price: 18000 },
                { date: '2024-06', price: 12000 },
                { date: '2024-12', price: 22000 },
                { date: '2025-01', price: 25000 }
            ],
            exportPotential: true,
            certifications: ['GAP', 'HACCP', '친환경', '무농약']
        }
    },

    // 🥬 상추
    {
        id: 'lettuce',
        name: 'Lettuce',
        koreanName: '상추',
        scientificName: 'Lactuca sativa',
        category: 'leafy',
        image: '/crops/lettuce.png',

        description: '가장 대표적인 엽채류로, 스마트팜 입문 작물로 적합합니다. 짧은 재배 기간과 안정적인 수요가 장점입니다.',
        origin: '지중해 연안',
        varieties: ['청치마상추', '적치마상추', '로메인', '버터헤드', '아이스버그', '프릴아이스'],

        cultivation: {
            temperature: { min: 15, max: 25, optimal: 20 },
            humidity: { min: 60, max: 75, optimal: 65 },
            co2: { min: 800, max: 1200, optimal: 1000 },
            light: {
                ppfd: { min: 200, max: 400, optimal: 300 },
                dli: 14,
                photoperiod: 16,
                spectrum: '적색:청색 = 7:3'
            },
            ph: { min: 5.5, max: 6.5, optimal: 6.0 },
            ec: { min: 0.8, max: 1.5, optimal: 1.2 },
            waterTemperature: { min: 18, max: 22, optimal: 20 },
            nutrients: {
                nitrogen: 200,
                phosphorus: 50,
                potassium: 200,
                calcium: 200,
                magnesium: 50
            },
            spacing: { plant: 20, row: 25 },
            germinationDays: 5,
            transplantDays: 14,
            harvestDays: 35,
            totalCycleDays: 35,
            difficulty: 'easy'
        },

        growthStages: [
            {
                stage: 1, name: 'Germination', koreanName: '발아기',
                daysFromStart: 0, duration: 5,
                description: '종자 발아',
                requirements: { temperature: 20, humidity: 80 },
                actions: ['수분 유지', '20°C 유지'],
                risks: ['과습', '고온']
            },
            {
                stage: 2, name: 'Seedling', koreanName: '육묘기',
                daysFromStart: 5, duration: 10,
                description: '본잎 2-3장 생성',
                requirements: { temperature: 20, humidity: 70, light: 200 },
                actions: ['광량 점진적 증가'],
                risks: ['웃자람']
            },
            {
                stage: 3, name: 'Vegetative', koreanName: '생장기',
                daysFromStart: 15, duration: 15,
                description: '잎이 활발히 성장',
                requirements: { temperature: 18, humidity: 65, light: 300, ec: 1.2 },
                actions: ['EC 증가', '광량 최대화'],
                risks: ['팁번', '추대']
            },
            {
                stage: 4, name: 'Harvest', koreanName: '수확기',
                daysFromStart: 30, duration: 5,
                description: '수확 가능 크기 도달',
                requirements: { temperature: 18, humidity: 60 },
                actions: ['적기 수확'],
                risks: ['과숙', '품질 저하']
            }
        ],

        economics: {
            setupCostPerM2: 300000,
            operatingCosts: {
                seeds: 5000, nutrients: 4000, energy: 15000,
                water: 2000, labor: 10000, packaging: 5000, other: 3000,
                total: 44000
            },
            yieldPerM2: { min: 2, max: 4, avg: 3 },
            harvestsPerYear: 10,
            annualYieldPerM2: 30,
            sellingPrice: {
                wholesale: 3000, retail: 5000, premium: 8000, organic: 10000
            },
            revenuePerCycle: 15000,
            profitPerCycle: -29000,
            annualRevenue: 150000,
            annualProfit: 106000,
            roi: 35.3,
            paybackMonths: 18,
            profitMargin: 70.7,
            riskLevel: 'low',
            marketStability: 'stable'
        },

        nutrition: {
            calories: 15, protein: 1.4, carbohydrates: 2.9, fiber: 1.3, fat: 0.2,
            vitamins: [
                { name: 'Vitamin K', amount: '126μg' },
                { name: 'Vitamin A', amount: '7405IU' },
                { name: 'Folate', amount: '38μg' }
            ],
            minerals: [
                { name: '칼륨', amount: '194mg' },
                { name: '칼슘', amount: '36mg' }
            ],
            healthBenefits: ['수분 보충', '다이어트 적합', '눈 건강', '뼈 건강']
        },

        pests: [
            {
                name: 'Aphids', koreanName: '진딧물',
                description: '잎 뒷면 서식', symptoms: ['잎 말림', '생장 저해'],
                prevention: ['천적 도입'], treatment: ['친환경 약제']
            }
        ],

        diseases: [
            {
                name: 'Tip Burn', koreanName: '팁번',
                cause: '칼슘 결핍 + 고온',
                symptoms: ['잎 가장자리 갈변'],
                prevention: ['칼슘 공급', '환기'],
                treatment: ['칼슘 엽면 시비']
            }
        ],

        harvest: {
            method: 'semi-auto',
            indicators: ['15-20cm 크기', '잎 10장 이상'],
            timing: '오전 수확',
            handling: ['뿌리째 수확', '예냉 필수'],
            postHarvest: {
                cleaning: '물세척', cooling: '진공 예냉 (1°C)',
                storage: { temperature: 1, humidity: 98, shelfLife: 14 }
            }
        },

        packaging: {
            types: [
                { type: '개별 포장', weight: '100g', targetMarket: '소매', priceMultiplier: 1.2 },
                { type: '믹스 샐러드', weight: '200g', targetMarket: '프리미엄', priceMultiplier: 1.5 }
            ],
            requirements: ['저온 유통'], labeling: ['품종', '포장일']
        },

        market: {
            demandTrend: 'stable',
            seasonality: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, demand: 100 })),
            targetMarkets: ['대형마트', '급식', '레스토랑'],
            competitors: ['노지재배', '수입'],
            priceHistory: [
                { date: '2024-01', price: 3500 },
                { date: '2025-01', price: 3800 }
            ],
            exportPotential: false,
            certifications: ['GAP', '친환경']
        }
    },

    // 🍅 토마토
    {
        id: 'tomato',
        name: 'Tomato',
        koreanName: '토마토',
        scientificName: 'Solanum lycopersicum',
        category: 'fruit',
        image: '/crops/tomato.png',

        description: '세계적으로 가장 많이 재배되는 과채류입니다. 스마트팜에서 연중 고품질 생산이 가능합니다.',
        origin: '남아메리카',
        varieties: ['스테비아토마토', '대추토마토', '완숙토마토', '방울토마토', '흑토마토'],

        cultivation: {
            temperature: { min: 18, max: 30, optimal: 24 },
            humidity: { min: 60, max: 80, optimal: 70 },
            co2: { min: 800, max: 1500, optimal: 1200 },
            light: {
                ppfd: { min: 400, max: 800, optimal: 600 },
                dli: 22,
                photoperiod: 14,
                spectrum: '적색:청색:원적색 = 7:2:1'
            },
            ph: { min: 5.5, max: 6.5, optimal: 6.0 },
            ec: { min: 2.0, max: 4.0, optimal: 2.8 },
            waterTemperature: { min: 20, max: 24, optimal: 22 },
            nutrients: {
                nitrogen: 180, phosphorus: 60, potassium: 350,
                calcium: 200, magnesium: 60
            },
            spacing: { plant: 40, row: 100 },
            germinationDays: 7,
            transplantDays: 30,
            harvestDays: 120,
            totalCycleDays: 180,
            difficulty: 'medium'
        },

        growthStages: [
            {
                stage: 1, name: 'Germination', koreanName: '발아기', daysFromStart: 0, duration: 7,
                description: '종자 발아', requirements: { temperature: 25, humidity: 85 },
                actions: ['보온', '수분 유지'], risks: ['저온']
            },
            {
                stage: 2, name: 'Seedling', koreanName: '육묘기', daysFromStart: 7, duration: 25,
                description: '본잎 6-8장', requirements: { temperature: 22, humidity: 70, light: 350 },
                actions: ['단근 처리'], risks: ['웃자람']
            },
            {
                stage: 3, name: 'Vegetative', koreanName: '영양생장기', daysFromStart: 32, duration: 30,
                description: '줄기 성장', requirements: { temperature: 24, humidity: 65, light: 500 },
                actions: ['곁순 제거', '유인'], risks: ['과다 생장']
            },
            {
                stage: 4, name: 'Flowering', koreanName: '개화기', daysFromStart: 62, duration: 20,
                description: '첫 화방 개화', requirements: { temperature: 23, humidity: 60, light: 600 },
                actions: ['진동 수분'], risks: ['낙화']
            },
            {
                stage: 5, name: 'Fruiting', koreanName: '착과기', daysFromStart: 82, duration: 50,
                description: '과일 비대', requirements: { temperature: 22, humidity: 65, light: 600, ec: 3.0 },
                actions: ['적과'], risks: ['기형과']
            },
            {
                stage: 6, name: 'Ripening', koreanName: '성숙기', daysFromStart: 132, duration: 48,
                description: '과일 착색', requirements: { temperature: 20, humidity: 60 },
                actions: ['수확'], risks: ['열과']
            }
        ],

        economics: {
            setupCostPerM2: 600000,
            operatingCosts: {
                seeds: 10000, nutrients: 12000, energy: 35000,
                water: 5000, labor: 25000, packaging: 8000, other: 5000,
                total: 100000
            },
            yieldPerM2: { min: 15, max: 30, avg: 22 },
            harvestsPerYear: 2,
            annualYieldPerM2: 44,
            sellingPrice: {
                wholesale: 4000, retail: 7000, premium: 12000, organic: 15000
            },
            revenuePerCycle: 154000,
            profitPerCycle: 54000,
            annualRevenue: 308000,
            annualProfit: 108000,
            roi: 18,
            paybackMonths: 30,
            profitMargin: 35,
            riskLevel: 'medium',
            marketStability: 'stable'
        },

        nutrition: {
            calories: 18, protein: 0.9, carbohydrates: 3.9, fiber: 1.2, fat: 0.2,
            vitamins: [
                { name: 'Vitamin C', amount: '14mg' },
                { name: 'Vitamin A', amount: '833IU' },
                { name: 'Vitamin K', amount: '7.9μg' }
            ],
            minerals: [
                { name: '칼륨', amount: '237mg' },
                { name: '리코펜', amount: '2573μg' }
            ],
            healthBenefits: ['항암 효과 (리코펜)', '심혈관 건강', '피부 건강', '시력 보호']
        },

        pests: [
            {
                name: 'Whitefly', koreanName: '가루이',
                description: '잎 뒷면 서식', symptoms: ['그을음병', '바이러스 매개'],
                prevention: ['황색 끈끈이'], treatment: ['친환경 약제']
            }
        ],

        diseases: [
            {
                name: 'Late Blight', koreanName: '역병',
                cause: 'Phytophthora infestans',
                symptoms: ['갈변', '시들음'],
                prevention: ['환기', '저습'],
                treatment: ['살균제']
            }
        ],

        harvest: {
            method: 'semi-auto',
            indicators: ['품종별 착색도', '단단한 상태'],
            timing: '아침',
            handling: ['꼭지 포함 수확'],
            postHarvest: {
                cleaning: '마른 세척', cooling: '상온 (완숙토마토)',
                storage: { temperature: 12, humidity: 90, shelfLife: 14 }
            }
        },

        packaging: {
            types: [
                { type: '1kg 박스', weight: '1kg', targetMarket: '소매', priceMultiplier: 1.0 },
                { type: '5kg 박스', weight: '5kg', targetMarket: '도매', priceMultiplier: 0.8 }
            ],
            requirements: ['상온 유통 가능'], labeling: ['품종', '등급', '재배자']
        },

        market: {
            demandTrend: 'stable',
            seasonality: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, demand: 100 })),
            targetMarkets: ['대형마트', '급식', '가공'],
            competitors: ['노지', '수입'],
            priceHistory: [
                { date: '2024-01', price: 5000 },
                { date: '2025-01', price: 5500 }
            ],
            exportPotential: false,
            certifications: ['GAP', 'GlobalGAP']
        }
    },

    // 🌿 바질
    {
        id: 'basil',
        name: 'Basil',
        koreanName: '바질',
        scientificName: 'Ocimum basilicum',
        category: 'herb',
        image: '/crops/basil.png',

        description: '이태리 요리의 필수 허브로, 향긋한 향이 특징입니다. 짧은 재배 기간과 높은 수익성이 장점입니다.',
        origin: '인도, 동남아시아',
        varieties: ['스위트바질', '홀리바질', '레몬바질', '타이바질', '퍼플바질'],

        cultivation: {
            temperature: { min: 20, max: 30, optimal: 25 },
            humidity: { min: 50, max: 70, optimal: 60 },
            co2: { min: 800, max: 1200, optimal: 1000 },
            light: {
                ppfd: { min: 300, max: 500, optimal: 400 },
                dli: 16,
                photoperiod: 14,
                spectrum: '적색:청색 = 6:4'
            },
            ph: { min: 5.5, max: 6.5, optimal: 6.0 },
            ec: { min: 1.0, max: 2.0, optimal: 1.5 },
            waterTemperature: { min: 20, max: 24, optimal: 22 },
            nutrients: {
                nitrogen: 180, phosphorus: 50, potassium: 180,
                calcium: 100, magnesium: 40
            },
            spacing: { plant: 15, row: 20 },
            germinationDays: 7,
            transplantDays: 14,
            harvestDays: 28,
            totalCycleDays: 28,
            difficulty: 'easy'
        },

        growthStages: [
            {
                stage: 1, name: 'Germination', koreanName: '발아기', daysFromStart: 0, duration: 7,
                description: '종자 발아', requirements: { temperature: 25, humidity: 75 },
                actions: ['적정 온도 유지'], risks: ['저온 발아 불량']
            },
            {
                stage: 2, name: 'Seedling', koreanName: '육묘기', daysFromStart: 7, duration: 10,
                description: '본잎 생성', requirements: { temperature: 24, humidity: 65, light: 300 },
                actions: ['정식 준비'], risks: ['웃자람']
            },
            {
                stage: 3, name: 'Vegetative', koreanName: '생장기', daysFromStart: 17, duration: 11,
                description: '잎 성장', requirements: { temperature: 25, humidity: 60, light: 400 },
                actions: ['순지르기', '수확'], risks: ['꽃대 발생']
            }
        ],

        economics: {
            setupCostPerM2: 280000,
            operatingCosts: {
                seeds: 8000, nutrients: 5000, energy: 12000,
                water: 2000, labor: 12000, packaging: 8000, other: 3000,
                total: 50000
            },
            yieldPerM2: { min: 1.5, max: 3, avg: 2 },
            harvestsPerYear: 12,
            annualYieldPerM2: 24,
            sellingPrice: {
                wholesale: 20000, retail: 35000, premium: 50000, organic: 60000
            },
            revenuePerCycle: 70000,
            profitPerCycle: 20000,
            annualRevenue: 840000,
            annualProfit: 240000,
            roi: 85.7,
            paybackMonths: 14,
            profitMargin: 28.6,
            riskLevel: 'low',
            marketStability: 'stable'
        },

        nutrition: {
            calories: 22, protein: 3.2, carbohydrates: 2.7, fiber: 1.6, fat: 0.6,
            vitamins: [
                { name: 'Vitamin K', amount: '414.8μg' },
                { name: 'Vitamin A', amount: '5275IU' },
                { name: 'Vitamin C', amount: '18mg' }
            ],
            minerals: [
                { name: '망간', amount: '1.15mg' },
                { name: '철분', amount: '3.17mg' }
            ],
            healthBenefits: ['항균 효과', '항염증', '스트레스 완화', '소화 촉진']
        },

        pests: [],
        diseases: [
            {
                name: 'Fusarium Wilt', koreanName: '시들음병',
                cause: 'Fusarium oxysporum',
                symptoms: ['시들음', '황변'],
                prevention: ['청결 관리'],
                treatment: ['감염주 제거']
            }
        ],

        harvest: {
            method: 'manual',
            indicators: ['잎 10장 이상', '꽃대 전'],
            timing: '오전',
            handling: ['부드럽게 절단'],
            postHarvest: {
                cleaning: '물세척 안함', cooling: '상온',
                storage: { temperature: 12, humidity: 90, shelfLife: 7 }
            }
        },

        packaging: {
            types: [
                { type: '생잎팩', weight: '30g', targetMarket: '소매', priceMultiplier: 1.0 },
                { type: '리빙팟', weight: '화분', targetMarket: '프리미엄', priceMultiplier: 2.0 }
            ],
            requirements: ['상온 유통'], labeling: ['품종', '사용법']
        },

        market: {
            demandTrend: 'rising',
            seasonality: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, demand: 100 + (i > 4 && i < 9 ? 30 : 0) })),
            targetMarkets: ['레스토랑', '델리', '온라인'],
            competitors: ['수입', '노지'],
            priceHistory: [
                { date: '2024-01', price: 22000 },
                { date: '2025-01', price: 25000 }
            ],
            exportPotential: false,
            certifications: ['친환경', '유기농']
        }
    }
];

// ============================================
// 헬퍼 함수
// ============================================

export function getCropById(id: string): CropData | undefined {
    return CROP_DATABASE.find(crop => crop.id === id);
}

export function getCropsByCategory(category: CropCategory): CropData[] {
    return CROP_DATABASE.filter(crop => crop.category === category);
}

export interface CropComparisonResult {
    crops: CropData[];
    profitability: { name: string; roi: number; margin: number; payback: number }[];
    difficulty: { name: string; level: string; cycleDays: number }[];
    requirements: { name: string; temp: number; light: number; ec: number }[];
}

export function compareCrops(cropIds: string[]): CropComparisonResult {
    const crops = cropIds.map(id => getCropById(id)).filter(Boolean) as CropData[];

    return {
        crops,
        profitability: crops.map(c => ({
            name: c.koreanName,
            roi: c.economics.roi,
            margin: c.economics.profitMargin,
            payback: c.economics.paybackMonths
        })),
        difficulty: crops.map(c => ({
            name: c.koreanName,
            level: c.cultivation.difficulty,
            cycleDays: c.cultivation.totalCycleDays
        })),
        requirements: crops.map(c => ({
            name: c.koreanName,
            temp: c.cultivation.temperature.optimal,
            light: c.cultivation.light.ppfd.optimal,
            ec: c.cultivation.ec.optimal
        }))
    };
}

export function calculateProjectedRevenue(
    cropId: string,
    area: number,
    months: number
): {
    crop: CropData | undefined;
    projectedYield: number;
    projectedRevenue: number;
    projectedCost: number;
    projectedProfit: number;
} {
    const crop = getCropById(cropId);
    if (!crop) {
        return { crop: undefined, projectedYield: 0, projectedRevenue: 0, projectedCost: 0, projectedProfit: 0 };
    }

    const cyclesPerMonth = 30 / crop.cultivation.totalCycleDays;
    const totalCycles = cyclesPerMonth * months;

    const projectedYield = crop.economics.yieldPerM2.avg * area * totalCycles;
    const projectedRevenue = projectedYield * crop.economics.sellingPrice.wholesale;
    const projectedCost = crop.economics.operatingCosts.total * area * totalCycles;
    const projectedProfit = projectedRevenue - projectedCost;

    return { crop, projectedYield, projectedRevenue, projectedCost, projectedProfit };
}
