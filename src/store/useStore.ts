import { create } from 'zustand';

// Types
export interface Sensor {
    id: string;
    name: string;
    icon: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    optimal: [number, number];
    trend: 'up' | 'down' | 'stable';
    history: number[];
}

export interface Alert {
    id: string;
    type: 'info' | 'success' | 'warning' | 'danger';
    icon: string;
    title: string;
    desc: string;
    time: string;
}

export interface Decision {
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    desc: string;
}

export interface Equipment {
    id: string;
    name: string;
    icon: string;
    status: string;
    active: boolean;
}

export interface Rule {
    id: number;
    name: string;
    condition: string;
    active: boolean;
}

interface AppState {
    // Current module
    currentModule: 'ai-brain' | 'iot-nexus' | 'smart-control';
    setCurrentModule: (module: 'ai-brain' | 'iot-nexus' | 'smart-control') => void;

    // Connection status
    isConnected: boolean;
    setIsConnected: (status: boolean) => void;

    // Sensors
    sensors: Record<string, Sensor>;
    setSensors: (sensors: Record<string, Sensor>) => void;
    updateSensor: (id: string, updates: Partial<Sensor>) => void;

    // Alerts
    alerts: Alert[];
    addAlert: (alert: Alert) => void;
    clearAlerts: () => void;

    // Decisions
    decisions: Decision[];
    setDecisions: (decisions: Decision[]) => void;
    removeDecision: (id: string) => void;

    // Equipment
    equipment: Record<string, Equipment>;
    setEquipment: (equipment: Record<string, Equipment>) => void;
    toggleEquipment: (id: string) => void;

    // Rules
    rules: Rule[];
    setRules: (rules: Rule[]) => void;
    toggleRule: (id: number) => void;

    // Neural stats
    neuralStats: {
        neurons: number;
        synapses: number;
        processSpeed: number;
        intelligence: number;
    };
    updateNeuralStats: () => void;

    // Learning progress
    learningProgress: {
        crop: number;
        env: number;
        energy: number;
        harvest: number;
    };
    updateLearningProgress: () => void;

    // Energy
    energyData: {
        total: number;
        light: number;
        hvac: number;
        irrigation: number;
        ventilation: number;
    };
    updateEnergyData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
    // Current module
    currentModule: 'ai-brain',
    setCurrentModule: (module) => set({ currentModule: module }),

    // Connection
    isConnected: true,
    setIsConnected: (status) => set({ isConnected: status }),

    // Sensors
    sensors: {},
    setSensors: (sensors) => set({ sensors }),
    updateSensor: (id, updates) => set((state) => ({
        sensors: {
            ...state.sensors,
            [id]: { ...state.sensors[id], ...updates }
        }
    })),

    // Alerts
    alerts: [],
    addAlert: (alert) => set((state) => ({
        alerts: [alert, ...state.alerts].slice(0, 10)
    })),
    clearAlerts: () => set({ alerts: [] }),

    // Decisions
    decisions: [],
    setDecisions: (decisions) => set({ decisions }),
    removeDecision: (id) => set((state) => ({
        decisions: state.decisions.filter(d => d.id !== id)
    })),

    // Equipment
    equipment: {},
    setEquipment: (equipment) => set({ equipment }),
    toggleEquipment: (id) => set((state) => ({
        equipment: {
            ...state.equipment,
            [id]: {
                ...state.equipment[id],
                active: !state.equipment[id].active,
                status: state.equipment[id].active ? '정지' : '가동 중'
            }
        }
    })),

    // Rules
    rules: [],
    setRules: (rules) => set({ rules }),
    toggleRule: (id) => set((state) => ({
        rules: state.rules.map(rule =>
            rule.id === id ? { ...rule, active: !rule.active } : rule
        )
    })),

    // Neural stats
    neuralStats: {
        neurons: 2847,
        synapses: 18400,
        processSpeed: 847,
        intelligence: 87.5
    },
    updateNeuralStats: () => set((state) => ({
        neuralStats: {
            neurons: 2500 + Math.floor(Math.random() * 700),
            synapses: 15000 + Math.floor(Math.random() * 7000),
            processSpeed: 700 + Math.floor(Math.random() * 250),
            intelligence: Math.min(99.9, state.neuralStats.intelligence + (Math.random() > 0.8 ? 0.1 : 0))
        }
    })),

    // Learning progress
    learningProgress: {
        crop: 94,
        env: 87,
        energy: 91,
        harvest: 78
    },
    updateLearningProgress: () => set((state) => ({
        learningProgress: {
            crop: Math.min(99, state.learningProgress.crop + (Math.random() > 0.7 ? 1 : 0)),
            env: Math.min(99, state.learningProgress.env + (Math.random() > 0.7 ? 1 : 0)),
            energy: Math.min(99, state.learningProgress.energy + (Math.random() > 0.7 ? 1 : 0)),
            harvest: Math.min(99, state.learningProgress.harvest + (Math.random() > 0.7 ? 1 : 0))
        }
    })),

    // Energy
    energyData: {
        total: 4.2,
        light: 1.8,
        hvac: 1.5,
        irrigation: 0.6,
        ventilation: 0.3
    },
    updateEnergyData: () => {
        const equipment = get().equipment;
        const activeCount = Object.values(equipment).filter(e => e.active).length;
        set({
            energyData: {
                total: 1 + activeCount * 0.8 + Math.random() * 0.5,
                light: 1.2 + Math.random() * 0.6,
                hvac: 1.0 + Math.random() * 0.5,
                irrigation: 0.3 + Math.random() * 0.3,
                ventilation: 0.2 + Math.random() * 0.2
            }
        });
    }
}));
