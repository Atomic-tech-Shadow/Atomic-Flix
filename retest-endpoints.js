// Re-test des endpoints avec de vrais paramètres
const API_BASE = 'https://anime-sama-scraper.vercel.app/api';

async function testEndpoint(name, url) {
  console.log(`\n🧪 Test: ${name}`);
  console.log(`URL: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.log(`❌ ${response.status} ${response.statusText} (${duration}ms)`);
      const text = await response.text();
      console.log('Réponse:', text.substring(0, 200));
      return null;
    }

    const data = await response.json();
    console.log(`✅ Succès (${duration}ms)`);
    
    if (Array.isArray(data)) {
      console.log(`Type: Array (${data.length} éléments)`);
      if (data.length > 0) {
        console.log('Premier élément:', JSON.stringify(data[0], null, 2));
      }
    } else {
      console.log('Type: Object');
      console.log('Données:', JSON.stringify(data, null, 2).substring(0, 500));
    }

    return data;
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🔬 RE-TEST DES ENDPOINTS AVEC DE VRAIS PARAMÈTRES\n');
  
  // Test 1: /popular
  await testEndpoint('1. POPULAR', `${API_BASE}/popular`);
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 2: /recommendations  
  await testEndpoint('2. RECOMMENDATIONS (page 1)', `${API_BASE}/recommendations?page=1&limit=10`);
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 3: /planning
  await testEndpoint('3. PLANNING', `${API_BASE}/planning`);
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 4: /planning avec jour
  await testEndpoint('4. PLANNING (avec jour)', `${API_BASE}/planning?day=monday`);
  await new Promise(r => setTimeout(r, 1000));
  
  // Test 5: episode-by-id avec un vrai ID d'épisode récent
  console.log('\n📋 D\'abord récupérer un vrai ID d\'épisode...');
  const recent = await testEndpoint('5a. RECENT (pour obtenir un ID)', `${API_BASE}/recent`);
  
  if (recent && recent.length > 0) {
    const firstEpisode = recent[0];
    console.log('\nPremier épisode récent:', firstEpisode);
    
    // Essayer avec l'URL
    if (firstEpisode.url) {
      await testEndpoint('5b. EPISODE-BY-ID (avec URL)', `${API_BASE}/episode-by-id?id=${encodeURIComponent(firstEpisode.url)}`);
      await new Promise(r => setTimeout(r, 1000));
    }
    
    // Essayer avec animeId
    if (firstEpisode.animeId) {
      const episodeId = `${firstEpisode.animeId}-s${firstEpisode.season}-e${firstEpisode.episodeNumber}`;
      await testEndpoint('5c. EPISODE-BY-ID (avec ID construit)', `${API_BASE}/episode-by-id?id=${episodeId}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Test 6: /embed avec une vraie URL
  console.log('\n📋 Récupérer une vraie URL d\'épisode pour /embed...');
  const episodes = await testEndpoint('6a. EPISODES naruto S1 (pour URL)', `${API_BASE}/episodes/naruto?season=1&language=vostfr`);
  
  if (episodes && episodes.episodes && episodes.episodes.length > 0) {
    const firstEp = episodes.episodes[0];
    console.log('\nPremier épisode:', firstEp);
    
    if (firstEp.url) {
      await testEndpoint('6b. EMBED (avec URL)', `${API_BASE}/embed?url=${encodeURIComponent(firstEp.url)}`);
    }
  }
  
  console.log('\n✅ Tests terminés');
}

runTests().catch(console.error);
