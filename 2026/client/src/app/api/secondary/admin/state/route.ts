import { createStateRoute } from '@/lib/admin-routes';

// Secondary variant — operates on a different GCS blob, optionally guarded by
// a different admin password. Falls back to ADMIN_PASSWORD when
// ADMIN_PASSWORD_SECONDARY is unset, so a single password works for both
// instances by default.

export const dynamic = 'force-dynamic';

const handlers = createStateRoute({
  blobEnv: 'GCS_BLOB_SECONDARY',
  defaultBlob: 'state-dev.json',
  passwordEnv: 'ADMIN_PASSWORD_SECONDARY',
  passwordFallbackEnv: 'ADMIN_PASSWORD',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
