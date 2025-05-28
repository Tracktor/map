import { useTheme } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { ComponentRef, useEffect, useRef, useState } from "react";
import useAnimationMap from "@/hooks/useAnimationMap.ts";
import useMarkers from "@/hooks/useMarkers.ts";
import useCorrectedMapClick from "@/hooks/useOnMapClick";
import usePopups from "@/hooks/usePopups.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import isWebGLSupported from "@/utils/isWebGLSupported";
import mapOptions from "@/utils/mapOptions";
import isMac from "@/utils/os.ts";

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
  zoomActivationKey = "alt",
}: MarkerMapProps) => {
  const { palette } = useTheme();
  const [loadingMapBox, setLoadingMapBox] = useState<boolean>(true);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const mapContainer = useRef<ComponentRef<"div"> | null>(null);
  const map = useRef<Map | null>(null);
  const markersAreInvalid = !markers || markers.some((marker) => marker.lat === undefined || marker.lng === undefined);

  // Initialize the Mapbox map only once when the component mounts
  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebGLSupported(false);
      setLoadingMapBox(false);
      return undefined;
    }

    if (map.current || !mapContainer.current || loading) {
      return undefined;
    }

    // Clean up container if needed
    if (mapContainer.current.innerHTML !== "") {
      mapContainer.current.innerHTML = "";
    }

    const options = mapOptions({
      baseMapView,
      center,
      mapContainer,
      mapStyle,
      markers,
      projection,
      zoomFlyFrom,
    });

    // Initialize map
    map.current = new Map({
      ...options,
      // natif zoom have weird behavior, so we customize it with container ref
      doubleClickZoom: false,
      scrollZoom: false,
    });

    const mapInstance = map.current;
    const canvas = mapInstance.getCanvas();

    const handleDoubleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const lngLat = mapInstance.unproject([x, y]);

      mapInstance.flyTo({ center: lngLat, zoom: mapInstance.getZoom() + 1 });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const isModifierPressed = (() => {
        switch (zoomActivationKey) {
          case "alt":
            return isMac() ? event.metaKey : event.altKey;
          case "meta":
            return event.metaKey;
          case "ctrl":
            return event.ctrlKey;
          case "shift":
            return event.shiftKey;
          case null:
          case undefined:
            return true;
          default:
            return true;
        }
      })();

      if (!isModifierPressed) {
        return;
      }

      const delta = event.deltaY;
      const zoomChange = delta > 0 ? -2 : 2;
      const newZoom = mapInstance.getZoom() + zoomChange;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const lngLat = mapInstance.unproject([x, y]);

      mapInstance.flyTo({
        center: lngLat,
        zoom: newZoom,
      });
    };

    canvas.addEventListener("dblclick", handleDoubleClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [center, loading, mapStyle, markers, projection, zoomFlyFrom, baseMapView, zoomActivationKey]);

  useMarkers({ map, markers, markersAreInvalid, palette, setLoadingMapBox });
  usePopups({ map, markers, openPopup });
  useCorrectedMapClick({ map, onMapClick });
  useAnimationMap({ disableFlyTo, fitBoundDuration, fitBounds, fitBoundsPadding, flyToDuration, map, markers, zoom });

  // Cleanup the map instance on a component unmount
  useEffect(
    () => () => {
      if (map.current) {
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
    webGLSupported,
  };
};

export default useMarkerMap;
