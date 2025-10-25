// Test de tous les endpoints de l'API externe ATOMIC FLIX
const API_BASE = 'https://anime-sama-scraper.vercel.app/api';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m'
};

async function testEndpoint(name, url, description) {
  console.log(`\n${colors.cyan}${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}📡 ${name}${colors.reset}`);
  console.log(`${colors.yellow}URL: ${url}${colors.reset}`);
  console.log(`${colors.yellow}Description: ${description}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.log(`${colors.red}❌ Erreur: ${response.status} ${response.statusText}${colors.reset}`);
      console.log(`⏱️  Temps de réponse: ${duration}ms`);
      return null;
    }

    const data = await response.json();
    console.log(`${colors.green}✅ Succès (${response.status})${colors.reset}`);
    console.log(`⏱️  Temps de réponse: ${duration}ms`);
    
    // Afficher la structure
    console.log(`\n${colors.bright}📊 Structure de la réponse:${colors.reset}`);
    
    if (Array.isArray(data)) {
      console.log(`Type: Array (${data.length} éléments)`);
      if (data.length > 0) {
        console.log(`\nPremier élément:`);
        console.log(JSON.stringify(data[0], null, 2));
        if (data.length > 1) {
          console.log(`\n... et ${data.length - 1} autres éléments`);
        }
      }
    } else if (typeof data === 'object') {
      console.log(`Type: Object`);
      console.log(`Clés: ${Object.keys(data).join(', ')}`);
      console.log(`\nDonnées complètes:`);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }

    return data;
  } catch (error) {
    console.log(`${colors.red}❌ Erreur: ${error.message}${colors.reset}`);
    return null;
  }
}

async function runTests() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log(`╔══════════════════════════════════════════════════════╗`);
  console.log(`║   🧪 TEST DES ENDPOINTS API ATOMIC FLIX 🧪          ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
  console.log(colors.reset);

  const tests = [
    {
      name: '1. TRENDING/POPULAR',
      url: `${API_BASE}/popular`,
      description: 'Animes populaires et classiques'
    },
    {
      name: '2. RECOMMENDATIONS',
      url: `${API_BASE}/recommendations?page=1&limit=10`,
      description: 'Recommandations personnalisées'
    },
    {
      name: '3. PLANNING',
      url: `${API_BASE}/planning`,
      description: 'Planning hebdomadaire des sorties'
    },
    {
      name: '4. RECENT EPISODES',
      url: `${API_BASE}/recent`,
      description: 'Derniers épisodes ajoutés'
    },
    {
      name: '5. SEARCH',
      url: `${API_BASE}/search?query=naruto`,
      description: 'Recherche d\'anime (exemple: naruto)'
    },
    {
      name: '6. ANIME DETAILS',
      url: `${API_BASE}/anime/naruto`,
      description: 'Détails d\'un anime spécifique'
    },
    {
      name: '7. SEASONS',
      url: `${API_BASE}/seasons/naruto`,
      description: 'Saisons d\'un anime'
    },
    {
      name: '8. EPISODES',
      url: `${API_BASE}/episodes/naruto?season=1&language=vostfr`,
      description: 'Épisodes d\'une saison'
    },
    {
      name: '9. EPISODE BY ID',
      url: `${API_BASE}/episode-by-id?id=example-episode-id`,
      description: 'Sources streaming par ID'
    },
    {
      name: '10. EMBED SOURCES',
      url: `${API_BASE}/embed?url=https://example.com/episode`,
      description: 'Sources streaming par URL'
    },
    {
      name: '11. MANGA CHAPTERS',
      url: `${API_BASE}/manga/one-piece/chapters`,
      description: 'Chapitres de manga'
    },
    {
      name: '12. CHAPTER PAGES',
      url: `${API_BASE}/manga/chapter/example-chapter-id`,
      description: 'Pages d\'un chapitre'
    }
  ];

  const results = {
    success: 0,
    failed: 0,
    total: tests.length
  };

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url, test.description);
    if (result !== null) {
      results.success++;
    } else {
      results.failed++;
    }
    // Pause entre les tests pour ne pas surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Résumé final
  console.log(`\n${colors.bright}${colors.cyan}`);
  console.log(`╔══════════════════════════════════════════════════════╗`);
  console.log(`║              📊 RÉSUMÉ DES TESTS 📊                  ║`);
  console.log(`╚══════════════════════════════════════════════════════╝`);
  console.log(colors.reset);
  console.log(`${colors.green}✅ Réussis: ${results.success}/${results.total}${colors.reset}`);
  console.log(`${colors.red}❌ Échoués: ${results.failed}/${results.total}${colors.reset}`);
  console.log(`${colors.yellow}📈 Taux de succès: ${Math.round((results.success / results.total) * 100)}%${colors.reset}`);
}

// Exécuter les tests
runTests().catch(console.error);
