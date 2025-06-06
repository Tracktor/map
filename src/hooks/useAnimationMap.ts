import { useDebounce } from "@tracktor/react-utils";
import { LngLatBounds, LngLatLike, Map } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG } from "@/main.ts";
import { MarkerProps } from "@/types/MarkerProps.ts";
import coordinateConverter from "@/utils/coordinateConverter.ts";

type UseAnimationMapProps = {
  map: RefObject<Map | null>;
  disableAnimation: boolean | undefined;
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

/**
 * Determines the duration for fitting bounds based on the provided parameters.
 * @param fitBoundDuration
 * @param markers
 */
const getFitBoundDuration = (fitBoundDuration?: number, markers?: MarkerProps[]) => {
  if (markers && markers?.length <= 1) {
    return 100; // No animation for single marker or no markers
  }

  return fitBoundDuration;
};

const useAnimationMap = ({
  map,
  disableAnimation,
  fitBounds,
  markers,
  fitBoundDuration,
  fitBoundsPadding,
  isMapInitialized,
  center,
  fitBoundsAnimationKey,
}: UseAnimationMapProps) => {
  const debouncedMarkers = useDebounce(markers);
  const previousSerializedKey = useRef<string | number | undefined>(undefined);

  /**
   * Center map if no markers are present or if fitBounds is false.
   */
  useEffect(() => {
    // Set center if no markers are present
    if (!fitBounds || !debouncedMarkers?.length) {
      const mapCenter = coordinateConverter(center) || {
        lat: DEFAULT_CENTER_LAT,
        lng: DEFAULT_CENTER_LNG,
      };

      map.current?.setCenter(mapCenter);
    }
  }, [center, debouncedMarkers?.length, fitBounds, map]);

  /**
   * fitBounds the map to the markers' bounds with animation.
   */
  useEffect(() => {
    if (!map.current || !isMapInitialized || disableAnimation || fitBounds === false || !debouncedMarkers?.length) {
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

    map.current?.fitBounds(bounds, {
      duration: getFitBoundDuration(fitBoundDuration, debouncedMarkers),
      padding: fitBoundsPadding,
    });
  }, [debouncedMarkers, disableAnimation, fitBoundDuration, fitBounds, fitBoundsAnimationKey, fitBoundsPadding, isMapInitialized, map]);
};

export default useAnimationMap;
