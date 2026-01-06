// AgriNexus World OS - 초일류 글로벌 물류 시스템
// Hyper-Logistics Engine - 세계 최초 전자동화 통합 물류 플랫폼

// ============================================
// 물류 핵심 타입 정의
// ============================================

export interface Shipment {
    id: string;
    trackingNumber: string;
    type: ShipmentType;
    status: ShipmentStatus;
    origin: Location;
    destination: Location;
    currentLocation: Location;
    carrier: Carrier;
    products: ShippedProduct[];
    timeline: ShipmentEvent[];
    documents: ShippingDocument[];
    costs: ShippingCost;
    customs: CustomsInfo;
    insurance: InsuranceInfo;
    specialHandling: SpecialHandling;
    environmentControl: EnvironmentControl;
    createdAt: Date;
    estimatedDelivery: Date;
    actualDelivery?: Date;
}

export type ShipmentType =
    | 'air_freight'      // 항공화물
    | 'sea_freight'      // 해상화물
    | 'rail_freight'     // 철도화물
    | 'road_freight'     // 육상화물
    | 'express_courier'  // 특급택배
    | 'cold_chain'       // 콜드체인
    | 'multimodal';      // 복합운송

export type ShipmentStatus =
    | 'pending'          // 대기
    | 'pickup_scheduled' // 픽업예정
    | 'picked_up'        // 픽업완료
    | 'in_transit'       // 운송중
    | 'customs_hold'     // 통관대기
    | 'customs_cleared'  // 통관완료
    | 'out_for_delivery' // 배송출발
    | 'delivered'        // 배송완료
    | 'return_initiated' // 반품요청
    | 'returning'        // 반품중
    | 'returned'         // 반품완료
    | 'failed'           // 배송실패
    | 'cancelled';       // 취소

// ============================================
// 위치 및 운송수단
// ============================================

export interface Location {
    id: string;
    type: LocationType;
    name: string;
    koreanName: string;
    country: string;
    city: string;
    address: string;
    postalCode: string;
    coordinates: { lat: number; lng: number };
    timezone: string;
    port?: PortInfo;
    airport?: AirportInfo;
    warehouse?: WarehouseInfo;
}

export type LocationType = 'farm' | 'warehouse' | 'port' | 'airport' | 'distribution_center' | 'retail' | 'customer';

export interface PortInfo {
    code: string;              // KRPUS (부산)
    capacity: number;          // TEU/year
    draft: number;             // 수심 (m)
    craneCount: number;
    berths: number;
}

export interface AirportInfo {
    code: string;              // ICN
    cargoCapacity: number;     // 톤/year
    coldStorage: boolean;
    customsProcessing: number; // hours
}

export interface WarehouseInfo {
    capacity: number;          // m³
    coldStorage: boolean;
    tempRange: { min: number; max: number };
    automation: AutomationLevel;
    certifications: string[];
}

export type AutomationLevel = 'manual' | 'semi_auto' | 'full_auto' | 'ai_managed';

// ============================================
// 운송사 및 컨테이너
// ============================================

export interface Carrier {
    id: string;
    name: string;
    type: CarrierType[];
    trackingUrl: string;
    apiIntegration: boolean;
    rating: number;
    onTimeRate: number;
    coverage: string[];
    pricing: PricingStructure;
}

export type CarrierType = 'air' | 'sea' | 'road' | 'rail' | 'courier';

export interface PricingStructure {
    baseRate: number;          // per kg or per CBM
    fuelSurcharge: number;     // %
    minimumCharge: number;
    dimensionalFactor: number;
    peakSeasonMultiplier: number;
}

export interface Container {
    id: string;
    type: ContainerType;
    size: ContainerSize;
    status: ContainerStatus;
    temperature?: { current: number; setpoint: number };
    humidity?: number;
    co2?: number;
    contents: ShippedProduct[];
    sealNumber: string;
    weight: { tare: number; gross: number; net: number };
    location: Location;
}

export type ContainerType = 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank';
export type ContainerSize = '20ft' | '40ft' | '40ft_hc' | '45ft';
export type ContainerStatus = 'empty' | 'loading' | 'sealed' | 'in_transit' | 'unloading';

// ============================================
// 상품 및 문서
// ============================================

export interface ShippedProduct {
    id: string;
    name: string;
    koreanName: string;
    quantity: number;
    unit: string;
    weight: number;            // kg
    volume: number;            // m³
    hsCode: string;            // HS 코드
    originCountry: string;
    value: number;             // USD
    certificates: string[];
    storageConditions: StorageCondition;
    shelfLife: number;         // days
    harvestDate?: Date;
    batchId?: string;
}

export interface StorageCondition {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    ventilation: boolean;
    lightSensitive: boolean;
    stackable: boolean;
    maxStack: number;
}

export interface ShippingDocument {
    id: string;
    type: DocumentType;
    documentNumber: string;
    issueDate: Date;
    expiryDate?: Date;
    issuingAuthority: string;
    status: 'draft' | 'submitted' | 'approved' | 'rejected';
    fileUrl?: string;
    required: boolean;
    content: Record<string, unknown>;
}

export type DocumentType =
    | 'commercial_invoice'      // 상업송장
    | 'packing_list'           // 포장명세서
    | 'bill_of_lading'         // 선하증권
    | 'air_waybill'            // 항공화물운송장
    | 'certificate_of_origin'  // 원산지증명서
    | 'phytosanitary_cert'     // 식물검역증명서
    | 'export_declaration'     // 수출신고서
    | 'import_declaration'     // 수입신고서
    | 'insurance_certificate'  // 보험증권
    | 'quality_certificate'    // 품질검사서
    | 'gmp_certificate'        // GMP 인증서
    | 'haccp_certificate'      // HACCP 인증서
    | 'organic_certificate'    // 유기농 인증서
    | 'halal_certificate'      // 할랄 인증서
    | 'customs_declaration';   // 세관신고서

// ============================================
// 비용 및 보험
// ============================================

export interface ShippingCost {
    freight: number;
    fuelSurcharge: number;
    customsDuties: number;
    taxes: number;
    insurance: number;
    handling: number;
    documentation: number;
    coldChainPremium: number;
    total: number;
    currency: string;
    breakdown: CostBreakdown[];
}

export interface CostBreakdown {
    category: string;
    description: string;
    amount: number;
    taxable: boolean;
}

export interface InsuranceInfo {
    provider: string;
    policyNumber: string;
    coverage: number;
    premium: number;
    type: 'all_risks' | 'named_perils' | 'total_loss_only';
    claims: InsuranceClaim[];
}

export interface InsuranceClaim {
    id: string;
    date: Date;
    reason: string;
    amount: number;
    status: 'filed' | 'under_review' | 'approved' | 'paid' | 'rejected';
}

// ============================================
// 통관 및 규정
// ============================================

export interface CustomsInfo {
    exportCountry: string;
    importCountry: string;
    declarationNumber: string;
    status: CustomsStatus;
    duties: DutyCalculation;
    inspectionRequired: boolean;
    inspectionResult?: 'passed' | 'failed' | 'pending';
    clearanceDate?: Date;
    broker: CustomsBroker;
    regulations: Regulation[];
}

export type CustomsStatus =
    | 'not_started'
    | 'documents_submitted'
    | 'under_review'
    | 'inspection_scheduled'
    | 'duty_payment_pending'
    | 'cleared'
    | 'held'
    | 'rejected';

export interface DutyCalculation {
    hsCode: string;
    dutyRate: number;          // %
    vatRate: number;           // %
    customsValue: number;      // CIF value
    dutyAmount: number;
    vatAmount: number;
    totalDuties: number;
    preferentialRate?: number; // FTA 적용
    ftaApplied?: string;       // 적용 FTA
}

export interface CustomsBroker {
    id: string;
    name: string;
    license: string;
    rating: number;
    specialization: string[];
    processingTime: number;    // average hours
}

export interface Regulation {
    country: string;
    type: RegulationType;
    description: string;
    requirements: string[];
    validUntil: Date;
    lastUpdated: Date;
}

export type RegulationType =
    | 'import_restriction'
    | 'quota_limit'
    | 'inspection_requirement'
    | 'labeling_requirement'
    | 'certification_required'
    | 'prohibited_item';

// ============================================
// 특수 처리 및 환경 제어
// ============================================

export interface SpecialHandling {
    fragile: boolean;
    perishable: boolean;
    hazardous: boolean;
    oversized: boolean;
    liveSpecimen: boolean;
    valueDeclared: boolean;
    instructions: string[];
}

export interface EnvironmentControl {
    required: boolean;
    temperature: { current: number; setpoint: number; tolerance: number };
    humidity: { current: number; setpoint: number; tolerance: number };
    atmosphere: { o2: number; co2: number; n2: number };
    ventilation: boolean;
    ethyleneControl: boolean;
    alerts: EnvironmentAlert[];
    history: EnvironmentReading[];
}

export interface EnvironmentAlert {
    timestamp: Date;
    type: 'temperature' | 'humidity' | 'atmosphere' | 'shock' | 'door_open';
    severity: 'warning' | 'critical';
    value: number;
    threshold: number;
    resolved: boolean;
}

export interface EnvironmentReading {
    timestamp: Date;
    temperature: number;
    humidity: number;
    co2: number;
    shock: number;              // g-force
    doorStatus: 'closed' | 'open';
    gps: { lat: number; lng: number };
}

// ============================================
// 이벤트 및 추적
// ============================================

export interface ShipmentEvent {
    id: string;
    timestamp: Date;
    type: EventType;
    location: Location;
    description: string;
    operator?: string;
    evidence?: {
        photos: string[];
        signature?: string;
        temperature?: number;
    };
    automated: boolean;
}

export type EventType =
    | 'order_created'
    | 'documents_ready'
    | 'pickup_scheduled'
    | 'picked_up'
    | 'arrived_facility'
    | 'departed_facility'
    | 'customs_submitted'
    | 'customs_inspection'
    | 'customs_cleared'
    | 'loaded_vehicle'
    | 'in_transit'
    | 'arrived_destination_port'
    | 'out_for_delivery'
    | 'delivery_attempted'
    | 'delivered'
    | 'signature_obtained'
    | 'return_initiated'
    | 'returned'
    | 'exception';

// ============================================
// 물류 시스템 엔진
// ============================================

export class HyperLogisticsEngine {
    private shipments: Map<string, Shipment> = new Map();
    private carriers: Map<string, Carrier> = new Map();
    private containers: Map<string, Container> = new Map();
    private locations: Map<string, Location> = new Map();
    private documentTemplates: Map<DocumentType, DocumentTemplate> = new Map();

    constructor() {
        this.initializeCarriers();
        this.initializeLocations();
        this.initializeDocumentTemplates();
    }

    private initializeCarriers(): void {
        const carriers: Carrier[] = [
            {
                id: 'maersk',
                name: 'Maersk Line',
                type: ['sea'],
                trackingUrl: 'https://www.maersk.com/tracking',
                apiIntegration: true,
                rating: 4.5,
                onTimeRate: 92,
                coverage: ['Asia', 'Europe', 'North America', 'South America'],
                pricing: { baseRate: 1500, fuelSurcharge: 15, minimumCharge: 500, dimensionalFactor: 166, peakSeasonMultiplier: 1.3 }
            },
            {
                id: 'korean_air_cargo',
                name: 'Korean Air Cargo',
                type: ['air'],
                trackingUrl: 'https://cargo.koreanair.com',
                apiIntegration: true,
                rating: 4.7,
                onTimeRate: 96,
                coverage: ['Worldwide'],
                pricing: { baseRate: 8, fuelSurcharge: 25, minimumCharge: 100, dimensionalFactor: 167, peakSeasonMultiplier: 1.5 }
            },
            {
                id: 'cj_logistics',
                name: 'CJ 대한통운',
                type: ['road', 'courier'],
                trackingUrl: 'https://www.cjlogistics.com',
                apiIntegration: true,
                rating: 4.3,
                onTimeRate: 94,
                coverage: ['Korea', 'Japan', 'China', 'Southeast Asia'],
                pricing: { baseRate: 3, fuelSurcharge: 10, minimumCharge: 3000, dimensionalFactor: 5000, peakSeasonMultiplier: 1.2 }
            },
            {
                id: 'dhl_express',
                name: 'DHL Express',
                type: ['air', 'courier'],
                trackingUrl: 'https://www.dhl.com/tracking',
                apiIntegration: true,
                rating: 4.6,
                onTimeRate: 97,
                coverage: ['Worldwide'],
                pricing: { baseRate: 12, fuelSurcharge: 20, minimumCharge: 50, dimensionalFactor: 5000, peakSeasonMultiplier: 1.4 }
            },
        ];

        for (const carrier of carriers) {
            this.carriers.set(carrier.id, carrier);
        }
    }

    private initializeLocations(): void {
        const locations: Location[] = [
            {
                id: 'incheon_airport',
                type: 'airport',
                name: 'Incheon International Airport',
                koreanName: '인천국제공항',
                country: 'Korea',
                city: 'Incheon',
                address: '272 Gonghang-ro, Jung-gu',
                postalCode: '22382',
                coordinates: { lat: 37.4602, lng: 126.4407 },
                timezone: 'Asia/Seoul',
                airport: { code: 'ICN', cargoCapacity: 3000000, coldStorage: true, customsProcessing: 4 }
            },
            {
                id: 'busan_port',
                type: 'port',
                name: 'Port of Busan',
                koreanName: '부산항',
                country: 'Korea',
                city: 'Busan',
                address: 'Gamman-dong, Sasang-gu',
                postalCode: '46745',
                coordinates: { lat: 35.0788, lng: 128.8884 },
                timezone: 'Asia/Seoul',
                port: { code: 'KRPUS', capacity: 22000000, draft: 17, craneCount: 120, berths: 45 }
            },
            {
                id: 'agrinexus_farm',
                type: 'farm',
                name: 'AgriNexus Smart Farm',
                koreanName: '애그리넥서스 스마트팜',
                country: 'Korea',
                city: 'Sejong',
                address: '123 Smart Farm Road',
                postalCode: '30128',
                coordinates: { lat: 36.5684, lng: 127.2570 },
                timezone: 'Asia/Seoul',
                warehouse: { capacity: 5000, coldStorage: true, tempRange: { min: -5, max: 25 }, automation: 'ai_managed', certifications: ['HACCP', 'GAP', 'Organic'] }
            },
        ];

        for (const loc of locations) {
            this.locations.set(loc.id, loc);
        }
    }

    private initializeDocumentTemplates(): void {
        // 문서 템플릿 초기화 (실제 구현에서는 상세 폼 데이터 포함)
    }

    // 배송 생성
    createShipment(config: CreateShipmentConfig): Shipment {
        const trackingNumber = this.generateTrackingNumber();
        const carrier = this.carriers.get(config.carrierId);

        if (!carrier) throw new Error('Carrier not found');

        const origin = config.originId
            ? this.locations.get(config.originId) || this.createDefaultLocation('origin')
            : config.originAddress
                ? this.createCustomLocation(config.originAddress)
                : this.createDefaultLocation('origin');

        const destination = config.destinationId
            ? this.locations.get(config.destinationId) || this.createDefaultLocation('destination')
            : config.destinationAddress
                ? this.createCustomLocation(config.destinationAddress)
                : this.createDefaultLocation('destination');

        const costs = this.calculateShippingCost(config.products, config.shipmentType, carrier, origin, destination);
        const documents = this.generateRequiredDocuments(config);
        const estimatedDelivery = this.calculateDeliveryDate(config.shipmentType, origin, destination);

        const shipment: Shipment = {
            id: `SHP-${Date.now()}`,
            trackingNumber,
            type: config.shipmentType,
            status: 'pending',
            origin,
            destination,
            currentLocation: origin,
            carrier,
            products: config.products,
            timeline: [{
                id: `evt-${Date.now()}`,
                timestamp: new Date(),
                type: 'order_created',
                location: origin,
                description: '주문이 생성되었습니다',
                automated: true
            }],
            documents,
            costs,
            customs: this.initializeCustoms(origin, destination, config.products),
            insurance: config.insurance || this.defaultInsurance(costs.total),
            specialHandling: config.specialHandling || { fragile: false, perishable: true, hazardous: false, oversized: false, liveSpecimen: false, valueDeclared: false, instructions: [] },
            environmentControl: this.initializeEnvironmentControl(config.products),
            createdAt: new Date(),
            estimatedDelivery
        };

        this.shipments.set(shipment.id, shipment);
        return shipment;
    }

    private generateTrackingNumber(): string {
        const prefix = 'ANX';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    private createCustomLocation(address: { country: string; city: string; address: string }): Location {
        return {
            id: `loc-${Date.now()}`,
            type: 'customer',
            name: address.address,
            koreanName: address.address,
            country: address.country,
            city: address.city,
            address: address.address,
            postalCode: '',
            coordinates: { lat: 0, lng: 0 },
            timezone: 'UTC'
        };
    }

    private createDefaultLocation(type: 'origin' | 'destination'): Location {
        return {
            id: `loc-default-${type}-${Date.now()}`,
            type: 'warehouse',
            name: type === 'origin' ? 'Default Origin' : 'Default Destination',
            koreanName: type === 'origin' ? '기본 출발지' : '기본 도착지',
            country: 'Korea',
            city: 'Seoul',
            address: 'Default Address',
            postalCode: '00000',
            coordinates: { lat: 37.5665, lng: 126.9780 },
            timezone: 'Asia/Seoul'
        };
    }

    private calculateShippingCost(products: ShippedProduct[], type: ShipmentType, carrier: Carrier, origin: Location, destination: Location): ShippingCost {
        const totalWeight = products.reduce((sum, p) => sum + p.weight * p.quantity, 0);
        const totalVolume = products.reduce((sum, p) => sum + p.volume * p.quantity, 0);
        const totalValue = products.reduce((sum, p) => sum + p.value * p.quantity, 0);

        // 차지 중량 계산
        const volumetricWeight = totalVolume * carrier.pricing.dimensionalFactor;
        const chargeableWeight = Math.max(totalWeight, volumetricWeight);

        let freight = chargeableWeight * carrier.pricing.baseRate;
        freight = Math.max(freight, carrier.pricing.minimumCharge);

        const fuelSurcharge = freight * (carrier.pricing.fuelSurcharge / 100);
        const insurance = totalValue * 0.005; // 0.5%
        const handling = 50000;
        const documentation = 30000;
        const coldChainPremium = type === 'cold_chain' ? freight * 0.3 : 0;

        // 국제 배송의 경우 관세 예상
        const customsDuties = origin.country !== destination.country
            ? totalValue * 0.08 // 평균 8% 관세
            : 0;
        const taxes = customsDuties * 0.1; // 부가세

        const breakdown: CostBreakdown[] = [
            { category: '운송료', description: '기본 운송 비용', amount: freight, taxable: true },
            { category: '유류할증료', description: '연료비 변동 반영', amount: fuelSurcharge, taxable: true },
            { category: '관세', description: '수입 관세', amount: customsDuties, taxable: false },
            { category: '부가세', description: '수입 부가가치세', amount: taxes, taxable: false },
            { category: '보험료', description: '화물 보험', amount: insurance, taxable: true },
            { category: '취급료', description: '하역 및 취급', amount: handling, taxable: true },
            { category: '서류비', description: '문서 처리 비용', amount: documentation, taxable: true },
            { category: '콜드체인', description: '저온 유지 비용', amount: coldChainPremium, taxable: true },
        ];

        return {
            freight,
            fuelSurcharge,
            customsDuties,
            taxes,
            insurance,
            handling,
            documentation,
            coldChainPremium,
            total: breakdown.reduce((sum, b) => sum + b.amount, 0),
            currency: 'KRW',
            breakdown
        };
    }

    private generateRequiredDocuments(config: CreateShipmentConfig): ShippingDocument[] {
        const documents: ShippingDocument[] = [];
        const now = new Date();

        // 상업송장
        documents.push({
            id: `doc-${Date.now()}-ci`,
            type: 'commercial_invoice',
            documentNumber: `CI-${Date.now()}`,
            issueDate: now,
            issuingAuthority: 'AgriNexus World',
            status: 'draft',
            required: true,
            content: {
                seller: 'AgriNexus Smart Farm',
                buyer: config.destinationAddress?.address || '',
                products: config.products,
                terms: 'CIF',
                currency: 'USD'
            }
        });

        // 포장명세서
        documents.push({
            id: `doc-${Date.now()}-pl`,
            type: 'packing_list',
            documentNumber: `PL-${Date.now()}`,
            issueDate: now,
            issuingAuthority: 'AgriNexus World',
            status: 'draft',
            required: true,
            content: {
                packages: config.products.length,
                totalWeight: config.products.reduce((s, p) => s + p.weight * p.quantity, 0),
                totalVolume: config.products.reduce((s, p) => s + p.volume * p.quantity, 0)
            }
        });

        // 식물검역증명서 (농산물)
        if (config.products.some(p => p.certificates.includes('phytosanitary'))) {
            documents.push({
                id: `doc-${Date.now()}-pc`,
                type: 'phytosanitary_cert',
                documentNumber: `PC-${Date.now()}`,
                issueDate: now,
                issuingAuthority: '농림축산검역본부',
                status: 'draft',
                required: true,
                content: {
                    inspectionResult: 'pending',
                    pests: 'none_detected'
                }
            });
        }

        return documents;
    }

    private calculateDeliveryDate(type: ShipmentType, origin: Location, destination: Location): Date {
        const now = new Date();
        let daysToAdd = 3; // 기본 3일

        switch (type) {
            case 'air_freight': daysToAdd = 3; break;
            case 'express_courier': daysToAdd = 2; break;
            case 'sea_freight': daysToAdd = 25; break;
            case 'road_freight': daysToAdd = 5; break;
            case 'cold_chain': daysToAdd = 4; break;
        }

        // 국제 배송 추가 시간
        if (origin.country !== destination.country) {
            daysToAdd += 3;
        }

        return new Date(now.getTime() + daysToAdd * 86400000);
    }

    private initializeCustoms(origin: Location, destination: Location, products: ShippedProduct[]): CustomsInfo {
        const totalValue = products.reduce((s, p) => s + p.value * p.quantity, 0);

        return {
            exportCountry: origin.country,
            importCountry: destination.country,
            declarationNumber: `CD-${Date.now()}`,
            status: 'not_started',
            duties: {
                hsCode: products[0]?.hsCode || '0810.10',
                dutyRate: 8,
                vatRate: 10,
                customsValue: totalValue,
                dutyAmount: totalValue * 0.08,
                vatAmount: totalValue * 0.1,
                totalDuties: totalValue * 0.18,
                ftaApplied: origin.country === 'Korea' ? '한-EU FTA' : undefined
            },
            inspectionRequired: products.some(p => p.storageConditions.temperature.max < 10),
            broker: {
                id: 'broker-001',
                name: '세관전문 관세사',
                license: 'CB-12345',
                rating: 4.8,
                specialization: ['농산물', '식품'],
                processingTime: 4
            },
            regulations: []
        };
    }

    private defaultInsurance(value: number): InsuranceInfo {
        return {
            provider: 'Samsung Fire & Marine Insurance',
            policyNumber: `INS-${Date.now()}`,
            coverage: value * 1.1, // 110% 보상
            premium: value * 0.005,
            type: 'all_risks',
            claims: []
        };
    }

    private initializeEnvironmentControl(products: ShippedProduct[]): EnvironmentControl {
        const perishable = products.some(p => p.shelfLife < 30);
        const coldRequired = products.some(p => p.storageConditions.temperature.max < 15);

        if (!coldRequired) return { required: false } as EnvironmentControl;

        const avgTemp = products.reduce((s, p) => s + (p.storageConditions.temperature.min + p.storageConditions.temperature.max) / 2, 0) / products.length;

        return {
            required: true,
            temperature: { current: avgTemp, setpoint: avgTemp, tolerance: 2 },
            humidity: { current: 85, setpoint: 85, tolerance: 10 },
            atmosphere: { o2: 3, co2: 10, n2: 87 },
            ventilation: true,
            ethyleneControl: true,
            alerts: [],
            history: []
        };
    }

    // 실시간 추적
    trackShipment(trackingNumber: string): Shipment | undefined {
        return Array.from(this.shipments.values()).find(s => s.trackingNumber === trackingNumber);
    }

    // 배송 상태 업데이트
    updateShipmentStatus(shipmentId: string, newStatus: ShipmentStatus, location?: Location, description?: string): void {
        const shipment = this.shipments.get(shipmentId);
        if (!shipment) return;

        shipment.status = newStatus;
        if (location) shipment.currentLocation = location;

        const eventType = this.statusToEventType(newStatus);
        shipment.timeline.push({
            id: `evt-${Date.now()}`,
            timestamp: new Date(),
            type: eventType,
            location: location || shipment.currentLocation,
            description: description || this.getStatusDescription(newStatus),
            automated: true
        });

        if (newStatus === 'delivered') {
            shipment.actualDelivery = new Date();
        }
    }

    private statusToEventType(status: ShipmentStatus): EventType {
        const map: Record<ShipmentStatus, EventType> = {
            pending: 'order_created',
            pickup_scheduled: 'pickup_scheduled',
            picked_up: 'picked_up',
            in_transit: 'in_transit',
            customs_hold: 'customs_submitted',
            customs_cleared: 'customs_cleared',
            out_for_delivery: 'out_for_delivery',
            delivered: 'delivered',
            return_initiated: 'return_initiated',
            returning: 'in_transit',
            returned: 'returned',
            failed: 'exception',
            cancelled: 'exception'
        };
        return map[status];
    }

    private getStatusDescription(status: ShipmentStatus): string {
        const map: Record<ShipmentStatus, string> = {
            pending: '주문 처리 대기',
            pickup_scheduled: '픽업 예정',
            picked_up: '수거 완료',
            in_transit: '운송 중',
            customs_hold: '통관 심사 중',
            customs_cleared: '통관 완료',
            out_for_delivery: '배송 출발',
            delivered: '배송 완료',
            return_initiated: '반품 접수',
            returning: '반품 진행 중',
            returned: '반품 완료',
            failed: '배송 실패',
            cancelled: '취소됨'
        };
        return map[status];
    }

    // 운송사 조회
    getAllCarriers(): Carrier[] {
        return Array.from(this.carriers.values());
    }

    // 배송 조회
    getShipment(id: string): Shipment | undefined {
        return this.shipments.get(id);
    }

    // 전체 배송 목록
    getAllShipments(): Shipment[] {
        return Array.from(this.shipments.values());
    }

    // 배송 통계
    getShipmentStats(): ShipmentStatistics {
        const shipments = Array.from(this.shipments.values());
        const delivered = shipments.filter(s => s.status === 'delivered');
        const inTransit = shipments.filter(s => s.status === 'in_transit');
        const pending = shipments.filter(s => s.status === 'pending');

        const onTime = delivered.filter(s =>
            s.actualDelivery && s.actualDelivery <= s.estimatedDelivery
        ).length;

        return {
            total: shipments.length,
            delivered: delivered.length,
            inTransit: inTransit.length,
            pending: pending.length,
            onTimeRate: delivered.length > 0 ? (onTime / delivered.length) * 100 : 100,
            averageDeliveryTime: this.calculateAverageDeliveryTime(delivered),
            totalRevenue: shipments.reduce((s, sh) => s + sh.costs.total, 0),
            byCarrier: this.groupByCarrier(shipments),
            byType: this.groupByType(shipments)
        };
    }

    private calculateAverageDeliveryTime(delivered: Shipment[]): number {
        if (delivered.length === 0) return 0;
        const totalDays = delivered.reduce((sum, s) => {
            if (s.actualDelivery) {
                return sum + (s.actualDelivery.getTime() - s.createdAt.getTime()) / 86400000;
            }
            return sum;
        }, 0);
        return totalDays / delivered.length;
    }

    private groupByCarrier(shipments: Shipment[]): Record<string, number> {
        const result: Record<string, number> = {};
        for (const s of shipments) {
            result[s.carrier.name] = (result[s.carrier.name] || 0) + 1;
        }
        return result;
    }

    private groupByType(shipments: Shipment[]): Record<ShipmentType, number> {
        const result: Record<string, number> = {};
        for (const s of shipments) {
            result[s.type] = (result[s.type] || 0) + 1;
        }
        return result as Record<ShipmentType, number>;
    }
}

export interface CreateShipmentConfig {
    shipmentType: ShipmentType;
    carrierId: string;
    originId?: string;
    originAddress?: { country: string; city: string; address: string };
    destinationId?: string;
    destinationAddress?: { country: string; city: string; address: string };
    products: ShippedProduct[];
    insurance?: InsuranceInfo;
    specialHandling?: SpecialHandling;
}

export interface ShipmentStatistics {
    total: number;
    delivered: number;
    inTransit: number;
    pending: number;
    onTimeRate: number;
    averageDeliveryTime: number;
    totalRevenue: number;
    byCarrier: Record<string, number>;
    byType: Record<ShipmentType, number>;
}

export interface DocumentTemplate {
    type: DocumentType;
    fields: DocumentField[];
    required: boolean;
    format: 'pdf' | 'excel' | 'json';
}

export interface DocumentField {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'table';
    required: boolean;
    validation?: string;
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let logisticsEngine: HyperLogisticsEngine | null = null;

export function getHyperLogisticsEngine(): HyperLogisticsEngine {
    if (!logisticsEngine) {
        logisticsEngine = new HyperLogisticsEngine();
    }
    return logisticsEngine;
}

// 상태 아이콘
export const SHIPMENT_STATUS_ICONS: Record<ShipmentStatus, string> = {
    pending: '⏳',
    pickup_scheduled: '📅',
    picked_up: '📦',
    in_transit: '🚚',
    customs_hold: '🛃',
    customs_cleared: '✅',
    out_for_delivery: '🛵',
    delivered: '✔️',
    return_initiated: '↩️',
    returning: '🔄',
    returned: '📤',
    failed: '❌',
    cancelled: '🚫'
};

// 배송 유형 아이콘
export const SHIPMENT_TYPE_ICONS: Record<ShipmentType, string> = {
    air_freight: '✈️',
    sea_freight: '🚢',
    rail_freight: '🚂',
    road_freight: '🚛',
    express_courier: '📮',
    cold_chain: '❄️',
    multimodal: '🔀'
};

// 문서 유형 한글명
export const DOCUMENT_TYPE_NAMES: Record<DocumentType, string> = {
    commercial_invoice: '상업송장',
    packing_list: '포장명세서',
    bill_of_lading: '선하증권',
    air_waybill: '항공화물운송장',
    certificate_of_origin: '원산지증명서',
    phytosanitary_cert: '식물검역증명서',
    export_declaration: '수출신고서',
    import_declaration: '수입신고서',
    insurance_certificate: '보험증권',
    quality_certificate: '품질검사서',
    gmp_certificate: 'GMP 인증서',
    haccp_certificate: 'HACCP 인증서',
    organic_certificate: '유기농 인증서',
    halal_certificate: '할랄 인증서',
    customs_declaration: '세관신고서'
};
