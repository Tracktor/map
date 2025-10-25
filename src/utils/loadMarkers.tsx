import { ComponentType } from "react";

export interface CustomMarkerMapProps {
  geometry: {
    coordinates: number[];
    type: string;
  };
  properties: {
    description?: string;
    id?: string | number;
    size: number;
    zIndex: number;
    pointerEvents?: string;
    name?: string;
    iconProps?: Record<string, unknown>;
    onClick?: (markerData?: CustomMarkerMapProps) => void;
    IconComponent?: ComponentType<unknown>;
  };
  type: string;
}
