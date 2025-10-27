import { isArray, isNumber, isString } from "@tracktor/react-utils";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import { useMap } from "react-map-gl";
import isValidMarker from "@/types/isValidMarker.ts";
import { MarkerProps } from "@/types/MarkerProps";

interface FitBoundsProps {
  markers?: MarkerProps[];
  features?: FeatureCollection<Geometry, GeoJsonProperties> | Feature<Geometry> | Feature<Geometry>[]; // ✅
  padding?: number;
  duration?: number;
  disableAnimation?: boolean;
  fitBounds?: boolean;
  animationKey?: unknown;
  openPopup?: boolean;
}

const serializeKey = (key: unknown): string => {
  if (isString(key) || isNumber(key)) {
    return String(key);
  }
  return JSON.stringify(key);
};

const extractCoordsFromFeatures = (input?: FeatureCollection<Geometry> | Feature<Geometry> | Feature<Geometry>[]): [number, number][] => {
  if (!input) {
    return [];
  }

  const featuresArray: Feature<Geometry>[] = isArray(input) ? input : input.type === "FeatureCollection" ? input.features : [input];

  const coords: [number, number][] = [];

  for (const feature of featuresArray) {
    const geom = feature.geometry;

    if (geom.type === "Point") {
      coords.push(geom.coordinates as [number, number]);
    }

    if (geom.type === "LineString") {
      coords.push(...(geom.coordinates as [number, number][]));
    }

    if (geom.type === "Polygon") {
      coords.push(...(geom.coordinates[0] as [number, number][]));
    }
  }

  return coords;
};

const FitBounds = ({
  markers = [],
  features,
  padding = 50,
  duration = 1000,
  disableAnimation,
  fitBounds = true,
  animationKey,
  openPopup,
}: FitBoundsProps) => {
  const { current: map } = useMap();
  const previousKey = useRef<string>("");

  const validMarkers = useMemo(() => markers.filter(isValidMarker), [markers]);
  const featureCoords = useMemo(() => extractCoordsFromFeatures(features), [features]);

  const bounds = useMemo(() => {
    const allPoints: [number, number][] = [...validMarkers.map((m) => [m.lng, m.lat] as [number, number]), ...featureCoords];

    if (allPoints.length === 0) {
      return null;
    }

    return allPoints.reduce((acc, [lng, lat]) => acc.extend([lng, lat]), new mapboxgl.LngLatBounds());
  }, [validMarkers, featureCoords]);

  useEffect(() => {
    if (openPopup) {
      return;
    }

    if (!(map && fitBounds && bounds)) {
      return;
    }

    if (animationKey !== undefined) {
      const currentKey = serializeKey(animationKey);
      if (previousKey.current === currentKey) {
        return;
      }
      previousKey.current = currentKey;
    }

    if (bounds.isEmpty()) {
      return;
    }

    if (validMarkers.length === 1 && featureCoords.length === 0) {
      const m = validMarkers[0];
      map.flyTo({
        center: [m.lng, m.lat],
        duration: disableAnimation ? 0 : duration,
        zoom: 14,
      });
      return;
    }

    map.fitBounds([bounds.getSouthWest().toArray(), bounds.getNorthEast().toArray()], {
      duration: disableAnimation ? 0 : duration,
      padding,
    });
  }, [map, bounds, padding, duration, disableAnimation, animationKey, fitBounds, validMarkers, featureCoords, openPopup]);

  return null;
};

export default FitBounds;
