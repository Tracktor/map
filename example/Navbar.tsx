import { Button, Divider, Paper, Stack } from "@tracktor/design-system";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        alignItems: "center",
        backdropFilter: "blur(8px)",
        borderRadius: 4,
        display: "flex",
        gap: 1,
        left: 16,
        position: "fixed",
        px: 2,
        py: 1,
        top: 16,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Button component={RouterLink} to="/" variant="text" color="primary" size="small">
          🏠 Markers
        </Button>

        <Divider orientation="vertical" flexItem />
        <Button component={RouterLink} to="/route" variant="text" color="primary" size="small">
          🧭 Route
        </Button>

        <Divider orientation="vertical" flexItem />

        <Button component={RouterLink} to="/multilines" variant="text" color="primary" size="small">
          🗺️ Multilines
        </Button>
      </Stack>
    </Paper>
  );
};

export default Navbar;
