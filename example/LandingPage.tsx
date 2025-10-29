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
import IsochronePreview from "example/public/assets/isochrone-preview.png";
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
    def: "-",
    description:
      "Displays travel-time polygons (isochrones) from a given origin using the Mapbox Isochrone API. Useful for accessibility and reachability analyses.",
    name: "isochrone",
    type: "IsochroneConfig",
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
  {
    description: "Generate and display isochrone polygons showing areas reachable within specific travel times.",
    image: IsochronePreview,
    path: "/isochrone",
    title: "🕒 Isochrone Example",
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
            <li>🕒 Isochrone generation using the Mapbox Isochrone API</li>
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
      // 🕒 Example: Add isochrone display
      isochrone={{
        origin: [2.3522, 48.8566],
        profile: "driving",
        intervals: [5, 10, 15],
      }}
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
          , or using <code>isochrone</code> to visualize reachable areas.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }} pt={4}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          ⚙️ API Reference
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, opacity: 0.85 }}>
          The <code>MarkerMap</code> component is highly flexible, supporting advanced configuration for visuals, gestures, routing,
          isochrone analysis, and data visualization — all while keeping a clean, declarative API.
        </Typography>
      </Box>

      <PropsTable />
    </Box>
  );
};

export default LandingPage;
