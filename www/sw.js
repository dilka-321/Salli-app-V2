const CACHE_NAME = 'salli-shell-v5';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/salli.svg', './premium.css'];
const OPTIONAL = ['./vendor/supabase.js', './vendor/fonts/fonts.css'];
const SUPABASE_SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    for (const u of OPTIONAL) { try { await cache.add(u); } catch (_) { /* not bundled in this build */ } }
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
  // Google Fonts: keep a copy so the chosen font still shows offline
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(req);
      const fresh = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => cached);
      return cached || fresh;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(req).then(res => {
    if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html'))));
});
