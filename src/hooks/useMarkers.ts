import { Palette, useTheme } from "@tracktor/design-system";
import { LngLatLike, Map } from "mapbox-gl";
import { RefObject, useEffect } from "react";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG } from "@/constants/coordinates.ts";
import { MarkerProps } from "@/types/MarkerProps.ts";
import coordinateConverter from "@/utils/coordinateConverter.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";

type UseInitializeMapProps = {
  map: RefObject<Map | null>;
  markers?: MarkerProps[];
  palette: Palette;
  isMapInitialized: boolean;
  fitBounds?: boolean;
  center?: LngLatLike | number[];
};

const useMarkers = ({ map, markers, palette, isMapInitialized, fitBounds, center }: UseInitializeMapProps) => {
  const theme = useTheme();

  // Add or refresh markers
  useEffect(() => {
    if (!map.current || !markers || !isMapInitialized) {
      return;
    }

    const centerMap = () => {
      // Set center if no markers are present or only one marker is present
      if (!fitBounds || (markers?.length || 0) <= 1) {
        const mapCenter = center
          ? coordinateConverter(center) || {
              lat: DEFAULT_CENTER_LAT,
              lng: DEFAULT_CENTER_LNG,
            }
          : {
              lat: markers?.[0]?.lat !== undefined ? Number(markers[0].lat) : DEFAULT_CENTER_LAT,
              lng: markers?.[0]?.lng !== undefined ? Number(markers[0].lng) : DEFAULT_CENTER_LNG,
            };

        map.current?.setCenter(mapCenter);
      }
    };

    const handleLoadMarkers = () => {
      centerMap();
      loadMarkers({ map, markers, palette, theme });
    };

    // If the map is already loaded, immediately add markers
    // Otherwise, wait for the "load" event
    if (map.current.loaded()) {
      handleLoadMarkers();
    } else {
      map.current.once("load", handleLoadMarkers);
    }
  }, [center, fitBounds, isMapInitialized, map, markers, palette, theme]);
};

export default useMarkers;
