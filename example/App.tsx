import { ThemeProvider } from "@tracktor/design-system";
import FeaturesExample from "example/FeaturesExample.tsx";
import LandingPage from "example/LandingPage.tsx";
import MarkersExample from "example/MarkersExample";
import RouteExample from "example/RoutesExample";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapProvider from "@/context/MapProvider";

/**
 * This is the main app entry point.
 * It wraps all routes with providers and global components.
 */
const App = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  return (
    <ThemeProvider theme={themeMode}>
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/markers" element={<MarkersExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
            <Route path="/features" element={<FeaturesExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
            <Route path="/route" element={<RouteExample themeMode={themeMode} setThemeMode={setThemeMode} />} />
          </Routes>
        </BrowserRouter>
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
