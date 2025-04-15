import HomeIcon from "@mui/icons-material/Home";
import { Avatar, Paper, Stack, ThemeProvider, Typography } from "@tracktor/design-system";
import MarkerMap from "@/components/MarkerMap/MarkerMap";
import MapProvider from "@/context/MapProvider.tsx";

const ReactMarkerExample = ({ name }: { name: string }) => (
  <ThemeProvider>
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

const markers = [
  {
    id: `1`,
    lat: 48.844039,
    lng: 2.489326,
    name: "marker A",
    type: "worksite",
  },
  {
    IconComponent: ReactMarkerExample,
    iconProps: { name: "toto" },
    id: `2`,
    lat: 48.854039,
    lng: 2.499326,
    name: "marker B",
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

  return (
    <ThemeProvider theme="dark">
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <MarkerMap
          markers={markers}
          height={600}
          width={600}
          containerStyle={{
            marginLeft: 3,
            marginTop: 3,
          }}
        />
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
