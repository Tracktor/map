import { Button, Paper, Stack, Tooltip } from "@tracktor/design-system";
import { Link as RouterLink } from "react-router-dom";

const navItems = [
  { icon: "🏡", label: "Home", path: "/" },
  { icon: "📍", label: "Markers", path: "/markers" },
  { icon: "🧭", label: "Route", path: "/route" },
  { icon: "🗺️", label: "Multilines", path: "/multilines" },
];

const Navbar = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "black",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        left: 16,
        p: 0.5,
        position: "fixed",
        top: "15%",
        transform: "translateY(-50%)",
        zIndex: 1000,
      }}
    >
      <Stack direction="column" spacing={0.5} alignItems="center">
        {navItems.map((item) => (
          <Tooltip key={item.path} title={item.label} placement="right">
            <Button
              component={RouterLink}
              to={item.path}
              variant="text"
              size="small"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                },
                fontSize: "1.3rem",
                minWidth: 36,
                px: 1,
              }}
            >
              {item.icon}
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Paper>
  );
};

export default Navbar;
