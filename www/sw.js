const CACHE_NAME = 'salli-shell-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/salli.svg'];
const SUPABASE_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    try { await cache.add(SUPABASE_SDK); } catch (_) { /* online login needs SDK; retry on next visit */ }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === 'https://cdn.jsdelivr.net' && url.pathname.includes('/@supabase/supabase-js/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      try { const fresh = await fetch(req); if (fresh.ok) cache.put(req, fresh.clone()); return fresh; }
      catch (_) { if (cached) return cached; throw _; }
    })());
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(res => {
    if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html'))));
});
