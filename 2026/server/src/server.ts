import 'dotenv/config';
import './json-logging';
import express from 'express';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import { Duplex } from 'stream';
import { createServer } from '@krmx/server';
import { LogSeverity } from '@krmx/base';
import { enableUnlinkedKicker } from './unlinked-kicker';
import { LatLng, Point, geoTransform, distanceTo } from './geo-transform';
import { StateStore, PUZZLE_PROXIMITY_METERS } from './state';
import { tryComplete, toClientGameState } from './puzzles';

const version = require('../package.json').version;

// ---------------------------------------------------------------------------
// Env / config
// ---------------------------------------------------------------------------

const GCS_BUCKET = process.env.GCS_BUCKET;
const GCS_BLOB = process.env.GCS_BLOB ?? 'state.json';
const GCS_BLOB_SECONDARY = process.env.GCS_BLOB_SECONDARY ?? 'state-dev.json';
if (!GCS_BUCKET) {
  console.error('[error] [gno-2026] [state] GCS_BUCKET environment variable is required');
  process.exit(1);
}
if (GCS_BLOB === GCS_BLOB_SECONDARY) {
  console.error(
    `[error] [gno-2026] [state] GCS_BLOB and GCS_BLOB_SECONDARY must differ (both are "${GCS_BLOB}"); ` +
    'pointing both instances at the same blob would cause concurrent writes and data loss.',
  );
  process.exit(1);
}

/** The two players allowed to connect. */
const VALID_PLAYERS = ['Govie', 'Jac.'] as const;
type PlayerName = typeof VALID_PLAYERS[number];

// ---------------------------------------------------------------------------
// HTTP server (shared between both Krmx instances)
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

// ---------------------------------------------------------------------------
// attachInstance — wires up an independent Krmx server + game state on the
// shared HTTP server. Called once per instance (primary, secondary).
// ---------------------------------------------------------------------------

interface InstanceOptions {
  label: 'primary' | 'secondary';
  krmxPath: string;
  gcsBlob: string;
  adminReloadPath: string;
}

interface Instance {
  load(): Promise<void>;
  listen(port: number): Promise<unknown>;
  /** The dummy http server this Krmx instance was attached to. Used by the
   *  top-level upgrade dispatcher to forward upgrade events to the right
   *  WebSocketServer based on the request pathname. */
  dummyHttpServer: HttpServer;
  /** Normalised pathname (with leading slash) this instance should handle. */
  pathname: string;
}

function attachInstance(opts: InstanceOptions): Instance {
  const { label, krmxPath, gcsBlob, adminReloadPath } = opts;

  // -- Persistent state -----------------------------------------------------
  const stateStore = new StateStore(GCS_BUCKET!, gcsBlob);

  // -- Dummy http server (per-instance, NEVER bound to a port) -------------
  // Sharing one real http server across two Krmx instances does not work:
  // each `createServer` attaches a fresh ws.WebSocketServer to the http
  // server's 'upgrade' event, and BOTH listeners run for EVERY upgrade. The
  // one whose `path` does not match calls `abortHandshake(socket, 400)` on
  // the same socket the other one just upgraded with `101 Switching
  // Protocols`, corrupting the wire (client sees "Invalid WebSocket frame:
  // RSV1 must be clear") or returning HTTP 400 (depending on listener order).
  //
  // Fix: give each Krmx instance its own dummy http server, attach Krmx's
  // WebSocketServer to that dummy, and install ONE 'upgrade' listener on the
  // real http server that dispatches the upgrade to the right dummy based on
  // the request pathname. The dummy is never `.listen()`-ed on a port — its
  // `listen()` and `address()` are overridden to mirror the real server.
  const dummyHttpServer = new HttpServer();
  // Override .listen() to be a no-op that immediately emits 'listening' so
  // Krmx's .listen() flow (which awaits the http server's 'listening' event)
  // resolves without actually binding a port.
  (dummyHttpServer as unknown as { listen: unknown }).listen = (() => {
    setImmediate(() => dummyHttpServer.emit('listening'));
    return dummyHttpServer;
  });
  // Override address() to mirror whatever the real httpServer reports. Krmx
  // calls this in the shortcut path of its .listen() to compare ports.
  (dummyHttpServer as unknown as { address: unknown }).address = () => httpServer.address();
  // Make `listening` mirror the real server. Krmx checks this property in its
  // .listen() to decide whether to take the shortcut branch. Using a getter
  // means it stays in sync as the real server starts/stops.
  Object.defineProperty(dummyHttpServer, 'listening', {
    configurable: true,
    get: () => httpServer.listening,
  });

  // Normalised pathname (with leading slash) used for upgrade dispatch.
  const pathname = krmxPath.startsWith('/') ? krmxPath : `/${krmxPath}`;

  // -- Krmx server ----------------------------------------------------------
  const server = createServer({
    http: { server: dummyHttpServer, path: krmxPath, queryParams: { version } },
    logger: (_severity: LogSeverity, ...args: unknown[]) => {
      const severity = _severity === 'info' ? 'debug' : _severity;
      console[severity](`[${severity}] [server] [${label}] [krmx]`, ...args);
    },
    isValidUsername(username: string) {
      return (VALID_PLAYERS as readonly string[]).includes(username);
    },
  });

  enableUnlinkedKicker(server, {
    inactivitySeconds: 120,
    logger: message => console.debug(`[info] [server] [${label}] [unlinked-kicker] ${message}`),
  });

  // -- Per-instance game state ---------------------------------------------
  const positions: Record<PlayerName, LatLng | null> = {
    'Govie': null,
    'Jac.': null,
  };

  const trails: Record<PlayerName, Point[]> = {
    'Govie': [],
    'Jac.': [],
  };
  const trailAnchors: Record<PlayerName, LatLng | null> = {
    'Govie': null,
    'Jac.': null,
  };
  const TRAIL_MAX_POINTS = 45;
  const TRAIL_MIN_DIST_METERS = 5;

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

  function clearTrail(player: PlayerName) {
    trails[player] = [];
    trailAnchors[player] = null;
  }

  function positionsPayload() {
    return {
      'Govie': positions['Govie'] ? geoTransform.toPoint(positions['Govie']) : null,
      'Jac.': positions['Jac.'] ? geoTransform.toPoint(positions['Jac.']) : null,
      trails,
    };
  }

  function broadcastPositions() {
    const payload = positionsPayload();
    server.getUsers()
      .filter(u => u.isLinked)
      .forEach(u => {
        server.send(u.username, { type: 'positions', payload });
      });
  }

  let lastGameStateSignature = '';

  function broadcastGameState() {
    const payload = toClientGameState(stateStore.get(), positions);
    lastGameStateSignature = JSON.stringify(payload);
    server.getUsers()
      .filter(u => u.isLinked)
      .forEach(u => {
        server.send(u.username, { type: 'game-state', payload });
      });
  }

  function maybeBroadcastGameState() {
    const payload = toClientGameState(stateStore.get(), positions);
    const signature = JSON.stringify(payload);
    if (signature !== lastGameStateSignature) {
      broadcastGameState();
    }
  }

  // -- Admin HTTP route ----------------------------------------------------
  /**
   * Reloads the in-memory state from GCS (e.g. after editing it via the admin
   * dashboard) and re-broadcasts it to connected clients. Read-only — it only
   * re-reads the existing blob, so no auth is required.
   */
  app.post(adminReloadPath, async (_, res) => {
    try {
      await stateStore.load();
      broadcastGameState();
      const puzzleCount = stateStore.get().puzzles.length;
      console.info(`[info] [gno-2026] [${label}] [state] reloaded ${puzzleCount} puzzles via ${adminReloadPath}`);
      res.send({ ok: true, puzzleCount });
    } catch (e) {
      console.error(`[error] [gno-2026] [${label}] [state] ${adminReloadPath} failed: ${(e as Error).message}`);
      res.status(500).send({ ok: false, error: (e as Error).message });
    }
  });

  // -- Krmx event handlers --------------------------------------------------
  server.on('link', (username) => {
    const player = username as PlayerName;
    console.info(`[info] [gno-2026] [${label}] [player] ${player} linked`);

    // Send the player's last-known position FIRST, before anything else. A
    // (re)joining client (notably the dev simulator) waits for this message
    // and resumes exactly where it left off, instead of snapping to a default
    // position and drawing a spurious jump in its trail. `null` means we have
    // no prior position for this player (fresh server or kicked after going
    // idle).
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
    console.info(`[info] [gno-2026] [${label}] [player] ${player} left — clearing position`);
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
        console.warn(`[warn] [gno-2026] [${label}] [player] ${player} sent invalid location payload`);
        return;
      }
      console.debug(`[debug] [gno-2026] [${label}] [player] ${player} location update: ${lat}, ${lng}`);
      positions[player] = { lat, lng };
      updateTrail(player, { lat, lng });
      broadcastPositions();
      maybeBroadcastGameState();
    } else if (message.type === 'clear-location') {
      console.debug(`[debug] [gno-2026] [${label}] [player] ${player} cleared location (out of range)`);
      positions[player] = null;
      clearTrail(player);
      broadcastPositions();
      maybeBroadcastGameState();
    } else if (message.type === 'complete-puzzle') {
      const { id, answer } = message.payload as { id: string; answer: string };
      if (typeof id !== 'string' || typeof answer !== 'string') {
        console.warn(`[warn] [gno-2026] [${label}] [player] ${player} sent invalid complete-puzzle payload`);
        return;
      }
      const result = tryComplete(stateStore.get(), positions, player, id, answer, PUZZLE_PROXIMITY_METERS);
      server.send(username, {
        type: 'puzzle-result',
        payload: { id, success: result.success, message: result.message },
      });
      if (result.mutated) {
        console.info(`[info] [gno-2026] [${label}] [player] ${player} completed puzzle ${id}`);
        stateStore.save();
        // Completing a puzzle changes scores, which may unlock other puzzles.
        broadcastGameState();
      }
    } else {
      console.warn(`[warn] [gno-2026] [${label}] ${username} sent unknown message type: ${message.type}`);
    }
  });

  return {
    load: () => stateStore.load(),
    // Krmx's .listen() flips its internal status to 'listening' (without
    // which it refuses every incoming WebSocket upgrade). The underlying
    // dummy http server's .listen() is a no-op that immediately emits
    // 'listening', so this resolves without binding a port. The real http
    // server is started separately at the top level.
    listen: (port: number) => server.listen(port),
    dummyHttpServer,
    pathname,
  };
}

// ---------------------------------------------------------------------------
// Mount both instances and start
// ---------------------------------------------------------------------------

const primary = attachInstance({
  label: 'primary',
  krmxPath: 'krmx',
  gcsBlob: GCS_BLOB,
  adminReloadPath: '/admin/reload',
});

const secondary = attachInstance({
  label: 'secondary',
  krmxPath: 'secondary/krmx',
  gcsBlob: GCS_BLOB_SECONDARY,
  adminReloadPath: '/secondary/admin/reload',
});

// ---------------------------------------------------------------------------
// Upgrade dispatcher — the heart of the multi-Krmx-on-one-port fix. ws does
// not support multiple WebSocketServers attached to the same http server (see
// the long comment inside attachInstance). We attach each Krmx instance to
// its own dummy http server, then a single 'upgrade' listener on the REAL
// http server forwards each upgrade to the matching dummy.
// ---------------------------------------------------------------------------

const instances = [primary, secondary];

httpServer.on('upgrade', (req, socket: Duplex, head) => {
  const url = req.url ?? '';
  const qIndex = url.indexOf('?');
  const pathname = qIndex === -1 ? url : url.slice(0, qIndex);

  const target = instances.find(i => i.pathname === pathname);
  if (!target) {
    console.debug(`[debug] [server] [upgrade] no Krmx instance handles ${pathname}; rejecting`);
    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
    socket.destroy();
    return;
  }
  // Forward to the dummy http server; ws's listener on that dummy will run
  // WebSocketServer.handleUpgrade and complete the handshake cleanly.
  target.dummyHttpServer.emit('upgrade', req, socket, head);
});

(async () => {
  // Load both blobs in parallel — they are independent.
  await Promise.all([primary.load(), secondary.load()]);

  // Start the REAL http server first. Each Krmx instance's dummy http server
  // mirrors this one's `listening` flag and `address()`, so once the real
  // server is bound, the dummies report bound too.
  await new Promise<void>(resolve => httpServer.listen(8082, () => resolve()));

  // Then bring each Krmx instance to 'listening' state. Krmx will see its
  // dummy's `listening === true` and take the shortcut branch, flipping its
  // internal status without trying to bind a port.
  await Promise.all([primary.listen(8082), secondary.listen(8082)]);

  console.info(`[info] [gno-2026] [server] GNO Dag 2026 server v${version} started on port 8082`);
  console.info(`[info] [gno-2026] [server] primary   → ws /krmx           (blob: ${GCS_BLOB})`);
  console.info(`[info] [gno-2026] [server] secondary → ws /secondary/krmx (blob: ${GCS_BLOB_SECONDARY})`);
})();
