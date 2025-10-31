// src/App.tsx
import { Route, Routes } from "react-router-dom";
import { ThemeModeProvider } from "sandbox/context/ThemeProvider";
import FeaturesExample from "sandbox/examples/FeaturesExample";
import IsochroneExample from "sandbox/examples/IsochroneExample";
import MarkersExample from "sandbox/examples/MarkersExample";
import NearestMarkerExample from "sandbox/examples/NearestMarkerExample";
import RouteExample from "sandbox/examples/RoutesExample";
import LandingPage from "sandbox/features/LandingPage/LandingPage";
import MapProvider from "@/context/MapProvider";

const App = () => {
  return (
    <ThemeModeProvider>
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/markers" element={<MarkersExample />} />
          <Route path="/features" element={<FeaturesExample />} />
          <Route path="/route" element={<RouteExample />} />
          <Route path="/nearest-marker" element={<NearestMarkerExample />} />
          <Route path="/isochrone" element={<IsochroneExample />} />
        </Routes>
      </MapProvider>
    </ThemeModeProvider>
  );
};

export default App;
