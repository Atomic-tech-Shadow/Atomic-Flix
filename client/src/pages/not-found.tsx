import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: 'var(--atomic-dark)' }}>
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        src="/assets/error-404-video.mp4"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--atomic-dark)]/60 via-transparent to-[var(--atomic-dark)]/80" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-1 h-1 bg-purple-300 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-lg w-full">

          <div className="mb-8">
            <h1 className="text-7xl sm:text-9xl font-black atomic-gradient-text leading-none mb-2">
              404
            </h1>
            <p className="text-white/40 text-sm sm:text-base tracking-widest uppercase">
              Page introuvable dans l&apos;univers
            </p>
          </div>

          <div className="atomic-glass p-6 sm:p-8 rounded-2xl mb-6">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/atomic-logo-round.png"
                alt="ATOMIC FLIX"
                className="h-14 w-14 atomic-logo-round"
                style={{ boxShadow: '0 0 24px rgba(0,240,255,0.35)' }}
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Cette page s&apos;est perdue dans l&apos;espace-temps
            </h2>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Retournez à l&apos;accueil pour découvrir nos animes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setLocation("/")}
                className="atomic-button flex items-center gap-2 justify-center"
                data-testid="button-go-home"
              >
                <Home className="w-4 h-4" />
                Retour à l&apos;accueil
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-white/15 text-white/60 hover:bg-white/6 hover:text-white hover:border-white/30 flex items-center gap-2 justify-center transition-all duration-200"
                data-testid="button-go-back"
              >
                <ArrowLeft className="w-4 h-4" />
                Page précédente
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
