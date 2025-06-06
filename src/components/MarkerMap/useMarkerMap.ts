import { useTheme } from "@tracktor/design-system";
import { useDebounce } from "@tracktor/react-utils";
import mapboxgl, { Map } from "mapbox-gl";
import { ComponentRef, useEffect, useMemo, useRef, useState, useCallback } from "react";
import useAnimationMap from "@/hooks/useAnimationMap.ts";
import useMarkers from "@/hooks/useMarkers.ts";
import useCorrectedMapClick from "@/hooks/useOnMapClick";
import usePopups from "@/hooks/usePopups.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";
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
 */
const useMarkerMap = ({
  markers,
  loading,
  center,
  disableAnimation,
  openPopup,
  onMapClick,
  projection,
  theme,
  mapStyle,
  fitBoundsAnimationKey,
  baseMapView = "default",
  zoom = 6,
  fitBoundsPadding = 50,
  fitBoundDuration = 1000,
  fitBounds = true,
  cooperativeGestures = true,
  doubleClickZoom = true,
}: MarkerMapProps) => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { palette } = useTheme();
  const debouncedMarkers = useDebounce(markers);
  const containerRef = useRef<ComponentRef<"div"> | string>("");
  const map = useRef<Map | null>(null);

  const memoMarkers = useMemo(() => {
    if (!debouncedMarkers) {
      return [];
    }

    return debouncedMarkers.filter(
      (marker) => marker.lat !== undefined && marker.lng !== undefined && isValidLatLng(Number(marker.lat), Number(marker.lng)),
    );
  }, [debouncedMarkers]);

  const coreMapOptions = useMemo(
    () =>
      getCoreMapOptions({
        baseMapView,
        cooperativeGestures,
        doubleClickZoom,
        mapStyle,
        projection,
        theme: theme || palette.mode,
      }),
    [baseMapView, cooperativeGestures, doubleClickZoom, mapStyle, palette.mode, projection, theme],
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

  /**
   * Initialize/recreate the map when core options change
   */
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  /**
   * Update zoom separately if needed
   */
  useEffect(() => {
    if (!map.current || !isMapInitialized || zoom === undefined) {
      return;
    }

    // Only update zoom if it's different from the current
    if (Math.abs(map.current.getZoom() - zoom) > 0.1) {
      map.current.setZoom(zoom);
    }
  }, [zoom, isMapInitialized]);

  /**
   * Initialize markers
   */
  useMarkers({ isMapInitialized, map, markers: memoMarkers, palette });

  /**
   * Handle popups
   */
  usePopups({ isMapInitialized, map, markers: memoMarkers, openPopup });

  /**
   * Handle map click events
   */
  useCorrectedMapClick({ isMapInitialized, map, onMapClick });

  /**
   * Handle map animations such as fitBounds
   */
  useAnimationMap({
    center,
    disableAnimation,
    fitBoundDuration,
    fitBounds,
    fitBoundsAnimationKey,
    fitBoundsPadding,
    isMapInitialized,
    map,
    markers: memoMarkers,
  });

  /**
   * Clean up on unmounting
   */
  useEffect(() => cleanupMap, [cleanupMap]);

  return {
    containerRef,
    isMapInitialized,
    loading,
    map,
    markers: memoMarkers,
  };
};

export default useMarkerMap;
