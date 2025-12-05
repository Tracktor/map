import { Box } from "@tracktor/design-system";

interface EmptyStateProps {
  width?: string | number;
  height?: string | number;
}

const EmptyState = ({ width, height }: EmptyStateProps) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "grey.100",
        display: "flex",
        height,
        justifyContent: "center",
        p: 2,
        textAlign: "center",
        width,
      }}
    >
      <span>
        🚫 <strong>Cannot display the map</strong>
        <br />
        Try to activate WebGL in your browser settings.
      </span>
    </Box>
  );
};

export default EmptyState;
