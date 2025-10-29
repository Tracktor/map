import { MapRoutingProvider } from "@/services/core/interface.ts";
import findNearestDestination from "@/services/OSRM/findNearestDestination.ts";
import getItinerary from "@/services/OSRM/getItinerary";

const OSRMService: MapRoutingProvider = {
  findNearest: findNearestDestination,
  getItinerary: getItinerary,
};

export default OSRMService;
