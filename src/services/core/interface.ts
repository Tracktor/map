import type { Feature, GeoJsonProperties, LineString } from "geojson";
import { MapboxIsochroneResponse } from "@/services/Mapbox/getIsochrone.ts";

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

export interface MapRoutingProvider {
  getItinerary(from: [number, number], to: [number, number], profile?: string): Promise<RouteFeature | null>;
  findNearest(
    from: [number, number],
    destinations: Destination[],
    profile?: RoutingProfile,
    maxDistanceMeters?: number,
  ): Promise<NearestResult | null>;
  getIsochrone?(from: [number, number], profile?: RoutingProfile, intervals?: number[]): Promise<MapboxIsochroneResponse | null>;
}

export interface Destination {
  id: number | string;
  coords: [number, number];
}

export interface NearestResult {
  distance: number;
  id: number | string;
  point: [number, number];
}
