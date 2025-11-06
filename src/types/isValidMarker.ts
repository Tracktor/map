import type { MarkerProps } from "@/types/MarkerProps";

/**
 * Checks if a value is a valid latitude.
 */
export const isValidLatitude = (value: unknown): value is number => {
  return typeof value === "number" && value >= -90 && value <= 90;
};

/**
 * Checks if a value is a valid longitude.
 */
export const isValidLongitude = (value: unknown): value is number => {
  return typeof value === "number" && value >= -180 && value <= 180;
};

/**
 * Type guard that validates a MarkerProps object at runtime
 * and narrows lat/lng from unknown to number.
 */
export const isValidMarker = (value: unknown): value is MarkerProps & { lat: number; lng: number } => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const m = value as Partial<MarkerProps>;

  return (typeof m.id === "string" || typeof m.id === "number" || m.id === undefined) && isValidLatitude(m.lat) && isValidLongitude(m.lng);
};

export default isValidMarker;
