const BASE_URL = "https://api.mapbox.com";
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export const buildMapboxUrl = (
  endpoint: string,
  version: string,
  profile: string,
  coords: string,
  params: Record<string, string> = {},
): string => {
  const query = new URLSearchParams({
    access_token: ACCESS_TOKEN || "",
    ...params,
  });
  return `${BASE_URL}/${endpoint}/${version}/mapbox/${profile}/${coords}?${query.toString()}`;
};

export const fetchMapbox = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Mapbox API error: ${res.status} ${res.statusText}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Mapbox network error:", err);
    return null;
  }
};
