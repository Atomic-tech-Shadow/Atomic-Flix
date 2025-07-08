// Système de notifications pour ATOMIC FLIX

export class NotificationManager {
  private static instance: NotificationManager;
  private registration: ServiceWorkerRegistration | null = null;

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
      return true;
    } catch (error) {
      console.error('Erreur d\'initialisation des notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
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
    } catch (error) {
      console.log('Periodic sync non supporté:', error);
    }
  }
}

// Instance globale
export const notificationManager = NotificationManager.getInstance();