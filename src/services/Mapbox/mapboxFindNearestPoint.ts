export interface NearestResult {
  distance: number;
  id: number | string;
  point: [number, number];
}

interface Destination {
  id: number | string;
  coords: [number, number];
}

export const mapboxFindNearestPoint = async (
  from: [number, number],
  destinations: Destination[],
  profile: "driving" | "walking" | "cycling" = "driving",
  maxDistanceMeters?: number,
): Promise<NearestResult | null> => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!destinations.length) {
    return null;
  }

  const coords = [from, ...destinations.map((d) => d.coords)].map((c) => `${c[0]},${c[1]}`).join(";");

  const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/${profile}/${coords}?sources=0&annotations=distance&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Erreur Mapbox Matrix :", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  if (!(Array.isArray(data.distances) && Array.isArray(data.distances[0]))) {
    console.error("Response wrong format Mapbox Matrix :", data);
    return null;
  }

  const distances = data.distances[0]?.slice(1).filter((d): d is number => typeof d === "number") ?? [];
  if (!distances.length) {
    return null;
  }

  const minDistance = Math.min(...distances.filter((d): d is number => typeof d === "number"));
  const minIndex = distances.indexOf(minDistance);

  if (minIndex === -1) {
    return null;
  }

  const best = destinations[minIndex];
  if (maxDistanceMeters != null && minDistance > maxDistanceMeters) {
    return null;
  }

  return { distance: minDistance, id: best.id, point: best.coords };
};

export default mapboxFindNearestPoint;
