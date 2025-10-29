import { Box, useTheme } from "@tracktor/design-system";
import { isString } from "@tracktor/react-utils";

const BLACK = "#000000";
const WHITE = "#FFFFFF";

export const variantMarkerColor = {
  default: "#009ba6",
  primary: "#3F83F8",
  secondary: "#9C27B0",
  success: "#4CAF50",
  warning: "#FF9800",
} as const;

export type VariantMarker = keyof typeof variantMarkerColor;

interface MarkerProps {
  variant?: string | keyof typeof variantMarkerColor;
  color?: string;
}

const isPredefinedVariant = (v: string): v is VariantMarker => v in variantMarkerColor;

const Markers = ({ color, variant }: MarkerProps) => {
  const { palette } = useTheme();
  const centerColor = palette.mode === "dark" ? BLACK : WHITE;

  const markerColor =
    (variant && isPredefinedVariant(variant) && variantMarkerColor[variant]) ||
    color ||
    (isString(variant) ? variant : variantMarkerColor.default);

  return (
    <Box
      component="div"
      style={{
        backgroundColor: centerColor,
        border: `7px solid ${markerColor}`,
        borderRadius: "50%",
        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        height: 28,
        width: 28,
      }}
    />
  );
};

export default Markers;
