import { Box, Button, MenuItem, Select, Slider, Stack, Switch, TextField, ThemeProvider, Typography } from "@tracktor/design-system";
import { generateMarkers } from "example/Markers";
import type { MapOptions } from "mapbox-gl";
import { useMemo, useState } from "react";
import MarkerMap from "@/components/MarkerMap/MarkerMap";
import MapProvider from "@/context/MapProvider";

const MAX_MARKERS = 1000;
const DEFAULT_MARKERS = 150;

const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [baseMapView, setBaseMapView] = useState<"street" | "satellite">("street");
  const [cooperativeGestures, setCooperativeGestures] = useState(true);
  const [doubleClickZoom, setDoubleClickZoom] = useState(true);
  const [projection, setProjection] = useState<MapOptions["projection"]>("mercator");
  const [visibleMarkerCount, setVisibleMarkerCount] = useState(DEFAULT_MARKERS);

  const [openPopupId, setOpenPopupId] = useState<string>("");

  const handleMapClick = (lng: number, lat: number): void => {
    console.log("Map clicked at:", { lat, lng });
  };

  const markers = useMemo(() => generateMarkers(visibleMarkerCount), [visibleMarkerCount]);

  return (
    <ThemeProvider theme={themeMode}>
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Stack direction="row" sx={{ height: "100vh", overflow: "hidden", width: "100vw" }}>
          <Box sx={{ flex: 1 }}>
            <MarkerMap
              openPopup={openPopupId}
              markers={markers}
              height="100%"
              width="100%"
              onMapClick={handleMapClick}
              baseMapView={baseMapView}
              cooperativeGestures={cooperativeGestures}
              doubleClickZoom={doubleClickZoom}
              projection={projection}
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
              p: 2,
              width: 300,
            }}
          >
            <Typography variant="h6">🧭 Options</Typography>

            <Typography variant="body2" color="text.secondary">
              Thème
            </Typography>
            <Button variant="outlined" onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}>
              {themeMode === "dark" ? "Light mode" : "Dark mode"}
            </Button>

            <Typography variant="body2" color="text.secondary">
              Base Map View
            </Typography>
            <Select value={baseMapView} onChange={(e) => setBaseMapView(e.target.value)} size="small">
              <MenuItem value="street">Street</MenuItem>
              <MenuItem value="satellite">Satellite</MenuItem>
            </Select>

            <Typography variant="body2" color="text.secondary">
              Nombre de markers ({visibleMarkerCount})
            </Typography>
            <Slider min={1} max={MAX_MARKERS} value={visibleMarkerCount} onChange={(_, v) => setVisibleMarkerCount(v as number)} />

            <Typography variant="body2" color="text.secondary">
              Open popup
            </Typography>
            <TextField
              placeholder="ID du marker ex: 10"
              size="small"
              value={openPopupId}
              onChange={(e) => setOpenPopupId(e.target.value)}
            />

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
            <Select value={projection} onChange={(e) => setProjection(e.target.value as MapOptions["projection"])} size="small">
              <MenuItem value="mercator">Mercator</MenuItem>
              <MenuItem value="globe">Globe</MenuItem>
              <MenuItem value="albers">Albers</MenuItem>
              <MenuItem value="equalEarth">Equal Earth</MenuItem>
              <MenuItem value="equirectangular">Equirectangular</MenuItem>
              <MenuItem value="naturalEarth">Natural Earth</MenuItem>
            </Select>
          </Box>
        </Stack>
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
