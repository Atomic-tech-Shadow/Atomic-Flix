import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
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

// Force reload on first visit to ensure latest version
if (!sessionStorage.getItem('visitedBefore')) {
  sessionStorage.setItem('visitedBefore', 'true');
  if (window.location.pathname === '/' && !window.location.search) {
    window.location.href = window.location.origin + '/?v=' + Date.now();
  }
}

// Render app and remove loading screen
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Remove loading screen after a short delay to ensure app is mounted
setTimeout(removeLoadingScreen, 1000);
