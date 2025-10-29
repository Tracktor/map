import { getOSRMRoute } from "@/services/OSRM/route.ts";
import { findNearestWithOSRMTable } from "@/services/OSRM/table.ts";

const OSRMService = {
  findNearest: findNearestWithOSRMTable,
  getRoute: getOSRMRoute,
};

export default OSRMService;
