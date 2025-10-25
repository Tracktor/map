import { Button, Divider, Paper, Stack } from "@tracktor/design-system";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        alignItems: "center",
        backdropFilter: "blur(8px)",
        borderRadius: 1,
        display: "flex",
        gap: 1,
        left: 8,
        position: "fixed",
        top: 16,
        zIndex: 1000,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Button component={RouterLink} to="/" size="small">
          🏠 Markers
        </Button>

        <Divider orientation="vertical" flexItem />
        <Button component={RouterLink} to="/route" variant="text" size="small">
          🧭 Route
        </Button>

        <Divider orientation="vertical" flexItem />

        <Button component={RouterLink} to="/multilines" variant="text" size="small">
          🗺️ Multilines
        </Button>
      </Stack>
    </Paper>
  );
};

export default Navbar;
