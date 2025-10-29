import type { Feature, Geometry, Position } from "geojson";

/**
 * Check if a [lng, lat] point is inside a GeoJSON Polygon or MultiPolygon.
 *
 * Works for any GeoJSON Feature or Geometry (e.g. isochrones).
 * Pure functional implementation (no `let`).
 */
const isPointInGeoJSON = (point: [number, number], geometry: Geometry | Feature<Geometry>): boolean => {
  const geom = "geometry" in geometry ? geometry.geometry : geometry;
  const [x, y] = point;

  const isInPolygon = (polygon: Position[][]): boolean =>
    polygon
      .map((ring) =>
        (ring as [number, number][]).reduce((inside, [xi, yi], i, arr) => {
          const [xj, yj] = arr[(i - 1 + arr.length) % arr.length];
          const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          return intersect ? !inside : inside;
        }, false),
      )
      .reduce((acc, ringInside, i) => (i === 0 ? ringInside : acc && !ringInside), false);

  if (geom.type === "Polygon") {
    return isInPolygon(geom.coordinates);
  }

  if (geom.type === "MultiPolygon") {
    return geom.coordinates.some((polygon) => isInPolygon(polygon));
  }

  return false;
};

export default isPointInGeoJSON;
