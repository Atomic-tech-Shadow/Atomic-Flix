import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationManager } from '@/lib/notifications';

export function NotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Vérifier le support des notifications
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationManager.requestPermission();
    if (granted) {
      setPermission('granted');
      await notificationManager.schedulePeriodicNotifications();
      
      // Notification de test
      await notificationManager.showLocalNotification(
        'Notifications activées!',
        {
          body: 'Vous recevrez maintenant les notifications d\'ATOMIC FLIX',
          tag: 'notification-enabled'
        }
      );
    } else {
      setPermission('denied');
    }
  };

  const testNotification = async () => {
    await notificationManager.notifyNewAnime('Attack on Titan Final Season');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {permission === 'granted' ? (
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          <span className="text-sm text-green-400">Notifications activées</span>
          <Button
            variant="outline"
            size="sm"
            onClick={testNotification}
            className="text-xs"
          >
            Test
          </Button>
        </div>
      ) : permission === 'denied' ? (
        <div className="flex items-center gap-2">
          <BellOff className="h-4 w-4 text-red-400" />
          <span className="text-sm text-red-400">Notifications désactivées</span>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEnableNotifications}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Activer les notifications
        </Button>
      )}
    </div>
  );
}