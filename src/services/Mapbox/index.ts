import { MapRoutingProvider } from "@/services/core/interface";
import findNearestDestination from "@/services/Mapbox/findNearestDestination";
import getIsochrone from "@/services/Mapbox/getIsochrone";
import getItinerary from "@/services/Mapbox/getItinerary";

const MapboxService: MapRoutingProvider = {
  findNearest: findNearestDestination,
  getIsochrone: getIsochrone,
  getItinerary: getItinerary,
};

export default MapboxService;
