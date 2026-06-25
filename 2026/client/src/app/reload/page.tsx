'use client';

import { ReloadApp } from '@/components/reload-app';

export default function ReloadPage() {
  return <ReloadApp apiPath="/api/admin/reload" title="Server state herladen" />;
}
