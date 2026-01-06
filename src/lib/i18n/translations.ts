// AgriNexus World OS - 다국어 지원 시스템
// 전세계 10개 언어 지원

export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ar' | 'vi' | 'th';

export interface Translation {
    // 메인 헤더
    appName: string;
    appTagline: string;
    appDescription: string;

    // 네비게이션
    nav: {
        dashboard: string;
        smartfarm: string;
        digitalTwin: string;
        hyperEvolution: string;
        superIntelligence: string;
        swarm: string;
        system: string;
        lifeforce: string;
    };

    // 대시보드
    dashboard: {
        welcome: string;
        totalSystems: string;
        globalEfficiency: string;
        aiControl: string;
        energySaving: string;
        systemCluster: string;
        recentAlerts: string;
        quickAccess: string;
    };

    // 스마트팜
    smartfarm: {
        title: string;
        design: string;
        equipment: string;
        agents: string;
        simulation: string;
        upload: string;
        cameraView: string;
        top: string;
        front: string;
        side: string;
        isometric: string;
    };

    // 공통
    common: {
        loading: string;
        error: string;
        success: string;
        save: string;
        cancel: string;
        confirm: string;
        active: string;
        inactive: string;
        online: string;
        offline: string;
        live: string;
        paused: string;
    };

    // 회사 소개
    company: {
        slogan: string;
        description: string;
        unique: string;
    };
}

export const translations: Record<Language, Translation> = {
    ko: {
        appName: 'AgriNexus World OS',
        appTagline: '초지능 완전 자동화 스마트팜 운영체제',
        appDescription: '세계 유일 1인 AI 전자동화 실내 스마트팜 플랫폼',
        nav: {
            dashboard: '대시보드',
            smartfarm: '스마트팜',
            digitalTwin: '디지털 트윈',
            hyperEvolution: '초진화 AI',
            superIntelligence: '초지능',
            swarm: '에이전트 스웜',
            system: '시스템 코어',
            lifeforce: '생명력',
        },
        dashboard: {
            welcome: '환영합니다',
            totalSystems: '통합 시스템',
            globalEfficiency: '글로벌 효율',
            aiControl: 'AI 관리',
            energySaving: '에너지 절감',
            systemCluster: '시스템 클러스터',
            recentAlerts: '최근 알림',
            quickAccess: '빠른 접근',
        },
        smartfarm: {
            title: '스마트팜 설계',
            design: '3D 설계',
            equipment: '장비',
            agents: 'AI 에이전트',
            simulation: '시뮬레이션',
            upload: '업로드',
            cameraView: '카메라 뷰',
            top: '상단',
            front: '정면',
            side: '측면',
            isometric: '등각',
        },
        common: {
            loading: '로딩 중...',
            error: '오류',
            success: '성공',
            save: '저장',
            cancel: '취소',
            confirm: '확인',
            active: '활성',
            inactive: '비활성',
            online: '온라인',
            offline: '오프라인',
            live: '실시간',
            paused: '일시정지',
        },
        company: {
            slogan: '1인 AI 전자동화 기업',
            description: '전세계 유일한 완전 자동화 실내 스마트팜 플랫폼',
            unique: '독보적 기술력',
        },
    },
    en: {
        appName: 'AgriNexus World OS',
        appTagline: 'Super-Intelligent Fully Automated Smart Farm OS',
        appDescription: 'World\'s Only 1-Person AI Automated Indoor Smart Farm Platform',
        nav: {
            dashboard: 'Dashboard',
            smartfarm: 'Smart Farm',
            digitalTwin: 'Digital Twin',
            hyperEvolution: 'Hyper Evolution',
            superIntelligence: 'Super Intelligence',
            swarm: 'Agent Swarm',
            system: 'System Core',
            lifeforce: 'Life Force',
        },
        dashboard: {
            welcome: 'Welcome',
            totalSystems: 'Total Systems',
            globalEfficiency: 'Global Efficiency',
            aiControl: 'AI Control',
            energySaving: 'Energy Saving',
            systemCluster: 'System Cluster',
            recentAlerts: 'Recent Alerts',
            quickAccess: 'Quick Access',
        },
        smartfarm: {
            title: 'Smart Farm Designer',
            design: '3D Design',
            equipment: 'Equipment',
            agents: 'AI Agents',
            simulation: 'Simulation',
            upload: 'Upload',
            cameraView: 'Camera View',
            top: 'Top',
            front: 'Front',
            side: 'Side',
            isometric: 'Isometric',
        },
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            active: 'Active',
            inactive: 'Inactive',
            online: 'Online',
            offline: 'Offline',
            live: 'Live',
            paused: 'Paused',
        },
        company: {
            slogan: '1-Person AI Automation Enterprise',
            description: 'World\'s Only Fully Automated Indoor Smart Farm Platform',
            unique: 'Unrivaled Technology',
        },
    },
    ja: {
        appName: 'AgriNexus World OS',
        appTagline: '超知能完全自動化スマートファームOS',
        appDescription: '世界唯一の1人AIオートメーション室内スマートファームプラットフォーム',
        nav: {
            dashboard: 'ダッシュボード',
            smartfarm: 'スマートファーム',
            digitalTwin: 'デジタルツイン',
            hyperEvolution: 'ハイパー進化',
            superIntelligence: '超知能',
            swarm: 'エージェントスワーム',
            system: 'システムコア',
            lifeforce: 'ライフフォース',
        },
        dashboard: {
            welcome: 'ようこそ',
            totalSystems: '統合システム',
            globalEfficiency: 'グローバル効率',
            aiControl: 'AI管理',
            energySaving: '省エネルギー',
            systemCluster: 'システムクラスタ',
            recentAlerts: '最近のアラート',
            quickAccess: 'クイックアクセス',
        },
        smartfarm: {
            title: 'スマートファーム設計',
            design: '3D設計',
            equipment: '機器',
            agents: 'AIエージェント',
            simulation: 'シミュレーション',
            upload: 'アップロード',
            cameraView: 'カメラビュー',
            top: '上面',
            front: '正面',
            side: '側面',
            isometric: 'アイソメトリック',
        },
        common: {
            loading: '読み込み中...',
            error: 'エラー',
            success: '成功',
            save: '保存',
            cancel: 'キャンセル',
            confirm: '確認',
            active: 'アクティブ',
            inactive: '非アクティブ',
            online: 'オンライン',
            offline: 'オフライン',
            live: 'ライブ',
            paused: '一時停止',
        },
        company: {
            slogan: '1人AI自動化企業',
            description: '世界唯一の完全自動化室内スマートファームプラットフォーム',
            unique: '独自の技術力',
        },
    },
    zh: {
        appName: 'AgriNexus World OS',
        appTagline: '超智能全自动智慧农场操作系统',
        appDescription: '全球唯一的1人AI自动化室内智慧农场平台',
        nav: {
            dashboard: '仪表板',
            smartfarm: '智慧农场',
            digitalTwin: '数字孪生',
            hyperEvolution: '超进化',
            superIntelligence: '超智能',
            swarm: '代理群',
            system: '系统核心',
            lifeforce: '生命力',
        },
        dashboard: {
            welcome: '欢迎',
            totalSystems: '总系统',
            globalEfficiency: '全球效率',
            aiControl: 'AI控制',
            energySaving: '节能',
            systemCluster: '系统集群',
            recentAlerts: '最近警报',
            quickAccess: '快速访问',
        },
        smartfarm: {
            title: '智慧农场设计',
            design: '3D设计',
            equipment: '设备',
            agents: 'AI代理',
            simulation: '模拟',
            upload: '上传',
            cameraView: '相机视图',
            top: '顶部',
            front: '正面',
            side: '侧面',
            isometric: '等轴测',
        },
        common: {
            loading: '加载中...',
            error: '错误',
            success: '成功',
            save: '保存',
            cancel: '取消',
            confirm: '确认',
            active: '活跃',
            inactive: '非活跃',
            online: '在线',
            offline: '离线',
            live: '实时',
            paused: '暂停',
        },
        company: {
            slogan: '1人AI自动化企业',
            description: '全球唯一的完全自动化室内智慧农场平台',
            unique: '独一无二的技术',
        },
    },
    es: {
        appName: 'AgriNexus World OS',
        appTagline: 'Sistema Operativo de Granja Inteligente Totalmente Automatizado',
        appDescription: 'Plataforma de Granja Inteligente Interior Automatizada por IA Única en el Mundo',
        nav: {
            dashboard: 'Panel',
            smartfarm: 'Granja Inteligente',
            digitalTwin: 'Gemelo Digital',
            hyperEvolution: 'Hiper Evolución',
            superIntelligence: 'Super Inteligencia',
            swarm: 'Enjambre de Agentes',
            system: 'Núcleo del Sistema',
            lifeforce: 'Fuerza Vital',
        },
        dashboard: {
            welcome: 'Bienvenido',
            totalSystems: 'Sistemas Totales',
            globalEfficiency: 'Eficiencia Global',
            aiControl: 'Control IA',
            energySaving: 'Ahorro Energético',
            systemCluster: 'Clúster del Sistema',
            recentAlerts: 'Alertas Recientes',
            quickAccess: 'Acceso Rápido',
        },
        smartfarm: {
            title: 'Diseñador de Granja',
            design: 'Diseño 3D',
            equipment: 'Equipo',
            agents: 'Agentes IA',
            simulation: 'Simulación',
            upload: 'Subir',
            cameraView: 'Vista de Cámara',
            top: 'Superior',
            front: 'Frontal',
            side: 'Lateral',
            isometric: 'Isométrico',
        },
        common: {
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            save: 'Guardar',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            active: 'Activo',
            inactive: 'Inactivo',
            online: 'En línea',
            offline: 'Fuera de línea',
            live: 'En vivo',
            paused: 'Pausado',
        },
        company: {
            slogan: 'Empresa de Automatización IA de 1 Persona',
            description: 'Plataforma de Granja Interior Automatizada Única en el Mundo',
            unique: 'Tecnología Inigualable',
        },
    },
    fr: {
        appName: 'AgriNexus World OS',
        appTagline: 'Système d\'Exploitation de Ferme Intelligente Entièrement Automatisé',
        appDescription: 'Plateforme de Ferme Intérieure Automatisée par IA Unique au Monde',
        nav: {
            dashboard: 'Tableau de Bord',
            smartfarm: 'Ferme Intelligente',
            digitalTwin: 'Jumeau Numérique',
            hyperEvolution: 'Hyper Évolution',
            superIntelligence: 'Super Intelligence',
            swarm: 'Essaim d\'Agents',
            system: 'Noyau Système',
            lifeforce: 'Force de Vie',
        },
        dashboard: {
            welcome: 'Bienvenue',
            totalSystems: 'Systèmes Totaux',
            globalEfficiency: 'Efficacité Globale',
            aiControl: 'Contrôle IA',
            energySaving: 'Économie d\'Énergie',
            systemCluster: 'Cluster Système',
            recentAlerts: 'Alertes Récentes',
            quickAccess: 'Accès Rapide',
        },
        smartfarm: {
            title: 'Concepteur de Ferme',
            design: 'Conception 3D',
            equipment: 'Équipement',
            agents: 'Agents IA',
            simulation: 'Simulation',
            upload: 'Télécharger',
            cameraView: 'Vue Caméra',
            top: 'Dessus',
            front: 'Face',
            side: 'Côté',
            isometric: 'Isométrique',
        },
        common: {
            loading: 'Chargement...',
            error: 'Erreur',
            success: 'Succès',
            save: 'Sauvegarder',
            cancel: 'Annuler',
            confirm: 'Confirmer',
            active: 'Actif',
            inactive: 'Inactif',
            online: 'En ligne',
            offline: 'Hors ligne',
            live: 'En direct',
            paused: 'En pause',
        },
        company: {
            slogan: 'Entreprise d\'Automatisation IA à 1 Personne',
            description: 'Plateforme de Ferme Intérieure Automatisée Unique au Monde',
            unique: 'Technologie Inégalée',
        },
    },
    de: {
        appName: 'AgriNexus World OS',
        appTagline: 'Vollautomatisiertes Super-Intelligentes Smart Farm Betriebssystem',
        appDescription: 'Weltweit Einzige 1-Personen KI-Automatisierte Indoor Smart Farm Plattform',
        nav: {
            dashboard: 'Dashboard',
            smartfarm: 'Smart Farm',
            digitalTwin: 'Digitaler Zwilling',
            hyperEvolution: 'Hyper Evolution',
            superIntelligence: 'Super Intelligenz',
            swarm: 'Agenten-Schwarm',
            system: 'Systemkern',
            lifeforce: 'Lebenskraft',
        },
        dashboard: {
            welcome: 'Willkommen',
            totalSystems: 'Gesamtsysteme',
            globalEfficiency: 'Globale Effizienz',
            aiControl: 'KI-Steuerung',
            energySaving: 'Energieeinsparung',
            systemCluster: 'Systemcluster',
            recentAlerts: 'Aktuelle Warnungen',
            quickAccess: 'Schnellzugriff',
        },
        smartfarm: {
            title: 'Farm Designer',
            design: '3D Design',
            equipment: 'Ausrüstung',
            agents: 'KI-Agenten',
            simulation: 'Simulation',
            upload: 'Hochladen',
            cameraView: 'Kameraansicht',
            top: 'Oben',
            front: 'Vorne',
            side: 'Seite',
            isometric: 'Isometrisch',
        },
        common: {
            loading: 'Laden...',
            error: 'Fehler',
            success: 'Erfolg',
            save: 'Speichern',
            cancel: 'Abbrechen',
            confirm: 'Bestätigen',
            active: 'Aktiv',
            inactive: 'Inaktiv',
            online: 'Online',
            offline: 'Offline',
            live: 'Live',
            paused: 'Pausiert',
        },
        company: {
            slogan: '1-Personen KI-Automatisierungsunternehmen',
            description: 'Weltweit Einzige Vollautomatisierte Indoor Smart Farm Plattform',
            unique: 'Unübertroffene Technologie',
        },
    },
    ar: {
        appName: 'AgriNexus World OS',
        appTagline: 'نظام تشغيل مزرعة ذكية مؤتمتة بالكامل',
        appDescription: 'منصة مزرعة داخلية ذكية مؤتمتة بالذكاء الاصطناعي الوحيدة في العالم',
        nav: {
            dashboard: 'لوحة القيادة',
            smartfarm: 'مزرعة ذكية',
            digitalTwin: 'التوأم الرقمي',
            hyperEvolution: 'تطور فائق',
            superIntelligence: 'ذكاء خارق',
            swarm: 'سرب العملاء',
            system: 'نواة النظام',
            lifeforce: 'قوة الحياة',
        },
        dashboard: {
            welcome: 'مرحباً',
            totalSystems: 'إجمالي الأنظمة',
            globalEfficiency: 'الكفاءة العالمية',
            aiControl: 'تحكم الذكاء الاصطناعي',
            energySaving: 'توفير الطاقة',
            systemCluster: 'مجموعة النظام',
            recentAlerts: 'التنبيهات الأخيرة',
            quickAccess: 'وصول سريع',
        },
        smartfarm: {
            title: 'مصمم المزرعة',
            design: 'تصميم ثلاثي الأبعاد',
            equipment: 'معدات',
            agents: 'وكلاء الذكاء الاصطناعي',
            simulation: 'محاكاة',
            upload: 'رفع',
            cameraView: 'عرض الكاميرا',
            top: 'أعلى',
            front: 'أمام',
            side: 'جانب',
            isometric: 'متساوي القياس',
        },
        common: {
            loading: 'جار التحميل...',
            error: 'خطأ',
            success: 'نجاح',
            save: 'حفظ',
            cancel: 'إلغاء',
            confirm: 'تأكيد',
            active: 'نشط',
            inactive: 'غير نشط',
            online: 'متصل',
            offline: 'غير متصل',
            live: 'مباشر',
            paused: 'متوقف',
        },
        company: {
            slogan: 'شركة أتمتة الذكاء الاصطناعي لشخص واحد',
            description: 'منصة المزرعة الداخلية المؤتمتة الوحيدة في العالم',
            unique: 'تقنية لا مثيل لها',
        },
    },
    vi: {
        appName: 'AgriNexus World OS',
        appTagline: 'Hệ Điều Hành Nông Trại Thông Minh Tự Động Hoàn Toàn',
        appDescription: 'Nền Tảng Nông Trại Trong Nhà Tự Động AI Duy Nhất Trên Thế Giới',
        nav: {
            dashboard: 'Bảng Điều Khiển',
            smartfarm: 'Nông Trại Thông Minh',
            digitalTwin: 'Song Sinh Số',
            hyperEvolution: 'Siêu Tiến Hóa',
            superIntelligence: 'Siêu Trí Tuệ',
            swarm: 'Bầy Đàn Tác Nhân',
            system: 'Lõi Hệ Thống',
            lifeforce: 'Sức Sống',
        },
        dashboard: {
            welcome: 'Chào Mừng',
            totalSystems: 'Tổng Hệ Thống',
            globalEfficiency: 'Hiệu Quả Toàn Cầu',
            aiControl: 'Điều Khiển AI',
            energySaving: 'Tiết Kiệm Năng Lượng',
            systemCluster: 'Cụm Hệ Thống',
            recentAlerts: 'Cảnh Báo Gần Đây',
            quickAccess: 'Truy Cập Nhanh',
        },
        smartfarm: {
            title: 'Thiết Kế Nông Trại',
            design: 'Thiết Kế 3D',
            equipment: 'Thiết Bị',
            agents: 'Tác Nhân AI',
            simulation: 'Mô Phỏng',
            upload: 'Tải Lên',
            cameraView: 'Góc Nhìn Camera',
            top: 'Trên',
            front: 'Trước',
            side: 'Bên',
            isometric: 'Đẳng Cự',
        },
        common: {
            loading: 'Đang tải...',
            error: 'Lỗi',
            success: 'Thành công',
            save: 'Lưu',
            cancel: 'Hủy',
            confirm: 'Xác nhận',
            active: 'Hoạt động',
            inactive: 'Không hoạt động',
            online: 'Trực tuyến',
            offline: 'Ngoại tuyến',
            live: 'Trực tiếp',
            paused: 'Tạm dừng',
        },
        company: {
            slogan: 'Doanh Nghiệp Tự Động AI 1 Người',
            description: 'Nền Tảng Nông Trại Trong Nhà Tự Động Duy Nhất Trên Thế Giới',
            unique: 'Công Nghệ Độc Đáo',
        },
    },
    th: {
        appName: 'AgriNexus World OS',
        appTagline: 'ระบบปฏิบัติการฟาร์มอัจฉริยะอัตโนมัติเต็มรูปแบบ',
        appDescription: 'แพลตฟอร์มฟาร์มอัจฉริยะในร่มอัตโนมัติ AI แห่งเดียวของโลก',
        nav: {
            dashboard: 'แดชบอร์ด',
            smartfarm: 'ฟาร์มอัจฉริยะ',
            digitalTwin: 'ดิจิทัลทวิน',
            hyperEvolution: 'ไฮเปอร์อีโวลูชัน',
            superIntelligence: 'ซูเปอร์อินเทลลิเจนซ์',
            swarm: 'ฝูงตัวแทน',
            system: 'แกนระบบ',
            lifeforce: 'พลังชีวิต',
        },
        dashboard: {
            welcome: 'ยินดีต้อนรับ',
            totalSystems: 'ระบบทั้งหมด',
            globalEfficiency: 'ประสิทธิภาพทั่วโลก',
            aiControl: 'การควบคุม AI',
            energySaving: 'การประหยัดพลังงาน',
            systemCluster: 'คลัสเตอร์ระบบ',
            recentAlerts: 'การแจ้งเตือนล่าสุด',
            quickAccess: 'การเข้าถึงด่วน',
        },
        smartfarm: {
            title: 'ออกแบบฟาร์ม',
            design: 'การออกแบบ 3D',
            equipment: 'อุปกรณ์',
            agents: 'ตัวแทน AI',
            simulation: 'การจำลอง',
            upload: 'อัปโหลด',
            cameraView: 'มุมกล้อง',
            top: 'บน',
            front: 'หน้า',
            side: 'ข้าง',
            isometric: 'ไอโซเมตริก',
        },
        common: {
            loading: 'กำลังโหลด...',
            error: 'ข้อผิดพลาด',
            success: 'สำเร็จ',
            save: 'บันทึก',
            cancel: 'ยกเลิก',
            confirm: 'ยืนยัน',
            active: 'ใช้งาน',
            inactive: 'ไม่ใช้งาน',
            online: 'ออนไลน์',
            offline: 'ออฟไลน์',
            live: 'สด',
            paused: 'หยุดชั่วคราว',
        },
        company: {
            slogan: 'บริษัทออโตเมชัน AI คนเดียว',
            description: 'แพลตฟอร์มฟาร์มในร่มอัตโนมัติแห่งเดียวของโลก',
            unique: 'เทคโนโลยีที่ไม่มีใครเทียบ',
        },
    },
};

// 언어 관련 유틸리티
export const LANGUAGE_NAMES: Record<Language, string> = {
    ko: '한국어',
    en: 'English',
    ja: '日本語',
    zh: '中文',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ar: 'العربية',
    vi: 'Tiếng Việt',
    th: 'ไทย',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
    ko: '🇰🇷',
    en: '🇺🇸',
    ja: '🇯🇵',
    zh: '🇨🇳',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    ar: '🇸🇦',
    vi: '🇻🇳',
    th: '🇹🇭',
};

export function getTranslation(lang: Language): Translation {
    return translations[lang] || translations.en;
}

export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') return 'en';

    const browserLang = navigator.language.split('-')[0];
    const supportedLangs: Language[] = ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'ar', 'vi', 'th'];

    return supportedLangs.includes(browserLang as Language)
        ? browserLang as Language
        : 'en';
}
