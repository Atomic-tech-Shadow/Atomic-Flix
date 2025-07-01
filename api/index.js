// API serverless pour Vercel - ATOMIC FLIX
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req;
  const path = url.replace('/api', '');

  try {
    if (path === '/trending') {
      const response = await fetch('https://anime-sama-scraper.vercel.app/api/trending');
      const data = await response.json();
      return res.json(data);
    }

    if (path === '/popular') {
      const response = await fetch('https://anime-sama-scraper.vercel.app/api/popular');
      const data = await response.json();
      return res.json(data);
    }

    if (path === '/search') {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ success: false, error: 'Paramètre query requis' });
      }
      
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return res.json(data);
    }

    if (path.startsWith('/anime/')) {
      const id = path.replace('/anime/', '');
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/anime/${id}`);
      const data = await response.json();
      return res.json(data);
    }

    if (path.startsWith('/episodes/')) {
      const animeId = path.replace('/episodes/', '');
      const { season, language } = req.query;
      
      if (!season || !language) {
        return res.status(400).json({ 
          success: false, 
          error: 'Paramètres season et language requis' 
        });
      }
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/episodes/${animeId}?season=${season}&language=${language}`
      );
      const data = await response.json();
      return res.json(data);
    }

    if (path === '/embed') {
      const { url } = req.query;
      
      if (!url) {
        return res.status(400).json({ success: false, error: 'Paramètre url requis' });
      }
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      return res.json(data);
    }

    if (path.startsWith('/manga/chapter/')) {
      const chapterId = path.replace('/manga/chapter/', '');
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/manga/chapter/${chapterId}`
      );
      const data = await response.json();
      return res.json(data);
    }

    if (path.match(/^\/manga\/(.+)\/chapters$/)) {
      const mangaId = path.match(/^\/manga\/(.+)\/chapters$/)[1];
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/manga/${mangaId}/chapters`
      );
      const data = await response.json();
      return res.json(data);
    }

    return res.status(404).json({ success: false, error: 'Route non trouvée' });

  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ success: false, error: 'Service externe indisponible' });
  }
}