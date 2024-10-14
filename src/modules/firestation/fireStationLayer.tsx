import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle } from "ol/style";

// This file is a module that exports a fireStationLayer constant and types that are used to define a layer for fire stations on the map.
// The fireStationLayer constant is a VectorLayer that contains a VectorSource with a GeoJSON format that loads the fireStation.json file.
export type fireStationLayer = VectorLayer<VectorSource<FireStationFeature>>;

export type FireStationFeature = {
  getProperties(): FireStationProperties;
} & Feature<Point>;

export interface FireStationProperties {
  objtype: "Brannstasjon";
  brannstasj: string;
}

export const fireStationLayer = new VectorLayer({
  className: "firestation",
  source: new VectorSource({
    url: "/kws2100-exam-Atridox/fireStation.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: "blue" }),
      stroke: new Stroke({ color: "cyan", width: 1 }),
    }),
  }),
});
