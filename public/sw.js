// Toolora Offline-First Progressive Web App Service Worker
const CACHE_NAME = 'toolora-v2';
const DYNAMIC_CACHE = 'toolora-dynamic-v2';

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

// All developer tool routes to precache so they open offline immediately
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
  '/income-tax',
  '/json-formatter',
  '/tools/json-formatter',
  '/tools/markdown-editor',
  '/tools/base64-encoder',
  '/tools/hash-generator'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(PRECACHE_ASSETS).catch(() => {});
      await cache.addAll(TOOL_ROUTES).catch(() => {});
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

  // 1. Navigation / HTML Page Requests: Stale-While-Revalidate (or Network First with Root Fallback)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
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
            if (cachedResponse) return cachedResponse;
            // Match canonical root shell if specific route isn't cached
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
                  <h1>Toolora Offline Workspace</h1>
                  <p>Toolora is ready for offline productivity. All cached tools and local storage drafts remain active.</p>
                  <button onclick="window.location.href='/'">Return to Toolora Workspace</button>
                </div>
              </body>
              </html>`,
              { headers: { 'Content-Type': 'text/html' } }
            );
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 2. Next.js Data Chunks, RSC Requests, JS & CSS Static Assets: Cache-First / Stale-While-Revalidate
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.includes('/_next/data/') ||
    url.search.includes('_rsc=') ||
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

  // Default Fallback
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match('/')))
  );
});
