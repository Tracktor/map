import { Palette } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { RefObject, useEffect } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";

type UseInitializeMapProps = {
  map: RefObject<Map | null>;
  markers?: MarkerProps[];
  palette: Palette;
  isMapInitialized: boolean;
};

const useMarkers = ({ map, markers, palette, isMapInitialized }: UseInitializeMapProps) => {
  // Add or refresh markers
  useEffect(() => {
    if (!map.current || !markers || !isMapInitialized) {
      return;
    }

    const handleLoadMarkers = () => {
      loadMarkers({ map, markers, palette });
    };

    // If the map is already loaded, immediately add markers
    // Otherwise, wait for the "load" event
    if (map.current.loaded()) {
      handleLoadMarkers();
    } else {
      map.current.once("load", handleLoadMarkers);
    }
  }, [map, markers, palette, isMapInitialized]);
};

export default useMarkers;
