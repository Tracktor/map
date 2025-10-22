import { Map as MapboxMap, PointLike } from "mapbox-gl";
import { RefObject } from "react";
import { isClickedFeature, isFeatureGeometry } from "@/utils/typeguard";

interface GetFeatureProps {
  map: RefObject<MapboxMap | null>;
  point: PointLike;
}

/**
 * Handles map click events to display popups
 *
 * This function:
 * 1. Detects if a GeoJSON marker was clicked
 * 2. If a marker was clicked, displays its popup
 * 3. If no marker was clicked, displays a popup at clicked location
 *
 * @param {GetFeatureProps} options - Configuration params
 */
const getFeature = ({ map, point }: GetFeatureProps) => {
  if (!map.current?.isStyleLoaded()) {
    return null;
  }

  // Query the map to get the clicked feature based on the provided layers names
  const layers =
    map.current
      ?.getStyle()
      ?.layers?.filter((layer) => layer.id.startsWith("marker-"))
      .map((layer) => layer.id) || [];

  const features = map.current?.queryRenderedFeatures(point, { layers });

  if (features && features.length > 0) {
    const clickedFeature = features[0];
    if (!(isClickedFeature(clickedFeature) && isFeatureGeometry(clickedFeature.geometry))) {
      return null;
    }
    const { geometry } = clickedFeature;
    const coordinates = geometry.coordinates.slice();

    if (coordinates.length !== 2 || typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number") {
      return null;
    }

    return clickedFeature;
  }
};

export default getFeature;
