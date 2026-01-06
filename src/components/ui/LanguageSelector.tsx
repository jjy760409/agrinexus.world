'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';
import { LANGUAGE_NAMES, LANGUAGE_FLAGS, Language } from '@/lib/i18n/translations';

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { currentLanguage, setLanguage } = useLanguageStore();

    // 외부 클릭 시 닫기
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages: Language[] = ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'ar', 'vi', 'th'];

    return (
        <div ref={dropdownRef} className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="text-lg">{LANGUAGE_FLAGS[currentLanguage]}</span>
                <span className="text-sm font-medium hidden sm:inline">{LANGUAGE_NAMES[currentLanguage]}</span>
                <motion.svg
                    className="w-4 h-4 text-white/60"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 py-2 rounded-xl glass border border-white/10 shadow-xl z-50"
                    >
                        <div className="px-3 py-1.5 text-xs text-white/40 font-medium uppercase tracking-wider">
                            Select Language
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {languages.map((lang) => (
                                <motion.button
                                    key={lang}
                                    onClick={() => {
                                        setLanguage(lang);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors ${currentLanguage === lang ? 'bg-[var(--primary-cyan)]/20 text-[var(--primary-cyan)]' : ''
                                        }`}
                                    whileHover={{ x: 4 }}
                                >
                                    <span className="text-lg">{LANGUAGE_FLAGS[lang]}</span>
                                    <span className="text-sm">{LANGUAGE_NAMES[lang]}</span>
                                    {currentLanguage === lang && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="ml-auto text-[var(--primary-cyan)]"
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
