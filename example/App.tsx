import { ThemeProvider } from "@tracktor/design-system";
import LandingPage from "example/LandingPage.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapProvider from "@/context/MapProvider";
import MarkersExample from "./MarkersExample";
import MultiCityExample from "./MultiCityExample";
import RouteExample from "./RoutesExample";

/**
 * This is the main app entry point.
 * It wraps all routes with providers and global components.
 */
const App = () => {
  return (
    <ThemeProvider theme="dark">
      <MapProvider licenseMuiX={import.meta.env.VITE_MUI_LICENSE_KEY} licenceMapbox={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/markers" element={<MarkersExample />} />
            <Route path="/multilines" element={<MultiCityExample />} />
            <Route path="/route" element={<RouteExample />} />
          </Routes>
        </BrowserRouter>
      </MapProvider>
    </ThemeProvider>
  );
};

export default App;
