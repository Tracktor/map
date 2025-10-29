import type { Feature, GeoJsonProperties, LineString } from "geojson";
import { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import MapboxService from "@/services/Mapbox";
import OSRMService from "@/services/OSRM";
import { Engine, ItineraryLineStyle, Profile } from "@/types/MarkerMapProps";

type ItineraryProps = {
  from?: [number, number];
  to?: [number, number];
  profile?: Profile;
  engine?: Engine;
  itineraryLineStyle?: Partial<ItineraryLineStyle>;
};

/**
 * Itinerary Component
 * -------------------
 * Renders a route line between two geographical points on a Mapbox map.
 *
 * Workflow:
 * 1. Fetches the route geometry between `from` and `to` coordinates.
 * 2. Uses either OSRM or Mapbox routing services depending on the `routeService` prop.
 * 3. Displays the resulting route as a line layer via `react-map-gl`.
 *
 * Props:
 * - `from`: starting point [lng, lat].
 * - `to`: destination point [lng, lat].
 * - `profile`: routing mode ("driving", "walking", or "cycling").
 * - `routeService`: which routing engine to use ("OSRM" or "Mapbox").
 * - `itineraryLineStyle`: optional line style overrides (color, opacity, width).
 *
 * Dependencies:
 * - `OSRMRoute`: returns a GeoJSON LineString from OSRM.
 * - `mapboxRoute`: returns a GeoJSON LineString from Mapbox Directions API.
 * - `react-map-gl`: used for rendering the map layers.
 *
 */
const Itinerary = ({ profile, engine, to, from, itineraryLineStyle }: ItineraryProps) => {
  const [route, setRoute] = useState<Feature<LineString, GeoJsonProperties> | null>(null);

  /**
   * Fetch and draw the route between `from` and `to` points.
   * Automatically switches between OSRM and Mapbox routing APIs.
   */
  useEffect(() => {
    // Skip if one of the points is missing
    if (!(from && to)) {
      return;
    }

    // Fetch route asynchronously to avoid blocking UI
    (async () => {
      try {
        // Choose routing service based on prop
        const r =
          engine === "OSRM" ? await OSRMService.getItinerary(from, to, profile) : await MapboxService.getItinerary(from, to, profile);

        // Update state if a route was found
        if (r) {
          setRoute(r);
        } else {
          console.warn("No route found between the specified points.");
          setRoute(null);
        }
      } catch (error) {
        // Log and reset on any network or parsing error
        console.error("Error fetching route:", error);
        setRoute(null);
      }
    })();
  }, [from, to, profile, engine]);

  if (!route) {
    return null;
  }

  return (
    <Source type="geojson" data={route}>
      <Layer
        type="line"
        paint={{
          "line-color": itineraryLineStyle?.color ?? "#9c3333",
          "line-opacity": itineraryLineStyle?.opacity ?? 0.8,
          "line-width": itineraryLineStyle?.width ?? 4,
        }}
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
      />
    </Source>
  );
};

export default Itinerary;
