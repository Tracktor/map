import chunkArray from "@/services/core/chunksArray.ts";
import { createFetchNearestInChunk } from "@/services/core/fetchNearestInChunkFactory.ts";
import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";
import processInBatches from "@/services/core/processInBatches.ts";
import { buildOSRMUrl, fetchOSRM } from "@/services/OSRM/client";

interface OSRMTableResponse {
  distances: number[][];
}

const MAX_OSRM_POINTS = 100; // OSRM: 1 source + 99 destinations
const MAX_CONCURRENT_REQUESTS = 5; // Limit concurrent requests to avoid overload

const buildOSRMMatrixUrl = (coords: string, profile: RoutingProfile) =>
  buildOSRMUrl("table", profile, coords, {
    annotations: "distance",
    sources: 0,
  });

export const fetchNearestInChunk = createFetchNearestInChunk<OSRMTableResponse>(buildOSRMMatrixUrl, fetchOSRM, (data) => data.distances);

/**
 * Find the nearest destination using the OSRM Table API.
 * Automatically splits large destination lists into smaller chunks
 * to stay under the OSRM API limit and returns the closest destination.
 *
 * @param from - The source coordinate [longitude, latitude].
 * @param destinations - The list of destination points to compare.
 * @param profile - OSRM routing profile (e.g. 'driving', 'walking', 'cycling').
 * @param maxDistanceMeters - Optional max distance filter (in meters).
 * @returns The closest destination within max distance, or null if none found.
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

  // Split destinations into chunks (1 source + 99 destinations per chunk)
  const chunks = chunkArray(destinations, MAX_OSRM_POINTS - 1);

  // Process all chunks with concurrency control
  const results = await processInBatches(chunks, MAX_CONCURRENT_REQUESTS, (chunk) =>
    fetchNearestInChunk(from, chunk, profile, maxDistanceMeters),
  );

  // Return globally closest destination
  return results.filter((r): r is NearestResult => r != null).sort((a, b) => a.distance - b.distance)[0] ?? null;
};

export default findNearestDestination;
