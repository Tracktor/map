import HomeIcon from "@mui/icons-material/Home";
import { Avatar, Card, CardContent, Chip, Paper, Stack, Typography } from "@tracktor/design-system";
import { MarkerProps } from "@/types/MarkerProps.ts";

export const TooltipExample = ({ name }: { name: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">Hello world</Typography>
      <Typography variant="body2">I m a tooltip {name}</Typography>
    </CardContent>
  </Card>
);

export const ReactMarkerExample = ({ name }: { name: string }) => (
  <Paper elevation={2} sx={{ borderRadius: 5, p: 1 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar size="small">
        <HomeIcon fontSize="small" />
      </Avatar>
      <Typography variant="h6" pr={0.5}>
        {name}
      </Typography>
      <Chip label="React marker" size="xSmall" variant="outlined-rounded" color="info" />
    </Stack>
  </Paper>
);

const randomOffset = () => (Math.random() - 0.5) * 0.01;

export const lotOfMarkers: MarkerProps[] = Array.from({ length: 150 }, (_, i) => {
  const id = `${i + 1}`;
  const baseLat = 48.844039;
  const baseLng = 2.489326;
  const lat = baseLat + randomOffset();
  const lng = baseLng + randomOffset();
  const isWorksite = i % 2 === 0;

  return {
    id,
    lat,
    lng,
    name: `marker ${String.fromCharCode(65 + (i % 26))}${i}`,
    onClick: (element) => {
      console.log(`Marker ${id} clicked`, element);
    },
    ...(isWorksite
      ? {
          Tooltip: <TooltipExample name={`tooltip-${i}`} />,
          type: "worksite",
        }
      : {
          IconComponent: ReactMarkerExample,
          iconProps: { name: `icon-${i}` },
          type: "agency",
        }),
  };
});
