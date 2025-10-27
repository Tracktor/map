export type BaseMapView = "street" | "satellite";

const BASEMAP = {
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  street: {
    dark: "mapbox://styles/mapbox/dark-v11",
    light: "mapbox://styles/mapbox/streets-v12",
  },
} as const;

export default BASEMAP;
