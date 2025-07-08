// Système de notifications pour ATOMIC FLIX

export interface NotificationData {
  type: 'new-anime' | 'new-episode' | 'app-update' | 'watchlist-update' | 'trending' | 'reminder';
  title: string;
  body: string;
  icon?: string;
  data?: any;
  url?: string;
}

export class NotificationManager {
  private static instance: NotificationManager;
  private registration: ServiceWorkerRegistration | null = null;
  private permissionGranted: boolean = false;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async init(): Promise<boolean> {
    // Vérifier le support des notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.log('Les notifications ne sont pas supportées');
      return false;
    }

    // Obtenir la registration du service worker
    try {
      this.registration = await navigator.serviceWorker.ready;
      this.permissionGranted = Notification.permission === 'granted';
      
      // Configurer les gestionnaires d'événements
      this.setupEventListeners();
      
      return true;
    } catch (error) {
      console.error('Erreur d\'initialisation des notifications:', error);
      return false;
    }
  }

  private setupEventListeners(): void {
    // Écouter les messages du service worker
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
          this.handleNotificationClick(event.data.notification);
        }
      });
    }
  }

  private handleNotificationClick(notificationData: any): void {
    console.log('Notification clicked:', notificationData);
    
    // Rediriger vers la page appropriée selon le type de notification
    if (notificationData.url) {
      window.location.href = notificationData.url;
    } else if (notificationData.data) {
      switch (notificationData.data.type) {
        case 'new-anime':
          window.location.href = '/';
          break;
        case 'new-episode':
          if (notificationData.data.animeId) {
            window.location.href = `/anime/${notificationData.data.animeId}`;
          }
          break;
        case 'watchlist-update':
          window.location.href = '/';
          break;
        default:
          window.location.href = '/';
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      this.permissionGranted = false;
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      
      // Sauvegarder la préférence utilisateur
      localStorage.setItem('atomic-flix-notifications', permission);
      
      return this.permissionGranted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  isPermissionGranted(): boolean {
    return this.permissionGranted;
  }

  async showLocalNotification(title: string, options: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  } = {}): Promise<void> {
    if (!await this.requestPermission()) {
      console.log('Permission de notification refusée');
      return;
    }

    const notificationOptions = {
      body: options.body || 'Nouveau contenu disponible!',
      icon: options.icon || '/assets/atomic-logo-new.png',
      badge: options.badge || '/assets/atomic-logo-new.png',
      tag: options.tag || 'atomic-flix-notification',
      vibrate: [200, 100, 200],
      data: options.data || {},
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
      ]
    };

    if (this.registration) {
      await this.registration.showNotification(title, notificationOptions);
    } else {
      new Notification(title, notificationOptions);
    }
  }

  // Notifications spécifiques pour ATOMIC FLIX
  async notifyNewAnime(animeTitle: string): Promise<void> {
    await this.showLocalNotification(
      'Nouvel anime disponible!',
      {
        body: `${animeTitle} est maintenant disponible sur ATOMIC FLIX`,
        tag: 'new-anime',
        data: { type: 'new-anime', title: animeTitle }
      }
    );
  }

  async notifyNewEpisode(animeTitle: string, episodeNumber: number): Promise<void> {
    await this.showLocalNotification(
      'Nouvel épisode!',
      {
        body: `${animeTitle} - Épisode ${episodeNumber} est disponible`,
        tag: 'new-episode',
        data: { type: 'new-episode', title: animeTitle, episode: episodeNumber }
      }
    );
  }

  async notifyAppUpdate(version: string): Promise<void> {
    await this.showLocalNotification(
      'ATOMIC FLIX mis à jour!',
      {
        body: `Version ${version} disponible avec de nouvelles fonctionnalités`,
        tag: 'app-update',
        data: { type: 'app-update', version }
      }
    );
  }

  async schedulePeriodicNotifications(): Promise<void> {
    if (!this.registration) return;

    // Vérifier les nouveaux contenus toutes les heures
    try {
      await this.registration.periodicSync.register('content-check', {
        minInterval: 60 * 60 * 1000 // 1 heure
      });
      console.log('Notifications périodiques activées');
    } catch (error) {
      console.log('Periodic sync non supporté:', error);
      // Fallback: utiliser setInterval pour vérifier périodiquement
      this.setupPeriodicCheck();
    }
  }

  private setupPeriodicCheck(): void {
    // Vérifier les nouveaux contenus toutes les 30 minutes
    setInterval(async () => {
      if (this.permissionGranted) {
        await this.checkForNewContent();
      }
    }, 30 * 60 * 1000); // 30 minutes
  }

  private async checkForNewContent(): Promise<void> {
    try {
      // Vérifier s'il y a de nouveaux animes populaires
      const { animeAPI } = await import('./api');
      const response = await animeAPI.getTrending();
      
      if (response && response.success && response.results) {
        // Récupérer les derniers animes vus
        const lastSeenAnimes = JSON.parse(localStorage.getItem('atomic-flix-last-seen') || '[]');
        const currentAnimes = response.results.slice(0, 5).map((anime: any) => anime.id);
        
        // Vérifier les nouveaux animes
        const newAnimes = currentAnimes.filter((id: string) => !lastSeenAnimes.includes(id));
        
        if (newAnimes.length > 0) {
          await this.notifyTrendingUpdate(newAnimes.length);
          localStorage.setItem('atomic-flix-last-seen', JSON.stringify(currentAnimes));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du contenu:', error);
    }
  }

  // Nouvelles fonctions de notification
  async notifyTrendingUpdate(count: number): Promise<void> {
    await this.showLocalNotification(
      'Nouveaux animes populaires!',
      {
        body: `${count} nouveaux animes sont maintenant populaires sur ATOMIC FLIX`,
        tag: 'trending-update',
        data: { type: 'trending', count }
      }
    );
  }

  async notifyWatchlistUpdate(animeTitle: string, episodeCount: number): Promise<void> {
    await this.showLocalNotification(
      'Mise à jour de votre liste!',
      {
        body: `${animeTitle} a ${episodeCount} nouveaux épisodes disponibles`,
        tag: 'watchlist-update',
        data: { type: 'watchlist-update', title: animeTitle, episodes: episodeCount }
      }
    );
  }

  async notifyReminder(message: string): Promise<void> {
    await this.showLocalNotification(
      'Rappel ATOMIC FLIX',
      {
        body: message,
        tag: 'reminder',
        data: { type: 'reminder', message }
      }
    );
  }

  // Fonction pour programmer un rappel
  async scheduleReminder(message: string, delay: number): Promise<void> {
    setTimeout(async () => {
      if (this.permissionGranted) {
        await this.notifyReminder(message);
      }
    }, delay);
  }
}

// Instance globale
export const notificationManager = NotificationManager.getInstance();