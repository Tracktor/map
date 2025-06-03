import { useTheme } from "@tracktor/design-system";
import mapboxgl, { Map } from "mapbox-gl";
import { ComponentRef, useEffect, useMemo, useRef, useState, useCallback } from "react";
import useAnimationMap from "@/hooks/useAnimationMap.ts";
import useMarkers from "@/hooks/useMarkers.ts";
import useCorrectedMapClick from "@/hooks/useOnMapClick";
import usePopups from "@/hooks/usePopups.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import coordinateConverter from "@/utils/coordinateConverter.ts";
import getCoreMapOptions from "@/utils/getCoreMapOptions.ts";
import isValidLatLng from "@/utils/isValidLatLng.ts";

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
  disableAnimation,
  openPopup,
  onMapClick,
  projection,
  mapStyle,
  baseMapView = "default",
  zoom = 6,
  fitBoundsPadding = 50,
  zoomFlyFrom = 3,
  flyToDuration = 5000,
  fitBoundDuration = 1000,
  fitBounds = true,
  disableFlyTo = false,
  cooperativeGestures = true,
  doubleClickZoom = true,
}: MarkerMapProps) => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { palette } = useTheme();
  const containerRef = useRef<ComponentRef<"div"> | string>("");
  const map = useRef<Map | null>(null);

  const markersMemo = useMemo(() => {
    if (!markers) {
      return [];
    }

    return markers.filter(
      (marker) => marker.lat !== undefined && marker.lng !== undefined && isValidLatLng(Number(marker.lat), Number(marker.lng)),
    );
  }, [markers]);

  const coreMapOptions = useMemo(
    () =>
      getCoreMapOptions({
        baseMapView,
        cooperativeGestures,
        doubleClickZoom,
        mapStyle,
        projection,
        zoomFlyFrom,
      }),
    [baseMapView, cooperativeGestures, doubleClickZoom, mapStyle, projection, zoomFlyFrom],
  );

  const cleanupMap = useCallback(() => {
    if (map.current) {
      const container = containerRef.current;

      if (container && typeof container !== "string") {
        container.innerHTML = "";
      }

      map.current.remove();
      map.current = null;
      setIsMapInitialized(false);
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapboxgl.supported() || loading) {
      return;
    }

    // Clean up an existing map if it exists
    cleanupMap();

    // Create a new map instance
    map.current = new Map({
      ...coreMapOptions,
      container: containerRef.current,
    });

    map.current.resize();
    setIsMapInitialized(true);
  }, [cleanupMap, coreMapOptions, loading]);

  // Initialize/recreate the map when core options change
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Update center separately without recreating the map
  useEffect(() => {
    if (!map.current || !isMapInitialized) {
      return;
    }

    const mapCenter = coordinateConverter(center) || {
      lat: DEFAULT_CENTER_LAT,
      lng: DEFAULT_CENTER_LNG,
    };

    // Update center smoothly without recreation
    map.current.setCenter(mapCenter);
  }, [center, isMapInitialized]);

  // Update zoom separately if needed
  useEffect(() => {
    if (!map.current || !isMapInitialized || zoom === undefined) {
      return;
    }

    // Only update zoom if it's different from the current
    if (Math.abs(map.current.getZoom() - zoom) > 0.1) {
      map.current.setZoom(zoom);
    }
  }, [zoom, isMapInitialized]);

  // Initialize hooks
  useMarkers({ isMapInitialized, map, markers: markersMemo, palette });
  usePopups({ isMapInitialized, map, markers: markersMemo, openPopup });
  useCorrectedMapClick({ isMapInitialized, map, onMapClick });
  useAnimationMap({
    disableAnimation,
    disableFlyTo,
    fitBoundDuration,
    fitBounds,
    fitBoundsPadding,
    flyToDuration,
    isMapInitialized,
    map,
    markers: markersMemo,
    zoom,
  });

  // Clean up on unmounting
  useEffect(() => cleanupMap, [cleanupMap]);

  return {
    containerRef,
    isMapInitialized,
    loading,
    map,
    markers: markersMemo,
  };
};

export default useMarkerMap;
