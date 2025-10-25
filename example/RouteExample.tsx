import { Box, ThemeProvider } from "@tracktor/design-system";
import type { Feature, GeoJsonProperties, LineString } from "geojson";
import { useEffect, useState } from "react";
import MapProvider from "@/context/MapProvider";
import MarkerMap from "@/Features/MarkerMap/MarkerMap";

export async function getRoute(
  from: [number, number],
  to: [number, number],
  profile: "driving" | "walking" | "cycling" = "driving",
): Promise<Feature<LineString, GeoJsonProperties> | null> {
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
}

const RouteExample = () => {
  const [route, setRoute] = useState<Feature<LineString, GeoJsonProperties> | null>(null);
  const from: [number, number] = [2.3522, 48.8566]; // Paris
  const to: [number, number] = [4.8357, 45.764]; // Lyon

  useEffect(() => {
    getRoute(from, to, "driving").then((r) => {
      if (r) {
        setRoute(r);
      }
    });
  }, []);

  const markers = [
    { id: "paris", lat: from[1], lng: from[0] },
    { id: "lyon", lat: to[1], lng: to[0] },
  ];

  return (
    <ThemeProvider theme="dark">
      <MapProvider licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Box sx={{ height: "100vh", width: "100vw" }}>
          <MarkerMap markers={markers} route={route || undefined} fitBounds height="100%" width="100%" />
        </Box>
      </MapProvider>
    </ThemeProvider>
  );
};
export default RouteExample;
