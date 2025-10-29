import chunkArray from "@/services/core/chunksArray.ts";
import { createFetchNearestInChunk } from "@/services/core/fetchNearestInChunkFactory.ts";
import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";
import processInBatches from "@/services/core/processInBatches.ts";
import { buildMapboxUrl, fetchMapbox } from "@/services/Mapbox/client";

interface MapboxMatrixResponse {
  distances: number[][];
}

const MAX_MAPBOX_POINTS = 25; // Mapbox: 1 source + 24 destinations max per request
const MAX_CONCURRENT_REQUESTS = 5; // Limit parallel API calls (avoid rate limiting)

const buildMapboxMatrixUrl = (coords: string, profile: RoutingProfile) =>
  buildMapboxUrl("directions-matrix", "v1", profile, coords, {
    annotations: "distance",
    sources: "0",
  });

const fetchNearestInChunk = createFetchNearestInChunk<MapboxMatrixResponse>(buildMapboxMatrixUrl, fetchMapbox, (data) => data.distances);

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
const findNearestDestination = async (
  from: [number, number],
  destinations: Destination[],
  profile: RoutingProfile = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult | null> => {
  if (destinations.length === 0) {
    return null;
  }

  // Split destinations into chunks (1 source + 24 destinations per chunk)
  const chunks = chunkArray(destinations, MAX_MAPBOX_POINTS - 1);

  // Process all chunks concurrently, respecting API rate limits
  const results = await processInBatches(chunks, MAX_CONCURRENT_REQUESTS, (chunk) =>
    fetchNearestInChunk(from, chunk, profile, maxDistanceMeters),
  );

  // Return globally the closest destination
  return results.filter((r): r is NearestResult => r != null).sort((a, b) => a.distance - b.distance)[0] ?? null;
};

export default findNearestDestination;
