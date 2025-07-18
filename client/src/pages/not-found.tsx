import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Vidéo en arrière-plan */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src="/assets/error-404-video.mp4"
      />
      
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          {/* Logo ATOMIC FLIX */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold atomic-gradient-text mb-4">
              404
            </h1>
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              ATOMIC FLIX
            </div>
            <div className="text-cyan-400 text-lg">
              Page introuvable dans l'univers
            </div>
          </div>

          {/* Message d'erreur stylisé */}
          <div className="atomic-glass p-8 rounded-2xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Oops ! Cette page n'existe pas
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Il semblerait que cette page se soit perdue dans l'espace-temps. 
              Retournez à l'accueil pour découvrir nos animes.
            </p>
            
            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation("/")}
                className="atomic-button flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Retour à l'accueil
              </Button>
              
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Page précédente
              </Button>
            </div>
          </div>

          {/* Effet de particules/étoiles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-pulse delay-100"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-70 animate-pulse delay-200"></div>
            <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-60 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
