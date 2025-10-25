import { createContext } from "react";

export interface MapContextProps {
  licenseMuiX?: string;
  licenceMapbox?: string;
}

export const MapContext = createContext<MapContextProps>({
  licenceMapbox: "",
  licenseMuiX: "",
});
