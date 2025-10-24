import { Box, GlobalStyles, Skeleton, useTheme } from "@tracktor/design-system";
import { memo, ReactElement, useMemo, useState } from "react";
import MapboxMap, { Marker, Popup } from "react-map-gl";
import { MarkerMapProps } from "@/types/MarkerMapProps";
import "mapbox-gl/dist/mapbox-gl.css";
import { isArray } from "@tracktor/react-utils";
import FitBounds from "@/Features/Bounds/FitsBounds.ts";

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
  mapStyle = "mapbox://styles/mapbox/streets-v11",
}: MarkerMapProps): ReactElement => {
  const theme = useTheme();
  const [selected, setSelected] = useState<string | number | null>(openPopup ?? null);

  const selectedMarker = useMemo(() => (selected ? (markers.find((m) => m.id === selected) ?? null) : null), [selected, markers]);

  const handleMarkerClick = (id: string | number) => {
    if (!openPopupOnHover) {
      setSelected(id);
    }
  };

  const handleMarkerHover = (id: string | number | null) => {
    if (openPopupOnHover) {
      setSelected(id);
    }
  };

  return (
    <Box sx={{ height, position: "relative", width, ...containerStyle }}>
      <GlobalStyles
        styles={{
          ".mapboxgl-popup-content": {
            backgroundColor: "transparent!important",
            borderRadius: "0px !important",
            boxShadow: "none!important",
            padding: "0px 0px!important",
            width: "fit-content!important",
          },
          ".mapboxgl-popup-tip": {
            borderTopColor: theme.palette.mode === "dark" ? "#1e1e1e !important" : '#ffffff !important"',
          },
        }}
      />

      <MapboxMap
        initialViewState={{
          latitude: isArray(center) ? center[1] : center.lat,
          longitude: isArray(center) ? center[0] : center.lng,
          zoom,
        }}
        style={{ height: "100%", width: "100%" }}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onClick={(e) => onMapClick?.(e.lngLat.lng, e.lngLat.lat)}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            longitude={m.lng}
            latitude={m.lat}
            anchor="bottom"
            onClick={() => handleMarkerClick(m.id)}
            onMouseEnter={() => handleMarkerHover(m.id)}
            onMouseLeave={() => handleMarkerHover(null)}
          >
            {m.IconComponent ? <m.IconComponent {...m.iconProps} /> : <div>📍</div>}
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.lng}
            latitude={selectedMarker.lat}
            anchor="top"
            onClose={() => setSelected(null)}
            maxWidth={popupMaxWidth}
          >
            {selectedMarker.Tooltip ?? <div>Marker {selectedMarker.id}</div>}
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
