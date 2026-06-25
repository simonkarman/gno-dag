'use client';

import { AdminApp } from '@/components/admin-app';

export default function SecondaryAdminPage() {
  return (
    <AdminApp
      apiBase="/api/secondary/admin"
      pwStorageKey="gno-admin-pw-secondary"
      title="GNO Admin (secondary)"
    />
  );
}
