import { MapRoutingProvider } from "@/services/core/interface.ts";
import findNearestDestination from "@/services/Mapbox/findNearestDestination";
import getIsochrone from "@/services/Mapbox/getIsochrone.ts";
import getItinerary from "@/services/Mapbox/getItinerary";

const MapboxService: MapRoutingProvider = {
  findNearest: findNearestDestination,
  getIsochrone: getIsochrone,
  getItinerary: getItinerary,
};

export default MapboxService;
