import type { Feature, GeoJsonProperties, LineString } from "geojson";

type RoutingProfile = "driving" | "walking" | "cycling";

/**
 * Get a route between two points using the OSRM API.
 *
 * @param from - Coordinates [longitude, latitude] of the starting point
 * @param to - Coordinates [longitude, latitude] of the destination point
 * @param profile - Routing profile: "driving", "walking", or "cycling"
 * @returns A GeoJSON Feature representing the route, or null if not found
 *
 * ⚠️ Note: This service uses a public OSRM server with usage limitations.
 */
const OSRMRoute = async (
  from: [number, number],
  to: [number, number],
  profile: RoutingProfile = "driving",
): Promise<Feature<LineString, GeoJsonProperties> | null> => {
  const profileMap: Record<RoutingProfile, string> = {
    cycling: "routed-bike",
    driving: "routed-car",
    walking: "routed-foot",
  };

  const baseUrl = `https://routing.openstreetmap.de/${profileMap[profile]}`;
  const url = `${baseUrl}/route/v1/driving/${from.join(",")};${to.join(",")}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("OSRM API error:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn("No routes found in OSRM response.");
      return null;
    }

    const route = data.routes[0].geometry;

    return {
      geometry: route,
      properties: {
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      },
      type: "Feature",
    };
  } catch (error) {
    console.error("Error fetching OSRM route:", error);
    return null;
  }
};

export default OSRMRoute;
