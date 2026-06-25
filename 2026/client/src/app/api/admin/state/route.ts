import { createStateRoute } from '@/lib/admin-routes';

// This route is local-tooling only. It is fully DISABLED unless ADMIN_PASSWORD
// is set in the environment (so production, which never sets it, refuses all
// requests). Locally it also needs Application Default Credentials for GCS:
//   gcloud auth application-default login

export const dynamic = 'force-dynamic';

const handlers = createStateRoute({
  blobEnv: 'GCS_BLOB',
  defaultBlob: 'state.json',
  passwordEnv: 'ADMIN_PASSWORD',
});

export const GET = handlers.GET;
export const PUT = handlers.PUT;
