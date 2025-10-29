import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@tracktor/design-system";
import FeaturesPreview from "example/public/assets/features-preview.png";
import MarkerPreview from "example/public/assets/markers-preview.png";
import NearestPreview from "example/public/assets/nearest-preview.png";
import RoutePreview from "example/public/assets/route-preview.png";
import type { PrismTheme } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";
import { useNavigate } from "react-router-dom";

const dracula: PrismTheme = {
  plain: {
    backgroundColor: "#282a36",
    color: "#f8f8f2",
  },
  styles: [],
};

const propsData = [
  {
    def: "false",
    description: "Automatically adjusts the map's zoom and center so all markers and features fit within the visible area.",
    name: "fitBounds",
    type: "boolean",
  },
  {
    def: "-",
    description: "Extra padding (in pixels) around the edges when `fitBounds` is applied.",
    name: "fitBoundsPadding",
    type: "number",
  },
  {
    def: "-",
    description: "Initial map center coordinates. Format: `[longitude, latitude]`.",
    name: "center",
    type: "LngLatLike | number[]",
  },
  {
    def: `"streets-v11"`,
    description: "Mapbox style URL or ID (e.g. `mapbox://styles/mapbox/streets-v11`). Controls the visual appearance of the map.",
    name: "mapStyle",
    type: "string",
  },
  {
    def: "5",
    description: "Initial zoom level. A higher number provides a closer view.",
    name: "zoom",
    type: "number",
  },
  {
    def: "-",
    description: "Maximum width of marker popups (in pixels or any CSS unit).",
    name: "popupMaxWidth",
    type: "string",
  },
  {
    def: `"100%"`,
    description: "Width of the map container. Accepts px, %, or other CSS units.",
    name: "width",
    type: "number | string",
  },
  {
    def: `"300"`,
    description: "Height of the map container. Accepts px, %, or other CSS units.",
    name: "height",
    type: "number | string",
  },
  {
    def: "false",
    description: "Displays a skeleton overlay when true, typically used while loading data or routes.",
    name: "loading",
    type: "boolean",
  },
  {
    def: "-",
    description: "Custom image URL for the default marker icon.",
    name: "markerImageURL",
    type: "string",
  },
  {
    def: "-",
    description: "Custom styling applied to the map container using MUI's `SxProps` system.",
    name: "containerStyle",
    type: "SxProps",
  },
  {
    def: "false",
    description: "Disables map animations such as `fitBounds` transitions.",
    name: "disableAnimation",
    type: "boolean",
  },
  {
    def: "-",
    description: "Duration of the `fitBounds` animation in milliseconds.",
    name: "fitBoundDuration",
    type: "number",
  },
  {
    def: "-",
    description: "Unique key that forces the map to re-run the `fitBounds` animation when changed.",
    name: "fitBoundsAnimationKey",
    type: "unknown",
  },
  {
    def: "false",
    description: "Forces the map container to be square by matching width and height.",
    name: "square",
    type: "boolean",
  },
  {
    def: "-",
    description: "Opens a specific marker popup on initial load, based on its ID.",
    name: "openPopup",
    type: "number | string",
  },
  {
    def: "false",
    description: "Automatically opens popups when hovering over markers.",
    name: "openPopupOnHover",
    type: "boolean",
  },
  {
    def: "[]",
    description: "Array of markers to render on the map. Each marker supports custom icons, popups, and events.",
    name: "markers",
    type: "MarkerProps[]",
  },
  {
    def: "-",
    description: "Callback fired when the map is clicked. Returns longitude and latitude of the click.",
    name: "onMapClick",
    type: "(lng: number, lat: number) => void",
  },
  {
    def: `"light"`,
    description: "Defines the color theme of the map interface.",
    name: "theme",
    type: `"dark" | "light"`,
  },
  {
    def: `"mercator"`,
    description: "Defines the map projection type, e.g. Mercator or Globe.",
    name: "projection",
    type: "ReactMapProjection",
  },
  {
    def: `"street"`,
    description: "Base layer mode: street (default) or satellite imagery.",
    name: "baseMapView",
    type: `"satellite" | "street"`,
  },
  {
    def: "true",
    description: "Enables cooperative gestures, requiring two-finger panning on touch devices to prevent accidental scrolls.",
    name: "cooperativeGestures",
    type: "boolean",
  },
  {
    def: "true",
    description: "Toggles the ability to zoom in/out with double-click.",
    name: "doubleClickZoom",
    type: "boolean",
  },
  {
    def: "-",
    description: "Displays one or multiple GeoJSON features (e.g., lines, polygons, points) on the map.",
    name: "features",
    type: "Feature | Feature[] | FeatureCollection",
  },
  {
    def: "-",
    description: "Starting point for route calculation `[longitude, latitude]`. Used with `to`.",
    name: "from",
    type: "[number, number]",
  },
  {
    def: "-",
    description: "Destination point for route calculation `[longitude, latitude]`. Used with `from`.",
    name: "to",
    type: "[number, number]",
  },
  {
    def: `"driving"`,
    description: "Transportation mode for routing (driving, walking, or cycling).",
    name: "profile",
    type: `"driving" | "walking" | "cycling"`,
  },
  {
    def: `{ color: "#3b82f6", width: 4, opacity: 0.8 }`,
    description: "Defines the line color, width, and opacity for the route displayed on the map.",
    name: "itineraryLineStyle",
    type: "Partial<ItineraryLineStyle>",
  },
  {
    def: `"OSRM"`,
    description: "Specifies the engine service to use (`OSRM` for open source, or `Mapbox` for premium routes).",
    name: "Engine",
    type: `"OSRM" | "Mapbox"`,
  },
  {
    def: "-",
    description: "Parameters for detecting the closest marker to a given origin. Automatically centers and zooms on it.",
    name: "findNearestMarker",
    type: "FindNearestMarkerParams",
  },
  {
    def: "-",
    description: "Callback fired when the nearest marker is found. Provides its ID, coordinates, and distance (in meters).",
    name: "onNearestFound",
    type: "(id, coords, distanceMeters) => void",
  },
];

const cardData = [
  {
    description: "Display custom markers with popups and clustering.",
    image: MarkerPreview,
    path: "/markers",
    title: "📍 Markers Example",
  },
  {
    description: "Calculate and display routes between two points.",
    image: RoutePreview,
    path: "/route",
    title: "🚗 Route Example",
  },
  {
    description: "Render FeatureCollection Polygons, MultiPolygons, Lines, and Points on the map.",
    image: FeaturesPreview,
    path: "/features",
    title: "🗺 Features Example",
  },
  {
    description: "Find and highlight the nearest marker from a given origin point.",
    image: NearestPreview,
    path: "/nearest-marker",
    title: "📌 Nearest Marker Example",
  },
];

const PropsTable = () => (
  <Paper sx={{ mb: 4, p: 3 }}>
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
      ⚙️ Main Props
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Prop</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Default</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {propsData.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <code>{prop.name}</code>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {prop.type}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {prop.def}
                </Typography>
              </TableCell>
              <TableCell>{prop.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}>
        @tracktor/map
      </Typography>

      <Box sx={{ maxWidth: 800, mb: 5, mx: "auto", textAlign: "justify" }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          🧭 About this project
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          This project is a <strong>lightweight and performant React component library</strong> built on top of <strong>Mapbox GL</strong>.
          It provides an intuitive <code>MarkerMap</code> component designed to simplify interactive map integrations in modern
          applications.
        </Typography>

        <Typography component="div" variant="body1" sx={{ mt: 2, opacity: 0.85 }}>
          The component includes:
          <ul style={{ marginTop: 8 }}>
            <li>📍 Customizable markers with hover and click interactions</li>
            <li>💬 Popup management (click or hover-based)</li>
            <li>🗺️ Automatic fit bounds for multiple markers</li>
            <li>🚗 Route drawing between two points (driving, walking, cycling)</li>
            <li>🧭 Line overlays with custom styling</li>
            <li>🎨 Light/Dark themes and satellite or street base layers</li>
            <li>🪄 Projection support and advanced gesture handling</li>
          </ul>
        </Typography>
      </Box>

      <Box
        sx={{
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 4,
          },
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          px: 1,
          scrollSnapType: "x mandatory",
        }}
      >
        {cardData.map((card) => (
          <Card
            key={card.path}
            sx={{
              "&:hover": { transform: "scale(1.03)" },
              cursor: "pointer",
              display: "flex",
              flex: "0 0 300px",
              flexDirection: "column",
              scrollSnapAlign: "center",
              transition: "transform 0.2s",
            }}
            onClick={() => navigate(card.path)}
          >
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                height: 180,
                objectFit: "cover",
                width: "100%",
              }}
            />
            <CardContent
              sx={{
                textAlign: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, mt: 4 }}>
        🚀 Getting Started
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
        Using <code>MarkerMap</code> is simple and intuitive. Start by importing it and passing a few props such as <code>center</code>,{" "}
        <code>zoom</code>, and <code>markers</code>. Then, progressively enable more advanced features like popups, routes, or GeoJSON
        overlays.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Highlight
          code={`import { MarkerMap } from "@tracktor/map-components";

export default function App() {
  return (
    <MarkerMap
      center={[2.3522, 48.8566]}
      zoom={10}
      markers={[
        {
          id: "paris-marker",
          lat: 48.8566,
          lng: 2.3522,
          Tooltip: <div>📍 Hello from Paris!</div>,
        },
      ]}
      fitBounds
    />
  );
}`}
          language="typescript"
          theme={dracula}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={className}
              style={{
                ...style,
                borderRadius: "8px",
                overflowX: "auto",
                padding: "16px",
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        <Typography variant="body1" sx={{ mt: 2, opacity: 0.85 }}>
          👉 You can enhance this example by enabling <code>openPopupOnHover</code>, adding routes via <code>from</code> and <code>to</code>
          , or customizing markers with your own <code>IconComponent</code>.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }} pt={4}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          ⚙️ API Reference
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
          The <code>MarkerMap</code> component is highly flexible, supporting advanced configuration for visuals, gestures, routing, and
          data visualization — all while keeping a clean, declarative API.
        </Typography>
      </Box>

      <PropsTable />
    </Box>
  );
};

export default LandingPage;
