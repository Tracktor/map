import { useTheme } from "@tracktor/design-system";
import { isArray } from "@tracktor/react-utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapRef } from "react-map-gl";
import type { MarkerMapProps } from "@/types/MarkerMapProps";
import getCoreMapOptions, { getBaseMapStyle } from "@/utils/getCoreMapOptions";

const useMarkerMap = ({
  center = [2.3522, 48.8566],
  zoom = 5,
  openPopup,
  openPopupOnHover,
  markers = [],
  baseMapView,
  mapStyle: baseMapStyle,
  projection,
  cooperativeGestures = true,
  doubleClickZoom = true,
  theme: themeOverride,
}: MarkerMapProps) => {
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [selected, setSelected] = useState<string | number | null>(openPopup ?? null);
  const initialCenter = useMemo(() => {
    if (isArray(center)) {
      return {
        latitude: center[1],
        longitude: center[0],
        zoom,
      };
    }
  }, [center, zoom]);

  const mapStyle = useMemo(
    () => baseMapStyle || getBaseMapStyle(baseMapView, themeOverride ?? theme.palette.mode),
    [baseMapView, baseMapStyle, themeOverride, theme.palette.mode],
  );

  const {
    style: coreStyle,
    cooperativeGestures: coopGestures,
    doubleClickZoom: dblZoom,
  } = getCoreMapOptions({
    baseMapView,
    cooperativeGestures,
    doubleClickZoom,
    mapStyle,
    projection,
    theme: themeOverride ?? theme.palette.mode,
  });

  const handleMapLoad = () => {
    const map = mapRef.current?.getMap?.();
    if (map) {
      map.setStyle(mapStyle);
    }
  };

  const handleMarkerClick = (id: string | number, hasTooltip: boolean) => {
    if (!openPopupOnHover && hasTooltip) {
      setSelected(id);
    }
  };

  const handleMarkerHover = (id: string | number | null, hasTooltip?: boolean) => {
    if (openPopupOnHover) {
      setSelected(hasTooltip ? id : null);
    }
  };

  const selectedMarker = useMemo(() => (selected ? (markers.find((m) => m.id === selected) ?? null) : null), [selected, markers]);

  useEffect(() => {
    setSelected(openPopup ?? null);
  }, [openPopup]);

  return {
    coopGestures,
    coreStyle,
    dblZoom,
    handleMapLoad,
    handleMarkerClick,
    handleMarkerHover,
    initialCenter,
    mapRef,
    selected,
    selectedMarker,
    setSelected,
  };
};

export default useMarkerMap;
