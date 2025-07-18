import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationSettings } from './notification-settings';
import { notificationManager } from '@/lib/notifications';

export function NotificationButton() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Vérifier le statut des permissions au chargement
    setPermissionStatus(notificationManager.getPermissionStatus());
    
    // Écouter les changements de permissions
    const checkPermission = () => {
      setPermissionStatus(notificationManager.getPermissionStatus());
    };
    
    // Vérifier périodiquement le statut
    const interval = setInterval(checkPermission, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getButtonIcon = () => {
    if (permissionStatus === 'granted') {
      return <Bell className="w-4 h-4" />;
    } else {
      return <BellOff className="w-4 h-4" />;
    }
  };

  const getButtonColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'text-cyan-400 hover:text-cyan-300';
      case 'denied':
        return 'text-red-400 hover:text-red-300';
      default:
        return 'text-gray-400 hover:text-gray-300';
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSettingsOpen(true)}
        className={`${getButtonColor()} hover:bg-gray-800 transition-colors`}
        title="Paramètres de notification"
      >
        {getButtonIcon()}
      </Button>
      
      <NotificationSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}