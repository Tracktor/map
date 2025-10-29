import { buildOSRMUrl, fetchOSRM } from "@/services/OSRM/client";
import type { Destination, NearestResult, RoutingProfile } from "@/services/OSRM/types";

interface OSRMTableResponse {
  distances: number[][];
}

// OSRM Table API: max total coordinates per request (1 source + 99 destinations)
const MAX_OSRM_POINTS = 100;

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
export const findNearestWithOSRMTable = async (
  from: [number, number],
  destinations: Destination[],
  profile: RoutingProfile = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult | null> => {
  if (destinations.length === 0) {
    return null;
  }

  // Split destinations into chunks to avoid exceeding OSRM request limits
  const chunks = Array.from({ length: Math.ceil(destinations.length / (MAX_OSRM_POINTS - 1)) }, (_, i) =>
    destinations.slice(i * (MAX_OSRM_POINTS - 1), (i + 1) * (MAX_OSRM_POINTS - 1)),
  );

  // Process all chunks in parallel
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      // Build OSRM-compatible coordinate string
      const coords = [from, ...chunk.map((d) => d.coords)].map((c) => c.join(",")).join(";");

      // Construct the OSRM Table API URL
      const url = buildOSRMUrl("table", profile, coords, {
        annotations: "distance",
        sources: 0, // only use the origin as the source
      });

      // Fetch distance matrix from OSRM
      const data = await fetchOSRM<OSRMTableResponse>(url);
      const distances = data?.distances?.[0];
      if (!distances?.length) {
        return null;
      }

      // Extract valid distances (skip source-to-source)
      const validDistances = distances
        .map((distance, i) => ({ distance, index: i }))
        .slice(1)
        .filter(({ distance }) => distance != null);

      // Find the smallest distance in this chunk
      const nearest = validDistances.reduce((prev, curr) => (curr.distance < prev.distance ? curr : prev), {
        distance: Infinity,
        index: -1,
      });

      if (nearest.index === -1) {
        return null;
      }

      // Get the best destination corresponding to the shortest distance
      const best = chunk[nearest.index - 1];

      // Skip if distance exceeds the maximum allowed
      if (maxDistanceMeters != null && nearest.distance > maxDistanceMeters) {
        return null;
      }

      // Return the nearest result for this chunk
      return {
        distance: nearest.distance,
        id: best.id,
        point: best.coords,
      } satisfies NearestResult;
    }),
  );

  // Filter out null results and return the globally closest destination
  return results.filter((r): r is NearestResult => r != null).sort((a, b) => a.distance - b.distance)[0] ?? null;
};
