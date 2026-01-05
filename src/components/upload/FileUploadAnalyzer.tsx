'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadedFile,
    detectFileCategory,
    simulateFileAnalysis,
    FILE_ANALYSIS_AGENTS,
    SUPPORTED_FILE_TYPES,
    FileAnalysis,
} from '@/lib/agents/fileAnalysis';

interface FileUploadProps {
    onFileAnalyzed?: (file: UploadedFile) => void;
}

export default function FileUploadAnalyzer({ onFileAnalyzed }: FileUploadProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback(async (file: File) => {
        const category = detectFileCategory(file);
        const uploadedFile: UploadedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            category,
            uploadedAt: new Date(),
            status: 'uploading',
            progress: 0,
        };

        setFiles(prev => [...prev, uploadedFile]);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setFiles(prev => prev.map(f =>
                f.id === uploadedFile.id ? { ...f, progress: i } : f
            ));
        }

        // Start analysis
        setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id ? { ...f, status: 'analyzing' as const, progress: 0 } : f
        ));

        // Simulate analysis progress
        for (let i = 0; i <= 100; i += 5) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setFiles(prev => prev.map(f =>
                f.id === uploadedFile.id ? { ...f, progress: i } : f
            ));
        }

        // Generate analysis result
        const analysis = simulateFileAnalysis(uploadedFile);
        const finalFile: UploadedFile = {
            ...uploadedFile,
            status: 'processed',
            progress: 100,
            analysis,
        };

        setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id ? finalFile : f
        ));

        onFileAnalyzed?.(finalFile);
    }, [onFileAnalyzed]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        droppedFiles.forEach(file => processFile(file));
    }, [processFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => processFile(file));
    }, [processFile]);

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            floorplan: '📐',
            blueprint: '📋',
            image: '🖼️',
            document: '📄',
            spreadsheet: '📊',
            data: '📈',
            '3dmodel': '🎲',
            video: '🎥',
            unknown: '❓',
        };
        return icons[category] || '📁';
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <motion.div
                className={`relative p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${isDragging
                        ? 'border-[var(--primary-green)] bg-[var(--primary-green)]/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.docx,.doc,.xlsx,.xls,.csv,.json,.dwg,.dxf,.obj,.fbx,.gltf,.glb,.svg"
                />

                <div className="text-center">
                    <motion.div
                        className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--primary-green)]/20 flex items-center justify-center"
                        animate={{ scale: isDragging ? 1.2 : 1 }}
                    >
                        <span className="text-4xl">📁</span>
                    </motion.div>
                    <h3 className="text-lg font-bold mb-2">파일을 드래그하거나 클릭하여 업로드</h3>
                    <p className="text-sm text-white/60 mb-4">
                        설계도, 이미지, 문서, 데이터, 3D 모델 등 모든 파일 지원
                    </p>

                    {/* Supported formats */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {Object.entries(SUPPORTED_FILE_TYPES).map(([category, formats]) => (
                            <div key={category} className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/50">
                                {category}: {formats.slice(0, 3).join(', ')}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Agent Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary-purple)]/20 border border-[var(--primary-purple)]/30">
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        🤖
                    </motion.span>
                    <span className="text-xs text-[var(--primary-purple)]">AI 자동 분석</span>
                </div>
            </motion.div>

            {/* Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2">
                        <span>📋</span> 업로드된 파일 ({files.length})
                    </h4>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        <AnimatePresence mode="popLayout">
                            {files.map(file => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedFile?.id === file.id
                                            ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)]'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                        }`}
                                    onClick={() => setSelectedFile(file)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                                            {getCategoryIcon(file.category)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium truncate">{file.name}</span>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${file.status === 'processed'
                                                        ? 'bg-[var(--status-success)]/20 text-[var(--status-success)]'
                                                        : file.status === 'analyzing'
                                                            ? 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)]'
                                                            : 'bg-white/20'
                                                    }`}>
                                                    {file.status === 'uploading' ? '업로드 중...' :
                                                        file.status === 'analyzing' ? '분석 중...' :
                                                            file.status === 'processed' ? '완료' : '오류'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-white/50">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span>•</span>
                                                <span className="capitalize">{file.category}</span>
                                                {file.analysis && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-[var(--primary-green)]">
                                                            신뢰도 {file.analysis.confidence.toFixed(1)}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {(file.status === 'uploading' || file.status === 'analyzing') && (
                                                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-cyan)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${file.progress}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {file.analysis && (
                                            <div className="text-right">
                                                <div className="text-xs text-white/40">처리 에이전트</div>
                                                <div className="font-[family-name:var(--font-orbitron)] text-xs text-[var(--primary-purple)]">
                                                    {file.analysis.agentUsed}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Selected File Analysis */}
            {selectedFile?.analysis && (
                <FileAnalysisPanel file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}
        </div>
    );
}

// Analysis Panel Component
function FileAnalysisPanel({ file, onClose }: { file: UploadedFile; onClose: () => void }) {
    const analysis = file.analysis!;
    const agent = FILE_ANALYSIS_AGENTS[file.category as keyof typeof FILE_ANALYSIS_AGENTS];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 space-y-4"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <span>🔍</span> AI 분석 결과
                </h3>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                    ✕
                </button>
            </div>

            {/* Agent Info */}
            {agent && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--primary-purple)]/10 border border-[var(--primary-purple)]/30">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary-purple)]/20 flex items-center justify-center">
                        🤖
                    </div>
                    <div>
                        <div className="font-[family-name:var(--font-orbitron)] text-sm text-[var(--primary-purple)]">
                            {agent.code}
                        </div>
                        <div className="text-xs text-white/60">{agent.koreanName} • 정확도 {agent.accuracy}%</div>
                    </div>
                </div>
            )}

            {/* Summary */}
            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-2">📋 분석 요약</h4>
                <p className="text-sm text-white/70">{analysis.summary}</p>
            </div>

            {/* Extracted Data */}
            {analysis.extractedData.dimensions && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-white/5 text-center">
                        <div className="text-xs text-white/50">가로</div>
                        <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                            {analysis.extractedData.dimensions.width}m
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 text-center">
                        <div className="text-xs text-white/50">세로</div>
                        <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                            {analysis.extractedData.dimensions.height}m
                        </div>
                    </div>
                    {analysis.extractedData.dimensions.depth && (
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-white/50">높이</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {analysis.extractedData.dimensions.depth}m
                            </div>
                        </div>
                    )}
                    {analysis.extractedData.area && (
                        <div className="p-3 rounded-lg bg-white/5 text-center">
                            <div className="text-xs text-white/50">면적</div>
                            <div className="font-[family-name:var(--font-orbitron)] text-[var(--primary-green)]">
                                {analysis.extractedData.area}㎡
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Zones */}
            {analysis.extractedData.zones && (
                <div>
                    <h4 className="font-medium mb-2">📍 감지된 구역</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {analysis.extractedData.zones.map(zone => (
                            <div key={zone.id} className="p-3 rounded-lg bg-white/5">
                                <div className="font-medium text-sm">{zone.name}</div>
                                <div className="text-xs text-white/50">
                                    {zone.type} • {zone.area}㎡
                                    {zone.crops && ` • ${zone.crops.join(', ')}`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            <div>
                <h4 className="font-medium mb-2">💡 AI 권장사항</h4>
                <div className="space-y-2">
                    {analysis.recommendations.map((rec, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-lg border-l-2 ${rec.type === 'warning' ? 'bg-[var(--status-warning)]/10 border-[var(--status-warning)]' :
                                    rec.type === 'optimization' ? 'bg-[var(--primary-green)]/10 border-[var(--primary-green)]' :
                                        'bg-white/5 border-[var(--primary-cyan)]'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{rec.title}</span>
                                {rec.impact && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary-green)]/20 text-[var(--primary-green)]">
                                        +{rec.impact}% 개선
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-white/60 mt-1">{rec.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legal Compliance */}
            <div className="p-4 rounded-lg bg-white/5">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <span>⚖️</span> 법규 준수 검토
                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${analysis.legalCompliance.status === 'compliant'
                            ? 'bg-[var(--status-success)]/20 text-[var(--status-success)]'
                            : 'bg-[var(--status-warning)]/20 text-[var(--status-warning)]'
                        }`}>
                        {analysis.legalCompliance.status === 'compliant' ? '적합' : '검토 필요'}
                    </span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {analysis.legalCompliance.checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            <span className={
                                check.status === 'pass' ? 'text-[var(--status-success)]' :
                                    check.status === 'warning' ? 'text-[var(--status-warning)]' :
                                        'text-[var(--status-danger)]'
                            }>
                                {check.status === 'pass' ? '✓' : check.status === 'warning' ? '!' : '✗'}
                            </span>
                            <span className="text-white/70">{check.rule}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
