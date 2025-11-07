import { Box, Card, MenuItem, Select, Stack, Switch, Typography } from "@tracktor/design-system";
import { useMemo, useState } from "react";
import type { ProjectionSpecification } from "react-map-gl";
import MapSidebar from "sandbox/features/MapSideBar";
import Navbar from "sandbox/features/Navbar";
import ThemeSwitch from "sandbox/features/ThemeSwitch";
import MapView from "@/features/MapView/MapView";

const predefinedRoutes = [
  {
    from: [2.3522, 48.8566] as [number, number],
    id: "paris-lyon",
    name: "Paris → Lyon",
    to: [4.8357, 45.764] as [number, number],
  },
  {
    from: [2.3522, 48.8566],
    id: "paris-marseille",
    name: "Paris → Marseille",
    to: [5.3698, 43.2965],
  },
  {
    from: [2.3522, 48.8566],
    id: "paris-toulouse",
    name: "Paris → Toulouse",
    to: [1.4442, 43.6047],
  },
  {
    from: [4.8357, 45.764],
    id: "lyon-montpellier",
    name: "Lyon → Montpellier",
    to: [3.8767, 43.6108],
  },
];

const ItineraryLabel = ({ label, distance }: { label?: string; distance: number | null }) => {
  if (distance === null) {
    return null;
  }

  const km = (distance / 1000).toFixed(1);

  return (
    <Card>
      <Stack spacing={1} p={1.5}>
        <Typography variant="subtitle2">{label}</Typography>
        <Typography fontWeight={600}>🛣️ {km} km</Typography>
      </Stack>
    </Card>
  );
};

const RouteExample = () => {
  const [projection, setProjection] = useState<ProjectionSpecification>({
    name: "mercator",
  });
  const [selectedRoute, setSelectedRoute] = useState(predefinedRoutes[0]);
  const [profile, setProfile] = useState<"driving" | "walking" | "cycling">("driving");
  const [cooperativeGestures, setCooperativeGestures] = useState(true);
  const [doubleClickZoom, setDoubleClickZoom] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);

  const markers = useMemo(
    () => [
      { id: "from", lat: selectedRoute.from[1], lng: selectedRoute.from[0], variant: "success" },
      { id: "to", lat: selectedRoute.to[1], lng: selectedRoute.to[0], variant: "warning" },
    ],
    [selectedRoute],
  );

  return (
    <>
      <Navbar />
      <Stack direction="row" sx={{ height: "100vh", overflow: "hidden", width: "100vw" }}>
        <Box sx={{ flex: 1 }}>
          <MapView
            square
            key={`${cooperativeGestures}-${doubleClickZoom}-${projection.name}-${profile}-${selectedRoute.id}`}
            markers={markers}
            itineraryParams={{
              engine: "OSRM",
              from: selectedRoute.from as [number, number],
              itineraryLabel: <ItineraryLabel label={selectedRoute.name} distance={distance} />,
              itineraryLineStyle: {
                color: "#b91037",
                opacity: 0.9,
                width: 2,
              },
              onRouteComputed: (route) => {
                setDistance(route?.properties?.distance);
              },
              profile: profile,
              to: selectedRoute.to as [number, number],
            }}
            cooperativeGestures={cooperativeGestures}
            doubleClickZoom={doubleClickZoom}
            projection={projection}
            fitBounds
            height="100%"
            width="100%"
          />
          <ThemeSwitch />
        </Box>

        <MapSidebar>
          <Typography variant="body2" color="text.secondary">
            Predefined routes
          </Typography>
          <Select
            value={selectedRoute.id}
            onChange={(e) => {
              const route = predefinedRoutes.find((r) => r.id === e.target.value);
              if (route) {
                setSelectedRoute(route);
              }
            }}
            size="small"
          >
            {predefinedRoutes.map((route) => (
              <MenuItem key={route.id} value={route.id}>
                {route.name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" color="text.secondary">
            Profile
          </Typography>
          <Select value={profile} onChange={(e) => setProfile(e.target.value as "driving" | "walking" | "cycling")} size="small">
            <MenuItem value="driving">🚗 Driving</MenuItem>
            <MenuItem value="walking">🚶 Walking</MenuItem>
            <MenuItem value="cycling">🚴 Cycling</MenuItem>
          </Select>

          <Typography variant="body2" color="text.secondary">
            Interactions
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Cooperative Gestures</Typography>
              <Switch checked={cooperativeGestures} onChange={(e) => setCooperativeGestures(e.target.checked)} />
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2">Double Click Zoom</Typography>
              <Switch checked={doubleClickZoom} onChange={(e) => setDoubleClickZoom(e.target.checked)} />
            </Stack>
          </Stack>

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
            <MenuItem value="albers">Albers</MenuItem>
            <MenuItem value="equalEarth">Equal Earth</MenuItem>
            <MenuItem value="equirectangular">Equirectangular</MenuItem>
            <MenuItem value="naturalEarth">Natural Earth</MenuItem>
          </Select>
        </MapSidebar>
      </Stack>
    </>
  );
};

export default RouteExample;
