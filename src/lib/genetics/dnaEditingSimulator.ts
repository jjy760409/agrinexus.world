// AgriNexus World OS - CRISPR DNA 편집 시뮬레이터
// 세계 최초: 실시간 유전자 편집 및 형질 예측 시스템

// ============================================
// 타입 정의
// ============================================

export interface Gene {
    id: string;
    name: string;
    koreanName: string;
    chromosome: number;
    position: number;             // bp
    length: number;               // bp
    sequence: string;             // ATCG...
    function: string;
    traits: GeneticTrait[];
    variants: GeneVariant[];
    regulatoryRegions: RegulatoryRegion[];
    expression: GeneExpression;
}

export interface GeneticTrait {
    id: string;
    name: string;
    koreanName: string;
    category: TraitCategory;
    description: string;
    heritability: number;         // 0-1
    polygenic: boolean;
    associatedGenes: string[];
    phenotypeRange: { min: number; max: number; unit: string };
    economicImpact: number;       // 1-10
}

export type TraitCategory =
    | 'yield'           // 수확량
    | 'quality'         // 품질
    | 'resistance'      // 저항성
    | 'growth'          // 성장
    | 'nutrition'       // 영양
    | 'stress'          // 스트레스 내성
    | 'appearance'      // 외관
    | 'flavor';         // 맛

export interface GeneVariant {
    id: string;
    type: 'SNP' | 'insertion' | 'deletion' | 'substitution';
    position: number;
    referenceAllele: string;
    alternateAllele: string;
    frequency: number;            // 집단 빈도
    effect: VariantEffect;
    validated: boolean;
}

export interface VariantEffect {
    type: 'beneficial' | 'neutral' | 'deleterious';
    magnitude: number;            // 효과 크기
    traits: string[];             // 영향 받는 형질
    confidence: number;           // 0-1
}

export interface RegulatoryRegion {
    type: 'promoter' | 'enhancer' | 'silencer' | 'insulator';
    position: { start: number; end: number };
    strength: number;             // 0-1
    tissueSpecific: boolean;
    conditions: string[];         // 활성화 조건
}

export interface GeneExpression {
    level: number;                // TPM (Transcripts Per Million)
    tissue: string;
    developmentalStage: string;
    environmentalFactors: { factor: string; effect: number }[];
    circadianRhythm: boolean;
}

// ============================================
// CRISPR 편집 시스템
// ============================================

export interface CRISPREdit {
    id: string;
    targetGene: string;
    guideRNA: string;             // 20bp guide sequence
    pamSequence: string;          // PAM site (NGG for Cas9)
    editType: EditType;
    position: number;
    payload?: string;             // 삽입할 서열
    efficiency: number;           // 예상 효율 0-100%
    offTargets: OffTarget[];
    status: EditStatus;
    timestamp: Date;
}

export type EditType =
    | 'knockout'        // 유전자 비활성화
    | 'knockin'         // 유전자 삽입
    | 'base_edit'       // 단일 염기 교정
    | 'prime_edit'      // 프라임 편집
    | 'activation'      // 유전자 활성화 (CRISPRa)
    | 'repression'      // 유전자 억제 (CRISPRi)
    | 'epigenetic';     // 후성유전 편집

export type EditStatus = 'designed' | 'validated' | 'in_progress' | 'completed' | 'failed';

export interface OffTarget {
    location: { chromosome: number; position: number };
    sequence: string;
    mismatches: number;
    probability: number;          // 0-1
    geneName?: string;
    risk: 'low' | 'medium' | 'high';
}

export interface EditResult {
    success: boolean;
    efficiency: number;
    phenotypeChanges: PhenotypeChange[];
    sideEffects: string[];
    generationsToStabilize: number;
    economicProjection: EconomicProjection;
    regulatoryStatus: RegulatoryStatus;
}

export interface PhenotypeChange {
    trait: string;
    beforeValue: number;
    afterValue: number;
    unit: string;
    improvement: number;          // %
    confidence: number;
}

export interface EconomicProjection {
    yieldIncrease: number;        // %
    qualityPremium: number;       // %
    diseaseReduction: number;     // %
    revenueChange: number;        // 원/m²/년
    roi: number;                  // %
    paybackYears: number;
}

export interface RegulatoryStatus {
    country: string;
    classification: 'GMO' | 'Gene-Edited' | 'Conventional' | 'Pending';
    approvalRequired: boolean;
    estimatedTimeline: number;    // months
    restrictions: string[];
    labeling: string;
}

// ============================================
// 작물 게놈 데이터베이스
// ============================================

export interface CropGenome {
    cropId: string;
    cropName: string;
    koreanName: string;
    scientificName: string;
    chromosomeCount: number;
    genomeSize: number;           // Mb
    genes: Gene[];
    traits: GeneticTrait[];
    editableTargets: EditableTarget[];
    breedingHistory: BreedingEvent[];
}

export interface EditableTarget {
    geneId: string;
    purpose: string;
    difficulty: 'easy' | 'medium' | 'hard';
    expectedOutcome: string;
    prototypeExists: boolean;
    successRate: number;
}

export interface BreedingEvent {
    date: Date;
    type: 'selection' | 'hybridization' | 'mutation' | 'gene_editing';
    description: string;
    traitsModified: string[];
    generation: number;
}

// ============================================
// DNA 편집 시뮬레이터 엔진
// ============================================

export class DNAEditingSimulator {
    private genomes: Map<string, CropGenome> = new Map();
    private activeEdits: Map<string, CRISPREdit> = new Map();
    private editHistory: CRISPREdit[] = [];

    constructor() {
        this.initializeGenomes();
    }

    private initializeGenomes(): void {
        // 딸기 게놈 초기화
        const strawberryGenome: CropGenome = {
            cropId: 'strawberry',
            cropName: 'Strawberry',
            koreanName: '딸기',
            scientificName: 'Fragaria × ananassa',
            chromosomeCount: 28,
            genomeSize: 813.4,
            genes: this.generateStrawberryGenes(),
            traits: this.generateStrawberryTraits(),
            editableTargets: [
                { geneId: 'FaSWEET', purpose: '당도 증가', difficulty: 'medium', expectedOutcome: '당도 20% 증가', prototypeExists: true, successRate: 75 },
                { geneId: 'FaPG', purpose: '경도 유지', difficulty: 'easy', expectedOutcome: '저장성 2배 연장', prototypeExists: true, successRate: 85 },
                { geneId: 'FaMYB', purpose: '안토시아닌 증가', difficulty: 'easy', expectedOutcome: '색상 강화', prototypeExists: true, successRate: 90 },
                { geneId: 'FaMLO', purpose: '흰가루병 저항성', difficulty: 'medium', expectedOutcome: '병해 90% 감소', prototypeExists: false, successRate: 70 },
                { geneId: 'FaGAST', purpose: '과실 크기 증가', difficulty: 'hard', expectedOutcome: '크기 30% 증가', prototypeExists: false, successRate: 55 },
            ],
            breedingHistory: []
        };
        this.genomes.set('strawberry', strawberryGenome);

        // 토마토 게놈
        const tomatoGenome: CropGenome = {
            cropId: 'tomato',
            cropName: 'Tomato',
            koreanName: '토마토',
            scientificName: 'Solanum lycopersicum',
            chromosomeCount: 24,
            genomeSize: 900,
            genes: this.generateTomatoGenes(),
            traits: this.generateTomatoTraits(),
            editableTargets: [
                { geneId: 'SlPSY1', purpose: '라이코펜 증가', difficulty: 'easy', expectedOutcome: '라이코펜 50% 증가', prototypeExists: true, successRate: 88 },
                { geneId: 'SlPL', purpose: '저장성 향상', difficulty: 'medium', expectedOutcome: '숙성 지연', prototypeExists: true, successRate: 80 },
                { geneId: 'SlCLV3', purpose: '과실 크기 조절', difficulty: 'hard', expectedOutcome: '맞춤형 크기', prototypeExists: false, successRate: 60 },
            ],
            breedingHistory: []
        };
        this.genomes.set('tomato', tomatoGenome);

        // 상추 게놈
        const lettuceGenome: CropGenome = {
            cropId: 'lettuce',
            cropName: 'Lettuce',
            koreanName: '상추',
            scientificName: 'Lactuca sativa',
            chromosomeCount: 18,
            genomeSize: 2500,
            genes: this.generateLettuceGenes(),
            traits: this.generateLettuceTraits(),
            editableTargets: [
                { geneId: 'LsGGP', purpose: '비타민C 증가', difficulty: 'medium', expectedOutcome: '비타민C 3배', prototypeExists: true, successRate: 75 },
                { geneId: 'LsDMR1', purpose: '노균병 저항성', difficulty: 'easy', expectedOutcome: '완전 저항성', prototypeExists: true, successRate: 92 },
                { geneId: 'LsFT', purpose: '추대 지연', difficulty: 'medium', expectedOutcome: '수확기간 연장', prototypeExists: false, successRate: 68 },
            ],
            breedingHistory: []
        };
        this.genomes.set('lettuce', lettuceGenome);
    }

    private generateStrawberryGenes(): Gene[] {
        return [
            {
                id: 'FaSWEET',
                name: 'Sugar Will Eventually be Exported Transporter',
                koreanName: '당 수송체',
                chromosome: 6,
                position: 12500000,
                length: 3200,
                sequence: 'ATGCGATCGATCGATCG...',
                function: '과실의 당 축적 조절',
                traits: [],
                variants: [
                    { id: 'v1', type: 'SNP', position: 1250, referenceAllele: 'G', alternateAllele: 'A', frequency: 0.15, effect: { type: 'beneficial', magnitude: 0.3, traits: ['sweetness'], confidence: 0.85 }, validated: true }
                ],
                regulatoryRegions: [
                    { type: 'promoter', position: { start: -500, end: 0 }, strength: 0.8, tissueSpecific: true, conditions: ['fruit_development'] }
                ],
                expression: { level: 850, tissue: 'fruit', developmentalStage: 'ripening', environmentalFactors: [{ factor: 'light', effect: 0.3 }], circadianRhythm: false }
            },
            {
                id: 'FaPG',
                name: 'Polygalacturonase',
                koreanName: '폴리갈락투로나제',
                chromosome: 2,
                position: 8500000,
                length: 2800,
                sequence: 'ATGCTAGCTAGCTAGCT...',
                function: '세포벽 분해 효소, 과실 연화',
                traits: [],
                variants: [],
                regulatoryRegions: [],
                expression: { level: 1200, tissue: 'fruit', developmentalStage: 'ripening', environmentalFactors: [], circadianRhythm: false }
            },
            {
                id: 'FaMYB',
                name: 'MYB Transcription Factor',
                koreanName: 'MYB 전사인자',
                chromosome: 1,
                position: 5200000,
                length: 2100,
                sequence: 'ATGGTCAGTCAGTCAGT...',
                function: '안토시아닌 생합성 조절',
                traits: [],
                variants: [],
                regulatoryRegions: [],
                expression: { level: 650, tissue: 'fruit', developmentalStage: 'coloring', environmentalFactors: [{ factor: 'temperature', effect: -0.2 }], circadianRhythm: true }
            },
            {
                id: 'FaMLO',
                name: 'Mildew Resistance Locus O',
                koreanName: '흰가루병 감수성 유전자',
                chromosome: 4,
                position: 15800000,
                length: 4500,
                sequence: 'ATGCCAGTCCAGTCCAG...',
                function: '흰가루병균 침입 허용',
                traits: [],
                variants: [],
                regulatoryRegions: [],
                expression: { level: 320, tissue: 'leaf', developmentalStage: 'vegetative', environmentalFactors: [{ factor: 'humidity', effect: 0.4 }], circadianRhythm: false }
            },
            {
                id: 'FaGAST',
                name: 'Gibberellin-Stimulated Transcript',
                koreanName: '지베렐린 자극 전사체',
                chromosome: 7,
                position: 9200000,
                length: 1800,
                sequence: 'ATGAAGAAGAAGAAGAA...',
                function: '과실 크기 및 발달 조절',
                traits: [],
                variants: [],
                regulatoryRegions: [],
                expression: { level: 480, tissue: 'fruit', developmentalStage: 'expansion', environmentalFactors: [{ factor: 'gibberellin', effect: 0.8 }], circadianRhythm: false }
            }
        ];
    }

    private generateStrawberryTraits(): GeneticTrait[] {
        return [
            { id: 't1', name: 'Sweetness', koreanName: '당도', category: 'quality', description: '과실의 당 함량 (Brix)', heritability: 0.65, polygenic: true, associatedGenes: ['FaSWEET', 'FaSPS'], phenotypeRange: { min: 6, max: 16, unit: 'Brix' }, economicImpact: 9 },
            { id: 't2', name: 'Firmness', koreanName: '경도', category: 'quality', description: '과실의 단단함', heritability: 0.55, polygenic: true, associatedGenes: ['FaPG', 'FaPL'], phenotypeRange: { min: 0.5, max: 2.5, unit: 'N' }, economicImpact: 8 },
            { id: 't3', name: 'Color Intensity', koreanName: '색상 강도', category: 'appearance', description: '안토시아닌 함량', heritability: 0.70, polygenic: false, associatedGenes: ['FaMYB', 'FaANS'], phenotypeRange: { min: 20, max: 100, unit: 'mg/100g' }, economicImpact: 7 },
            { id: 't4', name: 'Disease Resistance', koreanName: '병 저항성', category: 'resistance', description: '주요 병해 저항성', heritability: 0.45, polygenic: true, associatedGenes: ['FaMLO', 'FaRPW8'], phenotypeRange: { min: 0, max: 100, unit: '%' }, economicImpact: 8 },
            { id: 't5', name: 'Fruit Size', koreanName: '과실 크기', category: 'yield', description: '평균 과실 무게', heritability: 0.50, polygenic: true, associatedGenes: ['FaGAST', 'FaCYP'], phenotypeRange: { min: 10, max: 50, unit: 'g' }, economicImpact: 7 },
        ];
    }

    private generateTomatoGenes(): Gene[] {
        return [
            { id: 'SlPSY1', name: 'Phytoene Synthase 1', koreanName: '피토엔 합성효소', chromosome: 3, position: 4200000, length: 2900, sequence: 'ATGCGATCG...', function: '카로티노이드 생합성', traits: [], variants: [], regulatoryRegions: [], expression: { level: 750, tissue: 'fruit', developmentalStage: 'ripening', environmentalFactors: [], circadianRhythm: false } },
            { id: 'SlPL', name: 'Pectate Lyase', koreanName: '펙테이트 리아제', chromosome: 5, position: 8900000, length: 3100, sequence: 'ATGGTCAGT...', function: '과실 연화', traits: [], variants: [], regulatoryRegions: [], expression: { level: 920, tissue: 'fruit', developmentalStage: 'ripening', environmentalFactors: [], circadianRhythm: false } },
            { id: 'SlCLV3', name: 'CLAVATA3', koreanName: '클라바타3', chromosome: 11, position: 1200000, length: 420, sequence: 'ATGAAGCAG...', function: '분열조직 크기 조절', traits: [], variants: [], regulatoryRegions: [], expression: { level: 280, tissue: 'meristem', developmentalStage: 'all', environmentalFactors: [], circadianRhythm: false } }
        ];
    }

    private generateTomatoTraits(): GeneticTrait[] {
        return [
            { id: 'tt1', name: 'Lycopene Content', koreanName: '라이코펜 함량', category: 'nutrition', description: '항산화 성분', heritability: 0.72, polygenic: false, associatedGenes: ['SlPSY1'], phenotypeRange: { min: 10, max: 50, unit: 'mg/100g' }, economicImpact: 8 },
            { id: 'tt2', name: 'Shelf Life', koreanName: '저장성', category: 'quality', description: '수확 후 저장기간', heritability: 0.60, polygenic: true, associatedGenes: ['SlPL', 'SlACS'], phenotypeRange: { min: 7, max: 45, unit: 'days' }, economicImpact: 9 },
        ];
    }

    private generateLettuceGenes(): Gene[] {
        return [
            { id: 'LsGGP', name: 'GDP-L-galactose phosphorylase', koreanName: 'GDP-L-갈락토스 인산화효소', chromosome: 5, position: 12500000, length: 3800, sequence: 'ATGCGATCG...', function: '비타민C 생합성', traits: [], variants: [], regulatoryRegions: [], expression: { level: 520, tissue: 'leaf', developmentalStage: 'vegetative', environmentalFactors: [{ factor: 'light', effect: 0.5 }], circadianRhythm: true } },
            { id: 'LsDMR1', name: 'Downy Mildew Resistance 1', koreanName: '노균병 감수성 유전자', chromosome: 3, position: 8200000, length: 2100, sequence: 'ATGGTCAGT...', function: '노균병 감수성', traits: [], variants: [], regulatoryRegions: [], expression: { level: 180, tissue: 'leaf', developmentalStage: 'all', environmentalFactors: [], circadianRhythm: false } },
            { id: 'LsFT', name: 'FLOWERING LOCUS T', koreanName: '개화 유전자', chromosome: 7, position: 15800000, length: 1200, sequence: 'ATGAAGAAG...', function: '개화 시기 조절', traits: [], variants: [], regulatoryRegions: [], expression: { level: 95, tissue: 'leaf', developmentalStage: 'reproductive', environmentalFactors: [{ factor: 'daylength', effect: 0.9 }], circadianRhythm: true } }
        ];
    }

    private generateLettuceTraits(): GeneticTrait[] {
        return [
            { id: 'lt1', name: 'Vitamin C', koreanName: '비타민C', category: 'nutrition', description: '아스코르브산 함량', heritability: 0.55, polygenic: true, associatedGenes: ['LsGGP'], phenotypeRange: { min: 5, max: 50, unit: 'mg/100g' }, economicImpact: 7 },
            { id: 'lt2', name: 'Bolting Resistance', koreanName: '추대 저항성', category: 'growth', description: '추대 지연 능력', heritability: 0.68, polygenic: false, associatedGenes: ['LsFT'], phenotypeRange: { min: 20, max: 90, unit: 'days' }, economicImpact: 9 },
        ];
    }

    // CRISPR 편집 설계
    designEdit(cropId: string, geneId: string, editType: EditType, payload?: string): CRISPREdit {
        const genome = this.genomes.get(cropId);
        if (!genome) throw new Error('Crop genome not found');

        const gene = genome.genes.find(g => g.id === geneId);
        if (!gene) throw new Error('Gene not found');

        // 최적 가이드 RNA 설계
        const guideRNA = this.designGuideRNA(gene, editType);
        const offTargets = this.predictOffTargets(guideRNA, genome);
        const efficiency = this.predictEfficiency(guideRNA, editType, offTargets);

        const edit: CRISPREdit = {
            id: `edit-${Date.now()}`,
            targetGene: geneId,
            guideRNA,
            pamSequence: 'NGG',
            editType,
            position: gene.position + Math.floor(gene.length / 2),
            payload,
            efficiency,
            offTargets,
            status: 'designed',
            timestamp: new Date()
        };

        this.activeEdits.set(edit.id, edit);
        return edit;
    }

    private designGuideRNA(gene: Gene, editType: EditType): string {
        // 20bp 가이드 RNA 시뮬레이션
        const bases = ['A', 'T', 'C', 'G'];
        let guide = '';
        for (let i = 0; i < 20; i++) {
            guide += bases[Math.floor(Math.random() * 4)];
        }
        return guide;
    }

    private predictOffTargets(guideRNA: string, genome: CropGenome): OffTarget[] {
        const offTargets: OffTarget[] = [];
        const numOffTargets = Math.floor(Math.random() * 5);

        for (let i = 0; i < numOffTargets; i++) {
            const mismatches = Math.floor(Math.random() * 4) + 1;
            offTargets.push({
                location: {
                    chromosome: Math.floor(Math.random() * genome.chromosomeCount) + 1,
                    position: Math.floor(Math.random() * 10000000)
                },
                sequence: guideRNA.slice(0, 20 - mismatches) + 'N'.repeat(mismatches),
                mismatches,
                probability: Math.max(0.001, 0.1 / Math.pow(2, mismatches)),
                risk: mismatches <= 2 ? 'high' : mismatches === 3 ? 'medium' : 'low'
            });
        }

        return offTargets.sort((a, b) => b.probability - a.probability);
    }

    private predictEfficiency(guideRNA: string, editType: EditType, offTargets: OffTarget[]): number {
        let baseEfficiency = 70;

        // 편집 유형에 따른 효율
        switch (editType) {
            case 'knockout': baseEfficiency += 15; break;
            case 'base_edit': baseEfficiency += 10; break;
            case 'knockin': baseEfficiency -= 20; break;
            case 'prime_edit': baseEfficiency -= 25; break;
        }

        // GC 함량 영향
        const gcContent = (guideRNA.match(/[GC]/g) || []).length / 20;
        if (gcContent >= 0.4 && gcContent <= 0.6) baseEfficiency += 10;

        // 오프타겟 고려
        const highRiskCount = offTargets.filter(ot => ot.risk === 'high').length;
        baseEfficiency -= highRiskCount * 5;

        return Math.max(10, Math.min(98, baseEfficiency + (Math.random() - 0.5) * 10));
    }

    // 편집 실행 시뮬레이션
    executeEdit(editId: string): EditResult {
        const edit = this.activeEdits.get(editId);
        if (!edit) throw new Error('Edit not found');

        edit.status = 'in_progress';

        // 시뮬레이션 결과
        const success = Math.random() < (edit.efficiency / 100);
        const actualEfficiency = success
            ? edit.efficiency + (Math.random() - 0.5) * 20
            : edit.efficiency * 0.3;

        const phenotypeChanges = this.simulatePhenotypeChanges(edit);
        const sideEffects = this.predictSideEffects(edit);
        const economicProjection = this.calculateEconomicImpact(phenotypeChanges);
        const regulatoryStatus = this.assessRegulatoryStatus(edit);

        edit.status = success ? 'completed' : 'failed';
        this.editHistory.push(edit);

        return {
            success,
            efficiency: actualEfficiency,
            phenotypeChanges,
            sideEffects,
            generationsToStabilize: Math.floor(Math.random() * 3) + 2,
            economicProjection,
            regulatoryStatus
        };
    }

    private simulatePhenotypeChanges(edit: CRISPREdit): PhenotypeChange[] {
        const changes: PhenotypeChange[] = [];

        // 편집 대상에 따른 형질 변화
        switch (edit.targetGene) {
            case 'FaSWEET':
                changes.push({
                    trait: '당도',
                    beforeValue: 10,
                    afterValue: 12,
                    unit: 'Brix',
                    improvement: 20,
                    confidence: 0.85
                });
                break;
            case 'FaPG':
                changes.push({
                    trait: '저장성',
                    beforeValue: 5,
                    afterValue: 12,
                    unit: 'days',
                    improvement: 140,
                    confidence: 0.90
                });
                break;
            case 'FaMLO':
                changes.push({
                    trait: '흰가루병 저항성',
                    beforeValue: 30,
                    afterValue: 95,
                    unit: '%',
                    improvement: 217,
                    confidence: 0.75
                });
                break;
        }

        return changes;
    }

    private predictSideEffects(edit: CRISPREdit): string[] {
        const effects: string[] = [];

        if (edit.offTargets.some(ot => ot.risk === 'high')) {
            effects.push('잠재적 오프타겟 효과 모니터링 필요');
        }

        if (edit.editType === 'knockout') {
            effects.push('유전자 기능 완전 상실로 인한 다면발현 효과 가능');
        }

        if (edit.efficiency < 50) {
            effects.push('낮은 효율로 모자이크 식물체 발생 가능');
        }

        return effects;
    }

    private calculateEconomicImpact(changes: PhenotypeChange[]): EconomicProjection {
        let yieldIncrease = 0;
        let qualityPremium = 0;
        let diseaseReduction = 0;

        for (const change of changes) {
            if (change.trait.includes('수확') || change.trait.includes('크기')) {
                yieldIncrease += change.improvement * 0.5;
            }
            if (change.trait.includes('당도') || change.trait.includes('품질')) {
                qualityPremium += change.improvement * 0.3;
            }
            if (change.trait.includes('저항') || change.trait.includes('병')) {
                diseaseReduction += change.improvement * 0.4;
            }
        }

        const revenueChange = (yieldIncrease * 2000) + (qualityPremium * 1500) + (diseaseReduction * 1000);

        return {
            yieldIncrease: Math.min(50, yieldIncrease),
            qualityPremium: Math.min(40, qualityPremium),
            diseaseReduction: Math.min(90, diseaseReduction),
            revenueChange,
            roi: revenueChange / 50000 * 100,
            paybackYears: revenueChange > 0 ? 50000 / revenueChange : Infinity
        };
    }

    private assessRegulatoryStatus(edit: CRISPREdit): RegulatoryStatus {
        return {
            country: 'Korea',
            classification: edit.editType === 'knockin' ? 'GMO' : 'Gene-Edited',
            approvalRequired: edit.editType === 'knockin',
            estimatedTimeline: edit.editType === 'knockin' ? 36 : 6,
            restrictions: edit.editType === 'knockin'
                ? ['격리 재배 필수', '환경영향평가 필요', 'LMO 표시 의무']
                : ['일반 재배 가능', '자발적 표시 권장'],
            labeling: edit.editType === 'knockin' ? 'GMO 표시 의무' : '비표시 가능'
        };
    }

    // 게놈 조회
    getGenome(cropId: string): CropGenome | undefined {
        return this.genomes.get(cropId);
    }

    // 모든 게놈 조회
    getAllGenomes(): CropGenome[] {
        return Array.from(this.genomes.values());
    }

    // 편집 이력 조회
    getEditHistory(): CRISPREdit[] {
        return this.editHistory;
    }

    // 형질 개선 시뮬레이션
    simulateBreedingProgram(cropId: string, targetTraits: string[], generations: number): BreedingSimulation {
        const genome = this.genomes.get(cropId);
        if (!genome) throw new Error('Genome not found');

        const simulation: BreedingSimulation = {
            cropId,
            targetTraits,
            generations,
            timeline: [],
            finalOutcome: {
                traitsAchieved: [],
                improvementPercentage: 0,
                timeYears: generations * 0.5,
                successProbability: 0.85
            }
        };

        for (let gen = 1; gen <= generations; gen++) {
            simulation.timeline.push({
                generation: gen,
                traitsStatus: targetTraits.map(t => ({
                    trait: t,
                    progress: Math.min(100, gen / generations * 100 + Math.random() * 20),
                    stable: gen >= 3
                })),
                plantCount: 100 * Math.pow(0.6, gen),
                selectionPressure: 0.4 + gen * 0.1
            });
        }

        simulation.finalOutcome.traitsAchieved = targetTraits;
        simulation.finalOutcome.improvementPercentage = 60 + Math.random() * 30;

        return simulation;
    }
}

export interface BreedingSimulation {
    cropId: string;
    targetTraits: string[];
    generations: number;
    timeline: GenerationData[];
    finalOutcome: {
        traitsAchieved: string[];
        improvementPercentage: number;
        timeYears: number;
        successProbability: number;
    };
}

export interface GenerationData {
    generation: number;
    traitsStatus: { trait: string; progress: number; stable: boolean }[];
    plantCount: number;
    selectionPressure: number;
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let dnaSimulator: DNAEditingSimulator | null = null;

export function getDNAEditingSimulator(): DNAEditingSimulator {
    if (!dnaSimulator) {
        dnaSimulator = new DNAEditingSimulator();
    }
    return dnaSimulator;
}

// 편집 타입 아이콘
export const EDIT_TYPE_ICONS: Record<EditType, string> = {
    knockout: '🔴',
    knockin: '🟢',
    base_edit: '🔵',
    prime_edit: '🟣',
    activation: '⬆️',
    repression: '⬇️',
    epigenetic: '🧬'
};

// 형질 카테고리 아이콘
export const TRAIT_CATEGORY_ICONS: Record<TraitCategory, string> = {
    yield: '📈',
    quality: '⭐',
    resistance: '🛡️',
    growth: '🌱',
    nutrition: '🥗',
    stress: '💪',
    appearance: '🎨',
    flavor: '👅'
};
