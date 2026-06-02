import { NextResponse } from 'next/server';

// Proxies a reload request to the game server, which re-reads its state from GCS
// and re-broadcasts it to connected clients. Read-only — no auth required.

export const dynamic = 'force-dynamic';

const SERVER_HTTP_URL = process.env.SERVER_HTTP_URL;

export async function POST() {
  if (!SERVER_HTTP_URL) {
    return NextResponse.json({ error: 'SERVER_HTTP_URL not configured.' }, { status: 500 });
  }
  try {
    const res = await fetch(`${SERVER_HTTP_URL.replace(/\/$/, '')}/admin/reload`, {
      method: 'POST',
    });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: `Failed to reach server: ${(e as Error).message}` }, { status: 502 });
  }
}
