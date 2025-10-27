import { Box, GlobalStyles, Skeleton } from "@tracktor/design-system";
import { memo, ReactElement } from "react";
import MapboxMap, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isNumber } from "@tracktor/react-utils";
import { Layer, Source } from "react-map-gl";
import mapboxGlobalStyles from "@/constants/globalStyle";
import FitBounds from "@/Features/Bounds/FitsBounds";
import useMarkerMap from "@/Features/MarkerMap/useMarkerMap.ts";
import DefaultMarker from "@/Features/Markers/DefaultMarkers";
import RenderFeatures from "@/Features/RenderFeature/RenderFeature.tsx";
import isValidMarker from "@/types/isValidMarker.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps";

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
  fitBoundsAnimationKey,
  disableAnimation,
  mapStyle,
  onMapClick,
  baseMapView,
  cooperativeGestures = true,
  doubleClickZoom = true,
  projection,
  theme,
  features,
  from,
  to,
  profile = "driving",
  itineraryLineStyle,
}: MarkerMapProps): ReactElement => {
  const {
    selectedMarker,
    setSelected,
    handleMarkerClick,
    handleMarkerHover,
    handleMapLoad,
    mapRef,
    dblZoom,
    initialCenter,
    coreStyle,
    coopGestures,
    route,
    isMapReady,
  } = useMarkerMap({
    baseMapView,
    center,
    cooperativeGestures,
    doubleClickZoom,
    from,
    mapStyle,
    markers,
    openPopup,
    openPopupOnHover,
    profile,
    projection,
    theme,
    to,
    zoom,
  });

  return (
    <Box data-testid="mapbox-container" sx={{ height, position: "relative", width, ...containerStyle }}>
      <GlobalStyles styles={mapboxGlobalStyles} />

      {loading && (
        <Skeleton
          data-testid="skeleton-loader"
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

      {!loading && (
        <MapboxMap
          key={`${coopGestures}-${dblZoom}-${projection}-${mapStyle}`}
          ref={mapRef}
          onLoad={handleMapLoad}
          cooperativeGestures={coopGestures}
          doubleClickZoom={dblZoom}
          mapStyle={coreStyle}
          projection={projection}
          initialViewState={initialCenter}
          style={{ height: "100%", width: "100%" }}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          onClick={(e) => {
            onMapClick?.(e.lngLat.lng, e.lngLat.lat);
          }}
        >
          {isMapReady &&
            markers.filter(isValidMarker).map((m) => (
              <Marker
                key={m.id}
                longitude={m.lng}
                latitude={m.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  m.id && handleMarkerClick(m.id, Boolean(m.Tooltip));
                }}
              >
                <Box
                  component="div"
                  onMouseEnter={() => {
                    m.id && handleMarkerHover(m.id, Boolean(m.Tooltip));
                  }}
                  onMouseLeave={() => handleMarkerHover(null)}
                  style={{ cursor: m.Tooltip ? "pointer" : "default" }}
                >
                  {m.IconComponent ? <m.IconComponent {...m.iconProps} /> : <DefaultMarker color={m.color} variant={m.variant} />}
                </Box>
              </Marker>
            ))}

          {isMapReady && selectedMarker?.Tooltip && (
            <Popup
              longitude={isNumber(selectedMarker.lng) ? selectedMarker.lng : 0}
              latitude={isNumber(selectedMarker.lat) ? selectedMarker.lat : 0}
              anchor="top"
              onClose={() => setSelected(null)}
              maxWidth={popupMaxWidth}
              closeOnClick={true}
              closeOnMove={false}
            >
              <Box component="div" sx={{ minHeight: 60, minWidth: 240 }}>
                {selectedMarker.Tooltip}
              </Box>
            </Popup>
          )}

          {isMapReady && route && (
            <Source type="geojson" data={route}>
              <Layer
                type="line"
                paint={{
                  "line-color": itineraryLineStyle?.color ?? "#9c3333",
                  "line-opacity": itineraryLineStyle?.opacity ?? 0.8,
                  "line-width": itineraryLineStyle?.width ?? 4,
                }}
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
              />
            </Source>
          )}

          {features && <RenderFeatures features={features} />}

          {fitBounds && (
            <FitBounds
              markers={markers}
              features={features}
              padding={fitBoundsPadding}
              duration={disableAnimation ? 0 : fitBoundDuration}
              animationKey={fitBoundsAnimationKey}
              openPopup={!!openPopup}
            />
          )}
        </MapboxMap>
      )}
    </Box>
  );
};

export default memo(MarkerMap);
