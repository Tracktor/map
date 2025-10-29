import type { Feature, GeoJsonProperties, LineString } from "geojson";

const mapboxRoute = async (
  from: [number, number],
  to: [number, number],
  profile: "driving" | "walking" | "cycling" = "driving",
): Promise<Feature<LineString, GeoJsonProperties> | null> => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${from.join(",")};${to.join(",")}?geometries=geojson&overview=full&access_token=${accessToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const route = data.routes[0].geometry;

  return {
    geometry: route,
    properties: {},
    type: "Feature",
  };
};

export default mapboxRoute;
