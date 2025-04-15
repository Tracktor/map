import { MapMouseEvent, Map } from "mapbox-gl";
import { RefObject } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import { isClickedFeature, isFeatureGeometry } from "@/types/typeguard";
import addPopup from "@/utils/addPopup";

export interface HandleMapClickProps {
  map: RefObject<Map | null>;
  markers: MarkerProps[];
  event: MapMouseEvent;
}

/**
 * Handles map click events to display popups on clicked markers
 *
 * This function:
 * 1. Identifies if a marker was clicked within the map
 * 2. Extracts the coordinates and properties of the clicked marker
 * 3. Finds the corresponding marker in the provided markers array
 * 4. Displays a popup at the marker's location with its tooltip content
 *
 * The function only processes clicks on layers whose IDs start with "marker-".
 *
 * @param {Object} options - The click handler configuration
 * @param {MutableRefObject<Map | null>} options.map - Reference to the Mapbox map instance
 * @param {MarkerProps[]} options.markers - Array of marker objects with tooltips and properties
 * @param {MapMouseEvent} options.event - The Mapbox mouse event triggered by clicking
 * @returns {void}
 */
export const handleMapClick = ({ map, markers, event }: HandleMapClickProps) => {
  if (!map.current?.isStyleLoaded()) {
    return;
  }

  // Query the map to get the clicked feature based on the provided layers names
  const layers =
    map.current
      ?.getStyle()
      ?.layers?.filter((layer) => layer.id.startsWith("marker-"))
      .map((layer) => layer.id) || [];

  const features = map.current?.queryRenderedFeatures(event.point, { layers });

  if (features && features.length > 0) {
    const clickedFeature = features[0];
    if (!isClickedFeature(clickedFeature) || !isFeatureGeometry(clickedFeature.geometry)) {
      return;
    }
    const { geometry } = clickedFeature;
    const { properties } = clickedFeature;

    const coordinates = geometry.coordinates.slice();

    if (coordinates.length !== 2 || typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number") {
      return;
    }

    const [lng, lat] = coordinates;
    const markerElement = markers.find((getMarker) => getMarker.id === properties?.id);

    if (markerElement) {
      addPopup({ coordinates: [lng, lat], map, tooltip: markerElement?.Tooltip });
    }
  }
};
