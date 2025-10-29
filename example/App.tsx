import { ThemeProvider } from "@tracktor/design-system";
import FeaturesExample from "example/FeaturesExample.tsx";
import IsochroneExample from "example/IsochroneExample.tsx";
import LandingPage from "example/LandingPage.tsx";
import MarkersExample from "example/MarkersExample";
import NearestMarkerExample from "example/NearestMarkerExample.tsx";
import RouteExample from "example/RoutesExample";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MapProvider from "@/context/MapProvider";

const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  return (
    <ThemeProvider theme={themeMode}>
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/markers" element={<MarkersExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
          <Route path="/features" element={<FeaturesExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
          <Route path="/route" element={<RouteExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
          <Route path="/nearest-marker" element={<NearestMarkerExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
          <Route path="/isochrone" element={<IsochroneExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
        </Routes>
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
