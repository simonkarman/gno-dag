'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { GpsBeacon } from '@/components/gps-beacon';

const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL_SECONDARY ?? 'ws://localhost:8082/secondary/krmx?version=0.0.1';

/** URL slug → base player name. */
const SLUG_TO_PLAYER: Record<string, 'Govie' | 'Jac.'> = {
  govie: 'Govie',
  jac:   'Jac.',
};

/**
 * GPS broadcaster page for the secondary instance.
 *
 * URL: /secondary/gps/govie  or  /secondary/gps/jac
 *
 * Mirrors `/gps/<player>` but connects to the secondary Krmx instance and
 * is always in dev mode (arrow-key simulated GPS) — so the secondary stays
 * fully usable as a remote staging environment without needing real GPS.
 */
export default function SecondaryGpsBeaconPage({ params }: { params: Promise<{ player: string }> }) {
  const { player: slug } = use(params);
  const player = SLUG_TO_PLAYER[slug.toLowerCase()];
  if (!player) notFound();
  return <GpsBeacon player={player} serverUrl={serverUrl} forceDev />;
}
