import { memo, useEffect, useRef, useState } from "react";
import Itinerary from "@/Features/Itinerary/Itinerary.tsx";
import mapboxFindNearestPoint from "@/services/Mapbox/mapboxFindNearestPoint.ts";
import findNearestWithOSRMTable from "@/services/OSRM/OSRMfindNearestPoint.ts";
import type { FindNearestMarkerParams } from "@/types/MarkerMapProps";

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
}: FindNearestMarkerParams) => {
  const [nearestResult, setNearestResult] = useState<NearestResult | null>(null);
  const lastNotifiedRef = useRef<NearestResult | null>(null);

  console.log("engine:", engine);

  /**
   * Step 1 — Compute nearest destination when input changes.
   */
  useEffect(() => {
    if (!origin || origin.length !== 2 || !destinations?.length) {
      return;
    }

    const formattedDestinations = destinations.map((m) => ({
      coords: [m.lng, m.lat] as [number, number],
      id: m.id,
    }));

    (async () => {
      const finder = engine === "OSRM" ? findNearestWithOSRMTable : mapboxFindNearestPoint;

      const nearest = await finder(origin, formattedDestinations, profile, maxDistanceMeters);

      if (nearest) {
        setNearestResult((prev) => (!prev || prev.id !== nearest.id || prev.distance !== nearest.distance ? nearest : prev));
      }
    })();
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

  return <Itinerary from={origin} to={nearestResult.point} profile={profile} engine={engine} />;
};

export default memo(NearestPointItinerary);
