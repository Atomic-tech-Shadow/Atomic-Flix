import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { notificationManager } from "./lib/notifications";

// Détection Firefox iOS
const isFirefoxIOS = () => {
  const ua = navigator.userAgent;
  return ua.includes('Firefox') && (ua.includes('iPhone') || ua.includes('iPad'));
};

// Logging spécial pour Firefox iOS
const firefoxLog = (message: string, data?: any) => {
  console.log(`[Firefox iOS Debug] ${message}`, data || '');
};

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Initialiser les notifications
      const notificationsReady = await notificationManager.init();
      console.log('Notifications initialized:', notificationsReady);
      
      // Vérifier si l'utilisateur souhaite activer les notifications automatiquement
      const autoNotifications = localStorage.getItem('atomic-flix-auto-notifications');
      if (autoNotifications === 'enabled' && notificationsReady) {
        await notificationManager.requestPermission();
        await notificationManager.schedulePeriodicNotifications();
      }
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

// Remove loading screen when React app is ready
const removeLoadingScreen = () => {
  const loadingElement = document.getElementById('initial-loading');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    loadingElement.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => {
      loadingElement.remove();
    }, 500);
  }
};

// iOS loading timeout handler - shorter for Firefox compatibility
const handleIOSLoadingTimeout = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    setTimeout(() => {
      const loadingElement = document.getElementById('initial-loading');
      if (loadingElement) {
        console.log('iOS detected - removing loading screen');
        removeLoadingScreen();
      }
    }, 2000); // Reduced timeout for better mobile experience
  }
};

// Simple cache cleanup without forced redirects
const cleanupCache = () => {
  try {
    // Clear old cache keys only
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('atomic-flix-cache-') || key.startsWith('vite-old-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.log('Cache cleanup failed:', error);
  }
};

// Clean cache on first visit only
if (!sessionStorage.getItem('visitedBefore')) {
  sessionStorage.setItem('visitedBefore', 'true');
  cleanupCache();
}

// Firefox iOS: Logique spéciale de chargement
if (isFirefoxIOS()) {
  firefoxLog('Firefox iOS détecté - initialisation spéciale');
  
  // Supprimer l'écran de chargement immédiatement pour Firefox
  setTimeout(() => {
    removeLoadingScreen();
    firefoxLog('Loading screen supprimé pour Firefox iOS');
  }, 500);
  
  // Rendre l'app sans attendre
  try {
    const root = createRoot(document.getElementById("root")!);
    root.render(<App />);
    firefoxLog('App rendue avec succès');
  } catch (error) {
    firefoxLog('Erreur lors du rendu:', error);
    // Fallback: essayer de recharger la page
    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 1000);
  }
} else {
  // Logique normale pour autres navigateurs
  handleIOSLoadingTimeout();
  
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
  setTimeout(() => {
    const appElement = document.querySelector('[data-app-loaded]');
    if (appElement) {
      removeLoadingScreen();
    } else {
      setTimeout(removeLoadingScreen, 2000);
    }
  }, 1500);
}
