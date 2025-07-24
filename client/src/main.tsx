import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { notificationManager } from "./lib/notifications";

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

// iOS Safari specific loading timeout handler
const handleIOSLoadingTimeout = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    // Set a 15 second timeout for iOS Safari
    setTimeout(() => {
      const loadingElement = document.getElementById('initial-loading');
      if (loadingElement) {
        console.log('iOS Safari detected - forcing app initialization');
        // Force remove loading screen and initialize app
        removeLoadingScreen();
        // If still stuck, try to reinitialize
        setTimeout(() => {
          if (!document.querySelector('[data-app-loaded]')) {
            console.log('App not loaded - forcing page reload');
            window.location.reload();
          }
        }, 2000);
      }
    }, 15000);
  }
};

// Force cache bust for iOS Safari and all browsers
const forceCacheBust = () => {
  // Clear localStorage cache keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('atomic-flix-cache-') || key.startsWith('vite-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage except for visit tracking
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key !== 'visitedBefore') {
      sessionStorage.removeItem(key);
    }
  });
  
  // Force reload with timestamp for all visits
  const hasTimestamp = window.location.search.includes('v=');
  if (!hasTimestamp) {
    const separator = window.location.search ? '&' : '?';
    window.location.href = window.location.href + separator + 'v=' + Date.now();
  }
};

// Apply cache bust on every visit
if (!sessionStorage.getItem('visitedBefore')) {
  sessionStorage.setItem('visitedBefore', 'true');
  forceCacheBust();
} else {
  // Even for returning visitors, apply cache bust every 5 minutes
  const lastCacheBust = localStorage.getItem('lastCacheBust');
  const now = Date.now();
  if (!lastCacheBust || (now - parseInt(lastCacheBust)) > 300000) {
    localStorage.setItem('lastCacheBust', now.toString());
    forceCacheBust();
  }
}

// Initialize iOS loading timeout handler
handleIOSLoadingTimeout();

// Render app and remove loading screen
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Remove loading screen after a short delay to ensure app is mounted
setTimeout(removeLoadingScreen, 1000);
