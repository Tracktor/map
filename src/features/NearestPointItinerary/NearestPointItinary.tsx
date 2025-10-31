import { memo, useEffect, useRef, useState } from "react";
import Itinerary from "@/features/Itinerary/Itinerary";
import MapboxService from "@/services/Mapbox";
import OSRMService from "@/services/OSRM";
import type { Engine, FindNearestMarkerParams } from "@/types/MapViewProps.ts";

export interface NearestResult {
  id: number | string;
  point: [number, number];
  distance: number;
}

/**
 * NearestPointItinerary Component
 * --------------------------------
 * Displays a route between an origin and the nearest destination.
 * Supports both Mapbox Matrix API and OSRM Table API depending on the selected engine.
 *
 * Workflow:
 * 1. Computes the nearest reachable destination based on the selected engine.
 * 2. Notifies the parent component when the nearest destination changes.
 * 3. Renders the itinerary line using the chosen routing service.
 *
 * Props:
 * - `origin`: [lng, lat] coordinates of the starting point.
 * - `destinations`: array of markers `{ id, lat, lng }`.
 * - `maxDistanceMeters`: maximum distance threshold.
 * - `onNearestFound`: callback fired when nearest destination changes.
 * - `profile`: travel profile ("driving" | "walking" | "cycling").
 * - `engine`: which routing backend to use ("mapbox" | "osrm").
 */
const NearestPointItinerary = ({
  origin,
  maxDistanceMeters,
  destinations,
  onNearestFound,
  profile = "driving",
  engine = "OSRM",
}: FindNearestMarkerParams & { engine: Engine }) => {
  const [nearestResult, setNearestResult] = useState<NearestResult | null>(null);
  const lastNotifiedRef = useRef<NearestResult | null>(null);

  /**
   * Step 1 — Compute nearest destination when input changes.
   */
  useEffect(() => {
    let cancelled = false;

    if (!origin || origin.length !== 2 || !destinations?.length) {
      setNearestResult(null);
      return;
    }

    setNearestResult(null);

    const formattedDestinations = destinations.map((m) => ({
      coords: [m.lng, m.lat] as [number, number],
      id: m.id,
    }));

    (async () => {
      const finder = engine === "OSRM" ? OSRMService.findNearest : MapboxService.findNearest;
      const nearest = await finder(origin, formattedDestinations, profile, maxDistanceMeters);

      if (!cancelled && nearest) {
        setNearestResult(nearest);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [origin, maxDistanceMeters, destinations, profile, engine]);

  /**
   * Step 2 — Notify parent when nearest destination changes.
   */
  useEffect(() => {
    if (!nearestResult) {
      onNearestFound?.(null, null, 0);
      lastNotifiedRef.current = null;
      return;
    }

    if (maxDistanceMeters != null && nearestResult.distance > maxDistanceMeters) {
      onNearestFound?.(null, null, 0);
      lastNotifiedRef.current = null;
      return;
    }

    const last = lastNotifiedRef.current;
    if (!last || last.id !== nearestResult.id || last.distance !== nearestResult.distance) {
      onNearestFound?.(nearestResult.id, nearestResult.point, nearestResult.distance);
      lastNotifiedRef.current = nearestResult;
    }
  }, [nearestResult, onNearestFound, maxDistanceMeters]);

  /**
   * Step 3 — Render itinerary line between origin and nearest point.
   */
  if (!nearestResult?.point) {
    return null;
  }

  console.log("nearestResult", nearestResult);

  return <Itinerary from={origin} to={nearestResult.point} profile={profile} engine={engine} />;
};

export default memo(NearestPointItinerary);
