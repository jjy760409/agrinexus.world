// AgriNexus World OS - 스마트팜 종합 설비 데이터베이스
// 공조, 제어, IoT, 자동화, 로봇 등 모든 필수 장비

// ============================================
// 타입 정의
// ============================================

export interface SmartFarmEquipment {
    id: string;
    name: string;
    koreanName: string;
    category: EquipmentCategory;
    subcategory: string;

    // 기본 정보
    description: string;
    manufacturer: string[];
    modelNumbers: string[];
    image?: string;
    model3D?: string;

    // 사양
    specifications: EquipmentSpecs;

    // 비용
    costs: EquipmentCosts;

    // 설치
    installation: InstallationInfo;

    // 운영
    operation: OperationInfo;

    // 유지보수
    maintenance: MaintenanceInfo;

    // 연결성
    connectivity: ConnectivityInfo;

    // 필수 여부
    essential: boolean;
    priority: 'critical' | 'high' | 'medium' | 'low';
}

export type EquipmentCategory =
    | 'hvac'            // 공조 시스템
    | 'lighting'        // 조명 시스템
    | 'irrigation'      // 관수 시스템
    | 'nutrient'        // 양액 시스템
    | 'control'         // 제어 시스템
    | 'sensor'          // 센서 시스템
    | 'electrical'      // 전기 시스템
    | 'plumbing'        // 배관 시스템
    | 'structure'       // 구조물
    | 'robotics'        // 로봇 시스템
    | 'packaging'       // 포장 시스템
    | 'storage'         // 저장 시스템
    | 'monitoring'      // 모니터링
    | 'safety';         // 안전 시스템

export interface EquipmentSpecs {
    power?: { rating: number; unit: string; voltage?: number };
    capacity?: { value: number; unit: string };
    coverage?: { area: number; unit: string };
    dimensions?: { width: number; height: number; depth: number; unit: string };
    weight?: { value: number; unit: string };
    efficiency?: number;
    lifespan?: number; // 년
    certifications?: string[];
    features?: string[];
}

export interface EquipmentCosts {
    purchase: { min: number; max: number; avg: number };
    installation: number;
    annual: {
        energy: number;
        maintenance: number;
        consumables: number;
        total: number;
    };
    roi?: number;
    paybackMonths?: number;
}

export interface InstallationInfo {
    requirements: string[];
    duration: string;
    professionals: string[];
    permits?: string[];
}

export interface OperationInfo {
    automationLevel: 'manual' | 'semi-auto' | 'full-auto';
    operatingHours: number;
    controlInterface: string[];
    safetyFeatures: string[];
}

export interface MaintenanceInfo {
    schedule: { task: string; frequency: string }[];
    sparePartsRequired: string[];
    avgAnnualCost: number;
    technicalSupport: string;
}

export interface ConnectivityInfo {
    protocols: string[];
    integration: string[];
    dataOutput: string[];
    cloudCompatible: boolean;
}

// ============================================
// 설비 데이터베이스
// ============================================

export const EQUIPMENT_DATABASE: SmartFarmEquipment[] = [
    // ====== HVAC 시스템 ======
    {
        id: 'hvac-main-unit',
        name: 'Industrial HVAC Unit',
        koreanName: '산업용 항온항습기',
        category: 'hvac',
        subcategory: '메인 유닛',

        description: '온도와 습도를 동시에 제어하는 핵심 공조 장비입니다. 정밀 농업에 필수적입니다.',
        manufacturer: ['Carrier', 'Trane', 'LG', '삼성'],
        modelNumbers: ['CAR-5000', 'TRN-3000', 'LG-HAC200'],

        specifications: {
            power: { rating: 15000, unit: 'W', voltage: 380 },
            capacity: { value: 150, unit: '평' },
            coverage: { area: 500, unit: 'm²' },
            dimensions: { width: 200, height: 180, depth: 80, unit: 'cm' },
            weight: { value: 450, unit: 'kg' },
            efficiency: 0.92,
            lifespan: 15,
            certifications: ['KS', 'CE', 'ISO9001'],
            features: ['인버터 제어', 'IoT 연동', '자동 결로방지', '에너지 회수']
        },

        costs: {
            purchase: { min: 15000000, max: 35000000, avg: 25000000 },
            installation: 3000000,
            annual: {
                energy: 8000000,
                maintenance: 1500000,
                consumables: 500000,
                total: 10000000
            },
            paybackMonths: 36
        },

        installation: {
            requirements: ['380V 전원', '배기 덕트', '드레인 배관', '기초 콘크리트'],
            duration: '2-3일',
            professionals: ['냉동공조기사', '전기기사'],
            permits: ['소방설비 신고']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['터치패널', 'BMS', '스마트폰앱'],
            safetyFeatures: ['과열방지', '누수감지', '긴급정지']
        },

        maintenance: {
            schedule: [
                { task: '필터 청소', frequency: '월 1회' },
                { task: '냉매 점검', frequency: '분기 1회' },
                { task: '전문 점검', frequency: '연 2회' }
            ],
            sparePartsRequired: ['에어필터', '벨트', '베어링'],
            avgAnnualCost: 1500000,
            technicalSupport: '24시간 콜센터'
        },

        connectivity: {
            protocols: ['Modbus', 'BACnet', 'RS485'],
            integration: ['BMS', 'SCADA', '통합관제'],
            dataOutput: ['온도', '습도', '소비전력', '알람'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    {
        id: 'hvac-heater',
        name: 'Radiant Tube Heater',
        koreanName: '온풍난방기',
        category: 'hvac',
        subcategory: '난방',

        description: '겨울철 온도 유지를 위한 난방 장비입니다.',
        manufacturer: ['동양매직', '귀뚜라미', '경동나비엔'],
        modelNumbers: ['DY-500', 'KTI-300'],

        specifications: {
            power: { rating: 50000, unit: 'kcal/h' },
            capacity: { value: 200, unit: '평' },
            coverage: { area: 660, unit: 'm²' },
            efficiency: 0.95,
            lifespan: 10,
            features: ['LPG/LNG 겸용', '온도조절', '과열방지']
        },

        costs: {
            purchase: { min: 3000000, max: 8000000, avg: 5000000 },
            installation: 1000000,
            annual: { energy: 3000000, maintenance: 500000, consumables: 200000, total: 3700000 }
        },

        installation: {
            requirements: ['가스 배관', '배기 덕트', '환기구'],
            duration: '1일',
            professionals: ['가스기사'],
            permits: ['가스사용시설 신고']
        },

        operation: {
            automationLevel: 'semi-auto',
            operatingHours: 12,
            controlInterface: ['온도조절기', 'BMS'],
            safetyFeatures: ['불완전연소 감지', '과열방지']
        },

        maintenance: {
            schedule: [
                { task: '버너 청소', frequency: '월 1회' },
                { task: '가스 누출 점검', frequency: '분기 1회' }
            ],
            sparePartsRequired: ['점화플러그', '밸브'],
            avgAnnualCost: 500000,
            technicalSupport: 'A/S 센터'
        },

        connectivity: {
            protocols: ['RS485'],
            integration: ['BMS'],
            dataOutput: ['온도', '가동상태'],
            cloudCompatible: false
        },

        essential: true,
        priority: 'high'
    },

    // ====== 조명 시스템 ======
    {
        id: 'led-grow-light',
        name: 'Full Spectrum LED Grow Light',
        koreanName: 'LED 재배등',
        category: 'lighting',
        subcategory: '재배 조명',

        description: '식물 성장에 최적화된 풀스펙트럼 LED 조명입니다. 광합성 효율을 극대화합니다.',
        manufacturer: ['필립스', '오스람', '서울반도체', 'Fluence'],
        modelNumbers: ['PH-400', 'OS-300', 'FL-SPYDR'],

        specifications: {
            power: { rating: 400, unit: 'W', voltage: 220 },
            capacity: { value: 600, unit: 'PPFD' },
            coverage: { area: 4, unit: 'm²' },
            dimensions: { width: 120, height: 5, depth: 30, unit: 'cm' },
            weight: { value: 8, unit: 'kg' },
            efficiency: 2.7, // μmol/J
            lifespan: 10,
            certifications: ['CE', 'UL', 'DLC'],
            features: ['조광 가능', '스펙트럼 조절', '원격 제어', '방수 IP65']
        },

        costs: {
            purchase: { min: 500000, max: 2000000, avg: 1000000 },
            installation: 100000,
            annual: { energy: 600000, maintenance: 50000, consumables: 0, total: 650000 }
        },

        installation: {
            requirements: ['천장 레일', '220V 전원', '제어 케이블'],
            duration: '2시간/개',
            professionals: ['전기기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 16,
            controlInterface: ['DMX', '0-10V', 'WiFi'],
            safetyFeatures: ['과열 차단', '서지 보호']
        },

        maintenance: {
            schedule: [
                { task: '렌즈 청소', frequency: '월 1회' },
                { task: '전기 점검', frequency: '연 1회' }
            ],
            sparePartsRequired: ['드라이버', 'LED 모듈'],
            avgAnnualCost: 50000,
            technicalSupport: '제조사 A/S'
        },

        connectivity: {
            protocols: ['DMX512', '0-10V', 'WiFi', 'Bluetooth'],
            integration: ['조명 제어기', 'BMS'],
            dataOutput: ['PPFD', '소비전력', '온도', '가동시간'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    // ====== 센서 시스템 ======
    {
        id: 'sensor-temp-humidity',
        name: 'Temperature & Humidity Sensor',
        koreanName: '온습도 센서',
        category: 'sensor',
        subcategory: '환경 센서',

        description: '정밀한 온도와 습도를 실시간으로 측정합니다.',
        manufacturer: ['Sensirion', 'Honeywell', 'Vaisala'],
        modelNumbers: ['SHT40', 'HIH-6130', 'HMP60'],

        specifications: {
            power: { rating: 0.5, unit: 'W', voltage: 24 },
            dimensions: { width: 5, height: 8, depth: 3, unit: 'cm' },
            lifespan: 10,
            certifications: ['NIST', 'CE'],
            features: ['±0.1°C 정밀도', '±1% RH', '디지털 출력', '방진방수']
        },

        costs: {
            purchase: { min: 50000, max: 500000, avg: 150000 },
            installation: 30000,
            annual: { energy: 5000, maintenance: 10000, consumables: 0, total: 15000 }
        },

        installation: {
            requirements: ['24V DC', '통신 케이블'],
            duration: '30분/개',
            professionals: ['설비 기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['ModBus', 'Analog'],
            safetyFeatures: ['셀프 테스트']
        },

        maintenance: {
            schedule: [
                { task: '교정', frequency: '연 1회' },
                { task: '세척', frequency: '월 1회' }
            ],
            sparePartsRequired: ['프로브'],
            avgAnnualCost: 20000,
            technicalSupport: '제조사'
        },

        connectivity: {
            protocols: ['ModBus RTU', '4-20mA', 'I2C'],
            integration: ['PLC', 'BMS', 'IoT 게이트웨이'],
            dataOutput: ['온도', '습도', '이슬점'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    {
        id: 'sensor-co2',
        name: 'CO2 Sensor',
        koreanName: 'CO2 센서',
        category: 'sensor',
        subcategory: '환경 센서',

        description: '이산화탄소 농도를 실시간으로 모니터링합니다.',
        manufacturer: ['Vaisala', 'Senseair', 'GSS'],
        modelNumbers: ['GMP252', 'K30', 'COZIR'],

        specifications: {
            power: { rating: 1, unit: 'W', voltage: 24 },
            capacity: { value: 5000, unit: 'ppm' },
            lifespan: 15,
            features: ['NDIR 방식', '자동 교정', '±30ppm 정밀도']
        },

        costs: {
            purchase: { min: 200000, max: 1500000, avg: 500000 },
            installation: 50000,
            annual: { energy: 10000, maintenance: 30000, consumables: 0, total: 40000 }
        },

        installation: {
            requirements: ['24V DC', '식물 높이 설치'],
            duration: '30분/개',
            professionals: ['설비 기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['ModBus', 'Analog'],
            safetyFeatures: ['고농도 경보']
        },

        maintenance: {
            schedule: [
                { task: '교정', frequency: '연 1회' }
            ],
            sparePartsRequired: [],
            avgAnnualCost: 30000,
            technicalSupport: '제조사'
        },

        connectivity: {
            protocols: ['ModBus', '0-10V', 'UART'],
            integration: ['PLC', 'BMS'],
            dataOutput: ['CO2 농도'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'high'
    },

    {
        id: 'sensor-ph-ec',
        name: 'pH/EC Sensor',
        koreanName: 'pH/EC 센서',
        category: 'sensor',
        subcategory: '양액 센서',

        description: '양액의 pH와 EC(전기전도도)를 측정합니다.',
        manufacturer: ['Hanna', 'Bluelab', 'Apera'],
        modelNumbers: ['HI5222', 'BLUELAB-G', 'PC60'],

        specifications: {
            power: { rating: 2, unit: 'W', voltage: 24 },
            lifespan: 3,
            features: ['연속 측정', '자동 온도보상', '교정 알림']
        },

        costs: {
            purchase: { min: 300000, max: 2000000, avg: 800000 },
            installation: 100000,
            annual: { energy: 20000, maintenance: 100000, consumables: 200000, total: 320000 }
        },

        installation: {
            requirements: ['양액 탱크', '전원', '인라인 설치'],
            duration: '1시간',
            professionals: ['설비 기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['ModBus', 'BMS'],
            safetyFeatures: ['범위 이탈 알람']
        },

        maintenance: {
            schedule: [
                { task: '교정', frequency: '주 1회' },
                { task: '전극 교체', frequency: '연 1회' }
            ],
            sparePartsRequired: ['pH 전극', 'EC 전극', '교정액'],
            avgAnnualCost: 200000,
            technicalSupport: '대리점'
        },

        connectivity: {
            protocols: ['ModBus', '4-20mA'],
            integration: ['양액 컨트롤러'],
            dataOutput: ['pH', 'EC', '온도'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    // ====== 양액 시스템 ======
    {
        id: 'nutrient-mixer',
        name: 'Automatic Nutrient Mixer',
        koreanName: '자동 양액 혼합기',
        category: 'nutrient',
        subcategory: '혼합 시스템',

        description: '양액을 자동으로 혼합하고 EC/pH를 조절합니다.',
        manufacturer: ['Priva', 'Dosatron', 'Netafim', '한국팜텍'],
        modelNumbers: ['NUTRI-M3', 'DOS-5000'],

        specifications: {
            power: { rating: 500, unit: 'W', voltage: 220 },
            capacity: { value: 1000, unit: 'L/h' },
            dimensions: { width: 100, height: 150, depth: 80, unit: 'cm' },
            lifespan: 15,
            features: ['자동 EC/pH 조절', '다채널 혼합', '비례 주입', '데이터 기록']
        },

        costs: {
            purchase: { min: 10000000, max: 50000000, avg: 25000000 },
            installation: 3000000,
            annual: { energy: 500000, maintenance: 1000000, consumables: 2000000, total: 3500000 }
        },

        installation: {
            requirements: ['급수 배관', '배액 배관', '전원', '데이터 회선'],
            duration: '3-5일',
            professionals: ['배관 기사', '전기 기사', '제어 엔지니어']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['터치 HMI', 'PC', 'BMS'],
            safetyFeatures: ['과주입 방지', '누수 감지', '수위 센서']
        },

        maintenance: {
            schedule: [
                { task: '필터 청소', frequency: '주 1회' },
                { task: '센서 교정', frequency: '월 1회' },
                { task: '펌프 점검', frequency: '분기 1회' }
            ],
            sparePartsRequired: ['펌프', '밸브', '필터', '호스'],
            avgAnnualCost: 1500000,
            technicalSupport: '정기 점검 계약'
        },

        connectivity: {
            protocols: ['ModBus', 'Ethernet', 'WiFi'],
            integration: ['BMS', 'ERP', '클라우드'],
            dataOutput: ['EC', 'pH', '유량', '재고', '레시피'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    // ====== 로봇 시스템 ======
    {
        id: 'robot-harvesting',
        name: 'Automated Harvesting Robot',
        koreanName: '자동 수확 로봇',
        category: 'robotics',
        subcategory: '수확 로봇',

        description: 'AI 비전으로 익은 작물을 감지하고 자동으로 수확합니다.',
        manufacturer: ['AppHarvest', 'Root AI', 'Agrobot', '(주)팜웨어'],
        modelNumbers: ['AH-VIRGO', 'ROOT-1'],

        specifications: {
            power: { rating: 2000, unit: 'W', voltage: 48 },
            capacity: { value: 1000, unit: '개/시간' },
            dimensions: { width: 150, height: 200, depth: 100, unit: 'cm' },
            weight: { value: 200, unit: 'kg' },
            lifespan: 10,
            certifications: ['CE', 'ISO10218'],
            features: ['AI 비전', '6축 로봇암', '무궤도 이동', '자동 충전']
        },

        costs: {
            purchase: { min: 100000000, max: 500000000, avg: 200000000 },
            installation: 10000000,
            annual: { energy: 2000000, maintenance: 10000000, consumables: 5000000, total: 17000000 }
        },

        installation: {
            requirements: ['충전 스테이션', '이동 경로', '네트워크'],
            duration: '2주',
            professionals: ['로봇 엔지니어', '시스템 통합 업체']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 20,
            controlInterface: ['HMI', 'PC', 'API'],
            safetyFeatures: ['충돌 방지', '비상 정지', '안전 영역']
        },

        maintenance: {
            schedule: [
                { task: '그리퍼 점검', frequency: '일 1회' },
                { task: '센서 교정', frequency: '주 1회' },
                { task: '전체 점검', frequency: '월 1회' }
            ],
            sparePartsRequired: ['그리퍼', '컨베이어', '카메라', '배터리'],
            avgAnnualCost: 15000000,
            technicalSupport: '상주 엔지니어 또는 원격 지원'
        },

        connectivity: {
            protocols: ['ROS', 'MQTT', 'REST API'],
            integration: ['MES', 'ERP', '클라우드'],
            dataOutput: ['수확량', '품질', '위치', '효율성'],
            cloudCompatible: true
        },

        essential: false,
        priority: 'medium'
    },

    {
        id: 'robot-transport',
        name: 'AGV Transport Robot',
        koreanName: 'AGV 운반 로봇',
        category: 'robotics',
        subcategory: '운반 로봇',

        description: '수확물과 자재를 자동으로 운반합니다.',
        manufacturer: ['MiR', 'KUKA', 'Omron', '유진로봇'],
        modelNumbers: ['MiR200', 'KMR'],

        specifications: {
            power: { rating: 500, unit: 'W', voltage: 48 },
            capacity: { value: 200, unit: 'kg' },
            dimensions: { width: 80, height: 30, depth: 60, unit: 'cm' },
            weight: { value: 80, unit: 'kg' },
            lifespan: 10,
            features: ['자율 주행', 'SLAM 내비게이션', '장애물 회피', '플릿 관리']
        },

        costs: {
            purchase: { min: 30000000, max: 100000000, avg: 50000000 },
            installation: 5000000,
            annual: { energy: 500000, maintenance: 3000000, consumables: 1000000, total: 4500000 }
        },

        installation: {
            requirements: ['충전 스테이션', '맵핑', 'WiFi'],
            duration: '3-5일',
            professionals: ['로봇 엔지니어']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 22,
            controlInterface: ['플릿 매니저', 'API'],
            safetyFeatures: ['레이저 스캐너', '범퍼 센서', '비상 정지']
        },

        maintenance: {
            schedule: [
                { task: '바퀴 점검', frequency: '주 1회' },
                { task: '센서 청소', frequency: '주 1회' }
            ],
            sparePartsRequired: ['바퀴', '배터리', '센서'],
            avgAnnualCost: 3000000,
            technicalSupport: '원격 지원'
        },

        connectivity: {
            protocols: ['WiFi', 'REST API', 'MQTT'],
            integration: ['WMS', 'MES'],
            dataOutput: ['위치', '상태', '작업 이력'],
            cloudCompatible: true
        },

        essential: false,
        priority: 'low'
    },

    // ====== 포장 시스템 ======
    {
        id: 'packaging-line',
        name: 'Automated Packaging Line',
        koreanName: '자동 포장 라인',
        category: 'packaging',
        subcategory: '포장 시스템',

        description: '수확물을 자동으로 계량, 포장, 라벨링합니다.',
        manufacturer: ['ULMA', 'Ishida', 'MULTIVAC'],
        modelNumbers: ['UL-FLOW', 'ISH-CCW'],

        specifications: {
            power: { rating: 5000, unit: 'W', voltage: 380 },
            capacity: { value: 60, unit: '팩/분' },
            dimensions: { width: 500, height: 200, depth: 150, unit: 'cm' },
            lifespan: 15,
            features: ['자동 계량', '필름 포장', '라벨 프린팅', '품질 검사']
        },

        costs: {
            purchase: { min: 50000000, max: 300000000, avg: 120000000 },
            installation: 10000000,
            annual: { energy: 3000000, maintenance: 5000000, consumables: 10000000, total: 18000000 }
        },

        installation: {
            requirements: ['전력', '압축공기', '공간', '네트워크'],
            duration: '2주',
            professionals: ['기계 엔지니어', '전기 기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 16,
            controlInterface: ['HMI', 'SCADA'],
            safetyFeatures: ['안전 커버', '비상 정지', '금속 탐지']
        },

        maintenance: {
            schedule: [
                { task: '청소', frequency: '일 1회' },
                { task: '윤활', frequency: '주 1회' },
                { task: '전문 점검', frequency: '월 1회' }
            ],
            sparePartsRequired: ['커터', '벨트', '센서', '필름 롤'],
            avgAnnualCost: 8000000,
            technicalSupport: '정기 점검 계약'
        },

        connectivity: {
            protocols: ['OPC-UA', 'Ethernet/IP'],
            integration: ['MES', 'ERP', 'WMS'],
            dataOutput: ['생산량', '효율', '품질', '재고'],
            cloudCompatible: true
        },

        essential: false,
        priority: 'medium'
    },

    // ====== 제어 시스템 ======
    {
        id: 'control-plc',
        name: 'Programmable Logic Controller',
        koreanName: 'PLC 제어기',
        category: 'control',
        subcategory: '중앙 제어',

        description: '스마트팜의 모든 장비를 통합 제어하는 두뇌입니다.',
        manufacturer: ['Siemens', 'Allen-Bradley', 'Mitsubishi', 'LS산전'],
        modelNumbers: ['S7-1500', 'CompactLogix', 'iQ-R', 'XGB'],

        specifications: {
            power: { rating: 100, unit: 'W', voltage: 24 },
            lifespan: 20,
            certifications: ['CE', 'UL', 'IEC61131'],
            features: ['고속 처리', '다중 통신', '모듈 확장', 'HMI 연동']
        },

        costs: {
            purchase: { min: 5000000, max: 30000000, avg: 15000000 },
            installation: 5000000,
            annual: { energy: 100000, maintenance: 500000, consumables: 0, total: 600000 }
        },

        installation: {
            requirements: ['제어반', '전원', 'I/O 배선'],
            duration: '1주',
            professionals: ['제어 엔지니어', '전기 기사']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['HMI', 'SCADA', 'Engineering SW'],
            safetyFeatures: ['이중화', 'UPS', '알람']
        },

        maintenance: {
            schedule: [
                { task: '백업', frequency: '월 1회' },
                { task: '배터리 교체', frequency: '연 1회' }
            ],
            sparePartsRequired: ['I/O 모듈', '통신 모듈', '배터리'],
            avgAnnualCost: 500000,
            technicalSupport: '제조사 기술지원'
        },

        connectivity: {
            protocols: ['Profinet', 'Ethernet/IP', 'ModBus', 'OPC-UA'],
            integration: ['BMS', 'SCADA', 'MES', 'ERP'],
            dataOutput: ['전체 시스템 상태'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'critical'
    },

    {
        id: 'control-iot-gateway',
        name: 'IoT Gateway',
        koreanName: 'IoT 게이트웨이',
        category: 'control',
        subcategory: 'IoT',

        description: '센서 데이터를 수집하고 클라우드로 전송합니다.',
        manufacturer: ['AWS', 'Azure', 'Advantech', '삼성SDS'],
        modelNumbers: ['Greengrass', 'IoT Edge', 'ECU-4553'],

        specifications: {
            power: { rating: 20, unit: 'W', voltage: 24 },
            lifespan: 10,
            features: ['엣지 컴퓨팅', '다중 프로토콜', 'OTA 업데이트', '보안']
        },

        costs: {
            purchase: { min: 500000, max: 3000000, avg: 1500000 },
            installation: 500000,
            annual: { energy: 50000, maintenance: 200000, consumables: 0, total: 250000 }
        },

        installation: {
            requirements: ['인터넷', '전원', '센서 연결'],
            duration: '1일',
            professionals: ['IT 엔지니어']
        },

        operation: {
            automationLevel: 'full-auto',
            operatingHours: 24,
            controlInterface: ['웹 대시보드', '클라우드'],
            safetyFeatures: ['암호화', '방화벽', '인증']
        },

        maintenance: {
            schedule: [
                { task: '펌웨어 업데이트', frequency: '분기 1회' }
            ],
            sparePartsRequired: [],
            avgAnnualCost: 200000,
            technicalSupport: '원격 지원'
        },

        connectivity: {
            protocols: ['MQTT', 'HTTP', 'ModBus', 'BLE', 'LoRa'],
            integration: ['AWS', 'Azure', 'GCP', '자체 서버'],
            dataOutput: ['전체 센서 데이터'],
            cloudCompatible: true
        },

        essential: true,
        priority: 'high'
    }
];

// ============================================
// 헬퍼 함수
// ============================================

export function getEquipmentById(id: string): SmartFarmEquipment | undefined {
    return EQUIPMENT_DATABASE.find(eq => eq.id === id);
}

export function getEquipmentByCategory(category: EquipmentCategory): SmartFarmEquipment[] {
    return EQUIPMENT_DATABASE.filter(eq => eq.category === category);
}

export function getEssentialEquipment(): SmartFarmEquipment[] {
    return EQUIPMENT_DATABASE.filter(eq => eq.essential);
}

export function getCriticalEquipment(): SmartFarmEquipment[] {
    return EQUIPMENT_DATABASE.filter(eq => eq.priority === 'critical');
}

export function calculateTotalSetupCost(equipmentIds: string[]): {
    totalPurchase: number;
    totalInstallation: number;
    annualOperating: number;
} {
    return equipmentIds.reduce((acc, id) => {
        const eq = getEquipmentById(id);
        if (eq) {
            acc.totalPurchase += eq.costs.purchase.avg;
            acc.totalInstallation += eq.costs.installation;
            acc.annualOperating += eq.costs.annual.total;
        }
        return acc;
    }, { totalPurchase: 0, totalInstallation: 0, annualOperating: 0 });
}

export function getEquipmentCategories(): { category: EquipmentCategory; koreanName: string; count: number }[] {
    const categories: { category: EquipmentCategory; koreanName: string }[] = [
        { category: 'hvac', koreanName: '공조 시스템' },
        { category: 'lighting', koreanName: '조명 시스템' },
        { category: 'irrigation', koreanName: '관수 시스템' },
        { category: 'nutrient', koreanName: '양액 시스템' },
        { category: 'control', koreanName: '제어 시스템' },
        { category: 'sensor', koreanName: '센서 시스템' },
        { category: 'electrical', koreanName: '전기 시스템' },
        { category: 'plumbing', koreanName: '배관 시스템' },
        { category: 'structure', koreanName: '구조물' },
        { category: 'robotics', koreanName: '로봇 시스템' },
        { category: 'packaging', koreanName: '포장 시스템' },
        { category: 'storage', koreanName: '저장 시스템' },
        { category: 'monitoring', koreanName: '모니터링' },
        { category: 'safety', koreanName: '안전 시스템' }
    ];

    return categories.map(cat => ({
        ...cat,
        count: getEquipmentByCategory(cat.category).length
    }));
}
