// Service worker : shell de l'appli + audio mis en cache à la demande (bouton « Hors ligne »).
const SHELL_CACHE = 'shell-v1';
const AUDIO_CACHE = 'audio-v1'; // jamais purgé automatiquement : les enregistrements restent hors ligne
const SHELL = ['./', 'index.html', 'morceaux.json', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== AUDIO_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Safari et Chrome demandent des réponses 206 (Range) pour l'audio : on les fabrique depuis le cache.
async function rangeFromCache(req, res) {
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  const buf = await res.arrayBuffer();
  const total = buf.byteLength;
  let start = 0;
  let end = total - 1;
  if (m) {
    if (m[1] !== '') {
      start = parseInt(m[1], 10);
      if (m[2] !== '') end = Math.min(parseInt(m[2], 10), total - 1);
    } else if (m[2] !== '') {
      start = Math.max(total - parseInt(m[2], 10), 0);
    }
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': 'audio/mp4',
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.includes('/audio/')) {
    e.respondWith((async () => {
      const cached = await caches.match(req.url, { cacheName: AUDIO_CACHE });
      if (cached) return req.headers.has('range') ? rangeFromCache(req, cached) : cached;
      return fetch(req);
    })());
    return;
  }

  // Page, JSON, icônes : réseau d'abord (pour voir les mises à jour), cache en secours hors ligne.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./')))
  );
});
