import { LngLatBounds, Map as MapboxMap } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";

type useFitBoundsProps = {
  map: RefObject<MapboxMap | null>;
  disableAnimation: boolean | undefined;
  fitBounds?: boolean;
  fitBoundDuration?: number;
  fitBoundsPadding?: number;
  isMapInitialized: boolean;
  markers?: MarkerProps[];
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

const useFitBounds = ({
  map,
  disableAnimation,
  fitBounds,
  markers,
  fitBoundDuration,
  fitBoundsPadding,
  isMapInitialized,
  fitBoundsAnimationKey,
}: useFitBoundsProps) => {
  const previousSerializedKey = useRef<string | number | undefined>(undefined);

  /**
   * fitBounds the map to the markers' bounds with animation.
   */
  useEffect(() => {
    // If the map is not initialized, or if animation is disabled, or if fitBounds is false, or if there are no markers or only one marker, skip the fitBounds logic
    if (!(map.current && isMapInitialized) || disableAnimation || fitBounds === false || !markers?.length || markers?.length <= 1) {
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

    markers.forEach((marker) => {
      bounds.extend([Number(marker.lng), Number(marker.lat)]);
    });

    map.current?.fitBounds(bounds, {
      duration: getFitBoundDuration(fitBoundDuration, markers),
      padding: fitBoundsPadding,
    });
  }, [markers, disableAnimation, fitBoundDuration, fitBounds, fitBoundsAnimationKey, fitBoundsPadding, isMapInitialized, map]);
};

export default useFitBounds;
