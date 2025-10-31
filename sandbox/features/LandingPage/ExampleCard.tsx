import { Box, Card, CardContent, Typography } from "@tracktor/design-system";
import { useNavigate } from "react-router-dom";

interface ExampleCardProps {
  index: number;
  title: string;
  desc: string;
  image: string;
  path: string;
}

const ExampleCard = ({ title, image, desc, path }: ExampleCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(path)}
      sx={{
        "&:hover": {
          borderColor: "rgba(0,198,255,0.4)",
          boxShadow: "0 8px 30px rgba(0,198,255,0.25)",
          transform: "translateY(-4px)",
        },
        backdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4,
        boxShadow: "0 0 20px rgba(0,0,0,0.15)",
        cursor: "pointer",
        height: { md: 260, xs: 200 },
        overflow: "hidden",
        position: "relative",
        transition: "all 0.35s ease",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* --- Background Image --- */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          "&:hover": { transform: "scale(1.05)" },
          height: "100%",
          left: 0,
          objectFit: "cover",
          objectPosition: "center",
          position: "absolute",
          top: 0,
          transition: "transform 0.5s ease",
          width: "100%",
          zIndex: 0,
        }}
      />

      {/* --- Overlay Gradient --- */}
      <Box
        sx={{
          "&:hover": {
            opacity: 0.9,
          },
          background: `
            linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)
          `,
          inset: 0,
          position: "absolute",
          transition: "opacity 0.3s ease",
          zIndex: 1,
        }}
      />

      {/* --- Content --- */}
      <CardContent
        sx={{
          color: "white",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "flex-end",
          p: { md: 4, xs: 2.5 },
          position: "relative",
          textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: "linear-gradient(90deg,#00C6FF,#007AFF)",
            color: "transparent",
            mb: 0.8,
            WebkitBackgroundClip: "text",
          }}
        >
          {title}
        </Typography>

        <Typography variant="body2" sx={{ lineHeight: 1.5, opacity: 0.85 }}>
          {desc}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ExampleCard;
