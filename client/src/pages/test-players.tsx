import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';

export default function TestPlayers() {
  const [animeId, setAnimeId] = useState('naruto');
  const [season, setSeason] = useState('saison1');
  const [language, setLanguage] = useState('vostfr');
  const [episodeUrl, setEpisodeUrl] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadEpisodes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/episodes/${animeId}?season=${season}&language=${language}`
      );
      const data = await response.json();
      
      if (data.success && data.episodes && data.episodes[0]) {
        const firstEpisode = data.episodes[0];
        setEpisodeUrl(firstEpisode.url);
        
        // Charger les sources
        const embedResponse = await fetch(
          `https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(firstEpisode.url)}`
        );
        const embedData = await embedResponse.json();
        
        if (embedData.success && embedData.sources) {
          setSources(embedData.sources);
        } else {
          setError('Aucune source trouvée');
        }
      }
    } catch (err) {
      setError('Erreur API: ' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-6 text-cyan-400">Test des Lecteurs</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-2">Anime ID</label>
              <input
                type="text"
                value={animeId}
                onChange={(e) => setAnimeId(e.target.value)}
                className="w-full bg-gray-700 px-4 py-2 rounded"
                placeholder="naruto"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Saison</label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full bg-gray-700 px-4 py-2 rounded"
                placeholder="saison1"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Langue</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-700 px-4 py-2 rounded"
                placeholder="vostfr"
              />
            </div>
          </div>
          
          <button
            onClick={loadEpisodes}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-bold"
          >
            {loading ? 'Chargement...' : 'Tester'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {episodeUrl && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400">URL Épisode:</p>
            <p className="text-cyan-400 break-all">{episodeUrl}</p>
          </div>
        )}

        {sources.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Lecteurs disponibles ({sources.length})
            </h2>
            
            <div className="grid gap-4">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg border-2 border-cyan-500/30"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Index</p>
                      <p className="text-xl font-bold text-white">{index}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Serveur</p>
                      <p className="text-xl font-bold text-cyan-400">{source.server}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Server Number</p>
                      <p className="text-lg text-white">{source.serverNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Qualité</p>
                      <p className="text-lg text-white">{source.quality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Type</p>
                      <p className="text-lg text-white">{source.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Langue</p>
                      <p className="text-lg text-white">{source.language}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">URL</p>
                    <p className="text-xs text-cyan-300 break-all bg-gray-900 p-2 rounded">
                      {source.url}
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-900 rounded">
                    <p className="text-sm text-gray-400 mb-2">Données brutes JSON</p>
                    <pre className="text-xs text-green-400 overflow-auto">
                      {JSON.stringify(source, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
