import { Mail, MessageCircle, Heart, Code, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const openWhatsApp = () => {
    window.open('https://wa.me/22871394585', '_blank');
  };

  const openEmail = () => {
    window.open('mailto:sorokomarco@gmail.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        
        {/* Header */}
        <div className="text-center space-y-4 atomic-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            À Propos d'ATOMIC FLIX
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre plateforme de streaming d'anime moderne et innovante
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* About the App */}
          <Card className="atomic-card border-purple-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Code className="w-6 h-6" />
                L'Application
              </CardTitle>
              <CardDescription className="text-gray-300">
                Une expérience de streaming révolutionnaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                ATOMIC FLIX est une plateforme de streaming d'anime moderne développée avec les dernières technologies web. 
                Elle offre une expérience utilisateur fluide et intuitive pour découvrir et regarder vos anime préférés.
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-400">Fonctionnalités principales :</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Recherche avancée d'anime</li>
                  <li>Streaming haute qualité</li>
                  <li>Interface moderne et responsive</li>
                  <li>Lecture de manga intégrée</li>
                  <li>Application PWA installable</li>
                  <li>Support mobile complet</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">React</Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">TypeScript</Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">PWA</Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">Responsive</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="atomic-card border-cyan-500/20 bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Heart className="w-6 h-6" />
                Contact
              </CardTitle>
              <CardDescription className="text-gray-300">
                Contactez le développeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-gray-300">
                  Pour toute question, suggestion ou support technique, n'hésitez pas à me contacter :
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={openWhatsApp}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp: +228 71 39 45 85
                  </Button>
                  
                  <Button 
                    onClick={openEmail}
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    sorokomarco@gmail.com
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technologies Used */}
        <Card className="atomic-card border-gray-500/20 bg-black/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Smartphone className="w-6 h-6" />
              Technologies Utilisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "React 18", "TypeScript", "Tailwind CSS", "Vite",
                "PWA", "Service Worker", "Radix UI", "Framer Motion",
                "React Query", "Wouter", "Vercel", "TWA Android"
              ].map((tech) => (
                <div key={tech} className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <span className="text-gray-300 font-medium">{tech}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 atomic-fade-in">
          <p className="text-gray-400">
            Développé avec ❤️ pour les fans d'anime
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2025 ATOMIC FLIX. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}