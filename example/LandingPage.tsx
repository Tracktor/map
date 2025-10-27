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
  { def: "false", description: "Automatically adjusts zoom to fit all markers.", name: "fitBounds", type: "boolean" },
  { def: "-", description: "Padding (in px) around the bounds when fitting.", name: "fitBoundsPadding", type: "number" },
  { def: "-", description: "Initial center of the map [lng, lat].", name: "center", type: "LngLatLike | number[]" },
  { def: "streets-v11", description: "Mapbox style URL or ID.", name: "mapStyle", type: "string" },
  { def: "5", description: "Initial zoom level of the map.", name: "zoom", type: "number" },
  { def: "-", description: "Max width of popups.", name: "popupMaxWidth", type: "string" },
  { def: "100%", description: "Map container width.", name: "width", type: "number | string" },
  { def: "300", description: "Map container height.", name: "height", type: "number | string" },
  { def: "false", description: "Show skeleton overlay when true.", name: "loading", type: "boolean" },
  { def: "-", description: "Custom default marker image.", name: "markerImageURL", type: "string" },
  { def: "-", description: "Custom map container styles.", name: "containerStyle", type: "SxProps" },
  { def: "false", description: "Disable fitBounds animation.", name: "disableAnimation", type: "boolean" },
  { def: "-", description: "fitBounds animation duration in ms.", name: "fitBoundDuration", type: "number" },
  { def: "-", description: "Key to re-trigger fitBounds animation.", name: "fitBoundsAnimationKey", type: "unknown" },
  { def: "false", description: "Forces the container to be square.", name: "square", type: "boolean" },
  { def: "-", description: "ID of marker popup to open on load.", name: "openPopup", type: "number | string" },
  { def: "false", description: "Opens popup on marker hover.", name: "openPopupOnHover", type: "boolean" },
  { def: "[]", description: "Array of markers to display.", name: "markers", type: "MarkerProps[]" },
  { def: "-", description: "Callback on map click.", name: "onMapClick", type: "(lng: number, lat: number) => void" },
  { def: `"light"`, description: "UI color theme.", name: "theme", type: `"dark" | "light"` },
  { def: `"mercator"`, description: "Map projection type.", name: "projection", type: "ReactMapProjection" },
  { def: `"street"`, description: "Base map mode.", name: "baseMapView", type: `"satellite" | "street"` },
  { def: "true", description: "Enable cooperative gestures.", name: "cooperativeGestures", type: "boolean" },
  { def: "true", description: "Enable double-click zoom.", name: "doubleClickZoom", type: "boolean" },
  { def: "-", description: "GeoJSON line feature to display.", name: "line", type: "Feature" },
  { def: "-", description: "Starting point for routing.", name: "from", type: "[number, number]" },
  { def: "-", description: "Ending point for routing.", name: "to", type: "[number, number]" },
  { def: `"driving"`, description: "Routing profile.", name: "profile", type: `"driving" | "walking" | "cycling"` },
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
    description: "Render FeatureCollection Polygons, MultiPolygons, Lines, MultiLines and Points on the map.",
    image: FeaturesPreview,
    path: "/features",
    title: "🗺 Features Example",
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
          The component comes with powerful built-in features including:
          <ul style={{ marginTop: 8 }}>
            <li>
              📍 <strong>Customizable markers</strong> with hover and click interactions
            </li>
            <li>
              💬 <strong>Popup management</strong> (click or hover-based)
            </li>
            <li>
              🗺️ <strong>Automatic fit bounds</strong> for multiple markers
            </li>
            <li>
              🚗 <strong>Route drawing</strong> between two points (driving, walking, cycling)
            </li>
            <li>
              🧭 <strong>Line overlays</strong> with custom styling
            </li>
            <li>
              🎨 <strong>Light / Dark themes</strong> and satellite or street base layers
            </li>
            <li>
              🧭 <strong>Projection support</strong> and advanced gesture handling
            </li>
          </ul>
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, opacity: 0.85 }}>
          Whether you're displaying a single marker or an entire network of routes, <code>MarkerMap</code> is built for flexibility, high
          performance, and a clean developer experience.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
          mb: 6,
        }}
      >
        {cardData.map((card) => (
          <Card
            key={card.path}
            sx={{
              "&:hover": { boxShadow: 6 },
              alignItems: "center",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transition: "0.2s",
              width: { md: "30%", sm: "45%", xs: "100%" },
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
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        🚀 Getting Started
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
        Using <code>MarkerMap</code> is simple and intuitive. Start by importing the component and passing a minimal set of props such as{" "}
        <code>center</code>, <code>zoom</code>, and <code>markers</code>. From there, you can progressively enable more advanced features
        like popups, routes, or line overlays depending on your use case.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
        Here's a basic example that displays a marker in Paris with a popup:
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
          👉 You can enhance this example by adding <code>openPopupOnHover</code> for interactivity,
          <code>from</code> and <code>to</code> for route calculation, or even a custom <code>IconComponent</code> for markers.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }} pt={4}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          ⚙️ API Reference
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
          The <code>MarkerMap</code> component is designed to be highly flexible and configurable through a set of well-defined props. Each
          prop controls a specific aspect of the map — from basic display options like <code>center</code> and <code>zoom</code>, to more
          advanced features like <code>fitBounds</code>, <code>projection</code>, and <code>routing</code>.
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          You can use these props individually or in combination to build rich and interactive mapping experiences with minimal setup.
        </Typography>
      </Box>

      <PropsTable />
    </Box>
  );
};

export default LandingPage;
