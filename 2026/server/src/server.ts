import 'dotenv/config';
import './json-logging';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from '@krmx/server';
import { LogSeverity } from '@krmx/base';
import { enableUnlinkedKicker } from './unlinked-kicker';
import { LatLng, Point, geoTransform, distanceTo } from './geo-transform';
import { StateStore, PUZZLE_PROXIMITY_METERS } from './state';
import { tryComplete, toClientGameState } from './puzzles';

const version = require('../package.json').version;

// ---------------------------------------------------------------------------
// Persistent state (GCS-backed, in-memory authoritative)
// ---------------------------------------------------------------------------

const GCS_BUCKET = process.env.GCS_BUCKET;
const GCS_BLOB = process.env.GCS_BLOB ?? 'state.json';
if (!GCS_BUCKET) {
  console.error('[error] [gno-2026] [state] GCS_BUCKET environment variable is required');
  process.exit(1);
}
const stateStore = new StateStore(GCS_BUCKET, GCS_BLOB);

// ---------------------------------------------------------------------------
// HTTP + Krmx server setup
// ---------------------------------------------------------------------------

const app = express();
const httpServer = createHttpServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.debug(`[debug] [http] [${req.path}] ${req.ip} ${req.method} ${req.path}`);
  next();
});
app.get('/', (_, res) => {
  res.send({ message: 'Hello GNO Dag 2026!', version });
});

/**
 * Reloads the in-memory state from GCS (e.g. after editing it via the admin
 * dashboard) and re-broadcasts it to connected clients. Read-only — it only
 * re-reads the existing blob, so no auth is required.
 */
app.post('/admin/reload', async (_, res) => {
  try {
    await stateStore.load();
    broadcastGameState();
    const puzzleCount = stateStore.get().puzzles.length;
    console.info(`[info] [gno-2026] [state] reloaded ${puzzleCount} puzzles via /admin/reload`);
    res.send({ ok: true, puzzleCount });
  } catch (e) {
    console.error(`[error] [gno-2026] [state] /admin/reload failed: ${(e as Error).message}`);
    res.status(500).send({ ok: false, error: (e as Error).message });
  }
});

/** The two players allowed to connect. */
const VALID_PLAYERS = ['Govie', 'Jac.'] as const;
type PlayerName = typeof VALID_PLAYERS[number];

const server = createServer({
  http: { server: httpServer, path: 'krmx', queryParams: { version } },
  logger: (_severity: LogSeverity, ...args: unknown[]) => {
    const severity = _severity === 'info' ? 'debug' : _severity;
    console[severity](`[${severity}] [server] [krmx]`, ...args);
  },
  isValidUsername(username: string) {
    return (VALID_PLAYERS as readonly string[]).includes(username);
  },
});

enableUnlinkedKicker(server, {
  inactivitySeconds: 120,
  logger: message => console.debug(`[info] [server] [unlinked-kicker] ${message}`),
});

// ---------------------------------------------------------------------------
// Game state
// ---------------------------------------------------------------------------

/**
 * Latest known GPS position for each player (null = not yet received).
 */
const positions: Record<PlayerName, LatLng | null> = {
  'Govie': null,
  'Jac.': null,
};

/**
 * Recent movement trail per player, as normalised map points (oldest first).
 * Transient, in-memory only — not persisted. A new point is only appended once
 * the player has moved at least TRAIL_MIN_DIST_METERS, so the trail length is
 * distance-based and independent of GPS update frequency.
 */
const trails: Record<PlayerName, Point[]> = {
  'Govie': [],
  'Jac.': [],
};
/** GPS position of each trail's most recent point, used for distance sampling. */
const trailAnchors: Record<PlayerName, LatLng | null> = {
  'Govie': null,
  'Jac.': null,
};
const TRAIL_MAX_POINTS = 45;
const TRAIL_MIN_DIST_METERS = 5;

/** Appends the player's new position to their trail when they've moved far enough. */
function updateTrail(player: PlayerName, pos: LatLng) {
  const anchor = trailAnchors[player];
  if (anchor && distanceTo(anchor, pos) < TRAIL_MIN_DIST_METERS) {
    return;
  }
  const trail = trails[player];
  trail.push(geoTransform.toPoint(pos));
  if (trail.length > TRAIL_MAX_POINTS) {
    trail.splice(0, trail.length - TRAIL_MAX_POINTS);
  }
  trailAnchors[player] = pos;
}

/** Clears a player's trail (e.g. when they leave or go out of range). */
function clearTrail(player: PlayerName) {
  trails[player] = [];
  trailAnchors[player] = null;
}

/** Builds the positions broadcast payload (current positions + trails). */
function positionsPayload() {
  return {
    'Govie': positions['Govie'] ? geoTransform.toPoint(positions['Govie']) : null,
    'Jac.': positions['Jac.'] ? geoTransform.toPoint(positions['Jac.']) : null,
    trails,
  };
}

/**
 * Broadcast the current positions (converted to virtual map coordinates) to
 * every connected player.
 */
function broadcastPositions() {
  const payload = positionsPayload();

  server.getUsers()
    .filter(u => u.isLinked)
    .forEach(u => {
      server.send(u.username, { type: 'positions', payload });
    });
}

/** Broadcast the current game state (puzzles + scores) to every connected player. */
function broadcastGameState() {
  const payload = toClientGameState(stateStore.get(), positions);
  lastGameStateSignature = JSON.stringify(payload);
  server.getUsers()
    .filter(u => u.isLinked)
    .forEach(u => {
      server.send(u.username, { type: 'game-state', payload });
    });
}

/**
 * The derived game state (open/locked) depends on player positions, so it can
 * change without any persisted mutation. We track a signature of the last
 * broadcast and only re-broadcast when the derived state actually changes.
 */
let lastGameStateSignature = '';

/** Broadcasts the game state only if its derived form changed since last broadcast. */
function maybeBroadcastGameState() {
  const payload = toClientGameState(stateStore.get(), positions);
  const signature = JSON.stringify(payload);
  if (signature !== lastGameStateSignature) {
    broadcastGameState();
  }
}

// ---------------------------------------------------------------------------
// Krmx event handlers
// ---------------------------------------------------------------------------

server.on('link', (username) => {
  const player = username as PlayerName;
  console.info(`[info] [gno-2026] [player] ${player} linked`);

  // Send the player's last-known position FIRST, before anything else. A
  // (re)joining client (notably the dev simulator) waits for this message and
  // resumes exactly where it left off, instead of snapping to a default
  // position and drawing a spurious jump in its trail. `null` means we have no
  // prior position for this player (fresh server or kicked after going idle).
  server.send(username, {
    type: 'last-position',
    payload: positions[player] ? geoTransform.toPoint(positions[player]!) : null,
  });

  // Send current state immediately so the joining player sees the map right away.
  server.send(username, { type: 'positions', payload: positionsPayload() });
  server.send(username, { type: 'game-state', payload: toClientGameState(stateStore.get(), positions) });
});

server.on('leave', (username) => {
  const player = username as PlayerName;
  console.info(`[info] [gno-2026] [player] ${player} left — clearing position`);
  positions[player] = null;
  clearTrail(player);
  broadcastPositions();
  maybeBroadcastGameState();
});

server.on('message', (username, message) => {
  const player = username as PlayerName;

  if (message.type === 'location') {
    const { lat, lng } = message.payload as { lat: number; lng: number };
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      console.warn(`[warn] [gno-2026] [player] ${player} sent invalid location payload`);
      return;
    }
    console.debug(`[debug] [gno-2026] [player] ${player} location update: ${lat}, ${lng}`);
    positions[player] = { lat, lng };
    updateTrail(player, { lat, lng });
    broadcastPositions();
    maybeBroadcastGameState();
  } else if (message.type === 'clear-location') {
    console.debug(`[debug] [gno-2026] [player] ${player} cleared location (out of range)`);
    positions[player] = null;
    clearTrail(player);
    broadcastPositions();
    maybeBroadcastGameState();
  } else if (message.type === 'complete-puzzle') {
    const { id, answer } = message.payload as { id: string; answer: string };
    if (typeof id !== 'string' || typeof answer !== 'string') {
      console.warn(`[warn] [gno-2026] [player] ${player} sent invalid complete-puzzle payload`);
      return;
    }
    const result = tryComplete(stateStore.get(), positions, player, id, answer, PUZZLE_PROXIMITY_METERS);
    server.send(username, {
      type: 'puzzle-result',
      payload: { id, success: result.success, message: result.message },
    });
    if (result.mutated) {
      console.info(`[info] [gno-2026] [player] ${player} completed puzzle ${id}`);
      stateStore.save();
      // Completing a puzzle changes scores, which may unlock other puzzles.
      broadcastGameState();
    }
  } else {
    console.warn(`[warn] [gno-2026] ${username} sent unknown message type: ${message.type}`);
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

stateStore.load().then(() => {
  server.listen(8082);
  console.info(`[info] [gno-2026] [server] GNO Dag 2026 server v${version} started on port 8082`);
});
