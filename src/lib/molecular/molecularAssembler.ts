// AgriNexus World OS - 분자 조립기
// Molecular Assembler - 세계 최초 나노 수준 영양소 조립 시스템

export interface MolecularAssemblerSystem {
    id: string;
    farmId: string;
    assemblers: Assembler[];
    recipes: NutrientRecipe[];
    productions: Production[];
    inventory: MolecularInventory;
    metrics: AssemblerMetrics;
    status: 'idle' | 'assembling' | 'calibrating' | 'maintenance';
}

export interface Assembler {
    id: string;
    name: string;
    type: AssemblerType;
    precision: number;                  // nm
    speed: number;                      // molecules/second
    capacity: number;                   // mol/hour
    temperature: number;
    efficiency: number;                 // %
    currentRecipe?: string;
    progress: number;                   // %
    status: 'idle' | 'working' | 'cooldown' | 'error';
}

export type AssemblerType = 'nutrient' | 'hormone' | 'enzyme' | 'vitamin' | 'mineral' | 'universal';

export interface NutrientRecipe {
    id: string;
    name: string;
    koreanName: string;
    category: 'macronutrient' | 'micronutrient' | 'vitamin' | 'hormone' | 'enzyme' | 'custom';
    molecularFormula: string;
    targetCrop: string;
    ingredients: Ingredient[];
    outputMass: number;                 // mg
    assemblyTime: number;               // seconds
    energyCost: number;                 // kWh
    benefits: string[];
}

export interface Ingredient {
    element: string;
    quantity: number;                   // mol
    purity: number;                     // %
    available: boolean;
}

export interface Production {
    id: string;
    recipeId: string;
    assemblerId: string;
    quantity: number;
    startTime: Date;
    estimatedEnd: Date;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    qualityScore?: number;
}

export interface MolecularInventory {
    elements: { [element: string]: { quantity: number; unit: string } };
    products: { recipeId: string; quantity: number; quality: number }[];
    rawMaterials: number;               // kg
    finishedProducts: number;           // kg
}

export interface AssemblerMetrics {
    totalAssemblers: number;
    activeAssemblers: number;
    recipesAvailable: number;
    productionsToday: number;
    moleculesAssembled: number;
    averageQuality: number;
    energyEfficiency: number;
}

export class MolecularAssemblerEngine {
    private system: MolecularAssemblerSystem;

    constructor(farmId: string) {
        this.system = this.initializeSystem(farmId);
    }

    private initializeSystem(farmId: string): MolecularAssemblerSystem {
        return {
            id: `assembler-${Date.now()}`,
            farmId,
            assemblers: [
                { id: 'asm-1', name: 'NutriForge Alpha', type: 'nutrient', precision: 0.1, speed: 1e9, capacity: 0.5, temperature: 25, efficiency: 94, status: 'idle', progress: 0 },
                { id: 'asm-2', name: 'HormoneWeaver', type: 'hormone', precision: 0.05, speed: 5e8, capacity: 0.2, temperature: 22, efficiency: 92, status: 'idle', progress: 0 },
                { id: 'asm-3', name: 'VitaBuilder Pro', type: 'vitamin', precision: 0.08, speed: 8e8, capacity: 0.3, temperature: 20, efficiency: 96, status: 'idle', progress: 0 },
                { id: 'asm-4', name: 'Universal Synthesizer', type: 'universal', precision: 0.02, speed: 2e9, capacity: 1.0, temperature: 18, efficiency: 98, status: 'idle', progress: 0 }
            ],
            recipes: [
                { id: 'r-1', name: 'Nitrogen Complex', koreanName: '질소 복합체', category: 'macronutrient', molecularFormula: 'NH4NO3', targetCrop: '딸기', ingredients: [{ element: 'N', quantity: 2, purity: 99.9, available: true }, { element: 'H', quantity: 4, purity: 99.9, available: true }, { element: 'O', quantity: 3, purity: 99.9, available: true }], outputMass: 80, assemblyTime: 30, energyCost: 0.5, benefits: ['성장 촉진', '엽록소 합성'] },
                { id: 'r-2', name: 'Phosphorus Chelate', koreanName: '인 킬레이트', category: 'macronutrient', molecularFormula: 'Ca3(PO4)2', targetCrop: '토마토', ingredients: [{ element: 'Ca', quantity: 3, purity: 99.5, available: true }, { element: 'P', quantity: 2, purity: 99.9, available: true }, { element: 'O', quantity: 8, purity: 99.9, available: true }], outputMass: 310, assemblyTime: 45, energyCost: 0.8, benefits: ['뿌리 발달', 'ATP 생산'] },
                { id: 'r-3', name: 'Auxin Analog', koreanName: '옥신 유사체', category: 'hormone', molecularFormula: 'C10H9NO2', targetCrop: '전체', ingredients: [{ element: 'C', quantity: 10, purity: 99.9, available: true }, { element: 'H', quantity: 9, purity: 99.9, available: true }, { element: 'N', quantity: 1, purity: 99.9, available: true }, { element: 'O', quantity: 2, purity: 99.9, available: true }], outputMass: 175, assemblyTime: 120, energyCost: 2.0, benefits: ['성장 조절', '뿌리 분화'] },
                { id: 'r-4', name: 'Vitamin C Complex', koreanName: '비타민C 복합체', category: 'vitamin', molecularFormula: 'C6H8O6', targetCrop: '딸기', ingredients: [{ element: 'C', quantity: 6, purity: 99.9, available: true }, { element: 'H', quantity: 8, purity: 99.9, available: true }, { element: 'O', quantity: 6, purity: 99.9, available: true }], outputMass: 176, assemblyTime: 60, energyCost: 1.2, benefits: ['항산화', '스트레스 저항'] }
            ],
            productions: [],
            inventory: {
                elements: { 'C': { quantity: 5000, unit: 'mol' }, 'H': { quantity: 20000, unit: 'mol' }, 'O': { quantity: 10000, unit: 'mol' }, 'N': { quantity: 3000, unit: 'mol' }, 'P': { quantity: 1500, unit: 'mol' }, 'K': { quantity: 2000, unit: 'mol' }, 'Ca': { quantity: 1000, unit: 'mol' } },
                products: [],
                rawMaterials: 25.5,
                finishedProducts: 8.2
            },
            metrics: { totalAssemblers: 4, activeAssemblers: 0, recipesAvailable: 4, productionsToday: 12, moleculesAssembled: 1.5e15, averageQuality: 97.5, energyEfficiency: 94 },
            status: 'idle'
        };
    }

    startProduction(recipeId: string, assemblerId: string, quantity: number): Production {
        const recipe = this.system.recipes.find(r => r.id === recipeId);
        const assembler = this.system.assemblers.find(a => a.id === assemblerId);
        if (!recipe || !assembler) throw new Error('Recipe or assembler not found');

        const production: Production = {
            id: `prod-${Date.now()}`,
            recipeId,
            assemblerId,
            quantity,
            startTime: new Date(),
            estimatedEnd: new Date(Date.now() + recipe.assemblyTime * 1000 * quantity),
            status: 'processing'
        };

        assembler.status = 'working';
        assembler.currentRecipe = recipeId;
        this.system.productions.push(production);
        this.system.metrics.productionsToday++;
        return production;
    }

    getSystem(): MolecularAssemblerSystem { return this.system; }
    getAssembler(id: string): Assembler | undefined { return this.system.assemblers.find(a => a.id === id); }
    getRecipe(id: string): NutrientRecipe | undefined { return this.system.recipes.find(r => r.id === id); }
}

const assemblerEngines: Map<string, MolecularAssemblerEngine> = new Map();
export function getMolecularAssemblerEngine(farmId: string): MolecularAssemblerEngine {
    if (!assemblerEngines.has(farmId)) assemblerEngines.set(farmId, new MolecularAssemblerEngine(farmId));
    return assemblerEngines.get(farmId)!;
}
