import type { Destination, NearestResult, RoutingProfile } from "@/services/core/interface";

const buildCoordsString = (from: [number, number], destinations: Destination[]) =>
  [from, ...destinations.map((d) => d.coords)].map((c) => c.join(",")).join(";");

interface ChunkDistancesResult {
  nearest: NearestResult | null;
  all: NearestResult[];
}

/**
 * Compute nearest + list of all distances for a given chunk.
 */
const computeChunkDistances = (chunk: Destination[], distances: number[], maxDistanceMeters?: number): ChunkDistancesResult => {
  const results: NearestResult[] = distances
    .map((distance, index) => {
      if (index === 0 || distance == null) {
        return null;
      }
      const dest = chunk[index - 1];
      return dest ? { distance, id: dest.id, point: dest.coords } : null;
    })
    .filter((r): r is NearestResult => r !== null);

  if (results.length === 0) {
    return { all: [], nearest: null };
  }

  const sorted = results.sort((a, b) => a.distance - b.distance);
  const nearest = sorted[0];

  if (maxDistanceMeters && nearest.distance > maxDistanceMeters) {
    return { all: sorted, nearest: null };
  }

  return { all: sorted, nearest };
};

/**
 * Factory returning a provider-specific fetchNearestInChunk function.
 *
 * It now returns:
 * { nearest, all }
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
  ): Promise<ChunkDistancesResult> => {
    const coords = buildCoordsString(from, chunk);
    const url = buildUrl(coords, profile);

    const data = await fetchData(url);

    const distancesRow = data ? extractDistances(data)?.[0] : undefined;
    if (!distancesRow?.length) {
      return { all: [], nearest: null };
    }

    return computeChunkDistances(chunk, distancesRow, maxDistanceMeters);
  };
}

export type { ChunkDistancesResult };
