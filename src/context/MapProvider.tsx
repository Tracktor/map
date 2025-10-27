import { LicenseInfo } from "@mui/x-license";
import mapbox from "mapbox-gl";
import { ReactNode, useEffect, useMemo } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapContext, MapContextProps } from "@/context/MapContext.tsx";

export interface MapProviderProps extends MapContextProps {
  children: ReactNode;
}

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

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export default MapProvider;
