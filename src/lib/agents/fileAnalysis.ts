// AgriNexus World OS - 파일 분석 AI 에이전트 시스템
// 스마트팜 관련 모든 파일 자동 분석 및 처리

export type FileCategory =
    | 'floorplan'      // 평면도
    | 'blueprint'      // 설계도
    | 'image'          // 이미지
    | 'document'       // 문서
    | 'spreadsheet'    // 스프레드시트
    | 'data'           // 데이터 파일
    | '3dmodel'        // 3D 모델
    | 'video'          // 비디오
    | 'unknown';       // 알 수 없음

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    category: FileCategory;
    uploadedAt: Date;
    status: 'uploading' | 'analyzing' | 'processed' | 'error';
    progress: number;
    analysis?: FileAnalysis;
    preview?: string;
}

export interface FileAnalysis {
    category: FileCategory;
    confidence: number;
    summary: string;
    extractedData: ExtractedData;
    recommendations: Recommendation[];
    agentUsed: string;
    processingTime: number;
    validationStatus: 'valid' | 'warning' | 'error';
    legalCompliance: LegalCompliance;
}

export interface ExtractedData {
    dimensions?: { width: number; height: number; depth?: number; unit: string };
    area?: number;
    zones?: Zone[];
    equipment?: string[];
    crops?: string[];
    materials?: string[];
    costs?: { item: string; amount: number }[];
    metadata?: Record<string, unknown>;
}

export interface Zone {
    id: string;
    name: string;
    type: 'growing' | 'control' | 'storage' | 'passage' | 'utility';
    area: number;
    position: { x: number; y: number };
    crops?: string[];
}

export interface Recommendation {
    type: 'optimization' | 'warning' | 'suggestion' | 'requirement';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    impact?: number;
}

export interface LegalCompliance {
    status: 'compliant' | 'review_needed' | 'non_compliant';
    checks: ComplianceCheck[];
    country: string;
}

export interface ComplianceCheck {
    rule: string;
    status: 'pass' | 'warning' | 'fail';
    details: string;
}

// 파일 분석 전담 에이전트
export const FILE_ANALYSIS_AGENTS = {
    floorplan: {
        id: 'agent-floorplan',
        code: 'B.L.U.E.P.R.I.N.T.',
        name: 'BLUEPRINT Analyzer',
        koreanName: '설계도 분석 에이전트',
        specialty: ['CAD 파일 분석', '평면도 해석', '공간 최적화', '구역 자동 분류'],
        accuracy: 97.5,
        supportedFormats: ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.svg'],
    },
    image: {
        id: 'agent-image',
        code: 'V.I.S.I.O.N.',
        name: 'VISION Processor',
        koreanName: '이미지 처리 에이전트',
        specialty: ['이미지 인식', '객체 감지', '작물 상태 분석', '시설 점검'],
        accuracy: 96.8,
        supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'],
    },
    document: {
        id: 'agent-document',
        code: 'D.O.C.U.M.E.N.T.',
        name: 'DOCUMENT Parser',
        koreanName: '문서 분석 에이전트',
        specialty: ['텍스트 추출', '계약서 분석', '규정 검토', '보고서 생성'],
        accuracy: 98.2,
        supportedFormats: ['.pdf', '.docx', '.doc', '.txt', '.rtf'],
    },
    spreadsheet: {
        id: 'agent-spreadsheet',
        code: 'D.A.T.A.S.H.E.E.T.',
        name: 'DATASHEET Analyzer',
        koreanName: '데이터시트 분석 에이전트',
        specialty: ['데이터 분석', '트렌드 감지', '비용 계산', '예측 모델링'],
        accuracy: 99.1,
        supportedFormats: ['.xlsx', '.xls', '.csv', '.json'],
    },
    '3dmodel': {
        id: 'agent-3dmodel',
        code: 'S.P.A.C.E.3.D.',
        name: 'SPACE3D Renderer',
        koreanName: '3D 모델 에이전트',
        specialty: ['3D 모델 렌더링', '공간 시뮬레이션', '조명 분석', '환경 최적화'],
        accuracy: 95.5,
        supportedFormats: ['.obj', '.fbx', '.gltf', '.glb', '.stl'],
    },
    data: {
        id: 'agent-data',
        code: 'S.E.N.S.O.R.D.A.T.A.',
        name: 'SENSORDATA Processor',
        koreanName: '센서 데이터 에이전트',
        specialty: ['IoT 데이터 처리', '시계열 분석', '이상치 감지', '예측'],
        accuracy: 98.7,
        supportedFormats: ['.json', '.csv', '.xml', '.parquet'],
    },
};

// 파일 유형 감지
export function detectFileCategory(file: File): FileCategory {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const type = file.type.toLowerCase();

    // 설계도/평면도
    if (['.dwg', '.dxf'].includes(`.${ext}`) || file.name.includes('floor') || file.name.includes('plan')) {
        return 'floorplan';
    }

    // 이미지
    if (type.startsWith('image/') || ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(`.${ext}`)) {
        return 'image';
    }

    // 문서
    if (type.includes('pdf') || type.includes('document') || ['.pdf', '.docx', '.doc', '.txt', '.rtf'].includes(`.${ext}`)) {
        return 'document';
    }

    // 스프레드시트
    if (type.includes('sheet') || type.includes('excel') || ['.xlsx', '.xls', '.csv'].includes(`.${ext}`)) {
        return 'spreadsheet';
    }

    // 3D 모델
    if (['.obj', '.fbx', '.gltf', '.glb', '.stl'].includes(`.${ext}`)) {
        return '3dmodel';
    }

    // 데이터
    if (['.json', '.xml', '.parquet'].includes(`.${ext}`)) {
        return 'data';
    }

    // 비디오
    if (type.startsWith('video/') || ['.mp4', '.webm', '.mov', '.avi'].includes(`.${ext}`)) {
        return 'video';
    }

    return 'unknown';
}

// 시뮬레이션된 파일 분석 결과 생성
export function simulateFileAnalysis(file: UploadedFile): FileAnalysis {
    const isFloorplan = file.category === 'floorplan' || file.category === 'image';

    const baseAnalysis: FileAnalysis = {
        category: file.category,
        confidence: 85 + Math.random() * 14, // 85-99%
        summary: generateSummary(file),
        extractedData: generateExtractedData(file),
        recommendations: generateRecommendations(file),
        agentUsed: FILE_ANALYSIS_AGENTS[file.category as keyof typeof FILE_ANALYSIS_AGENTS]?.code || 'UNKNOWN',
        processingTime: 500 + Math.random() * 2000,
        validationStatus: Math.random() > 0.1 ? 'valid' : 'warning',
        legalCompliance: {
            status: Math.random() > 0.05 ? 'compliant' : 'review_needed',
            checks: [
                { rule: '건축법 시행령', status: 'pass', details: '구조 안전 기준 충족' },
                { rule: '농업시설 안전기준', status: 'pass', details: '농업 시설 설치 기준 적합' },
                { rule: '환경법규', status: Math.random() > 0.2 ? 'pass' : 'warning', details: '환경 영향 평가 필요 여부 확인' },
                { rule: '소방법', status: 'pass', details: '소방 시설 기준 충족' },
            ],
            country: 'KR',
        },
    };

    return baseAnalysis;
}

function generateSummary(file: UploadedFile): string {
    const summaries: Record<FileCategory, string[]> = {
        floorplan: [
            '실내 스마트팜 평면도가 감지되었습니다. 총 면적 약 500㎡, 4개의 재배 구역으로 구성되어 있습니다.',
            '컨테이너형 스마트팜 설계도입니다. 40ft 컨테이너 기반, 수직 재배 시스템 6층 구조입니다.',
            '유리온실 설계도가 분석되었습니다. Venlo 타입, 총 면적 1,200㎡, 8개 구역 구성입니다.',
        ],
        blueprint: [
            '건축 설계도가 감지되었습니다. 구조 상세와 재료 명세가 포함되어 있습니다.',
            '시공 도면입니다. 전기/기계 설비 배치가 포함되어 있습니다.',
        ],
        image: [
            '스마트팜 시설 사진이 분석되었습니다. LED 조명 시스템과 수경재배 설비가 확인됩니다.',
            '작물 생육 상태 이미지입니다. 상추류 작물이 양호한 상태로 재배 중입니다.',
        ],
        document: [
            '스마트팜 사업계획서가 분석되었습니다. 투자 규모, 예상 수익률, 운영 계획이 포함되어 있습니다.',
            '시설 유지보수 매뉴얼입니다. 주요 장비별 점검 주기와 교체 기준이 명시되어 있습니다.',
        ],
        spreadsheet: [
            '재배 데이터 시트가 분석되었습니다. 12개월간의 수확량과 환경 데이터가 포함되어 있습니다.',
            '비용-수익 분석 시트입니다. 월별 운영비와 매출 데이터가 정리되어 있습니다.',
        ],
        '3dmodel': [
            '3D 스마트팜 모델이 로드되었습니다. 수직 재배 랙 시스템이 포함되어 있습니다.',
        ],
        data: [
            'IoT 센서 데이터가 분석되었습니다. 온도, 습도, CO2, 조도 데이터가 포함되어 있습니다.',
        ],
        video: [
            '스마트팜 시설 영상이 분석되었습니다.',
        ],
        unknown: [
            '파일 형식을 확인 중입니다.',
        ],
    };

    const options = summaries[file.category] || summaries.unknown;
    return options[Math.floor(Math.random() * options.length)];
}

function generateExtractedData(file: UploadedFile): ExtractedData {
    if (file.category === 'floorplan' || file.category === 'image') {
        return {
            dimensions: {
                width: 20 + Math.floor(Math.random() * 30),
                height: 15 + Math.floor(Math.random() * 25),
                depth: 3 + Math.floor(Math.random() * 5),
                unit: 'm',
            },
            area: 300 + Math.floor(Math.random() * 700),
            zones: [
                { id: 'zone-1', name: '재배구역 A', type: 'growing', area: 100, position: { x: 0, y: 0 }, crops: ['상추', '청경채'] },
                { id: 'zone-2', name: '재배구역 B', type: 'growing', area: 120, position: { x: 10, y: 0 }, crops: ['토마토'] },
                { id: 'zone-3', name: '육묘실', type: 'growing', area: 50, position: { x: 0, y: 10 } },
                { id: 'zone-4', name: '제어실', type: 'control', area: 30, position: { x: 15, y: 10 } },
            ],
            equipment: ['LED 조명', '공조 시스템', 'NFT 베드', '양액 공급기', 'CO2 발생기'],
        };
    }

    if (file.category === 'spreadsheet' || file.category === 'data') {
        return {
            metadata: {
                rows: 1000 + Math.floor(Math.random() * 9000),
                columns: 10 + Math.floor(Math.random() * 20),
                dateRange: '2025-01-01 ~ 2025-12-31',
            },
        };
    }

    return {};
}

function generateRecommendations(file: UploadedFile): Recommendation[] {
    const recommendations: Recommendation[] = [
        {
            type: 'optimization',
            title: 'LED 배치 최적화',
            description: '현재 설계에서 LED 간격을 15% 조정하면 균일도가 20% 향상됩니다.',
            priority: 'high',
            impact: 20,
        },
        {
            type: 'suggestion',
            title: '공조 시스템 추가',
            description: '재배 면적 대비 공조 용량이 부족합니다. 순환팬 2대 추가를 권장합니다.',
            priority: 'medium',
            impact: 15,
        },
        {
            type: 'warning',
            title: '통로 폭 검토',
            description: '구역 B의 통로 폭이 800mm로 수확 로봇 이동에 제한이 있을 수 있습니다.',
            priority: 'medium',
            impact: 10,
        },
        {
            type: 'optimization',
            title: 'IoT 센서 배치',
            description: '센서 커버리지를 최적화하면 모니터링 정확도가 12% 향상됩니다.',
            priority: 'low',
            impact: 12,
        },
    ];

    return recommendations.slice(0, 2 + Math.floor(Math.random() * 3));
}

// 지원 파일 형식
export const SUPPORTED_FILE_TYPES = {
    '설계도/도면': ['.dwg', '.dxf', '.pdf', '.svg'],
    '이미지': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
    '문서': ['.pdf', '.docx', '.doc', '.txt', '.rtf'],
    '데이터': ['.xlsx', '.xls', '.csv', '.json', '.xml'],
    '3D 모델': ['.obj', '.fbx', '.gltf', '.glb', '.stl'],
    '비디오': ['.mp4', '.webm', '.mov'],
};
