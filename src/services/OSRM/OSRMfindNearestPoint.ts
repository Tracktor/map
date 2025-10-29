export interface NearestResult {
  distance: number;
  id: number | string;
  point: [number, number];
}

interface Destination {
  id: number | string;
  coords: [number, number];
}

export const findNearestWithOSRMTable = async (
  from: [number, number],
  destinations: Destination[],
  profile: "driving" | "walking" | "cycling" = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult | null> => {
  const profileMap = {
    cycling: "routed-bike",
    driving: "routed-car",
    walking: "routed-foot",
  };

  const coords = [from, ...destinations.map((d) => d.coords)].map((c) => `${c[0]},${c[1]}`).join(";");

  const url = `https://routing.openstreetmap.de/${profileMap[profile]}/table/v1/driving/${coords}?sources=0&annotations=distance`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Error OSRM Table:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  if (!(data.distances && Array.isArray(data.distances)) || data.distances.length === 0) {
    console.error("OSRM Table unexpected response:", data);
    return null;
  }

  const distances: (number | null)[] = data.distances[0];
  if (!distances || distances.length === 0) {
    console.error("OSRM Table first row empty:", data);
    return null;
  }

  let minIndex = -1;
  let minDistance = Infinity;

  for (let i = 1; i < distances.length; i++) {
    const d = distances[i];
    if (d != null && d < minDistance) {
      minDistance = d;
      minIndex = i;
    }
  }

  if (minIndex === -1) {
    return null;
  }

  const best = destinations[minIndex - 1];

  if (maxDistanceMeters != null && minDistance > maxDistanceMeters) {
    return null;
  }

  return {
    distance: minDistance,
    id: best.id,
    point: best.coords,
  };
};

export default findNearestWithOSRMTable;
