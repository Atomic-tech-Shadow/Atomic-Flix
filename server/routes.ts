import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes pour ATOMIC FLIX
  
  // Route pour les animes tendances (suppression de toute configuration locale)
  app.get('/api/trending', async (req, res) => {
    try {
      const response = await fetch('https://anime-sama-scraper.vercel.app/api/trending');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API trending:', error);
      res.status(500).json({ success: false, error: 'Service externe indisponible' });
    }
  });

  // Route pour la recherche d'animes (uniquement API externe)
  app.get('/api/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ success: false, error: 'Paramètre query requis' });
      }
      
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/search?query=${encodeURIComponent(query as string)}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API search:', error);
      res.status(500).json({ success: false, error: 'Service externe indisponible' });
    }
  });

  // Route pour les détails d'un anime (uniquement API externe)
  app.get('/api/anime/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/anime/${id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API anime details:', error);
      res.status(500).json({ success: false, error: 'Service externe indisponible' });
    }
  });

  // Route pour les épisodes d'une saison (uniquement API externe)
  app.get('/api/episodes/:animeId', async (req, res) => {
    try {
      const { animeId } = req.params;
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
      res.json(data);
    } catch (error) {
      console.error('Erreur API episodes:', error);
      res.status(500).json({ success: false, error: 'Service externe indisponible' });
    }
  });

  // Route pour les sources d'embed d'un épisode (uniquement API externe)
  app.get('/api/embed', async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url) {
        return res.status(400).json({ success: false, error: 'Paramètre url requis' });
      }
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(url as string)}`
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API embed:', error);
      res.status(500).json({ success: false, error: 'Service externe indisponible' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
