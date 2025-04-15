import { LngLatLike } from "mapbox-gl";
import { RefObject } from "react";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG } from "@/components/MarkerMap/useMarkerMap";
import { MarkerProps } from "@/types/MarkerProps.ts";
import coordinateConverter from "@/utils/coordinateConverter";

interface MapOptionsProps {
  center?: LngLatLike | number[];
  mapContainer?: RefObject<HTMLDivElement | null>;
  markers?: MarkerProps[];
  mapStyle: string;
  zoomFlyFrom?: number;
}

/**
 * Generates configuration options for initializing a Mapbox map
 *
 * This utility function creates a standardized configuration object for Mapbox GL JS
 * by processing various input parameters. It handles:
 * - Center point calculation (with fallback to marker positions or default)
 * - Container element reference validation
 * - Style application
 * - Initial zoom level
 *
 * @param {Object} params - Configuration parameters
 * @param {string} params.mapStyle - Mapbox style URL or specification
 * @param {React.RefObject} [params.mapContainer] - Reference to the DOM container element
 * @param {number} [params.zoomFlyFrom] - Initial zoom level for fly-to animation
 * @param {MarkerProps[]} [params.markers] - Array of marker definitions
 * @param {LngLatLike|number[]} [params.center] - Optional center coordinates (either as LngLat object or [lng, lat] array)
 *
 * @returns {Object} Mapbox-compatible configuration object with:
 *   - center: Calculated center coordinates
 *   - container: Validated container reference
 *   - cooperativeGestures: Enabled by default
 *   - failIfMajorPerformanceCaveat: Disabled by default
 *   - style: The provided map style
 *   - zoom: Initial zoom level
 *
 * @example
 * const options = mapOptions({
 *   mapStyle: 'mapbox://styles/mapbox/streets-v11',
 *   mapContainer: mapRef,
 *   markers: [{ lat: 48.8584, lng: 2.2945 }],
 *   zoomFlyFrom: 12
 * });
 */
const mapOptions = ({ mapStyle, mapContainer, zoomFlyFrom, markers, center }: MapOptionsProps) => {
  const mapCenter = center
    ? coordinateConverter(center)
    : {
        lat: markers?.[0]?.lat !== undefined ? Number(markers[0].lat) : DEFAULT_CENTER_LAT,
        lng: markers?.[0]?.lng !== undefined ? Number(markers[0].lng) : DEFAULT_CENTER_LNG,
      };

  return {
    center: mapCenter,
    container: mapContainer?.current || "",
    cooperativeGestures: true,
    failIfMajorPerformanceCaveat: false,
    style: mapStyle,
    zoom: zoomFlyFrom,
  };
};

export default mapOptions;
