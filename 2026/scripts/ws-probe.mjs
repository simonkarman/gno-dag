// Probe the two Krmx websocket endpoints and log handshake + framing details.
// Useful for diagnosing the "Invalid WebSocket frame: RSV1 must be clear" class
// of bugs that arises when multiple ws.WebSocketServer instances are attached
// to the same http server. Run with the server up:
//
//   node scripts/ws-probe.mjs
//
// Expected healthy output: HTTP 101 → OPEN → CLOSE code=1000 for all three
// probes (primary alone, secondary alone, both in parallel).

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('../server/node_modules/ws');

const PRIMARY   = 'ws://localhost:8082/krmx?version=0.0.1';
const SECONDARY = 'ws://localhost:8082/secondary/krmx?version=0.0.1';

function probe(label, url, { hold = 1500 } = {}) {
  return new Promise((resolve) => {
    console.log(`\n[${label}] connecting to ${url}`);
    const ws = new WebSocket(url, {
      perMessageDeflate: false,
      handshakeTimeout: 5000,
    });

    let openedAt = null;

    ws.on('upgrade', (res) => {
      console.log(`[${label}] HTTP ${res.statusCode} ${res.statusMessage}`);
    });

    ws.on('open', () => {
      openedAt = Date.now();
      console.log(`[${label}] OPEN  readyState=${ws.readyState}`);
    });

    ws.on('message', (data, isBinary) => {
      const elapsed = openedAt ? `${Date.now() - openedAt}ms` : 'pre-open';
      console.log(`[${label}] MSG (${elapsed}, binary=${isBinary}, len=${data.length}):`, data.toString('utf-8'));
    });

    ws.on('error', (err) => {
      console.log(`[${label}] ERROR: ${err.message} (code=${err.code ?? 'n/a'})`);
    });

    ws.on('close', (code, reason) => {
      console.log(`[${label}] CLOSE code=${code} reason="${reason?.toString?.('utf-8') ?? ''}"`);
      resolve();
    });

    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log(`[${label}] idle hold elapsed — closing`);
        ws.close(1000, 'probe-done');
      } else if (ws.readyState !== WebSocket.CLOSED) {
        console.log(`[${label}] not open after ${hold}ms — terminating (readyState=${ws.readyState})`);
        ws.terminate();
      }
    }, hold);
  });
}

async function main() {
  console.log('=== Probe 1: primary alone ===');
  await probe('primary-only', PRIMARY);

  console.log('\n=== Probe 2: secondary alone ===');
  await probe('secondary-only', SECONDARY);

  console.log('\n=== Probe 3: both in parallel ===');
  await Promise.all([
    probe('parallel-primary', PRIMARY),
    probe('parallel-secondary', SECONDARY),
  ]);

  console.log('\n=== Done. ===');
}

main().catch((e) => {
  console.error('script failed:', e);
  process.exit(1);
});
