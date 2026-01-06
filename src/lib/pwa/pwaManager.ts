// AgriNexus World OS - PWA 유틸리티
// 오프라인 지원, 푸시 알림, 설치 기능

export interface PushSubscriptionData {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

class PWAManager {
    private registration: ServiceWorkerRegistration | null = null;
    private deferredPrompt: any = null;
    private isInstalled: boolean = false;
    private isOnline: boolean = true;

    constructor() {
        if (typeof window !== 'undefined') {
            this.init();
        }
    }

    private async init() {
        // 온라인/오프라인 상태 감지
        this.isOnline = navigator.onLine;
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.onOnline();
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.onOffline();
        });

        // Service Worker 등록
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker 등록됨:', this.registration.scope);

                // 업데이트 체크
                this.registration.addEventListener('updatefound', () => {
                    console.log('🔄 새 버전 발견');
                    this.onUpdateFound();
                });
            } catch (error) {
                console.error('Service Worker 등록 실패:', error);
            }
        }

        // 설치 프롬프트 이벤트
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('📲 앱 설치 가능');
        });

        // 설치 완료 이벤트
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.deferredPrompt = null;
            console.log('✅ 앱 설치 완료');
        });

        // 이미 설치되어 있는지 체크
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
        }
    }

    // 앱 설치 프롬프트 표시
    async showInstallPrompt(): Promise<boolean> {
        if (!this.deferredPrompt) {
            console.log('설치 프롬프트 없음');
            return false;
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;

            if (outcome === 'accepted') {
                console.log('✅ 사용자가 설치 수락');
                return true;
            } else {
                console.log('❌ 사용자가 설치 거부');
                return false;
            }
        } catch (error) {
            console.error('설치 프롬프트 오류:', error);
            return false;
        }
    }

    // 설치 가능 여부
    canInstall(): boolean {
        return !!this.deferredPrompt && !this.isInstalled;
    }

    // 이미 설치됨
    isAppInstalled(): boolean {
        return this.isInstalled;
    }

    // 푸시 알림 권한 요청
    async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.log('알림 미지원');
            return 'denied';
        }

        const permission = await Notification.requestPermission();
        console.log('알림 권한:', permission);
        return permission;
    }

    // 푸시 구독
    async subscribeToPush(): Promise<PushSubscriptionData | null> {
        if (!this.registration) {
            console.error('Service Worker 없음');
            return null;
        }

        try {
            const permission = await this.requestNotificationPermission();
            if (permission !== 'granted') {
                return null;
            }

            // VAPID 공개키 (환경변수에서 가져오기)
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!vapidPublicKey) {
                console.error('VAPID 키 없음');
                return null;
            }

            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey) as BufferSource
            });

            const json = subscription.toJSON();
            return {
                endpoint: json.endpoint!,
                keys: {
                    p256dh: json.keys!.p256dh,
                    auth: json.keys!.auth
                }
            };
        } catch (error) {
            console.error('푸시 구독 실패:', error);
            return null;
        }
    }

    // 로컬 알림 표시
    async showNotification(title: string, options?: NotificationOptions): Promise<void> {
        if (!this.registration) return;

        const defaultOptions: NotificationOptions = {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge.png',
            ...options
        };

        await this.registration.showNotification(title, defaultOptions);
    }

    // 오프라인 상태 확인
    getOnlineStatus(): boolean {
        return this.isOnline;
    }

    // 오프라인 이벤트
    private onOffline() {
        console.log('📴 오프라인 모드');
        // 오프라인 토스트 표시
        if (typeof document !== 'undefined') {
            this.showOfflineToast();
        }
    }

    // 온라인 이벤트
    private onOnline() {
        console.log('📶 온라인 복귀');
        // 데이터 동기화
        if (this.registration && 'sync' in this.registration) {
            (this.registration as any).sync.register('sync-sensor-data');
        }
    }

    // 업데이트 발견
    private onUpdateFound() {
        const newWorker = this.registration?.installing;
        if (newWorker) {
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 새 버전 사용 가능
                    console.log('🆕 새 버전 사용 가능');
                    this.showUpdateToast();
                }
            });
        }
    }

    // 오프라인 토스트
    private showOfflineToast() {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-xl bg-yellow-500/90 text-black font-medium z-[9999] flex items-center gap-3';
        toast.innerHTML = `
      <span class="text-2xl">📴</span>
      <div>
        <div class="font-bold">오프라인 모드</div>
        <div class="text-sm opacity-80">인터넷 연결이 끊겼습니다</div>
      </div>
    `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    // 업데이트 토스트
    private showUpdateToast() {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-xl bg-blue-500/90 text-white font-medium z-[9999] flex items-center gap-3';
        toast.innerHTML = `
      <span class="text-2xl">🆕</span>
      <div class="flex-1">
        <div class="font-bold">새 버전 사용 가능</div>
        <div class="text-sm opacity-80">새로고침하여 업데이트하세요</div>
      </div>
      <button onclick="location.reload()" class="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30">
        업데이트
      </button>
    `;
        document.body.appendChild(toast);
    }

    // Base64 URL을 Uint8Array로 변환
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // 캐시 정리
    async clearCache(): Promise<void> {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
        console.log('🗑️ 캐시 삭제됨');
    }

    // 저장 공간 정보
    async getStorageInfo(): Promise<{ usage: number; quota: number } | null> {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                usage: estimate.usage || 0,
                quota: estimate.quota || 0
            };
        }
        return null;
    }
}

// 싱글톤 인스턴스
let pwaManagerInstance: PWAManager | null = null;

export function getPWAManager(): PWAManager {
    if (!pwaManagerInstance) {
        pwaManagerInstance = new PWAManager();
    }
    return pwaManagerInstance;
}

export default PWAManager;
