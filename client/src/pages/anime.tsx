import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { AlertCircle, ArrowLeft, Film, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { animeAPI } from '@/lib/api';

interface Season {
  number: number;
  name: string;
  value: string;
  type: string;
  url: string;
  fullUrl?: string;
  languages: string[];
  available: boolean;
  contentType: string;
  apiIndex?: number;
}

interface AnimeData {
  id: string;
  title: string;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  year: string;
  type: string;
  seasons: Season[];
  totalSeasons: number;
  availableLanguages: string[];
  hasFilms: boolean;
  url: string;
}

const AnimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await animeAPI.getDetails(id);
        if (!res?.success) throw new Error(res?.error || res?.message || 'Anime non trouvé');
        const details = res.data;
        const animeSeasons = details.seasons.filter((s: Season) => s.contentType === 'anime');
        setAnimeData({ ...details, seasons: animeSeasons });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        if (msg.toLowerCase().includes('timeout')) {
          setError('Le serveur met trop de temps à répondre. Réessayez.');
        } else if (msg.includes('500')) {
          setError('Erreur temporaire du serveur. Veuillez réessayer.');
        } else if (msg.includes('404') || msg.toLowerCase().includes('non trouvé')) {
          setError('Cet anime n\'a pas été trouvé.');
        } else {
          setError(`Impossible de charger l'anime: ${msg}`);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const goToPlayer = (season: Season) => {
    if (!id) return;
    navigate(`/anime/${id}/player?season=${season.value}&episode=1&lang=vostfr`);
  };

  /* ─ Loading skeleton ─ */
  if (loading) {
    return (
      <MainLayout>
        <div className="-mx-4 -my-6">
          {/* Banner skeleton */}
          <div className="h-56 sm:h-64 md:h-72 skeleton-shimmer" />
          <div className="p-4 pt-5 space-y-4">
            <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
            <div className="h-4 w-full rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            <div className="h-4 w-5/6 rounded skeleton-shimmer" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ─ Error state ─ */
  if (error && !animeData) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">{error}</h2>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="atomic-button text-sm"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!animeData) return null;

  return (
    <MainLayout>
      <div className="-mx-4 -my-6">

        {/* ─ Banner ─ */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={animeData.image}
              alt=""
              className="w-full h-full object-cover scale-105 blur-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>
          <div className="relative flex flex-col sm:flex-row gap-5 p-5 sm:p-7 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={animeData.image}
                alt={animeData.title}
                className="w-28 sm:w-36 rounded-xl shadow-2xl border border-white/10 object-cover aspect-[2/3]"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Back button */}
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 text-white/40 hover:text-white text-xs mb-3 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Accueil
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black atomic-gradient-text leading-tight mb-3">
                {animeData.title}
              </h1>
              {/* Meta pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {animeData.totalSeasons > 0 && (
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-cyan-300">
                    <Tv className="h-3 w-3" />
                    {animeData.totalSeasons} {animeData.totalSeasons > 1 ? 'saisons' : 'saison'}
                  </span>
                )}
                {animeData.year && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300">
                    {animeData.year}
                  </span>
                )}
                {animeData.status && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300">
                    {animeData.status}
                  </span>
                )}
              </div>
              {/* Genres */}
              <div className="flex flex-wrap gap-1.5">
                {animeData.genres.map((g, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-white/6 border border-white/8 text-white/60">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─ Synopsis ─ */}
        <div className="px-4 pt-5 pb-2">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/6">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Synopsis</h3>
            <p className="text-white/75 text-sm leading-relaxed">{animeData.synopsis}</p>
          </div>
        </div>

        {/* ─ Error banner (non-blocking) ─ */}
        {error && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/8 border border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-xs flex-1">{error}</p>
              <button onClick={() => window.location.reload()} className="text-red-400 text-xs underline">
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* ─ Seasons grid ─ */}
        <div className="px-4 pt-4 pb-8">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Film className="h-4 w-4 text-cyan-400" />
            Saisons &amp; Films
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {animeData.seasons.map((season, i) => {
              const isFilm = season.type === 'Film';
              return (
                <motion.button
                  key={`s-${i}-${season.value}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => goToPlayer(season)}
                  className={`relative overflow-hidden rounded-2xl h-28 group transition-all duration-300 border-2 ${
                    isFilm
                      ? 'border-purple-500/40 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/20'
                      : 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/15'
                  } bg-white/4 backdrop-blur-sm`}
                  data-testid={`button-season-${i}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-110 transition-transform duration-400"
                    style={{ backgroundImage: `url(${animeData.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/65 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <span className="text-white font-bold text-sm text-center leading-tight drop-shadow mb-1.5">
                      {season.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isFilm ? 'bg-purple-500/50 text-purple-200' : 'bg-cyan-500/40 text-cyan-200'
                    }`}>
                      {isFilm ? 'FILM' : 'SÉRIE'}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default AnimePage;
