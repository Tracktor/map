import { Palette } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";

type UseInitializeMapProps = {
  map: RefObject<Map | null>;
  markers?: MarkerProps[];
  palette: Palette;
  setLoadingMapBox: (loading: boolean) => void;
  markersAreInvalid: boolean;
};

/**
 * Checks if markers have NOT changed to avoid unnecessary re-renders
 */
const markersHaveNotChanged = (newMarkers: MarkerProps[], prevMarkers?: MarkerProps[]): boolean => {
  if (!prevMarkers || newMarkers.length !== prevMarkers.length) {
    return false;
  }

  return !newMarkers.some((marker, index) => {
    const prev = prevMarkers[index];
    return (
      marker.id !== prev.id ||
      marker.lat !== prev.lat ||
      marker.lng !== prev.lng ||
      marker.zIndex !== prev.zIndex ||
      marker.type !== prev.type
    );
  });
};

const useMarkers = ({ map, markers, markersAreInvalid, palette, setLoadingMapBox }: UseInitializeMapProps) => {
  // Store a previous markers array to detect changes
  const previousMarkersRef = useRef<MarkerProps[]>(undefined);

  // Add or refresh markers when the map or marker data changes
  useEffect(() => {
    if (!map.current || markersAreInvalid || !markers || markersHaveNotChanged(markers, previousMarkersRef.current)) {
      return;
    }

    // Store a copy of current markers for the next comparison
    previousMarkersRef.current = [...markers];

    const handleLoadMarkers = () => {
      loadMarkers({ map, markers, palette });
      setLoadingMapBox(false); //
    };

    // If the map is already loaded, immediately add markers
    // Otherwise, wait for the "load" event
    if (map.current.loaded()) {
      handleLoadMarkers();
    } else {
      map.current.once("load", handleLoadMarkers);
    }
  }, [map, markers, markersAreInvalid, palette, setLoadingMapBox]);
};

export default useMarkers;
