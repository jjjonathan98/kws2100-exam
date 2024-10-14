import { FeatureLike } from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { useState, useEffect } from "react";
import Text from "ol/style/Text";
import { unByKey } from "ol/Observable";
import Select from "ol/interaction/Select";
import { pointerMove } from "ol/events/condition";
import { map } from "../map/mapContext";
import Overlay from "ol/Overlay";
import Polygon from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";

// This is a type that extends the Feature type from OpenLayers. It adds a getProperties method that returns the properties of the feature.
// Such as the name of the emergency district.
type EmergencyDistrictFeature<T extends Feature<any>> = {
  getProperties(): EmergencyDistrictProperties;
} & T;
interface EmergencyDistrictProperties {
  navn: string;
}

// The function below is a style function that takes a feature and returns a style for that feature.
// The style is a blue stroke with a width of 2 and a green fill with an opacity of 0.2.
const EmergencyDistrictStyle = (f: FeatureLike) => {
  const feature = f as unknown as EmergencyDistrictFeature<Feature>;
  return new Style({
    stroke: new Stroke({
      color: "blue",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(0, 255, 0, 0.2)",
    }),
  });
};

// The same as above, but with a red stroke and a yellow/semi-transparent orange fill.
const activeEmergencyDistrictStyle = (f: FeatureLike) => {
  const feature = f as unknown as EmergencyDistrictFeature<Feature>;
  const emergencyDistrict = feature.getProperties();
  return new Style({
    stroke: new Stroke({
      color: "red",
      width: 2,
    }),
    fill: new Fill({
      color: "rgba(255, 165, 0, 0.5)",
    }),
    text: new Text({ text: emergencyDistrict.navn }),
  });
};

// The function below is a custom hook that returns a layer, a boolean, a function to set the boolean and the currently hovered feature.
// The layer is a vector layer that contains the emergency districts.
export function useEmergencyDistrictStyle() {
  const [layer, setLayer] = useState(new VectorLayer({}));
  const [active, setActive] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<
    EmergencyDistrictProperties | undefined
  >();
  const [select] = useState(new Select({ condition: pointerMove }));

  const [overlay] = useState(
    new Overlay({
      element: document.createElement("div"),
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -15],
    }),
  );

  useEffect(() => {
    const departmentLayer = new VectorLayer({
      className: "emergency-districts",
      source: new VectorSource({
        url: "/kws2100-exam-Atridox/emergencyDistrict.json",
        format: new GeoJSON(),
      }),
      style: active ? activeEmergencyDistrictStyle : EmergencyDistrictStyle,
    });

    // Here we have a change event that listens for when a feature is selected.
    const changeEventKey = select.on("select", (e) => {
      const selectedFeature = e.selected[0];
      if (selectedFeature && "navn" in selectedFeature.getProperties()) {
        setHoveredFeature(
          selectedFeature.getProperties() as EmergencyDistrictProperties,
        );
      } else {
        setHoveredFeature(undefined);
      }
    });

    // Here we add the select interaction to the map and set the layer to the departmentLayer.
    // We also add the overlay to the map.
    map.addInteraction(select);
    setLayer(departmentLayer);
    map.addOverlay(overlay);

    // This returns a function that removes the change event listener and the select interaction from the map.
    return () => {
      unByKey(changeEventKey);
      map.removeInteraction(select);
    };
  }, [active]);

  // The useEffect used here listens for when a feature is hovered. If a feature is hovered, the overlay is set to the feature's position.
  // It decides wether to show the name of the emergency district or not, based on the type of geometry the feature has.
  useEffect(() => {
    if (hoveredFeature) {
      const selectedFeature = select.getFeatures().item(0);
      if (selectedFeature) {
        const geometry = selectedFeature.getGeometry();
        if (geometry) {
          if (geometry instanceof Polygon) {
            const coordinate = geometry.getInteriorPoint().getCoordinates();
            overlay.setPosition(coordinate);
          } else {
            const lineStringGeometry = geometry as LineString;
            overlay.setPosition(lineStringGeometry.getFirstCoordinate());
          }
          const element = overlay.getElement() as HTMLElement;
          element.innerHTML = `<div style="background-color: black; color: white; padding: 5px; border: 1px solid black; border-radius: 10px;">${hoveredFeature.navn}</div>`;
        }
      }
    } else {
      overlay.setPosition(undefined);
    }
  }, [hoveredFeature]);

  return { layer, active, setActive, hoveredFeature };
}
