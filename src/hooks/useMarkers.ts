import { Palette } from "@tracktor/design-system";
import { Map } from "mapbox-gl";
import { MutableRefObject, useEffect } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";

type UseInitializeMapProps = {
  map: MutableRefObject<Map | null>;
  markers?: MarkerProps[];
  palette: Palette;
  setLoadingMapBox: (loading: boolean) => void;
  markersAreInvalid: boolean;
};

const useMarkers = ({ map, markers, markersAreInvalid, palette, setLoadingMapBox }: UseInitializeMapProps) => {
  // Add or refresh markers when the map or marker data changes
  useEffect(() => {
    if (!map.current || markersAreInvalid) return;

    const handleLoadMarkers = () => {
      markers && loadMarkers({ map, markers, palette, setLoadingMapBox });
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
