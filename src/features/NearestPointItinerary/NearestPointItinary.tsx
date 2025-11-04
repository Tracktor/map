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

const NearestPointItinerary = ({
  origin,
  maxDistanceMeters,
  destinations,
  onNearestFound,
  profile = "driving",
  engine = "OSRM",
}: FindNearestMarkerParams & { engine: Engine }) => {
  const [allResults, setAllResults] = useState<NearestResult[]>([]);
  const lastResultsRef = useRef<NearestResult[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!origin || origin.length !== 2 || !destinations?.length) {
      setAllResults([]);
      return;
    }

    setAllResults([]);

    const formattedDestinations = destinations.map((m) => ({
      coords: [m.lng, m.lat] as [number, number],
      id: m.id,
    }));

    (async () => {
      const service = engine === "OSRM" ? OSRMService : MapboxService;
      const results = await service.findNearest(origin, formattedDestinations, profile, maxDistanceMeters);

      if (!cancelled) {
        setAllResults(results ?? []);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [origin, maxDistanceMeters, destinations, profile, engine]);

  /**
   * Notify parent only when list changes (avoid infinite loops)
   */
  useEffect(() => {
    const last = lastResultsRef.current;

    const hasChanged =
      !last ||
      last.length !== allResults.length ||
      last.some((r, i) => r.id !== allResults[i]?.id || r.distance !== allResults[i]?.distance);

    if (hasChanged) {
      onNearestFound?.(allResults);
      lastResultsRef.current = allResults;
    }
  }, [allResults, onNearestFound]);

  /**
   * Render nearest itinerary only if one exists
   */
  const nearest = allResults[0];
  if (!nearest) {
    return null;
  }

  return <Itinerary from={origin} to={nearest.point} profile={profile} engine={engine} />;
};

export default memo(NearestPointItinerary);
