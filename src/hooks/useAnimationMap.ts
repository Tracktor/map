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
}: UseAnimationMapProps) => {
  const hasFlown = useRef(false);
  const debouncedMarkers = useDebounce(markers, 150);

  // Animation logic with debounced markers
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

    const bounds = new LngLatBounds();

    // Markers are already valid, forEach is optimal for this case
    debouncedMarkers.forEach((marker) => {
      bounds.extend([Number(marker.lng), Number(marker.lat)]);
    });

    map.current.fitBounds(bounds, {
      duration: fitBoundDuration,
      padding: fitBoundsPadding,
    });
  }, [
    debouncedMarkers,
    fitBounds,
    fitBoundsPadding,
    flyToDuration,
    zoom,
    fitBoundDuration,
    disableFlyTo,
    map,
    isMapInitialized,
    disableAnimation,
    center,
  ]);
};

export default useAnimationMap;
