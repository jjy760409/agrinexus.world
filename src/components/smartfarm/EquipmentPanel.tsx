'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { EQUIPMENT_CATALOG } from '@/lib/smartfarm/farmData';
import { Equipment, EquipmentCategory } from '@/types/smartfarm';

interface EquipmentPanelProps {
    selectedEquipment: Equipment[];
    onEquipmentChange: (equipment: Equipment[]) => void;
}

const CATEGORIES: { id: EquipmentCategory; label: string; icon: string }[] = [
    { id: 'structure', label: '구조물', icon: '🏗️' },
    { id: 'lighting', label: 'LED 조명', icon: '💡' },
    { id: 'hvac', label: '공조 설비', icon: '❄️' },
    { id: 'irrigation', label: '관개/영양', icon: '💧' },
    { id: 'iot', label: 'IoT 센서', icon: '📡' },
    { id: 'control', label: '제어 설비', icon: '🖥️' },
    { id: 'power', label: '전기/전자', icon: '⚡' },
    { id: 'cultivation', label: '재배 설비', icon: '🌾' },
    { id: 'harvest', label: '수확 장비', icon: '🦾' },
    { id: 'monitoring', label: '모니터링', icon: '📊' },
];

export default function EquipmentPanel({ selectedEquipment, onEquipmentChange }: EquipmentPanelProps) {
    const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('structure');
    const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);

    const categoryEquipment = EQUIPMENT_CATALOG.filter(eq => eq.category === activeCategory);

    const toggleEquipment = (equipment: Equipment) => {
        const isSelected = selectedEquipment.find(e => e.id === equipment.id);
        if (isSelected) {
            onEquipmentChange(selectedEquipment.filter(e => e.id !== equipment.id));
        } else {
            onEquipmentChange([...selectedEquipment, equipment]);
        }
    };

    const totalPower = selectedEquipment.reduce((acc, eq) => acc + eq.powerConsumption, 0);
    const aiControlled = selectedEquipment.filter(eq => eq.aiControlled).length;

    return (
        <div className="h-full flex gap-4">
            {/* Categories */}
            <div className="w-48 glass rounded-xl p-3 overflow-y-auto">
                <h3 className="text-sm font-bold mb-3 text-white/70">장비 카테고리</h3>
                <div className="space-y-1">
                    {CATEGORIES.map(cat => {
                        const count = selectedEquipment.filter(e => e.category === cat.id).length;
                        return (
                            <motion.button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 transition-all ${activeCategory === cat.id
                                        ? 'bg-[var(--primary-green)]/20 border border-[var(--primary-green)]'
                                        : 'bg-white/5 hover:bg-white/10'
                                    }`}
                                whileHover={{ x: 3 }}
                            >
                                <span>{cat.icon}</span>
                                <span className="flex-1">{cat.label}</span>
                                {count > 0 && (
                                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-[var(--primary-green)] text-[var(--bg-dark)]">
                                        {count}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="text-xs text-white/50 mb-2">선택 요약</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-white/60">총 장비</span>
                            <span className="text-[var(--primary-green)]">{selectedEquipment.length}개</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">총 전력</span>
                            <span className="text-[var(--primary-cyan)]">{(totalPower / 1000).toFixed(1)}kW</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-white/60">AI 제어</span>
                            <span className="text-[var(--primary-purple)]">{aiControlled}개</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Equipment List */}
            <div className="flex-1 glass rounded-xl p-4 overflow-y-auto">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span>
                    {CATEGORIES.find(c => c.id === activeCategory)?.label} 장비
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryEquipment.map((equipment, i) => {
                        const isSelected = selectedEquipment.find(e => e.id === equipment.id);
                        return (
                            <motion.div
                                key={equipment.id}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                                        ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)]'
                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                    }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => toggleEquipment(equipment)}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-2xl">{equipment.icon}</span>
                                    <div className="flex items-center gap-1">
                                        {equipment.aiControlled && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--primary-purple)]/20 text-[var(--primary-purple)]">
                                                AI
                                            </span>
                                        )}
                                        <span className={`w-2 h-2 rounded-full ${equipment.status === 'active' ? 'bg-[var(--status-success)]' : 'bg-[var(--status-warning)]'
                                            }`} />
                                    </div>
                                </div>

                                <h4 className="font-medium mb-1">{equipment.koreanName}</h4>
                                <p className="text-xs text-white/50 mb-2 line-clamp-2">{equipment.description}</p>

                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/40">{equipment.specs.model}</span>
                                    <span className="text-[var(--primary-cyan)]">{equipment.powerConsumption}W</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedItem(equipment);
                                    }}
                                    className="mt-2 w-full py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    상세정보
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Detail Panel */}
            {selectedItem && (
                <motion.div
                    className="w-80 glass rounded-xl p-4 overflow-y-auto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">장비 상세</h3>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <span className="text-5xl">{selectedItem.icon}</span>
                        <h4 className="text-lg font-bold mt-2">{selectedItem.koreanName}</h4>
                        <p className="text-sm text-white/60">{selectedItem.name}</p>
                    </div>

                    <p className="text-sm text-white/70 mb-4">{selectedItem.description}</p>

                    <div className="space-y-2">
                        <div className="p-2 rounded bg-white/5">
                            <span className="text-xs text-white/50">모델</span>
                            <div className="font-medium">{selectedItem.specs.model}</div>
                        </div>
                        <div className="p-2 rounded bg-white/5">
                            <span className="text-xs text-white/50">제조사</span>
                            <div className="font-medium">{selectedItem.specs.manufacturer}</div>
                        </div>
                        {selectedItem.specs.voltage && (
                            <div className="p-2 rounded bg-white/5">
                                <span className="text-xs text-white/50">전압</span>
                                <div className="font-medium">{selectedItem.specs.voltage}</div>
                            </div>
                        )}
                        <div className="p-2 rounded bg-white/5">
                            <span className="text-xs text-white/50">소비전력</span>
                            <div className="font-medium text-[var(--primary-cyan)]">{selectedItem.powerConsumption}W</div>
                        </div>
                        {selectedItem.specs.efficiency && (
                            <div className="p-2 rounded bg-white/5">
                                <span className="text-xs text-white/50">효율</span>
                                <div className="font-medium text-[var(--primary-green)]">{selectedItem.specs.efficiency}%</div>
                            </div>
                        )}
                    </div>

                    {selectedItem.dataPoints.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-sm font-bold mb-2">데이터 포인트</h5>
                            <div className="flex flex-wrap gap-1">
                                {selectedItem.dataPoints.map(dp => (
                                    <span key={dp} className="px-2 py-0.5 text-xs rounded-full bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)]">
                                        {dp}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <motion.button
                        onClick={() => toggleEquipment(selectedItem)}
                        className={`mt-4 w-full py-2 rounded-lg font-medium transition-all ${selectedEquipment.find(e => e.id === selectedItem.id)
                                ? 'bg-[var(--status-danger)] text-white'
                                : 'bg-[var(--primary-green)] text-[var(--bg-dark)]'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {selectedEquipment.find(e => e.id === selectedItem.id) ? '제거' : '추가'}
                    </motion.button>
                </motion.div>
            )}
        </div>
    );
}
