// AgriNexus World OS - Smart Farm Equipment & Presets Data

import {
    Equipment,
    EquipmentCategory,
    AIAgent,
    CountryPreset,
    SeedVariety
} from '@/types/smartfarm';

// ============================================
// EQUIPMENT CATALOG
// ============================================

export const EQUIPMENT_CATALOG: Equipment[] = [
    // STRUCTURE - 구조물
    {
        id: 'struct-001',
        name: 'Vertical Growing Rack',
        koreanName: '수직 재배 랙',
        category: 'structure',
        icon: '🏗️',
        description: '다층 수직 재배를 위한 알루미늄 프레임 랙 시스템',
        specs: {
            model: 'VGR-5000',
            manufacturer: 'AgriNexus',
            dimensions: { width: 1.2, height: 2.4, depth: 0.6 },
            weight: 45,
            lifespan: 87600, // 10 years
            customSpecs: { layers: 5, loadCapacity: '200kg/layer' }
        },
        connections: [],
        status: 'active',
        aiControlled: false,
        powerConsumption: 0,
        dataPoints: []
    },
    {
        id: 'struct-002',
        name: 'Growing Tray System',
        koreanName: 'NFT 재배 트레이',
        category: 'structure',
        icon: '📦',
        description: 'NFT(Nutrient Film Technique) 수경 재배 트레이',
        specs: {
            model: 'NFT-120',
            manufacturer: 'AgriNexus',
            dimensions: { width: 1.2, height: 0.1, depth: 0.25 },
            customSpecs: { channels: 6, plantSites: 36 }
        },
        connections: [],
        status: 'active',
        aiControlled: false,
        powerConsumption: 0,
        dataPoints: []
    },

    // LIGHTING - LED 조명
    {
        id: 'led-001',
        name: 'Full Spectrum LED Bar',
        koreanName: '풀 스펙트럼 LED 바',
        category: 'lighting',
        icon: '💡',
        description: '식물 생장에 최적화된 풀 스펙트럼 LED 조명',
        specs: {
            model: 'FS-LED-200',
            manufacturer: 'AgriNexus',
            voltage: '220V',
            wattage: 200,
            dimensions: { width: 1.2, height: 0.05, depth: 0.1 },
            efficiency: 95,
            lifespan: 50000,
            customSpecs: {
                ppfd: '600 μmol/m²/s',
                spectrum: 'Full (380-780nm)',
                dimming: '0-100%',
                colorTemp: '4000K-6500K'
            }
        },
        connections: ['ctrl-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 200,
        dataPoints: ['lightIntensity', 'lightSpectrum', 'operatingHours']
    },
    {
        id: 'led-002',
        name: 'UV-C Sterilization LED',
        koreanName: 'UV-C 살균 LED',
        category: 'lighting',
        icon: '🔆',
        description: '병해충 방제를 위한 UV-C 살균 조명',
        specs: {
            model: 'UVC-50',
            manufacturer: 'AgriNexus',
            wattage: 50,
            customSpecs: { wavelength: '254nm', coverage: '10m²' }
        },
        connections: ['ctrl-001'],
        status: 'standby',
        aiControlled: true,
        powerConsumption: 50,
        dataPoints: ['uvIntensity', 'sterilizationCycles']
    },

    // HVAC - 공조 설비
    {
        id: 'hvac-001',
        name: 'Precision Climate Controller',
        koreanName: '정밀 기후 제어기',
        category: 'hvac',
        icon: '❄️',
        description: '온도, 습도, CO2를 정밀 제어하는 통합 공조 시스템',
        specs: {
            model: 'PCC-3000',
            manufacturer: 'AgriNexus',
            voltage: '380V',
            wattage: 3000,
            efficiency: 92,
            customSpecs: {
                coolingCapacity: '10kW',
                heatingCapacity: '8kW',
                dehumidification: '15L/hr',
                co2Injection: 'Yes'
            }
        },
        connections: ['iot-001', 'iot-002', 'iot-003'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 3000,
        dataPoints: ['temperature', 'humidity', 'co2Level', 'airFlow']
    },
    {
        id: 'hvac-002',
        name: 'Air Circulation Fan',
        koreanName: '공기 순환 팬',
        category: 'hvac',
        icon: '🌀',
        description: '균일한 공기 분포를 위한 순환 팬',
        specs: {
            model: 'ACF-400',
            manufacturer: 'AgriNexus',
            wattage: 40,
            customSpecs: { airflow: '400m³/hr', noise: '35dB' }
        },
        connections: ['hvac-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 40,
        dataPoints: ['fanSpeed', 'airVelocity']
    },

    // IRRIGATION - 관개/영양 설비
    {
        id: 'irr-001',
        name: 'Automated Nutrient Dosing System',
        koreanName: '자동 양액 공급기',
        category: 'irrigation',
        icon: '💧',
        description: 'AI 제어 정밀 양액 배합 및 공급 시스템',
        specs: {
            model: 'ANDS-500',
            manufacturer: 'AgriNexus',
            voltage: '220V',
            wattage: 150,
            customSpecs: {
                tanks: 5,
                flowRate: '100L/hr',
                phControl: 'Auto',
                ecControl: 'Auto',
                precision: '±0.1pH, ±0.05EC'
            }
        },
        connections: ['iot-004', 'iot-005'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 150,
        dataPoints: ['ph', 'ec', 'waterTemp', 'flowRate', 'nutrientLevels']
    },
    {
        id: 'irr-002',
        name: 'Drip Irrigation Controller',
        koreanName: '점적 관수 컨트롤러',
        category: 'irrigation',
        icon: '🚿',
        description: '구역별 정밀 점적 관수 제어',
        specs: {
            model: 'DIC-16',
            manufacturer: 'AgriNexus',
            wattage: 25,
            customSpecs: { zones: 16, schedules: 48 }
        },
        connections: ['irr-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 25,
        dataPoints: ['irrigationSchedule', 'waterUsage']
    },

    // IoT SENSORS - IoT 센서
    {
        id: 'iot-001',
        name: 'Environmental Sensor Hub',
        koreanName: '환경 센서 허브',
        category: 'iot',
        icon: '📡',
        description: '온도, 습도, CO2, 조도 통합 센서',
        specs: {
            model: 'ESH-4000',
            manufacturer: 'AgriNexus',
            wattage: 5,
            customSpecs: {
                tempRange: '-40~80°C',
                humidityRange: '0-100%RH',
                co2Range: '0-5000ppm',
                luxRange: '0-200000lux',
                updateInterval: '1sec'
            }
        },
        connections: ['ctrl-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 5,
        dataPoints: ['temperature', 'humidity', 'co2', 'lightLevel', 'vpd']
    },
    {
        id: 'iot-002',
        name: 'Soil/Substrate Sensor',
        koreanName: '토양/배지 센서',
        category: 'iot',
        icon: '🌱',
        description: '수분, EC, 온도 측정 배지 센서',
        specs: {
            model: 'SS-3',
            manufacturer: 'AgriNexus',
            wattage: 1,
            customSpecs: { moistureRange: '0-100%', ecRange: '0-10mS/cm' }
        },
        connections: ['iot-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 1,
        dataPoints: ['soilMoisture', 'soilEC', 'soilTemp']
    },
    {
        id: 'iot-003',
        name: 'Plant Vision Camera',
        koreanName: '식물 비전 카메라',
        category: 'iot',
        icon: '📷',
        description: 'AI 식물 상태 분석용 멀티스펙트럼 카메라',
        specs: {
            model: 'PVC-AI',
            manufacturer: 'AgriNexus',
            wattage: 15,
            customSpecs: {
                resolution: '4K',
                spectrum: 'RGB + NIR + Thermal',
                fps: 30,
                ai: 'Edge AI Processing'
            }
        },
        connections: ['ctrl-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 15,
        dataPoints: ['plantHealth', 'growthRate', 'diseaseDetection', 'pestDetection']
    },
    {
        id: 'iot-004',
        name: 'Water Quality Sensor',
        koreanName: '수질 센서',
        category: 'iot',
        icon: '💦',
        description: 'pH, EC, 용존산소, 온도 측정',
        specs: {
            model: 'WQS-4',
            manufacturer: 'AgriNexus',
            wattage: 3,
            customSpecs: { phRange: '0-14', ecRange: '0-20mS/cm', doRange: '0-20mg/L' }
        },
        connections: ['irr-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 3,
        dataPoints: ['waterPH', 'waterEC', 'dissolvedOxygen', 'waterTemp']
    },
    {
        id: 'iot-005',
        name: 'Nutrient Analyzer',
        koreanName: '영양소 분석기',
        category: 'iot',
        icon: '🧪',
        description: 'N-P-K 및 미량원소 실시간 분석',
        specs: {
            model: 'NA-12',
            manufacturer: 'AgriNexus',
            wattage: 20,
            customSpecs: { elements: 12, accuracy: '±2%' }
        },
        connections: ['irr-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 20,
        dataPoints: ['nitrogen', 'phosphorus', 'potassium', 'calcium', 'magnesium']
    },

    // CONTROL - 제어 설비
    {
        id: 'ctrl-001',
        name: 'Central Control Unit',
        koreanName: '중앙 제어 장치',
        category: 'control',
        icon: '🖥️',
        description: 'AI 기반 농장 통합 제어 시스템',
        specs: {
            model: 'CCU-AI',
            manufacturer: 'AgriNexus',
            voltage: '220V',
            wattage: 100,
            customSpecs: {
                cpu: 'ARM Cortex-A78',
                ram: '8GB',
                storage: '256GB SSD',
                connectivity: 'WiFi 6, 5G, LoRa',
                aiAccelerator: 'NPU 26 TOPS'
            }
        },
        connections: [],
        status: 'active',
        aiControlled: true,
        powerConsumption: 100,
        dataPoints: ['cpuUsage', 'memoryUsage', 'networkStatus', 'aiProcessing']
    },
    {
        id: 'ctrl-002',
        name: 'Zone Controller',
        koreanName: '구역 컨트롤러',
        category: 'control',
        icon: '🎛️',
        description: '개별 재배 구역 제어 모듈',
        specs: {
            model: 'ZC-8',
            manufacturer: 'AgriNexus',
            wattage: 30,
            customSpecs: { zones: 8, relays: 32, inputs: 64 }
        },
        connections: ['ctrl-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 30,
        dataPoints: ['zoneStatus', 'relayStatus']
    },

    // POWER - 전기/전자 장비
    {
        id: 'pwr-001',
        name: 'Smart Power Distribution',
        koreanName: '스마트 배전반',
        category: 'power',
        icon: '⚡',
        description: 'AI 기반 지능형 전력 분배 및 모니터링',
        specs: {
            model: 'SPD-200',
            manufacturer: 'AgriNexus',
            voltage: '380V',
            customSpecs: {
                maxCurrent: '200A',
                circuits: 32,
                monitoring: 'Per-circuit',
                protection: 'Surge, Short, Overload'
            }
        },
        connections: [],
        status: 'active',
        aiControlled: true,
        powerConsumption: 50,
        dataPoints: ['totalPower', 'circuitPower', 'powerFactor', 'voltage', 'current']
    },
    {
        id: 'pwr-002',
        name: 'UPS Battery Backup',
        koreanName: 'UPS 무정전 전원',
        category: 'power',
        icon: '🔋',
        description: '정전 시 핵심 시스템 보호용 UPS',
        specs: {
            model: 'UPS-10K',
            manufacturer: 'AgriNexus',
            customSpecs: {
                capacity: '10kVA',
                runtime: '30min @ full load',
                batteryType: 'LiFePO4'
            }
        },
        connections: ['pwr-001'],
        status: 'active',
        aiControlled: true,
        powerConsumption: 0,
        dataPoints: ['batteryLevel', 'runtime', 'inputVoltage', 'outputVoltage']
    },

    // CULTIVATION - 재배 설비
    {
        id: 'cult-001',
        name: 'Automated Seeder',
        koreanName: '자동 파종기',
        category: 'cultivation',
        icon: '🌾',
        description: '정밀 자동 파종 시스템',
        specs: {
            model: 'AS-1000',
            manufacturer: 'AgriNexus',
            wattage: 500,
            customSpecs: { speed: '1000 seeds/hr', accuracy: '99%' }
        },
        connections: ['ctrl-001'],
        status: 'standby',
        aiControlled: true,
        powerConsumption: 500,
        dataPoints: ['seedsPlanted', 'accuracy', 'speed']
    },
    {
        id: 'cult-002',
        name: 'Transplanting Robot',
        koreanName: '이식 로봇',
        category: 'cultivation',
        icon: '🤖',
        description: '묘목 자동 이식 로봇 암',
        specs: {
            model: 'TR-ARM',
            manufacturer: 'AgriNexus',
            wattage: 800,
            customSpecs: {
                reach: '1.5m',
                payload: '2kg',
                speed: '200 plants/hr',
                precision: '±1mm'
            }
        },
        connections: ['ctrl-001'],
        status: 'standby',
        aiControlled: true,
        powerConsumption: 800,
        dataPoints: ['plantsTransplanted', 'cycleTime', 'position']
    },

    // HARVEST - 수확 장비
    {
        id: 'harv-001',
        name: 'Selective Harvest Robot',
        koreanName: '선택적 수확 로봇',
        category: 'harvest',
        icon: '🦾',
        description: 'AI 비전 기반 선택적 수확 로봇',
        specs: {
            model: 'SHR-2',
            manufacturer: 'AgriNexus',
            wattage: 1200,
            customSpecs: {
                vision: '3D RGB + Depth',
                speed: '300 plants/hr',
                gentleness: 'Soft grip technology'
            }
        },
        connections: ['ctrl-001', 'iot-003'],
        status: 'standby',
        aiControlled: true,
        powerConsumption: 1200,
        dataPoints: ['harvestedItems', 'quality', 'speed', 'rejectRate']
    },

    // MONITORING - 모니터링
    {
        id: 'mon-001',
        name: 'Central Monitoring Display',
        koreanName: '중앙 모니터링 디스플레이',
        category: 'monitoring',
        icon: '🖥️',
        description: '실시간 농장 상태 대형 디스플레이',
        specs: {
            model: 'CMD-55',
            manufacturer: 'AgriNexus',
            wattage: 150,
            customSpecs: { size: '55inch', resolution: '4K', touch: 'Yes' }
        },
        connections: ['ctrl-001'],
        status: 'active',
        aiControlled: false,
        powerConsumption: 150,
        dataPoints: []
    }
];

// ============================================
// AI AGENTS
// ============================================

export const AI_AGENTS: AIAgent[] = [
    {
        id: 'agent-master',
        name: 'NEXUS Master',
        code: 'A.G.R.I.M.A.S.T.E.R.',
        type: 'master',
        role: '총괄 관리 에이전트',
        description: '전체 스마트팜 운영을 총괄하고 모든 하위 에이전트를 조율합니다.',
        status: 'active',
        confidence: 98,
        decisionsToday: 1247,
        accuracy: 99.7,
        specialties: ['시스템 통합', '전략 수립', '위기 관리', '성능 최적화'],
        controlledSystems: ['전체 시스템'],
        learningProgress: 100
    },
    {
        id: 'agent-climate',
        name: 'ELEMENT Climate',
        code: 'C.L.I.M.A.T.E.',
        type: 'climate',
        role: '기후 제어 에이전트',
        description: '온도, 습도, CO2, 공기 순환을 최적화하여 작물 생장 환경을 유지합니다.',
        status: 'active',
        confidence: 96,
        decisionsToday: 3842,
        accuracy: 98.5,
        specialties: ['온도 제어', '습도 관리', 'CO2 최적화', 'VPD 관리'],
        controlledSystems: ['hvac-001', 'hvac-002'],
        learningProgress: 95
    },
    {
        id: 'agent-lighting',
        name: 'SPECTRUM Light',
        code: 'L.U.M.E.N.',
        type: 'lighting',
        role: '조명 제어 에이전트',
        description: '작물 생장 단계별 최적 광량과 스펙트럼을 자동 조절합니다.',
        status: 'active',
        confidence: 97,
        decisionsToday: 1856,
        accuracy: 99.2,
        specialties: ['광량 제어', '스펙트럼 조절', '광주기 관리', 'DLI 최적화'],
        controlledSystems: ['led-001', 'led-002'],
        learningProgress: 92
    },
    {
        id: 'agent-nutrition',
        name: 'NUTRIENT Flow',
        code: 'N.U.T.R.I.',
        type: 'nutrition',
        role: '영양 관리 에이전트',
        description: '양액 배합, pH/EC 조절, 급수 스케줄을 자동 최적화합니다.',
        status: 'active',
        confidence: 95,
        decisionsToday: 2134,
        accuracy: 98.8,
        specialties: ['양액 배합', 'pH 조절', 'EC 관리', '급수 스케줄'],
        controlledSystems: ['irr-001', 'irr-002'],
        learningProgress: 88
    },
    {
        id: 'agent-harvest',
        name: 'HARVEST Master',
        code: 'H.A.R.V.E.S.T.',
        type: 'harvest',
        role: '수확 관리 에이전트',
        description: '최적 수확 시기를 예측하고 수확 로봇을 제어합니다.',
        status: 'active',
        confidence: 94,
        decisionsToday: 156,
        accuracy: 97.5,
        specialties: ['수확 시기 예측', '로봇 제어', '품질 판별', '수율 최적화'],
        controlledSystems: ['harv-001'],
        learningProgress: 85
    },
    {
        id: 'agent-quality',
        name: 'QUALITY Vision',
        code: 'Q.U.A.L.I.T.Y.',
        type: 'quality',
        role: '품질 관리 에이전트',
        description: '컴퓨터 비전으로 작물 상태와 품질을 실시간 분석합니다.',
        status: 'active',
        confidence: 96,
        decisionsToday: 8542,
        accuracy: 99.1,
        specialties: ['병해충 감지', '생장 분석', '품질 등급화', '이상 감지'],
        controlledSystems: ['iot-003'],
        learningProgress: 91
    },
    {
        id: 'agent-maintenance',
        name: 'MAINTAIN Pro',
        code: 'M.A.I.N.T.A.I.N.',
        type: 'maintenance',
        role: '유지보수 에이전트',
        description: '장비 상태를 모니터링하고 예방 정비를 계획합니다.',
        status: 'active',
        confidence: 93,
        decisionsToday: 47,
        accuracy: 96.8,
        specialties: ['고장 예측', '정비 스케줄', '부품 관리', '수명 분석'],
        controlledSystems: ['pwr-001', 'pwr-002'],
        learningProgress: 82
    },
    {
        id: 'agent-optimization',
        name: 'OPTIMIZE AI',
        code: 'O.P.T.I.M.I.Z.E.',
        type: 'optimization',
        role: '최적화 에이전트',
        description: '에너지, 자원, 생산성을 종합적으로 최적화합니다.',
        status: 'active',
        confidence: 97,
        decisionsToday: 523,
        accuracy: 98.9,
        specialties: ['에너지 최적화', '자원 효율', '비용 절감', 'ROI 분석'],
        controlledSystems: ['ctrl-001'],
        learningProgress: 89
    }
];

// ============================================
// COUNTRY PRESETS
// ============================================

export const COUNTRY_PRESETS: CountryPreset[] = [
    {
        code: 'KR',
        name: 'South Korea',
        koreanName: '대한민국',
        flag: '🇰🇷',
        climate: 'continental',
        regulations: ['스마트팜 인증제', '농산물이력제', '친환경농업법'],
        popularCrops: ['딸기', '토마토', '파프리카', '상추', '인삼'],
        electricityVoltage: '220V/60Hz',
        avgElectricityCost: 0.11,
        waterCost: 0.6,
        laborCost: 12,
        incentives: ['스마트팜 정부 보조금', '농업기술 R&D 지원', '청년농 스마트팜 임대'],
        challenges: ['높은 인건비', '계절별 에너지 비용', '토지 비용']
    },
    {
        code: 'JP',
        name: 'Japan',
        koreanName: '일본',
        flag: '🇯🇵',
        climate: 'temperate',
        regulations: ['JAS 인증', '식품위생법', 'GAP 인증'],
        popularCrops: ['딸기', '토마토', '멜론', '시금치', '허브'],
        electricityVoltage: '100V/50-60Hz',
        avgElectricityCost: 0.25,
        waterCost: 1.2,
        laborCost: 18,
        incentives: ['스마트농업기술 실증사업', '농업DX 추진'],
        challenges: ['높은 전력비', '자연재해', '고령화']
    },
    {
        code: 'US',
        name: 'United States',
        koreanName: '미국',
        flag: '🇺🇸',
        climate: 'temperate',
        regulations: ['USDA Organic', 'FDA Food Safety', 'GAP'],
        popularCrops: ['상추', '케일', '토마토', '허브', '마이크로그린'],
        electricityVoltage: '120V/60Hz',
        avgElectricityCost: 0.13,
        waterCost: 0.4,
        laborCost: 15,
        incentives: ['USDA 보조금', '주별 인센티브', '세금 공제'],
        challenges: ['주별 규정 차이', '물 부족(서부)', '유통 비용']
    },
    {
        code: 'NL',
        name: 'Netherlands',
        koreanName: '네덜란드',
        flag: '🇳🇱',
        climate: 'temperate',
        regulations: ['EU GAP', 'GlobalG.A.P.', 'EU Organic'],
        popularCrops: ['토마토', '파프리카', '오이', '화훼', '딸기'],
        electricityVoltage: '230V/50Hz',
        avgElectricityCost: 0.22,
        waterCost: 0.9,
        laborCost: 20,
        incentives: ['Wageningen 연구 협력', 'Greenport 클러스터', 'EU 농업 보조금'],
        challenges: ['높은 에너지 비용', '탄소세', '토지 제한']
    },
    {
        code: 'SG',
        name: 'Singapore',
        koreanName: '싱가포르',
        flag: '🇸🇬',
        climate: 'tropical',
        regulations: ['SFA 라이선스', 'FSMS 인증'],
        popularCrops: ['상추', '케일', '시금치', '허브', '식용꽃'],
        electricityVoltage: '230V/50Hz',
        avgElectricityCost: 0.18,
        waterCost: 2.5,
        laborCost: 14,
        incentives: ['30by30 비전', 'Agri-Food Cluster', 'SFA 보조금'],
        challenges: ['토지 부족', '높은 물 비용', '열대 기후']
    },
    {
        code: 'AE',
        name: 'UAE',
        koreanName: '아랍에미리트',
        flag: '🇦🇪',
        climate: 'arid',
        regulations: ['ESMA 기준', '식품안전국 인증'],
        popularCrops: ['토마토', '딸기', '상추', '허브', '대추야자'],
        electricityVoltage: '220V/50Hz',
        avgElectricityCost: 0.08,
        waterCost: 3.5,
        laborCost: 8,
        incentives: ['식량안보 국가 전략', '정부 투자', '수입 대체 장려'],
        challenges: ['극한 기후', '물 부족', '냉각 비용']
    },
    {
        code: 'CN',
        name: 'China',
        koreanName: '중국',
        flag: '🇨🇳',
        climate: 'continental',
        regulations: ['녹색식품 인증', '유기농 인증', '지리적표시'],
        popularCrops: ['상추', '토마토', '딸기', '버섯', '허브'],
        electricityVoltage: '220V/50Hz',
        avgElectricityCost: 0.08,
        waterCost: 0.4,
        laborCost: 6,
        incentives: ['현대농업 발전계획', '디지털농업시범구', '보조금'],
        challenges: ['품질 인증', '물류', '지역별 차이']
    }
];

// ============================================
// SEED CATALOG
// ============================================

export const SEED_CATALOG: SeedVariety[] = [
    {
        id: 'seed-001',
        name: 'Butterhead Lettuce',
        koreanName: '버터헤드 상추',
        scientificName: 'Lactuca sativa var. capitata',
        category: 'leafy',
        icon: '🥬',
        growthDays: 45,
        optimalTemp: { min: 15, max: 22 },
        optimalHumidity: { min: 60, max: 80 },
        optimalPH: { min: 5.8, max: 6.5 },
        lightRequirement: 400,
        photoperiod: 16,
        yieldPerSquareMeter: 4.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 150, phosphorus: 50, potassium: 200,
            calcium: 150, magnesium: 40, sulfur: 50,
            iron: 2, manganese: 0.5, zinc: 0.2,
            copper: 0.05, boron: 0.3, molybdenum: 0.05
        }
    },
    {
        id: 'seed-002',
        name: 'Cherry Tomato',
        koreanName: '체리 토마토',
        scientificName: 'Solanum lycopersicum var. cerasiforme',
        category: 'fruit',
        icon: '🍅',
        growthDays: 90,
        optimalTemp: { min: 18, max: 28 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 5.5, max: 6.8 },
        lightRequirement: 600,
        photoperiod: 14,
        yieldPerSquareMeter: 8,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 180, phosphorus: 60, potassium: 280,
            calcium: 180, magnesium: 50, sulfur: 60,
            iron: 3, manganese: 0.8, zinc: 0.3,
            copper: 0.1, boron: 0.5, molybdenum: 0.05
        }
    },
    {
        id: 'seed-003',
        name: 'Sweet Basil',
        koreanName: '스위트 바질',
        scientificName: 'Ocimum basilicum',
        category: 'herb',
        icon: '🌿',
        growthDays: 35,
        optimalTemp: { min: 20, max: 30 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 500,
        photoperiod: 16,
        yieldPerSquareMeter: 2.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 120, phosphorus: 40, potassium: 180,
            calcium: 100, magnesium: 30, sulfur: 40,
            iron: 2, manganese: 0.4, zinc: 0.15,
            copper: 0.05, boron: 0.2, molybdenum: 0.03
        }
    },
    {
        id: 'seed-004',
        name: 'Strawberry',
        koreanName: '딸기',
        scientificName: 'Fragaria × ananassa',
        category: 'fruit',
        icon: '🍓',
        growthDays: 120,
        optimalTemp: { min: 15, max: 25 },
        optimalHumidity: { min: 60, max: 80 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 450,
        photoperiod: 12,
        yieldPerSquareMeter: 3.5,
        difficulty: 'hard',
        nutritionRequirements: {
            nitrogen: 100, phosphorus: 50, potassium: 200,
            calcium: 120, magnesium: 35, sulfur: 40,
            iron: 2.5, manganese: 0.6, zinc: 0.25,
            copper: 0.08, boron: 0.4, molybdenum: 0.04
        }
    },
    {
        id: 'seed-005',
        name: 'Microgreens Mix',
        koreanName: '마이크로그린 믹스',
        scientificName: 'Various',
        category: 'microgreen',
        icon: '🌱',
        growthDays: 14,
        optimalTemp: { min: 18, max: 24 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 300,
        photoperiod: 16,
        yieldPerSquareMeter: 1.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 80, phosphorus: 30, potassium: 120,
            calcium: 60, magnesium: 20, sulfur: 25,
            iron: 1, manganese: 0.2, zinc: 0.1,
            copper: 0.03, boron: 0.1, molybdenum: 0.02
        }
    },
    // 추가 작물들
    {
        id: 'seed-006',
        name: 'Bell Pepper',
        koreanName: '파프리카',
        scientificName: 'Capsicum annuum',
        category: 'fruit',
        icon: '🫑',
        growthDays: 75,
        optimalTemp: { min: 20, max: 28 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 5.8, max: 6.5 },
        lightRequirement: 550,
        photoperiod: 14,
        yieldPerSquareMeter: 6.5,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 160, phosphorus: 55, potassium: 250,
            calcium: 160, magnesium: 45, sulfur: 55,
            iron: 2.8, manganese: 0.7, zinc: 0.28,
            copper: 0.09, boron: 0.45, molybdenum: 0.05
        }
    },
    {
        id: 'seed-007',
        name: 'Cucumber',
        koreanName: '오이',
        scientificName: 'Cucumis sativus',
        category: 'fruit',
        icon: '🥒',
        growthDays: 55,
        optimalTemp: { min: 22, max: 30 },
        optimalHumidity: { min: 70, max: 85 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 500,
        photoperiod: 14,
        yieldPerSquareMeter: 12,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 140, phosphorus: 45, potassium: 220,
            calcium: 140, magnesium: 40, sulfur: 45,
            iron: 2.2, manganese: 0.6, zinc: 0.22,
            copper: 0.07, boron: 0.35, molybdenum: 0.04
        }
    },
    {
        id: 'seed-008',
        name: 'Arugula',
        koreanName: '루꼴라',
        scientificName: 'Eruca vesicaria',
        category: 'leafy',
        icon: '🥗',
        growthDays: 28,
        optimalTemp: { min: 15, max: 22 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 350,
        photoperiod: 14,
        yieldPerSquareMeter: 3.0,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 130, phosphorus: 45, potassium: 170,
            calcium: 130, magnesium: 35, sulfur: 45,
            iron: 1.8, manganese: 0.45, zinc: 0.18,
            copper: 0.05, boron: 0.25, molybdenum: 0.04
        }
    },
    {
        id: 'seed-009',
        name: 'Spinach',
        koreanName: '시금치',
        scientificName: 'Spinacia oleracea',
        category: 'leafy',
        icon: '🥬',
        growthDays: 40,
        optimalTemp: { min: 12, max: 20 },
        optimalHumidity: { min: 60, max: 80 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 350,
        photoperiod: 12,
        yieldPerSquareMeter: 4.0,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 160, phosphorus: 50, potassium: 200,
            calcium: 160, magnesium: 45, sulfur: 50,
            iron: 2.5, manganese: 0.55, zinc: 0.2,
            copper: 0.06, boron: 0.3, molybdenum: 0.05
        }
    },
    {
        id: 'seed-010',
        name: 'Kale',
        koreanName: '케일',
        scientificName: 'Brassica oleracea var. acephala',
        category: 'leafy',
        icon: '🥗',
        growthDays: 55,
        optimalTemp: { min: 15, max: 24 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 400,
        photoperiod: 14,
        yieldPerSquareMeter: 3.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 150, phosphorus: 50, potassium: 190,
            calcium: 150, magnesium: 40, sulfur: 50,
            iron: 2.2, manganese: 0.5, zinc: 0.2,
            copper: 0.05, boron: 0.3, molybdenum: 0.05
        }
    },
    {
        id: 'seed-011',
        name: 'Mint',
        koreanName: '민트',
        scientificName: 'Mentha spicata',
        category: 'herb',
        icon: '🌿',
        growthDays: 30,
        optimalTemp: { min: 18, max: 28 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 5.5, max: 7.0 },
        lightRequirement: 400,
        photoperiod: 14,
        yieldPerSquareMeter: 2.0,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 100, phosphorus: 35, potassium: 150,
            calcium: 90, magnesium: 25, sulfur: 35,
            iron: 1.5, manganese: 0.35, zinc: 0.12,
            copper: 0.04, boron: 0.18, molybdenum: 0.03
        }
    },
    {
        id: 'seed-012',
        name: 'Cilantro',
        koreanName: '고수',
        scientificName: 'Coriandrum sativum',
        category: 'herb',
        icon: '🌿',
        growthDays: 25,
        optimalTemp: { min: 15, max: 25 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 350,
        photoperiod: 12,
        yieldPerSquareMeter: 1.8,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 90, phosphorus: 30, potassium: 140,
            calcium: 80, magnesium: 22, sulfur: 30,
            iron: 1.3, manganese: 0.3, zinc: 0.1,
            copper: 0.03, boron: 0.15, molybdenum: 0.02
        }
    },
    {
        id: 'seed-013',
        name: 'Bok Choy',
        koreanName: '청경채',
        scientificName: 'Brassica rapa subsp. chinensis',
        category: 'leafy',
        icon: '🥬',
        growthDays: 35,
        optimalTemp: { min: 15, max: 24 },
        optimalHumidity: { min: 60, max: 80 },
        optimalPH: { min: 6.0, max: 7.5 },
        lightRequirement: 350,
        photoperiod: 14,
        yieldPerSquareMeter: 4.2,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 140, phosphorus: 45, potassium: 180,
            calcium: 140, magnesium: 38, sulfur: 45,
            iron: 2.0, manganese: 0.45, zinc: 0.18,
            copper: 0.05, boron: 0.28, molybdenum: 0.04
        }
    },
    {
        id: 'seed-014',
        name: 'Swiss Chard',
        koreanName: '근대',
        scientificName: 'Beta vulgaris subsp. vulgaris',
        category: 'leafy',
        icon: '🥬',
        growthDays: 50,
        optimalTemp: { min: 15, max: 24 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 380,
        photoperiod: 14,
        yieldPerSquareMeter: 3.8,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 145, phosphorus: 48, potassium: 185,
            calcium: 145, magnesium: 40, sulfur: 48,
            iron: 2.1, manganese: 0.48, zinc: 0.19,
            copper: 0.05, boron: 0.28, molybdenum: 0.04
        }
    },
    {
        id: 'seed-015',
        name: 'Watercress',
        koreanName: '물냉이',
        scientificName: 'Nasturtium officinale',
        category: 'leafy',
        icon: '🌱',
        growthDays: 21,
        optimalTemp: { min: 12, max: 20 },
        optimalHumidity: { min: 70, max: 90 },
        optimalPH: { min: 6.5, max: 7.5 },
        lightRequirement: 300,
        photoperiod: 12,
        yieldPerSquareMeter: 2.5,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 110, phosphorus: 35, potassium: 160,
            calcium: 110, magnesium: 28, sulfur: 35,
            iron: 1.6, manganese: 0.38, zinc: 0.14,
            copper: 0.04, boron: 0.2, molybdenum: 0.03
        }
    },
    {
        id: 'seed-016',
        name: 'Chives',
        koreanName: '차이브',
        scientificName: 'Allium schoenoprasum',
        category: 'herb',
        icon: '🌿',
        growthDays: 60,
        optimalTemp: { min: 15, max: 25 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 380,
        photoperiod: 14,
        yieldPerSquareMeter: 1.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 85, phosphorus: 28, potassium: 130,
            calcium: 75, magnesium: 20, sulfur: 30,
            iron: 1.2, manganese: 0.28, zinc: 0.1,
            copper: 0.03, boron: 0.14, molybdenum: 0.02
        }
    },
    {
        id: 'seed-017',
        name: 'Parsley',
        koreanName: '파슬리',
        scientificName: 'Petroselinum crispum',
        category: 'herb',
        icon: '🌿',
        growthDays: 70,
        optimalTemp: { min: 15, max: 25 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 400,
        photoperiod: 14,
        yieldPerSquareMeter: 2.2,
        difficulty: 'medium',
        nutritionRequirements: {
            nitrogen: 115, phosphorus: 38, potassium: 165,
            calcium: 95, magnesium: 28, sulfur: 38,
            iron: 1.8, manganese: 0.38, zinc: 0.14,
            copper: 0.04, boron: 0.2, molybdenum: 0.03
        }
    },
    {
        id: 'seed-018',
        name: 'Dill',
        koreanName: '딜',
        scientificName: 'Anethum graveolens',
        category: 'herb',
        icon: '🌿',
        growthDays: 40,
        optimalTemp: { min: 15, max: 25 },
        optimalHumidity: { min: 50, max: 70 },
        optimalPH: { min: 5.5, max: 6.5 },
        lightRequirement: 420,
        photoperiod: 14,
        yieldPerSquareMeter: 1.8,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 95, phosphorus: 32, potassium: 145,
            calcium: 85, magnesium: 24, sulfur: 32,
            iron: 1.4, manganese: 0.32, zinc: 0.12,
            copper: 0.04, boron: 0.16, molybdenum: 0.02
        }
    },
    {
        id: 'seed-019',
        name: 'Radish',
        koreanName: '래디시',
        scientificName: 'Raphanus sativus',
        category: 'root',
        icon: '🔴',
        growthDays: 28,
        optimalTemp: { min: 15, max: 22 },
        optimalHumidity: { min: 55, max: 75 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 350,
        photoperiod: 12,
        yieldPerSquareMeter: 5.5,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 100, phosphorus: 35, potassium: 160,
            calcium: 100, magnesium: 28, sulfur: 40,
            iron: 1.5, manganese: 0.35, zinc: 0.14,
            copper: 0.04, boron: 0.22, molybdenum: 0.03
        }
    },
    {
        id: 'seed-020',
        name: 'Bean Sprouts',
        koreanName: '콩나물',
        scientificName: 'Vigna radiata',
        category: 'sprout',
        icon: '🌱',
        growthDays: 7,
        optimalTemp: { min: 20, max: 28 },
        optimalHumidity: { min: 70, max: 90 },
        optimalPH: { min: 6.0, max: 7.0 },
        lightRequirement: 0,
        photoperiod: 0,
        yieldPerSquareMeter: 8.0,
        difficulty: 'easy',
        nutritionRequirements: {
            nitrogen: 0, phosphorus: 0, potassium: 0,
            calcium: 0, magnesium: 0, sulfur: 0,
            iron: 0, manganese: 0, zinc: 0,
            copper: 0, boron: 0, molybdenum: 0
        }
    }
];

// Helper functions
export function getEquipmentByCategory(category: EquipmentCategory): Equipment[] {
    return EQUIPMENT_CATALOG.filter(e => e.category === category);
}

export function getAgentByType(type: AIAgent['type']): AIAgent | undefined {
    return AI_AGENTS.find(a => a.type === type);
}

export function getCountryByCode(code: string): CountryPreset | undefined {
    return COUNTRY_PRESETS.find(c => c.code === code);
}

export function getSeedById(id: string): SeedVariety | undefined {
    return SEED_CATALOG.find(s => s.id === id);
}
