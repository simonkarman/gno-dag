'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { GpsBeacon } from '@/components/gps-beacon';

const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL ?? 'ws://localhost:8082/krmx?version=0.0.1';

/** URL slug → base player name. */
const SLUG_TO_PLAYER: Record<string, 'Govie' | 'Jac.'> = {
  govie: 'Govie',
  jac:   'Jac.',
};

/**
 * GPS broadcaster page for the primary instance.
 *
 * URL: /gps/govie  or  /gps/jac
 *
 * Opened on the team's phone. Connects to the primary Krmx instance as
 * `Govie-gps` / `Jac.-gps`, broadcasts the device's GPS, and keeps the
 * screen awake. Nothing else — no map, no puzzles.
 */
export default function GpsBeaconPage({ params }: { params: Promise<{ player: string }> }) {
  const { player: slug } = use(params);
  const player = SLUG_TO_PLAYER[slug.toLowerCase()];
  if (!player) notFound();
  return <GpsBeacon player={player} serverUrl={serverUrl} />;
}
