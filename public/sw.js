// AgriNexus World OS - Service Worker
// 오프라인 지원 및 푸시 알림

const CACHE_NAME = 'agrinexus-v1';
const RUNTIME_CACHE = 'agrinexus-runtime';

// 캐시할 정적 파일
const STATIC_ASSETS = [
    '/',
    '/smartfarm',
    '/digitaltwin',
    '/system',
    '/manifest.json',
    '/offline.html',
];

// 캐시 전략: Network First (API), Cache First (Static)
const CACHE_STRATEGIES = {
    networkFirst: ['/api/'],
    cacheFirst: ['/icons/', '/fonts/', '/_next/static/'],
    staleWhileRevalidate: ['/', '/smartfarm', '/digitaltwin'],
};

// 설치 이벤트
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker 설치 중...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 정적 자산 캐싱 중...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker 설치 완료');
                return self.skipWaiting();
            })
    );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker 활성화 중...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                        .map((name) => {
                            console.log(`🗑️ 오래된 캐시 삭제: ${name}`);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker 활성화 완료');
                return self.clients.claim();
            })
    );
});

// 페치 이벤트
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API 요청: Network First
    if (CACHE_STRATEGIES.networkFirst.some(path => url.pathname.startsWith(path))) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    // 정적 자산: Cache First
    if (CACHE_STRATEGIES.cacheFirst.some(path => url.pathname.startsWith(path))) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    // 페이지: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(event.request));
});

// Network First 전략
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Cache First 전략
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

// Stale While Revalidate 전략
async function staleWhileRevalidate(request) {
    const cached = await caches.match(request);

    const fetchPromise = fetch(request)
        .then((response) => {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, response.clone()));
            return response;
        })
        .catch(() => cached);

    return cached || fetchPromise;
}

// 푸시 알림 수신
self.addEventListener('push', (event) => {
    console.log('📬 푸시 알림 수신');

    let data = {
        title: 'AgriNexus 알림',
        body: '새로운 알림이 있습니다.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge.png',
        tag: 'agrinexus-notification',
        data: { url: '/' }
    };

    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        tag: data.tag,
        data: data.data,
        vibrate: [100, 50, 100],
        actions: [
            { action: 'view', title: '확인하기', icon: '/icons/check.png' },
            { action: 'dismiss', title: '닫기', icon: '/icons/close.png' }
        ],
        requireInteraction: data.type === 'critical'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 알림 클릭
self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ 알림 클릭:', event.action);

    event.notification.close();

    if (event.action === 'dismiss') return;

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // 이미 열린 창이 있으면 포커스
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // 없으면 새 창 열기
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
    console.log('🔄 백그라운드 동기화:', event.tag);

    if (event.tag === 'sync-sensor-data') {
        event.waitUntil(syncSensorData());
    }
});

async function syncSensorData() {
    try {
        // 오프라인 동안 저장된 데이터 동기화
        const cache = await caches.open('offline-data');
        const requests = await cache.keys();

        for (const request of requests) {
            const response = await cache.match(request);
            const data = await response.json();

            await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            await cache.delete(request);
        }

        console.log('✅ 데이터 동기화 완료');
    } catch (error) {
        console.error('❌ 동기화 실패:', error);
    }
}

// 주기적 백그라운드 동기화
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-alerts') {
        event.waitUntil(checkAlerts());
    }
});

async function checkAlerts() {
    try {
        const response = await fetch('/api/alerts/check');
        const data = await response.json();

        if (data.hasNewAlerts) {
            self.registration.showNotification('AgriNexus 알림', {
                body: `${data.count}개의 새로운 알림이 있습니다.`,
                icon: '/icons/icon-192x192.png',
                tag: 'new-alerts',
                data: { url: '/' }
            });
        }
    } catch (error) {
        console.error('알림 확인 실패:', error);
    }
}

console.log('🌱 AgriNexus Service Worker 로드됨');
