import type { Feature, GeoJsonProperties, LineString } from "geojson";
import { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl";
import mapboxRoute from "@/services/Mapbox/mapboxRoute.ts";
import OSRMRoute from "@/services/OSRM/OSRMRoute.ts";
import { ItineraryLineStyle } from "@/types/MarkerMapProps.ts";

type ItineraryProps = {
  from?: [number, number];
  to?: [number, number];
  profile?: "driving" | "walking" | "cycling";
  routeService?: "OSRM" | "Mapbox";
  itineraryLineStyle?: Partial<ItineraryLineStyle>;
};

const Itinerary = ({ profile, routeService, to, from, itineraryLineStyle }: ItineraryProps) => {
  const [route, setRoute] = useState<Feature<LineString, GeoJsonProperties> | null>(null);

  useEffect(() => {
    if (!(from && to)) {
      return;
    }

    (async () => {
      try {
        const r = routeService === "OSRM" ? await OSRMRoute(from, to, profile) : await mapboxRoute(from, to, profile);

        if (r) {
          setRoute(r);
        } else {
          console.warn("No route found between the specified points.");
          setRoute(null);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRoute(null);
      }
    })();
  }, [from, to, profile, routeService]);

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
