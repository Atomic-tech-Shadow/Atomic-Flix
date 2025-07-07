// Script pour diagnostiquer et corriger l'écran blanc
(function() {
  'use strict';
  
  console.log('🔧 ATOMIC FLIX - Diagnostic d\'écran blanc activé');
  
  // Fonction de diagnostic
  function diagnoseWhiteScreen() {
    const checks = {
      domReady: document.readyState,
      hasRoot: !!document.getElementById('root'),
      hasLoader: !!document.getElementById('initial-loader'),
      userAgent: navigator.userAgent,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      url: window.location.href
    };
    
    console.log('📊 Diagnostic:', checks);
    return checks;
  }
  
  // Forcer la suppression du cache
  function clearCache() {
    if ('caches' in window) {
      caches.keys().then(function(names) {
        names.forEach(function(name) {
          caches.delete(name);
        });
      });
    }
  }
  
  // Vérification de fallback
  function ensureAppLoads() {
    setTimeout(function() {
      const loader = document.getElementById('initial-loader');
      const root = document.getElementById('root');
      
      if (loader && loader.style.display !== 'none') {
        console.warn('⚠️ Loader toujours visible après 5s, forçage de masquage');
        loader.style.display = 'none';
      }
      
      if (root && root.children.length <= 1) {
        console.error('❌ App non chargée après 5s, rechargement...');
        window.location.reload(true);
      }
    }, 5000);
  }
  
  // Exécution
  diagnoseWhiteScreen();
  clearCache();
  ensureAppLoads();
  
  // Surveillance continue
  let checkCount = 0;
  const monitor = setInterval(function() {
    checkCount++;
    const root = document.getElementById('root');
    
    if (root && root.children.length > 1) {
      console.log('✅ App chargée avec succès');
      clearInterval(monitor);
    } else if (checkCount > 20) {
      console.error('❌ Timeout: App non chargée après 10s');
      clearInterval(monitor);
      window.location.reload(true);
    }
  }, 500);
  
})();