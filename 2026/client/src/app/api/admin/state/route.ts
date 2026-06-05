import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

// This route is local-tooling only. It is fully DISABLED unless ADMIN_PASSWORD
// is set in the environment (so production, which never sets it, refuses all
// requests). Locally it also needs Application Default Credentials for GCS:
//   gcloud auth application-default login

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const GCS_BUCKET = process.env.GCS_BUCKET;
const GCS_BLOB = process.env.GCS_BLOB ?? 'state.json';

/** Returns a NextResponse error if the request is not authorised / not enabled, else null. */
function guard(req: NextRequest): NextResponse | null {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin is disabled (ADMIN_PASSWORD not set).' }, { status: 503 });
  }
  if (!GCS_BUCKET) {
    return NextResponse.json({ error: 'GCS_BUCKET not configured.' }, { status: 500 });
  }
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return null;
}

function file() {
  // Pass the project explicitly to avoid the GCP client probing the (locally
  // unreachable) GCE metadata server to discover it, which stalls ~5s. This is
  // a server-side route handler, so a plain process.env var is fine.
  return new Storage({ projectId: process.env.GOOGLE_CLOUD_PROJECT }).bucket(GCS_BUCKET!).file(GCS_BLOB);
}

export async function GET(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;

  try {
    const f = file();
    const [exists] = await f.exists();
    if (!exists) {
      return NextResponse.json({ puzzles: [] });
    }
    const [contents] = await f.download();
    return NextResponse.json(JSON.parse(contents.toString('utf-8')), {
      headers: { 'x-gcs-blob': GCS_BLOB },
    });
  } catch (e) {
    return NextResponse.json({ error: `Failed to load: ${(e as Error).message}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const denied = guard(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    if (!body || !Array.isArray(body.puzzles)) {
      return NextResponse.json({ error: 'Invalid state shape.' }, { status: 400 });
    }
    await file().save(JSON.stringify(body, null, 2), { contentType: 'application/json' });
    return NextResponse.json({ ok: true, blob: GCS_BLOB });
  } catch (e) {
    return NextResponse.json({ error: `Failed to save: ${(e as Error).message}` }, { status: 500 });
  }
}
