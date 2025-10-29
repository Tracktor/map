import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";

const buildCoordsString = (from: [number, number], destinations: Destination[]) =>
  [from, ...destinations.map((d) => d.coords)].map((c) => c.join(",")).join(";");

/**
 * Find the nearest destination within a chunk of destinations,
 * given an array of distances.
 */
const findNearestInDistances = (chunk: Destination[], distances: number[], maxDistanceMeters?: number): NearestResult | null => {
  const validDistances = distances
    .map((distance, index) => ({ distance, index }))
    .slice(1)
    .filter(({ distance }) => distance != null);

  if (validDistances.length === 0) {
    return null;
  }

  const nearest = validDistances.reduce((prev, curr) => (curr.distance < prev.distance ? curr : prev));

  const best = chunk[nearest.index - 1];
  if (!best) {
    return null;
  }

  if (maxDistanceMeters && nearest.distance > maxDistanceMeters) {
    return null;
  }

  return {
    distance: nearest.distance,
    id: best.id,
    point: best.coords,
  };
};

/**
 * Factory to create a provider-specific "fetchNearestInChunk" function.
 *
 * @param buildUrl - Function to build the API endpoint URL.
 * @param fetchData - Function to perform the API request and return parsed JSON.
 * @param extractDistances - Function to extract the distances array from the response.
 */
export function createFetchNearestInChunk<TResponse>(
  buildUrl: (coords: string, profile: RoutingProfile) => string,
  fetchData: (url: string) => Promise<TResponse | null>,
  extractDistances: (data: TResponse) => number[][] | undefined,
) {
  return async (
    from: [number, number],
    chunk: Destination[],
    profile: RoutingProfile,
    maxDistanceMeters?: number,
  ): Promise<NearestResult | null> => {
    const coords = buildCoordsString(from, chunk);
    const url = buildUrl(coords, profile);

    const data = await fetchData(url);
    const distances = data ? extractDistances(data)?.[0] : undefined;
    if (!distances?.length) {
      return null;
    }

    return findNearestInDistances(chunk, distances, maxDistanceMeters);
  };
}
