import { Map } from "mapbox-gl";
import { RefObject, useEffect } from "react";

type UseCorrectedMapClickProps = {
  map: RefObject<Map | null>;
  onMapClick?: (lng: number, lat: number) => void;
};

const useCorrectedMapClick = ({ map, onMapClick }: UseCorrectedMapClickProps) => {
  useEffect(() => {
    if (!map.current || !onMapClick) return;

    const canvas = map.current.getCanvas();

    const handleClick = (e: MouseEvent) => {
      const point: [number, number] = [e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top];
      const lngLat = map.current!.unproject(point);
      onMapClick(lngLat.lng, lngLat.lat);
    };

    canvas.addEventListener("click", handleClick);
  }, [map, onMapClick]);
};

export default useCorrectedMapClick;
