import { Box, Button, MenuItem, Select, Stack, Typography } from "@tracktor/design-system";
import type { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson";
import { useCallback, useMemo, useState } from "react";
import MapSidebar from "sandbox/features/MapSideBar";
import Navbar from "sandbox/features/Navbar";
import ThemeSwitch from "sandbox/features/ThemeSwitch";
import MapView from "@/features/MapView/MapView";

const randomCoordInFrance = () => [2 + (Math.random() - 0.5) * 6, 46 + (Math.random() - 0.5) * 6];

const createRandomPoint = (): Feature<Point> => ({
  geometry: {
    coordinates: randomCoordInFrance(),
    type: "Point",
  },
  properties: {
    color: "#F97316",
  },
  type: "Feature",
});

const createRandomLine = (): Feature<LineString> => ({
  geometry: {
    coordinates: [randomCoordInFrance(), randomCoordInFrance()],
    type: "LineString",
  },
  properties: {
    color: "#3B82F6",
  },
  type: "Feature",
});

const createRandomPolygon = (): Feature<Polygon> => {
  const [lng, lat] = randomCoordInFrance();
  const delta = 0.5;
  return {
    geometry: {
      coordinates: [
        [
          [lng - delta, lat - delta],
          [lng + delta, lat - delta],
          [lng + delta, lat + delta],
          [lng - delta, lat + delta],
          [lng - delta, lat - delta],
        ],
      ],
      type: "Polygon",
    },
    properties: {
      color: "#4ADE80",
    },
    type: "Feature",
  };
};

const FeaturesExample = () => {
  const [featureList, setFeatureList] = useState<Feature[]>([]);
  const [baseMapView, setBaseMapView] = useState<"street" | "satellite">("street");

  const markers = useMemo(
    () =>
      featureList
        .filter((f) => f.geometry.type === "Point")
        .map((f, index) => {
          const geom = f.geometry;
          if (geom.type === "Point") {
            return {
              id: `point-${index}`,
              lat: geom.coordinates[1],
              lng: geom.coordinates[0],
            };
          }
          return null;
        })
        .filter((m): m is { id: string; lat: number; lng: number } => m !== null),
    [featureList],
  );

  const features: FeatureCollection = useMemo(
    () => ({
      features: featureList,
      type: "FeatureCollection",
    }),
    [featureList],
  );

  const addFeature = useCallback((type: "point" | "line" | "polygon") => {
    setFeatureList((prev) => {
      if (type === "point") {
        return [...prev, createRandomPoint()];
      }
      if (type === "line") {
        return [...prev, createRandomLine()];
      }
      return [...prev, createRandomPolygon()];
    });
  }, []);

  const clearFeatures = useCallback(() => setFeatureList([]), []);

  return (
    <>
      <Navbar />
      <Stack direction="row" sx={{ height: "100vh", overflow: "hidden", width: "100vw" }}>
        <Box sx={{ flex: 1 }}>
          <MapView markers={markers} features={features} fitBounds baseMapView={baseMapView} height="100%" width="100%" />
          <ThemeSwitch />
        </Box>

        <MapSidebar>
          <Typography variant="body2" color="text.secondary">
            Base Map View
          </Typography>
          <Select value={baseMapView} onChange={(e) => setBaseMapView(e.target.value)} size="small">
            <MenuItem value="street">Street</MenuItem>
            <MenuItem value="satellite">Satellite</MenuItem>
          </Select>

          <Typography variant="h6" mt={2}>
            ➕ Add Features
          </Typography>

          <Stack spacing={1}>
            <Button variant="contained" onClick={() => addFeature("point")}>
              📍 Add Point
            </Button>
            <Button variant="contained" onClick={() => addFeature("line")}>
              ➖ Add Line
            </Button>
            <Button variant="contained" onClick={() => addFeature("polygon")}>
              🟩 Add Polygon
            </Button>
          </Stack>

          {featureList.length > 0 && (
            <Button variant="outlined" color="error" onClick={clearFeatures}>
              🗑 Clear all
            </Button>
          )}
        </MapSidebar>
      </Stack>
    </>
  );
};

export default FeaturesExample;
