import './json-logging';
import express from 'express';
import { createServer as createHttpServer } from 'http';
import { createServer } from '@krmx/server';
import { LogSeverity } from '@krmx/base';
import { enableUnlinkedKicker } from './unlinked-kicker';
import { LatLng, Point, geoTransform } from './geo-transform';

const version = require('../package.json').version;

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
 * Broadcast the current positions (converted to virtual map coordinates) to
 * every connected player.
 */
function broadcastPositions() {
  const payload: Record<PlayerName, Point | null> = {
    'Govie': positions['Govie'] ? geoTransform.toPoint(positions['Govie']) : null,
    'Jac.': positions['Jac.'] ? geoTransform.toPoint(positions['Jac.']) : null,
  };

  server.getUsers()
    .filter(u => u.isLinked)
    .forEach(u => {
      server.send(u.username, { type: 'positions', payload });
    });
}

// ---------------------------------------------------------------------------
// Krmx event handlers
// ---------------------------------------------------------------------------

server.on('link', (username) => {
  const player = username as PlayerName;
  console.info(`[info] [gno-2026] [player] ${player} linked`);

  // Send current state immediately so the joining player sees the map right away.
  const payload: Record<PlayerName, Point | null> = {
    'Govie': positions['Govie'] ? geoTransform.toPoint(positions['Govie']) : null,
    'Jac.': positions['Jac.'] ? geoTransform.toPoint(positions['Jac.']) : null,
  };
  server.send(username, { type: 'positions', payload });
});

server.on('leave', (username) => {
  const player = username as PlayerName;
  console.info(`[info] [gno-2026] [player] ${player} left — clearing position`);
  positions[player] = null;
  broadcastPositions();
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
    broadcastPositions();
  } else if (message.type === 'clear-location') {
    console.debug(`[debug] [gno-2026] [player] ${player} cleared location (out of range)`);
    positions[player] = null;
    broadcastPositions();
  } else {
    console.warn(`[warn] [gno-2026] ${username} sent unknown message type: ${message.type}`);
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

server.listen(8082);
console.info(`[info] [gno-2026] [server] GNO Dag 2026 server v${version} started on port 8082`);
