import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";

export type EmergencyCallCentersLayer = VectorLayer<
  VectorSource<EmergencyCallCentersFeature>
>;

export type EmergencyCallCentersFeature = {
  getProperties(): EmergencyCallCentersProperties;
} & Feature<Point>;

export interface EmergencyCallCentersProperties {
  navn: string;
}

// This function creates a new EmergencyCallCentersFeature with the given properties and geometry.
// Also it sets the style of the feature to a red circle with a cyan border.
export const EmergencyCallCentersLayer = new VectorLayer({
  className: "emergency-call-centers-layer",
  source: new VectorSource({
    url: "/kws2100-exam-Atridox/emergencycallcenters.json",
    format: new GeoJSON(),
  }),
  style: new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "cyan", width: 1 }),
    }),
  }),
});
