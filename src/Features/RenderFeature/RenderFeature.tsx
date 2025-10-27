import { isArray } from "@tracktor/react-utils";
import type { Feature, FeatureCollection } from "geojson";
import { Layer, Source } from "react-map-gl";

const toFeatureCollection = (f: Feature | Feature[] | FeatureCollection): FeatureCollection => {
  if (isArray(f)) {
    return { features: f, type: "FeatureCollection" };
  }
  if (f.type === "FeatureCollection") {
    return f;
  }
  return { features: [f], type: "FeatureCollection" };
};

interface RenderFeaturesProps {
  features?: Feature | Feature[] | FeatureCollection;
}

const RenderFeatures = ({ features }: RenderFeaturesProps) => {
  if (!features) {
    return null;
  }

  const featureCollection = toFeatureCollection(features);

  const polygons = featureCollection.features.filter((f) => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon");
  const lines = featureCollection.features.filter((f) => f.geometry.type === "LineString" || f.geometry.type === "MultiLineString");

  return (
    <>
      {polygons.length > 0 && (
        // biome-ignore lint/correctness/useUniqueElementIds: <id must be consistent for map layers>
        <Source id="features-polygon" type="geojson" data={{ features: polygons, type: "FeatureCollection" }}>
          {/** biome-ignore lint/correctness/useUniqueElementIds: <id must be consistent for map layers> */}
          <Layer
            id="polygon-fill"
            type="fill"
            paint={{
              "fill-color": ["coalesce", ["get", "color"], "#4ADE80"],
              "fill-opacity": 0.4,
            }}
          />
        </Source>
      )}

      {lines.length > 0 && (
        // biome-ignore lint/correctness/useUniqueElementIds: <id must be consistent for map layers>
        <Source id="features-line" type="geojson" data={{ features: lines, type: "FeatureCollection" }}>
          {/** biome-ignore lint/correctness/useUniqueElementIds: <id must be consistent for map layers> */}
          <Layer
            id="line-stroke"
            type="line"
            paint={{
              "line-color": ["coalesce", ["get", "color"], "#3B82F6"],
              "line-opacity": 0.9,
              "line-width": 3,
            }}
          />
        </Source>
      )}
    </>
  );
};

export default RenderFeatures;
