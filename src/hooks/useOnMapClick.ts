import { Map as MapboxMap } from "mapbox-gl";
import { RefObject, useEffect } from "react";

type UseCorrectedMapClickProps = {
  map: RefObject<MapboxMap | null>;
  onMapClick?: (lng: number, lat: number) => void;
  isMapInitialized?: boolean;
};

const useCorrectedMapClick = ({ map, onMapClick, isMapInitialized }: UseCorrectedMapClickProps) => {
  useEffect(() => {
    if (!(map.current && onMapClick && isMapInitialized)) {
      return;
    }

    const canvas = map.current.getCanvas();

    const handleClick = (e: MouseEvent) => {
      const point: [number, number] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];

      if (!map.current) {
        return;
      }

      const lngLat = map.current.unproject(point);

      onMapClick(lngLat.lng, lngLat.lat);
    };

    canvas.addEventListener("click", handleClick);
  }, [isMapInitialized, map, onMapClick]);
};

export default useCorrectedMapClick;
