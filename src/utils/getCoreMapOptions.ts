import { MapOptions } from "mapbox-gl";

interface MapOptionsProps {
  mapStyle?: string;
  projection?: MapOptions["projection"];
  baseMapView?: "default" | "satellite" | "streets" | "3d";
  cooperativeGestures?: boolean;
  doubleClickZoom?: boolean;
  theme?: "light" | "dark";
}

const getBaseMapStyle = (baseMapView?: "default" | "satellite" | "streets" | "3d", theme?: "dark" | "light"): string => {
  const isDarkTheme = theme === "dark";

  switch (baseMapView) {
    case "satellite":
      return "mapbox://styles/mapbox/satellite-v9"; // No light/dark variants

    case "3d":
      return isDarkTheme ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/streets-v12?optimize=true";

    case "streets":
      return isDarkTheme ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/streets-v11";

    case "default":
    default:
      return isDarkTheme ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/streets-v11";
  }
};

/**
 * Generates configuration options for initializing a Mapbox map
 *
 * This utility function creates a standardized configuration object for Mapbox GL JS
 * by processing various input parameters. It handles:
 * - Center point calculation (with fallback to marker positions or default)
 * - Style application
 * - Initial zoom level
 *
 * @param {Object} params - Configuration parameters
 * @param {string} params.mapStyle - Mapbox style URL or specification
 * @param {MarkerProps[]} [params.markers] - Array of marker definitions
 * @param {LngLatLike|number[]} [params.center] - Optional center coordinates (either as LngLat object or [lng, lat] array)
 * @param {MapOptions["projection"]} [params.projection] - Optional coordinate projection
 * @param {string} [params.baseMapView] - Optional base map view type (default, satellite, streets, dark, 3d)
 * @param {boolean} [params.cooperativeGestures=true] - Enable cooperative gestures (default: true)
 * @param {boolean} [params.doubleClickZoom=true] - Enable double-click zoom (default: true)
 *
 * @returns {object} Mapbox-compatible configuration object with:
 *   - center: Calculated center coordinates
 *   - cooperativeGestures: Enabled by default
 *   - failIfMajorPerformanceCaveat: Disabled by default
 *   - style: The provided map style
 *   - zoom: Initial zoom level
 *
 * @example
 * const options = getCoreMapOptions({
 *   mapStyle: 'mapbox://styles/mapbox/streets-v11',
 *   markers: [{ lat: 48.8584, lng: 2.2945 }],
 * });
 */
const getCoreMapOptions = ({
  mapStyle,
  theme,
  baseMapView,
  doubleClickZoom,
  cooperativeGestures,
}: MapOptionsProps): Omit<MapOptions, "container"> => ({
  cooperativeGestures,
  doubleClickZoom,
  failIfMajorPerformanceCaveat: false,
  style: mapStyle || getBaseMapStyle(baseMapView, theme),
});

export default getCoreMapOptions;
