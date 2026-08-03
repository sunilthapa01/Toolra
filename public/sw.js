// Toolora Offline-First Progressive Web App Service Worker
const CACHE_NAME = 'toolora-v1';
const DYNAMIC_CACHE = 'toolora-dynamic-v1';

// App Shell assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-512x512-maskable.png',
  '/icons/apple-touch-icon.png',
  '/toolora_refined_logo_no_bg.png'
];

// Standard tool short URLs to cache automatically
const TOOL_ROUTES = [
  '/json',
  '/markdown',
  '/base64',
  '/jwt',
  '/uuid',
  '/regex',
  '/hash',
  '/url',
  '/gst',
  '/emi',
  '/sip',
  '/loan',
  '/income-tax'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Precache core assets & common tool routes non-blockingly
      cache.addAll(PRECACHE_ASSETS).catch(() => {});
      return cache.addAll(TOOL_ROUTES).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and analytics/telemetry APIs
  if (request.method !== 'GET') return;
  if (
    url.pathname.includes('/_vercel/') ||
    url.pathname.includes('/google-analytics') ||
    url.pathname.includes('/analytics') ||
    url.hostname.includes('google')
  ) {
    return;
  }

  // 1. Navigation / HTML Requests (Pages): Network First -> Fallback to Cache -> Fallback to Home ('/')
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          // Try matching normalized route or root app shell fallback
          const rootResponse = await caches.match('/');
          if (rootResponse) return rootResponse;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Toolora – Working Offline</title>
              <style>
                body { background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
                .card { background: #0f172a; border: 1px solid #1e293b; padding: 32px; border-radius: 16px; max-width: 480px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
                h1 { margin-top: 0; font-size: 1.5rem; color: #6366f1; }
                p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }
                button { background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 16px; }
                button:hover { background: #4338ca; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>You are Working Offline</h1>
                <p>Toolora is ready for offline developer productivity. Cached tools and workspaces are fully operational without internet.</p>
                <button onclick="window.location.href='/'">Return to Toolora Workspace</button>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Static Assets (_next/static, fonts, icons, images): Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.hostname.includes('fonts.')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
