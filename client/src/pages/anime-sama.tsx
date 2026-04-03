import React, { useState, useEffect } from 'react';
import { Search, X, Play, Clock, Trophy, Gem, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { SectionLoading } from '@/components/ui/loading-spinner';
import { animeAPI } from '@/lib/api';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  image: string;
}

/* ─── Reusable card skeleton ─── */
const CardSkeleton = () => (
  <div className="w-40 h-56 sm:w-44 sm:h-64 md:w-48 md:h-72 rounded-xl flex-shrink-0 skeleton-shimmer" />
);

/* ─── Reusable anime card ─── */
const AnimeCard = ({
  image, title, badge, badgeColor, sub, onClick, testId, index = 0
}: {
  image: string; title: string; badge?: string; badgeColor?: string;
  sub?: React.ReactNode; onClick: () => void; testId?: string; index?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.3 }}
    onClick={onClick}
    data-testid={testId}
    className="cursor-pointer group overflow-hidden w-40 h-56 sm:w-44 sm:h-64 md:w-48 md:h-72 rounded-xl relative flex-shrink-0 bg-white/5"
  >
    <img
      src={image}
      alt={title}
      className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    {/* Top badge */}
    {badge && (
      <div className={`absolute top-2 left-2 text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide ${badgeColor ?? 'bg-cyan-500/90'}`}>
        {badge}
      </div>
    )}
    {/* Bottom info */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <h3 className="text-white font-semibold text-[13px] leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors duration-200">
        {title}
      </h3>
      {sub && <div className="mt-1">{sub}</div>}
    </div>
    {/* Play hint */}
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="bg-black/60 rounded-full p-3 backdrop-blur-sm border border-white/20">
        <Play className="h-5 w-5 text-white fill-white" />
      </div>
    </div>
  </motion.div>
);

/* ─── Section header ─── */
const SectionHeader = ({ icon: Icon, title, iconColor = 'text-cyan-400' }: {
  icon: React.ElementType; title: string; iconColor?: string;
}) => (
  <div className="mb-5">
    <h2 className="flex items-center gap-2.5 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
      <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
      <span>{title}</span>
    </h2>
    <div className="atomic-section-bar mt-2" />
  </div>
);

/* ─── Horizontal scroll row ─── */
const ScrollRow = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
    <div className="flex gap-3 w-max">{children}</div>
  </div>
);

/* ─── Main page ─── */
const AnimeSamaPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [popularAnimes, setPopularAnimes] = useState<any>(null);
  const [recentEpisodes, setRecentEpisodes] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [planning, setPlanning] = useState<any>(null);

  /* ── Loaders ── */
  useEffect(() => {
    loadPopularAnimes();
    loadRecentEpisodes();
    loadRecommendations();
    loadPlanning();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchParam !== searchQuery) setSearchQuery(searchParam);
    else if (!searchParam && searchQuery) setSearchQuery('');
  }, [window.location.search]);

  const loadPopularAnimes = async () => {
    try {
      const r = await animeAPI.getPopular();
      if (r?.success) setPopularAnimes(r);
    } catch {}
  };
  const loadRecentEpisodes = async () => {
    try {
      const r = await animeAPI.getRecent();
      if (r?.success && r.recentEpisodes) setRecentEpisodes(r.recentEpisodes.slice(0, 20));
    } catch {}
  };
  const loadRecommendations = async () => {
    try {
      const r = await animeAPI.getRecommendations(1, 30);
      if (r?.success && r.data) setRecommendations(r.data);
    } catch {}
  };
  const loadPlanning = async () => {
    try {
      const r = await animeAPI.getPlanning();
      if (r?.success) setPlanning(r);
    } catch {}
  };

  /* ── Search ── */
  const searchAnimes = async (query: string) => {
    if (query.trim().length < 2) { setSearchResults([]); return; }
    setLoading(true);
    setError(null);
    try {
      const r = await animeAPI.search(query);
      if (r?.success) {
        setSearchResults(Array.isArray(r.animes) ? r.animes : []);
      } else throw new Error('Réponse API invalide');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de recherche';
      if (msg.includes('504') || msg.includes('timeout')) {
        setError('Le serveur ne répond pas. Veuillez réessayer plus tard.');
      } else if (msg.includes('500')) {
        setError('Erreur temporaire du serveur. Réessayez dans quelques instants.');
      } else {
        setError('Impossible de rechercher. Vérifiez votre connexion internet.');
      }
      setSearchResults([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return; }
    const t = setTimeout(() => searchAnimes(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const goToAnime = (id: string) => navigate(`/anime/${id}`);
  const playEpisode = (ep: any) => {
    const lang = ep.language?.toLowerCase() || 'vostfr';
    navigate(`/anime/${ep.animeId}/player?season=${ep.season}&episode=${ep.episode}&lang=${lang}`);
  };

  /* ── Render ── */
  return (
    <MainLayout>
      <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--atomic-dark)' }}>
        <div className="pt-1 pb-8">

          {/* ── Active search bar ── */}
          {searchQuery && (
            <div className="mb-5 atomic-slide-in">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
                <Search size={16} className="text-cyan-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des animes..."
                  className="flex-1 bg-transparent text-white placeholder-white/30 border-none outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-white/40 hover:text-white transition-colors duration-200 p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── Search results ── */}
          <AnimatePresence mode="wait">
            {loading && searchQuery && <SectionLoading message="Recherche en cours..." />}
            {searchResults.length > 0 && !loading && (
              <motion.div
                key="search-results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-white/40 text-sm mb-4">
                  {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} pour «&nbsp;<span className="text-white/70">{searchQuery}</span>&nbsp;»
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {searchResults.map((anime, i) => (
                    <AnimeCard
                      key={`s-${anime.id}-${i}`}
                      image={anime.image}
                      title={anime.title}
                      badge={anime.type === 'film' || anime.type === 'movie' ? 'FILM' : 'ANIME'}
                      badgeColor="bg-cyan-500/90"
                      sub={<span className="text-white/50 text-[11px] uppercase tracking-wide">{anime.status}</span>}
                      onClick={() => goToAnime(anime.id)}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            {error && searchQuery && (
              <motion.div
                key="search-error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <p className="text-red-400/80 text-sm mb-3">{error}</p>
                <button
                  onClick={() => { setError(null); searchAnimes(searchQuery); }}
                  className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                >
                  Réessayer
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Home content ── */}
          {!searchQuery && !searchResults.length && (
            <div className="space-y-10">

              {/* ── Hero Banner ── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-white/8"
                style={{ background: 'linear-gradient(135deg, #050514 0%, #0A0A1E 50%, #0D0520 100%)' }}
              >
                {/* Mosaic images */}
                {popularAnimes?.categories?.classiques?.length > 0 && (
                  <>
                    <div className="flex sm:hidden h-20 overflow-hidden">
                      {popularAnimes.categories.classiques.slice(0, 5).map((a: any, i: number) => (
                        <div
                          key={`hm-${i}`}
                          className="flex-1 overflow-hidden cursor-pointer"
                          style={{ transform: `skew(${i % 2 === 0 ? '4deg' : '-4deg'})`, marginLeft: i > 0 ? '-3px' : 0 }}
                          onClick={() => goToAnime(a.id)}
                        >
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      ))}
                    </div>
                    <div className="hidden sm:flex h-28 md:h-32 overflow-hidden">
                      {popularAnimes.categories.classiques.slice(0, 8).map((a: any, i: number) => (
                        <div
                          key={`hd-${i}`}
                          className="flex-1 overflow-hidden cursor-pointer"
                          style={{ transform: `skew(${i % 2 === 0 ? '3deg' : '-3deg'})`, marginLeft: i > 0 ? '-3px' : 0 }}
                          onClick={() => goToAnime(a.id)}
                        >
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Hero content */}
                <div className="relative px-6 py-5 sm:px-10 sm:py-6 text-center bg-gradient-to-t from-black via-black/96 to-black/70">
                  {/* Logo + Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-4"
                  >
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <img src="/assets/atomic-logo-round.png" alt="ATOMIC FLIX" className="h-10 w-10 atomic-logo-round with-glow hidden sm:block" />
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight atomic-gradient-text">
                        ATOMIC FLIX
                      </h1>
                      <span className="text-2xl sm:text-3xl">🇹🇬</span>
                    </div>
                    <p className="text-white/50 text-sm sm:text-base">
                      Streaming d'anime en VOSTFR &amp; VF — 100% gratuit
                    </p>
                  </motion.div>

                  {/* Feature tags */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex justify-center flex-wrap gap-2"
                  >
                    {[
                      { label: 'VOSTFR & VF',   color: 'from-cyan-500/80 to-blue-500/80'    },
                      { label: 'HD STREAMING',  color: 'from-purple-500/80 to-pink-500/80'  },
                      { label: '100% GRATUIT',  color: 'from-amber-500/80 to-orange-500/80' },
                    ].map((t) => (
                      <span
                        key={t.label}
                        className={`bg-gradient-to-r ${t.color} text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-widest uppercase`}
                      >
                        {t.label}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Épisodes Récents ── */}
              {recentEpisodes.length > 0 ? (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <SectionHeader icon={Clock} title="Nouveautés" />
                  <ScrollRow>
                    {recentEpisodes.map((ep, i) => (
                      <AnimeCard
                        key={`rec-${ep.animeId}-${ep.episode}-${i}`}
                        image={ep.image}
                        title={ep.animeTitle}
                        badge={ep.language}
                        badgeColor={ep.language === 'VF' ? 'bg-emerald-500/90' : ep.language === 'VOSTFR' ? 'bg-blue-500/90' : 'bg-purple-500/90'}
                        sub={
                          <span className="text-cyan-400 text-[11px] font-semibold">
                            S{ep.season} · Ép&nbsp;{ep.episode}
                            {ep.isFinale && <span className="ml-1.5 text-red-400 font-bold">FINALE</span>}
                          </span>
                        }
                        onClick={() => playEpisode(ep)}
                        testId={`card-recent-${ep.animeId}`}
                        index={i}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              ) : (
                <section>
                  <SectionHeader icon={Clock} title="Nouveautés" />
                  <ScrollRow>
                    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                  </ScrollRow>
                </section>
              )}

              {/* ── Les Classiques ── */}
              {popularAnimes?.categories?.classiques?.length > 0 ? (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <SectionHeader icon={Trophy} title="Les Classiques" iconColor="text-amber-400" />
                  <ScrollRow>
                    {popularAnimes.categories.classiques.map((a: any, i: number) => (
                      <AnimeCard
                        key={`cl-${a.id}-${i}`}
                        image={a.image}
                        title={a.title}
                        onClick={() => goToAnime(a.id)}
                        testId={`card-classique-${a.id}`}
                        index={i}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              ) : (
                <section>
                  <SectionHeader icon={Trophy} title="Les Classiques" iconColor="text-amber-400" />
                  <ScrollRow>
                    {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                  </ScrollRow>
                </section>
              )}

              {/* ── Pépites ── */}
              {popularAnimes?.categories?.pepites?.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <SectionHeader icon={Gem} title="Pépites" iconColor="text-purple-400" />
                  <ScrollRow>
                    {popularAnimes.categories.pepites.map((a: any, i: number) => (
                      <AnimeCard
                        key={`pp-${a.id}-${i}`}
                        image={a.image}
                        title={a.title}
                        onClick={() => goToAnime(a.id)}
                        testId={`card-pepite-${a.id}`}
                        index={i}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              )}

              {/* ── Recommandations ── */}
              {recommendations.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <SectionHeader icon={Play} title="Pour vous" iconColor="text-pink-400" />
                  <ScrollRow>
                    {recommendations.map((a: any, i: number) => (
                      <AnimeCard
                        key={`reco-${a.id}-${i}`}
                        image={a.image}
                        title={a.title}
                        onClick={() => goToAnime(a.id)}
                        testId={`card-reco-${a.id}`}
                        index={i}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              )}

              {/* ── Planning ── */}
              {planning?.items?.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <SectionHeader icon={Calendar} title="Planning du jour" iconColor="text-cyan-400" />
                  <ScrollRow>
                    {planning.items.map((item: any, i: number) => (
                      <AnimeCard
                        key={`plan-${item.animeId ?? i}-${i}`}
                        image={item.image}
                        title={item.title}
                        badge={item.isReported ? 'REPORTÉ' : item.releaseTime}
                        badgeColor={item.isReported ? 'bg-orange-500/90' : 'bg-black/60'}
                        sub={<span className="text-white/50 text-[11px] uppercase tracking-wide">{item.language}</span>}
                        onClick={() => item.animeId ? goToAnime(item.animeId) : undefined}
                        testId={`card-planning-${i}`}
                        index={i}
                      />
                    ))}
                  </ScrollRow>
                </motion.section>
              )}

            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default AnimeSamaPage;
