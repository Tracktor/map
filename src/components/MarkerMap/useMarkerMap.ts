import { useTheme } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { ComponentRef, useEffect, useRef, useState } from "react";
import useAnimationMap from "@/hooks/useAnimationMap.ts";
import useMapCenter from "@/hooks/useMapCenter.ts";
import useMarkers from "@/hooks/useMarkers.ts";
import useCorrectedMapClick from "@/hooks/useOnMapClick";
import usePopups from "@/hooks/usePopups.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import isWebGLSupported from "@/utils/isWebGLSupported";
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
  mapStyle = "mapbox://styles/mapbox/streets-v12?optimize=true",
  zoom = 6,
  zoomFlyFrom = 3,
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
      return;
    }

    if (map.current || !mapContainer.current || loading) {
      return;
    }

    // Clean up container if needed
    if (mapContainer.current.innerHTML !== "") {
      mapContainer.current.innerHTML = "";
    }

    const options = mapOptions({ center, mapContainer, mapStyle, markers, zoomFlyFrom });

    map.current = new Map(options);
  }, [center, loading, mapStyle, markers, zoomFlyFrom]);

  useMarkers({ map, markers, markersAreInvalid, palette, setLoadingMapBox });
  usePopups({ map, markers, openPopup });
  useMapCenter({ center, map });
  useCorrectedMapClick({ map, onMapClick });
  useAnimationMap({ disableFlyTo, fitBoundDuration, fitBounds, fitBoundsPadding, flyToDuration, map, markers, zoom });

  // Cleanup the map instance on component unmount
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
