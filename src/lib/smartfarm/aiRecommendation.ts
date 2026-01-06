// AgriNexus World OS - AI 기반 스마트팜 추천 엔진
// 최적 작물, 설비, 재배 전략 추천

import { CROP_DATABASE, CropData, getCropById, compareCrops, calculateProjectedRevenue } from './cropDatabase';
import { EQUIPMENT_DATABASE, SmartFarmEquipment, getEssentialEquipment, calculateTotalSetupCost } from './equipmentDatabase';

// ============================================
// 타입 정의
// ============================================

export interface FarmProfile {
    location: {
        country: string;
        region: string;
        climate: 'tropical' | 'subtropical' | 'temperate' | 'continental' | 'polar';
        latitude: number;
        longitude: number;
    };
    facility: {
        type: 'vertical' | 'greenhouse' | 'container' | 'indoor' | 'rooftop' | 'underground' | 'hybrid';
        area: number;           // m²
        height: number;         // m
        floors?: number;
        existingEquipment: string[];
    };
    budget: {
        initial: number;        // 초기 투자
        monthly: number;        // 월 운영비
        targetROI: number;      // 목표 ROI %
        paybackMonths: number;  // 희망 회수기간
    };
    experience: 'beginner' | 'intermediate' | 'expert';
    goals: ('profit' | 'sustainability' | 'research' | 'education' | 'community')[];
    preferences: {
        cropTypes: string[];
        automationLevel: 'low' | 'medium' | 'high' | 'full';
        organicCertification: boolean;
        exportFocus: boolean;
    };
    constraints: {
        laborAvailable: number;     // 인원
        electricityLimit?: number;  // kW
        waterLimit?: number;        // L/day
        noiseLimit?: boolean;
    };
}

export interface CropRecommendation {
    crop: CropData;
    score: number;
    ranking: number;
    reasons: {
        category: string;
        description: string;
        score: number;
    }[];
    projectedOutcome: {
        revenue: number;
        profit: number;
        roi: number;
        paybackMonths: number;
    };
    risks: string[];
    suggestions: string[];
}

export interface EquipmentRecommendation {
    equipment: SmartFarmEquipment;
    priority: 'essential' | 'recommended' | 'optional';
    reason: string;
    alternativeIds?: string[];
}

export interface CultivationPlan {
    id: string;
    name: string;
    crops: {
        cropId: string;
        areaAllocation: number;     // %
        startDate: Date;
        harvestDate: Date;
        expectedYield: number;
    }[];
    equipment: EquipmentRecommendation[];
    schedule: ScheduleItem[];
    financials: {
        totalInvestment: number;
        monthlyOperating: number;
        projectedAnnualRevenue: number;
        projectedAnnualProfit: number;
        roi: number;
        paybackMonths: number;
    };
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        factors: { name: string; severity: number; mitigation: string }[];
    };
}

export interface ScheduleItem {
    id: string;
    type: 'planting' | 'transplant' | 'maintenance' | 'harvest' | 'equipment' | 'inspection';
    title: string;
    description: string;
    cropId?: string;
    startDate: Date;
    endDate: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
    automated: boolean;
    dependencies?: string[];
    resources: string[];
}

// ============================================
// AI 추천 엔진
// ============================================

export class AIRecommendationEngine {
    private profile: FarmProfile;

    constructor(profile: FarmProfile) {
        this.profile = profile;
    }

    // 작물 추천
    recommendCrops(topN: number = 5): CropRecommendation[] {
        const recommendations: CropRecommendation[] = [];

        for (const crop of CROP_DATABASE) {
            const scores = this.calculateCropScores(crop);
            const totalScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

            const projection = calculateProjectedRevenue(crop.id, this.profile.facility.area, 12);

            recommendations.push({
                crop,
                score: totalScore,
                ranking: 0,
                reasons: scores,
                projectedOutcome: {
                    revenue: projection.projectedRevenue,
                    profit: projection.projectedProfit,
                    roi: crop.economics.roi,
                    paybackMonths: crop.economics.paybackMonths
                },
                risks: this.identifyCropRisks(crop),
                suggestions: this.generateCropSuggestions(crop)
            });
        }

        // 순위 정렬
        recommendations.sort((a, b) => b.score - a.score);
        recommendations.forEach((r, i) => r.ranking = i + 1);

        return recommendations.slice(0, topN);
    }

    private calculateCropScores(crop: CropData): { category: string; description: string; score: number }[] {
        const scores: { category: string; description: string; score: number }[] = [];

        // 1. 경제성 점수 (30%)
        const economicScore = this.calculateEconomicScore(crop);
        scores.push({
            category: '경제성',
            description: `ROI ${crop.economics.roi}%, 이익률 ${crop.economics.profitMargin}%`,
            score: economicScore
        });

        // 2. 난이도 적합성 (20%)
        const difficultyScore = this.calculateDifficultyScore(crop);
        scores.push({
            category: '난이도 적합성',
            description: `${crop.cultivation.difficulty} 난이도, 경험: ${this.profile.experience}`,
            score: difficultyScore
        });

        // 3. 시장 적합성 (20%)
        const marketScore = this.calculateMarketScore(crop);
        scores.push({
            category: '시장 적합성',
            description: `수요 ${crop.market.demandTrend}, 안정성 ${crop.economics.marketStability}`,
            score: marketScore
        });

        // 4. 시설 적합성 (15%)
        const facilityScore = this.calculateFacilityScore(crop);
        scores.push({
            category: '시설 적합성',
            description: `${this.profile.facility.type} 시설에 최적화`,
            score: facilityScore
        });

        // 5. 목표 부합성 (15%)
        const goalScore = this.calculateGoalScore(crop);
        scores.push({
            category: '목표 부합성',
            description: `사용자 목표와의 일치도`,
            score: goalScore
        });

        return scores;
    }

    private calculateEconomicScore(crop: CropData): number {
        let score = 50;

        // ROI 점수
        if (crop.economics.roi >= this.profile.budget.targetROI) {
            score += 25;
        } else {
            score += (crop.economics.roi / this.profile.budget.targetROI) * 25;
        }

        // 회수기간 점수
        if (crop.economics.paybackMonths <= this.profile.budget.paybackMonths) {
            score += 25;
        } else {
            score += Math.max(0, 25 - (crop.economics.paybackMonths - this.profile.budget.paybackMonths) * 2);
        }

        return Math.min(100, score);
    }

    private calculateDifficultyScore(crop: CropData): number {
        const difficultyMap: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
        const experienceMap: Record<string, number> = { beginner: 1, intermediate: 2, expert: 3 };

        const cropDiff = difficultyMap[crop.cultivation.difficulty] || 2;
        const userExp = experienceMap[this.profile.experience] || 2;

        if (userExp >= cropDiff) {
            return 100;
        } else if (userExp === cropDiff - 1) {
            return 70;
        } else {
            return 40;
        }
    }

    private calculateMarketScore(crop: CropData): number {
        let score = 50;

        // 수요 트렌드
        if (crop.market.demandTrend === 'rising') score += 30;
        else if (crop.market.demandTrend === 'stable') score += 20;
        else score += 5;

        // 시장 안정성
        if (crop.economics.marketStability === 'stable') score += 20;
        else if (crop.economics.marketStability === 'seasonal') score += 10;

        return Math.min(100, score);
    }

    private calculateFacilityScore(crop: CropData): number {
        let score = 60;

        // 수직농장에 적합한 작물
        if (this.profile.facility.type === 'vertical') {
            if (crop.category === 'leafy' || crop.category === 'herb') {
                score += 30;
            } else if (crop.category === 'berry') {
                score += 20;
            }
        } else if (this.profile.facility.type === 'greenhouse') {
            if (crop.category === 'fruit' || crop.category === 'berry') {
                score += 30;
            }
        }

        // 면적 적합성
        const requiredArea = crop.cultivation.spacing.plant * crop.cultivation.spacing.row / 10000;
        if (this.profile.facility.area >= requiredArea * 100) {
            score += 10;
        }

        return Math.min(100, score);
    }

    private calculateGoalScore(crop: CropData): number {
        let score = 50;

        if (this.profile.goals.includes('profit')) {
            if (crop.economics.roi > 30) score += 20;
            else if (crop.economics.roi > 15) score += 10;
        }

        if (this.profile.goals.includes('sustainability')) {
            if (crop.economics.riskLevel === 'low') score += 15;
        }

        if (this.profile.preferences.organicCertification && crop.market.certifications.includes('유기농')) {
            score += 15;
        }

        if (this.profile.preferences.exportFocus && crop.market.exportPotential) {
            score += 20;
        }

        return Math.min(100, score);
    }

    private identifyCropRisks(crop: CropData): string[] {
        const risks: string[] = [];

        if (crop.cultivation.difficulty === 'hard' && this.profile.experience === 'beginner') {
            risks.push('높은 재배 난이도로 인한 실패 위험');
        }

        if (crop.economics.riskLevel === 'high') {
            risks.push('시장 변동성이 높음');
        }

        if (crop.pests.length > 2) {
            risks.push('다양한 해충 관리 필요');
        }

        if (crop.diseases.length > 2) {
            risks.push('병해 관리에 주의 필요');
        }

        return risks;
    }

    private generateCropSuggestions(crop: CropData): string[] {
        const suggestions: string[] = [];

        if (crop.cultivation.difficulty === 'hard') {
            suggestions.push('전문가 컨설팅을 통한 초기 설정 권장');
        }

        if (crop.economics.roi > 50) {
            suggestions.push('높은 ROI를 위해 프리미엄 유통채널 확보 추천');
        }

        if (crop.market.exportPotential) {
            suggestions.push('수출용 인증 획득 검토');
        }

        suggestions.push(`최적 재배 온도: ${crop.cultivation.temperature.optimal}°C 유지`);

        return suggestions;
    }

    // 설비 추천
    recommendEquipment(): EquipmentRecommendation[] {
        const recommendations: EquipmentRecommendation[] = [];
        const essential = getEssentialEquipment();

        for (const eq of essential) {
            let priority: 'essential' | 'recommended' | 'optional' = 'essential';
            let reason = '스마트팜 운영의 핵심 설비입니다.';

            if (eq.priority === 'critical') {
                priority = 'essential';
                reason = '필수 설비 - 없으면 운영이 불가능합니다.';
            } else if (eq.priority === 'high') {
                priority = 'recommended';
                reason = '강력 권장 - 생산성을 크게 향상시킵니다.';
            } else {
                priority = 'optional';
                reason = '선택 사항 - 효율성을 추가로 개선합니다.';
            }

            // 자동화 수준에 따른 조정
            if (this.profile.preferences.automationLevel === 'full') {
                if (eq.category === 'robotics') {
                    priority = 'recommended';
                    reason = '전자동화를 위해 로봇 시스템 권장';
                }
            }

            recommendations.push({ equipment: eq, priority, reason });
        }

        // 예산에 맞는 필터링
        const sortedRecs = recommendations.sort((a, b) => {
            const priorityOrder = { essential: 0, recommended: 1, optional: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        return sortedRecs;
    }

    // 재배 계획 생성
    generateCultivationPlan(selectedCropIds: string[]): CultivationPlan {
        const crops = selectedCropIds.map(id => getCropById(id)).filter(Boolean) as CropData[];
        const equipment = this.recommendEquipment();

        // 면적 배분
        const areaPerCrop = 100 / crops.length;
        const now = new Date();

        const cropPlan = crops.map(crop => {
            const startDate = new Date(now);
            const harvestDate = new Date(now);
            harvestDate.setDate(harvestDate.getDate() + crop.cultivation.harvestDays);

            const areaM2 = (this.profile.facility.area * areaPerCrop) / 100;
            const expectedYield = crop.economics.yieldPerM2.avg * areaM2;

            return {
                cropId: crop.id,
                areaAllocation: areaPerCrop,
                startDate,
                harvestDate,
                expectedYield
            };
        });

        // 스케줄 생성
        const schedule = this.generateSchedule(crops);

        // 재무 분석
        const equipmentCost = calculateTotalSetupCost(equipment.filter(e => e.priority !== 'optional').map(e => e.equipment.id));

        let totalRevenue = 0;
        let totalProfit = 0;

        for (const crop of crops) {
            const projection = calculateProjectedRevenue(crop.id, this.profile.facility.area * areaPerCrop / 100, 12);
            totalRevenue += projection.projectedRevenue;
            totalProfit += projection.projectedProfit;
        }

        const totalInvestment = equipmentCost.totalPurchase + equipmentCost.totalInstallation;
        const monthlyOperating = equipmentCost.annualOperating / 12;

        return {
            id: `plan-${Date.now()}`,
            name: `최적화 재배 계획 - ${crops.map(c => c.koreanName).join(', ')}`,
            crops: cropPlan,
            equipment,
            schedule,
            financials: {
                totalInvestment,
                monthlyOperating,
                projectedAnnualRevenue: totalRevenue,
                projectedAnnualProfit: totalProfit,
                roi: (totalProfit / totalInvestment) * 100,
                paybackMonths: Math.ceil(totalInvestment / (totalProfit / 12))
            },
            riskAssessment: this.assessRisks(crops)
        };
    }

    private generateSchedule(crops: CropData[]): ScheduleItem[] {
        const schedule: ScheduleItem[] = [];
        const now = new Date();

        for (const crop of crops) {
            let currentDay = 0;

            // 파종
            schedule.push({
                id: `${crop.id}-seeding`,
                type: 'planting',
                title: `${crop.koreanName} 파종`,
                description: `${crop.koreanName} 종자 파종 및 발아 관리`,
                cropId: crop.id,
                startDate: new Date(now.getTime() + currentDay * 86400000),
                endDate: new Date(now.getTime() + (currentDay + crop.cultivation.germinationDays) * 86400000),
                priority: 'critical',
                automated: false,
                resources: ['종자', '배지', '파종기']
            });
            currentDay += crop.cultivation.germinationDays;

            // 이식
            schedule.push({
                id: `${crop.id}-transplant`,
                type: 'transplant',
                title: `${crop.koreanName} 정식`,
                description: `육묘 완료 후 본 재배 베드로 이식`,
                cropId: crop.id,
                startDate: new Date(now.getTime() + currentDay * 86400000),
                endDate: new Date(now.getTime() + (currentDay + 3) * 86400000),
                priority: 'high',
                automated: false,
                dependencies: [`${crop.id}-seeding`],
                resources: ['이식기', '베드']
            });
            currentDay += crop.cultivation.transplantDays;

            // 성장단계별 관리
            for (const stage of crop.growthStages) {
                if (stage.stage > 2) {
                    schedule.push({
                        id: `${crop.id}-stage-${stage.stage}`,
                        type: 'maintenance',
                        title: `${crop.koreanName} ${stage.koreanName}`,
                        description: stage.description,
                        cropId: crop.id,
                        startDate: new Date(now.getTime() + stage.daysFromStart * 86400000),
                        endDate: new Date(now.getTime() + (stage.daysFromStart + stage.duration) * 86400000),
                        priority: 'medium',
                        automated: true,
                        resources: stage.actions
                    });
                }
            }

            // 수확
            schedule.push({
                id: `${crop.id}-harvest`,
                type: 'harvest',
                title: `${crop.koreanName} 수확`,
                description: `${crop.harvest.timing}에 ${crop.harvest.method} 방식으로 수확`,
                cropId: crop.id,
                startDate: new Date(now.getTime() + crop.cultivation.harvestDays * 86400000),
                endDate: new Date(now.getTime() + (crop.cultivation.harvestDays + 7) * 86400000),
                priority: 'critical',
                automated: crop.harvest.method === 'full-auto',
                resources: ['수확 장비', '포장재']
            });
        }

        // 정기 점검 일정
        for (let week = 1; week <= 12; week++) {
            schedule.push({
                id: `inspection-week-${week}`,
                type: 'inspection',
                title: `주간 시설 점검 #${week}`,
                description: '환경 센서, 양액 시스템, 조명 점검',
                startDate: new Date(now.getTime() + (week * 7) * 86400000),
                endDate: new Date(now.getTime() + (week * 7 + 1) * 86400000),
                priority: 'medium',
                automated: false,
                resources: ['점검 체크리스트']
            });
        }

        return schedule.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    private assessRisks(crops: CropData[]): { level: 'low' | 'medium' | 'high'; factors: { name: string; severity: number; mitigation: string }[] } {
        const factors: { name: string; severity: number; mitigation: string }[] = [];

        // 경험 리스크
        const hardCrops = crops.filter(c => c.cultivation.difficulty === 'hard');
        if (hardCrops.length > 0 && this.profile.experience === 'beginner') {
            factors.push({
                name: '경험 부족',
                severity: 8,
                mitigation: '전문가 컨설팅 및 교육 프로그램 참여 권장'
            });
        }

        // 시장 리스크
        const volatileCrops = crops.filter(c => c.economics.marketStability === 'volatile');
        if (volatileCrops.length > 0) {
            factors.push({
                name: '시장 변동성',
                severity: 6,
                mitigation: '다각화된 판매 채널 확보 및 계약 재배 고려'
            });
        }

        // 기술 리스크
        if (this.profile.preferences.automationLevel === 'full') {
            factors.push({
                name: '기술 의존성',
                severity: 5,
                mitigation: '백업 시스템 구축 및 정기 점검 필수'
            });
        }

        const avgSeverity = factors.length > 0 ? factors.reduce((sum, f) => sum + f.severity, 0) / factors.length : 0;
        const level: 'low' | 'medium' | 'high' = avgSeverity > 6 ? 'high' : avgSeverity > 3 ? 'medium' : 'low';

        return { level, factors };
    }
}

// ============================================
// AI 분석 함수
// ============================================

export function analyzeOptimalCrop(profile: FarmProfile): CropRecommendation[] {
    const engine = new AIRecommendationEngine(profile);
    return engine.recommendCrops(5);
}

export function generateSmartPlan(profile: FarmProfile, cropIds: string[]): CultivationPlan {
    const engine = new AIRecommendationEngine(profile);
    return engine.generateCultivationPlan(cropIds);
}

export function getEquipmentRecommendation(profile: FarmProfile): EquipmentRecommendation[] {
    const engine = new AIRecommendationEngine(profile);
    return engine.recommendEquipment();
}

// 기본 프로필 템플릿
export const DEFAULT_FARM_PROFILE: FarmProfile = {
    location: {
        country: 'Korea',
        region: 'Seoul',
        climate: 'temperate',
        latitude: 37.5665,
        longitude: 126.9780
    },
    facility: {
        type: 'vertical',
        area: 100,
        height: 4,
        floors: 3,
        existingEquipment: []
    },
    budget: {
        initial: 100000000,
        monthly: 5000000,
        targetROI: 20,
        paybackMonths: 36
    },
    experience: 'intermediate',
    goals: ['profit', 'sustainability'],
    preferences: {
        cropTypes: [],
        automationLevel: 'high',
        organicCertification: true,
        exportFocus: false
    },
    constraints: {
        laborAvailable: 2,
        electricityLimit: 50,
        waterLimit: 5000
    }
};
