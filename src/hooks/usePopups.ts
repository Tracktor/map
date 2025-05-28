import { Map, Popup } from "mapbox-gl";
import { RefObject, useEffect, useRef } from "react";
import { MarkerProps } from "@/types/MarkerProps";
import addPopup from "@/utils/addPopup";
import getFeature from "@/utils/getFeature";
import { CustomMarkerMapProps } from "@/utils/loadMarkers.tsx";

type UsePopupsProps = {
  map: RefObject<Map | null>;
  markers?: MarkerProps[];
  openPopup: string | number | undefined;
};

const usePopups = ({ openPopup, map, markers }: UsePopupsProps) => {
  const popupRef = useRef<Popup | null>(null);

  useEffect(() => {
    if (!map.current || !markers) return undefined;

    const mapInstance = map.current;
    const canvas = mapInstance.getCanvas();

    // Clean up the existing popup
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    // Handle popup from props
    if (openPopup) {
      const marker = markers.find((getMarker) => getMarker.id === openPopup);
      if (marker) {
        const coordinates: [number, number] = [Number(marker.lng) || 0, Number(marker.lat) || 0];

        const popup = addPopup({
          coordinates,
          map,
          tooltip: marker.Tooltip,
        });

        if (popup) popupRef.current = popup;
      }
    }

    const handleOnMapClick = (event: MouseEvent) => {
      const point: [number, number] = [
        event.clientX - canvas.getBoundingClientRect().left,
        event.clientY - canvas.getBoundingClientRect().top,
      ];

      const feature = getFeature({ map, point });

      if (feature && feature.properties && feature.properties.id) {
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }

        const marker = markers.find((getMarker) => getMarker.id === feature.properties.id);

        if (marker) {
          const coordinates: [number, number] = [Number(marker.lng) || 0, Number(marker.lat) || 0];

          // Easiest way to handle click events from marker & from geojson
          if (typeof marker.onClick === "function") {
            const markerProps: CustomMarkerMapProps = {
              geometry: {
                coordinates,
                type: "Point",
              },
              properties: {
                description: marker.name,
                id: marker.id,
                name: marker.name,
                onClick: marker.onClick,
                size: marker.size || 1,
                zIndex: marker.zIndex || 1,
              },
              type: "Feature",
            };

            marker.onClick(markerProps);
          }

          requestAnimationFrame(() => {
            const popup = addPopup({
              coordinates,
              map,
              tooltip: marker.Tooltip,
            });
            if (popup) popupRef.current = popup;
          });
        }
      }
    };

    canvas.addEventListener("click", handleOnMapClick);

    return () => {
      canvas.removeEventListener("click", handleOnMapClick);

      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map, markers, openPopup]);
};

export default usePopups;
