import chunkArray from "@/services/core/chunksArray";
import { createFetchNearestInChunk } from "@/services/core/fetchNearestInChunkFactory";
import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";
import processInBatches from "@/services/core/processInBatches";
import { buildMapboxUrl, fetchMapbox } from "@/services/Mapbox/client";

interface MapboxMatrixResponse {
  distances?: number[][] | null;
}

const MAX_MAPBOX_POINTS = 25; // Mapbox Matrix: 1 source + 24 destinations max
const MAX_CONCURRENT_REQUESTS = 5;

const buildMapboxMatrixUrl = (coords: string, profile: RoutingProfile) =>
  buildMapboxUrl("directions-matrix", "v1", profile, coords, {
    annotations: "distance",
    sources: "0",
  });

const extractDistances = (data: MapboxMatrixResponse) => data.distances ?? undefined;

const fetchNearestInChunk = createFetchNearestInChunk<MapboxMatrixResponse>(buildMapboxMatrixUrl, fetchMapbox, extractDistances);

/**
 * Returns all destinations ordered by ascending distance using Mapbox Matrix API
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

  const chunks = chunkArray(destinations, MAX_MAPBOX_POINTS - 1);

  const chunkResponses = await processInBatches(chunks, MAX_CONCURRENT_REQUESTS, (chunk) =>
    fetchNearestInChunk(from, chunk, profile, maxDistanceMeters),
  );

  return chunkResponses.flatMap((res) => res.all).sort((a, b) => a.distance - b.distance);
};

export default findNearestDestination;
