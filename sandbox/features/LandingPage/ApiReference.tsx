import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Paper, Typography } from "@tracktor/design-system";

const propsData = [
  {
    default: "true",
    description: "Automatically adjusts the map's zoom and center to ensure all markers are visible within the viewport.",
    prop: "fitBounds",
    type: "boolean",
  },
  {
    default: "undefined",
    description: "Additional padding (in pixels) around the bounds when using fitBounds.",
    prop: "fitBoundsPadding",
    type: "number",
  },
  {
    default: "[2.3522, 48.8566]",
    description: "Coordinates for the initial center of the map. Format: [longitude, latitude].",
    prop: "center",
    type: "LngLatLike | number[]",
  },
  {
    default: '"mapbox://styles/mapbox/streets-v11"',
    description: "Mapbox style URL or predefined style ID.",
    prop: "mapStyle",
    type: "string",
  },
  {
    default: "5",
    description: "Initial zoom level of the map. A higher number means a closer zoom.",
    prop: "zoom",
    type: "number",
  },
  {
    default: '"300px"',
    description: "Maximum width of popups in pixels or any valid CSS unit.",
    prop: "popupMaxWidth",
    type: "string",
  },
  {
    default: '"100%"',
    description: "Width of the map container.",
    prop: "width",
    type: "number | string",
  },
  {
    default: "300",
    description: "Height of the map container.",
    prop: "height",
    type: "number | string",
  },
  {
    default: "false",
    description: "Displays a skeleton overlay when the map is loading.",
    prop: "loading",
    type: "boolean",
  },
  {
    default: "[]",
    description: "Array of markers to display on the map.",
    prop: "markers",
    type: "MarkerProps[]",
  },
  {
    default: "-",
    description: "ID of the marker whose popup should be open when the map loads.",
    prop: "openPopup",
    type: "number | string",
  },
  {
    default: "false",
    description: "Opens marker popups automatically when hovering over them.",
    prop: "openPopupOnHover",
    type: "boolean",
  },
  {
    default: "-",
    description: "Callback triggered when the map is clicked.",
    prop: "onMapClick",
    type: "(lng: number, lat: number, marker?: MarkerProps | null) => void",
  },
  {
    default: "-",
    description: "One or multiple GeoJSON line or polygon features to display on the map.",
    prop: "features",
    type: "Feature | Feature[] | FeatureCollection",
  },
  {
    default: "-",
    description: "Starting and ending coordinates for route calculation.",
    prop: "from / to",
    type: "[number, number]",
  },
  {
    default: '"driving"',
    description: "Transportation profile used for route calculation.",
    prop: "profile",
    type: '"driving" | "walking" | "cycling"',
  },
  {
    default: '"OSRM"',
    description: "Routing engine to use for path calculations.",
    prop: "engine",
    type: '"OSRM" | "Mapbox"',
  },
  {
    default: "-",
    description: "Parameters for displaying isochrones based on an origin and travel time intervals.",
    prop: "isochrone",
    type: "IsochroneProps",
  },
  {
    default: "-",
    description: "Parameters for finding the nearest marker to a given point.",
    prop: "findNearestMarker",
    type: "FindNearestMarkerParams",
  },
  {
    default: '"light"',
    description: "Color theme of the map UI.",
    prop: "theme",
    type: '"dark" | "light"',
  },
  {
    default: '"mercator"',
    description: "Map projection type to use.",
    prop: "projection",
    type: "ReactMapProjection",
  },
  {
    default: '"street"',
    description: "Base map view mode.",
    prop: "baseMapView",
    type: '"street" | "satellite"',
  },
  {
    default: "true",
    description: "Enables cooperative gestures (two-finger pan on touch devices).",
    prop: "cooperativeGestures",
    type: "boolean",
  },
  {
    default: "true",
    description: "Enables or disables double-click zoom.",
    prop: "doubleClickZoom",
    type: "boolean",
  },
  {
    default: "false",
    description: "Disables map fitBounds animations.",
    prop: "disableAnimation",
    type: "boolean",
  },
  {
    default: "500",
    description: "Duration (in ms) of the fitBounds animation.",
    prop: "fitBoundDuration",
    type: "number",
  },
  {
    default: "-",
    description: "Optional key to re-trigger fitBounds animation when updated.",
    prop: "fitBoundsAnimationKey",
    type: "unknown",
  },
  {
    default: "-",
    description: "Custom styles applied to the map container.",
    prop: "containerStyle",
    type: "SxProps",
  },
];

const ApiReference = () => {
  return (
    <Box sx={{ mb: 12 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        sx={{
          background: "linear-gradient(90deg,#007AFF,#00C6FF)",
          color: "transparent",
          textAlign: "center",
          WebkitBackgroundClip: "text",
        }}
      >
        ⚙️ API Reference
      </Typography>

      <Paper
        sx={{
          backdropFilter: "blur(10px)",
          background: "rgba(20, 20, 25, 0.45)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          boxShadow: "0 4px 25px rgba(0,0,0,0.25)",
          overflow: "hidden",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {propsData.map(({ prop, type, default: def, description }, i) => (
          <Accordion
            key={prop}
            disableGutters
            sx={{
              "&:before": { display: "none" },
              "&:hover": {
                background: "rgba(13,17,23,0.85)",
              },
              background: "rgba(13,17,23,0.6)",
              borderBottom: i !== propsData.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              color: "#e6edf3",
              transition: "all 0.25s ease",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#00C6FF" }} />}
              sx={{
                "& .MuiAccordionSummary-content": { margin: 0 },
                "&:hover": { backgroundColor: "rgba(255,255,255,0.03)" },
                px: 2.5,
                py: 1.5,
              }}
            >
              <Typography
                fontWeight={600}
                sx={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  WebkitBackgroundClip: "text",
                }}
              >
                {prop}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                backgroundColor: "rgba(255,255,255,0.02)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                px: 3,
                py: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(230,230,230,0.9)",
                  lineHeight: 1.5,
                  mb: 1.5,
                }}
              >
                {description}
              </Typography>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1.5 }} />

              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  display: "block",
                  fontFamily: "monospace",
                  mb: 0.5,
                }}
              >
                <b style={{ color: "#00C6FF" }}>Type:</b> {type}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  display: "block",
                  fontFamily: "monospace",
                }}
              >
                <b style={{ color: "#00C6FF" }}>Default:</b> {def}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default ApiReference;
