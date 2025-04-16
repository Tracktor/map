import { Map, MapMouseEvent, Popup } from "mapbox-gl";
import { MutableRefObject, useEffect, useRef } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import addPopup from "@/utils/addPopup.ts";
import { handleMapClick } from "@/utils/handleMapClick.ts";

type UsePopupsProps = {
  map: MutableRefObject<Map | null>;
  markers?: MarkerProps[];
  openPopup: string | number | undefined;
};

const usePopups = ({ openPopup, map, markers }: UsePopupsProps) => {
  const popupRef = useRef<Popup | null>(null);

  useEffect(() => {
    if (!map.current || !markers) return undefined;

    const mapInstance = map.current;

    // Clean up existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (openPopup) {
      const marker = markers.find((getMarker) => getMarker.id === openPopup);
      const coordinates: [number, number] = [Number(marker?.lng) || 0, Number(marker?.lat) || 0];

      const popup = addPopup({
        coordinates,
        map,
        tooltip: marker?.Tooltip,
      });

      if (popup) popupRef.current = popup;
    }

    const handleOnMapClick = (event: MapMouseEvent) => {
      handleMapClick({ event, map, markers });
    };

    mapInstance.on("click", handleOnMapClick);

    return () => {
      mapInstance.off("click", handleOnMapClick);

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, markers, openPopup]);
};

export default usePopups;
