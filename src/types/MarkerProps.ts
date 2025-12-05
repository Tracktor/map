import { Theme } from "@tracktor/design-system";
import { ComponentType, ReactNode } from "react";
import { VariantMarker } from "@/components/Markers/Markers.tsx";

export type ThemeColor = string | ((theme: Theme) => string) | `${keyof Theme["palette"]}.${string}`;

export interface MarkerProps<T = Record<string, unknown>> {
  /**
   * Optional unique identifier for the marker.
   */
  id?: number | string;

  /**
   * Longitude coordinate of the marker.
   * Should be a number; using 'unknown' allows flexibility but requires validation.
   */
  lng: number | unknown;

  /**
   * Latitude coordinate of the marker.
   * Should be a number; using 'unknown' allows flexibility but requires validation.
   */
  lat: number | unknown;

  /**
   * Optional tooltip element displayed when hovering or clicking on the marker.
   * Can be a React component or any ReactNode.
   */
  Tooltip?: ReactNode;

  /**
   * URL or name of the icon image to display for the marker.
   * Only used if no IconComponent is provided.
   */
  iconImage?: string;

  /**
   * Optional size (scale) of the marker icon.
   */
  size?: number;

  /**
   * Z-index to control layering of the marker relative to others.
   */
  zIndex?: number;

  /**
   * Pointer events control for the marker.
   */
  pointerEvents?: string;

  /**
   * Function to call when the marker is clicked.
   */
  onClick?: (marker: MarkerProps<T>) => void;

  /**
   * Optional type/category of the marker (e.g., 'restaurant', 'user', etc.).
   */
  type?: string;

  /**
   * Optional display name for the marker.
   */
  name?: string;

  /**
   * Optional props to pass to the IconComponent.
   */
  iconProps?: T;

  /**
   * Optional custom React component to use as the marker icon.
   * Overrides iconImage if provided.
   */
  // biome-ignore lint/suspicious/noExplicitAny: <Icons can receive any props depending on context>
  IconComponent?: ComponentType<any>;

  /**
   * Color theme for the marker.
   */
  color?: ThemeColor;

  /**
   * Predefined variant for the marker styling.
   */
  variant?: string | VariantMarker;
}

/**
 * @deprecated Use MarkerProps instead
 */
export type CustomMarkerMapProps = MarkerProps;
