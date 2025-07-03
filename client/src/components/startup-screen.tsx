import { useState, useEffect } from 'react';

interface StartupScreenProps {
  onComplete: () => void;
}

export function StartupScreen({ onComplete }: StartupScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Durée de la vidéo + petit délai
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Délai pour l'animation de sortie
    }, 4000); // Ajustez selon la durée de votre vidéo

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-black z-50 animate-fade-out">
        <video
          autoPlay
          muted
          className="w-full h-full object-cover opacity-0"
          src="/assets/startup-video.mp4"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <video
        autoPlay
        muted
        loop={false}
        className="w-full h-full object-cover"
        src="/assets/startup-video.mp4"
        onEnded={() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }}
      />
      
      {/* Overlay avec logo ATOMIC FLIX optionnel */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          {/* Vous pouvez ajouter le logo ici si souhaité */}
        </div>
      </div>
    </div>
  );
}