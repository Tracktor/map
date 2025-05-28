import { LngLatBounds, Map } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { isValidLatLng } from "@/main.ts";
import { MarkerProps } from "@/types/MarkerProps.ts";

type UseAnimationMapProps = {
  map: RefObject<Map | null>;
  disableFlyTo?: boolean;
  flyToDuration?: number;
  zoom?: number;
  fitBounds?: boolean;
  markers?: MarkerProps[];
  fitBoundDuration?: number;
  fitBoundsPadding?: number;
};

const useAnimationMap = ({
  map,
  disableFlyTo,
  flyToDuration,
  zoom,
  fitBounds,
  markers,
  fitBoundDuration,
  fitBoundsPadding,
}: UseAnimationMapProps) => {
  const hasFlown = useRef(false);

  // Animate camera or fit map bounds depending on props
  useEffect(() => {
    if (!map.current) return;

    // Fly to only once
    if (!disableFlyTo && !hasFlown.current) {
      map.current.flyTo({
        duration: flyToDuration,
        zoom,
      });
      hasFlown.current = true;
    }

    // Fit bounds logic
    if (!fitBounds || !markers?.length || markers.length < 2) return;

    const bounds = new LngLatBounds();

    const validMarkers = markers.filter((marker) => {
      const lng = Number(marker.lng);
      const lat = Number(marker.lat);
      return isValidLatLng(lat, lng);
    });

    if (validMarkers.length < 2) return;

    for (let i = 0; i < validMarkers.length; i += 1) {
      const lng = Number(validMarkers[i].lng);
      const lat = Number(validMarkers[i].lat);
      bounds.extend([lng, lat]);
    }

    map.current.fitBounds(bounds, {
      duration: fitBoundDuration,
      padding: fitBoundsPadding,
    });
  }, [markers, fitBounds, fitBoundsPadding, flyToDuration, zoom, fitBoundDuration, disableFlyTo, map]);
};

export default useAnimationMap;
