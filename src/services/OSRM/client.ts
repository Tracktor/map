import { RoutingProfile } from "@/services/OSRM/types";

const PROFILE_MAP: Record<RoutingProfile, string> = {
  cycling: "routed-bike",
  driving: "routed-car",
  walking: "routed-foot",
};

export const OSRM_BASE_URL = "https://routing.openstreetmap.de";

/**
 * Build an OSRM API endpoint for a given service and profile.
 */
export const buildOSRMUrl = (
  service: "route" | "table",
  profile: RoutingProfile,
  path: string,
  params?: Record<string, string | number | boolean>,
): string => {
  const base = `${OSRM_BASE_URL}/${PROFILE_MAP[profile]}/${service}/v1/${profile}/${path}`;
  const query = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : "";

  return `${base}${query}`;
};

/**
 * Fetch and parse JSON safely from the OSRM API.
 */
export const fetchOSRM = async <T>(url: string): Promise<T | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("OSRM API error:", res.status, res.statusText);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Error fetching OSRM API:", err);
    return null;
  }
};
