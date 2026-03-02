// Atualizado para a nova identidade e versão do sistema
const CACHE_NAME = 'nexus-v1';

self.addEventListener('install', (e) => {
  // Força a atualização imediata para a nova marca Nexus
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpa o cache antigo do EZwallet para não ocupar espaço no celular do Senhor
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Estratégia de rede primeiro, caindo para o cache se estiver offline no Nexus
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
