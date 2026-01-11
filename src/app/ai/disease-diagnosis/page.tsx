'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Microscope,
    Upload,
    Camera,
    AlertTriangle,
    CheckCircle,
    Info,
    Pill,
    Thermometer,
    Droplets,
    RefreshCw,
    ArrowRight,
    X,
    Image as ImageIcon,
    FileWarning
} from 'lucide-react';

// Sample disease data
const recentDiagnoses = [
    {
        id: 1,
        cropName: '토마토',
        disease: '잎곰팡이병',
        confidence: 94.7,
        severity: 'medium',
        date: '2026-01-10',
        treated: true
    },
    {
        id: 2,
        cropName: '딸기',
        disease: '흰가루병',
        confidence: 89.2,
        severity: 'low',
        date: '2026-01-09',
        treated: true
    },
    {
        id: 3,
        cropName: '오이',
        disease: '노균병',
        confidence: 97.1,
        severity: 'high',
        date: '2026-01-08',
        treated: false
    }
];

const diseaseInfo = [
    { name: '잎곰팡이병', count: 12, trend: 'down' },
    { name: '흰가루병', count: 8, trend: 'stable' },
    { name: '탄저병', count: 5, trend: 'up' },
    { name: '역병', count: 3, trend: 'down' }
];

interface DiagnosisResult {
    disease: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
    treatments: string[];
    prevention: string[];
}

export default function DiseaseDiagnosisPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processImage(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImage(file);
        }
    };

    const processImage = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
            setDiagnosisResult(null);
        };
        reader.readAsDataURL(file);
    };

    const runDiagnosis = async () => {
        setIsAnalyzing(true);
        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock result
        setDiagnosisResult({
            disease: '잎곰팡이병 (Leaf Mold)',
            confidence: 94.7,
            severity: 'medium',
            description: '잎곰팡이병은 Fulvia fulva 균에 의해 발생하며, 주로 고온다습한 환경에서 발생합니다. 초기에는 잎 뒷면에 황백색 반점이 생기며 점차 올리브색 곰팡이가 형성됩니다.',
            treatments: [
                '감염된 잎 즉시 제거',
                '살균제 살포 (트리아졸계 약제 추천)',
                '환기 개선으로 습도 70% 이하 유지',
                '질소 비료 과다 사용 억제'
            ],
            prevention: [
                '적정 재식 간격 유지 (통풍 확보)',
                '내병성 품종 재배',
                '관수 시 잎에 물이 닿지 않도록 주의',
                '수확 후 잔재물 완전 제거'
            ]
        });
        setIsAnalyzing(false);
    };

    const resetDiagnosis = () => {
        setSelectedImage(null);
        setDiagnosisResult(null);
    };

    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'high': return { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-danger)', text: '심각' };
            case 'medium': return { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)', text: '주의' };
            case 'low': return { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--status-success)', text: '경미' };
            default: return { bg: 'rgba(100, 116, 139, 0.15)', color: 'var(--text-muted)', text: '미정' };
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <motion.div
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--status-warning)] to-[var(--secondary-rose)] flex items-center justify-center">
                        <Microscope size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                            질병 진단 AI
                        </h1>
                        <p className="text-[var(--text-muted)]">딥러닝 기반 작물 질병 조기 진단</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="badge badge-success">
                        <span className="status-dot online" />
                        AI 모델 활성
                    </span>
                    <span className="badge badge-neutral">150+ 질병 데이터베이스</span>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <motion.div
                    className="lg:col-span-2 card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                        <Upload size={18} className="text-[var(--status-warning)]" />
                        이미지 업로드
                    </h3>

                    <AnimatePresence mode="wait">
                        {!selectedImage ? (
                            <motion.div
                                key="upload"
                                className={`
                                    relative border-2 border-dashed rounded-xl p-8 text-center
                                    transition-colors cursor-pointer
                                    ${isDragging
                                        ? 'border-[var(--primary-green)] bg-[var(--primary-green)]/5'
                                        : 'border-[var(--border-default)] hover:border-[var(--border-strong)]'
                                    }
                                `}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon size={32} className="text-[var(--text-muted)]" />
                                </div>

                                <p className="text-[var(--text-primary)] font-medium mb-2">
                                    이미지를 드래그하거나 클릭하여 업로드
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">
                                    JPG, PNG 형식 지원 (최대 10MB)
                                </p>

                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <button className="btn btn-secondary">
                                        <Upload size={16} />
                                        파일 선택
                                    </button>
                                    <button className="btn btn-ghost">
                                        <Camera size={16} />
                                        카메라
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Image Preview */}
                                <div className="relative rounded-xl overflow-hidden bg-[var(--bg-primary)] mb-4">
                                    <img
                                        src={selectedImage}
                                        alt="Uploaded crop"
                                        className="w-full max-h-64 object-contain mx-auto"
                                    />
                                    <button
                                        onClick={resetDiagnosis}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--bg-secondary)]/80 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Analyze Button */}
                                {!diagnosisResult && (
                                    <button
                                        onClick={runDiagnosis}
                                        className="w-full btn btn-primary py-4"
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <RefreshCw size={18} className="animate-spin" />
                                                AI 분석 중...
                                            </>
                                        ) : (
                                            <>
                                                <Microscope size={18} />
                                                질병 진단 시작
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Diagnosis Result */}
                                {diagnosisResult && (
                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {/* Result Header */}
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                            <div className="w-12 h-12 rounded-xl bg-[var(--status-warning)]/15 flex items-center justify-center flex-shrink-0">
                                                <FileWarning size={24} className="text-[var(--status-warning)]" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <h4 className="font-semibold text-lg text-[var(--text-primary)]">
                                                        {diagnosisResult.disease}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="badge"
                                                            style={{
                                                                backgroundColor: getSeverityStyle(diagnosisResult.severity).bg,
                                                                color: getSeverityStyle(diagnosisResult.severity).color
                                                            }}
                                                        >
                                                            {getSeverityStyle(diagnosisResult.severity).text}
                                                        </span>
                                                        <span className="badge badge-info">
                                                            신뢰도 {diagnosisResult.confidence}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[var(--text-muted)] mt-2">
                                                    {diagnosisResult.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Treatments */}
                                        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                            <h5 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-3">
                                                <Pill size={16} className="text-[var(--primary-blue)]" />
                                                치료 방법
                                            </h5>
                                            <ul className="space-y-2">
                                                {diagnosisResult.treatments.map((treatment, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                                        <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[var(--primary-green)]" />
                                                        {treatment}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Prevention */}
                                        <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                                            <h5 className="font-medium text-[var(--text-primary)] flex items-center gap-2 mb-3">
                                                <CheckCircle size={16} className="text-[var(--status-success)]" />
                                                예방 조치
                                            </h5>
                                            <ul className="space-y-2">
                                                {diagnosisResult.prevention.map((prev, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                                                        <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[var(--primary-blue)]" />
                                                        {prev}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            onClick={resetDiagnosis}
                                            className="w-full btn btn-secondary"
                                        >
                                            새 이미지 진단하기
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Recent Diagnoses */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <AlertTriangle size={18} className="text-[var(--status-warning)]" />
                            최근 진단 기록
                        </h3>

                        <div className="space-y-3">
                            {recentDiagnoses.map((diagnosis) => {
                                const severity = getSeverityStyle(diagnosis.severity);
                                return (
                                    <div
                                        key={diagnosis.id}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: severity.bg }}
                                        >
                                            <Microscope size={18} style={{ color: severity.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                                {diagnosis.cropName} - {diagnosis.disease}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    {diagnosis.date}
                                                </span>
                                                <span
                                                    className="badge"
                                                    style={{ backgroundColor: severity.bg, color: severity.color }}
                                                >
                                                    {severity.text}
                                                </span>
                                                {diagnosis.treated && (
                                                    <CheckCircle size={12} className="text-[var(--status-success)]" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Disease Statistics */}
                    <motion.div
                        className="card"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4">
                            <Info size={18} className="text-[var(--primary-blue)]" />
                            이번 달 발생 현황
                        </h3>

                        <div className="space-y-3">
                            {diseaseInfo.map((disease) => (
                                <div
                                    key={disease.name}
                                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)]"
                                >
                                    <span className="text-sm text-[var(--text-secondary)]">{disease.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold font-mono text-[var(--text-primary)]">
                                            {disease.count}건
                                        </span>
                                        <span className={`text-xs ${disease.trend === 'up' ? 'text-[var(--status-danger)]' : disease.trend === 'down' ? 'text-[var(--status-success)]' : 'text-[var(--text-muted)]'}`}>
                                            {disease.trend === 'up' ? '▲' : disease.trend === 'down' ? '▼' : '―'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
