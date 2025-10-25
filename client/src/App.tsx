import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { NotificationWelcome } from "@/components/notifications/notification-welcome";
import NotFound from "@/pages/not-found";
import AnimeSamaPage from "@/pages/anime-sama";
import AnimePage from "@/pages/anime";
import AnimePlayerPage from "@/pages/anime-player";
import FirefoxDebugPage from "@/pages/firefox-debug";
import { Component, ErrorInfo, ReactNode } from "react";

// Error Boundary pour capturer les erreurs sur Firefox iPhone
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Détection Firefox iOS
      const isFirefoxIOS = navigator.userAgent.includes('Firefox') && 
                          (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad'));
      
      // Rechargement automatique pour Firefox iOS - avec compteur d'erreurs
      if (isFirefoxIOS) {
        const errorCount = parseInt(localStorage.getItem('firefox-error-count') || '0') + 1;
        localStorage.setItem('firefox-error-count', errorCount.toString());
        
        if (errorCount >= 3) {
          // Après 3 erreurs, rediriger vers la page de debug
          localStorage.removeItem('firefox-error-count');
          window.location.href = '/firefox-debug';
        } else {
          setTimeout(() => {
            window.location.href = window.location.pathname;
          }, 2000);
        }
      }
      
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00F0FF',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <img src="/assets/atomic-logo-round.png" alt="ATOMIC FLIX" style={{
              width: '80px', 
              height: '80px', 
              marginBottom: '20px',
              borderRadius: '50%',
              objectFit: 'cover'
            }} />
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>ATOMIC FLIX</h1>
            <p style={{ marginBottom: '20px' }}>
              {isFirefoxIOS ? 'Rechargement automatique...' : 'Erreur de chargement détectée'}
            </p>
            {!isFirefoxIOS && (
              <button
                onClick={() => window.location.href = window.location.pathname}
                style={{
                  background: 'linear-gradient(90deg, #00F0FF, #A855F7)',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                Recharger la page
              </button>
            )}
            {isFirefoxIOS && (
              <>
                <div style={{
                  width: '150px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  margin: '20px auto',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, #00F0FF, #A855F7)',
                    borderRadius: '2px',
                    animation: 'loadingBar 2s linear infinite'
                  }}></div>
                </div>
                <style>{`
                  @keyframes loadingBar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AnimeSamaPage} />
      <Route path="/anime-sama" component={AnimeSamaPage} />
      <Route path="/anime/:id" component={AnimePage} />
      <Route path="/anime/:id/player" component={AnimePlayerPage} />
      <Route path="/firefox-debug" component={FirefoxDebugPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div data-app-loaded="true">
          <TooltipProvider>
            <Toaster />
            <Router />
            <NotificationWelcome />
            <Analytics />
          </TooltipProvider>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
