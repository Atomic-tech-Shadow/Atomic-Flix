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
import MangaReaderPage from "@/pages/manga-reader";
import AboutPage from "@/pages/about";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
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
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>ATOMIC FLIX</h1>
            <p style={{ marginBottom: '20px' }}>Erreur de chargement détectée</p>
            <button
              onClick={() => window.location.reload()}
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
      <Route path="/manga/:id/reader" component={MangaReaderPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
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
