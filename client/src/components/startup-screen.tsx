import { useState, useEffect } from 'react';

interface StartupScreenProps {
  onComplete: () => void;
}

export function StartupScreen({ onComplete }: StartupScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Fallback: toujours terminer après 5 secondes max
    const fallbackTimer = setTimeout(() => {
      console.log('Startup screen fallback timeout');
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  const handleVideoEnd = () => {
    console.log('Video ended');
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleVideoError = (e: any) => {
    console.error('Video error:', e);
    setVideoError(true);
    // Si erreur vidéo, passer directement à l'app
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 1000);
  };

  if (!isVisible) {
    return null;
  }

  if (videoError) {
    // Écran de démarrage simple avec logo si vidéo échoue
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-4 atomic-gradient-text">
            ATOMIC FLIX
          </div>
          <div className="text-gray-400">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <video
        autoPlay
        muted
        playsInline
        loop={false}
        className="w-full h-full object-cover"
        src="/assets/startup-video.mp4"
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      />
      
      {/* Bouton pour passer l'intro */}
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onComplete, 100);
        }}
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 px-4 py-2 rounded-lg transition-all duration-300 text-sm"
      >
        Passer
      </button>
    </div>
  );
}