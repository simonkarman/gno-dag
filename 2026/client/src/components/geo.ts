/**
 * Shared geo-transform constants and utilities for the client.
 *
 * These must stay in sync with the server's `geo-transform.ts`.
 * The bounding box defines the real-world rectangle that maps onto the full
 * [0, 1] × [0, 1] virtual canvas used by the SVG map.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Bounding box around Jac. and Govie's house.
 */
export const GAME_BOUNDS = {
  nw: { lat: 52.078461190150676, lng: 4.745871082487575 }, // north-west corner
  se: { lat: 52.07577514949872,  lng: 4.75379564175936  }, // south-east corner
};

/** How many degrees of margin beyond the bounds before a player is considered "out of range". */
const OUT_OF_RANGE_MARGIN = 0.002; // ~200m

/** Returns true if the position is within (or close to) the game area. */
export function isInRange(pos: LatLng): boolean {
  return (
    pos.lat <= GAME_BOUNDS.nw.lat + OUT_OF_RANGE_MARGIN &&
    pos.lat >= GAME_BOUNDS.se.lat - OUT_OF_RANGE_MARGIN &&
    pos.lng >= GAME_BOUNDS.nw.lng - OUT_OF_RANGE_MARGIN &&
    pos.lng <= GAME_BOUNDS.se.lng + OUT_OF_RANGE_MARGIN
  );
}

/** The house of Jac. and Govie — used as the reference point for distance. */
export const HOUSE: LatLng = { lat: 52.07732828333311, lng: 4.749337088821905 };

/** Returns the distance in metres between two GPS coordinates (Haversine formula). */
export function distanceTo(a: LatLng, b: LatLng): number {
  const R = 6_371_000; // Earth radius in metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Formats a distance in metres as a human-readable string. */
export function formatDistance(metres: number): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  return `${(metres / 1000).toFixed(1)} km`;
}

/** Convert a GPS coordinate to a normalised {x, y} point in [0, 1]. */
export function toPoint(pos: LatLng): Point {
  const x = (pos.lng - GAME_BOUNDS.nw.lng) / (GAME_BOUNDS.se.lng - GAME_BOUNDS.nw.lng);
  const y = (pos.lat - GAME_BOUNDS.nw.lat) / (GAME_BOUNDS.se.lat - GAME_BOUNDS.nw.lat);
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y)),
  };
}

/** Convert a normalised {x, y} point in [0, 1] back to a GPS coordinate (inverse of toPoint). */
export function fromPoint(point: Point): LatLng {
  return {
    lng: GAME_BOUNDS.nw.lng + point.x * (GAME_BOUNDS.se.lng - GAME_BOUNDS.nw.lng),
    lat: GAME_BOUNDS.nw.lat + point.y * (GAME_BOUNDS.se.lat - GAME_BOUNDS.nw.lat),
  };
}
