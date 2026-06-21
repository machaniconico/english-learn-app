// Service Worker: 英語学習アプリ PWA のオフライン対応
// プレーンJS (ビルド対象外)。public/sw.js を直接編集する。

// キャッシュバージョン。破壊的変更の時は上げる。
const CACHE_NAME = 'english-learn-v3';

// アプリシェル。install 時にプリキャッシュし、オフライン初回起動でも表示できるようにする。
// 最低限 '/' と '/index.html' が必須。アイコン類は存在するなら入るだけで OK。
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// --- install: アプリシェルをプリキャッシュ ---
// 必須資源('/', '/index.html')は cache.addAll で確実にキャッシュし、
// 失敗時は throw して install 自体を失敗させる(ブラウザがオンライン時に再インストールを試みる)。
// 任意資源(アイコン/manifest/favicon)は Promise.allSettled で個別に取得し、
// 404 などで欠落しても install を失敗させない。
const REQUIRED_SHELL = ['/', '/index.html'];
const OPTIONAL_SHELL = ['/manifest.json', '/favicon.svg', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // 必須アプリシェル: ここが失敗するとオフライン app shell が出ないので throw する
      await cache.addAll(REQUIRED_SHELL);
      // 任意資源: 一つでも取れなくてもインストールは継続(404 を許容)
      const optionalResults = await Promise.allSettled(OPTIONAL_SHELL.map((url) => cache.add(url)));
      optionalResults.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.warn('[sw] 任意資源のプリキャッシュをスキップ:', OPTIONAL_SHELL[i], r.reason);
        }
      });
      return self.skipWaiting();
    })()
  );
});

// --- activate: 古いバージョンのキャッシュのみ削除 ---
// 全削除をやめ、CACHE_NAME 以外を消す(ランタイムキャッシュは現行名で生かす)。
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// --- fetch: GET のみハンドリング ---
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // クロスオリジンは SW で制御しない(そのままブラウザへ)
  if (url.origin !== self.location.origin) return;

  // (A) navigate / HTML: ネットワーク優先。成功時は '/' として最新をキャッシュ。
  //     オフライン時は caches.match(request) → 無ければ caches.match('/') の app shell へフォールバック。
  if (req.mode === 'navigate' || req.destination === 'document' || url.pathname === '/') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          // 最新アプリシェルを '/' キーで保存(HTML は body が使い回せるのは1回のみなので clone)
          const cache = await caches.open(CACHE_NAME);
          cache.put('/', fresh.clone());
          return fresh;
        } catch (_err) {
          // オフライン: まず要求そのものをキャッシュから、無ければ app shell の '/' へ
          const cached = await caches.match(req);
          if (cached) return cached;
          const shell = await caches.match('/');
          if (shell) return shell;
          // 最終手段: 何も無い場合は 503 を返す(undefined を返さない)
          return new Response('オフラインでアプリシェルが利用できません', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // (B) /assets/ (ハッシュ付き不変アセット): cache-first。あればそれ、無ければ fetch して clone を put。
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const response = await fetch(req);
          // 不変アセットだけなので OK の時だけキャッシュ
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(req, response.clone());
          }
          return response;
        } catch (_err) {
          // オフラインかつ未キャッシュ: undefined を返さない
          const fallback = await caches.match(req);
          if (fallback) return fallback;
          return new Response('アセットがオフラインで利用できません', {
            status: 504,
            statusText: 'Gateway Timeout',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // (C) その他 GET: ネットワーク優先、失敗時にキャッシュへフォールバック。
  event.respondWith(
    (async () => {
      try {
        const response = await fetch(req);
        // 同期リソース(同一オリジン)はランタイムキャッシュに保存
        if (response.ok && req.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, response.clone());
        }
        return response;
      } catch (_err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        // フォールバックも無い場合は 503(undefined 回避)
        return new Response('オフラインでリソースが利用できません', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })()
  );
});
