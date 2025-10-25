import { isNumber, isString } from "@tracktor/react-utils";
import mapboxgl from "mapbox-gl";
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
  if (isString(key) || isNumber(key)) {
    return String(key);
  }

  return JSON.stringify(key);
};

const isValidMarker = (m: MarkerProps): m is MarkerProps & { lng: number; lat: number } => Number.isFinite(m.lng) && Number.isFinite(m.lat);

const FitBounds = ({
  markers,
  padding = 50,
  duration = 1000,
  disableAnimation = false,
  fitBounds = true,
  animationKey,
}: FitBoundsProps) => {
  const mapbox = useMap();
  const map = mapbox.current;
  const previousKey = useRef<string>("");

  const validMarkers = useMemo(() => markers.filter(isValidMarker), [markers]);

  const bounds = useMemo(() => {
    if (validMarkers.length === 0) {
      return null;
    }

    return validMarkers.reduce((acc, m) => {
      acc.extend([Number(m.lng), Number(m.lat)]);
      return acc;
    }, new mapboxgl.LngLatBounds());
  }, [validMarkers]);

  useEffect(() => {
    if (!(map && fitBounds && bounds)) {
      return undefined;
    }

    if (animationKey !== undefined) {
      const currentKey = serializeKey(animationKey);
      if (previousKey.current === currentKey) {
        return;
      }
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

    map.fitBounds([bounds.getSouthWest(), bounds.getNorthEast()], {
      duration: disableAnimation ? 0 : duration,
      padding,
    });
  }, [map, bounds, padding, duration, disableAnimation, animationKey, fitBounds, validMarkers]);

  return null;
};

export default FitBounds;
