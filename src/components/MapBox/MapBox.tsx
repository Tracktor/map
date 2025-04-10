import { Box, Skeleton, SxProps } from "@tracktor/design-system";
import { forwardRef, Ref } from "react";

interface MapBoxProps {
  width?: number | string;
  height?: number | string;
  loading?: boolean;
  containerStyle?: SxProps;
  square?: boolean;
}

/**
 * MapBox is a styled container component for rendering a Mapbox map with loading and layout support.
 *
 * It provides a flexible layout with customizable size, border radius (for square or rounded containers),
 * and an optional loading skeleton while the map is initializing.
 *
 * @param props - Controls the layout and appearance of the map container.
 * @param ref - React ref forwarded to the container DOM element.
 *
 * @returns A layout wrapper for a Mapbox map with optional skeleton loading.
 *
 * @example
 * ```tsx
 * <MapBox
 *   height={400}
 *   width="100%"
 *   loading={isLoading}
 *   square={false}
 *   containerStyle={{ boxShadow: 1 }}
 *   ref={mapRef}
 * />
 * ```
 */
const MapBox = ({ containerStyle, square, loading = false, height = 300, width = "100%" }: MapBoxProps, ref: Ref<HTMLElement>) => (
  <Box sx={{ position: "relative" }} height={height}>
    <Box
      sx={{
        borderRadius: square ? 0 : 1,
        left: 0,
        position: "absolute",
        top: 0,
        zIndex: 1,
        ...containerStyle,
      }}
      ref={ref}
      width={width}
      height={height}
    />
    {loading && (
      <Skeleton
        sx={{
          left: 0,
          position: "absolute",
          top: 0,
          zIndex: 0,
        }}
        width={width}
        height={height}
        variant={square ? "rectangular" : "rounded"}
      />
    )}
  </Box>
);

export default forwardRef(MapBox);
