import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationManager } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';

export function SimpleNotificationButton() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier le statut actuel des notifications
    const permission = notificationManager.getPermissionStatus();
    setIsEnabled(permission === 'granted');
  }, []);

  const toggleNotifications = async () => {
    setIsLoading(true);
    
    try {
      if (isEnabled) {
        // Désactiver les notifications
        localStorage.setItem('atomic-flix-notifications-enabled', 'false');
        setIsEnabled(false);
        toast({
          title: "Notifications désactivées",
          description: "Vous ne recevrez plus de notifications"
        });
      } else {
        // Activer les notifications
        const granted = await notificationManager.requestPermission();
        
        if (granted) {
          localStorage.setItem('atomic-flix-notifications-enabled', 'true');
          localStorage.setItem('atomic-flix-auto-notifications', 'enabled');
          await notificationManager.schedulePeriodicNotifications();
          setIsEnabled(true);
          
          // Notification de bienvenue
          await notificationManager.showLocalNotification(
            "Notifications activées !",
            {
              body: "Vous recevrez maintenant les dernières mises à jour d'ATOMIC FLIX",
              tag: "enable-notification"
            }
          );
          
          toast({
            title: "Notifications activées",
            description: "Vous recevrez les dernières mises à jour"
          });
        } else {
          toast({
            title: "Permission refusée",
            description: "Autorisez les notifications dans les paramètres du navigateur",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du toggle des notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleNotifications}
      disabled={isLoading}
      className="atomic-hover-scale hover:text-cyan-400 transition-all duration-300 relative"
    >
      {isEnabled ? (
        <Bell className="h-5 w-5 text-cyan-400" />
      ) : (
        <BellOff className="h-5 w-5 text-gray-400" />
      )}
      
      {/* Glow effect when enabled */}
      {isEnabled && (
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-100 transition-opacity duration-300 -z-10" />
      )}
    </Button>
  );
}