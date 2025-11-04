import { Feature, LineString } from "geojson";
import route1 from "sandbox/examples/pre-compute/itinerary1.json";
import route2 from "sandbox/examples/pre-compute/itinerary2.json";
import { NearestResult } from "@/types/MapViewProps.ts";

const feature1 = route1 as Feature<LineString>;
const feature2 = route2 as Feature<LineString>;

const nearestPreCompute: NearestResult[] = [
  {
    distance: 144045.3,
    id: 10,
    point: [4.0317, 49.2583],
    routeFeature: feature1,
  },
  {
    distance: 219875,
    id: 1,
    point: [3.0573, 50.6292],
    routeFeature: feature2,
  },
  {
    distance: 315161.3,
    id: 11,
    point: [5.0415, 47.322],
  },
  {
    distance: 382430.3,
    id: 8,
    point: [-1.5536, 47.2184],
  },
  {
    distance: 422395.6,
    id: 12,
    point: [3.0833, 45.7833],
  },
  {
    distance: 465869.8,
    id: 4,
    point: [4.8357, 45.764],
  },
  {
    distance: 492374,
    id: 9,
    point: [7.7521, 48.5734],
  },
  {
    distance: 584793,
    id: 3,
    point: [-0.5792, 44.8378],
  },
  {
    distance: 679335.1,
    id: 5,
    point: [1.4442, 43.6047],
  },
  {
    distance: 749832.9,
    id: 6,
    point: [3.8767, 43.6108],
  },
  {
    distance: 774530.8,
    id: 2,
    point: [5.375, 43.2965],
  },
  {
    distance: 932657.6,
    id: 7,
    point: [7.262, 43.7102],
  },
];

export default nearestPreCompute;
