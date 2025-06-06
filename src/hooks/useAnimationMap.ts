import { useDebounce } from "@tracktor/react-utils";
import { LngLatBounds, LngLatLike, Map } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG } from "@/components/MarkerMap/useMarkerMap.ts";
import { MarkerProps } from "@/types/MarkerProps.ts";
import coordinateConverter from "@/utils/coordinateConverter.ts";

type UseAnimationMapProps = {
  map: RefObject<Map | null>;
  disableFlyTo?: boolean;
  disableAnimation: boolean | undefined;
  flyToDuration?: number;
  zoom?: number;
  fitBounds?: boolean;
  fitBoundDuration?: number;
  fitBoundsPadding?: number;
  isMapInitialized: boolean;
  markers?: MarkerProps[];
  center?: LngLatLike | number[];
  fitBoundsAnimationKey?: unknown;
};

/**
 * Serializes a query key to a string for comparison purposes.
 * @param key
 */
const serializeQueryKey = (key: unknown): string => {
  if (typeof key === "string" || typeof key === "number") {
    return String(key);
  }

  // For arrays or objects, we can use JSON.stringify
  return JSON.stringify(key);
};

const useAnimationMap = ({
  map,
  disableFlyTo,
  disableAnimation,
  flyToDuration,
  zoom,
  fitBounds,
  markers,
  fitBoundDuration,
  fitBoundsPadding,
  isMapInitialized,
  center,
  fitBoundsAnimationKey,
}: UseAnimationMapProps) => {
  const hasFlown = useRef(false);
  const debouncedMarkers = useDebounce(markers);
  const previousSerializedKey = useRef<string | number | undefined>(undefined);

  // Animation logic
  useEffect(() => {
    if (!map.current || !isMapInitialized || disableAnimation) {
      return;
    }

    // Fly to only once
    if (!disableFlyTo && !hasFlown.current) {
      map.current.flyTo({
        duration: flyToDuration,
        zoom,
      });
      hasFlown.current = true;
    }

    // Set center if no markers are present
    if (!fitBounds || !debouncedMarkers?.length || debouncedMarkers.length < 2) {
      const mapCenter = coordinateConverter(center) || {
        lat: DEFAULT_CENTER_LAT,
        lng: DEFAULT_CENTER_LNG,
      };

      map.current.setCenter(mapCenter);
      return;
    }

    // If fitBoundsAnimationKey is provided, check if it has changed
    if (fitBoundsAnimationKey !== undefined) {
      const currentSerializedKey = serializeQueryKey(fitBoundsAnimationKey);

      // If the serialized key has not changed, skip the fitBounds logic
      if (previousSerializedKey.current === currentSerializedKey) {
        return;
      }

      // Update the previous serialized key
      previousSerializedKey.current = currentSerializedKey;
    }

    const bounds = new LngLatBounds();

    debouncedMarkers.forEach((marker) => {
      bounds.extend([Number(marker.lng), Number(marker.lat)]);
    });

    map.current.fitBounds(bounds, {
      duration: fitBoundDuration,
      padding: fitBoundsPadding,
    });
  }, [
    center,
    debouncedMarkers,
    disableAnimation,
    disableFlyTo,
    fitBoundDuration,
    fitBounds,
    fitBoundsAnimationKey,
    fitBoundsPadding,
    flyToDuration,
    isMapInitialized,
    map,
    zoom,
  ]);
};

export default useAnimationMap;
