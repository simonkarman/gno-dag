#!/usr/bin/env node
/**
 * Generates client/src/components/road-data.ts from OpenStreetMap via the
 * Overpass API.
 *
 * Usage (from the client/ directory):
 *   npm run generate-road-data
 *
 * The fetch bbox is AREA_FACTOR times larger (in area) than GAME_BOUNDS, so
 * roads flow well past the playable edges and render cleanly without the
 * clamped-edge artifacts that arise when the bbox is exactly GAME_BOUNDS.
 *
 * IMPORTANT: GAME_BOUNDS must be kept in sync with src/components/geo.ts.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// Config — keep GAME_BOUNDS in sync with src/components/geo.ts
// ---------------------------------------------------------------------------

const GAME_BOUNDS = {
  nw: { lat: 52.078461190150676, lng: 4.745871082487575 },
  se: { lat: 52.07577514949872,  lng: 4.75379564175936  },
};

/**
 * The OSM fetch bbox will cover AREA_FACTOR times the area of GAME_BOUNDS.
 * Each half-span is scaled by Math.sqrt(AREA_FACTOR), so a factor of 6
 * makes each dimension ~2.449× wider/taller.
 */
const AREA_FACTOR = 6;

// ---------------------------------------------------------------------------
// Derive the enlarged bbox
// ---------------------------------------------------------------------------

const centerLat = (GAME_BOUNDS.nw.lat + GAME_BOUNDS.se.lat) / 2;
const centerLng = (GAME_BOUNDS.nw.lng + GAME_BOUNDS.se.lng) / 2;

const halfLat = (GAME_BOUNDS.nw.lat - GAME_BOUNDS.se.lat) / 2;
const halfLng = (GAME_BOUNDS.se.lng - GAME_BOUNDS.nw.lng) / 2;

const scale = Math.sqrt(AREA_FACTOR);

const fetchBbox = {
  minLat: centerLat - halfLat * scale,
  maxLat: centerLat + halfLat * scale,
  minLng: centerLng - halfLng * scale,
  maxLng: centerLng + halfLng * scale,
};

console.log(`GAME_BOUNDS area factor : ${AREA_FACTOR}× (each dimension ×${scale.toFixed(3)})`);
console.log(`Fetch bbox              : ${fetchBbox.minLat.toFixed(6)},${fetchBbox.minLng.toFixed(6)} → ${fetchBbox.maxLat.toFixed(6)},${fetchBbox.maxLng.toFixed(6)}`);

// ---------------------------------------------------------------------------
// Fetch from Overpass
// ---------------------------------------------------------------------------

const query = `[out:json][bbox:${fetchBbox.minLat},${fetchBbox.minLng},${fetchBbox.maxLat},${fetchBbox.maxLng}];way[highway];out geom;`;

console.log('Fetching from Overpass API…');
const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'gno-dag-road-data-generator/1.0',
  },
  body: `data=${encodeURIComponent(query)}`,
});

if (!res.ok) {
  console.error(`Overpass API returned HTTP ${res.status}`);
  process.exit(1);
}

const data = await res.json();
const ways = data.elements ?? [];
console.log(`Received ${ways.length} ways.`);

// ---------------------------------------------------------------------------
// Normalise coordinates — NO clamping, so roads outside GAME_BOUNDS get
// values outside [0,1] and are cleanly clipped by the SVG viewport.
// ---------------------------------------------------------------------------

const lngSpan = GAME_BOUNDS.se.lng - GAME_BOUNDS.nw.lng;
const latSpan = GAME_BOUNDS.se.lat - GAME_BOUNDS.nw.lat; // negative (north > south)

function toPoint(lat, lng) {
  const x = (lng - GAME_BOUNDS.nw.lng) / lngSpan;
  const y = (lat - GAME_BOUNDS.nw.lat) / latSpan;
  return { x: Math.round(x * 1e5) / 1e5, y: Math.round(y * 1e5) / 1e5 };
}

// ---------------------------------------------------------------------------
// Build the TypeScript source
// ---------------------------------------------------------------------------

const lines = [
  '// AUTO-GENERATED — do not edit by hand.',
  `// Source: OpenStreetMap via Overpass API, ${AREA_FACTOR}× the game area.`,
  '// Regenerate with: npm run generate-road-data  (from the client/ directory)',
  "import type { Point } from './geo';",
  '',
  'export interface Road { type: string; points: Point[] }',
  '',
  'export const ROADS: Road[] = [',
];

let skipped = 0;
for (const way of ways) {
  const geom = way.geometry ?? [];
  if (geom.length < 2) { skipped++; continue; }
  const type = way.tags?.highway ?? 'unknown';
  const pts = geom.map(g => toPoint(g.lat, g.lon));
  const ptsStr = pts.map(p => `{x:${p.x},y:${p.y}}`).join(',');
  lines.push(`  {type:${JSON.stringify(type)},points:[${ptsStr}]},`);
}

lines.push('];');
lines.push('');

if (skipped) console.log(`Skipped ${skipped} ways with fewer than 2 geometry points.`);

// ---------------------------------------------------------------------------
// Write to disk
// ---------------------------------------------------------------------------

const outPath = join(dirname(fileURLToPath(import.meta.url)), '../src/components/road-data.ts');
writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Written to ${outPath}`);
console.log('Done.');
