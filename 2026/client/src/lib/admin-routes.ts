import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// Shared helpers for the admin API routes. Each variant (primary, secondary)
// supplies the env vars it should look at, so the same route logic can drive
// both /api/admin/* and /api/secondary/admin/*.

export interface StateRouteConfig {
  /** Env var holding the GCS blob name. */
  blobEnv: string;
  /** Default blob name if the env var is unset. */
  defaultBlob: string;
  /** Env var holding the admin password. */
  passwordEnv: string;
  /** Optional fallback password env var (used when `passwordEnv` is unset). */
  passwordFallbackEnv?: string;
}

function guard(req: NextRequest, cfg: StateRouteConfig): NextResponse | null {
  const password = process.env[cfg.passwordEnv] ?? (cfg.passwordFallbackEnv ? process.env[cfg.passwordFallbackEnv] : undefined);
  if (!password) {
    return NextResponse.json({ error: 'Admin is disabled (admin password not set).' }, { status: 503 });
  }
  if (!process.env.GCS_BUCKET) {
    return NextResponse.json({ error: 'GCS_BUCKET not configured.' }, { status: 500 });
  }
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (token !== password) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return null;
}

function file(cfg: StateRouteConfig) {
  const blob = process.env[cfg.blobEnv] ?? cfg.defaultBlob;
  // Pass the project explicitly to avoid the GCP client probing the (locally
  // unreachable) GCE metadata server to discover it, which stalls ~5s.
  return {
    blob,
    handle: new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT }).bucket(process.env.GCS_BUCKET!).file(blob),
  };
}

/** Builds GET + PUT handlers for an admin state route. */
export function createStateRoute(cfg: StateRouteConfig) {
  async function GET(req: NextRequest) {
    const denied = guard(req, cfg);
    if (denied) return denied;
    try {
      const { blob, handle } = file(cfg);
      const [exists] = await handle.exists();
      if (!exists) {
        return NextResponse.json({ puzzles: [] }, { headers: { 'x-gcs-blob': blob } });
      }
      const [contents] = await handle.download();
      return NextResponse.json(JSON.parse(contents.toString('utf-8')), {
        headers: { 'x-gcs-blob': blob },
      });
    } catch (e) {
      return NextResponse.json({ error: `Failed to load: ${(e as Error).message}` }, { status: 500 });
    }
  }

  async function PUT(req: NextRequest) {
    const denied = guard(req, cfg);
    if (denied) return denied;
    try {
      const body = await req.json();
      if (!body || !Array.isArray(body.puzzles)) {
        return NextResponse.json({ error: 'Invalid state shape.' }, { status: 400 });
      }
      const { blob, handle } = file(cfg);
      await handle.save(JSON.stringify(body, null, 2), { contentType: 'application/json' });
      return NextResponse.json({ ok: true, blob });
    } catch (e) {
      return NextResponse.json({ error: `Failed to save: ${(e as Error).message}` }, { status: 500 });
    }
  }

  return { GET, PUT };
}

export interface ReloadRouteConfig {
  /** Path on the server to POST to (e.g. `/admin/reload`). */
  pathSegment: string;
}

/** Builds a POST handler that proxies a reload request to the game server. */
export function createReloadRoute(cfg: ReloadRouteConfig) {
  async function POST() {
    const base = process.env.SERVER_HTTP_URL;
    if (!base) {
      return NextResponse.json({ error: 'SERVER_HTTP_URL not configured.' }, { status: 500 });
    }
    try {
      const res = await fetch(`${base.replace(/\/$/, '')}${cfg.pathSegment}`, { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      return NextResponse.json(body, { status: res.status });
    } catch (e) {
      return NextResponse.json({ error: `Failed to reach server: ${(e as Error).message}` }, { status: 502 });
    }
  }
  return { POST };
}
