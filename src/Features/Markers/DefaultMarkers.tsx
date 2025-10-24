import { Box, useTheme } from "@tracktor/design-system";

const DefaultMarker = ({ color = "#1976d2" }) => {
  const { palette } = useTheme();

  const centerColor = palette.mode === "dark" ? "#000000" : "#ffffff";

  return (
    <Box
      component="div"
      style={{
        backgroundColor: centerColor,
        border: `7px solid ${color}`,
        borderRadius: "50%",
        boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        height: 28,
        width: 28,
      }}
    />
  );
};

export default DefaultMarker;
