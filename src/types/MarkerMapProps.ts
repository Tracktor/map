import { SxProps, ThemeOptions } from "@tracktor/design-system";
import { LngLatLike, MapboxOptions } from "mapbox-gl";
import { MarkerProps } from "@/types/MarkerProps.ts";

export interface MarkerMapProps {
  /**
   * Determines if the map should automatically adjust its zoom to include all markers.
   */
  fitBounds?: boolean;

  /**
   * Padding in pixels to add around bounds when using fitBounds.
   */
  fitBoundsPadding?: number;

  /**
   * Coordinates for the center of the map (longitude, latitude).
   */
  center?: LngLatLike | number[];

  /**
   * Map style to use (URL or style identifier).
   */
  mapStyle?: string;

  /**
   * Initial zoom level of the map.
   */
  zoom?: number;

  /**
   * Zoom level to use during fly animations.
   */
  zoomFlyFrom?: number;

  /**
   * Maximum width of popups in pixels or other CSS unit.
   */
  popupMaxWidth?: string;

  /**
   * Width of the map container.
   */
  width?: number | string;

  /**
   * Height of the map container.
   */
  height?: number | string;

  /**
   * Indicates if the map is currently loading.
   */
  loading?: boolean;

  /**
   * URL of the image to use for markers.
   */
  markerImageURL?: string;

  /**
   * Style to apply to the map container (uses MUI's SxProps system).
   */
  containerStyle?: SxProps;

  /**
   * Disables the animation when flying to a point.
   */
  disableFlyTo?: boolean;

  /**
   * Duration of the fly animation in milliseconds.
   */
  flyToDuration?: number;

  /**
   * Duration of the fit bounds animation in milliseconds.
   */
  fitBoundDuration?: number;

  /**
   * Forces the map container to be square.
   */
  square?: boolean;

  /**
   * ID of the marker whose popup should be open by default.
   */
  openPopup?: number | string;

  /**
   * Automatically opens popups when hovering over markers.
   */
  openPopupOnHover?: boolean;

  /**
   * Array of markers to display on the map.
   */
  markers?: MarkerProps[];

  /**
   * Function called when clicking on the map, with coordinates of the clicked point.
   */
  onMapClick?: (lng: number, lat: number) => void;

  /**
   * The theme of Map. If not set, it will use the theme of the parent ThemeProvider.
   */
  theme?: "dark" | "light" | ThemeOptions;
  /**
   * A style's projection property sets which projection a map is rendered in.
   */
  projection?: MapboxOptions["projection"];
}
