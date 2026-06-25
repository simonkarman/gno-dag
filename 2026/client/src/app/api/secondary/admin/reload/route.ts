import { createReloadRoute } from '@/lib/admin-routes';

// Proxies a reload request to the secondary game server, which re-reads its
// state from GCS and re-broadcasts it to connected clients. Read-only — no
// auth required.

export const dynamic = 'force-dynamic';

const handlers = createReloadRoute({ pathSegment: '/secondary/admin/reload' });

export const POST = handlers.POST;
