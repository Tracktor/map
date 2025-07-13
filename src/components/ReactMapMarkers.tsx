import { ThemeProvider } from "@tracktor/design-system";
import type { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

type MarkerData = {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  IconComponent: React.ElementType;
  iconProps?: any;
  onClick?: () => void;
  zIndex?: number;
  pointerEvents?: string;
};

type Props = {
  map: Map;
  theme: any;
  markers: MarkerData[];
};

export const ReactMapMarkers = ({ map, theme, markers }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ [id: string]: { x: number; y: number } }>({});

  // Update positions when map moves or markers change
  useEffect(() => {
    const updatePositions = () => {
      const newPositions: typeof positions = {};
      markers.forEach(({ id, coordinates }) => {
        const projected = map.project(coordinates);
        newPositions[id] = { x: projected.x, y: projected.y };
      });
      setPositions(newPositions);
    };

    updatePositions();

    map.on("move", updatePositions);
    map.on("resize", updatePositions);
    map.on("zoom", updatePositions);

    return () => {
      map.off("move", updatePositions);
      map.off("resize", updatePositions);
      map.off("zoom", updatePositions);
    };
  }, [map, markers]);

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", left: 0, pointerEvents: "none", position: "absolute", top: 0, width: "100%", zIndex: 999 }}
    >
      <ThemeProvider theme={theme}>
        {markers.map(({ id, IconComponent, iconProps, onClick, zIndex, pointerEvents }) => {
          const pos = positions[id];
          if (!pos) return null;

          return (
            <div
              key={id}
              className="react-custom-marker"
              style={{
                pointerEvents: pointerEvents ?? "auto",
                position: "absolute",
                transform: `translate(-50%, -100%) translate(${pos.x}px, ${pos.y}px)`,
                zIndex: zIndex ?? 0,
              }}
              onClick={onClick}
            >
              <IconComponent {...iconProps} />
            </div>
          );
        })}
      </ThemeProvider>
    </div>
  );
};
