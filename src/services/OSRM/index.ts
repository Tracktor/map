import { MapRoutingProvider } from "@/services/core/interface";
import findNearestDestination from "@/services/OSRM/findNearestDestination";
import getItinerary from "@/services/OSRM/getItinerary";

const OSRMService: MapRoutingProvider = {
  findNearest: findNearestDestination,
  getItinerary: getItinerary,
};

export default OSRMService;
