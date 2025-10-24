import mapboxgl from "mapbox-gl";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import { MarkerProps } from "@/types/MarkerProps";

interface FitBoundsProps {
  markers: MarkerProps[];
  padding?: number;
  duration?: number;
  animationKey?: unknown; // ✅ nouveau
}

const FitBounds = ({ markers, padding = 50, duration = 1000, animationKey }: FitBoundsProps) => {
  const { current: map } = useMap();

  // biome-ignore lint/correctness/useExhaustiveDependencies: animationKey is intentionally included to trigger the effect manually
  useEffect(() => {
    if (!map || markers.length === 0) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    for (const marker of markers) {
      bounds.extend([marker.lng, marker.lat]);
    }

    if (bounds.isEmpty()) {
      return;
    }

    map.fitBounds(bounds, {
      duration,
      padding,
    });
  }, [map, markers, padding, duration, animationKey]);

  return null;
};

export default FitBounds;
