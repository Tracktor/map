import type { MarkerProps } from "@/types/MarkerProps";

const isValidMarker = (m: MarkerProps): m is MarkerProps & { lng: number; lat: number } => {
  return Number.isFinite(m.lng) && Number.isFinite(m.lat);
};

export default isValidMarker;
