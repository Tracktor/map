import { Box } from "@tracktor/design-system";
import FeaturesPreview from "sandbox/assets/features-preview.png";
import IsochronePreview from "sandbox/assets/isochrone-preview.png";
import MarkerPreview from "sandbox/assets/markers-preview.png";
import NearestPreview from "sandbox/assets/nearest-preview.png";
import RoutePreview from "sandbox/assets/route-preview.png";
import ApiReference from "sandbox/features/LandingPage/ApiReference";
import CodeExample from "sandbox/features/LandingPage/CodeExample";
import ExampleCard from "sandbox/features/LandingPage/ExampleCard";
import Hero from "sandbox/features/LandingPage/Hero";

const cardData = [
  { desc: "Customizable markers with tooltips.", image: MarkerPreview, path: "/markers", title: "📍 Markers" },
  { desc: "Compute and display routes easily.", image: RoutePreview, path: "/route", title: "🚗 Route" },
  { desc: "Render GeoJSON layers elegantly.", image: FeaturesPreview, path: "/features", title: "🗺 Features" },
  { desc: "Find the closest marker dynamically.", image: NearestPreview, path: "/nearest-marker", title: "📌 Nearest Marker" },
  { desc: "Display travel-time areas visually.", image: IsochronePreview, path: "/isochrone", title: "🕒 Isochrone" },
];

const LandingPage = () => {
  return (
    <Box
      sx={{
        backdropFilter: "blur(12px)",
        background: `
          linear-gradient(135deg, rgba(15,15,15,1) 0%, rgba(20,20,25,1) 50%, rgba(0,122,255,0.08) 100%)
        `,
        color: "white",
        minHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* --- Subtle blue glow accents --- */}
      <Box
        sx={{
          "&::after": {
            background: "radial-gradient(circle, rgba(0,198,255,0.12), transparent 70%)",
            borderRadius: "50%",
            bottom: "-10%",
            content: '""',
            filter: "blur(120px)",
            height: 500,
            position: "absolute",
            right: "-10%",
            width: 500,
          },
          "&::before": {
            background: "radial-gradient(circle, rgba(0,122,255,0.18), transparent 70%)",
            borderRadius: "50%",
            content: '""',
            filter: "blur(100px)",
            height: 400,
            left: "-10%",
            position: "absolute",
            top: "-10%",
            width: 400,
          },
          inset: 0,
          position: "fixed",
          zIndex: -1,
        }}
      />

      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 8 }}>
        <Hero />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 10 }}>
          {cardData.map(({ desc, title, image, path }, i) => (
            <ExampleCard key={i} path={path} desc={desc} title={title} image={image} index={i} />
          ))}
        </Box>

        <CodeExample />
        <ApiReference />

        <Box textAlign="center" mt={10} color="text.secondary">
          Built by <b>Tracktor</b>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
