import { MapOptions } from "mapbox-gl";
import BASEMAP, { BaseMapView } from "@/constants/baseMap.ts";

interface MapOptionsProps {
  mapStyle?: string;
  projection?: MapOptions["projection"];
  baseMapView?: BaseMapView;
  cooperativeGestures?: boolean;
  doubleClickZoom?: boolean;
  theme?: "light" | "dark";
}

export const getBaseMapStyle = (baseMapView?: BaseMapView, theme?: "dark" | "light"): string => {
  const isDarkTheme = theme === "dark";

  switch (baseMapView) {
    case "satellite":
      return BASEMAP.satellite;

    default:
      return isDarkTheme ? BASEMAP.street.dark : BASEMAP.street.light;
  }
};

/**
 * Generates standardized configuration options for initializing a Mapbox map.
 *
 * This utility function returns a base configuration object compatible with **Mapbox GL JS**.
 * It applies a default style based on the selected **base map view** and **theme** if no explicit style is provided.
 *
 * ### Features
 * - Supports both **light** and **dark** themes.
 * - Supports multiple base map types (e.g., streets, satellite).
 * - Enables optional Mapbox interaction settings (e.g., cooperative gestures, double-click zoom).
 * - Disables `failIfMajorPerformanceCaveat` by default for broader compatibility.
 *
 * @param {Object} params - Configuration parameters.
 * @param {string} [params.mapStyle] - Custom Mapbox style URL or specification.
 * If not provided, a default style is derived from `baseMapView` and `theme`.
 * @param {"light" | "dark"} [params.theme] - Theme mode that determines which default style to use.
 * @param {BaseMapView} [params.baseMapView] - Base map view type (`"satellite"`, `"street"`, etc.).
 * @param {boolean} [params.doubleClickZoom] - Enable or disable double-click zoom.
 * @param {boolean} [params.cooperativeGestures] - Enable or disable cooperative gestures.
 *
 * @returns {Omit<MapOptions, "container"> & { style: string }} - A configuration object ready to be passed to the Mapbox constructor.
 *
 * @example
 * const options = getCoreMapOptions({
 *   theme: "dark",
 *   baseMapView: "satellite",
 *   cooperativeGestures: true,
 *   doubleClickZoom: false,
 * });
 *
 * new mapboxgl.Map({
 *   container: "map",
 *   ...options,
 * });
 */
const getCoreMapOptions = ({
  mapStyle,
  theme,
  baseMapView,
  doubleClickZoom,
  cooperativeGestures,
}: MapOptionsProps): Omit<MapOptions, "container"> & { style: string } => ({
  cooperativeGestures,
  doubleClickZoom,
  failIfMajorPerformanceCaveat: false,
  style: mapStyle ?? getBaseMapStyle(baseMapView, theme),
});

export default getCoreMapOptions;
