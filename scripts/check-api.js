#!/usr/bin/env node
/*
  scripts/check-api.js
  - Simple vérificateur qui appelle les endpoints connus et enregistre les réponses JSON
  - Usage: node scripts/check-api.js
  (Node 18+ requis pour fetch global)
*/

const fs = require('fs').promises;
const path = require('path');

const BASE = 'https://anime-sama-scraper.vercel.app/api';
const OUT_DIR = path.join(__dirname, '..', 'logs', 'api');

const endpoints = [
  { name: 'popular', url: `${BASE}/popular` },
  { name: 'recommendations', url: `${BASE}/recommendations?page=1&limit=50` },
  { name: 'planning', url: `${BASE}/planning` },
  { name: 'recent', url: `${BASE}/recent` },
  { name: 'search', url: `${BASE}/search?query=naruto` },
  { name: 'trending', url: `${BASE}/trending` },
  { name: 'anime_example', url: `${BASE}/anime/1` },
  { name: 'seasons_example', url: `${BASE}/seasons/1` },
  { name: 'episodes_example', url: `${BASE}/episodes/1?season=1&language=fr` },
  { name: 'embed_example', url: `${BASE}/embed?url=${encodeURIComponent('https://example.com/ep')}` }
];

(async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const report = [];

  for (const e of endpoints) {
    const now = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${e.name}-${now}.json`;
    const outPath = path.join(OUT_DIR, filename);

    try {
      console.log(`Calling ${e.url}`);
      const res = await fetch(e.url, { method: 'GET', headers: { Accept: 'application/json' } });
      const text = await res.text();
      let json = null;
      try {
        json = JSON.parse(text);
      } catch (parseErr) {
        // not JSON
        json = { raw: text };
      }

      await fs.writeFile(outPath, JSON.stringify({ url: e.url, status: res.status, ok: res.ok, body: json }, null, 2));

      report.push({ endpoint: e.name, url: e.url, status: res.status, ok: res.ok, sampleKeys: Object.keys(json || {}) });
    } catch (err) {
      console.error(`Erreur pour ${e.url}:`, err.message || err);
      report.push({ endpoint: e.name, url: e.url, error: String(err) });
    }
  }

  // Générer un rapport sommaire
  const reportMd = [`# API Check Report - ${new Date().toISOString()}`, ''];
  for (const r of report) {
    reportMd.push(`- **${r.endpoint}** - ${r.url}`);
    if (r.error) reportMd.push(`  - Error: ${r.error}`);
    else reportMd.push(`  - status: ${r.status} - ok: ${r.ok} - keys: ${r.sampleKeys.join(', ')}`);
  }

  const reportPath = path.join(__dirname, '..', 'report', 'api-check-report.md');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, reportMd.join('\n'));

  console.log('Done. Logs and report written to logs/api and report/api-check-report.md');
})();
