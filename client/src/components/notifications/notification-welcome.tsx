import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notificationManager } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';

export function NotificationWelcome() {
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà été accueilli pour les notifications
    const hasSeenWelcome = localStorage.getItem('atomic-flix-notification-welcome');
    const permissionStatus = notificationManager.getPermissionStatus();
    
    // Afficher le welcome si l'utilisateur n'a pas vu le message et n'a pas encore configuré les notifications
    if (!hasSeenWelcome && permissionStatus === 'default') {
      // Attendre un peu avant d'afficher pour que l'utilisateur s'habitue à l'interface
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    }
  }, []);

  const handleAccept = async () => {
    try {
      const granted = await notificationManager.requestPermission();
      
      if (granted) {
        // Activer les notifications automatiques pour les prochaines visites
        localStorage.setItem('atomic-flix-auto-notifications', 'enabled');
        
        // Programmer les notifications périodiques
        await notificationManager.schedulePeriodicNotifications();
        
        // Envoyer une notification de bienvenue
        await notificationManager.showLocalNotification(
          "Bienvenue sur ATOMIC FLIX! 📢",
          {
            body: "Vous recevrez maintenant les nouveaux épisodes ajoutés",
            tag: "welcome-notification"
          }
        );
        
        toast({
          title: "Notifications activées",
          description: "Vous recevrez les dernières mises à jour d'ATOMIC FLIX",
        });
      } else {
        toast({
          title: "Notifications refusées",
          description: "Vous pouvez les activer plus tard dans les paramètres",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation des notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive"
      });
    }
    
    // Marquer comme vu et fermer
    localStorage.setItem('atomic-flix-notification-welcome', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Marquer comme vu mais ne pas activer l'auto-activation
    localStorage.setItem('atomic-flix-notification-welcome', 'true');
    localStorage.setItem('atomic-flix-auto-notifications', 'disabled');
    setIsVisible(false);
    
    toast({
      title: "Notifications désactivées",
      description: "Vous pouvez les activer plus tard via l'icône cloche",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md atomic-glass border-white/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/15 rounded-full border border-cyan-500/20">
              <Bell className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-white text-base">
                Restez informé avec ATOMIC FLIX
              </CardTitle>
              <CardDescription className="text-white/40 text-sm">
                Ne manquez plus aucune nouveauté
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-white/60 text-sm space-y-2">
            <p>Activez les notifications pour recevoir :</p>
            <ul className="space-y-1.5 ml-2 mt-2">
              {['Nouveaux épisodes ajoutés', 'Nouveaux épisodes disponibles', 'Mises à jour de contenu'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAccept}
              className="flex-1 atomic-button"
            >
              Activer
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 border-white/15 text-white/70 hover:text-white hover:bg-white/6 hover:border-white/25"
            >
              Plus tard
            </Button>
          </div>
          
          <p className="text-xs text-white/30 text-center">
            Modifiable à tout moment dans les paramètres
          </p>
        </CardContent>
      </Card>
    </div>
  );
}