import { getMapboxRoute } from "@/services/Mapbox/route.ts";
import { findNearestWithMapboxMatrix } from "@/services/Mapbox/table.ts";

const MapboxService = {
  findNearest: findNearestWithMapboxMatrix,
  getRoute: getMapboxRoute,
};

export default MapboxService;
