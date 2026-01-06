// AgriNexus World OS - 홀로그램 3D 시각화 엔진
// Holographic 3D Visualization Engine - 세계 최초 실시간 홀로그램 스마트팜 시각화

// ============================================
// 타입 정의
// ============================================

export interface HologramScene {
    id: string;
    name: string;
    type: SceneType;
    objects: HologramObject[];
    camera: CameraState;
    lighting: LightingConfig;
    environment: EnvironmentConfig;
    annotations: Annotation3D[];
    animations: Animation3D[];
    dataBindings: DataBinding[];
    interactionMode: InteractionMode;
    quality: QualityLevel;
    timestamp: Date;
}

export type SceneType =
    | 'farm_overview'       // 농장 전체
    | 'growth_timelapse'    // 성장 타임랩스
    | 'root_analysis'       // 뿌리 3D 분석
    | 'cell_structure'      // 세포 구조
    | 'molecular_view'      // 분자 수준
    | 'data_landscape'      // 데이터 시각화
    | 'logistics_flow'      // 물류 흐름
    | 'supply_chain';       // 공급망

export interface HologramObject {
    id: string;
    type: ObjectType;
    name: string;
    geometry: Geometry3D;
    material: Material3D;
    position: Vector3D;
    rotation: Vector3D;
    scale: Vector3D;
    children: HologramObject[];
    metadata: ObjectMetadata;
    animations: string[];
    interactive: boolean;
    visible: boolean;
    opacity: number;
    glow: GlowEffect;
}

export type ObjectType =
    | 'plant'
    | 'equipment'
    | 'sensor'
    | 'container'
    | 'vehicle'
    | 'building'
    | 'data_point'
    | 'flow_line'
    | 'annotation'
    | 'particle_system';

export interface Geometry3D {
    type: 'plant' | 'box' | 'sphere' | 'cylinder' | 'custom' | 'imported';
    vertices?: Float32Array;
    indices?: Uint32Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    boundingBox: BoundingBox;
}

export interface BoundingBox {
    min: Vector3D;
    max: Vector3D;
    center: Vector3D;
    size: Vector3D;
}

export interface Material3D {
    type: 'standard' | 'holographic' | 'wireframe' | 'transparent' | 'emissive' | 'pbr';
    color: ColorRGBA;
    emissiveColor?: ColorRGBA;
    emissiveIntensity?: number;
    metalness?: number;
    roughness?: number;
    opacity?: number;
    wireframeColor?: ColorRGBA;
    texture?: string;
    normalMap?: string;
    hologramEffect?: HologramEffect;
}

export interface HologramEffect {
    scanLines: boolean;
    scanLineSpeed: number;
    glitch: boolean;
    glitchIntensity: number;
    flicker: boolean;
    flickerFrequency: number;
    colorShift: boolean;
    fresnelIntensity: number;
}

export interface Vector3D {
    x: number;
    y: number;
    z: number;
}

export interface ColorRGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface CameraState {
    position: Vector3D;
    target: Vector3D;
    up: Vector3D;
    fov: number;
    near: number;
    far: number;
    orthographic: boolean;
    zoom: number;
}

export interface LightingConfig {
    ambient: { color: ColorRGBA; intensity: number };
    directional: DirectionalLight[];
    point: PointLight[];
    spot: SpotLight[];
    hemisphere: { skyColor: ColorRGBA; groundColor: ColorRGBA; intensity: number };
}

export interface DirectionalLight {
    id: string;
    color: ColorRGBA;
    intensity: number;
    direction: Vector3D;
    castShadow: boolean;
}

export interface PointLight {
    id: string;
    color: ColorRGBA;
    intensity: number;
    position: Vector3D;
    decay: number;
    distance: number;
}

export interface SpotLight extends PointLight {
    target: Vector3D;
    angle: number;
    penumbra: number;
}

export interface EnvironmentConfig {
    background: 'dark' | 'gradient' | 'skybox' | 'transparent';
    backgroundColor?: ColorRGBA;
    gradientColors?: { top: ColorRGBA; bottom: ColorRGBA };
    skyboxUrl?: string;
    fog: { enabled: boolean; color: ColorRGBA; near: number; far: number };
    grid: { enabled: boolean; size: number; divisions: number; color: ColorRGBA };
}

// ============================================
// 주석 및 애니메이션
// ============================================

export interface Annotation3D {
    id: string;
    targetObjectId: string;
    position: Vector3D;
    type: 'label' | 'measurement' | 'callout' | 'info_panel';
    content: {
        title?: string;
        text?: string;
        value?: number;
        unit?: string;
        icon?: string;
    };
    style: AnnotationStyle;
    visible: boolean;
    animated: boolean;
}

export interface AnnotationStyle {
    backgroundColor: ColorRGBA;
    textColor: ColorRGBA;
    fontSize: number;
    borderColor: ColorRGBA;
    borderWidth: number;
    cornerRadius: number;
    glow: boolean;
    glowColor: ColorRGBA;
}

export interface Animation3D {
    id: string;
    name: string;
    targetIds: string[];
    type: AnimationType;
    duration: number;
    loop: boolean;
    easing: EasingFunction;
    keyframes: Keyframe3D[];
    playing: boolean;
    currentTime: number;
}

export type AnimationType =
    | 'transform'       // 위치/회전/크기
    | 'morph'           // 형태 변환
    | 'color'           // 색상 변화
    | 'visibility'      // 표시/숨김
    | 'camera'          // 카메라 이동
    | 'growth'          // 성장 시뮬레이션
    | 'flow'            // 흐름 표현
    | 'pulse';          // 맥동 효과

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface Keyframe3D {
    time: number;       // 0-1 정규화
    position?: Vector3D;
    rotation?: Vector3D;
    scale?: Vector3D;
    color?: ColorRGBA;
    opacity?: number;
    custom?: Record<string, number>;
}

// ============================================
// 데이터 바인딩
// ============================================

export interface DataBinding {
    id: string;
    objectId: string;
    dataSource: DataSourceType;
    property: string;          // 바인딩할 속성 (position.y, material.color, etc.)
    dataKey: string;           // 데이터 키 (temperature, humidity, etc.)
    transform: DataTransform;
    updateFrequency: number;   // ms
    lastValue?: unknown;
}

export type DataSourceType =
    | 'sensor_realtime'
    | 'crop_health'
    | 'environment'
    | 'logistics'
    | 'financial'
    | 'weather'
    | 'simulation';

export interface DataTransform {
    type: 'linear' | 'logarithmic' | 'threshold' | 'custom';
    inputRange: [number, number];
    outputRange: [number, number] | ColorRGBA[];
    customFunction?: string;
}

export interface GlowEffect {
    enabled: boolean;
    color: ColorRGBA;
    intensity: number;
    size: number;
    animated: boolean;
}

export interface ObjectMetadata {
    category: string;
    tags: string[];
    description: string;
    dataPoints: { key: string; value: unknown; unit?: string }[];
    links: { label: string; url: string }[];
    lastUpdated: Date;
}

export type InteractionMode = 'view' | 'select' | 'measure' | 'annotate' | 'manipulate';
export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

// ============================================
// 홀로그램 엔진
// ============================================

export class HologramVisualizationEngine {
    private scenes: Map<string, HologramScene> = new Map();
    private activeSceneId: string | null = null;
    private presets: Map<string, Partial<HologramScene>> = new Map();
    private dataBindingValues: Map<string, unknown> = new Map();

    constructor() {
        this.initializePresets();
    }

    private initializePresets(): void {
        // 농장 전체 뷰 프리셋
        this.presets.set('farm_overview', {
            type: 'farm_overview',
            camera: {
                position: { x: 10, y: 15, z: 10 },
                target: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 1, z: 0 },
                fov: 60,
                near: 0.1,
                far: 1000,
                orthographic: false,
                zoom: 1
            },
            lighting: {
                ambient: { color: { r: 0.1, g: 0.15, b: 0.2, a: 1 }, intensity: 0.5 },
                directional: [{
                    id: 'main',
                    color: { r: 1, g: 0.95, b: 0.8, a: 1 },
                    intensity: 1,
                    direction: { x: -1, y: -1, z: -1 },
                    castShadow: true
                }],
                point: [],
                spot: [],
                hemisphere: {
                    skyColor: { r: 0.4, g: 0.6, b: 1, a: 1 },
                    groundColor: { r: 0.2, g: 0.3, b: 0.1, a: 1 },
                    intensity: 0.3
                }
            },
            environment: {
                background: 'gradient',
                gradientColors: {
                    top: { r: 0.05, g: 0.05, b: 0.1, a: 1 },
                    bottom: { r: 0.02, g: 0.02, b: 0.05, a: 1 }
                },
                fog: { enabled: true, color: { r: 0, g: 0, b: 0, a: 1 }, near: 50, far: 200 },
                grid: { enabled: true, size: 50, divisions: 50, color: { r: 0.2, g: 0.4, b: 0.6, a: 0.5 } }
            },
            quality: 'high'
        });

        // 분자 수준 프리셋
        this.presets.set('molecular', {
            type: 'molecular_view',
            camera: {
                position: { x: 0, y: 0, z: 5 },
                target: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 1, z: 0 },
                fov: 45,
                near: 0.001,
                far: 100,
                orthographic: false,
                zoom: 1
            },
            quality: 'ultra'
        });

        // 물류 흐름 프리셋
        this.presets.set('logistics', {
            type: 'logistics_flow',
            camera: {
                position: { x: 0, y: 50, z: 0 },
                target: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 0, z: -1 },
                fov: 60,
                near: 0.1,
                far: 2000,
                orthographic: true,
                zoom: 1
            },
            quality: 'high'
        });
    }

    // 씬 생성
    createScene(name: string, type: SceneType, presetId?: string): HologramScene {
        const preset = presetId ? this.presets.get(presetId) : this.presets.get(type);

        const scene: HologramScene = {
            id: `scene-${Date.now()}`,
            name,
            type,
            objects: [],
            camera: preset?.camera || {
                position: { x: 5, y: 5, z: 5 },
                target: { x: 0, y: 0, z: 0 },
                up: { x: 0, y: 1, z: 0 },
                fov: 60,
                near: 0.1,
                far: 1000,
                orthographic: false,
                zoom: 1
            },
            lighting: preset?.lighting || {
                ambient: { color: { r: 0.1, g: 0.1, b: 0.1, a: 1 }, intensity: 0.5 },
                directional: [],
                point: [],
                spot: [],
                hemisphere: { skyColor: { r: 0.5, g: 0.5, b: 1, a: 1 }, groundColor: { r: 0.2, g: 0.2, b: 0.1, a: 1 }, intensity: 0.3 }
            },
            environment: preset?.environment || {
                background: 'dark',
                backgroundColor: { r: 0.02, g: 0.02, b: 0.05, a: 1 },
                fog: { enabled: false, color: { r: 0, g: 0, b: 0, a: 1 }, near: 10, far: 100 },
                grid: { enabled: true, size: 20, divisions: 20, color: { r: 0.3, g: 0.3, b: 0.3, a: 0.5 } }
            },
            annotations: [],
            animations: [],
            dataBindings: [],
            interactionMode: 'view',
            quality: preset?.quality || 'high',
            timestamp: new Date()
        };

        this.scenes.set(scene.id, scene);
        this.activeSceneId = scene.id;
        return scene;
    }

    // 식물 홀로그램 객체 생성
    createPlantHologram(sceneId: string, plantData: {
        id: string;
        species: string;
        position: Vector3D;
        growthStage: number;     // 0-1
        health: number;          // 0-100
        height: number;          // cm
    }): HologramObject {
        const scene = this.scenes.get(sceneId);
        if (!scene) throw new Error('Scene not found');

        // 건강도에 따른 색상
        const healthColor = this.healthToColor(plantData.health);

        const plant: HologramObject = {
            id: plantData.id,
            type: 'plant',
            name: plantData.species,
            geometry: {
                type: 'plant',
                boundingBox: {
                    min: { x: -0.1, y: 0, z: -0.1 },
                    max: { x: 0.1, y: plantData.height / 100, z: 0.1 },
                    center: { x: 0, y: plantData.height / 200, z: 0 },
                    size: { x: 0.2, y: plantData.height / 100, z: 0.2 }
                }
            },
            material: {
                type: 'holographic',
                color: healthColor,
                emissiveColor: { r: healthColor.r * 0.3, g: healthColor.g * 0.3, b: healthColor.b * 0.3, a: 1 },
                emissiveIntensity: 0.5,
                opacity: 0.9,
                hologramEffect: {
                    scanLines: true,
                    scanLineSpeed: 1,
                    glitch: false,
                    glitchIntensity: 0,
                    flicker: true,
                    flickerFrequency: 0.1,
                    colorShift: false,
                    fresnelIntensity: 0.8
                }
            },
            position: plantData.position,
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: plantData.growthStage, y: plantData.growthStage, z: plantData.growthStage },
            children: [],
            metadata: {
                category: 'plant',
                tags: [plantData.species],
                description: `${plantData.species} - 성장단계: ${(plantData.growthStage * 100).toFixed(0)}%`,
                dataPoints: [
                    { key: 'health', value: plantData.health, unit: '%' },
                    { key: 'height', value: plantData.height, unit: 'cm' },
                    { key: 'growth', value: plantData.growthStage * 100, unit: '%' }
                ],
                links: [],
                lastUpdated: new Date()
            },
            animations: ['growth', 'sway'],
            interactive: true,
            visible: true,
            opacity: 1,
            glow: {
                enabled: true,
                color: healthColor,
                intensity: plantData.health / 100,
                size: 0.1,
                animated: true
            }
        };

        scene.objects.push(plant);
        return plant;
    }

    private healthToColor(health: number): ColorRGBA {
        if (health >= 80) return { r: 0.2, g: 1, b: 0.4, a: 1 };      // 초록
        if (health >= 60) return { r: 0.8, g: 1, b: 0.2, a: 1 };      // 연두
        if (health >= 40) return { r: 1, g: 0.8, b: 0.2, a: 1 };      // 노랑
        if (health >= 20) return { r: 1, g: 0.5, b: 0.2, a: 1 };      // 주황
        return { r: 1, g: 0.2, b: 0.2, a: 1 };                         // 빨강
    }

    // 데이터 시각화 그래프 생성
    createDataVisualization(sceneId: string, data: {
        type: 'bar' | 'line' | 'scatter' | 'surface' | 'flow';
        title: string;
        values: { x: number; y: number; z?: number; label?: string; color?: ColorRGBA }[];
        bounds: { width: number; height: number; depth: number };
    }): HologramObject {
        const scene = this.scenes.get(sceneId);
        if (!scene) throw new Error('Scene not found');

        const dataViz: HologramObject = {
            id: `dataviz-${Date.now()}`,
            type: 'data_point',
            name: data.title,
            geometry: {
                type: 'custom',
                boundingBox: {
                    min: { x: 0, y: 0, z: 0 },
                    max: { x: data.bounds.width, y: data.bounds.height, z: data.bounds.depth },
                    center: { x: data.bounds.width / 2, y: data.bounds.height / 2, z: data.bounds.depth / 2 },
                    size: { x: data.bounds.width, y: data.bounds.height, z: data.bounds.depth }
                }
            },
            material: {
                type: 'holographic',
                color: { r: 0, g: 0.8, b: 1, a: 0.8 },
                emissiveIntensity: 0.3,
                hologramEffect: {
                    scanLines: false,
                    scanLineSpeed: 0,
                    glitch: false,
                    glitchIntensity: 0,
                    flicker: false,
                    flickerFrequency: 0,
                    colorShift: true,
                    fresnelIntensity: 0.5
                }
            },
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            children: data.values.map((v, i) => ({
                id: `datapoint-${i}`,
                type: 'data_point' as ObjectType,
                name: v.label || `Point ${i}`,
                geometry: {
                    type: 'sphere' as const,
                    boundingBox: {
                        min: { x: -0.05, y: -0.05, z: -0.05 },
                        max: { x: 0.05, y: 0.05, z: 0.05 },
                        center: { x: 0, y: 0, z: 0 },
                        size: { x: 0.1, y: 0.1, z: 0.1 }
                    }
                },
                material: {
                    type: 'emissive' as const,
                    color: v.color || { r: 0, g: 1, b: 1, a: 1 },
                    emissiveIntensity: 1
                },
                position: { x: v.x, y: v.y, z: v.z || 0 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
                children: [],
                metadata: {
                    category: 'data',
                    tags: [],
                    description: '',
                    dataPoints: [],
                    links: [],
                    lastUpdated: new Date()
                },
                animations: [],
                interactive: true,
                visible: true,
                opacity: 1,
                glow: { enabled: true, color: v.color || { r: 0, g: 1, b: 1, a: 1 }, intensity: 0.5, size: 0.05, animated: true }
            })),
            metadata: {
                category: 'visualization',
                tags: [data.type],
                description: data.title,
                dataPoints: [],
                links: [],
                lastUpdated: new Date()
            },
            animations: ['pulse'],
            interactive: true,
            visible: true,
            opacity: 1,
            glow: { enabled: false, color: { r: 0, g: 0, b: 0, a: 0 }, intensity: 0, size: 0, animated: false }
        };

        scene.objects.push(dataViz);
        return dataViz;
    }

    // 애니메이션 추가
    addAnimation(sceneId: string, animation: Animation3D): void {
        const scene = this.scenes.get(sceneId);
        if (!scene) return;
        scene.animations.push(animation);
    }

    // 성장 타임랩스 애니메이션 생성
    createGrowthTimelapse(sceneId: string, plantId: string, duration: number): Animation3D {
        const animation: Animation3D = {
            id: `growth-${plantId}-${Date.now()}`,
            name: '성장 타임랩스',
            targetIds: [plantId],
            type: 'growth',
            duration,
            loop: false,
            easing: 'easeInOut',
            keyframes: [
                { time: 0, scale: { x: 0.1, y: 0.1, z: 0.1 }, color: { r: 0.8, g: 1, b: 0.5, a: 1 } },
                { time: 0.25, scale: { x: 0.3, y: 0.3, z: 0.3 }, color: { r: 0.5, g: 1, b: 0.4, a: 1 } },
                { time: 0.5, scale: { x: 0.6, y: 0.6, z: 0.6 }, color: { r: 0.3, g: 0.9, b: 0.3, a: 1 } },
                { time: 0.75, scale: { x: 0.85, y: 0.85, z: 0.85 }, color: { r: 0.2, g: 0.8, b: 0.3, a: 1 } },
                { time: 1, scale: { x: 1, y: 1, z: 1 }, color: { r: 0.2, g: 1, b: 0.4, a: 1 } }
            ],
            playing: false,
            currentTime: 0
        };

        this.addAnimation(sceneId, animation);
        return animation;
    }

    // 데이터 바인딩 추가
    addDataBinding(sceneId: string, binding: DataBinding): void {
        const scene = this.scenes.get(sceneId);
        if (!scene) return;
        scene.dataBindings.push(binding);
    }

    // 데이터 바인딩 업데이트
    updateDataBindings(sceneId: string, data: Record<string, unknown>): void {
        const scene = this.scenes.get(sceneId);
        if (!scene) return;

        for (const binding of scene.dataBindings) {
            const value = data[binding.dataKey];
            if (value !== undefined) {
                this.dataBindingValues.set(binding.id, value);
                this.applyDataBinding(scene, binding, value);
            }
        }
    }

    private applyDataBinding(scene: HologramScene, binding: DataBinding, value: unknown): void {
        const object = this.findObject(scene.objects, binding.objectId);
        if (!object) return;

        // 변환 적용
        const transformedValue = this.transformValue(value as number, binding.transform);

        // 속성 적용 (간단한 구현)
        const parts = binding.property.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let target: any = object;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
        }
        if (target) {
            target[parts[parts.length - 1]] = transformedValue;
        }
    }

    private findObject(objects: HologramObject[], id: string): HologramObject | null {
        for (const obj of objects) {
            if (obj.id === id) return obj;
            const found = this.findObject(obj.children, id);
            if (found) return found;
        }
        return null;
    }

    private transformValue(value: number, transform: DataTransform): number | ColorRGBA {
        const [inMin, inMax] = transform.inputRange;
        const normalized = (value - inMin) / (inMax - inMin);
        const clamped = Math.max(0, Math.min(1, normalized));

        if (Array.isArray(transform.outputRange) && typeof transform.outputRange[0] === 'object') {
            // 색상 보간
            const colors = transform.outputRange as ColorRGBA[];
            const idx = Math.floor(clamped * (colors.length - 1));
            return colors[Math.min(idx, colors.length - 1)];
        } else {
            // 숫자 보간
            const [outMin, outMax] = transform.outputRange as [number, number];
            return outMin + clamped * (outMax - outMin);
        }
    }

    // 씬 조회
    getScene(sceneId: string): HologramScene | undefined {
        return this.scenes.get(sceneId);
    }

    // 활성 씬 조회
    getActiveScene(): HologramScene | undefined {
        return this.activeSceneId ? this.scenes.get(this.activeSceneId) : undefined;
    }

    // 모든 씬 조회
    getAllScenes(): HologramScene[] {
        return Array.from(this.scenes.values());
    }

    // 씬 통계
    getSceneStats(sceneId: string): SceneStats {
        const scene = this.scenes.get(sceneId);
        if (!scene) throw new Error('Scene not found');

        const countObjects = (objects: HologramObject[]): number => {
            return objects.reduce((sum, obj) => sum + 1 + countObjects(obj.children), 0);
        };

        return {
            objectCount: countObjects(scene.objects),
            animationCount: scene.animations.length,
            annotationCount: scene.annotations.length,
            dataBindingCount: scene.dataBindings.length,
            quality: scene.quality,
            estimatedTriangles: countObjects(scene.objects) * 1000,
            estimatedMemory: countObjects(scene.objects) * 0.5 // MB estimate
        };
    }
}

export interface SceneStats {
    objectCount: number;
    animationCount: number;
    annotationCount: number;
    dataBindingCount: number;
    quality: QualityLevel;
    estimatedTriangles: number;
    estimatedMemory: number;
}

// ============================================
// 싱글톤 인스턴스
// ============================================

let hologramEngine: HologramVisualizationEngine | null = null;

export function getHologramVisualizationEngine(): HologramVisualizationEngine {
    if (!hologramEngine) {
        hologramEngine = new HologramVisualizationEngine();
    }
    return hologramEngine;
}

// 씬 타입 아이콘
export const SCENE_TYPE_ICONS: Record<SceneType, string> = {
    farm_overview: '🏭',
    growth_timelapse: '🌱',
    root_analysis: '🌿',
    cell_structure: '🔬',
    molecular_view: '⚛️',
    data_landscape: '📊',
    logistics_flow: '🚚',
    supply_chain: '🔗'
};

// 씬 타입 한글명
export const SCENE_TYPE_NAMES: Record<SceneType, string> = {
    farm_overview: '농장 전체 뷰',
    growth_timelapse: '성장 타임랩스',
    root_analysis: '뿌리 분석',
    cell_structure: '세포 구조',
    molecular_view: '분자 수준',
    data_landscape: '데이터 시각화',
    logistics_flow: '물류 흐름',
    supply_chain: '공급망'
};
