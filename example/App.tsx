import { ThemeProvider } from "@tracktor/design-system";
import { lotOfMarkers } from "example/Markers.tsx";
import MarkerMap from "@/components/MarkerMap/MarkerMap";
import MapProvider from "@/context/MapProvider.tsx";

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
    <ThemeProvider theme="dark">
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <MarkerMap
          openPopup="1"
          markers={lotOfMarkers}
          height={600}
          width={600}
          onMapClick={handleMapClick}
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
