export interface LatLng {
  lat: number;
  lng: number;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Transforms real-world GPS coordinates into normalised 0–1 virtual map coordinates.
 *
 * The bounding box defines the real-world rectangle that maps onto the full [0,1]×[0,1]
 * virtual canvas. Coordinates outside the box are clamped to [0, 1].
 *
 * TODO: Replace the placeholder bounding box below with the actual area around
 *       Jac. and Govie's house once the real coordinates are known.
 */
export class GeoTransform {
  constructor(
    private readonly bounds: {
      /** North-west corner of the real-world area (top-left on the map). */
      nw: LatLng;
      /** South-east corner of the real-world area (bottom-right on the map). */
      se: LatLng;
    },
  ) {}

  /** Convert a GPS coordinate to a normalised {x, y} point in [0, 1]. */
  toPoint(pos: LatLng): Point {
    const x = (pos.lng - this.bounds.nw.lng) / (this.bounds.se.lng - this.bounds.nw.lng);
    const y = (pos.lat - this.bounds.nw.lat) / (this.bounds.se.lat - this.bounds.nw.lat);
    return {
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
    };
  }
}

/**
 * Bounding box around Jac. and Govie's house.
 * NW = north-east corner, SE = south-west corner of the play area.
 */
export const GAME_BOUNDS = {
  nw: { lat: 52.078461190150676, lng: 4.745871082487575 }, // north-west corner
  se: { lat: 52.07577514949872,  lng: 4.75379564175936  }, // south-east corner
};

export const geoTransform = new GeoTransform(GAME_BOUNDS);

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
