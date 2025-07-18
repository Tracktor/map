type Coordinates = [number, number];

interface GeometryPoint {
  type: string;
  coordinates: Coordinates;
}

interface FeatureProperties {
  id: string | number;
  [key: string]: unknown;
}

export interface ClickedFeature {
  geometry: GeometryPoint;
  properties: FeatureProperties;
  [key: string]: unknown;
}

/**
 * Type guard to check if the given geometry is a valid GeoJSON Point geometry
 * @param geometry
 */
export const isFeatureGeometry = (geometry: unknown): geometry is GeometryPoint =>
  typeof geometry === "object" && geometry !== null && "type" in geometry && "coordinates" in geometry;

/**
 * Type guard to check if the given feature is a ClickedFeature
 * @param feature
 */
export const isClickedFeature = (feature: unknown): feature is ClickedFeature => {
  if (typeof feature !== "object" || feature === null) {
    return false;
  }

  const hasGeometryAndProperties = "geometry" in feature && "properties" in feature;

  if (!hasGeometryAndProperties) {
    return false;
  }

  const { geometry } = feature;

  if (typeof geometry !== "object" || geometry === null) {
    return false;
  }

  if (!("coordinates" in geometry)) {
    return false;
  }

  const { coordinates } = geometry;

  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }

  if (!isFeatureGeometry(geometry)) {
    return false;
  }

  const { properties } = feature;

  if (typeof properties !== "object" || properties === null) {
    return false;
  }

  return "id" in properties && properties.id !== undefined;
};
