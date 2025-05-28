import HomeIcon from "@mui/icons-material/Home";
import { Avatar, Card, CardContent, Paper, Stack, ThemeProvider, Typography } from "@tracktor/design-system";
import MarkerMap from "@/components/MarkerMap/MarkerMap";
import MapProvider from "@/context/MapProvider.tsx";
import { MarkerProps } from "@/types/MarkerProps.ts";

const TooltipExample = ({ name }: { name: string }) => (
  <ThemeProvider theme="light">
    <Card>
      <CardContent>
        <Typography variant="h6" color="black">
          Hello world
        </Typography>
        <Typography color="grey.500" variant="body2">
          I m a tooltip {name}
        </Typography>
      </CardContent>
    </Card>
  </ThemeProvider>
);

const ReactMarkerExample = ({ name }: { name: string }) => (
  <ThemeProvider theme="light">
    <Paper elevation={2} sx={{ borderRadius: 5, paddingBottom: 0.5, paddingLeft: 1, paddingRight: 1, paddingTop: 0.5 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar size="small">
          <HomeIcon fontSize="small" />
        </Avatar>
        <Typography variant="h6" pr={0.5}>
          {name}
        </Typography>
      </Stack>
    </Paper>
  </ThemeProvider>
);

const markers: MarkerProps[] = [
  {
    id: `1`,
    lat: 48.844039,
    lng: 2.489326,
    name: "marker A",
    onClick: (element) => {
      console.log("Marker A clicked", element);
    },
    Tooltip: <TooltipExample name="a" />,
    type: "worksite",
  },
  {
    IconComponent: ReactMarkerExample,
    iconProps: { name: "toto" },
    id: `2`,
    lat: 48.854039,
    lng: 2.499326,
    name: "marker B",
    onClick: (element) => {
      console.log("Marker B clicked", element);
    },
    type: "agency",
  },
];

const App = () => {
  // console.warning if no .env found
  if (!import.meta.env.VITE_MUI_LICENSE_KEY || !import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
    console.warn(
      "No .env file found. Please create a .env file with the following variables: VITE_MUI_LICENSE_KEY and VITE_MAPBOX_ACCESS_TOKEN",
    );
  }

  const handleMapClick = (lng: number, lat: number): void => {
    console.log("Map clicked at:", { lat, lng });
  };

  return (
    <ThemeProvider theme="light">
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <MarkerMap
          openPopup="1"
          markers={markers}
          height={600}
          width={600}
          containerStyle={{
            marginLeft: 3,
            marginTop: 3,
          }}
          onMapClick={handleMapClick}
          baseMapView="3d"
          // cooperativeGestures={false}
        />
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
