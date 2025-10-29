import type { RoutingProfile } from "@/services/core/interface";
import { buildMapboxUrl, fetchMapbox } from "@/services/Mapbox/client";

export interface MapboxIsochroneResponse extends GeoJSON.FeatureCollection<GeoJSON.Polygon> {}

const getIsochrone = async (
  from: [number, number],
  profile: RoutingProfile = "driving",
  intervals: number[] = [5, 10, 15],
): Promise<MapboxIsochroneResponse | null> => {
  const coords = `${from[0]},${from[1]}`;

  const url = buildMapboxUrl("isochrone", "v1", profile, coords, {
    contours_minutes: intervals.join(","),
    polygons: "true",
  });

  return await fetchMapbox<MapboxIsochroneResponse>(url);
};

export default getIsochrone;
