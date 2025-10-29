import type { FeatureCollection, Polygon } from "geojson";
import { memo, useEffect, useState } from "react";
import RenderFeatures from "@/components/FeatureCollection/FeatureCollection";
import MapboxService from "@/services/Mapbox";
import { IsochroneProps } from "@/types/MarkerMapProps";

/**
 * Isochrone Component
 * -------------------
 * Displays travel-time polygons (isochrones) from a given origin using Mapbox API.
 *
 * - Fetches and renders isochrone polygons as GeoJSON layers.
 * - Supports dynamic updates when origin, profile, or contours change.
 */
const Isochrone = ({ origin, profile = "driving", intervals = [5, 10, 15], onIsochroneLoaded }: IsochroneProps) => {
  const [isochroneData, setIsochroneData] = useState<FeatureCollection<Polygon> | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!origin || origin.length !== 2) {
      setIsochroneData(null);
      return;
    }

    (async () => {
      if (!MapboxService.getIsochrone) {
        console.warn("⚠️ getIsochrone is not implemented for this provider.");
        return;
      }

      const data = await MapboxService.getIsochrone(origin, profile, intervals);
      if (!cancelled) {
        setIsochroneData(data);
        onIsochroneLoaded?.(data ?? null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [origin, profile, intervals, onIsochroneLoaded]);

  if (!isochroneData) {
    return null;
  }

  return <RenderFeatures features={isochroneData} />;
};

export default memo(Isochrone);
