import { GlobalStyles } from "@tracktor/design-system";
import MapBox from "@/components/MapBox/MapBox";
import useMarkerMap from "@/components/MarkerMap/useMarkerMap";
import { MarkerMapProps } from "@/types/MarkerMap.tsx";

/**
 * MarkerMap is a reusable React component that displays an interactive Mapbox map
 * with customizable markers and behavior.
 *
 * It supports features like:
 * - Auto-fitting bounds to markers
 * - Custom marker icons and tooltips
 * - Light/dark theming
 * - Fly animations and zooming
 * - Popup display (on click or hover)
 * - Custom styling for the map container
 * - Manual or automatic control of map centering and zoom
 *
 * @param {object} props - Props used to configure the map rendering.
 * @param {boolean} [props.fitBounds] - If true, automatically adjusts the viewport to fit all markers.
 * @param {number} [props.fitBoundsPadding] - Padding in pixels when fitting bounds to markers.
 * @param {LngLatLike | number[]} [props.center] - Initial center of the map [lng, lat].
 * @param {string} [props.mapStyle] - Mapbox style URL or identifier (e.g. "mapbox://styles/mapbox/streets-v11").
 * @param {number} [props.zoom] - Initial zoom level of the map.
 * @param {number} [props.zoomFlyFrom] - Zoom level to use before initiating a flyTo animation.
 * @param {string} [props.popupMaxWidth] - Maximum width of popups (e.g., "200px").
 * @param {number | string} [props.width="100%"] - Width of the map container.
 * @param {number | string} [props.height=300] - Height of the map container.
 * @param {boolean} [props.loading] - Optional flag indicating if the map is in loading state.
 * @param {string} [props.markerImageURL] - URL of a custom image used for default marker icons.
 * @param {SxProps} [props.containerStyle] - Style object (MUI `sx`) to customize the map container.
 * @param {boolean} [props.disableFlyTo] - If true, disables flyTo animation when focusing on a marker.
 * @param {number} [props.flyToDuration] - Duration of fly animation in milliseconds.
 * @param {number} [props.fitBoundDuration] - Duration of fitBounds animation in milliseconds.
 * @param {boolean} [props.square] - If true, forces the map container to be a square.
 * @param {number | string} [props.openPopup] - ID of the marker whose popup should be open by default.
 * @param {boolean} [props.openPopupOnHover] - If true, opens the popup on marker hover instead of click.
 * @param {MarkerProps[]} [props.markers] - Array of marker objects to render on the map.
 * @param {(lng: number, lat: number) => void} [props.onMapClick] - Callback triggered when the map is clicked.
 * @param {"light" | "dark" | ThemeOptions} [props.theme] - Optional theme override for map rendering.
 *
 * @returns {JSX.Element} The rendered map component with optional markers and behavior.
 *
 * @example
 * ```tsx
 * <MarkerMap
 *   center={[2.3488, 48.8534]}
 *   zoom={13}
 *   fitBounds
 *   markers={[
 *     { id: 1, lat: 48.8534, lng: 2.3488, name: "Marker 1" },
 *     { id: 2, lat: 48.8566, lng: 2.3522, name: "Marker 2" },
 *   ]}
 *   openPopupOnHover
 *   popupMaxWidth="250px"
 *   mapStyle="mapbox://styles/mapbox/light-v10"
 *   theme="light"
 * />
 * ```
 */
const MarkerMap = ({ containerStyle, square, theme, height = 300, width = "100%", ...props }: MarkerMapProps) => {
  const { loading, mapContainer } = useMarkerMap(props);

  return (
    <>
      <GlobalStyles
        styles={{
          ".mapboxgl-popup-content": {
            backgroundColor: "transparent!important",
            borderRadius: "0px !important",
            boxShadow: "none!important",
            padding: "0px 0px!important",
            width: "fit-content!important",
          },
        }}
      />
      <MapBox ref={mapContainer} loading={loading} height={height} width={width} containerStyle={containerStyle} square={square} />
    </>
  );
};

export default MarkerMap;
