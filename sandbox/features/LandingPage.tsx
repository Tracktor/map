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
import type { PrismTheme } from "prism-react-renderer";
import { Highlight } from "prism-react-renderer";
import { useNavigate } from "react-router-dom";
import FeaturesPreview from "sandbox/public/assets/features-preview.png";
import IsochronePreview from "sandbox/public/assets/isochrone-preview.png";
import MarkerPreview from "sandbox/public/assets/markers-preview.png";
import NearestPreview from "sandbox/public/assets/nearest-preview.png";
import RoutePreview from "sandbox/public/assets/route-preview.png";

const dracula: PrismTheme = {
  plain: { backgroundColor: "#0d1117", color: "#e6edf3" },
  styles: [],
};

const PropsTable = () => (
  <Paper
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 4,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      p: 4,
    }}
  >
    <Typography variant="h5" fontWeight={600} mb={3}>
      ⚙️ Props Overview
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {["Prop", "Type", "Default", "Description"].map((col) => (
              <TableCell key={col} sx={{ fontWeight: 600, opacity: 0.8 }}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <code>isochrone</code>
            </TableCell>
            <TableCell sx={{ fontFamily: "monospace", opacity: 0.85 }}>IsochroneConfig</TableCell>
            <TableCell sx={{ fontFamily: "monospace", opacity: 0.5 }}>-</TableCell>
            <TableCell sx={{ opacity: 0.8 }}>Displays reachability polygons based on travel times.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

const cardData = [
  { desc: "Customizable markers with tooltips.", image: MarkerPreview, path: "/markers", title: "📍 Markers" },
  { desc: "Compute and display routes easily.", image: RoutePreview, path: "/route", title: "🚗 Route" },
  { desc: "Render GeoJSON layers elegantly.", image: FeaturesPreview, path: "/features", title: "🗺 Features" },
  { desc: "Find the closest marker dynamically.", image: NearestPreview, path: "/nearest-marker", title: "📌 Nearest Marker" },
  { desc: "Display travel-time areas visually.", image: IsochronePreview, path: "/isochrone", title: "🕒 Isochrone" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{ background: "linear-gradient(90deg,#007AFF,#00C6FF)", color: "transparent", mb: 1, WebkitBackgroundClip: "text" }}
        >
          @tracktor/map
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          A lightweight and powerful React component built on top of react-map-gl, combining markers, routes, popups, and advanced
          geospatial features in a single, declarative interface.
        </Typography>
      </Box>

      {/* Feature Cards */}
      {/* Feature Cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mb: 10,
        }}
      >
        {cardData.map((card, i) => (
          <Card
            key={card.title}
            onClick={() => navigate(card.path)}
            sx={{
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                transform: "translateY(-3px)",
              },
              alignItems: "stretch",
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              cursor: "pointer",
              display: "flex",
              flexDirection: { md: i % 2 === 0 ? "row" : "row-reverse", xs: "column" },
              overflow: "hidden",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {/* Image */}
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                height: { md: 220, xs: 180 },
                objectFit: "cover",
                width: { md: "38%", xs: "100%" },
              }}
            />

            {/* Text */}
            <CardContent
              sx={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 0.5,
                justifyContent: "center",
                p: { md: 4, xs: 2.5 },
              }}
            >
              <Typography variant="h5" fontWeight={600} mb={0.5}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {card.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Code Example */}
      <Paper sx={{ backgroundColor: "#0d1117", borderRadius: 4, boxShadow: "0 2px 12px rgba(0,0,0,0.2)", color: "#e6edf3", p: 4 }}>
        <Highlight
          code={`<MarkerMap
  center={[2.3522, 48.8566]}
  zoom={10}
  markers={[{ id: "paris", lat: 48.8566, lng: 2.3522, Tooltip: <div>Hello Paris!</div> }]}
  fitBounds
/>`}
          language="tsx"
          theme={dracula}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, fontSize: 14, margin: 0, overflowX: "auto" }}>
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
      </Paper>

      <Box mt={8}>
        <Typography variant="h4" fontWeight={600} mb={3}>
          ⚙️ API Reference
        </Typography>
        <PropsTable />
      </Box>
    </Box>
  );
}
