import { Shield, Eye, Server, Database, Mail, Phone, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";

export default function PrivacyPolicy() {
  const lastUpdated = "22 juillet 2025";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 atomic-fade-in">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-cyan-400 max-w-2xl mx-auto">
            Votre vie privée est notre priorité absolue
          </p>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-300 bg-cyan-500/10">
            Dernière mise à jour : {lastUpdated}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* No Data Collection */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                👁️ Aucune Collecte de Données
              </CardTitle>
              <CardDescription className="text-gray-300">
                Nous respectons totalement votre vie privée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Engagement Principal</h4>
                <p className="text-gray-300">
                  <strong className="text-white">ATOMIC FLIX collecte uniquement les données nécessaires à la vérification Telegram.</strong> 
                  Nous n'utilisons pas de cookies de suivi, d'analyses comportementales, ou de systèmes de tracking publicitaire.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Données que nous collectons :</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><strong className="text-white">ID Telegram</strong> : Pour vérifier votre abonnement au canal</li>
                  <li><strong className="text-white">Nom Telegram</strong> : Pour personnaliser votre expérience</li>
                  <li><strong className="text-white">Statut d'abonnement</strong> : Pour contrôler l'accès au contenu</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Ce que nous NE collectons PAS :</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Aucune donnée de navigation ou d'utilisation</li>
                  <li>Aucun historique de visionnage</li>
                  <li>Aucune géolocalisation</li>
                  <li>Aucun cookie de suivi publicitaire</li>
                  <li>Aucune adresse IP stockée de manière permanente</li>
                  <li>Aucune donnée bancaire ou financière</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Telegram Integration */}
          <Card className="atomic-card border-blue-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                📱 Intégration Telegram
              </CardTitle>
              <CardDescription className="text-gray-300">
                Vérification d'abonnement et protection du contenu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Pourquoi nous utilisons Telegram</h4>
                <p className="text-gray-300">
                  Pour accéder au contenu exclusif d'ATOMIC FLIX, vous devez vous abonner à notre canal Telegram officiel. 
                  Cette vérification nous permet de construire une communauté engagée et de protéger notre contenu.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Données Telegram collectées</h4>
                <p className="text-gray-300">
                  • Votre ID Telegram (numérique unique)<br/>
                  • Votre prénom/nom d'utilisateur Telegram<br/>
                  • Votre statut d'abonnement au canal<br/>
                  Ces données sont stockées localement sur votre appareil et utilisées uniquement pour la vérification.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Sécurité et confidentialité</h4>
                <p className="text-gray-300">
                  Vos données Telegram sont traitées via l'API officielle Telegram Bot. 
                  Nous ne stockons pas vos messages privés ou autres informations sensibles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card className="atomic-card border-red-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                ⚖️ Disclaimer Légal Important
              </CardTitle>
              <CardDescription className="text-gray-300">
                Nature de l'application et responsabilités
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">🚨 NON-HÉBERGEMENT DE CONTENU</h4>
                <p className="text-gray-300">
                  <strong className="text-white">ATOMIC FLIX N'HÉBERGE AUCUN CONTENU VIDÉO OU MANGA.</strong>
                  <br/><br/>
                  Cette application fonctionne exclusivement comme un agrégateur de liens publiquement disponibles sur Internet. Nous ne stockons, n'hébergeons, ni ne distribuons aucun fichier multimédia protégé par le droit d'auteur.
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">📡 FONCTIONNEMENT TECHNIQUE</h4>
                <p className="text-gray-300">
                  • L'application utilise des APIs publiques pour indexer le contenu<br/>
                  • Tous les liens proviennent de sources externes tierces<br/>
                  • Aucun fichier média n'est stocké sur nos serveurs<br/>
                  • Nous agissons uniquement comme interface utilisateur
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">⚠️ RESPONSABILITÉ UTILISATEUR</h4>
                <p className="text-gray-300">
                  L'utilisateur est seul responsable de l'utilisation qu'il fait des liens fournis par l'application. Il appartient à chaque utilisateur de s'assurer de la légalité du contenu consulté dans sa juridiction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Copyright Section */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                📋 Droits d'Auteur et DMCA
              </CardTitle>
              <CardDescription className="text-gray-300">
                Respect de la propriété intellectuelle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">🛡️ RESPECT DES DROITS D'AUTEUR</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX respecte les droits de propriété intellectuelle. Si vous êtes propriétaire de droits d'auteur et pensez qu'un contenu porte atteinte à vos droits, contactez directement les plateformes d'hébergement concernées.
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">📞 PROCÉDURE DE RÉCLAMATION</h4>
                <p className="text-gray-300">
                  Pour toute réclamation concernant le droit d'auteur :<br/>
                  1. Identifiez la source d'hébergement du contenu<br/>
                  2. Contactez directement cette plateforme<br/>
                  3. ATOMIC FLIX ne peut pas retirer un contenu qu'elle n'héberge pas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                🖥️ Informations Techniques
              </CardTitle>
              <CardDescription className="text-gray-300">
                Comment fonctionne notre application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Architecture Mobile Native</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX est une application mobile React Native avec un backend minimal pour la vérification Telegram. 
                  La plupart des données restent sur votre appareil.
                </p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Sources Externes</h4>
                <p className="text-gray-300">
                  L'application utilise des API externes pour récupérer les informations sur les animes. 
                  Ces requêtes sont sécurisées et ne transmettent pas vos données personnelles.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage */}
          <Card className="atomic-card border-yellow-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                💾 Stockage Local
              </CardTitle>
              <CardDescription className="text-gray-300">
                Données stockées uniquement sur votre appareil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Stockage Local du Navigateur</h4>
                <p className="text-gray-300">
                  Seules les données suivantes peuvent être stockées localement dans votre navigateur :
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-1 mt-2">
                  <li>Préférences de thème et paramètres d'interface</li>
                  <li>ID et nom Telegram pour la vérification d'accès</li>
                  <li>Cache des images pour améliorer les performances</li>
                  <li>Données temporaires de l'application mobile</li>
                  <li>Historique de navigation local (non partagé)</li>
                </ul>
                <p className="text-gray-300 mt-2">
                  <strong className="text-white">Important :</strong> Ces données restent sur votre appareil et ne sont jamais envoyées à nos serveurs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Disclaimer */}
          <Card className="atomic-card border-orange-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                ⚠️ Avertissement sur le Contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Responsabilité du Contenu</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX n'héberge aucun contenu directement. Nous servons uniquement d'interface 
                  pour accéder à des contenus hébergés par des plateformes tierces externes.
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Protection des Données</h4>
                <p className="text-gray-300">
                  Votre utilisation de l'application reste entièrement privée. Aucune donnée de visionnage 
                  ou de navigation n'est collectée, stockée ou partagée.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                📧 Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Pour toute question concernant cette politique de confidentialité, 
                vous pouvez nous contacter :
              </p>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <Mail className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="font-medium text-cyan-300">Email</p>
                  <p className="text-gray-300">atomictech228@gmail.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <div className="bg-white/5 rounded-lg p-6 text-center atomic-fade-in">
          <p className="text-gray-300 mb-2">
            Cette politique de confidentialité peut être mise à jour occasionnellement. 
            Les changements seront toujours communiqués dans cette section.
          </p>
          <p className="text-cyan-400 font-medium">
            Dernière mise à jour : {lastUpdated}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}