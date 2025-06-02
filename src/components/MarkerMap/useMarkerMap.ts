import { useTheme } from "@tracktor/design-system";
import mapboxgl, { Map } from "mapbox-gl";
import { ComponentRef, useEffect, useRef, useState } from "react";
import useAnimationMap from "@/hooks/useAnimationMap.ts";
import useMarkers from "@/hooks/useMarkers.ts";
import useCorrectedMapClick from "@/hooks/useOnMapClick";
import usePopups from "@/hooks/usePopups.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import mapOptions from "@/utils/mapOptions";

export const DEFAULT_CENTER_LNG = 2.333;
export const DEFAULT_CENTER_LAT = 46.8677;

/**
 * Custom React hook to integrate and manage a Mapbox map instance with dynamic markers,
 * popups, zooming, centering, and click handling.
 *
 * This hook:
 * - Initializes a Mapbox map inside a container
 * - Loads and displays markers on the map
 * - Adds popups to specific markers when requested
 * - Adjusts the map center or fits bounds based on markers
 * - Handles map click events with a provided callback
 * - Supports customizable flyTo behavior, zoom levels, and map style
 */
const useMarkerMap = ({
  markers,
  loading,
  center,
  openPopup,
  onMapClick,
  flyToDuration = 5000,
  fitBoundDuration = 1000,
  fitBounds = true,
  disableFlyTo = false,
  fitBoundsPadding = 50,
  projection,
  mapStyle,
  baseMapView = "default",
  zoom = 6,
  zoomFlyFrom = 3,
  cooperativeGestures = true,
  doubleClickZoom = true,
}: MarkerMapProps) => {
  const { palette } = useTheme();
  const [loadingMapBox, setLoadingMapBox] = useState<boolean>(true);
  const mapContainer = useRef<ComponentRef<"div"> | null>(null);
  const map = useRef<Map | null>(null);
  const markersAreInvalid = !markers || markers.some((marker) => marker.lat === undefined || marker.lng === undefined);

  // Initialize the Mapbox map only once when the component mounts
  useEffect(() => {
    // Utiliser la méthode officielle de Mapbox
    if (!mapboxgl.supported()) {
      setLoadingMapBox(false);
      return;
    }

    if (map.current || !mapContainer.current || loading) {
      return;
    }

    const options = mapOptions({
      baseMapView,
      center,
      cooperativeGestures,
      doubleClickZoom,
      mapContainer,
      mapStyle,
      markers,
      projection,
      zoomFlyFrom,
    });

    map.current = new Map(options);
    map.current.resize();
    setLoadingMapBox(false);
  }, [baseMapView, center, cooperativeGestures, doubleClickZoom, loading, mapStyle, markers, projection, zoomFlyFrom]);

  useMarkers({ map, markers, markersAreInvalid, palette, setLoadingMapBox });
  usePopups({ map, markers, openPopup });
  useCorrectedMapClick({ map, onMapClick });
  useAnimationMap({ disableFlyTo, fitBoundDuration, fitBounds, fitBoundsPadding, flyToDuration, map, markers, zoom });

  // Clean up the map instance on a component unmount
  useEffect(
    () => () => {
      if (map.current) {
        const container = mapContainer.current;

        if (container) {
          container.innerHTML = "";
        }

        map.current.remove();
        map.current = null;
      }
    },
    [],
  );

  return {
    loading: loadingMapBox || loading,
    map,
    mapContainer,
    markers,
  };
};

export default useMarkerMap;
