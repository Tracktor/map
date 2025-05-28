import { Map, MapboxOptions } from "mapbox-gl";
import { RefObject, useEffect } from "react";
import { MarkerProps } from "@/types/MarkerProps.ts";
import isWebGLSupported from "@/utils/isWebGLSupported.ts";
import mapOptions from "@/utils/mapOptions.ts";

type UseInitMapProps = {
  map: RefObject<Map | null>;
  setWebGLSupported: (supported: boolean) => void;
  setLoadingMapBox: (loading: boolean) => void;
  loading: boolean;
  mapContainer: RefObject<HTMLDivElement | null>;
  baseMapView: "default" | "satellite" | "streets" | "dark" | "3d";
  center?: [number, number];
  mapStyle?: string;
  markers?: MarkerProps[];
  projection?: MapboxOptions["projection"];
  zoomFlyFrom?: number;
};

const useInitMap = ({
  map,
  setWebGLSupported,
  setLoadingMapBox,
  loading,
  mapContainer,
  baseMapView,
  center,
  mapStyle,
  markers,
  projection,
  zoomFlyFrom,
}: UseInitMapProps) => {
  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebGLSupported(false);
      setLoadingMapBox(false);
      return undefined;
    }

    if (map.current || !mapContainer.current || loading) {
      return undefined;
    }

    // Clean up container if needed
    if (mapContainer.current.innerHTML !== "") {
      mapContainer.current.innerHTML = "";
    }

    const options = mapOptions({
      baseMapView,
      center,
      mapContainer,
      mapStyle,
      markers,
      projection,
      zoomFlyFrom,
    });

    // Initialize map
    map.current = new Map({
      ...options,
      doubleClickZoom: false,
      scrollZoom: true,
    });

    const mapInstance = map.current;

    const handleDoubleClick = (event: MouseEvent) => {
      const canvas = mapInstance.getCanvas();
      const rect = canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const lngLat = mapInstance.unproject([x, y]);

      mapInstance.flyTo({ center: lngLat, zoom: mapInstance.getZoom() + 1 });
    };

    const canvas = mapInstance.getCanvas();
    canvas.addEventListener("dblclick", handleDoubleClick);

    return () => {
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [center, loading, mapStyle, markers, projection, zoomFlyFrom, baseMapView, map, mapContainer, setWebGLSupported, setLoadingMapBox]);
};

export default useInitMap;
