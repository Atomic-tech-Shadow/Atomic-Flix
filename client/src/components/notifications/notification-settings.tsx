import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { notificationManager } from '@/lib/notifications';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState({
    newAnimes: true,
    newEpisodes: true,
    trendingUpdates: true,
    reminders: true,
    appUpdates: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const savedSettings = localStorage.getItem('atomic-flix-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Vérifier le statut des permissions
    setPermissionStatus(notificationManager.getPermissionStatus());
  }, []);

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationManager.requestPermission();
      setPermissionStatus(notificationManager.getPermissionStatus());
      
      if (granted) {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez maintenant des notifications d'ATOMIC FLIX",
        });
        
        // Activer les notifications périodiques
        await notificationManager.schedulePeriodicNotifications();
        
        // Envoyer une notification de test
        await notificationManager.showLocalNotification(
          "Notifications activées!",
          {
            body: "Vous recevrez maintenant les dernières mises à jour d'ATOMIC FLIX",
            tag: "permission-granted"
          }
        );
      } else {
        toast({
          title: "Permissions refusées",
          description: "Vous ne recevrez pas de notifications",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('atomic-flix-notification-settings', JSON.stringify(newSettings));
    
    toast({
      title: "Paramètres sauvegardés",
      description: `Notifications ${value ? 'activées' : 'désactivées'} pour ${getSettingLabel(key)}`,
    });
  };

  const getSettingLabel = (key: string) => {
    const labels = {
      newAnimes: 'nouveaux animes',
      newEpisodes: 'nouveaux épisodes',
      trendingUpdates: 'contenus populaires',
      reminders: 'rappels',
      appUpdates: 'mises à jour app'
    };
    return labels[key as keyof typeof labels] || key;
  };

  const getPermissionBadge = () => {
    switch (permissionStatus) {
      case 'granted':
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Activées</Badge>;
      case 'denied':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Refusées</Badge>;
      default:
        return <Badge variant="secondary">Non configurées</Badge>;
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-white">Notifications</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            Gérez vos préférences de notification
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Statut des permissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">Statut des notifications</Label>
              {getPermissionBadge()}
            </div>
            
            {permissionStatus !== 'granted' && (
              <Button
                onClick={handlePermissionRequest}
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isLoading ? 'Demande en cours...' : 'Activer les notifications'}
              </Button>
            )}
          </div>

          {/* Paramètres détaillés */}
          {permissionStatus === 'granted' && (
            <div className="space-y-4">
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-white mb-3">Types de notifications</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newAnimes" className="text-gray-300">
                      Nouveaux animes
                    </Label>
                    <Switch
                      id="newAnimes"
                      checked={settings.newAnimes}
                      onCheckedChange={(checked) => handleSettingChange('newAnimes', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newEpisodes" className="text-gray-300">
                      Nouveaux épisodes
                    </Label>
                    <Switch
                      id="newEpisodes"
                      checked={settings.newEpisodes}
                      onCheckedChange={(checked) => handleSettingChange('newEpisodes', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trendingUpdates" className="text-gray-300">
                      Contenus populaires
                    </Label>
                    <Switch
                      id="trendingUpdates"
                      checked={settings.trendingUpdates}
                      onCheckedChange={(checked) => handleSettingChange('trendingUpdates', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminders" className="text-gray-300">
                      Rappels
                    </Label>
                    <Switch
                      id="reminders"
                      checked={settings.reminders}
                      onCheckedChange={(checked) => handleSettingChange('reminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appUpdates" className="text-gray-300">
                      Mises à jour app
                    </Label>
                    <Switch
                      id="appUpdates"
                      checked={settings.appUpdates}
                      onCheckedChange={(checked) => handleSettingChange('appUpdates', checked)}
                    />
                  </div>
                </div>
              </div>
              

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}