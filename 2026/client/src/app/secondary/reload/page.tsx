'use client';

import { ReloadApp } from '@/components/reload-app';

export default function SecondaryReloadPage() {
  return <ReloadApp apiPath="/api/secondary/admin/reload" title="Server state herladen (secondary)" />;
}
