import { Box, Button, MenuItem, Select, Stack, Switch, Typography } from "@tracktor/design-system";
import { useMemo, useState } from "react";
import type { ProjectionSpecification } from "react-map-gl";
import Navbar from "sandbox/features/Navbar";
import MarkerMap from "@/features/MarkerMap/MarkerMap";

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

interface RouteExampleProps {
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
}

const RouteExample = ({ themeMode, setThemeMode }: RouteExampleProps) => {
  const [projection, setProjection] = useState<ProjectionSpecification>({
    name: "mercator",
  });
  const [selectedRoute, setSelectedRoute] = useState(predefinedRoutes[0]);
  const [profile, setProfile] = useState<"driving" | "walking" | "cycling">("driving");
  const [cooperativeGestures, setCooperativeGestures] = useState(true);
  const [doubleClickZoom, setDoubleClickZoom] = useState(true);

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
          <MarkerMap
            markers={markers}
            from={selectedRoute.from as [number, number]}
            to={selectedRoute.to as [number, number]}
            profile={profile}
            cooperativeGestures={cooperativeGestures}
            doubleClickZoom={doubleClickZoom}
            projection={projection}
            fitBounds
            height="100%"
            width="100%"
            itineraryLineStyle={{
              color: "#b91037",
              opacity: 0.9,
              width: 2,
            }}
          />
        </Box>

        <Box
          sx={{
            backgroundColor: "background.paper",
            borderColor: "divider",
            borderLeft: "1px solid",
            color: "text.primary",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            p: 2,
            width: 300,
          }}
        >
          <Typography variant="h6">🚗 Route options</Typography>

          {/* Thème */}
          <Typography variant="body2" color="text.secondary">
            Theme
          </Typography>
          <Button variant="outlined" onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}>
            {themeMode === "dark" ? "Light mode" : "Dark mode"}
          </Button>

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
        </Box>
      </Stack>
    </>
  );
};

export default RouteExample;
