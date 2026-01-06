import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getTranslation, Translation, detectBrowserLanguage } from '@/lib/i18n/translations';

interface LanguageState {
    currentLanguage: Language;
    translation: Translation;
    setLanguage: (lang: Language) => void;
    initLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            currentLanguage: 'ko',
            translation: getTranslation('ko'),

            setLanguage: (lang: Language) => {
                set({
                    currentLanguage: lang,
                    translation: getTranslation(lang),
                });
            },

            initLanguage: () => {
                const savedLang = localStorage.getItem('agrinexus-language');
                if (savedLang) {
                    set({
                        currentLanguage: savedLang as Language,
                        translation: getTranslation(savedLang as Language),
                    });
                } else {
                    const detected = detectBrowserLanguage();
                    set({
                        currentLanguage: detected,
                        translation: getTranslation(detected),
                    });
                }
            },
        }),
        {
            name: 'agrinexus-language',
            partialize: (state) => ({ currentLanguage: state.currentLanguage }),
        }
    )
);
