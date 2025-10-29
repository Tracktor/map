import { memo, useEffect, useRef, useState } from "react";
import Itinerary from "@/Features/Itinerary/Itinerary.tsx";
import findNearestWithOSRMTable from "@/services/OSRM/findNearestPoint";
import type { FindNearestMarkerParams } from "@/types/MarkerMapProps";

export interface NearestResult {
  id: number | string;
  point: [number, number];
  distance: number;
}

/**
 * NearestPointItinerary Component
 * --------------------------------
 * Displays the driving itinerary (route line) between a given `origin` point
 * and the nearest destination among a provided list, based on OSRM routing data.
 *
 * Workflow:
 * 1. Computes the nearest reachable destination using OSRM’s table service.
 * 2. Notifies the parent component when the nearest destination changes
 *    (via `onNearestFound` callback).
 * 3. Renders an `Itinerary` component showing the route on the map.
 *
 * Props:
 * - `origin`: [lng, lat] coordinate of the starting point.
 * - `destinations`: list of points with `{ id, lat, lng }` used to find the nearest one.
 * - `maxDistanceMeters`: maximum distance threshold to consider a point as "near".
 * - `onNearestFound`: callback fired when a new nearest point is found or reset.
 * - `profile`: OSRM travel mode ("driving", "walking", "cycling").
 *
 * Dependencies:
 * - `findNearestWithOSRMTable`: performs OSRM distance matrix lookup.
 * - `Itinerary`: handles map rendering of the route line.
 *
 */
const NearestPointItinerary = ({
  origin,
  maxDistanceMeters,
  destinations,
  onNearestFound,
  profile = "driving",
}: FindNearestMarkerParams) => {
  const [nearestResult, setNearestResult] = useState<NearestResult | null>(null);
  const lastNotifiedRef = useRef<NearestResult | null>(null);

  /**
   * 1 — Compute nearest destination based on current origin and destination list.
   */
  useEffect(() => {
    // Skip if no valid origin or no destinations
    if (!origin || origin.length !== 2 || !destinations?.length) {
      return;
    }

    // Format destinations for OSRM
    const formattedDestinations = destinations.map((m) => ({
      coords: [m.lng, m.lat] as [number, number],
      id: m.id,
    }));

    // Async IIFE to avoid race conditions
    (async () => {
      const nearest = await findNearestWithOSRMTable(origin, formattedDestinations, profile, maxDistanceMeters);

      // Update only if nearest point actually changed
      if (nearest) {
        setNearestResult((prev) => (!prev || prev.id !== nearest.id || prev.distance !== nearest.distance ? nearest : prev));
      }
    })();
  }, [origin, maxDistanceMeters, destinations, profile]);

  /**
   * 2 — Notify parent when the nearest point changes.
   */
  useEffect(() => {
    // No nearest result → reset state and notify null
    if (!nearestResult) {
      onNearestFound?.(null, null, 0);
      lastNotifiedRef.current = null;
      return;
    }

    // Nearest is too far → notify null
    if (maxDistanceMeters != null && nearestResult.distance > maxDistanceMeters) {
      onNearestFound?.(null, null, 0);
      lastNotifiedRef.current = null;
      return;
    }

    // Notify only if the result changed since last notification
    const last = lastNotifiedRef.current;
    if (!last || last.id !== nearestResult.id || last.distance !== nearestResult.distance) {
      onNearestFound?.(nearestResult.id, nearestResult.point, nearestResult.distance);
      lastNotifiedRef.current = nearestResult;
    }
  }, [nearestResult, onNearestFound, maxDistanceMeters]);

  // No route to show yet
  if (!nearestResult?.point) {
    return null;
  }

  // Render itinerary between origin and nearest destination
  return <Itinerary from={origin} to={nearestResult.point} profile="driving" routeService="OSRM" />;
};

export default memo(NearestPointItinerary);
