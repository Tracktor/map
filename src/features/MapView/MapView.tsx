import { Box, GlobalStyles, Skeleton, useTheme } from "@tracktor/design-system";
import { memo, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import MapboxMap, { MapRef, Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { isArray, isNumber } from "@tracktor/react-utils";
import FeatureCollection from "@/components/FeatureCollection/FeatureCollection";
import Markers from "@/components/Markers/Markers";
import mapboxGlobalStyles from "@/constants/globalStyle";
import FitBounds from "@/features/Bounds/FitsBounds";
import Isochrone from "@/features/Isochrone/Isochrone.tsx";
import Itinerary from "@/features/Itinerary/Itinerary";
import NearestPointItinerary from "@/features/NearestPointItinerary/NearestPointItinary";
import isValidMarker from "@/types/isValidMarker.ts";
import { MapViewProps } from "@/types/MapViewProps.ts";
import getCoreMapOptions, { getBaseMapStyle } from "@/utils/getCoreMapOptions";

const MapView = ({
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
  mapStyle: baseMapStyle,
  onMapClick,
  baseMapView,
  cooperativeGestures = true,
  doubleClickZoom = true,
  projection,
  theme: themeOverride,
  features,
  from,
  to,
  profile = "driving",
  itineraryLineStyle,
  engine = "OSRM",
  findNearestMarker,
  isochrone,
}: MapViewProps): ReactElement => {
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [selected, setSelected] = useState<string | number | null>(openPopup ?? null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initialCenter = useMemo(() => {
    const [lng = 2.3522, lat = 48.8566] = isArray(center) ? center : [];
    return { latitude: lat, longitude: lng, zoom };
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

  useEffect(() => {
    setSelected(openPopup ?? null);
  }, [openPopup]);

  const selectedMarker = useMemo(() => (selected ? (markers?.find((m) => m.id === selected) ?? null) : null), [selected, markers]);

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
          ref={mapRef}
          cooperativeGestures={coopGestures}
          doubleClickZoom={dblZoom}
          mapStyle={coreStyle}
          projection={projection}
          onLoad={() => {
            setMapLoaded(true);
            mapRef.current?.resize();
          }}
          initialViewState={initialCenter}
          style={{ height: "100%", width: "100%" }}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          onClick={(e) => {
            const clickedMarker = markers.find((m) => {
              const { lng, lat } = e.lngLat;
              const dx = Math.abs(Number(m.lng ?? 0) - lng);
              const dy = Math.abs(Number(m.lat ?? 0) - lat);
              return dx < 0.01 && dy < 0.01;
            });

            onMapClick?.(e.lngLat.lng, e.lngLat.lat, clickedMarker ?? null);
          }}
        >
          {/* Markers - only rendered after map fully initialized */}
          {mapLoaded &&
            markers.filter(isValidMarker).map((m) => (
              <Marker
                key={m.id}
                longitude={m.lng}
                latitude={m.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  m.id && handleMarkerClick(m.id, Boolean(m.Tooltip));
                  onMapClick?.(m.lng, m.lat, m);
                }}
              >
                <Box
                  component="div"
                  onMouseEnter={() => m.id && handleMarkerHover(m.id, Boolean(m.Tooltip))}
                  onMouseLeave={() => handleMarkerHover(null)}
                  style={{ cursor: m.Tooltip ? "pointer" : "default" }}
                >
                  {m.IconComponent ? <m.IconComponent {...m.iconProps} /> : <Markers color={m.color} variant={m.variant} />}
                </Box>
              </Marker>
            ))}

          {/* Popup */}
          {mapLoaded && selectedMarker?.Tooltip && (
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

          <Itinerary from={from} to={to} profile={profile} engine={engine} itineraryLineStyle={itineraryLineStyle} />

          {findNearestMarker && (
            <NearestPointItinerary
              origin={findNearestMarker.origin}
              destinations={findNearestMarker.destinations}
              onNearestFound={findNearestMarker.onNearestFound}
              maxDistanceMeters={findNearestMarker.maxDistanceMeters}
              engine={engine}
              profile={profile}
            />
          )}

          {isochrone && (
            <Isochrone
              origin={isochrone.origin}
              profile={isochrone.profile}
              onIsochroneLoaded={isochrone.onIsochroneLoaded}
              intervals={isochrone.intervals}
            />
          )}

          {features && <FeatureCollection features={features} />}

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

export default memo(MapView);
