import { Box, Button, FormControlLabel, MenuItem, Select, Stack, Switch, ThemeProvider, Typography } from "@tracktor/design-system";
import { lotOfMarkers } from "example/Markers.tsx";
import type { MapOptions } from "mapbox-gl";
import { useState } from "react";
import MarkerMap from "@/components/MarkerMap/MarkerMap";
import MapProvider from "@/context/MapProvider.tsx";

const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");
  const [baseMapView, setBaseMapView] = useState<"street" | "satellite">("street");
  const [cooperativeGestures, setCooperativeGestures] = useState(true);
  const [doubleClickZoom, setDoubleClickZoom] = useState(true);
  const [projection, setProjection] = useState<MapOptions["projection"]>("mercator");

  const [mapKey, setMapKey] = useState(0); // pour forcer le reset de la vue

  const handleMapClick = (lng: number, lat: number): void => {
    console.log("Map clicked at:", { lat, lng });
  };

  const handleResetView = () => {
    // On change la key pour re-monter le composant MarkerMap
    setMapKey((prev) => prev + 1);
  };

  return (
    <ThemeProvider theme={themeMode}>
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Stack
          direction="row"
          sx={{
            height: "100vh",
            overflow: "hidden",
            width: "100vw",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <MarkerMap
              key={mapKey}
              openPopup="1"
              markers={lotOfMarkers}
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

            <FormControlLabel
              control={<Switch checked={cooperativeGestures} onChange={(e) => setCooperativeGestures(e.target.checked)} />}
              label="Cooperative Gestures"
            />

            <FormControlLabel
              control={<Switch checked={doubleClickZoom} onChange={(e) => setDoubleClickZoom(e.target.checked)} />}
              label="Double Click Zoom"
            />

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

            <Button variant="outlined" color="primary" onClick={handleResetView}>
              🔄 Réinitialiser la vue
            </Button>
          </Box>
        </Stack>
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
