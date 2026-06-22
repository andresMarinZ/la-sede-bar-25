import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = join(__dirname, '../public/data/mundial-2026.json');
const API_KEY   = process.env.FOOTBALL_API_KEY;
const API_URL   = 'https://api.football-data.org/v4/competitions/WC/matches';

// Mapeo código ISO → posibles nombres en la API de football-data.org
const ISO_TO_NAMES = {
  'mx':     ['Mexico'],
  'za':     ['South Africa'],
  'kr':     ['Korea Republic', 'South Korea'],
  'cz':     ['Czech Republic', 'Czechia'],
  'ca':     ['Canada'],
  'ba':     ['Bosnia-Herzegovina', 'Bosnia and Herzegovina'],
  'us':     ['USA', 'United States'],
  'py':     ['Paraguay'],
  'qa':     ['Qatar'],
  'ch':     ['Switzerland'],
  'br':     ['Brazil'],
  'ma':     ['Morocco'],
  'ht':     ['Haiti'],
  'gb-sct': ['Scotland'],
  'au':     ['Australia'],
  'tr':     ['Turkey', 'Türkiye'],
  'de':     ['Germany'],
  'cw':     ['Curaçao', 'Curacao'],
  'nl':     ['Netherlands'],
  'jp':     ['Japan'],
  'ci':     ["Côte d'Ivoire", 'Ivory Coast'],
  'se':     ['Sweden'],
  'tn':     ['Tunisia'],
  'es':     ['Spain'],
  'cv':     ['Cape Verde'],
  'be':     ['Belgium'],
  'eg':     ['Egypt'],
  'sa':     ['Saudi Arabia'],
  'uy':     ['Uruguay'],
  'ir':     ['Iran'],
  'nz':     ['New Zealand'],
  'fr':     ['France'],
  'sn':     ['Senegal'],
  'iq':     ['Iraq'],
  'no':     ['Norway'],
  'ar':     ['Argentina'],
  'dz':     ['Algeria'],
  'at':     ['Austria'],
  'jo':     ['Jordan'],
  'pt':     ['Portugal'],
  'cd':     ['DR Congo', 'Congo DR'],
  'gb-eng': ['England'],
  'hr':     ['Croatia'],
  'gh':     ['Ghana'],
  'pa':     ['Panama'],
  'uz':     ['Uzbekistan'],
  'co':     ['Colombia'],
  'ec':     ['Ecuador'],
};

// Nombre del estadio → ciudad (los 16 sedes del Mundial 2026)
const VENUE_TO_CITY = {
  'MetLife Stadium':           'East Rutherford, NJ',
  'SoFi Stadium':              'Los Ángeles, CA',
  "AT&T Stadium":              'Arlington, TX',
  "Levi's Stadium":            'Santa Clara, CA',
  'Hard Rock Stadium':         'Miami, FL',
  'Mercedes-Benz Stadium':     'Atlanta, GA',
  'Lumen Field':               'Seattle, WA',
  'NRG Stadium':               'Houston, TX',
  'Arrowhead Stadium':         'Kansas City, MO',
  'Lincoln Financial Field':   'Filadelfia, PA',
  'Gillette Stadium':          'Foxborough, MA',
  'BC Place':                  'Vancouver, Canadá',
  'BMO Field':                 'Toronto, Canadá',
  'Estadio Akron':             'Guadalajara, México',
  'Estadio Azteca':            'Ciudad de México',
  'Estadio BBVA':              'Monterrey, México',
};

function matchesName(apiTeam, names) {
  const haystack = [apiTeam.name, apiTeam.shortName, apiTeam.tla]
    .filter(Boolean)
    .map(s => s.toLowerCase());
  return names.some(n => haystack.some(h => h.includes(n.toLowerCase())));
}

function findApiMatch(apiMatches, partido) {
  const localNames     = ISO_TO_NAMES[partido.local.iso]     ?? [];
  const visitanteNames = ISO_TO_NAMES[partido.visitante.iso] ?? [];
  return apiMatches.find(m =>
    matchesName(m.homeTeam, localNames) && matchesName(m.awayTeam, visitanteNames)
  );
}

function mapEstado(apiStatus) {
  if (['FINISHED', 'AWARDED'].includes(apiStatus))                     return 'FINALIZADO';
  if (['IN_PLAY', 'PAUSED', 'HALFTIME', 'EXTRA_TIME'].includes(apiStatus)) return 'EN_JUEGO';
  return 'PROGRAMADO';
}

async function main() {
  if (!API_KEY) { console.error('Falta FOOTBALL_API_KEY'); process.exit(1); }

  const res = await fetch(API_URL, { headers: { 'X-Auth-Token': API_KEY } });
  if (!res.ok) { console.error(`API error ${res.status}: ${await res.text()}`); process.exit(1); }

  const { matches: apiMatches } = await res.json();
  const data = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));

  let actualizados = 0;

  for (const partido of data.partidos) {
    const m = findApiMatch(apiMatches, partido);
    if (!m) {
      console.warn(`Sin match API: ${partido.local.nombre} vs ${partido.visitante.nombre}`);
      continue;
    }

    partido.resultado = {
      golesLocal:      m.score?.fullTime?.home ?? null,
      golesVisitante:  m.score?.fullTime?.away ?? null,
      estado:          mapEstado(m.status),
    };

    if (m.venue) {
      partido.estadio = {
        nombre: m.venue,
        ciudad: VENUE_TO_CITY[m.venue] ?? '',
      };
    }

    actualizados++;
  }

  writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Actualizados ${actualizados}/${data.partidos.length} partidos`);
}

main().catch(err => { console.error(err); process.exit(1); });
