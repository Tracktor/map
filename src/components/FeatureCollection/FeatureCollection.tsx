import { isArray } from "@tracktor/react-utils";
import type { Feature, FeatureCollection } from "geojson";
import { ReactNode } from "react";
import { Layer, Source } from "react-map-gl";
import LineLabel from "@/components/FeatureCollection/LineLabel.tsx";

export interface LineStyle {
  color?: string;
  width?: number;
  opacity?: number;
}

export interface RenderFeaturesProps {
  features?: Feature | Feature[] | FeatureCollection;
  lineLabel?: ReactNode;
  lineStyle?: LineStyle;
}

const toFeatureCollection = (f: Feature | Feature[] | FeatureCollection): FeatureCollection => {
  if (isArray(f)) {
    return { features: f, type: "FeatureCollection" };
  }
  if (f.type === "FeatureCollection") {
    return f;
  }
  return { features: [f], type: "FeatureCollection" };
};

const RenderFeatures = ({ features, lineLabel, lineStyle }: RenderFeaturesProps) => {
  if (!features) {
    return null;
  }

  const featureCollection = toFeatureCollection(features);

  const polygons = featureCollection.features.filter((f) => f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon");
  const lines = featureCollection.features.filter((f) => f.geometry.type === "LineString" || f.geometry.type === "MultiLineString");

  return (
    <>
      {polygons.length > 0 && (
        // biome-ignore lint/correctness/useUniqueElementIds: <ID must stay stable for map layer>
        <Source id="features-polygon" type="geojson" data={{ features: polygons, type: "FeatureCollection" }}>
          {/* biome-ignore lint/correctness/useUniqueElementIds: <ID must stay stable for map layer> */}
          <Layer
            id="polygon-fill"
            type="fill"
            paint={{
              "fill-color": ["coalesce", ["get", "color"], "#4ADE80"],
              "fill-opacity": ["coalesce", ["get", "opacity"], 0.4],
            }}
          />
        </Source>
      )}

      {lines.length > 0 && (
        <>
          {/* biome-ignore lint/correctness/useUniqueElementIds: <ID must stay stable for map layer> */}
          <Source id="features-line" type="geojson" data={{ features: lines, type: "FeatureCollection" }}>
            {/* biome-ignore lint/correctness/useUniqueElementIds: <ID must stay stable for map layer> */}
            <Layer
              id="line-stroke"
              type="line"
              paint={{
                "line-color": lineStyle?.color ?? ["coalesce", ["get", "color"], "#3B82F6"],
                "line-opacity": lineStyle?.opacity ?? ["coalesce", ["get", "opacity"], 0.9],
                "line-width": lineStyle?.width ?? ["coalesce", ["get", "width"], 3],
              }}
            />
          </Source>

          {lineLabel &&
            lines.map((line, idx) => (
              <LineLabel key={`label-${idx}`} route={line}>
                {lineLabel}
              </LineLabel>
            ))}
        </>
      )}
    </>
  );
};

export default RenderFeatures;
