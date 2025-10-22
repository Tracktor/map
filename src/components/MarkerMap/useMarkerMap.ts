import { useTheme } from "@tracktor/design-system";
import { useDebounce } from "@tracktor/react-utils";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { ComponentRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import useFitBounds from "@/hooks/useFitBounds.ts";
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
  const map = useRef<MapboxMap | null>(null);
  const currentTheme = theme || palette.mode;

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
        theme: currentTheme,
      }),
    [baseMapView, cooperativeGestures, currentTheme, doubleClickZoom, mapStyle, projection],
  );

  const cleanupMap = useCallback(() => {
    if (map.current) {
      map.current.remove();
      map.current = null;
      setIsMapInitialized(false);
    }

    const container = containerRef.current;

    if (container && typeof container !== "string" && container instanceof HTMLElement) {
      container.innerHTML = "";
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapboxgl.supported()) {
      return;
    }

    // Clean up an existing map if it exists
    cleanupMap();

    const container = containerRef.current;

    if (!container || typeof container === "string") {
      return;
    }

    map.current = new MapboxMap({
      ...coreMapOptions,
      container,
    });

    map.current.resize();
    setIsMapInitialized(true);
  }, [cleanupMap, coreMapOptions]);

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
    if (!(map.current && isMapInitialized) || zoom === undefined) {
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
  useMarkers({ center, fitBounds, isMapInitialized, map, markers: memoMarkers, palette });

  /**
   * Handle popups
   */
  usePopups({ isMapInitialized, map, markers: memoMarkers, openPopup });

  /**
   * Handle map click events
   */
  useCorrectedMapClick({ isMapInitialized, map, onMapClick });

  /**
   * Handle fit bounds logic
   */
  useFitBounds({
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
    currentTheme,
    isMapInitialized,
    map,
    markers: memoMarkers,
  };
};

export default useMarkerMap;
