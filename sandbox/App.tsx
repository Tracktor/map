import { ThemeProvider } from "@tracktor/design-system";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import FeaturesExample from "sandbox/examples/FeaturesExample";
import IsochroneExample from "sandbox/examples/IsochroneExample";
import MarkersExample from "sandbox/examples/MarkersExample";
import NearestMarkerExample from "sandbox/examples/NearestMarkerExample";
import RouteExample from "sandbox/examples/RoutesExample";
import LandingPage from "sandbox/features/LandingPage";
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
