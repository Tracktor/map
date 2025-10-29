import type { Feature, GeoJsonProperties, LineString } from "geojson";

export type MapboxProfile = "driving" | "walking" | "cycling";

export interface Destination {
  id: number | string;
  coords: [number, number];
}

export interface NearestResult {
  distance: number;
  id: number | string;
  point: [number, number];
}

export interface RouteFeature extends Feature<LineString, GeoJsonProperties> {
  properties: {
    distance: number;
    duration: number;
  };
}
