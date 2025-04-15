import React, { ReactNode } from "react";

export interface MarkerProps {
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
   * Function to call when the marker is clicked.
   */
  onClick?: () => void;

  /**
   * Optional type/category of the marker (e.g., 'restaurant', 'user', etc.).
   */
  type?: string;

  /**
   * Optional display name for the marker.
   */
  name?: string;

  /**
   * Optional custom React component to use as the marker icon.
   * Overrides iconImage if provided.
   */
  IconComponent?: React.ComponentType<any>;

  /**
   * Optional props to pass to the IconComponent.
   */
  iconProps?: Record<string, any>;
}
