import chunkArray from "@/services/core/chunksArray.ts";
import { createFetchNearestInChunk } from "@/services/core/fetchNearestInChunkFactory.ts";
import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";
import processInBatches from "@/services/core/processInBatches.ts";
import { buildOSRMUrl, fetchOSRM } from "@/services/OSRM/client";

interface OSRMTableResponse {
  distances: number[][] | null;
}

const MAX_OSRM_POINTS = 100;
const MAX_CONCURRENT_REQUESTS = 5;

const buildOSRMMatrixUrl = (coords: string, profile: RoutingProfile) =>
  buildOSRMUrl("table", profile, coords, {
    annotations: "distance",
    sources: 0,
  });

export const fetchNearestInChunk = createFetchNearestInChunk<OSRMTableResponse>(
  buildOSRMMatrixUrl,
  fetchOSRM,
  (data) => data.distances ?? undefined,
);

/**
 * Returns all destinations ordered by ascending distance.
 */
const findNearestDestination = async (
  from: [number, number],
  destinations: Destination[],
  profile: RoutingProfile = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult[]> => {
  if (!destinations.length) {
    return [];
  }

  const chunks = chunkArray(destinations, MAX_OSRM_POINTS - 1);

  const chunkResponses = await processInBatches(chunks, MAX_CONCURRENT_REQUESTS, (chunk) =>
    fetchNearestInChunk(from, chunk, profile, maxDistanceMeters),
  );

  // Combine all sorted chunk results into one sorted array
  return chunkResponses.flatMap((res) => res.all).sort((a, b) => a.distance - b.distance);
};

export default findNearestDestination;
