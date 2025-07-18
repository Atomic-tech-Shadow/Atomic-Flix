import { FileText, AlertTriangle, Shield, Scale, Users, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/main-layout";

export default function TermsOfService() {
  const lastUpdated = "5 juillet 2025";

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 atomic-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-12 w-12 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Conditions d'Utilisation
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Règles et conditions d'utilisation d'ATOMIC FLIX
          </p>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
            Dernière mise à jour : {lastUpdated}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Acceptance */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Scale className="w-6 h-6" />
                Acceptation des Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                En utilisant ATOMIC FLIX, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
              </p>
              
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">Définitions</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li><strong>"Application"</strong> : ATOMIC FLIX et tous ses services</li>
                  <li><strong>"Utilisateur"</strong> : Toute personne utilisant l'application</li>
                  <li><strong>"Contenu"</strong> : Animes, mangas et autres médias disponibles</li>
                  <li><strong>"Développeur"</strong> : Cid AKUE, créateur d'ATOMIC FLIX</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="atomic-card border-purple-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Users className="w-6 h-6" />
                Description du Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                ATOMIC FLIX est une application de streaming d'anime gratuite qui permet aux utilisateurs 
                de rechercher, découvrir et regarder des animes en ligne.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-400">Fonctionnalités disponibles :</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Recherche et navigation d'animes</li>
                  <li>Streaming vidéo en ligne</li>
                  <li>Lecture de manga</li>
                  <li>Interface responsive (web et mobile)</li>
                  <li>Application Progressive Web App (PWA)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content Disclaimer */}
          <Card className="atomic-card border-purple-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <AlertTriangle className="w-6 h-6" />
                Avertissement Important sur le Contenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Hébergement de Contenu</h4>
                <p className="text-gray-300">
                  <strong>ATOMIC FLIX n'héberge aucune vidéo sur ses serveurs.</strong> Toutes les vidéos 
                  sont hébergées par des plateformes tierces externes. L'application sert uniquement 
                  d'interface pour accéder à ces contenus.
                </p>
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-2">Droits d'Auteur</h4>
                <p className="text-gray-300">
                  Pour toute réclamation de droit d'auteur concernant le contenu vidéo, 
                  veuillez contacter directement la plateforme d'hébergement où le contenu est stocké. 
                  ATOMIC FLIX ne peut pas traiter les réclamations de droits d'auteur car nous ne contrôlons 
                  pas le contenu hébergé sur des serveurs tiers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-6 h-6" />
                Responsabilités de l'Utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                En utilisant ATOMIC FLIX, vous vous engagez à :
              </p>
              
              <div className="space-y-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Utilisation Autorisée</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Utiliser l'application de manière légale et responsable</li>
                    <li>Respecter les droits d'auteur et la propriété intellectuelle</li>
                    <li>Ne pas tenter de pirater ou endommager l'application</li>
                    <li>Ne pas utiliser l'application à des fins commerciales</li>
                  </ul>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Utilisation Interdite</h4>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>Télécharger ou redistribuer le contenu</li>
                    <li>Utiliser des outils automatisés pour accéder au service</li>
                    <li>Tenter de contourner les mesures de sécurité</li>
                    <li>Partager des liens directs vers des contenus protégés</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="atomic-card border-yellow-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-6 h-6" />
                Clause de Non-Responsabilité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">Service "Tel Quel"</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX est fourni "tel quel" sans garantie d'aucune sorte. 
                  Nous ne garantissons pas que le service sera ininterrompu, exempt d'erreurs ou sécurisé.
                </p>
              </div>
              
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-400 mb-2">Limitation de Responsabilité</h4>
                <p className="text-gray-300">
                  Le développeur ne peut être tenu responsable de tout dommage résultant de l'utilisation 
                  ou de l'impossibilité d'utiliser l'application, y compris les dommages causés par 
                  le contenu hébergé sur des plateformes tierces.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="atomic-card border-green-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Shield className="w-6 h-6" />
                Vie Privée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Respect de la Vie Privée</h4>
                <p className="text-gray-300">
                  ATOMIC FLIX ne collecte aucune donnée personnelle. Votre vie privée est totalement respectée. 
                  Pour plus d'informations, consultez notre 
                  <a href="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline ml-1">
                    Politique de Confidentialité
                  </a>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes */}
          <Card className="atomic-card border-purple-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <FileText className="w-6 h-6" />
                Modifications des Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Ces conditions d'utilisation peuvent être modifiées occasionnellement. 
                Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour. 
                Votre utilisation continue de l'application après les modifications constitue 
                votre acceptation des nouvelles conditions.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Mail className="w-6 h-6" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Pour toute question concernant ces conditions d'utilisation, contactez :
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