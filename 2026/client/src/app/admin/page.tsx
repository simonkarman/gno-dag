'use client';

import { AdminApp } from '@/components/admin-app';

export default function AdminPage() {
  return (
    <AdminApp
      apiBase="/api/admin"
      pwStorageKey="gno-admin-pw"
      title="GNO Admin"
    />
  );
}
