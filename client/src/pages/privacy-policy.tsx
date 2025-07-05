import { Shield, Eye, Server, Database, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";

export default function PrivacyPolicy() {
  const lastUpdated = "5 juillet 2025";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 atomic-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre vie privée est notre priorité absolue
          </p>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
            Dernière mise à jour : {lastUpdated}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* No Data Collection */}
          <Card className="atomic-card border-green-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Eye className="w-6 h-6" />
                Aucune Collecte de Données
              </CardTitle>
              <CardDescription className="text-gray-300">
                Nous respectons totalement votre vie privée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Engagement Principal</h4>
                <p className="text-gray-300">
                  <strong>ATOMIC FLIX ne collecte, ne stocke et ne partage AUCUNE donnée personnelle.</strong> 
                  Nous n'utilisons pas de cookies de suivi, d'analyses comportementales, ou de systèmes de tracking.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Ce que nous NE collectons PAS :</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Aucune information personnelle (nom, email, âge, etc.)</li>
                  <li>Aucune donnée de navigation ou d'utilisation</li>
                  <li>Aucun historique de visionnage</li>
                  <li>Aucune géolocalisation</li>
                  <li>Aucun cookie de suivi</li>
                  <li>Aucune adresse IP stockée</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Server className="w-6 h-6" />
                Informations Techniques
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comment fonctionne notre application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Architecture Frontend-Only</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX est une application 100% frontend qui fonctionne directement dans votre navigateur. 
                  Nous n'avons pas de serveur backend qui pourrait collecter vos données.
                </p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Sources Externes</h4>
                <p className="text-gray-300">
                  L'application utilise des API externes pour récupérer les informations sur les animes. 
                  Ces requêtes sont faites directement depuis votre navigateur vers les services tiers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage */}
          <Card className="atomic-card border-purple-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Database className="w-6 h-6" />
                Stockage Local
              </CardTitle>
              <CardDescription className="text-gray-300">
                Données stockées uniquement sur votre appareil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Stockage Local du Navigateur</h4>
                <p className="text-gray-300">
                  Seules les données suivantes peuvent être stockées localement dans votre navigateur :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                  <li>Préférences de thème (clair/sombre)</li>
                  <li>Cache des images pour améliorer les performances</li>
                  <li>Données temporaires de l'application (PWA)</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  <strong>Important :</strong> Ces données restent sur votre appareil et ne sont jamais envoyées à nos serveurs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Disclaimer */}
          <Card className="atomic-card border-orange-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Server className="w-6 h-6" />
                Avertissement sur le Contenu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-orange-400 mb-2">Hébergement de Contenu</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX n'héberge aucune vidéo sur ses serveurs. Toutes les vidéos sont hébergées 
                  par des plateformes tierces. Pour toute réclamation de droit d'auteur, contactez 
                  directement la plateforme d'hébergement vidéo concernée.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Mail className="w-6 h-6" />
                Nous Contacter
              </CardTitle>
              <CardDescription className="text-gray-300">
                Pour toute question concernant cette politique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Si vous avez des questions concernant cette politique de confidentialité, 
                n'hésitez pas à nous contacter :
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-purple-300">Email</p>
                    <p className="text-gray-300">sorokomarco@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-300">WhatsApp</p>
                    <p className="text-gray-300">+228 71 39 45 85</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card className="atomic-card border-gray-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-gray-300">
                Modifications de cette Politique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Cette politique de confidentialité peut être mise à jour occasionnellement. 
                Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
              </p>
              <p className="text-gray-300 mt-2">
                <strong>Date de dernière mise à jour :</strong> {lastUpdated}
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="text-center py-8 atomic-fade-in">
          <p className="text-gray-400">
            Développé avec ❤️ par Cid AKUE pour les fans d'anime
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2025 ATOMIC FLIX - Cid AKUE. Tous droits réservés.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}