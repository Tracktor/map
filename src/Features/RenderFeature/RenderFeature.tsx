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

  return (
    <Source type="geojson" data={featureCollection}>
      <Layer
        type="fill"
        filter={["in", "$type", "Polygon", "MultiPolygon"]}
        paint={{
          "fill-color": "#4ADE80", // 💚 green
          "fill-opacity": 0.3,
        }}
      />

      <Layer
        type="line"
        filter={["in", "$type", "LineString", "MultiLineString"]}
        paint={{
          "line-color": "#3B82F6", // 💙 blue
          "line-opacity": 0.9,
          "line-width": 3,
        }}
        layout={{
          "line-cap": "round",
          "line-join": "round",
        }}
      />

      <Layer
        type="circle"
        filter={["in", "$type", "Point", "MultiPoint"]}
        paint={{
          "circle-color": "#F97316",
          "circle-radius": 6,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        }}
      />
    </Source>
  );
};

export default RenderFeatures;
