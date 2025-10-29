import type { Feature, GeoJsonProperties, LineString } from "geojson";

export type RoutingProfile = "driving" | "walking" | "cycling";

export interface Destination {
  id: number | string;
  coords: [number, number];
}

export interface NearestResult {
  distance: number;
  id: number | string;
  point: [number, number];
}

export type RouteFeature = Feature<LineString, GeoJsonProperties>;
