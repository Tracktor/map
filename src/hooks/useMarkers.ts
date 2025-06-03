import { Palette } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { RefObject, useEffect } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";

type UseInitializeMapProps = {
  map: RefObject<Map | null>;
  markers?: MarkerProps[];
  palette: Palette;
  setLoadingMapBox: (loading: boolean) => void;
  markersAreInvalid: boolean;
};

const useMarkers = ({ map, markers, markersAreInvalid, palette, setLoadingMapBox }: UseInitializeMapProps) => {
  // Add or refresh markers
  useEffect(() => {
    if (!map.current || markersAreInvalid || !markers) {
      return;
    }

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
