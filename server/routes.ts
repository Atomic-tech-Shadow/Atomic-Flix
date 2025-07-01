import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes pour ATOMIC FLIX
  
  // Route pour les animes populaires
  app.get('/api/popular', async (req, res) => {
    try {
      const response = await fetch('https://anime-sama-scraper.vercel.app/api/popular');
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API popular:', error);
      res.status(500).json({ success: false, error: 'Erreur lors du chargement des animes populaires' });
    }
  });

  // Route pour la recherche d'animes
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
      res.status(500).json({ success: false, error: 'Erreur lors de la recherche' });
    }
  });

  // Route pour les détails d'un anime
  app.get('/api/anime/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/anime/${id}`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API anime details:', error);
      res.status(500).json({ success: false, error: 'Erreur lors du chargement des détails de l\'anime' });
    }
  });

  // Route pour les épisodes d'une saison
  app.get('/api/episodes', async (req, res) => {
    try {
      const { animeId, season, language } = req.query;
      
      if (!animeId || !season || !language) {
        return res.status(400).json({ 
          success: false, 
          error: 'Paramètres animeId, season et language requis' 
        });
      }
      
      const response = await fetch(
        `https://anime-sama-scraper.vercel.app/api/episodes?animeId=${animeId}&season=${season}&language=${language}`
      );
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Erreur API episodes:', error);
      res.status(500).json({ success: false, error: 'Erreur lors du chargement des épisodes' });
    }
  });

  // Route pour les sources d'embed d'un épisode
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
      res.status(500).json({ success: false, error: 'Erreur lors du chargement des sources d\'embed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
