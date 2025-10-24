import { Box, GlobalStyles, Skeleton, useTheme } from "@tracktor/design-system";
import { memo, ReactElement, useMemo, useRef, useState } from "react";
import MapboxMap, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isArray, isNumber } from "@tracktor/react-utils";
import mapboxGlobalStyles from "@/constants/globalStyle.ts";
import FitBounds from "@/Features/Bounds/FitsBounds.ts";
import DefaultMarker from "@/Features/Markers/DefaultMarkers.tsx";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import getCoreMapOptions, { getBaseMapStyle } from "@/utils/getCoreMapOptions";

const MarkerMap = ({
  containerStyle,
  square,
  loading,
  height = 300,
  width = "100%",
  center = [2.3522, 48.8566],
  zoom = 5,
  popupMaxWidth,
  openPopup,
  openPopupOnHover,
  markers = [],
  fitBounds = true,
  fitBoundsPadding,
  fitBoundDuration,
  onMapClick,
  baseMapView,
  cooperativeGestures = true,
  doubleClickZoom = true,
  projection,
  theme: themeOverride,
}: MarkerMapProps): ReactElement => {
  const theme = useTheme();
  const mapRef = useRef<any>(null);
  const [selected, setSelected] = useState<string | number | null>(openPopup ?? null);

  const mapStyle = useMemo(
    () => getBaseMapStyle(baseMapView, themeOverride ?? theme.palette.mode),
    [baseMapView, themeOverride, theme.palette.mode],
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

  return (
    <Box sx={{ height, position: "relative", width, ...containerStyle }}>
      <GlobalStyles styles={mapboxGlobalStyles} />

      <MapboxMap
        key={`${coopGestures}-${dblZoom}-${projection}`}
        ref={mapRef}
        onLoad={handleMapLoad}
        cooperativeGestures={coopGestures}
        doubleClickZoom={dblZoom}
        mapStyle={coreStyle}
        projection={projection}
        initialViewState={{
          latitude: isArray(center) ? center[1] : center.lat,
          longitude: isArray(center) ? center[0] : center.lng,
          zoom,
        }}
        style={{ height: "100%", width: "100%" }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onClick={(e) => onMapClick?.(e.lngLat.lng, e.lngLat.lat)}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            longitude={isNumber(m.lng) ? m.lng : undefined}
            latitude={isNumber(m.lat) ? m.lat : undefined}
            anchor="bottom"
            onClick={() => handleMarkerClick(m.id, Boolean(m.Tooltip))}
            onMouseEnter={() => handleMarkerHover(m.id, Boolean(m.Tooltip))}
            onMouseLeave={() => handleMarkerHover(null)}
          >
            {m.IconComponent ? (
              <m.IconComponent {...m.iconProps} />
            ) : (
              <DefaultMarker color={m.type === "worksite" ? "#1976d2" : "#4caf50"} />
            )}
          </Marker>
        ))}

        {selectedMarker?.Tooltip && (
          <Popup
            longitude={isNumber(selectedMarker.lng) ? selectedMarker.lng : 0}
            latitude={isNumber(selectedMarker.lat) ? selectedMarker.lat : 0}
            anchor="top"
            onClose={() => setSelected(null)}
            maxWidth={popupMaxWidth}
            closeOnClick={false}
          >
            {selectedMarker.Tooltip}
          </Popup>
        )}

        {fitBounds && markers.length > 1 && <FitBounds markers={markers} padding={fitBoundsPadding} duration={fitBoundDuration} />}
      </MapboxMap>

      {loading && (
        <Skeleton
          width={width}
          height={height}
          variant={square ? "rectangular" : "rounded"}
          sx={{
            inset: 0,
            position: "absolute",
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
};

export default memo(MarkerMap);
