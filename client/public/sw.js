const CACHE_NAME = 'atomic-flix-v1';
const urlsToCache = [
  '/',
  '/assets/atomic-logo.png',
  '/manifest.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestion des requêtes fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback pour les pages offline
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      }
    )
  );
});

// Background Sync pour les actions en arrière-plan
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('Push notification received');
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible sur ATOMIC FLIX!',
    icon: '/assets/atomic-logo.png',
    badge: '/assets/atomic-logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorer',
        icon: '/assets/atomic-logo.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/assets/atomic-logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ATOMIC FLIX', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Synchronisation périodique
self.addEventListener('periodicsync', event => {
  console.log('Periodic sync triggered:', event.tag);
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

// Fonction de synchronisation en arrière-plan
async function doBackgroundSync() {
  console.log('Performing background sync...');
  // Ici vous pourriez synchroniser les données hors ligne
  return Promise.resolve();
}

// Fonction de mise à jour du contenu
async function updateContent() {
  console.log('Updating content in background...');
  // Ici vous pourriez pré-charger du nouveau contenu
  return Promise.resolve();
}