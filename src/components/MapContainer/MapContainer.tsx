import { Box, Skeleton, SxProps } from "@tracktor/design-system";
import { forwardRef, Ref } from "react";

interface MapBoxProps {
  width?: number | string;
  height?: number | string;
  loading?: boolean;
  containerStyle?: SxProps;
  square?: boolean;
  error?: string | boolean;
}

/**
 * MapContainer is a styled container component for rendering a Mapbox map with loading and layout support.
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
 * <MapContainer
 *   height={400}
 *   width="100%"
 *   loading={isLoading}
 *   square={false}
 *   containerStyle={{ boxShadow: 1 }}
 *   ref={mapRef}
 * />
 * ```
 */
const MapContainer = (
  { containerStyle, square, error, loading = false, height = 300, width = "100%" }: MapBoxProps,
  ref: Ref<HTMLElement>,
) => (
  <Box sx={{ position: "relative" }} height={height}>
    <Box
      sx={{
        alignItems: "center",
        borderRadius: square ? 0 : 1,
        display: "flex",
        justifyContent: "center",
        left: 0,
        position: "absolute",
        top: 0,
        zIndex: 1,
        ...containerStyle,
      }}
      ref={ref}
      width={width}
      height={height}
    >
      {error && <Box textAlign="center">{error}</Box>}
    </Box>

    {loading && (
      <Skeleton
        sx={{
          left: 0,
          position: "absolute",
          top: 0,
          zIndex: 0,
          ...containerStyle,
        }}
        width={width}
        height={height}
        variant={square ? "rectangular" : "rounded"}
      />
    )}
  </Box>
);

export default forwardRef(MapContainer);
