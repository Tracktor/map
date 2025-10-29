import type { RouteFeature, RoutingProfile } from "@/services/core/interface";
import { buildMapboxUrl, fetchMapbox } from "@/services/Mapbox/client";

interface MapboxRouteResponse {
  routes: {
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
  }[];
}

/**
 * Get a route between two points using Mapbox Directions API.
 * Returns a GeoJSON Feature (LineString) or null if not found.
 */
const getItinerary = async (
  from: [number, number],
  to: [number, number],
  profile: RoutingProfile = "driving",
): Promise<RouteFeature | null> => {
  const coords = `${from.join(",")};${to.join(",")}`;
  const url = buildMapboxUrl("directions", "v5", profile, coords, {
    geometries: "geojson",
    overview: "full",
  });

  const data = await fetchMapbox<MapboxRouteResponse>(url);
  if (!data?.routes?.length) {
    return null;
  }

  const route = data.routes[0];
  return {
    geometry: route.geometry,
    properties: {
      distance: route.distance,
      duration: route.duration,
    },
    type: "Feature",
  };
};

export default getItinerary;
