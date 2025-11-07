import { isNumber, isString } from "@tracktor/react-utils";
import type { MarkerProps } from "@/types/MarkerProps";

/**
 * Attempts to coerce a value to a number (if it's a numeric string)
 */
const toNumber = (value: unknown): number | null => {
  if (isNumber(value)) {
    return value;
  }

  if (isString(value) && value.trim() !== "") {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  return null;
};

/**
 * Checks if a value is a valid latitude.
 */
export const isValidLatitude = (value: unknown): value is number => {
  const num = toNumber(value);
  return num !== null && num >= -90 && num <= 90;
};

/**
 * Checks if a value is a valid longitude.
 */
export const isValidLongitude = (value: unknown): value is number => {
  const num = toNumber(value);
  return num !== null && num >= -180 && num <= 180;
};
/**
 * Checks if value is a valid [latitude, longitude] tuple.
 */
export const isValidLatLngTuple = (value: unknown): value is [number, number] => {
  return Array.isArray(value) && value.length === 2 && isValidLatitude(value[0]) && isValidLongitude(value[1]);
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
