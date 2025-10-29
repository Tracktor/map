import { buildMapboxUrl, fetchMapbox } from "@/services/Mapbox/client";
import type { Destination, MapboxProfile, NearestResult } from "@/services/Mapbox/types";

interface MapboxMatrixResponse {
  distances: number[][];
}

const MAX_MAPBOX_POINTS = 25; // Mapbox: 1 source + 24 destinations max per request
const MAX_CONCURRENT_REQUESTS = 5; // Limit parallel API calls (avoid rate limiting)

/**
 * Process items in limited-size concurrent batches.
 *
 * @param items - The array of items to process.
 * @param batchSize - The maximum number of concurrent executions.
 * @param handler - An async function to process each item.
 * @returns A flattened array of results.
 */
const processInBatches = async <T, R>(items: T[], batchSize: number, handler: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(handler));
    results.push(...batchResults);
  }

  return results;
};

/**
 * Find the nearest destination using the Mapbox Directions Matrix API.
 * Automatically splits large destination lists into chunks (<= 25 points)
 * and executes requests in limited parallel batches to avoid API throttling.
 *
 * @param from - The origin coordinate [longitude, latitude].
 * @param destinations - List of destination coordinates with IDs.
 * @param profile - Mapbox routing profile (driving, walking, cycling...).
 * @param maxDistanceMeters - Optional distance limit in meters.
 * @returns The nearest destination, or null if none found.
 */
export const findNearestWithMapboxMatrix = async (
  from: [number, number],
  destinations: Destination[],
  profile: MapboxProfile = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult | null> => {
  if (destinations.length === 0) {
    return null;
  }

  // Split destinations into chunks (1 source + 24 destinations per chunk)
  const chunks = Array.from({ length: Math.ceil(destinations.length / (MAX_MAPBOX_POINTS - 1)) }, (_, i) =>
    destinations.slice(i * (MAX_MAPBOX_POINTS - 1), (i + 1) * (MAX_MAPBOX_POINTS - 1)),
  );

  // Process all chunks with concurrency control
  const results = await processInBatches(chunks, MAX_CONCURRENT_REQUESTS, async (chunk) => {
    const coords = [from, ...chunk.map((d) => d.coords)].map((c) => c.join(",")).join(";");

    const url = buildMapboxUrl("directions-matrix", "v1", profile, coords, {
      annotations: "distance",
      sources: "0",
    });

    const data = await fetchMapbox<MapboxMatrixResponse>(url);
    const distances = data?.distances?.[0];
    if (!distances?.length) {
      return null;
    }

    // Filter and find the nearest destination in this chunk
    const validDistances = distances
      .map((distance, i) => ({ distance, index: i }))
      .slice(1)
      .filter(({ distance }) => distance != null);

    const nearest = validDistances.reduce((prev, curr) => (curr.distance < prev.distance ? curr : prev), { distance: Infinity, index: -1 });

    if (nearest.index === -1) {
      return null;
    }

    const best = chunk[nearest.index - 1];
    if (maxDistanceMeters != null && nearest.distance > maxDistanceMeters) {
      return null;
    }

    return {
      distance: nearest.distance,
      id: best.id,
      point: best.coords,
    } satisfies NearestResult;
  });

  // Combine all results and return the globally closest destination
  return results.filter((r): r is NearestResult => r != null).sort((a, b) => a.distance - b.distance)[0] ?? null;
};
