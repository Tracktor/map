import { Box, Typography } from "@tracktor/design-system";
import type { ReactNode } from "react";

interface MapSidebarProps {
  title?: string;
  children: ReactNode;
  width?: number;
}

const MapSidebar = ({ title, children, width = 300 }: MapSidebarProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        borderLeft: "1px solid",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        overflowY: "auto",
        p: 2.5,
        width,
      }}
    >
      {title && (
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default MapSidebar;
