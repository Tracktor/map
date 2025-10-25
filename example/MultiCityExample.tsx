import { Box, ThemeProvider } from "@tracktor/design-system";
import type { Feature, GeoJsonProperties, LineString } from "geojson";
import { useMemo } from "react";
import MapProvider from "@/context/MapProvider";
import MarkerMap from "@/Features/MarkerMap/MarkerMap";

const MultiCityExample = () => {
  const cities = [
    { coords: [2.3522, 48.8566], id: "paris", name: "Paris" },
    { coords: [4.8357, 45.764], id: "lyon", name: "Lyon" },
    { coords: [5.3698, 43.2965], id: "marseille", name: "Marseille" },
    { coords: [3.8767, 43.6108], id: "montpellier", name: "Montpellier" },
    { coords: [1.4442, 43.6047], id: "toulouse", name: "Toulouse" },
  ];

  // 💡 Conversion en markers
  const markers = useMemo(
    () =>
      cities.map((city) => ({
        id: city.id,
        lat: city.coords[1],
        lng: city.coords[0],
      })),
    [cities],
  );

  // 🧭 Construction d'une ligne simple entre les points
  const line = useMemo<Feature<LineString, GeoJsonProperties>>(
    () => ({
      geometry: {
        coordinates: cities.map((c) => c.coords),
        type: "LineString",
      },
      properties: {},
      type: "Feature",
    }),
    [cities],
  );

  return (
    <ThemeProvider theme="dark">
      <MapProvider licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Box sx={{ height: "100vh", width: "100vw" }}>
          <MarkerMap markers={markers} line={line} fitBounds height="100%" width="100%" />
        </Box>
      </MapProvider>
    </ThemeProvider>
  );
};

export default MultiCityExample;
