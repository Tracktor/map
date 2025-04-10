import { LicenseInfo } from "@mui/x-license";
import mapbox from "mapbox-gl";
import { createContext, ReactNode, useEffect, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProviderContextProps {
  licenseMuiX?: string;
  licenceMapbox?: string;
}

export interface MapProviderProps extends MapProviderContextProps {
  children: ReactNode;
}

export const MapProviderContext = createContext<MapProviderContextProps>({
  licenceMapbox: "",
  licenseMuiX: "",
});

export const MapProvider = ({ children, licenseMuiX, licenceMapbox }: MapProviderProps) => {
  useEffect(() => {
    if (licenseMuiX) {
      LicenseInfo.setLicenseKey(licenseMuiX);
    }
  }, [licenseMuiX]);

  const value = useMemo(
    () => ({
      licenceMapbox,
      licenseMuiX,
    }),
    [licenseMuiX, licenceMapbox],
  );

  if (licenceMapbox) {
    mapbox.accessToken = licenceMapbox;
  }

  return <MapProviderContext.Provider value={value}>{children}</MapProviderContext.Provider>;
};

export default MapProvider;
