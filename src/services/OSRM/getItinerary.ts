import type { LineString } from "geojson";
import type { RouteFeature, RoutingProfile } from "@/services/core/interface";
import { buildOSRMUrl, fetchOSRM } from "@/services/OSRM/client";

interface OSRMRouteResponse {
  routes: {
    geometry: LineString;
    distance: number;
    duration: number;
  }[];
}

/**
 * Get a route between two points using the OSRM API.
 * Returns a GeoJSON Feature (LineString) or null if not found.
 */
const getItinerary = async (
  from: [number, number],
  to: [number, number],
  profile: RoutingProfile = "driving",
): Promise<RouteFeature | null> => {
  const path = `${from.join(",")};${to.join(",")}`;
  const url = buildOSRMUrl("route", profile, path, {
    geometries: "geojson",
    overview: "full",
  });

  const data = await fetchOSRM<OSRMRouteResponse>(url);
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
