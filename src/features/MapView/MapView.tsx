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
import { MarkerMapProps } from "@/types/MarkerMapProps";
import getCoreMapOptions, { getBaseMapStyle } from "@/utils/getCoreMapOptions";

/**
 * MapView Component
 * -------------------
 * A full-featured interactive map view built on top of `react-map-gl`.
 *
 * This component serves as the main container for all map-related features,
 * including markers, routes, popups, and geospatial overlays.
 *
 * Key Features:
 * - Renders markers with optional custom icons and tooltips.
 * - Supports hover and click interactions for popups.
 * - Automatically fits bounds to visible markers or GeoJSON features.
 * - Displays routes (`Itinerary`) or nearest routes (`NearestPointItinerary`).
 * - Supports isochrone visualization and GeoJSON feature collections.
 * - Integrates with OSRM or Mapbox routing engines.
 *
 * Map Styles:
 * - Works with both Mapbox styles (`mapbox://styles/...`) and custom raster/vector styles (e.g., OpenStreetMap).
 * - A Mapbox access token is only required if you use Mapbox-hosted styles or sources.
 *
 * Props:
 * - Fully typed via `MarkerMapProps`.
 *
 * Dependencies:
 * - `react-map-gl` and `mapbox-gl` for rendering and interaction.
 * - `@tracktor/design-system` for consistent layout and skeleton UI.
 * - Custom sub-features: `FitBounds`, `Itinerary`, `NearestPointItinerary`, `Isochrone`, and `FeatureCollection`.
 *
 * Maintenance Notes:
 * - Keep map ref logic inside the component (Mapbox events handled via `onLoad`).
 * - For large datasets, consider memoizing marker rendering.
 * - For dynamic data (e.g., GPS tracking), you can debounce `fitBounds`
 *   or control re-renders using the `fitBoundsAnimationKey` prop.
 */
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
  onNearestFound,
  isochrone,
}: MarkerMapProps): ReactElement => {
  const theme = useTheme();
  const mapRef = useRef<MapRef | null>(null);
  const [selected, setSelected] = useState<string | number | null>(openPopup ?? null);

  // Initial map center and zoom setup
  const initialCenter = useMemo(() => {
    if (isArray(center)) {
      return { latitude: center[1], longitude: center[0], zoom };
    }
  }, [center, zoom]);

  // Determine map style (base map + theme)
  const mapStyle = useMemo(
    () => baseMapStyle || getBaseMapStyle(baseMapView, themeOverride ?? theme.palette.mode),
    [baseMapView, baseMapStyle, themeOverride, theme.palette.mode],
  );

  // Compute full core map options (gesture, zoom, style, etc.)
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

  // Handle marker click → opens popup (if click mode active)
  const handleMarkerClick = (id: string | number, hasTooltip: boolean) => {
    if (!openPopupOnHover && hasTooltip) {
      setSelected(id);
    }
  };

  // Handle hover interactions (if hover mode active)
  const handleMarkerHover = (id: string | number | null, hasTooltip?: boolean) => {
    if (openPopupOnHover) {
      setSelected(hasTooltip ? id : null);
    }
  };

  // Update selected marker when openPopup prop changes
  useEffect(() => {
    setSelected(openPopup ?? null);
  }, [openPopup]);

  const selectedMarker = useMemo(() => (selected ? (markers?.find((m) => m.id === selected) ?? null) : null), [selected, markers]);

  return (
    <Box data-testid="mapbox-container" sx={{ height, position: "relative", width, ...containerStyle }}>
      <GlobalStyles styles={mapboxGlobalStyles} />

      {/* Skeleton loader during initialization */}
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
          key={`${coopGestures}-${dblZoom}-${projection}-${mapStyle}-${findNearestMarker?.maxDistanceMeters}`}
          ref={mapRef}
          cooperativeGestures={coopGestures}
          doubleClickZoom={dblZoom}
          mapStyle={coreStyle}
          projection={projection}
          initialViewState={initialCenter}
          style={{ height: "100%", width: "100%" }}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          onClick={(e) => {
            const clickedMarker = markers.find((m) => {
              const { lng, lat } = e.lngLat;
              const dx = Math.abs(Number(m.lng || null) - lng);
              const dy = Math.abs(Number(m.lat || null) - lat);
              return dx < 0.01 && dy < 0.01;
            });

            onMapClick?.(e.lngLat.lng, e.lngLat.lat, clickedMarker ?? null);
          }}
        >
          {/* Markers */}
          {markers.filter(isValidMarker).map((m) => (
            <Marker
              key={m.id}
              longitude={m.lng}
              latitude={m.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                m.id && handleMarkerClick(m.id, Boolean(m.Tooltip));

                // 🔵 On transmet aussi via onMapClick le marker cliqué
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
          {/* Popup for selected marker */}
          {selectedMarker?.Tooltip && (
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
          {/* Route between two points */}
          <Itinerary from={from} to={to} profile={profile} engine={engine} itineraryLineStyle={itineraryLineStyle} />

          {/* Nearest route (from origin to the closest destination) */}
          {findNearestMarker && (
            <NearestPointItinerary
              origin={findNearestMarker?.origin}
              destinations={findNearestMarker?.destinations}
              onNearestFound={onNearestFound}
              maxDistanceMeters={findNearestMarker?.maxDistanceMeters}
              engine={engine}
              profile={profile}
            />
          )}

          {/* Isochrone rendering */}
          {isochrone && (
            <Isochrone
              origin={isochrone.origin}
              profile={isochrone.profile}
              onIsochroneLoaded={isochrone.onIsochroneLoaded}
              intervals={isochrone.intervals}
            />
          )}

          {/* Render custom GeoJSON features */}
          {features && <FeatureCollection features={features} />}
          {/* Auto-fit bounds to all visible map objects */}
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
