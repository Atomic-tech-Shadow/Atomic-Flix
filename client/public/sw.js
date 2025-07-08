const CACHE_NAME = 'atomic-flix-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/atomic-logo-new.png',
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
  
  let notificationData = {
    title: 'ATOMIC FLIX',
    body: 'Nouveau contenu disponible!',
    type: 'general',
    icon: '/assets/atomic-logo-new.png',
    badge: '/assets/atomic-logo-new.png'
  };
  
  // Parser les données de la notification
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [200, 100, 200],
    data: {
      type: notificationData.type,
      dateOfArrival: Date.now(),
      ...notificationData
    },
    actions: [
      {
        action: 'view',
        title: 'Voir',
        icon: '/assets/atomic-logo-new.png'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  console.log('Notification click received.');
  
  event.notification.close();
  
  const notificationData = event.notification.data;
  let targetUrl = '/';
  
  // Déterminer l'URL cible selon le type de notification
  if (notificationData) {
    switch (notificationData.type) {
      case 'new-anime':
        targetUrl = '/';
        break;
      case 'new-episode':
        targetUrl = notificationData.animeId ? `/anime/${notificationData.animeId}` : '/';
        break;
      case 'watchlist-update':
        targetUrl = '/';
        break;
      case 'trending':
        targetUrl = '/';
        break;
      case 'reminder':
        targetUrl = '/';
        break;
      default:
        targetUrl = '/';
    }
  }
  
  // Actions spécifiques selon le bouton cliqué
  if (event.action === 'explore' || event.action === 'view') {
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  } else if (event.action === 'dismiss' || event.action === 'close') {
    // Fermer la notification seulement
    return;
  } else {
    // Clic sur la notification principale
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  }
  
  // Envoyer un message au client principal
  event.waitUntil(
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLICKED',
          notification: notificationData
        });
      });
    })
  );
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
  
  try {
    // Vérifier les nouveaux animes populaires
    const response = await fetch('https://anime-sama-scraper.vercel.app/api/trending');
    const data = await response.json();
    
    if (data.success && data.results) {
      // Sauvegarder les nouveaux contenus dans le cache
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/trending-cache', new Response(JSON.stringify(data)));
      
      // Vérifier s'il y a de nouveaux animes
      const lastCheck = await cache.match('/api/last-check');
      let lastCheckData = null;
      
      if (lastCheck) {
        lastCheckData = await lastCheck.json();
      }
      
      // Comparer avec les données précédentes
      if (lastCheckData && lastCheckData.results) {
        const newAnimes = data.results.filter(anime => 
          !lastCheckData.results.some(oldAnime => oldAnime.id === anime.id)
        );
        
        if (newAnimes.length > 0) {
          // Envoyer notification pour les nouveaux épisodes
          const animeNames = newAnimes.slice(0, 3).map(anime => anime.title).join(', ');
          const bodyText = newAnimes.length === 1 
            ? `${animeNames} - nouvel épisode disponible`
            : `${animeNames}${newAnimes.length > 3 ? ' et autres' : ''} - nouveaux épisodes disponibles`;
            
          await self.registration.showNotification('New épisode ajouté 📢', {
            body: bodyText,
            icon: newAnimes[0] ? newAnimes[0].image : '/assets/atomic-logo-new.png',
            image: newAnimes[0] ? newAnimes[0].image : undefined,
            badge: '/assets/atomic-logo-new.png',
            data: {
              type: 'new-episode',
              count: newAnimes.length,
              animes: newAnimes
            },
            actions: [
              { action: 'view', title: 'Voir les nouveaux épisodes' },
              { action: 'dismiss', title: 'Plus tard' }
            ]
          });
        }
      }
      
      // Sauvegarder la dernière vérification
      await cache.put('/api/last-check', new Response(JSON.stringify(data)));
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu:', error);
  }
  
  return Promise.resolve();
}