import { memo, useEffect, useRef, useState } from "react";
import Itinerary from "@/Features/Itinerary/Itinerary.tsx";
import findNearestWithOSRMTable from "@/services/OSRM/findNearestPoint";
import type { FindNearestMarkerParams } from "@/types/MarkerMapProps";

export interface NearestResult {
  id: number | string;
  point: [number, number];
  distance: number;
}

const NearestPointItinerary = ({ origin, maxDistanceMeters, destinations, onNearestFound }: FindNearestMarkerParams) => {
  const [nearestResult, setNearestResult] = useState<NearestResult | null>(null);
  const lastNotifiedRef = useRef<NearestResult | null>(null);

  useEffect(() => {
    if (!origin || origin.length !== 2 || !destinations?.length) {
      return;
    }

    const formattedDestinations = destinations.map((m) => ({
      coords: [m.lng, m.lat] as [number, number],
      id: m.id,
    }));

    (async () => {
      const nearest = await findNearestWithOSRMTable(origin, formattedDestinations, "driving", maxDistanceMeters);
      if (nearest) {
        setNearestResult((prev) => (!prev || prev.id !== nearest.id || prev.distance !== nearest.distance ? nearest : prev));
      }
    })();
  }, [origin, maxDistanceMeters, destinations]);

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

  if (!nearestResult?.point) {
    return null;
  }

  return <Itinerary from={origin} to={nearestResult.point} profile="driving" routeService="OSRM" />;
};

export default memo(NearestPointItinerary);
