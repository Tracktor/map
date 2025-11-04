import { SxProps } from "@tracktor/design-system";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import { LngLatLike } from "mapbox-gl";
import type { ProjectionSpecification as ReactMapProjection } from "react-map-gl";
import type { RoutingProfile } from "@/services/core/interface.ts";
import { MarkerProps } from "@/types/MarkerProps";

export interface IsochroneProps {
  origin: [number, number];
  profile?: RoutingProfile;
  intervals?: number[];
  onIsochroneLoaded?: (data: FeatureCollection<Polygon> | null) => void;
}

export interface ItineraryLineStyle {
  color: string;
  width: number;
  opacity: number;
}

export const engines = ["OSRM", "Mapbox"] as const;
export type Engine = (typeof engines)[number];

export const profiles = ["driving", "walking", "cycling"] as const;
export type Profile = (typeof profiles)[number];

export interface NearestResult {
  id: number | string;
  point: [number, number];
  distance: number;
}

export interface FindNearestMarkerParams {
  origin: [number, number];
  destinations: { id: string | number; lat: number; lng: number }[];
  maxDistanceMeters?: number;
  profile?: RoutingProfile;
  onNearestFound?: (all: NearestResult[]) => void;
}

export interface MapViewProps {
  /**
   * Automatically adjusts the map's zoom and center
   * to ensure all markers are visible within the viewport.
   */
  fitBounds?: boolean;

  /**
   * Additional padding (in pixels) around the bounds
   * when using `fitBounds`.
   */
  fitBoundsPadding?: number;

  /**
   * Coordinates for the initial center of the map.
   * Format: [longitude, latitude].
   */
  center?: LngLatLike | number[];

  /**
   * Mapbox style URL or predefined style ID
   * (e.g., "mapbox://styles/mapbox/streets-v11").
   */
  mapStyle?: string;

  /**
   * Initial zoom level of the map.
   * A higher number means a closer zoom.
   */
  zoom?: number;

  /**
   * Maximum width of popups in pixels or any valid CSS unit.
   */
  popupMaxWidth?: string;

  /**
   * Width of the map container.
   * Can be a number (px) or any CSS unit (e.g. "100%").
   */
  width?: number | string;

  /**
   * Height of the map container.
   * Can be a number (px) or any CSS unit (e.g. "100vh").
   */
  height?: number | string;

  /**
   * Indicates whether the map is currently in a loading state.
   * Displays a skeleton overlay when true.
   */
  loading?: boolean;

  /**
   * URL of a custom image used as the default marker icon.
   */
  markerImageURL?: string;

  /**
   * Custom styles applied to the map container.
   * Uses MUI's `SxProps` system.
   */
  containerStyle?: SxProps;

  /**
   * Disables the map's fitBounds animation.
   */
  disableAnimation?: boolean;

  /**
   * Duration (in ms) of the fitBounds animation.
   */
  fitBoundDuration?: number;

  /**
   * Optional key that can be updated to re-trigger the fitBounds animation.
   */
  fitBoundsAnimationKey?: unknown;

  /**
   * Forces the map container to have a square shape.
   */
  square?: boolean;

  /**
   * ID of the marker whose popup should be open when the map loads.
   */
  openPopup?: number | string;

  /**
   * Opens marker popups automatically when hovering over them.
   */
  openPopupOnHover?: boolean;

  /**
   * Array of markers to display on the map.
   */
  markers?: MarkerProps[];

  /**
   * Callback triggered when the map is clicked.
   * Returns the longitude and latitude of the clicked point,
   * and optionally the marker object if the click occurred on one.
   */
  onMapClick?: (lng: number, lat: number, clickedMarker?: MarkerProps | null) => void;

  /**
   * The color theme of the map UI.
   * @default "light"
   */
  theme?: "dark" | "light";

  /**
   * Map projection type to use.
   * @default "mercator"
   */
  projection?: ReactMapProjection;

  /**
   * Base map view mode.
   * @default "street"
   */
  baseMapView?: "satellite" | "street";

  /**
   * Enables or disables cooperative gestures
   * (e.g. requiring two-finger pan on touch devices).
   * @default true
   */
  cooperativeGestures?: boolean;

  /**
   * Enables or disables double-click zoom.
   * @default true
   */
  doubleClickZoom?: boolean;

  /**
   * One or multiple GeoJSON line features to display on the map.
   */
  features?: Feature | Feature[] | FeatureCollection;

  /**
   * Starting point of the route.
   * Format: [longitude, latitude].
   * If both `from` and `to` are provided, a route will be calculated.
   */
  from?: [number, number];

  /**
   * Ending point of the route.
   * Format: [longitude, latitude].
   * If both `from` and `to` are provided, a route will be calculated.
   */
  to?: [number, number];

  /**
   * Transportation profile used for route calculation.
   * @default "driving"
   */
  profile?: Profile;

  /**
   * Custom styles for the itinerary line displayed on the map.
   * If not provided, default styles will be used.
   * @default { color: "#3b82f6", width: 4, opacity: 0.8 }
   */
  itineraryLineStyle?: Partial<ItineraryLineStyle>;

  /**
   * Engine to use for calculating routes.
   * @default "OSRM"
   * Options are:
   * - "OSRM": Uses the public OSRM API for routing.
   * - "Mapbox": Uses the Mapbox Directions API for routing.
   */
  engine?: Engine;

  /**
   * Parameters for finding the nearest marker to a given point.
   * If provided, the map will automatically center and zoom
   * to include the nearest marker within the specified distance.
   */
  findNearestMarker?: FindNearestMarkerParams;

  /**
   * Parameters for displaying isochrones on the map.
   * If provided, isochrones will be rendered based on the specified origin and intervals.
   * @param origin
   * @param profile
   * @param intervals
   * @param onIsochroneLoaded
   */
  isochrone?: IsochroneProps;
}
