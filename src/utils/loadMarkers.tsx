import { Palette } from "@tracktor/design-system";
import type { FeatureCollection } from "geojson";
import { Map, Marker, GeoJSONSource } from "mapbox-gl";
import React, { ComponentType, RefObject } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG } from "@/components/MarkerMap/useMarkerMap";
import { MarkerProps } from "@/types/MarkerProps.ts";

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
    iconProps?: Record<string, any>;
    onClick?: (markerData?: CustomMarkerMapProps) => void;
    IconComponent?: ComponentType<any>;
  };
  type: string;
}

interface GenerateMarkersProps {
  palette: Palette;
  type?: string;
}

interface LoadMarkersProps {
  map: RefObject<Map | null>;
  palette: Palette;
  markers: MarkerProps[];
}

/**
 * Generates visual styles for map markers based on theme palette and marker type
 *
 * Creates consistent styling for different marker types with:
 * - Dynamic color theming (light/dark mode support)
 * - Type-specific visual differentiation
 * - Responsive sizing
 *
 * @param {Object} params - Configuration parameters
 * @param {Palette} params.palette - Design system color palette
 * @param {string} [params.type] - Optional marker type identifier (e.g. "dropOff")
 *
 * @returns {Object} Mapbox GL paint properties object containing:
 *   - circle-color: Center fill color
 *   - circle-radius: Size of marker
 *   - circle-stroke-color: Border color
 *   - circle-stroke-width: Border thickness
 *
 * @example
 * const markerStyle = generateMarkers({
 *   palette: theme.palette,
 *   type: "dropOff"
 * });
 */
export const generateMarkers = ({ palette, type }: GenerateMarkersProps): object => {
  const circleCenterColor = palette.mode === "dark" ? "black" : "white";
  const circleStrokeColorDefault = palette.secondary.main;
  const circleStrokeColorDropOff = palette.info.main;

  switch (type) {
    case "dropOff":
      return {
        "circle-color": circleCenterColor,
        "circle-radius": 5,
        "circle-stroke-color": circleStrokeColorDropOff,
        "circle-stroke-width": 6,
      };
    default:
      return {
        "circle-color": circleCenterColor,
        "circle-radius": 7,
        "circle-stroke-color": circleStrokeColorDefault,
        "circle-stroke-width": 8,
      };
  }
};

/**
 * Loads standard circle markers onto a Mapbox GL map
 *
 * Handles GeoJSON data management including
 * - Source creation/updating
 * - Layer styling application
 * - Dynamic property updates
 * - zIndex management for layer ordering
 *
 * @param {Map} map - Mapbox GL map instance
 * @param {string} sourceId - Unique identifier for the marker source
 * @param {CustomMarkerMapProps[]} standardMarkers - Array of marker definitions
 * @param {Palette} palette - Design system color palette
 */
const loadStandardMarkers = (map: Map, sourceId: string, standardMarkers: CustomMarkerMapProps[], palette: Palette) => {
  const geoJsonData: FeatureCollection = {
    features: standardMarkers.map((marker) => ({
      geometry: {
        coordinates: marker.geometry.coordinates,
        type: "Point",
      },
      properties: {
        id: marker.properties.id,
        ...marker.properties,
      },
      type: "Feature",
    })),
    type: "FeatureCollection",
  };

  const existingSource: GeoJSONSource | undefined = map.getSource(sourceId);

  if (existingSource) {
    existingSource.setData(geoJsonData);
  } else {
    map.addSource(sourceId, {
      data: geoJsonData,
      type: "geojson",
    });
  }

  // Sort markers by zIndex before adding layers
  const sortedMarkers = [...geoJsonData.features].sort((a, b) => {
    const zIndexA = a.properties?.zIndex || 0;
    const zIndexB = b.properties?.zIndex || 0;
    return zIndexA - zIndexB;
  });

  // Remove all existing marker layers to recreate them in the correct order
  const existingLayers = map.getStyle().layers;
  existingLayers?.forEach((layer) => {
    if (layer.id.startsWith("marker-") && map.getLayer(layer.id)) {
      map.removeLayer(layer.id);
    }
  });

  // Recreate layers in zIndex order
  sortedMarkers.forEach((marker) => {
    const { description: markerType, id } = marker.properties || {};
    const markerStyle = generateMarkers({ palette, type: markerType });
    const layerId = `marker-${id}`;

    map.addLayer({
      filter: ["==", "id", id],
      id: layerId,
      layout: {
        visibility: "visible",
      },
      paint: markerStyle,
      source: sourceId,
      type: "circle",
    });
  });
};

/**
 * Renders React components as custom Mapbox markers
 *
 * Features:
 * - Dynamic React component rendering
 * - Clean DOM management (removes previous markers)
 * - Position synchronization with map
 * - zIndex support for marker layering
 *
 * @param {Map} map - Mapbox GL map instance
 * @param {CustomMarkerMapProps[]} reactMarkers - Array of React-based marker definitions
 */
const loadReactMarkers = (map: Map, reactMarkers: CustomMarkerMapProps[]) => {
  const existingMarkers = document.querySelectorAll(".react-custom-marker");
  existingMarkers.forEach((el) => el.remove());

  // Trier les markers par zIndex pour assurer l'ordre correct
  const sortedReactMarkers = [...reactMarkers].sort((a, b) => {
    const zIndexA = a.properties?.zIndex || 0;
    const zIndexB = b.properties?.zIndex || 0;
    return zIndexA - zIndexB;
  });

  sortedReactMarkers.forEach((marker) => {
    const { IconComponent, iconProps, onClick, zIndex, pointerEvents } = marker.properties || {};
    const { coordinates } = marker.geometry;

    if (IconComponent && coordinates.length >= 2) {
      const markerContainer = document.createElement("div");
      markerContainer.className = "react-custom-marker";
      markerContainer.style.position = "absolute";

      // Add zIndex if provided
      if (zIndex !== undefined) {
        markerContainer.style.zIndex = zIndex.toString();
      }

      // Add pointerEvents if provided
      if (pointerEvents !== undefined) {
        markerContainer.style.pointerEvents = pointerEvents.toString();
      }

      const contentContainer = document.createElement("div");
      const root = createRoot(contentContainer);

      if (IconComponent) {
        root.render(React.createElement(IconComponent, iconProps || {}));
      }

      markerContainer.appendChild(contentContainer);

      const handleClick = () => {
        onClick?.(marker);
      };

      markerContainer.addEventListener("click", handleClick);

      new Marker(markerContainer).setLngLat([coordinates[0], coordinates[1]]).addTo(map);
    }
  });
};

/**
 * Converts generic marker data into GeoJSON format
 *
 * Performs data normalization including
 * - Coordinate validation and fallbacks
 * - Property merging
 * - Default value assignment
 *
 * @param {MarkerProps[]} markers - Array of raw marker data
 */
const geoJSONMarkers = (markers: MarkerProps[]) => ({
  features:
    markers?.map((marker, index) => ({
      geometry: {
        coordinates: [
          Number.isFinite(Number(marker.lng)) ? Number(marker.lng) : Number(DEFAULT_CENTER_LNG),
          Number.isFinite(Number(marker.lat)) ? Number(marker.lat) : Number(DEFAULT_CENTER_LAT),
        ],
        type: "Point",
      },
      properties: {
        description: marker.type,
        IconComponent: marker.IconComponent,
        iconProps: marker.iconProps,
        id: marker.id || `{marker-${index}}`,
        name: marker.name,
        onClick: marker.onClick,
        pointerEvents: marker.pointerEvents || "auto",
        size: marker.size || 1,
        zIndex: marker.zIndex || 0,
      },
      type: "Feature",
    })) || [],
  type: "FeatureCollection",
});

/**
 * Main entry point for loading markers onto a Mapbox GL map
 *
 * Orchestrates:
 * - Data conversion to GeoJSON
 * - Marker type classification
 * - Parallel loading of different marker types
 * - Loading state management
 * - zIndex-based ordering
 *
 * @param {Object} params - Configuration parameters
 * @param {MutableRefObject<Map|null>} params.map - React ref to Mapbox GL instance
 * @param {Palette} params.palette - Design system color palette
 * @param {MarkerProps[]} params.markers - Array of marker definitions
 */
export const loadMarkers = ({ map, palette, markers }: LoadMarkersProps) => {
  if (!map.current) {
    return;
  }

  const layer = geoJSONMarkers(markers);
  const standardMarkers = layer.features.filter((marker) => marker.properties?.IconComponent === undefined);

  if (standardMarkers.length) {
    loadStandardMarkers(map.current, "markerProps", standardMarkers, palette);
  }

  const reactMarkers = layer.features.filter((marker) => marker.properties?.IconComponent);

  if (reactMarkers.length) {
    loadReactMarkers(map.current, reactMarkers);
  }
};
