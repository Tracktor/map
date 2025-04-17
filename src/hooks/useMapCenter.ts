import { LngLatLike, Map } from "mapbox-gl";
import { RefObject, useEffect } from "react";
import { DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG, isValidLatLng } from "@/main.ts";
import coordinateConverter from "@/utils/coordinateConverter.ts";

type UseMapCenterProps = {
  map: RefObject<Map | null>;
  center?: LngLatLike | number[] | undefined;
};

const useMapCenter = ({ map, center }: UseMapCenterProps) => {
  // Update map center when `center` prop changes
  useEffect(() => {
    if (!map.current || !center) return;

    const mapCenter =
      Array.isArray(center) && isValidLatLng(center[1], center[0])
        ? coordinateConverter(center)
        : { lat: DEFAULT_CENTER_LAT, lng: DEFAULT_CENTER_LNG };

    if (!mapCenter) return;

    map.current.setCenter(mapCenter);
  }, [center, map]);
};

export default useMapCenter;
