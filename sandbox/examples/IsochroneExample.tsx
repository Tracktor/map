import { Box, MenuItem, Select, Stack, Switch, Typography } from "@tracktor/design-system";
import { useEffect, useMemo, useState } from "react";
import type { ProjectionSpecification } from "react-map-gl";
import MapSidebar from "sandbox/features/MapSideBar";
import Navbar from "sandbox/features/Navbar";
import ThemeSwitch from "sandbox/features/ThemeSwitch";
import MapView from "@/features/MapView/MapView";
import type { RoutingProfile } from "@/services/core/interface";
import isPointInGeoJSON from "@/utils/isPointInGeoJSON";

const predefinedOrigins = [
  { coords: [2.3522, 48.8566], id: "paris", name: "Paris" },
  { coords: [4.8357, 45.764], id: "lyon", name: "Lyon" },
  { coords: [-0.5792, 44.8378], id: "bordeaux", name: "Bordeaux" },
];

const IsochroneExample = () => {
  const [projection, setProjection] = useState<ProjectionSpecification>({ name: "mercator" });
  const [profile, setProfile] = useState<RoutingProfile>("driving");
  const [origin, setOrigin] = useState(predefinedOrigins[0]);
  const [intervals, setIntervals] = useState([5, 10, 15]);
  const [isochroneData, setIsochroneData] = useState<GeoJSON.FeatureCollection<GeoJSON.Polygon> | null>(null);
  const [cooperativeGestures, setCooperativeGestures] = useState(true);
  const [doubleClickZoom, setDoubleClickZoom] = useState(true);

  const generateMarkers = (base: typeof origin) =>
    Array.from({ length: 12 }, (_, i) => {
      const offsetLng = (Math.random() - 0.5) * 0.5;
      const offsetLat = (Math.random() - 0.5) * 0.5;
      return {
        color: "#f59e0b",
        id: i + 1,
        lat: base.coords[1] + offsetLat,
        lng: base.coords[0] + offsetLng,
        name: `Point ${i + 1}`,
      };
    });

  const [markers, setMarkers] = useState(() => generateMarkers(origin));

  useEffect(() => {
    if (!isochroneData) {
      return;
    }

    setMarkers((prev) =>
      prev.map((m) => {
        const inside = isochroneData.features.some((f) => isPointInGeoJSON([m.lng, m.lat], f));
        return {
          ...m,
          color: inside ? "#22c55e" : "#9ca3af",
        };
      }),
    );
  }, [isochroneData]);

  const originMarker = useMemo(
    () => [
      {
        id: "origin",
        lat: origin.coords[1],
        lng: origin.coords[0],
        Tooltip: <div>📍 {origin.name} (origin)</div>,
        variant: "success",
      },
    ],
    [origin],
  );

  const allMarkers = useMemo(() => [...markers, ...originMarker], [markers, originMarker]);

  return (
    <>
      <Navbar />
      <Stack direction="row" sx={{ height: "100vh", overflow: "hidden", width: "100vw" }}>
        {/* 🗺️ MAP */}
        <Box sx={{ flex: 1 }}>
          <MapView
            key={`${cooperativeGestures}-${doubleClickZoom}-${projection.name}-${profile}-${intervals.join(",")}`}
            height="100%"
            width="100%"
            markers={allMarkers}
            cooperativeGestures={cooperativeGestures}
            doubleClickZoom={doubleClickZoom}
            projection={projection}
            fitBounds
            isochrone={{
              intervals,
              onIsochroneLoaded: setIsochroneData,
              origin: origin.coords as [number, number],
              profile,
            }}
          />
          <ThemeSwitch />
        </Box>

        <MapSidebar>
          <Typography variant="body2" color="text.secondary">
            Origin
          </Typography>
          <Select
            value={origin.id}
            onChange={(e) => {
              const newOrigin = predefinedOrigins.find((o) => o.id === e.target.value);
              if (!newOrigin) {
                return;
              }

              setOrigin(newOrigin);
              setMarkers(generateMarkers(newOrigin));
            }}
            size="small"
          >
            {predefinedOrigins.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" color="text.secondary">
            Profile
          </Typography>
          <Select value={profile} onChange={(e) => setProfile(e.target.value as RoutingProfile)} size="small">
            <MenuItem value="driving">🚗 Driving</MenuItem>
            <MenuItem value="walking">🚶 Walking</MenuItem>
            <MenuItem value="cycling">🚴 Cycling</MenuItem>
          </Select>

          <Typography variant="body2" color="text.secondary">
            Isochrone intervals (minutes)
          </Typography>
          <Select
            value={intervals.join(",")}
            onChange={(e) =>
              setIntervals(
                e.target.value
                  .toString()
                  .split(",")
                  .map((v) => Number(v.trim())),
              )
            }
            size="small"
          >
            <MenuItem value="5,10,15">5 / 10 / 15 min</MenuItem>
            <MenuItem value="10,20,30">10 / 20 / 30 min</MenuItem>
            <MenuItem value="15,30,45">15 / 30 / 45 min</MenuItem>
          </Select>

          <Typography variant="body2" color="text.secondary">
            Projection
          </Typography>
          <Select
            value={projection.name}
            onChange={(e) => setProjection({ name: e.target.value as ProjectionSpecification["name"] })}
            size="small"
          >
            <MenuItem value="mercator">Mercator</MenuItem>
            <MenuItem value="globe">Globe</MenuItem>
            <MenuItem value="naturalEarth">Natural Earth</MenuItem>
          </Select>

          <Typography variant="body2" color="text.secondary">
            Interactions
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Cooperative gestures</Typography>
              <Switch checked={cooperativeGestures} onChange={(e) => setCooperativeGestures(e.target.checked)} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Double click zoom</Typography>
              <Switch checked={doubleClickZoom} onChange={(e) => setDoubleClickZoom(e.target.checked)} />
            </Stack>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            🟢 inside isochrone | ⚫ outside | 🟠 pending
          </Typography>
        </MapSidebar>
      </Stack>
    </>
  );
};

export default IsochroneExample;
