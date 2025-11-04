import type { Feature, Geometry, LineString, MultiLineString, Position } from "geojson";
import type { ReactNode } from "react";
import { Marker } from "react-map-gl";

const isLineGeometry = (geom: Geometry | null | undefined): geom is LineString | MultiLineString => {
  return geom?.type === "LineString" || geom?.type === "MultiLineString";
};

const getMidpointOnLine = (coords: Position[] | Position[][]): [number, number] => {
  let flat: Position[];

  // MultiLineString → flatten (take longest segment)
  if (Array.isArray(coords[0][0])) {
    const multi = coords as Position[][];
    flat = multi.reduce((longest, current) => (current.length > longest.length ? current : longest));
  } else {
    flat = coords as Position[];
  }

  const midIndex = Math.floor(flat.length / 2);
  return [flat[midIndex][0], flat[midIndex][1]];
};

const LineLabel = ({ route, children }: { route?: Feature | null; children: ReactNode }) => {
  if (!(route && children)) {
    return null;
  }

  const geom = route.geometry;

  if (!isLineGeometry(geom)) {
    return null;
  }

  const coords = geom.coordinates;
  const [lng, lat] = getMidpointOnLine(coords);

  return (
    <Marker longitude={lng} latitude={lat}>
      {children}
    </Marker>
  );
};

export default LineLabel;
