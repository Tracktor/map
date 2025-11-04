import type { Feature, LineString } from "geojson";
import { useEffect, useState } from "react";
import RenderFeatures from "@/components/FeatureCollection/FeatureCollection.tsx";
import MapboxService from "@/services/Mapbox";
import OSRMService from "@/services/OSRM";
import { ItineraryParams } from "@/types/MapViewProps";

/**
 * Itinerary Component
 * -------------------
 * Renders a route on a map, either:
 * - using a precomputed GeoJSON route (initialRoute), or
 * - by fetching a route from a routing engine (OSRM or Mapbox).
 *
 * Responsibilities:
 * 1. Load the itinerary from props if precomputed (`initialRoute`).
 * 2. Otherwise fetch the route dynamically based on `from` + `to`.
 * 3. Optionally notify parent when a route is computed (`onRouteComputed`).
 * 4. Delegate visual rendering to <RenderFeatures /> for consistency across map features.
 */
const Itinerary = ({ from, to, profile, engine, itineraryLineStyle, initialRoute, onRouteComputed, itineraryLabel }: ItineraryParams) => {
  /** Store either the provided route or the dynamically fetched one */
  const [route, setRoute] = useState<Feature<LineString> | null>(initialRoute ?? null);

  /**
   * Sync local state when a precomputed route is provided.
   * Useful for hydration (e.g., LocalStorage restore or server precompute).
   */
  useEffect(() => {
    if (!initialRoute) {
      return;
    }

    setRoute(initialRoute);
    onRouteComputed?.(initialRoute);
  }, [initialRoute, onRouteComputed]);

  /**
   * Fetch itinerary only when needed
   * Conditions:
   * - `from` & `to` must be valid
   * - skip if a precomputed route exists (initialRoute)
   */
  useEffect(() => {
    // Skip if missing coordinates or if route was precomputed
    if (!(from && to) || initialRoute) {
      return;
    }

    (async () => {
      const service = engine === "OSRM" ? OSRMService : MapboxService;

      const computedRoute = await service.getItinerary(from, to, profile);

      setRoute(computedRoute ?? null);
      onRouteComputed?.(computedRoute ?? null);
    })();
  }, [from, to, profile, engine, initialRoute, onRouteComputed]);

  if (!route) {
    return null;
  }

  return <RenderFeatures features={route} lineStyle={itineraryLineStyle} lineLabel={itineraryLabel} />;
};

export default Itinerary;
