import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import { useMap } from "react-map-gl";
import { MarkerProps } from "@/types/MarkerProps";

interface FitBoundsProps {
  markers: MarkerProps[];
  padding?: number;
  duration?: number;
  disableAnimation?: boolean;
  fitBounds?: boolean;
  animationKey?: unknown;
}

const serializeKey = (key: unknown): string => {
  if (typeof key === "string" || typeof key === "number") return String(key);
  return JSON.stringify(key);
};

const FitBounds = ({
  markers,
  padding = 50,
  duration = 1000,
  disableAnimation = false,
  fitBounds = true,
  animationKey,
}: FitBoundsProps) => {
  const mapbox = useMap() as { current: MapboxMap | null };
  const map = mapbox.current;
  const previousKey = useRef<string>("");

  const validMarkers = useMemo(() => markers.filter((m) => Number.isFinite(m.lng) && Number.isFinite(m.lat)), [markers]);

  const bounds = useMemo(() => {
    if (validMarkers.length === 0) return null;
    const b = new mapboxgl.LngLatBounds();
    for (const m of validMarkers) {
      b.extend([m.lng, m.lat]);
    }
    return b;
  }, [validMarkers]);

  useEffect(() => {
    if (!(map && fitBounds && bounds)) return;

    if (animationKey !== undefined) {
      const currentKey = serializeKey(animationKey);
      if (previousKey.current === currentKey) return;
      previousKey.current = currentKey;
    }

    if (validMarkers.length === 1) {
      map.flyTo({
        center: [validMarkers[0].lng, validMarkers[0].lat],
        duration: disableAnimation ? 0 : duration,
        zoom: 14,
      });
      return;
    }

    map.fitBounds(bounds, {
      duration: disableAnimation ? 0 : duration,
      padding,
    });
  }, [map, bounds, padding, duration, disableAnimation, animationKey, fitBounds, validMarkers]);

  return null;
};

export default FitBounds;
