import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Film, BookOpen, Play, Star, TrendingUp } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Film,
      title: "Streaming Anime",
      description: "Regardez vos animes préférés en haute qualité avec plusieurs options de serveurs."
    },
    {
      icon: BookOpen,
      title: "Lecture Manga",
      description: "Lisez vos mangas favoris avec une interface de lecture optimisée."
    },
    {
      icon: Star,
      title: "Contenu Premium",
      description: "Accès à une vaste collection d'animes et mangas populaires."
    }
  ];

  const popularAnimes = [
    "One Piece",
    "Naruto",
    "Attack on Titan",
    "Demon Slayer",
    "My Hero Academia",
    "Dragon Ball"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center space-y-8">
            {/* Logo principal */}
            <div className="flex justify-center mb-8 atomic-fade-in">
              <img 
                src="/attached_assets/file_00000000c67861f9924b51d792b4b888_1751410240730.png" 
                alt="ATOMIC FLIX Logo" 
                className="h-32 w-auto md:h-40 object-contain filter drop-shadow-2xl"
              />
            </div>
            
            <div className="space-y-6 atomic-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Bienvenue sur{" "}
                <span className="atomic-gradient-text">ATOMIC FLIX</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
                Votre plateforme ultime pour regarder des animes et lire des mangas. 
                Découvrez un univers infini de contenu japonais en streaming.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center atomic-fade-in">
              <Link href="/anime-sama">
                <Button size="lg" className="atomic-gradient-bg atomic-hover-scale text-lg px-8 py-6">
                  <Film className="mr-2 h-5 w-5" />
                  Explorer les Animes
                </Button>
              </Link>
              <Link href="/manga">
                <Button size="lg" variant="outline" className="atomic-card atomic-hover-scale text-lg px-8 py-6 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Découvrir les Mangas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Fonctionnalités <span className="atomic-gradient-text">Premium</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="atomic-card p-6 atomic-hover-scale">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Animes Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <TrendingUp className="inline mr-3 h-8 w-8 text-cyan-400" />
              Animes <span className="atomic-gradient-text">Populaires</span>
            </h2>
            <p className="text-slate-400 text-lg">Les séries les plus regardées par notre communauté</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularAnimes.map((anime, index) => (
              <Card key={index} className="atomic-card p-4 atomic-hover-scale cursor-pointer group">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                    {anime}
                  </h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/anime-sama">
              <Button className="atomic-gradient-bg atomic-hover-scale">
                Voir tous les animes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Prêt à plonger dans l'univers{" "}
              <span className="atomic-gradient-text">ATOMIC</span> ?
            </h2>
            <p className="text-xl text-slate-300">
              Rejoignez des milliers d'otakus qui découvrent quotidiennement 
              leurs nouveaux animes et mangas préférés sur ATOMIC FLIX.
            </p>
            <Link href="/anime-sama">
              <Button size="lg" className="atomic-gradient-bg atomic-hover-scale text-xl px-12 py-6">
                <Play className="mr-3 h-6 w-6" />
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}