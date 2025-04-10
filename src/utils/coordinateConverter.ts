import { LngLatLike } from "mapbox-gl";

/**
 * Converts coordinates to a format compatible with Mapbox's LngLatLike type
 *
 * This utility function ensures coordinates are properly formatted for Mapbox operations.
 * It handles different input formats and converts them to the expected LngLatLike format,
 * which requires longitude and latitude values in the form [lng, lat].
 *
 * @param {LngLatLike | number[] | undefined} center - Coordinates to convert, which can be:
 *   - LngLatLike object (already in Mapbox format)
 *   - number array in [longitude, latitude] format
 *   - undefined (no coordinates provided)
 * @returns {LngLatLike | undefined} - Properly formatted coordinates or undefined if invalid
 */
const coordinateConverter = (center: LngLatLike | number[] | undefined): LngLatLike | undefined => {
  if (Array.isArray(center)) {
    if (center.length >= 2) {
      return [center[0], center[1]];
    }
    return undefined;
  }
  return center;
};

export default coordinateConverter;
